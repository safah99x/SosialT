// REVIEW: Phone number entry. Country picker + numeric keypad. Pre-filled
// with a Norway number so reviewers can hit "Next" immediately.
import { goBack } from '../../lib/nav.js';
import { setSession, getSession } from '../../lib/session.js';

const COUNTRIES = [
  { code: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '+1',  flag: '🇺🇸', name: 'United States' },
];

const PREFILL = '472 487 5867';

export function renderPhone(container) {
  container.innerHTML = '';

  const session = getSession();
  let countryCode = session.countryCode || '+47';
  let value = session.phone || PREFILL;

  const screen = document.createElement('div');
  screen.className = 'screen onb-screen onb-form';

  screen.innerHTML = `
    <header class="onb-form__head">
      <button class="header-back onb-form__back" id="onb-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="onb-form__progress" aria-hidden="true">
        <span class="onb-form__progress-fill" style="width:25%"></span>
      </span>
    </header>

    <div class="onb-form__body">
      <h1 class="onb-form__title">Continue with your<br/>mobile number</h1>
      <p class="onb-form__sub">We'll send you a one-time code to verify it's you. Standard rates may apply.</p>

      <div class="onb-input-row">
        <button class="onb-country" id="onb-country" aria-label="Choose country">
          <span class="onb-country__code">${countryCode}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <input class="onb-input" id="onb-phone" type="tel" inputmode="numeric" placeholder="412 34 567" value="${value}" autocomplete="tel" />
      </div>

      <p class="onb-form__hint">By continuing you agree to our <a href="#" onclick="event.preventDefault()">Terms</a> and <a href="#" onclick="event.preventDefault()">Privacy Policy</a>.</p>
    </div>

    <div class="onb-form__cta-wrap">
      <button class="cta-button onb-form__cta" id="onb-next">Next</button>
    </div>

    ${renderKeypad()}
  `;

  const phoneInput = screen.querySelector('#onb-phone');
  const cta = screen.querySelector('#onb-next');

  function refreshCta() {
    const stripped = phoneInput.value.replace(/\D/g, '');
    cta.disabled = stripped.length < 6;
  }
  refreshCta();

  // Keypad wiring (the keypad is purely decorative + functional)
  screen.querySelectorAll('[data-key]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.key;
      if (k === 'back') {
        phoneInput.value = phoneInput.value.replace(/.$/, '');
      } else if (k === '.') {
        // ignored for phone
      } else {
        phoneInput.value = phoneInput.value + k;
      }
      refreshCta();
    });
  });

  phoneInput.addEventListener('input', refreshCta);

  // Country picker — simple select sheet
  screen.querySelector('#onb-country').addEventListener('click', () => {
    openCountrySheet((c) => {
      countryCode = c.code;
      screen.querySelector('.onb-country__code').textContent = c.code;
      setSession({ countryCode });
    });
  });

  screen.querySelector('#onb-back').addEventListener('click', () => {
    goBack('#/onboarding/welcome');
  });

  cta.addEventListener('click', () => {
    if (cta.disabled) return;
    setSession({ phone: phoneInput.value, countryCode });
    window.location.hash = '#/onboarding/code';
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
        if (k === '.') {
          return `<button class="onb-keypad__btn onb-keypad__btn--blank" data-key="." aria-hidden="true"></button>`;
        }
        return `<button class="onb-keypad__btn" data-key="${k}">${k}</button>`;
      }).join('')}
    </div>
  `;
}

function openCountrySheet(onPick) {
  document.querySelectorAll('.onb-country-sheet, .onb-country-sheet-bd').forEach((n) => n.remove());
  const frame = document.querySelector('.device-frame');
  const bd = document.createElement('div');
  bd.className = 'onb-country-sheet-bd';
  const sh = document.createElement('div');
  sh.className = 'onb-country-sheet';
  sh.innerHTML = `
    <span class="onb-country-sheet__handle"></span>
    <h3 class="onb-country-sheet__title">Choose country</h3>
    <ul class="onb-country-sheet__list">
      ${COUNTRIES.map((c) => `
        <li><button class="onb-country-sheet__row" data-code="${c.code}">
          <span class="onb-country-sheet__flag">${c.flag}</span>
          <span class="onb-country-sheet__name">${c.name}</span>
          <span class="onb-country-sheet__code">${c.code}</span>
        </button></li>
      `).join('')}
    </ul>
  `;
  frame.appendChild(bd);
  frame.appendChild(sh);
  function close() { sh.remove(); bd.remove(); }
  bd.addEventListener('click', close);
  sh.querySelectorAll('[data-code]').forEach((b) => {
    b.addEventListener('click', () => {
      const c = COUNTRIES.find((x) => x.code === b.dataset.code);
      onPick(c);
      close();
    });
  });
}
