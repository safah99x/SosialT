// REVIEW: prototype-review only.
// Tiny in-memory session for the onboarding flow. Survives across hash
// changes but resets on full reload — exactly what we want for a demo.
const state = {
  phone: '',
  countryCode: '+47',
  otp: '',
  name: '',
  contactsAllowed: false,
  contactsExplained: false,
  /** True after Allow or “Not now” on a contextual contacts priming card (v7). */
  contactsAccessResolved: false,
  // When set, the home screen renders the new-user empty state.
  isNewUser: false,
  // REVIEW: track how the user entered onboarding so we can adapt copy
  // across welcome / empty state / contacts. One of:
  //   'cold' | 'friend' | 'circle' | 'event'
  referral: { source: 'cold', id: null, label: null },
  // Lightweight interests selection from the optional onboarding quiz.
  interests: [],
  // REVIEW (Workshop 8): tracks quiz state for the periodic re-prompt.
  interestsQuizSeen: false,
  interestsQuizCompleted: false,
  interestsQuizSkipped: false,
  // True after the user has dismissed the re-prompt modal once.
  interestsRepromptShown: false,
  // REVIEW (Workshop 9): full-screen quiz nudge (auto once + dismiss tracking).
  quizNudgeAutoShown: false,
  interestsRepromptDismissed: false,
};

export function setSession(patch) {
  Object.assign(state, patch || {});
}
export function getSession() {
  return { ...state, referral: { ...state.referral } };
}
export function setReferral(referral) {
  state.referral = { source: 'cold', id: null, label: null, ...(referral || {}) };
}
export function clearSession() {
  state.phone = '';
  state.otp = '';
  state.name = '';
  state.contactsAllowed = false;
  state.contactsExplained = false;
  state.contactsAccessResolved = false;
  state.isNewUser = false;
  state.referral = { source: 'cold', id: null, label: null };
  state.interests = [];
  state.interestsQuizSeen = false;
  state.interestsQuizCompleted = false;
  state.interestsQuizSkipped = false;
  state.interestsRepromptShown = false;
  state.quizNudgeAutoShown = false;
  state.interestsRepromptDismissed = false;
}
