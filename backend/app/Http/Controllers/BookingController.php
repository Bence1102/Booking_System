<?php

namespace App\Http\Controllers;

use App\Mail\BookingConfirmation;
use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class BookingController
{
    public function index(Request $request)
    {
        return $request->user()->bookings()->with('resource')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resource_id' => 'required|exists:resources,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $overlapping = Booking::where('resource_id', $request->resource_id)
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($request) {
                $query->whereBetween('start_time', [$request->start_time, $request->end_time])
                    ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('start_time', '<=', $request->start_time)
                          ->where('end_time', '>=', $request->end_time);
                    });
            })
            ->exists();

        if ($overlapping) {
            return response()->json([
                'message' => 'Ez az időpont már foglalt erre az erőforrásra.',
            ], 409);
        }

        $booking = Booking::create([
            'user_id' => $request->user()->id,
            'resource_id' => $request->resource_id,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'status' => 'pending',
        ]);

        Mail::to($booking->user->email)->send(new BookingConfirmation($booking->load(['user', 'resource'])));
        $booking->update(['email_sent' => true]);

        return response()->json($booking->load('resource'), 201);
    }

    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Nincs jogosultságod ehhez.'], 403);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json($booking);
    }

    public function adminIndex()
    {
        return Booking::with(['resource', 'user'])->orderBy('created_at', 'desc')->get();
    }

    public function confirm(Booking $booking)
    {
        $booking->update(['status' => 'confirmed']);
        $booking->load(['resource', 'user']);

        Mail::to($booking->user->email)->send(new BookingStatusUpdated($booking));

        return response()->json($booking);
    }

    public function reject(Booking $booking)
    {
        $booking->update(['status' => 'cancelled']);
        $booking->load(['resource', 'user']);

        Mail::to($booking->user->email)->send(new BookingStatusUpdated($booking));

        return response()->json($booking);
    }
}