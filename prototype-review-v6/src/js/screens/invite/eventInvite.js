// REVIEW: "Received an event invite link" landing screen.
import { getEvent } from '../eventDetail.js';
import { goBack } from '../../lib/nav.js';

export function renderEventInvite(container, { id }) {
  const event = getEvent(id) || getEvent('jazz-vigeland');
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen invite-link invite-link--event';

  screen.innerHTML = `
    <header class="app-header">
      <button class="header-back" id="ile-back" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="header-title">Event invite</span>
      <span class="header-spacer"></span>
    </header>

    <div class="invite-link__card invite-link__card--event">
      <div class="invite-link__hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(44,40,37,0.65) 100%), url('${event.image}')">
        <span class="invite-link__tag">${event.tag}</span>
      </div>
      <div class="invite-link__event-body">
        <h1 class="invite-link__title invite-link__title--event">${event.title}</h1>
        <p class="invite-link__sub invite-link__sub--event">${event.group}</p>
        <div class="invite-link__meta">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${event.date}</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${event.time}</span>
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg> ${event.place}</span>
        </div>
        <p class="invite-link__desc">${event.desc}</p>

        <div class="invite-link__actions invite-link__actions--event">
          <button class="invite-link__decline" id="ile-decline">Can't make it</button>
          <button class="cta-button invite-link__cta" id="ile-accept">Accept invitation</button>
        </div>
        <p class="invite-link__signup">New to SosialT? <a href="#/onboarding/splash">Create an account</a> to join in.</p>
      </div>
    </div>
  `;

  screen.querySelector('#ile-back').addEventListener('click', () => goBack('#/'));
  screen.querySelector('#ile-accept').addEventListener('click', () => {
    window.location.hash = `#/event/${id}`;
  });
  screen.querySelector('#ile-decline').addEventListener('click', () => {
    window.location.hash = '#/invite/declined?kind=event';
  });

  container.appendChild(screen);
}
