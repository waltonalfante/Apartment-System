@extends('app')

@section('content')
    <div style="min-height:80vh; display:flex; align-items:center; justify-content:center;">
        <div style="max-width:640px; width:90%; background:#ffffffcc; border-radius:8px; box-shadow:0 8px 24px rgba(0,0,0,0.12); padding:28px; text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#111827;font-weight:600">Too many attempts</h1>
            <p style="margin:10px 0 0;color:#6b7280">You've made too many login attempts. Please wait a few minutes and try again.</p>
            <div style="margin-top:18px;">
                <a href="{{ route('login') }}" style="display:inline-block;padding:8px 14px;background:#5f7f95;color:#fff;border-radius:6px;text-decoration:none;font-weight:600">Back to login</a>
            </div>
        </div>
    </div>
@endsection
