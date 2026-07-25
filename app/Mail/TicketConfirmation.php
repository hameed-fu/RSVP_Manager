<?php

namespace App\Mail;

use App\Models\Rsvp;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public Rsvp $rsvp;

    public function __construct(Rsvp $rsvp)
    {
        $this->rsvp = $rsvp;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Ticket Confirmation - RSVP Manager',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket-confirmation',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
