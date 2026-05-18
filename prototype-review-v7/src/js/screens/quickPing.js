/**
 * Quick Ping — date strip first, then Now / In 30 min / More times
 * (preset grid + same scroll time picker as create-event).
 */
import { createHeader } from '../components/header.js';
import { createInputField } from '../components/inputField.js';
import { createChip } from '../components/chip.js';
import { createLocationCard } from '../components/locationCard.js';
import { createInviteSection } from '../components/inviteSection.js';
import { createCTAButton } from '../components/ctaButton.js';
import { mountPickerSheet } from '../components/pickerSheet.js';
import { createDateStrip } from '../components/dateStrip.js';
import { createTimePicker } from '../components/timePicker.js';

export function renderQuickPing(container) {
  container.innerHTML = '';

  const screen = document.createElement('div');
  screen.className = 'screen';
  screen.id = 'quick-ping-screen';

  screen.appendChild(createHeader('Quick ping'));

  // REVIEW (Workshop 7): big editorial title is gone. The cue lives in the
  // placeholder so the screen feels lighter and the input is the focal point.
  const titleLabel = document.createElement('div');
  titleLabel.className = 'create-event-quietlabel';
  titleLabel.innerHTML = '<span class="create-event-quietlabel__label">What\'s the plan?</span>';
  screen.appendChild(titleLabel);
  screen.appendChild(createInputField('e.g. Street food crawl — your pick of stall', 'Sunset picnic · blankets & speakers'));

  const whenSection = document.createElement('div');
  whenSection.className = 'section';
  whenSection.innerHTML = `<div class="section-label">WHEN</div>`;

  const hint = document.createElement('p');
  hint.className = 'qp-flow-hint';
  hint.textContent = 'Pick a day, then when you’re free';
  whenSection.appendChild(hint);

  whenSection.appendChild(createDateStrip({
    days: 3,
    selectedIndex: 0,
    variant: 'compact',
    onChange: () => {},
  }));

  const timeLabel = document.createElement('div');
  timeLabel.className = 'when-sub-label';
  timeLabel.textContent = 'Time';
  whenSection.appendChild(timeLabel);

  const chipGroup = document.createElement('div');
  chipGroup.className = 'chip-group';
  let sel = 'Now';

  function selectOne(label, el) {
    sel = label;
    chipGroup.querySelectorAll('.chip').forEach((c) => {
      c.classList.toggle('chip--selected', c === el);
      c.setAttribute('aria-selected', String(c === el));
    });
  }

  const PRESET_TIMES = ['12:00', '13:00', '15:00', '17:00', '18:30', '19:00', '20:00', '21:00'];

  const c1 = createChip('Now', true, (_, el) => {
    c3.textContent = 'More times…';
    selectOne('Now', el);
  });
  const c2 = createChip('In 30 min', false, (_, el) => {
    c3.textContent = 'More times…';
    selectOne('30', el);
  });
  const c3 = createChip('More times…', false, () => {
    let sheetRef;

    function commitTime(label) {
      c3.textContent = label;
      selectOne(label, c3);
      if (sheetRef) sheetRef.close();
    }

    const root = document.createElement('div');
    root.className = 'qp-time-sheet';

    const grid = document.createElement('div');
    grid.className = 'qp-time-grid';
    PRESET_TIMES.forEach((t) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'qp-time-chip';
      b.textContent = t;
      b.addEventListener('click', () => commitTime(t));
      grid.appendChild(b);
    });

    const orLine = document.createElement('p');
    orLine.className = 'qp-time-sheet__or';
    orLine.textContent = 'Or choose a time';

    const tp = createTimePicker({
      value: '18:00',
      onPick: (timeStr) => commitTime(timeStr),
    });

    root.append(grid, orLine, tp);
    sheetRef = mountPickerSheet({ title: 'Start around', content: root });
  });

  chipGroup.append(c1, c2, c3);
  whenSection.appendChild(chipGroup);
  screen.appendChild(whenSection);

  const whereSection = document.createElement('div');
  whereSection.className = 'section';
  whereSection.innerHTML = `<div class="section-label">WHERE</div>`;
  whereSection.appendChild(createLocationCard('Current location'));
  screen.appendChild(whereSection);

  screen.appendChild(createInviteSection());

  const ctaWrapper = document.createElement('div');
  ctaWrapper.className = 'cta-wrapper';
  ctaWrapper.appendChild(createCTAButton('Send it', () => {
    setTimeout(() => {
      const chatNext = encodeURIComponent('#/event/coffee-meetup/chat?new=1');
      window.location.hash = `#/quick-ping/sent?next=${chatNext}&cal=coffee-meetup`;
    }, 200);
  }));
  screen.appendChild(ctaWrapper);

  container.appendChild(screen);
}
