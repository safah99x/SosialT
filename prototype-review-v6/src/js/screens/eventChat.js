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
 *   - "People going" banner (tappable → attendees section in event detail)
 *   - Day separator
 *   - System message ("You shared an event with the group")
 *   - Inline event card (tappable -> event detail) OR poll card with vote bars
 *   - RSVP strip pinned under the header: Going / Maybe / Not going (+ tap to open detail)
 *   - Composer with send button
 *
 * The 3-dot menu opens a small popover with Event details / Add new friend.
 * Add new friend opens the invite-friends overlay sheet.
 */
import { getEvent } from './eventDetail.js';
import { mountInviteSheet } from './inviteFriends.js';
import { goBack } from '../lib/nav.js';

const SEED_MESSAGES = [
  { from: 'self', kind: 'event-card' },
  { from: 'self', kind: 'text', body: "Hey, put this on the calendar. You all in?" },
  { from: 'maya', kind: 'text', body: 'Ohh, great idea.' },
  { from: 'leo',  kind: 'text', body: 'Should we move it slightly later?' },
  { from: 'self', kind: 'text', body: "Whatever works. Lots to catch up on." },
];

// REVIEW (Workshop 7): private (Plan-with-friends) seed thread starts with
// the public-event card on top, so the inherited date/place are obvious.
const PRIVATE_MESSAGES = [
  { from: 'self', kind: 'event-card', priv: true },
  { from: 'self', kind: 'text', body: "Borrowing this for our crew. Same date and place. Meet a bit earlier so we can grab food first?" },
];

const POLL_MESSAGES = [
  { from: 'self', kind: 'poll-card' },
  { from: 'self', kind: 'text', body: "Pick a slot that works. We'll lock it once most have voted." },
  { from: 'maya', kind: 'text', body: 'Saturday for me.' },
  { from: 'leo',  kind: 'text', body: 'Sunday morning works better, but Saturday if it has to be.' },
];

const FLEX_MESSAGES = [
  { from: 'self', kind: 'event-card', flex: true },
  { from: 'self', kind: 'text', body: "Open invite. When works for you?" },
  { from: 'maya', kind: 'text', body: 'Most weekends, honestly.' },
  { from: 'leo',  kind: 'text', body: "I'm in. Tell me when." },
];

const PEOPLE = {
  self: { name: 'You',    color: '#E8C547' },
  maya: { name: 'Maya',   color: '#C49E7A' },
  leo:  { name: 'Leo',    color: '#8A7E72' },
  ana:  { name: 'Ana',    color: '#6FA786' },
};

const ATTENDEES_PREVIEW = [
  { name: 'You', color: '#E8C547' },
  { name: 'Maya Larsen', color: '#C49E7A' },
  { name: 'Leo Ostby', color: '#8A7E72' },
  { name: 'Ana Petrov', color: '#6FA786' },
  { name: 'Cecily Ashford', color: '#F5D04E' },
];

export function renderEventChat(container, { id, params } = {}) {
  const event = getEvent(id) || getEvent('coffee-meetup');
  const isPoll = params.has('poll');
  const isFlex = params.has('flex');
  const isDraftLayout = params.get('layout') === 'draft';
  const isPrivate = params.has('private');
  const isFresh = params.has('new') || params.has('poll') || params.has('flex') || isPrivate;

  const avatarsRow = `${ATTENDEES_PREVIEW.slice(0, 4).map((a, i) => `<span class="chat-rsvp-bar__av" style="background:${a.color}; z-index:${10 - i}">${a.name[0]}</span>`).join('')}${ATTENDEES_PREVIEW.length > 4 ? `<span class="chat-rsvp-bar__more">+${ATTENDEES_PREVIEW.length - 4}</span>` : ''}`;
  const rsvpPills = `
        <span class="chat-rsvp-bar__pill" data-rsvp-pill="going" role="button" tabindex="0">Going</span>
        <span class="chat-rsvp-bar__pill" data-rsvp-pill="maybe" role="button" tabindex="0">Maybe</span>
        <span class="chat-rsvp-bar__pill" data-rsvp-pill="not-going" role="button" tabindex="0">Not going</span>`;

  const rsvpBlock = isDraftLayout
    ? `
    <button type="button" class="chat-rsvp-bar chat-rsvp-bar--draft" id="chat-rsvp-bar">
      <div class="chat-rsvp-bar--draft__row">
        <div class="chat-rsvp-bar__avatars" aria-hidden="true">${avatarsRow}</div>
        <div class="chat-rsvp-bar--draft__copy">
          <span class="chat-rsvp-bar--draft__k">Your RSVP</span>
          <span class="chat-rsvp-bar--draft__sub">Pick a status · row opens event details</span>
        </div>
      </div>
      <div class="chat-rsvp-bar__pills chat-rsvp-bar__pills--draft">${rsvpPills}
      </div>
      <svg class="chat-rsvp-bar__chev chat-rsvp-bar__chev--draft" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`
    : `
    <button class="chat-rsvp-bar chat-rsvp-bar--classic" id="chat-rsvp-bar" type="button">
      <div class="chat-rsvp-bar__row1">
        <div class="chat-rsvp-bar__avatars" aria-hidden="true">${avatarsRow}</div>
        <div class="chat-rsvp-bar__middle">
          <span class="chat-rsvp-bar__hint">On this invite</span>
          <span class="chat-rsvp-bar__label">How are you leaning?</span>
        </div>
      </div>
      <div class="chat-rsvp-bar__pills">${rsvpPills}
      </div>
      <svg class="chat-rsvp-bar__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>`;

  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = `screen chat-screen${isDraftLayout ? ' chat-screen--draft' : ''}`;

  screen.innerHTML = `
    <header class="chat-header${isPrivate ? ' chat-header--private' : ''}${isDraftLayout ? ' chat-header--tight' : ''}">
      <button class="chat-header__back" id="chat-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="chat-header__avatar" style="background-image:url('${event.image}')"></span>
      <div class="chat-header__title">
        <h1>${event.title}${isPrivate ? ' <span class="chat-header__priv-pill">Private plan</span>' : ''}</h1>
        <span>${isPrivate ? 'Circle chat · listing unchanged' : `${event.date} · ${event.time}`}</span>
      </div>
      <button class="chat-header__menu" id="chat-menu" aria-label="More">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="19" r="1.6" fill="currentColor"/></svg>
      </button>

      <div class="chat-popover" id="chat-popover" hidden>
        <button class="chat-popover__item" data-action="details">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 8V13M12 16V16.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          Event details
        </button>
        <button class="chat-popover__item" data-action="people">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21V19A4 4 0 0 0 13 15H5A4 4 0 0 0 1 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M23 21V19A4 4 0 0 0 20 15.13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="17" cy="7" r="3" stroke="currentColor" stroke-width="1.8"/></svg>
          People going
        </button>
        <button class="chat-popover__item" data-action="invite">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
          Add new friend
        </button>
      </div>
    </header>

    ${rsvpBlock}

    <div class="chat-thread" id="chat-thread"></div>

    <form class="chat-composer" id="chat-composer">
      <input class="chat-composer__input" id="chat-input" type="text" placeholder="Message the group" autocomplete="off" />
      <button class="chat-composer__send" id="chat-send" aria-label="Send" type="submit">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </form>
  `;

  const thread = screen.querySelector('#chat-thread');
  const messages = isPrivate
    ? PRIVATE_MESSAGES
    : isPoll ? POLL_MESSAGES : isFlex ? FLEX_MESSAGES : SEED_MESSAGES;
  thread.appendChild(renderDaySeparator(today()));
  thread.appendChild(renderSystemMessage(
    isPrivate
      ? 'New plan started from a public event. Date and place are inherited.'
      : 'You shared an event with the group'
  ));
  messages.forEach((m) => thread.appendChild(renderMessage(m, event)));
  if (isFresh) {
    thread.appendChild(renderSystemMessage(isPrivate ? 'Just now · Pick a time and invite people' : "Just now . Let's gooo"));
  }

  // ── RSVP strip → event detail ──
  const rsvpBar = screen.querySelector('#chat-rsvp-bar');
  rsvpBar.addEventListener('click', (e) => {
    const pill = e.target.closest('[data-rsvp-pill]');
    if (pill) {
      e.stopPropagation();
      rsvpBar.querySelectorAll('[data-rsvp-pill]').forEach((p) => p.classList.toggle('chat-rsvp-bar__pill--on', p === pill));
      const map = {
        going: 'Marked you as Going · others see it in this thread.',
        maybe: 'Marked as Maybe · you can change anytime from the event.',
        'not-going': 'Marked as Not going · no judgement, keeps headcount honest.',
      };
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = map[pill.dataset.rsvpPill] || 'Updated.';
      screen.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 1800);
      setTimeout(() => toast.remove(), 2200);
      return;
    }
    window.location.hash = `#/event/${id}`;
  });

  // ── Header back ──
  screen.querySelector('#chat-back').addEventListener('click', () => {
    goBack(`#/event/${id}`);
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
  popover.querySelector('[data-action="people"]').addEventListener('click', () => {
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
  if (m.kind === 'event-card') return renderEventCard(event, { flex: m.flex, priv: m.priv });
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

function renderEventCard(event, { flex = false, priv = false } = {}) {
  const wrap = document.createElement('button');
  wrap.className = 'chat-event-card';
  wrap.type = 'button';
  const meta = flex
    ? `Date TBD . ${event.place}`
    : `${event.date} . ${event.time} . ${event.place}`;
  const tag = priv ? 'From a public event' : (flex ? 'Open invite' : 'Event');
  wrap.innerHTML = `
    <span class="chat-event-card__image" style="background-image:url('${event.image}')"></span>
    <span class="chat-event-card__body">
      <span class="chat-event-card__tag">${tag}</span>
      <span class="chat-event-card__title">${event.title}</span>
      <span class="chat-event-card__meta">${meta}</span>
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
