<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>RSVP Report</title>

    <style>
        body {
            font-family: DejaVu Sans, sans-serif;
            font-size: 10px;
            color: #333;
        }

        h2 {
            text-align: center;
            margin-bottom: 4px;
            font-size: 16px;
        }

        .subtitle {
            text-align: center;
            font-size: 9px;
            margin-bottom: 10px;
            color: #666;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;  
        }

        th {
            background: #C9993A;
            color: #fff;
            padding: 6px;
            font-size: 9px;
        }

        td {
            padding: 5px;
            border-bottom: 1px solid #ddd;
            font-size: 9px;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }

        tr:nth-child(even) {
            background: #f9fafb;
        }

        /* ✅ Column widths */
        .col-ticket { width: 14%; }
        .col-name { width: 14%; }
        .col-phone { width: 12%; }
        .col-email { width: 18%; }
        .col-guests { width: 8%; text-align: left; }
        .col-payment { width: 16%; }
        .col-status { width: 10%; text-align: left; }
        .col-index { width: 5%; text-align: left;}

        .status {
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 8px;
            color: #fff;
            display: inline-block;
        }

        .confirmed { background: #16a34a; }
        .pending { background: #f59e0b; }
        .cancelled { background: #dc2626; }

        .footer {
            margin-top: 10px;
            font-size: 9px;
            text-align: right;
            color: #666;
        }
    </style>
</head>

<body>

<h2>RSVP Report</h2>

<div class="subtitle">
    Generated on: {{ now()->format('d M Y H:i') }}
</div>

<table>
    <thead>
        <tr>
            <th  class="col-index">#</th>
            <th class="col-name">Name</th>
            <th class="col-phone">Phone</th>
            <th class="col-email">Email</th>
            <th class="col-guests">Guests</th> 
            <th class="col-guests">School</th> 
            <th class="col-status">Status</th>
        </tr>
    </thead>

    <tbody>
        @forelse($rsvps as $key => $rsvp)
            <tr> 
                <td  class="col-index">{{ $key + 1 }}</td>
                <td class="col-name">{{ $rsvp->name }}</td>
                <td class="col-phone">{{ $rsvp->phone }}</td>
                <td class="col-email">{{ $rsvp->email }}</td>
                <td class="col-guests">{{ $rsvp->guests_count }}</td>
                <td class="col-guests">{{ $rsvp->school_choice }}</td>
                {{-- <td class="col-payment">
                    {{ $rsvp->payment->provider ?? '-' }}<br>
                    {{ $rsvp->payment->amount ?? '' }}
                </td> --}}
                <td class="col-status">
                    <span class="status {{ $rsvp->status }}">
                        {{ ucfirst($rsvp->status) }}
                    </span>
                </td>
            </tr>
        @empty
            <tr>
                <td colspan="7" style="text-align:center;">No records found</td>
            </tr>
        @endforelse
    </tbody>
</table>

<div class="footer">
    Total Records: {{ $rsvps->count() }}
</div>

</body>
</html>