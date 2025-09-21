// =============================
// Hero Slider
// =============================
let slides = document.querySelectorAll('.slide');
let dotsContainer = document.querySelector('.hero-dots');
let current = 0;

slides.forEach((_, i) => {
  let dot = document.createElement('span');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => showSlide(i));
  dotsContainer.appendChild(dot);
});

let dots = document.querySelectorAll('.hero-dots span');

function showSlide(index) {
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = index;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}

setInterval(() => {
  showSlide((current + 1) % slides.length);
}, 5000);

// =============================
// Stats Counter Animation
// =============================
const counters = document.querySelectorAll('.stat-number');
const options = { threshold: 0.5 };

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      let counter = entry.target;
      let target = +counter.dataset.count;
      let count = 0;
      let step = target / 100;
      let interval = setInterval(() => {
        count += step;
        if (count >= target) {
          counter.textContent = target + '%';
          clearInterval(interval);
        } else {
          counter.textContent = Math.floor(count) + '%';
        }
      }, 30);
      obs.unobserve(counter);
    }
  });
}, options);

counters.forEach(counter => observer.observe(counter));

// =============================
// Scroll Animations
// =============================
const animatedSections = document.querySelectorAll('[data-anim]');
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

animatedSections.forEach(sec => animObserver.observe(sec));
