/**
 * Event detail screen — opened from Upcoming rows or Events around you cards.
 * Layout: hero image -> back chip overlay -> title block -> meta -> description ->
 * who's coming -> two CTAs (RSVP + share).
 */
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
    screen.querySelector('#eb').addEventListener('click', () => { window.history.back(); });
    container.appendChild(screen);
    return;
  }

  screen.innerHTML = `
    <div class="event-hero" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.05) 40%, rgba(44,40,37,0.55) 100%), url('${event.image}')">
      <button class="event-hero__back" id="event-back" aria-label="Back">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
      <span class="event-hero__tag">${event.tag}</span>
    </div>

    <div class="event-body">
      <h1 class="event-detail__title">${event.title}</h1>
      <div class="event-detail__meta">
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M3 10H21M8 3V7M16 3V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg> ${event.date} . ${event.time}</span>
        <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/></svg> ${event.place}</span>
      </div>

      <p class="event-detail__desc">${event.desc}</p>

      <div class="event-detail__people">
        <div class="event-detail__group">
          <span class="avatar-stack">
            <span class="avatar-stack__a" style="background:#C49E7A"></span>
            <span class="avatar-stack__a" style="background:#8A7E72"></span>
            <span class="avatar-stack__a" style="background:#E8C547"></span>
            <span class="avatar-stack__more">+${event.going}</span>
          </span>
          <span class="event-detail__group-name">${event.group}</span>
        </div>
      </div>

      <div class="event-detail__cta-row">
        <button class="cta-button event-detail__cta" id="event-rsvp">I'm in</button>
        <button class="event-detail__share" id="event-share" aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12V20A2 2 0 0 0 6 22H18A2 2 0 0 0 20 20V12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M16 6L12 2L8 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 2V15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
        </button>
      </div>
    </div>
  `;

  screen.querySelector('#event-back').addEventListener('click', () => { window.history.back(); });
  const rsvp = screen.querySelector('#event-rsvp');
  rsvp.addEventListener('click', () => {
    rsvp.classList.add('cta-button--success');
    rsvp.textContent = "You're in";
    setTimeout(() => { window.location.hash = '#/quick-ping/sent'; }, 600);
  });

  container.appendChild(screen);
}
