// REVIEW: 4-digit OTP entry, pre-filled with 1 2 3 4 for instant click-through.
import { goBack } from '../../lib/nav.js';
import { setSession, getSession } from '../../lib/session.js';

const PREFILL = '1234';

export function renderCode(container) {
  container.innerHTML = '';
  const session = getSession();
  let otp = (session.otp || PREFILL).slice(0, 4);

  const screen = document.createElement('div');
  screen.className = 'screen onb-screen onb-form';

  screen.innerHTML = `
    <header class="onb-form__head">
      <button class="header-back onb-form__back" id="onb-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="onb-form__progress" aria-hidden="true"><span class="onb-form__progress-fill" style="width:50%"></span></span>
    </header>

    <div class="onb-form__body">
      <h1 class="onb-form__title">Type in the code we<br/>just sent you</h1>
      <p class="onb-form__sub">We sent a 4-digit code to <strong>${session.countryCode || '+47'} ${session.phone || '472 487 5867'}</strong>. Wrong number? <a href="#/onboarding/phone">Edit</a></p>

      <div class="onb-otp" id="onb-otp">
        ${[0,1,2,3].map((i) => `<span class="onb-otp__cell ${otp[i] ? 'onb-otp__cell--filled' : ''}" data-i="${i}">${otp[i] || ''}</span>`).join('')}
      </div>
      <input class="onb-otp__input" id="onb-otp-input" type="tel" inputmode="numeric" maxlength="4" autocomplete="one-time-code" value="${otp}" />

      <button class="onb-form__resend" id="onb-resend">Resend code</button>
    </div>

    <div class="onb-form__cta-wrap">
      <button class="cta-button onb-form__cta" id="onb-next">Next</button>
    </div>

    ${renderKeypad()}
  `;

  const cells = [...screen.querySelectorAll('.onb-otp__cell')];
  const hidden = screen.querySelector('#onb-otp-input');
  const cta = screen.querySelector('#onb-next');

  function paint() {
    cells.forEach((c, i) => {
      c.textContent = otp[i] || '';
      c.classList.toggle('onb-otp__cell--filled', !!otp[i]);
      c.classList.toggle('onb-otp__cell--active', i === otp.length);
    });
    cta.disabled = otp.length < 4;
  }
  paint();

  hidden.addEventListener('input', () => {
    otp = hidden.value.replace(/\D/g, '').slice(0, 4);
    paint();
  });

  screen.querySelector('#onb-otp').addEventListener('click', () => hidden.focus());

  // Keypad
  screen.querySelectorAll('[data-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.key;
      if (k === 'back') {
        otp = otp.slice(0, -1);
      } else if (k === '.') {
        // ignored
      } else if (otp.length < 4) {
        otp = otp + k;
      }
      hidden.value = otp;
      paint();
    });
  });

  screen.querySelector('#onb-back').addEventListener('click', () => goBack('#/onboarding/phone'));

  cta.addEventListener('click', () => {
    if (cta.disabled) return;
    setSession({ otp });
    window.location.hash = '#/onboarding/name';
  });

  screen.querySelector('#onb-resend').addEventListener('click', () => {
    const t = screen.querySelector('#onb-resend');
    t.textContent = 'Code resent ✓';
    setTimeout(() => { t.textContent = 'Resend code'; }, 1800);
  });

  container.appendChild(screen);
}

function renderKeypad() {
  const KEYS = ['1','2','3','4','5','6','7','8','9','.','0','back'];
  return `
    <div class="onb-keypad" aria-hidden="true">
      ${KEYS.map((k) => {
        if (k === 'back') {
          return `<button class="onb-keypad__btn onb-keypad__btn--icon" data-key="back" aria-label="Backspace"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M22 6H10L4 12L10 18H22A1 1 0 0 0 23 17V7A1 1 0 0 0 22 6Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 10L18 14M18 10L14 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>`;
        }
        if (k === '.') return `<button class="onb-keypad__btn onb-keypad__btn--blank" data-key="." aria-hidden="true"></button>`;
        return `<button class="onb-keypad__btn" data-key="${k}">${k}</button>`;
      }).join('')}
    </div>
  `;
}
