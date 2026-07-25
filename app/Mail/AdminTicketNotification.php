<?php

namespace App\Mail;

use App\Models\Rsvp;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminTicketNotification extends Mailable
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
            subject: 'New Ticket Purchase - ' . $this->rsvp->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-ticket-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
