#!/bin/sh
set -e

echo "=== STARTUP DIAGNOSTICS ==="
echo "--- PHP version ---"
php -v || true

echo "--- Composer platform_check (if present) ---"
if [ -f /var/www/html/vendor/composer/platform_check.php ]; then
  sed -n '1,120p' /var/www/html/vendor/composer/platform_check.php || true
else
  echo "(no platform_check.php)"
fi

echo "--- .env presence ---"
ls -la /var/www/html/.env || true

echo "--- public/index.php presence ---"
ls -la /var/www/html/public/index.php || true

echo "--- public/build listing ---"
ls -la /var/www/html/public/build || true

echo "--- nginx error log (last 200 lines) ---"
if [ -f /var/log/nginx/error.log ]; then
  tail -n 200 /var/log/nginx/error.log || true
else
  echo "(no /var/log/nginx/error.log yet)"
fi

echo "--- Recent Laravel logs ---"
mkdir -p /var/www/html/storage/logs || true
touch /var/www/html/storage/logs/laravel.log || true
tail -n 200 /var/www/html/storage/logs/laravel.log || true

echo "=== INIT APP ==="
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');" || true
# Ensure laravel storage and cache dirs exist and are writable
mkdir -p /var/www/html/bootstrap/cache /var/www/html/storage/framework /var/www/html/storage/logs || true
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

# Run migrations (non-fatal)
php artisan migrate --force || true
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

echo "=== STARTING SERVICES ==="
php artisan queue:work --queue=default --sleep=3 --tries=3 --timeout=90 >/var/www/html/storage/logs/queue-worker.log 2>&1 &
php-fpm -D
nginx -g 'daemon off;'
