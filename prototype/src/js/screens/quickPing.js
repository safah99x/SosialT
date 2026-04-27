/**
 * Quick Ping screen.
 * Layout: Header → editorial title → subtitle → input → WHEN → WHERE → INVITE → CTA.
 *
 * The WHEN section uses chips (Now / In 30 min / Tonight / Choose time). The
 * "Choose time" chip opens the brand time picker; once a time is picked the
 * chip's label snaps to the chosen time so it stays the active selection.
 *
 * Sending the ping navigates to the success confirmation route.
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createChip } from '../components/chip.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';
import { createTimePicker } from '../components/timePicker.js';
import { mountPickerSheet } from '../components/pickerSheet.js';

export function renderQuickPing(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'quick-ping-screen';

  screen.appendChild(createHeader('Quick Ping'));

  const title = document.createElement('h1');
  title.className = 'editorial-title';
  title.textContent = 'What are you up to?';
  screen.appendChild(title);

  screen.appendChild(createInputField('Coffee at Tim Wendelboe'));

  const whenSection = document.createElement('div');
  whenSection.className = 'section';
  whenSection.innerHTML = `<div class="section-label">WHEN</div>`;

  const chipGroup = document.createElement('div');
  chipGroup.className = 'chip-group';
  chipGroup.setAttribute('role', 'listbox');

  const STATIC = ['Now', 'In 30 min', 'Tonight'];
  let when = 'Now';

  const chips = STATIC.map((label) =>
    createChip(label, label === when, () => setSelected(label))
  );

  // "Choose time" is special: it opens the brand time picker and, once a time
  // is picked, the chip label snaps to that time and stays selected.
  let pickedTime = '';
  const customChip = createChip('Choose time', false, () => openTimePicker());
  customChip.classList.add('chip--with-icon');
  customChip.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/>
      <path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>
    <span class="chip__label">${customChip.textContent}</span>
  `;

  function setSelected(label) {
    when = label;
    [...chips, customChip].forEach((c) => {
      const isMe = c === customChip ? label === pickedTime : c.textContent.trim() === label;
      c.classList.toggle('chip--selected', isMe);
      c.setAttribute('aria-selected', String(isMe));
    });
  }

  function openTimePicker() {
    let pending = pickedTime || '19:00';
    let sheet;
    const tp = createTimePicker({
      value: pending,
      onChange: (v) => { pending = v; },
      onPick: (v) => {
        pickedTime = v;
        when = v;
        const labelEl = customChip.querySelector('.chip__label');
        if (labelEl) labelEl.textContent = v;
        setSelected(v);
        sheet.close();
      },
    });
    sheet = mountPickerSheet({ title: 'Choose time', content: tp });
  }

  chips.forEach((c) => chipGroup.appendChild(c));
  chipGroup.appendChild(customChip);
  whenSection.appendChild(chipGroup);
  screen.appendChild(whenSection);

  const whereSection = document.createElement('div');
  whereSection.className = 'section';
  whereSection.innerHTML = `<div class="section-label">WHERE</div>`;
  whereSection.appendChild(createLocationCard('Current location'));
  screen.appendChild(whereSection);

  screen.appendChild(createInviteSection());

  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'cta-wrapper';
  ctaWrapper.appendChild(createCTAButton('Send it', () => {
    setTimeout(() => { window.location.hash = '#/quick-ping/sent'; }, 200);
  }));
  screen.appendChild(ctaWrapper);

  container.appendChild(screen);
}
