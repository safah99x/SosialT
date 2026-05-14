/**
 * Navigation helpers.
 *
 * `goBack(fallback)` tries the browser's history-back first so users get
 * the natural "I came from there" experience. If that doesn't change the
 * hash within ~120ms (e.g. the user opened a deep link directly and there
 * is no SPA-internal previous entry, or `history.back()` would have left
 * the prototype), we fall back to a sensible in-app route.
 *
 * The fallback should be the most natural "up" destination from the
 * current screen (e.g. event chat -> event detail; deep settings -> /).
 */
export function goBack(fallback = '#/') {
  const before = window.location.hash;
  let resolved = false;
  const onChange = () => { resolved = true; window.removeEventListener('hashchange', onChange); };
  window.addEventListener('hashchange', onChange, { once: true });
  try {
    window.history.back();
  } catch (_) {
    /* noop; will fall back below */
  }
  setTimeout(() => {
    if (resolved) return;
    window.removeEventListener('hashchange', onChange);
    if (window.location.hash === before) window.location.hash = fallback;
  }, 140);
}
