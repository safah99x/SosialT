/**
 * Location Picker — Google Maps / Calendar inspired but on-brand.
 *
 * Includes fuzzy search so queries like "auditorium", "park", "cafe" match
 * reliably across name, sub, and kind fields.
 */
import { mountPickerSheet } from './pickerSheet.js';

const SUGGESTIONS = [
  { id: 'current',     name: 'Current location',          sub: 'Karl Johans gate, Oslo',          kind: 'current' },
  { id: 'home',        name: 'At my place',               sub: 'Bjølsen, Oslo',                   kind: 'home'    },
  { id: 'tim',         name: 'Tim Wendelboe',             sub: 'Grüners gate 1, Grünerløkka',     kind: 'cafe'    },
  { id: 'frogner',     name: 'Frogner Park',              sub: 'Open-air, sculptures, picnic',    kind: 'park'    },
  { id: 'mathallen',   name: 'Mathallen Oslo',            sub: 'Vulkan, food hall',                kind: 'food'    },
  { id: 'aker',        name: 'Aker Brygge',               sub: 'Waterfront, dining, walks',       kind: 'water'   },
  { id: 'opera',       name: 'Operahuset',                sub: 'Bjørvika, walk on the roof',      kind: 'culture' },
  { id: 'fuglen',      name: 'Fuglen',                    sub: 'Universitetsgata, Sentrum',       kind: 'cafe'    },
  { id: 'auditorium',  name: 'College Auditorium',        sub: 'Universitetsplassen, Sentrum',    kind: 'culture' },
  { id: 'vigeland',    name: 'Vigeland Park',             sub: 'Frogner, sculptures',             kind: 'park'    },
  { id: 'grunerlokka', name: 'Grunerlokka',               sub: 'Trendy neighbourhood, cafes',     kind: 'cafe'    },
  { id: 'bygdoy',      name: 'Bygdoy Beach',              sub: 'Sandy beach, fjord views',        kind: 'water'   },
];

const RECENT = ['tim', 'frogner', 'aker'];

const ICONS = {
  current: `<path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="6" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="currentColor"/>`,
  home:    `<path d="M4 11L12 4L20 11V20A1 1 0 0 1 19 21H5A1 1 0 0 1 4 20Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M9 21V14H15V21" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
  cafe:    `<path d="M5 8H17V14A4 4 0 0 1 13 18H9A4 4 0 0 1 5 14Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M17 9H19A2 2 0 0 1 21 11V12A2 2 0 0 1 19 14H17" stroke="currentColor" stroke-width="1.8"/><path d="M8 3V5M11 3V5M14 3V5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  park:    `<path d="M12 3L4 16H20L12 3Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M8 16V21H16V16" stroke="currentColor" stroke-width="1.8"/>`,
  food:    `<path d="M5 4V12C5 13 5.5 14 7 14V21" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 4V14M13 4V14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M17 21V14C18.5 14 19 12 19 10C19 7 17.5 4 17 4V21Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`,
  water:   `<path d="M3 12C5 10 7 14 9 12S13 10 15 12S19 14 21 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 17C5 15 7 19 9 17S13 15 15 17S19 19 21 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M3 7C5 5 7 9 9 7S13 5 15 7S19 9 21 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>`,
  culture: `<path d="M4 21V10L12 4L20 10V21" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 21H20" stroke="currentColor" stroke-width="1.8"/><path d="M9 21V13H15V21" stroke="currentColor" stroke-width="1.8"/>`,
  pin:     `<path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>`,
};

function iconHtml(kind) {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none">${ICONS[kind] || ICONS.pin}</svg>`;
}

/**
 * Tonal SVG "map" art.
 */
function mapArt() {
  return `
    <svg class="loc-map__art" viewBox="0 0 360 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="loc-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F5EFE5"/>
          <stop offset="100%" stop-color="#EFE6D7"/>
        </linearGradient>
        <radialGradient id="loc-glow" cx="50%" cy="55%" r="55%">
          <stop offset="0%" stop-color="#FBF5E0" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#FBF5E0" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="loc-pin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#F2C94C"/>
          <stop offset="100%" stop-color="#D4A234"/>
        </linearGradient>
      </defs>

      <rect width="360" height="220" fill="url(#loc-bg)"/>

      <!-- Water (pale teal) flowing along the bottom-right -->
      <path d="M210,220 C260,200 300,180 360,170 L360,220 Z" fill="#E2E9E0" opacity="0.85"/>
      <path d="M260,220 C290,210 320,200 360,200 L360,220 Z" fill="#D6E0D5" opacity="0.7"/>

      <!-- Park shapes (sage) -->
      <path d="M40,30 C75,20 110,40 100,80 C95,105 60,110 35,90 C15,75 15,40 40,30 Z" fill="#D6E0CA" opacity="0.85"/>
      <path d="M250,40 C285,35 305,60 295,90 C290,105 265,108 250,95 C235,82 230,55 250,40 Z" fill="#D6E0CA" opacity="0.7"/>

      <!-- Block rectangles (tonal) -->
      <g fill="#F1E9D8" opacity="0.9">
        <rect x="120" y="30"  width="44" height="36" rx="4"/>
        <rect x="170" y="30"  width="60" height="22" rx="4"/>
        <rect x="170" y="58"  width="28" height="32" rx="4"/>
        <rect x="204" y="58"  width="26" height="18" rx="4"/>
        <rect x="120" y="72"  width="44" height="22" rx="4"/>
        <rect x="40"  y="120" width="48" height="36" rx="4"/>
        <rect x="94"  y="120" width="58" height="20" rx="4"/>
        <rect x="94"  y="146" width="32" height="22" rx="4"/>
        <rect x="132" y="146" width="60" height="22" rx="4"/>
        <rect x="200" y="120" width="48" height="48" rx="4"/>
        <rect x="254" y="120" width="46" height="22" rx="4"/>
        <rect x="254" y="148" width="28" height="20" rx="4"/>
      </g>

      <!-- Streets (warm taupe with cream halo) -->
      <g stroke="#E0D4BD" stroke-width="6" stroke-linecap="round" fill="none">
        <path d="M0,108 C90,104 270,112 360,108"/>
        <path d="M180,0 C176,80 184,140 180,220"/>
        <path d="M0,180 C120,170 240,184 360,178"/>
        <path d="M88,0 L88,220"/>
        <path d="M260,0 L260,160"/>
      </g>
      <g stroke="#C9B999" stroke-width="1.6" stroke-linecap="round" fill="none">
        <path d="M0,108 C90,104 270,112 360,108"/>
        <path d="M180,0 C176,80 184,140 180,220"/>
        <path d="M0,180 C120,170 240,184 360,178"/>
        <path d="M88,0 L88,220"/>
        <path d="M260,0 L260,160"/>
      </g>

      <!-- Glow under pin -->
      <circle cx="180" cy="120" r="80" fill="url(#loc-glow)"/>

      <!-- Pin shadow -->
      <ellipse cx="180" cy="138" rx="10" ry="3" fill="#2C2825" opacity="0.18"/>

      <!-- Pin -->
      <g class="loc-map__pin" transform="translate(180,118)">
        <path d="M0,-22 C-9,-22 -16,-15 -16,-7 C-16,3 0,18 0,18 C0,18 16,3 16,-7 C16,-15 9,-22 0,-22 Z" fill="url(#loc-pin)" stroke="#A6822B" stroke-width="0.8"/>
        <circle cx="0" cy="-7" r="4.5" fill="#FAF6F0"/>
      </g>

      <!-- Compass dot -->
      <g transform="translate(330,30)" opacity="0.9">
        <circle r="14" fill="#FFFFFF" opacity="0.85"/>
        <path d="M0,-9 L3,0 L0,9 L-3,0 Z" fill="#C49E7A"/>
        <text y="-16" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-size="9" fill="#9A8E82" font-weight="600">N</text>
      </g>
    </svg>
  `;
}

function placeRow(p, isRecent = false) {
  return `
    <button type="button" class="loc-row" data-place="${p.id}">
      <span class="loc-row__icon loc-row__icon--${p.kind}">${iconHtml(p.kind)}</span>
      <span class="loc-row__body">
        <span class="loc-row__name">${p.name}</span>
        <span class="loc-row__sub">${p.sub}${isRecent ? ' . Recent' : ''}</span>
      </span>
      <svg class="loc-row__chev" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
  `;
}

/**
 * Fuzzy match: splits query into tokens and checks if every token appears
 * somewhere in the combined searchable text (name + sub + kind).
 */
function fuzzyMatch(place, query) {
  const hay = `${place.name} ${place.sub} ${place.kind} ${place.id}`.toLowerCase();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return tokens.every((t) => hay.includes(t));
}

export function createLocationPicker({ initial, onPick } = {}) {
  const root = document.createElement('div');
  root.className = 'loc-picker';

  const initialName = initial?.name || '';
  const initialSub  = initial?.sub  || '';

  root.innerHTML = `
    <label class="loc-search">
      <svg class="loc-search__icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.8"/>
        <path d="M21 21L16.5 16.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <input
        type="text"
        class="loc-search__input"
        id="loc-search"
        placeholder="Search a place, address or neighbourhood"
        value="${initialName}"
        autocomplete="off"
      />
      <button type="button" class="loc-search__clear" id="loc-clear" aria-label="Clear" hidden>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>
      </button>
    </label>

    <div class="loc-quick">
      <button type="button" class="loc-quick__chip" data-quick="current">
        ${iconHtml('current')}
        <span>Use current</span>
      </button>
      <button type="button" class="loc-quick__chip" data-quick="home">
        ${iconHtml('home')}
        <span>At my place</span>
      </button>
      <button type="button" class="loc-quick__chip" data-quick="pin">
        ${iconHtml('pin')}
        <span>Drop a pin</span>
      </button>
    </div>

    <div class="loc-map">
      ${mapArt()}
      <div class="loc-map__readout">
        <span class="loc-map__readout-name">${initialName || 'Sentrum, Oslo'}</span>
        <span class="loc-map__readout-sub">${initialSub  || 'Tap a suggestion below or drag the map'}</span>
      </div>
    </div>

    <div class="loc-list">
      <div class="loc-list__group">
        <span class="loc-list__head">Recent</span>
        ${RECENT.map((id) => placeRow(SUGGESTIONS.find((s) => s.id === id), true)).join('')}
      </div>
      <div class="loc-list__group" id="loc-list-suggested">
        <span class="loc-list__head">Suggested in Oslo</span>
        ${SUGGESTIONS.filter((s) => !RECENT.includes(s.id) && !['current','home'].includes(s.id)).map((p) => placeRow(p)).join('')}
      </div>
    </div>
  `;

  let selected = initial || null;

  const search   = root.querySelector('#loc-search');
  const clear    = root.querySelector('#loc-clear');
  const readName = root.querySelector('.loc-map__readout-name');
  const readSub  = root.querySelector('.loc-map__readout-sub');
  const list     = root.querySelector('.loc-list');

  function pick(place) {
    selected = place;
    search.value = place.name;
    clear.hidden = !place.name;
    readName.textContent = place.name;
    readSub.textContent  = place.sub || '';
    list.querySelectorAll('.loc-row').forEach((r) => {
      r.classList.toggle('loc-row--selected', r.dataset.place === place.id);
    });
    if (onPick) onPick(place);
  }

  list.addEventListener('click', (e) => {
    const row = e.target.closest('.loc-row');
    if (!row) return;
    const p = SUGGESTIONS.find((s) => s.id === row.dataset.place);
    if (p) pick(p);
  });

  root.querySelectorAll('[data-quick]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const k = btn.dataset.quick;
      if (k === 'current') pick(SUGGESTIONS.find((s) => s.id === 'current'));
      else if (k === 'home') pick(SUGGESTIONS.find((s) => s.id === 'home'));
      else pick({ id: 'pin', name: 'Custom pin', sub: 'Dropped on the map', kind: 'pin' });
    });
  });

  // Fuzzy search: filters all rows and also dynamically creates result rows
  // for suggestions that match but weren't rendered yet.
  search.addEventListener('input', () => {
    const q = search.value.trim();
    clear.hidden = !q;

    if (!q) {
      // Reset: show all rows
      list.querySelectorAll('.loc-row').forEach((r) => { r.style.display = ''; });
      // Remove dynamic rows
      list.querySelectorAll('.loc-row--dynamic').forEach((r) => r.remove());
      return;
    }

    // Remove previous dynamic rows
    list.querySelectorAll('.loc-row--dynamic').forEach((r) => r.remove());

    // Filter existing rows
    const renderedIds = new Set();
    list.querySelectorAll('.loc-row').forEach((r) => {
      const pid = r.dataset.place;
      renderedIds.add(pid);
      const place = SUGGESTIONS.find((s) => s.id === pid);
      if (place && fuzzyMatch(place, q)) {
        r.style.display = '';
      } else {
        r.style.display = 'none';
      }
    });

    // Add dynamic rows for suggestions not currently rendered
    const suggestedGroup = list.querySelector('#loc-list-suggested');
    if (suggestedGroup) {
      SUGGESTIONS.forEach((p) => {
        if (renderedIds.has(p.id)) return;
        if (!fuzzyMatch(p, q)) return;
        const tmp = document.createElement('div');
        tmp.innerHTML = placeRow(p);
        const row = tmp.firstElementChild;
        row.classList.add('loc-row--dynamic');
        row.addEventListener('click', () => pick(p));
        suggestedGroup.appendChild(row);
      });
    }
  });

  clear.addEventListener('click', () => {
    search.value = '';
    clear.hidden = true;
    list.querySelectorAll('.loc-row').forEach((r) => { r.style.display = ''; });
    list.querySelectorAll('.loc-row--dynamic').forEach((r) => r.remove());
    search.focus();
  });

  root.getSelected = () => selected;
  return root;
}

/**
 * Convenience wrapper: opens the picker in a tall picker-sheet.
 * Resolves with the chosen place (or null if dismissed).
 */
export function mountLocationPicker({ initial, onPick } = {}) {
  return new Promise((resolve) => {
    let chosen = null;
    const picker = createLocationPicker({
      initial,
      onPick: (place) => { chosen = place; },
    });

    const sheet = mountPickerSheet({
      title: 'Where',
      content: picker,
      onClose: () => {
        if (onPick && chosen) onPick(chosen);
        resolve(chosen);
      },
    });

    sheet.element.classList.add('picker-overlay--tall');

    const save = document.createElement('button');
    save.type = 'button';
    save.className = 'picker-sheet__save';
    save.textContent = 'Set as location';
    save.addEventListener('click', () => {
      const sel = picker.getSelected();
      if (sel && onPick) onPick(sel);
      chosen = sel || chosen;
      sheet.close();
      resolve(chosen);
    });
    sheet.element.querySelector('.picker-sheet').appendChild(save);
  });
}
