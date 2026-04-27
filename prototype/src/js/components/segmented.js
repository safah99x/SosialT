/**
 * Segmented toggle (pill switcher).
 * Returns an element. The active value is reported via onChange.
 *
 *   createSegmented({
 *     options: [{ id: 'date', label: 'Set date' }, { id: 'poll', label: 'Create poll' }],
 *     active: 'date',
 *     onChange: (id) => {},
 *   });
 */
export function createSegmented({ options, active, onChange } = {}) {
  const wrap = document.createElement('div');
  wrap.className = 'segmented';
  wrap.setAttribute('role', 'tablist');

  options.forEach((opt) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'segmented__btn';
    b.dataset.id = opt.id;
    b.textContent = opt.label;
    b.setAttribute('role', 'tab');
    if (opt.id === active) b.classList.add('segmented__btn--active');
    b.addEventListener('click', () => {
      wrap.querySelectorAll('.segmented__btn').forEach((x) => x.classList.remove('segmented__btn--active'));
      b.classList.add('segmented__btn--active');
      onChange && onChange(opt.id);
    });
    wrap.appendChild(b);
  });

  return wrap;
}
