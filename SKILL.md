---
name: sosialt-design
description: SosialT mobile app design system — components, tokens, motion, copy rules. Use this any time you build, edit, or review SosialT screens.
---

# SosialT — Component Skill

This document is the single source of truth for the SosialT design system.
You should be able to recreate every screen in the app from this file alone.

The design language is **Atmospheric Hygge** — calm, warm, premium, Scandinavian, editorial, private, intentional. The product is for people aged 40–70 in Norway who want to spend more time with friends in real life, not scroll a feed.

Every component here exists for one reason: make a small social moment feel effortless and warm.

---

## 1. Audience & Voice

### Audience
- Primary: Norwegians aged 40–70.
- Secondary: Anyone who prefers small-group, real-life social coordination over feeds.

### Voice
- Friendly, warm, calm, confident.
- Speaks to the reader like a thoughtful friend, not a brand.
- Short sentences. No buzzwords. No exclamation marks.

### Copy rules
1. No em dashes (`—`). Use a period or comma instead.
2. No emoji in product copy unless explicitly approved.
3. No exclamation marks. Ever.
4. Sentence case for buttons and titles, except section labels (`WHEN`, `WHERE`, `INVITE`) which are uppercase.
5. Greeting is always `Hey there, {Name}`. No emoji or trailing punctuation.
6. CTAs are short verb phrases. Two or three words max. Examples: `Send it`, `Make it official`, `Back to home`, `I'm in`.
7. Never call something a "feed" or "post". We use `Ping`, `Event`, `Circle`.
8. Never say `make memories`, `unlock`, `unleash`, `journey`, `community`, `experience`. They are banned.
9. If a sentence can be cut, cut it. Two short lines beat one long one.

### Voice test ("smart witty friend")
Before shipping any string, read it aloud as if you're a 55-year-old in Oslo who has heard every marketing trick. If it sounds like an insurance ad, a Hallmark card, or an HR onboarding email — rewrite it.

Good:
- "Round up your people. Now-ish."
- "Slower this time. More on purpose."
- "Coffee weather in Oslo. Who's joining?"
- "Lunch alone is overrated."

Bad (banned phrasings):
- "Ready to make some memories?"
- "Invite your circle to something happening soon."
- "Plan ahead with your friends today!"

### Dynamic hero copy

The hero card on the home screen rotates copy based on context. Source of truth: `prototype/src/js/lib/dynamicCopy.js`.

Inputs:
- `now` — current date/time
- `city` — currently `Oslo` (placeholder until geo is wired)
- `weather` — `sunny | cloudy | rainy | snowy`
- `tempC` — integer Celsius
- `upcomingToday` — `{ title, time }` of the user's next plan today, or `null`

Priority order when picking a line:
1. If there is an upcoming plan today, lean into it.
2. Else if weather is extreme (snow, rain, sub-zero), lean into that.
3. Else use time of day (early morning, morning, lunch, afternoon, evening, late).
4. Inside each branch, weekend vs weekday adjusts the line.

Tone for hero lines:
- 4 to 9 words.
- Two short sentences max.
- Dry, observant, never preachy.
- Reference the moment (city, weather, time, plan), never an abstraction.
- Tap the hero card to roll a fresh line — used on home for demos.

The home hero also shows a context chip above the line:
- If a plan is on today: `ON TODAY`.
- Otherwise: `{CITY} · {WEATHER} · {TEMP}°` (e.g. `OSLO · CLOUDY · 9°`).

---

## 2. Typography

### Chosen pairing (default)
- **Display / Headings:** `Fraunces` — variable serif, warm and editorial with personality. Reads confidently for a 40–70 audience and supports the Hygge mood.
- **Body / UI:** `Plus Jakarta Sans` — humanist sans, very legible at small sizes, friendly without being childish.
- **Wordmark / Brand mark:** the existing brushy `SosialT` script (use as image/SVG only, never as a typed font).

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Approved alternatives (swap-only inside the same role)

| Role | Default | Alternate 1 | Alternate 2 | Alternate 3 |
|------|---------|-------------|-------------|-------------|
| Display | Fraunces | Bricolage Grotesque | DM Serif Display | General Sans (semibold) |
| Body | Plus Jakarta Sans | Inter | Geist Sans | Inclusive Sans |

Only swap *within* a role, never mix two display fonts on the same screen.

### Type scale
| Token | Size | Use |
|-------|------|-----|
| `--fs-hero` | 32px | Editorial title at top of a flow |
| `--fs-greeting` | 26px | Home greeting (`Hey there, Anders`) |
| `--fs-title` | 22px | Section / card title |
| `--fs-subtitle` | 16px | Subtitle under hero |
| `--fs-body` | 15px | Default body |
| `--fs-input` | 17px | Input field text |
| `--fs-chip` | 14px | Chip label |
| `--fs-cta` | 16px | CTA button |
| `--fs-label` | 12px | Section labels (uppercase) |
| `--fs-caption` | 12px | Metadata / time / place |

### Weights
- 400 regular for body
- 500 medium for default UI text
- 600 semibold for emphasis, CTAs, selected states
- 700 bold reserved for greeting names and emphasis inside hero copy

### Body sizing rule (accessibility for 40–70)
- Body text never below 14px.
- Tap targets min 44×44px.
- Line height 1.5 for body, 1.2 for display.

---

## 3. Color tokens

```
--color-bg:               #FAF6F0   /* warm cream */
--color-bg-warm:          #F5F0E8
--color-surface:          #FFFFFF
--color-surface-warm:     #FDF9F4
--color-surface-hover:    #F8F3EB

--color-text:             #2C2825   /* near-black charcoal, never #000 */
--color-text-secondary:   #6B5F53
--color-text-muted:       #9A8E82
--color-text-placeholder: #BFB5A8

--color-accent:           #E8C547   /* warm yellow */
--color-accent-strong:    #D4A853
--color-accent-soft:      #F5E6A3
--color-accent-bg:        #FBF5E0

--color-chip-selected:    #F5E6A3
--color-chip-default:     #F0EBE3
--color-chip-text:        #5C5347

--gradient-cta:           linear-gradient(135deg, #E8C547 0%, #D4A853 55%, #C4943F 100%)
--gradient-hero:          linear-gradient(135deg, #F5D04E 0%, #E8C547 100%)
--color-cta-text:         #2C2825   /* on yellow gradient we use charcoal */
```

Rules:
- Never use pure black or pure white for text on cream surfaces.
- Yellow gradient is brand-critical. Don't substitute a flat yellow.
- Selected = warm yellow. Unselected = soft cream/grey. No blue states.

---

## 4. Spacing, radii, elevation

```
--space-xs: 4   --space-sm: 8   --space-md: 12
--space-base: 16   --space-lg: 24   --space-xl: 32   --space-2xl: 48

--radius-sm: 8   --radius-md: 12   --radius-lg: 16
--radius-xl: 20   --radius-2xl: 24   --radius-pill: 999   --radius-cta: 14

--shadow-subtle: 0 1px 3px rgba(44, 40, 37, 0.04)
--shadow-card:   0 2px 8px rgba(44, 40, 37, 0.06)
--shadow-cta:    0 6px 24px rgba(196, 148, 63, 0.25)
```

The **No-Line Rule**: never use visible 1px borders or divider lines. Use spacing, soft shadows, or tonal surface shifts instead.

---

## 5. Motion

```
--ease-out:       cubic-bezier(0.25, 0.46, 0.45, 0.94)
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1)
--duration-fast:   150ms
--duration-normal: 250ms
--duration-slow:   400ms
```

Patterns:
- Screen enter: 16px slide-up + fade, staggered children at 40ms each.
- Press: scale to 0.97 with 200ms spring.
- Toggle / chip select: ease-spring, 250ms.
- Success state: scale-up checkmark 400ms with soft yellow halo.

---

## 6. Layout primitives

### Device frame (prototype only)
- 393×852 px, 52px outer radius, dynamic island at top, home indicator at bottom.
- Status bar height 54px reserved.
- App scrolls inside the frame; bottom nav floats over content.

### Screen
- Padding `--space-lg` left/right, `--space-lg` top, **120px bottom** (to clear bottom nav).
- Single vertical column. No multi-column UI inside the device frame.
- Children stagger in with `itemSlideUp`.

### Section
- `margin-top: --space-lg`.
- Optional small uppercase label (`WHEN`, `WHERE`, `INVITE`) above content.

---

## 7. Components

Every component below is mandatory. Each has structure, classes, behavior, and acceptance criteria.

### 7.1 TopBar (home only)

Layout: `[ SosialT wordmark ]   ⟶   [ bell ]  [ calendar ]  [ avatar ]`

```html
<header class="top-bar">
  <span class="top-bar__brand">SosialT</span>
  <div class="top-bar__actions">
    <button class="top-bar__icon" aria-label="Notifications">
      <svg>…bell with red dot…</svg>
    </button>
    <button class="top-bar__icon" aria-label="Calendar">
      <svg>…calendar…</svg>
    </button>
    <button class="top-bar__avatar" aria-label="Profile">AS</button>
  </div>
</header>
```
- Wordmark uses the brushy SosialT script (italic-leaning serif fallback acceptable).
- Avatar: 36px circle, warm cream background, charcoal initials, semibold.
- Each icon button: 36px, soft cream background, charcoal icon. Bell has a 6px red dot when notifications exist.
- Acceptance: never shows a back button on Home.

### 7.2 Header (sub-screen)

Layout: `[ < ]   [ Title ]   [ spacer ]`

- Back button 40×40, soft hover.
- Title centered, 15px, semibold.
- No divider line under it.

### 7.3 Greeting block (Home)

```html
<div class="home-greeting">
  <h1 class="home-greeting__title">Hey there, <strong>Anders</strong></h1>
</div>
```
- Font: Fraunces 26px, weight 400, with the name in weight 700.
- No emoji. No exclamation. No subtitle wave.

### 7.4 Hero card (Home)

A single warm-yellow gradient card with editorial copy.

```html
<div class="hero-card">
  <p class="hero-card__title">Ready to make some <strong>memories with friends?</strong></p>
  <div class="hero-card__blob hero-card__blob--a"></div>
  <div class="hero-card__blob hero-card__blob--b"></div>
</div>
```
- Background: `--gradient-hero` plus two soft cream organic blobs at 25% opacity (decorative).
- Padding 24px, radius 24px, no shadow.
- Title: Fraunces 22px, charcoal, the second clause is bold.

### 7.5 Action pair (Home)

Two side-by-side cards — Quick Ping and Create Event.

```html
<div class="home-actions">
  <button class="action-tile">
    <span class="action-tile__icon">+</span>
    <span class="action-tile__title">Quick ping</span>
    <span class="action-tile__desc">Meetup soon</span>
  </button>
  <button class="action-tile">
    <span class="action-tile__icon">📅</span>  <!-- SVG, not emoji -->
    <span class="action-tile__title">Create event</span>
    <span class="action-tile__desc">Plan ahead</span>
  </button>
</div>
```
- White surface, radius 20px, subtle shadow.
- Icon is 56px circle with cream background and charcoal stroke icon.
- Title 16px semibold, desc 13px muted.
- Press scales to 0.98.

### 7.6 Upcoming list (Home)

A vertical stack of past/future event row cards.

```
[ 05    ] [ Coffee Meetup        ]
[ April ] [ avatars +4 Coffee Crew ]
          [ 🕐 10:00 AM  📍 Central Park Cafe ]
```

Markup:
```html
<div class="upcoming-row">
  <div class="upcoming-row__date">
    <span class="upcoming-row__day">05</span>
    <span class="upcoming-row__month">April</span>
  </div>
  <div class="upcoming-row__body">
    <h3 class="upcoming-row__title">Coffee Meetup</h3>
    <div class="upcoming-row__meta">
      <span class="avatar-stack">…</span>
      <span class="upcoming-row__group">Coffee Crew</span>
    </div>
    <div class="upcoming-row__detail">
      <span><svg>clock</svg> 10:00 AM</span>
      <span><svg>pin</svg> Central Park Cafe</span>
    </div>
  </div>
</div>
```
- Section header: `Upcoming` (sentence case, Fraunces 18px) on the left, `See All ›` text link on the right.
- Date block: 56×56 cream tile with rounded corners. Day big bold, month small muted.
- Avatar stack: 3 circle avatars overlapping at -8px, plus a `+N` cream pill.

### 7.7 Events around you (Home)

A horizontal carousel of large image cards.

- 240×300 image card, radius 20px.
- Image fills top 60%; below it: title (Fraunces 18px), description (13px muted, 2 lines), date row (calendar svg + text), location row (pin svg + text), avatar stack + "people", and an `Interested` pill button on the right.
- Optional category tag (`Music`) absolute top-right inside the image — cream pill with charcoal text.

### 7.8 Bottom nav

Floating tab bar with 5 slots: Home · Events · `+` · Circles · Chats.

- Surface: white with subtle shadow, radius 28px, height 64px, sits 16px from device bottom.
- Center `+` is a 56×56 charcoal circle with cream `+` icon, lifted 12px above the bar.
- Inactive tabs: muted icon + 11px label.
- Active tab: charcoal icon + label, no pill background. (Per the screenshot reference.)
- The `+` opens a small sheet with two options: `Quick Ping` and `Create Event`.

### 7.9 Editorial title + subtitle (sub-screens)

```html
<h1 class="editorial-title">What are you up to?</h1>
<p  class="editorial-subtitle">Round up your people. Now-ish.</p>
```
- Title: Fraunces 32px, regular weight.
- Subtitle: Plus Jakarta Sans 16px, secondary text color.
- Used at the top of Quick Ping and Create Event.

Approved title/subtitle pairs:
- Quick Ping: `What are you up to?` / `Round up your people. Now-ish.`
- Create Event: `What's the plan?` / `Slower this time. More on purpose.`

### 7.10 Input field (large soft)

```html
<div class="input-field">
  <input class="input-field__input" placeholder="Grab a coffee" />
</div>
```
- Surface: warm white, radius 16px, padding 18px 24px.
- Placeholder reads like sample content, not a hint.
- Focus: surface goes pure white, soft yellow ring, 1.01 scale.
- No labels, no underline, no floating label.

### 7.11 Chip group

```html
<div class="chip-group" role="listbox">
  <button class="chip chip--selected">Now</button>
  <button class="chip">In 30 min</button>
  …
</div>
```
- Pill shape, 10×20 padding, 14px medium.
- Default: cream. Selected: warm yellow with soft glow shadow.
- Hover: lifts 1px. Active: scale 0.95.

### 7.12 Location card

```
[ icon ] Add location           ›
         Search for a place

⊙ Current location  /  At my place
```
- Primary card: warm white surface with cream rounded icon tile (40×40), title + hint stacked.
- Secondary: small inline action below, 13px muted.
- Quick Ping default secondary = `Current location`.
- Create Event default secondary = `At my place`.
- Never use a map.

### 7.13 Invite section

```
INVITE              [ Circles | Friends ]

[ ⓘ ] Inner Circle           ◯
      6 members
…
```
- Section label `INVITE` left, segmented toggle right (pill, 2 options, white pill on cream track for active).
- List rows: warm white card, 38px circle avatar (icon for circles, initial for friends), name + meta, 22px circular indicator on the right.
- Selected row: cream-yellow background, indicator filled with accent and white check.
- Never use checkboxes.

### 7.14 CTA button

```html
<button class="cta-button">Send it</button>
```
- Full width, radius 14px, padding 17×24.
- Background `--gradient-cta`. Text charcoal (`#2C2825`) — readable and warm on yellow.
- Hover: lifts 2px, stronger shadow, sheen sweeps left to right.
- Success state: warm green (`--color-success`) + label switches to past tense (`You're in`).
- Approved labels: `Send it` (Quick Ping), `Make it official` (Create Event), `I'm in` (RSVP), `Back to home` (success), `Save` (settings).

### 7.15 Date range picker (Create Event only)

Airbnb-inspired. Appears inline when user taps `Pick dates`.

- Two-month vertical scroll calendar inside a soft card.
- Day cells: 40×40 circles, no borders.
- Selected start/end: filled charcoal circles with white text.
- In-range: soft cream-yellow strip joining start and end.
- Hover (web): 1px ring of accent.
- Footer of the picker: `Clear dates` (left, secondary) and `Apply` (right, CTA style).
- Time selection is optional; appears only after a single date is picked, as two simple chips: `Add time` (toggles a wheel-style scroller).

### 7.16 Photo upload (Create Event)

- Default: small text+icon button labelled `Add photo`, muted.
- After choosing a photo: 88×88 thumb with rounded corners and a small `×` to remove. Never grows into a hero image.

### 7.17 Avatar stack

- 3 visible avatars, 24px circles, overlapped -8px, charcoal hairline ring (1px on cream surfaces only).
- `+N` pill: 24px tall, cream, 11px label.

### 7.18 Success / confirmation screen

Shown after sending a Quick Ping or creating an Event.

- Centered checkmark in soft yellow circle (96px, accent-soft fill, charcoal stroke check).
- Title 28px Fraunces.
  - Quick Ping: `Sent`
  - Create Event: `It's on the calendar`
- Subtitle 15px muted.
  - Quick Ping: `Your people will see it in a sec.`
  - Create Event: `Your circle will see it in a moment.`
- Single CTA `Back to home`.
- Auto-returns to home after 4 seconds, but only if the hash hasn't changed.

### 7.19 Event detail screen

Opened when the user taps an Upcoming row or an Around-you card.

- Full-bleed hero image (280px tall) with rounded bottom corners (24px). A soft top-to-bottom darkening overlay keeps the back button readable.
- Top-left: round white "back" chip (38px), backdrop blur. Uses `window.history.back()`.
- Bottom-left of hero: small uppercase tag pill (`MUSIC`, `OUTDOOR`, ...).
- Body padding 16px sides, 24px top, 128px bottom (so it never collides with bottom nav even when the screen is short).
- Title: Fraunces 30px, medium weight.
- Meta rows: calendar SVG + `{date} . {time}`, then pin SVG + `{place}`. 13px secondary.
- Description: Fraunces 16px regular, line-height 1.5.
- People card: warm white surface, avatar stack + group name.
- CTA row: `I'm in` (full-width gradient button) and a square share button (56×56) on the right.
- Tapping `I'm in` snaps the button to the green success state, then navigates to the Quick Ping success screen after 600ms.

### 7.20 Placeholder screens (Events / Circles / Chats / Notifications / You)

Honest stand-ins so every nav button leads somewhere meaningful.

- Reuses the home top bar.
- Centered block with a 32px Fraunces title, an 18px subtitle in the brand voice, and a 13px hint about what's coming next.
- Single CTA `Back to home`.
- Bottom nav stays mounted with the corresponding tab marked active.

---

## 8. Screen recipes

### 8.1 Home
1. TopBar
2. Greeting (`Hey there, {Name}`)
3. Hero card
4. Action pair (Quick Ping / Create Event)
5. Upcoming label + 3 row cards
6. Events around you label + horizontal scroll
7. Bottom nav (overlay)

### 8.2 Quick Ping
1. Header `Quick Ping`
2. Editorial title `What are you up to?`
3. Subtitle `Round up your people. Now-ish.`
4. Input field (default `Coffee at Tim Wendelboe`)
5. WHEN section: chips `Now`, `In 30 min`, `Tonight`, `Choose time`
6. WHERE section: location card with `Current location` secondary
7. INVITE section
8. CTA `Send it`
9. → Success screen `Sent` / `Your people will see it in a sec.`

### 8.3 Create Event
1. Header `New Event`
2. Editorial title `What's the plan?`
3. Subtitle `Slower this time. More on purpose.`
4. Input field (default `Sunday brunch at mine`)
5. `Add photo` action
6. WHEN section: chips `I'm flexible`, `Pick dates` → reveals date range picker
7. WHERE section: location card with `At my place` secondary
8. INVITE section
9. CTA `Make it official`
10. → Success screen `It's on the calendar` / `Your circle will see it in a moment.`

### 8.4 Event detail (`/event/:id`)
1. Hero image (280px) with back chip + tag pill
2. Title (Fraunces 30px)
3. Meta: date+time, place
4. Description (Fraunces 16px)
5. People card (avatar stack + group name)
6. CTA row: `I'm in` + share button

### 8.4 Success
- Centered checkmark, title, subtitle, `Back to home` CTA.

---

## 8b. Poll-first Create Event flow

The host has three ways to set timing for an event. The WHEN section opens with a 3-pill segmented toggle:

1. **I'm flexible** — no date locked in. Friends know it's an open invite and can suggest dates in the chat.
2. **Pick dates** — host commits to a single date/time (uses the inline date picker). Default mode.
3. **Poll** — host proposes 2+ date/time/location options. Friends vote in the chat.

Pill order is intentional: most casual on the left, most specific on the right.

Rules:
- The mode is a **segmented pill toggle** (`.segmented`) at the top of the WHEN section.
- The default mode is `Pick dates`.
- CTA verb adapts: `Float it` (flexible), `Make it official` (dates), `Send poll` (poll).
- In `Poll` mode the standalone `WHERE` card is hidden because each option carries its own location. In `I'm flexible` and `Pick dates` modes WHERE is shown.
- `I'm flexible` mode renders a single tonal card with copy:
  > No date locked in.
  > Friends will know it's an open invite. You can pin a date in the chat once people are in.
- Each poll option must accept: start date, optional end date, start time, optional end time, location. Date and time fields use the brand-styled `miniCalendar` and `timePicker` (never native `<input type="date|time">`). Minimum 2 options.
- The helper text under the poll list always reads:
  > Don't worry, friends can suggest changes in the chat.
- After creation, route is:
  `#/create-event/done?mode={flex|date|poll}&next=#/event/:id/chat?{flex=1|new=1|poll=1}`
  The success screen auto-advances into the event chat after ~1.8s.
- In the chat, `flex=1` events render with an `OPEN INVITE` tag and meta line `Date TBD . {place}` instead of date/time/place.

Component files:
- `prototype/src/js/components/pollBuilder.js`
- `prototype/src/js/components/miniCalendar.js`
- `prototype/src/js/components/timePicker.js`
- `prototype/src/js/components/pickerSheet.js`

---

## 8c. Event Chat & Invite Flow

Each event owns a **chat thread** under `/event/:id/chat`. The thread combines:
- A day separator pill (centered, pale).
- A muted system note (e.g. `You shared an event with the group`).
- An inline shared **event card** (`.chat-event-card`) — tap to open the full detail.
- For poll-created events, an inline **poll card** (`.chat-poll-card`) with progress bars and a vote count line.
- Self bubbles use the warm gradient (`#FBE48F → #F2C94C`); other-people bubbles use a clean cream.
- A composer with an input + a circular gradient send button.

The chat header surfaces:
- Back button.
- A 36px circle thumbnail of the event image.
- Event title + small caps `EVENT . {group}` line.
- A 3-dot menu that opens a popover with `Event details` and `Add new friend`.

### Invite Friends sheet

Triggered from the popover (`Add new friend`) or from the event detail `Invite` chip. Mounts above the current screen so context isn't lost.

Layout:
- Drag handle.
- Title: `Select friends to invite`.
- Horizontal scroller of avatars with names below; first item is `Add new friend` (dashed circle).
- Selected friends show a green check overlay.
- Sticky CTA: `Invite friends` (disabled when 0 selected); becomes `Invite N friend(s)` when selected.

### Add to circle modal

After confirming the invite, a small centered modal appears:
> Add them to the same circle?
> Quietly group your invitees so future plans pre-fill faster.

Buttons: `Not now` (ghost) / `Save` (warm gradient).

Either action closes the modal and the sheet, then drops a system message back into the chat:
> You added N friends.

Components:
- `prototype/src/js/screens/inviteFriends.js`
- `prototype/src/js/screens/eventChat.js`

---

## 8d. Event Detail attendee tabs

Below the meta block, the event detail surfaces a `Friends` section with a small `+ Invite` chip and a horizontal pill toggle:

```
[ All N ] [ Going N ] [ Not going N ] [ Maybe N ]
```

Each list row shows: avatar circle, name (with optional `host` pill), RSVP label colored by status:
- Going → `--color-success` green
- Not going → muted red `#B05656`
- Maybe → `--color-accent-strong`

The CTA row at the bottom is three buttons: primary `I'm in`, square `Open chat` (routes to `/event/:id/chat`), square `Share`.

`Show on map` link opens Google Maps in a new tab using the event place string.

---

## 8e. Chats list

Route `/chats` shows one row per event thread. Each row: 48px event-image avatar, title + relative time, last-message preview prefixed by sender name, unread badge or chevron.

Component: `prototype/src/js/screens/chats.js`.

---

## 9. Acceptance checklist (run before shipping any screen)

Copy
- [ ] No em dashes in any visible copy.
- [ ] No emoji in greetings, titles or buttons.
- [ ] No exclamation marks anywhere.
- [ ] Greeting is exactly `Hey there, {Name}` (no trailing punctuation).
- [ ] None of the banned phrases (`make memories`, `unleash`, `journey`, `community`, `experience`, etc.).
- [ ] CTAs are short verb phrases (≤ 3 words).
- [ ] Hero copy is dynamic; rotates by time/weather/plans.

Layout
- [ ] All section labels are `WHEN`, `WHERE`, `INVITE` (uppercase, letter-spaced).
- [ ] No 1px borders, no divider lines.
- [ ] No checkboxes anywhere.
- [ ] No map preview anywhere.
- [ ] CTA uses warm gradient, not flat yellow.

Accessibility
- [ ] All body text ≥ 14px and tap targets ≥ 44px.
- [ ] All buttons have a visible focus state for keyboard users.

Navigation
- [ ] Every visible button leads somewhere or visibly toggles state.
- [ ] All header back arrows use `window.history.back()` so the browser forward button stays meaningful.
- [ ] Bottom nav tabs route: Home → `/`, Events → `/events`, Circles → `/circles`, Chats → `/chats`.
- [ ] Top bar: bell → `/notifications`, calendar → `/events`, avatar → `/profile`.
- [ ] Upcoming rows and Around-you cards open `/event/:id`.
- [ ] Quick Ping and Create Event share spacing, rhythm, and components.
- [ ] Create Event has a working `Pick a time` / `Create a poll` segmented toggle and the WHERE card hides in poll mode.
- [ ] After publishing, success screen auto-advances into `/event/:id/chat`.
- [ ] Event chat has a 3-dot menu with `Event details` and `Add new friend`.
- [ ] Invite sheet shows selected count in the CTA and offers the `Add to circle` modal afterwards.

---

## 10. Update protocol

This file is the single source of truth.

- Whenever you change tokens, components, copy, or screen recipes, update this file in the same change.
- Add new components under section 7 with markup, behavior, and acceptance.
- Never delete a rule from sections 1–6 without explicit user approval.
- When in doubt, copy Quick Ping. It is the reference rhythm.
