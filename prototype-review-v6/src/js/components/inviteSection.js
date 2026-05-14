/**
 * Invite section for Quick Ping / Create Event.
 *
 * Three pills: Circles · Friends (on SosialT) · Not on SosialT (contacts).
 * The third panel leads with a + tile for share link / other apps, then off-app contacts.
 */
import { nativeShareInvite, destinationLabel } from '../lib/nativeShare.js';

const CIRCLE_ICONS = {
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  coffee: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8H19C20.1 8 21 8.9 21 10C21 11.1 20.1 12 19 12H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2 8H18V13C18 16.31 15.31 19 12 19H8C4.69 19 2 16.31 2 13V8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 1V4M10 1V4M14 1V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12V12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const CIRCLES = [
  { id: 'inner-circle', name: 'Inner Circle', icon: 'heart', members: 6 },
  { id: 'brunch-pals', name: 'Brunch Pals', icon: 'coffee', members: 4 },
  { id: 'late-night-crew', name: 'Late Night Crew', icon: 'moon', members: 5 },
  { id: 'work-buddies', name: 'Work Buddies', icon: 'briefcase', members: 8 },
];

const PEOPLE = [
  { id: 'amira', name: 'Amira Olsen', initial: 'A', onApp: true },
  { id: 'astrid', name: 'Astrid Mikkelsen', initial: 'A', onApp: false },
  { id: 'ben', name: 'Ben Dahl', initial: 'B', onApp: false },
  { id: 'cecily', name: 'Cecily Ashford', initial: 'C', onApp: true },
  { id: 'dina', name: 'Dina Karlsen', initial: 'D', onApp: true },
  { id: 'eleanor', name: 'Eleanor Whitfield', initial: 'E', onApp: true },
  { id: 'freya', name: 'Freya Njord', initial: 'F', onApp: false },
  { id: 'gustav', name: 'Gustav Eriksen', initial: 'G', onApp: false },
  { id: 'hilde', name: 'Hilde Solberg', initial: 'H', onApp: false },
  { id: 'iris', name: 'Iris Lind', initial: 'I', onApp: true },
  { id: 'jonas', name: 'Jonas Prytz', initial: 'J', onApp: false },
  { id: 'kari', name: 'Kari Vo', initial: 'K', onApp: true },
  { id: 'leo', name: 'Leo Ostby', initial: 'L', onApp: true },
  { id: 'maja', name: 'Maja Lindberg', initial: 'M', onApp: false },
  { id: 'marcus', name: 'Marcus L.', initial: 'M', onApp: true },
  { id: 'nadia', name: 'Nadia Saeed', initial: 'N', onApp: false },
  { id: 'oliver', name: 'Oliver Hansen', initial: 'O', onApp: false },
  { id: 'petra', name: 'Petra Holt', initial: 'P', onApp: true },
  { id: 'rupert', name: 'Rupert Ashworth', initial: 'R', onApp: true },
  { id: 'sarah', name: 'Sarah K.', initial: 'S', onApp: true },
  { id: 'tobias', name: 'Tobias Berg', initial: 'T', onApp: false },
  { id: 'vera', name: 'Vera Malik', initial: 'V', onApp: false },
];

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  (document.querySelector('.screen') || document.body).appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
  setTimeout(() => t.remove(), 2000);
}

function alphabetLetterBlocks(list, renderRow) {
  const frag = document.createDocumentFragment();
  const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name));
  let currentLetter = '';
  sorted.forEach((p) => {
    const letter = (p.name[0] || '#').toUpperCase();
    if (letter !== currentLetter) {
      currentLetter = letter;
      const divider = document.createElement('div');
      divider.className = 'invite-section__letter';
      divider.textContent = letter;
      frag.appendChild(divider);
    }
    frag.appendChild(renderRow(p));
  });
  return frag;
}

export function createInviteSection() {
  const wrapper = document.createElement('div');
  wrapper.className = 'invite-section section invite-section--v5';

  const selectedCircles = new Set();
  const selectedFriends = new Set();

  const friendsOnApp = PEOPLE.filter((p) => p.onApp);
  const contactsOffApp = PEOPLE.filter((p) => !p.onApp);

  const header = document.createElement('div');
  header.className = 'invite-section__header invite-section__header--v4';
  header.innerHTML = `
    <h3 class="invite-section__heading">Who to invite</h3>
  `;
  wrapper.appendChild(header);

  const summary = document.createElement('div');
  summary.className = 'invite-section__summary';
  summary.hidden = true;
  wrapper.appendChild(summary);

  const tabsWrap = document.createElement('div');
  tabsWrap.className = 'invite-section__tabs invite-section__tabs--pills';
  [['circles', 'Circles'], ['friends', 'Friends'], ['contacts', 'Not on SosialT']].forEach(([id, label], i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'invite-section__tab' + (i === 0 ? ' invite-section__tab--active' : '');
    b.dataset.panel = id;
    b.textContent = label;
    tabsWrap.appendChild(b);
  });
  wrapper.appendChild(tabsWrap);

  const panels = document.createElement('div');
  panels.className = 'invite-section__panels';

  const pCircles = document.createElement('div');
  pCircles.className = 'invite-section__panel';
  pCircles.dataset.panel = 'circles';
  CIRCLES.forEach((circle) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'invite-item invite-item--dense';
    item.dataset.id = circle.id;
    item.innerHTML = `
      <span class="invite-item__avatar">${CIRCLE_ICONS[circle.icon]}</span>
      <span class="invite-item__info">
        <span class="invite-item__name">${circle.name}</span>
        <span class="invite-item__meta">${circle.members} people</span>
      </span>
      <span class="invite-item__indicator"></span>
    `;
    item.addEventListener('click', () => {
      const sel = item.classList.toggle('invite-item--selected');
      if (sel) selectedCircles.add(circle.id);
      else selectedCircles.delete(circle.id);
      refreshSummary();
    });
    pCircles.appendChild(item);
  });
  panels.appendChild(pCircles);

  const pFriends = document.createElement('div');
  pFriends.className = 'invite-section__panel invite-section__panel--people';
  pFriends.dataset.panel = 'friends';
  pFriends.hidden = true;

  pFriends.appendChild(alphabetLetterBlocks(friendsOnApp, (p) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'invite-item invite-item--dense';
    row.dataset.id = p.id;
    row.innerHTML = `
      <span class="invite-item__avatar invite-item__avatar--initial">${p.initial}</span>
      <span class="invite-item__info">
        <span class="invite-item__name">${p.name}</span>
      </span>
      <span class="invite-item__indicator"></span>
    `;
    row.addEventListener('click', () => {
      const sel = row.classList.toggle('invite-item--selected');
      if (sel) selectedFriends.add(p.id);
      else selectedFriends.delete(p.id);
      refreshSummary();
    });
    return row;
  }));
  panels.appendChild(pFriends);

  const pContacts = document.createElement('div');
  pContacts.className = 'invite-section__panel invite-section__panel--people';
  pContacts.dataset.panel = 'contacts';
  pContacts.hidden = true;

  const sharePlus = document.createElement('button');
  sharePlus.type = 'button';
  sharePlus.className = 'invite-section__people-cta invite-section__people-cta--v5';
  sharePlus.innerHTML = `
    <span class="invite-section__people-cta-plus" aria-hidden="true">+</span>
    <span class="invite-section__people-cta-text">
      <strong>Share link &amp; apps</strong>
      <span class="invite-section__people-cta-sub">Draft a note, then pick WhatsApp, Messages, Instagram…</span>
    </span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
  `;
  sharePlus.addEventListener('click', async () => {
    const dest = await nativeShareInvite({
      title: 'Join me on SosialT',
      text: 'Plan with me on SosialT. Small-group plans without the chaos. Worth a quick setup.',
      url: 'https://sosialt.app/invite/anders',
      onShared: () => {},
    });
    if (dest) toast(`Sent to ${destinationLabel(dest)}.`);
  });
  pContacts.appendChild(sharePlus);

  pContacts.appendChild(alphabetLetterBlocks(contactsOffApp, (p) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'invite-item invite-item--dense';
    row.dataset.id = p.id;
    row.innerHTML = `
      <span class="invite-item__avatar invite-item__avatar--initial">${p.initial}</span>
      <span class="invite-item__info">
        <span class="invite-item__name">${p.name}</span>
        <span class="invite-item__badge invite-item__badge--off">Contact</span>
      </span>
      <span class="invite-item__indicator"></span>
    `;
    row.addEventListener('click', async () => {
      const dest = await nativeShareInvite({
        title: `Invite ${p.name.split(' ')[0]} to SosialT`,
        text: `Hey ${p.name.split(' ')[0]}, join me on SosialT so we can plan stuff together.`,
        url: `https://sosialt.app/invite/${p.id}`,
      });
      if (dest) toast(`Invite handed off to ${destinationLabel(dest)}.`);
    });
    return row;
  }));
  panels.appendChild(pContacts);

  wrapper.appendChild(panels);

  tabsWrap.querySelectorAll('.invite-section__tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.panel;
      tabsWrap.querySelectorAll('.invite-section__tab').forEach((t) => t.classList.remove('invite-section__tab--active'));
      btn.classList.add('invite-section__tab--active');
      panels.querySelectorAll('.invite-section__panel').forEach((p) => {
        p.hidden = p.dataset.panel !== id;
      });
    });
  });

  function refreshSummary() {
    const n = selectedCircles.size + selectedFriends.size;
    if (!n) {
      summary.hidden = true;
      summary.innerHTML = '';
      return;
    }
    const names = [];
    selectedFriends.forEach((id) => {
      const p = PEOPLE.find((x) => x.id === id);
      if (p) names.push(p.name.split(' ')[0]);
    });
    selectedCircles.forEach((id) => {
      const c = CIRCLES.find((x) => x.id === id);
      if (c) names.push(c.name);
    });
    summary.hidden = false;
    summary.innerHTML = `
      <span class="invite-section__summary-label">In-app:</span>
      <span class="invite-section__summary-chips">${names.map((nm) => `<span class="invite-section__summary-chip">${nm}</span>`).join('')}</span>
    `;
  }

  return wrapper;
}
