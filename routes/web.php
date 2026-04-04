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


    Route::resource('rsvps', RSVPEventController::class);
    Route::patch('/rsvps/{id}/status', [RSVPEventController::class, 'updateStatus']);
    Route::get('rsvps/export/pdf', [RSVPEventController::class, 'exportPdf']);
});

require __DIR__ . '/settings.php';
