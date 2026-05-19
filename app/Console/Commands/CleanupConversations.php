<?php

namespace App\Console\Commands;

use App\Models\Conversation;
use App\Models\Tenant;
use Illuminate\Console\Command;

class CleanupConversations extends Command
{
    protected $signature = 'conversations:cleanup';
    protected $description = 'Remove conversations for inactive or non-existent tenants';

    public function handle(): int
    {
        $today = now()->toDateString();
        
        // Get all active room numbers
        $activeRooms = Tenant::query()
            ->where(function ($query) use ($today) {
                $query->whereNull('check_out_date')
                    ->orWhereDate('check_out_date', '>=', $today);
            })
            ->whereNull('archived_at')
            ->with('room:id,number')
            ->get()
            ->mapWithKeys(function (Tenant $tenant) {
                return [$tenant->room?->number => true];
            })
            ->keys();

        // Delete conversations for rooms with no active tenants
        $deletedCount = Conversation::query()
            ->whereNotIn('room', $activeRooms)
            ->delete();

        $this->info("Deleted {$deletedCount} conversation(s) for inactive tenants.");
        
        return self::SUCCESS;
    }
}
