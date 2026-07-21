# PRD — Code Quality Remediation Plan (E-Commerce Project)

## 1. Ringkasan

Dokumen ini merangkum hasil SonarQube scan dan rencana perbaikan untuk project e-commerce (Laravel backend + React frontend).

| Metrik | Hasil | Target |
|---|---|---|
| Reliability | A (23 issue) | Pertahankan A, kurangi jumlah issue |
| Maintainability | A (37 issue) | Pertahankan A, kurangi jumlah issue |
| Security | C (2 issue) | Naikkan ke A |
| Security Hotspots Reviewed | 100% | Pertahankan 100% |
| Coverage | - (belum ada unit test) | Minimal 60-70% pada modul kritis |
| Duplications | 1.1% | Pertahankan di bawah 3% |

Prioritas perbaikan: **Security > Reliability > Maintainability > Coverage**.

---

## 2. Task List — Prioritas Tinggi (Security)

### TASK-01 — Tambahkan lock file dependency (backend/package.json)
- **Masalah**: Versi dependency tidak predictable karena tidak ada lock file (package-lock.json/yarn.lock/pnpm-lock.yaml).
- **Perbaikan**: Jalankan `npm install` (atau `yarn install`/`pnpm install`) di direktori backend dan commit file lock yang dihasilkan ke repository.
- **Effort**: 5 menit
- **Severity**: Major (Security)

### TASK-02 — Sanitasi data sebelum disimpan ke browser storage (frontend/src/context/AuthContext.jsx, L29)
- **Masalah**: Tainted data ditulis ke localStorage/sessionStorage tanpa sanitasi — berpotensi XSS/data injection.
- **Perbaikan**:
  - Validasi & sanitasi payload (misalnya token/user object) sebelum `localStorage.setItem()`.
  - Pastikan hanya menyimpan field yang diperlukan (jangan seluruh response API mentah).
  - Pertimbangkan menyimpan token di HttpOnly cookie alih-alih localStorage untuk keamanan lebih baik (perlu penyesuaian backend CORS/cookie).
- **Effort**: 20 menit
- **Severity**: Minor (Security), tapi berdampak besar → prioritaskan

---

## 3. Task List — Reliability

### TASK-03 — Ganti exception generik dengan exception khusus (backend/app/Http/Controllers/OrderController.php, L43)
- **Perbaikan**: Buat custom exception class (misal `OrderProcessingException extends Exception`) dan lempar exception tersebut alih-alih `Exception` generik. Tambahkan exception handler di `app/Exceptions/Handler.php` jika perlu response format khusus.
- **Effort**: 20 menit

### TASK-04 — Tambahkan atribut `type` eksplisit pada elemen `<button>` (multiple files)
- **File terdampak**: `App.jsx` (L35), `AdminPanel.jsx` (L63, L214, L215, L297, L298), `Cart.jsx` (L83, L85, L87, L103), `OrderHistory.jsx` (L122, L151), `ProductDetail.jsx` (L137)
- **Masalah**: Button tanpa `type` eksplisit bisa memicu submit form yang tidak diinginkan.
- **Perbaikan**: Tambahkan `type="button"` pada semua tombol yang bukan submit form, dan `type="submit"` pada tombol yang memang untuk submit.
- **Effort**: ~2 menit/file × 10 lokasi ≈ 20 menit total

### TASK-05 — Perbaiki form label yang tidak terhubung ke kontrol (frontend/src/pages/Catalog.jsx, L62)
- **Perbaikan**: Tambahkan atribut `htmlFor` pada `<label>` yang cocok dengan `id` elemen input terkait, atau bungkus input di dalam `<label>`.
- **Effort**: 5 menit

---

## 4. Task List — Maintainability (Code Smell)

### TASK-06 — Kurangi jumlah return statement (backend/app/Http/Controllers/ReviewController.php, L23)
- **Masalah**: Method memiliki 5 return, melebihi batas 3.
- **Perbaikan**: Refactor logika percabangan — gunakan pola *early return* yang lebih sederhana, atau ekstrak sebagian logika ke method/helper terpisah.
- **Effort**: 20 menit

### TASK-07 — Hapus kode yang di-comment out
- **File**: `backend/app/Models/User.php` (L5), `backend/tests/Feature/ExampleTest.php` (L5)
- **Perbaikan**: Hapus baris kode yang di-comment; gunakan git history jika suatu saat perlu dilihat kembali.
- **Effort**: 5 menit/file

### TASK-08 — Hapus parameter fungsi yang tidak dipakai (backend/bootstrap/app.php, L15)
- **Perbaikan**: Hapus parameter `$middleware` yang tidak digunakan dari signature fungsi, atau gunakan `_` sebagai penanda intentionally-unused jika API mengharuskan parameter tetap ada.
- **Effort**: 5 menit

### TASK-09 — Definisikan konstanta untuk literal string yang berulang
- **File & literal**:
  - `backend/config/cache.php` (L52) — `"framework/cache/data"` (3×)
  - `backend/config/database.php` (L50) — `"127.0.0.1"` (5×)
  - `backend/config/logging.php` (L63) — `"logs/laravel.log"` (3×)
  - `backend/database/seeders/ProductSeeder.php` (L24) — `"1TB SSD"` (3×)
  - `backend/routes/api.php` (L15) — `"/products"` (3×)
- **Perbaikan**: Definisikan sebagai konstanta (`const`) atau gunakan environment variable (khusus untuk `config/database.php`, sebaiknya pastikan nilai `127.0.0.1` memang berasal dari `env('DB_HOST', '127.0.0.1')`, bukan hardcode berulang).
- **Effort**: 8-12 menit/file

### TASK-10 — Hapus assignment variabel yang tidak terpakai (frontend/src/components/ProtectedRoute.jsx, L5)
- **Perbaikan**: Hapus assignment ke variabel `user` yang tidak pernah dipakai, atau gunakan jika memang dibutuhkan untuk logika proteksi route.
- **Effort**: 1-5 menit

### TASK-11 — Bungkus value Context Provider dengan `useMemo` (frontend/src/context/AuthContext.jsx, L45)
- **Masalah**: Object value provider berubah setiap render, menyebabkan re-render tidak perlu pada semua consumer.
- **Perbaikan**:
```jsx
const value = useMemo(() => ({ user, login, logout, ... }), [user]);
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
```
- **Effort**: 5 menit

### TASK-12 — Hapus import yang tidak dipakai
- **File**: `frontend/src/pages/AdminPanel.jsx` (L5 — `Save`), `frontend/src/pages/OrderHistory.jsx` (L3 — `useAuth`)
- **Perbaikan**: Hapus baris import yang tidak digunakan.
- **Effort**: 1 menit/file

### TASK-13 — Gunakan optional chaining (`?.`) alih-alih pengecekan manual
- **File**: `AdminPanel.jsx` (L19, L35)
- **Perbaikan**: Ganti pola `obj && obj.prop` menjadi `obj?.prop`.
- **Effort**: 5 menit/lokasi

### TASK-14 — Gunakan `Number.parseInt`/`Number.parseFloat` alih-alih global `parseInt`/`parseFloat`
- **File & lokasi**: `AdminPanel.jsx` (L94, L140, L294), `Catalog.jsx` (L129), `OrderHistory.jsx` (L117, L141), `ProductDetail.jsx` (L103)
- **Perbaikan**: Ganti semua pemanggilan `parseInt(x)` → `Number.parseInt(x, 10)` (sertakan radix), dan `parseFloat(x)` → `Number.parseFloat(x)`.
- **Effort**: 2 menit/lokasi

### TASK-15 — Tangani exception yang di-catch, jangan dibiarkan kosong
- **File & lokasi**: `AdminPanel.jsx` (L118, L181, L186, L241, L246)
- **Perbaikan**: Tambahkan penanganan yang jelas di blok `catch` — minimal `console.error(error)` dan tampilkan notifikasi/error state ke user. Jangan biarkan blok catch kosong.
- **Effort**: 1 jam total (5 lokasi × ~10-12 menit)

### TASK-16 — Ekstrak nested ternary menjadi statement terpisah
- **File & lokasi**: `Catalog.jsx` (L111), `OrderHistory.jsx` (L91), `ProductDetail.jsx` (L145)
- **Perbaikan**: Ubah nested ternary menjadi if/else biasa atau fungsi helper kecil yang mengembalikan nilai, supaya lebih mudah dibaca.
- **Effort**: 5 menit/lokasi

### TASK-17 — Gunakan `new Array()` alih-alih `Array()`, dan hindari index array sebagai `key` di JSX
- **File & lokasi**: `Catalog.jsx` (L103-104), `ProductDetail.jsx` (L165-166)
- **Perbaikan**:
  - Ganti `Array(n)` → `new Array(n)`.
  - Ganti `key={index}` menjadi `key` berbasis id unik data (misal `key={item.id}`).
- **Effort**: 5 menit/lokasi

---

## 5. Task List — Coverage (Belum Ada Unit Test)

### TASK-18 — Setup testing framework & unit test dasar
- **Backend (Laravel)**: Gunakan PHPUnit (sudah built-in Laravel). Prioritaskan test untuk:
  - `OrderController` (proses checkout/order)
  - `ReviewController` (submit review)
  - Model relasi utama (`Product`, `Order`, `User`)
- **Frontend (React)**: Setup Vitest/Jest + React Testing Library. Prioritaskan test untuk:
  - `AuthContext` (login/logout flow)
  - `Cart.jsx` (tambah/hapus item, hitung total)
  - `ProtectedRoute.jsx` (redirect saat belum login)
- **Target awal**: Coverage minimal 50-60% pada modul-modul kritis di atas, bukan 100% menyeluruh (realistis untuk quick win).
- **Effort**: 1-2 hari (tergantung jumlah test case)

---

## 6. Ringkasan Prioritas Pengerjaan

| Prioritas | Task | Alasan |
|---|---|---|
| 1 | TASK-01, TASK-02 | Security — dampak langsung ke keamanan aplikasi |
| 2 | TASK-04, TASK-05 | Reliability — mencegah bug fungsional (form submit, aksesibilitas) |
| 3 | TASK-03, TASK-06 s.d. TASK-17 | Maintainability — code smell, tidak urgent tapi menumpuk jadi utang teknis |
| 4 | TASK-18 | Coverage — butuh waktu lebih lama, kerjakan setelah issue lain beres |

## 7. Definition of Done

- Seluruh issue Security (2 issue) selesai → Security rating naik dari C ke A.
- Seluruh issue Reliability (23 issue) selesai atau di-review dengan alasan jelas jika sengaja tidak diperbaiki (false positive).
- Minimal 80% issue Maintainability (37 issue) selesai.
- Coverage minimal tersedia untuk modul Auth, Cart, dan Order (modul paling kritis dari sisi bisnis).
- Re-scan SonarQube dijalankan ulang setelah semua task selesai untuk verifikasi rating naik.
