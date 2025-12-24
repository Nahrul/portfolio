# Debugging: Data Kosong di Firestore

Sudah masuk ke Firestore tapi field-nya kosong? Mari debug.

---

## 🔍 Step 1: Buka Console & Cek Form Values

1. Admin panel: `http://localhost:3000/admin.html`
2. Login berhasil
3. **Buka F12** → **Console** tab
4. **Isi form** dengan data:
   - Title: "Test Project"
   - Description: "Test Description"
   - Tech Stack: "React, Firebase"
   - Project URL: "https://example.com"
5. **Click "Simpan Proyek"**
6. **Lihat console** untuk debug log:

```
Form Data Raw: {
  title: "Test Project",
  description: "Test Description",
  ...
}
Payload to save: {
  title: "Test Project",
  description: "Test Description",
  ...
}
```

---

## ✅ Case 1: Console Log Muncul, Data Lengkap

Berarti form reading OK!

**Check Firestore:**
1. Firebase Console → Firestore → projects collection
2. Buka dokumen terbaru
3. Apakah field-nya ada isinya?

**Jika YES:**
- ✅ Semuanya OK! Masalah di view projects page

**Jika NO (field kosong):**
- 🔴 Ada issue saat save ke Firestore
- Check Step 2

---

## ❌ Case 2: Console Log Tidak Muncul

Form submit tidak jalan atau error sebelum log.

**Check:**
1. Console ada error message?
2. Cek error message sesuai di section mana:
   - Form validation error
   - Auth error
   - Firestore error

---

## ❌ Case 3: Console Log Muncul Tapi Isinya Null/Kosong

Form tidak membaca input values!

```
Form Data Raw: {
  title: null,
  description: null,
  ...
}
```

**Penyebab:**
Form input mungkin tidak punya `name` attribute yang benar.

**Fix:**
1. Buka `admin.html`
2. Verifikasi setiap input punya name:
   ```html
   <input type="text" name="title">          ✅
   <input type="text" id="title">            ❌ (no name!)
   <textarea name="description">...</textarea> ✅
   ```

3. Jika ada yang tanpa `name`, tambahkan

---

## 🧪 Manual Test: Direct Console Input

Jika form tidak membaca, test manually:

1. Console, paste ini:
```javascript
const form = document.querySelector("#project-form");
const fd = new FormData(form);
console.log("Title:", fd.get("title"));
console.log("Description:", fd.get("description"));
console.log("Tech Stack:", fd.get("tech_stack"));
console.log("Project URL:", fd.get("project_url"));
console.log("GitHub URL:", fd.get("github_url"));
```

2. **Result:**
   - Jika muncul value → form OK
   - Jika semua null → input tidak punya `name` attribute

---

## 📋 Checklist Form Inputs

Buka `admin.html` dan pastikan SETIAP input punya atribut ini:

```html
<!-- BENAR ✅ -->
<input type="text" name="title" required>
<textarea name="description" rows="3" required></textarea>
<input type="text" name="tech_stack" placeholder="...">
<input type="url" name="project_url" placeholder="..." required>
<input type="url" name="github_url" placeholder="...">
<input type="url" name="thumbnail_url" placeholder="...">

<!-- SALAH ❌ (jangan begini) -->
<input type="text" id="title">                    <!-- no name! -->
<textarea id="description"></textarea>             <!-- no name! -->
```

---

## 🚀 Quick Fix

Jika semua input OK tapi tetap kosong:

1. **Hard refresh:** Ctrl+Shift+R
2. **Clear browser cache:** Ctrl+Shift+Delete
3. **Test lagi:** Login → Isi form → Simpan

---

## 📞 Still Stuck?

**Copy console log dan paste di sini:**
- Form Data Raw: `{...}`
- Payload to save: `{...}`
- Firestore dokumen content (dari Firebase Console)

Dengan ini saya bisa debug lebih akurat.

---

**Most likely cause:** Form input tidak punya `name` attribute yang sesuai dengan kode.

