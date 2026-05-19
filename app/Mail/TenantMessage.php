<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class TenantMessage extends Mailable
{
    use Queueable, SerializesModels;

    public string $subjectLine;
    public string $bodyText;

    /**
     * Create a new message instance.
     */
    public function __construct(string $subjectLine, string $bodyText)
    {
        $this->subjectLine = $subjectLine;
        $this->bodyText = $bodyText;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject($this->subjectLine)
            ->replyTo(config('mail.from.address'), config('mail.from.name'))
            ->view('emails.tenant_message')
            ->with([
                'bodyText' => $this->bodyText,
            ]);
    }
}
