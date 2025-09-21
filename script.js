document.addEventListener("DOMContentLoaded", () => {
  /* -------------------------
     HERO slider (auto + nav)
     ------------------------- */
  const slides = Array.from(document.querySelectorAll(".hero-slider .slide"));
  const prevBtn = document.querySelector(".nav-btn.prev");
  const nextBtn = document.querySelector(".nav-btn.next");
  let current = 0;
  let autoplay = null;

  function showSlide(i) {
    slides.forEach((s, idx) => s.classList.toggle("active", idx === i));
  }
  function nextSlide() { current = (current + 1) % slides.length; showSlide(current); }
  function prevSlide() { current = (current - 1 + slides.length) % slides.length; showSlide(current); }

  if (nextBtn) nextBtn.addEventListener("click", () => { nextSlide(); resetAutoplay(); });
  if (prevBtn) prevBtn.addEventListener("click", () => { prevSlide(); resetAutoplay(); });

  function resetAutoplay() {
    if (autoplay) clearInterval(autoplay);
    autoplay = setInterval(nextSlide, 5000);
  }
  if (slides.length > 0) { showSlide(0); resetAutoplay(); }

  /* -------------------------
     Intersection Observer: animations
     ------------------------- */
  const animTargets = document.querySelectorAll(".fade-in, .slide-in-left, .slide-in-right, .stat-card, .goal-card, .card");
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    animTargets.forEach(t => obs.observe(t));
  } else {
    // fallback: show all
    animTargets.forEach(t => t.classList.add("show"));
  }

  /* -------------------------
     COUNTERS (percent)
     ------------------------- */
  const statEls = document.querySelectorAll(".stat-number");
  const goalCounters = document.querySelectorAll(".counter");

  function animateCount(el, target, duration = 1200) {
    const start = performance.now();
    function step(ts) {
      const p = Math.min((ts - start) / duration, 1);
      const value = Math.floor(p * target);
      el.textContent = value + "%";
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target + "%";
    }
    requestAnimationFrame(step);
  }

  // observe stat-number elements
  if ('IntersectionObserver' in window) {
    const statObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-count")) || 0;
        animateCount(el, target, 1200);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    statEls.forEach(e => statObs.observe(e));
  } else {
    // fallback run immediately
    statEls.forEach(el => {
      const target = parseInt(el.getAttribute("data-count")) || 0;
      animateCount(el, target, 1200);
    });
  }

  // goals counters (numeric without percent in HTML)
  if ('IntersectionObserver' in window) {
    const goalObs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target.querySelector(".counter");
        if (!el) { observer.unobserve(entry.target); return; }
        const target = parseInt(el.getAttribute("data-target")) || 0;
        // animate separate numeric then append % in place
        (function animateNum(startTf = performance.now()) {
          const duration = 1200;
          function step(ts) {
            const progress = Math.min((ts - startTf) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target;
          }
          requestAnimationFrame(step);
        })();
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.35 });
    document.querySelectorAll(".goal-card").forEach(card => goalObs.observe(card));
  } else {
    document.querySelectorAll(".counter").forEach(el => {
      const target = parseInt(el.getAttribute("data-target")) || 0;
      let start = null;
      const duration = 1200;
      function step(ts) {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / duration, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
});
