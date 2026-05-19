@extends('emails.layout')

@section('content')
    <h1 class="title">{{ $heading ?? 'Verification Code' }}</h1>

    <p class="text">{{ $intro ?? 'Use the code below to continue signing in or verify your account.' }}</p>

    <div class="code-box">
        <div class="code">{{ $code }}</div>
    </div>

    <p class="text muted">This code expires in {{ $expiresInMinutes ?? 10 }} minutes.</p>

    @if(! empty($ctaUrl ?? null) && ! empty($ctaLabel ?? null))
        <a class="cta" href="{{ $ctaUrl }}">{{ $ctaLabel }}</a>
    @endif

    <p class="text muted">If you did not request this email, you can ignore it.</p>
@endsection