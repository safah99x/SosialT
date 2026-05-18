/**
 * Invite Friends overlay sheet.
 *
 * V4 (Workshop 7 feedback): the "Copy link" action is gone and the
 * "Add new friend via SMS" path is replaced by a single **Invite friends**
 * row that opens the native share sheet. Everything else (selecting people
 * already on the app, save-to-circle modal) is preserved so existing
 * callers (event detail, chat) don't break.
 */
import { nativeShareInvite, destinationLabel } from '../lib/nativeShare.js';
import { contactsPrimingNeeded, buildContactsPrimingCard } from '../lib/contactsAccess.js';

const FRIENDS = [
  { id: 'eleanor', name: 'Eleanor Whitfield',  initial: 'E', color: '#C49E7A' },
  { id: 'rupert',  name: 'Rupert Ashworth',    initial: 'R', color: '#8A7E72' },
  { id: 'cecily',  name: 'Cecily Ashford',     initial: 'C', color: '#E8C547' },
  { id: 'rosaline',name: 'Rosaline Fairfax',   initial: 'R', color: '#6FA786' },
  { id: 'theo',    name: 'Theo Lindholm',      initial: 'T', color: '#B98C5E' },
  { id: 'sigrid',  name: 'Sigrid Aas',         initial: 'S', color: '#7E8DA8' },
];

function toast(host, msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  host.appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
  setTimeout(() => t.remove(), 2000);
}

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
      <h3 class="invite-sheet__title">Invite people</h3>
      <button class="invite-sheet__close" id="invite-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </header>

    <button type="button" class="invite-sheet__share-cta" id="invite-share-cta" aria-label="Share with anyone via your share sheet">
      <span class="invite-sheet__share-icon" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </span>
      <span class="invite-sheet__share-copy">
        <strong>Invite anyone</strong>
        <span>Opens your share sheet: SMS, WhatsApp, Messenger, Mail…</span>
      </span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>

    <p class="invite-sheet__section-label">On SosialT already · tap to add to this plan</p>

    <div class="invite-sheet__row" id="invite-friends-row"></div>

    <button class="cta-button invite-sheet__cta" id="invite-confirm" disabled>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style="margin-right:8px"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      <span id="invite-confirm-label">Add to plan</span>
    </button>
  `;

  frame.appendChild(backdrop);
  frame.appendChild(sheet);

  if (contactsPrimingNeeded()) {
    sheet.insertBefore(
      buildContactsPrimingCard('invite', (allowed) => {
        if (allowed) toast(frame, 'Contacts on — pick people below.');
      }),
      sheet.querySelector('.invite-sheet__head'),
    );
  }

  const row = sheet.querySelector('#invite-friends-row');
  FRIENDS.forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'invite-friend';
    b.dataset.id = f.id;
    b.innerHTML = `
      <span class="invite-friend__avatar" style="background:${f.color}">${f.initial}</span>
      <span class="invite-friend__name">${f.name.split(' ')[0]}</span>
      <span class="invite-friend__check">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17.5L20 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>
    `;
    row.appendChild(b);
  });

  const selected = new Set();
  const confirm = sheet.querySelector('#invite-confirm');
  const confirmLabel = sheet.querySelector('#invite-confirm-label');

  function refreshCta() {
    const n = selected.size;
    confirm.disabled = n === 0;
    confirmLabel.textContent = n === 0 ? 'Add to plan' : `Add ${n} friend${n === 1 ? '' : 's'}`;
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

  sheet.querySelector('#invite-share-cta').addEventListener('click', async () => {
    const dest = await nativeShareInvite({
      title: 'Join me on SosialT',
      text: 'Plan with me on SosialT. Small-group plans without the chaos.',
      url: 'https://sosialt.app/invite/anders',
    });
    if (dest) toast(frame, `Invite handed off to ${destinationLabel(dest)}.`);
  });

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
  modal.className = 'circle-modal circle-modal--v2';
  modal.innerHTML = `
    <h3 class="circle-modal__title">Save these people as a new circle?</h3>
    <p class="circle-modal__subtitle">Speeds up the next plan. We'll keep this group on tap.</p>
    <input class="circle-modal__input" id="circle-name" type="text" placeholder="Circle name (optional)" />
    <div class="circle-modal__actions circle-modal__actions--v2">
      <button class="circle-modal__btn circle-modal__btn--ghost" id="circle-skip">Not now</button>
      <button class="circle-modal__btn circle-modal__btn--save" id="circle-save">Save circle</button>
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
  const screen = document.createElement('div');
  screen.className = 'screen';
  container.innerHTML = '';
  container.appendChild(screen);
  mountInviteSheet({});
}
