const projectData = {
    'ecommerce': {
        title: "Website E-Commerce Modern",
        client: "PT. Teknologi Maju",
        service: "Full-Stack Development, UI/UX Redesign",
        tech: "React, Node.js, PostgreSQL",
        year: "2023",
        demoUrl: "https://demo.ecommerce.com",
        heroImage: "asset/img/ecommerce.jpg",
        description: "Proyek ini melibatkan perancangan ulang penuh pada platform e-commerce lama klien untuk meningkatkan pengalaman pengguna (UX) dan kecepatan transaksi...",
        challenges: [
            { title: "Skalabilitas Lambat", solution: "Migrasi database ke PostgreSQL dan implementasi Redis caching, meningkatkan throughput 400%." },
            { title: "Checkout yang Rumit", solution: "Perampingan proses checkout menjadi 3 langkah sederhana dengan validasi real-time, mengurangi tingkat drop-off menjadi 25%." }
        ]
    },
    'landing-saas': {
        title: "Landing Page Perusahaan SaaS",
        client: "Startup Inovasi Cepat",
        service: "Web Design, Front-End Development",
        tech: "HTML, Tailwind CSS, Alpine.js",
        year: "2024",
        demoUrl: "https://demo.saas-page.com",
        heroImage: "asset/img/landing-page.jpg",
        description: "Membangun landing page berkinerja tinggi yang dioptimalkan untuk SEO dan konversi. Fokus pada kejelasan pesan dan *Call-to-Action* yang kuat.",
        challenges: [
            { title: "Kecepatan Loading Buruk", solution: "Mengoptimalkan gambar dan aset menggunakan format WebP dan defer loading, mencapai skor Lighthouse 98+." },
            { title: "Desain Kaku", solution: "Menerapkan kerangka kerja Tailwind CSS untuk mencapai fleksibilitas dan desain yang modern." }
        ]
    },
    'time-management': {
        title: "Aplikasi Manajemen Waktu",
        client: "Freelancer",
        service: "Mobile App Development",
        tech: "React Native, Firebase",
        year: "2024",
        demoUrl: "https://demo.saas-page.com",
        heroImage: "asset/img/time-management.jpg",
        description: "Membangun aplikasi manajemen waktu yang membantu pengguna mengatur tugas dan jadwal mereka dengan lebih efisien.",
        challenges: [
            { title: "Tugas yang Terlupakan", solution: "Menerapkan pengingat berbasis lokasi dan waktu menggunakan Firebase Cloud Messaging." },
            { title: "Antarmuka yang Tidak Intuitif", solution: "Melakukan pengujian pengguna dan iterasi desain untuk meningkatkan pengalaman pengguna." }
        ]
    },
    'visualization-data': {
        title: "Aplikasi Visualisasi Data",
        client: "perusahaan Analitik Data",
        service: "Automasi Data, Visualisasi",
        tech: "React Native, Firebase, python, sckylarn, matplotlib",
        year: "2024",
        demoUrl: "https://demo.saas-page.com",
        heroImage: "asset/img/visualization-data.jpg",
        description: "Membangun aplikasi visualisasi data yang membantu pengguna memahami dan menganalisis data dengan lebih baik.",
        challenges: [
            { title: "Tantangan Data yang Besar", solution: "Menerapkan teknik pengolahan data yang efisien menggunakan Python dan pustaka terkait." },
            { title: "Cleaning Data yang Tidak Konsisten", solution: "Menggunakan pustaka Pandas untuk membersihkan dan memformat data sebelum analisis." }
        ]
    },
    // Tambahkan objek proyek lainnya di sini sesuai ID di projects.html
};

// Fungsi untuk mendapatkan parameter dari URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Fungsi utama untuk mengisi konten
function loadProjectDetail() {
    const projectId = getQueryParam('id');
    const project = projectData[projectId]; // Mengambil data dari project-data.js

    // 1. Cek apakah project ID valid
    if (!project) {
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
    document.querySelector('.project-title').textContent = project.title;
    document.querySelector('.breadcrumb').innerHTML = `<a href="projects.html">Portfolio</a> / ${project.title}`;

    // 3. Mengisi Info Bar
    document.querySelector('.project-info-bar').innerHTML = `
        <div><h4>Klien</h4><p>${project.client}</p></div>
        <div><h4>Layanan</h4><p>${project.service}</p></div>
        <div><h4>Teknologi</h4><p>${project.tech}</p></div>
        <div><h4>Tahun</h4><p>${project.year}</p></div>
        <a href="${project.demoUrl}" target="_blank" class="live-demo-btn">Lihat Demo Langsung</a>
    `;

    // 4. Mengisi Media Utama
    document.querySelector('.main-media').innerHTML = `
        <img src="${project.heroImage}" alt="Gambar utama proyek ${project.title}">
    `;

    // 5. Mengisi Deskripsi
    document.querySelector('.description-section h2').textContent = "Tinjauan Proyek";
    document.querySelector('.description-section p').textContent = project.description;

    // 6. Mengisi Tantangan & Solusi
    const challengeContainer = document.querySelector('.challenge-solution');
    challengeContainer.innerHTML = '<h2>Tantangan & Solusi</h2>';
    
    project.challenges.forEach(item => {
        challengeContainer.innerHTML += `
            <div class="point">
                <h3>Tantangan: ${item.title}</h3>
                <p>Solusi: ${item.solution}</p>
            </div>
        `;
    });
    
    // (Anda juga bisa menambahkan logika untuk Galeri jika ada)
}

// Panggil fungsi setelah semua DOM siap dimuat
document.addEventListener('DOMContentLoaded', loadProjectDetail);

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