/**
 * REVIEW (Workshop 5/6):
 * Airbnb-style calendar that backs the Create Event "Choose date/time" mode
 * and the poll builder. Replaces the older horizontal date strip.
 *
 * Layout:
 *   ┌──────────────────────────────────────────┐
 *   │ MO TU WE TH FR SA SU            (sticky) │
 *   ├──────────────────────────────────────────┤
 *   │            May 2026                      │
 *   │ [grid of dates — past dates muted]       │
 *   │            June 2026                     │
 *   │ [grid]                                   │
 *   └──────────────────────────────────────────┘
 *
 * Behaviour:
 *   - First view shows the current month, scrolled so today is visible at
 *     the top. "Today + next 14 days" are visually emphasised; days beyond
 *     are still tappable but slightly muted (matches the spec to "show the
 *     next 14 days, with scrolling").
 *   - mode: 'single'  → tap a date to set it as the start.
 *   - mode: 'range'   → first tap sets start, second tap sets end.
 *     Tapping a date earlier than the current start resets selection.
 *   - windowDays: N  → render ONLY the next N days from today (rolling strip).
 *   - singleMonthNavigate: true → one calendar month inside the viewport,
 *     with prev/next arrows; shared by Create Event and poll builder (range
 *     or single). Past days disabled.
 *   - Selected single  : black filled circle.
 *     Selected range   : black caps at start/end + cream-yellow strip between.
 *   - onChange returns { start, end | null, range: bool } whenever the
 *     selection changes.
 *
 * Public API:
 *   createDateCalendar({
 *     mode: 'single' | 'range',
 *     start: Date | null,
 *     end:   Date | null,
 *     windowDays: null | number,
 *     singleMonthNavigate: false,
 *     monthsAhead: 6,         // multi-month scroll if windowDays and singleMonthNavigate unset
 *     onChange: (selection) => {},
 *   }) → HTMLElement
 */

const DAY_NAMES = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function startOfDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function sameDay(a, b) {
  return a && b && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
// JS getDay() returns 0=Sun..6=Sat. Map to Monday-first column index.
function mondayIndex(d) {
  return (d.getDay() + 6) % 7;
}

function formatWindowHeading(dates) {
  if (!dates.length) return '';
  const a = dates[0];
  const b = dates[dates.length - 1];
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${MONTH_NAMES[a.getMonth()]} ${a.getFullYear()}`;
  }
  const short = (d) => `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)}`;
  return `${short(a)} \u2013 ${short(b)} ${b.getFullYear()}`;
}

/**
 * Next-N-days grid (Mon–Sun columns), no dates outside the window.
 */
function createWindowDateCalendar({
  mode = 'single',
  start = null,
  end = null,
  windowDays = 14,
  onChange,
} = {}) {
  const today = startOfDay(new Date());
  const dates = [];
  for (let i = 0; i < windowDays; i++) {
    dates.push(startOfDay(new Date(today.getTime() + i * 86400000)));
  }
  const allowed = new Set(dates.map((d) => d.getTime()));

  const wrap = document.createElement('div');
  wrap.className = 'date-cal date-cal--window';

  const head = document.createElement('div');
  head.className = 'date-cal__head';
  DAY_NAMES.forEach((n) => {
    const c = document.createElement('span');
    c.className = 'date-cal__head-cell';
    c.textContent = n.toUpperCase();
    head.appendChild(c);
  });
  wrap.appendChild(head);

  const body = document.createElement('div');
  body.className = 'date-cal__body';
  wrap.appendChild(body);

  const monthEl = document.createElement('div');
  monthEl.className = 'date-cal__month';

  const heading = document.createElement('div');
  heading.className = 'date-cal__heading';
  heading.textContent = formatWindowHeading(dates);
  monthEl.appendChild(heading);

  const grid = document.createElement('div');
  grid.className = 'date-cal__grid';

  const state = {
    start: start ? startOfDay(start) : null,
    end: end ? startOfDay(end) : null,
  };

  function emit() {
    if (onChange) onChange({
      start: state.start,
      end: state.end,
      range: mode === 'range',
    });
  }

  function isInRange(d) {
    if (!state.start || !state.end) return false;
    return d >= state.start && d <= state.end;
  }

  function paint() {
    grid.querySelectorAll('.date-cal__cell').forEach((cell) => {
      const ts = Number(cell.dataset.ts);
      if (Number.isNaN(ts) || ts === 0) return;
      const d = new Date(ts);
      cell.classList.toggle('date-cal__cell--start', sameDay(d, state.start));
      cell.classList.toggle('date-cal__cell--end', sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--in',
        isInRange(d) && !sameDay(d, state.start) && !sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--single',
        mode === 'single' && sameDay(d, state.start));
    });
  }

  function handleTap(date) {
    if (!allowed.has(date.getTime())) return;
    if (mode === 'single') {
      state.start = date;
      state.end = null;
    } else if (!state.start || (state.start && state.end)) {
      state.start = date;
      state.end = null;
    } else if (date < state.start) {
      state.start = date;
      state.end = null;
    } else if (sameDay(date, state.start)) {
      state.end = date;
    } else {
      state.end = date;
    }
    paint();
    emit();
  }

  const first = dates[0];
  const lead = mondayIndex(first);
  for (let i = 0; i < lead; i++) {
    const empty = document.createElement('span');
    empty.className = 'date-cal__cell date-cal__cell--blank';
    empty.dataset.ts = '0';
    grid.appendChild(empty);
  }

  dates.forEach((date) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'date-cal__cell';
    cell.dataset.ts = String(date.getTime());
    cell.textContent = String(date.getDate());
    if (sameDay(date, today)) cell.classList.add('date-cal__cell--today');
    cell.addEventListener('click', () => handleTap(date));
    grid.appendChild(cell);
  });

  monthEl.appendChild(grid);
  body.appendChild(monthEl);
  paint();
  emit();
  return wrap;
}

/**
 * One calendar month at a time with prev/next arrows (Airbnb-like density).
 * Past days disabled; earliest navigable month is the month containing "today".
 */
function createSingleMonthNavigatorCalendar({
  mode = 'range',
  start = null,
  end = null,
  onChange,
} = {}) {
  const today = startOfDay(new Date());

  let viewMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  if (start) viewMonth = new Date(start.getFullYear(), start.getMonth(), 1);

  const wrap = document.createElement('div');
  wrap.className = 'date-cal date-cal--single-month';

  const head = document.createElement('div');
  head.className = 'date-cal__head';
  DAY_NAMES.forEach((n) => {
    const c = document.createElement('span');
    c.className = 'date-cal__head-cell';
    c.textContent = n.toUpperCase();
    head.appendChild(c);
  });
  wrap.appendChild(head);

  const body = document.createElement('div');
  body.className = 'date-cal__body date-cal__body--single-month';
  wrap.appendChild(body);

  const state = {
    start: start ? startOfDay(start) : null,
    end: end ? startOfDay(end) : null,
  };

  function emit() {
    if (onChange) onChange({
      start: state.start,
      end: state.end,
      range: mode === 'range',
    });
  }

  function isInRange(d) {
    if (!state.start || !state.end) return false;
    return d >= state.start && d <= state.end;
  }

  function handleTap(date) {
    if (date < today) return;
    if (mode === 'single') {
      state.start = date;
      state.end = null;
    } else if (!state.start || (state.start && state.end)) {
      state.start = date;
      state.end = null;
    } else if (date < state.start) {
      state.start = date;
      state.end = null;
    } else if (sameDay(date, state.start)) {
      state.end = date;
    } else {
      state.end = date;
    }
    paint();
    emit();
  }

  function paint() {
    wrap.querySelectorAll('.date-cal__cell').forEach((cell) => {
      const ts = Number(cell.dataset.ts);
      if (Number.isNaN(ts) || ts === 0) return;
      const d = new Date(ts);
      cell.classList.toggle('date-cal__cell--start', sameDay(d, state.start));
      cell.classList.toggle('date-cal__cell--end', sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--in',
        isInRange(d) && !sameDay(d, state.start) && !sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--single',
        mode === 'single' && sameDay(d, state.start));
    });
  }

  function minViewMonth() {
    return new Date(today.getFullYear(), today.getMonth(), 1);
  }

  function renderMonthGrid() {
    body.innerHTML = '';

    const nav = document.createElement('div');
    nav.className = 'date-cal__month-nav';

    const prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'date-cal__nav-btn';
    prev.setAttribute('aria-label', 'Previous month');
    prev.dataset.nav = 'prev';
    prev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const title = document.createElement('span');
    title.className = 'date-cal__month-nav-title';
    title.textContent = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

    const next = document.createElement('button');
    next.type = 'button';
    next.className = 'date-cal__nav-btn';
    next.setAttribute('aria-label', 'Next month');
    next.dataset.nav = 'next';
    next.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

    const minVm = minViewMonth();
    prev.disabled = viewMonth.getTime() <= minVm.getTime();

    prev.addEventListener('click', () => {
      viewMonth.setMonth(viewMonth.getMonth() - 1);
      renderMonthGrid();
    });
    next.addEventListener('click', () => {
      viewMonth.setMonth(viewMonth.getMonth() + 1);
      renderMonthGrid();
    });

    nav.append(prev, title, next);
    body.appendChild(nav);

    const grid = document.createElement('div');
    grid.className = 'date-cal__grid';

    const offset = mondayIndex(viewMonth);
    const y = viewMonth.getFullYear();
    const mo = viewMonth.getMonth();
    const lastDay = new Date(y, mo + 1, 0).getDate();

    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('span');
      empty.className = 'date-cal__cell date-cal__cell--blank';
      empty.dataset.ts = '0';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= lastDay; day++) {
      const date = startOfDay(new Date(y, mo, day));
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'date-cal__cell';
      cell.dataset.ts = String(date.getTime());
      cell.textContent = String(day);
      const isPast = date < today;
      if (isPast) {
        cell.classList.add('date-cal__cell--past');
        cell.disabled = true;
      } else {
        cell.addEventListener('click', () => handleTap(date));
      }
      if (sameDay(date, today)) cell.classList.add('date-cal__cell--today');
      grid.appendChild(cell);
    }

    body.appendChild(grid);
    paint();
    emit();
  }

  renderMonthGrid();
  return wrap;
}

export function createDateCalendar({
  mode = 'single',
  start = null,
  end = null,
  monthsAhead = 6,
  windowDays = null,
  /** When true (and windowDays unset), shows one month with arrow navigation. */
  singleMonthNavigate = false,
  onChange,
} = {}) {
  if (windowDays && windowDays > 0) {
    return createWindowDateCalendar({
      mode, start, end, windowDays, onChange,
    });
  }
  if (singleMonthNavigate) {
    return createSingleMonthNavigatorCalendar({ mode, start, end, onChange });
  }

  const today = startOfDay(new Date());
  const horizon14 = startOfDay(new Date(today.getTime() + 13 * 86400000)); // today + 13 inclusive

  const wrap = document.createElement('div');
  wrap.className = 'date-cal';

  // Header (Mo–Su) — sticky at the top of the scroll container.
  const head = document.createElement('div');
  head.className = 'date-cal__head';
  DAY_NAMES.forEach((n) => {
    const c = document.createElement('span');
    c.className = 'date-cal__head-cell';
    c.textContent = n.toUpperCase();
    head.appendChild(c);
  });
  wrap.appendChild(head);

  const body = document.createElement('div');
  body.className = 'date-cal__body';
  wrap.appendChild(body);

  const state = {
    start: start ? startOfDay(start) : null,
    end:   end   ? startOfDay(end)   : null,
  };

  function emit() {
    if (onChange) onChange({
      start: state.start,
      end:   state.end,
      range: mode === 'range',
    });
  }

  function handleTap(date) {
    if (mode === 'single') {
      state.start = date;
      state.end = null;
    } else {
      // Range mode.
      if (!state.start || (state.start && state.end)) {
        // Start fresh.
        state.start = date;
        state.end = null;
      } else if (date < state.start) {
        // User tapped a day before the current start — reset.
        state.start = date;
        state.end = null;
      } else if (sameDay(date, state.start)) {
        // Same day twice — make it a single-day "range".
        state.end = date;
      } else {
        state.end = date;
      }
    }
    paint();
    emit();
  }

  // Build month grids.
  const months = [];
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  for (let i = 0; i < monthsAhead; i++) {
    const m = new Date(startMonth.getFullYear(), startMonth.getMonth() + i, 1);
    months.push(m);
  }

  // Helpers for in-range rendering inside a single week row.
  function isInRange(d) {
    if (!state.start || !state.end) return false;
    return d >= state.start && d <= state.end;
  }

  function paint() {
    body.querySelectorAll('.date-cal__cell').forEach((cell) => {
      const ts = Number(cell.dataset.ts);
      if (Number.isNaN(ts) || ts === 0) return;
      const d = new Date(ts);
      cell.classList.toggle('date-cal__cell--start', sameDay(d, state.start));
      cell.classList.toggle('date-cal__cell--end',   sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--in',
        isInRange(d) && !sameDay(d, state.start) && !sameDay(d, state.end));
      cell.classList.toggle('date-cal__cell--single',
        mode === 'single' && sameDay(d, state.start));
    });
  }

  months.forEach((m) => {
    const monthEl = document.createElement('div');
    monthEl.className = 'date-cal__month';

    const heading = document.createElement('div');
    heading.className = 'date-cal__heading';
    heading.textContent = `${MONTH_NAMES[m.getMonth()]} ${m.getFullYear()}`;
    monthEl.appendChild(heading);

    const grid = document.createElement('div');
    grid.className = 'date-cal__grid';

    const lastDay = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
    const offset = mondayIndex(m); // empty cells at the start.

    // Empty leading cells.
    for (let i = 0; i < offset; i++) {
      const empty = document.createElement('span');
      empty.className = 'date-cal__cell date-cal__cell--blank';
      empty.dataset.ts = '0';
      grid.appendChild(empty);
    }

    for (let day = 1; day <= lastDay; day++) {
      const date = startOfDay(new Date(m.getFullYear(), m.getMonth(), day));
      const isPast = date < today;
      const inFocus = !isPast && date <= horizon14; // first 14 days emphasised
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'date-cal__cell';
      cell.dataset.ts = String(date.getTime());
      cell.textContent = String(day);
      if (isPast) cell.classList.add('date-cal__cell--past');
      if (sameDay(date, today)) cell.classList.add('date-cal__cell--today');
      if (inFocus && !isPast) cell.classList.add('date-cal__cell--focus');
      if (!isPast) {
        cell.addEventListener('click', () => handleTap(date));
      } else {
        cell.disabled = true;
      }
      grid.appendChild(cell);
    }

    monthEl.appendChild(grid);
    body.appendChild(monthEl);
  });

  paint();

  return wrap;
}
