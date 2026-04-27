/**
 * Invite Friends overlay sheet, plus the "Add to circle?" modal that follows.
 *
 * The sheet is mounted on top of whatever screen called it (chat or event detail),
 * keeping that context alive in the background. Closing returns the user exactly
 * where they were, no re-render flash.
 *
 * Flow:
 *   sheet open -> select friends -> tap "Invite friends (N)" ->
 *   confirm modal "Add to same circle?" ->
 *   close sheet, fire onConfirm(selectedCount)
 */
const FRIENDS = [
  { id: 'eleanor', name: 'Eleanor Whitfield',  initial: 'E', color: '#C49E7A' },
  { id: 'rupert',  name: 'Rupert Ashworth',    initial: 'R', color: '#8A7E72' },
  { id: 'cecily',  name: 'Cecily Ashford',     initial: 'C', color: '#E8C547' },
  { id: 'rosaline',name: 'Rosaline Fairfax',   initial: 'R', color: '#6FA786' },
  { id: 'theo',    name: 'Theo Lindholm',      initial: 'T', color: '#B98C5E' },
  { id: 'sigrid',  name: 'Sigrid Aas',         initial: 'S', color: '#7E8DA8' },
];

export function mountInviteSheet({ onConfirm } = {}) {
  // Idempotent mount — never stack two sheets.
  document.querySelectorAll('.invite-sheet, .invite-sheet-backdrop, .circle-modal-backdrop')
    .forEach((n) => n.remove());

  const frame = document.querySelector('.device-frame') || document.body;

  const backdrop = document.createElement('div');
  backdrop.className = 'invite-sheet-backdrop';

  const sheet = document.createElement('section');
  sheet.className = 'invite-sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-label', 'Invite friends');

  sheet.innerHTML = `
    <div class="invite-sheet__handle" aria-hidden="true"></div>
    <header class="invite-sheet__head">
      <h3 class="invite-sheet__title">Select friends to invite</h3>
      <button class="invite-sheet__close" id="invite-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </header>

    <div class="invite-sheet__row">
      <button class="invite-sheet__add" id="invite-add">
        <span class="invite-sheet__add-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
        </span>
        <span class="invite-sheet__add-label">Add new friend</span>
      </button>
      ${FRIENDS.map((f) => `
        <button class="invite-friend" data-id="${f.id}">
          <span class="invite-friend__avatar" style="background:${f.color}">${f.initial}</span>
          <span class="invite-friend__name">${f.name.split(' ')[0]}</span>
          <span class="invite-friend__check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L20 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </span>
        </button>
      `).join('')}
    </div>

    <button class="cta-button invite-sheet__cta" id="invite-confirm" disabled>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right:8px"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <span id="invite-confirm-label">Invite friends</span>
    </button>
  `;

  frame.appendChild(backdrop);
  frame.appendChild(sheet);

  const selected = new Set();
  const confirm = sheet.querySelector('#invite-confirm');
  const confirmLabel = sheet.querySelector('#invite-confirm-label');

  function refreshCta() {
    const n = selected.size;
    confirm.disabled = n === 0;
    confirmLabel.textContent = n === 0 ? 'Invite friends' : `Invite ${n} friend${n === 1 ? '' : 's'}`;
  }

  sheet.querySelectorAll('.invite-friend').forEach((b) => {
    b.addEventListener('click', () => {
      const id = b.dataset.id;
      if (selected.has(id)) {
        selected.delete(id);
        b.classList.remove('invite-friend--on');
      } else {
        selected.add(id);
        b.classList.add('invite-friend--on');
      }
      refreshCta();
    });
  });

  function close() {
    sheet.classList.add('invite-sheet--leaving');
    backdrop.classList.add('invite-sheet-backdrop--leaving');
    setTimeout(() => { sheet.remove(); backdrop.remove(); }, 220);
  }

  sheet.querySelector('#invite-close').addEventListener('click', close);
  backdrop.addEventListener('click', close);

  confirm.addEventListener('click', () => {
    if (selected.size === 0) return;
    showCircleModal(frame, {
      onDone: () => {
        close();
        onConfirm && onConfirm(selected.size);
      },
    });
  });
}

function showCircleModal(frame, { onDone } = {}) {
  const backdrop = document.createElement('div');
  backdrop.className = 'circle-modal-backdrop';

  const modal = document.createElement('div');
  modal.className = 'circle-modal';
  modal.innerHTML = `
    <h3 class="circle-modal__title">Add them to the same circle?</h3>
    <p class="circle-modal__subtitle">Quietly group your invitees so future plans pre-fill faster.</p>
    <div class="circle-modal__actions">
      <button class="circle-modal__btn circle-modal__btn--ghost" id="circle-skip">Not now</button>
      <button class="circle-modal__btn circle-modal__btn--save" id="circle-save">Save</button>
    </div>
  `;

  frame.appendChild(backdrop);
  frame.appendChild(modal);

  function close() {
    modal.classList.add('circle-modal--leaving');
    backdrop.classList.add('circle-modal-backdrop--leaving');
    setTimeout(() => { modal.remove(); backdrop.remove(); onDone && onDone(); }, 200);
  }

  modal.querySelector('#circle-skip').addEventListener('click', close);
  modal.querySelector('#circle-save').addEventListener('click', close);
  backdrop.addEventListener('click', close);
}

export function renderInviteFriends(container) {
  // For deep-linking /event/:id/invite, just render the host screen and mount.
  // The actual visual is the overlay sheet.
  const screen = document.createElement('div');
  screen.className = 'screen';
  container.innerHTML = '';
  container.appendChild(screen);
  mountInviteSheet({});
}
