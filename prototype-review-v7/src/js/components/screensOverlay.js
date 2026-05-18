// REVIEW: floating "Screens" panel — jump to any route. Use `data-route` on
// buttons (never put raw & in innerHTML for hash links).

const enc = encodeURIComponent;

const FLOWS = [
  {
    kind: 'start',
    title: 'Reference',
    intro: 'Explainer screens and product vocabulary.',
    items: [
      { label: 'How SosialT works', route: '#/reference/how-sosialt-works' },
      { label: 'Open listings vs your plans', route: '#/reference/public-vs-private' },
    ],
  },
  {
    kind: 'toreview',
    title: 'To review',
    intro: '',
    items: [
      { label: 'Chats · inbox & type filters', route: '#/chats' },
      { label: 'Chat thread · 1:1', route: '#/chats/thread/chat-rosaline' },
      { label: 'Chat thread · Quick Ping', route: '#/chats/thread/qp-tim-wendelboe' },
      { label: 'New chat', route: '#/chats/new' },
      { label: 'In-app event invite', route: '#/invite/event/jazz-vigeland' },
      { label: 'Public event · detail & engage', route: '#/event/jazz-vigeland' },
      { label: 'Bring circle on public listing', route: '#/event/jazz-vigeland/bring?flow=a' },
      { label: 'Event chat · RSVP draft layout', route: '#/event/coffee-meetup/chat/draft' },
      { label: 'Preferences quiz nudge', route: '#/preferences/quiz-nudge?return=%2F' },
      { label: 'Home · quiz reprompt', route: '#/?reprompt=1' },
      { label: 'Pre-install · event landing', route: '#/landing/event/jazz-vigeland' },
      { label: 'Invite composer (SMS / link)', route: '#/invite/compose' },
      { label: 'Invite someone new · demo', route: '#/invite/someone-new-demo' },
      { label: 'Profile hub', route: '#/profile' },
      { label: 'Calendar sync explainer', route: '#/profile/calendar-sync' },
      { label: 'Who can ping you', route: '#/profile/ping-visibility' },
      { label: 'Blocked list', route: '#/profile/blocked' },
      { label: 'Your data', route: '#/profile/your-data' },
    ],
  },
  {
    kind: 'path',
    title: 'Path A — Cold start',
    intro: 'Install from the store, no invite link. Contacts are asked only when you invite (Create event, Chats, Circles).',
    items: [
      { step: 1, label: 'Splash', route: '#/onboarding/splash' },
      { step: 2, label: 'Welcome (→ splash)', route: '#/onboarding/welcome' },
      { step: 3, label: 'Phone number', route: '#/onboarding/phone' },
      { step: 4, label: 'SMS code', route: '#/onboarding/code' },
      { step: 5, label: 'Your name', route: '#/onboarding/name' },
      { step: 6, label: 'Interests quiz', route: '#/onboarding/interests' },
      { step: 7, label: 'Home · new user (cold)', route: '#/?newuser=1&entry=cold' },
      { step: 8, label: 'QA only · legacy contacts (iOS dialog)', route: '#/onboarding/contacts' },
      { step: 9, label: 'QA only · contacts manual', route: '#/onboarding/contacts?manual=1' },
    ],
  },
  {
    kind: 'path',
    title: 'Path B — Friend invite',
    intro: 'Friend link → optional signup → referred home.',
    items: [
      { step: 1, label: 'Pre-install · friend', route: '#/landing/friend/eleanor' },
      { step: 2, label: 'In-app friend invite', route: '#/invite/friend/eleanor' },
      { step: 3, label: 'Decline · still use SosialT', route: `#/invite/declined?kind=friend&label=${enc('Eleanor Whitfield')}` },
      { step: 4, label: 'Phone', route: '#/onboarding/phone' },
      { step: 5, label: 'SMS code', route: '#/onboarding/code' },
      { step: 6, label: 'Your name', route: '#/onboarding/name' },
      { step: 7, label: 'Interests quiz', route: '#/onboarding/interests' },
      { step: 8, label: 'Home · new user (friend context)', route: '#/?newuser=1&entry=friend&label=Eleanor' },
      { step: 9, label: 'QA only · legacy contacts', route: '#/onboarding/contacts' },
    ],
  },
  {
    kind: 'path',
    title: 'Path C — Circle invite',
    intro: 'Circle link → join or decline → app.',
    items: [
      { step: 1, label: 'Pre-install · circle', route: '#/landing/circle/inner-circle' },
      { step: 2, label: 'In-app circle invite', route: '#/invite/circle/inner-circle' },
      { step: 3, label: 'Decline · still use SosialT', route: `#/invite/declined?kind=circle&label=${enc('Inner Circle')}` },
      { step: 4, label: 'Phone', route: '#/onboarding/phone' },
      { step: 5, label: 'SMS code', route: '#/onboarding/code' },
      { step: 6, label: 'Your name', route: '#/onboarding/name' },
      { step: 7, label: 'Interests quiz', route: '#/onboarding/interests' },
      { step: 8, label: 'Home · new user (circle)', route: `#/?newuser=1&entry=circle&label=${enc('Inner Circle')}` },
      { step: 9, label: 'Circles tab', route: '#/circles' },
      { step: 10, label: 'QA only · legacy contacts', route: '#/onboarding/contacts?manual=1' },
    ],
  },
  {
    kind: 'path',
    title: 'Path D — Event invite',
    intro: 'Event link → accept or pass → detail / chat.',
    items: [
      { step: 1, label: 'Pre-install · event', route: '#/landing/event/jazz-vigeland' },
      { step: 2, label: 'In-app event invite', route: '#/invite/event/jazz-vigeland' },
      { step: 3, label: 'Decline · still use SosialT', route: '#/invite/declined?kind=event&label=Jazz%20in%20the%20Vigeland%20Park' },
      { step: 4, label: 'Event detail (accepted)', route: '#/event/jazz-vigeland' },
      { step: 5, label: 'Event chat', route: '#/event/jazz-vigeland/chat?new=1' },
      { step: 6, label: 'Private plan chat', route: '#/event/jazz-vigeland/chat?private=1' },
      { step: 7, label: 'Bring circle · flow A', route: '#/event/jazz-vigeland/bring?flow=a' },
    ],
  },
  {
    kind: 'review',
    title: 'Home · new user (by entry)',
    intro: '',
    items: [
      { label: 'Cold', route: '#/?newuser=1&entry=cold' },
      { label: 'Friend (URL seed)', route: '#/?newuser=1&entry=friend&label=Eleanor' },
      { label: 'Circle (URL seed)', route: '#/?newuser=1&entry=circle&label=Inner%20Circle' },
      { label: 'Event (URL seed)', route: '#/?newuser=1&entry=event&label=Sunday%20brunch' },
      { label: 'Legacy · dual Quick Ping / Create tiles', route: '#/?newuser=1&legacy=1' },
      { label: 'Returning user home', route: '#/' },
    ],
  },
  {
    kind: 'review',
    title: 'Profile & settings',
    intro: '',
    items: [
      { label: 'Profile', route: '#/profile' },
      { label: 'Edit profile', route: '#/profile/edit' },
      { label: 'Notification settings', route: '#/profile/notifications' },
      { label: 'Calendar sync (explainer)', route: '#/profile/calendar-sync' },
      { label: 'Who can ping you', route: '#/profile/ping-visibility' },
      { label: 'Blocked', route: '#/profile/blocked' },
      { label: 'Your data', route: '#/profile/your-data' },
      { label: 'Feedback', route: '#/profile/feedback' },
    ],
  },
  {
    kind: 'extra',
    title: 'Core app & demos',
    intro: '',
    items: [
      { label: 'Notifications inbox', route: '#/notifications' },
      { label: 'Calendar', route: '#/calendar' },
      { label: 'Chats inbox', route: '#/chats' },
      { label: 'New chat', route: '#/chats/new' },
      { label: 'Chat thread (Rosaline)', route: '#/chats/thread/chat-rosaline' },
      { label: 'Quick Ping', route: '#/quick-ping' },
      { label: 'Quick Ping → sent', route: '#/quick-ping/sent?next=' + enc('#/event/coffee-meetup/chat?new=1') },
      { label: 'Create event', route: '#/create-event' },
      { label: 'Create event · done', route: '#/create-event/done?mode=date&next=' + enc('#/event/coffee-meetup/chat?new=1') },
      { label: 'Events hub', route: '#/events' },
      { label: 'Events · saved tab', route: '#/events?tab=saved' },
      { label: 'Invite composer', route: '#/invite/compose' },
      { label: 'Invite someone new · demo', route: '#/invite/someone-new-demo' },
      { label: 'Private circle event', route: '#/event/coffee-meetup' },
      { label: 'Public · sunset walk', route: '#/event/sunset-walk' },
      { label: 'Public · Munch', route: '#/event/munch-after-hours' },
      { label: 'Preferences quiz nudge', route: '#/preferences/quiz-nudge?return=%2F' },
      { label: 'Quiz reprompt via home', route: '#/?reprompt=1' },
      { label: 'Invite declined · event (no label param)', route: '#/invite/declined?kind=event' },
      { label: 'Event chat · RSVP draft layout', route: '#/event/coffee-meetup/chat/draft' },
    ],
  },
];

export function mountScreensOverlay({ syncRoute } = {}) {
  const repaint = typeof syncRoute === 'function' ? syncRoute : () => {};

  document.querySelectorAll('#screens-overlay-root').forEach((n) => n.remove());

  const root = document.createElement('div');
  root.id = 'screens-overlay-root';

  const launcher = document.createElement('button');
  launcher.id = 'screens-launcher';
  launcher.type = 'button';
  launcher.setAttribute('aria-label', 'Open screen map');
  launcher.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>
    <span>Screen map</span>
  `;

  const panel = document.createElement('aside');
  panel.id = 'screens-panel';
  panel.hidden = true;

  const head = document.createElement('header');
  head.className = 'screens-panel__head';
  head.innerHTML = `
    <div class="screens-panel__head-text">
      <h3>Screen map</h3>
    </div>
    <button type="button" class="screens-panel__close" id="screens-close" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
    </button>
  `;

  const body = document.createElement('div');
  body.className = 'screens-panel__body';

  for (const flow of FLOWS) {
    const section = document.createElement('section');
    section.className = 'screens-panel__flow';
    if (flow.kind === 'start') section.classList.add('screens-panel__flow--start');
    if (flow.kind === 'path') section.classList.add('screens-panel__flow--path');
    if (flow.kind === 'review') section.classList.add('screens-panel__flow--review');
    if (flow.kind === 'toreview') section.classList.add('screens-panel__flow--to-review');

    const h4 = document.createElement('h4');
    h4.className = 'screens-panel__flow-title';
    h4.textContent = flow.title;
    section.appendChild(h4);

    if (flow.intro) {
      const intro = document.createElement('p');
      intro.className = 'screens-panel__flow-intro';
      intro.textContent = flow.intro;
      section.appendChild(intro);
    }

    const ul = document.createElement('ul');
    ul.className = 'screens-panel__list';

    for (const it of flow.items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'screens-panel__item';
      const prefix = typeof it.step === 'number' ? `Step ${it.step} · ` : '';
      btn.textContent = `${prefix}${it.label}`;
      btn.setAttribute('data-route', it.route);
      li.appendChild(btn);
      ul.appendChild(li);
    }

    section.appendChild(ul);
    body.appendChild(section);
  }

  const foot = document.createElement('footer');
  foot.className = 'screens-panel__foot';
  foot.innerHTML = `
    <button type="button" class="screens-panel__reset" id="screens-reset-public">Clear public-event session data</button>
    <button type="button" class="screens-panel__reset screens-panel__reset--ghost" id="screens-reset">Jump to splash (reset)</button>
  `;

  panel.append(head, body, foot);

  root.appendChild(launcher);
  root.appendChild(panel);
  document.body.appendChild(root);

  function open() { panel.hidden = false; launcher.classList.add('screens-launcher--hidden'); }
  function close() { panel.hidden = true; launcher.classList.remove('screens-launcher--hidden'); }

  launcher.addEventListener('click', open);
  panel.querySelector('#screens-close').addEventListener('click', close);

  panel.querySelectorAll('.screens-panel__item[data-route]').forEach((b) => {
    b.addEventListener('click', () => {
      const route = b.getAttribute('data-route');
      if (route) {
        const normalized = route.startsWith('#') ? route : `#${route}`;
        window.location.hash = normalized;
        repaint();
      }
      close();
    });
  });

  panel.querySelector('#screens-reset-public').addEventListener('click', () => {
    try {
      const rm = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const k = sessionStorage.key(i);
        if (k && k.startsWith('sosialt_pe_')) rm.push(k);
      }
      rm.forEach((k) => sessionStorage.removeItem(k));
    } catch { /* ignore */ }
    close();
  });

  panel.querySelector('#screens-reset').addEventListener('click', () => {
    window.location.hash = '#/onboarding/splash';
    repaint();
    close();
  });
}
