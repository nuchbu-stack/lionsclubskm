document.addEventListener("DOMContentLoaded", () => {
  // Fade-in & Slide-in on scroll
  const animatedElements = document.querySelectorAll(
    ".fade-in, .slide-in-left, .slide-in-right"
  );

  const appearOptions = { threshold: 0.2 };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("show");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  animatedElements.forEach(el => appearOnScroll.observe(el));

  // Stats Count-up
  function countUp(element, target) {
    let count = 0;
    const speed = target / 100;

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
});
