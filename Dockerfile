# Multi-stage Dockerfile for Laravel app

<<<<<<< HEAD
# Stage 1: build frontend
FROM node:18-alpine AS node_builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build

# Stage 2: install PHP dependencies
FROM composer:2 AS composer_builder
=======
# Stage 1: install PHP dependencies
FROM composer:2 AS composer_builder
RUN apk add --no-cache git unzip gmp-dev
RUN docker-php-ext-install gmp
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts
COPY . .
RUN composer dump-autoload --optimize --no-interaction
<<<<<<< HEAD

# Stage 3: runtime with php-fpm + nginx
FROM php:8.2-fpm-alpine AS runtime
ENV APP_ENV=production
ENV PORT=8080

# Install system deps and nginx
RUN apk add --no-cache nginx bash git icu-libs tzdata libzip libpng oniguruma curl zip libstdc++ \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev libzip-dev zlib-dev libpng-dev oniguruma-dev \
    && docker-php-ext-install pdo_mysql zip intl opcache \
=======
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

# Install system deps and nginx, plus PostgreSQL client/dev for pdo_pgsql
RUN apk add --no-cache nginx bash git icu-libs tzdata libzip libpng oniguruma curl zip libstdc++ sqlite-dev gmp postgresql-libs \
    && apk add --no-cache --virtual .build-deps $PHPIZE_DEPS icu-dev libzip-dev zlib-dev libpng-dev oniguruma-dev gmp-dev postgresql-dev \
    && docker-php-ext-install pdo_mysql pdo_sqlite pdo_pgsql zip intl opcache gmp \
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
    && apk del .build-deps || true

WORKDIR /var/www/html

# copy app code + vendor + built frontend
COPY --from=composer_builder /app /var/www/html
COPY --from=node_builder /app/public/build /var/www/html/public/build

<<<<<<< HEAD
# nginx config will be copied from repo path docker/nginx.conf
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
=======
# Ensure an .env file exists so artisan commands that edit .env won't fail
RUN cd /var/www/html && [ -f .env ] || cp .env.example .env || true

# nginx config will be copied from repo path docker/nginx.conf
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# copy startup script and make executable
COPY docker/start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh || true
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db

RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache /run/nginx \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache || true

EXPOSE 8080

<<<<<<< HEAD
# Start php-fpm (daemon) and nginx in foreground
CMD php artisan key:generate --force || true && \
    php artisan config:cache || true && \
    php artisan route:cache || true && \
    php artisan view:cache || true && \
    php-fpm -D && nginx -g 'daemon off;'
=======
# Start via startup script that prints diagnostics then launches services
CMD ["/usr/local/bin/start.sh"]
>>>>>>> b476b0527c60937ff242b7414557e1e1c22dc7db
