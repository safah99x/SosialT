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
    title: '1 · Cold start (downloaded from App Store)',
    items: [
      { label: 'Splash', route: '#/onboarding/splash' },
      { label: 'Welcome', route: '#/onboarding/welcome' },
      { label: 'Phone number', route: '#/onboarding/phone' },
      { label: 'SMS code', route: '#/onboarding/code' },
      { label: 'Your name (with pre-permission)', route: '#/onboarding/name' },
      { label: 'Contacts permission', route: '#/onboarding/contacts' },
      { label: 'Manual fallback (no contacts)', route: '#/onboarding/contacts?manual=1' },
      { label: 'Optional interests quiz', route: '#/onboarding/interests' },
      { label: 'Home (after onboarding)', route: '#/?newuser=1' },
    ],
  },
  {
    title: '2 · Join via friend invitation link',
    items: [
      { label: 'Pre-install browser landing', route: '#/landing/friend/eleanor' },
      { label: 'In-app friend invite landing', route: '#/invite/friend/eleanor' },
      { label: 'Accept → onboarding welcome', route: '#/onboarding/welcome' },
      { label: 'Finish signup → phone…', route: '#/onboarding/phone' },
      { label: 'Empty home · friend referral', route: '#/?newuser=1' },
    ],
  },
  {
    title: '3 · Join via circle invitation link',
    items: [
      { label: 'Pre-install browser landing', route: '#/landing/circle/inner-circle' },
      { label: 'In-app circle invite landing', route: '#/invite/circle/inner-circle' },
      { label: 'Accept → onboarding welcome', route: '#/onboarding/welcome' },
      { label: 'Empty home · circle referral', route: '#/?newuser=1' },
      { label: 'Circles tab (after join)', route: '#/circles' },
    ],
  },
  {
    title: '4 · Join via event invitation link',
    items: [
      { label: 'Pre-install browser landing', route: '#/landing/event/jazz-vigeland' },
      { label: 'In-app event invite landing', route: '#/invite/event/jazz-vigeland' },
      { label: 'Accept → event detail', route: '#/event/jazz-vigeland' },
      { label: 'Event chat thread', route: '#/event/jazz-vigeland/chat?new=1' },
      { label: '(New account) Start here', route: '#/onboarding/welcome' },
    ],
  },
  {
    title: 'Home & nav',
    items: [
      { label: 'Home · returning user', route: '#/' },
      { label: 'Home · new user empty state', route: '#/?newuser=1' },
      { label: 'Notifications', route: '#/notifications' },
      { label: 'Profile', route: '#/profile' },
      { label: 'Calendar', route: '#/calendar' },
      { label: 'Circles', route: '#/circles' },
      { label: 'Chats list', route: '#/chats' },
    ],
  },
  {
    title: 'Quick Ping',
    items: [
      { label: 'Form', route: '#/quick-ping' },
      { label: 'Sent', route: '#/quick-ping/sent?next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Resulting chat', route: '#/event/coffee-meetup/chat?new=1' },
    ],
  },
  {
    title: 'Create event · date / flex / poll',
    items: [
      { label: 'Create event', route: '#/create-event' },
      { label: 'Done (committed date)', route: '#/create-event/done?mode=date&next=' + encodeURIComponent('#/event/coffee-meetup/chat?new=1') },
      { label: 'Done (flex)', route: '#/create-event/done?mode=flex&next=' + encodeURIComponent('#/event/coffee-meetup/chat?flex=1') },
      { label: 'Done (poll)', route: '#/create-event/done?mode=poll&next=' + encodeURIComponent('#/event/coffee-meetup/chat?poll=1') },
      { label: 'Chat after poll', route: '#/event/coffee-meetup/chat?poll=1' },
    ],
  },
  {
    title: 'Around you · public listings',
    items: [
      { label: 'Jazz in Vigeland', route: '#/event/jazz-vigeland' },
      { label: 'Sunday coffee', route: '#/event/sunday-coffee' },
      { label: 'Sunset walk', route: '#/event/sunset-walk' },
      { label: 'Plan with my circle (flow A)', route: '#/event/jazz-vigeland/bring?flow=a' },
      { label: 'Plan with my circle (flow B · who first)', route: '#/event/jazz-vigeland/bring?flow=b' },
      { label: 'Create plan from this public ref', route: '#/create-event?from=jazz-vigeland' },
      { label: 'Stakeholder note · public vs plans', route: '#/reference/public-vs-private' },
    ],
  },
  {
    title: 'Review v3 · new-user layouts',
    items: [
      { label: 'Home · new user (no duplicate row)', route: '#/?newuser=1' },
      { label: 'Home · new user · legacy tiles', route: '#/?newuser=1&legacy=1' },
    ],
  },
  {
    title: 'Invite demos',
    items: [
      { label: 'Manual invite (Uber-style · no calendar)', route: '#/invite/someone-new-demo' },
      { label: 'SMS / link composer', route: '#/invite/compose' },
    ],
  },
  {
    title: 'Chat-first',
    items: [
      { label: 'New chat composer', route: '#/chats/new' },
      { label: 'Stand-alone chat', route: '#/chats/thread/new-chat' },
      { label: 'Quick Ping thread', route: '#/chats/thread/qp-tim-wendelboe' },
      { label: '1:1 friend chat', route: '#/chats/thread/chat-rosaline' },
    ],
  },
  {
    title: 'Invite a friend not on SosialT',
    items: [
      { label: 'SMS invite composer', route: '#/invite/compose' },
      { label: 'Recipient landing (reuse)', route: '#/invite/friend/eleanor' },
    ],
  },
  {
    title: 'Profile · settings',
    items: [
      { label: 'Edit profile', route: '#/profile/edit' },
      { label: 'Notification preferences', route: '#/profile/notifications' },
      { label: 'Send feedback (Workshop 7)', route: '#/profile/feedback' },
    ],
  },
  {
    title: 'New screens to review',
    items: [
      { label: 'Splash', route: '#/onboarding/splash' },
      { label: 'Trust note (warm, not green)', route: '#/onboarding/name' },
      { label: 'Contacts permission (relevant backdrop)', route: '#/onboarding/contacts' },
      { label: 'Manual fallback v2 (sync-recommended)', route: '#/onboarding/contacts?manual=1' },
      { label: 'Multi-step interests quiz', route: '#/onboarding/interests' },
      { label: 'Quiz nudge (full screen)', route: '#/preferences/quiz-nudge?return=%2F' },
      { label: 'How open events work · visual', route: '#/reference/public-vs-private' },
      { label: 'Welcome · friend referral chip', route: '#/onboarding/welcome' },
      { label: 'Pre-install landing (less text)', route: '#/landing/friend/eleanor' },
      { label: 'Share sheet · IG/TikTok/FB + editable', route: '#/invite/compose' },
      { label: 'Event detail · no thumbs RSVP', route: '#/event/coffee-meetup' },
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
      <p class="screens-panel__hint">Share this prototype URL as-is.</p>
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
