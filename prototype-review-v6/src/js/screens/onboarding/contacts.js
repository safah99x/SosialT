// REVIEW: Contacts permission redesigned to match the Figma exactly.
// Background is a dimmed mock of the "Create event → Who's joining?" page
// (with the Invite friends card, friend circles, and the friend-pick sheet
// peeking from the bottom). The iOS-style permission dialog appears centred
// on top of that. Either choice routes to the home screen.
import { setSession } from '../../lib/session.js';
import { goBack } from '../../lib/nav.js';

export function renderContacts(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen onb-contacts-v2';

  screen.innerHTML = `
    <div class="onb-contacts-bg" aria-hidden="true">
      <header class="onb-contacts-bg__head">
        <button class="onb-contacts-bg__back" aria-label="Back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="onb-contacts-bg__title">Create event</span>
        <span class="onb-contacts-bg__progress"><span class="onb-contacts-bg__progress-fill" style="width:60%"></span></span>
      </header>

      <h2 class="onb-contacts-bg__h">Who's joining?</h2>

      <div class="onb-contacts-bg__invite-card">
        <span class="onb-contacts-bg__invite-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8A7E72" stroke-width="1.8"/><path d="M4 21C4 16.6 7.6 13 12 13C13 13 13.9 13.1 14.7 13.4" stroke="#8A7E72" stroke-width="1.8" stroke-linecap="round"/><path d="M19 16V22M16 19H22" stroke="#8A7E72" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <div class="onb-contacts-bg__invite-body">
          <p class="onb-contacts-bg__invite-title">Invite friends</p>
          <p class="onb-contacts-bg__invite-sub">Invite set of friends and plan with them</p>
        </div>
      </div>

      <p class="onb-contacts-bg__section-label">Friend Circles</p>
      <div class="onb-contacts-bg__circle-row">
        <span class="onb-contacts-bg__circle-av" style="background: linear-gradient(135deg, #C49E7A, #8A7E72);"></span>
        <div class="onb-contacts-bg__circle-body">
          <p class="onb-contacts-bg__circle-name">Party Crew</p>
          <p class="onb-contacts-bg__circle-meta">+4 people</p>
        </div>
      </div>
      <div class="onb-contacts-bg__circle-row">
        <span class="onb-contacts-bg__circle-av" style="background: linear-gradient(135deg, #6FA786, #C49E7A);"></span>
        <div class="onb-contacts-bg__circle-body">
          <p class="onb-contacts-bg__circle-name">College Squared</p>
          <p class="onb-contacts-bg__circle-meta">+4 people</p>
        </div>
      </div>

      <div class="onb-contacts-bg__sheet">
        <span class="onb-contacts-bg__sheet-handle"></span>
        <div class="onb-contacts-bg__sheet-head">
          <span>Select friends to invite</span>
          <span class="onb-contacts-bg__sheet-x">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
          </span>
        </div>
        <div class="onb-contacts-bg__sheet-row">
          <span class="onb-contacts-bg__sheet-tile">
            <span class="onb-contacts-bg__sheet-add">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#8A7E72" stroke-width="1.8"/><path d="M4 21C4 16.6 7.6 13 12 13C13 13 13.9 13.1 14.7 13.4" stroke="#8A7E72" stroke-width="1.8" stroke-linecap="round"/><path d="M19 16V22M16 19H22" stroke="#8A7E72" stroke-width="1.8" stroke-linecap="round"/></svg>
            </span>
            <span class="onb-contacts-bg__sheet-label">Add new friend</span>
          </span>
          <span class="onb-contacts-bg__sheet-tile">
            <span class="onb-contacts-bg__sheet-photo" style="background:#C49E7A"></span>
            <span class="onb-contacts-bg__sheet-label">Eleanor</span>
          </span>
          <span class="onb-contacts-bg__sheet-tile">
            <span class="onb-contacts-bg__sheet-photo" style="background:#8A7E72"></span>
            <span class="onb-contacts-bg__sheet-label">Rupert</span>
          </span>
          <span class="onb-contacts-bg__sheet-tile">
            <span class="onb-contacts-bg__sheet-photo" style="background:#E8C547"></span>
            <span class="onb-contacts-bg__sheet-label">Cecily</span>
          </span>
        </div>
      </div>
    </div>

    <div class="onb-contacts-dim" id="onb-contacts-dim"></div>

    <div class="ios-dialog" role="dialog" aria-modal="true" aria-label="Allow contacts access">
      <h3 class="ios-dialog__title">"SosialT" Would Like to Access Your Contacts</h3>
      <p class="ios-dialog__body">SosialT would like to access your contacts to help you find and invite friends.</p>
      <div class="ios-dialog__actions">
        <button class="ios-dialog__btn" id="ios-deny">Don't Allow</button>
        <button class="ios-dialog__btn ios-dialog__btn--primary" id="ios-allow">Allow</button>
      </div>
    </div>

    <button class="onb-contacts-skip" id="onb-contacts-back" aria-label="Back to name">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;

  screen.querySelector('#ios-deny').addEventListener('click', () => {
    setSession({ contactsAllowed: false });
    window.location.hash = '#/?newuser=1';
  });

  screen.querySelector('#ios-allow').addEventListener('click', () => {
    setSession({ contactsAllowed: true });
    window.location.hash = '#/?newuser=1';
  });

  screen.querySelector('#onb-contacts-back').addEventListener('click', () => {
    goBack('#/onboarding/name');
  });

  container.appendChild(screen);
}
