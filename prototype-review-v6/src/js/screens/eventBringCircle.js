/**
 * REVIEW (Workshop 6) — Plan-with-my-circle for public/scraped events.
 *
 * Reachable from any event with `publicSource: true` via the
 * "Plan this with friends" CTA on the event detail screen. Lets the user
 * convert a public listing into a private gathering for their own circle:
 *
 *   1. Pick a circle (or specific friends)
 *   2. Optionally tweak the date/time
 *   3. Add a private note
 *   4. Send -> success screen -> private chat
 *
 * The public event itself stays public. The user's circle invite layer is
 * only visible to themselves and the people they invite, addressing the
 * "private vs open" feedback from the meeting.
 */
import { createHeader } from '../components/header.js';
import { createCTAButton } from '../components/ctaButton.js';
import { createInputField } from '../components/inputField.js';
import { goBack } from '../lib/nav.js';
import { setPrivatePlan } from '../lib/publicEventState.js';
import { getEvent } from './eventDetail.js';
import { createTimePicker } from '../components/timePicker.js';
import { mountPickerSheet } from '../components/pickerSheet.js';

const CIRCLES = [
  { id: 'party',      name: 'Party Crew',     count: 4, color: '#E8C547' },
  { id: 'college',    name: 'College Squared',count: 4, color: '#C49E7A' },
  { id: 'hiking',     name: 'Hiking Buddies', count: 6, color: '#6FA786' },
  { id: 'inner',      name: 'Inner Circle',   count: 3, color: '#D4849A' },
];

export function renderEventBringCircle(container, { id, params = new URLSearchParams() }) {
  container.innerHTML = '';
  const event = getEvent(id);
  const flowB = params.get('flow') === 'b';

  const screen = document.createElement('div');
  screen.className = 'screen bring-circle';

  if (!event) {
    screen.innerHTML = `
      <header class="app-header">
        <button class="header-back" id="bb"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <span class="header-title">Not found</span>
        <span class="header-spacer"></span>
      </header>
      <p class="editorial-subtitle">That event has gone for a walk. Try another.</p>
    `;
    screen.querySelector('#bb').addEventListener('click', () => goBack('#/events'));
    container.appendChild(screen);
    return;
  }

  screen.appendChild(createHeader(flowB ? 'Invite your people' : 'Plan with friends'));

  // Public event preview card.
  const previewCard = document.createElement('div');
  previewCard.className = 'bring-circle__preview';
  previewCard.innerHTML = `
    <span class="bring-circle__preview-img" style="background-image: url('${event.image}')"></span>
    <span class="bring-circle__preview-body">
      <span class="bring-circle__preview-tag">Open listing → private plan</span>
      <span class="bring-circle__preview-title">${event.title}</span>
      <span class="bring-circle__preview-meta">${event.date} \u00b7 ${event.time} \u00b7 ${event.place}</span>
    </span>
  `;
  screen.appendChild(previewCard);

  // Privacy callout — addresses the "private vs open" meeting note explicitly.
  const privacy = document.createElement('div');
  privacy.className = 'bring-circle__privacy';
  privacy.innerHTML = `
    <span class="bring-circle__privacy-icon">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2L4 6V12C4 17 7.5 21 12 22C16.5 21 20 17 20 12V6L12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <span class="bring-circle__privacy-text">
      <strong>Stays private.</strong> The public event keeps running. Your circle invite, note and chat are only visible to the people you pick.
    </span>
  `;
  screen.appendChild(privacy);

  // Step 1 — pick a circle (or friends).
  const step1 = document.createElement('div');
  step1.className = 'section';
  step1.innerHTML = `<div class="section-label">WHO'S COMING</div>`;

  const circleGrid = document.createElement('div');
  circleGrid.className = 'bring-circle__grid';
  let selectedCircleId = null;

  CIRCLES.forEach((c) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'bring-circle__tile';
    tile.dataset.id = c.id;
    tile.innerHTML = `
      <span class="bring-circle__tile-av" style="background:${c.color}"></span>
      <span class="bring-circle__tile-name">${c.name}</span>
      <span class="bring-circle__tile-meta">${c.count} people</span>
    `;
    tile.addEventListener('click', () => {
      selectedCircleId = c.id;
      circleGrid.querySelectorAll('.bring-circle__tile').forEach((x) => x.classList.remove('bring-circle__tile--selected'));
      tile.classList.add('bring-circle__tile--selected');
      refreshCta();
    });
    circleGrid.appendChild(tile);
  });

  // Pick specific friends fallback tile.
  const friendsTile = document.createElement('button');
  friendsTile.type = 'button';
  friendsTile.className = 'bring-circle__tile bring-circle__tile--ghost';
  friendsTile.innerHTML = `
    <span class="bring-circle__tile-av bring-circle__tile-av--ghost">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
    </span>
    <span class="bring-circle__tile-name">Pick friends</span>
    <span class="bring-circle__tile-meta">No fixed circle</span>
  `;
  friendsTile.addEventListener('click', () => {
    selectedCircleId = 'custom';
    circleGrid.querySelectorAll('.bring-circle__tile').forEach((x) => x.classList.remove('bring-circle__tile--selected'));
    friendsTile.classList.add('bring-circle__tile--selected');
    refreshCta();
  });
  circleGrid.appendChild(friendsTile);

  step1.appendChild(circleGrid);
  screen.appendChild(step1);

  // Step 2 — adjust details. REVIEW (Workshop 7): date + place inherit
  // from the public event and are *locked* (the public listing is real and
  // immutable); only the meet-up time is editable so the crew can choose
  // to e.g. show up earlier for drinks first.
  const step2 = document.createElement('div');
  step2.className = 'section';
  step2.innerHTML = `<div class="section-label">DETAILS</div>`;

  const lockedRows = document.createElement('div');
  lockedRows.className = 'bring-circle__locked';
  lockedRows.innerHTML = `
    <div class="bring-circle__locked-row">
      <span class="bring-circle__locked-label">Date</span>
      <span class="bring-circle__locked-value">${event.date}</span>
      <span class="bring-circle__locked-pill">Fixed</span>
    </div>
    <div class="bring-circle__locked-row">
      <span class="bring-circle__locked-label">Place</span>
      <span class="bring-circle__locked-value">${event.place}</span>
      <span class="bring-circle__locked-pill">Fixed</span>
    </div>
  `;
  step2.appendChild(lockedRows);

  const timeState = { value: event.time };
  const timeBtn = document.createElement('button');
  timeBtn.type = 'button';
  timeBtn.className = 'bring-circle__time-btn';
  timeBtn.innerHTML = `
    <span class="bring-circle__time-label">Meet at</span>
    <span class="bring-circle__time-value" id="bring-time-value">${timeState.value}</span>
    <span class="bring-circle__time-edit">Edit</span>
  `;
  timeBtn.addEventListener('click', () => {
    let pending = timeState.value;
    let sheet;
    const tp = createTimePicker({
      value: pending,
      onChange: (v) => { pending = v; },
      onPick: (v) => {
        timeState.value = v;
        const el = timeBtn.querySelector('#bring-time-value');
        if (el) el.textContent = v;
        sheet.close();
      },
    });
    sheet = mountPickerSheet({ title: 'Meet at', content: tp });
  });
  step2.appendChild(timeBtn);
  screen.appendChild(step2);

  // Step 3 — optional note.
  const step3 = document.createElement('div');
  step3.className = 'section';
  step3.innerHTML = `<div class="section-label">NOTE FOR THE CIRCLE (OPTIONAL)</div>`;
  const noteField = createInputField('e.g. Drinks first at the corner cafe?', '');
  step3.appendChild(noteField);
  screen.appendChild(step3);

  if (flowB) {
    step2.hidden = true;
    step3.hidden = true;
    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'bring-circle__expand';
    expand.textContent = 'Adjust time or place (optional)';
    expand.addEventListener('click', () => {
      step2.hidden = false;
      step3.hidden = false;
      expand.hidden = true;
    });
    screen.appendChild(expand);
  }

  // CTA.
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper';
  const cta = createCTAButton('Pick a circle to continue', () => {
    if (!selectedCircleId) return;
    setTimeout(() => {
      setPrivatePlan(id);
      const next = encodeURIComponent(`#/event/${id}/chat?private=1`);
      window.location.hash = `#/create-event/done?mode=private&cal=${encodeURIComponent(id)}&next=${next}`;
    }, 200);
  });
  cta.disabled = true;
  ctaWrap.appendChild(cta);
  screen.appendChild(ctaWrap);

  function refreshCta() {
    if (selectedCircleId) {
      cta.disabled = false;
      cta.textContent = 'Send to my circle';
    } else {
      cta.disabled = true;
      cta.textContent = 'Pick a circle to continue';
    }
  }

  container.appendChild(screen);
}
