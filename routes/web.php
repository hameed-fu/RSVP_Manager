<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RSVPEventController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\RsvpController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;


/* ================= HOME ================= */

Route::get('/', [RsvpController::class, 'index'])->name('home');

/* ================= RSVP ================= */
Route::post('/rsvp/store', [RsvpController::class, 'store'])->name('rsvp.store');

/* ================= STRIPE ================= */
Route::get('/payment/success', [RsvpController::class, 'paymentSuccess'])->name('payment.success');

Route::get('/payment/cancel', function () {
    return redirect('/')->with('error', 'Payment cancelled');
})->name('payment.cancel');

/* ================= PAYPAL ================= */
Route::post('/paypal/create-order', [RsvpController::class, 'createOrder']);
Route::post('/paypal/capture-order', [RsvpController::class, 'capturePaypalOrder']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard',  DashboardController::class)->name('dashboard');
    Route::get('/dashboard/export/csv', [DashboardController::class, 'exportCsv'])->name('dashboard.export.csv');



    Route::resource('rsvps', RSVPEventController::class);
    Route::patch('/rsvps/{id}/status', [RSVPEventController::class, 'updateStatus']);
    Route::get('rsvps/export/pdf', [RSVPEventController::class, 'exportPdf']);
    Route::get('rsvps/{id}/pdf', [RSVPEventController::class, 'downloadPdf'])->name('rsvps.pdf');
});

    Route::get('/test-email', function () {
        $adminEmail = env('ADMIN_EMAIL');
        if (!$adminEmail) {
            return redirect('/dashboard')->with('error', 'ADMIN_EMAIL is not set in .env');
        }
        config(['mail.mailers.smtp.timeout' => 15]);
        try {
            \Illuminate\Support\Facades\Mail::raw(
                'This is a test email from RSVP Manager — mail is working!',
                fn ($msg) => $msg->to($adminEmail)->subject('Mail Test - RSVP Manager')
            );
            dd('Test email sent to ' . $adminEmail);
            return redirect('/dashboard')->with('success', "Test email sent to {$adminEmail}");
        } catch (\Exception $e) {
            return redirect('/dashboard')->with('error', 'Mail error: ' . $e->getMessage());
        }
    })->name('test.email');

require __DIR__ . '/settings.php';
