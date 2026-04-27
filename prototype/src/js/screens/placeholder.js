/**
 * Lightweight placeholder screen for routes we haven't fleshed out yet.
 * Keeps the navigation surface honest: every button leads somewhere.
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';

export function renderPlaceholder(container, { tab, title, line, hint }) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  // Reuse top bar for tab pages so the brand is always present
  screen.appendChild(createTopBar({ initials: 'AS' }));

  const empty = document.createElement('div');
  empty.className = 'placeholder';
  empty.innerHTML = `
    <h1 class="placeholder__title">${title}</h1>
    <p  class="placeholder__line">${line}</p>
    <p  class="placeholder__hint">${hint}</p>
    <button class="cta-button placeholder__cta" id="placeholder-back">Back to home</button>
  `;
  screen.appendChild(empty);

  mountBottomNav({ active: tab });
  empty.querySelector('#placeholder-back').addEventListener('click', () => { window.location.hash = '#/'; });

  container.appendChild(screen);
}

export const renderEvents = (c) => renderPlaceholder(c, {
  tab: 'events',
  title: 'Events',
  line: 'All your plans. Past, present, and the maybe-pile.',
  hint: 'This view is coming next. For now, your three closest plans live on the home screen.',
});

export const renderCircles = (c) => renderPlaceholder(c, {
  tab: 'circles',
  title: 'Circles',
  line: 'Small groups. Big difference.',
  hint: 'Coffee Crew, Inner Circle, Late Night Crew. Manage them here.',
});

export const renderNotifications = (c) => renderPlaceholder(c, {
  tab: 'home',
  title: 'Notifications',
  line: "Only the ones that matter. We promise.",
  hint: 'Pings, RSVPs, replies. Quietly.',
});

export const renderProfile = (c) => renderPlaceholder(c, {
  tab: 'home',
  title: 'You',
  line: 'Anders Solberg.',
  hint: 'Settings, circles, calendar sync. Coming soon.',
});
