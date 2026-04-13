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
    public function reservation(): Response
    {
        $this->ensureRooms();

        return Inertia::render('reservation', [
            'rooms' => Room::query()
                ->orderBy('number')
                ->get(['id', 'number', 'occupied']),
        ]);
    }

    public function toggleRoom(Room $room): RedirectResponse
    {
        $room->update([
            'occupied' => ! $room->occupied,
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
        if (Room::query()->exists()) {
            return;
        }

        $defaultRooms = [
            ['number' => 'Room 10', 'occupied' => true],
            ['number' => 'Room 11', 'occupied' => true],
            ['number' => 'Room 12', 'occupied' => true],
            ['number' => 'Room 13', 'occupied' => true],
            ['number' => 'Room 14', 'occupied' => true],
            ['number' => 'Room 15', 'occupied' => false],
        ];

        Room::query()->insert($defaultRooms);
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
