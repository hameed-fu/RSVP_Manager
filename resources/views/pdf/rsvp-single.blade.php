<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>RSVP - {{ $rsvp->name }}</title>
    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            color: #1a1209;
            font-size: 11px;
            margin: 0;
            padding: 20px;
        }

        .header {
            text-align: center;
            padding-bottom: 15px;
            border-bottom: 2px solid #c9993a;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 20px;
            margin: 0;
            color: #1a1209;
        }

        .header .subtitle {
            font-size: 9px;
            color: #999;
            margin-top: 4px;
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 10px;
            font-size: 9px;
            font-weight: bold;
            color: #fff;
        }

        .badge-confirmed { background: #16a34a; }
        .badge-pending { background: #f59e0b; }
        .badge-cancelled { background: #dc2626; }

        .section {
            margin-bottom: 16px;
        }

        .section-title {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.15em;
            color: #c9993a;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid #f0e0c0;
        }

        .info-grid {
            width: 100%;
        }

        .info-grid td {
            padding: 4px 8px;
            vertical-align: top;
        }

        .info-grid .label {
            color: #999;
            width: 100px;
            font-size: 10px;
        }

        .info-grid .value {
            font-weight: bold;
            font-size: 11px;
        }

        .ticket-code {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 6px;
            padding: 12px;
            background: #f5efe6;
            border-radius: 6px;
            margin: 8px 0;
        }

        .payment-row {
            display: flex;
            justify-content: space-between;
            padding: 4px 0;
        }

        .payment-row .lbl {
            color: #999;
            font-size: 10px;
        }

        .payment-row .val {
            font-weight: bold;
            font-size: 11px;
        }

        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 9px;
            color: #ccc;
            border-top: 1px solid #eee;
            padding-top: 8px;
        }
    </style>
</head>
<body>

    <div class="header">
        <h1>{{ config('app.name') }}</h1>
        <div class="subtitle">RSVP Ticket / Invoice</div>
        <div style="margin-top: 6px;">
            <span class="badge badge-{{ $rsvp->status }}">
                {{ ucfirst($rsvp->status) }}
            </span>
        </div>
    </div>

    @if($rsvp->ticket_code)
        <div class="ticket-code">{{ $rsvp->ticket_code }}</div>
    @endif

    <div class="section">
        <div class="section-title">Personal Information</div>
        <table class="info-grid">
            <tr>
                <td class="label">Name</td>
                <td class="value">{{ $rsvp->name }}</td>
            </tr>
            <tr>
                <td class="label">Email</td>
                <td class="value">{{ $rsvp->email }}</td>
            </tr>
            <tr>
                <td class="label">Phone</td>
                <td class="value">{{ $rsvp->phone ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Address</td>
                <td class="value">{{ $rsvp->address ?? 'N/A' }}</td>
            </tr>
            <tr>
                <td class="label">Guests</td>
                <td class="value">{{ $rsvp->guests_count }}</td>
            </tr>
        </table>
    </div>

    <div class="section">
        <div class="section-title">Payment Details</div>
        @if($rsvp->payment)
            <table class="info-grid">
                <tr>
                    <td class="label">Provider</td>
                    <td class="value">{{ ucfirst($rsvp->payment->provider) }}</td>
                </tr>
                <tr>
                    <td class="label">Amount</td>
                    <td class="value">${{ number_format($rsvp->payment->amount, 2) }}</td>
                </tr>
                <tr>
                    <td class="label">Status</td>
                    <td class="value">{{ ucfirst($rsvp->payment->status) }}</td>
                </tr>
                <tr>
                    <td class="label">Date</td>
                    <td class="value">{{ $rsvp->payment->created_at->format('M d, Y H:i') }}</td>
                </tr>
            </table>
        @else
            <p style="color: #999; text-align: center;">No payment recorded</p>
        @endif
    </div>

    <div class="footer">
        Generated on {{ now()->format('F d, Y \a\t H:i') }} &bull; {{ config('app.name') }}
    </div>

</body>
</html>
