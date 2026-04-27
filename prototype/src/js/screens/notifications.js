/**
 * Notifications screen.
 *
 * Layout:
 *   - Top bar
 *   - Page header
 *   - "Today" / "Earlier" sections with grouped rows
 *   - Each row: small icon avatar, body text (with bolded actor name), time
 *   - Tapping a notification routes to the related event when relevant
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createHeader } from '../components/header.js';

const ITEMS = [
  {
    id: 1, group: 'today', kind: 'rsvp',
    actor: 'Maya', body: "is in for Coffee Meetup.",
    time: 'now', route: '#/event/coffee-meetup',
    color: '#C49E7A',
  },
  {
    id: 2, group: 'today', kind: 'message',
    actor: 'Leo', body: 'replied in Coffee Meetup.',
    time: '12m', route: '#/event/coffee-meetup/chat',
    color: '#8A7E72',
  },
  {
    id: 3, group: 'today', kind: 'invite',
    actor: 'Ana', body: 'invited you to Concert Night.',
    time: '2h', route: '#/event/concert-night',
    color: '#6FA786',
  },
  {
    id: 4, group: 'earlier', kind: 'rsvp',
    actor: 'Sigrid', body: 'said maybe to Morning Run.',
    time: 'Mon', route: '#/event/morning-run',
    color: '#E8C547',
  },
  {
    id: 5, group: 'earlier', kind: 'circle',
    actor: 'You', body: 'were added to Brunch Pals.',
    time: 'Sun', route: '#/circles',
    color: '#D4A853',
  },
];

const ICONS = {
  rsvp:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L20 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  message: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 16 17 19 12 19C10.6 19 9.3 18.7 8.2 18.2L4 19L5 15.1C4.4 14.2 4 13.1 4 12C4 8 8 5 12 5C17 5 21 8 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  invite:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  circle:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="13" r="3" stroke="currentColor" stroke-width="1.8"/></svg>`,
};

export function renderNotifications(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createHeader('Notifications'));

  const head = document.createElement('header');
  head.className = 'list-screen__head';
  head.innerHTML = `
    <p class="list-screen__sub">Only the ones that matter. We promise.</p>
  `;
  screen.appendChild(head);

  ['today', 'earlier'].forEach((group) => {
    const items = ITEMS.filter((i) => i.group === group);
    if (!items.length) return;

    const sec = document.createElement('section');
    sec.className = 'notif-group';
    sec.innerHTML = `<h2 class="notif-group__title">${group === 'today' ? 'Today' : 'Earlier'}</h2>`;
    items.forEach((it) => {
      const row = document.createElement('button');
      row.className = 'notif-row';
      row.innerHTML = `
        <span class="notif-row__icon" style="background:${it.color}1A; color:${it.color};">${ICONS[it.kind] || ICONS.message}</span>
        <span class="notif-row__body">
          <span class="notif-row__text"><strong>${it.actor}</strong> ${it.body}</span>
          <span class="notif-row__time">${it.time}</span>
        </span>
      `;
      row.addEventListener('click', () => { if (it.route) window.location.hash = it.route; });
      sec.appendChild(row);
    });
    screen.appendChild(sec);
  });

  mountBottomNav({ active: null });
  container.appendChild(screen);
}
