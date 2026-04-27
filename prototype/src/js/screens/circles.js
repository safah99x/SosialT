/**
 * Circles list screen.
 *
 * A "circle" is a small named group of friends used to pre-fill the invite
 * lists when creating an event or sending a quick ping.
 *
 * Layout:
 *   - Top bar
 *   - Page header (title + subtitle) and a small "+ New" chip
 *   - List of circle cards: gradient avatar block, name, member count, last
 *     activity line, member-avatar stack, chevron
 *   - Bottom nav (Circles tab active)
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';

const CIRCLES = [
  {
    id: 'inner-circle',
    name: 'Inner Circle',
    members: 6,
    lastLine: 'Coffee Meetup on Sunday.',
    tones: ['#C49E7A', '#8A7E72', '#E8C547'],
    glyph: '◉',
  },
  {
    id: 'brunch-pals',
    name: 'Brunch Pals',
    members: 4,
    lastLine: 'Plotting next weekend.',
    tones: ['#E8C547', '#D4A853', '#C49E7A'],
    glyph: '✸',
  },
  {
    id: 'late-night-crew',
    name: 'Late Night Crew',
    members: 5,
    lastLine: 'Concert tickets booked.',
    tones: ['#8A7E72', '#6FA786', '#C49E7A'],
    glyph: '☾',
  },
  {
    id: 'work-buddies',
    name: 'Work Buddies',
    members: 8,
    lastLine: 'Lunch on Tuesday.',
    tones: ['#6FA786', '#C49E7A', '#E8C547'],
    glyph: '✦',
  },
];

function avatarStack(tones, extra) {
  const a = tones.map((c, i) => `<span class="avatar-stack__a" style="background:${c}; z-index:${10 - i}"></span>`).join('');
  return `<span class="avatar-stack">${a}${extra > 0 ? `<span class="avatar-stack__more">+${extra}</span>` : ''}</span>`;
}

export function renderCircles(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({
    initials: 'AS',
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/events'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  const head = document.createElement('header');
  head.className = 'list-screen__head list-screen__head--row';
  head.innerHTML = `
    <div class="list-screen__head-text">
      <h1 class="list-screen__title">Circles</h1>
      <p class="list-screen__sub">Small groups. Big difference.</p>
    </div>
    <button class="list-screen__add" id="circles-new" aria-label="New circle">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      New
    </button>
  `;
  screen.appendChild(head);

  const list = document.createElement('div');
  list.className = 'circle-list';
  CIRCLES.forEach((c) => {
    const row = document.createElement('button');
    row.className = 'circle-row';
    const extra = Math.max(0, c.members - c.tones.length);
    row.innerHTML = `
      <span class="circle-row__avatar" style="background: linear-gradient(135deg, ${c.tones[0]} 0%, ${c.tones[1]} 100%);">
        <span class="circle-row__glyph">${c.glyph}</span>
      </span>
      <span class="circle-row__body">
        <span class="circle-row__topline">
          <span class="circle-row__name">${c.name}</span>
          <span class="circle-row__count">${c.members} members</span>
        </span>
        <span class="circle-row__last">${c.lastLine}</span>
        <span class="circle-row__stack">${avatarStack(c.tones, extra)}</span>
      </span>
      <svg class="circle-row__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    row.addEventListener('click', () => {
      // Prototype: tapping a circle takes you home with a soft toast.
      window.location.hash = '#/';
    });
    list.appendChild(row);
  });
  screen.appendChild(list);

  head.querySelector('#circles-new').addEventListener('click', () => {
    // Prototype: kick off a new circle by routing to Create Event for now.
    window.location.hash = '#/create-event';
  });

  mountBottomNav({ active: 'circles' });
  container.appendChild(screen);
}
