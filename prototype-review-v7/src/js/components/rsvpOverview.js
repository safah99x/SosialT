/**
 * Shared RSVP overview blocks (event detail, chats, banners).
 *
 * REVIEW (Workshop 8): the thumbs-up/down/maybe symbols are gone. We
 * now use neutral label chips ("Going · Not going · Maybe") with a
 * coloured count dot for the eye to read. Cleaner, less judgemental,
 * and won't be misread as a "like" interaction.
 */

// Kept for back-compat in case other modules still import these constants.
// They now resolve to nothing visible — call sites should use the new
// helpers below for chips instead.
export const THUMB_UP = '';
export const THUMB_DOWN = '';
export const THUMB_MAYBE = '';

const LABELS = {
  going: 'Going',
  'not-going': 'Not going',
  maybe: 'Maybe',
};

/**
 * Pill row used in event detail / attendees panel.
 * @param {{ going: number, 'not-going': number, maybe: number }} counts
 */
export function rsvpOverviewHtml(counts, { rootClass = 'attendees__overview' } = {}) {
  return `
    <div class="${rootClass} rsvp-chips" aria-label="RSVP overview">
      <span class="rsvp-chip rsvp-chip--going">
        <span class="rsvp-chip__dot" aria-hidden="true"></span>
        <span class="rsvp-chip__label">${LABELS.going}</span>
        <span class="rsvp-chip__count">${counts.going}</span>
      </span>
      <span class="rsvp-chip rsvp-chip--not-going">
        <span class="rsvp-chip__dot" aria-hidden="true"></span>
        <span class="rsvp-chip__label">${LABELS['not-going']}</span>
        <span class="rsvp-chip__count">${counts['not-going']}</span>
      </span>
      <span class="rsvp-chip rsvp-chip--maybe">
        <span class="rsvp-chip__dot" aria-hidden="true"></span>
        <span class="rsvp-chip__label">${LABELS.maybe}</span>
        <span class="rsvp-chip__count">${counts.maybe}</span>
      </span>
    </div>
  `;
}

/** Tighter block for under chat headers / banners. */
export function rsvpOverviewCompactHtml(counts) {
  return rsvpOverviewHtml(counts, { rootClass: 'rsvp-chips rsvp-chips--compact' });
}

/** Single horizontal row for list rows (home, chats, calendar). */
export function rsvpMicroRowHtml(counts) {
  return `
    <span class="rsvp-micro rsvp-micro--text" aria-label="Responses: ${counts.going} going, ${counts['not-going']} not going, ${counts.maybe} maybe">
      <span class="rsvp-micro__i"><span class="rsvp-micro__dot rsvp-micro__dot--going"></span>${counts.going} going</span>
      <span class="rsvp-micro__i">${counts.maybe} maybe</span>
    </span>
  `;
}
