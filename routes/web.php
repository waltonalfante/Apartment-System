<?php

use App\Http\Controllers\ApartmentModuleController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('reservation', [ApartmentModuleController::class, 'reservation'])->name('reservation');
    Route::patch('reservation/rooms/{room}/toggle', [ApartmentModuleController::class, 'toggleRoom'])
        ->name('reservation.rooms.toggle');
    Route::inertia('tenant-management', 'tenant-management')->name('tenant.management');
    Route::inertia('billing', 'billing')->name('billing');
    Route::get('communication', [ApartmentModuleController::class, 'communication'])->name('communication');
    Route::patch('communication/conversations/{conversation}/open', [ApartmentModuleController::class, 'openConversation'])
        ->name('communication.conversations.open');
    Route::post('communication/conversations/{conversation}/message', [ApartmentModuleController::class, 'sendMessage'])
        ->name('communication.conversations.message');
    Route::post('communication/broadcast', [ApartmentModuleController::class, 'broadcast'])
        ->name('communication.broadcast');
    Route::inertia('maintenance', 'maintenance')->name('maintenance');
    Route::inertia('admin-settings', 'admin-settings')->name('admin.settings');
});

require __DIR__.'/settings.php';
