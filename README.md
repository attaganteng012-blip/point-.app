# POINT+ (Point Plus) — Full-Stack Game Top-Up Platform

Website profesional full-stack untuk layanan top up voucher game resmi (Mobile Legends, Free Fire, PUBG Mobile, VALORANT, Honor of Kings, Genshin Impact, dan Roblox) dengan sistem pembayaran manual QRIS DANA Bisnis, upload bukti transfer, manajemen pesanan admin, dan notifikasi email via Nodemailer Gmail SMTP.

---

## 🚀 Fitur Utama

- **Frontend Modern & Responsive**: Dibangun dengan React 19, Vite, Tailwind CSS, dan Lucide Icons dengan konsep desain *Bright Glassmorphism* yang bersih, elegan, dan mobile-first.
- **Backend Handal**: Node.js & Express.js dengan arsitektur RESTful API, validasi data server-side, dan sanitasi input.
- **Dual Database Engine (Relational SQL)**:
  - **PostgreSQL / Supabase**: Aktif secara otomatis saat `DATABASE_URL` diisi pada berkas `.env`.
  - **Embedded SQLite (sql.js)**: Menyimpan database lokal persisten di `database/point_plus.sqlite` untuk kemudahan pengujian tanpa ketergantungan eksternal.
  - Dilengkapi skema migrasi SQL (`database/migrations/`) dan seed data katalog resmi (`database/seed/`).
- **Autentikasi Admin Berbasis Backend**:
  - Hashing kata sandi menggunakan `bcryptjs` (salt 10 rounds). Tidak ada password plaintext.
  - Sesi berbasis token JWT yang disimpan dalam cookie HTTP-only & header Authorization.
  - CLI khusus `npm run create-admin` untuk mendaftarkan akun admin baru secara interaktif.
- **Pembayaran QRIS DANA Bisnis**:
  - Menggunakan QRIS resmi pemilik website yang tersimpan di `public/payment/qris-dana.png`.
  - Pelanggan dapat menyalin nominal unik, mengunduh QRIS, dan mengunggah struk bukti transfer (JPG, PNG, WEBP, maks 5 MB).
- **Notifikasi Email Real-Time (Gmail SMTP)**:
  - Notifikasi pesanan baru dikirim otomatis ke `attaerpeel@gmail.com`.
  - Notifikasi unggah bukti transfer dikirim otomatis ke admin lengkap dengan tautan langsung ke rincian pesanan.
- **Panel Admin Lengkap**:
  - Dashboard statistik pendapatan, omzet hari ini, dan status pesanan.
  - Manajemen pesanan dengan filter status, pencarian, dan pagination.
  - Verifikasi bukti transfer dengan modal zoom, tombol Approve (PAID), Reject (wajib mengisi alasan), Process (PROCESSING), dan Complete (COMPLETED).
  - Manajemen katalog produk & harga database.
  - Pusat notifikasi real-time & log audit aktivitas administrator.

---

## 🛠️ Persyaratan Sistem (Requirements)

- **Node.js**: Versi 18.x atau lebih baru (disarankan LTS 20+)
- **NPM / Bun**: Node Package Manager
- **PostgreSQL / Supabase** *(Opsional)*: Jika ingin menggunakan database cloud PostgreSQL.

---

## 📦 Instalasi & Setup

### 1. Kloning / Unduh Repository
```bash
git clone <repository-url>
cd POINT-PLUS
```

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment Variables
Salin berkas `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan konfigurasi pada `.env`:
```env
# Koneksi Database PostgreSQL / Supabase (Kosongkan untuk menggunakan SQLite lokal)
DATABASE_URL=

# Keamanan Sesi Admin (JWT Secret Key)
JWT_SECRET=point_plus_super_secret_jwt_key_2026_secure

# Konfigurasi Notifikasi Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
ADMIN_EMAIL=attaerpeel@gmail.com

# Pengaturan Path QRIS & Port
QRIS_IMAGE_PATH=/payment/qris-dana.png
PORT=3000
```

> **Catatan Gmail SMTP**: Untuk `EMAIL_PASSWORD`, gunakan **Google App Password** (Bukan kata sandi akun Google biasa). Anda dapat membuatnya di [Google Account Security -> 2-Step Verification -> App Passwords](https://myaccount.google.com/apppasswords).

---

## 🗄️ Database Setup & Migrasi

### Menggunakan SQLite (Bawaan / Default)
Sistem secara otomatis mendeteksi jika `DATABASE_URL` kosong dan akan membuat tabel serta memasukkan data 7 game beserta produknya ke dalam file `database/point_plus.sqlite`.

### Menggunakan PostgreSQL / Supabase
1. Buat database baru di Supabase atau PostgreSQL lokal.
2. Masukkan connection string ke variabel `DATABASE_URL` pada `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@db.supabase.co:5432/postgres
   ```
3. Migrasi tabel akan dieksekusi secara otomatis saat server pertama kali dijalankan. Anda juga dapat mengimpor file `database/migrations/001_initial_schema.sql` dan `database/seed/001_seed_data.sql` langsung melalui SQL Editor Supabase.

---

## 👤 Mendaftarkan Akun Admin Baru

POINT+ menyediakan CLI interaktif untuk membuat akun admin dengan password terenkripsi bcrypt:

```bash
npm run create-admin
```

Ikuti instruksi di terminal:
```text
Nama Lengkap Admin : Atta Administrator
Email Admin        : attaerpeel@gmail.com
Password Admin     : ************
Role               : SUPER_ADMIN
```

### Akun Admin Bawaan (Default):
- **Email**: `admin@pointplus.id`
- **Password**: `AdminPointPlus2026!`
- **Role**: `SUPER_ADMIN`

---

## 🏃 Menjalankan Aplikasi

### Mode Pengembangan (Development):
```bash
npm run dev
```
Aplikasi akan berjalan di: **http://localhost:3000** (Full-stack Express + Vite Middleware).

### Mode Produksi (Production Build):
```bash
npm run build
npm run start
```

---

## 📁 Struktur Proyek

```
POINT-PLUS/
├── backend/
│   ├── scripts/
│   │   ├── create-admin.ts    # CLI pembuatan admin
│   │   └── seed.ts            # Script database seeder
│   └── src/
│       ├── controllers/       # Controller API (orders, admin, games)
│       ├── middleware/        # Auth JWT & Upload Multer
│       ├── routes/            # Express Router endpoints
│       ├── services/          # Nodemailer email notification
│       └── db.ts              # Dual SQL engine (Postgres/SQLite)
├── database/
│   ├── migrations/            # SQL migration file
│   └── seed/                  # SQL seed file (7 game & harga)
├── public/
│   ├── images/games/          # Aset logo & banner resmi tiap game
│   └── payment/               # Aset gambar QRIS DANA Bisnis
├── src/
│   ├── components/            # Layout Navbar, Footer, AdminLayout
│   ├── context/               # AdminAuthContext
│   ├── pages/                 # Halaman customer & admin
│   ├── services/              # API client frontend
│   ├── App.tsx                # Konfigurasi routing
│   └── main.tsx
├── server.ts                  # Entry point Express backend + Vite
├── .env.example
├── package.json
└── README.md
```

---

## 📞 Kontak Dukungan

- **WhatsApp CS 1**: 088901846813
- **WhatsApp CS 2**: 085748245657
- **Email**: attaerpeel@gmail.com
- **Jam Operasional**: 24 Jam Nonstop
