/**
 * Success / confirmation screen.
 * Shows for a brief beat then auto-routes — to home by default, or to the
 * passed `next` route (used by Create Event to drop the host into the new
 * event chat).
 */
export function renderSuccess(container, { title, subtitle, next = '#/', ctaLabel = 'Open chat' } = {}) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen success-screen';

  screen.innerHTML = `
    <div class="success-card">
      <div class="success-check">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M5 12.5L10 17.5L20 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="success-check__halo"></span>
      </div>
      <h1 class="success-title">${title}</h1>
      <p class="success-subtitle">${subtitle}</p>
      <button class="cta-button success-cta" id="success-cta">${ctaLabel}</button>
    </div>
  `;

  screen.querySelector('#success-cta').addEventListener('click', () => {
    window.location.hash = next;
  });

  // Auto-advance after a beat, but only if the user is still on this screen.
  const startedAt = window.location.hash;
  const t = setTimeout(() => {
    if (window.location.hash === startedAt) window.location.hash = next;
  }, 1800);
  window.addEventListener('hashchange', () => clearTimeout(t), { once: true });

  container.appendChild(screen);
}
