
// navigation
const list = document.querySelectorAll(".list");
function activeLink() {
list.forEach((item) => item.classList.remove("active"));
this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activeLink));


// nav toggle
const select = document.querySelector(".menu-toggle input");

const nav = document.querySelector(".navigation");

select.addEventListener("click", function () {
nav.classList.toggle("slide");
});
