/**
 * Airbnb-inspired date range picker.
 * Inline calendar that supports single date OR a date range.
 * No grid lines; selected days are filled charcoal circles, in-range
 * days sit on a soft cream-yellow strip. Time selection is optional.
 */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_LABELS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function startOfMonth(year, month) { return new Date(year, month, 1); }
function daysInMonth(year, month) { return new Date(year, month + 1, 0).getDate(); }

function ymd(date) { return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`; }
function sameDay(a, b) { return a && b && ymd(a) === ymd(b); }
function inRange(d, start, end) {
  if (!start || !end) return false;
  const t = d.getTime(); const s = start.getTime(); const e = end.getTime();
  return t > Math.min(s, e) && t < Math.max(s, e);
}

function fmt(date) {
  return `${MONTH_NAMES[date.getMonth()].slice(0,3)} ${date.getDate()}`;
}

export function createDatePicker({ onChange } = {}) {
  const state = { start: null, end: null };
  const wrap = document.createElement('div');
  wrap.className = 'date-picker';

  const today = new Date();
  const months = [];
  for (let i = 0; i < 3; i++) {
    months.push(new Date(today.getFullYear(), today.getMonth() + i, 1));
  }

  wrap.innerHTML = `
    <div class="date-picker__head">
      <span class="date-picker__hint" id="date-picker-hint">Pick a date or a range</span>
    </div>
    <div class="date-picker__weekdays">${WEEK_LABELS.map(d => `<span>${d}</span>`).join('')}</div>
    <div class="date-picker__months" id="date-picker-months"></div>
    <div class="date-picker__foot">
      <button class="date-picker__clear" id="date-picker-clear">Clear dates</button>
      <span class="date-picker__summary" id="date-picker-summary">No dates yet</span>
    </div>
  `;

  const monthsEl = wrap.querySelector('#date-picker-months');
  monthsEl.innerHTML = months.map((m) => renderMonth(m)).join('');

  function renderMonth(m) {
    const year = m.getFullYear();
    const month = m.getMonth();
    const first = startOfMonth(year, month);
    let lead = (first.getDay() + 6) % 7; // Monday = 0
    const total = daysInMonth(year, month);
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span class="date-picker__pad"></span>');
    for (let d = 1; d <= total; d++) {
      const date = new Date(year, month, d);
      cells.push(`<button class="date-picker__day" data-date="${ymd(date)}" aria-label="${fmt(date)}">${d}</button>`);
    }
    return `
      <section class="date-picker__month">
        <h4 class="date-picker__month-title">${MONTH_NAMES[month]} ${year}</h4>
        <div class="date-picker__grid">${cells.join('')}</div>
      </section>
    `;
  }

  function applyClasses() {
    wrap.querySelectorAll('.date-picker__day').forEach((b) => {
      b.classList.remove('date-picker__day--start','date-picker__day--end','date-picker__day--in-range','date-picker__day--single');
      const [y, mo, d] = b.dataset.date.split('-').map(Number);
      const date = new Date(y, mo, d);
      if (state.start && state.end) {
        if (sameDay(date, state.start)) b.classList.add('date-picker__day--start');
        if (sameDay(date, state.end))   b.classList.add('date-picker__day--end');
        if (inRange(date, state.start, state.end)) b.classList.add('date-picker__day--in-range');
      } else if (state.start) {
        if (sameDay(date, state.start)) b.classList.add('date-picker__day--single');
      }
    });
    const sum = wrap.querySelector('#date-picker-summary');
    if (state.start && state.end) {
      sum.textContent = `${fmt(state.start)} – ${fmt(state.end)}`;
    } else if (state.start) {
      sum.textContent = fmt(state.start);
    } else {
      sum.textContent = 'No dates yet';
    }
    onChange && onChange(state);
  }

  monthsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('.date-picker__day');
    if (!btn) return;
    const [y, mo, d] = btn.dataset.date.split('-').map(Number);
    const date = new Date(y, mo, d);
    if (!state.start || (state.start && state.end)) {
      state.start = date;
      state.end = null;
    } else if (state.start && !state.end) {
      if (date < state.start) {
        state.end = state.start;
        state.start = date;
      } else if (sameDay(date, state.start)) {
        // single date confirmed; toggle off range
        state.end = null;
      } else {
        state.end = date;
      }
    }
    applyClasses();
  });

  wrap.querySelector('#date-picker-clear').addEventListener('click', () => {
    state.start = null; state.end = null; applyClasses();
  });

  applyClasses();
  return wrap;
}
