<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Resource extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'iamge_url',
        'name_en',
        'name_de',
        'description_en',
        'description_de',
        'category',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
