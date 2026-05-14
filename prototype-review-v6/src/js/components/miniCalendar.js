/**
 * Mini Calendar.
 * Single-month brand-styled date picker. Used inside picker sheets where the
 * full inline date picker is too tall. Selection is a warm gradient pill, not
 * the system blue.
 */
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const WEEK_LABELS = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function pad(n) { return String(n).padStart(2, '0'); }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseYmd(value) {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function createMiniCalendar({ value = '', minDate = null, onChange, onPick } = {}) {
  const today = new Date();
  let selected = parseYmd(value);
  let view = selected ? new Date(selected) : new Date(today);
  view.setDate(1);

  const wrap = document.createElement('div');
  wrap.className = 'mini-cal';

  function render() {
    const year = view.getFullYear();
    const month = view.getMonth();
    const first = new Date(year, month, 1);
    const total = new Date(year, month + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Monday = 0
    const cells = [];
    for (let i = 0; i < lead; i++) cells.push('<span class="mini-cal__pad"></span>');
    for (let d = 1; d <= total; d++) {
      const date = new Date(year, month, d);
      const id = ymd(date);
      const isToday = id === ymd(today);
      const isSel = selected && id === ymd(selected);
      const isDisabled = minDate && date < parseYmd(minDate);
      const cls = [
        'mini-cal__day',
        isSel ? 'mini-cal__day--on' : '',
        isToday ? 'mini-cal__day--today' : '',
        isDisabled ? 'mini-cal__day--off' : '',
      ].filter(Boolean).join(' ');
      cells.push(`<button type="button" class="${cls}" data-date="${id}" ${isDisabled ? 'disabled' : ''}>${d}</button>`);
    }

    wrap.innerHTML = `
      <header class="mini-cal__head">
        <button type="button" class="mini-cal__nav" data-nav="-1" aria-label="Previous month">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M15 6L9 12L15 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="mini-cal__title">${MONTH_NAMES[month]} ${year}</span>
        <button type="button" class="mini-cal__nav" data-nav="1" aria-label="Next month">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M9 6L15 12L9 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </header>
      <div class="mini-cal__weekdays">${WEEK_LABELS.map((d) => `<span>${d}</span>`).join('')}</div>
      <div class="mini-cal__grid">${cells.join('')}</div>
      <footer class="mini-cal__foot">
        <button type="button" class="mini-cal__ghost" data-act="clear">Clear</button>
        <button type="button" class="mini-cal__ghost" data-act="today">Today</button>
      </footer>
    `;

    wrap.querySelectorAll('.mini-cal__nav').forEach((btn) => {
      btn.addEventListener('click', () => {
        view.setMonth(view.getMonth() + Number(btn.dataset.nav));
        render();
      });
    });

    wrap.querySelectorAll('.mini-cal__day').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (btn.disabled) return;
        selected = parseYmd(btn.dataset.date);
        const out = ymd(selected);
        onChange && onChange(out);
        render();
        onPick && onPick(out);
      });
    });

    wrap.querySelector('[data-act="clear"]').addEventListener('click', () => {
      selected = null;
      onChange && onChange('');
      render();
    });
    wrap.querySelector('[data-act="today"]').addEventListener('click', () => {
      view = new Date(today);
      view.setDate(1);
      render();
    });
  }

  render();
  return wrap;
}
