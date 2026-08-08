<?php

use App\Mail\GenericNotificationMail;
use App\Mail\TwoFactorCode;
use App\Models\Announcement;
use App\Models\EmailLog;
use App\Models\OtpCode;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

it('registers a user and sends a registration otp', function () {
    Mail::fake();

    $response = $this->postJson('/api/register', [
        'name' => 'API Test User',
        'email' => 'api-test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response->assertCreated();
    $response->assertJsonPath('message', 'Account created. OTP sent to email.');

    $this->assertDatabaseHas('users', [
        'email' => 'api-test@example.com',
    ]);

    $this->assertDatabaseHas('otp_codes', [
        'purpose' => 'registration',
        'sent_to' => 'api-test@example.com',
    ]);

    $this->assertDatabaseHas('email_logs', [
        'recipient' => 'api-test@example.com',
        'type' => 'otp',
        'status' => 'sent',
    ]);

    Mail::assertSent(TwoFactorCode::class);
});

it('sends an otp for an existing user', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'existing@example.com',
    ]);

    $response = $this->postJson('/api/send-otp', [
        'email' => $user->email,
        'purpose' => 'login',
    ]);

    $response->assertOk();
    $response->assertJsonPath('message', 'OTP sent successfully.');

    $this->assertDatabaseHas('otp_codes', [
        'user_id' => $user->id,
        'purpose' => 'login',
        'sent_to' => $user->email,
    ]);

    Mail::assertSent(TwoFactorCode::class);
});

it('queues announcement emails for authenticated users', function () {
    Mail::fake();

    $user = User::factory()->create();
    User::factory()->create(['email' => 'client1@example.com']);
    User::factory()->create(['email' => 'client2@example.com']);

    $response = $this->actingAs($user)->postJson('/api/send-announcement', [
        'subject' => 'Maintenance Notice',
        'body' => 'Water will be off tonight.',
        'audience' => 'users',
        'cta_label' => 'View Details',
        'cta_url' => 'https://example.com/notice',
    ]);

    $response->assertOk();
    $response->assertJsonPath('message', 'Announcement queued for sending.');

    $this->assertDatabaseHas('announcements', [
        'subject' => 'Maintenance Notice',
        'status' => 'sent',
    ]);

    Mail::assertQueued(GenericNotificationMail::class);
});

it('queues a general email notification', function () {
    Mail::fake();

    $user = User::factory()->create([
        'email' => 'notify@example.com',
    ]);

    $response = $this->actingAs($user)->postJson('/api/send-email', [
        'to' => 'notify@example.com',
        'subject' => 'General Notification',
        'message' => 'This is a notification email.',
    ]);

    $response->assertOk();
    $response->assertJsonPath('message', 'Email queued successfully.');

    $this->assertDatabaseHas('email_logs', [
        'recipient' => 'notify@example.com',
        'type' => 'notification',
        'status' => 'queued',
    ]);

    Mail::assertQueued(GenericNotificationMail::class);
});