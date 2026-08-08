<?php

namespace App\Jobs;

<<<<<<< HEAD
use App\Mail\TenantMessage;
=======
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
<<<<<<< HEAD
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
=======
use Illuminate\Support\Facades\Log;
use App\Services\ResendMailer;
use Illuminate\Support\Facades\View;
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db

class SendTenantMessageEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public string $tenantEmail;
    public string $subject;
    public string $message;

    /**
     * Create a new job instance.
     */
    public function __construct(string $tenantEmail, string $subject, string $message)
    {
        $this->tenantEmail = $tenantEmail;
        $this->subject = $subject;
        $this->message = $message;
        $this->onQueue('default');
        $this->tries = 3;
        $this->timeout = 60;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
<<<<<<< HEAD
            Mail::to($this->tenantEmail)
                ->send(new TenantMessage($this->subject, $this->message));
=======
            $html = View::make('emails.tenant_message', [
                'bodyText' => $this->message,
            ])->render();

            $sent = ResendMailer::sendHtml(
                $this->tenantEmail,
                '',
                $this->subject,
                $html,
            );

            if (! $sent) {
                throw new \RuntimeException('Resend failed to send tenant message email.');
            }
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
        } catch (\Exception $exception) {
            Log::error('Failed to send tenant message email.', [
                'tenant_email' => $this->tenantEmail,
                'exception' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Tenant message email job failed after retries.', [
            'tenant_email' => $this->tenantEmail,
            'subject' => $this->subject,
            'exception' => $exception->getMessage(),
        ]);
    }
}
