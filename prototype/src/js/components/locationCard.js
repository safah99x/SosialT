/**
 * Lightweight location card — no map
 */
export function createLocationCard(secondaryLabel = 'Current location') {
  const wrapper = document.createElement('div');
  wrapper.className = 'location-card';
  wrapper.innerHTML = `
    <button class="location-card__main" id="location-add-btn">
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
    <button class="location-card__secondary" id="location-secondary-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.8"/>
        <path d="M12 2V4M12 20V22M2 12H4M20 12H22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      </svg>
      <span>${secondaryLabel}</span>
    </button>
  `;
  return wrapper;
}
