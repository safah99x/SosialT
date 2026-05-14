/**
 * Create Event screen.
 *
 * Three timing modes (segmented pill, in this order, left-to-right):
 *   1. "Choose date/time" — host commits to a specific date/time. Default mode.
 *   2. "I'm flexible"     — host doesn't commit; friends suggest dates in chat.
 *   3. "Create a poll"    — host proposes 2+ options; friends vote in chat.
 *
 * REVIEW (Workshop 5):
 *   - "What's the plan" highlighted as the first required field.
 *   - Date picker is one Airbnb-style month with arrow navigation; range or
 *     single tap; unlimited future months; past dates disabled.
 *   - Time picker is visible inline (was missing in the previous build).
 *   - Poll is rebuilt as Airbnb-style date+time tiles instead of a database
 *     form (see pollBuilder.js).
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';
import { createSegmented } from '../components/segmented.js';
import { createPollBuilder } from '../components/pollBuilder.js';
import { createDateCalendar } from '../components/dateCalendar.js';
import { createTimePicker } from '../components/timePicker.js';
import { mountPickerSheet } from '../components/pickerSheet.js';
import { getEvent } from './eventDetail.js';

function pad(n) { return String(n).padStart(2, '0'); }

export function renderCreateEvent(container, { params: routeParams } = {}) {
  const fromPublicId = routeParams?.get('from') || '';
  const publicEvent = fromPublicId ? getEvent(fromPublicId) : null;
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'create-event-screen';

  screen.appendChild(createHeader('New event'));

  // REVIEW (Workshop 7): "What's the plan?" no longer shouts at the top —
  // it now lives as the placeholder *inside* the title field. The screen
  // header carries the wayfinding so the surface feels calmer.
  const titleSection = document.createElement('div');
  titleSection.className = 'section section--title-quiet';
  titleSection.innerHTML = `
    <div class="create-event-quietlabel">
      <span class="create-event-quietlabel__label">What's the plan?</span>
    </div>
  `;
  // REVIEW: pre-fill with a sensible event title for quick click-through.
  const defaultTitle = publicEvent?.title || 'Sunday brunch at mine';
  const inputField = createInputField("What's the plan?", defaultTitle);
  inputField.classList.add('input-field--required');
  titleSection.appendChild(inputField);
  screen.appendChild(titleSection);

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
      <span class="photo-thumb__img">
        <svg class="photo-thumb__icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.2"/>
          <path d="M21 15L16.5 10.5L5 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
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

  // REVIEW (Workshop 6): mode tabs start *deselected* — the meeting feedback
  // was that the calendar drew the eye before the title field. Now the user
  // must explicitly pick a mode before any panel reveals itself.
  const whenOptions = publicEvent
    ? [
        { id: 'date', label: 'Choose date/time' },
        { id: 'flex', label: "I'm flexible" },
      ]
    : [
        { id: 'date', label: 'Choose date/time' },
        { id: 'flex', label: "I'm flexible" },
        { id: 'poll', label: 'Create a poll' },
      ];

  const segmented = createSegmented({
    options: whenOptions,
    active: null,
    onChange: (id) => switchMode(id),
  });
  whenSection.appendChild(segmented);

  // Empty-state placeholder shown when no WHEN mode is selected yet.
  const whenEmpty = document.createElement('div');
  whenEmpty.className = 'when-empty';
  whenEmpty.innerHTML = `
    <p class="when-empty__hint">Pick a mode above to set the date.</p>
  `;
  whenSection.appendChild(whenEmpty);

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
  // Note: datePanel + pollPanel are appended below.

  // ── Date + Time mode ────────────────────────────────────────────────
  const datePanel = document.createElement('div');
  datePanel.className = 'date-panel';

  const datePanelLabel = document.createElement('p');
  datePanelLabel.className = 'date-panel__label';
  datePanelLabel.textContent = 'Pick a date or a range';
  datePanel.appendChild(datePanelLabel);

  const dateState = { start: new Date(), end: null, startTime: '19:00', endTime: '' };
  const calendar = createDateCalendar({
    mode: 'range',
    start: dateState.start,
    end: dateState.end,
    singleMonthNavigate: true,
    onChange: ({ start, end }) => {
      dateState.start = start;
      dateState.end = end;
    },
  });
  datePanel.appendChild(calendar);
  const timeRow = document.createElement('div');
  timeRow.className = 'time-row';
  timeRow.innerHTML = `
    <button type="button" class="time-row__field" id="time-start" aria-label="Start time">
      <span class="time-row__label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> Start time</span>
      <span class="time-row__value" id="time-start-value">${dateState.startTime}</span>
    </button>
    <button type="button" class="time-row__field time-row__field--ghost" id="time-end" aria-label="End time">
      <span class="time-row__label"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> End time <em>(optional)</em></span>
      <span class="time-row__value" id="time-end-value">Add</span>
    </button>
  `;
  datePanel.appendChild(timeRow);

  // Wire time pickers.
  function openTimeFor(field) {
    let pending = dateState[field] || (field === 'endTime' ? '21:00' : '19:00');
    let sheet;
    const tp = createTimePicker({
      value: pending,
      onChange: (v) => { pending = v; },
      onPick: (v) => {
        dateState[field] = v;
        const valueEl = datePanel.querySelector(field === 'startTime' ? '#time-start-value' : '#time-end-value');
        if (valueEl) valueEl.textContent = v;
        sheet.close();
      },
    });
    sheet = mountPickerSheet({ title: field === 'endTime' ? 'End time' : 'Start time', content: tp });
  }
  timeRow.querySelector('#time-start').addEventListener('click', () => openTimeFor('startTime'));
  timeRow.querySelector('#time-end').addEventListener('click', () => openTimeFor('endTime'));

  datePanel.hidden = true;
  whenSection.appendChild(datePanel);

  // ── Poll mode ───────────────────────────────────────────────────────
  const pollPanel = document.createElement('div');
  pollPanel.className = 'poll-panel';
  pollPanel.appendChild(createPollBuilder({ onChange: () => {} }));
  pollPanel.hidden = true;
  whenSection.appendChild(pollPanel);

  screen.appendChild(whenSection);

  // ── WHERE (only in date / flex mode) ──
  const whereSection = document.createElement('div');
  whereSection.className = 'section';
  whereSection.innerHTML = `<div class="section-label">WHERE</div>`;
  whereSection.appendChild(createLocationCard(publicEvent?.place || 'At my place'));
  screen.appendChild(whereSection);

  // ── INVITE ──
  screen.appendChild(createInviteSection());

  // ── CTA ──
  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'cta-wrapper';
  let mode = null; // REVIEW: nothing selected initially
  const cta = createCTAButton('Pick a mode above', () => {
    if (!mode) return;
    setTimeout(() => {
      const id = 'coffee-meetup';
      const flag = mode === 'poll' ? 'poll=1' : mode === 'flex' ? 'flex=1' : 'new=1';
      const next = encodeURIComponent(`#/event/${id}/chat?${flag}`);
      window.location.hash = `#/create-event/done?mode=${encodeURIComponent(mode)}&cal=${encodeURIComponent(id)}&next=${next}`;
    }, 200);
  });
  cta.disabled = true;
  ctaWrapper.appendChild(cta);
  screen.appendChild(ctaWrapper);

  function switchMode(id) {
    mode = id;
    flexPanel.hidden = id !== 'flex';
    datePanel.hidden = id !== 'date';
    pollPanel.hidden = id !== 'poll';
    // The legacy .date-panel CSS uses an --open class to expand from
    // max-height: 0 — toggle it alongside the hidden flag.
    datePanel.classList.toggle('date-panel--open', id === 'date');
    whenEmpty.hidden = !!id;
    whereSection.style.display = id === 'poll' ? 'none' : '';
    cta.disabled = !id;
    cta.textContent = !id ? 'Pick a mode above'
      : id === 'poll' ? 'Send poll'
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

  // Highlight the title field briefly so it reads as the first required step.
  requestAnimationFrame(() => {
    const inp = inputField.querySelector('input');
    if (inp) inp.focus({ preventScroll: true });
  });

  // Avoid lint for unused pad fn — keep available for future formatting.
  void pad;
}
