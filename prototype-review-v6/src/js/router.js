/**
 * Hash-based SPA router.
 * Supports parametric routes (/event/:id, /event/:id/chat) and query strings
 * after a '?' (e.g. #/event/coffee-meetup/chat?new=1).
 *
 * REVIEW: extended with onboarding (splash → contacts) and invite-link
 * landing routes. All review-only routes are tagged below.
 */
import { renderHome } from './screens/home.js';
import { renderQuickPing } from './screens/quickPing.js';
import { renderCreateEvent } from './screens/createEvent.js';
import { renderSuccess } from './screens/success.js';
import { renderEventDetail } from './screens/eventDetail.js';
import { renderEventBringCircle } from './screens/eventBringCircle.js';
import { renderEventChat } from './screens/eventChat.js';
import { renderChats } from './screens/chats.js';
import { renderChatNew } from './screens/chatNew.js';
import { renderChatThread } from './screens/chatThread.js';
import { renderEvents } from './screens/events.js';
import { renderCircles } from './screens/circles.js';
import { renderCalendar } from './screens/calendar.js';
import { renderNotifications } from './screens/notifications.js';
import { renderProfile } from './screens/profile.js';
import { renderProfileEdit } from './screens/profileEdit.js';
import { renderNotifSettings } from './screens/notifSettings.js';
// REVIEW (Workshop 7)
import { renderFeedback } from './screens/feedback.js';
import { renderInterestsQuiz } from './screens/onboarding/interests.js';
import { renderPreferencesQuizNudge } from './screens/preferencesQuizNudge.js';
// REVIEW
import { renderSplash } from './screens/onboarding/splash.js';
import { renderWelcome } from './screens/onboarding/welcome.js';
import { renderPhone } from './screens/onboarding/phone.js';
import { renderCode } from './screens/onboarding/code.js';
import { renderName } from './screens/onboarding/name.js';
import { renderContacts } from './screens/onboarding/contacts.js';
import { renderFriendInvite } from './screens/invite/friendInvite.js';
import { renderCircleInvite } from './screens/invite/circleInvite.js';
import { renderEventInvite } from './screens/invite/eventInvite.js';
import { renderInviteDeclined } from './screens/invite/inviteDeclined.js';
import { renderInviteCompose } from './screens/inviteCompose.js';
import { renderReferencePublicPrivate } from './screens/referencePublicPrivate.js';
import { renderInviteSomeoneNewDemo } from './screens/inviteSomeoneNewDemo.js';
import { renderInstallLanding } from './screens/installLanding.js';
import { bumpProtoActivity, maybeAutoQuizNudge } from './lib/protoActivity.js';

const staticRoutes = {
  '/':                  (c) => renderHome(c),
  '/quick-ping':        (c) => renderQuickPing(c),
  '/create-event':      (c, params) => renderCreateEvent(c, { params }),
  '/reference/public-vs-private': (c) => renderReferencePublicPrivate(c),
  '/quick-ping/sent':   (c, params) => renderSuccess(c, {
    title: 'Sent',
    subtitle: 'Your people will see it in a sec.',
    next: params.get('next') ? decodeURIComponent(params.get('next')) : '#/',
    ctaLabel: 'Go to chat',
    showDualNav: true,
    homeLabel: 'Back to home',
    calendarEventIds: params.get('cal') ? params.get('cal').split(',').map((s) => s.trim()) : ['coffee-meetup'],
  }),
  '/create-event/done': (c, params) => {
    const mode = params.get('mode');
    const titleByMode = {
      poll: 'Poll sent',
      flex: 'Floated to the group',
      date: "It's on the calendar",
      private: 'Sent to your circle',
    };
    const subByMode = {
      poll: 'Friends can vote in the chat.',
      flex: 'Friends will chime in with dates.',
      date: 'Your circle will see it in a moment.',
      private: 'Open the thread to tweak time or place.',
    };
    const cal = params.get('cal');
    return renderSuccess(c, {
      title: titleByMode[mode] || titleByMode.date,
      subtitle: subByMode[mode] || subByMode.date,
      next: params.get('next') ? decodeURIComponent(params.get('next')) : '#/',
      ctaLabel: 'Open chat',
      showDualNav: true,
      homeLabel: 'Back to home',
      calendarEventIds: cal ? cal.split(',').map((s) => s.trim()).filter(Boolean) : ['coffee-meetup'],
    });
  },
  '/events':            (c, params) => renderEvents(c, { params }),
  '/circles':           (c) => renderCircles(c),
  '/calendar':          (c) => renderCalendar(c),
  '/chats':             (c) => renderChats(c),
  // REVIEW (Workshop 6): chat-first flow
  '/chats/new':         (c) => renderChatNew(c),
  // REVIEW (Workshop 6): invite-friend-not-on-app composer
  '/invite/compose':    (c) => renderInviteCompose(c),
  // REVIEW: manual invite demo (no calendar / contacts assumption)
  '/invite/someone-new-demo': (c) => renderInviteSomeoneNewDemo(c),
  '/notifications':     (c) => renderNotifications(c),
  '/profile':           (c) => renderProfile(c),
  // REVIEW (Workshop 6): profile editing + notification preferences.
  '/profile/edit':          (c) => renderProfileEdit(c),
  '/profile/notifications': (c) => renderNotifSettings(c),
  // REVIEW (Workshop 7): stable Settings feedback area.
  '/profile/feedback':      (c) => renderFeedback(c),
  '/preferences/quiz-nudge': (c) => renderPreferencesQuizNudge(c),
  '/invite/declined':        (c, params) => renderInviteDeclined(c, { params }),

  // REVIEW: onboarding flow (splash → welcome → …)
  '/onboarding':                 (c, params) => renderSplash(c),
  '/onboarding/splash':          (c, params) => renderSplash(c),
  '/onboarding/welcome':         (c) => renderWelcome(c),
  '/onboarding/phone':           (c) => renderPhone(c),
  '/onboarding/code':            (c) => renderCode(c),
  '/onboarding/name':            (c) => renderName(c),
  '/onboarding/contacts':        (c) => renderContacts(c),
  // REVIEW (Workshop 7): optional lightweight interests quiz, skippable.
  '/onboarding/interests':       (c) => renderInterestsQuiz(c),
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

  // REVIEW (Workshop 6): /event/:id/bring -> Plan-with-my-circle wizard.
  const bring = path.match(/^\/event\/([\w-]+)\/bring$/);
  if (bring) return (c) => renderEventBringCircle(c, { id: bring[1], params });

  // REVIEW (Workshop 6): chat-first stand-alone threads.
  const thread = path.match(/^\/chats\/thread\/([\w-]+)$/);
  if (thread) return (c) => renderChatThread(c, { id: thread[1] });

  const detail = path.match(/^\/event\/([\w-]+)$/);
  if (detail) return (c) => renderEventDetail(c, { id: detail[1] });

  // REVIEW: invite-link landing routes
  const friendInvite = path.match(/^\/invite\/friend\/([\w-]+)$/);
  if (friendInvite) return (c) => renderFriendInvite(c, { id: friendInvite[1] });

  const circleInvite = path.match(/^\/invite\/circle\/([\w-]+)$/);
  if (circleInvite) return (c) => renderCircleInvite(c, { id: circleInvite[1] });

  const eventInvite = path.match(/^\/invite\/event\/([\w-]+)$/);
  if (eventInvite) return (c) => renderEventInvite(c, { id: eventInvite[1] });

  // REVIEW (Workshop 7): pre-install browser landings (open the invite link
  // before installing the app).
  const landing = path.match(/^\/landing\/(friend|circle|event)\/([\w-]+)$/);
  if (landing) return (c) => renderInstallLanding(c, { type: landing[1], id: landing[2], params });

  return (c) => renderHome(c);
}

let appContainer = null;
let routeFrame = null;

function runRoute() {
  if (!appContainer) return;
  const parsed = parseHash();
  bumpProtoActivity(parsed.path);
  if (
    parsed.path !== '/preferences/quiz-nudge'
    && maybeAutoQuizNudge()
  ) {
    return;
  }
  const render = resolve(parsed);
  document
    .querySelectorAll('.bottom-nav, .create-sheet, .invite-sheet, .invite-sheet-backdrop, .circle-modal, .circle-modal-backdrop, .chat-popover, .circle-detail-backdrop, .circle-detail-sheet, .onb-country-sheet, .onb-country-sheet-bd, .system-dialog, .system-dialog-bd')
    .forEach((n) => n.remove());
  const out = render(appContainer);
  Promise.resolve(out).finally(() => {
    appContainer.scrollTop = 0;
  });
}

function scheduleRoute() {
  if (routeFrame != null) cancelAnimationFrame(routeFrame);
  routeFrame = requestAnimationFrame(() => {
    routeFrame = null;
    runRoute();
  });
}

/**
 * REVIEW: force an immediate paint after `location.hash` changes (Screens panel).
 * Cancels any pending hashchange rAF so we never miss a frame vs coalesced routing.
 */
export function syncRoute() {
  if (routeFrame != null) {
    cancelAnimationFrame(routeFrame);
    routeFrame = null;
  }
  runRoute();
}

export function initRouter(container) {
  appContainer = container;

  window.addEventListener('hashchange', scheduleRoute);
  scheduleRoute();
}
