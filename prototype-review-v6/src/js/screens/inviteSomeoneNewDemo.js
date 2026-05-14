/**
 * REVIEW — Alternative “invite someone who isn’t on SosialT” flow for demos.
 * Structured like a simple details form (Uber-style) for stakeholders who want
 * to test without assuming calendar/contacts permission is granted.
 */
import { goBack } from '../lib/nav.js';

function toast(screen, msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  screen.appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1800);
  setTimeout(() => t.remove(), 2200);
}

export function renderInviteSomeoneNewDemo(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen invite-uber-demo';

  const top = document.createElement('header');
  top.className = 'invite-uber-demo__header';
  top.innerHTML = `
    <button type="button" class="invite-uber-demo__back" aria-label="Close" id="invite-uber-x">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
    </button>
    <h1 class="invite-uber-demo__title">Invite someone new</h1>
    <span class="invite-uber-demo__header-spacer" aria-hidden="true"></span>
  `;

  const body = document.createElement('div');
  body.className = 'invite-uber-demo__body';

  const roleState = { role: 'guest' };

  body.innerHTML = `
    <section class="invite-uber-demo__section">
      <h2 class="invite-uber-demo__label">Who should we tell?</h2>
      <div class="invite-uber-demo__field-row">
        <label class="invite-uber-demo__field">
          <span class="invite-uber-demo__field-h">Name</span>
          <input type="text" class="invite-uber-demo__input" placeholder="Full name" autocomplete="name" id="invite-uber-name" />
        </label>
        <button type="button" class="invite-uber-demo__link" id="invite-uber-add-contact">Add contact</button>
      </div>
      <label class="invite-uber-demo__field invite-uber-demo__field--mt">
        <span class="invite-uber-demo__field-h">Email or phone</span>
        <input type="text" class="invite-uber-demo__input" placeholder="So we can send the invite" autocomplete="off" id="invite-uber-reach" />
      </label>
    </section>

    <section class="invite-uber-demo__section">
      <h2 class="invite-uber-demo__label">Invite as</h2>
      <div class="invite-uber-demo__chips" role="group" aria-label="Invite role">
        <button type="button" class="invite-uber-demo__chip invite-uber-demo__chip--on" data-role="guest">Guest</button>
        <button type="button" class="invite-uber-demo__chip" data-role="cohost">Co-host</button>
        <button type="button" class="invite-uber-demo__chip" data-role="maybe">Maybe</button>
      </div>
    </section>

    <section class="invite-uber-demo__section">
      <h2 class="invite-uber-demo__label">Personal note</h2>
      <p class="invite-uber-demo__hint">Optional. Shows up in their message.</p>
      <textarea class="invite-uber-demo__textarea" rows="4" placeholder="We're doing Sunday coffee. Would love you there." id="invite-uber-note"></textarea>
    </section>

    <button type="button" class="invite-uber-demo__cta" id="invite-uber-send">Send invite</button>
    <button type="button" class="invite-uber-demo__secondary" id="invite-uber-use-compose">Open SMS / link composer instead</button>
  `;

  screen.appendChild(top);
  screen.appendChild(body);
  container.appendChild(screen);

  top.querySelector('#invite-uber-x').addEventListener('click', () => goBack('#/'));

  body.querySelector('#invite-uber-add-contact').addEventListener('click', () => {
    toast(screen, 'Opens your contacts once permissions are on. Prototype skips that step.');
  });

  body.querySelectorAll('[data-role]').forEach((btn) => {
    btn.addEventListener('click', () => {
      roleState.role = btn.dataset.role;
      body.querySelectorAll('.invite-uber-demo__chip').forEach((c) =>
        c.classList.toggle('invite-uber-demo__chip--on', c.dataset.role === roleState.role),
      );
    });
  });

  body.querySelector('#invite-uber-send').addEventListener('click', () => {
    const name = body.querySelector('#invite-uber-name').value.trim() || 'your friend';
    toast(screen, `Invite queued for ${name} (${roleState.role})`);
    setTimeout(() => goBack('#/'), 2800);
  });

  body.querySelector('#invite-uber-use-compose').addEventListener('click', () => {
    window.location.hash = '#/invite/compose';
  });
}
