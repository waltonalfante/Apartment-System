<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

use Illuminate\Http\Request;
use Illuminate\Support\Str;

$email = $argv[1] ?? 'test@example.com';
$attempts = intval($argv[2] ?? 10);
$ip = $argv[3] ?? '127.0.0.1';

echo "Simulating {$attempts} failed logins for {$email} from {$ip}\n";

// Step 1: GET /login to obtain CSRF token and session cookies
$get = Request::create('/login', 'GET');
$get->server->set('REMOTE_ADDR', $ip);
$resp = $kernel->handle($get);

$html = $resp->getContent();

// extract CSRF token from hidden input or meta tag (Inertia apps often use meta csrf-token)
preg_match('/name="_token" value="([^"]+)"/', $html, $m);
$token = $m[1] ?? null;
if (! $token) {
    preg_match('/<meta[^>]+name=["\']csrf-token["\'][^>]+content=["\']([^"\']+)["\']/i', $html, $m2);
    $token = $m2[1] ?? null;
}

// Fallback: use the application's session CSRF token helper if still unavailable
if (! $token) {
    try {
        $token = function_exists('csrf_token') ? csrf_token() : ($app->make('session')->token() ?? null);
    } catch (\Throwable $e) {
        // ignore
    }
}

$cookies = [];
foreach ($resp->headers->getCookies() as $cookie) {
    $cookies[$cookie->getName()] = $cookie->getValue();
}

$cookieHeader = '';
foreach ($cookies as $k => $v) {
    $cookieHeader .= $k.'='.$v.'; ';
}

if (! $token) {
    echo "Failed to get CSRF token; GET /login returned status {$resp->getStatusCode()}\n";
    exit(1);
}

echo "CSRF token: ".substr($token,0,8)."...\n";
echo "Cookies: ".implode(', ', array_keys($cookies))."\n";

// Step 2: POST repeated wrong passwords
for ($i = 1; $i <= $attempts; $i++) {
    $post = Request::create('/login', 'POST', [
        'email' => $email,
        'password' => 'wrong-password',
    ]);
    // set CSRF header using XSRF-TOKEN cookie if available (decoded)
    if (isset($cookies['XSRF-TOKEN'])) {
        $post->headers->set('X-XSRF-TOKEN', urldecode($cookies['XSRF-TOKEN']));
    } elseif ($token) {
        $post->headers->set('X-XSRF-TOKEN', $token);
    }
    $post->headers->set('Cookie', rtrim($cookieHeader, '; '));
    $post->server->set('REMOTE_ADDR', $ip);

    $r = $kernel->handle($post);
    $status = $r->getStatusCode();
    echo "attempt {$i}: status {$status}";
    if ($status === 429) {
        echo " -> Too Many Requests\n";
        // print Retry-After header
        echo "Headers: ";
        foreach (['Retry-After','X-RateLimit-Limit','X-RateLimit-Remaining'] as $h) {
            if ($r->headers->has($h)) echo $h.': '.$r->headers->get($h).' '; 
        }
        echo "\n";
        break;
    }
    echo "\n";
}

// show attempts stored in cache key (best-effort)
try {
    $key = Str::transliterate(Str::lower($email).'|'.$ip);
    $attemptsNow = \Illuminate\Support\Facades\RateLimiter::attempts($key);
    echo "RateLimiter attempts for key {$key}: {$attemptsNow}\n";
} catch (\Throwable $e) {
    echo "Could not read RateLimiter attempts: ".$e->getMessage()."\n";
}

echo "Done.\n";
