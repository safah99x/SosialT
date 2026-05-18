/**
 * REVIEW (Workshop 9): fake “already using the app” navigation count for demos.
 */
import { getSession, setSession } from './session.js';

const STORAGE_COUNT = 'sosialt_proto_nav_count';

const SKIP_PREFIXES = ['/onboarding', '/preferences/quiz-nudge'];

function skipPath(path) {
  const p = path || '/';
  return SKIP_PREFIXES.some((prefix) => p === prefix || p.startsWith(`${prefix}/`));
}

export function bumpProtoActivity(path) {
  if (skipPath(path)) return;
  try {
    const n = Number(sessionStorage.getItem(STORAGE_COUNT) || '0') + 1;
    sessionStorage.setItem(STORAGE_COUNT, String(n));
  } catch { /* ignore */ }
}

/** One-time auto-forward to quiz nudge for users who skipped interests in onboarding. */
export function maybeAutoQuizNudge() {
  const s = getSession();
  if (s.interestsQuizCompleted) return false;
  if (!s.interestsQuizSkipped) return false;
  if (s.quizNudgeAutoShown || s.interestsRepromptDismissed) return false;
  let n = 0;
  try {
    n = Number(sessionStorage.getItem(STORAGE_COUNT) || '0');
  } catch {
    return false;
  }
  if (n < 10) return false;
  setSession({ quizNudgeAutoShown: true });
  const current = encodeURIComponent(window.location.hash.replace(/^#/, '') || '/');
  window.location.hash = `#/preferences/quiz-nudge?return=${current}`;
  return true;
}
