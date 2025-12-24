import { auth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "./firebase.js";

const loginForm = document.querySelector("#login-form");
const logoutBtn = document.querySelector("#logout-btn");
const statusEl = document.querySelector("#auth-status");

function setAuthMessage(message) {
  if (statusEl) statusEl.textContent = message;
}

loginForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  setAuthMessage("Memproses login...");
  try {
    await signInWithEmailAndPassword(auth, email, password);
    setAuthMessage("Login berhasil.");
  } catch (err) {
    setAuthMessage(`Login gagal: ${err.message}`);
  }
});

logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    setAuthMessage("Anda telah logout.");
  } catch (err) {
    setAuthMessage(`Gagal logout: ${err.message}`);
  }
});

onAuthStateChanged(auth, (user) => {
  const loginSection = document.querySelector("#login-section");
  const adminPanel = document.querySelector("#admin-panel");
  if (user) {
    loginSection?.classList.add("hidden");
    adminPanel?.classList.remove("hidden");
  } else {
    loginSection?.classList.remove("hidden");
    adminPanel?.classList.add("hidden");
  }
});
