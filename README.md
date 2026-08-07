# Apartment Reservation System

A Laravel-based room reservation system for coursework and demonstrations. Features include user registration, email OTP verification for registration/login, room reservations, an admin panel, and reservation management.

## Features
- User registration with email OTP verification
- Email OTP on login (if enabled)
- Room listing, reservation creation, and reservation management
- Admin panel for managing rooms and bookings
- Demo/test accounts for review

## Requirements
- PHP >= 8.0
- Composer
- MySQL
- Node.js & npm
- SMTP provider or Mailtrap for OTP testing

## Installation
1. Clone the repository
2. Run `composer install`
3. Copy `.env.example` to `.env`
4. Set database and mail settings
5. Run `php artisan key:generate`
6. Run `php artisan migrate --seed`
7. Run `npm install` and `npm run dev` if needed
8. Start the app with `php artisan serve`

## Mail / OTP setup
Use Mailtrap or a real SMTP provider for OTP emails.

Example:
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=example@example.com
MAIL_FROM_NAME="${APP_NAME}"

If testing locally without SMTP, use:
MAIL_MAILER=log

## Demo accounts
- Email: demo@example.com
- Password: secret123

- Email: admin@example.com
- Password: adminpassword

## OTP verification
1. Register or log in with the demo account
2. Check Mailtrap or `storage/logs/laravel.log`
3. Enter the OTP to continue

## Seeder example
Create `database/seeders/UserSeeder.php` and register it in `DatabaseSeeder.php`.

## Running tests
`php artisan test`

## Notes
- Do not commit `.env`
- Include `.env.example` in the repo
- Make sure SMTP settings are correct before deployment
