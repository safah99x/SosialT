/**
 * REVIEW: A horizontal, Airbnb-style date strip used by Quick Ping (3 days
 * max) and Create Event (next 14 days). Each tile shows the weekday + day
 * number. The first tile is labelled "Today", the second "Tomorrow", and the
 * rest show their weekday short name. Tap to select.
 *
 * Workshop 5 minutes:
 *  - "Quick ping needs date selection capability (currently time-only) — 3-day max"
 *  - "Calendar display issues: too many days at once — limit to next 14 days with scroll"
 */
const WEEK = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function ymd(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }

export function createDateStrip({
  days = 14,
  selectedIndex = 0,
  startDate = null,
  onChange,
  variant = 'default', // 'compact' for Quick Ping
} = {}) {
  const wrap = document.createElement('div');
  wrap.className = `date-strip date-strip--${variant}`;

  const today = startDate ? new Date(startDate) : new Date();
  today.setHours(0, 0, 0, 0);

  const list = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    list.push(d);
  }

  function tileLabel(d, i) {
    if (i === 0) return 'Today';
    if (i === 1) return 'Tomorrow';
    return WEEK[d.getDay()];
  }

  wrap.innerHTML = `
    <div class="date-strip__scroll" role="listbox" aria-label="Choose a date">
      ${list.map((d, i) => `
        <button
          type="button"
          class="date-strip__tile ${i === selectedIndex ? 'date-strip__tile--active' : ''}"
          data-i="${i}"
          data-date="${ymd(d)}"
          role="option"
          aria-selected="${i === selectedIndex}"
        >
          <span class="date-strip__weekday">${tileLabel(d, i)}</span>
          <span class="date-strip__day">${d.getDate()}</span>
          <span class="date-strip__month">${MONTH_SHORT[d.getMonth()]}</span>
        </button>
      `).join('')}
    </div>
  `;

  let active = selectedIndex;

  function emit() {
    // selectedIndex of -1 means "no date chosen yet" (used by poll options
    // before the host taps a tile). Skip emit until there's a real pick.
    if (active < 0 || !list[active]) return;
    onChange && onChange({
      index: active,
      date: list[active],
      label: list[active].toDateString(),
    });
  }

  wrap.querySelectorAll('.date-strip__tile').forEach((b) => {
    b.addEventListener('click', () => {
      active = Number(b.dataset.i);
      wrap.querySelectorAll('.date-strip__tile').forEach((x) => {
        x.classList.toggle('date-strip__tile--active', x === b);
        x.setAttribute('aria-selected', x === b ? 'true' : 'false');
      });
      // Keep the chosen tile in view.
      b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      emit();
    });
  });

  // Fire initial selection so consumers can react to default.
  requestAnimationFrame(() => emit());

  return wrap;
}
