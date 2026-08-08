# Multi-stage Dockerfile for Laravel app

# Stage 1: build frontend
FROM node:18-alpine AS node_builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2: install PHP dependencies
FROM composer:2 AS composer_builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts
COPY . .
RUN composer dump-autoload --optimize --no-interaction

# Stage 3: runtime with php-fpm + nginx
FROM php:8.2-fpm-alpine AS runtime
ENV APP_ENV=production
ENV PORT=8080

# Install system deps and nginx
RUN apk add --no-cache nginx bash git icu-libs tzdata libzip libpng oniguruma curl zip libstdc++ \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev libzip-dev zlib-dev libpng-dev oniguruma-dev \
    && docker-php-ext-install pdo_mysql zip intl opcache \
    && apk del .build-deps || true

WORKDIR /var/www/html

# copy app code + vendor + built frontend
COPY --from=composer_builder /app /var/www/html
COPY --from=node_builder /app/public/build /var/www/html/public/build

# nginx config will be copied from repo path docker/nginx.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache /run/nginx \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

EXPOSE 8080

# Start php-fpm (daemon) and nginx in foreground
CMD php artisan key:generate --force || true && \
    php artisan config:cache || true && \
    php artisan route:cache || true && \
    php artisan view:cache || true && \
    php-fpm -D && nginx -g 'daemon off;'
