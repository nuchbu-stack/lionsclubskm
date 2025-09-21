// Wrap everything to run after DOM ready
document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     HERO SLIDER
     - minimal controls (prev/next)
     - dot indicators
     - autoplay with reset on manual control
     ========================= */
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.querySelector(".control.prev");
  const nextBtn = document.querySelector(".control.next");
  const indicatorsContainer = document.querySelector(".indicators");

  let current = 0;
  let autoplayInterval = null;
  const AUTOPLAY_MS = 5000;

  // create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.setAttribute("data-index", i);
    indicatorsContainer.appendChild(dot);
  });
  const dots = Array.from(indicatorsContainer.querySelectorAll("span"));

  function showSlide(index) {
    slides.forEach((s, i) => s.classList.toggle("active", i === index));
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    current = index;
  }

  function nextSlide() { showSlide((current + 1) % slides.length); }
  function prevSlide() { showSlide((current - 1 + slides.length) % slides.length); }

  // attach controls safely
  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

  // dot clicks
  dots.forEach(dot => dot.addEventListener("click", (e) => {
    const idx = parseInt(e.currentTarget.getAttribute("data-index"), 10);
    if (!isNaN(idx)) { showSlide(idx); resetAutoplay(); }
  }));

  function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(nextSlide, AUTOPLAY_MS);
  }
  function stopAutoplay() { if (autoplayInterval) clearInterval(autoplayInterval); }
  function resetAutoplay() { startAutoplay(); }

  if (slides.length > 0) {
    showSlide(0);
    startAutoplay();
  }

  /* =========================
     SCROLL: navbar background toggle
     ========================= */
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    });
  }

  /* =========================
     COUNTERS (data-count for all stat-number elements)
     - use IntersectionObserver to trigger once when visible
     ========================= */
  const statEls = Array.from(document.querySelectorAll(".stat-number"));

  function animateCount(el, target, duration = 1100) {
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = `${value}%`;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = `${target}%`;
    }
    requestAnimationFrame(step);
  }

  if (statEls.length > 0 && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count"), 10) || 0;
        animateCount(el, target);
        observer.unobserve(el);
      });
    }, { threshold: 0.45 });
    statEls.forEach(el => obs.observe(el));
  } else {
    // fallback: animate immediately
    statEls.forEach(el => animateCount(el, parseInt(el.getAttribute("data-count"), 10) || 0));
  }

  /* =========================
     ON-SCROLL ANIMATIONS (data-anim)
     - adds class .visible when element appears in viewport
     ========================= */
  const animItems = Array.from(document.querySelectorAll("[data-anim]"));
  if (animItems.length > 0 && 'IntersectionObserver' in window) {
    const animObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    animItems.forEach(el => animObs.observe(el));
  } else {
    // fallback: reveal all
    animItems.forEach(el => el.classList.add("visible"));
  }

});
