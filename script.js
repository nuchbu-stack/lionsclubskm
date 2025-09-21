// Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const speed = 100;

    if (count < target) {
      counter.innerText = count + 1;
      setTimeout(updateCount, speed);
    } else {
      counter.innerText = target;
    }
  };
  updateCount();
});
