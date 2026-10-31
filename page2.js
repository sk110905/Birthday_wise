const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const particleLayer = document.querySelector('.particles');
if (!reducedMotion) {
  ['✦', '♡', '•', '✧'].forEach((symbol, index) => {
    for (let i = 0; i < 6; i += 1) {
      const particle = document.createElement('span');
      particle.className = 'particle';
      particle.textContent = symbol;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = `${-10 - Math.random() * 12}%`;
      particle.style.setProperty('--size', `${.6 + Math.random() * .7}rem`);
      particle.style.setProperty('--duration', `${6 + Math.random() * 7}s`);
      particle.style.setProperty('--delay', `${index * .8 + Math.random() * 5}s`);
      particleLayer.appendChild(particle);
    }
  });
}

document.querySelector('.next-button').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  document.querySelector('.reveal-card').classList.add('leaving');
  window.setTimeout(() => { window.location.href = button.dataset.next; }, reducedMotion ? 0 : 420);
});
