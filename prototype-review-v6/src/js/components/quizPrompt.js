/**
 * REVIEW (Workshop 9): quiz re-prompt is a dedicated full-screen route
 * (`#/preferences/quiz-nudge`). This helper navigates there and exists for
 * the Screens overlay toggles (`?reprompt=1`) and any legacy call sites.
 */
import { getSession } from '../lib/session.js';

function stripRepromptFromCurrentHashForReturn() {
  let h = window.location.hash.slice(1) || '/';
  if (!h.includes('reprompt')) return encodeURIComponent(h);
  const [base, qs] = h.split('?');
  const pq = new URLSearchParams(qs || '');
  pq.delete('reprompt');
  const nextQs = pq.toString();
  const rebuilt = `${base}${nextQs ? `?${nextQs}` : ''}` || '/';
  return encodeURIComponent(rebuilt);
}

/** @returns {boolean} true if navigation fired */
export function maybeMountQuizReprompt({ force = false } = {}) {
  const s = getSession();
  if (!force) {
    if (s.interestsQuizCompleted) return false;
    if (!s.interestsQuizSkipped) return false;
    if (s.interestsRepromptDismissed) return false;
  }

  window.location.hash = `#/preferences/quiz-nudge?return=${stripRepromptFromCurrentHashForReturn()}`;
  return true;
}
