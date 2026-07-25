<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreRsvpRequest;
use App\Mail\AdminTicketNotification;
use App\Mail\TicketConfirmation;
use App\Models\Payment;
use App\Models\Rsvp;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RsvpController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'canRegister' => false,
        ]);
    }

    public function store(StoreRsvpRequest $request)
    {
        $data = $request->validated();
        $pricePerGuest = (int) env('PRICE_PER_GUEST', 10);

        $guests = max(1, (int) ($data['guests_count'] ?? 1));
        $amount = $guests * $pricePerGuest;

        $data['guests_count'] = $guests;

        $rsvp = Rsvp::create($data);

        if (($data['payment_type'] ?? '') === 'later') {
            $rsvp->update([
                'ticket_code' => $this->generateTicketCode(),
            ]);

            $this->sendEmails($rsvp);

            return response()->json([
                'type' => 'success',
                'data' => ['ticket_code' => $rsvp->ticket_code],
            ]);
        }

        if (($data['payment_type'] ?? '') === 'stripe') {
            $res = $this->initiateStripePayment($rsvp, $amount);

            return response()->json([
                'type' => 'stripe',
                'data' => ['checkout_url' => $res->getData()->checkout_url],
            ]);
        }

        if (($data['payment_type'] ?? '') === 'paypal') {
            return response()->json([
                'type' => 'paypal',
                'data' => [
                    'rsvp_id' => $rsvp->id,
                    'amount' => $amount,
                ],
            ]);
        }

        return response()->json(['error' => 'Invalid payment method'], 400);
    }

    public function initiateStripePayment($rsvp, $amount)
    {
        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment',
            'line_items' => [[
                'price_data' => [
                    'currency' => 'usd',
                    'product_data' => ['name' => 'Event Ticket'],
                    'unit_amount' => $amount * 100,
                ],
                'quantity' => 1,
            ]],
            'success_url' => route('payment.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'  => route('payment.cancel') . '?session_id={CHECKOUT_SESSION_ID}',
        ]);

        Payment::create([
            'rsvp_id'   => $rsvp->id,
            'provider'  => 'stripe',
            'payment_id' => $session->id,
            'amount'    => $amount,
            'status'    => 'pending',
        ]);

        return response()->json(['checkout_url' => $session->url]);
    }

    public function paymentSuccess(Request $request)
    {
        $sessionId = $request->get('session_id');

        if (!$sessionId) {
            return redirect('/')->with('error', 'Missing session ID.');
        }

        \Stripe\Stripe::setApiKey(config('services.stripe.secret'));

        try {
            $session = \Stripe\Checkout\Session::retrieve($sessionId);

            if ($session->payment_status !== 'paid') {
                return redirect('/')->with('error', 'Payment not completed.');
            }

            $payment = Payment::where('payment_id', $sessionId)->first();

            if (!$payment) {
                return redirect('/')->with('error', 'Payment record not found.');
            }

            $payment->update([
                'status' => 'paid',
                'response' => json_encode($session),
            ]);

            $rsvp = $payment->rsvp;

            $rsvp->update([
                'status' => 'confirmed',
                'ticket_code' => $this->generateTicketCode(),
            ]);

            $this->sendEmails($rsvp);

            return redirect('/')->with([
                'success' => 'Payment successful!',
                'ticket' => [
                    'ticket_code' => $rsvp->ticket_code,
                ],
            ]);
        } catch (\Exception $e) {
            return redirect('/')->with('error', 'Payment verification failed.');
        }
    }

    public function createOrder(Request $request)
    {
        try {
            $rsvp = Rsvp::findOrFail($request->rsvp_id);

            $client = $this->paypalClient();

            $req = new \PayPalCheckoutSdk\Orders\OrdersCreateRequest();
            $req->prefer('return=representation');

            $amount = $rsvp->guests_count * (int) env('PRICE_PER_GUEST', 10);

            $req->body = [
                "intent" => "CAPTURE",
                "purchase_units" => [[
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => number_format($amount, 2, '.', ''),
                    ],
                ]],
            ];

            $response = $client->execute($req);

            Payment::create([
                'rsvp_id'   => $rsvp->id,
                'provider'  => 'paypal',
                'payment_id' => $response->result->id,
                'amount'    => $amount,
                'status'    => 'pending',
            ]);

            return response()->json([
                'orderID' => $response->result->id,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function capturePaypalOrder(Request $request)
    {
        $orderId = $request->orderID;

        $client = $this->paypalClient();

        $req = new \PayPalCheckoutSdk\Orders\OrdersCaptureRequest($orderId);
        $req->prefer('return=representation');

        $response = $client->execute($req);

        $payment = Payment::where('payment_id', $orderId)->first();

        if (!$payment) {
            return response()->json(['success' => false]);
        }

        $payment->update([
            'status' => 'paid',
            'response' => json_encode($response),
        ]);

        $rsvp = $payment->rsvp;

        $rsvp->update([
            'status' => 'confirmed',
            'ticket_code' => $this->generateTicketCode(),
        ]);

        $this->sendEmails($rsvp);

        return response()->json([
            'success' => true,
            'ticket' => [
                'ticket_code' => $rsvp->ticket_code,
                'name' => $rsvp->name,
                'guests_count' => $rsvp->guests_count,
            ],
        ]);
    }

    private function sendEmails(Rsvp $rsvp): void
    {
        Mail::to($rsvp->email)->send(new TicketConfirmation($rsvp));

        $adminEmail = env('ADMIN_EMAIL');
        if ($adminEmail) {
            Mail::to($adminEmail)->send(new AdminTicketNotification($rsvp));
        }
    }

    public function paypalClient()
    {
        $environment = new \PayPalCheckoutSdk\Core\SandboxEnvironment(
            config('paypal.paypal.client_id'),
            config('paypal.paypal.secret')
        );

        return new \PayPalCheckoutSdk\Core\PayPalHttpClient($environment);
    }

    private function generateTicketCode()
    {
        do {
            $code = strtoupper(Str::random(4) . '-' . Str::random(4));
        } while (Rsvp::where('ticket_code', $code)->exists());

        return $code;
    }
}
