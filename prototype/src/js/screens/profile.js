/**
 * Profile screen.
 *
 * Layout:
 *   - Top bar
 *   - Header card: avatar, name, city/handle, three stat tiles (Events, Circles, Friends)
 *   - "Account" section: Edit profile, Calendar sync, Notifications
 *   - "Privacy" section: Visibility, Blocked, Data
 *   - Sign-out button at the bottom
 *   - Bottom nav (no tab active; Profile is reached from the top bar)
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';

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
      { id: 'edit',   label: 'Edit profile',         icon: 'user' },
      { id: 'cal',    label: 'Calendar sync',        icon: 'cal'  },
      { id: 'notif',  label: 'Notification settings', icon: 'bell', route: '#/notifications' },
    ],
  },
  {
    title: 'Privacy',
    items: [
      { id: 'visib', label: 'Who can ping you', icon: 'eye'    },
      { id: 'block', label: 'Blocked',          icon: 'shield' },
      { id: 'data',  label: 'Your data',        icon: 'data'   },
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
};

export function renderProfile(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({
    initials: USER.initials,
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/events'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  const card = document.createElement('section');
  card.className = 'profile-card';
  card.innerHTML = `
    <div class="profile-card__head">
      <span class="profile-card__avatar">${USER.initials}</span>
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
      <div class="profile-stat">
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
      row.innerHTML = `
        <span class="profile-list__icon">${ICONS[it.icon] || ''}</span>
        <span class="profile-list__label">${it.label}</span>
        <svg class="profile-list__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      `;
      row.addEventListener('click', () => {
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

  mountBottomNav({ active: 'home' });
  container.appendChild(screen);
}
