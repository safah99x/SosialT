# SosialT — Claude Code System Prompt

You are helping implement the SosialT mobile app UI.

You must follow the provided product context and design system exactly.

Your job is not to invent a new style. Your job is to preserve and implement the existing SosialT visual and interaction language.

---

## Core Product Understanding

SosialT is an event-driven social app for real-world social coordination.

It is not a traditional social media feed.

The app should help users:
- Send spontaneous Quick Pings
- Create planned or semi-planned Events
- Invite Circles or Friends
- Coordinate real-life moments

The app should avoid:
- Feed-like scrolling
- Generic form screens
- Utility-style UI
- Noisy social media patterns

The interface should feel:
- Warm
- Calm
- Scandinavian
- Premium
- Editorial
- Private
- Intentional

---

## Design North Star

The design language is:

> Atmospheric Hygge

This means the UI should feel like a calm digital sanctuary.

Use:
- Warm cream backgrounds
- Soft tonal surfaces
- Large editorial typography
- Rounded containers
- Warm yellow accents
- Gentle spacing
- Premium micro-gradient CTA buttons

Avoid:
- Hard borders
- Divider lines
- Generic forms
- Pure black
- Heavy shadows
- Loud gradients
- Overly decorative layouts

---

## Non-Negotiable Global Rules

1. Do not redesign the product.
2. Do not introduce a new visual language.
3. Do not create generic form-based screens.
4. Do not use visible divider lines.
5. Do not use underline inputs.
6. Do not use maps in the Create Event screen.
7. Do not use checkboxes in invite selection.
8. Do not make optional images dominate the screen.
9. Do not make Create Event feel like a different product from Quick Ping.
10. Keep Quick Ping and Create Event visually aligned.

---

# Layout Philosophy

All creation flows must follow a single uninterrupted vertical rhythm.

Creation screens should feel like:

> Writing an invitation

Not:

> Filling out a form

The main rhythm is:

Title
→ Input
→ When
→ Where
→ Invite
→ CTA

Do not add unnecessary sections.
Do not reorder sections.
Do not introduce layout experiments unless explicitly requested.

---

# Quick Ping Reference Pattern

Quick Ping is the reference screen.

Its structure is:

1. Header
2. Large editorial title
3. Subtitle
4. Large rounded input
5. WHEN section
6. WHERE section
7. INVITE section
8. Primary CTA

Quick Ping title:

> What are you up to?

Subtitle:

> Invite your circle to something happening soon.

Input example:

> Grab a coffee

CTA:

> Send Quick Ping

The Quick Ping style is the source of truth for:
- Spacing
- Input style
- Location style
- Invite style
- CTA style
- Section label styling
- Overall rhythm

---

# Create Event Implementation Rules

Create Event must be implemented as a direct sibling of Quick Ping.

It should feel like:

> Quick Ping, but slower and more intentional.

It should not feel like:
- A new feature pattern
- A poster composer
- A large form
- A calendar app
- A generic event creation screen

---

## Create Event Required Structure

Use this exact vertical order:

1. Header
2. Large title
3. Large rounded input
4. Optional add photo action
5. WHEN
6. WHERE
7. INVITE
8. CTA

---

## Header

Use the current header pattern.

Header title can be:

> New Event

or

> Create Event

Use whichever is already consistent with the implementation.

---

## Main Title

Text:

> What are you planning?

This must be large and editorial.

It must visually match the weight and confidence of Quick Ping’s title.

Do not render it small.
Do not render it greyed out.
Do not make it look like a form label.

---

## Event Input

Use the same input pattern as Quick Ping.

The input should be a large soft rounded container.

Possible placeholder or default value:

> Let’s do something together

or

> Type here...

But it must not appear weak, detached, or like a floating placeholder.

Rules:
- No underline input
- No textarea-style giant box
- No material field styling
- No floating label
- Same visual weight as Quick Ping input
- Should feel like content in progress

---

## Optional Photo

The creator can optionally attach an image.

Implementation rules:
- Use a small secondary action
- Label: Add photo
- Keep it close to the input area
- Do not place it as a hero image
- Do not create a large image placeholder
- Do not make the photo control visually dominate the screen

Photo is enhancement, not structure.

---

## WHEN Section

The Create Event WHEN section must contain only:

- I’m flexible
- Pick dates

Do not include:
- Tonight
- Tomorrow
- This Weekend
- Now
- In 30 min
- Choose time

Those quick-time options belong to Quick Ping only.

### I’m flexible

Used when the creator does not know the date yet.

### Pick dates

Used when the creator wants to choose a date or date range.

The date picker should support:
- Single date
- Date range, similar to Airbnb

Time is optional.

Do not force time selection.

---

## WHERE Section

Use the same location pattern as Quick Ping.

Required:
- Add location
- Search for a place
- At my place

Do not use:
- Map
- Globe image
- Select on map
- Large location preview
- Heavy location blocks

The location section should be lightweight.

---

## INVITE Section

Use the same invite pattern as Quick Ping.

Required:
- Section label: INVITE
- Circles / Friends toggle aligned to the right side of the INVITE label
- Lightweight list items for circles/friends

Do not:
- Put the toggle under the section title
- Use checkboxes
- Make invite rows look like admin cards
- Make invite feel like a form

Selection should feel social and lightweight.

---

## Section Label Styling

Labels such as WHEN, WHERE, and INVITE must be consistent.

Use:
- Uppercase text
- Medium weight
- Muted warm neutral color
- Letter spacing
- Same styling as Quick Ping

Do not use:
- Question marks
- Heavy black labels
- Random capitalization
- Thin grey labels

Correct:
- WHEN
- WHERE
- INVITE

Incorrect:
- When?
- Where?
- Invite

---

## CTA

Create Event CTA text:

> Create Event

The CTA must match Quick Ping’s CTA style:
- Large rounded button
- Warm brown-to-yellow micro-gradient
- Premium feel
- Same placement and width logic
- Same bottom rhythm

Do not use a flat bright yellow button.

---

# Visual Rules

## Colors

Use warm cream and soft yellow tones.

Avoid pure black. Use charcoal-like near-black for main text.

Use muted warm neutral colors for metadata and labels.

Selected chips should use warm yellow.
Unselected chips should use soft neutral cream/grey.

---

## Borders

Follow the No-Line Rule.

Avoid visible borders.

If a boundary is absolutely required:
- Use extremely subtle tonal difference
- Prefer surface layering over strokes

---

## Cards

Cards should be:
- Soft
- Rounded
- Tonal
- Lightweight

Avoid heavy card stacks and admin-style rows.

---

## Spacing

Spacing should feel intentional and breathable.

But avoid excessive empty gaps that make the screen feel unfinished.

Match Quick Ping’s vertical rhythm.

---

## Typography

Use strong editorial hierarchy.

The main screen title should be dominant.

Section labels should be smaller but confident.

Input text should be large enough to feel like content, not placeholder utility text.

---

# Implementation Priority

When implementing or correcting the Create Event screen, prioritize in this order:

1. Match Quick Ping rhythm
2. Fix main title scale
3. Fix input style
4. Fix section labels
5. Fix WHEN chips
6. Fix WHERE pattern
7. Fix INVITE layout
8. Fix CTA gradient
9. Remove generic form behavior

---

# Final Acceptance Criteria

The Create Event screen is correct only if:

- It feels like the same product as Quick Ping
- It follows the same vertical rhythm
- The title is large and editorial
- The input matches Quick Ping
- WHEN only has “I’m flexible” and “Pick dates”
- WHERE has no map
- INVITE toggle is right-aligned with the section title
- There are no checkboxes
- The CTA matches Quick Ping’s warm premium button
- The screen feels calm, social, and intentional

If the screen feels like a form, calendar app, admin tool, or poster creator, it is wrong.
