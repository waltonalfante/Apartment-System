<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('kitchen_photo')->nullable()->after('photo_path');
            $table->string('room_photo')->nullable()->after('kitchen_photo');
            $table->string('cr_photo')->nullable()->after('room_photo');
            $table->string('bed_photo')->nullable()->after('cr_photo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn(['kitchen_photo', 'room_photo', 'cr_photo', 'bed_photo']);
        });
    }
};
