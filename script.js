// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-count');
    const count = +counter.innerText.replace(/\D/g, '');
    const inc = target / speed;
    const type = counter.dataset.type;

    if (count < target) {
      let nextVal = Math.ceil(count + inc);
      counter.innerText = type === 'percent' ? nextVal + '%' : nextVal.toLocaleString();
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = type === 'percent' ? target + '%' : target.toLocaleString();
    }
  };
  updateCount();
});


window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Fade-in on scroll
const faders = document.querySelectorAll(".fade-in");

const appearOptions = {
  threshold: 0.2
};

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

// Stats Count-up
function countUp(element, target) {
  let count = 0;
  const speed = target / 100; // ปรับความเร็วได้
  const update = () => {
    count += speed;
    if (count < target) {
      element.textContent = Math.floor(count) + "%";
      requestAnimationFrame(update);
    } else {
      element.textContent = target + "%";
    }
  };
  update();
}

const statElements = document.querySelectorAll("[data-count]");
statElements.forEach(el => {
  const target = +el.getAttribute("data-count");
  countUp(el, target);
});

// --- ANIMATION + COUNT-UP (append) ---
(function () {
  if (window.__pjAnimationsInjected) return;
  window.__pjAnimationsInjected = true;

  // รอ DOM โหลด (ปลอดภัย)
  document.addEventListener('DOMContentLoaded', () => {
    // Element targets: ปรับได้ตามต้องการ
    const targets = [
      ...document.querySelectorAll('section'),      // ทุก section
      ...document.querySelectorAll('.card'),        // การ์ด (actions, voices, goals)
      ...document.querySelectorAll('.gallery img'), // รูป gallery
      ...document.querySelectorAll('[data-count]')  // ตัวเลขที่ต้อง count-up
    ];

    // ให้แต่ละ target ได้ class พื้นฐาน ถ้ายังไม่มี (non-destructive)
    targets.forEach(el => {
      // อย่าใส่ให้ navbar / footer หากเผลอเลือก
      if (el.closest && el.closest('header, nav, footer')) return;

      const animAttr = el.getAttribute('data-anim'); // "left" | "right" | "fade"
      if (animAttr === 'left') {
        if (!el.classList.contains('slide-in-left')) el.classList.add('slide-in-left');
      } else if (animAttr === 'right') {
        if (!el.classList.contains('slide-in-right')) el.classList.add('slide-in-right');
      } else {
        // ค่า default ให้ fade-in ถ้ายังไม่มี class
        if (!el.classList.contains('fade-in') && !el.classList.contains('slide-in-left') && !el.classList.contains('slide-in-right')) {
          el.classList.add('fade-in');
        }
      }
    });

    // IntersectionObserver สำหรับเล่น animation เมื่อเข้า viewport
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    };

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        // เพิ่ม class 'show' เพื่อ trigger transition
        el.classList.add('show');

        // ถ้ามี data-count ให้เริ่มนับ
        const countAttr = el.getAttribute('data-count');
        if (countAttr && !el.__countStarted) {
          el.__countStarted = true;
          startCountUp(el, parseFloat(countAttr));
        }

        // ถ้าอยากได้ stagger (เช่น การ์ดภายใน container) เจ้าของโค้ดที่ต้องการ stagger สามารถใช้ attribute data-stagger
        if (el.hasAttribute('data-stagger')) {
          const children = Array.from(el.children);
          children.forEach((child, idx) => {
            // add small delay classes (optional)
            child.style.transitionDelay = (idx * 0.12) + 's';
            child.classList.add('show'); // if child already had animation class
          });
        }

        // เรา unobserve เพื่อให้เล่นครั้งเดียว (เปลี่ยนได้)
        obs.unobserve(el);
      });
    }, observerOptions);

    // Observe ทุก target ที่เรเตรียมไว้ (ยกเว้น header/footer)
    targets.forEach(t => {
      if (t.closest && t.closest('header, nav, footer')) return;
      io.observe(t);
    });

    // Count-up function (smoother, uses requestAnimationFrame)
    function startCountUp(el, target) {
      const duration = 1200; // ms, ปรับได้
      const start = performance.now();
      const initial = 0;
      const isInteger = Number.isInteger(target);

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = Math.floor(progress * (target - initial) + initial);
        el.textContent = isInteger ? value + (el.textContent.includes('%') ? '%' : '') : (Math.round((value + Number.EPSILON) * 100) / 100);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // ensure final value
          el.textContent = (isInteger ? target + (el.textContent.includes('%') ? '%' : '') : target);
        }
      }
      requestAnimationFrame(step);
    }

    // Fallback: ถ้า browser ไม่รองรับ IntersectionObserver → แสดงทั้งหมดเลย
    if (!('IntersectionObserver' in window)) {
      targets.forEach(el => {
        el.classList.add('show');
        const countAttr = el.getAttribute('data-count');
        if (countAttr) startCountUp(el, parseFloat(countAttr));
      });
    }
  });
})();

// Hero Slider
let slides = document.querySelectorAll('.hero-slider .slide');
let currentSlide = 0;
let slideInterval = setInterval(nextSlide, 5000);

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) slide.classList.add('active');
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}

// ปุ่มกด
document.querySelector('.next').addEventListener('click', () => {
  nextSlide();
  resetInterval();
});

document.querySelector('.prev').addEventListener('click', () => {
  prevSlide();
  resetInterval();
});

// รีเซ็ตเวลา autoplay
function resetInterval() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
}
