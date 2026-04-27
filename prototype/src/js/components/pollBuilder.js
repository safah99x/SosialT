/**
 * Poll Builder.
 * Lets the host propose 2+ date/time/location options. Friends vote in chat.
 *
 * UX notes:
 * - Date and time fields are tappable buttons that open a brand-styled picker
 *   sheet. We never use native <input type="date"/time"> here because they
 *   render as system blue on most browsers and break the warm SosialT palette.
 * - "Tentative end time" is optional; we don't want to pressure the host into
 *   over-committing the calendar in the poll stage.
 * - Friendly helper text reminds the host this is a draft, not a contract.
 */
import { createMiniCalendar } from './miniCalendar.js';
import { createTimePicker } from './timePicker.js';
import { mountPickerSheet } from './pickerSheet.js';

const NAMES = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function newOption() {
  return { date: '', endDate: '', startTime: '', endTime: '', location: '' };
}

function calendarSvg() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
function clockSvg() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
}
function pinSvg() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg>`;
}
function closeSvg() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`;
}

function formatDate(value) {
  if (!value) return '';
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return '';
  return `${MONTH_SHORT[m - 1]} ${d}`;
}

export function createPollBuilder({ onChange } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'poll-builder';

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

  function render() {
    list.innerHTML = state.options.map((o, i) => optionTemplate(o, i)).join('');
    list.querySelectorAll('.poll-option').forEach((el) => bindOption(el));
    onChange && onChange(state.options);
  }

  function bindOption(el) {
    const i = Number(el.dataset.index);

    el.querySelectorAll('[data-pick]').forEach((btn) => {
      btn.addEventListener('click', () => openPicker(i, btn.dataset.field, btn.dataset.pick));
    });

    const locInput = el.querySelector('[data-field="location"]');
    if (locInput) {
      locInput.addEventListener('input', () => {
        state.options[i].location = locInput.value;
        onChange && onChange(state.options);
      });
    }

    const remove = el.querySelector('.poll-option__remove');
    if (remove) {
      remove.addEventListener('click', () => {
        state.options.splice(i, 1);
        render();
      });
    }
  }

  function openPicker(i, field, kind) {
    if (kind === 'date') {
      let pending = state.options[i][field];
      const cal = createMiniCalendar({
        value: pending,
        minDate: field === 'endDate' ? state.options[i].date || null : null,
        onChange: (v) => { pending = v; },
      });
      const sheet = mountPickerSheet({
        title: field === 'endDate' ? 'End date' : 'Date',
        content: cal,
      });
      // The sheet has a close button; once user picks a date we add a Done bar
      // by tapping outside or close. Add a Save action below the calendar.
      const save = document.createElement('button');
      save.type = 'button';
      save.className = 'picker-sheet__save';
      save.textContent = 'Save';
      save.addEventListener('click', () => {
        state.options[i][field] = pending || '';
        render();
        sheet.close();
      });
      sheet.element.querySelector('.picker-sheet').appendChild(save);
    } else if (kind === 'time') {
      let pending = state.options[i][field] || '12:00';
      const tp = createTimePicker({
        value: pending,
        onChange: (v) => { pending = v; },
        onPick: (v) => {
          state.options[i][field] = v;
          render();
          sheet.close();
        },
      });
      const sheet = mountPickerSheet({
        title: field === 'endTime' ? 'End time' : 'Start time',
        content: tp,
      });
    }
  }

  addBtn.addEventListener('click', () => {
    if (state.options.length >= NAMES.length) return;
    state.options.push(newOption());
    render();
    requestAnimationFrame(() => {
      const last = list.lastElementChild;
      if (last) last.querySelector('input, .poll-pickfield')?.focus();
    });
  });

  render();
  wrap.getOptions = () => state.options;
  return wrap;
}

function optionTemplate(o, i) {
  const removable = i > 0;
  const dateLabel = o.date ? formatDate(o.date) : 'Pick date';
  const endDateLabel = o.endDate ? formatDate(o.endDate) : 'Optional';
  const startLabel = o.startTime || 'Pick time';
  const endLabel = o.endTime || 'Tentative';

  return `
    <div class="poll-option" data-index="${i}">
      <div class="poll-option__head">
        <span class="poll-option__name">${NAMES[i] || `Option ${i + 1}`}</span>
        ${removable ? `<button type="button" class="poll-option__remove" aria-label="Remove option">${closeSvg()}</button>` : ''}
      </div>

      <div class="poll-field-grid">
        <button type="button" class="poll-pickfield" data-pick="date" data-field="date">
          <span class="poll-pickfield__label">${calendarSvg()} Date</span>
          <span class="poll-pickfield__value ${o.date ? '' : 'is-placeholder'}">${dateLabel}</span>
        </button>
        <button type="button" class="poll-pickfield" data-pick="date" data-field="endDate">
          <span class="poll-pickfield__label">${calendarSvg()} End <em>(optional)</em></span>
          <span class="poll-pickfield__value ${o.endDate ? '' : 'is-placeholder'}">${endDateLabel}</span>
        </button>
        <button type="button" class="poll-pickfield" data-pick="time" data-field="startTime">
          <span class="poll-pickfield__label">${clockSvg()} Start</span>
          <span class="poll-pickfield__value ${o.startTime ? '' : 'is-placeholder'}">${startLabel}</span>
        </button>
        <button type="button" class="poll-pickfield" data-pick="time" data-field="endTime">
          <span class="poll-pickfield__label">${clockSvg()} End <em>(tentative)</em></span>
          <span class="poll-pickfield__value ${o.endTime ? '' : 'is-placeholder'}">${endLabel}</span>
        </button>
      </div>

      <label class="poll-field poll-field--location">
        <span class="poll-field__label">${pinSvg()} Where</span>
        <input type="text" data-field="location" value="${o.location}" placeholder="A place, a neighbourhood, or 'TBD'" />
      </label>
    </div>
  `;
}
