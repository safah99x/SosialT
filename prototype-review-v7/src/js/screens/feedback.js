/**
 * REVIEW (Workshop 7) — Settings → Feedback.
 *
 * Lightweight, "always-on" feedback area requested in the latest workshop
 * notes. The intent is to capture passive product signals without
 * interrupting primary flows:
 *
 *   - Category chips (Bug, Idea, Confusion, Other) so we can route signal
 *   - Free-text body, kept short by default
 *   - Optional attachments hint (screenshot/log) — mocked here, real impl
 *     would call into the OS share/picker
 *   - Optional "include device + page context" toggle (privacy-aware)
 *
 * No backend; submit just toasts and returns to profile.
 */
import { createHeader } from '../components/header.js';
import { createCTAButton } from '../components/ctaButton.js';
import { goBack } from '../lib/nav.js';

const CATEGORIES = [
  { id: 'bug',       label: 'Bug',        emoji: '🐞' },
  { id: 'idea',      label: 'Idea',       emoji: '✨' },
  { id: 'confusing', label: 'Confusing',  emoji: '🤔' },
  { id: 'other',     label: 'Other',      emoji: '💬' },
];

export function renderFeedback(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen feedback-screen';
  screen.appendChild(createHeader('Send feedback', () => goBack('#/profile'), '#/profile'));

  const intro = document.createElement('div');
  intro.className = 'feedback-intro';
  intro.innerHTML = `
    <h1 class="feedback-intro__title">What's on your mind?</h1>
    <p class="feedback-intro__sub">A line is enough. We read everything. Your name is attached so we can follow up if needed.</p>
  `;
  screen.appendChild(intro);

  // Category chips
  const cats = document.createElement('div');
  cats.className = 'feedback-cats';
  let selected = 'bug';
  CATEGORIES.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'feedback-cat' + (c.id === selected ? ' feedback-cat--on' : '');
    b.dataset.id = c.id;
    b.innerHTML = `<span class="feedback-cat__emoji">${c.emoji}</span><span>${c.label}</span>`;
    b.addEventListener('click', () => {
      selected = c.id;
      cats.querySelectorAll('.feedback-cat').forEach((x) => x.classList.remove('feedback-cat--on'));
      b.classList.add('feedback-cat--on');
    });
    cats.appendChild(b);
  });
  screen.appendChild(cats);

  // Body
  const body = document.createElement('label');
  body.className = 'feedback-body';
  body.innerHTML = `
    <span class="feedback-body__label">Tell us more</span>
    <textarea class="feedback-body__field" rows="6" placeholder="What happened, what you expected, or just an idea. We'll take anything."></textarea>
    <span class="feedback-body__counter"><span id="fb-count">0</span> / 500</span>
  `;
  screen.appendChild(body);
  const ta = body.querySelector('textarea');
  ta.addEventListener('input', () => {
    body.querySelector('#fb-count').textContent = String(ta.value.length);
  });

  // Attachments hint (mock)
  const attach = document.createElement('div');
  attach.className = 'feedback-attach';
  attach.innerHTML = `
    <button type="button" class="feedback-attach__btn" id="fb-attach">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 12L12 21C9 24 5 20 8 17L17 8C19 6 22 9 20 11L11 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <span>Attach a screenshot</span>
    </button>
    <p class="feedback-attach__hint">Optional. Helps us see what you see.</p>
  `;
  screen.appendChild(attach);

  // Privacy toggle
  const priv = document.createElement('label');
  priv.className = 'feedback-priv';
  priv.innerHTML = `
    <input type="checkbox" id="fb-ctx" checked />
    <span class="feedback-priv__body">
      <span class="feedback-priv__title">Include current screen + device info</span>
      <span class="feedback-priv__sub">Helps debugging. Never shared outside our team. You can turn this off.</span>
    </span>
  `;
  screen.appendChild(priv);

  // CTA
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper';
  const cta = createCTAButton('Send', () => {
    const text = ta.value.trim();
    if (!text) {
      cta.classList.add('cta--shake');
      setTimeout(() => cta.classList.remove('cta--shake'), 320);
      return;
    }
    cta.disabled = true;
    cta.textContent = 'Sent ✓';
    const t = document.createElement('div');
    t.className = 'sosialt-toast';
    t.textContent = "Thanks. We'll read this within a few days.";
    screen.appendChild(t);
    setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
    setTimeout(() => goBack('#/profile'), 1100);
  });
  ctaWrap.appendChild(cta);
  screen.appendChild(ctaWrap);

  // Attach button mocked.
  attach.querySelector('#fb-attach').addEventListener('click', () => {
    const t = document.createElement('div');
    t.className = 'sosialt-toast';
    t.textContent = 'Prototype: would open the OS attachment picker.';
    screen.appendChild(t);
    setTimeout(() => t.classList.add('sosialt-toast--out'), 1500);
    setTimeout(() => t.remove(), 1900);
  });

  container.appendChild(screen);
}
