/**
 * Top bar — used on the Home screen
 * Shows brand wordmark on the left and three actions on the right
 * (notifications, calendar, avatar).
 */
export function createTopBar({ initials = 'AS', onNotifications, onCalendar, onProfile } = {}) {
  const bar = document.createElement('header');
  bar.className = 'top-bar';
  bar.innerHTML = `
    <span class="top-bar__brand">SosialT</span>
    <div class="top-bar__actions">
      <button class="top-bar__icon" id="top-bar-bell" aria-label="Notifications">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="top-bar__dot"></span>
      </button>
      <button class="top-bar__icon" id="top-bar-calendar" aria-label="Calendar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.8"/>
          <path d="M3 10H21" stroke="currentColor" stroke-width="1.8"/>
          <path d="M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>
      <button class="top-bar__avatar" id="top-bar-avatar" aria-label="Profile">${initials}</button>
    </div>
  `;
  if (onNotifications) bar.querySelector('#top-bar-bell').addEventListener('click', onNotifications);
  if (onCalendar) bar.querySelector('#top-bar-calendar').addEventListener('click', onCalendar);
  if (onProfile) bar.querySelector('#top-bar-avatar').addEventListener('click', onProfile);
  return bar;
}
