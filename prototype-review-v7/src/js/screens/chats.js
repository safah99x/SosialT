/**
 * Chats list screen.
 * Each row: avatar, title, type tag, circle name, last message, optional unread badge.
 *
 * Optional filter by chat tag — compact dropdown under the filter control
 * so the thread list stays visible.
 */
import { mountBottomNav } from '../components/bottomNav.js';
import { createTopBar } from '../components/topBar.js';
import { getEvent } from './eventDetail.js';

// REVIEW (Workshop 7): chats are sorted by *latest activity*, not creation
// time. We give each seed thread a `lastActivityMin` (minutes-ago) value
// so the order stays predictable in the prototype regardless of refresh.
const THREADS = [
  { id: 'coffee-meetup', kind: 'event',  last: "Sure, let's try and we have lots to talk.", time: 'now',  unread: 2, who: 'Maya',     lastActivityMin: 0    },
  { id: 'qp-tim-wendelboe', kind: 'ping', label: 'Coffee at Tim Wendelboe', circle: 'Coffee Crew', last: "On my way \u2014 grab us a window seat?", time: '4m', unread: 1, who: 'Eleanor', avatarColor: '#E8C547', lastActivityMin: 4 },
  { id: 'morning-run',   kind: 'event',  last: 'Bring layers. Cold one tomorrow.',          time: '12m',  unread: 0, who: 'Leo',      lastActivityMin: 12   },
  { id: 'circle-college-squared', kind: 'circle', label: 'College Squared', circle: 'College Squared', last: "Ana: Anyone up for ramen Friday?", time: '1h', unread: 3, who: 'Ana', avatarColor: '#C49E7A', lastActivityMin: 60 },
  { id: 'concert-night', kind: 'event',  last: 'Tickets in the group folder.',              time: '2h',   unread: 1, who: 'Ana',      lastActivityMin: 120  },
  { id: 'chat-rosaline', kind: 'chat',   label: 'Rosaline Fairfax',         circle: '',                  last: "Up for a walk this weekend?", time: 'Sun', unread: 0, who: 'Rosaline', avatarColor: '#6FA786', lastActivityMin: 60 * 24 * 2 },
  { id: 'jazz-vigeland', kind: 'event',  last: 'Picnic blanket secured.',                   time: 'Mon',  unread: 0, who: 'Sigrid',   lastActivityMin: 60 * 24 * 3 },
];

// In-memory deletion set for this prototype session.
const deletedChats = new Set();

const KIND_META = {
  ping:   { label: 'Quick ping', cls: 'chats-row__tag--ping'   },
  event:  { label: 'Event',      cls: 'chats-row__tag--event'  },
  circle: { label: 'Circle',     cls: 'chats-row__tag--circle' },
  chat:   { label: 'Chat',       cls: 'chats-row__tag--chat'   },
};

const TAG_FILTERS = [
  { id: 'all',    label: 'All chats' },
  { id: 'ping',   label: 'Quick ping' },
  { id: 'event',  label: 'Event' },
  { id: 'circle', label: 'Circle' },
  { id: 'chat',   label: 'Chat' },
];

export function renderChats(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen home-screen';

  screen.appendChild(createTopBar({ initials: 'AS' }));

  const top = document.createElement('div');
  top.className = 'chats-top';

  const head = document.createElement('div');
  head.className = 'chats-head';
  head.innerHTML = `
    <div class="chats-head__text">
      <h1 class="chats-head__title">Chats</h1>
    </div>
    <div class="chats-head__actions">
      <button type="button" class="chats-head__new" id="chats-new" aria-label="New chat" title="New chat">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>
      </button>
      <button type="button" class="chats-head__filter" id="chats-filter-open" aria-label="Filter chats by type" aria-expanded="false" aria-haspopup="true" title="Filter">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 6H20M7 12H17M10 18H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>
  `;
  top.appendChild(head);

  const pop = document.createElement('div');
  pop.className = 'chats-filter-pop';
  pop.id = 'chats-filter-pop';
  pop.setAttribute('role', 'dialog');
  pop.setAttribute('aria-modal', 'true');
  pop.setAttribute('aria-labelledby', 'chats-filter-title');
  pop.innerHTML = `
    <div class="chats-filter-pop__header">
      <span class="chats-filter-pop__title" id="chats-filter-title">Filter</span>
      <button type="button" class="chats-filter-pop__close" id="chats-filter-close" aria-label="Close filter">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
    </div>
    <p class="chats-filter-pop__hint">Narrow by thread type. The list stays visible behind this panel.</p>
    <p class="chats-filter-pop__label">Type</p>
    <div class="chats-filter-pop__list" id="chats-tag-filters"></div>
  `;
  top.appendChild(pop);
  screen.appendChild(top);

  const list = document.createElement('div');
  list.className = 'chats-list';
  screen.appendChild(list);

  let activeFilter = 'all';
  const openBtn = head.querySelector('#chats-filter-open');
  const filterList = pop.querySelector('#chats-tag-filters');
  let outsideCloser;

  function setOpen(open) {
    pop.classList.toggle('chats-filter-pop--open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    if (outsideCloser) {
      document.removeEventListener('click', outsideCloser);
      outsideCloser = null;
    }
    if (open) {
      requestAnimationFrame(() => {
        outsideCloser = (ev) => {
          if (!top.contains(ev.target)) closeSheet();
        };
        document.addEventListener('click', outsideCloser);
      });
    }
  }

  function closeSheet() { setOpen(false); }

  function syncFilterIndicator() {
    openBtn.classList.toggle('chats-head__filter--active', activeFilter !== 'all');
  }

  TAG_FILTERS.forEach((f) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chats-filter-pop__opt';
    b.dataset.id = f.id;
    const meta = f.id === 'all' ? null : (KIND_META[f.id] || KIND_META.chat);
    b.innerHTML = `
      <span>${f.label}</span>
      <span class="chats-filter-pop__tag ${meta ? meta.cls : 'chats-filter-pop__tag--any'}">${f.id === 'all' ? 'Any' : meta.label}</span>
    `;
    if (f.id === activeFilter) b.classList.add('chats-filter-pop__opt--active');
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      activeFilter = f.id;
      filterList.querySelectorAll('.chats-filter-pop__opt').forEach((x) => x.classList.remove('chats-filter-pop__opt--active'));
      b.classList.add('chats-filter-pop__opt--active');
      syncFilterIndicator();
      paintList();
      closeSheet();
    });
    filterList.appendChild(b);
  });

  openBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!pop.classList.contains('chats-filter-pop--open'));
  });

  const newBtn = head.querySelector('#chats-new');
  if (newBtn) {
    newBtn.addEventListener('click', () => { window.location.hash = '#/chats/new'; });
  }

  pop.querySelector('#chats-filter-close').addEventListener('click', (e) => {
    e.stopPropagation();
    closeSheet();
  });

  pop.addEventListener('click', (e) => e.stopPropagation());

  function showToast(msg, action) {
    const t = document.createElement('div');
    t.className = 'sosialt-toast sosialt-toast--with-action';
    t.innerHTML = `<span>${msg}</span>`;
    if (action) {
      const a = document.createElement('button');
      a.type = 'button';
      a.className = 'sosialt-toast__action';
      a.textContent = action.label;
      a.addEventListener('click', () => {
        action.onClick();
        t.classList.add('sosialt-toast--out');
      });
      t.appendChild(a);
    }
    screen.appendChild(t);
    setTimeout(() => t.classList.add('sosialt-toast--out'), 3200);
    setTimeout(() => t.remove(), 3700);
  }

  function paintList() {
    list.innerHTML = '';
    // Sort by latest activity first.
    const sorted = [...THREADS]
      .filter((t) => !deletedChats.has(t.id))
      .sort((a, b) => (a.lastActivityMin ?? 9e9) - (b.lastActivityMin ?? 9e9));
    const visible = activeFilter === 'all'
      ? sorted
      : sorted.filter((t) => t.kind === activeFilter);

    if (!visible.length) {
      const empty = document.createElement('p');
      empty.className = 'chats-empty';
      empty.textContent = 'Nothing in this tag yet. Try another or show all chats.';
      list.appendChild(empty);
    }

    visible.forEach((t) => {
      const e = t.kind === 'event' ? getEvent(t.id) : null;
      const title = e ? e.title : (t.label || t.id);
      const rawSub = e ? (e.group || '') : (t.circle || '');
      const subtitle = rawSub.trim();
      const meta = KIND_META[t.kind] || KIND_META.chat;

      // REVIEW (Workshop 7): each row sits inside a swipe wrap that
      // reveals a Delete action when the user drags the row left.
      const wrap = document.createElement('div');
      wrap.className = 'chats-row-wrap';
      wrap.dataset.id = t.id;

      const actions = document.createElement('div');
      actions.className = 'chats-row-actions';
      actions.innerHTML = `
        <button type="button" class="chats-row-actions__btn chats-row-actions__btn--delete" aria-label="Delete chat">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7H20M10 11V17M14 11V17M5 7L6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19L19 7M9 7V4C9 3.5 9.5 3 10 3H14C14.5 3 15 3.5 15 4V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <span>Delete</span>
        </button>
      `;
      wrap.appendChild(actions);

      const row = document.createElement('button');
      row.className = 'chats-row';
      row.dataset.id = t.id;

      const avatarStyle = e
        ? `background-image:url('${e.image}')`
        : `background:${t.avatarColor || '#C49E7A'}`;

      const subHtml = subtitle
        ? `<span class="chats-row__sub">\u2022 ${subtitle}</span>`
        : '';

      row.innerHTML = `
        <span class="chats-row__avatar" style="${avatarStyle}"></span>
        <span class="chats-row__body">
          <span class="chats-row__top">
            <span class="chats-row__title">${title}</span>
            <span class="chats-row__aside">
              <span class="chats-row__time">${t.time}</span>
              <span class="chats-row__badge-slot">
                ${t.unread ? `<span class="chats-row__unread" aria-label="${t.unread} unread">${t.unread}</span>` : ''}
              </span>
            </span>
          </span>
          <span class="chats-row__meta">
            <span class="chats-row__tag ${meta.cls}">${meta.label}</span>
            ${subHtml}
          </span>
          <span class="chats-row__msg"><strong>${t.who}:</strong> ${t.last}</span>
        </span>
      `;
      wrap.appendChild(row);

      // Click navigates only if the row is *not* currently swiped open.
      row.addEventListener('click', (ev) => {
        if (wrap.classList.contains('chats-row-wrap--open')) {
          ev.preventDefault();
          ev.stopPropagation();
          closeOpenRows();
          return;
        }
        if (suppressClick) {
          ev.preventDefault();
          ev.stopPropagation();
          return;
        }
        if (t.kind === 'event') {
          window.location.hash = `#/event/${t.id}/chat`;
        } else if (t.kind === 'circle') {
          window.location.hash = `#/circles`;
        } else {
          window.location.hash = `#/chats/thread/${t.id}`;
        }
      });

      // Delete button.
      actions.querySelector('.chats-row-actions__btn--delete').addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const snapshot = { id: t.id };
        deletedChats.add(t.id);
        paintList();
        showToast('Chat deleted', {
          label: 'Undo',
          onClick: () => {
            deletedChats.delete(snapshot.id);
            paintList();
          },
        });
      });

      attachSwipe(wrap, row);
      list.appendChild(wrap);
    });
  }

  // Pointer-based swipe-to-delete. Keeps clicks working when not swiping.
  let suppressClick = false;
  function closeOpenRows() {
    list.querySelectorAll('.chats-row-wrap--open').forEach((w) => {
      w.classList.remove('chats-row-wrap--open');
      const r = w.querySelector('.chats-row');
      if (r) r.style.transform = '';
    });
  }
  function attachSwipe(wrap, row) {
    let startX = 0;
    let dx = 0;
    let dragging = false;
    const threshold = 56;

    function onDown(ev) {
      // Only respond to the primary pointer.
      if (ev.button && ev.button !== 0) return;
      startX = ev.clientX;
      dx = 0;
      dragging = true;
      row.style.transition = 'none';
      row.setPointerCapture?.(ev.pointerId);
    }
    function onMove(ev) {
      if (!dragging) return;
      dx = ev.clientX - startX;
      if (dx > 0) dx = 0;
      if (dx < -120) dx = -120;
      if (Math.abs(dx) > 6) suppressClick = true;
      row.style.transform = `translateX(${dx}px)`;
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      row.style.transition = '';
      if (dx <= -threshold) {
        row.style.transform = 'translateX(-100px)';
        wrap.classList.add('chats-row-wrap--open');
      } else {
        row.style.transform = '';
        wrap.classList.remove('chats-row-wrap--open');
      }
      setTimeout(() => { suppressClick = false; }, 50);
    }

    row.addEventListener('pointerdown', onDown);
    row.addEventListener('pointermove', onMove);
    row.addEventListener('pointerup', onUp);
    row.addEventListener('pointercancel', onUp);
    row.addEventListener('pointerleave', (ev) => { if (dragging) onUp(ev); });
  }

  paintList();

  syncFilterIndicator();

  mountBottomNav({ active: 'chats' });
  container.appendChild(screen);
}
