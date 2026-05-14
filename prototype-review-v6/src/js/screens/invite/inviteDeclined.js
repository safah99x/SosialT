// Soft-landing when the user declines an invite but may still want the app.
import { goBack } from '../../lib/nav.js';
import { setReferral, setSession } from '../../lib/session.js';

const COPY = {
  friend: {
    title: 'All good — you didn’t accept the invite.',
    body: 'That’s your call. You can still use SosialT for your own plans; nothing is shared with the person who sent the link unless you connect later.',
  },
  circle: {
    title: 'Skipping the circle for now.',
    body: 'No stress. Open the app on your own terms, peek at how circles work, and join another time if it feels right.',
  },
  event: {
    title: 'You passed on this event.',
    body: 'Totally fine. Explore SosialT anyway — browse what’s around, or start something new with your own people.',
  },
};

const DEFAULT_LABEL = {
  friend: 'Your friend',
  circle: 'Inner Circle',
  event: 'That event',
};

export function renderInviteDeclined(container, { params }) {
  const kind = params.get('kind');
  const safe = COPY[kind] ? kind : 'event';
  const { title, body } = COPY[safe];
  const label = params.get('label') || DEFAULT_LABEL[safe];

  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen invite-decline';

  screen.innerHTML = `
    <header class="app-header">
      <button class="header-back" id="id-back" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="header-title">Still welcome here</span>
      <span class="header-spacer"></span>
    </header>
    <div class="invite-decline__card">
      <h1 class="invite-decline__title">${title}</h1>
      <p class="invite-decline__body">${body}</p>
      <button type="button" class="cta-button invite-decline__cta" id="id-use-app">Use SosialT on my own</button>
      <button type="button" class="invite-decline__outline" id="id-how">How SosialT works</button>
      <button type="button" class="invite-decline__ghost" id="id-onboarding">Start full signup</button>
    </div>
  `;

  screen.querySelector('#id-back').addEventListener('click', () => goBack('#/'));

  screen.querySelector('#id-use-app').addEventListener('click', () => {
    setReferral({ source: safe, id: null, label });
    setSession({ isNewUser: true });
    window.location.hash = '#/?newuser=1';
  });

  screen.querySelector('#id-how').addEventListener('click', () => {
    window.location.hash = '#/reference/how-sosialt-works';
  });

  screen.querySelector('#id-onboarding').addEventListener('click', () => {
    window.location.hash = '#/onboarding/splash';
  });

  container.appendChild(screen);
}
