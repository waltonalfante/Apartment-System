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
# Ensure database sqlite exists (may not be used if using external DB)
php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');" || true

# If DB host does not resolve, fall back to SQLite at runtime to allow app to start
# This prevents startup failures when a configured Postgres host is DNS-unreachable.
if [ -n "$DB_HOST" ]; then
  RESOLVED=$(php -r "echo gethostbyname('$DB_HOST');" 2>/dev/null || echo "")
  if [ "$RESOLVED" = "$DB_HOST" ] || [ -z "$RESOLVED" ]; then
    echo "DB host '$DB_HOST' not resolvable; switching to SQLite fallback for startup"
    export DB_CONNECTION=sqlite
    export DB_DATABASE=/var/www/html/database/database.sqlite
    php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');" || true
  fi
fi
# Ensure laravel storage and cache dirs exist and are writable
mkdir -p /var/www/html/bootstrap/cache /var/www/html/storage/framework /var/www/html/storage/logs || true
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

# Generate an app key if none is configured, to prevent runtime encryption/session failures
if [ -z "$APP_KEY" ]; then
  echo "APP_KEY missing; generating one for runtime startup"
  php artisan key:generate --force || true
fi

# Run migrations (non-fatal)
php artisan migrate --force || true
# Clear any existing caches first to avoid stale config from earlier builds
php artisan config:clear || true
php artisan route:clear || true
php artisan view:clear || true
# Cache current configuration/routes/views for performance
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Stream Laravel logs to container stdout so Render logs include runtime exceptions
if [ -f /var/www/html/storage/logs/laravel.log ]; then
  tail -n 200 -f /var/www/html/storage/logs/laravel.log &
fi

echo "=== STARTING SERVICES ==="
php-fpm -D
# Ensure nginx listens on the runtime PORT (Render sets $PORT).
# Replace the hardcoded listen port in the default nginx conf with the runtime value.
if [ -n "$PORT" ]; then
  sed -i "s/listen 8080;/listen ${PORT};/g" /etc/nginx/http.d/default.conf || true
fi

nginx -g 'daemon off;'
