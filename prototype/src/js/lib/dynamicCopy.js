/**
 * SosialT — Dynamic hero copy
 *
 * The hero line on the home screen rotates based on:
 *   - Time of day (morning / lunch / afternoon / evening / late)
 *   - Day of week (weekday vs weekend)
 *   - Weather (sunny / rainy / snowy / cloudy / cold / mild)
 *   - The user's first upcoming plan today (if any)
 *   - The user's city (default: Oslo)
 *
 * Voice: dry, warm, observant. Short. The smart-witty friend.
 * No exclamation marks. No "make memories". No em dashes. No emoji.
 */

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const lower = (s) => (s ? s.toLowerCase() : s);

export function getHeroLine({ now = new Date(), city = 'Oslo', weather = 'cloudy', tempC = 8, upcomingToday = null } = {}) {
  const hour = now.getHours();
  const dow  = now.getDay();
  const isWeekend = dow === 0 || dow === 6;

  // 1) If there is something on the calendar today, lean into it.
  if (upcomingToday) {
    const title = upcomingToday.title;
    const time  = upcomingToday.time;
    return pick([
      `${title} at ${time}. Bring backup?`,
      `${title} later. Don't go alone.`,
      `You've got ${lower(title)} at ${time}. Drag someone along.`,
      `${title} on the calendar. Who's tagging in?`,
    ]);
  }

  // 2) Cold / extreme weather wins over time-of-day
  if (weather === 'snowy') {
    return pick([
      `${city} is frosted. Hot drink, good company.`,
      `Snow day. Coffee somewhere warm?`,
      `It's white outside. Find someone to walk through it with.`,
    ]);
  }
  if (tempC <= -2) {
    return pick([
      `It's bitter out. Indoor plans only.`,
      `Cold enough for layers. And company.`,
    ]);
  }
  if (weather === 'rainy') {
    return pick([
      `Grim out. Coffee fixes that.`,
      `Perfect excuse to stay in. Or not.`,
      `${city} is wet. Find a window with friends behind it.`,
    ]);
  }

  // 3) Late night / early morning
  if (hour < 6)  return pick([`Past midnight. The night's still got friends in it.`, `Late one. Someone's still up, probably.`]);
  if (hour >= 22) return pick([`Quiet night, or noisy one?`, `Late one. Tomorrow's problem.`, `Night owl hours. Anyone else up?`]);

  // 4) Morning
  if (hour < 11) {
    if (weather === 'sunny') return pick([
      `Coffee weather in ${city}. Who's joining?`,
      `Sun's out. Drag someone outside.`,
      `Morning. Don't drink that coffee alone.`,
    ]);
    return pick([
      `Morning, ${city}. Wake someone up.`,
      `Coffee's better with company.`,
      `Slow start. Make it social.`,
    ]);
  }

  // 5) Lunch
  if (hour < 14) {
    if (isWeekend) return pick([
      `${dow === 6 ? 'Saturday' : 'Sunday'} is wide open. Fill it.`,
      `Lazy weekend? Pull someone out.`,
      `Half a day still ahead. Use it well.`,
    ]);
    return pick([
      `Lunch alone is overrated.`,
      `Quick break. Quick ping?`,
      `Eat with people. It tastes better.`,
    ]);
  }

  // 6) Afternoon
  if (hour < 18) {
    if (weather === 'sunny' && tempC >= 12) return pick([
      `Too nice to stay indoors. Round someone up.`,
      `Golden hour incoming. Plan accordingly.`,
      `Park weather. Friends not optional.`,
    ]);
    if (isWeekend) return pick([
      `Afternoon's wide open. What's it going to be?`,
      `Halfway through the weekend. Make it count.`,
    ]);
    return pick([
      `Afternoon slump. Coffee fixes it.`,
      `Half a day left. Use it well.`,
      `Quick break before evening?`,
    ]);
  }

  // 7) Evening
  if (isWeekend) return pick([
    `Evening, ${city}. What's the move?`,
    `Big night, small night, or somewhere between?`,
    `Plans, or plans-shaped void?`,
  ]);
  return pick([
    `Dinner's better with people.`,
    `Quiet evening, or a noisy one?`,
    `Workday's done. Rescue it.`,
  ]);
}

/**
 * Returns a single object describing the current "moment" so the
 * home screen can also render a tiny context strip if it wants to.
 */
export function getHomeContext({ now = new Date() } = {}) {
  // For the prototype we mock weather. Wire to a real API later.
  // Simple weighted random per session so the home feels alive.
  const seed = Math.floor(now.getTime() / (1000 * 60 * 60 * 6)); // changes every 6 hours
  const moods = ['sunny', 'cloudy', 'rainy', 'cloudy', 'sunny', 'snowy'];
  const weather = moods[seed % moods.length];
  const tempC = weather === 'snowy' ? -3 : weather === 'rainy' ? 6 : weather === 'sunny' ? 14 : 9;
  return { weather, tempC, city: 'Oslo' };
}
