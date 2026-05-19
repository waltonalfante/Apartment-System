<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class GenericNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $subjectLine,
        public string $bodyText,
        public ?string $ctaLabel = null,
        public ?string $ctaUrl = null,
        public ?string $bannerUrl = null,
    ) {
    }

    public function build(): self
    {
        return $this->subject($this->subjectLine)
            ->view('emails.generic')
            ->with([
                'subjectLine' => $this->subjectLine,
                'bodyText' => $this->bodyText,
                'ctaLabel' => $this->ctaLabel,
                'ctaUrl' => $this->ctaUrl,
                'bannerUrl' => $this->bannerUrl,
            ]);
    }
}