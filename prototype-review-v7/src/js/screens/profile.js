/**
 * Profile screen.
 *
 * Layout:
 *   - Top bar
 *   - Header card: avatar, name, city/handle, three stat tiles (Events, Circles, Friends)
 *   - "Account" section: Edit profile, Save to calendar, Notifications
 *   - "Privacy" section: Visibility, Blocked, Data
 *   - Sign-out button at the bottom
 *   - Bottom nav (no tab active; Profile is reached from the top bar)
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createHeader } from '../components/header.js';

const USER = {
  name: 'Anders Solberg',
  handle: 'Oslo . Joined 2024',
  initials: 'AS',
  stats: { events: 12, circles: 4, friends: 23 },
};

const ROWS = [
  {
    title: 'Account',
    items: [
      // REVIEW (Workshop 6): "Edit profile" now opens the profile-edit screen
      // with photo upload front and centre.
      { id: 'edit',   label: 'Edit profile',         icon: 'user', route: '#/profile/edit' },
      // REVIEW: Calendar sync — how SosialT calendar maps to the phone (see profileMore.js).
      { id: 'cal',    label: 'Calendar sync',        icon: 'cal', route: '#/profile/calendar-sync' },
      // REVIEW (Workshop 6): now routes to actual notification preferences
      // (defaults ON), not the inbox.
      { id: 'notif',  label: 'Notification settings', icon: 'bell', route: '#/profile/notifications' },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { id: 'visib', label: 'Who can ping you', icon: 'eye',    route: '#/profile/ping-visibility' },
      { id: 'block', label: 'Blocked',          icon: 'shield', route: '#/profile/blocked' },
      { id: 'data',  label: 'Your data',        icon: 'data',   route: '#/profile/your-data' },
    ],
  },
  // REVIEW (Workshop 7): stable Feedback area lives in profile. Keeps user
  // input flowing without interrupting primary flows. Lightweight on purpose
  // — categories + free text, with an optional screenshot/context attach
  // shown inline on the next screen.
  {
    title: 'Help us improve',
    items: [
      { id: 'feedback', label: 'Send feedback', icon: 'chat',  route: '#/profile/feedback', sub: 'Bug, idea, or anything else' },
      { id: 'rate',     label: 'Rate SosialT',  icon: 'star',  sub: 'Opens your app store' },
    ],
  },
];

const ICONS = {
  user:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  cal:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  bell:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 8C6 5 8 3 12 3C16 3 18 5 18 8V13L20 16H4L6 13V8Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 19C10 20 11 21 12 21C13 21 14 20 14 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  eye:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M2 12C4 7 8 5 12 5C16 5 20 7 22 12C20 17 16 19 12 19C8 19 4 17 2 12Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/></svg>`,
  shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L20 6V12C20 17 16.5 20.5 12 22C7.5 20.5 4 17 4 12V6L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  data:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" stroke-width="1.8"/><path d="M4 6V12C4 13.7 7.6 15 12 15C16.4 15 20 13.7 20 12V6" stroke="currentColor" stroke-width="1.8"/><path d="M4 12V18C4 19.7 7.6 21 12 21C16.4 21 20 19.7 20 18V12" stroke="currentColor" stroke-width="1.8"/></svg>`,
  chat:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  star:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3L14.5 9L21 9.5L16 14L17.5 21L12 17.5L6.5 21L8 14L3 9.5L9.5 9L12 3Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
};

export function renderProfile(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createHeader('You'));

  const card = document.createElement('section');
  card.className = 'profile-card';
  // REVIEW (Workshop 6): avatar gets a small camera badge so it reads as
  // tappable. Tapping the avatar opens the profile-edit screen which has
  // a full photo-picker action sheet.
  card.innerHTML = `
    <div class="profile-card__head">
      <button class="profile-card__avatar-btn" id="profile-avatar-btn" aria-label="Edit profile photo">
        <span class="profile-card__avatar">${USER.initials}</span>
        <span class="profile-card__avatar-badge">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 6L9.5 4H14.5L15.5 6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </span>
      </button>
      <div class="profile-card__name-block">
        <h1 class="profile-card__name">${USER.name}</h1>
        <p class="profile-card__handle">${USER.handle}</p>
      </div>
    </div>
    <div class="profile-card__stats">
      <div class="profile-stat" data-route="#/events">
        <span class="profile-stat__num">${USER.stats.events}</span>
        <span class="profile-stat__lbl">Events</span>
      </div>
      <div class="profile-stat" data-route="#/circles">
        <span class="profile-stat__num">${USER.stats.circles}</span>
        <span class="profile-stat__lbl">Circles</span>
      </div>
      <div class="profile-stat" data-route="#/chats">
        <span class="profile-stat__num">${USER.stats.friends}</span>
        <span class="profile-stat__lbl">Friends</span>
      </div>
    </div>
  `;
  screen.appendChild(card);

  ROWS.forEach((group) => {
    const sec = document.createElement('section');
    sec.className = 'profile-section';
    sec.innerHTML = `<h2 class="profile-section__title">${group.title}</h2>`;
    const list = document.createElement('div');
    list.className = 'profile-list';
    group.items.forEach((it) => {
      const row = document.createElement('button');
      row.className = 'profile-list__row';
      const subHtml = it.sub ? `<span class="profile-list__sub">${it.sub}</span>` : '';
      row.innerHTML = `
        <span class="profile-list__icon">${ICONS[it.icon] || ''}</span>
        <span class="profile-list__label">${it.label}${subHtml}</span>
        <svg class="profile-list__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      `;
      row.addEventListener('click', () => {
        if (it.id === 'rate') {
          const t = document.createElement('div');
          t.className = 'sosialt-toast';
          t.textContent = 'Thanks — in the full app this opens the App Store or Play Store.';
          screen.appendChild(t);
          setTimeout(() => t.classList.add('sosialt-toast--out'), 1800);
          setTimeout(() => t.remove(), 2200);
          return;
        }
        if (it.route) window.location.hash = it.route;
      });
      list.appendChild(row);
    });
    sec.appendChild(list);
    screen.appendChild(sec);
  });

  const signOut = document.createElement('button');
  signOut.className = 'profile-signout';
  signOut.textContent = 'Sign out';
  signOut.addEventListener('click', () => { window.location.hash = '#/'; });
  screen.appendChild(signOut);

  card.querySelectorAll('[data-route]').forEach((el) => {
    el.addEventListener('click', () => { window.location.hash = el.dataset.route; });
  });

  const avatarBtn = card.querySelector('#profile-avatar-btn');
  if (avatarBtn) {
    avatarBtn.addEventListener('click', () => { window.location.hash = '#/profile/edit'; });
  }

  mountBottomNav({ active: null });
  container.appendChild(screen);
}
