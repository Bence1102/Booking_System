<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Resource;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_booking(): void
    {
        Mail::fake();

        $user = User::factory()->create();
        $resource = Resource::create(['name' => 'Teszt Terem']);

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/bookings', [
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->toDateTimeString(),
            'end_time' => now()->addDay()->addHour()->toDateTimeString(),
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->id,
            'resource_id' => $resource->id,
            'status' => 'pending',
        ]);

        Mail::assertSent(\App\Mail\BookingConfirmation::class);
    }

    public function test_guest_cannot_create_booking(): void
    {
        $resource = Resource::create(['name' => 'Teszt Terem']);

        $response = $this->postJson('/api/bookings', [
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->toDateTimeString(),
            'end_time' => now()->addDay()->addHour()->toDateTimeString(),
        ]);

        $response->assertStatus(401);
    }

    public function test_overlapping_booking_is_rejected(): void
    {
        Mail::fake();

        $resource = Resource::create(['name' => 'Teszt Terem']);
        $existingUser = User::factory()->create();

        Booking::create([
            'user_id' => $existingUser->id,
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->setTime(10, 0),
            'end_time' => now()->addDay()->setTime(12, 0),
            'status' => 'pending',
        ]);

        $newUser = User::factory()->create();
        Sanctum::actingAs($newUser);

        $response = $this->postJson('/api/bookings', [
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->setTime(11, 0)->toDateTimeString(),
            'end_time' => now()->addDay()->setTime(13, 0)->toDateTimeString(),
        ]);

        $response->assertStatus(409);
    }

    public function test_non_overlapping_booking_on_same_resource_is_allowed(): void
    {
        Mail::fake();

        $resource = Resource::create(['name' => 'Teszt Terem']);
        $existingUser = User::factory()->create();

        Booking::create([
            'user_id' => $existingUser->id,
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->setTime(10, 0),
            'end_time' => now()->addDay()->setTime(12, 0),
            'status' => 'pending',
        ]);

        $newUser = User::factory()->create();
        Sanctum::actingAs($newUser);

        $response = $this->postJson('/api/bookings', [
            'resource_id' => $resource->id,
            'start_time' => now()->addDay()->setTime(13, 0)->toDateTimeString(),
            'end_time' => now()->addDay()->setTime(14, 0)->toDateTimeString(),
        ]);

        $response->assertStatus(201);
    }

    public function test_user_cannot_cancel_another_users_booking(): void
    {
        $owner = User::factory()->create();
        $otherUser = User::factory()->create();
        $resource = Resource::create(['name' => 'Teszt Terem']);

        $booking = Booking::create([
            'user_id' => $owner->id,
            'resource_id' => $resource->id,
            'start_time' => now()->addDay(),
            'end_time' => now()->addDay()->addHour(),
            'status' => 'pending',
        ]);

        Sanctum::actingAs($otherUser);

        $response = $this->patchJson("/api/bookings/{$booking->id}/cancel");

        $response->assertStatus(403);
    }
}