<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;

Route::get('/resources', [ResourceController::class, 'index']);


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/resources/{resource}/bookings', [ResourceController::class, 'bookings']);

    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::patch('/bookings/{booking}/cancel', [BookingController::class, 'cancel']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/bookings', [BookingController::class, 'adminIndex']);
    Route::patch('/admin/bookings/{booking}/confirm', [BookingController::class, 'confirm']);
    Route::patch('/admin/bookings/{booking}/reject', [BookingController::class, 'reject']);
});