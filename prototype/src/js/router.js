/**
 * Hash-based SPA router.
 * Supports parametric routes (/event/:id, /event/:id/chat) and query strings
 * after a '?' (e.g. #/event/coffee-meetup/chat?new=1).
 */
import { renderHome } from './screens/home.js';
import { renderQuickPing } from './screens/quickPing.js';
import { renderCreateEvent } from './screens/createEvent.js';
import { renderSuccess } from './screens/success.js';
import { renderEventDetail } from './screens/eventDetail.js';
import { renderEventChat } from './screens/eventChat.js';
import { renderChats } from './screens/chats.js';
import {
  renderEvents,
  renderCircles,
  renderNotifications,
  renderProfile,
} from './screens/placeholder.js';

const staticRoutes = {
  '/':                  (c) => renderHome(c),
  '/quick-ping':        (c) => renderQuickPing(c),
  '/create-event':      (c) => renderCreateEvent(c),
  '/quick-ping/sent':   (c, params) => renderSuccess(c, {
    title: 'Sent',
    subtitle: 'Your people will see it in a sec.',
    next: params.get('next') || '#/',
    ctaLabel: 'Back to home',
  }),
  '/create-event/done': (c, params) => renderSuccess(c, {
    title: params.get('mode') === 'poll' ? 'Poll sent' : "It's on the calendar",
    subtitle: params.get('mode') === 'poll'
      ? 'Friends can vote in the chat.'
      : 'Your circle will see it in a moment.',
    next: params.get('next') || '#/',
    ctaLabel: 'Open chat',
  }),
  '/events':            (c) => renderEvents(c),
  '/circles':           (c) => renderCircles(c),
  '/chats':             (c) => renderChats(c),
  '/notifications':     (c) => renderNotifications(c),
  '/profile':           (c) => renderProfile(c),
};

function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [path, query = ''] = raw.split('?');
  return { path, params: new URLSearchParams(query) };
}

function resolve({ path, params }) {
  if (staticRoutes[path]) return (c) => staticRoutes[path](c, params);

  const chat = path.match(/^\/event\/([\w-]+)\/chat$/);
  if (chat) return (c) => renderEventChat(c, { id: chat[1], params });

  const detail = path.match(/^\/event\/([\w-]+)$/);
  if (detail) return (c) => renderEventDetail(c, { id: detail[1] });

  return (c) => renderHome(c);
}

export function initRouter(container) {
  function navigate() {
    const parsed = parseHash();
    const render = resolve(parsed);
    document
      .querySelectorAll('.bottom-nav, .create-sheet, .invite-sheet, .invite-sheet-backdrop, .circle-modal, .circle-modal-backdrop, .chat-popover')
      .forEach((n) => n.remove());
    render(container);
    container.scrollTop = 0;
  }

  window.addEventListener('hashchange', navigate);
  navigate();
}
