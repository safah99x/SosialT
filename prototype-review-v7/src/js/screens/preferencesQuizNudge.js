/**
 * REVIEW (Workshop 9) — Full-screen “you’ve been active” quiz nudge.
 * Shown automatically after prototype activity thresholds, or manually via
 * `?reprompt=1`.
 */
import { createHeader } from '../components/header.js';
import { createCTAButton } from '../components/ctaButton.js';
import { setSession } from '../lib/session.js';

function parseReturn() {
  const q = window.location.hash.split('?')[1] || '';
  const p = new URLSearchParams(q);
  const raw = p.get('return');
  if (!raw) return '#/';
  try {
    const dec = decodeURIComponent(raw);
    return dec.startsWith('#') ? dec : `#${dec}`;
  } catch {
    return '#/';
  }
}

export function renderPreferencesQuizNudge(container) {
  container.innerHTML = '';

  const returnHash = parseReturn();

  const screen = document.createElement('div');
  screen.className = 'screen quiz-nudge';

  screen.appendChild(
    createHeader('Personalise your feed', () => {
      setSession({ interestsRepromptDismissed: true });
      window.location.hash = returnHash;
    }, returnHash),
  );

  const body = document.createElement('div');
  body.className = 'quiz-nudge__inner';
  body.innerHTML = `
    <div class="quiz-nudge__art" aria-hidden="true">
      <div class="quiz-nudge__orb quiz-nudge__orb--a"></div>
      <div class="quiz-nudge__orb quiz-nudge__orb--b"></div>
      <div class="quiz-nudge__tiles">
        <span class="quiz-nudge__tile">🍜</span>
        <span class="quiz-nudge__tile">🎭</span>
        <span class="quiz-nudge__tile">🏞️</span>
      </div>
    </div>
    <div class="quiz-nudge__copy">
      <p class="quiz-nudge__kicker">You’ve been browsing</p>
      <h1 class="quiz-nudge__title">A minute of preferences?</h1>
      <p class="quiz-nudge__sub">
        So we can show <strong>Around you</strong> picks that fit how you hang out,
        instead of guessing. Nothing is posted; you can redo this anytime.
      </p>
      <ul class="quiz-nudge__list">
        <li>~60 seconds · 5 quick taps</li>
        <li>Sharper suggestions for cafes, gigs, outings</li>
        <li>You can skip again. Just know the feed stays generic</li>
      </ul>
    </div>
  `;

  const ctaRow = document.createElement('div');
  ctaRow.className = 'quiz-nudge__cta';
  const cta = createCTAButton('Open the quiz', () => {
    window.location.hash = `#/onboarding/interests?returnAfter=${encodeURIComponent(returnHash.replace(/^#/, ''))}`;
  });
  ctaRow.appendChild(cta);

  const later = document.createElement('button');
  later.type = 'button';
  later.className = 'quiz-nudge__later';
  later.textContent = 'Maybe later';
  later.addEventListener('click', () => {
    setSession({ interestsRepromptDismissed: true });
    window.location.hash = returnHash;
  });

  screen.append(body, ctaRow, later);
  container.appendChild(screen);
}
