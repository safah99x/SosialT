/**
 * Picker Sheet.
 * Lightweight overlay (used inside .device-frame) that hosts a custom date or
 * time picker. Replaces native inputs so we never expose system blue / system
 * fonts / system focus styles that don't match the SosialT identity.
 *
 * mountPickerSheet({ title, content, onClose }) -> { close }
 */
export function mountPickerSheet({ title, content, onClose } = {}) {
  const frame = document.querySelector('.device-frame') || document.body;

  const overlay = document.createElement('div');
  overlay.className = 'picker-overlay';
  overlay.innerHTML = `
    <div class="picker-sheet" role="dialog" aria-modal="true" aria-label="${title || 'Picker'}">
      <header class="picker-sheet__head">
        <span class="picker-sheet__title">${title || ''}</span>
        <button type="button" class="picker-sheet__close" aria-label="Close">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
        </button>
      </header>
      <div class="picker-sheet__body"></div>
    </div>
  `;

  if (content) overlay.querySelector('.picker-sheet__body').appendChild(content);
  frame.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('picker-overlay--in'));

  function close() {
    if (!overlay.isConnected) return;
    overlay.classList.remove('picker-overlay--in');
    overlay.classList.add('picker-overlay--out');
    setTimeout(() => {
      overlay.remove();
      onClose && onClose();
    }, 220);
  }

  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  overlay.querySelector('.picker-sheet__close').addEventListener('click', close);
  document.addEventListener('keydown', escListener);
  function escListener(e) {
    if (e.key === 'Escape') {
      close();
      document.removeEventListener('keydown', escListener);
    }
  }

  return { close, element: overlay };
}
