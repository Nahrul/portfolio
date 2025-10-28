
        // Salin Skrip Theme Toggle dan Mobile Navbar dari index.html ke sini
        const themeToggle = document.getElementById('theme-toggle');
        const toggleIcon = themeToggle.querySelector('.toggle-icon');
        const toggleText = themeToggle.querySelector('.toggle-text');

        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const dark = document.body.classList.contains('dark-theme');
            toggleIcon.textContent = dark ? '☀️' : '🌙';
            toggleText.textContent = dark ? 'Light' : 'Dark';
        });

        // SKRIP UNTUK MOBILE NAVBAR
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('nav');
        const mobileLinks = document.querySelectorAll('.mobile-link a'); 

        hamburger.addEventListener('click', function() {
            nav.classList.toggle('active');
        });

        // Tutup menu saat tautan diklik 
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Hapus kelas aktif hanya jika tautan mengarah ke ID di halaman yang sama
                if (link.getAttribute('href').startsWith('#')) {
                    nav.classList.remove('active');
                }
            });
        });