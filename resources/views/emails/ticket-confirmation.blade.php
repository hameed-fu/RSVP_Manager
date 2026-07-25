<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; padding: 20px 0; border-bottom: 2px solid #c9993a; }
        .header h1 { color: #1a1209; }
        .content { padding: 20px 0; }
        .ticket-code { font-size: 24px; font-weight: bold; text-align: center; padding: 15px; background: #f5efe6; border-radius: 8px; letter-spacing: 4px; margin: 20px 0; }
        .details { background: #faf6ee; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .details p { margin: 5px 0; }
        .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Ticket Confirmed</h1>
        </div>
        <div class="content">
            <p>Hi <strong>{{ $rsvp->name }}</strong>,</p>
            <p>Your ticket has been confirmed. Here are your details:</p>

            <div class="ticket-code">{{ $rsvp->ticket_code }}</div>

            <div class="details">
                <p><strong>Name:</strong> {{ $rsvp->name }}</p>
                <p><strong>Email:</strong> {{ $rsvp->email }}</p>
                <p><strong>Guests:</strong> {{ $rsvp->guests_count }}</p>
                <p><strong>Status:</strong> Confirmed</p>
            </div>

            <p>Please save your ticket code above — you'll need it for entry.</p>
            <p>We look forward to seeing you!</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
