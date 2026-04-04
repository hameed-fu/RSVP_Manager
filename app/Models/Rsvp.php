<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rsvp extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'guests_count',
        'message',
        'status',
        'payment_type',
        'ticket_code'
    ];

    protected $casts = [
        'guests_count' => 'integer',
    ];

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
