<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\SendTenantMessageEmail;
use App\Mail\GenericNotificationMail;
use App\Models\User;
use App\Services\EmailLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class EmailController extends Controller
{
    public function __construct(private readonly EmailLogService $emailLogService)
    {
    }

    public function send(Request $request): JsonResponse
    {
        $data = $request->validate([
            'to' => ['required', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'cta_label' => ['nullable', 'string', 'max:100'],
            'cta_url' => ['nullable', 'url'],
            'banner_url' => ['nullable', 'url'],
        ]);

        Mail::to($data['to'])->queue(new GenericNotificationMail(
            $data['subject'],
            $data['message'],
            $data['cta_label'] ?? null,
            $data['cta_url'] ?? null,
            $data['banner_url'] ?? null,
        ));

        $user = User::query()->where('email', $data['to'])->first();

        $this->emailLogService->queued($user?->id, $data['to'], $data['subject'], 'notification', $data);

        return response()->json([
            'message' => 'Email queued successfully.',
        ]);
    }

    public function sendAnnouncement(Request $request): JsonResponse
    {
        return app(AnnouncementController::class)->send($request);
    }

    public function sendTenantMessage(Request $request): JsonResponse
    {
        $data = $request->validate([
            'tenant_email' => ['required', 'email'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        SendTenantMessageEmail::dispatch($data['tenant_email'], $data['subject'], $data['message']);

        return response()->json([
            'message' => 'Tenant message queued successfully.',
        ]);
    }
}