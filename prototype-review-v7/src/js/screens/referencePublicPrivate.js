/**
 * “How open events work” — Around you vs your plans, with premium hero art.
 */
import { createHeader } from '../components/header.js';
import { goBack } from '../lib/nav.js';

/** Refined “city map” — soft grid, washes, gold hero pin + sage accents */
const VIS_AROUND = `
  <svg class="ref-pp-premium__vis" viewBox="0 0 160 112" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="rpp-a-bg" x1="80" y1="0" x2="80" y2="112" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFCF7"/>
        <stop offset="0.55" stop-color="#F7F2EA"/>
        <stop offset="1" stop-color="#EDE6DB"/>
      </linearGradient>
      <linearGradient id="rpp-a-pin" x1="82" y1="18" x2="82" y2="88" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FCE9A8"/>
        <stop offset="0.45" stop-color="#E8C547"/>
        <stop offset="1" stop-color="#C4A024"/>
      </linearGradient>
      <radialGradient id="rpp-a-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(82 52) rotate(90) scale(38 48)">
        <stop stop-color="#E8C547" stop-opacity="0.35"/>
        <stop offset="1" stop-color="#E8C547" stop-opacity="0"/>
      </radialGradient>
      <filter id="rpp-a-soft" x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#2C2825" flood-opacity="0.09"/>
      </filter>
    </defs>
    <rect width="160" height="112" rx="16" fill="url(#rpp-a-bg)"/>
    <rect width="160" height="112" rx="16" fill="url(#rpp-a-glow)"/>
    <g opacity="0.35" stroke="#B8A994" stroke-width="0.55">
      <path d="M0 32h160M0 56h160M0 80h160M32 0v112M64 0v112M96 0v112M128 0v112"/>
    </g>
    <path d="M12 88c18-8 32-6 44 2s28 8 52-4" stroke="#6FA786" stroke-width="1.2" stroke-linecap="round" opacity="0.22" fill="none"/>
    <ellipse cx="46" cy="74" rx="20" ry="11" fill="#6FA786" opacity="0.1"/>
    <ellipse cx="124" cy="36" rx="16" ry="9" fill="#E8C547" opacity="0.12"/>
    <g filter="url(#rpp-a-soft)">
      <path d="M42 38c0-3.3 2.5-6 5.5-6s5.5 2.7 5.5 6c0 4-5.5 11-5.5 11S42 42 42 38z" fill="#7AAB8C" opacity="0.92"/>
      <circle cx="47.5" cy="37.5" r="2.2" fill="#fff" opacity="0.9"/>
    </g>
    <g filter="url(#rpp-a-soft)">
      <path d="M118 42c0-2.5 1.9-4.5 4.2-4.5s4.2 2 4.2 4.5c0 3.2-4.2 9-4.2 9s-4.2-5.8-4.2-9z" fill="#8FAE9B" opacity="0.88"/>
      <circle cx="122.2" cy="41.5" r="1.7" fill="#fff" opacity="0.88"/>
    </g>
    <g filter="url(#rpp-a-soft)">
      <path d="M82 22c6.6 0 12 5.2 12 11.6 0 8.8-12 24.4-12 24.4S70 42.4 70 33.6C70 27.2 75.4 22 82 22z" fill="url(#rpp-a-pin)"/>
      <circle cx="82" cy="34.5" r="4.5" fill="#fff" opacity="0.95"/>
      <path d="M82 31v7M79 34.5h6" stroke="#8A7340" stroke-width="1.35" stroke-linecap="round" opacity="0.55"/>
    </g>
  </svg>`;

/** Layered private thread — glassy cards, gold accent, depth */
const VIS_PLANS = `
  <svg class="ref-pp-premium__vis" viewBox="0 0 160 112" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="rpp-p-bg" x1="80" y1="0" x2="80" y2="112" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFBFA"/>
        <stop offset="1" stop-color="#F5EDEA"/>
      </linearGradient>
      <linearGradient id="rpp-p-gold" x1="0" y1="0" x2="1" y2="1">
        <stop stop-color="#FCE9A8"/>
        <stop offset="1" stop-color="#E8B73C"/>
      </linearGradient>
      <linearGradient id="rpp-p-card" x1="52" y1="24" x2="124" y2="88" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FFFFFF"/>
        <stop offset="1" stop-color="#FAF7F4"/>
      </linearGradient>
      <filter id="rpp-p-sh1" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#2C2825" flood-opacity="0.07"/>
      </filter>
      <filter id="rpp-p-sh2" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#C49E7A" flood-opacity="0.18"/>
      </filter>
    </defs>
    <rect width="160" height="112" rx="16" fill="url(#rpp-p-bg)"/>
    <ellipse cx="118" cy="78" rx="40" ry="24" fill="#C49E7A" opacity="0.07"/>
    <g filter="url(#rpp-p-sh1)">
      <rect x="22" y="34" width="108" height="64" rx="14" fill="#FFFFFF" stroke="rgba(44,40,37,0.08)" stroke-width="1"/>
      <rect x="34" y="48" width="52" height="7" rx="3.5" fill="rgba(44,40,37,0.06)"/>
      <rect x="34" y="60" width="72" height="6" rx="3" fill="rgba(44,40,37,0.05)"/>
      <rect x="34" y="70" width="40" height="6" rx="3" fill="rgba(44,40,37,0.04)"/>
    </g>
    <g filter="url(#rpp-p-sh2)">
      <rect x="38" y="18" width="100" height="58" rx="13" fill="url(#rpp-p-card)" stroke="url(#rpp-p-gold)" stroke-width="1.2"/>
      <rect x="50" y="32" width="36" height="8" rx="4" fill="rgba(232,197,71,0.35)"/>
      <rect x="50" y="46" width="76" height="6" rx="3" fill="rgba(44,40,37,0.07)"/>
      <rect x="50" y="56" width="56" height="6" rx="3" fill="rgba(44,40,37,0.055)"/>
      <rect x="96" y="28" width="34" height="22" rx="8" fill="rgba(232,197,71,0.2)" stroke="rgba(196,158,122,0.35)" stroke-width="0.9"/>
      <path d="M106 38l4 4 8-8" stroke="#9A7B3A" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <circle cx="56" cy="28" r="5" fill="url(#rpp-p-gold)" opacity="0.9"/>
    <path d="M54 28h4M56 26v4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.9"/>
  </svg>`;

export function renderReferencePublicPrivate(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen ref-public-private ref-pp-premium';
  screen.appendChild(createHeader('How open events work'));

  const body = document.createElement('div');
  body.className = 'ref-pp-premium__body';
  body.innerHTML = `
    <div class="ref-pp-premium__grid">
      <article class="ref-pp-premium__card ref-pp-premium__card--around">
        <span class="ref-pp-premium__pill">Around you</span>
        <div class="ref-pp-premium__art ref-pp-premium__art--premium" aria-hidden="true">${VIS_AROUND}</div>
        <h2 class="ref-pp-premium__h">Open picks</h2>
        <p class="ref-pp-premium__line">Listings anybody can skim. No backstage pass.</p>
      </article>
      <article class="ref-pp-premium__card ref-pp-premium__card--yours">
        <span class="ref-pp-premium__pill ref-pp-premium__pill--yours">Your plans</span>
        <div class="ref-pp-premium__art ref-pp-premium__art--premium" aria-hidden="true">${VIS_PLANS}</div>
        <h2 class="ref-pp-premium__h">Tiny circles</h2>
        <p class="ref-pp-premium__line">Chats stay between the people on the invite.</p>
      </article>
    </div>

    <section class="ref-pp-premium__lane" aria-labelledby="rpp-lane-title">
      <h3 class="ref-pp-premium__lane-title" id="rpp-lane-title">Open event, then pick a lane</h3>
      <ol class="ref-pp-premium__steps">
        <li class="ref-pp-premium__step">
          <span class="ref-pp-premium__step-num" aria-hidden="true">1</span>
          <div class="ref-pp-premium__step-body">
            <strong class="ref-pp-premium__step-h">Browse &amp; open</strong>
            <p class="ref-pp-premium__step-p">Cards are skim-friendly. Details live one tap deeper.</p>
          </div>
        </li>
        <li class="ref-pp-premium__step">
          <span class="ref-pp-premium__step-num" aria-hidden="true">2</span>
          <div class="ref-pp-premium__step-body">
            <strong class="ref-pp-premium__step-h">Three choices</strong>
            <div class="ref-pp-premium__mini-grid">
              <div class="ref-pp-premium__mini">
                <span class="ref-pp-premium__mini-t">Join solo</span>
                <span class="ref-pp-premium__mini-s">On your calendar</span>
              </div>
              <div class="ref-pp-premium__mini">
                <span class="ref-pp-premium__mini-t">Save to calendar</span>
                <span class="ref-pp-premium__mini-s">ICS hand-off</span>
              </div>
              <div class="ref-pp-premium__mini ref-pp-premium__mini--accent">
                <span class="ref-pp-premium__mini-t">Plan with friends</span>
                <span class="ref-pp-premium__mini-s">Private thread keeps context</span>
              </div>
            </div>
          </div>
        </li>
        <li class="ref-pp-premium__step">
          <span class="ref-pp-premium__step-num" aria-hidden="true">3</span>
          <div class="ref-pp-premium__step-body">
            <strong class="ref-pp-premium__step-h">Teach us taste</strong>
            <p class="ref-pp-premium__step-p">From the event page, thumbs tune what we suggest in <strong>Around you</strong>. That signal is about kinds of outings, not your friends.</p>
          </div>
        </li>
      </ol>
    </section>

    <div class="ref-pp-premium__callout">
      <span class="ref-pp-premium__callout-ico" aria-hidden="true">✦</span>
      <div class="ref-pp-premium__callout-text">
        <strong class="ref-pp-premium__callout-h">Why two worlds?</strong>
        <p class="ref-pp-premium__callout-p">Public listings help you steal ideas. Private threads stop the noise spill.</p>
      </div>
    </div>

    <div class="cta-wrapper ref-pp-premium__cta-wrap">
      <button type="button" class="cta-button" id="ref-pp-done">Back to browsing</button>
      <p class="ref-pp-premium__footnote"><a href="#/reference/how-sosialt-works" class="event-detail__ref-link">How SosialT works (overview)</a></p>
    </div>
  `;
  screen.appendChild(body);

  body.querySelector('#ref-pp-done').addEventListener('click', () => goBack('#/'));
  container.appendChild(screen);
}
