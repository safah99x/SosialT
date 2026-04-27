/**
 * Create Event screen.
 *
 * Two timing modes:
 *   1. "Pick a time" — host commits to a specific date/time (uses inline date picker).
 *   2. "Create a poll" — host proposes 2+ options; friends vote in chat.
 *
 * UX choices:
 * - The mode toggle is a segmented pill, the most discoverable pattern for a
 *   binary-but-distinct choice.
 * - WHERE is only shown in "Pick a time" mode. In poll mode each option carries
 *   its own location, so a global location field would just create a conflict.
 * - The CTA stays warm and confident: "Make it official" for date, "Send poll"
 *   for poll. The verb tells you what's about to happen.
 * - Successful create routes to the event chat (the conversation is the event;
 *   per the design notes, users go straight from confirmation into the thread).
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';
import { createDatePicker } from '../components/datePicker.js';
import { createSegmented } from '../components/segmented.js';
import { createPollBuilder } from '../components/pollBuilder.js';

export function renderCreateEvent(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'create-event-screen';

  screen.appendChild(createHeader('New event'));

  const title = document.createElement('h1');
  title.className = 'editorial-title';
  title.textContent = "What's the plan?";
  screen.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'editorial-subtitle';
  sub.textContent = 'Slower this time. More on purpose.';
  screen.appendChild(sub);

  screen.appendChild(createInputField('Sunday brunch at mine'));

  // ── Optional photo ──
  const photoWrap = document.createElement('div');
  photoWrap.className = 'photo-wrap';
  photoWrap.innerHTML = `
    <button class="add-photo-action" id="add-photo-btn" type="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M21 15L16.5 10.5L5 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>Add photo</span>
    </button>
    <div class="photo-thumb" id="photo-thumb" hidden>
      <span class="photo-thumb__img"></span>
      <button class="photo-thumb__remove" id="photo-remove" aria-label="Remove photo" type="button">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </div>
  `;
  screen.appendChild(photoWrap);

  // ── WHEN section ──
  const whenSection = document.createElement('div');
  whenSection.className = 'section';
  whenSection.innerHTML = `<div class="section-label">WHEN</div>`;

  const segmented = createSegmented({
    options: [
      { id: 'date', label: 'Pick a time' },
      { id: 'poll', label: 'Create a poll' },
    ],
    active: 'date',
    onChange: (id) => switchMode(id),
  });
  whenSection.appendChild(segmented);

  // Mode-specific panels.
  const datePanel = document.createElement('div');
  datePanel.className = 'date-panel date-panel--open';
  datePanel.appendChild(createDatePicker({ onChange: () => {} }));
  whenSection.appendChild(datePanel);

  const pollPanel = document.createElement('div');
  pollPanel.className = 'poll-panel';
  pollPanel.appendChild(createPollBuilder({ onChange: () => {} }));
  pollPanel.hidden = true;
  whenSection.appendChild(pollPanel);

  screen.appendChild(whenSection);

  // ── WHERE (only in date mode) ──
  const whereSection = document.createElement('div');
  whereSection.className = 'section';
  whereSection.innerHTML = `<div class="section-label">WHERE</div>`;
  whereSection.appendChild(createLocationCard('At my place'));
  screen.appendChild(whereSection);

  // ── INVITE ──
  screen.appendChild(createInviteSection());

  // ── CTA ──
  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'cta-wrapper';
  let mode = 'date';
  const cta = createCTAButton('Make it official', () => {
    setTimeout(() => {
      const id = 'coffee-meetup'; // prototype: route to known thread.
      const next = encodeURIComponent(`#/event/${id}/chat?${mode === 'poll' ? 'poll=1' : 'new=1'}`);
      window.location.hash = `#/create-event/done?mode=${mode}&next=${next}`;
    }, 200);
  });
  ctaWrapper.appendChild(cta);
  screen.appendChild(ctaWrapper);

  function switchMode(id) {
    mode = id;
    if (id === 'poll') {
      datePanel.hidden = true;
      pollPanel.hidden = false;
      whereSection.style.display = 'none';
      cta.textContent = 'Send poll';
    } else {
      datePanel.hidden = false;
      pollPanel.hidden = true;
      whereSection.style.display = '';
      cta.textContent = 'Make it official';
    }
  }

  // ── Photo demo behavior ──
  photoWrap.querySelector('#add-photo-btn').addEventListener('click', () => {
    photoWrap.querySelector('#add-photo-btn').setAttribute('hidden', '');
    photoWrap.querySelector('#photo-thumb').removeAttribute('hidden');
  });
  photoWrap.querySelector('#photo-remove').addEventListener('click', () => {
    photoWrap.querySelector('#photo-thumb').setAttribute('hidden', '');
    photoWrap.querySelector('#add-photo-btn').removeAttribute('hidden');
  });

  container.appendChild(screen);
}
