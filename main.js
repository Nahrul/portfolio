const select = document.querySelector('.menu-toggle input');

const nav = document.querySelector('nav ul');

select.addEventListener('click', function() {
    nav.classList.toggle('slide');
})