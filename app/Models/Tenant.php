<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'room_id',
    'name',
    'gender',
    'contact',
    'optional_contact',
    'email',
    'downpayment',
    'payment_type',
    'gcash_number',
    'billing_status',
    'billing_due_date',
    'billing_month_year',
    'billing_electricity',
    'billing_water',
    'billing_paid_amount',
    'billing_payment_method',
    'billing_receipt_path',
    'account_credit',
    'check_in_date',
    'check_out_date',
    'archived_at',
])]
class Tenant extends Model
{
    protected function casts(): array
    {
        return [
            'downpayment' => 'decimal:2',
            'billing_due_date' => 'date',
            'billing_electricity' => 'decimal:2',
            'billing_water' => 'decimal:2',
            'billing_paid_amount' => 'decimal:2',
            'account_credit' => 'decimal:2',
            'check_in_date' => 'date',
            'check_out_date' => 'date',
            'archived_at' => 'datetime',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }
}
