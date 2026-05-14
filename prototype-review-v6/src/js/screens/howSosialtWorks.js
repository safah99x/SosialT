/**
 * High-level product explainer — pings, events, circles, open listings, invites.
 * Deeper dive on open vs private plans links to `referencePublicPrivate`.
 */
import { createHeader } from '../components/header.js';
import { goBack } from '../lib/nav.js';

const STEPS = [
  {
    n: '1',
    title: 'Quick pings & events',
    body: 'Float a “who’s in?” or lock a time, place, poll, or flexible window. The thread stays with the plan.',
    tag: 'Plans',
  },
  {
    n: '2',
    title: 'Circles',
    body: 'Small groups you actually use — brunch crew, gym friends, family. Invites start from a circle when you want.',
    tag: 'People',
  },
  {
    n: '3',
    title: 'Around you',
    body: 'Open listings you can browse solo, save, or turn into a private plan with your own crew.',
    tag: 'Discover',
  },
  {
    n: '4',
    title: 'Chat & calendar',
    body: 'Every plan has a thread. Your calendar pulls it together so nothing gets lost in the group chat.',
    tag: 'Stay sorted',
  },
  {
    n: '5',
    title: 'Invites',
    body: 'Friend link, circle link, or event link — each lands in the right context after install.',
    tag: 'Arrive ready',
  },
];

export function renderHowSosialtWorks(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen how-sosialt-works';
  screen.appendChild(createHeader('How SosialT works'));

  const body = document.createElement('div');
  body.className = 'how-sosialt-works__body';
  body.innerHTML = `
    <p class="how-sosialt-works__lede">
      SosialT is for <strong>small-group plans</strong> in real life — fewer tabs, less noise, one place for “are we doing this?”
    </p>
    <ol class="how-sosialt-works__list" aria-label="Overview">
      ${STEPS.map((s) => `
        <li class="how-sosialt-works__step">
          <span class="how-sosialt-works__step-num" aria-hidden="true">${s.n}</span>
          <div class="how-sosialt-works__step-body">
            <span class="how-sosialt-works__step-tag">${s.tag}</span>
            <h2 class="how-sosialt-works__step-title">${s.title}</h2>
            <p class="how-sosialt-works__step-copy">${s.body}</p>
          </div>
        </li>
      `).join('')}
    </ol>
    <div class="how-sosialt-works__more">
      <p class="how-sosialt-works__more-label">Open listings vs your own plans</p>
      <a class="how-sosialt-works__more-link" href="#/reference/public-vs-private">How open events work →</a>
    </div>
    <div class="cta-wrapper how-sosialt-works__cta">
      <button type="button" class="cta-button" id="hsw-done">Back</button>
    </div>
  `;
  screen.appendChild(body);

  body.querySelector('#hsw-done').addEventListener('click', () => goBack('#/'));
  container.appendChild(screen);
}
