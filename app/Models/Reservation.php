<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'room_id',
    'name',
    'contact',
    'email',
    'downpayment',
    'payment_type',
    'gcash_number',
    'check_in_date',
    'check_out_date',
    'status',
    'cancellation_action',
    'cancellation_notes',
    'cancelled_at',
])]
class Reservation extends Model
{
    protected function casts(): array
    {
        return [
            'downpayment' => 'decimal:2',
            'check_in_date' => 'date',
            'check_out_date' => 'date',
            'cancelled_at' => 'datetime',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
