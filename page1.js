const particleLayer = document.querySelector('.particles');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
  const symbols = ['♥', '✦', '·', '♡'];
  for (let i = 0; i < 22; i += 1) {
    const particle = document.createElement('span');
    particle.className = 'particle';
    particle.textContent = symbols[i % symbols.length];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.bottom = `${-10 - Math.random() * 15}%`;
    particle.style.setProperty('--size', `${.65 + Math.random() * .8}rem`);
    particle.style.setProperty('--duration', `${7 + Math.random() * 7}s`);
    particle.style.setProperty('--delay', `${Math.random() * 8}s`);
    particleLayer.appendChild(particle);
  }
}

document.querySelector('.next-button').addEventListener('click', (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  document.querySelector('.story-card').classList.add('leaving');
  document.body.classList.add('page-leaving');
  window.setTimeout(() => { window.location.href = button.dataset.next; }, reducedMotion ? 0 : 420);
});
