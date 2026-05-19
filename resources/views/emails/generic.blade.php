@extends('emails.layout')

@section('content')
    <h1 class="title">{{ $subjectLine }}</h1>

    <p class="text">{!! nl2br(e($bodyText)) !!}</p>

    @if(! empty($ctaUrl ?? null) && ! empty($ctaLabel ?? null))
        <a class="cta" href="{{ $ctaUrl }}">{{ $ctaLabel }}</a>
    @endif
@endsection