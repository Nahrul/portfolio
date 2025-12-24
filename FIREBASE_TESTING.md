# Testing & Troubleshooting Firebase Setup

Panduan untuk test dan fix masalah Firebase.

---

## 🧪 Testing Checklist

### Test 1: Verify Firebase Config
**Tujuan:** Pastikan config sudah correct

1. Buka browser console (F12 → Console tab)
2. Paste code ini:
```javascript
import { app, auth, db, storage } from './asset/js/firebase.js';
console.log('Firebase App:', app);
console.log('Auth:', auth);
console.log('Firestore:', db);
console.log('Storage:', storage);
```
3. Verifikasi semua object ter-initialize tanpa error

---

### Test 2: Check Authentication
**Tujuan:** Verify login system works

1. Buka `http://localhost:3000/admin.html`
2. Di console, paste:
```javascript
import { auth, onAuthStateChanged } from './asset/js/firebase.js';
onAuthStateChanged(auth, (user) => {
  console.log('Current User:', user);
});
```
3. Hasil:
   - **Jika logged out**: `Current User: null`
   - **Jika logged in**: `Current User: { email: '...', uid: '...', ... }`

---

### Test 3: Firestore Read/Write
**Tujuan:** Pastikan database read/write permission OK

1. Di console admin.html:
```javascript
import { db, getDocs, projectsCol } from './asset/js/firebase.js';
import { getDocs, projectsCol } from './asset/js/firebase.js';

// Test Read (public)
getDocs(projectsCol).then(snap => {
  console.log('Total projects:', snap.size);
  snap.forEach(doc => console.log(doc.data()));
}).catch(err => console.error('Read Error:', err));
```

2. Hasil:
   - ✅ Berhasil baca (tanpa login) = Read permission OK
   - ❌ Error "Permission denied" = Update Firestore Rules

---

### Test 4: Test Upload Thumbnail
**Tujuan:** Verify Storage upload works

1. Admin login → buka form
2. Pilih file kecil (< 1MB)
3. Upload via form
4. Cek console untuk errors

---

### Test 5: Verify Firestore Data Structure
**Tujuan:** Pastikan dokumen ter-create dengan struktur correct

1. Firebase Console → Firestore → koleksi `projects`
2. Verifikasi dokumen memiliki fields:
   - [ ] `title` (string)
   - [ ] `description` (string)
   - [ ] `tech_stack` (string)
   - [ ] `project_url` (string)
   - [ ] `github_url` (string)
   - [ ] `thumbnail_image` (string/URL)
   - [ ] `created_at` (timestamp)

---

## 🔧 Troubleshooting

### ❌ Error: "Cannot find module 'firebase/app'"
**Penyebab:** Firebase SDK belum ter-load dari CDN
**Solusi:**
```html
<!-- Di HTML, pastikan pakai CDN links dengan versi sama -->
<script type="module" src="asset/js/firebase.js"></script>
```
Firestore.js sudah pakai CDN import yang benar.

---

### ❌ Error: "apiKey is not defined"
**Penyebab:** Firebase config kosong atau typo
**Solusi:**
1. Buka `asset/js/firebase.js`
2. Verifikasi config fields tidak kosong:
```javascript
const firebaseConfig = {
  apiKey: "NOT_EMPTY",
  authDomain: "NOT_EMPTY.firebaseapp.com",
  projectId: "NOT_EMPTY",
  storageBucket: "NOT_EMPTY.appspot.com",
  messagingSenderId: "NOT_EMPTY",
  appId: "NOT_EMPTY"
};
```

---

### ❌ Error: "Domain is not authorized"
**Penyebab:** Domain belum di-whitelist di Firebase Auth
**Solusi:**
1. Firebase Console → Authentication → Settings
2. Authorized Domains section
3. Tambahkan domain:
   - Lokal: `localhost:3000`
   - GitHub Pages: `yourusername.github.io`
4. Tunggu 5-10 menit untuk propagasi

---

### ❌ Error: "Permission denied" saat login
**Penyebab:** User email tidak sesuai di Firestore Rules
**Solusi:**
1. Verifikasi user ada di Firebase Auth
2. Copy exact email dari **Authentication → Users tab**
3. Buka Firestore → Rules
4. Update email di rules:
```javascript
allow write: if request.auth != null && 
  request.auth.token.email == "EXACT_EMAIL_HERE";
```
5. Publish rules

---

### ❌ Error: "storage bucket not initialized"
**Penyebab:** Storage bucket belum di-create di Firebase
**Solusi:**
1. Firebase Console → Storage
2. Klik **"Get Started"**
3. Pilih region yang sama seperti Firestore
4. Tunggu setup selesai (2-3 menit)

---

### ❌ Projects Tidak Muncul di Halaman Public
**Penyebab:** Firestore Rules read permission error
**Solusi:**

1. Pastikan Firestore Rules allow read:
```javascript
match /projects/{projectId} {
  allow read: if true;  // Harus true untuk public
  allow write: if request.auth != null && ...;
}
```

2. Publish rules

3. Test di browser console:
```javascript
import { getDocs, orderedProjectsQuery } from './asset/js/firebase.js';
getDocs(orderedProjectsQuery).then(snap => {
  console.log('Can read projects:', snap.size);
}).catch(err => console.error('Error:', err));
```

---

### ❌ Thumbnail Tidak Upload
**Penyebab 1:** Storage Rules error
**Solusi:**
```javascript
// Storage Rules harus ada:
match /thumbnails/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && 
    request.auth.token.email == "ADMIN_EMAIL";
}
```

**Penyebab 2:** File terlalu besar
**Solusi:** Firestore Spark Plan limit 5MB per file. Compress image sebelum upload.

**Penyebab 3:** CORS error (jarang di setup baru)
**Solusi:** Jika error CORS, hubungi Firebase Support.

---

## 🐛 Debug Mode

### Enable Console Logging di Admin Panel
Edit `asset/js/admin.js` dan uncomment untuk verbose logging:

```javascript
// Uncomment ini untuk debug
if (process.env.DEBUG) {
  console.log('Form submitted:', payload);
  console.log('Upload path:', currentThumbPath);
  console.log('Edit ID:', editId);
}
```

### Check Network Tab
1. Admin.html → F12 → Network tab
2. Submit form
3. Verifikasi requests:
   - [ ] `signInWithEmailAndPassword` → 200
   - [ ] Firestore write → 200
   - [ ] Storage upload → 200

---

## ✅ Final Verification Before Deploy

Checklist sebelum deploy ke GitHub Pages:

- [ ] Admin login works locally
- [ ] Can add project without error
- [ ] Project appears in Firestore console
- [ ] Thumbnail uploads to Storage
- [ ] Project appears on projects.html immediately
- [ ] Can edit existing project
- [ ] Can delete project
- [ ] Deleted project disappears from projects.html
- [ ] Public projects.html loads WITHOUT login
- [ ] Theme toggle works
- [ ] Mobile hamburger menu works

---

## 📊 Monitoring di Production

### Check Firestore Quota
1. Firebase Console → Firestore
2. Tab **"Quotas & Analytics"**
3. Monitor:
   - Reads per day
   - Writes per day
   - Stored data

**Spark Plan Limits:**
- 50,000 reads/day
- 20,000 writes/day
- 1GB stored data

### Check Storage Usage
1. Firebase Console → Storage
2. Tab **"Files"**
3. Monitor total data stored

---

## 🚨 Emergency: Reset Everything

Jika ingin start dari awal:

### Option 1: Clear Firestore
1. Firebase Console → Firestore
2. Select semua docs di `projects` collection
3. Delete all

### Option 2: Clear Storage
1. Firebase Console → Storage
2. Hapus semua files di folder

### Option 3: Delete Entire Project (Extreme)
**WARNING:** Ini permanent!
1. Firebase Console → Settings (gear icon)
2. Project Settings
3. Bottom → "Delete Project"
4. Konfirm dengan typing project ID

---

**Masih ada error? Cek:**
1. Browser console (F12 → Console tab) untuk error message
2. Firebase Console logs (jika available)
3. Dokumentasi official: https://firebase.google.com/docs

