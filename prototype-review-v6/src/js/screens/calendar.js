/**
 * Calendar screen — monthly view with color-coded events.
 *
 * REVIEW (Workshop 6): the calendar previously coloured every circle a
 * different hue, which got noisy as the circle list grew. The meeting
 * agreed colours should map to the four *priority bands* that already
 * exist in Circles, so a 15-circle user still sees at most 4 colours.
 *
 *   Priority band    Colour       Meaning
 *   ───────────────  ──────────   ───────────────────────────────────
 *   Family           #E8C547      Closest people
 *   Friends          #C49E7A      Regular crowd
 *   Casual           #7BA0C4      Looser touch plans
 *   Open             #D4849A      Public / discovery events
 *
 * Each circle declares its priority in circles.js. The mapping below is
 * shared between the calendar grid bars and the upcoming list dots.
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';
import { getEvent, getEventList, getRsvpCounts } from './eventDetail.js';
import { rsvpMicroRowHtml } from '../components/rsvpOverview.js';

/**
 * Plan rings — colour + meaning + who (priority bands). Shared visual language.
 */
const PLAN_RINGS = [
  {
    key: 'family',
    color: '#E8C547',
    title: 'Family',
    who: 'Partner, closest friends, family circle',
    hint: 'Shown first on busy days',
  },
  {
    key: 'friends',
    color: '#C49E7A',
    title: 'Friends',
    who: 'Runs, dinners, faces you keep up with',
    hint: 'Your regular crowd',
  },
  {
    key: 'casual',
    color: '#7BA0C4',
    title: 'Casual',
    who: 'College, work, looser orbit',
    hint: 'Wider circle, lighter touch',
  },
  {
    key: 'open',
    color: '#D4849A',
    title: 'Open',
    who: 'Public & neighbourhood',
    hint: 'Around you listings',
  },
];

const PRIORITY_COLOR = {
  family: { color: '#E8C547', label: 'Family', ring: PLAN_RINGS[0] },
  friends: { color: '#C49E7A', label: 'Friends', ring: PLAN_RINGS[1] },
  casual: { color: '#7BA0C4', label: 'Casual', ring: PLAN_RINGS[2] },
  open:   { color: '#D4849A', label: 'Open', ring: PLAN_RINGS[3] },
};

// Group -> priority. Must match circles.js PRIORITY ids.
const GROUP_PRIORITY = {
  'Coffee Crew':      'family',
  'Gym Crew':         'friends',
  'College Squared':  'casual',
  'Open to all':      'open',
};

function getCircleColor(group) {
  const p = GROUP_PRIORITY[group] || 'friends';
  return PRIORITY_COLOR[p] || PRIORITY_COLOR.friends;
}

// Parse event dates into { month (0-based), day } for prototype purposes
function parseEventDate(dateStr) {
  const months = { 'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5, 'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11 };
  // dateStr like "Sun, April 5" or "Tue, April 28"
  const parts = dateStr.replace(/,/g, '').split(/\s+/);
  for (let i = 0; i < parts.length; i++) {
    if (months[parts[i]] !== undefined) {
      return { month: months[parts[i]], day: parseInt(parts[i + 1]) };
    }
  }
  return null;
}

export function renderCalendar(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({
    initials: 'AS',
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/calendar'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  const now = new Date();
  let currentMonth = now.getMonth();
  let currentYear = now.getFullYear();

  const monthToolbar = document.createElement('div');
  monthToolbar.className = 'cal-month-toolbar';

  const monthTitle = document.createElement('h1');
  monthTitle.className = 'cal-month-title cal-month-title--toolbar';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'cal-month-nav__arrow cal-month-nav__arrow--lead';
  prevBtn.id = 'cal-prev';
  prevBtn.setAttribute('aria-label', 'Previous month');
  prevBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'cal-month-nav__arrow';
  nextBtn.id = 'cal-next';
  nextBtn.setAttribute('aria-label', 'Next month');
  nextBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  monthToolbar.append(prevBtn, monthTitle, nextBtn);
  screen.appendChild(monthToolbar);

  const calGrid = document.createElement('div');
  calGrid.className = 'cal-grid';
  screen.appendChild(calGrid);

  // REVIEW (Workshop 6): legend — v3 compact single-line bands (Family / Friends / …)
  // of one-color-per-circle. The note below makes the privacy promise
  // explicit ("only you see this") since priority is private.
  const legend = document.createElement('div');
  legend.className = 'cal-legend cal-legend--compact';
  legend.innerHTML = `
    <span class="cal-legend__title">Band key</span>
    <div class="cal-legend__chips">
      ${PLAN_RINGS.map((r) => `
        <span class="cal-legend__chip"><i style="background:${r.color}"></i>${r.title}</span>
      `).join('')}
    </div>
    <span class="cal-legend__note">Same tags as Circles. Private to you only.</span>
  `;
  screen.appendChild(legend);

  // Upcoming activities
  const upcoming = document.createElement('div');
  upcoming.className = 'cal-upcoming';
  upcoming.innerHTML = `<h2 class="cal-upcoming__title">Your upcoming activities</h2>`;
  const upcomingList = document.createElement('div');
  upcomingList.className = 'cal-upcoming__list';
  upcoming.appendChild(upcomingList);
  screen.appendChild(upcoming);

  // Collect all events with parsed dates
  const allEvents = getEventList().map((e) => ({
    ...e,
    parsed: parseEventDate(e.date),
    circleColor: getCircleColor(e.group),
  })).filter((e) => e.parsed);

  function paintCalendar() {
    const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    monthTitle.textContent = `${MONTHS[currentMonth]} ${currentYear}`;

    // Day headers
    const dayNames = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    let html = `<div class="cal-grid__header">${dayNames.map((d) => `<span class="cal-grid__day-name">${d}</span>`).join('')}</div>`;

    // Calculate first day of month (Monday = 0)
    const firstDay = new Date(currentYear, currentMonth, 1);
    let startDay = firstDay.getDay() - 1; // Convert Sun=0 to Mon=0
    if (startDay < 0) startDay = 6;

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    html += '<div class="cal-grid__body">';

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      html += `<div class="cal-grid__cell cal-grid__cell--muted"><div class="cal-grid__num-row"><span class="cal-grid__num">${daysInPrevMonth - i}</span></div></div>`;
    }

    // Current month days
    const todayDate = now.getDate();
    const isCurrentMonth = currentMonth === now.getMonth() && currentYear === now.getFullYear();

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayDate;
      const dayEvents = allEvents.filter((e) => e.parsed.month === currentMonth && e.parsed.day === d);

      let bars = '';
      if (dayEvents.length > 0) {
        bars = '<div class="cal-grid__bars">';
        dayEvents.slice(0, 3).forEach((e) => {
          bars += `<span class="cal-grid__bar" style="background:${e.circleColor.color}"></span>`;
        });
        bars += '</div>';
      }

      html += `
        <div class="cal-grid__cell${isToday ? ' cal-grid__cell--today' : ''}" data-day="${d}">
          <div class="cal-grid__num-row">
            <span class="cal-grid__num${isToday ? ' cal-grid__num--today' : ''}">${d}</span>
          </div>
          ${bars}
        </div>
      `;
    }

    // Next month filler
    const totalCells = startDay + daysInMonth;
    const remainder = totalCells % 7;
    if (remainder > 0) {
      for (let i = 1; i <= 7 - remainder; i++) {
        html += `<div class="cal-grid__cell cal-grid__cell--muted"><div class="cal-grid__num-row"><span class="cal-grid__num">${i}</span></div></div>`;
      }
    }

    html += '</div>';
    calGrid.innerHTML = html;

    // Wire cell clicks
    calGrid.querySelectorAll('.cal-grid__cell[data-day]').forEach((cell) => {
      cell.addEventListener('click', () => {
        calGrid.querySelectorAll('.cal-grid__cell--selected').forEach((c) => c.classList.remove('cal-grid__cell--selected'));
        cell.classList.add('cal-grid__cell--selected');
      });
    });

    // Paint upcoming list
    const monthEvents = allEvents
      .filter((e) => e.parsed.month === currentMonth)
      .sort((a, b) => a.parsed.day - b.parsed.day);

    upcomingList.innerHTML = monthEvents.length === 0
      ? '<p class="cal-upcoming__empty">Nothing planned this month yet.</p>'
      : monthEvents.map((e) => {
        const rc = getRsvpCounts(e.id);
        return `
        <button class="cal-upcoming__row" data-event="${e.id}">
          <span class="cal-upcoming__color" style="background:${e.circleColor.color}"></span>
          <span class="cal-upcoming__info">
            <span class="cal-upcoming__name">${e.title}</span>
            <span class="cal-upcoming__ring-label" style="color:${e.circleColor.ring.color}">${e.circleColor.ring.title}</span>
            <span class="cal-upcoming__meta cal-upcoming__meta--with-rsvp">
              <span>${e.date} · ${e.time} · ${e.group}</span>
              ${rsvpMicroRowHtml(rc)}
            </span>
          </span>
          <svg class="cal-upcoming__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>`;
      }).join('');

    upcomingList.querySelectorAll('[data-event]').forEach((row) => {
      row.addEventListener('click', () => {
        window.location.hash = `#/event/${row.dataset.event}`;
      });
    });
  }

  paintCalendar();

  prevBtn.addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    paintCalendar();
  });
  nextBtn.addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    paintCalendar();
  });

  mountBottomNav({ active: 'calendar' });
  container.appendChild(screen);
}
