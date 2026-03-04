# Laravel + Vue SPA

A base application built with **Laravel 12** and **Vue 3** as a Single Page Application (SPA). It ships with session-based authentication via Laravel Sanctum and a full user management CRUD as a reference implementation.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend framework | Laravel 12 |
| Authentication | Laravel Sanctum (SPA / cookie-based) |
| Frontend framework | Vue 3 (`<script setup>`) |
| State management | Pinia |
| Routing (client) | Vue Router 5 |
| UI / CSS | Bootstrap 5 + Bootstrap Icons |
| Build tool | Vite |
| Database | MySQL |

---

## Features

- **Authentication** — Login / logout with session cookies managed by Sanctum. All pages require authentication; the login page redirects already-authenticated users away.
- **Vue Router guards** — Session is restored on first page load; unauthenticated users are redirected to `/login` automatically.
- **User CRUD** — Create, read, update, and delete users with full frontend and backend validation.
- **Responsive layout** — Bootstrap 5 sidebar that collapses to an off-canvas drawer on mobile.
- **Reusable component library** — `FormInput`, `AppButton`, `BaseModal`, `ConfirmModal`, and index table components used throughout.

---

## Requirements

- PHP **8.2+**
- Composer
- Node.js **18+** & npm
- MySQL **8+**

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone <repository-url> laravel-app
cd laravel-app
```

### 2. Install PHP dependencies

```bash
composer install
```

### 3. Install Node dependencies

```bash
npm install
```

### 4. Configure environment

```bash
cp .env.example .env
php artisan key:generate
```

Open `.env` and update the database credentials:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_app
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
```

Also ensure the following session values are set correctly for local development:

```dotenv
SESSION_DRIVER=database
SESSION_DOMAIN=
SESSION_SECURE_COOKIE=false
```

> **Note:** `SESSION_DOMAIN` should be left **blank** (not `null`) for local development on `localhost`.

### 5. Run migrations

```bash
php artisan migrate
```

### 6. Start the development servers

The project uses `concurrently` to run all required processes in one command:

```bash
composer dev
```

This starts:
- `php artisan serve` — Laravel backend at `http://localhost:8000`
- `npm run dev` — Vite HMR dev server
- `php artisan queue:listen` — Queue worker
- `php artisan pail` — Log viewer

Visit **http://localhost:8000** in your browser.

### 7. Create your first user

Use Tinker to seed an initial user so you can log in:

```bash
php artisan tinker
```

```php
\App\Models\User::create([
    'first_name' => 'Your',
    'last_name'  => 'Name',
    'email'      => 'you@example.com',
    'password'   => bcrypt('password'),
]);
```

---

## Building for Production

```bash
npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

---

## Running Tests

```bash
composer test
```

Or directly with PHPUnit:

```bash
php artisan test
```

---

## Project Structure

```
app/
  Http/
    Controllers/Api/   # AuthController, UserController
    Requests/          # StoreUserRequest, UpdateUserRequest
    Resources/         # UserResource
  Models/              # User
resources/
  js/
    components/        # Reusable Vue components (layout, forms, modals, table)
    composables/       # useNavItems, useUsers
    pages/             # DashboardPage, UsersPage, LoginPage, ...
    router/            # Vue Router config with auth guards
    stores/            # Pinia stores (useAuthStore)
  views/
    app.blade.php      # SPA entry point
routes/
  api.php              # REST API routes (protected by auth:sanctum)
  web.php              # Catch-all route that serves the SPA
```
