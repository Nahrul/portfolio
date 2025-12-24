# Debugging: Data Tidak Tersimpan di Firestore

Panduan untuk fix masalah "sudah isi form tapi data tidak tersimpan".

---

## 🔍 Diagnosis: Kenapa Data Tidak Tersimpan?

Ada **4 kemungkinan utama**:

1. ❌ **Firestore Rules reject write** (permission denied)
2. ❌ **Domain tidak authorized** (Firebase reject request)
3. ❌ **Email admin di rules tidak sesuai** dengan user yang login
4. ❌ **Firestore belum initialized** atau ada error lain

Mari check satu per satu.

---

## 🛠️ Step 1: Check Browser Console (WAJIB!)

Ini paling penting - console error akan reveal masalahnya.

### Buka Console:
1. Buka `http://localhost:3000/admin.html`
2. Tekan **F12** → buka tab **Console**
3. Login dengan email & password
4. Di form, isi project data
5. **Klik "Simpan Proyek"**
6. Lihat console (bawah layar) untuk error message

### Contoh Error yang Bisa Muncul:

**Error 1: Permission Denied**
```
FirebaseError: Missing or insufficient permissions.
```
→ Firestore Rules tidak allow write. Cek Step 2.

**Error 2: Domain Not Authorized**
```
Error: This domain is not authorized...
```
→ Domain belum di-whitelist. Cek Step 3.

**Error 3: Network Error**
```
Failed to initialize Firebase
```
→ Config salah atau network issue. Cek Step 4.

---

## ✅ Step 2: Verify Firestore Rules (CRITICAL!)

Email di rules **HARUS SAMA PERSIS** dengan email user yang login.

### Cek Rules:
1. Firebase Console → **Firestore Database** → **Rules** tab
2. Copy rule yang ada

### Pastikan Format:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{projectId} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.email == "GANTI_DENGAN_EMAIL_ADMIN";
    }
  }
}
```

### 🔴 PROBLEM: Email tidak sesuai
Misal:
- Email di rules: `admin@example.com`
- Email login: `admin@gmail.com` ← **BERBEDA!** ❌

**FIX:**
1. Firebase Console → Authentication → Users
2. Copy exact email dari sini
3. Paste ke Firestore Rules di bagian `allow write`
4. **Publish rules** (jangan lupa!)

---

## ✅ Step 3: Verify Authorized Domains

Firebase reject request jika domain tidak authorized.

### Cek Domains:
1. Firebase Console → **Authentication** → **Settings** (gear icon)
2. Scroll ke **Authorized Domains**
3. Pastikan domains ini ada:

**Untuk Testing:**
- ✅ `localhost` (atau `localhost:3000`)
- ✅ `127.0.0.1:3000`

**Untuk Production:**
- ✅ `yourusername.github.io`

### 🔴 PROBLEM: Domain tidak ada
Jika localhost tidak ada di list:

**FIX:**
1. Di Authorized Domains, click **"Add Domain"**
2. Ketik: `localhost:3000`
3. Click **Save**
4. Tunggu 30 detik
5. Reload halaman & try again

---

## ✅ Step 4: Verify Firebase Config

Config harus complete dan correct.

### Cek Config:
Buka browser console (F12), paste ini:
```javascript
import { app, auth, db } from './asset/js/firebase.js';
console.log('App:', app);
console.log('Auth:', auth);
console.log('DB:', db);
```

**Expected Output:**
```
App: FirebaseAppImpl {...}
Auth: AuthImpl {...}
DB: Firestore {...}
```

### 🔴 PROBLEM: Undefined atau error
Berarti config loading fail.

**FIX:**
1. Buka [asset/js/firebase.js](asset/js/firebase.js)
2. Verify config tidak kosong:
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
3. Jika ada yang kosong, copy dari Firebase Console → Web App config

---

## ✅ Step 5: Test Write Permission (Advanced)

Jika masih stuck, test write permission langsung di console.

### Console Test:
1. F12 → Console
2. Paste code ini:
```javascript
import { auth, projectsCol, addDoc, serverTimestamp } from './asset/js/firebase.js';

const testData = {
  title: "Test Project",
  description: "Testing write permission",
  tech_stack: "Firebase",
  project_url: "https://test.com",
  github_url: "https://github.com/test",
  thumbnail_image: "",
  created_at: serverTimestamp()
};

addDoc(projectsCol, testData)
  .then(doc => {
    console.log('✅ SUCCESS! Document created:', doc.id);
  })
  .catch(err => {
    console.error('❌ ERROR:', err.message);
  });
```

3. **Lihat hasil**:
   - ✅ `✅ SUCCESS!` → Write permission OK
   - ❌ `❌ ERROR: Permission Denied` → Check rules
   - ❌ `❌ ERROR: Domain not authorized` → Check authorized domains

---

## 🧪 Full Troubleshooting Checklist

Buka checklist ini satu per satu:

### 1. Browser Console
- [ ] Buka F12 → Console
- [ ] Lihat apakah ada error message
- [ ] Screenshot error jika ada
- [ ] Cari keyword: "Permission", "Domain", "Error"

### 2. Firestore Rules
- [ ] Buka Firebase Console → Firestore → Rules
- [ ] Copy email dari: Authentication → Users
- [ ] Paste ke rules: `request.auth.token.email == "EMAIL_HERE"`
- [ ] Publish rules

### 3. Authorized Domains
- [ ] Buka Firebase Console → Authentication → Settings
- [ ] Pastikan `localhost:3000` ada di list
- [ ] Atau tambahkan jika tidak ada

### 4. Test Data Add
- [ ] Buka admin panel: `http://localhost:3000/admin.html`
- [ ] Login berhasil? (lihat form muncul)
- [ ] Isi form dengan data
- [ ] Click "Simpan Proyek"
- [ ] Check console untuk error

### 5. Firestore Console Verify
- [ ] Buka Firebase Console → Firestore → Collection "projects"
- [ ] Apakah dokumen ter-create?
- [ ] Jika ya → Write OK ✅
- [ ] Jika tidak → Cek rules (Step 2)

### 6. Public Page Check
- [ ] Buka `http://localhost:3000/projects.html`
- [ ] Apakah project muncul?
- [ ] Jika ya → Read OK ✅
- [ ] Jika tidak → Check console untuk error

---

## 🔴 Common Issues & Fast Fix

### Issue 1: "Permission Denied"
```
FirebaseError: Missing or insufficient permissions.
```

**Penyebab:** Email di rules ≠ email login

**Fix (3 menit):**
1. Firebase Console → Authentication → Users
2. Copy exact email
3. Firestore → Rules → Ganti email
4. Publish
5. Reload & try again

---

### Issue 2: "Domain Not Authorized"
```
Error: This domain is not authorized to access Firestore
```

**Penyebab:** localhost belum di-whitelist

**Fix (2 menit):**
1. Firebase Console → Authentication → Settings
2. Add Domain: `localhost:3000`
3. Tunggu 30 detik
4. Reload & try again

---

### Issue 3: "Cannot read property 'auth'" 
```
TypeError: Cannot read property 'auth' of undefined
```

**Penyebab:** Firebase config tidak loaded

**Fix (5 menit):**
1. Verify firebase.js config lengkap (tidak ada yang kosong)
2. Verify HTML import: `<script type="module" src="asset/js/firebase.js"></script>`
3. Reload browser hard-refresh: **Ctrl+Shift+R** (bukan Ctrl+R!)

---

### Issue 4: Form submit tapi tidak ada response
Tombol "Simpan Proyek" diklik tapi tidak terjadi apa-apa

**Penyebab:** Async operation belum settle atau error di console

**Fix:**
1. Buka console (F12)
2. Lihat ada error tidak
3. Jika ada error, follow fix untuk error tersebut

---

## 📋 Debug Workflow

Jika masih stuck, ikuti workflow ini:

```
1. Buka Console (F12)
   ↓
2. Login di admin.html
   ↓
3. Isi form + click Simpan
   ↓
4. Console ada error?
   ├─ Ya → Lihat error type
   │   ├─ "Permission Denied" → Fix rules (Step 2)
   │   ├─ "Domain not authorized" → Fix domains (Step 3)
   │   └─ Lainnya → Cari error message di FIREBASE_TESTING.md
   │
   └─ Tidak → 
       ├─ Check Firestore Console
       ├─ Apakah dokumen ter-create?
       │   ├─ Ya → SUCCESS! ✅
       │   └─ Tidak → Cek Step 5 (test permission)
       └─ Jika masih stuck → Contact support
```

---

## 🚀 Quick Fix Summary

**Jika data tidak tersimpan, 90% masalah adalah:**

1. **Email di rules tidak sesuai** ← Most common!
   - Fix: Copy email dari Auth → paste ke rules → publish

2. **Authorized domains tidak setup**
   - Fix: Add `localhost:3000` to whitelist

3. **Browser cache issue**
   - Fix: Hard refresh **Ctrl+Shift+R**

**Coba ini dulu sebelum debug lebih jauh:**

```bash
# 1. Hard refresh browser
Ctrl+Shift+R

# 2. Check console F12
# (cari error message)

# 3. Verify rules email match
# (Firebase Console → Rules)

# 4. Try again
```

---

## 💡 Pro Tips

1. **Always check console** — 99% error akan muncul di F12 Console
2. **Email case-sensitive** — `Admin@example.com` ≠ `admin@example.com`
3. **Publish rules** — Jangan lupa klik "Publish" setelah edit rules!
4. **Authorized domains** — Tunggu 30 detik setelah tambah domain
5. **Hard refresh** — Jangan Ctrl+R, pakai **Ctrl+Shift+R** untuk clear cache

---

**Masih error? Copy console error message dan cek di [FIREBASE_TESTING.md](FIREBASE_TESTING.md)** 🔍

