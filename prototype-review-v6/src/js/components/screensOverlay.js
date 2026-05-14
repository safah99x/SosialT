// REVIEW: floating "Screens" panel — jump to any route. Use `data-route` on
// buttons (never put raw & in innerHTML for hash links).

const FLOWS = [
  {
    kind: 'start',
    title: 'Start here',
    intro: 'Read the overview first, then open a path (A–D) and tap steps in order.',
    items: [
      { label: 'How SosialT works', route: '#/reference/how-sosialt-works' },
      { label: 'Open listings vs your plans', route: '#/reference/public-vs-private' },
    ],
  },
  {
    kind: 'path',
    title: 'Path A — Cold start',
    intro: 'No invite link: user installs from the store and opens the app for the first time.',
    items: [
      { step: 1, label: 'Splash', route: '#/onboarding/splash' },
      { step: 2, label: 'Welcome', route: '#/onboarding/welcome' },
      { step: 3, label: 'Phone number', route: '#/onboarding/phone' },
      { step: 4, label: 'SMS code', route: '#/onboarding/code' },
      { step: 5, label: 'Your name', route: '#/onboarding/name' },
      { step: 6, label: 'Contacts', route: '#/onboarding/contacts' },
      { step: 7, label: 'Contacts · manual fallback', route: '#/onboarding/contacts?manual=1' },
      { step: 8, label: 'Interests quiz (optional)', route: '#/onboarding/interests' },
      { step: 9, label: 'Home · new user', route: '#/?newuser=1' },
    ],
  },
  {
    kind: 'path',
    title: 'Path B — Friend invite',
    intro: 'Someone on SosialT shared a friend link. Pre-install page → app → signup.',
    items: [
      { step: 1, label: 'Pre-install browser page', route: '#/landing/friend/eleanor' },
      { step: 2, label: 'In-app friend invite', route: '#/invite/friend/eleanor' },
      { step: 3, label: 'Welcome', route: '#/onboarding/welcome' },
      { step: 4, label: 'Phone number', route: '#/onboarding/phone' },
      { step: 5, label: 'SMS code', route: '#/onboarding/code' },
      { step: 6, label: 'Your name', route: '#/onboarding/name' },
      { step: 7, label: 'Home · referred', route: '#/?newuser=1' },
    ],
  },
  {
    kind: 'path',
    title: 'Path C — Circle invite',
    intro: 'Invited to a named circle. Same pattern: browser landing, then in-app accept.',
    items: [
      { step: 1, label: 'Pre-install browser page', route: '#/landing/circle/inner-circle' },
      { step: 2, label: 'In-app circle invite', route: '#/invite/circle/inner-circle' },
      { step: 3, label: 'Welcome', route: '#/onboarding/welcome' },
      { step: 4, label: 'Phone number', route: '#/onboarding/phone' },
      { step: 5, label: 'SMS code', route: '#/onboarding/code' },
      { step: 6, label: 'Your name', route: '#/onboarding/name' },
      { step: 7, label: 'Circles tab', route: '#/circles' },
    ],
  },
  {
    kind: 'path',
    title: 'Path D — Event invite',
    intro: 'Invited to a specific event. Land on invite → accept → event & chat.',
    items: [
      { step: 1, label: 'Pre-install browser page', route: '#/landing/event/jazz-vigeland' },
      { step: 2, label: 'In-app event invite', route: '#/invite/event/jazz-vigeland' },
      { step: 3, label: 'Event detail (after Accept)', route: '#/event/jazz-vigeland' },
      { step: 4, label: 'Event chat', route: '#/event/jazz-vigeland/chat?new=1' },
      { step: 5, label: 'New here · start signup', route: '#/onboarding/splash' },
      { step: 6, label: 'New here · welcome', route: '#/onboarding/welcome' },
    ],
  },
  {
    kind: 'review',
    title: 'Review checklist',
    intro: 'High-signal screens for visual / copy review (any order).',
    items: [
      { label: 'Splash', route: '#/onboarding/splash' },
      { label: 'Name + trust line', route: '#/onboarding/name' },
      { label: 'Contacts permission', route: '#/onboarding/contacts' },
      { label: 'Contacts · manual', route: '#/onboarding/contacts?manual=1' },
      { label: 'Interests quiz', route: '#/onboarding/interests' },
      { label: 'Quiz nudge', route: '#/preferences/quiz-nudge?return=%2F' },
      { label: 'Install landing · friend', route: '#/landing/friend/eleanor' },
      { label: 'Share composer', route: '#/invite/compose' },
      { label: 'Private event + Friends', route: '#/event/coffee-meetup' },
      { label: 'Event chat · compact layout', route: '#/event/jazz-vigeland/chat/draft' },
    ],
  },
  {
    kind: 'extra',
    title: 'More shortcuts',
    intro: 'Core app areas and demos — use after you know the paths above.',
    items: [
      { label: 'Home', route: '#/' },
      { label: 'Home · empty', route: '#/?newuser=1' },
      { label: 'Notifications', route: '#/notifications' },
      { label: 'Profile', route: '#/profile' },
      { label: 'Calendar', route: '#/calendar' },
      { label: 'Chats inbox', route: '#/chats' },
      { label: 'Quick Ping', route: '#/quick-ping' },
      { label: 'Quick Ping → sent', route: '#/quick-ping/sent?next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Create event', route: '#/create-event' },
      { label: 'Create · done (date)', route: '#/create-event/done?mode=date&next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Around you · sunset walk', route: '#/event/sunset-walk' },
      { label: 'Around you · jazz', route: '#/event/jazz-vigeland' },
      { label: 'Bring circle · flow A', route: '#/event/jazz-vigeland/bring?flow=a' },
      { label: 'New chat', route: '#/chats/new' },
      { label: 'Chat thread demo', route: '#/chats/thread/chat-rosaline' },
      { label: 'Manual invite demo', route: '#/invite/someone-new-demo' },
      { label: 'Feedback', route: '#/profile/feedback' },
      { label: 'Home · legacy tiles', route: '#/?newuser=1&legacy=1' },
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
