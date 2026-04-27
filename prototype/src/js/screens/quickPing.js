/**
 * Quick Ping screen.
 * Layout: Header → editorial title → subtitle → input → WHEN → WHERE → INVITE → CTA.
 * Sending the ping navigates to the success confirmation route.
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createChipGroup } from '../components/chip.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';

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

  const subtitle = document.createElement('p');
  subtitle.className = 'editorial-subtitle';
  subtitle.textContent = 'Round up your people. Now-ish.';
  screen.appendChild(subtitle);

  screen.appendChild(createInputField('Coffee at Tim Wendelboe'));

  const whenSection = document.createElement('div');
  whenSection.className = 'section';
  whenSection.innerHTML = `<div class="section-label">WHEN</div>`;
  whenSection.appendChild(createChipGroup(['Now', 'In 30 min', 'Tonight', 'Choose time'], 'Now'));
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
