# ⚠️ DATA TERSIMPAN TAPI KOSONG? FIX DISINI!

Data masuk ke Firestore tapi field-nya kosong? Kemungkinan form input tidak punya `name` attribute.

---

## ⚡ **Quick Fix (30 detik):**

### Step 1: Buka admin.html
Check apakah setiap input punya atribut `name`:

```html
<input type="text" name="title" required>              ✅ BENAR
<textarea name="description" rows="3" required></textarea> ✅ BENAR
<input type="text" name="tech_stack">                 ✅ BENAR
<input type="url" name="project_url" required>        ✅ BENAR
<input type="url" name="github_url">                  ✅ BENAR
<input type="url" name="thumbnail_url">               ✅ BENAR
```

### Step 2: Jika Ada yang Tanpa `name`
Tambahkan, contoh:
```html
<!-- SEBELUM (Salah) -->
<input type="text" id="title" required>

<!-- SESUDAH (Benar) -->
<input type="text" name="title" required>
```

### Step 3: Hard Refresh
Press: **Ctrl + Shift + R**

### Step 4: Test Lagi
- Login
- Isi form
- Simpan
- Check Firestore (seharusnya ada isinya)

---

## 🔍 **Debug Cara Lebih Detil:**

### Step 1: Buka F12 Console
1. Admin.html
2. Press **F12** → **Console**

### Step 2: Paste Code Ini
```javascript
const form = document.querySelector("#project-form");
const fd = new FormData(form);
console.log("Title:", fd.get("title"));
console.log("Description:", fd.get("description"));
console.log("Tech Stack:", fd.get("tech_stack"));
console.log("Project URL:", fd.get("project_url"));
console.log("GitHub URL:", fd.get("github_url"));
```

### Step 3: Lihat Hasil
- Jika muncul value (misal: `"Test Project"`) → Form OK!
- Jika semua `null` → Input tidak punya `name` attribute

---

## ✅ Expected Form HTML

Admin form harus punya structure ini:

```html
<form id="project-form" class="stack">
  <label>Judul
    <input type="text" name="title" required>
  </label>
  <label>Deskripsi
    <textarea name="description" rows="3" required></textarea>
  </label>
  <label>Tech Stack
    <input type="text" name="tech_stack" placeholder="React, Firebase">
  </label>
  <label>Live URL
    <input type="url" name="project_url" placeholder="https://..." required>
  </label>
  <label>GitHub URL
    <input type="url" name="github_url" placeholder="https://github.com/...">
  </label>
  <label>Thumbnail Image URL
    <input type="url" name="thumbnail_url" placeholder="https://example.com/image.jpg">
  </label>
  <button type="submit">Simpan Proyek</button>
</form>
```

**Key:** Setiap `<input>` dan `<textarea>` HARUS punya `name` attribute!

---

## 📋 Checklist

- [ ] Semua input punya `name` attribute
- [ ] `name` attribute sesuai dengan kode (title, description, tech_stack, dll)
- [ ] Form id adalah `#project-form`
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Console tidak ada error
- [ ] Test submit form lagi

---

## 🚀 Setelah Fix

1. Reload browser
2. Isi form
3. Simpan
4. Check Firestore → Data seharusnya lengkap ✅

---

**TLDR: Tambahkan `name="..."` ke setiap input, hard refresh, done!**

