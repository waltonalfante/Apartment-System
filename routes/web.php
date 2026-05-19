<?php

use App\Http\Controllers\ApartmentModuleController;
use App\Http\Controllers\Api\AnnouncementController as ApiAnnouncementController;
use App\Http\Controllers\Api\AuthApiController;
use App\Http\Controllers\Api\EmailController as ApiEmailController;
use App\Http\Controllers\Api\OtpController as ApiOtpController;
use App\Http\Controllers\Api\PasswordController as ApiPasswordController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use App\Mail\TwoFactorCode;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

// 2FA routes (after login)
Route::middleware(['auth'])->group(function () {
    Route::post('auth/2fa/send', [AuthController::class, 'sendTwoFactorCode'])->name('auth.2fa.send');
    Route::post('auth/2fa/verify', [AuthController::class, 'verifyTwoFactorCode'])->name('auth.2fa.verify');
    Route::get('auth/2fa-verify', function () {
        return inertia('auth/two-factor-verify', [
            'userEmail' => auth()->user()?->email,
        ]);
    })->name('auth.2fa-verify');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [ApartmentModuleController::class, 'dashboard'])->name('dashboard');
    Route::get('reservation', [ApartmentModuleController::class, 'reservation'])->name('reservation');
    Route::patch('reservation/rooms/{room}/toggle', [ApartmentModuleController::class, 'toggleRoom'])
        ->name('reservation.rooms.toggle');
    Route::post('reservation/rooms/{room}/reserve', [ApartmentModuleController::class, 'reserveRoom'])
        ->name('reservation.rooms.reserve');
    Route::post('reservation/{reservation}/check-in', [ApartmentModuleController::class, 'confirmCheckIn'])
        ->name('reservation.checkin');
    Route::patch('reservation/rooms/{room}/cancel', [ApartmentModuleController::class, 'cancelReservation'])
        ->name('reservation.rooms.cancel');
    Route::get('tenant-management', [ApartmentModuleController::class, 'tenantManagement'])->name('tenant.management');
    Route::post('tenant-management/tenants', [ApartmentModuleController::class, 'storeTenant'])
        ->name('tenant.management.store');
    Route::patch('tenant-management/tenants/{tenant}', [ApartmentModuleController::class, 'updateTenant'])
        ->name('tenant.management.update');
    Route::patch('tenant-management/tenants/{tenant}/extend-stay', [ApartmentModuleController::class, 'extendStay'])
        ->name('tenant.management.extend');
    Route::patch('tenant-management/tenants/{tenant}/checkout', [ApartmentModuleController::class, 'checkoutTenant'])
        ->name('tenant.management.checkout');
    Route::delete('tenant-management/tenants/{tenant}', [ApartmentModuleController::class, 'deleteTenant'])
        ->name('tenant.management.delete');
    Route::get('billing', [ApartmentModuleController::class, 'billing'])->name('billing');
    Route::patch('billing/tenants/{tenant}', [ApartmentModuleController::class, 'updateBilling'])
        ->name('billing.update');
    Route::get('communication', [ApartmentModuleController::class, 'communication'])->name('communication');
    Route::patch('communication/conversations/{conversation}/open', [ApartmentModuleController::class, 'openConversation'])
        ->name('communication.conversations.open');
    Route::post('communication/conversations', [ApartmentModuleController::class, 'createConversation'])
        ->name('communication.conversations.create');
    Route::post('communication/conversations/{conversation}/message', [ApartmentModuleController::class, 'sendMessage'])
        ->name('communication.conversations.message');
    Route::delete('communication/conversations/{conversation}', [ApartmentModuleController::class, 'deleteConversation'])
        ->name('communication.conversations.delete');
    Route::post('communication/broadcast', [ApartmentModuleController::class, 'broadcast'])
        ->name('communication.broadcast');
    Route::get('maintenance', [ApartmentModuleController::class, 'maintenance'])->name('maintenance');
    Route::post('maintenance/reports', [ApartmentModuleController::class, 'storeMaintenanceReport'])->name('maintenance.reports.store');
    Route::patch('maintenance/reports/{report}', [ApartmentModuleController::class, 'updateMaintenanceReport'])->name('maintenance.reports.update');
    Route::post('reservation/rooms/{room}/photo', [ApartmentModuleController::class, 'uploadRoomPhoto'])
        ->name('reservation.rooms.photo');
    
    Route::inertia('admin-settings', 'admin-settings')->name('admin.settings');
});

require __DIR__.'/settings.php';

Route::prefix('api')->group(function () {
    Route::post('register', [AuthApiController::class, 'register']);
    Route::post('send-otp', [ApiOtpController::class, 'send'])->middleware('throttle:otp');
    Route::post('verify-otp', [ApiOtpController::class, 'verify'])->middleware('throttle:otp');
    Route::post('resend-otp', [ApiOtpController::class, 'resend'])->middleware('throttle:otp');
    Route::post('forgot-password', [ApiPasswordController::class, 'forgot']);
    Route::post('reset-password', [ApiPasswordController::class, 'reset']);

    Route::middleware(['auth'])->group(function () {
        Route::post('send-announcement', [ApiAnnouncementController::class, 'send'])->middleware('throttle:announcement');
        Route::get('announcements', [ApiAnnouncementController::class, 'index']);
        Route::post('send-email', [ApiEmailController::class, 'send'])->middleware('throttle:email-send');
        Route::post('send-announcement-email', [ApiEmailController::class, 'sendAnnouncement'])->middleware('throttle:announcement');
        Route::post('send-tenant-message', [ApiEmailController::class, 'sendTenantMessage']);
    });
});

// Temporary debug route to generate and send a 2FA code for a given email.
// Usage: /debug/2fa/generate?email=you@example.com
Route::get('debug/2fa/generate', function (Request $request) {
    $email = $request->query('email');
    if (! $email) {
        return response()->json(['error' => 'email query param required'], 422);
    }

    $user = User::where('email', $email)->first();
    if (! $user) {
        return response()->json(['error' => 'user not found'], 404);
    }

    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $user->update([
        'login_code' => $code,
        'login_code_expires_at' => now()->addMinutes(10),
    ]);

    try {
        Mail::to($user->email)->send(new TwoFactorCode($code));
        \Log::info('Debug 2FA: email sent', ['user_id' => $user->id, 'email' => $user->email]);
    } catch (\Throwable $e) {
        \Log::error('Debug 2FA: failed to send', ['exception' => $e->getMessage()]);
        return response()->json(['error' => 'failed to send email', 'message' => $e->getMessage()], 500);
    }

    // Return the code in response for quick local verification
    return response()->json(['status' => 'ok', 'code' => $code]);
});

// Temporary debug route to force-send a 2FA code via Resend API (test mode).
// Usage: /debug/2fa/send-resend?email=you@example.com
Route::get('debug/2fa/send-resend', function (Request $request) {
    $email = $request->query('email');
    if (! $email) {
        return response()->json(['error' => 'email query param required'], 422);
    }

    $user = User::where('email', $email)->first();
    if (! $user) {
        return response()->json(['error' => 'user not found'], 404);
    }

    $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $user->update([
        'login_code' => $code,
        'login_code_expires_at' => now()->addMinutes(10),
    ]);

    $html = view('emails.two_factor_code', ['code' => $code])->render();
    $sent = false;
    try {
        $sent = \App\Services\ResendMailer::sendHtml($user->email, $user->name ?? '', 'Your Apartment Admin Login Code', $html);
        if ($sent) {
            \Log::info('Debug 2FA Resend: sent', ['user_id' => $user->id, 'email' => $user->email]);
        } else {
            \Log::error('Debug 2FA Resend: failed', ['user_id' => $user->id, 'email' => $user->email]);
        }
    } catch (\Throwable $e) {
        \Log::error('Debug 2FA Resend: exception', ['exception' => $e->getMessage()]);
    }

    return response()->json(['status' => 'ok', 'code' => $code, 'resend_sent' => (bool) $sent]);
});

// Temporary debug route to force-assign photos to all rooms.
// Usage: GET /debug/rooms/assign-photos
Route::get('debug/rooms/assign-photos', function () {
    $photoDir = public_path('images/photos');
    if (! is_dir($photoDir)) {
        return response()->json(['status' => 'error', 'message' => 'photos directory not found'], 404);
    }

    $files = array_values(array_map('basename', glob($photoDir.'/*.*')));
    $count = count($files);

    if ($count === 0) {
        return response()->json(['status' => 'error', 'message' => 'no photos found'], 404);
    }

    $rooms = \App\Models\Room::query()
        ->orderByRaw("CAST(REPLACE(number, 'Room ', '') AS UNSIGNED)")
        ->get();

    foreach ($rooms as $idx => $room) {
        $groupIndex = (int) floor($idx / 15);
        $photoIndex = $groupIndex % $count;
        $room->update(['photo_path' => 'images/photos/'.$files[$photoIndex]]);
    }

    return response()->json(['status' => 'ok', 'rooms_updated' => $rooms->count()]);
});

// Debug: return rooms JSON (first page) to inspect photo_path values
Route::get('debug/rooms/json', function () {
    $rooms = \App\Models\Room::query()
        ->select(['id','number','occupied','photo_path'])
        ->orderByRaw("CAST(REPLACE(number, 'Room ', '') AS UNSIGNED)")
        ->paginate(6);

    return response()->json($rooms);
});

