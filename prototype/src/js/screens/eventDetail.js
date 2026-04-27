/**
 * Event Detail screen.
 *
 * Composition:
 *   - Full-bleed hero image with a back chip and a tag pill overlay
 *   - Title + group + "Show on map" subtle link
 *   - Meta row (date, time, place)
 *   - Description
 *   - Attendees section: All / Going / Not going / Maybe segmented tabs
 *     + list of friends. The host (you) appears with a dot.
 *   - Sticky CTA row: I'm in + Open chat + share
 *
 * Wiring:
 *   - "Open chat" -> /event/:id/chat
 *   - Tap on the avatar stack -> scroll to attendees
 *   - "I'm in" toggles RSVP locally and shows a soft confirmation
 */
import { mountInviteSheet } from './inviteFriends.js';
import { goBack } from '../lib/nav.js';

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

function getAttendees(id) {
  return ATTENDEES[id] || [
    { id: 'self', name: 'You', rsvp: 'going', color: '#E8C547', host: true },
    { id: 'maya', name: 'Maya Larsen', rsvp: 'going', color: '#C49E7A' },
    { id: 'leo',  name: 'Leo Ostby', rsvp: 'maybe', color: '#8A7E72' },
  ];
}

export function getEvent(id) { return EVENTS[id]; }
export function getEventList() { return Object.entries(EVENTS).map(([id, e]) => ({ id, ...e })); }

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
  const counts = {
    all: attendees.length,
    going: attendees.filter((a) => a.rsvp === 'going').length,
    'not-going': attendees.filter((a) => a.rsvp === 'not-going').length,
    maybe: attendees.filter((a) => a.rsvp === 'maybe').length,
  };

  screen.innerHTML = `
    <button class="event-hero__back event-hero__back--sticky" id="event-back" aria-label="Back">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </button>
    <div class="event-hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(44,40,37,0.55) 100%), url('${event.image}')">
      <span class="event-hero__tag">${event.tag}</span>
    </div>

    <div class="event-body">
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

      <div class="attendees">
        <div class="attendees__head">
          <h2 class="attendees__title">Friends</h2>
          <button class="attendees__invite" id="attendees-invite">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Invite
          </button>
        </div>
        <div class="attendees__tabs" id="attendees-tabs">
          <button class="attendees__tab attendees__tab--active" data-rsvp="all">All <span>${counts.all}</span></button>
          <button class="attendees__tab" data-rsvp="going">Going <span>${counts.going}</span></button>
          <button class="attendees__tab" data-rsvp="not-going">Not going <span>${counts['not-going']}</span></button>
          <button class="attendees__tab" data-rsvp="maybe">Maybe <span>${counts.maybe}</span></button>
        </div>
        <ul class="attendees__list" id="attendees-list"></ul>
      </div>

      <div class="event-detail__cta-row event-detail__cta-row--three">
        <button class="cta-button event-detail__cta" id="event-rsvp">I'm in</button>
        <button class="event-detail__chat" id="event-chat" aria-label="Open chat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15A2 2 0 0 1 19 17H7L3 21V5A2 2 0 0 1 5 3H19A2 2 0 0 1 21 5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
        </button>
        <button class="event-detail__share" id="event-share" aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `;

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
          <span class="attendee__rsvp attendee__rsvp--${a.rsvp}">${rsvpLabel(a.rsvp)}</span>
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

  screen.querySelector('#event-back').addEventListener('click', () => {
    goBack('#/events');
  });

  screen.querySelector('#event-chat').addEventListener('click', () => {
    window.location.hash = `#/event/${id}/chat`;
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

  const rsvp = screen.querySelector('#event-rsvp');
  rsvp.addEventListener('click', () => {
    if (rsvp.classList.contains('cta-button--success')) {
      rsvp.classList.remove('cta-button--success');
      rsvp.textContent = "I'm in";
      return;
    }
    rsvp.classList.add('cta-button--success');
    rsvp.textContent = "You're in";
  });

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
