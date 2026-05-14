// REVIEW: Single cold-start hero (photo + headline) — no alternate logo splash.
export function renderSplash(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen onb-screen onb-splash onb-splash--hero';

  screen.innerHTML = `
    <button class="onb-skip" id="onb-skip" type="button">Skip</button>
    <div class="onb-welcome__hero onb-splash__hero" style="background-image: linear-gradient(180deg, rgba(20,18,16,0.06) 0%, rgba(20,18,16,0.5) 55%, rgba(20,18,16,0.82) 100%), url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?auto=format&fit=crop&w=900&q=70');">
      <div class="onb-welcome__copy onb-splash__copy">
        <h1 class="onb-welcome__title">Plans with the people you actually call.</h1>
        <p class="onb-welcome__sub">Tiny groups. Real plans. No 50-message group chat. Two minutes to set up.</p>
      </div>
      <button type="button" class="cta-button onb-welcome__cta" id="onb-splash-cta">Get started</button>
    </div>
  `;

  function goPhone() {
    window.location.hash = '#/onboarding/phone';
  }

  screen.querySelector('#onb-splash-cta').addEventListener('click', goPhone);
  screen.querySelector('#onb-skip').addEventListener('click', goPhone);

  container.appendChild(screen);
}
