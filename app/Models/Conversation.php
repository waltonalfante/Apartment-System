<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'room', 'message', 'time', 'unread'])]
class Conversation extends Model
{
    protected function casts(): array
    {
        return [
            'unread' => 'boolean',
        ];
    }
}
