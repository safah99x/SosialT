// Playful “not right now” funnel → cold-start hero so reviewers see the app story first.
import { goBack } from '../../lib/nav.js';

const COPY = {
  friend: {
    title: 'Slow to trust a link? Same.',
    body: 'Peek the app first—then accept, decline, or leave us on read. Zero pressure.',
  },
  circle: {
    title: 'Skipping the circle for now?',
    body: 'Totally fair. Grab SosialT, see how circles work, then decide with context.',
  },
  event: {
    title: 'Can’t commit from a bare invite?',
    body: 'We get it. Download, see the plan in the app, then RSVP for real.',
  },
};

export function renderInviteDeclined(container, { params }) {
  const kind = params.get('kind');
  const safe = COPY[kind] ? kind : 'event';
  const { title, body } = COPY[safe];

  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen invite-decline';

  screen.innerHTML = `
    <header class="app-header">
      <button class="header-back" id="id-back" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="header-title">No worries</span>
      <span class="header-spacer"></span>
    </header>
    <div class="invite-decline__card">
      <h1 class="invite-decline__title">${title}</h1>
      <p class="invite-decline__body">${body}</p>
      <button type="button" class="cta-button invite-decline__cta" id="id-see-app">Show me the app</button>
      <button type="button" class="invite-decline__ghost" id="id-pass">I’m good for now</button>
    </div>
  `;

  screen.querySelector('#id-back').addEventListener('click', () => goBack('#/'));
  screen.querySelector('#id-see-app').addEventListener('click', () => {
    window.location.hash = '#/onboarding/splash';
  });
  screen.querySelector('#id-pass').addEventListener('click', () => {
    window.location.hash = '#/';
  });

  container.appendChild(screen);
}
