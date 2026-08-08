# Apartment Management System

A modern apartment management system built with Laravel, React, and Inertia.js.
This application helps manage rooms, track occupancy, and facilitate communication between residents and management.

## Features

- **User Authentication** - Secure login and registration with Laravel Fortify
- **Room Management** - Track apartment rooms and occupancy status
- **Conversations** - Messaging system for communication between residents and management
- **Admin Dashboard** - Centralized settings and system administration
- **Responsive Design** - Built with React and Tailwind CSS

## Tech Stack

- **Backend**: PHP 8.3+, Laravel 13
- **Frontend**: React 19, TypeScript, Inertia.js
- **Styling**: Tailwind CSS with Radix UI components
- **Database**: SQLite (development)
- **Build Tool**: Vite
- **Testing**: Pest (PHP), TypeScript type checking

## Requirements

- PHP 8.3 or higher
- Node.js 18+ with npm
- SQLite (or MySQL for production)
- Composer

## Installation

### 1. Clone the Repository
`git clone <repository-url>`
`cd apartment-system`

### 2. Install PHP Dependencies
`composer install`

### 3. Install JavaScript Dependencies
`npm install`

### 4. Configure Environment
`cp .env.example .env`
`php artisan key:generate`

### 5. Set Up Database
`php artisan migrate`

### 6. Build Frontend Assets
`npm run build`

## Running the Application

### Using XAMPP (Recommended for Windows)

1. Start XAMPP Services - Open XAMPP Control Panel and start Apache and MySQL
2. Configure hosts file at C:\Windows\System32\drivers\etc\hosts:
   `127.0.0.1  apartment-system.test`
3. Access at http://apartment-system.test/

### Using Laravel Sail (Docker)
`./vendor/bin/sail up`

## Development

### Watch Frontend Changes
`npm run dev`

### Code Quality
```
npm run format        # Format code
npm run lint          # Run linter with fixes
npm run types:check   # Check TypeScript types
php artisan test      # Run tests
```

## Mail / OTP notes

Use Mailtrap or a real SMTP provider for OTP emails.

Example:
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=example@example.com
MAIL_FROM_NAME="${APP_NAME}"
```

If testing locally without SMTP, use:
```
MAIL_MAILER=log
```

## Database Schema

- **users**: User accounts and authentication
- **rooms**: Apartment rooms with occupancy tracking
- **conversations**: Messaging between residents and management

## License

MIT License

