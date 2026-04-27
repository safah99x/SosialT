/**
 * Events list screen.
 *
 * Layout:
 *   - Top bar (brand)
 *   - Page header (title + subtitle)
 *   - Segmented filter (Upcoming / Around you / Past)
 *   - List of event cards (image left, body right) — taps open the event detail
 *   - Bottom nav (Events tab active)
 *
 * The data is sourced from the same EVENTS map used by event detail and home,
 * so navigating from any entry point lands on the same record.
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';
import { createSegmented } from '../components/segmented.js';
import { getEvent } from './eventDetail.js';

const SECTIONS = {
  upcoming: ['coffee-meetup', 'morning-run', 'concert-night'],
  around:   ['jazz-vigeland', 'sunday-coffee', 'sunset-walk'],
  past:     ['sunday-coffee'],
};

function pinSvg() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>`;
}
function calSvg() {
  return `<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}

export function renderEvents(container) {
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
  head.className = 'list-screen__head';
  head.innerHTML = `
    <h1 class="list-screen__title">Events</h1>
    <p class="list-screen__sub">Past, present, and the maybe-pile.</p>
  `;
  screen.appendChild(head);

  const filter = createSegmented({
    options: [
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'around',   label: 'Around you' },
      { id: 'past',     label: 'Past' },
    ],
    active: 'upcoming',
    onChange: (id) => paint(id),
  });
  filter.classList.add('list-screen__filter');
  screen.appendChild(filter);

  const list = document.createElement('div');
  list.className = 'event-list';
  screen.appendChild(list);

  function paint(section) {
    list.innerHTML = '';
    const ids = SECTIONS[section] || [];
    if (!ids.length) {
      const empty = document.createElement('div');
      empty.className = 'event-list__empty';
      empty.textContent = section === 'past'
        ? "Nothing in the rear-view yet."
        : 'Nothing here yet. Start something.';
      list.appendChild(empty);
      return;
    }
    ids.forEach((id) => {
      const e = getEvent(id);
      if (!e) return;
      const row = document.createElement('button');
      row.className = 'event-list__row';
      row.innerHTML = `
        <span class="event-list__image" style="background-image:url('${e.image}')"></span>
        <span class="event-list__body">
          <span class="event-list__tag">${e.tag}</span>
          <span class="event-list__title">${e.title}</span>
          <span class="event-list__meta">
            <span class="event-list__line">${calSvg()} ${e.date} . ${e.time}</span>
            <span class="event-list__line">${pinSvg()} ${e.place}</span>
          </span>
        </span>
        <svg class="event-list__chev" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      `;
      row.addEventListener('click', () => { window.location.hash = `#/event/${id}`; });
      list.appendChild(row);
    });
  }

  paint('upcoming');
  mountBottomNav({ active: 'events' });
  container.appendChild(screen);
}
