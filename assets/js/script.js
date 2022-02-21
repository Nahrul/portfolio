
const header = document.getElementById('header');
const toggle = document.getElementById('toggle');
const navbar = document.getElementById('navbar');

document.onclick = function(e){
	if (e.target.id !== 'header' && e.target.id !== 'toggle' && e.target.id !== 'navbar') {
	  toggle.classList.remove("active");
	  navbar.classList.remove("active");
	}
}
toggle.onclick = function(){
toggle.classList.toggle("active");
navbar.classList.toggle("active");

}




// navigation
// const list = document.querySelectorAll(".list");
// function activeLink() {
// list.forEach((item) => item.classList.remove("active"));
// this.classList.add("active");
// }
// list.forEach((item) => item.addEventListener("click", activeLink));


// // nav toggle
// const select = document.querySelector(".menu-toggle input");

// const nav = document.querySelector(".navigation");

// select.addEventListener("click", function () {
// nav.classList.toggle("slide");
// });
