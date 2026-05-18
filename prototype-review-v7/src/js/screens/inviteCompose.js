/**
 * REVIEW (Workshop 6) — Invite-friend-not-on-app, end-to-end.
 *
 * Reachable from:
 *   - invite sheet -> "Add new friend"
 *   - screens panel -> "Invite a friend (SMS)"
 *
 * Flow on this screen:
 *   1. Contacts grouped into "On SosialT" (already in-app) and
 *      "Not on SosialT yet" (the targets for invitation).
 *   2. Tap a "not on SosialT" contact -> selection toggles.
 *   3. CTA: "Send invite (N)" reveals an iOS-style preview of the SMS
 *      that will be sent, with a fake sosialt.app/invite/[id] link.
 *   4. Confirm -> toast "Invites sent" -> back to wherever the user came
 *      from.
 *
 * Recipient side (already exists):
 *   sosialt.app/invite/friend/:id -> friendInvite.js landing page
 *   -> onboarding -> new-user home.
 */
import { createHeader } from '../components/header.js';
import { goBack } from '../lib/nav.js';
import { nativeShareInvite, destinationLabel } from '../lib/nativeShare.js';
import { contactsPrimingNeeded, buildContactsPrimingCard } from '../lib/contactsAccess.js';

const CONTACTS = [
  // On SosialT already.
  { id: 'eleanor',  name: 'Eleanor Whitfield', phone: '+47 412 87 5320', onApp: true,  color: '#C49E7A' },
  { id: 'rupert',   name: 'Rupert Ashworth',    phone: '+47 489 14 0210', onApp: true,  color: '#8A7E72' },
  { id: 'cecily',   name: 'Cecily Ashford',     phone: '+47 921 33 8845', onApp: true,  color: '#E8C547' },
  // Not on SosialT yet.
  { id: 'maja',     name: 'Maja Lindberg',      phone: '+47 466 77 1928', onApp: false, color: '#D4849A' },
  { id: 'tobias',   name: 'Tobias Berg',        phone: '+47 938 04 5577', onApp: false, color: '#7BA0C4' },
  { id: 'hilde',    name: 'Hilde Solberg',      phone: '+47 412 09 6354', onApp: false, color: '#6FA786' },
  { id: 'oliver',   name: 'Oliver Hansen',      phone: '+47 488 22 1190', onApp: false, color: '#B98C5E' },
  { id: 'astrid',   name: 'Astrid Mikkelsen',   phone: '+47 951 67 4023', onApp: false, color: '#7E8DA8' },
];

export function renderInviteCompose(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen invite-compose';

  screen.appendChild(createHeader('Invite a friend to SosialT'));

  const intro = document.createElement('p');
  intro.className = 'invite-compose__intro';
  intro.textContent = 'Share the link the way you already chat, or pick people below once contacts are enabled—we pre-fill the message, you tap send.';
  screen.appendChild(intro);

  if (contactsPrimingNeeded()) {
    const gate = document.createElement('div');
    gate.className = 'invite-compose__gate';
    gate.appendChild(buildContactsPrimingCard('contactsOffApp'));
    screen.appendChild(gate);
  }
  linkBar.className = 'invite-compose__link-bar';
  linkBar.innerHTML = `
    <button type="button" class="invite-compose__copy-btn" id="invite-share-open">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      Invite friends
    </button>
    <span class="invite-compose__link-bar-hint">Opens your share sheet: SMS, WhatsApp, Messenger, Mail…</span>
  `;
  screen.appendChild(linkBar);
  linkBar.querySelector('#invite-share-open').addEventListener('click', async () => {
    const dest = await nativeShareInvite({
      title: 'Join me on SosialT',
      text: 'Plan with me on SosialT. Small-group plans without the chaos.',
      url: 'https://sosialt.app/invite/anders',
    });
    if (!dest) return;
    const toast = document.createElement('div');
    toast.className = 'sosialt-toast';
    toast.textContent = `Invite handed off to ${destinationLabel(dest)}.`;
    screen.appendChild(toast);
    setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
    setTimeout(() => toast.remove(), 2000);
  });

  const onApp = CONTACTS.filter((c) => c.onApp);
  const offApp = CONTACTS.filter((c) => !c.onApp);

  // Section: not on SosialT yet (these are the targets).
  const offSection = document.createElement('div');
  offSection.className = 'invite-compose__section';
  offSection.innerHTML = `
    <p class="invite-compose__section-label">Pre-target the share sheet \u00b7 not on SosialT yet</p>
  `;
  const offList = document.createElement('ul');
  offList.className = 'invite-compose__list';
  const selected = new Set();

  offApp.forEach((c) => {
    const li = document.createElement('li');
    li.className = 'invite-compose__row';
    li.innerHTML = `
      <span class="invite-compose__avatar" style="background:${c.color}">${c.name[0]}</span>
      <span class="invite-compose__body">
        <span class="invite-compose__name">${c.name}</span>
        <span class="invite-compose__phone">${c.phone}</span>
      </span>
      <span class="invite-compose__check"></span>
    `;
    li.addEventListener('click', () => {
      if (selected.has(c.id)) {
        selected.delete(c.id);
        li.classList.remove('invite-compose__row--selected');
      } else {
        selected.add(c.id);
        li.classList.add('invite-compose__row--selected');
      }
      refreshCta();
    });
    offList.appendChild(li);
  });
  offSection.appendChild(offList);
  screen.appendChild(offSection);

  // Section: already on SosialT (read-only context).
  const onSection = document.createElement('div');
  onSection.className = 'invite-compose__section';
  onSection.innerHTML = `<p class="invite-compose__section-label">Already on SosialT</p>`;
  const onList = document.createElement('ul');
  onList.className = 'invite-compose__list';
  onApp.forEach((c) => {
    const li = document.createElement('li');
    li.className = 'invite-compose__row invite-compose__row--ghost';
    li.innerHTML = `
      <span class="invite-compose__avatar" style="background:${c.color}">${c.name[0]}</span>
      <span class="invite-compose__body">
        <span class="invite-compose__name">${c.name}</span>
        <span class="invite-compose__phone">On SosialT</span>
      </span>
      <span class="invite-compose__badge">In-app</span>
    `;
    onList.appendChild(li);
  });
  onSection.appendChild(onList);
  screen.appendChild(onSection);

  // CTA — opens the SMS preview overlay.
  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper';
  const cta = document.createElement('button');
  cta.className = 'cta-button';
  cta.disabled = true;
  cta.textContent = 'Pick someone to invite';
  ctaWrap.appendChild(cta);
  screen.appendChild(ctaWrap);

  function refreshCta() {
    const n = selected.size;
    cta.disabled = n === 0;
    cta.textContent = n === 0 ? 'Pick someone to invite' : `Send invite${n === 1 ? '' : 's'} (${n})`;
  }

  cta.addEventListener('click', async () => {
    if (selected.size === 0) return;
    const targets = [...selected].map((id) => CONTACTS.find((c) => c.id === id)).filter(Boolean);
    const names = targets.map((t) => t.name.split(' ')[0]);
    const dest = await nativeShareInvite({
      title: `Invite ${names.join(', ')} to SosialT`,
      text: `Hey ${names.join(', ')}, join me on SosialT so we can plan stuff together.`,
      url: `https://sosialt.app/invite/anders-${Date.now().toString(36).slice(-4)}`,
    });
    if (dest) {
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = `Invite${targets.length === 1 ? '' : 's'} handed off to ${destinationLabel(dest)}.`;
      screen.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 1800);
      setTimeout(() => { toast.remove(); goBack('#/'); }, 2200);
    }
  });

  container.appendChild(screen);
}

// Legacy SMS preview overlay — kept for reference but no longer used now
// that the native share sheet covers the same flow.
// eslint-disable-next-line no-unused-vars
function showSmsPreview(host, targets) {
  document.querySelectorAll('.invite-sms, .invite-sms-bd').forEach((n) => n.remove());

  const bd = document.createElement('div');
  bd.className = 'invite-sms-bd';

  const sheet = document.createElement('div');
  sheet.className = 'invite-sms';

  // Mock invite link — same shape as the existing recipient-side route.
  const linkPath = `#/invite/friend/anders-${Date.now().toString(36).slice(-4)}`;
  const link = `sosialt.app/${linkPath.replace(/^#\//, '')}`;
  const preview = `Hey \u2014 join me on SosialT so we can plan stuff together. ${link}`;

  sheet.innerHTML = `
    <span class="invite-sms__handle"></span>
    <h3 class="invite-sms__title">Send via Messages</h3>
    <p class="invite-sms__sub">SosialT will draft this for you. You'll send it from your own number.</p>

    <div class="invite-sms__targets">
      ${targets.map((t) => `<span class="invite-sms__chip"><span class="invite-sms__chip-av" style="background:${t.color}">${t.name[0]}</span>${t.name.split(' ')[0]}</span>`).join('')}
    </div>

    <div class="invite-sms__bubble-wrap">
      <span class="invite-sms__bubble-from">To ${targets.map((t) => t.name.split(' ')[0]).join(', ')}</span>
      <span class="invite-sms__bubble">${preview}</span>
    </div>

    <div class="invite-sms__actions">
      <button class="invite-sms__btn invite-sms__btn--ghost" id="invite-sms-cancel">Cancel</button>
      <button class="invite-sms__btn invite-sms__btn--primary" id="invite-sms-send">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 11L21 3L13 21L11 13L3 11Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        Send invite${targets.length === 1 ? '' : 's'}
      </button>
    </div>
  `;

  host.appendChild(bd);
  host.appendChild(sheet);

  function close() {
    sheet.classList.add('invite-sms--leaving');
    bd.classList.add('invite-sms-bd--leaving');
    setTimeout(() => { sheet.remove(); bd.remove(); }, 200);
  }
  sheet.querySelector('#invite-sms-cancel').addEventListener('click', close);
  bd.addEventListener('click', close);

  sheet.querySelector('#invite-sms-send').addEventListener('click', () => {
    close();
    // Confirmation toast.
    const toast = document.createElement('div');
    toast.className = 'sosialt-toast';
    toast.textContent = `Invite${targets.length === 1 ? '' : 's'} sent. They'll get a text shortly.`;
    host.appendChild(toast);
    setTimeout(() => toast.classList.add('sosialt-toast--out'), 1800);
    setTimeout(() => {
      toast.remove();
      // Provide a quick "preview the recipient view" affordance via the
      // screens panel; otherwise we just go back to the previous screen.
      goBack('#/');
    }, 2200);
  });
}
