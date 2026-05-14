/**
 * Poll Builder — REVIEW (Workshop 5).
 *
 * Old version used 4 small "Pick date / End date / Start / End" buttons in a
 * grid which felt too database-form-y. New version is Airbnb-style:
 *   - Same calendar as Create Event \"Choose date\": one month + arrows,
 *     single-date selection per option (charcoal pill / range visuals).
 *   - One inline time row (Start time + optional End time) below the strip.
 *   - One quiet location pill below that.
 * Result: visual, tappable, scannable. Friends still vote in the chat.
 */
import { createTimePicker } from './timePicker.js';
import { mountPickerSheet } from './pickerSheet.js';
import { mountLocationPicker } from './locationPicker.js';
import { createDateCalendar } from './dateCalendar.js';

const NAMES = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];

function newOption() {
  return { date: null, startTime: '', endTime: '', location: '' };
}

export function createPollBuilder({ onChange } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'poll-builder poll-builder--airbnb';

  const state = { options: [newOption(), newOption()] };

  wrap.innerHTML = `
    <p class="poll-builder__hint">Add at least 2 options. Friends will vote in the chat.</p>
    <div class="poll-builder__list" id="poll-list"></div>
    <button type="button" class="poll-builder__add" id="poll-add">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      Add another option
    </button>
    <p class="poll-builder__foot">Don't worry, friends can suggest changes in the chat.</p>
  `;

  const list = wrap.querySelector('#poll-list');
  const addBtn = wrap.querySelector('#poll-add');

  function buildOption(i) {
    const o = state.options[i];

    const card = document.createElement('div');
    card.className = 'poll-option-v2';
    card.dataset.index = String(i);

    // Header
    const head = document.createElement('div');
    head.className = 'poll-option-v2__head';
    head.innerHTML = `
      <span class="poll-option-v2__index">${NAMES[i] || `Option ${i + 1}`}</span>
      ${i > 0 ? `<button type="button" class="poll-option-v2__remove" aria-label="Remove option">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>` : ''}
    `;
    card.appendChild(head);

    const pollCal = createDateCalendar({
      mode: 'single',
      start: o.date || null,
      end: null,
      singleMonthNavigate: true,
      onChange: ({ start }) => {
        state.options[i].date = start;
        emit();
      },
    });
    pollCal.classList.add('poll-option-v2__calendar');
    card.appendChild(pollCal);

    // Time row + place pill
    const tail = document.createElement('div');
    tail.className = 'poll-option-v2__tail';
    tail.innerHTML = `
      <button type="button" class="poll-option-v2__time" data-field="startTime">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        <span class="poll-option-v2__time-label">${o.startTime || 'Pick start'}</span>
      </button>
      <button type="button" class="poll-option-v2__time poll-option-v2__time--ghost" data-field="endTime">
        <span class="poll-option-v2__time-label">${o.endTime ? 'until ' + o.endTime : '+ end time'}</span>
      </button>
      <button type="button" class="poll-option-v2__place" data-field="location">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>
        <span class="poll-option-v2__place-label">${o.location || 'Pick a place'}</span>
      </button>
    `;
    card.appendChild(tail);

    // Wiring
    const removeBtn = head.querySelector('.poll-option-v2__remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        state.options.splice(i, 1);
        render();
      });
    }
    tail.querySelectorAll('[data-field]').forEach((btn) => {
      const field = btn.dataset.field;
      btn.addEventListener('click', () => {
        if (field === 'startTime' || field === 'endTime') {
          openTime(i, field);
        } else if (field === 'location') {
          mountLocationPicker({
            initial: state.options[i].location ? { name: state.options[i].location, sub: '', kind: 'pin' } : null,
            onPick: (place) => {
              state.options[i].location = place.name;
              render();
            },
          });
        }
      });
    });

    return card;
  }

  function openTime(i, field) {
    let pending = state.options[i][field] || (field === 'endTime' ? '21:00' : '19:00');
    let sheet;
    const tp = createTimePicker({
      value: pending,
      onChange: (v) => { pending = v; },
      onPick: (v) => {
        state.options[i][field] = v;
        render();
        sheet.close();
      },
    });
    sheet = mountPickerSheet({ title: field === 'endTime' ? 'End time' : 'Start time', content: tp });
  }

  function render() {
    list.innerHTML = '';
    state.options.forEach((_, i) => list.appendChild(buildOption(i)));
    emit();
  }

  function emit() {
    onChange && onChange(state.options);
  }

  addBtn.addEventListener('click', () => {
    if (state.options.length >= NAMES.length) return;
    state.options.push(newOption());
    render();
  });

  render();
  wrap.getOptions = () => state.options;
  return wrap;
}
