# 🔍 Diagnose Empty Data Issue - Quick Steps

Data tersimpan ke Firestore tapi fieldnya kosong? Ikuti langkah ini:

---

## **Step 1: Open Developer Console** (30 detik)

1. Buka `admin.html` di browser
2. Tekan **F12** (atau Ctrl+Shift+I)
3. Klik tab **Console**
4. **JANGAN close** console saat test

---

## **Step 2: Fill & Submit Form** (1 menit)

1. Login dengan email & password
2. **Isi semua field** di form Add Project:
   - Title: `Test Project`
   - Description: `Test Description`
   - Tech Stack: `JavaScript, Firebase`
   - Project URL: `https://example.com`
   - GitHub URL: `https://github.com/user/repo`
   - Thumbnail URL: `https://via.placeholder.com/400`

3. Klik **Tambah Proyek**
4. **Lihat console output**

---

## **Step 3: Check Console Logs** (1-2 menit)

Cari dua log messages:

### **Log #1: "Form Data Raw"**
```javascript
Form Data Raw: {
  title: "Test Project",
  description: "Test Description",
  tech_stack: "JavaScript, Firebase",
  project_url: "https://example.com",
  github_url: "https://github.com/user/repo"
}
```

### **Log #2: "Payload to save"**
```javascript
Payload to save: {
  title: "Test Project",
  description: "Test Description",
  tech_stack: "JavaScript, Firebase",
  project_url: "https://example.com",
  github_url: "https://github.com/user/repo"
}
```

---

## **Step 4: Diagnose Issue** (Paling penting!)

### **Case A: Console shows `null` atau `undefined`**
```
Form Data Raw: {
  title: null,
  description: null,
  ...
}
```
**Penyebab:** Form input tidak punya `name` attribute atau form tidak di-connect  
**Solusi:** Check [FIX_EMPTY_DATA.md](FIX_EMPTY_DATA.md)

---

### **Case B: Console shows VALUES correctly**
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
**Penyebab:** Data hilang saat save ke Firestore OR field mapping salah  
**Solusi:** Check Step 5 & 6

---

## **Step 5: Check Firestore Console** (2 menit)

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project Anda
3. Klik **Firestore Database**
4. Buka **Collection `projects`**
5. Lihat document terakhir (baru ditambah)

### **Apa yang seharusnya ada:**
```
Field Name        | Type   | Value
─────────────────────────────────────
title             | string | Test Project
description       | string | Test Description
tech_stack        | string | JavaScript, Firebase
project_url       | string | https://example.com
github_url        | string | https://github.com/user/repo
thumbnail_image   | string | https://via.placeholder.com/400
created_at        | timestamp | (timestamp)
updated_at        | timestamp | (timestamp)
```

### **Jika semua fields ada tapi KOSONG:**
```
Field Name        | Type   | Value
─────────────────────────────────────
title             | string | (empty)
description       | string | (empty)
...
```
**Penyebab:** Field mapping salah atau trim() issue  
**Lanjut ke Step 6**

---

## **Step 6: Check for Field Mapping Issue** (1 menit)

Cek nama field di `admin.js` match dengan Firestore:

**admin.js (line 106-111):**
```javascript
const payload = {
  title: fd.get("title")?.trim() || "",
  description: fd.get("description")?.trim() || "",
  tech_stack: fd.get("tech_stack")?.trim() || "",
  project_url: fd.get("project_url")?.trim() || "",
  github_url: fd.get("github_url")?.trim() || "",
};
```

**admin.html form inputs (check these exist):**
```html
<input name="title" type="text" ... />
<input name="description" type="text" ... />
<input name="tech_stack" type="text" ... />
<input name="project_url" type="url" ... />
<input name="github_url" type="url" ... />
<input name="thumbnail_url" type="url" ... />
```

If names DON'T match → FIX IT! Namen must be EXACTLY the same.

---

## **Step 7: Nuclear Option** (If steps 1-6 fail)

Buat test project manual di Firestore:

1. Firebase Console → Firestore → Add Document
2. Collection: `projects`
3. Add fields manually:
   - `title`: "Manual Test"
   - `description`: "Test dari console"
   - `tech_stack`: "Manual"
   - `project_url`: "https://test.com"
   - `github_url`: "https://github.com/test"
   - `thumbnail_image`: "https://via.placeholder.com/400"
   - `created_at`: server timestamp
   - `updated_at`: server timestamp

4. Check projects.html - apakah project tampil?

**Jika tampil:** Masalah ada di admin.js logic  
**Jika tidak tampil:** Masalah ada di projects.js fetch

---

## **Summary Table**

| Symptom | Console Log | Firestore | Cause |
|---------|------------|-----------|-------|
| All null | `null` | ❌ | Form input missing `name` |
| Values shown | Values | Empty fields | Field mapping wrong |
| Values shown | Values | Values correct | ✅ WORKING! |
| Values shown | Values | Not saved | Firestore Rules issue |

---

## **Report Your Finding**

Berdasarkan step-step di atas, identify:

1. ✅ Console logs menunjukkan apa?
2. ✅ Firestore menunjukkan apa?
3. ✅ Form inputs punya `name` attribute?
4. ✅ Field names match?

**Dengan info ini, masalah mudah dipecahkan!**

---

**Next:** Report console & Firestore output, kami fix! 🚀
