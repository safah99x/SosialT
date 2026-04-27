/**
 * Simple hash-based SPA router.
 * Supports parametric routes for /event/:id.
 */
import { renderHome } from './screens/home.js';
import { renderQuickPing } from './screens/quickPing.js';
import { renderCreateEvent } from './screens/createEvent.js';
import { renderSuccess } from './screens/success.js';
import { renderEventDetail } from './screens/eventDetail.js';
import {
  renderEvents,
  renderCircles,
  renderChats,
  renderNotifications,
  renderProfile,
} from './screens/placeholder.js';

const staticRoutes = {
  '/':                  (c) => renderHome(c),
  '/quick-ping':        (c) => renderQuickPing(c),
  '/create-event':      (c) => renderCreateEvent(c),
  '/quick-ping/sent':   (c) => renderSuccess(c, {
    title: 'Sent',
    subtitle: 'Your people will see it in a sec.',
  }),
  '/create-event/done': (c) => renderSuccess(c, {
    title: "It's on the calendar",
    subtitle: 'Your circle will see it in a moment.',
  }),
  '/events':            (c) => renderEvents(c),
  '/circles':           (c) => renderCircles(c),
  '/chats':             (c) => renderChats(c),
  '/notifications':     (c) => renderNotifications(c),
  '/profile':           (c) => renderProfile(c),
};

function resolve(hash) {
  if (staticRoutes[hash]) return staticRoutes[hash];
  const eventMatch = hash.match(/^\/event\/([\w-]+)$/);
  if (eventMatch) return (c) => renderEventDetail(c, { id: eventMatch[1] });
  return staticRoutes['/'];
}

export function initRouter(container) {
  function navigate() {
    const hash = window.location.hash.replace('#', '') || '/';
    const render = resolve(hash);
    // Remove any persisting overlays / floating nav from the previous screen.
    document.querySelectorAll('.bottom-nav, .create-sheet').forEach((n) => n.remove());
    render(container);
    container.scrollTop = 0;
  }

  window.addEventListener('hashchange', navigate);
  navigate();
}
