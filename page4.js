// Personalize this message whenever you want to make the final wish yours.
const birthdayMessage = `Ek aur saal badi ho gayi, lekin height abhi bhi wahi ki wahi reh gayi. Bhagwan kare teri life mein khushiyan aayein, aur thodi akal bhi aa jaaye, although height aur akal dono ke maamle me growth ki expectations maine kab ki chhod di hai. Tere ghumne ke plans bante rahein aur meri taraf se unhe mana karne ka silsila bhi aise hi chalta rahe. Waise teri life mein meri jaisi pareshani ka hona bhi zaroori hai, warna itni boring life mein entertainment kaun dega? Tu hamesha aise hi haste reh, bakbak karte reh aur apni chhoti si height mein bade-bade kaand karte reh. May all your wishes come true, bas mujhe ghumane ki wish ko chhodkar. Once again, Happy Birthday ❤️

Note : Ye poora birthday message ChatGPT se generate karwaya gaya hai. Isliye zyada emotional ya special feel karne ki zarurat nahi hai. Itni mehnat mai ne nhi ki hai. 😁😁`;

const messageElement = document.querySelector('#birthday-message');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelector('#reset-journey').addEventListener('click', () => {
  window.location.assign(new URL('./page1.html', document.baseURI).href);
});

if (reducedMotion) {
  messageElement.textContent = birthdayMessage;
} else {
  let index = 0;
  const type = () => {
    messageElement.textContent = birthdayMessage.slice(0, index);
    index += 1;
    if (index <= birthdayMessage.length) window.setTimeout(type, index < 30 ? 24 : 12);
  };
  type();
}

const particleLayer = document.querySelector('.particles');
if (!reducedMotion) {
  for (let i = 0; i < 20; i += 1) {
    const particle = document.createElement('span'); particle.className = 'particle'; particle.textContent = i % 3 ? '✦' : '♡';
    particle.style.left = `${Math.random() * 100}%`; particle.style.bottom = `${-10 - Math.random() * 12}%`;
    particle.style.setProperty('--size', `${.55 + Math.random() * .75}rem`); particle.style.setProperty('--duration', `${7 + Math.random() * 7}s`); particle.style.setProperty('--delay', `${Math.random() * 8}s`); particleLayer.appendChild(particle);
  }
}
