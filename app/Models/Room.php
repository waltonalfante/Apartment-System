<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['number', 'occupied'])]
class Room extends Model
{
    protected function casts(): array
    {
        return [
            'occupied' => 'boolean',
        ];
    }

    public function reservation(): HasOne
    {
        return $this->hasOne(Reservation::class);
    }

    public function tenant(): HasOne
    {
        return $this->hasOne(Tenant::class);
    }
}
