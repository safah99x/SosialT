/**
 * Event Chat screen — the conversation thread anchored to a specific event.
 *
 * Why a per-event chat (not just a global DM):
 * - Keeps the plan and the conversation in one place (no losing the link in
 *   a busy general chat).
 * - When the host creates a poll, votes happen inline as messages.
 *
 * Sections:
 *   - App bar: back, event avatar + title + group, 3-dot menu
 *   - Day separator
 *   - System message ("You shared an event with the group")
 *   - Inline event card (tappable -> event detail) OR poll card with vote bars
 *   - Message bubbles (self = warm yellow tint right; others = cream left)
 *   - Composer with send button
 *
 * The 3-dot menu opens a small popover with Event details / Add new friend.
 * Add new friend opens the invite-friends overlay sheet.
 */
import { getEvent } from './eventDetail.js';
import { mountInviteSheet } from './inviteFriends.js';

const SEED_MESSAGES = [
  { from: 'self', kind: 'event-card' },
  { from: 'self', kind: 'text', body: "Hey, put this on the calendar. You all in?" },
  { from: 'maya', kind: 'text', body: 'Ohh, great idea.' },
  { from: 'leo',  kind: 'text', body: 'Should we move it slightly later?' },
  { from: 'self', kind: 'text', body: "Whatever works. Lots to catch up on." },
];

const POLL_MESSAGES = [
  { from: 'self', kind: 'poll-card' },
  { from: 'self', kind: 'text', body: "Pick a slot that works. We'll lock it once most have voted." },
  { from: 'maya', kind: 'text', body: 'Saturday for me.' },
  { from: 'leo',  kind: 'text', body: 'Sunday morning works better, but Saturday if it has to be.' },
];

const PEOPLE = {
  self: { name: 'You',    color: '#E8C547' },
  maya: { name: 'Maya',   color: '#C49E7A' },
  leo:  { name: 'Leo',    color: '#8A7E72' },
  ana:  { name: 'Ana',    color: '#6FA786' },
};

export function renderEventChat(container, { id, params } = {}) {
  const event = getEvent(id) || getEvent('coffee-meetup');
  const isPoll = params.has('poll');
  const isFresh = params.has('new') || params.has('poll');

  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen chat-screen';

  screen.innerHTML = `
    <header class="chat-header">
      <button class="chat-header__back" id="chat-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="chat-header__avatar" style="background-image:url('${event.image}')"></span>
      <div class="chat-header__title">
        <h1>${event.title}</h1>
        <span>Event . ${event.group}</span>
      </div>
      <button class="chat-header__menu" id="chat-menu" aria-label="More">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/></svg>
      </button>

      <div class="chat-popover" id="chat-popover" hidden>
        <button class="chat-popover__item" data-action="details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 8V13M12 16V16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Event details
        </button>
        <button class="chat-popover__item" data-action="invite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add new friend
        </button>
      </div>
    </header>

    <div class="chat-thread" id="chat-thread"></div>

    <form class="chat-composer" id="chat-composer">
      <input class="chat-composer__input" id="chat-input" type="text" placeholder="Type a message" autocomplete="off" />
      <button class="chat-composer__send" id="chat-send" aria-label="Send" type="submit">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </form>
  `;

  const thread = screen.querySelector('#chat-thread');
  const messages = isPoll ? POLL_MESSAGES : SEED_MESSAGES;
  thread.appendChild(renderDaySeparator(today()));
  thread.appendChild(renderSystemMessage('You shared an event with the group'));
  messages.forEach((m) => thread.appendChild(renderMessage(m, event)));
  if (isFresh) {
    thread.appendChild(renderSystemMessage("Just now . Let's gooo"));
  }

  // ── Header back ──
  screen.querySelector('#chat-back').addEventListener('click', () => {
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/';
  });

  // ── 3-dot menu ──
  const menuBtn = screen.querySelector('#chat-menu');
  const popover = screen.querySelector('#chat-popover');
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    popover.hidden = !popover.hidden;
  });
  document.addEventListener('click', (e) => {
    if (!screen.contains(e.target)) return;
    if (e.target.closest('#chat-menu')) return;
    popover.hidden = true;
  });

  popover.querySelector('[data-action="details"]').addEventListener('click', () => {
    popover.hidden = true;
    window.location.hash = `#/event/${id}`;
  });
  popover.querySelector('[data-action="invite"]').addEventListener('click', () => {
    popover.hidden = true;
    mountInviteSheet({
      onConfirm: (selected) => {
        thread.appendChild(renderSystemMessage(`You added ${selected} friend${selected === 1 ? '' : 's'}`));
        thread.scrollTop = thread.scrollHeight;
      },
    });
  });

  // ── Composer ──
  const composer = screen.querySelector('#chat-composer');
  const input = screen.querySelector('#chat-input');
  composer.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    thread.appendChild(renderMessage({ from: 'self', kind: 'text', body: text }, event));
    input.value = '';
    thread.scrollTop = thread.scrollHeight;
  });

  // Inline event/poll card tap -> event detail
  thread.addEventListener('click', (e) => {
    const card = e.target.closest('.chat-event-card');
    if (!card) return;
    window.location.hash = `#/event/${id}`;
  });

  // Auto-scroll to the bottom on first paint.
  requestAnimationFrame(() => { thread.scrollTop = thread.scrollHeight; });

  container.appendChild(screen);
}

function renderDaySeparator(label) {
  const el = document.createElement('div');
  el.className = 'chat-day';
  el.textContent = label;
  return el;
}

function renderSystemMessage(text) {
  const el = document.createElement('div');
  el.className = 'chat-system';
  el.textContent = text;
  return el;
}

function renderMessage(m, event) {
  if (m.kind === 'event-card') return renderEventCard(event);
  if (m.kind === 'poll-card')  return renderPollCard(event);

  const row = document.createElement('div');
  row.className = `chat-row chat-row--${m.from === 'self' ? 'me' : 'them'}`;

  if (m.from !== 'self') {
    const avatar = document.createElement('span');
    avatar.className = 'chat-avatar';
    avatar.style.background = PEOPLE[m.from]?.color || '#C49E7A';
    avatar.textContent = (PEOPLE[m.from]?.name || '?').slice(0, 1);
    row.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble chat-bubble--${m.from === 'self' ? 'me' : 'them'}`;
  bubble.textContent = m.body;
  row.appendChild(bubble);

  return row;
}

function renderEventCard(event) {
  const wrap = document.createElement('button');
  wrap.className = 'chat-event-card';
  wrap.type = 'button';
  wrap.innerHTML = `
    <span class="chat-event-card__image" style="background-image:url('${event.image}')"></span>
    <span class="chat-event-card__body">
      <span class="chat-event-card__tag">Event</span>
      <span class="chat-event-card__title">${event.title}</span>
      <span class="chat-event-card__meta">${event.date} . ${event.time} . ${event.place}</span>
    </span>
    <svg class="chat-event-card__arrow" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  `;
  return wrap;
}

function renderPollCard(event) {
  const wrap = document.createElement('div');
  wrap.className = 'chat-poll-card';
  const options = [
    { label: `Sat, May 2 . 10:00`,  votes: 3, you: false },
    { label: `Sun, May 3 . 11:00`,  votes: 2, you: true  },
    { label: `Sat, May 9 . 18:00`,  votes: 1, you: false },
  ];
  const total = options.reduce((s, o) => s + o.votes, 0);
  wrap.innerHTML = `
    <div class="chat-poll-card__head">
      <span class="chat-event-card__tag">Poll</span>
      <span class="chat-poll-card__title">${event.title}</span>
      <span class="chat-event-card__meta">${event.place} . tap to vote</span>
    </div>
    <ul class="chat-poll-card__options">
      ${options.map((o, i) => `
        <li class="chat-poll-option ${o.you ? 'chat-poll-option--you' : ''}" data-option="${i}">
          <span class="chat-poll-option__bar" style="--w:${(o.votes / Math.max(total, 1)) * 100}%"></span>
          <span class="chat-poll-option__label">${o.label}</span>
          <span class="chat-poll-option__count">${o.votes}</span>
        </li>
      `).join('')}
    </ul>
    <p class="chat-poll-card__hint">${total} votes. Closes when everyone's chimed in.</p>
  `;
  // Allow vote toggling.
  wrap.addEventListener('click', (e) => {
    const opt = e.target.closest('.chat-poll-option');
    if (!opt) return;
    wrap.querySelectorAll('.chat-poll-option').forEach((x) => x.classList.remove('chat-poll-option--you'));
    opt.classList.add('chat-poll-option--you');
  });
  return wrap;
}

function today() {
  const d = new Date();
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
