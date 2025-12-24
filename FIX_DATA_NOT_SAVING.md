# 🚨 DATA TIDAK TERSIMPAN? BACA INI!

Masalah paling umum: sudah isi form tapi pas simpan gaada.

---

## ⚡ **FIX CEPAT (2 Menit)**

### Kemungkinan #1: Email di Rules Tidak Sesuai (90% kemungkinan!)

**Steps:**

1. **Buka Firebase Console**
   - Go to: Authentication → Users
   - **Copy exact email** dari user yang ada

2. **Update Firestore Rules**
   - Go to: Firestore → Rules
   - Find: `request.auth.token.email == "..."`
   - **Ganti dengan email yang di-copy:**
   ```javascript
   request.auth.token.email == "admin@example.com";
   ```
   - Click **"Publish"**

3. **Hard Refresh Browser**
   - Press: **Ctrl + Shift + R** (bukan Ctrl+R!)

4. **Test Again**
   - Login
   - Isi form
   - Click "Simpan Proyek"
   - Check Firestore Console apakah dokumen ada

---

## 🔴 Jika Masih Error?

### Error: "Domain Not Authorized"
```
This domain is not authorized...
```

**Fix:**
1. Firebase Console → Authentication → Settings (gear icon)
2. Add Domain: `localhost:3000`
3. Wait 30 seconds
4. Reload browser

### Error: "Permission Denied"
```
Missing or insufficient permissions
```

**Fix:**
- Kembali ke **Kemungkinan #1** di atas
- Email di rules HARUS sama persis dengan email login

### Tidak Ada Error Tapi Tetap Tidak Tersimpan?

**Check Console:**
1. Press **F12** → Console tab
2. Click "Simpan Proyek"
3. Lihat ada error message tidak
4. Copy error message
5. Baca [DEBUG_DATA_NOT_SAVING.md](DEBUG_DATA_NOT_SAVING.md)

---

## ✅ Verification

Setelah fix, pastikan:

- [ ] Email di Rules === Email Login (case-sensitive!)
- [ ] Rules sudah Publish
- [ ] Browser sudah Hard Refresh
- [ ] Localhost ada di Authorized Domains
- [ ] Console tidak ada error
- [ ] Firestore Documents muncul

---

## 📖 Butuh Lebih Detail?

- **Troubleshooting lengkap**: [DEBUG_DATA_NOT_SAVING.md](DEBUG_DATA_NOT_SAVING.md)
- **Dokumentasi penuh**: [FIREBASE_TESTING.md](FIREBASE_TESTING.md)

---

**TLDR: Ganti email di Rules dengan email login Anda, publish, hard refresh. Done! ✅**

