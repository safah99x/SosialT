// REVIEW: Name screen — minimal layout + short note before the contacts step.
import { goBack } from '../../lib/nav.js';
import { setSession, getSession } from '../../lib/session.js';

const PREFILL = 'Anders';

export function renderName(container) {
  container.innerHTML = '';
  const session = getSession();
  const screen = document.createElement('div');
  screen.className = 'screen onb-screen onb-form onb-name';

  screen.innerHTML = `
    <header class="onb-form__head onb-form__head--minimal">
      <button class="header-back onb-form__back" id="onb-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </header>

    <div class="onb-form__body onb-name__body">
      <h1 class="onb-form__title onb-name__title">What do your friends call you?</h1>
      <p class="onb-name__contacts-note">Next we’ll ask for contacts—only so you can pick people to invite faster. We don’t sell your list or message anyone unless you tap send.</p>
      <p class="onb-form__sub onb-name__sub">Your name shows up on invites and in chats. You can change it later.</p>

      <input class="onb-input onb-input--standalone onb-name__input" id="onb-name" type="text" placeholder="Your first name" value="${session.name || PREFILL}" autocomplete="given-name" />
    </div>

    <div class="onb-form__cta-wrap onb-name__cta-wrap">
      <button class="cta-button onb-form__cta onb-name__cta" id="onb-next">Let's SocialT!</button>
    </div>
  `;

  const input = screen.querySelector('#onb-name');
  const cta = screen.querySelector('#onb-next');

  function refresh() { cta.disabled = !input.value.trim(); }
  refresh();
  input.addEventListener('input', refresh);

  screen.querySelector('#onb-back').addEventListener('click', () => goBack('#/onboarding/code'));

  cta.addEventListener('click', () => {
    if (cta.disabled) return;
    setSession({ name: input.value.trim(), isNewUser: true });
    window.location.hash = '#/onboarding/contacts';
  });

  // Auto-focus once mounted.
  requestAnimationFrame(() => input.focus());

  container.appendChild(screen);
}
