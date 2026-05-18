/**
 * Success / confirmation screen.
 * Optional "Save to calendar" after commits when `calendarEventIds` is set.
 */
import { getEvent } from './eventDetail.js';
import { openSaveToCalendarSheet, downloadICSForEvents } from '../lib/calendarExport.js';

export function renderSuccess(container, {
  title,
  subtitle,
  next = '#/',
  ctaLabel = 'Open chat',
  showDualNav = false,
  homeLabel = 'Back to home',
  calendarEventIds = [],
} = {}) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen success-screen';

  const calBtn = calendarEventIds.length
    ? `
      <button type="button" class="success-cal-btn" id="success-save-cal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7M9 15L11 17L15 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span>Save to phone calendar</span>
      </button>
    `
    : '';

  const navHtml = showDualNav
    ? `
      <div class="success-nav-pair">
        <button class="success-nav-btn success-nav-btn--secondary" id="success-home" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11L12 3L21 11V20A1 1 0 0 1 20 21H15V14H9V21H4A1 1 0 0 1 3 20V11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          <span>${homeLabel}</span>
        </button>
        <button class="success-nav-btn success-nav-btn--primary" id="success-chat" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12C21 16.4 16.97 20 12 20C10.4 20 8.9 19.62 7.6 18.96L3 20L4.13 16.06C3.41 14.85 3 13.46 3 12C3 7.6 7.03 4 12 4C16.97 4 21 7.6 21 12Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
          <span>${ctaLabel}</span>
        </button>
      </div>
      ${calBtn}
    `
    : `<button class="cta-button success-cta" id="success-cta" type="button">${ctaLabel}</button>${calBtn}`;

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
      ${navHtml}
    </div>
  `;

  function wireCalendar() {
    const btn = screen.querySelector('#success-save-cal');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const events = calendarEventIds.map((eid) => {
        const e = getEvent(eid);
        return e ? { ...e, id: eid } : null;
      }).filter(Boolean);
      if (!events.length) return;
      openSaveToCalendarSheet({
        onConfirm: () => {
          downloadICSForEvents(events);
          const toast = document.createElement('div');
          toast.className = 'sosialt-toast';
          toast.textContent = 'Calendar file ready';
          screen.appendChild(toast);
          setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
          setTimeout(() => toast.remove(), 2000);
        },
      });
    });
  }

  if (showDualNav) {
    screen.querySelector('#success-home').addEventListener('click', () => {
      window.location.hash = '#/';
    });
    screen.querySelector('#success-chat').addEventListener('click', () => {
      window.location.hash = next;
    });
    wireCalendar();
  } else {
    screen.querySelector('#success-cta').addEventListener('click', () => {
      window.location.hash = next;
    });
    wireCalendar();
    if (!calendarEventIds.length) {
      const startedAt = window.location.hash;
      const t = setTimeout(() => {
        if (window.location.hash === startedAt) window.location.hash = next;
      }, 1800);
      window.addEventListener('hashchange', () => clearTimeout(t), { once: true });
    }
  }

  container.appendChild(screen);
}
