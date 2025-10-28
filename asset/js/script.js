// Buat observer scroll (gabungkan animasi fade dan counter)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;

      // Animasi fade
      if (el.classList.contains('fade-left')) {
        anime({
          targets: el,
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          easing: 'easeOutExpo',
          begin: () => { el.style.visibility = 'visible'; }
        });
      }
      if (el.classList.contains('fade-right')) {
        anime({
          targets: el,
          opacity: [0, 1],
          translateX: [-100, 0],
          duration: 1000,
          easing: 'easeOutExpo',
          begin: () => { el.style.visibility = 'visible'; }
        });
      }
      if (el.classList.contains('fade-up')) {
        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [50, 0],
          duration: 1000,
          easing: 'easeOutExpo',
          begin: () => { el.style.visibility = 'visible'; }
        });
      }
      if (el.classList.contains('fade-down')) {
        anime({
          targets: el,
          opacity: [0, 1],
          translateY: [-50, 0],
          duration: 1000,
          easing: 'easeOutExpo',
          begin: () => { el.style.visibility = 'visible'; }
        });
      }
      if (el.classList.contains('fade-scale')) {
        anime({
          targets: el,
          opacity: [0, 1],
          scale: [0.8, 1],
          duration: 1000,
          easing: 'easeOutExpo',
          begin: () => { el.style.visibility = 'visible'; }
        });
      }

      // Counter animation jika #rewards masuk viewport
      if (el.id === 'rewards') {
        const rewardCounters = el.querySelectorAll('h3');
        rewardCounters.forEach(counter => {
          anime({
            targets: counter,
            innerHTML: [0, parseInt(counter.dataset.counterValue)],
            easing: 'linear',
            round: 1,
            duration: 2000
          });
        });
      }

    //   observer.unobserve(el); // animasi hanya sekali
    }
  });
}, {
  threshold: 0.3
});

// Amati elemen dengan kelas animasi
document.querySelectorAll('.fade-left, .fade-right, .fade-up, .fade-down, .fade-scale').forEach(el => {
  el.style.opacity = 0;
  el.style.visibility = 'hidden'; // hindari muncul sekejap
  observer.observe(el);
});

// Counter number animation saat scroll
document.querySelectorAll('#rewards h3').forEach(el => {
  const value = parseInt(el.innerText.replace('+', ''));
  el.innerText = "0"; // Set awal
  el.classList.add("fade-up"); // Trigger pakai scroll
  el.dataset.counterValue = value; // Simpan nilai target
});

// Observe rewards section untuk counter
const rewardsSection = document.querySelector('#rewards');
if (rewardsSection) {
  observer.observe(rewardsSection);
}

// Hero section animation
anime.timeline({ easing: 'easeOutExpo', duration: 1000 })
  .add({
    targets: '.welcome h3',
    translateY: [-50, 0],
    opacity: [0, 1]
  })
  .add({
    targets: '.welcome p',
    translateY: [-30, 0],
    opacity: [0, 1],
    offset: '-=800'
  })
  .add({
    targets: '.welcome button',
    scale: [0, 1],
    opacity: [0, 1],
    offset: '-=700'
  });

// Cursor animation
document.addEventListener("mousemove", (e) => {
  const cursor = document.querySelector(".custom-cursor");
  if (cursor) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  }
});
const themeToggle = document.getElementById('theme-toggle');
	const toggleIcon = themeToggle.querySelector('.toggle-icon');
	const toggleText = themeToggle.querySelector('.toggle-text');

	themeToggle.addEventListener('click', function() {
	document.body.classList.toggle('dark-theme');
	const dark = document.body.classList.contains('dark-theme');
	toggleIcon.textContent = dark ? '☀️' : '🌙';
	toggleText.textContent = dark ? 'Light' : 'Dark';
	});
	new Typed('#typed', {
		strings: ['Programming', 'Design', 'Development', 'UI/UX', 'Database'],
		typeSpeed: 90,
		backSpeed: 70,
		backDelay: 2000,
		loop: true
	});

	  function whatsapp() {
	  	var fullname = document.getElementById('fullname').value;
	  	var email = document.getElementById('email').value;
	  	var number = document.getElementById('number').value;
	  	var budget = document.getElementById('budget').value;
	  	var message = document.getElementById('message').value;

	  	console.log(fullname,email,number,budget,message);
	  	var link = `https://wa.me/6283130325742?text=Nama:${fullname}%0A%0AEmail:${email}%0A%0ANumber:${number}%0A%0ABudget:${budget}%0A%0A${message}`.replace(/ /g, '+').replace(/\n/g, '%0A');
	  	// link.replace(/ /g, '+');
	  	window.location = link;
	  	console.log(link)
	  }
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