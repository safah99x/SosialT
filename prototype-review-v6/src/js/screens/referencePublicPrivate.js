/**
 * “How open events work” — premium two-lane explainer (Around you vs your plans).
 */
import { createHeader } from '../components/header.js';
import { goBack } from '../lib/nav.js';

const VIS_AROUND = `
  <svg class="ref-pp-premium__vis" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="120" height="96" rx="14" fill="#FAF8F3"/>
    <circle cx="60" cy="48" r="28" stroke="#E8C547" stroke-width="1.2" stroke-dasharray="3 5" opacity="0.55"/>
    <circle cx="44" cy="38" r="5" fill="#E8C547" opacity="0.35"/>
    <circle cx="76" cy="34" r="4" fill="#C49E7A" opacity="0.4"/>
    <path d="M60 42v10l5 5" stroke="#2C2825" stroke-width="1.6" stroke-linecap="round" opacity="0.35"/>
    <path d="M53 64c6 5 13 8 20 8 4 0 8-.8 11-2.2" stroke="#6FA786" stroke-width="1.4" stroke-linecap="round" opacity="0.5"/>
    <path d="M60 58l-6 9h12l-6-9z" fill="#E8C547" stroke="#C4A024" stroke-width="1.2" stroke-linejoin="round"/>
    <circle cx="60" cy="54" r="2" fill="#2C2825"/>
  </svg>`;

const VIS_PLANS = `
  <svg class="ref-pp-premium__vis" viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect width="120" height="96" rx="14" fill="#FFFCFA"/>
    <rect x="22" y="24" width="76" height="48" rx="12" stroke="#E8DFD4" stroke-width="1.2" fill="#FFFFFF"/>
    <path d="M38 40h44M38 50h32M38 60h24" stroke="#D9CEC6" stroke-width="2.2" stroke-linecap="round"/>
    <rect x="34" y="18" width="68" height="26" rx="10" fill="#F6F0E6" stroke="#C49E7A" stroke-width="1.3"/>
    <circle cx="48" cy="31" r="5" fill="#E8C547" opacity="0.85"/>
    <path d="M66 28h24M66 34h18" stroke="#BDA892" stroke-width="1.8" stroke-linecap="round" opacity="0.5"/>
    <rect x="86" y="58" width="20" height="16" rx="5" fill="#E8C547" opacity="0.2" stroke="#E8C547" stroke-width="1"/>
    <path d="M93 65l3 3 5-6" stroke="#C4A024" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
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
        <div class="ref-pp-premium__art" aria-hidden="true">${VIS_AROUND}</div>
        <h2 class="ref-pp-premium__h">Open picks</h2>
        <p class="ref-pp-premium__line">Ideas anyone can browse. No secret guest list.</p>
      </article>
      <article class="ref-pp-premium__card ref-pp-premium__card--yours">
        <span class="ref-pp-premium__pill ref-pp-premium__pill--yours">Your plans</span>
        <div class="ref-pp-premium__art" aria-hidden="true">${VIS_PLANS}</div>
        <h2 class="ref-pp-premium__h">Tiny circles</h2>
        <p class="ref-pp-premium__line">Real chats, real RSVPs—only for people actually invited.</p>
      </article>
    </div>
    <div class="cta-wrapper">
      <button type="button" class="cta-button" id="ref-pp-done">Back to browsing</button>
    </div>
  `;
  screen.appendChild(body);

  body.querySelector('#ref-pp-done').addEventListener('click', () => goBack('#/'));
  container.appendChild(screen);
}
