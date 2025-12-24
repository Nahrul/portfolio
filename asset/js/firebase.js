// Firebase bootstrap for public pages and admin dashboard.
// Replace firebaseConfig values with your Firebase project's config (do not commit secrets).
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
// TODO: fill with your Firebase web app config from the Firebase console.
const firebaseConfig = {
  apiKey: "AIzaSyDKqDdn-jXmz-JpIe5ApEq0vgxU8mn2ig8",
  authDomain: "nahdevl-portfolio.firebaseapp.com",
  projectId: "nahdevl-portfolio",
  storageBucket: "nahdevl-portfolio.firebasestorage.app",
  messagingSenderId: "241804863202",
  appId: "1:241804863202:web:8a0813f733d4ee212ea0bb",
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
  // auth helpers
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  // firestore helpers
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
};
