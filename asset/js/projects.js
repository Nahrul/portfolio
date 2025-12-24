import { orderedProjectsQuery, getDocs } from "./firebase.js";

const grid = document.querySelector("#projects-grid");
const loadingEl = document.querySelector("#projects-loading");
const emptyEl = document.querySelector("#projects-empty");

function techLabel(value) {
  if (!value) return "-";
  if (Array.isArray(value)) return value.join(", ");
  return value;
}

function createCard(data) {
  const card = document.createElement("article");
  card.className = "project-card";
  const thumb = data.data().thumbnail_image || "https://via.placeholder.com/640x360?text=Project";
  const tech = techLabel(data.data().tech_stack);
  const updatedAt = data.data().created_at?.toDate?.();
  card.innerHTML = `
    <div class="project-image">
      <img src="${thumb}" alt="${data.data().title || "Project"}">
    </div>
    <div class="project-body">
      <h4>${data.data().title || "Tanpa judul"}</h4>
      
      <p class="project-tech">${tech}</p>
      <div class="project-links">
        ${data.data().project_url ? `<a href="${data.data().project_url}" target="_blank" rel="noopener">Live</a>` : ""}
        ${data.data().github_url ? `<a href="${data.data().github_url}" target="_blank" rel="noopener" class="ghost">Code</a>` : ""}
        ${data.id ? `<a href="project-detail.html?id=${data.id}" target="_blank" rel="noopener" class="ghost">detail</a>` : ""}
      </div>
      <p class="project-date">${updatedAt ? `Diperbarui ${updatedAt.toLocaleDateString()}` : ""}</p>
    </div>`;
  return card;
}

async function renderProjects() {
  if (!grid) return;
  loadingEl.style.display = "";
  emptyEl.style.display = "none";
  grid.innerHTML = "";
  try {
    const snap = await getDocs(orderedProjectsQuery);
    loadingEl.style.display = "none";
    if (snap.empty) {
      emptyEl.style.display = "";
      return;
    }
    snap.forEach((d) => {
      grid.appendChild(createCard(d));
      console.log(d.data());
    });
  } catch (err) {
    loadingEl.textContent = `Gagal memuat proyek: ${err.message}`;
  }
}

function bindUI() {
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
    link.addEventListener("click", () => {
      if (link.getAttribute("href")?.startsWith("#")) {
        nav?.classList.remove("active");
      }
    });
  });
}

bindUI();
renderProjects();