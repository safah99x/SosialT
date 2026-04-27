# SocialT — Type research & font choices

This doc explains why the chosen fonts were picked for SocialT and lists pre-approved alternatives if you want to swap later. Fonts are loaded in `prototype/src/styles/global.css` and consumed via tokens in `tokens.css`.

---

## Audience

- Norwegians, ages 40–70.
- Want clear, bold, but still fun.
- Need high legibility at small sizes (this group benefits from open apertures, generous x-heights, ≥ 14px body text).
- Should feel modern Scandinavian — calm, premium, warm. Not corporate, not childish, not viking-pastiche.

## Typographic principles for this audience (from research)

1. Body text minimum 14px, prefer 15–17px in primary surfaces.
2. Line height 1.5 for body, 1.2 for display headings.
3. Avoid italic body, all-caps body, decorative scripts.
4. Use bold weight for emphasis instead of italics.
5. High contrast text on light backgrounds.
6. Tap targets minimum 44×44 px.

Sources: NIH (How to design font size for older adults, 2022), MyFonts "Typography for Older Adults" guide, Untitled UI Best Free Fonts 2026, Sweden Brand Guidelines.

## Chosen pairing (in use)

| Role | Font | Why |
|------|------|-----|
| Display / Headings | **Fraunces** (variable serif) | Warm, editorial, has a soft personality without losing authority. Matches the "Atmospheric Hygge" mood. Variable axes mean we can tune optical size and weight. Reads confidently for older eyes thanks to generous proportions. |
| Body / UI | **Plus Jakarta Sans** | Humanist sans with a tall x-height and open apertures. Friendly without being childish. Excellent at small sizes on iOS-class screens. Pairs cleanly with Fraunces. |
| Brand wordmark | **Caveat** (display only) | Casual brushy script that emulates the existing SocialT logo until the final wordmark SVG is wired in. Used only for the brand mark, never for copy. |

These three are the entire active type system. Headings, sub-headings, hero copy, success titles, upcoming and nearby card titles use Fraunces. Everything else (buttons, inputs, chips, labels, body, captions) uses Plus Jakarta Sans.

Loaded in `global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Fraunces:opsz,wght@9..144,400..700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

## Pre-approved alternatives

If you want to try a different vibe later, swap one of these in inside the same role only — don't mix two different display fonts on one screen.

### Display alternatives

| Font | Vibe | Use when |
|------|------|----------|
| **Bricolage Grotesque** | Bold, playful, slightly quirky sans-display | You want the brand to feel younger and more energetic, less editorial. |
| **DM Serif Display** | Sharp editorial serif | You want stronger contrast and a more luxury / magazine feel. |
| **General Sans (Semibold/Bold)** | Rational Scandinavian sans | You want a more reserved, almost airline-brand feel. |

### Body alternatives

| Font | Vibe | Use when |
|------|------|----------|
| **Inter** | Workhorse UI sans | You want maximum familiarity for a tech-first audience. |
| **Geist Sans** | Modern, slightly geometric | You want a more contemporary, designer-app feel. |
| **Inclusive Sans** | Designed around accessibility research | You want stronger 40–70 legibility above all else. |
| **Sweden Sans** | Official Sweden brand typeface | You want an unmistakably Scandinavian government-grade feel. |

## How to swap a font

1. Update the `@import` in `prototype/src/styles/global.css` to load the new family.
2. Update the matching token(s) in `prototype/src/styles/tokens.css`:
   - `--font-heading` for display swaps.
   - `--font-body` for body/UI swaps.
   - `--font-brand` for the wordmark.
3. Update the relevant section of `SKILL.md` so the doc still matches what's shipping.
4. Run the home, Quick Ping, Create Event and Success screens through the QA checklist in `SKILL.md` section 9.

## Three pairings to consider before locking in (for design review)

1. **Fraunces + Plus Jakarta Sans** — Currently in use. Warm editorial, friendly UI. Best fit for "Atmospheric Hygge".
2. **Bricolage Grotesque + Inter** — More contemporary and a touch more playful. Slightly less warm but more modern. Good if test audiences read the current pairing as "too soft".
3. **DM Serif Display + Inclusive Sans** — Strongest accessibility profile. Editorial luxury feel. Best if 40–70 readability is the absolute top priority.

Recommendation: ship with pairing #1 (current) and use #2 as a fallback if testing shows the brand needs more energy.
