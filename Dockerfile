# Multi-stage Dockerfile for Laravel app

# Stage 1: install PHP dependencies
FROM composer:2 AS composer_builder
RUN apk add --no-cache git unzip gmp-dev
RUN docker-php-ext-install gmp
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts
COPY . .
RUN composer dump-autoload --optimize --no-interaction
RUN APP_ENV=production APP_KEY=base64:0000000000000000000000000000000000000000000= php artisan wayfinder:generate --with-form

# Stage 2: build frontend
FROM node:20-bookworm-slim AS node_builder
ENV VITE_DISABLE_WAYFINDER=true
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
COPY --from=composer_builder /app/resources/js /app/resources/js
RUN npm run build

# Stage 3: runtime with php-fpm + nginx
FROM php:8.4-fpm-alpine AS runtime
ENV APP_ENV=production
ENV PORT=8080
ENV SESSION_DRIVER=file
ENV CACHE_STORE=file

# Install system deps and nginx
RUN apk add --no-cache nginx bash git icu-libs tzdata libzip libpng oniguruma curl zip libstdc++ sqlite-dev gmp \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev libzip-dev zlib-dev libpng-dev oniguruma-dev gmp-dev \
    && docker-php-ext-install pdo_mysql pdo_sqlite zip intl opcache gmp \
    && apk del .build-deps || true

WORKDIR /var/www/html

# copy app code + vendor + built frontend
COPY --from=composer_builder /app /var/www/html
COPY --from=node_builder /app/public/build /var/www/html/public/build

# nginx config will be copied from repo path docker/nginx.conf
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache /run/nginx \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

EXPOSE 8080

# Start php-fpm (daemon) and nginx in foreground
CMD php -r "file_exists('database/database.sqlite') || touch('database/database.sqlite');" || true && \
    php artisan migrate --force || true && \
    php artisan config:cache || true && \
    php artisan route:cache || true && \
    php artisan view:cache || true && \
    php-fpm -D && nginx -g 'daemon off;'