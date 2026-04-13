<?php

namespace App\Http\Controllers;

use App\Models\Conversation;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ApartmentModuleController extends Controller
{
    public function dashboard(): Response
    {
        $this->ensureRooms();

        $totalRooms = Room::query()->count();
        $occupiedRooms = Room::query()->where('occupied', true)->count();
        $availableRooms = max($totalRooms - $occupiedRooms, 0);
        $collectionRate = $totalRooms > 0
            ? round(($occupiedRooms / $totalRooms) * 100, 1)
            : 0;

        return Inertia::render('dashboard', [
            'stats' => [
                'total_rooms' => $totalRooms,
                'occupied' => $occupiedRooms,
                'available' => $availableRooms,
                'collection_rate' => $collectionRate,
            ],
        ]);
    }

    public function tenantManagement(): Response
    {
        $this->ensureRooms();

        return Inertia::render('tenant-management', [
            'roomLimit' => Room::query()->count(),
        ]);
    }

    public function reservation(): Response
    {
        $this->ensureRooms();

        $rooms = Room::query()
            ->select(['id', 'number', 'occupied'])
            ->orderByRaw("CAST(REPLACE(number, 'Room ', '') AS UNSIGNED)")
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('reservation', [
            'rooms' => $rooms,
        ]);
    }

    public function toggleRoom(Request $request, Room $room): RedirectResponse
    {
        $requestedOccupied = $request->boolean('occupied', ! $room->occupied);

        $room->update([
            'occupied' => $requestedOccupied,
        ]);

        return back();
    }

    public function communication(): Response
    {
        $this->ensureConversations();

        return Inertia::render('communication', [
            'conversations' => Conversation::query()
                ->orderBy('id')
                ->get(['id', 'name', 'room', 'message', 'time', 'unread']),
        ]);
    }

    public function openConversation(Conversation $conversation): RedirectResponse
    {
        $conversation->update([
            'unread' => false,
        ]);

        return back();
    }

    public function sendMessage(Request $request, Conversation $conversation): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['required', 'string', 'max:1000'],
        ]);

        $conversation->update([
            'message' => $validated['message'],
            'time' => now()->format('g:i A'),
            'unread' => false,
        ]);

        return back();
    }

    public function createConversation(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:3', 'max:100'],
            'room' => ['required', 'string', 'regex:/^Room\s(0[1-9]|1[0-5])$/'],
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        Conversation::query()->create([
            'name' => $validated['name'],
            'room' => $validated['room'],
            'message' => $validated['message'] ?: 'New conversation started.',
            'time' => now()->format('g:i A'),
            'unread' => false,
        ]);

        return back();
    }

    public function broadcast(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:1000'],
        ]);

        $message = $validated['message'] ?: 'Admin broadcast sent. Please check your latest announcements.';

        Conversation::query()->update([
            'message' => $message,
            'time' => now()->format('g:i A'),
            'unread' => true,
        ]);

        return back();
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
    }

    private function ensureConversations(): void
    {
        if (Conversation::query()->exists()) {
            return;
        }

        $defaultConversations = [
            [
                'name' => 'Martina Garcia',
                'room' => 'Room 15',
                'message' => 'Hello, I have a question about the electricit...',
                'time' => '10:30 AM',
                'unread' => true,
            ],
            [
                'name' => 'John Santos',
                'room' => 'Room 10',
                'message' => 'The water heater in my room is not workin...',
                'time' => '11:15 AM',
                'unread' => true,
            ],
        ];

        Conversation::query()->insert($defaultConversations);
    }
}
