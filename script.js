// =========================
// Navbar Scroll Effect (Logic ที่ปรับให้รองรับ Mobile)
// =========================
window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".navbar");
  const scrollY = window.scrollY;
  const isMobile = window.innerWidth <= 768;

  // 1. Logic สำหรับ Desktop (เปลี่ยนสีเมื่อ Scroll)
  if (!isMobile) {
    if (scrollY > 50) {
      // Desktop: เมื่อเลื่อนลงมา ให้โปร่งแสง (ตาม .scrolled ใน CSS)
      navbar.classList.add("scrolled");
    } else {
      // Desktop: เมื่ออยู่บนสุด ให้ใช้สีเดิม (rgba(39, 58, 128, 0.95))
      navbar.classList.remove("scrolled");
    }
  } 
  
  // 2. Logic สำหรับ Mobile (ทึบเสมอ)
  // **ไม่จำเป็นต้องทำอะไรใน JS** เพราะเราได้กำหนดให้
  // .navbar ใน CSS Media Query เป็นสีทึบด้วย !important แล้ว
  
  // ***หากต้องการให้ Mobile ใช้คลาส .scrolled ตลอดเวลา (เพื่อให้ง่ายต่อการจัดการ CSS)***
  if (isMobile) {
      if (!navbar.classList.contains('scrolled')) {
          // ถ้าเป็น Mobile ให้เพิ่มคลาส scrolled ตลอดเวลา
          navbar.classList.add('scrolled'); 
      }
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


// Gallery Carousel (infinite loop)
const galleryTrack = document.querySelector('.gallery-track');
let gallerySlides = document.querySelectorAll('.gallery-slide');
const galleryPrev = document.querySelector('.gallery-btn.prev');
const galleryNext = document.querySelector('.gallery-btn.next');

let galleryIndex = 0;
let slidesToShow = 3;

// Clone slides for infinite loop
function cloneSlides() {
  gallerySlides.forEach(slide => {
    const clone = slide.cloneNode(true);
    galleryTrack.appendChild(clone);
  });
}

// Update slidesToShow based on screen size
function updateSlidesToShow() {
  if (window.innerWidth <= 600) slidesToShow = 1;
  else if (window.innerWidth <= 992) slidesToShow = 2;
  else slidesToShow = 3;
}

// Show slide
function showGallerySlide(index) {
  galleryIndex = index;
  const offset = -(galleryIndex * (100 / slidesToShow));
  galleryTrack.style.transition = "transform 0.4s ease";
  galleryTrack.style.transform = `translateX(${offset}%)`;

  // Reset loop when reaching the end
  setTimeout(() => {
    if (galleryIndex >= gallerySlides.length) {
      galleryTrack.style.transition = "none";
      galleryIndex = 0;
      galleryTrack.style.transform = `translateX(0%)`;
    }
  }, 400);
}

// Events
galleryPrev.addEventListener('click', () => {
  galleryIndex = (galleryIndex <= 0) ? gallerySlides.length - 1 : galleryIndex - 1;
  showGallerySlide(galleryIndex);
});
galleryNext.addEventListener('click', () => {
  showGallerySlide(galleryIndex + 1);
});
window.addEventListener('resize', () => {
  updateSlidesToShow();
});

// Init
updateSlidesToShow();
cloneSlides();
gallerySlides = document.querySelectorAll('.gallery-slide'); // update after cloning
showGallerySlide(0);

// Auto Slide
setInterval(() => {
  showGallerySlide(galleryIndex + 1);
}, 5000);


// ========================
// Hamburger Menu Toggle (Logic ที่แก้ไขแล้ว)
// ========================
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const closeMenu = document.getElementById('close-menu'); 
  
  if (hamburger && navLinks) {
    
    // ฟังก์ชันหลักในการเปิด/ปิดเมนู
    const toggleMenu = () => {
      // 1. สลับคลาส 'active' เพื่อแสดง/ซ่อนเมนูและจัดการ Icon ผ่าน CSS
      navLinks.classList.toggle('active');
    };

    // 1. กด Hamburger เปิด/ปิดเมนู
    hamburger.addEventListener('click', toggleMenu);
    
    // 2. กดปุ่ม Close ปิดเมนู
    if (closeMenu) {
        closeMenu.addEventListener('click', toggleMenu);
    }

    // 3. กดลิงก์ในเมนูแล้วปิดเมนู
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        // ปิดเมนูหลัก
        navLinks.classList.remove('active');
      });
    });
  }
});

