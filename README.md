# 🚀 Nahdevl's Personal Portfolio Website

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status: Complete](https://img.shields.io/badge/Status-Complete-brightgreen)](https://github.com/Nahrul/portfolio)

Selamat datang di repositori kode sumber untuk portofolio pribadi saya. Portofolio ini menampilkan keahlian saya dalam pengembangan web Full-Stack, mulai dari desain antarmuka hingga implementasi logika *backend* yang bersih.

## 🌟 Demo Langsung

Lihat versi yang sudah di-deploy dan berfungsi penuh di sini:
**[Lihat Live Demo Portofolio Nahdevl](https://nahdevl.online/portfolio)** ## ✨ Fitur Utama

Portofolio ini dibangun sebagai *Single-Page Application* (SPA) dengan navigasi *smooth* untuk pengalaman pengguna yang efisien, dan memiliki halaman proyek terpisah untuk detail mendalam.

* **Responsif Penuh:** Tampilan sempurna di perangkat *desktop* dan *mobile* (menggunakan *Hamburger Menu*).
* **Mode Gelap:** Fitur *Toggle Dark Mode* untuk kenyamanan visual.
* **Navigasi Sticky:** Bilah navigasi yang tetap di atas (*sticky*) saat menggulir.
* **Efek Typing Otomatis:** Menggunakan `Typed.js` pada bagian Jumbotron untuk menyajikan keahlian secara dinamis.
* **Halaman Proyek Dinamis:** Menggunakan satu template halaman detail (`project-detail.html`) yang memuat data proyek berbeda berdasarkan parameter URL (ID).
* **Formulir Kontak WA:** Formulir kontak langsung yang terintegrasi ke WhatsApp.

## 🛠️ Teknologi yang Digunakan

| Kategori | Teknologi | Deskripsi Singkat |
| :--- | :--- | :--- |
| **Frontend** | HTML5, CSS3 | Struktur dasar dan penataan gaya. |
| **Styling** | Vanilla CSS, Media Queries | Layout responsif, modularitas, dan tema gelap. |
| **Interaksi** | JavaScript (Vanilla JS) | Logika *Hamburger Menu*, *Theme Toggle*, dan fungsionalitas formulir. |
| **Eksternal** | Typed.js, Anime.js | Untuk efek mengetik yang dinamis dan animasi. |

## 📁 Struktur Repositori

Struktur file dirancang agar bersih dan mudah dikelola dengan pemisahan CSS yang modular:
portfolio/
├── asset/
│   ├── icon/            # Ikon dan SVG (misal: Bintang, Sosmed)
│   ├── base.css         # Gaya dasar: Navbar, Footer, Tema, Utilitas
│   ├── home.css         # Gaya spesifik untuk halaman index.html
│   ├── project.css      # Gaya untuk grid projects.html
│   ├── project-detail.css # Gaya KHUSUS untuk halaman detail proyek
│   └── (gambar)/        # Folder untuk gambar proyek dan hero
├── project-data.js      # Data (JSON) semua proyek untuk dimuat secara dinamis
├── index.html           # Halaman Utama (Home)
├── projects.html        # Halaman Daftar Semua Proyek
├── project-detail.html  # Template Halaman Detail Proyek Dinamis
└── README.md            # File yang sedang Anda baca

🤝 Kontribusi
Portofolio ini dibuat untuk tujuan pembelajaran dan showcase. Saran atau kritik konstruktif sangat diterima. Jika Anda menemukan bug atau memiliki ide untuk perbaikan:
Fork repositori ini.

📞 Hubungi Saya
Nahrul Hayat
LinkedIn: https://www.linkedin.com/in/nahrul-hayat-76b60a28b
Instagram: https://www.instagram.com/nahdevl.io
Email: nahrulhayat128@gmail.com

Dibuat dengan ❤️ oleh Nahdevl
