<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AdminBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_bookings(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/admin/bookings');

        $response->assertStatus(403);
    }

    public function test_admin_can_confirm_a_booking(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $bookingOwner = User::factory()->create();
        $resource = Resource::create(['name' => 'Teszt Terem']);

        $booking = Booking::create([
            'user_id' => $bookingOwner->id,
            'resource_id' => $resource->id,
            'start_time' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/bookings/{$booking->id}/confirm");

        $response->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'confirmed',
        ]);

        Mail::assertSent(\App\Mail\BookingStatusUpdated::class);
    }

    public function test_admin_can_reject_a_booking(): void
    {
        Mail::fake();

        $admin = User::factory()->create(['role' => 'admin']);
        $bookingOwner = User::factory()->create();
        $resource = Resource::create(['name' => 'Teszt Terem']);

        $booking = Booking::create([
            'user_id' => $bookingOwner->id,
            'resource_id' => $resource->id,
            'start_time' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        Sanctum::actingAs($admin);

        $response = $this->patchJson("/api/admin/bookings/{$booking->id}/reject");

        $response->assertStatus(200);

        $this->assertDatabaseHas('bookings', [
            'id' => $booking->id,
            'status' => 'cancelled',
        ]);
    }
}