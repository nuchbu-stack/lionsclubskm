// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  counter.innerText = '0';
  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 100;
    if(count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCounter, 40);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
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


