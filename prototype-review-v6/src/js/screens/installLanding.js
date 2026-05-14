/**
 * REVIEW (Workshop 7): the browser landing page shown when a non-user
 * taps an invite link before installing the app. Hash route:
 *
 *   #/landing/friend/:id
 *   #/landing/circle/:id
 *   #/landing/event/:id
 *
 * MVP-flavoured generic landing — App Store + Play Store badges (mock),
 * a "continue in browser" path that drops them into the in-app invite
 * landing, and just enough context to make installing feel worth it.
 */
import { getEvent } from './eventDetail.js';
import { setReferral } from '../lib/session.js';

const CIRCLES = {
  'inner-circle': { name: 'Inner Circle', tone: '#C49E7A' },
  'brunch-pals':  { name: 'Brunch Pals',  tone: '#E8C547' },
};
const FRIENDS = {
  eleanor:  { name: 'Eleanor Whitfield',  color: '#C49E7A' },
  rupert:   { name: 'Rupert Ashworth',    color: '#8A7E72' },
  cecily:   { name: 'Cecily Ashford',     color: '#E8C547' },
  rosaline: { name: 'Rosaline Fairfax',   color: '#6FA786' },
};

function appStoreBadge() {
  return `
    <a class="install-landing__store" id="ll-app-store" href="#" aria-label="Download on the App Store">
      <span class="install-landing__store-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 12.04c-.02-2.3 1.88-3.4 1.97-3.46-1.07-1.57-2.74-1.79-3.34-1.81-1.42-.14-2.78.84-3.5.84-.72 0-1.83-.82-3.02-.8-1.55.02-3 .9-3.8 2.29-1.63 2.83-.42 7 1.17 9.28.78 1.12 1.7 2.37 2.92 2.33 1.18-.05 1.62-.76 3.04-.76 1.42 0 1.82.76 3.06.74 1.27-.02 2.06-1.13 2.83-2.26.9-1.3 1.26-2.57 1.28-2.64-.03-.02-2.46-.94-2.49-3.75z"/><path d="M14.84 5.16c.64-.79 1.07-1.86.96-2.94-.93.04-2.06.63-2.72 1.4-.59.68-1.11 1.78-.97 2.83 1.03.08 2.08-.52 2.73-1.29z"/></svg>
      </span>
      <span class="install-landing__store-text">
        <span>Download on the</span>
        <strong>App Store</strong>
      </span>
    </a>
  `;
}
function playStoreBadge() {
  return `
    <a class="install-landing__store" id="ll-play-store" href="#" aria-label="Get it on Google Play">
      <span class="install-landing__store-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M3.6 2.6c-.3.3-.5.7-.5 1.3v16.2c0 .6.2 1 .5 1.3L13 12 3.6 2.6zm10.6 10.6 2.6 2.6-12 6.8c-.4.2-.8.2-1.1 0l10.5-9.4zm5-1.2-2.6 1.5-2.7-2.7 2.7-2.7 2.6 1.5c1 .6 1 1.8 0 2.4zm-4 .7L4.6 2.4c.4-.1.7-.1 1.1 0l12 6.8-3.5 3.5z"/></svg>
      </span>
      <span class="install-landing__store-text">
        <span>Get it on</span>
        <strong>Google Play</strong>
      </span>
    </a>
  `;
}

export function renderInstallLanding(container, { type, id, params } = {}) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen install-landing';

  const declined = params instanceof URLSearchParams && params.get('declined') === '1';

  let kicker = 'You\'re invited to SosialT';
  let title = 'Plan stuff with the people you actually call.';
    let sub = 'Pick a ping, rally your crew.';
  let avatarHTML = '';
  let inAppRoute = '#/';

  if (type === 'friend') {
    const f = FRIENDS[id] || FRIENDS.eleanor;
    kicker = `${f.name.split(' ')[0]} invited you`;
    title = `Plan with ${f.name.split(' ')[0]} on SosialT.`;
    sub = 'Small-group plans. Less back-and-forth. You\'ll be set up in two minutes.';
    avatarHTML = `<div class="install-landing__avatar" style="background:${f.color}">${f.name[0]}</div>`;
    inAppRoute = `#/invite/friend/${id}`;
  } else if (type === 'circle') {
    const c = CIRCLES[id] || CIRCLES['inner-circle'];
    kicker = `Invite to ${c.name}`;
    title = `Join ${c.name} on SosialT.`;
    sub = 'A small circle of people planning together. Install SosialT to join in.';
    avatarHTML = `<div class="install-landing__avatar install-landing__avatar--circle" style="background:${c.tone}">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.5" stroke="#fff" stroke-width="1.8"/><circle cx="16" cy="13" r="3" stroke="#fff" stroke-width="1.8"/></svg>
    </div>`;
    inAppRoute = `#/invite/circle/${id}`;
  } else if (type === 'event') {
    const ev = getEvent(id) || getEvent('jazz-vigeland');
    kicker = `Event invite · ${ev.tag}`;
    title = ev.title;
    sub = `${ev.date} · ${ev.time} · ${ev.place}`;
    avatarHTML = `<div class="install-landing__event-hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(44,40,37,0.55) 100%), url('${ev.image}')"></div>`;
    inAppRoute = `#/invite/event/${id}`;
  }

  if (declined && type === 'friend') {
    const f = FRIENDS[id] || FRIENDS.eleanor;
    const fn = f.name.split(' ')[0];
    kicker = 'No worries';
    title = 'Peek at SosialT before you commit';
    sub = `${fn}'s invite keeps simmering on the back burner. Grab the app so you can see how tiny-group planning feels (fewer rogue threads, clearer RSVPs), then reply properly once you have had a proper look around.`;
  } else if (declined && type === 'circle') {
    const c = CIRCLES[id] || CIRCLES['inner-circle'];
    kicker = 'Totally fair';
    title = 'Circles click better once you\'re inside';
    sub = `${c.name} is not going anywhere dramatic. Install when you are curious: you will handle invites and RSVPs in one calm place instead of guessing from a naked link.`;
  } else if (declined && type === 'event') {
    const ev = getEvent(id) || getEvent('jazz-vigeland');
    kicker = 'Can\'t swing this one?';
    title = 'Still meet the app - we will cheer quietly';
    sub = `${ev.title} can stay a maybe until you have seen what SosialT actually does. Download first, poke around, then RSVP with context instead of thumb-twiddling over a mystery invite.`;
  }

  const declinedNote = declined
    ? `<p class="install-landing__declined-note">Nothing here is meant to guilt-trip you. We would rather you fall a little in love with the product first, then say yes, maybe, or a graceful no once you are actually oriented.</p>`
    : '';

  // REVIEW (Workshop 8): cut text-heavy bullet list. Lead with the
  // hero, social proof, and the install buttons. Three icon tiles
  // replace prose bullets so the page feels less marketing-page.
  screen.innerHTML = `
    <div class="install-landing__chrome" aria-hidden="true">
      <span class="install-landing__url-dot"></span>
      <span class="install-landing__url-dot"></span>
      <span class="install-landing__url-dot"></span>
      <span class="install-landing__url">sosialt.app/invite/${type || 'app'}/${id || ''}</span>
      <span class="install-landing__lock">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" stroke-width="1.8"/></svg>
      </span>
    </div>

    <div class="install-landing__hero install-landing__hero--v2">
      <div class="install-landing__brand">
        <span class="install-landing__mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
            <rect x="6"  y="6"  width="16" height="16" rx="3.5" fill="#E8C547"/>
            <rect x="26" y="26" width="16" height="16" rx="3.5" fill="#E8C547"/>
          </svg>
        </span>
        <span class="install-landing__wordmark">SosialT</span>
      </div>
      ${avatarHTML ? `<div class="install-landing__avatar-wrap">${avatarHTML}</div>` : ''}
      <span class="install-landing__kicker install-landing__kicker--v2">${kicker}</span>
      <h1 class="install-landing__title">${title}</h1>
      <p class="install-landing__sub">${sub}</p>
      ${declinedNote}
    </div>

    <div class="install-landing__stores install-landing__stores--v2">
      ${appStoreBadge()}
      ${playStoreBadge()}
    </div>

    <div class="install-landing__why install-landing__why--v2">
      <div class="install-landing__tile">
        <span class="install-landing__tile-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3.5" stroke="currentColor" stroke-width="1.8"/><circle cx="17" cy="11" r="2.5" stroke="currentColor" stroke-width="1.8"/><path d="M3 20C3 16.5 5.5 14 9 14C12.5 14 15 16.5 15 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <span class="install-landing__tile-title">Tiny groups</span>
        <span class="install-landing__tile-sub">Few people. Big clarity.</span>
      </div>
      <div class="install-landing__tile">
        <span class="install-landing__tile-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </span>
        <span class="install-landing__tile-title">One chat per plan</span>
        <span class="install-landing__tile-sub">Context stays threaded.</span>
      </div>
      <div class="install-landing__tile">
        <span class="install-landing__tile-icon" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <span class="install-landing__tile-title">Minutes, not vibes</span>
        <span class="install-landing__tile-sub">Install → plan today.</span>
      </div>
    </div>

    <div class="install-landing__proof">
      <div class="install-landing__proof-avatars" aria-hidden="true">
        <span style="background:#C49E7A">E</span>
        <span style="background:#6FA786">L</span>
        <span style="background:#E8C547">M</span>
      </div>
      <p class="install-landing__proof-text">Used by small groups across Oslo, Bergen and beyond.</p>
    </div>

    <button type="button" class="install-landing__continue" id="ll-continue">
      Already have the app? Continue
    </button>

    <p class="install-landing__legal">Short version: be nice, don't spam, your data stays your data.</p>
  `;

  // Store buttons are mock — flash a toast so reviewers see the intent.
  screen.querySelector('#ll-app-store').addEventListener('click', (e) => { e.preventDefault(); toast(screen, 'Mock: would deep-link to the App Store.'); });
  screen.querySelector('#ll-play-store').addEventListener('click', (e) => { e.preventDefault(); toast(screen, 'Mock: would deep-link to Google Play.'); });

  // Continue-in-app drops the visitor onto the matching in-app invite landing.
  screen.querySelector('#ll-continue').addEventListener('click', () => {
    if (type === 'friend') setReferral({ source: 'friend', id, label: FRIENDS[id]?.name?.split(' ')[0] });
    else if (type === 'circle') setReferral({ source: 'circle', id, label: (CIRCLES[id] || {}).name });
    else if (type === 'event')  setReferral({ source: 'event',  id, label: (getEvent(id) || {}).title });
    window.location.hash = inAppRoute;
  });

  container.appendChild(screen);
}

function toast(screen, msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  screen.appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
  setTimeout(() => t.remove(), 2000);
}
