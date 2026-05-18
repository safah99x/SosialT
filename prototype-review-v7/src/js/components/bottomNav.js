/**
 * Bottom navigation — floats over the screen.
 * Five slots: Home, Calendar, +, Circles, Chats.
 * The center "+" lifts above the bar and opens a small action sheet.
 */
const ICONS = {
  home: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 3L21 11V20A1 1 0 0 1 20 21H15V14H9V21H4A1 1 0 0 1 3 20V11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  calendar: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  circles: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="13" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 20C3 17 5.5 14.5 9 14.5C10.5 14.5 11.8 14.9 12.8 15.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M11 20C11 18 13.2 16.5 16 16.5C18.8 16.5 21 18 21 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  chats: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 16.4 16.97 20 12 20C10.4 20 8.9 19.62 7.6 18.96L3 20L4.13 16.06C3.41 14.85 3 13.46 3 12C3 7.6 7.03 4 12 4C16.97 4 21 7.6 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
};

/**
 * Mounts the bottom nav into the device frame so it stays
 * pinned regardless of in-screen scrolling. Returns the node.
 */
export function mountBottomNav({ active = 'home' } = {}) {
  // Remove any existing nav
  document.querySelectorAll('.bottom-nav').forEach((n) => n.remove());

  const nav = createBottomNav({ active });
  const frame = document.querySelector('.device-frame');
  if (frame) frame.appendChild(nav);
  return nav;
}

export function createBottomNav({ active = 'home' } = {}) {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <button class="bottom-nav__tab" data-tab="home">
      <span class="bottom-nav__icon">${ICONS.home}</span>
      <span class="bottom-nav__label">Home</span>
    </button>
    <button class="bottom-nav__tab" data-tab="calendar">
      <span class="bottom-nav__icon">${ICONS.calendar}</span>
      <span class="bottom-nav__label">Calendar</span>
    </button>
    <button class="bottom-nav__plus" id="bottom-nav-plus" aria-label="Create">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>
    </button>
    <button class="bottom-nav__tab" data-tab="circles">
      <span class="bottom-nav__icon">${ICONS.circles}</span>
      <span class="bottom-nav__label">Circles</span>
    </button>
    <button class="bottom-nav__tab" data-tab="chats">
      <span class="bottom-nav__icon">${ICONS.chats}</span>
      <span class="bottom-nav__label">Chats</span>
    </button>
  `;

  const TAB_ROUTES = {
    home: '#/',
    calendar: '#/calendar',
    circles: '#/circles',
    chats: '#/chats',
  };

  nav.querySelectorAll('.bottom-nav__tab').forEach((t) => {
    if (t.dataset.tab === active) t.classList.add('bottom-nav__tab--active');
    t.addEventListener('click', () => {
      const route = TAB_ROUTES[t.dataset.tab];
      if (route) window.location.hash = route;
    });
  });

  const plusBtn = nav.querySelector('#bottom-nav-plus');
  plusBtn.addEventListener('click', () => {
    // FAB is yellow by default; grey while the create sheet stays open (pressed /
    // open state vs idle yellow).
    plusBtn.classList.add('bottom-nav__plus--active');
    openCreateSheet({
      onClose: () => plusBtn.classList.remove('bottom-nav__plus--active'),
    });
  });

  return nav;
}

// REVIEW: the action sheet now has three primary options — Quick Ping,
// Create Event, and Start Chat — per the meeting feedback on chat-first
// flows. The third option is wired to the new chat-first route.
function openCreateSheet({ onClose } = {}) {
  const existing = document.getElementById('create-sheet');
  if (existing) {
    existing.remove();
    if (onClose) onClose();
    return;
  }

  const sheet = document.createElement('div');
  sheet.className = 'create-sheet';
  sheet.id = 'create-sheet';
  sheet.innerHTML = `
    <div class="create-sheet__backdrop" id="create-sheet-backdrop"></div>
    <div class="create-sheet__panel">
      <span class="create-sheet__handle"></span>
      <h3 class="create-sheet__title">What's the move?</h3>
      <button class="create-sheet__option" data-go="quick-ping">
        <span class="create-sheet__option-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="create-sheet__option-body">
          <span class="create-sheet__option-title">Quick ping</span>
          <span class="create-sheet__option-desc">Spill it · next few days</span>
        </span>
        <span class="create-sheet__option-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
      <button class="create-sheet__option" data-go="create-event">
        <span class="create-sheet__option-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>
            <path d="M3 10H21" stroke="currentColor" stroke-width="1.8"/>
            <path d="M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </span>
        <span class="create-sheet__option-body">
          <span class="create-sheet__option-title">Create event</span>
          <span class="create-sheet__option-desc">Date, place & details</span>
        </span>
        <span class="create-sheet__option-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
      <button class="create-sheet__option" data-go="chats/new">
        <span class="create-sheet__option-icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M21 12C21 16.4 16.97 20 12 20C10.4 20 8.9 19.62 7.6 18.96L3 20L4.13 16.06C3.41 14.85 3 13.46 3 12C3 7.6 7.03 4 12 4C16.97 4 21 7.6 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
          </svg>
        </span>
        <span class="create-sheet__option-body">
          <span class="create-sheet__option-title">Start Chat</span>
          <span class="create-sheet__option-desc">Just talk first \u2014 turn it into a plan later</span>
        </span>
        <span class="create-sheet__option-arrow">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </span>
      </button>
    </div>
  `;
  document.getElementById('app').appendChild(sheet);

  const close = () => {
    sheet.classList.add('create-sheet--leaving');
    setTimeout(() => {
      sheet.remove();
      if (onClose) onClose();
    }, 200);
  };

  sheet.querySelector('#create-sheet-backdrop').addEventListener('click', close);
  sheet.querySelectorAll('.create-sheet__option').forEach((b) => {
    b.addEventListener('click', () => {
      const go = b.dataset.go;
      close();
      setTimeout(() => { window.location.hash = `#/${go}`; }, 150);
    });
  });
}
