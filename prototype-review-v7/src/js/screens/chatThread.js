/**
 * REVIEW (Workshop 6) — Chat-first thread.
 *
 * Stand-alone chat thread for chat-first conversations and Quick Pings
 * (the chats list routes ping/chat threads here when there's no underlying
 * event). The header carries a "Convert to plan" pill that surfaces a
 * little popover with options:
 *   - Make it an Event   -> /create-event with prefilled participants
 *   - Make it a Quick Ping -> /quick-ping
 *
 * The conversation itself is mocked with a few seed messages so the demo
 * feels real.
 */
import { goBack } from '../lib/nav.js';
import { rsvpOverviewCompactHtml } from '../components/rsvpOverview.js';

const SEED = {
  'new-chat': {
    title: 'New chat',
    sub: 'Just started \u2014 say hi',
    members: ['You', 'Eleanor', 'Rupert'],
    rsvp: { going: 3, 'not-going': 0, maybe: 0 },
    messages: [
      { from: 'You',     text: "Hey \u2014 thinking of grabbing a coffee soon \u2728" },
      { from: 'Eleanor', text: 'always 100% in for that' },
    ],
  },
  'qp-tim-wendelboe': {
    title: 'Coffee at Tim Wendelboe',
    sub: 'Quick Ping \u00b7 Coffee Crew',
    members: ['You', 'Eleanor', 'Rupert'],
    rsvp: { going: 3, 'not-going': 0, maybe: 0 },
    messages: [
      { from: 'You',     text: "Heading to Tim Wendelboe in 30. Whoever's free, come hang." },
      { from: 'Eleanor', text: 'On my way \u2014 grab us a window seat?' },
      { from: 'Rupert',  text: '5 min behind Ele.' },
    ],
  },
  'chat-rosaline': {
    title: 'Rosaline Fairfax',
    sub: '1:1',
    members: ['You', 'Rosaline'],
    rsvp: { going: 2, 'not-going': 0, maybe: 0 },
    messages: [
      { from: 'Rosaline', text: 'Up for a walk this weekend?' },
      { from: 'You',      text: 'Sat morning works for me \u2014 short loop?' },
    ],
  },
};

function getThread(id) {
  return SEED[id] || {
    title: 'Chat',
    sub: 'Stand-alone thread',
    members: ['You'],
    rsvp: { going: 1, 'not-going': 0, maybe: 0 },
    messages: [{ from: 'You', text: 'Hello world.' }],
  };
}

export function renderChatThread(container, { id }) {
  container.innerHTML = '';
  const t = getThread(id);

  const screen = document.createElement('div');
  screen.className = 'screen chat-thread';

  screen.innerHTML = `
    <header class="chat-thread__head">
      <button class="header-back chat-thread__back" id="ct-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <div class="chat-thread__head-body">
        <span class="chat-thread__title">${t.title}</span>
        <span class="chat-thread__sub">${t.sub}</span>
      </div>
      <button class="chat-thread__convert" id="ct-convert" aria-label="Convert to plan">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        Convert
      </button>
    </header>

    ${t.rsvp ? `<div class="chat-thread__rsvp-bar">${rsvpOverviewCompactHtml(t.rsvp)}</div>` : ''}

    <div class="chat-thread__body" id="ct-body">
      ${t.messages.map((m) => `
        <div class="chat-thread__msg ${m.from === 'You' ? 'chat-thread__msg--me' : ''}">
          ${m.from !== 'You' ? `<span class="chat-thread__from">${m.from}</span>` : ''}
          <span class="chat-thread__bubble">${m.text}</span>
        </div>
      `).join('')}
    </div>

    <div class="chat-thread__compose">
      <input class="chat-thread__input" id="ct-input" type="text" placeholder="Type something\u2026" />
      <button class="chat-thread__send" id="ct-send" aria-label="Send">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 11L21 3L13 21L11 13L3 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;

  screen.querySelector('#ct-back').addEventListener('click', () => goBack('#/chats'));

  // Convert popover.
  screen.querySelector('#ct-convert').addEventListener('click', (e) => {
    e.stopPropagation();
    const existing = document.getElementById('ct-convert-pop');
    if (existing) { existing.remove(); return; }

    const pop = document.createElement('div');
    pop.id = 'ct-convert-pop';
    pop.className = 'chat-thread__convert-pop';
    pop.innerHTML = `
      <p class="chat-thread__convert-pop-title">Turn this chat into\u2026</p>
      <button type="button" class="chat-thread__convert-opt" data-go="quick-ping">
        <span class="chat-thread__convert-opt-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
        <span>
          <span class="chat-thread__convert-opt-title">Quick Ping</span>
          <span class="chat-thread__convert-opt-sub">Within the next 3 days</span>
        </span>
      </button>
      <button type="button" class="chat-thread__convert-opt" data-go="create-event">
        <span class="chat-thread__convert-opt-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <span>
          <span class="chat-thread__convert-opt-title">Create Event</span>
          <span class="chat-thread__convert-opt-sub">Time, place, RSVPs</span>
        </span>
      </button>
    `;
    screen.appendChild(pop);

    pop.querySelectorAll('.chat-thread__convert-opt').forEach((b) => {
      b.addEventListener('click', () => {
        const go = b.dataset.go;
        pop.remove();
        window.location.hash = `#/${go}?from=chat&thread=${encodeURIComponent(id)}`;
      });
    });

    document.addEventListener('click', () => pop.remove(), { once: true });
  });

  // Compose mock.
  const input = screen.querySelector('#ct-input');
  const send = screen.querySelector('#ct-send');
  function pushMessage() {
    const v = input.value.trim();
    if (!v) return;
    const body = screen.querySelector('#ct-body');
    const wrap = document.createElement('div');
    wrap.className = 'chat-thread__msg chat-thread__msg--me';
    wrap.innerHTML = `<span class="chat-thread__bubble">${v.replace(/</g, '&lt;')}</span>`;
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    input.value = '';
  }
  send.addEventListener('click', pushMessage);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') pushMessage();
  });

  container.appendChild(screen);

  // Scroll to bottom on mount.
  requestAnimationFrame(() => {
    const body = screen.querySelector('#ct-body');
    if (body) body.scrollTop = body.scrollHeight;
  });
}
