<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Services\AnnouncementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController extends Controller
{
    public function __construct(private readonly AnnouncementService $announcementService)
    {
    }

    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string'],
            'banner_image' => ['nullable', 'url'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'url'],
            'audience' => ['nullable', 'string', 'in:all,users,tenants,clients'],
        ]);

        $announcement = $this->announcementService->create($data, $request->user()?->id);
        $recipientCount = $this->announcementService->send($announcement);

        return response()->json([
            'message' => 'Announcement queued for sending.',
            'announcement' => $announcement->fresh(),
            'recipient_count' => $recipientCount,
        ]);
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Announcement::query()->latest()->get(),
        ]);
    }
}