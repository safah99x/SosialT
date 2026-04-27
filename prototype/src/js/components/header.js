/**
 * Header component — back arrow + screen title
 */
export function createHeader(title, onBack) {
  const header = document.createElement('header');
  header.className = 'app-header';
  header.innerHTML = `
    <button class="header-back" aria-label="Go back" id="header-back-btn">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <span class="header-title">${title}</span>
    <span class="header-spacer"></span>
  `;

  header.querySelector('.header-back').addEventListener('click', () => {
    if (onBack) { onBack(); return; }
    // Prefer real browser history so forward button stays meaningful.
    if (window.history.length > 1) window.history.back();
    else window.location.hash = '#/';
  });

  return header;
}
