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