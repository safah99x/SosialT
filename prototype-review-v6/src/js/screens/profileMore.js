/**
 * Profile subpages — calendar sync explainer + lightweight privacy placeholders.
 */
import { createHeader } from '../components/header.js';

const PING_KEY = 'sosialt_ping_visibility_v6';

function toastEl(screen, msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  screen.appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
  setTimeout(() => t.remove(), 2000);
}

export function renderCalendarSyncExplain(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen profile-subpage';
  screen.appendChild(createHeader('Calendar sync', null, '#/profile'));

  const body = document.createElement('div');
  body.className = 'profile-subpage__body';
  body.innerHTML = `
    <p class="profile-subpage__lead">SosialT keeps your plans in one place inside the app. Here is how they get onto your phone’s calendar.</p>
    <ul class="profile-subpage__list">
      <li>Every plan you create or join appears in the <strong>SosialT calendar</strong> tab first.</li>
      <li>When you tap <strong>Save to phone calendar</strong> on an event, we prepare a standard calendar file (ICS) or open your phone’s share sheet.</li>
      <li>You add it to <strong>Apple Calendar</strong>, <strong>Google Calendar</strong>, or whatever app you use — same as any other “Add to calendar” link.</li>
    </ul>
    <p class="profile-subpage__note">It’s <strong>one-way</strong>: your phone does not push changes back into SosialT. If a time moves in the app, save again (or re-export) so your phone copy stays accurate.</p>
    <div class="profile-subpage__actions">
      <button type="button" class="cta-button" id="cal-open-app">Open SosialT calendar</button>
    </div>
  `;
  body.querySelector('#cal-open-app').addEventListener('click', () => {
    window.location.hash = '#/calendar';
  });
  screen.appendChild(body);
  container.appendChild(screen);
}

export function renderPingVisibility(container) {
  let stored = 'friends';
  try {
    stored = sessionStorage.getItem(PING_KEY) || 'friends';
  } catch { /* ignore */ }

  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen profile-subpage';
  screen.appendChild(createHeader('Who can ping you', null, '#/profile'));

  const body = document.createElement('div');
  body.className = 'profile-subpage__body';
  const choices = [
    { id: 'friends', title: 'Friends only', sub: 'People you’ve accepted as friends can send Quick Pings.' },
    { id: 'circles', title: 'Friends & circles', sub: 'Anyone in a circle you share can ping you.' },
    { id: 'everyone', title: 'Anyone on SosialT', sub: 'Rare; mostly for open crews you trust.' },
  ];

  const group = document.createElement('div');
  group.className = 'profile-subpage__actions';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-label', 'Ping visibility');

  function paint(active) {
    group.innerHTML = choices.map((c) => `
      <button type="button" class="profile-subpage__choice ${c.id === active ? 'profile-subpage__choice--on' : ''}" data-choice="${c.id}" role="radio" aria-checked="${c.id === active}">
        ${c.title}
        <span class="profile-subpage__choice-sub">${c.sub}</span>
      </button>
    `).join('');
    group.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.choice;
        try {
          sessionStorage.setItem(PING_KEY, id);
        } catch { /* ignore */ }
        toastEl(screen, 'Saved. Quick Pings will follow this rule in the real app.');
        paint(id);
      });
    });
  }

  paint(stored);
  body.appendChild(group);
  screen.appendChild(body);
  container.appendChild(screen);
}

export function renderBlockedList(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen profile-subpage';
  screen.appendChild(createHeader('Blocked', null, '#/profile'));

  const body = document.createElement('div');
  body.className = 'profile-subpage__body';
  body.innerHTML = `
    <p class="profile-subpage__empty">You haven’t blocked anyone in this prototype.</p>
    <p class="profile-subpage__lead" style="margin-top:8px">In the real app, blocked people can’t ping you or see your plans.</p>
    <button type="button" class="profile-subpage__choice" id="blocked-demo">Simulate unblock toast</button>
  `;
  body.querySelector('#blocked-demo').addEventListener('click', () => {
    toastEl(screen, 'Unblock controls would live here.');
  });
  screen.appendChild(body);
  container.appendChild(screen);
}

export function renderYourData(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen profile-subpage';
  screen.appendChild(createHeader('Your data', null, '#/profile'));

  const body = document.createElement('div');
  body.className = 'profile-subpage__body';
  body.innerHTML = `
    <p class="profile-subpage__lead">Exports and deletion requests are handled carefully in production. In this prototype, the buttons below show the intended UX.</p>
    <div class="profile-subpage__actions">
      <button type="button" class="cta-button" id="data-export">Export my plans</button>
      <button type="button" class="profile-subpage__choice" id="data-delete">Request account deletion</button>
    </div>
    <p class="profile-subpage__note">Exports include events and chats you’re part of. Deletion starts a support-verified process so you don’t lose data by accident.</p>
  `;
  body.querySelector('#data-export').addEventListener('click', () => {
    toastEl(screen, 'Export started — you’d get an email with a download link.');
  });
  body.querySelector('#data-delete').addEventListener('click', () => {
    toastEl(screen, 'We’d email you to confirm before anything is removed.');
  });
  screen.appendChild(body);
  container.appendChild(screen);
}
