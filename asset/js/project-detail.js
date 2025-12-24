import { db, doc, getDoc } from "./firebase.js";


// Fungsi untuk mendapatkan parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi utama untuk mengisi konten
function loadProjectDetail(data) {
    console.log(data)
    const projectId = getQueryParam('id');

    // 1. Cek apakah project ID valid
    if (!data) {
        document.getElementById('project-detail').innerHTML = `
            <div class="detail-container" style="text-align:center; padding: 100px 0;">
                <h1>Proyek Tidak Ditemukan</h1>
                <p>Maaf, detail proyek yang Anda cari tidak tersedia.</p>
                <a href="projects.html" class="back-to-projects">← Kembali ke Daftar Proyek</a>
            </div>
        `;
        return;
    }

    // 2. Mengisi Judul dan Breadcrumb
    document.querySelector('.project-title').textContent = data.title;
    document.querySelector('.breadcrumb').innerHTML = `<a href="projects.html">Portfolio</a> / ${data.title}`;

    // 3. Mengisi Info Bar
    const updatedAt = data.created_at?.toDate?.();
    document.querySelector('.project-info-bar').innerHTML = `
        <div><h4>Klien</h4><p>${data.client}</p></div>
        <div><h4>Layanan</h4><p>${data.service}</p></div>
        <div><h4>Teknologi</h4><p>${data.tech_stack}</p></div>
        <div><h4>Diperbarui</h4><p>${updatedAt ? ` ${updatedAt.toLocaleDateString()}` : ""}</p></div>
        <a href="${data.project_url}" class="live-demo-btn">Demo</a>
    `;

    // 4. Mengisi Media Utama
    document.querySelector('.main-media').innerHTML = `
        <img style="grid-area: a;" src="${data.thumbnail_image}" alt="Gambar utama proyek ${data.title}">
        <img style="grid-area: b;" src="${data.image1_url}" alt="Gambar utama proyek ${data.title}">
        <img style="grid-area: c;" src="${data.image2_url}" alt="Gambar utama proyek ${data.title}">
    `;

    // 5. Mengisi Deskripsi
    document.querySelector('.description-section h2').textContent = "Tinjauan Proyek";
    document.querySelector('.description-section p').textContent = data.description;

    // 6. Mengisi Tantangan & Solusi
    // const challengeContainer = document.querySelector('.challenge-solution');
    // challengeContainer.innerHTML = '<h2>Tantangan & Solusi</h2>';
    
    // project.challenges.forEach(item => {
    //     challengeContainer.innerHTML += `
    //         <div class="point">
    //             <h3>Tantangan: ${item.title}</h3>
    //             <p>Solusi: ${item.solution}</p>
    //         </div>
    //     `;
    // });
    
    // (Anda juga bisa menambahkan logika untuk Galeri jika ada)
}
// async function renderProjects() {
//   try {
//     const snap = await getDocs(orderedProjectsQuery);
//     if (snap.empty) {
//       return console.log("❌ ERROR: No projects found in Firestore.");
//     }
//     snap.forEach((d) => {
//       loadProjectDetail(d);
//       console.log(d.data());
//     });
//   } catch (err) {
//     return console.log(`Gagal memuat proyek: ${err.message}`);
//   }
// }
async function initPage() {
    const projectId = getQueryParam('id');

    // Jika tidak ada ID di URL, langsung 404
    if (!projectId) {
        console.error("No ID provided in URL");
        return;
    }

    try {
        // 1. Buat referensi ke dokumen spesifik
        const docRef = doc(db, "projects", projectId);
        
        // 2. Ambil data
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            // 3. Kirim data ke fungsi UI
            console.log("Data loaded:", docSnap.data());
            loadProjectDetail(docSnap.data());
        } else {
            // ID valid tapi data tidak ada di database
            console.log("No such document!");
        }
    } catch (error) {
        console.error("Error getting document:", error);
    }
}


// SKRIP KHUSUS HALAMAN INI: Theme Toggle dan Mobile Navbar
        const themeToggle = document.getElementById('theme-toggle');
        const toggleIcon = themeToggle.querySelector('.toggle-icon');
        const toggleText = themeToggle.querySelector('.toggle-text');

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const dark = document.body.classList.contains('dark-theme');
            toggleIcon.textContent = dark ? '☀️' : '🌙';
            toggleText.textContent = dark ? 'Light Mode' : 'Dark Mode';
        });

        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav');
        const mobileLinks = document.querySelectorAll('.mobile-link a'); 

        if(hamburger) {
            hamburger.addEventListener('click', function() {
                nav.classList.toggle('active');
            });
        }
        
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Tutup menu mobile ketika link diklik
                nav.classList.remove('active');
            });
        });
initPage();