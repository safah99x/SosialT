/**
 * Time Picker.
 * Two scrollable columns (hours 0-23, minutes 00-55 in 5-min steps) styled in
 * brand colors. Replaces the native time input which renders as system blue
 * dropdowns on most browsers and breaks our visual identity.
 */
function pad(n) { return String(n).padStart(2, '0'); }

export function createTimePicker({ value = '', onChange, onPick } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'time-pick';

  const [vh, vm] = (value || '12:00').split(':');
  const state = { hour: Number(vh) || 0, minute: Number(vm) || 0 };

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  wrap.innerHTML = `
    <div class="time-pick__display" id="time-pick-display">${pad(state.hour)}:${pad(state.minute)}</div>
    <div class="time-pick__cols">
      <div class="time-pick__col" data-col="hour" aria-label="Hour">
        ${hours.map((h) => `<button type="button" class="time-pick__cell" data-v="${h}">${pad(h)}</button>`).join('')}
      </div>
      <div class="time-pick__sep">:</div>
      <div class="time-pick__col" data-col="minute" aria-label="Minute">
        ${minutes.map((m) => `<button type="button" class="time-pick__cell" data-v="${m}">${pad(m)}</button>`).join('')}
      </div>
    </div>
    <button type="button" class="time-pick__done" id="time-pick-done">Done</button>
  `;

  const display = wrap.querySelector('#time-pick-display');

  function paint() {
    wrap.querySelectorAll('.time-pick__col').forEach((col) => {
      const key = col.dataset.col;
      col.querySelectorAll('.time-pick__cell').forEach((cell) => {
        cell.classList.toggle('time-pick__cell--on', Number(cell.dataset.v) === state[key]);
      });
    });
    display.textContent = `${pad(state.hour)}:${pad(state.minute)}`;
  }

  function emitChange() {
    onChange && onChange(`${pad(state.hour)}:${pad(state.minute)}`);
  }

  wrap.querySelectorAll('.time-pick__col').forEach((col) => {
    col.addEventListener('click', (e) => {
      const cell = e.target.closest('.time-pick__cell');
      if (!cell) return;
      state[col.dataset.col] = Number(cell.dataset.v);
      paint();
      emitChange();
      cell.scrollIntoView({ block: 'center', behavior: 'smooth' });
    });
  });

  wrap.querySelector('#time-pick-done').addEventListener('click', () => {
    onPick && onPick(`${pad(state.hour)}:${pad(state.minute)}`);
  });

  paint();
  // Center the active row on open.
  requestAnimationFrame(() => {
    wrap.querySelectorAll('.time-pick__col').forEach((col) => {
      const sel = col.querySelector('.time-pick__cell--on');
      if (sel) sel.scrollIntoView({ block: 'center' });
    });
  });

  return wrap;
}
