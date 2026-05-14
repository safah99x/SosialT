/**
 * New chat: Friend options (+ contacts) plus draft-and-share link.
 */
import { createHeader } from '../components/header.js';
import { createCTAButton } from '../components/ctaButton.js';
import { nativeShareInvite, destinationLabel } from '../lib/nativeShare.js';

const ICON_PLUS = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`;

const ICON_SEARCH = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/><path d="M20 20l-3.5-3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

const CIRCLES = [
  { id: 'party', name: 'Party Crew', count: 4, color: '#E8C547' },
  { id: 'college', name: 'College Squared', count: 4, color: '#C49E7A' },
  { id: 'inner', name: 'Inner Circle', count: 3, color: '#D4849A' },
];

const FRIENDS = [
  { id: 'eleanor', name: 'Eleanor', color: '#C49E7A' },
  { id: 'rupert', name: 'Rupert', color: '#8A7E72' },
  { id: 'cecily', name: 'Cecily', color: '#E8C547' },
];

const CONTACT_PICKS = [
  { id: 'astrid', name: 'Astrid Mikkelsen', initial: 'A' },
  { id: 'ben', name: 'Ben Dahl', initial: 'B' },
  { id: 'freya', name: 'Freya Njord', initial: 'F' },
  { id: 'jonas', name: 'Jonas Prytz', initial: 'J' },
];

export function renderChatNew(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen chat-new chat-new--v4';

  screen.appendChild(createHeader('New message'));

  const friendBlock = document.createElement('div');
  friendBlock.className = 'chat-new__friend-options';
  friendBlock.innerHTML = `
    <p class="chat-new__friend-options-kicker">Friend options</p>
    <div class="chat-new__friend-options-actions">
      <button type="button" class="chat-new__friend-plus" id="chat-toggle-contacts" aria-expanded="false">
        <span class="chat-new__friend-plus-icon" aria-hidden="true">${ICON_PLUS}</span>
        <span>Add from contacts</span>
      </button>
      <button type="button" class="chat-new__friend-share" id="chat-draft-share">
        Draft message &amp; share link
      </button>
    </div>
    <div class="chat-new__contacts-panel" id="chat-contacts-panel" hidden></div>
  `;
  screen.appendChild(friendBlock);

  const panel = friendBlock.querySelector('#chat-contacts-panel');
  CONTACT_PICKS.forEach((c) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'chat-new__contact-row';
    row.dataset.filterName = c.name.toLowerCase();
    row.innerHTML = `
      <span class="chat-new__contact-av">${c.initial}</span>
      <span class="chat-new__contact-name">${c.name}</span>
      <span class="chat-new__contact-add">Add</span>
    `;
    row.addEventListener('click', () => {
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = `${c.name.split(' ')[0]} added to this chat (prototype)`;
      screen.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 1400);
      setTimeout(() => toast.remove(), 1800);
    });
    panel.appendChild(row);
  });

  const toggle = friendBlock.querySelector('#chat-toggle-contacts');
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    const next = !open;
    toggle.setAttribute('aria-expanded', String(next));
    panel.hidden = !next;
  });

  friendBlock.querySelector('#chat-draft-share').addEventListener('click', async () => {
    const dest = await nativeShareInvite({
      title: 'Join our chat on SosialT',
      text: 'Jump into this thread with me on SosialT.',
      url: 'https://sosialt.app/chat/invite/demo',
    });
    if (dest) {
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = `Opened ${destinationLabel(dest)}`;
      screen.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
      setTimeout(() => toast.remove(), 2000);
    }
  });

  const circles = document.createElement('div');
  circles.className = 'chat-new__strip';
  circles.innerHTML = '<span class="chat-new__strip-label">Circles</span>';
  const cRow = document.createElement('div');
  cRow.className = 'chat-new__strip-scroll';
  CIRCLES.forEach((c) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chat-new__chip';
    b.innerHTML = `<span style="background:${c.color}" class="chat-new__chip-dot"></span>${c.name}`;
    cRow.appendChild(b);
  });
  circles.appendChild(cRow);
  screen.appendChild(circles);

  const friends = document.createElement('div');
  friends.className = 'chat-new__list-block';

  const head = document.createElement('div');
  head.className = 'chat-new__friends-head';
  head.innerHTML = `
    <span class="chat-new__strip-label chat-new__strip-label--tight">Friends on SosialT</span>
    <button type="button" class="chat-new__friends-search-hit" id="chat-friends-search-toggle" aria-label="Search friends" aria-expanded="false">
      ${ICON_SEARCH}
    </button>
  `;
  friends.appendChild(head);

  const searchWrap = document.createElement('div');
  searchWrap.className = 'chat-new__friends-search';
  searchWrap.hidden = true;
  searchWrap.innerHTML = `
    <label class="visually-hidden" for="chat-friends-filter">Filter friends</label>
    <input type="search" class="chat-new__friends-search-field" id="chat-friends-filter" placeholder="Search friends" autocomplete="off" />
  `;
  friends.appendChild(searchWrap);

  const filterInput = searchWrap.querySelector('#chat-friends-filter');
  const searchBtn = head.querySelector('#chat-friends-search-toggle');
  searchBtn.addEventListener('click', () => {
    const open = searchBtn.getAttribute('aria-expanded') === 'true';
    const next = !open;
    searchBtn.setAttribute('aria-expanded', String(next));
    searchWrap.hidden = !next;
    if (next) {
      requestAnimationFrame(() => filterInput.focus());
    } else {
      filterInput.value = '';
      filterInput.dispatchEvent(new Event('input'));
    }
  });

  const ul = document.createElement('div');
  ul.className = 'chat-new__list';
  FRIENDS.forEach((f) => {
    const row = document.createElement('button');
    row.type = 'button';
    row.className = 'chat-new__list-row';
    row.dataset.filterName = f.name.toLowerCase();
    row.innerHTML = `
      <span class="chat-new__list-av" style="background:${f.color}">${f.name[0]}</span>
      <span class="chat-new__list-name">${f.name}</span>
      <span class="chat-new__list-chev" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </span>`;
    row.addEventListener('click', () => { window.location.hash = '#/chats/thread/new-chat'; });
    ul.appendChild(row);
  });
  friends.appendChild(ul);

  function applyFriendsFilter(q) {
    const needle = (q || '').trim().toLowerCase();
    ul.querySelectorAll('.chat-new__list-row').forEach((el) => {
      const n = el.dataset.filterName || '';
      el.hidden = Boolean(needle) && !n.includes(needle);
    });
  }

  filterInput.addEventListener('input', () => applyFriendsFilter(filterInput.value));

  screen.appendChild(friends);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper';
  ctaWrap.appendChild(createCTAButton('Start chat', () => {
    setTimeout(() => { window.location.hash = '#/chats/thread/new-chat'; }, 150);
  }));
  screen.appendChild(ctaWrap);

  container.appendChild(screen);
}
