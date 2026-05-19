<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TwoFactorCode extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $code,
        public string $subjectLine = 'Your Apartment Verification Code',
        public string $heading = 'Verification Code',
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subjectLine,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.otp',
            with: [
                'code' => $this->code,
                'heading' => $this->heading,
                'intro' => 'Use the code below to continue or verify your account.',
                'expiresInMinutes' => 10,
            ],
        );
    }
    
    public function build(): self
    {
        return $this->subject($this->subjectLine)
            ->view('emails.otp')
            ->with([
                'code' => $this->code,
                'heading' => $this->heading,
                'intro' => 'Use the code below to continue signing in or verify your account.',
                'expiresInMinutes' => 10,
            ]);
    }
}
