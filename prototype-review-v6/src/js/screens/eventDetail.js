/**
 * Event Detail screen.
 *
 * Open listings ("Around you"): minimal explainer, overlap social proof row,
 * three primary actions in `publicEventEngage.js`, phone calendar in that block only.
 * Chat shortcut appears at the bottom only after "Plan with friends" creates a private thread.
 * Private circle events keep the full Friends list + RSVP strip.
 */
import { mountInviteSheet } from './inviteFriends.js';
import { goBack } from '../lib/nav.js';
import { mountPublicEventEngage } from './publicEventEngage.js';
import { getPublicEventState } from '../lib/publicEventState.js';

/** Bottom row for public listings: Chat only when a private crew thread exists (calendar lives in engage block). */
function mountPublicEventBottom(screen, _event, id) {
  const wrap = screen.querySelector('#event-public-bottom');
  if (!wrap) return;

  wrap.innerHTML = '';
  wrap.hidden = true;
  wrap.classList.add('event-detail__secondary-actions--empty');

  const state = getPublicEventState(id);

  if (state !== 'private_plan') return;

  wrap.hidden = false;
  wrap.classList.remove('event-detail__secondary-actions--empty');

  const chatBtn = document.createElement('button');
  chatBtn.type = 'button';
  chatBtn.className = 'event-detail__ghost-icon';
  chatBtn.setAttribute('aria-label', 'Open group chat');
  chatBtn.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
    <span>Chat</span>
  `;
  chatBtn.addEventListener('click', () => {
    window.location.hash = `#/event/${id}/chat?private=1`;
  });
  wrap.appendChild(chatBtn);
}

// REVIEW (Workshop 8): per-attendee thumbs icon dropped. We now show a
// small coloured dot in the label, which reads as status without the
// thumbs-up/down "rating" connotation.

function countsFromAttendees(attendees) {
  return {
    all: attendees.length,
    going: attendees.filter((a) => a.rsvp === 'going').length,
    'not-going': attendees.filter((a) => a.rsvp === 'not-going').length,
    maybe: attendees.filter((a) => a.rsvp === 'maybe').length,
  };
}

/** RSVP tallies for an event id (shared by chats, home rows, calendar). */
export function getRsvpCounts(id) {
  return countsFromAttendees(getAttendees(id));
}

// REVIEW (Workshop 6): events flagged with `publicSource: true` come from
// "Around you" — they're scraped/public listings the user can either join
// solo or *bring their own circle to* as a private gathering. The public
// source itself stays public, but the circle invite layer is private.
const EVENTS = {
  'coffee-meetup': {
    title: 'Coffee Meetup',
    group: 'Coffee Crew',
    date: 'Sun, April 5',
    time: '10:00',
    place: 'Central Park Cafe, Oslo',
    desc: 'Slow coffee. Long table. The usual suspects. No agenda beyond a second cup.',
    image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=70',
    going: 4,
    tag: 'Coffee',
  },
  'morning-run': {
    title: 'Morning Run',
    group: 'Gym Crew',
    date: 'Mon, April 20',
    time: '06:00',
    place: 'Central Park, Oslo',
    desc: '6km. No pressure. Coffee after, obviously.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=900&q=70',
    going: 4,
    tag: 'Outdoor',
  },
  'concert-night': {
    title: 'Concert Night',
    group: 'College Squared',
    date: 'Tue, April 28',
    time: '20:00',
    place: 'College Auditorium',
    desc: 'Loud. Good loud. Doors at half past, show at eight.',
    image: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=900&q=70',
    going: 4,
    tag: 'Music',
  },
  'jazz-vigeland': {
    title: 'Jazz in the Vigeland Park',
    group: 'Open to all',
    date: 'Sun, April 4',
    time: '18:00',
    place: 'Vigeland Park, Oslo',
    desc: 'Live jazz among the sculptures. Bring a blanket. Bring a friend.',
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=900&q=70',
    going: 24,
    tag: 'Music',
    publicSource: true,
    socialProofVariant: 'solo',
    friendAlsoGoing: 'Maya',
  },
  'sunday-coffee': {
    title: 'Sunday coffee chat',
    group: 'Open to all',
    date: 'Sun, March 28',
    time: '10:00',
    place: 'Grunerlokka',
    desc: 'A long table, slow conversation, and the best buns in the neighbourhood.',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=900&q=70',
    going: 12,
    tag: 'Social',
    publicSource: true,
    friendAlsoGoing: 'Leo',
  },
  'sunset-walk': {
    title: 'Sunset Beach Walk',
    group: 'Open to all',
    date: 'Fri, May 3',
    time: '19:30',
    place: 'Bygdoy',
    desc: 'A slow loop along the fjord at golden hour. Easy pace, good views, light chat.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=70',
    going: 9,
    tag: 'Outdoor',
    publicSource: true,
    friendAlsoGoing: 'Ana',
  },
  // REVIEW (Workshop 7): richer public feed (~10 swipeable items) so the
  // initial browse never feels thin. None of these add social-proof counts
  // to the *card* layer — those still live one tap deeper on detail view.
  'aker-brygge-popup': {
    title: 'Aker Brygge food pop-up',
    group: 'Open to all',
    date: 'Sat, May 4',
    time: '17:00',
    place: 'Aker Brygge, Oslo',
    desc: 'Six chefs, one waterfront, lots of small plates. Drop in anytime.',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=70',
    going: 38,
    tag: 'Food',
    publicSource: true,
    friendAlsoGoing: 'Eleanor',
  },
  'sognsvann-ski': {
    title: 'Sognsvann ski loop',
    group: 'Open to all',
    date: 'Sat, May 11',
    time: '10:00',
    place: 'Sognsvann',
    desc: 'Classic 7km lap on prepared track. Beginners welcome, easy bail-out at the cafe.',
    image: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?auto=format&fit=crop&w=900&q=70',
    going: 14,
    tag: 'Outdoor',
    publicSource: true,
    friendAlsoGoing: 'Jonas',
  },
  'frogner-running-club': {
    title: 'Frogner running club',
    group: 'Open to all',
    date: 'Wed, May 8',
    time: '18:30',
    place: 'Frognerparken',
    desc: '5km easy pace, 8km tempo, or hang at the gate and cheer. Coffee after.',
    image: 'https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=900&q=70',
    going: 22,
    tag: 'Outdoor',
    publicSource: true,
    friendAlsoGoing: 'Nora',
  },
  'munch-after-hours': {
    title: 'Munch after hours',
    group: 'Open to all',
    date: 'Thu, May 9',
    time: '20:00',
    place: 'Munchmuseet',
    desc: 'Late opening, live string trio in the atrium, the museum mostly to yourself.',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=70',
    going: 31,
    tag: 'Culture',
    publicSource: true,
    friendAlsoGoing: 'Erik',
  },
  'mathallen-board-games': {
    title: 'Board game night at Mathallen',
    group: 'Open to all',
    date: 'Wed, May 15',
    time: '19:00',
    place: 'Mathallen',
    desc: '40+ games, drop-in tables, no pressure to commit to a 4-hour Catan.',
    image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b8a3d3?auto=format&fit=crop&w=900&q=70',
    going: 18,
    tag: 'Social',
    publicSource: true,
    friendAlsoGoing: 'Cecily',
  },
  'oslo-fjord-sauna': {
    title: 'Floating sauna at Sørenga',
    group: 'Open to all',
    date: 'Sat, May 18',
    time: '15:00',
    place: 'Sørenga',
    desc: 'Two-hour slot. Cold plunge optional, ribbing about cold plunge mandatory.',
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=70',
    going: 12,
    tag: 'Wellness',
    publicSource: true,
    friendAlsoGoing: 'Signe',
  },
  'opera-rooftop-yoga': {
    title: 'Rooftop yoga at the Opera',
    group: 'Open to all',
    date: 'Sun, May 19',
    time: '08:30',
    place: 'Oslo Opera House',
    desc: 'Slow flow on the marble slope. Mats provided. Coffee, obviously.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=70',
    going: 24,
    tag: 'Wellness',
    publicSource: true,
    friendAlsoGoing: 'Ingrid',
  },
};

const ATTENDEES = {
  'coffee-meetup': [
    { id: 'self',     name: 'You',                rsvp: 'going',     color: '#E8C547', host: true },
    { id: 'eleanor',  name: 'Eleanor Whitfield',  rsvp: 'going',     color: '#C49E7A' },
    { id: 'rupert',   name: 'Rupert Ashworth',    rsvp: 'going',     color: '#8A7E72' },
    { id: 'cecily',   name: 'Cecily Ashford',     rsvp: 'maybe',     color: '#F5D04E' },
    { id: 'rosaline', name: 'Rosaline Fairfax',   rsvp: 'not-going', color: '#6FA786' },
  ],
};

export function getAttendees(id) {
  return ATTENDEES[id] || [
    { id: 'self', name: 'You', rsvp: 'maybe', color: '#E8C547', host: false },
    { id: 'maya', name: 'Maya Larsen', rsvp: 'going', color: '#C49E7A', host: true },
    { id: 'leo',  name: 'Leo Ostby', rsvp: 'maybe', color: '#8A7E72' },
  ];
}

export function getEvent(id) { return EVENTS[id]; }
export function getEventList() { return Object.entries(EVENTS).map(([id, e]) => ({ id, ...e })); }

function firstName(full) {
  return (full || '?').split(' ')[0];
}

function overlapLabel(names, variant) {
  const n = names.length;
  if (variant === 'solo') {
    if (n === 1) return `${names[0]} is joining on their own`;
    if (n === 2) return `${names[0]} and ${names[1]} are joining on their own`;
    return `${names[0]}, ${names[1]}, and ${n - 2} others are joining on their own`;
  }
  if (n === 1) return `${names[0]} is going`;
  if (n === 2) return `${names[0]} and ${names[1]} are going`;
  return `${names[0]}, ${names[1]}, and ${n - 2} others are going`;
}

/** Lightweight overlap row for open listings (replaces full Friends / tabs block). */
function socialProofSection(attendees, event) {
  const variant = event.socialProofVariant || 'going';
  const pool = attendees.filter((a) => a.id !== 'self' && !a.host && a.rsvp === 'going');
  if (!pool.length) return '';

  const firstNames = pool.map((a) => firstName(a.name));
  const label = overlapLabel(firstNames, variant);
  const avatars = pool.slice(0, 4).map((a, i) => `
    <span class="event-social-proof__av" style="z-index:${10 - i};background:${a.color}">${(a.name[0] || '?').toUpperCase()}</span>
  `).join('');
  const detailRows = pool.map((a) => `
    <li class="event-social-proof__row">
      <span class="event-social-proof__row-av" style="background:${a.color}">${(a.name[0] || '?').toUpperCase()}</span>
      <span class="event-social-proof__row-name">${a.name}</span>
    </li>
  `).join('');

  return `
    <section class="event-social-proof" aria-label="Friends overlap">
      <button type="button" class="event-social-proof__hit" id="event-social-proof-toggle" aria-expanded="false">
        <span class="event-social-proof__stack">${avatars}</span>
        <span class="event-social-proof__label">${label}</span>
        <svg class="event-social-proof__chev" width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>
      <div class="event-social-proof__panel" id="event-social-proof-panel" hidden>
        <ul class="event-social-proof__list">${detailRows}</ul>
      </div>
    </section>
  `;
}

export function renderEventDetail(container, { id }) {
  const event = EVENTS[id];
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen event-detail';

  if (!event) {
    screen.innerHTML = `
      <header class="app-header">
        <button class="header-back" id="eb">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <span class="header-title">Not found</span>
        <span class="header-spacer"></span>
      </header>
      <p class="editorial-subtitle">That event has gone for a walk. Try another.</p>
    `;
    screen.querySelector('#eb').addEventListener('click', () => { goBack('#/events'); });
    container.appendChild(screen);
    return;
  }

  const attendees = getAttendees(id);
  const counts = countsFromAttendees(attendees);
  const isPublic = !!event.publicSource;
  const viewerIsHost = attendees.some((a) => a.id === 'self' && a.host);

  screen.innerHTML = `
    <button class="event-hero__back event-hero__back--sticky" id="event-back" aria-label="Back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="event-hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(44,40,37,0.55) 100%), url('${event.image}')">
      <span class="event-hero__tag">${event.tag}</span>
    </div>

    <div class="event-body ${isPublic ? 'event-body--public' : ''}">
      <h1 class="event-detail__title">${event.title}</h1>
      <div class="event-detail__sub">
        <span class="event-detail__group-name">${event.group}</span>
        <button class="event-detail__map-link" id="event-map">Show on map</button>
      </div>

      <div class="event-detail__meta">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${event.date}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M12 7V12L15 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${event.time}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg> ${event.place}</span>
      </div>

      <p class="event-detail__desc">${event.desc}</p>

      ${isPublic ? `<p class="event-detail__public-hint event-detail__public-hint--v2">Open listing · <a href="#/reference/how-sosialt-works" class="event-detail__ref-link">How SosialT works</a></p>` : ''}

      ${isPublic ? socialProofSection(attendees, event) : ''}

      ${isPublic ? `<div id="public-engage-root"></div>` : ''}

      ${!isPublic ? `
      <div class="attendees">
        <div class="attendees__head">
          <h2 class="attendees__title">Friends</h2>
          <div class="attendees__actions">
            <button type="button" class="attendees__chat" id="attendees-chat" aria-label="Open group chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" class="attendees__invite" id="attendees-invite">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
              Invite
            </button>
          </div>
        </div>
        <div class="attendees__tabs" id="attendees-tabs">
          <button class="attendees__tab attendees__tab--active" data-rsvp="all">All <span>${counts.all}</span></button>
          <button class="attendees__tab" data-rsvp="going">Going <span>${counts.going}</span></button>
          <button class="attendees__tab" data-rsvp="not-going">Not going <span>${counts['not-going']}</span></button>
          <button class="attendees__tab" data-rsvp="maybe">Maybe <span>${counts.maybe}</span></button>
        </div>
        <ul class="attendees__list" id="attendees-list"></ul>
      </div>` : ''}

      ${!isPublic && !viewerIsHost ? `
      <div class="event-detail__cta-row">
        <button class="cta-button event-detail__cta" id="event-rsvp">I'm in</button>
      </div>` : ''}
      ${isPublic ? `
      <div class="event-detail__secondary-actions" id="event-public-bottom"></div>` : ''}
    </div>
  `;

  if (!isPublic) {
    const list = screen.querySelector('#attendees-list');
    const tabs = screen.querySelector('#attendees-tabs');
    let active = 'all';
    function paintList() {
      const subset = active === 'all' ? attendees : attendees.filter((a) => a.rsvp === active);
      list.innerHTML = subset.map((a) => `
      <li class="attendee">
        <span class="attendee__avatar" style="background:${a.color}">${(a.name[0] || '?').toUpperCase()}</span>
        <span class="attendee__info">
          <span class="attendee__name">${a.name}${a.host ? ' <em class="attendee__host">host</em>' : ''}</span>
          <span class="attendee__rsvp attendee__rsvp--${a.rsvp}"><span class="attendee__rsvp-dot attendee__rsvp-dot--${a.rsvp}" aria-hidden="true"></span>${rsvpLabel(a.rsvp)}</span>
        </span>
        <svg class="attendee__chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </li>
    `).join('');
    }
    paintList();

    tabs.addEventListener('click', (e) => {
      const t = e.target.closest('[data-rsvp]');
      if (!t) return;
      tabs.querySelectorAll('.attendees__tab').forEach((x) => x.classList.remove('attendees__tab--active'));
      t.classList.add('attendees__tab--active');
      active = t.dataset.rsvp;
      paintList();
    });

    screen.querySelector('#attendees-invite').addEventListener('click', () => {
      mountInviteSheet({
        onConfirm: (n) => {
          const toast = document.createElement('div');
          toast.className = 'sosialt-toast';
          toast.textContent = `Invited ${n} friend${n === 1 ? '' : 's'}`;
          screen.appendChild(toast);
          setTimeout(() => toast.classList.add('sosialt-toast--out'), 1600);
          setTimeout(() => toast.remove(), 2000);
        },
      });
    });

    screen.querySelector('#attendees-chat').addEventListener('click', () => {
      window.location.hash = `#/event/${id}/chat`;
    });

    const rsvp = screen.querySelector('#event-rsvp');
    if (rsvp) {
      rsvp.addEventListener('click', () => {
        if (rsvp.classList.contains('cta-button--success')) {
          rsvp.classList.remove('cta-button--success');
          rsvp.textContent = "I'm in";
          return;
        }
        rsvp.classList.add('cta-button--success');
        rsvp.textContent = "You're in";
      });
    }
  }

  screen.querySelector('#event-back').addEventListener('click', () => {
    goBack('#/events');
  });

  if (event.publicSource) {
    mountPublicEventBottom(screen, event, id);
    const root = screen.querySelector('#public-engage-root');
    if (root) {
      mountPublicEventEngage(root, event, id, screen, {
        onSoloRsvp: () => {},
        onRefreshBottomCtas: () => mountPublicEventBottom(screen, event, id),
      });
    }
  }

  const proofToggle = screen.querySelector('#event-social-proof-toggle');
  const proofPanel = screen.querySelector('#event-social-proof-panel');
  if (proofToggle && proofPanel) {
    proofToggle.addEventListener('click', () => {
      const open = proofToggle.getAttribute('aria-expanded') === 'true';
      const next = !open;
      proofToggle.setAttribute('aria-expanded', String(next));
      proofPanel.hidden = !next;
      proofToggle.closest('.event-social-proof').classList.toggle('event-social-proof--open', next);
    });
  }

  screen.querySelector('#event-map').addEventListener('click', () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.place)}`;
    window.open(url, '_blank', 'noopener');
  });

  container.appendChild(screen);
}

function rsvpLabel(r) {
  if (r === 'going') return 'Going';
  if (r === 'not-going') return 'Not going';
  if (r === 'maybe') return 'Maybe';
  return '';
}
