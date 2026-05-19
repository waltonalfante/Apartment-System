<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MaintenanceReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'tenant_id',
        'tenant_name',
        'room_code',
        'repair',
        'start_date',
        'price',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
    ];
}
