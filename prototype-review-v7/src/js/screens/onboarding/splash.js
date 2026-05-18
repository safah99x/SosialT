// REVIEW v7: Hero splash + three visual directions for stakeholder review (look chips).
const HERO_LOOKS = [
  {
    id: 'gather',
    label: 'Warm gather',
    img: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=960&q=75',
    title: 'Plans with the people you actually call.',
    sub: 'Tiny groups. Real energy. No endless group chat spiral—just the wins.',
  },
  {
    id: 'golden',
    label: 'Golden hour',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=960&q=75',
    title: 'Make tonight feel like a Friday.',
    sub: 'Spontaneous hangs and locked-in dates—same app, less noise, more showing up.',
  },
  {
    id: 'city',
    label: 'City pulse',
    img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=960&q=75',
    title: 'Your people, your corners of the city.',
    sub: 'From coffee to gigs: small circles, bold plans, everyone actually invited.',
  },
];

function heroIndexFromStorage() {
  const raw = sessionStorage.getItem('st-splash-look');
  const n = raw ? Number(raw, 10) : 0;
  if (!Number.isFinite(n) || n < 0 || n >= HERO_LOOKS.length) return 0;
  return n;
}

export function renderSplash(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen onb-screen onb-splash onb-splash--hero onb-splash--v7';

  let lookIdx = heroIndexFromStorage();
  const look = HERO_LOOKS[lookIdx];

  screen.innerHTML = `
    <div class="onb-splash__hero onb-welcome__hero" id="onb-hero" style="background-image: linear-gradient(180deg, rgba(18,16,14,0.12) 0%, rgba(18,16,14,0.45) 45%, rgba(12,10,8,0.88) 100%), url('${look.img}');">
      <div class="onb-welcome__copy onb-splash__copy">
        <h1 class="onb-welcome__title" id="onb-hero-title">${look.title}</h1>
        <p class="onb-welcome__sub" id="onb-hero-sub">${look.sub}</p>
      </div>
      <div class="onb-splash__look-picker" role="group" aria-label="Hero visual options for review">
        ${HERO_LOOKS.map((h, i) => `
          <button type="button" class="onb-splash__look-chip${i === lookIdx ? ' onb-splash__look-chip--on' : ''}" data-look="${i}">${h.label}</button>
        `).join('')}
      </div>
      <button type="button" class="cta-button onb-welcome__cta" id="onb-splash-cta">Get started</button>
    </div>
  `;

  function goPhone() {
    window.location.hash = '#/onboarding/phone';
  }

  function applyLook(i) {
    lookIdx = i;
    sessionStorage.setItem('st-splash-look', String(i));
    const h = HERO_LOOKS[i];
    const hero = screen.querySelector('#onb-hero');
    hero.style.backgroundImage = `linear-gradient(180deg, rgba(18,16,14,0.12) 0%, rgba(18,16,14,0.45) 45%, rgba(12,10,8,0.88) 100%), url('${h.img}')`;
    screen.querySelector('#onb-hero-title').textContent = h.title;
    screen.querySelector('#onb-hero-sub').textContent = h.sub;
    screen.querySelectorAll('.onb-splash__look-chip').forEach((btn, j) => {
      btn.classList.toggle('onb-splash__look-chip--on', j === i);
    });
  }

  screen.querySelector('#onb-splash-cta').addEventListener('click', goPhone);
  screen.querySelectorAll('.onb-splash__look-chip').forEach((btn) => {
    btn.addEventListener('click', () => applyLook(parseInt(btn.dataset.look, 10)));
  });

  container.appendChild(screen);
}
