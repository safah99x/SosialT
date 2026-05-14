/**
 * SosialT — App Entry Point (Review build)
 */
import './styles/global.css';
import './styles/components.css';
import './styles/review.css'; // REVIEW: review-only styles (onboarding, invite, overlay, empty home)
import { initRouter, syncRoute } from './js/router.js';
// REVIEW: Font switcher intentionally not mounted in the review build so the
// reviewer sees the locked typography. Re-enable by importing & calling it.
import { mountScreensOverlay } from './js/components/screensOverlay.js'; // REVIEW

// REVIEW: Land on the onboarding splash on first load (no hash). On any
// reload of a deep-linked URL we keep the user where they were.
if (!window.location.hash) {
  window.location.hash = '#/onboarding/splash';
}

const app = document.getElementById('app');
initRouter(app);
mountScreensOverlay({ syncRoute }); // REVIEW

function updateClock() {
  const el = document.getElementById('device-time');
  if (el) {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, '0');
    el.textContent = `${h}:${m}`;
  }
}
updateClock();
setInterval(updateClock, 30000);
