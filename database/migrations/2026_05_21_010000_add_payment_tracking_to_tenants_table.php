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
            $table->decimal('billing_paid_amount', 10, 2)->default(0)->after('billing_water');
            $table->string('billing_payment_method', 20)->nullable()->after('billing_paid_amount');
            $table->string('billing_receipt_path')->nullable()->after('billing_payment_method');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'billing_paid_amount',
                'billing_payment_method',
                'billing_receipt_path',
            ]);
        });
    }
};