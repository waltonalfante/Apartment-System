<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('billing_status')->default('Pending')->after('gcash_number');
            $table->date('billing_due_date')->nullable()->after('billing_status');
            $table->string('billing_month_year')->nullable()->after('billing_due_date');
            $table->decimal('billing_electricity', 10, 2)->default(0)->after('billing_month_year');
            $table->decimal('billing_water', 10, 2)->default(0)->after('billing_electricity');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropColumn([
                'billing_status',
                'billing_due_date',
                'billing_month_year',
                'billing_electricity',
                'billing_water',
            ]);
        });
    }
};
