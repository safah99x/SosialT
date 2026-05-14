/**
 * REVIEW — Multi-step optional interests quiz (5 slices + progress bar).
 *
 * Categories, vibes, rhythm, proximity, avoid — richer signal than the
 * original tile picker. Fully skippable at every step. Skippers may see
 * a full-screen quiz nudge after navigating the prototype for a bit
 * (protoActivity + quiz-nudge route) or Home ?reprompt=1 for QA.
 */
import { createHeader } from '../../components/header.js';
import { createCTAButton } from '../../components/ctaButton.js';
import { getSession, setSession } from '../../lib/session.js';

const STEPS = [
  {
    id: 'categories',
    kicker: '1 of 5 · Pick a few',
    title: 'What kind of plans do you like?',
    sub: 'Pick anything that looks fun. We use this to surface what to show first.',
    multi: true,
    minHint: 'Tap to select · skip any time',
    options: [
      { id: 'food',     label: 'Food & drinks',  emoji: '🍜', desc: 'Dinners, brunches, bars' },
      { id: 'outdoor',  label: 'Outdoors',       emoji: '🏞️', desc: 'Hikes, runs, picnics' },
      { id: 'culture',  label: 'Culture',        emoji: '🎭', desc: 'Concerts, galleries, theatre' },
      { id: 'sports',   label: 'Sports',         emoji: '⚽', desc: 'Pickup games, gym, races' },
      { id: 'creative', label: 'Creative',       emoji: '🎨', desc: 'Workshops, jams, making' },
      { id: 'chill',    label: 'Chill hangouts', emoji: '☕', desc: 'Cafes, walks, board games' },
      { id: 'travel',   label: 'Trips',          emoji: '🚗', desc: 'Day trips & getaways' },
      { id: 'wellness', label: 'Wellness',       emoji: '🧘', desc: 'Yoga, sauna, slow days' },
    ],
  },
  {
    id: 'vibe',
    kicker: '2 of 5 · Pick the closest',
    title: 'How do you usually like to hang?',
    sub: 'Helps us pace your invites: quick coffee energy or full-evening plans.',
    multi: true,
    minHint: 'Multiple selections OK',
    options: [
      { id: 'small-group', label: 'Small group', emoji: '👥', desc: '2 to 4 people, deep convos' },
      { id: 'big-group',   label: 'Big group',   emoji: '🥳', desc: '5+, more energy' },
      { id: 'spontaneous', label: 'Spontaneous', emoji: '⚡', desc: '"Right now-ish" plans' },
      { id: 'planned',     label: 'Planned',     emoji: '🗓️', desc: 'A week in advance' },
      { id: 'evenings',    label: 'Evenings',    emoji: '🌙', desc: 'After-work, late nights' },
      { id: 'daytime',     label: 'Daytime',     emoji: '☀️', desc: 'Mornings, midday' },
    ],
  },
  {
    id: 'frequency',
    kicker: '3 of 5 · One pick',
    title: 'How often do you want to plan stuff?',
    sub: 'We\'ll keep notifications matched to your rhythm.',
    multi: false,
    options: [
      { id: 'weekly',   label: 'A few times a week', emoji: '🚀', desc: 'I\'m the social one' },
      { id: 'weekend',  label: 'Most weekends',      emoji: '🍻', desc: 'Standard mode' },
      { id: 'monthly',  label: 'A couple times a month', emoji: '🌿', desc: 'Low-key life' },
      { id: 'rarely',   label: 'Once in a while',    emoji: '🧊', desc: 'Selective social' },
    ],
  },
  {
    id: 'radius',
    kicker: '4 of 5 · One pick',
    title: 'How far would you happily go?',
    sub: 'We tune "Around you" so it stays realistic.',
    multi: false,
    minHint: '',
    options: [
      { id: 'walking', label: 'Walking distance', emoji: '🚶', desc: 'Neighbourhood plans' },
      { id: 'city', label: 'Across town', emoji: '🚋', desc: '~30 minutes is fine' },
      { id: 'region', label: 'Regional', emoji: '🚌', desc: 'Day-trip energy' },
      { id: 'anywhere', label: 'Pretty far', emoji: '📍', desc: 'If it\'s worth it' },
    ],
  },
  {
    id: 'avoid',
    kicker: '5 of 5 · Optional',
    title: 'Soft passes: anything to dial down?',
    sub: 'We won\'t show these as boldly in your feed.',
    multi: true,
    minHint: 'Select any that sound like “not really me”.',
    options: [
      { id: 'no-clubs', label: 'Late loud clubs', emoji: '🪩', desc: 'Keep nights calmer' },
      { id: 'no-big-crowds', label: 'Huge crowds', emoji: '🧑‍🧑‍🧒', desc: 'Skip stadium-scale' },
      { id: 'no-early', label: 'Early mornings', emoji: '🌅', desc: 'Not a sunrise person' },
      { id: 'no-athletic', label: 'Athletic-heavy', emoji: '🏃', desc: 'Except easy walks' },
      { id: 'no-foodie', label: 'Long tasting menus', emoji: '🍷', desc: 'Prefer quicker bites' },
    ],
  },
];

export function renderInterestsQuiz(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen onb-interests onb-interests--v2';

  screen.appendChild(createHeader('Help us learn about you', null, '#/'));

  const iq = window.location.hash.split('?')[1] || '';
  const iqParams = new URLSearchParams(iq);
  const returnAfter = iqParams.get('returnAfter');

  const session = getSession();
  // answers[stepId] = Set of option ids
  const answers = {};
  STEPS.forEach((s) => { answers[s.id] = new Set(); });
  // Preload existing interests onto the first step so users can edit.
  (session.interests || []).forEach((i) => {
    if (STEPS[0].options.find((o) => o.id === i)) answers.categories.add(i);
  });

  let idx = 0;

  // Progress bar.
  const progressWrap = document.createElement('div');
  progressWrap.className = 'onb-interests__progress';
  progressWrap.innerHTML = `<span class="onb-interests__progress-fill" id="onb-progress-fill"></span>`;
  screen.appendChild(progressWrap);

  // Step container.
  const stepRoot = document.createElement('div');
  stepRoot.className = 'onb-interests__step';
  screen.appendChild(stepRoot);

  // Footer (Continue + Skip).
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper onb-interests__cta-wrap';
  const cta = createCTAButton('Continue', () => advance(false));
  ctaWrap.appendChild(cta);
  const skip = document.createElement('button');
  skip.type = 'button';
  skip.className = 'onb-interests__skip';
  skip.textContent = 'Skip the whole thing';
  skip.addEventListener('click', () => finish(true));
  ctaWrap.appendChild(skip);
  screen.appendChild(ctaWrap);

  paintStep();
  container.appendChild(screen);

  function paintStep() {
    const step = STEPS[idx];
    progressWrap.querySelector('#onb-progress-fill').style.width = `${((idx + 1) / STEPS.length) * 100}%`;
    stepRoot.innerHTML = `
      <p class="onb-interests__kicker">${step.kicker}</p>
      <h1 class="onb-interests__title">${step.title}</h1>
      <p class="onb-interests__sub">${step.sub}</p>
      <div class="onb-interests__grid"></div>
      ${step.minHint ? `<p class="onb-interests__hint">${step.minHint}</p>` : ''}
    `;
    const grid = stepRoot.querySelector('.onb-interests__grid');
    step.options.forEach((opt) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'onb-interests__tile' + (answers[step.id].has(opt.id) ? ' onb-interests__tile--on' : '');
      b.innerHTML = `
        <span class="onb-interests__emoji" aria-hidden="true">${opt.emoji}</span>
        <span class="onb-interests__label">${opt.label}</span>
        <span class="onb-interests__desc">${opt.desc}</span>
        <span class="onb-interests__check" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12L10 17L20 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      `;
      b.addEventListener('click', () => {
        if (step.multi) {
          if (answers[step.id].has(opt.id)) answers[step.id].delete(opt.id);
          else answers[step.id].add(opt.id);
        } else {
          answers[step.id].clear();
          answers[step.id].add(opt.id);
          // For single-select steps, paint all tiles to clear others.
          grid.querySelectorAll('.onb-interests__tile').forEach((t) => t.classList.remove('onb-interests__tile--on'));
        }
        b.classList.toggle('onb-interests__tile--on', answers[step.id].has(opt.id));
        refreshCta();
      });
      grid.appendChild(b);
    });
    refreshCta();
  }

  function refreshCta() {
    const last = idx === STEPS.length - 1;
    const count = answers[STEPS[idx].id].size;
    if (last) {
      cta.textContent = count ? 'Save & continue' : 'Continue without picking';
    } else {
      cta.textContent = count ? `Continue (${count} picked)` : 'Continue';
    }
  }

  function advance() {
    if (idx < STEPS.length - 1) {
      idx += 1;
      paintStep();
      return;
    }
    finish(false);
  }

  function finish(skipped) {
    const allInterests = new Set();
    Object.values(answers).forEach((s) => s.forEach((id) => allInterests.add(id)));
    setSession({
      interests: skipped ? [] : Array.from(allInterests),
      interestsQuizCompleted: !skipped,
      interestsQuizSkipped: skipped,
      interestsQuizSeen: true,
    });
    progressWrap.querySelector('#onb-progress-fill').style.width = '100%';
    window.location.hash = postQuizDestination();
  }

  function postQuizDestination() {
    if (returnAfter) {
      try {
        const decoded = decodeURIComponent(returnAfter);
        return decoded.startsWith('#') ? decoded : `#${decoded}`;
      } catch {
        /* fall through */
      }
    }
    return '#/?newuser=1';
  }
}
