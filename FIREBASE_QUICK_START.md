# Setup Cepat: Firebase Gratis Tanpa Storage

Panduan singkat untuk setup portfolio dengan **hanya Firestore** (0% cost selamanya).

---

## 📋 Ringkas Perubahan

Versi baru sudah update otomatis:
- ❌ Hapus Firebase Storage import
- ✅ Thumbnail sekarang pakai URL saja (copas dari GitHub, Imgur, dll)
- ✅ Admin form: `<input type="file">` → `<input type="url">`
- ✅ Firestore: hanya simpan URL string, bukan file binary

---

## 🚀 Setup (5 Menit)

### Step 1: Update Firebase Config
File: [asset/js/firebase.js](asset/js/firebase.js)

Ganti:
```javascript
apiKey: "YOUR_API_KEY",
authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
projectId: "YOUR_PROJECT_ID",
storageBucket: "YOUR_PROJECT_ID.appspot.com",
messagingSenderId: "YOUR_SENDER_ID",
appId: "YOUR_APP_ID",
```

Dengan nilai dari Firebase Console → Web App config.

### Step 2: Setup Firestore (Tidak perlu Storage)

1. Firebase Console → **Firestore Database**
2. Click **"Create Database"**
3. Pilih region terdekat (e.g., `asia-southeast1`)
4. Pilih **"Production Mode"**
5. Create collection `projects`

### Step 3: Setup Authentication

1. Firebase Console → **Authentication**
2. Enable **Email/Password**
3. Create user:
   - Email: `admin@example.com` (ganti sesuai keinginan)
   - Password: `StrongPassword123!`

### Step 4: Set Firestore Rules

Firebase Console → Firestore → **Rules** tab:

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

Ganti email dengan yang Anda buat di Step 3.

### Step 5: Add Authorized Domain

Firebase Console → Authentication → **Settings**:

Tambahkan domains:
- `localhost:3000` (testing)
- `yourusername.github.io` (production)

---

## 🖼️ Cara Upload Gambar (Pilih 1)

### Option A: GitHub (Recommended)
1. Upload ke folder `asset/img/projects/` di repo
2. Commit & push
3. Copy raw URL: `https://raw.githubusercontent.com/YOUR_USERNAME/portfolio/main/asset/img/projects/image.jpg`

### Option B: Imgur
1. Upload ke https://imgur.com
2. Copy image URL: `https://i.imgur.com/abc123.jpg`

### Option C: ImgBB
1. Upload ke https://imgbb.com
2. Copy direct link

---

## ✅ Test Lokal

1. Terminal: `npx http-server` (atau VSCode Live Server)
2. Open: `http://localhost:3000/admin.html`
3. Login dengan email & password
4. Isi form:
   - **Title**: "Test Project"
   - **Description**: "Test"
   - **Tech Stack**: "Firebase, HTML, JS"
   - **Project URL**: "https://example.com"
   - **Thumbnail URL**: Paste URL gambar (e.g., GitHub raw URL atau Imgur)
5. Click "Simpan Proyek"
6. Open `http://localhost:3000/projects.html` → verifikasi project muncul

---

## 🎉 Deploy ke GitHub Pages

```bash
git add .
git commit -m "feat: setup Firebase Firestore portfolio"
git push origin main
```

Test di: `https://yourusername.github.io/admin.html`

---

## 💰 Cost

**Total: $0/bulan selamanya** ✅

- Firestore: 50K reads/day gratis
- Auth: gratis
- Storage gambar: host di GitHub/Imgur (gratis)

---

## 📚 Dokumentasi Lengkap

- [FIREBASE_SETUP.md](FIREBASE_SETUP.md) — Setup lengkap (dengan Storage)
- [FIREBASE_GRATIS.md](FIREBASE_GRATIS.md) — Alternatif tanpa Storage
- [FIREBASE_CHECKLIST.md](FIREBASE_CHECKLIST.md) — Checklist setup
- [FIREBASE_TESTING.md](FIREBASE_TESTING.md) — Testing & troubleshooting

---

**Selesai! Portfolio Anda sudah semi-dinamis + 100% gratis.** 🚀

