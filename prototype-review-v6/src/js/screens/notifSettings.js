/**
 * REVIEW (Workshop 6) — Notification settings, defaults ON.
 *
 * Reachable from Profile -> "Notification settings". The previous build
 * routed the same row to the *inbox*; that was confusing. This screen is
 * the actual preferences page.
 *
 * Every toggle ships ON by default per meeting feedback. Users can turn
 * them off later, but they don't need to opt in to be notified.
 */
import { createHeader } from '../components/header.js';

const SECTIONS = [
  {
    title: 'Activity',
    items: [
      { id: 'invites',   label: 'New invites',         desc: 'Someone invited you to a plan.', on: true },
      { id: 'rsvps',     label: 'RSVPs',                desc: 'Friends accept or decline.',     on: true },
      { id: 'messages',  label: 'New messages',         desc: 'Someone replied in a chat.',     on: true },
    ],
  },
  {
    title: 'Plans nearby',
    items: [
      { id: 'around',    label: 'Around you',           desc: 'New public events in your area.', on: true },
      { id: 'pings',     label: 'Quick Pings',          desc: 'A friend pinged within 3 days.',  on: true },
    ],
  },
  {
    title: 'Reminders',
    items: [
      { id: 'starting',  label: 'Starting soon',        desc: 'A heads-up 30 min before a plan.', on: true },
      { id: 'morning',   label: 'Morning recap',        desc: 'A short look at your day.',        on: true },
    ],
  },
];

export function renderNotifSettings(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen notif-settings';
  screen.appendChild(createHeader('Notifications'));

  const intro = document.createElement('p');
  intro.className = 'notif-settings__intro';
  intro.textContent = "Notifications are on by default \u2014 we'll keep it light. Turn off anything you don't need.";
  screen.appendChild(intro);

  // Master toggle.
  const master = document.createElement('div');
  master.className = 'notif-settings__master';
  master.innerHTML = `
    <div class="notif-settings__master-body">
      <p class="notif-settings__master-title">All notifications</p>
      <p class="notif-settings__master-sub">Master switch. Turning this off pauses everything.</p>
    </div>
    <label class="notif-toggle">
      <input type="checkbox" id="ns-master" checked />
      <span class="notif-toggle__track"><span class="notif-toggle__thumb"></span></span>
    </label>
  `;
  screen.appendChild(master);

  SECTIONS.forEach((sec) => {
    const block = document.createElement('section');
    block.className = 'notif-settings__section';
    block.innerHTML = `<h3 class="notif-settings__section-title">${sec.title}</h3>`;
    sec.items.forEach((it) => {
      const row = document.createElement('label');
      row.className = 'notif-settings__row';
      row.innerHTML = `
        <span class="notif-settings__row-body">
          <span class="notif-settings__row-title">${it.label}</span>
          <span class="notif-settings__row-desc">${it.desc}</span>
        </span>
        <span class="notif-toggle">
          <input type="checkbox" ${it.on ? 'checked' : ''} data-id="${it.id}" />
          <span class="notif-toggle__track"><span class="notif-toggle__thumb"></span></span>
        </span>
      `;
      block.appendChild(row);
    });
    screen.appendChild(block);
  });

  // Master toggle disables/enables all toggles visually.
  const masterCb = screen.querySelector('#ns-master');
  masterCb.addEventListener('change', () => {
    const on = masterCb.checked;
    screen.querySelectorAll('.notif-settings__row input[type="checkbox"]').forEach((cb) => {
      cb.disabled = !on;
      if (!on) cb.checked = false;
      else cb.checked = true;
    });
  });

  container.appendChild(screen);
}
