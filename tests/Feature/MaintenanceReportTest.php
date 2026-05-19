<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('maintenance reports persist and are shown on refresh', function () {
    $user = User::factory()->create();

    $payload = [
        'tenant_name' => 'Jane Doe',
        'room' => '01',
        'repair' => 'Leaking faucet',
        'date' => '2026-05-17',
        'price' => 'P 200',
        'status' => 'Ongoing',
        'notes' => null,
    ];

    $this->actingAs($user)
        ->post(route('maintenance.reports.store'), $payload)
        ->assertRedirect();

    $this->assertDatabaseHas('maintenance_reports', [
        'tenant_name' => 'Jane Doe',
        'room_code' => '01',
        'repair' => 'Leaking faucet',
        'status' => 'Ongoing',
    ]);

    $this->actingAs($user)
        ->get(route('maintenance'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('maintenance')
            ->has('reports', 1)
            ->where('reports.0.tenant', 'Jane Doe')
            ->where('reports.0.room', '01')
            ->where('reports.0.repair', 'Leaking faucet')
            ->where('reports.0.status', 'Ongoing'),
        );
});