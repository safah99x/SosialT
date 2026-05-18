/**
 * Prototype-only persistence for how the user chose to engage with a
 * public listing (Around you). Drives conditional UI on event detail.
 *
 * States: none | saved | solo | private_plan
 */
const KEY = (id) => `sosialt_pe_${id}`;
const BRANCH = (id) => `sosialt_pe_branch_${id}`;
// REVIEW (Workshop 7): preference signal per public event ('like' / 'dislike' / null).
// Captured on event detail and on Home "Ideas around you" cards.
const PREF_KEY = (id) => `sosialt_pe_pref_${id}`;

export function getPublicEventState(id) {
  try {
    return sessionStorage.getItem(KEY(id)) || 'none';
  } catch {
    return 'none';
  }
}

export function setPublicEventState(id, state) {
  try {
    sessionStorage.setItem(KEY(id), state);
  } catch { /* ignore */ }
}

/** User completed "Plan with friends" / bring flow — show "Made yours" on public card */
export function setPrivatePlan(id) {
  setPublicEventState(id, 'private_plan');
  try {
    sessionStorage.setItem(BRANCH(id), '1');
  } catch { /* ignore */ }
}

/** Listing was turned into a private plan (reference indicator in lists). */
export function hasBranchedFromPublic(id) {
  try {
    return sessionStorage.getItem(BRANCH(id)) === '1';
  } catch {
    return false;
  }
}

/** User tapped I'm in (solo on the public listing) */
export function setSoloGoing(id) {
  setPublicEventState(id, 'solo');
}

/** User bookmarked with Save */
export function setSaved(id) {
  setPublicEventState(id, 'saved');
}

export function clearPublicEventState(id) {
  try {
    sessionStorage.removeItem(KEY(id));
    sessionStorage.removeItem(BRANCH(id));
  } catch { /* ignore */ }
}

/** Listing ids the user bookmarked from public listings (Save to My events). */
export function listSavedEventIds() {
  const out = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k?.startsWith('sosialt_pe_')
          && !k.includes('_branch_')
          && !k.includes('_pref_')
          && sessionStorage.getItem(k) === 'saved') {
        out.push(k.slice('sosialt_pe_'.length));
      }
    }
  } catch { /* ignore */ }
  return out;
}

/** Preference signal for this kind of event ('like' / 'dislike' / null). */
export function getPreference(id) {
  try {
    return sessionStorage.getItem(PREF_KEY(id)) || null;
  } catch {
    return null;
  }
}

export function setPreference(id, value) {
  try {
    if (value == null) sessionStorage.removeItem(PREF_KEY(id));
    else sessionStorage.setItem(PREF_KEY(id), value);
  } catch { /* ignore */ }
}
