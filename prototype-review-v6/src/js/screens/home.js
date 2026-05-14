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
// REVIEW: read onboarding session for new-user state
import { getSession } from '../lib/session.js';
import { listSavedEventIds, hasBranchedFromPublic } from '../lib/publicEventState.js';
import { getEvent, getRsvpCounts } from './eventDetail.js';
import { rsvpMicroRowHtml } from '../components/rsvpOverview.js';
import { maybeMountQuizReprompt } from '../components/quizPrompt.js';

const USER = { name: 'Anders', initials: 'AS' };

const UPCOMING = [
  { id: 'coffee-meetup', day: '05', month: 'April', title: 'Coffee Meetup', group: 'Coffee Crew',     time: '10:00', place: 'Central Park Cafe' },
  { id: 'morning-run',   day: '20', month: 'April', title: 'Morning Run',   group: 'Gym Crew',        time: '06:00', place: 'Central Park' },
  { id: 'concert-night', day: '28', month: 'April', title: 'Concert Night', group: 'College Squared', time: '20:00', place: 'College Auditorium' },
];

// REVIEW (Workshop 7): the feed surfaces ~10 items in a swipeable carousel
// before the user dives deeper — Rasika wanted "richer than 3 but not
// infinite scroll." First items rotate (mocked here as a fixed order).
const NEARBY = [
  'jazz-vigeland',
  'munch-after-hours',
  'aker-brygge-popup',
  'sunday-coffee',
  'opera-rooftop-yoga',
  'sunset-walk',
  'frogner-running-club',
  'oslo-fjord-sauna',
  'mathallen-board-games',
  'sognsvann-ski',
];

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

export async function renderHome(container) {
  container.innerHTML = '';

  const session = getSession();
  const hashQuery = window.location.hash.split('?')[1] || '';
  const params = new URLSearchParams(hashQuery);

  // Workshop 9: `?reprompt=1` jumps straight to the full-screen quiz nudge.
  if (params.get('reprompt') === '1') {
    maybeMountQuizReprompt({ force: true });
    return;
  }

  const isNewUser = params.get('newuser') === '1';
  /** Full layout duplicates Quick ping / Create event in the hero actions + empty state — use ?legacy=1 to restore for pitch decks. */
  const newUserLegacyLayout = params.get('legacy') === '1';
  const displayName = (session.name || USER.name).split(' ')[0];

  const ctx = await getHomeContext();
  const upcomingToday = isNewUser ? null : pickUpcomingToday();
  // REVIEW (Workshop 7): hero copy for new users adapts to referral source.
  const referral = session.referral || { source: 'cold' };
  const heroLine = isNewUser
    ? newUserHeroLine(referral)
    : getHeroLine({ ...ctx, upcomingToday });

  const chipNew = isNewUser ? newUserChip(referral) : null;
  const heroChipMarkup = chipNew
    ? `<span class="hero-card__chip hero-card__chip--referral">${chipNew.label}</span>`
    : isNewUser
      ? ''
      : `<span class="hero-card__chip">${chipLabel(ctx, upcomingToday)}</span>`;

  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  // 1. Top bar
  screen.appendChild(createTopBar({
    initials: (displayName[0] + (displayName[1] || '')).toUpperCase(),
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/calendar'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  // 2. Greeting
  const greeting = document.createElement('div');
  greeting.className = 'home-greeting';
  greeting.innerHTML = `<h1 class="home-greeting__title">Hey there, <strong>${displayName}</strong></h1>`;
  screen.appendChild(greeting);

  // 3. Dynamic hero card
  const hero = document.createElement('div');
  hero.className = 'hero-card';
  hero.innerHTML = `
    <div class="hero-card__blob hero-card__blob--a"></div>
    <div class="hero-card__blob hero-card__blob--b"></div>
    ${heroChipMarkup}
    <p class="hero-card__title" id="hero-line">${heroLine}</p>
  `;
  screen.appendChild(hero);

  // Tap the hero to roll a fresh line (helps demo the dynamic copy).
  hero.addEventListener('click', () => {
    if (isNewUser) return;
    const next = getHeroLine({ ...ctx, upcomingToday });
    const t = hero.querySelector('#hero-line');
    t.style.opacity = '0';
    setTimeout(() => { t.textContent = next; t.style.opacity = '1'; }, 150);
  });

  // 4. Action pair (hidden for new users unless ?legacy=1 — avoids duplicating CTAs in empty state)
  const actions = document.createElement('div');
  actions.className = 'home-actions';
  actions.innerHTML = `
    <button class="action-tile" id="home-quick-ping">
      <span class="action-tile__icon">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </span>
      <span class="action-tile__title">Quick ping</span>
      <span class="action-tile__desc">Spill it</span>
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
      <span class="action-tile__desc">Date & place</span>
    </button>
  `;
  if (!isNewUser || newUserLegacyLayout) {
    screen.appendChild(actions);
  }

  // 5. Upcoming
  const upcoming = document.createElement('section');
  upcoming.className = 'home-block';
  if (isNewUser) {
    upcoming.innerHTML = renderEmptyUpcoming(referral);
  } else {
    const savedIds = listSavedEventIds();
    const savedLink = savedIds.length
      ? `<button type="button" class="home-block__see-saved" data-route="#/events?tab=saved">Saved (${savedIds.length})</button>`
      : '';
    upcoming.innerHTML = `
      <div class="home-block__head home-block__head--split">
        <div class="home-block__head-text">
          <h2 class="home-block__title">Your plans</h2>
          <p class="home-block__kicker">With people you know · not the whole internet</p>
        </div>
        <div class="home-block__head-actions">
          ${savedLink}
          <button class="home-block__see-all" data-route="#/events?tab=upcoming">See all <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        </div>
      </div>
      <div class="upcoming-list">
        ${UPCOMING.map((e) => {
          const rsvp = getRsvpCounts(e.id);
          return `
          <button class="upcoming-row" data-event="${e.id}">
            <div class="upcoming-row__date">
              <span class="upcoming-row__day">${e.day}</span>
              <span class="upcoming-row__month">${e.month}</span>
            </div>
            <div class="upcoming-row__body">
              <h3 class="upcoming-row__title">${e.title}</h3>
              <div class="upcoming-row__group">${avatarStack(4)}<span class="upcoming-row__group-name">${e.group}</span></div>
              <div class="upcoming-row__detail">
                <div class="upcoming-row__meta">
                  <span class="upcoming-row__chip">${clockSvg()} ${e.time}</span>
                  <span class="upcoming-row__chip">${pinSvg()} ${e.place}</span>
                </div>
                <div class="upcoming-row__rsvp">${rsvpMicroRowHtml(rsvp)}</div>
              </div>
            </div>
          </button>`;
        }).join('')}
      </div>
    `;
  }
  screen.appendChild(upcoming);

  // 6. Events around you
  const nearby = document.createElement('section');
  nearby.className = 'home-block';
  nearby.innerHTML = `
    <div class="home-block__head home-block__head--split">
      <div class="home-block__head-text">
        <h2 class="home-block__title">Ideas around you</h2>
        <p class="home-block__kicker">Open listings · borrow for your own crew</p>
      </div>
      <button class="home-block__see-all" data-route="#/events?tab=upcoming">See all <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
    </div>
    <div class="nearby-scroller">
      ${NEARBY.map((id) => {
        const e = getEvent(id);
        const branched = hasBranchedFromPublic(id);
        return `
          <article class="nearby-card nearby-card--public nearby-card--simple${branched ? ' nearby-card--branched' : ''}" data-event="${id}">
            <div class="nearby-card__image" style="background-image: url('${e.image}')">
              <span class="nearby-card__tag">${e.tag}</span>
              ${branched ? '<span class="nearby-card__made">Made yours</span>' : ''}
            </div>
            <div class="nearby-card__body">
              <h3 class="nearby-card__title">${e.title}</h3>
              <div class="nearby-card__detail">
                <span class="nearby-card__line">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
                  ${e.date} . ${e.time}
                </span>
                <span class="nearby-card__line">${pinSvg()} ${e.place}</span>
              </div>
              <div class="nearby-card__foot nearby-card__foot--simple">
                <span class="nearby-card__explore">
                  Explore
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </span>
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
  const hq = screen.querySelector('#home-quick-ping');
  const hc = screen.querySelector('#home-create-event');
  if (hq) hq.addEventListener('click', () => { window.location.hash = '#/quick-ping'; });
  if (hc) hc.addEventListener('click', () => { window.location.hash = '#/create-event'; });

  screen.querySelectorAll('[data-route]').forEach((b) => {
    b.addEventListener('click', () => { window.location.hash = b.dataset.route; });
  });

  screen.querySelectorAll('[data-event]').forEach((el) => {
    el.addEventListener('click', () => {
      window.location.hash = `#/event/${el.dataset.event}`;
    });
  });

  container.appendChild(screen);

  // Quiz re-prompt is handled by /preferences/quiz-nudge + proto activity counts
  // (see protoActivity.js) — no modal overlay on Home anymore.
}

function newUserChip(referral) {
  const src = referral?.source || 'cold';
  if (src === 'cold') return null;
  if (src === 'friend') return { label: `${referral.label || 'Your friend'} invited you`, accent: false };
  if (src === 'circle') return { label: referral.label ? `${referral.label}` : 'Circle invite', accent: true };
  if (src === 'event') return { label: 'You’ve got an event invite', accent: true };
  return null;
}
function chipLabel({ city, weather, tempC }, upcomingToday) {
  if (upcomingToday) return 'On today';
  const w = weather === 'sunny' ? 'Sun' : weather === 'rainy' ? 'Rain' : weather === 'snowy' ? 'Snow' : 'Cloudy';
  return `${city} . ${w} . ${tempC}\u00B0`;
}

// REVIEW (Workshop 7): new-user hero copy adapts to the 4 referral entry points.
function newUserHeroLine({ source, label } = {}) {
  if (source === 'friend') return `${label || 'Your friend'} is already here. Plan something with them first.`;
  if (source === 'circle') return `Welcome to ${label || 'this circle'}. Start a plan and everyone in the circle will see it.`;
  if (source === 'event')  return `You're in. While you're here, line up the next plan with your own people.`;
  return "Round up the people you'd actually call. The good plans start small.";
}

// REVIEW (Workshop 7): redesigned empty state — clearer "create your first
// plan" CTA, less decorative, and adapts to referral source so the user
// always sees a believable first step.
function renderEmptyUpcoming({ source, label } = {}) {
  const config = {
    cold: {
      kicker: 'Welcome',
      title: 'Your first plan starts here.',
      sub: "SosialT is for small plans with people you actually know. Start with one. We'll keep the rest of your crew in the loop.",
      primary: { route: '#/create-event', label: 'Create your first plan' },
      secondary: { route: '#/quick-ping', label: 'Or send a quick ping' },
    },
    friend: {
      kicker: 'Friend invite',
      title: `Plan something with ${label || 'your friend'}.`,
      sub: 'They already use SosialT. Suggest a plan and you both get to skip the group-chat back-and-forth.',
      primary: { route: '#/create-event', label: 'Plan something together' },
      secondary: { route: '#/quick-ping', label: "Or send a quick 'now-ish' ping" },
    },
    circle: {
      kicker: 'Circle invite',
      title: `You're inside ${label || 'this circle'}.`,
      sub: 'Everyone in the circle sees what you create. Try a low-stakes first plan: coffee, a walk, whatever fits.',
      primary: { route: '#/create-event', label: 'Plan with the circle' },
      secondary: { route: '#/circles', label: 'Meet the circle first' },
    },
    event: {
      kicker: 'Event invite',
      title: "You're in. Now your turn.",
      sub: "While you're here, line up the next plan with your own people. It's the whole point.",
      primary: { route: '#/create-event', label: 'Plan something next' },
      secondary: { route: '#/events?tab=upcoming', label: 'Or browse what\'s around' },
    },
  };
  const c = config[source] || config.cold;
  return `
    <div class="home-block__head">
      <h2 class="home-block__title">Your plans</h2>
    </div>
    <div class="empty-upcoming empty-upcoming--v2" id="empty-upcoming">
      <span class="empty-upcoming__kicker">${c.kicker}</span>
      <h3 class="empty-upcoming__title">${c.title}</h3>
      <p class="empty-upcoming__sub">${c.sub}</p>
      <div class="empty-upcoming__actions">
        <button class="cta-button empty-upcoming__cta" data-route="${c.primary.route}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style="margin-right:6px"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          ${c.primary.label}
        </button>
        <button class="empty-upcoming__secondary" data-route="${c.secondary.route}">${c.secondary.label}</button>
      </div>
      <p class="empty-upcoming__what">
        New here? <a href="#/reference/how-sosialt-works" class="empty-upcoming__what-link">How SosialT works</a>
      </p>
    </div>
  `;
}
