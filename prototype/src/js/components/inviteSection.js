/**
 * Invite section — INVITE label + Circles/Friends toggle + circle list
 * Clean SVG icons instead of emojis
 */

// SVG icon templates for circle avatars
const CIRCLE_ICONS = {
  heart: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  coffee: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8H19C20.1 8 21 8.9 21 10C21 11.1 20.1 12 19 12H18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M2 8H18V13C18 16.31 15.31 19 12 19H8C4.69 19 2 16.31 2 13V8Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M6 1V4M10 1V4M14 1V4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  moon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  briefcase: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12V12.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
};

const CIRCLES = [
  { name: 'Inner Circle', icon: 'heart', members: 6 },
  { name: 'Brunch Pals', icon: 'coffee', members: 4 },
  { name: 'Late Night Crew', icon: 'moon', members: 5 },
  { name: 'Work Buddies', icon: 'briefcase', members: 8 },
];

const FRIENDS = [
  { name: 'Sarah K.', initial: 'S' },
  { name: 'Marcus L.', initial: 'M' },
  { name: 'Emma W.', initial: 'E' },
  { name: 'Jonas B.', initial: 'J' },
  { name: 'Nora A.', initial: 'N' },
];

export function createInviteSection() {
  const wrapper = document.createElement('div');
  wrapper.className = 'invite-section section';

  // Header with label + toggle
  const header = document.createElement('div');
  header.className = 'invite-section__header';
  header.innerHTML = `
    <span class="section-label">INVITE</span>
    <div class="invite-toggle" id="invite-toggle">
      <button class="invite-toggle__btn invite-toggle__btn--active" data-tab="circles">Circles</button>
      <button class="invite-toggle__btn" data-tab="friends">Friends</button>
    </div>
  `;

  // List container
  const listContainer = document.createElement('div');
  listContainer.className = 'invite-list';
  listContainer.id = 'invite-list';

  wrapper.appendChild(header);
  wrapper.appendChild(listContainer);

  // Render initial view
  renderCircles(listContainer);

  // Toggle behavior with crossfade
  const toggle = header.querySelector('#invite-toggle');
  toggle.addEventListener('click', (e) => {
    const btn = e.target.closest('.invite-toggle__btn');
    if (!btn) return;

    toggle.querySelectorAll('.invite-toggle__btn').forEach(b =>
      b.classList.remove('invite-toggle__btn--active')
    );
    btn.classList.add('invite-toggle__btn--active');

    // Crossfade animation
    listContainer.classList.remove('invite-list--entering');
    void listContainer.offsetWidth; // Force reflow
    listContainer.classList.add('invite-list--entering');

    if (btn.dataset.tab === 'circles') {
      renderCircles(listContainer);
    } else {
      renderFriends(listContainer);
    }
  });

  return wrapper;
}

function renderCircles(container) {
  container.innerHTML = '';
  CIRCLES.forEach((circle, i) => {
    const item = document.createElement('button');
    item.className = 'invite-item';
    item.setAttribute('id', `invite-circle-${i}`);
    item.style.animationDelay = `${i * 40}ms`;
    item.innerHTML = `
      <span class="invite-item__avatar">${CIRCLE_ICONS[circle.icon]}</span>
      <span class="invite-item__info">
        <span class="invite-item__name">${circle.name}</span>
        <span class="invite-item__meta">${circle.members} members</span>
      </span>
      <span class="invite-item__indicator"></span>
    `;
    item.addEventListener('click', () => {
      item.classList.toggle('invite-item--selected');
    });
    container.appendChild(item);
  });
}

function renderFriends(container) {
  container.innerHTML = '';
  FRIENDS.forEach((friend, i) => {
    const item = document.createElement('button');
    item.className = 'invite-item';
    item.setAttribute('id', `invite-friend-${i}`);
    item.style.animationDelay = `${i * 40}ms`;
    item.innerHTML = `
      <span class="invite-item__avatar invite-item__avatar--initial">${friend.initial}</span>
      <span class="invite-item__info">
        <span class="invite-item__name">${friend.name}</span>
      </span>
      <span class="invite-item__indicator"></span>
    `;
    item.addEventListener('click', () => {
      item.classList.toggle('invite-item--selected');
    });
    container.appendChild(item);
  });
}
