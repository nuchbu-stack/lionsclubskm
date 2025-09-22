// ========================
// Navbar Scroll Effect
// ========================
window.addEventListener("scroll", function () {
  const navbar = document.querySelector("nav");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// ========================
// Smooth Scroll for Anchor Links
// ========================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// ========================
// Scroll Animation (Slide-in)
// ========================
const animatedElements = document.querySelectorAll("[data-anim]");

function handleScrollAnimation() {
  animatedElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("in-view");
    }
  });
}

window.addEventListener("scroll", handleScrollAnimation);
window.addEventListener("load", handleScrollAnimation);

// ========================
// Counter Animation (Stats)
// ========================
(function () {
  function startCountUp(element) {
    const target = parseInt(element.getAttribute("data-count"));
    const type = element.getAttribute("data-type"); // "percent" หรือ "number"
    let count = 0;
    const duration = 2000; // 2 วินาที
    const stepTime = Math.abs(Math.floor(duration / target));

    const timer = setInterval(() => {
      count++;
      if (type === "percent") {
        element.textContent = count.toLocaleString() + "%";
      } else {
        element.textContent = count.toLocaleString();
      }

      if (count >= target) {
        clearInterval(timer);
        if (type === "percent") {
          element.textContent = target.toLocaleString() + "%";
        } else {
          element.textContent = target.toLocaleString();
        }
      }
    }, stepTime);
  }

  // ใช้ IntersectionObserver ให้ animation เริ่มเมื่อ section เข้ามาใน viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll(".stat-number");
          counters.forEach((counter) => {
            if (!counter.classList.contains("counted")) {
              startCountUp(counter);
              counter.classList.add("counted"); // กันไม่ให้รันซ้ำ
            }
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll(".stats").forEach((section) => {
    observer.observe(section);
  });
})();

// ========================
// Gallery Lightbox
// ========================
const galleryImages = document.querySelectorAll(".gallery img");
const lightbox = document.createElement("div");
lightbox.id = "lightbox";
document.body.appendChild(lightbox);

galleryImages.forEach((image) => {
  image.addEventListener("click", () => {
    lightbox.classList.add("active");
    const img = document.createElement("img");
    img.src = image.src;
    while (lightbox.firstChild) {
      lightbox.removeChild(lightbox.firstChild);
    }
    lightbox.appendChild(img);
  });
});

lightbox.addEventListener("click", () => {
  lightbox.classList.remove("active");
});
