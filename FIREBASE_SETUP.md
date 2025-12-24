# Panduan Setup Firebase untuk Portfolio Semi-Dinamis

Dokumen ini menjelaskan langkah demi langkah cara setup Firebase untuk portfolio Anda.

---

## 1. Membuat Firebase Project

### 1.1 Akses Firebase Console
1. Buka https://console.firebase.google.com
2. Login dengan akun Google Anda
3. Klik **"Tambah Proyek"** atau **"Create Project"**

### 1.2 Isi Detail Proyek
- **Nama Proyek**: `nahdevl-portfolio` (atau nama lain sesuai preferensi)
- **ID Proyek**: Auto-generated, biarkan default
- Klik **"Lanjutkan"**

### 1.3 Aktifkan Google Analytics (Opsional)
- Anda bisa skip atau enable (untuk statistik pengunjung)
- Klik **"Buat Proyek"** dan tunggu setup selesai

---

## 2. Menambahkan Web App ke Firebase

### 2.1 Daftar Web App
Setelah proyek terbuat:
1. Di halaman overview, cari ikon `</>` (Web App)
2. Klik untuk menambahkan app baru
3. Nama app: `portfolio-web` (atau terserah)
4. Centang **"Setup Firebase Hosting"** (opsional, karena Anda pakai GitHub Pages)
5. Klik **"Daftarkan App"**

### 2.2 Copy Firebase Config
Setelah registrasi, Anda akan melihat config seperti ini:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...", // Public key, aman di repo publik
  authDomain: "nahdevl-portfolio.firebaseapp.com",
  projectId: "nahdevl-portfolio",
  storageBucket: "nahdevl-portfolio.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

### 2.3 Update Firebase Config di Proyek
1. Buka file [asset/js/firebase.js](asset/js/firebase.js)
2. Ganti placeholder `YOUR_API_KEY`, `YOUR_PROJECT_ID`, dll dengan nilai sebenarnya
3. Simpan file

**Contoh setelah diisi:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD1234567890abcdefghijklmnop",
  authDomain: "nahdevl-portfolio.firebaseapp.com",
  projectId: "nahdevl-portfolio",
  storageBucket: "nahdevl-portfolio.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

---

## 3. Setup Firebase Authentication

### 3.1 Enable Email/Password Auth
1. Di Firebase Console, klik **"Build"** → **"Authentication"** (atau "Autenticación")
2. Klik tab **"Sign-in Method"**
3. Cari **"Email/Password"** dan klik
4. Toggle **"Enable"** menjadi ON
5. Klik **"Save"**

### 3.2 Buat User Admin
1. Di tab **"Users"**, klik **"Add User"** atau **"Tambah Pengguna"**
2. Isi:
   - **Email**: `admin@example.com` (ganti dengan email Anda)
   - **Password**: `StrongPassword123!` (ganti dengan password kuat)
3. Klik **"Add User"**
4. **Catat email ini** — akan digunakan untuk whitelist di Firestore Rules

---

## 4. Setup Firestore Database

### 4.1 Buat Database
1. Di Firebase Console, klik **"Build"** → **"Firestore Database"**
2. Klik **"Create Database"** atau **"Buat Database"**
3. Pilih region terdekat (e.g., `asia-southeast1` untuk Indonesia)
4. **Penting**: Pilih **"Start in production mode"** (bukan sandbox)
5. Klik **"Create"** dan tunggu selesai

### 4.2 Buat Koleksi "projects"
1. Di halaman Firestore, klik **"Create Collection"**
2. Nama: `projects`
3. Klik **"Next"**
4. Di dialog "Add first document", klik **"Cancel"** (kita akan tambah dokumen melalui admin panel nanti)

---

## 5. Setup Firebase Storage

### 5.1 Buat Storage Bucket
1. Di Firebase Console, klik **"Build"** → **"Storage"**
2. Klik **"Get Started"** atau **"Mulai"**
3. Pilih region yang sama seperti Firestore (e.g., `asia-southeast1`)
4. Klik **"Done"**

### 5.2 Buat Folder untuk Thumbnail
1. Di Storage, klik **"Create Folder"** (jika ada) atau abaikan (folder auto-created saat upload)
2. **Opsional**: Buat folder bernama `thumbnails` untuk organisasi

---

## 6. Set Firestore Rules

### 6.1 Akses Rules Editor
1. Di Firestore, klik tab **"Rules"**
2. Edit rules dengan teks berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, admin write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == "admin@example.com";
    }
  }
}
```

### 6.2 Ganti Email Admin
- Ganti `"admin@example.com"` dengan email yang Anda buat di step 3.2
- Klik **"Publish"**

**Penjelasan Rules:**
- `allow read: if true` → Siapa saja bisa baca data projects (public)
- `allow write: if request.auth.token.email == "admin@example.com"` → Hanya user dengan email admin yang bisa tambah/edit/hapus

---

## 7. Set Storage Rules

### 7.1 Akses Rules Editor
1. Di Storage, klik tab **"Rules"**
2. Edit dengan teks berikut:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public read, admin write untuk thumbnails
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == "admin@example.com";
    }
  }
}
```

### 7.2 Publish Rules
- Klik **"Publish"**

**Penjelasan:**
- Siapa saja bisa download thumbnail (read)
- Hanya admin yang bisa upload/edit thumbnail

---

## 8. Tambahkan Authorized Domains

### 8.1 Akses Settings
1. Di Authentication, klik tab **"Settings"** (gear icon di atas)
2. Scroll ke bawah cari **"Authorized Domains"**

### 8.2 Tambahkan Domain
Tambahkan 3 domain untuk testing dan production:

1. **Localhost (Testing)**
   - Domain: `localhost:3000`
   - Klik **"Add Domain"**

2. **GitHub Pages Domain**
   - Domain: `yourusername.github.io` (sesuai username GitHub Anda)
   - Klik **"Add Domain"**
   - Contoh: `nahdevl.github.io`

3. **Custom Domain (Jika Ada)**
   - Jika punya custom domain, tambahkan juga
   - Contoh: `portfolio.yourname.com`

---

## 9. Test Firestore & Storage Rules

### 9.1 Buka Admin Panel Lokal
1. Jalankan live server (VSCode Live Server atau `npx http-server`)
2. Buka `http://localhost:3000/admin.html`
3. Login dengan email & password yang dibuat di step 3.2

### 9.2 Test Tambah Project
1. Isi form dengan data project:
   - **Judul**: "Test Project"
   - **Deskripsi**: "Ini project test"
   - **Tech Stack**: "Firebase, HTML, CSS, JS"
   - **Live URL**: "https://example.com"
   - **Thumbnail**: (opsional) upload gambar
2. Klik **"Simpan Proyek"**
3. Cek di Firestore Console apakah dokumen ter-create di koleksi `projects`

### 9.3 Test Public Read
1. Buka `http://localhost:3000/projects.html` di tab baru
2. Verifikasi project yang baru ditambah muncul di halaman projects

### 9.4 Test Storage
1. Di Firebase Console → Storage, cek folder `thumbnails/`
2. Pastikan file gambar ter-upload

---

## 10. Deploy ke GitHub Pages

### 10.1 Push Code ke GitHub
```bash
cd /path/to/portfolio
git add .
git commit -m "feat: add Firebase semi-dynamic portfolio"
git push origin main
```

### 10.2 Tunggu Build Selesai
- GitHub Pages akan auto-deploy dalam 1-2 menit
- Cek di **Settings → Pages** untuk melihat status

### 10.3 Test di Production
1. Buka `https://yourusername.github.io/admin.html`
2. Login dan test tambah project
3. Verifikasi di `https://yourusername.github.io/projects.html`

---

## 11. Troubleshooting

### Error: "Firebase Config Not Initialized"
- Pastikan `firebase.js` sudah di-import di semua file HTML
- Cek console browser (F12) untuk error detail

### Error: "Permission Denied" saat Login
- Pastikan email admin sudah di-whitelist di Firestore Rules
- Verifikasi user sudah dibuat di Firebase Auth

### Error: "Domain Not Authorized"
- Jika test di domain baru, tambahkan ke "Authorized Domains" di Auth Settings
- Tunggu ~5-10 menit untuk propagasi

### Thumbnail Tidak Upload
- Cek Storage Rules apakah sudah set correctly
- Pastikan file size tidak terlalu besar (limit: 5MB per file di Spark Plan)

### Projects Tidak Muncul di Public Page
- Buka browser console (F12) dan lihat error
- Pastikan Firestore Rules memperbolehkan read dari siapa saja

---

## 12. Best Practices & Security

### 12.1 API Key Security
- `apiKey` di Firebase bersifat **public** — tidak perlu di-hide
- Keamanan diatur melalui Firestore Rules & Storage Rules, bukan API key
- Database real security ada di rules, bukan di config

### 12.2 Customizing Admin Whitelist
Opsi lain jika ingin multiple admin:

**Dengan Multiple Email:**
```javascript
allow write: if request.auth != null && 
  request.auth.token.email in ["admin1@example.com", "admin2@example.com"];
```

**Dengan Custom Claims (Advanced):**
Jika ingin lebih scalable, gunakan custom claims:
```javascript
allow write: if request.auth != null && request.auth.token.admin == true;
```
Tapi ini memerlukan backend script untuk set claims.

### 12.3 Bandwidth Optimization
- Compress thumbnail sebelum upload (client-side canvas)
- Gunakan Firestore pagination untuk project list besar
- Monitor quota di Firebase Console → Quotas

---

## 13. Referensi Struktur Data

### Document Structure di Firestore
Setiap dokumen di koleksi `projects` memiliki struktur:
```javascript
{
  title: "Website E-Commerce",
  description: "Platform belanja online dengan React & Node.js",
  tech_stack: "React, Node.js, PostgreSQL",
  project_url: "https://example-ecommerce.com",
  github_url: "https://github.com/user/ecommerce",
  thumbnail_image: "https://storage.googleapis.com/.../thumbnails/...",
  thumbnail_path: "thumbnails/1640000000000_logo.jpg",
  created_at: Timestamp(2024, 12, 24, 10, 30, 0)
}
```

---

## 14. Langkah Selanjutnya

Setelah setup selesai:

1. ✅ **Customize Style**: Edit CSS di `asset/css/admin.css` & `projects.css` sesuai brand Anda
2. ✅ **Add More Projects**: Via admin panel, tambahkan 3-5 project showcase
3. ✅ **SEO Optimization**: Tambahkan meta tags di `projects.html` untuk better SEO
4. ✅ **Analytics**: Aktifkan Google Analytics di Firebase Console
5. ✅ **Backup Database**: Regular export di Firestore Console → Manage Databases → Backups

---

**Selesai!** Portfolio Anda sekarang semi-dinamis dengan Firebase. 🎉

