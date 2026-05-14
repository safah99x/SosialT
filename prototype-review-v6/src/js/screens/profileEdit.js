/**
 * REVIEW (Workshop 6) — Profile editing + photo upload, surfaced clearly.
 *
 * Replaces the previous Profile -> "Edit profile" no-op. The screen makes
 * profile-picture editing the primary affordance:
 *   - Big circular avatar with a camera badge in the bottom-right corner
 *   - Tap "Change photo" -> mock action sheet (Take photo / Choose from
 *     library / Use initials) with an instant preview swap.
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createCTAButton } from '../components/ctaButton.js';
import { goBack } from '../lib/nav.js';

const PHOTO_PRESETS = [
  // Stable Unsplash IDs — same hosts the rest of the prototype uses.
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=240&q=70',
  'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=240&q=70',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=70',
];

export function renderProfileEdit(container) {
  container.innerHTML = '';
  const screen = document.createElement('div');
  screen.className = 'screen profile-edit';

  screen.appendChild(createHeader('Edit profile'));

  let currentPhoto = ''; // empty = initials-only avatar

  const photoSection = document.createElement('div');
  photoSection.className = 'profile-edit__photo';
  photoSection.innerHTML = `
    <button class="profile-edit__avatar" id="pe-avatar" aria-label="Change profile photo">
      <span class="profile-edit__avatar-initials">AS</span>
      <span class="profile-edit__avatar-badge">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 6L9.5 4H14.5L15.5 6" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>
      </span>
    </button>
    <button class="profile-edit__change" id="pe-change">Change photo</button>
  `;
  screen.appendChild(photoSection);

  // Form fields.
  const formSec = document.createElement('div');
  formSec.className = 'profile-edit__form';

  const nameLabel = document.createElement('p');
  nameLabel.className = 'profile-edit__label';
  nameLabel.textContent = 'Name';
  formSec.appendChild(nameLabel);
  formSec.appendChild(createInputField('Anders Solberg', 'Anders Solberg'));

  const cityLabel = document.createElement('p');
  cityLabel.className = 'profile-edit__label';
  cityLabel.textContent = 'City';
  formSec.appendChild(cityLabel);
  formSec.appendChild(createInputField('Oslo', 'Oslo'));

  const bioLabel = document.createElement('p');
  bioLabel.className = 'profile-edit__label';
  bioLabel.textContent = 'A line about you';
  formSec.appendChild(bioLabel);
  formSec.appendChild(createInputField('Coffee, slow walks, Sunday brunches.', 'Coffee, slow walks, Sunday brunches.'));

  screen.appendChild(formSec);

  const ctaWrap = document.createElement('div');
  ctaWrap.className = 'cta-wrapper';
  ctaWrap.appendChild(createCTAButton('Save changes', () => {
    setTimeout(() => goBack('#/profile'), 150);
  }));
  screen.appendChild(ctaWrap);

  function openPhotoSheet() {
    document.querySelectorAll('.pe-photo-sheet, .pe-photo-bd').forEach((n) => n.remove());
    const bd = document.createElement('div');
    bd.className = 'pe-photo-bd';
    const sheet = document.createElement('div');
    sheet.className = 'pe-photo-sheet';
    sheet.innerHTML = `
      <span class="invite-sms__handle"></span>
      <h3 class="pe-photo-sheet__title">Profile photo</h3>
      <button class="pe-photo-sheet__opt" data-action="camera">
        <span class="pe-photo-sheet__opt-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="13" r="3.5" stroke="currentColor" stroke-width="1.8"/></svg></span>
        Take photo
      </button>
      <button class="pe-photo-sheet__opt" data-action="library">
        <span class="pe-photo-sheet__opt-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M21 15L16.5 10.5L5 21" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg></span>
        Choose from library
      </button>
      <button class="pe-photo-sheet__opt pe-photo-sheet__opt--ghost" data-action="initials">
        <span class="pe-photo-sheet__opt-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M9 9H15M9 12H15M9 15H13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span>
        Use initials
      </button>
      <button class="pe-photo-sheet__cancel" id="pe-cancel">Cancel</button>
    `;
    screen.appendChild(bd);
    screen.appendChild(sheet);

    function close() {
      sheet.classList.add('pe-photo-sheet--leaving');
      bd.classList.add('pe-photo-bd--leaving');
      setTimeout(() => { sheet.remove(); bd.remove(); }, 200);
    }
    bd.addEventListener('click', close);
    sheet.querySelector('#pe-cancel').addEventListener('click', close);
    sheet.querySelectorAll('.pe-photo-sheet__opt').forEach((b) => {
      b.addEventListener('click', () => {
        const action = b.dataset.action;
        if (action === 'initials') {
          currentPhoto = '';
        } else {
          // Cycle through preset photos so the user feels like the action did
          // something concrete in the prototype.
          const idx = PHOTO_PRESETS.indexOf(currentPhoto);
          currentPhoto = PHOTO_PRESETS[(idx + 1) % PHOTO_PRESETS.length];
        }
        paintAvatar();
        close();
      });
    });
  }

  function paintAvatar() {
    const avatar = screen.querySelector('#pe-avatar');
    const initials = screen.querySelector('.profile-edit__avatar-initials');
    if (currentPhoto) {
      avatar.style.backgroundImage = `url('${currentPhoto}')`;
      avatar.classList.add('profile-edit__avatar--photo');
      initials.style.opacity = '0';
    } else {
      avatar.style.backgroundImage = '';
      avatar.classList.remove('profile-edit__avatar--photo');
      initials.style.opacity = '1';
    }
  }

  screen.querySelector('#pe-avatar').addEventListener('click', openPhotoSheet);
  screen.querySelector('#pe-change').addEventListener('click', openPhotoSheet);

  container.appendChild(screen);
}
