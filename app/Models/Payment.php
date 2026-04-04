<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'rsvp_id',
        'provider',
        'payment_id',
        'amount',
        'status',
        'response',
    ];

    public function rsvp()
    {
        return $this->belongsTo(Rsvp::class);
    }
}
