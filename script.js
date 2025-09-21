// Navbar scroll
window.addEventListener("scroll", () => {
  document.querySelector(".navbar").classList.toggle("scrolled", window.scrollY > 50);
});

// Hero Slider
let currentSlide = 0;
const slides = document.querySelectorAll(".hero-slider .slide");
const prevBtn = document.querySelector(".nav-btn.prev");
const nextBtn = document.querySelector(".nav-btn.next");

function showSlide(index) {
  slides.forEach((s, i) => s.classList.toggle("active", i === index));
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}
function prevSlideFn() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}
if (nextBtn) nextBtn.addEventListener("click", nextSlide);
if (prevBtn) prevBtn.addEventListener("click", prevSlideFn);
setInterval(nextSlide, 5000);

// Stats Counter
function animateCounter(el) {
  const target = +el.getAttribute("data-count");
  let count = 0;
  const update = () => {
    if (count < target) {
      count++;
      el.textContent = count + "%";
      requestAnimationFrame(update);
    } else {
      el.textContent = target + "%";
    }
  };
  update();
}
const counters = document.querySelectorAll(".stat-number");
let counterStarted = false;
window.addEventListener("scroll", () => {
  const goals = document.querySelector("#goals");
  if (!counterStarted && goals.getBoundingClientRect().top < window.innerHeight) {
    counters.forEach(c => animateCounter(c));
    counterStarted = true;
  }
});

// Scroll Animations
const animElements = document.querySelectorAll("[data-anim]");
function checkAnim() {
  animElements.forEach(el => {
    const pos = el.getBoundingClientRect().top;
    if (pos < window.innerHeight - 50) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", checkAnim);
window.addEventListener("load", checkAnim);
