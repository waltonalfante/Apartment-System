<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { margin: 0; padding: 0; background: #f4f7fb; font-family: Arial, Helvetica, sans-serif; color: #223044; }
        .shell { width: 100%; padding: 32px 16px; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08); }
        .banner { width: 100%; display: block; }
        .content { padding: 32px; }
        .title { margin: 0 0 16px; font-size: 24px; line-height: 1.3; }
        .text { margin: 0 0 16px; font-size: 15px; line-height: 1.7; color: #43546a; }
        .muted { color: #6b7280; font-size: 12px; line-height: 1.6; }
        .cta { display: inline-block; margin: 16px 0 0; padding: 12px 20px; border-radius: 10px; background: #2d6cdf; color: #fff !important; text-decoration: none; font-weight: bold; }
        .code-box { background: #eef4ff; border: 1px solid #c5d7ff; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
        .code { font-size: 34px; letter-spacing: 6px; font-weight: 700; color: #1d4ed8; font-family: monospace; }
        .footer { text-align: center; padding: 18px 32px 30px; color: #94a3b8; font-size: 12px; }
    </style>
</head>
<body>
    <div class="shell">
        <div class="card">
            @if(! empty($bannerUrl ?? null))
                <img class="banner" src="{{ $bannerUrl }}" alt="Banner">
            @endif

            <div class="content">
                @yield('content')
            </div>

            <div class="footer">
                Apartment Management System
            </div>
        </div>
    </div>
</body>
</html>