// ========================
// Navbar Scroll Effect
// (เปลี่ยน style navbar เมื่อ scroll ลง)
// ========================
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ========================
// Fade-in on Scroll (Basic)
// (element ที่มี class="fade-in" จะค่อยๆ โผล่มาเมื่อเข้าหน้าจอ)
// ========================
const faders = document.querySelectorAll(".fade-in");

const appearOptions = { threshold: 0.2 };

const appearOnScroll = new IntersectionObserver(function(entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

// ========================
// Advanced Animation + Count-up
// (ใช้ data-anim, data-count, และ IntersectionObserver)
// ========================
(function () {
  if (window.__pjAnimationsInjected) return;
  window.__pjAnimationsInjected = true;

  document.addEventListener('DOMContentLoaded', () => {
    // เลือก targets (section, card, gallery, counter)
    const targets = [
      ...document.querySelectorAll('section'),
      ...document.querySelectorAll('.card'),
      ...document.querySelectorAll('.gallery img'),
      ...document.querySelectorAll('[data-count]')
    ];

    // ใส่ class animation ตาม data-anim
    targets.forEach(el => {
      if (el.closest && el.closest('header, nav, footer')) return;
      const animAttr = el.getAttribute('data-anim');
      if (animAttr === 'left') {
        if (!el.classList.contains('slide-in-left')) el.classList.add('slide-in-left');
      } else if (animAttr === 'right') {
        if (!el.classList.contains('slide-in-right')) el.classList.add('slide-in-right');
      } else {
        if (!el.classList.contains('fade-in') && !el.classList.contains('slide-in-left') && !el.classList.contains('slide-in-right')) {
          el.classList.add('fade-in');
        }
      }
    });

    // Observer: trigger animation + count-up
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('show');

        // Count-up
        const countAttr = el.getAttribute('data-count');
        if (countAttr && !el.__countStarted) {
          el.__countStarted = true;
          startCountUp(el, parseFloat(countAttr));
        }

        // Stagger children (option)
        if (el.hasAttribute('data-stagger')) {
          const children = Array.from(el.children);
          children.forEach((child, idx) => {
            child.style.transitionDelay = (idx * 0.12) + 's';
            child.classList.add('show');
          });
        }

        obs.unobserve(el);
      });
    }, observerOptions);

    targets.forEach(t => {
      if (t.closest && t.closest('header, nav, footer')) return;
      io.observe(t);
    });

// Function: Count-up animation
function startCountUp(el, target) {
  const duration = 2000; // 2 วินาที
  const start = performance.now();
  const type = el.getAttribute("data-type"); // "percent" หรือ "number"

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);

    if (type === "percent") {
      el.textContent = value + "%"; // % ตลอด
    } else {
      el.textContent = value.toLocaleString(); // comma ไม่มี %
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (type === "percent") {
        el.textContent = target + "%";
      } else {
        el.textContent = target.toLocaleString();
      }
    }
  }

  requestAnimationFrame(step);
}

    // Fallback: ถ้า browser ไม่รองรับ IntersectionObserver
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => {
        el.classList.add('show');
        const countAttr = el.getAttribute('data-count');
        if (countAttr) startCountUp(el, parseFloat(countAttr));
      });
    }
  });
})();

// ========================
// Hero Slider
// (สไลด์รูปภาพอัตโนมัติ + ปุ่มควบคุม)
// ========================

// Slider
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
  });
}

document.querySelector(".next").addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
});

document.querySelector(".prev").addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
});

// Auto slide
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 6000);

// Parallax Effect
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  slides.forEach((slide) => {
    slide.style.transform = `translateY(${scrollY * 0.3}px)`; // ปรับ 0.3 ให้ช้ากว่า content
  });
});
