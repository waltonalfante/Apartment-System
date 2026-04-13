<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['number', 'occupied'])]
class Room extends Model
{
    protected function casts(): array
    {
        return [
            'occupied' => 'boolean',
        ];
    }
}
