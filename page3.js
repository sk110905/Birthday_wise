const memories = [
  { image: './images/1.png', caption: 'Thinking deeply about absolutely nothing.' },
  { image: './images/2.jpg', caption: 'Proof that even good people make questionable friendship choices.' },
  { image: './images/4.jpg', caption: 'Garba ke naam pe bas photoshoot karne aata hai.' },
  { image: './images/3.jpg', caption: 'The filter is romantic, the person is a full-time headache.' },
  { image: './images/5.png', caption: 'She looks like she gives life advice. Please don\'t take it.' }
];

const stage = document.querySelector('#card-stage');
const counter = document.querySelector('#counter');
const dots = document.querySelector('#dots');
const finalCta = document.querySelector('#final-cta');
const prevButton = document.querySelector('.prev-button');
const nextArrow = document.querySelector('.next-arrow');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const imageCache = new Map();
memories.forEach((memory) => {
  const source = new URL(memory.image, document.baseURI).href;
  const preloadedImage = new Image();
  preloadedImage.src = source;
  imageCache.set(source, preloadedImage);
});
let current = 0;
let isAnimating = false;
let pointerStart = null;
let dragDistance = 0;

function imageFallback(image) {
  image.addEventListener('error', () => {
    image.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 520"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop stop-color="#e89bb2"/><stop offset="1" stop-color="#735486"/></linearGradient></defs><rect width="700" height="520" fill="url(#g)"/><circle cx="350" cy="220" r="92" fill="#fff0d3" opacity=".45"/><text x="350" y="380" text-anchor="middle" fill="#fff8ed" font-family="Georgia" font-size="28">a lovely memory</text></svg>`)}`;
    image.alt = 'Decorative memory placeholder';
  }, { once: true });
}

function renderDots() {
  dots.innerHTML = memories.map((_, index) => `<button class="dot${index === current ? ' active' : ''}" type="button" aria-label="Show memory ${index + 1}"></button>`).join('');
  dots.querySelectorAll('.dot').forEach((dot, index) => dot.addEventListener('click', () => goTo(index)));
}

function renderCards() {
  stage.innerHTML = '';
  memories.forEach((memory, index) => {
    const card = document.createElement('article');
    const isCurrent = index === current;
    const isPrevious = index === current - 1;
    const isFuture = index > current;
    card.className = `memory-card ${isCurrent ? 'is-front' : isPrevious ? 'is-previous' : 'is-back'}`;
    card.style.zIndex = String(isCurrent ? memories.length + 2 : isPrevious ? memories.length + 1 : Math.max(1, memories.length - index));
    card.style.visibility = index < current - 1 ? 'hidden' : 'visible';
    card.style.setProperty('--rotation', `${isCurrent ? (current % 2 ? 1.2 : -1.2) : isPrevious ? (current % 2 ? -1.2 : 1.2) : (index % 2 ? 4 : -4)}deg`);
    card.style.setProperty('--offset', `${isPrevious ? 0 : isFuture ? Math.min(index - current, 2) * 7 : 0}px`);
    card.setAttribute('aria-label', `Memory ${index + 1}: ${memory.caption}`);
    const image = document.createElement('img');
    image.className = 'memory-photo'; image.alt = `Memory ${index + 1}`; image.loading = 'eager'; image.decoding = 'async';
    imageFallback(image);
    image.src = imageCache.get(new URL(memory.image, document.baseURI).href)?.src || new URL(memory.image, document.baseURI).href;
    const caption = document.createElement('p'); caption.className = 'memory-caption'; caption.textContent = memory.caption;
    card.append(image, caption); stage.appendChild(card);
  });
  counter.textContent = `${current + 1} of ${memories.length}`;
  prevButton.disabled = current === 0;
  nextArrow.disabled = current === memories.length - 1;
  finalCta.hidden = current !== memories.length - 1;
  renderDots();
}

function goTo(nextIndex, direction = nextIndex > current ? 'left' : 'right') {
  if (isAnimating || nextIndex < 0 || nextIndex >= memories.length || nextIndex === current) return;
  const frontCard = stage.querySelector('.is-front');
  const previousCard = stage.querySelector('.is-previous');
  isAnimating = true;
  if (direction === 'left' && previousCard) previousCard.style.visibility = 'hidden';
  if (frontCard && !reducedMotion) {
    frontCard.classList.add(direction === 'left' ? 'is-exit-left' : 'is-exit-right');
    window.setTimeout(() => { current = nextIndex; renderCards(); isAnimating = false; }, 400);
  } else {
    current = nextIndex; renderCards(); isAnimating = false;
  }
}

prevButton.addEventListener('click', () => goTo(current - 1, 'right'));
nextArrow.addEventListener('click', () => goTo(current + 1, 'left'));

stage.addEventListener('pointerdown', (event) => {
  if (isAnimating) return;
  pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
  dragDistance = 0;
  stage.setPointerCapture?.(event.pointerId);
});
stage.addEventListener('pointermove', (event) => {
  if (!pointerStart || event.pointerId !== pointerStart.id) return;
  dragDistance = event.clientX - pointerStart.x;
  if (Math.abs(dragDistance) > 8) event.preventDefault();
});
function finishPointer(event) {
  if (!pointerStart || event.pointerId !== pointerStart.id) return;
  const threshold = Math.max(48, stage.clientWidth * .18);
  if (Math.abs(dragDistance) > threshold) goTo(current + (dragDistance < 0 ? 1 : -1), dragDistance < 0 ? 'left' : 'right');
  pointerStart = null; dragDistance = 0;
}
stage.addEventListener('pointerup', finishPointer);
stage.addEventListener('pointercancel', finishPointer);

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') goTo(current - 1, 'right');
  if (event.key === 'ArrowRight') goTo(current + 1, 'left');
});

document.querySelector('.next-button').addEventListener('click', (event) => {
  const button = event.currentTarget;
  const destination = new URL(button.dataset.next || './page4.html', document.baseURI).href;
  button.disabled = true;
  document.querySelector('.gallery-wrap').classList.add('leaving');
  window.setTimeout(() => { window.location.assign(destination); }, reducedMotion ? 0 : 260);
});

const particleLayer = document.querySelector('.particles');
if (!reducedMotion) {
  for (let i = 0; i < 18; i += 1) {
    const particle = document.createElement('span'); particle.className = 'particle'; particle.textContent = i % 2 ? '✦' : '♡';
    particle.style.left = `${Math.random() * 100}%`; particle.style.bottom = `${-10 - Math.random() * 10}%`;
    particle.style.setProperty('--size', `${.6 + Math.random() * .6}rem`); particle.style.setProperty('--duration', `${7 + Math.random() * 7}s`); particle.style.setProperty('--delay', `${Math.random() * 8}s`); particleLayer.appendChild(particle);
  }
}
renderCards();
