# Alternatif: Portfolio Semi-Dinamis Tanpa Firebase Storage (Gratis 100%)

Dokumentasi ini menjelaskan cara setup portfolio dengan **hanya Firestore** (gratis), tanpa Firebase Storage yang berbayar.

---

## 📋 Opsi Solusi Gratis

### Opsi 1: Gunakan Free Tier Firebase Storage (5 GB/bulan)
- **Cost**: Gratis sampai 5GB/bulan
- **Best For**: Portfolio kecil dengan < 50 project
- **Setup**: Gunakan panduan `FIREBASE_SETUP.md` (original)

### Opsi 2: Menyimpan URL Gambar Saja (Rekomendasi)
- **Cost**: 100% gratis selamanya
- **Hosting Gambar**: Pakai GitHub, Imgur, Cloudinary, atau service gratis lainnya
- **Firestore**: Hanya simpan URL, bukan file binary
- **Best For**: Portfolio profesional, tidak perlu upload image dari dashboard
- **Setup**: Ikuti dokumentasi ini

### Opsi 3: Upload Gambar via GitHub + Simpan URL
- **Cost**: 100% gratis
- **Flow**: 
  1. Upload gambar ke folder di GitHub (`asset/img/projects/`)
  2. Copy raw URL dari GitHub
  3. Paste URL di admin dashboard
  4. Simpan di Firestore
- **Best For**: Tidak pakai cloud storage, semua di repo

---

## 🎯 Implementasi Opsi 2: URL-Only (Recommended)

Ini adalah implementasi yang paling hemat biaya.

### 2.1 Modifikasi Admin Form

**Sebelum (dengan file upload):**
```html
<label>Thumbnail (opsional)
  <input type="file" name="thumbnail" accept="image/*">
</label>
```

**Sesudah (hanya URL):**
```html
<label>Thumbnail Image URL (opsional)
  <input type="url" name="thumbnail_url" placeholder="https://example.com/image.jpg">
</label>
```

### 2.2 Update admin.js

Ganti upload logic dengan URL validation.

**Sebelum:**
```javascript
const file = fd.get("thumbnail");
if (file && file.size > 0) {
  if (currentThumbPath) {
    try {
      await deleteObject(ref(storage, currentThumbPath));
    } catch (_) {}
  }
  const uploaded = await uploadThumbnail(file);
  payload.thumbnail_image = uploaded.url;
  payload.thumbnail_path = uploaded.storagePath;
}
```

**Sesudah:**
```javascript
const thumbUrl = fd.get("thumbnail_url")?.trim();
if (thumbUrl) {
  // Validasi format URL
  try {
    new URL(thumbUrl);
    payload.thumbnail_image = thumbUrl;
  } catch {
    throw new Error("URL thumbnail tidak valid");
  }
}
```

### 2.3 Update Firestore Rules

Tidak perlu Storage rules, hanya Firestore:

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

---

## 🖼️ Cara Upload Gambar Gratis

### A. Menggunakan GitHub (Recommended untuk Repo Private)

1. **Buat folder di repo:**
   ```
   portfolio/
   └── asset/
       └── img/
           └── projects/          ← Folder baru untuk project images
   ```

2. **Upload gambar:**
   ```bash
   git add asset/img/projects/*.jpg
   git commit -m "add: project thumbnails"
   git push
   ```

3. **Copy raw URL:**
   - Buka GitHub repo → `asset/img/projects/` → klik gambar
   - Klik raw
   - Copy URL → gunakan di admin form
   - Contoh: `https://raw.githubusercontent.com/username/portfolio/main/asset/img/projects/ecommerce.jpg`

### B. Menggunakan Imgur (Free, Public)

1. **Upload ke Imgur:**
   - Buka https://imgur.com
   - Login atau anonimous
   - Upload gambar
   - Copy image URL
   - Contoh: `https://i.imgur.com/abc123.jpg`

2. **Paste URL di admin form**

**Pros:**
- Gratis unlimited
- Cepat loading

**Cons:**
- Gambar bisa dihapus jika tidak di-account
- Perlu internet untuk upload

### C. Menggunakan Cloudinary Free (500 MB)

1. **Sign up:** https://cloudinary.com (free tier)

2. **Upload gambar via web interface**

3. **Copy delivery URL**

**Pros:**
- Auto compression & optimization
- CDN global
- 500 MB gratis (cukup untuk 50+ project)

**Cons:**
- Setup agak kompleks

### D. Menggunakan ImgBB (Free)

1. **Buka https://imgbb.com**
2. **Upload gambar**
3. **Copy image URL**

---

## 🚀 Complete Setup: URL-Only Version

### Step 1: Update firebase.js

Hapus Storage import (tidak perlu):

```javascript
// HAPUS ini:
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// HAPUS ini:
const storage = getStorage(app);

// HAPUS dari export:
// ref, uploadBytes, getDownloadURL, deleteObject
```

**File baru [asset/js/firebase.js](asset/js/firebase.js):**

```javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const projectsCol = collection(db, "projects");
const orderedProjectsQuery = query(projectsCol, orderBy("created_at", "desc"));

export {
  app,
  auth,
  db,
  projectsCol,
  orderedProjectsQuery,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
};
```

### Step 2: Update admin.html

Ganti file input dengan URL input:

```html
<label>Thumbnail Image URL (opsional)
  <input type="url" name="thumbnail_url" 
         placeholder="https://example.com/project.jpg">
</label>
```

### Step 3: Update admin.js

Replace thumbnail upload logic:

```javascript
import {
  auth,
  projectsCol,
  orderedProjectsQuery,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  onAuthStateChanged,
} from "./firebase.js";

const form = document.querySelector("#project-form");
const listEl = document.querySelector("#project-list");
const statusEl = document.querySelector("#admin-status");
const submitBtn = document.querySelector("#submit-btn");
const resetBtn = document.querySelector("#reset-btn");
let editId = null;

function setStatus(message) {
  if (!statusEl) return;
  statusEl.textContent = message;
}

function setFormDisabled(disabled) {
  if (!form) return;
  Array.from(form.elements).forEach((el) => {
    el.disabled = disabled && el.type !== "button";
  });
}

function techLabel(value) {
  if (!value) return "-";
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function renderEmpty(message) {
  if (!listEl) return;
  listEl.innerHTML = `<li class="empty">${message}</li>`;
}

async function loadProjects() {
  if (!listEl) return;
  setStatus("Memuat data proyek...");
  renderEmpty("Loading...");
  try {
    const snap = await getDocs(orderedProjectsQuery);
    if (snap.empty) {
      renderEmpty("Belum ada proyek.");
      setStatus("Siap menambah proyek pertama.");
      return;
    }
    listEl.innerHTML = "";
    snap.forEach((d) => {
      const data = d.data();
      const created = data.created_at?.toDate?.();
      const item = document.createElement("li");
      item.className = "project-item";
      item.innerHTML = `
        <div class="info">
          <strong>${data.title || "Tanpa judul"}</strong>
          <p>${data.description || "-"}</p>
          <span class="meta">${techLabel(data.tech_stack)} • ${created ? created.toLocaleString() : "-"}</span>
        </div>
        <div class="actions">
          <button data-edit="${d.id}">Edit</button>
          <button data-del="${d.id}">Hapus</button>
        </div>`;
      listEl.appendChild(item);
    });
    setStatus("Data proyek dimuat.");
  } catch (err) {
    console.error(err);
    setStatus(`Gagal memuat proyek: ${err.message}`);
    renderEmpty("Tidak dapat memload data.");
  }
}

function clearForm() {
  if (!form) return;
  form.reset();
  editId = null;
  submitBtn.textContent = "Simpan Proyek";
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  setFormDisabled(true);
  submitBtn.textContent = editId ? "Menyimpan..." : "Menambah...";
  try {
    const fd = new FormData(form);
    const payload = {
      title: fd.get("title")?.trim() || "",
      description: fd.get("description")?.trim() || "",
      tech_stack: fd.get("tech_stack")?.trim() || "",
      project_url: fd.get("project_url")?.trim() || "",
      github_url: fd.get("github_url")?.trim() || "",
    };

    // Handle thumbnail URL (no upload)
    const thumbUrl = fd.get("thumbnail_url")?.trim();
    if (thumbUrl) {
      try {
        new URL(thumbUrl); // Validasi format URL
        payload.thumbnail_image = thumbUrl;
      } catch {
        throw new Error("URL thumbnail tidak valid");
      }
    }

    if (editId) {
      const docRef = doc(projectsCol, editId);
      await updateDoc(docRef, payload);
      setStatus("Proyek diperbarui.");
    } else {
      await addDoc(projectsCol, { ...payload, created_at: serverTimestamp() });
      setStatus("Proyek ditambahkan.");
    }

    clearForm();
    await loadProjects();
  } catch (err) {
    console.error(err);
    setStatus(`Gagal menyimpan: ${err.message}`);
  } finally {
    setFormDisabled(false);
    submitBtn.textContent = "Simpan Proyek";
  }
});

resetBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  clearForm();
});

listEl?.addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const edit = target.dataset.edit;
  const del = target.dataset.del;
  
  if (edit) {
    try {
      const snap = await getDocs(orderedProjectsQuery);
      const docSnap = snap.docs.find((d) => d.id === edit);
      if (!docSnap) return;
      const data = docSnap.data();
      form.title.value = data.title || "";
      form.description.value = data.description || "";
      form.tech_stack.value = techLabel(data.tech_stack);
      form.project_url.value = data.project_url || "";
      form.github_url.value = data.github_url || "";
      form.thumbnail_url.value = data.thumbnail_image || "";
      editId = edit;
      submitBtn.textContent = "Update Proyek";
      setStatus("Mode edit aktif.");
    } catch (err) {
      setStatus(`Gagal memuat data edit: ${err.message}`);
    }
  }
  
  if (del) {
    const confirmed = window.confirm("Hapus proyek ini?");
    if (!confirmed) return;
    try {
      await deleteDoc(doc(projectsCol, del));
      setStatus("Proyek dihapus.");
      await loadProjects();
    } catch (err) {
      setStatus(`Gagal menghapus: ${err.message}`);
    }
  }
});

function bindNavigationUI() {
  const themeToggle = document.getElementById("theme-toggle");
  const toggleIcon = themeToggle?.querySelector(".toggle-icon");
  const toggleText = themeToggle?.querySelector(".toggle-text");
  themeToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    const dark = document.body.classList.contains("dark-theme");
    if (toggleIcon) toggleIcon.textContent = dark ? "☀️" : "🌙";
    if (toggleText) toggleText.textContent = dark ? "Light" : "Dark";
  });

  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector("nav");
  const mobileLinks = document.querySelectorAll(".mobile-link a");
  hamburger?.addEventListener("click", () => nav?.classList.toggle("active"));
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => nav?.classList.remove("active"));
  });
}

onAuthStateChanged(auth, (user) => {
  const loginSection = document.querySelector("#login-section");
  const adminPanel = document.querySelector("#admin-panel");
  if (!user) {
    if (adminPanel) adminPanel.classList.add("hidden");
    if (loginSection) loginSection.classList.remove("hidden");
    renderEmpty("Masuk untuk mengelola proyek.");
    setStatus("Silakan login sebagai admin.");
    return;
  }
  if (loginSection) loginSection.classList.add("hidden");
  if (adminPanel) adminPanel.classList.remove("hidden");
  loadProjects();
});

bindNavigationUI();
```

---

## 📊 Cost Comparison

| Solusi | Storage | Firestore | Auth | Custom Domain | Total Cost |
|--------|---------|-----------|------|---------------|------------|
| **Firebase Full** (dengan Storage) | 5GB free + bayar | Free | Free | Free | Gratis sampai 5GB, after itu ~$0.18/GB |
| **URL-Only** (Recommended) | N/A | Free | Free | Free | **$0 selamanya** ✅ |
| **GitHub + Firestore** | Unlimited (in repo) | Free | Free | Free | **$0 selamanya** ✅ |

---

## ✅ Pros & Cons

### URL-Only (Recommended)
**Pros:**
- ✅ 100% gratis selamanya
- ✅ Tidak perlu khawatir quota
- ✅ Bisa ganti image URL kapan saja
- ✅ Firestore lebih kecil (hanya menyimpan text)
- ✅ Lebih cepat (tidak perlu upload ke Firebase)

**Cons:**
- ❌ Harus host gambar di tempat lain
- ❌ Jika image host down, thumbnail jadi broken

### Firebase Storage (Original)
**Pros:**
- ✅ Semua in one place
- ✅ Terintegrasi langsung
- ✅ Tidak perlu external service

**Cons:**
- ❌ Berbayar setelah 5GB
- ❌ Upload lebih lambat
- ❌ Lebih kompleks setup

---

## 🎯 Recommendation

Untuk portfolio pribadi dengan < 100 project image:

### **Gunakan GitHub** (Paling Simple)
1. Upload gambar ke folder `asset/img/projects/`
2. Push ke GitHub
3. Copy raw URL
4. Paste di admin panel

**Keuntungan:**
- Gambar sudah di-version control
- Backup automatic
- Free unlimited
- Reliable (GitHub never down)

**Setup minimal:**
```bash
mkdir -p asset/img/projects
# Upload gambar ke folder ini
git add asset/img/projects/
git commit -m "add: project thumbnails"
git push
```

---

## 🔄 Migration Guide: Storage → URL-Only

Jika sudah pakai Firebase Storage, cara migrasi:

1. **Download semua thumbnail dari Storage:**
   - Firebase Console → Storage → download each file

2. **Upload ke GitHub atau Imgur:**
   - GitHub: `git add` → `git commit` → `git push`
   - Atau upload ke Imgur/ImgBB

3. **Update Firestore documents:**
   - Manual update di Firestore Console
   - Atau via admin panel (edit each project, update URL)

4. **Delete Storage bucket:**
   - Firebase Console → Storage → Settings
   - Delete bucket (optional, tapi hemat quota)

---

**Kesimpulan:** Gunakan **URL-Only + GitHub** untuk hemat biaya dan kesederhanaan maksimal! 🎉

