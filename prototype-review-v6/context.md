# SocialT — Prototype Context (review build)

Standalone reference so another engineer or LLM can **reproduce the UX and codebase from scratch**. This describes the **shipping prototype** under `prototype-review/` (Vite SPA, hash router, static JS screens).

---

## Product

SocialT (“SosialT” / “SocialT”) is a **warm, Scandinavian-hygge** mobile-first web prototype: small-group planning—quick pings (now-ish), events (committed time/place/poll/flex), circles, chats, calendar, notifications, onboarding, and invite deep links.

**Voice**: dry, concise, observant—“smart friend”, not bubbly marketing copy.

---

## Tech stack

- **Vanilla ES modules**, no framework.
- **Vite** for dev + build (`npm run dev`, `npm run build`).
- **Hash-router** SPA: `/#/route` and `#/route?params` with `Router` stripping overlay DOM on each navigation (`router.js`).
- **Single mount point**: `#app` inside `.device-frame` (phone chrome in `index.html`).
- Styles: **design tokens** `tokens.css` → **`global.css`**, **`components.css`**, review-only **`review.css`**.

Find review-only deltas by searching **`// REVIEW:`** comments in source.

---

## Visual language (must match)

- **Background**: warm cream `#FAF6F0`; surfaces `#FFFFFF` / warm off-whites per tokens.
- **Typography**: headings **Bricolage Grotesque**, body **Plus Jakarta Sans** (see `--font-heading` / `--font-body`).
- **Accent**: yellow gold `#E8C547`; CTAs sometimes use **`--gradient-cta`**.
- **Shape**: rounded cards (large radii), soft shadows **`--shadow-card`**, minimal borders.
- **Micro-interactions**: spring easing `--ease-spring`, fast transitions.

---

## Global behaviors

1. **First load** (`main.js`): if `window.location.hash` empty → **`#/onboarding/splash`** auto redirect.
2. **Bottom nav**: five slots (`bottomNav.js`); center **FAB `+`** opens **create sheet** (Quick Ping, Create Event, Start Chat).
3. **FAB styling (customer)**:
   - Default: yellow (`--color-accent`).
   - Pressed `:active`: grey `#B5B0A8`.
   - Sheet open: class **`bottom-nav__plus--active`** = grey + **45deg rotate** (+ becomes × affordance).

4. **Screens overlay** (`screensOverlay.js`, body-level): reviewer “Screen map” with ordered flows—including **cold start** and three **invite** entry paths plus deep links into main app.

---

## Routing (canonical)

| Area | Paths |
|------|--------|
| Home | `#/`, `#/?newuser=1` (empty onboarding state) |
| Onboarding | `#/onboarding/splash`, `welcome`, `phone`, `code`, `name`, `contacts` |
| Invites **received** | `#/invite/friend/:id`, `#/invite/circle/:id`, `#/invite/event/:id` |
| Core | `#/quick-ping`, `#/create-event`, `#/events`, `#/circles`, `#/calendar`, `#/chats`, `#/notifications`, `#/profile` |
| Event | `#/event/:id`, `#/event/:id/chat`, `#/event/:id/bring`, success routes under `#/quick-ping/sent` and `#/create-event/done` |

**Navigation cleanup on route change**: `initRouter()` removes overlays (bottom nav recreated per screen).

---

## End-to-end entry flows (customer requirement)

Implement all four seamless paths in both **Screens panel** ordering and UI affordances:

1. **Cold start (App Store)**  
   Splash → Welcome → Phone → SMS code → Name → Contacts permission dialog → **`#/?newuser=1`**.

2. **Friend invite link**  
   `#/invite/friend/eleanor` → Accept → **`#/onboarding/welcome`** (then same signup chain as needed).

3. **Circle invite link**  
   `#/invite/circle/inner-circle` (and alternates) → Join → **`#/onboarding/welcome`**.

4. **Event invite link**  
   `#/invite/event/jazz-vigeland` → Accept → **`#/event/:id`**. New users also have text link to onboarding.

---

## Key screens (behavioural notes)

### Create Event (`createEvent.js`)

- **Title row** uses shared **editorial scale** as Quick Ping: `<h1 class="editorial-title">What’s the plan?</h1>` + **Required** pill.
- **WHEN** segmented control: *Choose date/time* | *I’m flexible* | *Create a poll*.  
  **Default**: no mode selected (empty state copy) until user picks a tab.
- **Choose date/time**: **single-month Airbnb-style calendar** with **◀ / ▶** month navigation, **range** selection, inline start/end time rows opening **time picker sheet**.  
  - Not a 14-day strip; **any future month** reachable.  
  - Past days disabled; cannot page before current month.
- **Poll** (`pollBuilder.js`): **same calendar component** per option, **single-date** mode, same month navigation + **charcoal circle** selection; then time + place affordances unchanged.

### Quick Ping (`quickPing.js`)

- Editorial title **What are you up to?**.
- Horizontal **short date strip** (3-day) + time chips (Now / … / picker). **Separate** from Event calendar UX by design (“ping = spontaneous”).

### Circles (`circles.js`)

- **Four filter buckets / legend / detail sheet priorities** — customer labels: **`Family · Friends · Casual · Open`** (ids: `family`, `friends`, `casual`, `open`). Same four colours mapped on **Calendar** (`calendar.js`).
- Rows show **private calendar-colour dot** per circle host-only semantics.

### Home (`home.js`)

- Returning vs **`?newuser=1`** empty state (copy + CTAs).

### Invite composer

- **`#/invite/compose`**: SMS path for friend-not-on-app (review flow).

---

## Shared components worth reproducing faithfully

| File | Purpose |
|------|---------|
| `dateCalendar.js` | Airbnb-style grids; **`singleMonthNavigate: true`** exposes one-month + arrows (Create Event range + Poll single). |
| `miniCalendar.js` | Sheet-sized month (nav already existed). |
| `timePicker.js` + `pickerSheet.js` | Bottom sheets. |
| `segmented.js` | WHEN tabs. |
| `bottomNav.js` | FAB + create sheet routing. |

---

## State / session

- **`lib/session.js`**: onboarding flags (contacts allowed, etc.).
- **`lib/publicEventState.js`**: persisted `sessionStorage` for public-event mock state (Screens panel clears with “Clear public-event session”).

---

## Deploy (Vercel)

- **`vercel.json`**: `framework: vite`, SPA rewrite to `index.html`.
- **Two stable review aliases** (same codebase, different projects): **`https://sosialt-review-v2.vercel.app`** (default `vercel link` from `prototype-review/`) and **`https://sosialt-review.vercel.app`** (earlier project — point `vercel link` there again to push updates). Each deploy also gets a **unique deployment URL**. Revert any alias via Vercel → that project → **Deployments** → Promote to Production.

---

## File map (start here)

```
prototype-review/
  index.html
  src/main.js
  src/styles/{tokens,global,components,review}.css
  src/js/router.js
  src/js/components/*.js    # primitives
  src/js/screens/*.js       # routed views
  src/js/screens/onboarding/*.js
  src/js/screens/invite/*.js
  src/js/lib/*.js
```

See **`SKILL_SOSIALT_PROTOTYPE.md`** in this folder for LLM procedural guidance (generation order + acceptance checklist).
