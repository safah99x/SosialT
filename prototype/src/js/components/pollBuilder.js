/**
 * Poll Builder.
 * Lets the host propose 2+ date/time/location options. Friends vote in chat.
 *
 * UX notes:
 * - Each option is a soft warm card with native date + time inputs (works on
 *   mobile + desktop, no extra deps), and a free-form location field.
 * - "Tentative end time" is optional; we don't want to pressure the host into
 *   over-committing the calendar in the poll stage.
 * - Friendly helper text reminds the host this is a draft, not a contract:
 *   they can refine details in the chat once people RSVP.
 */
const NAMES = ['Option 1','Option 2','Option 3','Option 4','Option 5','Option 6'];

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
    list.innerHTML = state.options.map((o, i) => optionTemplate(o, i, state.options.length)).join('');
    list.querySelectorAll('.poll-option').forEach((el) => bindOption(el));
    onChange && onChange(state.options);
  }

  function bindOption(el) {
    const i = Number(el.dataset.index);
    el.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', () => {
        state.options[i][input.dataset.field] = input.value;
        onChange && onChange(state.options);
      });
    });
    const remove = el.querySelector('.poll-option__remove');
    if (remove) {
      remove.addEventListener('click', () => {
        state.options.splice(i, 1);
        render();
      });
    }
  }

  addBtn.addEventListener('click', () => {
    if (state.options.length >= NAMES.length) return;
    state.options.push(newOption());
    render();
    // Focus the first field of the just-added option for fast entry.
    requestAnimationFrame(() => {
      const last = list.lastElementChild;
      if (last) last.querySelector('input')?.focus();
    });
  });

  render();
  wrap.getOptions = () => state.options;
  return wrap;
}

function optionTemplate(o, i, total) {
  const removable = i > 0;
  return `
    <div class="poll-option" data-index="${i}">
      <div class="poll-option__head">
        <span class="poll-option__name">${NAMES[i] || `Option ${i + 1}`}</span>
        ${removable ? `<button type="button" class="poll-option__remove" aria-label="Remove option">${closeSvg()}</button>` : ''}
      </div>

      <div class="poll-field-grid">
        <label class="poll-field">
          <span class="poll-field__label">${calendarSvg()} Date</span>
          <input type="date" data-field="date" value="${o.date}" />
        </label>
        <label class="poll-field">
          <span class="poll-field__label">${calendarSvg()} End <em>(optional)</em></span>
          <input type="date" data-field="endDate" value="${o.endDate}" />
        </label>
        <label class="poll-field">
          <span class="poll-field__label">${clockSvg()} Start</span>
          <input type="time" data-field="startTime" value="${o.startTime}" />
        </label>
        <label class="poll-field">
          <span class="poll-field__label">${clockSvg()} End <em>(tentative)</em></span>
          <input type="time" data-field="endTime" value="${o.endTime}" />
        </label>
      </div>

      <label class="poll-field poll-field--location">
        <span class="poll-field__label">${pinSvg()} Where</span>
        <input type="text" data-field="location" value="${o.location}" placeholder="A place, a neighbourhood, or 'TBD'" />
      </label>
    </div>
  `;
}
