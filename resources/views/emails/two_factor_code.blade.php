@extends('emails.layout')

@section('content')
    <h1 class="title">{{ $heading ?? 'Verification Code' }}</h1>

    <p class="text">Use the code below to continue signing in or verify your account.</p>

    <div class="code-box">
        <div class="code">{{ $code }}</div>
    </div>

    <p class="text muted">This code expires in 10 minutes.</p>

    <p class="text muted">If you didn't request this code, you can safely ignore this message.</p>
@endsection
