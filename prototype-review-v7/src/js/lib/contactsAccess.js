// REVIEW v7: contextual contact-access priming (never during core onboarding).
import { getSession, setSession } from './session.js';

export function contactsPrimingNeeded() {
  const s = getSession();
  return !s.contactsAllowed && !s.contactsAccessResolved;
}

export function grantContactsAccess() {
  setSession({ contactsAllowed: true, contactsAccessResolved: true });
}

/** User saw the inline explainer and chose not to sync; no more full priming cards. */
export function declineContactsAccessPriming() {
  setSession({ contactsAccessResolved: true });
}

const COPY = {
  invite: {
    title: 'See who’s already here',
    body: 'Contact access matches numbers on your phone to SosialT—only on your device—and helps you text invites. Nothing is sold or shared.',
  },
  friendsTab: {
    title: 'Spot friends faster',
    body: 'Allow contacts once to match people already on SosialT and speed up invites. You stay in control—no messages unless you send them.',
  },
  contactsOffApp: {
    title: 'Reach people not on the app yet',
    body: 'With contact access we can pre-fill SMS invites to your people. Everything stays private on your phone until you tap send.',
  },
  chat: {
    title: 'Pull in the right people',
    body: 'Contacts let you add someone from your address book to this chat in a tap. We never message them without you.',
  },
  circles: {
    title: 'Add someone from your contacts',
    body: 'One-time access helps you pick people for this circle. We don’t upload your full address book.',
  },
  bringFriends: {
    title: 'Pick friends for this plan',
    body: 'Allow contacts to choose specific people alongside your circles. Matching happens on your device.',
  },
};

/**
 * Inline priming card (not a full-screen OS dialog).
 * @param {'invite'|'friendsTab'|'contactsOffApp'|'chat'|'circles'|'bringFriends'} variant
 * @param {(allowed: boolean) => void} onResolved — true if user tapped Allow
 */
export function buildContactsPrimingCard(variant, onResolved) {
  const copy = COPY[variant] || COPY.invite;
  const card = document.createElement('div');
  card.className = 'contacts-priming';

  card.innerHTML = `
    <p class="contacts-priming__eyebrow">Contacts</p>
    <p class="contacts-priming__title">${copy.title}</p>
    <p class="contacts-priming__body">${copy.body}</p>
    <div class="contacts-priming__actions">
      <button type="button" class="contacts-priming__secondary" data-action="decline">Not now</button>
      <button type="button" class="contacts-priming__primary" data-action="allow">Allow contacts</button>
    </div>
  `;

  card.querySelector('[data-action="allow"]').addEventListener('click', () => {
    grantContactsAccess();
    onResolved?.(true);
    card.remove();
  });
  card.querySelector('[data-action="decline"]').addEventListener('click', () => {
    declineContactsAccessPriming();
    onResolved?.(false);
    card.remove();
  });

  return card;
}
