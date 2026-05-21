<?php

use App\Jobs\SendOtpVerificationEmail;
use App\Models\OtpCode;
use Illuminate\Support\Facades\Queue;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyFeature(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    Queue::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'contact_number' => '09123456789',
        'email' => 'test@example.com',
        'password' => 'Password123!',
        'password_confirmation' => 'Password123!',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('auth.2fa-verify', absolute: false));
    Queue::assertPushed(SendOtpVerificationEmail::class);
    expect(OtpCode::query()->where('purpose', 'registration')->exists())->toBeTrue();
});

test('registration contact number must be exactly 11 digits', function () {
    $response = $this->from(route('register'))
        ->post(route('register.store'), [
            'name' => 'Test User',
            'contact_number' => '0912345678',
            'email' => 'invalid-contact@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

    $response->assertRedirect(route('register'));
    $response->assertSessionHasErrors(['contact_number']);
});