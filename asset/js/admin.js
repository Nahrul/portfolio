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
let currentThumbPath = null;

// DEBUG: Verify form is found
console.log("Form element found:", form);
console.log("Form ID check:", form?.id);
if (!form) {
  console.error("❌ ERROR: #project-form not found! Check HTML structure.");
}

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
    renderEmpty("Tidak dapat memuat data.");
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
  console.log("🔍 Form submit triggered");
  console.log("Form reference:", form);
  console.log("Form is null?", form === null);
  
  setFormDisabled(true);
  submitBtn.textContent = editId ? "Menyimpan..." : "Menambah...";
  try {
    if (!form) {
      throw new Error("Form element not found!");
    }
    
    // Alternative: Read values directly from input elements
    const titleInput = form.querySelector('input[name="title"]');
    const descInput = form.querySelector('textarea[name="description"]');
    const techInput = form.querySelector('input[name="tech_stack"]');
    const clientInput = form.querySelector('input[name="client"]');
    const serviceInput = form.querySelector('input[name="service"]');
    const projectUrlInput = form.querySelector('input[name="project_url"]');
    const githubUrlInput = form.querySelector('input[name="github_url"]');
    const thumbUrlInput = form.querySelector('input[name="thumbnail_url"]');
    const image1Input = form.querySelector('input[name="image1"]');
    const image2Input = form.querySelector('input[name="image2"]');
    
    console.log("Input elements found:", {
      titleInput,
      descInput,
      techInput,
      projectUrlInput,
      githubUrlInput,
      thumbUrlInput
    });
    
    // Read values directly
    const title = titleInput?.value || "";
    const description = descInput?.value || "";
    const tech_stack = techInput?.value || "";
    const client = clientInput?.value || "";
    const service = serviceInput?.value || "";
    const project_url = projectUrlInput?.value || "";
    const github_url = githubUrlInput?.value || "";
    const thumbnail_url = thumbUrlInput?.value || "";
    const image1_url = image1Input?.value || "";
    const image2_url = image2Input?.value || "";
    
    console.log("Direct values read:", {
      title,
      description,
      tech_stack,
      project_url,
      github_url,
      thumbnail_url
    });
    
    const payload = {
      title: title.trim() || "",
      description: description.trim() || "",
      tech_stack: tech_stack.trim() || "",
      client: client.trim() || "",
      service: service.trim() || "",
      project_url: project_url.trim() || "",
      github_url: github_url.trim() || "",
      image1_url: image1_url.trim() || "",
      image2_url: image2_url.trim() || "",
      
    };
    
    console.log("Payload to save:", payload);

    // Handle thumbnail URL (no upload)
    if (thumbnail_url) {
      try {
        new URL(thumbnail_url); // Validasi format URL
        payload.thumbnail_image = thumbnail_url;
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
      form.client.value = data.client || "";
      form.service.value = data.service || "";
      form.project_url.value = data.project_url || "";
      form.github_url.value = data.github_url || "";
      form.thumbnail_url.value = data.thumbnail_image || "";
      form.image1.value = data.image1_url || "";
      form.image2.value = data.image2_url || "";
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
