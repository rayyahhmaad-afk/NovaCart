# JD.id Project

Proyek ini terdiri dari dua bagian: `backend` (Laravel 11) dan `frontend` (React + Vite + Tailwind CSS).

## Prasyarat
- PHP 8.2+ & Composer
- Node.js & npm
- Database Server (MySQL / PostgreSQL / SQLite)

## Struktur Folder
- `/backend` - API yang dibangun menggunakan Laravel 11 (dengan konfigurasi API-only dan Sanctum untuk Auth).
- `/frontend` - Aplikasi web frontend yang dibangun menggunakan React (Vite) dan Tailwind CSS. Struktur sudah disiapkan (`src/pages`, `src/components`, `src/services`, `src/context`).

## Cara Menjalankan Secara Lokal

### 1. Setup Backend
Masuk ke folder backend:
```bash
cd backend
```
Copy file environment (sesuaikan konfigurasi koneksi database Anda di `.env` jika diperlukan):
```bash
cp .env.example .env
```
*(Catatan: `.env.example` sudah digenerate otomatis oleh Laravel)*

Install dependencies (biasanya sudah terinstall otomatis setelah setup):
```bash
composer install
```
Generate app key dan jalankan migrasi:
```bash
php artisan key:generate
php artisan migrate
```
Jalankan development server:
```bash
php artisan serve
```
*Server backend secara default akan berjalan di `http://127.0.0.1:8000`*

### 2. Setup Frontend
Buka terminal baru, dan masuk ke folder frontend:
```bash
cd frontend
```
Copy file environment:
```bash
cp .env.example .env
```
Install dependencies:
```bash
npm install
```
Jalankan development server:
```bash
npm run dev
```
*Frontend akan berjalan dan menampilkan link localhost (biasanya `http://localhost:5173`)*
