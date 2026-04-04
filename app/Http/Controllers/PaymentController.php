<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
     public function createOrder(Request $request)
{
    try {
        $rsvp = Rsvp::findOrFail($request->rsvp_id);
        $client = new RsvpController();
        $client = $client->paypalClient();

        $req = new \PayPalCheckoutSdk\Orders\OrdersCreateRequest();
        $req->prefer('return=representation');

        $req->body = [
            "intent" => "CAPTURE",
            "purchase_units" => [[
                "amount" => [
                    "currency_code" => "USD",
                    "value" => number_format((float)$rsvp->amount, 2, '.', '') 
                ]
            ]]
        ];

        $response = $client->execute($req);

        return response()->json([
            'orderID' => $response->result->id
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage() // 👈 SEE REAL ERROR
        ], 500);
    }
}
}
