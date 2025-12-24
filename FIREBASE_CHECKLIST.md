# Checklist Setup Firebase

Gunakan checklist ini untuk memastikan setup Firebase Anda complete.

---

## ✅ Tahap 1: Inisialisasi Proyek Firebase

- [ ] Buat Firebase Project di https://console.firebase.google.com
- [ ] Catat **Project ID** Anda
- [ ] Tambahkan Web App ke proyek
- [ ] Copy **Firebase Config** (apiKey, authDomain, projectId, dll)

---

## ✅ Tahap 2: Update Kredensial di Kode

- [ ] Buka file `asset/js/firebase.js`
- [ ] Ganti `YOUR_API_KEY` dengan `apiKey` dari Firebase config
- [ ] Ganti `YOUR_PROJECT_ID` dengan project ID Anda
- [ ] Ganti `YOUR_SENDER_ID` dengan `messagingSenderId`
- [ ] Ganti `YOUR_APP_ID` dengan `appId`
- [ ] Simpan file

**Verifikasi:** pastikan config di file sesuai dengan Firebase Console

---

## ✅ Tahap 3: Setup Authentication

- [ ] Buka **Authentication** di Firebase Console
- [ ] Klik **Sign-in Method**
- [ ] Enable **Email/Password** sign-in method
- [ ] Klik **Save**
- [ ] Buat user admin:
  - [ ] Go to **Users** tab
  - [ ] Click **Add User**
  - [ ] Email: `admin@example.com` (ganti sesuai kebutuhan)
  - [ ] Password: `YourStrongPassword123!`
  - [ ] **Catat email ini** untuk Firestore Rules

---

## ✅ Tahap 4: Setup Firestore Database

- [ ] Buka **Firestore Database** di Firebase Console
- [ ] Click **Create Database**
- [ ] Pilih region: `asia-southeast1` (atau terdekat ke lokasi Anda)
- [ ] Pilih **Production Mode** (penting!)
- [ ] Buat koleksi `projects`:
  - [ ] Click **Create Collection**
  - [ ] Nama: `projects`
  - [ ] Skip tambah dokumen pertama (akan pakai admin panel)

---

## ✅ Tahap 5: Setup Storage

- [ ] Buka **Storage** di Firebase Console
- [ ] Click **Get Started**
- [ ] Pilih region yang sama dengan Firestore
- [ ] Create folder `thumbnails` (opsional tapi recommended)

---

## ✅ Tahap 6: Set Firestore Rules

- [ ] Di Firestore, klik tab **Rules**
- [ ] Replace semua isi dengan rules berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == "admin@example.com";
    }
  }
}
```

- [ ] Ganti `"admin@example.com"` dengan email admin Anda
- [ ] Click **Publish**

---

## ✅ Tahap 7: Set Storage Rules

- [ ] Di Storage, klik tab **Rules**
- [ ] Replace semua isi dengan rules berikut:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == "admin@example.com";
    }
  }
}
```

- [ ] Click **Publish**

---

## ✅ Tahap 8: Authorized Domains

- [ ] Di **Authentication**, klik **Settings** (gear icon)
- [ ] Scroll ke **Authorized Domains**
- [ ] Tambahkan domain:
  - [ ] `localhost:3000` (untuk testing lokal)
  - [ ] `yourusername.github.io` (GitHub Pages)
  - [ ] Custom domain Anda (jika ada)

---

## ✅ Tahap 9: Test Lokal

- [ ] Buka terminal di folder proyek
- [ ] Jalankan: `npx http-server` atau gunakan VSCode Live Server
- [ ] Buka `http://localhost:3000/admin.html`
- [ ] Login dengan email & password admin
- [ ] Verifikasi form muncul:
  - [ ] Title input
  - [ ] Description textarea
  - [ ] Tech Stack input
  - [ ] URLs input
  - [ ] Thumbnail upload
- [ ] Isi dummy project dan click "Simpan Proyek"
- [ ] Buka `http://localhost:3000/projects.html`
- [ ] Verifikasi project dummy muncul di daftar

---

## ✅ Tahap 10: Verify di Firebase Console

- [ ] Buka **Firestore Database** di Firebase Console
- [ ] Klik koleksi `projects`
- [ ] Verifikasi dokumen project dummy ada
- [ ] Cek content sesuai yang di-input

- [ ] Buka **Storage** di Firebase Console
- [ ] Verifikasi folder `thumbnails/` ada (jika upload thumbnail)
- [ ] Cek file thumbnail ter-upload

---

## ✅ Tahap 11: Deploy ke GitHub Pages

- [ ] Commit semua changes:
  ```bash
  git add .
  git commit -m "feat: add Firebase semi-dynamic portfolio"
  ```

- [ ] Push ke GitHub:
  ```bash
  git push origin main
  ```

- [ ] Tunggu 1-2 menit untuk auto-deploy

---

## ✅ Tahap 12: Test Production

- [ ] Buka `https://yourusername.github.io/admin.html`
- [ ] Login dengan email admin
- [ ] Verifikasi form projects muncul
- [ ] Test tambah project dummy
- [ ] Buka `https://yourusername.github.io/projects.html`
- [ ] Verifikasi project baru muncul

---

## ✅ Tahap 13: Cleanup & Optimization

- [ ] Hapus project dummy dari admin panel (atau di Firestore Console)
- [ ] Customize styling di `asset/css/admin.css` & `projects.css`
- [ ] Tambahkan 3-5 project showcase yang real
- [ ] Edit halaman projects.html untuk tambah link ke admin (opsional)

---

## ⚠️ Common Issues & Solutions

| Issue | Solusi |
|-------|--------|
| "Domain not authorized" | Tambahkan domain ke Authorized Domains di Auth Settings |
| "Permission denied" di login | Verifikasi email admin di Firestore Rules cocok dengan user yang dibuat |
| Projects tidak muncul | Buka console (F12), cek error; pastikan read permission di rules = true |
| Thumbnail tidak upload | Cek Storage Rules, pastikan admin write permission aktif |
| Config undefined | Verifikasi firebase.js sudah di-import di HTML dengan `<script type="module">` |

---

## 📚 Dokumentasi Referensi

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security)

---

**Status Setup**: Ready untuk deploy! 🚀

