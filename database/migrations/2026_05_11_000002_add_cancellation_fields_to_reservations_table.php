<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('cancellation_action')->nullable()->after('status');
            $table->text('cancellation_notes')->nullable()->after('cancellation_action');
            $table->timestamp('cancelled_at')->nullable()->after('cancellation_notes');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['cancellation_action', 'cancellation_notes', 'cancelled_at']);
        });
    }
};
