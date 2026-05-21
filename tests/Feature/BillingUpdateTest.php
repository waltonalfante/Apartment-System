<?php

use App\Models\Room;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

test('billing update can mark a partial cash payment', function () {
    $room = Room::query()->create([
        'number' => 'Room 01',
        'occupied' => true,
    ]);

    $tenant = Tenant::query()->create([
        'room_id' => $room->id,
        'name' => 'Partial Tenant',
        'gender' => 'Male',
        'contact' => '09123456789',
        'optional_contact' => null,
        'email' => 'partial@example.com',
        'downpayment' => 0,
        'payment_type' => 'cash',
        'gcash_number' => null,
        'billing_status' => 'Pending',
        'billing_due_date' => now()->addDay(),
        'billing_month_year' => 'May 2026',
        'billing_electricity' => 500,
        'billing_water' => 500,
        'billing_paid_amount' => 0,
        'billing_payment_method' => null,
        'billing_receipt_path' => null,
        'check_in_date' => now()->toDateString(),
        'check_out_date' => null,
    ]);

    $response = $this->patch('/billing/tenants/'.$tenant->id, [
        'due_date' => now()->addDay()->toDateString(),
        'month_year' => 'May 2026',
        'electricity' => 500,
        'water' => 500,
        'amount_paid' => 3000,
        'payment_method' => 'cash',
    ]);

    $response->assertRedirect();

    $tenant->refresh();

    expect($tenant->billing_status)->toBe('Partial');
    expect((float) $tenant->billing_paid_amount)->toBe(3000.0);
    expect($tenant->billing_payment_method)->toBe('cash');
    expect($tenant->billing_receipt_path)->toBeNull();
});

test('billing update stores a gcash receipt image', function () {
    Storage::fake('public');

    $room = Room::query()->create([
        'number' => 'Room 02',
        'occupied' => true,
    ]);

    $tenant = Tenant::query()->create([
        'room_id' => $room->id,
        'name' => 'Gcash Tenant',
        'gender' => 'Female',
        'contact' => '09987654321',
        'optional_contact' => null,
        'email' => 'gcash@example.com',
        'downpayment' => 0,
        'payment_type' => 'gcash',
        'gcash_number' => '09987654321',
        'billing_status' => 'Pending',
        'billing_due_date' => now()->addDay(),
        'billing_month_year' => 'May 2026',
        'billing_electricity' => 0,
        'billing_water' => 0,
        'billing_paid_amount' => 0,
        'billing_payment_method' => null,
        'billing_receipt_path' => null,
        'check_in_date' => now()->toDateString(),
        'check_out_date' => null,
    ]);

    $response = $this->patch('/billing/tenants/'.$tenant->id, [
        'due_date' => now()->addDay()->toDateString(),
        'month_year' => 'May 2026',
        'electricity' => 0,
        'water' => 0,
        'amount_paid' => 6000,
        'payment_method' => 'gcash',
        'receipt' => UploadedFile::fake()->image('receipt.jpg'),
    ]);

    $response->assertRedirect();

    $tenant->refresh();

    expect($tenant->billing_status)->toBe('Paid');
    expect((float) $tenant->billing_paid_amount)->toBe(6000.0);
    expect($tenant->billing_payment_method)->toBe('gcash');
    expect($tenant->billing_receipt_path)->not->toBeNull();
    Storage::disk('public')->assertExists($tenant->billing_receipt_path);
});

test('billing update accumulates multiple partial payments', function () {
    $room = Room::query()->create([
        'number' => 'Room 03',
        'occupied' => true,
    ]);

    $tenant = Tenant::query()->create([
        'room_id' => $room->id,
        'name' => 'Accumulated Tenant',
        'gender' => 'Male',
        'contact' => '09111111111',
        'optional_contact' => null,
        'email' => 'accumulated@example.com',
        'downpayment' => 0,
        'payment_type' => 'cash',
        'gcash_number' => null,
        'billing_status' => 'Pending',
        'billing_due_date' => now()->addDay(),
        'billing_month_year' => 'May 2026',
        'billing_electricity' => 0,
        'billing_water' => 0,
        'billing_paid_amount' => 0,
        'billing_payment_method' => null,
        'billing_receipt_path' => null,
        'check_in_date' => now()->toDateString(),
        'check_out_date' => null,
    ]);

    $firstPayment = $this->patch('/billing/tenants/'.$tenant->id, [
        'due_date' => now()->addDay()->toDateString(),
        'month_year' => 'May 2026',
        'electricity' => 0,
        'water' => 0,
        'amount_paid' => 3000,
        'payment_method' => 'cash',
    ]);

    $firstPayment->assertRedirect();
    $tenant->refresh();

    expect($tenant->billing_status)->toBe('Partial');
    expect((float) $tenant->billing_paid_amount)->toBe(3000.0);

    $secondPayment = $this->patch('/billing/tenants/'.$tenant->id, [
        'due_date' => now()->addDay()->toDateString(),
        'month_year' => 'May 2026',
        'electricity' => 0,
        'water' => 0,
        'amount_paid' => 3000,
        'payment_method' => 'cash',
    ]);

    $secondPayment->assertRedirect();
    $tenant->refresh();

    expect($tenant->billing_status)->toBe('Paid');
    expect((float) $tenant->billing_paid_amount)->toBe(6000.0);
});