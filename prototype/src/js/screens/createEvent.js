/**
 * Create Event screen.
 *
 * Three timing modes (segmented pill, in this order, left-to-right):
 *   1. "Choose date/time" — host commits to a specific date/time (inline date
 *      picker). Default mode.
 *   2. "I'm flexible"     — host doesn't commit to a date/time. Friends know
 *      it's an open invite and can suggest dates in the chat.
 *   3. "Create a poll"    — host proposes 2+ options; friends vote in chat.
 *
 * UX choices:
 * - WHERE is shown in "Choose date/time" and "I'm flexible" modes. In poll
 *   mode each option carries its own location, so a global field is hidden.
 * - CTA verb adapts: "Make it official" (date), "Float it" (flex), "Send poll".
 * - Successful create routes to the event chat (the conversation is the event;
 *   users go straight from confirmation into the thread).
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
      { id: 'date', label: 'Choose date/time' },
      { id: 'flex', label: "I'm flexible" },
      { id: 'poll', label: 'Create a poll' },
    ],
    active: 'date',
    onChange: (id) => switchMode(id),
  });
  whenSection.appendChild(segmented);

  // Mode-specific panels.
  const flexPanel = document.createElement('div');
  flexPanel.className = 'flex-panel';
  flexPanel.innerHTML = `
    <div class="flex-panel__card">
      <span class="flex-panel__icon" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M3 12C3 8 6 5 10 5C13 5 14 6.5 15 8C16 9.5 17 11 19 11C21 11 21.5 9.5 21.5 8.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          <path d="M3 18C3 14 6 11 10 11C13 11 14 12.5 15 14C16 15.5 17 17 19 17C21 17 21.5 15.5 21.5 14.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </span>
      <div class="flex-panel__body">
        <p class="flex-panel__title">No date locked in.</p>
        <p class="flex-panel__sub">Friends will know it's an open invite. You can pin a date in the chat once people are in.</p>
      </div>
    </div>
  `;
  flexPanel.hidden = true;
  whenSection.appendChild(flexPanel);

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
      const flag = mode === 'poll' ? 'poll=1' : mode === 'flex' ? 'flex=1' : 'new=1';
      const next = encodeURIComponent(`#/event/${id}/chat?${flag}`);
      window.location.hash = `#/create-event/done?mode=${mode}&next=${next}`;
    }, 200);
  });
  ctaWrapper.appendChild(cta);
  screen.appendChild(ctaWrapper);

  function switchMode(id) {
    mode = id;
    flexPanel.hidden = id !== 'flex';
    datePanel.hidden = id !== 'date';
    pollPanel.hidden = id !== 'poll';
    whereSection.style.display = id === 'poll' ? 'none' : '';
    cta.textContent = id === 'poll' ? 'Send poll'
      : id === 'flex' ? 'Float it'
      : 'Make it official';
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
