/**
 * Circles list screen — expanded with edit, manage, share, and color coding.
 *
 * Each circle has a proximity/priority level that maps to a color code.
 * These colors are used in the Calendar view so users can visually sort
 * their schedule by circle importance.
 *
 * Features:
 *   - List of circles with color-coded priority badges
 *   - Tap a circle → opens detail/edit sheet
 *   - Share circle → generates a shareable link (prototype: copy toast)
 *   - Edit members, name, color
 *   - "+ New" creates a new circle
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';
import { contactsPrimingNeeded, buildContactsPrimingCard } from '../lib/contactsAccess.js';

const PRIORITY_LEVELS = [
  { id: 'family', label: 'Family',   color: '#E8C547', desc: 'Closest people, highest signal' },
  { id: 'friends',label: 'Friends',  color: '#C49E7A', desc: 'Your regular crowd' },
  { id: 'casual', label: 'Casual',   color: '#7BA0C4', desc: 'Looser touch, still yours' },
  { id: 'open',   label: 'Open',     color: '#D4849A', desc: 'Public or neighbourhood' },
];

const CIRCLES = [
  {
    id: 'inner-circle',
    name: 'Inner Circle',
    members: [
      { name: 'Sarah K.', initial: 'S', color: '#E8C547' },
      { name: 'Marcus L.', initial: 'M', color: '#C49E7A' },
      { name: 'Emma W.', initial: 'E', color: '#8A7E72' },
      { name: 'Jonas B.', initial: 'J', color: '#6FA786' },
      { name: 'Nora A.', initial: 'N', color: '#F5D04E' },
      { name: 'Anders S.', initial: 'A', color: '#7BA0C4' },
    ],
    lastLine: 'Coffee Meetup on Sunday.',
    tones: ['#C49E7A', '#8A7E72', '#E8C547'],
    glyph: '◉',
    priority: 'family',
  },
  {
    id: 'brunch-pals',
    name: 'Brunch Pals',
    members: [
      { name: 'Sarah K.', initial: 'S', color: '#E8C547' },
      { name: 'Emma W.', initial: 'E', color: '#8A7E72' },
      { name: 'Nora A.', initial: 'N', color: '#F5D04E' },
      { name: 'Lena R.', initial: 'L', color: '#C49E7A' },
    ],
    lastLine: 'Plotting next weekend.',
    tones: ['#E8C547', '#D4A853', '#C49E7A'],
    glyph: '✸',
    priority: 'friends',
  },
  {
    id: 'late-night-crew',
    name: 'Late Night Crew',
    members: [
      { name: 'Marcus L.', initial: 'M', color: '#C49E7A' },
      { name: 'Jonas B.', initial: 'J', color: '#6FA786' },
      { name: 'Anders S.', initial: 'A', color: '#7BA0C4' },
      { name: 'Kris T.', initial: 'K', color: '#8A7E72' },
      { name: 'Sigrid O.', initial: 'S', color: '#D4849A' },
    ],
    lastLine: 'Concert tickets booked.',
    tones: ['#8A7E72', '#6FA786', '#C49E7A'],
    glyph: '☾',
    priority: 'casual',
  },
  {
    id: 'work-buddies',
    name: 'Work Buddies',
    members: [
      { name: 'Lena R.', initial: 'L', color: '#C49E7A' },
      { name: 'Kris T.', initial: 'K', color: '#8A7E72' },
      { name: 'Olav M.', initial: 'O', color: '#E8C547' },
      { name: 'Ingrid S.', initial: 'I', color: '#6FA786' },
      { name: 'Per H.', initial: 'P', color: '#7BA0C4' },
      { name: 'Marta J.', initial: 'M', color: '#D4849A' },
      { name: 'Tor E.', initial: 'T', color: '#F5D04E' },
      { name: 'Hilde V.', initial: 'H', color: '#C49E7A' },
    ],
    lastLine: 'Lunch on Tuesday.',
    tones: ['#6FA786', '#C49E7A', '#E8C547'],
    glyph: '✦',
    priority: 'friends',
  },
];

function avatarStack(tones, extra) {
  const a = tones.map((c, i) => `<span class="avatar-stack__a" style="background:${c}; z-index:${10 - i}"></span>`).join('');
  return `<span class="avatar-stack">${a}${extra > 0 ? `<span class="avatar-stack__more">+${extra}</span>` : ''}</span>`;
}

function getPriority(id) {
  return PRIORITY_LEVELS.find((p) => p.id === id) || PRIORITY_LEVELS[0];
}

export function renderCircles(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({
    initials: 'AS',
    onNotifications: () => { window.location.hash = '#/notifications'; },
    onCalendar:      () => { window.location.hash = '#/calendar'; },
    onProfile:       () => { window.location.hash = '#/profile'; },
  }));

  const head = document.createElement('header');
  head.className = 'list-screen__head list-screen__head--row';
  head.innerHTML = `
    <div class="list-screen__head-text">
      <h1 class="list-screen__title">Circles</h1>
      <p class="list-screen__sub">Small groups. Big difference.</p>
    </div>
    <button class="list-screen__add" id="circles-new" aria-label="New circle">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      New
    </button>
  `;
  screen.appendChild(head);

  // Color legend — REVIEW (Workshop 5): made it explicit that this colour
  // shows up only on YOUR calendar so people know it isn't visible to
  // anyone they share circles with.
  const legend = document.createElement('div');
  legend.className = 'circle-legend';
  legend.innerHTML = `
    <span class="circle-legend__title">Calendar colour <span class="circle-legend__private">private</span></span>
    <p class="circle-legend__hint">A quiet way to spot which circle each plan belongs to. Only you see it.</p>
    <div class="circle-legend__items">
      ${PRIORITY_LEVELS.map((p) => `
        <span class="circle-legend__item">
          <span class="circle-legend__dot" style="background:${p.color}"></span>
          <span class="circle-legend__label">${p.label}</span>
        </span>
      `).join('')}
    </div>
  `;
  screen.appendChild(legend);

  const list = document.createElement('div');
  list.className = 'circle-list';
  // REVIEW (Workshop 5): replaced the visible "Family / Friends / Casual / Open"
  // ranking text with a small calendar dot so the host can still match colours
  // at a glance without anything that reads like a social ranking. The dot is
  // only present in the host's own list.
  CIRCLES.forEach((c) => {
    const priority = getPriority(c.priority);
    const row = document.createElement('button');
    row.className = 'circle-row';
    const extra = Math.max(0, c.members.length - c.tones.length);
    row.innerHTML = `
      <span class="circle-row__avatar" style="background: linear-gradient(135deg, ${c.tones[0]} 0%, ${c.tones[1]} 100%);">
        <span class="circle-row__glyph">${c.glyph}</span>
      </span>
      <span class="circle-row__body">
        <span class="circle-row__topline">
          <span class="circle-row__name">${c.name}</span>
          <span class="circle-row__cal-dot" style="background:${priority.color}" aria-label="Your private calendar colour"></span>
        </span>
        <span class="circle-row__last">${c.lastLine}</span>
        <span class="circle-row__bottom">
          <span class="circle-row__stack">${avatarStack(c.tones, extra)}</span>
          <span class="circle-row__count">${c.members.length} members</span>
        </span>
      </span>
      <svg class="circle-row__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    `;
    row.addEventListener('click', () => {
      openCircleDetail(screen, c);
    });
    list.appendChild(row);
  });
  screen.appendChild(list);

  head.querySelector('#circles-new').addEventListener('click', () => {
    openCircleDetail(screen, null);
  });

  mountBottomNav({ active: 'circles' });
  container.appendChild(screen);
}

function openCircleDetail(screen, circle) {
  // Remove any existing detail sheet
  document.querySelectorAll('.circle-detail-backdrop, .circle-detail-sheet').forEach((n) => n.remove());

  const isNew = !circle;
  const data = circle || {
    id: 'new-circle',
    name: '',
    members: [],
    priority: 'friends',
    glyph: '◉',
    tones: ['#E8C547', '#D4A853'],
  };

  const priority = getPriority(data.priority);

  const backdrop = document.createElement('div');
  backdrop.className = 'circle-detail-backdrop';

  const sheet = document.createElement('div');
  sheet.className = 'circle-detail-sheet';

  // REVIEW (Workshop 5):
  //  - Priority section moved to the end of the sheet (after name + members)
  //    so people set it once they're done thinking about who's in the group.
  //  - Priority is now framed as a "private" calendar color, with a clear
  //    note that it's never visible to anyone the circle is shared with.
  sheet.innerHTML = `
    <span class="circle-detail-sheet__handle"></span>
    <div class="circle-detail-sheet__head">
      <h2 class="circle-detail-sheet__title">${isNew ? 'New circle' : data.name}</h2>
      <button class="circle-detail-sheet__close" id="circle-detail-close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </div>

    ${!isNew ? `
    <div class="circle-detail-section">
      <label class="circle-detail-label">Circle name</label>
      <input class="circle-detail-input" type="text" value="${data.name}" id="circle-name-input" />
    </div>
    ` : `
    <div class="circle-detail-section">
      <label class="circle-detail-label">Circle name</label>
      <input class="circle-detail-input" type="text" placeholder="Weekend Warriors" id="circle-name-input" />
    </div>
    `}

    <div class="circle-detail-section">
      <label class="circle-detail-label">Members (${data.members.length})</label>
      <div class="circle-detail-members" id="circle-members">
        ${data.members.map((m, i) => `
          <div class="circle-detail-member" data-idx="${i}">
            <span class="circle-detail-member__av" style="background:${m.color}">${m.initial}</span>
            <span class="circle-detail-member__name">${m.name}</span>
            <button class="circle-detail-member__remove" data-remove="${i}" aria-label="Remove">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
            </button>
          </div>
        `).join('')}
        <button class="circle-detail-member circle-detail-member--add" id="circle-add-member">
          <span class="circle-detail-member__av circle-detail-member__av--add">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
          </span>
          <span class="circle-detail-member__name">Add member</span>
        </button>
      </div>
    </div>

    <div class="circle-detail-section">
      <label class="circle-detail-label">
        Calendar color <span class="circle-detail-private-pill">Private</span>
      </label>
      <p class="circle-detail-hint">Used for your calendar so you can spot which circle each plan belongs to. Only you see it, never shown to anyone you share this circle with.</p>
      <div class="circle-detail-priorities" id="circle-priorities">
        ${PRIORITY_LEVELS.map((p) => `
          <button class="circle-detail-priority${p.id === data.priority ? ' circle-detail-priority--active' : ''}" data-priority="${p.id}" style="--pri-color:${p.color}">
            <span class="circle-detail-priority__dot" style="background:${p.color}"></span>
            <span class="circle-detail-priority__info">
              <span class="circle-detail-priority__label">${p.label}</span>
              <span class="circle-detail-priority__desc">${p.desc}</span>
            </span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="circle-detail-actions">
      <button class="cta-button circle-detail-save" id="circle-save">${isNew ? 'Create circle' : 'Save changes'}</button>
      ${!isNew ? `
      <button class="circle-detail-share" id="circle-share">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        Share circle
      </button>
      <button class="circle-detail-delete" id="circle-delete">Delete circle</button>
      ` : ''}
    </div>
  `;

  const frame = document.querySelector('.device-frame');
  frame.appendChild(backdrop);
  frame.appendChild(sheet);

  function close() {
    backdrop.classList.add('circle-detail-backdrop--leaving');
    sheet.classList.add('circle-detail-sheet--leaving');
    setTimeout(() => { backdrop.remove(); sheet.remove(); }, 220);
  }

  backdrop.addEventListener('click', close);
  sheet.querySelector('#circle-detail-close').addEventListener('click', close);

  // Priority selection
  sheet.querySelector('#circle-priorities').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-priority]');
    if (!btn) return;
    sheet.querySelectorAll('.circle-detail-priority').forEach((b) => b.classList.remove('circle-detail-priority--active'));
    btn.classList.add('circle-detail-priority--active');
  });

  // Remove member (prototype visual only)
  sheet.querySelectorAll('[data-remove]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const member = btn.closest('.circle-detail-member');
      member.style.opacity = '0';
      member.style.height = '0';
      member.style.padding = '0';
      member.style.margin = '0';
      member.style.overflow = 'hidden';
      setTimeout(() => member.remove(), 200);
    });
  });

  // Add member — v7: contextual contacts priming before demo “new friend” row.
  sheet.querySelector('#circle-add-member').addEventListener('click', () => {
    if (contactsPrimingNeeded()) {
      const addEl = sheet.querySelector('#circle-add-member');
      if (!sheet.querySelector('.circle-detail__contacts-gate')) {
        const gate = document.createElement('div');
        gate.className = 'circle-detail__contacts-gate';
        gate.appendChild(buildContactsPrimingCard('circles', (allowed) => {
          if (allowed) {
            const toast = document.createElement('div');
            toast.className = 'sosialt-toast';
            toast.textContent = 'Contacts on — tap Add member again to pick someone.';
            screen.appendChild(toast);
            setTimeout(() => toast.classList.add('sosialt-toast--out'), 2000);
            setTimeout(() => toast.remove(), 2400);
          }
        }));
        addEl.parentNode.insertBefore(gate, addEl);
      }
      return;
    }
    const members = sheet.querySelector('#circle-members');
    const newMember = document.createElement('div');
    newMember.className = 'circle-detail-member';
    newMember.style.animation = 'pollOptionIn 320ms var(--ease-spring)';
    newMember.innerHTML = `
      <span class="circle-detail-member__av" style="background:#9A8E82">N</span>
      <span class="circle-detail-member__name">New friend</span>
      <button class="circle-detail-member__remove" aria-label="Remove">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    `;
    members.insertBefore(newMember, sheet.querySelector('#circle-add-member'));
    newMember.querySelector('.circle-detail-member__remove').addEventListener('click', () => {
      newMember.remove();
    });
  });

  // Save
  sheet.querySelector('#circle-save').addEventListener('click', () => {
    close();
    const toast = document.createElement('div');
    toast.className = 'sosialt-toast';
    toast.textContent = isNew ? 'Circle created' : 'Changes saved';
    screen.appendChild(toast);
    setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
    setTimeout(() => toast.remove(), 2000);
  });

  // Share — REVIEW (Workshop 5): explicit reassurance that priority/colour
  // is NOT included in what gets shared.
  const shareBtn = sheet.querySelector('#circle-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      openShareSheet(data);
    });
  }

  // Delete
  const deleteBtn = sheet.querySelector('#circle-delete');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      close();
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = 'Circle deleted';
      screen.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
      setTimeout(() => toast.remove(), 2000);
    });
  }
}

// REVIEW (Workshop 5): when sharing a circle, the recipient sees nothing
// about the host's private "Family / Friends / Casual / Open" grouping.
// The share preview here mirrors what a recipient sees in their app and in
// the link preview — name + members only. No colours, no labels.
function openShareSheet(circle) {
  document.querySelectorAll('.circle-share-bd, .circle-share-sheet').forEach((n) => n.remove());
  const frame = document.querySelector('.device-frame');
  const bd = document.createElement('div');
  bd.className = 'circle-share-bd';
  const sheet = document.createElement('section');
  sheet.className = 'circle-share-sheet';

  sheet.innerHTML = `
    <span class="circle-share-sheet__handle"></span>
    <h3 class="circle-share-sheet__title">Share "${circle.name}"</h3>
    <p class="circle-share-sheet__sub">Friends you invite will see the name and members. Your private calendar colour for this circle is <strong>not</strong> shared.</p>

    <div class="circle-share-sheet__preview">
      <span class="circle-share-sheet__preview-label">What they'll see</span>
      <div class="circle-share-sheet__row">
        <span class="circle-share-sheet__avatar" style="background: linear-gradient(135deg, ${circle.tones[0]} 0%, ${circle.tones[1] || circle.tones[0]} 100%);">
          <span class="circle-share-sheet__glyph">${circle.glyph || '◉'}</span>
        </span>
        <span class="circle-share-sheet__row-body">
          <span class="circle-share-sheet__name">${circle.name}</span>
          <span class="circle-share-sheet__count">${circle.members.length} members</span>
        </span>
      </div>
    </div>

    <div class="circle-share-sheet__actions">
      <button class="circle-share-sheet__action" data-via="link">
        <span class="circle-share-sheet__action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M10 14A5 5 0 0 0 17.5 14L20.5 11A5 5 0 0 0 13.5 4L11.6 5.9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 10A5 5 0 0 0 6.5 10L3.5 13A5 5 0 0 0 10.5 20L12.4 18.1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <span class="circle-share-sheet__action-body">
          <span class="circle-share-sheet__action-title">Copy invite link</span>
          <span class="circle-share-sheet__action-sub">Anyone with the link can join</span>
        </span>
        <svg class="circle-share-sheet__action-chev" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <button class="circle-share-sheet__action" data-via="friends">
        <span class="circle-share-sheet__action-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M16 21V19A4 4 0 0 0 12 15H6A4 4 0 0 0 2 19V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/><path d="M19 8V14M22 11H16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </span>
        <span class="circle-share-sheet__action-body">
          <span class="circle-share-sheet__action-title">Invite friends on SosialT</span>
          <span class="circle-share-sheet__action-sub">Choose people already here—or allow contacts once to pull from your address book</span>
        </span>
        <svg class="circle-share-sheet__action-chev" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  `;

  frame.appendChild(bd);
  frame.appendChild(sheet);

  function close() {
    sheet.classList.add('circle-share-sheet--leaving');
    bd.classList.add('circle-share-bd--leaving');
    setTimeout(() => { sheet.remove(); bd.remove(); }, 200);
  }
  bd.addEventListener('click', close);

  sheet.querySelectorAll('[data-via]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (btn.dataset.via === 'friends' && contactsPrimingNeeded() && !sheet.querySelector('.contacts-priming')) {
        const actions = sheet.querySelector('.circle-share-sheet__actions');
        actions.parentNode.insertBefore(
          buildContactsPrimingCard('circles', (allowed) => {
            if (allowed) {
              const toast = document.createElement('div');
              toast.className = 'sosialt-toast';
              toast.textContent = 'Contacts on — tap the action again to finish inviting.';
              frame.appendChild(toast);
              setTimeout(() => toast.classList.add('sosialt-toast--out'), 2200);
              setTimeout(() => toast.remove(), 2600);
            }
          }),
          actions,
        );
        return;
      }
      close();
      const toast = document.createElement('div');
      toast.className = 'sosialt-toast';
      toast.textContent = btn.dataset.via === 'link'
        ? 'Invite link copied. Your colour stays private.'
        : 'Friends invited. Your colour stays private.';
      frame.appendChild(toast);
      setTimeout(() => toast.classList.add('sosialt-toast--out'), 2200);
      setTimeout(() => toast.remove(), 2600);
    });
  });
}
