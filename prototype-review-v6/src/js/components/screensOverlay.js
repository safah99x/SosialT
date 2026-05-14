// REVIEW: A small floating "Screens" panel pinned to the device frame.
// Lets the reviewer jump to any flow stop end-to-end without typing routes.
//
// Route buttons must be created with setAttribute('data-route', …): putting
// hashes like #/?newuser=1&legacy=1 inside innerHTML breaks at `&` unless
// escaped, which truncated deep links and left navigation dead.
//
// `syncRoute` is injected from main (avoid importing router here — keeps the
// module graph simple and guarantees navigation runs right after each tap).

const FLOWS = [
  {
    title: '1 · Cold start',
    items: [
      { label: 'Splash', route: '#/onboarding/splash' },
      { label: 'Welcome', route: '#/onboarding/welcome' },
      { label: 'Phone', route: '#/onboarding/phone' },
      { label: 'SMS code', route: '#/onboarding/code' },
      { label: 'Name', route: '#/onboarding/name' },
      { label: 'Contacts', route: '#/onboarding/contacts' },
      { label: 'Contacts · manual', route: '#/onboarding/contacts?manual=1' },
      { label: 'Interests quiz', route: '#/onboarding/interests' },
      { label: 'Home · new user', route: '#/?newuser=1' },
    ],
  },
  {
    title: '2 · Friend invite link',
    items: [
      { label: 'Pre-install landing', route: '#/landing/friend/eleanor' },
      { label: 'In-app friend invite', route: '#/invite/friend/eleanor' },
      { label: 'Welcome', route: '#/onboarding/welcome' },
      { label: 'Phone…', route: '#/onboarding/phone' },
      { label: 'Home · referral', route: '#/?newuser=1' },
    ],
  },
  {
    title: '3 · Circle invite',
    items: [
      { label: 'Pre-install landing', route: '#/landing/circle/inner-circle' },
      { label: 'In-app circle invite', route: '#/invite/circle/inner-circle' },
      { label: 'Welcome', route: '#/onboarding/welcome' },
      { label: 'Home · referral', route: '#/?newuser=1' },
      { label: 'Circles', route: '#/circles' },
    ],
  },
  {
    title: '4 · Event invite',
    items: [
      { label: 'Pre-install landing', route: '#/landing/event/jazz-vigeland' },
      { label: 'In-app event invite', route: '#/invite/event/jazz-vigeland' },
      { label: 'Event detail', route: '#/event/jazz-vigeland' },
      { label: 'Event chat', route: '#/event/jazz-vigeland/chat?new=1' },
      { label: 'New account start', route: '#/onboarding/welcome' },
    ],
  },
  {
    title: 'Nav',
    items: [
      { label: 'Home', route: '#/' },
      { label: 'Home · empty', route: '#/?newuser=1' },
      { label: 'Notifications', route: '#/notifications' },
      { label: 'Profile', route: '#/profile' },
      { label: 'Calendar', route: '#/calendar' },
      { label: 'Circles', route: '#/circles' },
      { label: 'Chats', route: '#/chats' },
    ],
  },
  {
    title: 'Quick Ping',
    items: [
      { label: 'Form', route: '#/quick-ping' },
      { label: 'Sent', route: '#/quick-ping/sent?next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Chat', route: '#/event/coffee-meetup/chat?new=1' },
    ],
  },
  {
    title: 'Create event',
    items: [
      { label: 'Composer', route: '#/create-event' },
      { label: 'Done · date', route: '#/create-event/done?mode=date&next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Done · flex', route: '#/create-event/done?mode=flex&next=' + encodeURIComponent('#/event/coffee-meetup/chat?flex=1') },
      { label: 'Done · poll', route: '#/create-event/done?mode=poll&next=' + encodeURIComponent('#/event/coffee-meetup/chat?poll=1') },
      { label: 'Chat · poll', route: '#/event/coffee-meetup/chat?poll=1' },
    ],
  },
  {
    title: 'Around you',
    items: [
      { label: 'Jazz Vigeland', route: '#/event/jazz-vigeland' },
      { label: 'Sunday coffee', route: '#/event/sunday-coffee' },
      { label: 'Sunset walk', route: '#/event/sunset-walk' },
      { label: 'Bring circle · A', route: '#/event/jazz-vigeland/bring?flow=a' },
      { label: 'Bring circle · B', route: '#/event/jazz-vigeland/bring?flow=b' },
      { label: 'New plan from listing', route: '#/create-event?from=jazz-vigeland' },
      { label: 'Open vs private', route: '#/reference/public-vs-private' },
    ],
  },
  {
    title: 'Review · polish',
    items: [
      { label: 'Splash', route: '#/onboarding/splash' },
      { label: 'Name (trust)', route: '#/onboarding/name' },
      { label: 'Contacts', route: '#/onboarding/contacts' },
      { label: 'Contacts · manual', route: '#/onboarding/contacts?manual=1' },
      { label: 'Interests', route: '#/onboarding/interests' },
      { label: 'Quiz nudge', route: '#/preferences/quiz-nudge?return=%2F' },
      { label: 'How open events work', route: '#/reference/public-vs-private' },
      { label: 'Welcome', route: '#/onboarding/welcome' },
      { label: 'Install landing', route: '#/landing/friend/eleanor' },
      { label: 'Share / compose', route: '#/invite/compose' },
      { label: 'Private event detail', route: '#/event/coffee-meetup' },
      { label: 'Event chat · alt layout', route: '#/event/jazz-vigeland/chat/draft' },
    ],
  },
  {
    title: 'Home variants',
    items: [
      { label: 'New user', route: '#/?newuser=1' },
      { label: 'Legacy tiles', route: '#/?newuser=1&legacy=1' },
    ],
  },
  {
    title: 'Invites',
    items: [
      { label: 'Manual demo', route: '#/invite/someone-new-demo' },
      { label: 'Composer', route: '#/invite/compose' },
    ],
  },
  {
    title: 'Chat-first',
    items: [
      { label: 'New chat', route: '#/chats/new' },
      { label: 'Stand-alone thread', route: '#/chats/thread/new-chat' },
      { label: 'Quick Ping thread', route: '#/chats/thread/qp-tim-wendelboe' },
      { label: '1:1', route: '#/chats/thread/chat-rosaline' },
    ],
  },
  {
    title: 'Profile',
    items: [
      { label: 'Edit', route: '#/profile/edit' },
      { label: 'Notifications', route: '#/profile/notifications' },
      { label: 'Feedback', route: '#/profile/feedback' },
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
  launcher.setAttribute('aria-label', 'Open screens panel');
  launcher.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8"/></svg>
    <span>Screens</span>
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

    const h4 = document.createElement('h4');
    h4.className = 'screens-panel__flow-title';
    h4.textContent = flow.title;

    const ul = document.createElement('ul');
    ul.className = 'screens-panel__list';

    for (const it of flow.items) {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'screens-panel__item';
      btn.textContent = it.label;
      btn.setAttribute('data-route', it.route);
      li.appendChild(btn);
      ul.appendChild(li);
    }

    section.appendChild(h4);
    section.appendChild(ul);
    body.appendChild(section);
  }

  const foot = document.createElement('footer');
  foot.className = 'screens-panel__foot';
  foot.innerHTML = `
    <button type="button" class="screens-panel__reset" id="screens-reset-public">Clear public-event session</button>
    <button type="button" class="screens-panel__reset screens-panel__reset--ghost" id="screens-reset">Reset to splash</button>
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
