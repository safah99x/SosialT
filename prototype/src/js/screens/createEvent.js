/**
 * Create Event screen.
 * Layout: Header → title → input → photo → WHEN → WHERE → INVITE → CTA.
 * "Pick dates" reveals the inline Airbnb-style date picker.
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createChipGroup } from '../components/chip.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';
import { createDatePicker } from '../components/datePicker.js';

export function renderCreateEvent(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'create-event-screen';

  screen.appendChild(createHeader('New Event'));

  const title = document.createElement('h1');
  title.className = 'editorial-title';
  title.textContent = "What's the plan?";
  screen.appendChild(title);

  const sub = document.createElement('p');
  sub.className = 'editorial-subtitle';
  sub.textContent = 'Slower this time. More on purpose.';
  screen.appendChild(sub);

  screen.appendChild(createInputField('Sunday brunch at mine'));

  // Optional photo
  const photoWrap = document.createElement('div');
  photoWrap.className = 'photo-wrap';
  photoWrap.innerHTML = `
    <button class="add-photo-action" id="add-photo-btn">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/>
        <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/>
        <path d="M21 15L16.5 10.5L5 21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>Add photo</span>
    </button>
    <div class="photo-thumb" id="photo-thumb" hidden>
      <span class="photo-thumb__img"></span>
      <button class="photo-thumb__remove" id="photo-remove" aria-label="Remove photo">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </div>
  `;
  screen.appendChild(photoWrap);

  // WHEN — only "I'm flexible" + "Pick dates"
  const whenSection = document.createElement('div');
  whenSection.className = 'section';
  whenSection.innerHTML = `<div class="section-label">WHEN</div>`;
  const whenChips = createChipGroup(["I'm flexible", 'Pick dates']);
  whenSection.appendChild(whenChips);

  // Date picker container (revealed on "Pick dates")
  const datePanel = document.createElement('div');
  datePanel.className = 'date-panel';
  datePanel.appendChild(createDatePicker({ onChange: () => {} }));
  whenSection.appendChild(datePanel);

  whenChips.addEventListener('click', () => {
    const selected = whenChips.querySelector('.chip--selected');
    if (selected && selected.textContent === 'Pick dates') {
      datePanel.classList.add('date-panel--open');
    } else {
      datePanel.classList.remove('date-panel--open');
    }
  });
  screen.appendChild(whenSection);

  // WHERE
  const whereSection = document.createElement('div');
  whereSection.className = 'section';
  whereSection.innerHTML = `<div class="section-label">WHERE</div>`;
  whereSection.appendChild(createLocationCard('At my place'));
  screen.appendChild(whereSection);

  // INVITE
  screen.appendChild(createInviteSection());

  // CTA
  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'cta-wrapper';
  ctaWrapper.appendChild(createCTAButton('Make it official', () => {
    setTimeout(() => { window.location.hash = '#/create-event/done'; }, 200);
  }));
  screen.appendChild(ctaWrapper);

  // Photo demo behavior
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
