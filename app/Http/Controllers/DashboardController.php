<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        // Latest RSVPs
        $recents = Rsvp::latest()->take(50)->get();

        // Basic counts
        $totalRsvps = Rsvp::count();

        // Total guests (sum of guests_count column)
        $totalGuests = Rsvp::sum('guests_count');

        // Today's RSVPs
        $todayRsvps = Rsvp::whereDate('created_at', Carbon::today())->count();

        // Yesterday RSVPs (for growth calculation)
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
            'recent' => $recents
        ]);
    }
}
