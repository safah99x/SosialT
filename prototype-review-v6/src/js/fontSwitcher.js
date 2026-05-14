/**
 * Font Switcher — floating panel for font exploration.
 * Lives outside the device frame so it doesn't affect the prototype layout.
 * Loads all candidate Google Fonts upfront, then swaps CSS variables on click.
 */

const FONT_OPTIONS = [
  {
    id: 'fraunces',
    heading: "'Fraunces', Georgia, serif",
    body: "'Plus Jakarta Sans', sans-serif",
    label: 'Fraunces + Plus Jakarta Sans',
    tag: 'Current · Serif',
    note: 'Warm editorial serif. The baseline.',
  },
  {
    id: 'dm-serif',
    heading: "'DM Serif Display', Georgia, serif",
    body: "'Inter', sans-serif",
    label: 'DM Serif Display + Inter',
    tag: 'Serif',
    note: 'Classic high-contrast serif. Confident and trustworthy.',
  },
  {
    id: 'bricolage',
    heading: "'Bricolage Grotesque', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
    label: 'Bricolage Grotesque + Plus Jakarta Sans',
    tag: 'Sans-serif',
    note: 'Expressive ink-trap sans. Personality without being loud.',
  },
  {
    id: 'outfit',
    heading: "'Outfit', sans-serif",
    body: "'Inter', sans-serif",
    label: 'Outfit + Inter',
    tag: 'Sans-serif',
    note: 'Rounded geometric sans. Soft, warm, approachable.',
  },
  {
    id: 'sora',
    heading: "'Sora', sans-serif",
    body: "'Plus Jakarta Sans', sans-serif",
    label: 'Sora + Plus Jakarta Sans',
    tag: 'Sans-serif',
    note: 'Sharp geometric sans. Modern, clean, precise.',
  },
];

function injectFonts() {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = [
    'https://fonts.googleapis.com/css2?',
    'family=DM+Serif+Display:ital@0;1',
    '&family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700',
    '&family=Outfit:wght@400;500;600;700',
    '&family=Sora:wght@400;500;600;700',
    '&family=Inter:wght@400;500;600;700',
    '&display=swap',
  ].join('');
  document.head.appendChild(link);
}

function applyFont(option) {
  document.documentElement.style.setProperty('--font-heading', option.heading);
  document.documentElement.style.setProperty('--font-body', option.body);
}

export function mountFontSwitcher() {
  injectFonts();

  const panel = document.createElement('div');
  panel.id = 'font-switcher';
  panel.innerHTML = `
    <style>
      #font-switcher {
        position: fixed;
        top: 16px;
        right: 16px;
        z-index: 9999;
        background: #1a1a1a;
        border-radius: 16px;
        padding: 16px;
        width: 280px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        color: #fff;
        box-shadow: 0 12px 40px rgba(0,0,0,0.35);
        max-height: calc(100vh - 32px);
        overflow-y: auto;
      }
      #font-switcher h3 {
        margin: 0 0 4px;
        font-size: 14px;
        font-weight: 700;
        color: #fff;
        letter-spacing: -0.01em;
      }
      #font-switcher p.fs-hint {
        margin: 0 0 14px;
        font-size: 11px;
        color: #888;
        line-height: 1.4;
      }
      .fs-option {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 100%;
        padding: 12px 14px;
        background: #2a2a2a;
        border: 2px solid transparent;
        border-radius: 10px;
        cursor: pointer;
        text-align: left;
        margin-bottom: 8px;
        transition: all 150ms ease;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }
      .fs-option:hover { background: #333; }
      .fs-option--active {
        border-color: #E8C547;
        background: #2f2b1f;
      }
      .fs-option__top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
      }
      .fs-option__label {
        font-size: 13px;
        font-weight: 600;
        color: #fff;
      }
      .fs-option__tag {
        font-size: 10px;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        background: #3a3a3a;
        color: #aaa;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
      }
      .fs-option--active .fs-option__tag {
        background: #E8C547;
        color: #1a1a1a;
      }
      .fs-option__note {
        font-size: 11px;
        color: #777;
        line-height: 1.35;
      }
      .fs-counter {
        text-align: center;
        font-size: 11px;
        color: #555;
        margin-top: 4px;
      }
    </style>
    <h3>Font explorer</h3>
    <p class="fs-hint">Click to swap fonts live. Take your own screenshots.</p>
    <div id="fs-options"></div>
    <div class="fs-counter" id="fs-counter"></div>
  `;

  document.body.appendChild(panel);

  const container = panel.querySelector('#fs-options');
  const counter = panel.querySelector('#fs-counter');

  FONT_OPTIONS.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'fs-option' + (i === 0 ? ' fs-option--active' : '');
    btn.dataset.idx = i;
    btn.innerHTML = `
      <span class="fs-option__top">
        <span class="fs-option__label">${opt.label}</span>
        <span class="fs-option__tag">${opt.tag}</span>
      </span>
      <span class="fs-option__note">${opt.note}</span>
    `;
    btn.addEventListener('click', () => {
      container.querySelectorAll('.fs-option').forEach(b => b.classList.remove('fs-option--active'));
      btn.classList.add('fs-option--active');
      applyFont(opt);
      counter.textContent = `${i + 1} of ${FONT_OPTIONS.length} · ${opt.id}`;
    });
    container.appendChild(btn);
  });

  counter.textContent = `1 of ${FONT_OPTIONS.length} · fraunces`;
}
