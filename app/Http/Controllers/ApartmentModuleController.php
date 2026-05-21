<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\MaintenanceReport;
use App\Models\Reservation;
use App\Models\Room;
use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use App\Mail\TenantMessage;
use App\Jobs\SendTenantMessageEmail;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Schema;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;
use Throwable;

class ApartmentModuleController extends Controller
{
    private function roomNumberOrderSql(): string
    {
        $driver = DB::connection()->getDriverName();

        return match ($driver) {
            'pgsql' => "CAST(REGEXP_REPLACE(number, '[^0-9]', '', 'g') AS INTEGER)",
            default => "CAST(REPLACE(number, 'Room ', '') AS INTEGER)",
        };
    }

    private function activeTenantQuery()
    {
        $today = now()->toDateString();

        return Tenant::query()->where(function ($query) use ($today) {
            $query->whereNull('check_out_date')
                ->orWhereDate('check_out_date', '>=', $today);
        })->whereNull('archived_at');
    }

    public function dashboard(): Response
    {
        if (Schema::hasTable('rooms')) {
            $this->ensureRooms();
        }

        $totalRooms = Schema::hasTable('rooms') ? Room::query()->count() : 0;
        $occupiedRooms = Schema::hasTable('tenants') ? $this->activeTenantQuery()->count() : 0;
        $availableRooms = max($totalRooms - $occupiedRooms, 0);
        $collectionRate = $totalRooms > 0
            ? round(($occupiedRooms / $totalRooms) * 100, 1)
            : 0;

        $tenants = Schema::hasTable('tenants')
            ? $this->activeTenantQuery()
                ->with('room:id,number')
                ->orderBy('room_id')
                ->get()
                ->map(function (Tenant $tenant) {
                $roomNumber = $tenant->room?->number ?? '';

                return [
                    'id' => $tenant->id,
                    'room_id' => $tenant->room_id,
                    'room_code' => $this->roomCode($roomNumber),
                    'name' => $tenant->name,
                    'gender' => $tenant->gender,
                    'contact' => $tenant->contact,
                    'check_in_date' => optional($tenant->check_in_date)->toDateString(),
                    'check_out_date' => optional($tenant->check_out_date)->toDateString(),
                ];
                })
            : Collection::make();

        $reservations = Schema::hasTable('reservations')
            ? Reservation::query()
                ->with('room:id,number')
                ->where('status', 'reserved')
                ->orderBy('room_id')
                ->get()
                ->map(function (Reservation $reservation) {
                $roomNumber = $reservation->room?->number ?? '';

                return [
                    'id' => $reservation->id,
                    'room_id' => $reservation->room_id,
                    'room_code' => $this->roomCode($roomNumber),
                    'name' => $reservation->name,
                    'check_in_date' => optional($reservation->check_in_date)->toDateString(),
                    'check_out_date' => optional($reservation->check_out_date)->toDateString(),
                ];
                })
            : Collection::make();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_rooms' => $totalRooms,
                'occupied' => $occupiedRooms,
                'available' => $availableRooms,
                'collection_rate' => $collectionRate,
            ],
            'tenants' => $tenants,
            'reservations' => $reservations,
        ]);
    }

    public function tenantManagement(): Response
    {
        if (Schema::hasTable('rooms')) {
            $this->ensureRooms();
        }

        return Inertia::render('tenant-management', [
            'roomLimit' => Schema::hasTable('rooms') ? Room::query()->count() : 0,
            'archivedTenants' => Schema::hasTable('tenants')
                ? Tenant::query()
                    ->whereNotNull('archived_at')
                    ->with('room:id,number')
                    ->orderByDesc('archived_at')
                    ->get()
                    ->map(function (Tenant $tenant) {
                        $roomNumber = $tenant->room?->number ?? '';

                        return [
                            'id' => $tenant->id,
                            'room_id' => $tenant->room_id,
                            'room' => $this->roomCode($roomNumber),
                            'name' => $tenant->name,
                            'gender' => $tenant->gender,
                            'contact' => $tenant->contact,
                            'optional_contact' => $tenant->optional_contact,
                            'email' => $tenant->email,
                            'check_in_date' => optional($tenant->check_in_date)->toDateString(),
                            'check_out_date' => optional($tenant->check_out_date)->toDateString(),
                            'archived_at' => optional($tenant->archived_at)->toDateString(),
                        ];
                    })
                : Collection::make(),
            'reservations' => Schema::hasTable('reservations')
                ? Reservation::query()
                    ->where('status', 'reserved')
                    ->with('room:id,number')
                    ->orderBy('room_id')
                    ->get()
                    ->map(function (Reservation $reservation) {
                        $roomNumber = $reservation->room?->number ?? '';

                        return [
                            'id' => $reservation->id,
                            'room_id' => $reservation->room_id,
                            'room_code' => $this->roomCode($roomNumber),
                            'name' => $reservation->name,
                            'check_in_date' => optional($reservation->check_in_date)->toDateString(),
                            'check_out_date' => optional($reservation->check_out_date)->toDateString(),
                        ];
                    })
                : Collection::make(),
            'tenants' => Schema::hasTable('tenants')
                ? $this->activeTenantQuery()
                    ->with('room:id,number')
                    ->orderBy('room_id')
                    ->get()
                    ->map(function (Tenant $tenant) {
                        $roomNumber = $tenant->room?->number ?? '';

                        return [
                            'id' => $tenant->id,
                            'room_id' => $tenant->room_id,
                            'room' => $this->roomCode($roomNumber),
                            'name' => $tenant->name,
                            'gender' => $tenant->gender,
                            'contact' => $tenant->contact,
                            'optional_contact' => $tenant->optional_contact,
                            'email' => $tenant->email,
                            'check_in_date' => optional($tenant->check_in_date)->toDateString(),
                            'check_out_date' => optional($tenant->check_out_date)->toDateString(),
                        ];
                    })
                : Collection::make(),
        ]);
    }

    public function reservation(Request $request): Response
    {
        if (Schema::hasTable('rooms')) {
            $this->ensureRooms();
        }

        $page = max(1, (int) $request->query('page', 1));

        // Desired paging: first page shows 10 items, subsequent pages show 5 items each.
        if (Schema::hasTable('rooms')) {
            $roomsQuery = Room::query()
                ->select(['id', 'number', 'occupied', 'photo_path', 'kitchen_photo', 'room_photo', 'cr_photo', 'bed_photo'])
                ->orderByRaw($this->roomNumberOrderSql());

            if ($page === 1) {
                $rooms = $roomsQuery->paginate(10)->withQueryString();
            } else {
                $perPage = 5;
                $offset = 10 + ($page - 2) * $perPage;
                $total = $roomsQuery->count();
                $collection = $roomsQuery->skip($offset)->take($perPage)->get();

                $rooms = new LengthAwarePaginator($collection, $total, $perPage, $page, [
                    'path' => url('/reservation'),
                    'query' => $request->query(),
                ]);
            }
        } else {
            $rooms = Collection::make();
        }

        // collect available room photos from public/images/photos if present
        $photoDir = public_path('images/photos');
        $photos = [];
        if (is_dir($photoDir)) {
            foreach (glob($photoDir.'/*.*') as $file) {
                $photos[] = 'images/photos/'.basename($file);
            }
        }

        // Populate room photos if not already set
        $rooms->getCollection()->transform(function ($room) use ($photos) {
            if (empty($room->kitchen_photo) && ! empty($photos)) {
                $room->kitchen_photo = $photos[array_search('images/photos/kitchen.jpg', $photos, true)] ?? $photos[0] ?? null;
            }

            if (empty($room->room_photo) && ! empty($photos)) {
                $room->room_photo = $photos[array_search('images/photos/room.jpg', $photos, true)] ?? $photos[0] ?? null;
            }

            if (empty($room->cr_photo) && ! empty($photos)) {
                $room->cr_photo = $photos[array_search('images/photos/cr.jpg', $photos, true)] ?? $photos[0] ?? null;
            }

            if (empty($room->bed_photo) && ! empty($photos)) {
                $room->bed_photo = $photos[array_search('images/photos/bed.jpg', $photos, true)] ?? $photos[0] ?? null;
            }

            // fallback to generic photo_path if present
            if (empty($room->room_photo) && ! empty($room->photo_path)) {
                $room->room_photo = $room->photo_path;
            }

            return $room;
        });

        return Inertia::render('reservation', [
            'rooms' => $rooms,
            'reservations' => Reservation::query()
                ->with('room:id,number')
                ->where('status', 'reserved')
                ->orderBy('room_id')
                ->get()
                ->map(function (Reservation $reservation) {
                    $roomNumber = $reservation->room?->number ?? '';

                    return [
                        'id' => $reservation->id,
                        'room_id' => $reservation->room_id,
                        'room_number' => $roomNumber,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $reservation->name,
                        'contact' => $reservation->contact,
                        'email' => $reservation->email,
                        'downpayment' => $reservation->downpayment,
                        'payment_type' => $reservation->payment_type,
                        'gcash_number' => $reservation->gcash_number,
                        'check_in_date' => optional($reservation->check_in_date)->toDateString(),
                        'check_out_date' => optional($reservation->check_out_date)->toDateString(),
                        'status' => $reservation->status,
                    ];
                }),
            'reservationHistory' => Reservation::query()
                ->with('room:id,number')
                ->where('status', 'cancelled')
                ->orderByDesc('cancelled_at')
                ->get()
                ->map(function (Reservation $reservation) {
                    $roomNumber = $reservation->room?->number ?? '';

                    return [
                        'id' => $reservation->id,
                        'room_id' => $reservation->room_id,
                        'room_number' => $roomNumber,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $reservation->name,
                        'check_in_date' => optional($reservation->check_in_date)->toDateString(),
                        'check_out_date' => optional($reservation->check_out_date)->toDateString(),
                        'cancellation_action' => $reservation->cancellation_action,
                        'cancellation_notes' => $reservation->cancellation_notes,
                        'cancelled_at' => optional($reservation->cancelled_at)->toDateString(),
                    ];
                }),
            'tenants' => $this->activeTenantQuery()
                ->with('room:id,number')
                ->get()
                ->map(function (Tenant $tenant) {
                    $roomNumber = $tenant->room?->number ?? '';

                    return [
                        'id' => $tenant->id,
                        'room_id' => $tenant->room_id,
                        'room_number' => $roomNumber,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $tenant->name,
                        'check_in_date' => optional($tenant->check_in_date)->toDateString(),
                        'check_out_date' => optional($tenant->check_out_date)->toDateString(),
                    ];
                }),
            'roomPhotos' => $photos,
        ]);
    }

    public function reserveRoom(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'contact' => ['required', 'regex:/^\d{11}$/'],
            'email' => ['required', 'email', 'max:255'],
            'downpayment' => ['required', 'numeric', 'min:500'],
            'payment_type' => ['required', 'in:cash,gcash'],
            'gcash_number' => ['nullable', 'regex:/^\d{11}$/'],
            'check_in_date' => ['required', 'date', 'after_or_equal:today'],
            'check_out_date' => ['nullable', 'date', 'after_or_equal:check_in_date'],
        ]);

        if ($validated['payment_type'] === 'gcash' && ! $validated['gcash_number']) {
            return back()->with('error', 'GCash number is required for GCash payments.');
        }

        $activeTenant = $this->activeTenantQuery()->where('room_id', $room->id)->first();

        if ($activeTenant && ! $activeTenant->check_out_date) {
            return back()->with('error', 'Room has no check-out date for a new reservation.');
        }

        if ($activeTenant && $validated['check_in_date'] < $activeTenant->check_out_date->toDateString()) {
            return back()->with('error', 'Check-in date must be on or after the current tenant check-out date.');
        }

        $pastTenant = Tenant::query()
            ->where('room_id', $room->id)
            ->whereNotNull('check_out_date')
            ->whereDate('check_out_date', '<', now()->toDateString())
            ->first();

        if ($pastTenant) {
            $pastTenant->delete();
        }

        $hasDuplicateContact = Tenant::query()
            ->where('contact', $validated['contact'])
            ->orWhere('optional_contact', $validated['contact'])
            ->exists();

        if ($hasDuplicateContact) {
            return back()->with('error', 'This contact number is already assigned to another tenant.');
        }

        Reservation::query()->updateOrCreate(
            ['room_id' => $room->id],
            [
                'name' => $validated['name'],
                'contact' => $validated['contact'],
                'email' => $validated['email'],
                'downpayment' => $validated['downpayment'],
                'payment_type' => $validated['payment_type'],
                'gcash_number' => $validated['payment_type'] === 'gcash'
                    ? $validated['gcash_number']
                    : null,
                'check_in_date' => $validated['check_in_date'],
                'check_out_date' => $validated['check_out_date'] ?: null,
                'status' => 'reserved',
            ],
        );

        return back()->with('success', "Reservation confirmed for {$room->number}.");
    }

    public function confirmCheckIn(Reservation $reservation): RedirectResponse
    {
        $reservation->load('room');

        if (! $reservation->room) {
            return back()->with('error', 'Reservation room not found.');
        }

        if ($this->activeTenantQuery()->where('room_id', $reservation->room_id)->exists()) {
            return back()->with('error', 'Room already has a tenant.');
        }

        $tenant = Tenant::query()->create([
            'room_id' => $reservation->room_id,
            'name' => $reservation->name,
            'gender' => 'Male',
            'contact' => $reservation->contact,
            'optional_contact' => null,
            'email' => $reservation->email,
            'downpayment' => $reservation->downpayment,
            'payment_type' => $reservation->payment_type,
            'gcash_number' => $reservation->gcash_number,
            'check_in_date' => $reservation->check_in_date,
            'check_out_date' => $reservation->check_out_date,
        ]);

        $reservation->delete();

        $reservation->room->update([
            'occupied' => true,
        ]);

        return back()->with('success', "Check-in confirmed for {$tenant->name}.");
    }

    public function cancelReservation(Room $room): RedirectResponse
    {
        $validated = request()->validate([
            'cancellation_action' => ['required', 'in:refund,forfeit'],
            'cancellation_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $reservation = Reservation::query()
            ->where('room_id', $room->id)
            ->where('status', 'reserved')
            ->first();

        if (! $reservation) {
            return back()->with('error', 'Reservation not found.');
        }

        $reservation->update([
            'status' => 'cancelled',
            'cancellation_action' => $validated['cancellation_action'],
            'cancellation_notes' => $validated['cancellation_notes'] ?: null,
            'cancelled_at' => now(),
        ]);

        if (! $this->activeTenantQuery()->where('room_id', $room->id)->exists()) {
            $room->update([
                'occupied' => false,
            ]);
        }

        return back()->with('success', "Reservation cancelled for {$room->number}.");
    }

    public function storeTenant(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reservation_id' => ['required', 'integer', 'exists:reservations,id'],
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'gender' => ['required', 'in:Male,Female'],
            'contact' => ['required', 'regex:/^\d{11}$/'],
            'optional_contact' => ['nullable', 'regex:/^\d{11}$/'],
            'email' => ['required', 'email', 'max:255'],
            'check_in_date' => ['required', 'date'],
            'check_out_date' => ['nullable', 'date', 'after_or_equal:check_in_date'],
        ]);

        if ($validated['optional_contact'] && $validated['optional_contact'] === $validated['contact']) {
            return back()->with('error', 'Primary and optional contact numbers must be different.');
        }

        $reservation = Reservation::query()
            ->with('room')
            ->where('status', 'reserved')
            ->findOrFail($validated['reservation_id']);

        if (! $reservation->room) {
            return back()->with('error', 'Reservation room not found.');
        }

        if ($this->activeTenantQuery()->where('room_id', $reservation->room_id)->exists()) {
            return back()->with('error', 'Room already has a tenant.');
        }

        $hasDuplicateContact = Tenant::query()
            ->where('contact', $validated['contact'])
            ->orWhere('optional_contact', $validated['contact'])
            ->exists();

        if ($hasDuplicateContact) {
            return back()->with('error', 'This contact number is already assigned to another tenant.');
        }

        if ($validated['optional_contact']) {
            $hasDuplicateOptional = Tenant::query()
                ->where('contact', $validated['optional_contact'])
                ->orWhere('optional_contact', $validated['optional_contact'])
                ->exists();

            if ($hasDuplicateOptional) {
                return back()->with('error', 'This optional contact number is already assigned to another tenant.');
            }
        }

        $tenant = Tenant::query()->create([
            'room_id' => $reservation->room_id,
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'contact' => $validated['contact'],
            'optional_contact' => $validated['optional_contact'] ?: null,
            'email' => $validated['email'],
            'downpayment' => $reservation->downpayment,
            'payment_type' => $reservation->payment_type,
            'gcash_number' => $reservation->gcash_number,
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'] ?: null,
        ]);

        $reservation->delete();

        $reservation->room->update([
            'occupied' => true,
        ]);

        return back()->with('success', "Tenant added successfully: {$tenant->name}.");
    }

    public function updateTenant(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'room' => ['required', 'regex:/^\d{1,3}$/'],
            'gender' => ['required', 'in:Male,Female'],
            'contact' => ['required', 'regex:/^\d{11}$/'],
            'optional_contact' => ['nullable', 'regex:/^\d{11}$/'],
            'email' => ['required', 'email', 'max:255'],
            'check_in_date' => ['required', 'date'],
            'check_out_date' => ['nullable', 'date', 'after_or_equal:check_in_date'],
        ]);

        if ($validated['optional_contact'] && $validated['optional_contact'] === $validated['contact']) {
            return back()->with('error', 'Primary and optional contact numbers must be different.');
        }

        $roomCode = str_pad($validated['room'], 2, '0', STR_PAD_LEFT);
        $room = Room::query()->where('number', 'Room '.$roomCode)->first();

        if (! $room) {
            return back()->with('error', 'Room not found.');
        }

        $hasDuplicateRoom = $this->activeTenantQuery()
            ->where('room_id', $room->id)
            ->where('id', '!=', $tenant->id)
            ->exists();

        if ($hasDuplicateRoom) {
            return back()->with('error', "Room {$roomCode} already has a tenant.");
        }

        $hasDuplicateContact = Tenant::query()
            ->where('id', '!=', $tenant->id)
            ->where(function ($query) use ($validated) {
                $query->where('contact', $validated['contact'])
                    ->orWhere('optional_contact', $validated['contact']);
            })
            ->exists();

        if ($hasDuplicateContact) {
            return back()->with('error', 'This contact number is already assigned to another tenant.');
        }

        if ($validated['optional_contact']) {
            $hasDuplicateOptional = Tenant::query()
                ->where('id', '!=', $tenant->id)
                ->where(function ($query) use ($validated) {
                    $query->where('contact', $validated['optional_contact'])
                        ->orWhere('optional_contact', $validated['optional_contact']);
                })
                ->exists();

            if ($hasDuplicateOptional) {
                return back()->with('error', 'This optional contact number is already assigned to another tenant.');
            }
        }

        $previousRoomId = $tenant->room_id;

        $tenant->update([
            'room_id' => $room->id,
            'name' => $validated['name'],
            'gender' => $validated['gender'],
            'contact' => $validated['contact'],
            'optional_contact' => $validated['optional_contact'] ?: null,
            'email' => $validated['email'],
            'check_in_date' => $validated['check_in_date'],
            'check_out_date' => $validated['check_out_date'] ?: null,
        ]);

        $room->update([
            'occupied' => true,
        ]);

        if ($previousRoomId !== $room->id) {
            $previousRoom = Room::query()->find($previousRoomId);

            if (
                $previousRoom &&
                ! $this->activeTenantQuery()->where('room_id', $previousRoomId)->exists() &&
                ! Reservation::query()->where('room_id', $previousRoomId)->exists()
            ) {
                $previousRoom->update([
                    'occupied' => false,
                ]);
            }
        }

        return back()->with('success', "Tenant information saved for {$tenant->name}.");
    }

    public function deleteTenant(Tenant $tenant): RedirectResponse
    {
        $room = $tenant->room;

        $tenant->delete();

        if ($room && ! Reservation::query()->where('room_id', $room->id)->exists()) {
            $room->update([
                'occupied' => false,
            ]);
        }

        return back()->with('success', 'Tenant removed successfully.');
    }

    public function checkoutTenant(Tenant $tenant): RedirectResponse
    {
        $validated = request()->validate([
            'action' => ['nullable', 'in:normal,reschedule,checkin_now'],
            'reservation_id' => ['nullable', 'integer', 'exists:reservations,id'],
            'reschedule_check_in' => ['nullable', 'date'],
        ]);

        $action = $validated['action'] ?? 'normal';
        $today = now()->toDateString();
        $room = $tenant->room;

        $tenant->update([
            'check_out_date' => $today,
            'archived_at' => now(),
        ]);

        $reservation = null;
        if (! empty($validated['reservation_id'])) {
            $reservation = Reservation::query()
                ->where('status', 'reserved')
                ->find($validated['reservation_id']);
        }

        if (! $reservation) {
            $reservation = Reservation::query()
                ->where('room_id', $tenant->room_id)
                ->where('status', 'reserved')
                ->first();
        }

        if ($action === 'reschedule') {
            if (! $reservation) {
                return back()->with('error', 'No reservation found to reschedule.');
            }

            $reservation->update([
                'check_in_date' => $validated['reschedule_check_in'] ?? $today,
            ]);
        }

        if ($action === 'checkin_now') {
            if (! $reservation) {
                return back()->with('error', 'No reservation found to check in.');
            }

            $newTenant = $this->createTenantFromReservation($reservation);

            if ($room) {
                $room->update([
                    'occupied' => true,
                ]);
            }

            return back()->with('success', "Check-in confirmed for {$newTenant->name}.");
        }

        if ($room) {
            $room->update([
                'occupied' => false,
            ]);
        }

        return back()->with('success', "Tenant checked out: {$tenant->name}.");
    }

    public function extendStay(Request $request, Tenant $tenant): RedirectResponse
    {
        $validated = $request->validate([
            'new_check_out_date' => ['required', 'date'],
            'push_reservation' => ['nullable', 'boolean'],
        ]);

        $checkInDate = optional($tenant->check_in_date)->toDateString();
        if ($checkInDate && $validated['new_check_out_date'] < $checkInDate) {
            return back()->with('error', 'New check-out date must be after check-in date.');
        }

        $reservation = Reservation::query()
            ->where('room_id', $tenant->room_id)
            ->where('status', 'reserved')
            ->first();

        if ($reservation && ! $request->boolean('push_reservation')) {
            return back()->with('error', 'Reservation exists for this room. Confirm to push the reservation date.');
        }

        if ($reservation && $request->boolean('push_reservation')) {
            $reservation->update([
                'check_in_date' => $validated['new_check_out_date'],
            ]);
        }

        $tenant->update([
            'check_out_date' => $validated['new_check_out_date'],
        ]);

        return back()->with('success', "Stay extended for {$tenant->name}.");
    }

    public function toggleRoom(Request $request, Room $room): RedirectResponse
    {
        $requestedOccupied = $request->boolean('occupied', ! $room->occupied);

        try {
            $room->update([
                'occupied' => $requestedOccupied,
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to toggle room occupancy.', [
                'room_id' => $room->id,
                'requested_occupied' => $requestedOccupied,
                'user_id' => $request->user()?->id,
                'exception' => $exception,
            ]);

            return back()->with('error', 'Unable to update room status right now. Please try again.');
        }

        return back();
    }

    public function communication(): Response
    {
        $this->ensureConversations();

        // Only return conversations for ACTIVE tenants
        $activeRooms = $this->activeTenantQuery()
            ->with('room:id,number')
            ->get()
            ->mapWithKeys(function (Tenant $tenant) {
                $roomNumber = $tenant->room?->number ?? '';
                return [$roomNumber => true];
            });

        $conversations = Conversation::query()
            ->whereIn('room', $activeRooms->keys())
            ->orderBy('id')
            ->get(['id', 'name', 'room', 'message', 'time', 'unread']);

        return Inertia::render('communication', [
            'conversations' => $conversations,
        ]);
    }

    public function billing(): Response
    {
        return Inertia::render('billing', [
            'tenants' => $this->activeTenantQuery()
                ->with('room:id,number')
                ->orderBy('room_id')
                ->where(function ($query) {
                    $query->whereNull('billing_status')
                        ->orWhere('billing_status', '!=', 'Paid');
                })
                ->get()
                ->map(function (Tenant $tenant) {
                    $roomNumber = $tenant->room?->number ?? '';

                    return [
                        'id' => $tenant->id,
                        'room_id' => $tenant->room_id,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $tenant->name,
                        'check_in_date' => optional($tenant->check_in_date)->toDateString(),
                        'downpayment' => $tenant->downpayment,
                        'payment_type' => $tenant->payment_type,
                        'gcash_number' => $tenant->gcash_number,
                        'billing_status' => $tenant->billing_status ?? 'Pending',
                        'billing_due_date' => optional($tenant->billing_due_date)->toDateString(),
                        'billing_month_year' => $tenant->billing_month_year,
                        'billing_electricity' => $tenant->billing_electricity,
                        'billing_water' => $tenant->billing_water,
                        'billing_paid_amount' => $tenant->billing_paid_amount,
                        'billing_payment_method' => $tenant->billing_payment_method,
                        'billing_receipt_path' => $tenant->billing_receipt_path,
                    ];
                }),
            'billingHistory' => Tenant::query()
                ->with('room:id,number')
                ->where('billing_status', 'Paid')
                ->orderByDesc('updated_at')
                ->get()
                ->map(function (Tenant $tenant) {
                    $roomNumber = $tenant->room?->number ?? '';

                    return [
                        'id' => $tenant->id,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $tenant->name,
                        'billing_due_date' => optional($tenant->billing_due_date)->toDateString(),
                        'billing_month_year' => $tenant->billing_month_year,
                        'billing_electricity' => $tenant->billing_electricity,
                        'billing_water' => $tenant->billing_water,
                        'billing_paid_amount' => $tenant->billing_paid_amount,
                        'billing_payment_method' => $tenant->billing_payment_method,
                        'billing_receipt_path' => $tenant->billing_receipt_path,
                        'downpayment' => $tenant->downpayment,
                        'payment_type' => $tenant->payment_type,
                        'gcash_number' => $tenant->gcash_number,
                    ];
                }),
        ]);
    }

    public function updateBilling(Request $request, Tenant $tenant): RedirectResponse
    {
        if ($tenant->billing_status === 'Paid') {
            return back()->with('error', 'Paid billing records are final and cannot be changed.');
        }

        $validated = $request->validate([
            'due_date' => ['nullable', 'date'],
            'month_year' => ['nullable', 'string', 'max:50'],
            'electricity' => ['nullable', 'numeric', 'min:0'],
            'water' => ['nullable', 'numeric', 'min:0'],
            'amount_paid' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'in:cash,gcash'],
            'receipt' => ['nullable', 'file', 'image', 'max:10240'],
        ]);

        $electricity = (float) ($validated['electricity'] ?? $tenant->billing_electricity ?? 0);
        $water = (float) ($validated['water'] ?? $tenant->billing_water ?? 0);
        $totalDue = 6000 + $electricity + $water;
        $paidAmount = max(0, (float) ($validated['amount_paid'] ?? 0));
        $receiptPath = $tenant->billing_receipt_path;

        if ($validated['payment_method'] === 'gcash' && ! $request->hasFile('receipt') && ! $receiptPath) {
            return back()->withInput()->with('error', 'GCash payments require a receipt image.');
        }

        if ($validated['payment_method'] === 'cash') {
            $receiptPath = null;
        }

        if ($validated['payment_method'] === 'gcash' && $request->hasFile('receipt')) {
            $receiptFile = $request->file('receipt');
            $receiptName = sprintf(
                'billing_%d_%s.%s',
                $tenant->id,
                now()->format('YmdHis'),
                $receiptFile->getClientOriginalExtension() ?: 'jpg'
            );
            $receiptPath = $receiptFile->storeAs('billing-receipts', $receiptName, 'public');
        }

        $status = $paidAmount >= $totalDue
            ? 'Paid'
            : ($paidAmount > 0 ? 'Partial' : 'Pending');

        $tenant->update([
            'billing_status' => $status,
            'billing_due_date' => $validated['due_date'] ?? $tenant->billing_due_date,
            'billing_month_year' => $validated['month_year'] ?? $tenant->billing_month_year,
            'billing_electricity' => $electricity,
            'billing_water' => $water,
            'billing_paid_amount' => min($paidAmount, $totalDue),
            'billing_payment_method' => $validated['payment_method'],
            'billing_receipt_path' => $receiptPath,
        ]);

        return back()->with('success', "Billing updated for {$tenant->name}.");
    }

    public function maintenance(): Response
    {
        return Inertia::render('maintenance', [
            'tenants' => $this->activeTenantQuery()
                ->with('room:id,number')
                ->orderBy('room_id')
                ->get()
                ->map(function (Tenant $tenant) {
                    $roomNumber = $tenant->room?->number ?? '';

                    return [
                        'id' => $tenant->id,
                        'room_id' => $tenant->room_id,
                        'room_code' => $this->roomCode($roomNumber),
                        'name' => $tenant->name,
                    ];
                }),
            'reports' => MaintenanceReport::query()
                ->orderByDesc('created_at')
                ->get()
                ->map(function (MaintenanceReport $r) {
                    return [
                        'id' => $r->id,
                        'tenant_id' => $r->tenant_id,
                        'tenant' => $r->tenant_name,
                        'tenant_name' => $r->tenant_name,
                        'room' => $r->room_code,
                        'repair' => $r->repair,
                        'date' => optional($r->start_date)->toDateString(),
                        'price' => $r->price,
                        'status' => $r->status,
                        'notes' => $r->notes,
                    ];
                }),
        ]);
    }

    public function storeMaintenanceReport(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'tenant_id' => ['nullable', 'integer', 'exists:tenants,id'],
            'tenant_name' => ['nullable', 'string', 'max:255'],
            'room' => ['nullable', 'string', 'max:10'],
            'repair' => ['required', 'string', 'min:2', 'max:255'],
            'date' => ['nullable', 'date'],
            'price' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'in:Ongoing,Done'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        MaintenanceReport::create([
            'tenant_id' => $validated['tenant_id'] ?? null,
            'tenant_name' => $validated['tenant_name'] ?? null,
            'room_code' => $validated['room'] ?? null,
            'repair' => $validated['repair'],
            'start_date' => $validated['date'] ?? null,
            'price' => $validated['price'] ?? null,
            'status' => $validated['status'] ?? 'Ongoing',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Maintenance report added successfully.');
    }

    public function uploadRoomPhoto(Request $request, Room $room): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'photo' => ['required', 'file', 'image', 'max:10240'],
        ]);

        $dir = public_path('images/photos');
        if (! is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        $file = $validated['photo'];
        $ext = $file->getClientOriginalExtension();
        $filename = time().'_'.bin2hex(random_bytes(6)).'.'.($ext ?: 'jpg');
        $target = $dir.DIRECTORY_SEPARATOR.$filename;

        try {
            $file->move($dir, $filename);
            $room->update(['photo_path' => 'images/photos/'.$filename]);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Failed to save photo.'], 500);
        }

        return response()->json(['photo' => 'images/photos/'.$filename]);
    }

    public function updateMaintenanceReport(Request $request, MaintenanceReport $report): RedirectResponse
    {
        $validated = $request->validate([
            'tenant_id' => ['nullable', 'integer', 'exists:tenants,id'],
            'tenant_name' => ['nullable', 'string', 'max:255'],
            'room' => ['nullable', 'string', 'max:10'],
            'repair' => ['required', 'string', 'min:2', 'max:255'],
            'date' => ['nullable', 'date'],
            'price' => ['nullable', 'string', 'max:50'],
            'status' => ['required', 'in:Ongoing,Done'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $report->update([
            'tenant_id' => $validated['tenant_id'] ?? null,
            'tenant_name' => $validated['tenant_name'] ?? null,
            'room_code' => $validated['room'] ?? null,
            'repair' => $validated['repair'],
            'start_date' => $validated['date'] ?? null,
            'price' => $validated['price'] ?? null,
            'status' => $validated['status'] ?? 'Ongoing',
            'notes' => $validated['notes'] ?? null,
        ]);

        return back()->with('success', 'Maintenance report updated successfully.');
    }

    public function openConversation(Conversation $conversation): RedirectResponse
    {
        try {
            $conversation->update([
                'unread' => false,
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to open conversation.', [
                'conversation_id' => $conversation->id,
                'user_id' => request()->user()?->id,
                'exception' => $exception,
            ]);

            return back()->with('error', 'Unable to open conversation right now. Please try again.');
        }

        return back();
    }

    public function sendMessage(Request $request, Conversation $conversation): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        try {
            $conversation->update([
                'message' => $validated['message'],
                'time' => now()->format('g:i A'),
                'unread' => false,
            ]);
            // Send email copy to tenant if we can resolve their email by room
            try {
                $tenant = Tenant::query()
                    ->whereHas('room', function ($q) use ($conversation) {
                        $q->where('number', $conversation->room);
                    })
                    ->whereNull('archived_at')
                    ->first();

                if ($tenant && $tenant->email) {
                    SendTenantMessageEmail::dispatch(
                        $tenant->email,
                        'Message from Apartment Admin',
                        $validated['message']
                    );
                }
            } catch (Throwable $e) {
                Log::warning('Failed to queue tenant email after sending message.', ['conversation_id' => $conversation->id, 'exception' => $e]);
            }
        } catch (Throwable $exception) {
            Log::error('Failed to send tenant message.', [
                'conversation_id' => $conversation->id,
                'message_length' => strlen($validated['message']),
                'user_id' => $request->user()?->id,
                'exception' => $exception,
            ]);

            return back()->withInput()->with('error', 'Unable to send message right now. Please try again.');
        }

        return back();
    }

    public function createConversation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'room' => ['required', 'string', 'regex:/^Room\s(0[1-9]|1[0-5])$/'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        try {
            Conversation::query()->create([
                'name' => $validated['name'],
                'room' => $validated['room'],
                'message' => $validated['message'] ?: 'New conversation started.',
                'time' => now()->format('g:i A'),
                'unread' => false,
            ]);
        } catch (Throwable $exception) {
            Log::error('Failed to create conversation.', [
                'room' => $validated['room'],
                'user_id' => $request->user()?->id,
                'exception' => $exception,
            ]);

            return back()->withInput()->with('error', 'Unable to create conversation right now. Please try again.');
        }

        return back();
    }

    public function broadcast(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $message = trim($validated['message']);

        if ($message === '') {
            return back()->withInput()->with('error', 'Broadcast message cannot be empty.');
        }

        try {
            Conversation::query()->update([
                'message' => $message,
                'time' => now()->format('g:i A'),
                'unread' => true,
            ]);
            // Send email copy to all active tenants (best-effort)
            try {
                $this->activeTenantQuery()->get()->each(function (Tenant $tenant) use ($message) {
                    if ($tenant->email) {
                        SendTenantMessageEmail::dispatch(
                            $tenant->email,
                            'Broadcast from Apartment Admin',
                            $message
                        );
                    }
                });
            } catch (Throwable $e) {
                Log::warning('Failed to queue broadcast emails to tenants.', ['exception' => $e]);
            }
        } catch (Throwable $exception) {
            Log::error('Failed to broadcast message.', [
                'message_length' => strlen($message),
                'user_id' => $request->user()?->id,
                'exception' => $exception,
            ]);

            return back()->withInput()->with('error', 'Unable to broadcast message right now. Please try again.');
        }

        return back();
    }

    public function deleteConversation(Conversation $conversation): RedirectResponse
    {
        try {
            $conversation->delete();
        } catch (Throwable $exception) {
            Log::error('Failed to delete conversation.', [
                'conversation_id' => $conversation->id,
                'user_id' => request()->user()?->id,
                'exception' => $exception,
            ]);

            return back()->with('error', 'Unable to delete this conversation right now. Please try again.');
        }

        return back()->with('success', 'Conversation deleted.');
    }

    private function createTenantFromReservation(Reservation $reservation): Tenant
    {
        $tenant = Tenant::query()->create([
            'room_id' => $reservation->room_id,
            'name' => $reservation->name,
            'gender' => 'Male',
            'contact' => $reservation->contact,
            'optional_contact' => null,
            'email' => $reservation->email,
            'downpayment' => $reservation->downpayment,
            'payment_type' => $reservation->payment_type,
            'gcash_number' => $reservation->gcash_number,
            'check_in_date' => $reservation->check_in_date,
            'check_out_date' => $reservation->check_out_date,
        ]);

        $reservation->delete();

        return $tenant;
    }

    private function ensureRooms(): void
    {
        $defaultRoomCount = max((int) config('app.apartment_default_room_count', 15), 1);

        for ($index = 1; $index <= $defaultRoomCount; $index++) {
            Room::query()->firstOrCreate(
                ['number' => 'Room '.str_pad((string) $index, 2, '0', STR_PAD_LEFT)],
                ['occupied' => $index <= 12],
            );
        }

        // Assign room photos automatically if images are available in public/images/photos.
        // Every 15 rooms will use the same photo (user-provided mapping requirement).
        $photoDir = public_path('images/photos');
        if (is_dir($photoDir)) {
            $files = array_values(array_map('basename', glob($photoDir.'/*.*')));
            $photoCount = count($files);

            if ($photoCount > 0) {
                $rooms = Room::query()
                    ->orderByRaw($this->roomNumberOrderSql())
                    ->get();

                foreach ($rooms as $idx => $room) {
                    // photo group index: every 15 rooms share the same photo
                    $groupIndex = (int) floor($idx / 15);
                    $photoIndex = $groupIndex % $photoCount;

                    if (empty($room->photo_path)) {
                        $room->update(['photo_path' => 'images/photos/'.$files[$photoIndex]]);
                    }
                }
            }
        }
    }

    private function ensureConversations(): void
    {
        $tenants = $this->activeTenantQuery()->with('room:id,number')->get();

        if ($tenants->isEmpty()) {
            return;
        }

        $existingConversations = Conversation::query()->get()->keyBy('room');
        $timestamp = now()->format('g:i A');

        foreach ($tenants as $tenant) {
            $roomNumber = $tenant->room?->number ?? '';

            if (! $roomNumber) {
                continue;
            }

            $conversation = $existingConversations->get($roomNumber);

            if ($conversation) {
                if ($conversation->name !== $tenant->name) {
                    $conversation->update([
                        'name' => $tenant->name,
                    ]);
                }
                continue;
            }

            Conversation::query()->create([
                'name' => $tenant->name,
                'room' => $roomNumber,
                'message' => 'No messages yet.',
                'time' => $timestamp,
                'unread' => false,
            ]);
        }
    }

    private function roomCode(string $roomNumber): string
    {
        return trim(str_replace('Room ', '', $roomNumber));
    }
}
