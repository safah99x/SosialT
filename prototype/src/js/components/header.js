/**
 * Sticky screen header — back arrow + screen title.
 *
 * Sticks to the top of the scroll container (see `.app-header` styles) so
 * the back affordance stays visible no matter how deep the user is in the
 * flow. The optional `fallback` is the route to use when there's no SPA
 * history entry to pop (deep links, hard reloads).
 */
import { goBack } from '../lib/nav.js';

export function createHeader(title, onBack, fallback = '#/') {
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <button class="header-back" aria-label="Go back" id="header-back-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <span class="header-title">${title}</span>
    <span class="header-spacer"></span>
  `;

  header.querySelector('.header-back').addEventListener('click', () => {
    if (onBack) { onBack(); return; }
    goBack(fallback);
  });

  return header;
}
