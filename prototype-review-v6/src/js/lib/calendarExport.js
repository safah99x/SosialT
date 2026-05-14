/**
 * Export SosialT plans to .ics — shared by Calendar screen, success flows,
 * and post-commit CTAs.
 */

function parseEventDate(dateStr) {
  const months = {
    January: 0, February: 1, March: 2, April: 3, May: 4, June: 5, July: 6,
    August: 7, September: 8, October: 9, November: 10, December: 11,
  };
  const parts = dateStr.replace(/,/g, '').split(/\s+/);
  for (let i = 0; i < parts.length; i++) {
    if (months[parts[i]] !== undefined) {
      return { month: months[parts[i]], day: parseInt(parts[i + 1], 10) };
    }
  }
  return null;
}

export function generateICS(events) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SosialT//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const year = new Date().getFullYear();

  events.forEach((e) => {
    const parsed = parseEventDate(e.date);
    if (!parsed) return;
    const month = String(parsed.month + 1).padStart(2, '0');
    const day = String(parsed.day).padStart(2, '0');
    const timeParts = e.time.split(':');
    const hour = timeParts[0].padStart(2, '0');
    const min = (timeParts[1] || '00').padStart(2, '0');
    const dtStart = `${year}${month}${day}T${hour}${min}00`;
    const endHour = String(Math.min(23, parseInt(hour, 10) + 2)).padStart(2, '0');
    const dtEnd = `${year}${month}${day}T${endHour}${min}00`;

    lines.push(
      'BEGIN:VEVENT',
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${e.title}`,
      `LOCATION:${e.place || ''}`,
      `DESCRIPTION:${(e.desc || '').replace(/\n/g, ' ')}`,
      `UID:${e.id}@sosialt.app`,
      'END:VEVENT',
    );
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICSForEvents(events) {
  if (!events || !events.length) return false;
  const icsContent = generateICS(events);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sosialt-plans.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  return true;
}

/** Mount sheet inside the phone frame when possible */
export function openSaveToCalendarSheet({ onConfirm } = {}) {
  document.querySelectorAll('.cal-save-bd, .cal-save-sheet').forEach((n) => n.remove());
  const frame = document.querySelector('.device-frame') || document.body;

  const bd = document.createElement('div');
  bd.className = 'cal-save-bd';
  const sheet = document.createElement('section');
  sheet.className = 'cal-save-sheet';

  sheet.innerHTML = `
    <span class="cal-save-sheet__handle"></span>
    <span class="cal-save-sheet__icon" aria-hidden="true">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="1.6"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M9 14L11 16L15 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </span>
    <h3 class="cal-save-sheet__title">Save to your phone calendar</h3>
    <p class="cal-save-sheet__sub">We'll add these plans to the calendar app you already use. One-way export: edits there won't sync back.</p>
    <ul class="cal-save-sheet__bullets">
      <li>Apple Calendar &amp; Google Calendar</li>
      <li>Downloads an .ics file (adds like any invite)</li>
    </ul>
    <div class="cal-save-sheet__actions">
      <button class="cal-save-sheet__btn cal-save-sheet__btn--ghost" type="button" id="cal-save-cancel">Not now</button>
      <button class="cal-save-sheet__btn cal-save-sheet__btn--primary" type="button" id="cal-save-confirm">Save to calendar</button>
    </div>
  `;

  frame.appendChild(bd);
  frame.appendChild(sheet);

  function close() {
    sheet.classList.add('cal-save-sheet--leaving');
    bd.classList.add('cal-save-bd--leaving');
    setTimeout(() => { sheet.remove(); bd.remove(); }, 200);
  }

  bd.addEventListener('click', close);
  sheet.querySelector('#cal-save-cancel').addEventListener('click', close);
  sheet.querySelector('#cal-save-confirm').addEventListener('click', () => {
    close();
    if (onConfirm) onConfirm();
  });
}
