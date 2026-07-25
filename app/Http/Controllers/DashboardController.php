<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $recents = Rsvp::latest()->take(50)->get();

        $totalRsvps = Rsvp::count();
        $totalGuests = Rsvp::sum('guests_count');
        $todayRsvps = Rsvp::whereDate('created_at', Carbon::today())->count();
        $yesterdayRsvps = Rsvp::whereDate('created_at', Carbon::yesterday())->count();
        $confirmedRsvps = Rsvp::where('status', 'confirmed')->count();

        $stats = [
            'total_rsvps' => $totalRsvps,
            'total_guests' => $totalGuests,
            'today_rsvps' => $todayRsvps,
            'confirmed_rsvps' => $confirmedRsvps,
        ];

        return inertia('dashboard', [
            'stats' => $stats,
            'recent' => $recents,
        ]);
    }

    public function exportCsv()
    {
        $rsvps = Rsvp::where('status', 'confirmed')
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'ticket-purchasers-' . now()->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($rsvps) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Name', 'Address', 'Phone', 'Email', 'Guests', 'Ticket Code', 'Purchased At']);

            foreach ($rsvps as $rsvp) {
                fputcsv($handle, [
                    $rsvp->name,
                    $rsvp->address ?? '',
                    $rsvp->phone ?? '',
                    $rsvp->email,
                    $rsvp->guests_count,
                    $rsvp->ticket_code,
                    $rsvp->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        };

        return response()->stream($callback, 200, $headers);
    }
}
