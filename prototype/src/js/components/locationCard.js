/**
 * Location Card.
 *
 * Two states:
 *   1. Empty   — primary tile reads "Add location / Search for a place" and
 *                a small secondary chip surfaces a sensible default
 *                ("Current location" for Quick Ping, "At my place" for
 *                Create Event).
 *   2. Selected — replaced with a map-thumbnail row showing the picked
 *                 place name + sub-line, plus an Edit affordance that
 *                 reopens the picker.
 *
 * Tapping the primary tile (or any quick chip) opens the brand location
 * picker. Once a place comes back, we slot into the "selected" state.
 */
import { mountLocationPicker } from './locationPicker.js';

export function createLocationCard(secondaryLabel = 'Current location', { onPick } = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'location-card';
  let selected = null;

  function render() {
    if (!selected) {
      wrapper.innerHTML = `
        <button type="button" class="location-card__main" id="location-add-btn">
          <span class="location-card__icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="12" cy="9" r="2.5" stroke="currentColor" stroke-width="1.8"/>
            </svg>
          </span>
          <span class="location-card__text">
            <span class="location-card__title">Add location</span>
            <span class="location-card__hint">Search for a place</span>
          </span>
          <span class="location-card__arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </button>
        <button type="button" class="location-card__secondary" id="location-secondary-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
            <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
          <span>${secondaryLabel}</span>
        </button>
      `;
      wrapper.querySelector('#location-add-btn').addEventListener('click', open);
      wrapper.querySelector('#location-secondary-btn').addEventListener('click', () => {
        const initial = secondaryLabel === 'At my place'
          ? { id: 'home',    name: 'At my place',       sub: 'Bjølsen, Oslo',          kind: 'home'    }
          : { id: 'current', name: 'Current location',  sub: 'Karl Johans gate, Oslo', kind: 'current' };
        commit(initial);
      });
    } else {
      wrapper.innerHTML = `
        <button type="button" class="location-card__selected" id="location-edit-btn">
          <span class="location-card__thumb" aria-hidden="true">
            <span class="location-card__thumb-pin"></span>
          </span>
          <span class="location-card__text">
            <span class="location-card__title">${selected.name}</span>
            <span class="location-card__hint">${selected.sub || ''}</span>
          </span>
          <span class="location-card__edit">Change</span>
        </button>
      `;
      wrapper.querySelector('#location-edit-btn').addEventListener('click', open);
    }
  }

  function open() {
    mountLocationPicker({
      initial: selected,
      onPick: (place) => { commit(place); },
    });
  }

  function commit(place) {
    selected = place;
    render();
    if (onPick) onPick(place);
  }

  render();
  wrapper.getSelected = () => selected;
  return wrapper;
}
