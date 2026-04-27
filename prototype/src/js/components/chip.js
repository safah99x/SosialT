/**
 * Selectable chip / pill component
 */
export function createChip(label, isSelected = false, onClick) {
  const chip = document.createElement('button');
  chip.className = `chip ${isSelected ? 'chip--selected' : ''}`;
  chip.textContent = label;
  chip.setAttribute('role', 'option');
  chip.setAttribute('aria-selected', isSelected);

  chip.addEventListener('click', () => {
    onClick && onClick(label, chip);
  });

  return chip;
}

/**
 * Chip group with single-select behavior
 */
export function createChipGroup(labels, defaultSelected = null) {
  const group = document.createElement('div');
  group.className = 'chip-group';
  group.setAttribute('role', 'listbox');

  labels.forEach(label => {
    const chip = createChip(label, label === defaultSelected, (selected, el) => {
      // Deselect all
      group.querySelectorAll('.chip').forEach(c => {
        c.classList.remove('chip--selected');
        c.setAttribute('aria-selected', 'false');
      });
      // Select this one
      el.classList.add('chip--selected');
      el.setAttribute('aria-selected', 'true');
    });
    group.appendChild(chip);
  });

  return group;
}
