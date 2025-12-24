# ⚠️ Data Tidak Tersimpan? Quick Checklist 2 Menit

Masalah paling umum: **Email di Firestore Rules tidak sesuai dengan email login.**

---

## 🔧 Fix in 2 Minutes

### Step 1: Copy Email yang Benar (30 sec)
1. Firebase Console → **Authentication** → **Users**
2. Lihat email user yang Anda buat
3. **Copy exact text** (case-sensitive!)
   - Contoh: `admin@example.com` (BUKAN `admin@example.com.` dengan titik di akhir!)

### Step 2: Update Rules (30 sec)
1. Firebase Console → **Firestore Database** → **Rules** tab
2. Find this line:
   ```javascript
   request.auth.token.email == "GANTI_INI";
   ```
3. **Replace dengan email yang di-copy:**
   ```javascript
   request.auth.token.email == "admin@example.com";
   ```
4. Click **"Publish"** (penting!)

### Step 3: Hard Refresh (30 sec)
1. Buka admin.html di browser
2. Press **Ctrl+Shift+R** (bukan Ctrl+R!)
3. Reload selesai

### Step 4: Test (30 sec)
1. Login dengan email & password
2. Isi form
3. Click "Simpan Proyek"
4. **Check Firestore Console** → Documents should appear ✅

---

## 🚨 Jika Masih Tidak Jalan

### Check #1: Console Error
1. Buka F12 → **Console** tab
2. Click "Simpan Proyek"
3. Ada error message? **Cek apa error-nya:**

| Error | Solusi |
|-------|--------|
| `Permission Denied` | Kembali ke Step 1-2 (email tidak sesuai) |
| `Domain not authorized` | [Lihat di sini](#-domain-not-authorized) |
| Tidak ada error tapi tidak tersimpan | [Lihat Advanced Debugging](#-advanced-debugging) |

---

## 🔴 Domain Not Authorized?

**Jika error:** `"This domain is not authorized..."`

### Fix:
1. Firebase Console → **Authentication** → **Settings** (gear icon)
2. Scroll ke **Authorized Domains**
3. Click **"Add Domain"**
4. Ketik: `localhost:3000`
5. Click **Save**
6. Tunggu 30 detik
7. Hard refresh Ctrl+Shift+R
8. Try again

---

## 🔧 Advanced Debugging

Jika sudah ikuti langkah di atas tapi masih tidak jalan:

### Console Test:
1. Buka F12 → **Console**
2. Login dulu (admin.html)
3. Paste code ini:

```javascript
import { auth, projectsCol, addDoc, serverTimestamp } from './asset/js/firebase.js';

console.log('Auth user:', auth.currentUser?.email);

addDoc(projectsCol, {
  title: "Test",
  created_at: serverTimestamp()
})
.then(() => console.log('✅ Saved!'))
.catch(err => console.error('❌ Error:', err.code, err.message));
```

4. **Result?**
   - ✅ `✅ Saved!` → Semuanya OK!
   - ❌ Error → Lihat error message & fix accordingly

---

## ✅ Verification Checklist

Sebelum submit, pastikan:

- [ ] Email di Firestore Rules **sama persis** dengan email login (case-sensitive!)
- [ ] Rules sudah di-**Publish** (bukan hanya di-edit)
- [ ] Hard refresh sudah dilakukan (Ctrl+Shift+R)
- [ ] Localhost di Authorized Domains
- [ ] Console tidak ada error
- [ ] Firestore collection "projects" sudah exist

---

## 📞 Still Stuck?

Baca dokumentasi lengkap: **[DEBUG_DATA_NOT_SAVING.md](DEBUG_DATA_NOT_SAVING.md)**

---

**Most common issue:** Email di rules ≠ email login 🎯

