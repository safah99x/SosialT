/**
 * SosialT — App Entry Point
 */
import './styles/global.css';
import './styles/components.css';
import { initRouter } from './js/router.js';

// Initialize the app
const app = document.getElementById('app');
initRouter(app);

// Update device clock
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
