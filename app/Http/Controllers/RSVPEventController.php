<?php

namespace App\Http\Controllers;

use App\Models\Rsvp;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class RSVPEventController extends Controller
{
    /* ================= INDEX ================= */
    public function index(Request $request)
    {
        $query = Rsvp::with('payment');

         
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        
        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $recents = $query->latest()->paginate(10)->withQueryString();

        
        $totalRsvps = Rsvp::count();
        $totalGuests = Rsvp::sum('guests_count');
        $todayRsvps = Rsvp::whereDate('created_at', Carbon::today())->count();
        $confirmedRsvps = Rsvp::where('status', 'confirmed')->count();



        return inertia('events/index', [
            'stats' => [
                'total_rsvps' => $totalRsvps,
                'total_guests' => $totalGuests,
                'today_rsvps' => $todayRsvps,
                'confirmed_rsvps' => $confirmedRsvps,
            ],
            'recent' => $recents,
            'filters' => $request->only('search', 'status', 'from', 'to')
        ]);
    }

    /* ================= STORE ================= */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'required|email|unique:rsvps,email',
            'guests_count' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,declined',
            'message' => 'nullable|string',
        ]);

        Rsvp::create($validated);

        return redirect()->route('rsvps.index')->with('success', 'Success!');
    }



    /* ================= UPDATE ================= */
    public function update(Request $request, $id)
    {
        $rsvp = Rsvp::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required',
            'phone' => 'required',
            'email' => "required|email|unique:rsvps,email,$id",
            'guests_count' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,declined',
        ]);

        $rsvp->update($validated);

        return redirect()->route('rsvps.index')->with('success', 'Updated successfully!');
    }

    public function destroy($id)
    {
        Rsvp::findOrFail($id)->delete();

        return redirect()->route('rsvps.index')->with('success', 'Deleted successfully');
    }



    public function updateStatus(Request $request, $id)
    {
        $rsvp = Rsvp::findOrFail($id);

        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        $rsvp->update([
            'status' => $request->status
        ]);

        return back()->with('success', 'Status updated');
    }

    /* ================= EXPORT PDF ================= */
    public function exportPdf(Request $request)
    {
        $query = Rsvp::with('payment');

      
        if ($request->filled('search')) {
            $search = $request->search;

            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('phone', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }


        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }


        if ($request->filled('from')) {
            $query->whereDate('created_at', '>=', $request->from);
        }

        if ($request->filled('to')) {
            $query->whereDate('created_at', '<=', $request->to);
        }

        $rsvps = $query->latest()->get();
    
        $pdf = Pdf::loadView('pdf.rsvps', [
            'rsvps' => $rsvps,
            'filters' => $request->all()
        ])->setPaper('a4', 'portrait');

        return $pdf->download('rsvps.pdf');
    }
}
