/**
 * Chats list screen.
 * Each row is an event-thread preview: avatar (event image) + title + last
 * message + relative time + unread dot.
 *
 * Tapping a row opens that event's chat.
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';
import { getEvent } from './eventDetail.js';

const THREADS = [
  { id: 'coffee-meetup', last: "Sure, let's try and we have lots to talk.", time: 'now',  unread: 2, who: 'Maya' },
  { id: 'morning-run',   last: 'Bring layers. Cold one tomorrow.',          time: '12m',  unread: 0, who: 'Leo'  },
  { id: 'concert-night', last: 'Tickets in the group folder.',              time: '2h',   unread: 1, who: 'Ana'  },
  { id: 'jazz-vigeland', last: 'Picnic blanket secured.',                   time: 'Mon',  unread: 0, who: 'Sigrid' },
];

export function renderChats(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({ initials: 'AS' }));

  const head = document.createElement('div');
  head.className = 'chats-head';
  head.innerHTML = `
    <h1 class="chats-head__title">Chats</h1>
    <p class="chats-head__sub">One thread per plan. Side-quests welcome.</p>
  `;
  screen.appendChild(head);

  const list = document.createElement('div');
  list.className = 'chats-list';
  THREADS.forEach((t) => {
    const e = getEvent(t.id);
    if (!e) return;
    const row = document.createElement('button');
    row.className = 'chats-row';
    row.dataset.id = t.id;
    row.innerHTML = `
      <span class="chats-row__avatar" style="background-image:url('${e.image}')"></span>
      <span class="chats-row__body">
        <span class="chats-row__topline">
          <span class="chats-row__title">${e.title}</span>
          <span class="chats-row__time">${t.time}</span>
        </span>
        <span class="chats-row__msg"><strong>${t.who}:</strong> ${t.last}</span>
      </span>
      ${t.unread ? `<span class="chats-row__unread">${t.unread}</span>` : `<span class="chats-row__chevron"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`}
    `;
    row.addEventListener('click', () => { window.location.hash = `#/event/${t.id}/chat`; });
    list.appendChild(row);
  });
  screen.appendChild(list);

  mountBottomNav({ active: 'chats' });
  container.appendChild(screen);
}
