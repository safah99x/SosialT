/**
 * Home screen.
 * Layout (top -> bottom):
 *   1. Top bar (brand + bell + calendar + avatar)
 *   2. Greeting "Hey there, {Name}"
 *   3. Dynamic hero card (rotates by time, weather, plans, location)
 *   4. Action pair (Quick Ping / Create Event)
 *   5. Upcoming list with date tiles
 *   6. Events around you (horizontal cards)
 *   7. Bottom nav (overlay)
 *
 * Voice: dry, warm, observant. Short sentences. The smart-witty friend.
 */
import { createTopBar } from '../components/topBar.js';
import { mountBottomNav } from '../components/bottomNav.js';
import { getHeroLine, getHomeContext } from '../lib/dynamicCopy.js';
import { getEvent } from './eventDetail.js';

const USER = { name: 'Anders', initials: 'AS' };

const UPCOMING = [
  { id: 'coffee-meetup', day: '05', month: 'April', title: 'Coffee Meetup', group: 'Coffee Crew',     time: '10:00', place: 'Central Park Cafe' },
  { id: 'morning-run',   day: '20', month: 'April', title: 'Morning Run',   group: 'Gym Crew',        time: '06:00', place: 'Central Park' },
  { id: 'concert-night', day: '28', month: 'April', title: 'Concert Night', group: 'College Squared', time: '20:00', place: 'College Auditorium' },
];

const NEARBY = ['jazz-vigeland', 'sunday-coffee', 'sunset-walk'];

function clockSvg() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
function pinSvg() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>`;
}

function avatarStack(extra = 4) {
  const tones = ['#C49E7A', '#8A7E72', '#E8C547'];
  const a = tones.map((c, i) => `<span class="avatar-stack__a" style="background:${c}; z-index:${10 - i}"></span>`).join('');
  return `<span class="avatar-stack">${a}<span class="avatar-stack__more">+${extra}</span></span>`;
}

function isToday(/* day, month */) {
  // Prototype: pretend "Coffee Meetup" is today so the hero copy can lean into it.
  // In production, compare event date to current date.
  return Math.random() < 0.45;
}

function pickUpcomingToday() {
  if (isToday()) return UPCOMING[0];
  return null;
}

export function renderHome(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  // 1. Top bar
  screen.appendChild(createTopBar({
    initials: USER.initials,
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/events'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  // 2. Greeting (static name; hero line below carries the dynamic voice)
  const greeting = document.createElement('div');
  greeting.className = 'home-greeting';
  greeting.innerHTML = `<h1 class="home-greeting__title">Hey there, <strong>${USER.name}</strong></h1>`;
  screen.appendChild(greeting);

  // 3. Dynamic hero card
  const ctx = getHomeContext();
  const upcomingToday = pickUpcomingToday();
  const heroLine = getHeroLine({ ...ctx, upcomingToday });

  const hero = document.createElement('div');
  hero.className = 'hero-card';
  hero.innerHTML = `
    <div class="hero-card__blob hero-card__blob--a"></div>
    <div class="hero-card__blob hero-card__blob--b"></div>
    <span class="hero-card__chip">${chipLabel(ctx, upcomingToday)}</span>
    <p class="hero-card__title" id="hero-line">${heroLine}</p>
  `;
  screen.appendChild(hero);

  // Tap the hero to roll a fresh line (helps demo the dynamic copy).
  hero.addEventListener('click', () => {
    const next = getHeroLine({ ...ctx, upcomingToday });
    const t = hero.querySelector('#hero-line');
    t.style.opacity = '0';
    setTimeout(() => { t.textContent = next; t.style.opacity = '1'; }, 150);
  });

  // 4. Action pair
  const actions = document.createElement('div');
  actions.className = 'home-actions';
  actions.innerHTML = `
    <button class="action-tile" id="home-quick-ping">
      <span class="action-tile__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </span>
      <span class="action-tile__title">Quick ping</span>
      <span class="action-tile__desc">Now-ish</span>
    </button>
    <button class="action-tile" id="home-create-event">
      <span class="action-tile__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>
          <path d="M3 10H21" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      <span class="action-tile__title">Create event</span>
      <span class="action-tile__desc">On purpose</span>
    </button>
  `;
  screen.appendChild(actions);

  // 5. Upcoming
  const upcoming = document.createElement('section');
  upcoming.className = 'home-block';
  upcoming.innerHTML = `
    <div class="home-block__head">
      <h2 class="home-block__title">Upcoming</h2>
      <button class="home-block__see-all" data-route="#/events">See all <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="upcoming-list">
      ${UPCOMING.map((e) => `
        <button class="upcoming-row" data-event="${e.id}">
          <div class="upcoming-row__date">
            <span class="upcoming-row__day">${e.day}</span>
            <span class="upcoming-row__month">${e.month}</span>
          </div>
          <div class="upcoming-row__body">
            <h3 class="upcoming-row__title">${e.title}</h3>
            <div class="upcoming-row__group">${avatarStack(4)}<span class="upcoming-row__group-name">${e.group}</span></div>
            <div class="upcoming-row__detail">
              <span class="upcoming-row__chip">${clockSvg()} ${e.time}</span>
              <span class="upcoming-row__chip">${pinSvg()} ${e.place}</span>
            </div>
          </div>
        </button>
      `).join('')}
    </div>
  `;
  screen.appendChild(upcoming);

  // 6. Events around you
  const nearby = document.createElement('section');
  nearby.className = 'home-block';
  nearby.innerHTML = `
    <div class="home-block__head">
      <h2 class="home-block__title">Around you</h2>
      <button class="home-block__see-all" data-route="#/events">See all <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="nearby-scroller">
      ${NEARBY.map((id) => {
        const e = getEvent(id);
        return `
          <article class="nearby-card" data-event="${id}">
            <div class="nearby-card__image" style="background-image: url('${e.image}')">
              <span class="nearby-card__tag">${e.tag}</span>
            </div>
            <div class="nearby-card__body">
              <h3 class="nearby-card__title">${e.title}</h3>
              <p class="nearby-card__desc">${e.desc}</p>
              <div class="nearby-card__detail">
                <span class="nearby-card__line">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                  ${e.date} . ${e.time}
                </span>
                <span class="nearby-card__line">${pinSvg()} ${e.place}</span>
              </div>
              <div class="nearby-card__foot">
                <div class="nearby-card__people">${avatarStack(e.going)}<span>going</span></div>
                <button class="nearby-card__cta" data-interested="${id}">I'm in</button>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>
  `;
  screen.appendChild(nearby);

  // 7. Bottom nav
  mountBottomNav({ active: 'home' });

  // ── Wiring ──
  screen.querySelector('#home-quick-ping').addEventListener('click', () => { window.location.hash = '#/quick-ping'; });
  screen.querySelector('#home-create-event').addEventListener('click', () => { window.location.hash = '#/create-event'; });

  screen.querySelectorAll('[data-route]').forEach((b) => {
    b.addEventListener('click', () => { window.location.hash = b.dataset.route; });
  });

  screen.querySelectorAll('[data-event]').forEach((el) => {
    el.addEventListener('click', (ev) => {
      // Allow the inline "I'm in" CTA to handle its own click without navigating.
      if (ev.target.closest('[data-interested]')) return;
      window.location.hash = `#/event/${el.dataset.event}`;
    });
  });

  screen.querySelectorAll('[data-interested]').forEach((b) => {
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = b.classList.toggle('nearby-card__cta--on');
      b.textContent = on ? "You're in" : "I'm in";
    });
  });

  container.appendChild(screen);
}

function chipLabel({ city, weather, tempC }, upcomingToday) {
  if (upcomingToday) return 'On today';
  const w = weather === 'sunny' ? 'Sun' : weather === 'rainy' ? 'Rain' : weather === 'snowy' ? 'Snow' : 'Cloudy';
  return `${city} . ${w} . ${tempC}\u00B0`;
}
