<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Message</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #243044;">
    <div style="max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="margin-bottom: 8px;">You've received a message</h2>
        <p style="color: #6b7280; font-size: 14px;">This is a copy of a message sent to you via your apartment management dashboard.</p>
        <div style="margin-top: 16px; padding: 12px; border-radius: 6px; background: #f8fafc;">
            <p style="white-space: pre-wrap;">{{ $bodyText }}</p>
        </div>
        <p style="margin-top: 16px; font-size: 12px; color: #9ca3af;">If you believe you received this message in error, please contact your apartment administrator.</p>
    </div>
</body>
</html>
