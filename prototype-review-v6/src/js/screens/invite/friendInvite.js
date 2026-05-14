// REVIEW: "Received a friend invite link" landing screen — an invitee opening
// a deep link is greeted with the inviter's profile and a single tap to accept.
import { goBack } from '../../lib/nav.js';

const FRIENDS = {
  eleanor:  { name: 'Eleanor Whitfield',  initial: 'E', color: '#C49E7A', bio: 'Coffee, books, and long walks.' },
  rupert:   { name: 'Rupert Ashworth',    initial: 'R', color: '#8A7E72', bio: 'Photographer. Always somewhere new.' },
  cecily:   { name: 'Cecily Ashford',     initial: 'C', color: '#E8C547', bio: 'Brunch enthusiast.' },
  rosaline: { name: 'Rosaline Fairfax',   initial: 'R', color: '#6FA786', bio: 'Outdoors, mostly.' },
};

export function renderFriendInvite(container, { id }) {
  const friend = FRIENDS[id] || FRIENDS.eleanor;
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen invite-link';

  screen.innerHTML = `
    <header class="app-header">
      <button class="header-back" id="il-back" aria-label="Back">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="header-title">Friend invite</span>
      <span class="header-spacer"></span>
    </header>

    <div class="invite-link__card">
      <div class="invite-link__avatar" style="background:${friend.color}">${friend.initial}</div>
      <h1 class="invite-link__title">${friend.name}<br/>invited you to SosialT</h1>
      <p class="invite-link__sub">${friend.bio}</p>

      <div class="invite-link__perks">
        <div class="invite-link__perk">
          <span class="invite-link__perk-dot"></span>
          <span>Plan together effortlessly</span>
        </div>
        <div class="invite-link__perk">
          <span class="invite-link__perk-dot"></span>
          <span>Group events without the chaos</span>
        </div>
        <div class="invite-link__perk">
          <span class="invite-link__perk-dot"></span>
          <span>See what friends are up to right now</span>
        </div>
      </div>

      <button class="cta-button invite-link__cta" id="il-accept">Accept invite & continue</button>
      <button class="invite-link__decline" id="il-decline">Not now</button>
    </div>
  `;

  screen.querySelector('#il-back').addEventListener('click', () => goBack('#/'));
  screen.querySelector('#il-accept').addEventListener('click', () => {
    window.location.hash = '#/onboarding/phone';
  });
  screen.querySelector('#il-decline').addEventListener('click', () => {
    window.location.hash = '#/invite/declined?kind=friend';
  });

  container.appendChild(screen);
}
