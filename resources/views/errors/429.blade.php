<!doctype html>
<html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Too Many Requests</title>
        <style>
            body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#0f172a;color:#0f172a}
            .card{max-width:640px;margin:6vh auto;background:#fff;border-radius:8px;padding:28px;box-shadow:0 8px 24px rgba(2,6,23,0.12)}
            a.btn{display:inline-block;padding:8px 14px;background:#5f7f95;color:#fff;border-radius:6px;text-decoration:none;font-weight:600}
        </style>
    </head>
    <body>
        <div class="card">
            <h1>Too many attempts</h1>
            <p>You've made too many login attempts. Please wait a few minutes and try again.</p>
            <p><a class="btn" href="{{ route('login') }}">Back to login</a></p>
        </div>
    </body>
</html>
