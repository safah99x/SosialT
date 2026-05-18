/**
 * Public listing engagement — status + primary actions + save-to-calendar + Around-you preference thumbs.
 * `createPublicPreferenceBlock` is reused on Home carousel cards for in-feed tuning.
 */
import {
  getPublicEventState,
  setSaved,
  setSoloGoing,
  clearPublicEventState,
  getPreference,
  setPreference,
} from '../lib/publicEventState.js';
import { openSaveToCalendarSheet, downloadICSForEvents } from '../lib/calendarExport.js';

const ICON_PLAN = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="9" cy="9" r="3.5" stroke="currentColor" stroke-width="1.8"/><circle cx="16" cy="13" r="3" stroke="currentColor" stroke-width="1.8"/><path d="M3 20C3 17 5.5 14.5 9 14.5C10.5 14.5 11.8 14.9 12.8 15.7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const ICON_SOLO = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="currentColor" stroke-width="1.8"/><path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
const ICON_SAVE = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 21L12 16L5 21V5C5 3.9 5.9 3 7 3H17C18.1 3 19 3.9 19 5V21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
const ICON_EDIT = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function toast(screen, msg) {
  const t = document.createElement('div');
  t.className = 'sosialt-toast';
  t.textContent = msg;
  screen.appendChild(t);
  setTimeout(() => t.classList.add('sosialt-toast--out'), 1600);
  setTimeout(() => t.remove(), 2000);
}

/**
 * @param {{ compact?: boolean }} opts — compact: home carousel cards; taps don't bubble to parent.
 */
export function createPublicPreferenceBlock(event, id, screen, opts = {}) {
  const compact = !!opts.compact;
  const current = getPreference(id);
  const tagPhrase = event.tag ? ` · e.g. <strong>${event.tag}</strong>` : '';
  const wrap = document.createElement('div');
  wrap.className = compact
    ? 'public-engage__pref public-engage__pref--thumbs public-engage__pref--compact'
    : 'public-engage__pref public-engage__pref--thumbs';
  if (compact) {
    wrap.addEventListener('click', (e) => e.stopPropagation());
  }
  const iconUp = compact ? 22 : 28;
  const iconDown = compact ? 22 : 28;
  wrap.innerHTML = `
    <div class="public-engage__pref-copy">
      <p class="public-engage__pref-title">Better suggestions?</p>
      <p class="public-engage__pref-lede">${compact
    ? `Tunes <strong>Around you</strong>${tagPhrase}. Your taps stay private.`
    : `Shapes what shows under <strong>Around you</strong>${tagPhrase}. Guests don't see your taps.`}</p>
    </div>
    <div class="public-engage__pref-thumbs" role="group" aria-label="Cue Around-you suggestions">
      <button type="button" class="public-engage__thumb public-engage__thumb--up ${current === 'like' ? 'public-engage__thumb--on' : ''}" data-pref="like" aria-pressed="${current === 'like' ? 'true' : 'false'}">
        <span class="public-engage__thumb-icon public-engage__thumb-icon--solid" aria-hidden="true">
          <svg width="${iconUp}" height="${iconUp}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>
        </span>
        <span class="public-engage__thumb-label">More like this</span>
      </button>
      <button type="button" class="public-engage__thumb public-engage__thumb--down ${current === 'dislike' ? 'public-engage__thumb--on' : ''}" data-pref="dislike" aria-pressed="${current === 'dislike' ? 'true' : 'false'}">
        <span class="public-engage__thumb-icon public-engage__thumb-icon--solid" aria-hidden="true">
          <svg width="${iconDown}" height="${iconDown}" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>
        </span>
        <span class="public-engage__thumb-label">Less like this</span>
      </button>
    </div>
    ${compact
    ? '<p class="public-engage__pref-foot public-engage__pref-foot--compact">Same thumb again clears.</p>'
    : '<p class="public-engage__pref-foot">Tap again on the same thumb to clear.</p>'}
  `;

  wrap.querySelectorAll('[data-pref]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.pref;
      const already = getPreference(id) === next;
      setPreference(id, already ? null : next);
      wrap.querySelectorAll('[data-pref]').forEach((b) => {
        b.classList.remove('public-engage__thumb--on');
        b.setAttribute('aria-pressed', 'false');
      });
      if (!already) {
        btn.classList.add('public-engage__thumb--on');
        btn.setAttribute('aria-pressed', 'true');
      }
      toast(screen, already
        ? 'Preference cleared.'
        : next === 'like'
          ? 'We’ll show more like this.'
          : 'We’ll show fewer like this.');
    });
  });

  return wrap;
}

const THUMB_UP_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>';
const THUMB_DOWN_SVG = '<svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.58-6.59c.37-.36.59-.86.59-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/></svg>';

/** Compact thumbs for home "Ideas around you" cards (beside Explore). */
export function createHomeNearbyThumbPair(id, screen) {
  const wrap = document.createElement('div');
  wrap.className = 'nearby-card__thumb-pair';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Tune Around-you suggestions');
  wrap.addEventListener('click', (e) => e.stopPropagation());

  const current = getPreference(id);
  wrap.innerHTML = `
    <button type="button" class="nearby-card__thumb-btn nearby-card__thumb-btn--up ${current === 'like' ? 'nearby-card__thumb-btn--on' : ''}" data-pref="like" aria-label="More like this" aria-pressed="${current === 'like' ? 'true' : 'false'}">${THUMB_UP_SVG}</button>
    <button type="button" class="nearby-card__thumb-btn nearby-card__thumb-btn--down ${current === 'dislike' ? 'nearby-card__thumb-btn--on' : ''}" data-pref="dislike" aria-label="Less like this" aria-pressed="${current === 'dislike' ? 'true' : 'false'}">${THUMB_DOWN_SVG}</button>
  `;

  wrap.querySelectorAll('[data-pref]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.dataset.pref;
      const already = getPreference(id) === next;
      setPreference(id, already ? null : next);
      wrap.querySelectorAll('[data-pref]').forEach((b) => {
        b.classList.remove('nearby-card__thumb-btn--on');
        b.setAttribute('aria-pressed', 'false');
      });
      if (!already) {
        btn.classList.add('nearby-card__thumb-btn--on');
        btn.setAttribute('aria-pressed', 'true');
      }
      toast(screen, already
        ? 'Preference cleared.'
        : next === 'like'
          ? 'We’ll show more like this.'
          : 'We’ll show fewer like this.');
    });
  });

  return wrap;
}

export function mountPublicEventEngage(root, event, id, screen, helpers) {
  const { onSoloRsvp, onRefreshBottomCtas } = helpers;

  function paint() {
    root.className = 'public-engage';
    root.innerHTML = '';

    const state = getPublicEventState(id);

    if (state === 'private_plan') {
      const head = document.createElement('div');
      head.className = 'public-engage__head';
      head.innerHTML = `
        <div class="public-engage__status public-engage__status--gold">
          <span class="public-engage__status-kicker">Your crew</span>
          <span class="public-engage__status-title">Private plan started</span>
          <span class="public-engage__status-sub">Tweak time and chat in your thread. The public listing stays as-is for everyone else.</span>
        </div>
        <div class="public-engage__edit-row">
          <button type="button" class="public-engage__link-btn" id="pe-edit-plan">
            ${ICON_EDIT}<span>Edit plan details</span>
          </button>
          <button type="button" class="public-engage__link-btn" id="pe-open-private-chat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>
            <span>Open private chat</span>
          </button>
        </div>
      `;
      root.appendChild(head);
      head.querySelector('#pe-edit-plan').addEventListener('click', () => {
        window.location.hash = `#/event/${id}/bring?flow=a`;
      });
      head.querySelector('#pe-open-private-chat').addEventListener('click', () => {
        window.location.hash = `#/event/${id}/chat?private=1`;
      });
    } else if (state === 'solo') {
      const head = document.createElement('div');
      head.className = 'public-engage__head';
      head.innerHTML = `
        <div class="public-engage__status public-engage__status--solo">
          <span class="public-engage__status-kicker">You</span>
          <span class="public-engage__status-title">You're in (solo)</span>
          <span class="public-engage__status-sub">Going on your own — you can still save to calendar and browse this page anytime.</span>
        </div>
        <button type="button" class="public-engage__text-btn" id="pe-clear-solo">Switch how I'm going</button>
      `;
      root.appendChild(head);
      head.querySelector('#pe-clear-solo').addEventListener('click', () => {
        clearPublicEventState(id);
        onRefreshBottomCtas?.();
        paint();
      });
    } else if (state === 'saved') {
      const head = document.createElement('div');
      head.className = 'public-engage__head';
      head.innerHTML = `
        <div class="public-engage__status public-engage__status--saved">
          <span class="public-engage__status-kicker">Saved</span>
          <span class="public-engage__status-title">On your list</span>
          <span class="public-engage__status-sub">Commit with friends, go solo, or add to your phone calendar below.</span>
        </div>
      `;
      root.appendChild(head);
    }

    if (state !== 'private_plan') {
      const grid = document.createElement('div');
      grid.className = 'public-engage__grid';
      const canPick = state === 'none' || state === 'saved';
      const saveDone = state === 'saved';

      if (canPick) {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'public-engage__card public-engage__card--gold';
        card.innerHTML = `
          <span class="public-engage__card-icon">${ICON_PLAN}</span>
          <span class="public-engage__card-title">Plan with friends</span>
          <span class="public-engage__card-sub">Pick people, adjust time, private chat</span>
          <span class="public-engage__card-go">Start</span>
        `;
        card.addEventListener('click', () => {
          window.location.hash = `#/event/${id}/bring?flow=a`;
        });
        grid.appendChild(card);

        const soloCard = document.createElement('button');
        soloCard.type = 'button';
        soloCard.className = 'public-engage__card public-engage__card--neutral';
        soloCard.innerHTML = `
          <span class="public-engage__card-icon">${ICON_SOLO}</span>
          <span class="public-engage__card-title">I'm in solo</span>
          <span class="public-engage__card-sub">Just you on the public event</span>
          <span class="public-engage__card-go">Tap</span>
        `;
        soloCard.addEventListener('click', () => {
          setSoloGoing(id);
          onSoloRsvp?.();
          onRefreshBottomCtas?.();
          toast(screen, "You're in");
          paint();
        });
        grid.appendChild(soloCard);
      }

      const saveCard = document.createElement('button');
      saveCard.type = 'button';
      saveCard.className = 'public-engage__card public-engage__card--quiet';
      saveCard.innerHTML = `
        <span class="public-engage__card-icon">${ICON_SAVE}</span>
        <span class="public-engage__card-title">Save to My events</span>
        <span class="public-engage__card-sub">${saveDone ? 'Already bookmarked' : 'Decide later'}</span>
        <span class="public-engage__card-go">${saveDone ? 'Saved' : 'Add'}</span>
      `;
      if (!saveDone) {
        saveCard.addEventListener('click', () => {
          setSaved(id);
          onRefreshBottomCtas?.();
          toast(screen, 'Saved to My events');
          paint();
        });
      } else {
        saveCard.disabled = true;
        saveCard.classList.add('public-engage__card--done');
      }
      grid.appendChild(saveCard);
      root.appendChild(grid);
    }

    const calRow = document.createElement('div');
    calRow.className = 'public-engage__cal';
    calRow.innerHTML = `
      <button type="button" class="public-engage__cal-btn" id="pe-save-cal">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.6"/><path d="M3 10H21M8 3V7M16 3V7M9 15L11 17L15 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span>Save to phone calendar</span>
      </button>
    `;
    root.appendChild(calRow);
    calRow.querySelector('#pe-save-cal').addEventListener('click', () => {
      const ev = { ...event, id };
      openSaveToCalendarSheet({
        onConfirm: () => {
          downloadICSForEvents([ev]);
          toast(screen, 'Calendar file ready');
        },
      });
    });
    root.appendChild(createPublicPreferenceBlock(event, id, screen));
  }

  paint();
}
