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
        .details { background: #faf6ee; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .details p { margin: 5px 0; }
        .badge { display: inline-block; padding: 4px 8px; background: #16a34a; color: #fff; border-radius: 4px; font-size: 12px; }
        .footer { text-align: center; padding: 20px 0; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Ticket Purchase</h1>
        </div>
        <div class="content">
            <p>A new ticket has been purchased:</p>

            <div class="details">
                <p><strong>Name:</strong> {{ $rsvp->name }}</p>
                <p><strong>Email:</strong> {{ $rsvp->email }}</p>
                <p><strong>Phone:</strong> {{ $rsvp->phone ?? 'N/A' }}</p>
                <p><strong>Address:</strong> {{ $rsvp->address ?? 'N/A' }}</p>
                <p><strong>Guests:</strong> {{ $rsvp->guests_count }}</p>
                <p><strong>Ticket Code:</strong> {{ $rsvp->ticket_code }}</p>
                <p><strong>Status:</strong> <span class="badge">{{ ucfirst($rsvp->status) }}</span></p>
            </div>

            <p><a href="{{ url('/dashboard') }}">View in Dashboard</a></p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
