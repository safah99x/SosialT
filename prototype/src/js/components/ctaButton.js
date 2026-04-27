/**
 * CTA Button — warm micro-gradient, full-width rounded
 */
export function createCTAButton(label, onClick) {
  const btn = document.createElement('button');
  btn.className = 'cta-button';
  btn.id = 'cta-button';
  btn.textContent = label;

  btn.addEventListener('click', () => {
    // Micro-animation feedback
    btn.classList.add('cta-button--pressed');
    setTimeout(() => btn.classList.remove('cta-button--pressed'), 200);
    onClick && onClick();
  });

  return btn;
}
