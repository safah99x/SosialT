/**
 * "Received a circle invite link" landing — mirror of friend invite UX.
 */
import { goBack } from '../../lib/nav.js';

const CIRCLES = {
  'inner-circle': { name: 'Inner Circle', members: 6, blurb: 'Your Sunday plans & family-style hangouts.', tone: '#C49E7A' },
  'brunch-pals': { name: 'Brunch Pals', members: 4, blurb: 'Weekend waffles and slow mornings.', tone: '#E8C547' },
};

export function renderCircleInvite(container, { id }) {
  const circle = CIRCLES[id] || CIRCLES['inner-circle'];
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen invite-link';

  screen.innerHTML = `
    <header class="app-header">
      <button class="header-back" id="ic-back" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="header-title">Circle invite</span>
      <span class="header-spacer"></span>
    </header>

    <div class="invite-link__card">
      <div class="invite-link__avatar invite-link__avatar--circle" style="background:${circle.tone}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="16" cy="13" r="3" stroke="currentColor" stroke-width="1.8"/>
        </svg>
      </div>
      <h1 class="invite-link__title">You've been invited to ${circle.name}</h1>
      <p class="invite-link__sub">${circle.blurb}</p>
      <p class="invite-link__meta-line">${circle.members} people are already in.</p>

      <button class="cta-button invite-link__cta" id="ic-accept">Join circle & continue</button>
      <button class="invite-link__decline" id="ic-decline">Not now</button>
    </div>
  `;

  screen.querySelector('#ic-back').addEventListener('click', () => goBack('#/'));
  screen.querySelector('#ic-accept').addEventListener('click', () => {
    window.location.hash = '#/onboarding/phone';
  });
  screen.querySelector('#ic-decline').addEventListener('click', () => {
    window.location.hash = '#/invite/declined?kind=circle';
  });

  container.appendChild(screen);
}
