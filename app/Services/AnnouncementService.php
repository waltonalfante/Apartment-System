<?php

namespace App\Services;

use App\Mail\GenericNotificationMail;
use App\Models\Announcement;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Mail;

class AnnouncementService
{
    public function __construct(private readonly EmailLogService $emailLogService)
    {
    }

    public function create(array $data, ?int $createdBy = null): Announcement
    {
        return Announcement::create([
            'created_by' => $createdBy,
            'subject' => $data['subject'],
            'body' => $data['body'],
            'banner_image' => $data['banner_image'] ?? null,
            'cta_label' => $data['cta_label'] ?? null,
            'cta_url' => $data['cta_url'] ?? null,
            'audience' => $data['audience'] ?? 'all',
            'status' => 'draft',
            'meta' => $data['meta'] ?? null,
        ]);
    }

    public function send(Announcement $announcement): int
    {
        $recipients = $this->recipientsForAudience($announcement->audience);

        foreach ($recipients as $recipient) {
            Mail::to($recipient)->queue(new GenericNotificationMail(
                $announcement->subject,
                $announcement->body,
                ctaLabel: $announcement->cta_label,
                ctaUrl: $announcement->cta_url,
                bannerUrl: $announcement->banner_image,
            ));

            $this->emailLogService->queued($announcement->created_by, $recipient, $announcement->subject, 'announcement', [
                'announcement_id' => $announcement->id,
                'audience' => $announcement->audience,
            ]);
        }

        $announcement->forceFill([
            'status' => 'sent',
            'sent_at' => now(),
        ])->save();

        return $recipients->count();
    }

    public function recipientsForAudience(string $audience): Collection
    {
        $emails = collect();

        if ($audience === 'all' || $audience === 'users') {
            $emails = $emails->merge(User::query()->whereNotNull('email')->pluck('email'));
        }

        if ($audience === 'all' || $audience === 'tenants' || $audience === 'clients') {
            $emails = $emails->merge(Tenant::query()->whereNotNull('email')->pluck('email'));
        }

        return $emails->filter()->unique()->values();
    }
}