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
        Schema::table('tenants', function (Blueprint $table) {
            $table->decimal('downpayment', 10, 2)->default(0)->after('email');
            $table->string('payment_type')->default('cash')->after('downpayment');
            $table->string('gcash_number', 20)->nullable()->after('payment_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn(['downpayment', 'payment_type', 'gcash_number']);
        });
    }
};
