# SocialT — Context

## Product Summary

SocialT is an event-driven social app designed to help people spend more time together in real life, instead of passively scrolling through feeds.

The product focuses on:
- Quick spontaneous meetups through **Quick Pings**
- More intentional future plans through **Events**
- Private social coordination through **Circles**
- Lightweight invitations between friends

The core experience should feel calm, warm, private, and intentional.

---

## Product Philosophy

SocialT is not a traditional social media feed.

It should avoid:
- Endless scrolling
- Public performance behavior
- Noisy engagement mechanics
- Algorithm-driven content addiction

Instead, SocialT should encourage:
- Real-world action
- Small group coordination
- Low-pressure invitations
- Meaningful social moments

The product should feel like:

> “Let’s do something together.”

Not:

> “Post something for attention.”

---

## Core Creation Flows

SocialT has two closely related creation flows:

1. **Quick Ping**
2. **Create Event**

These should feel like part of the same product family.

---

# Quick Ping

## Purpose

Quick Ping is for spontaneous, low-friction invitations.

Examples:
- Grab a coffee
- Go for a walk
- Meet for lunch
- Quick drink tonight

## Mental Model

Quick Ping = immediate or near-future action.

It answers:

- What are you up to?
- When?
- Where?
- Who should be invited?

## Current Structure

The Quick Ping creation screen follows this order:

1. Header
2. Big editorial title
3. Subtitle
4. Large input field
5. WHEN section
6. WHERE section
7. INVITE section
8. Primary CTA

## Quick Ping Title

Main title:

> What are you up to?

Subtitle:

> Invite your circle to something happening soon.

## Quick Ping Input

The input should be a large soft rounded container.

Example value:

> Grab a coffee

The input should feel like content in progress, not a traditional form field.

## Quick Ping WHEN

Quick Ping uses near-future chips:

- Now
- In 30 min
- Tonight
- Choose time

## Quick Ping WHERE

Quick Ping uses a lightweight location pattern:

Primary card:
- Add location
- Search for a place

Secondary action:
- Current location

## Quick Ping INVITE

Invite section contains:
- Section label: INVITE
- Circles / Friends toggle aligned to the right of the section label
- Circle list items such as:
  - Inner Circle
  - Brunch Pals
  - Late Night Crew

Do not use checkboxes for invite selection.

## Quick Ping CTA

Primary CTA:

> Send Quick Ping

The button uses the SocialT warm micro-gradient style.

---

# Create Event

## Purpose

Create Event is for planned or semi-planned social invitations.

Examples:
- Let’s go to the cabin
- Weekend fishing trip
- Concert this weekend
- Brunch next Saturday
- We haven’t hung out in a while, let’s do something

## Important Product Rule

Create Event should NOT feel like a completely new flow.

It should feel like:

> Quick Ping, but slower and more intentional.

It must reuse the same visual rhythm, component behavior, spacing logic, and emotional tone from Quick Ping.

---

## Create Event Mental Model

Create Event still follows the familiar:

1. What
2. When
3. Where
4. Who
5. Create

But the WHEN logic is more flexible than Quick Ping.

---

## Create Event Structure

The Create Event screen should follow this exact vertical order:

1. Header
2. Big editorial title
3. Large input
4. Optional add photo action
5. WHEN section
6. WHERE section
7. INVITE section
8. Primary CTA

Do not add new sections.
Do not introduce a map.
Do not create a separate hero image layout.
Do not make it look like a form.

---

## Create Event Header

Preferred header title:

> New Event

or

> Create Event

Use whichever is already used in the current implementation, but keep the style aligned with Quick Ping.

---

## Create Event Title

Main title:

> What are you planning?

This title must be large, bold, editorial, and visually close to the Quick Ping title.

It must NOT appear small, weak, greyed out, or like a form label.

---

## Create Event Input

The event input should match the Quick Ping input style.

Example placeholder or value:

> Let’s do something together

or

> Cabin weekend

Rules:
- Use a large soft rounded input container
- Same visual weight as Quick Ping input
- No underline input
- No textarea look
- No weak floating placeholder
- Input should feel like content in progress

---

## Optional Image

The event creator can optionally attach an image.

Important:
- Image is optional
- Image must not dominate the layout
- Do not place a large hero image above the form
- Do not turn the screen into an editorial poster
- Keep image upload as a small secondary action near the input

Suggested label:

> Add photo

The photo action should feel subtle and secondary.

---

## Create Event WHEN

The WHEN section is different from Quick Ping.

It should NOT use near-future chips like:
- Tonight
- Tomorrow
- This weekend

Those belong to Quick Ping only.

Create Event should use only:

- I’m flexible
- Pick dates

## WHEN Behavior

### I’m flexible

Used when the creator does not know the date yet.

Example scenario:
> “We haven’t hung out for a while. Let’s do something together.”

No fixed date is required.

### Pick dates

Used when the creator wants to choose:
- A fixed date
- A date range, similar to Airbnb date range selection

Time is optional.

The event may or may not have a fixed time.

---

## Create Event WHERE

Use the same location pattern as Quick Ping.

Primary card:
- Add location
- Search for a place

Secondary action:
- At my place

No map should be shown.

Do not add:
- Map preview
- Globe image
- Select on map component
- Heavy location card

Keep it lightweight and consistent with Quick Ping.

---

## Create Event INVITE

Use the same invite pattern as Quick Ping.

Rules:
- Section label: INVITE
- Circles / Friends toggle must be aligned to the right of the section title
- Do not place the toggle underneath the title
- Do not use checkboxes
- Do not make invite selection feel like a form
- Use lightweight circle/friend list items

Invite should feel social and warm, not administrative.

---

## Create Event CTA

Primary CTA:

> Create Event

The button must use the same style as the Quick Ping CTA:
- Large rounded button
- Warm micro-gradient
- Premium feel
- Same placement and rhythm as Quick Ping

---

# Design System Summary

SocialT uses a design language called:

> Atmospheric Hygge

This means the interface should feel:
- Calm
- Warm
- Premium
- Scandinavian
- Editorial
- Private
- Spacious but not empty
- Intentional

The UI should feel like a digital sanctuary, not a noisy social feed.

---

## Key Visual Rules

### No-Line Rule

Do not use visible divider lines or hard borders for sectioning.

Use:
- Spacing
- Tonal surface changes
- Soft background shifts

Avoid:
- 1px borders
- Underlined inputs
- Divider lines
- Utility-style form separators

### Tonal Layering

Use surfaces like stacked sheets of paper.

Base:
- Warm cream background

Cards:
- Soft white / slightly elevated surface

Controls:
- Warm yellow selected states
- Soft neutral unselected states

### Typography

Use strong editorial typography.

Main headings should be large, confident, and high contrast.

Labels such as WHEN, WHERE, INVITE should be:
- Small uppercase
- Medium weight
- Muted warm neutral color
- Letter-spaced
- Consistent across sections

### Inputs

Inputs should never feel like traditional forms.

They should feel like:
> Content in progress.

Avoid:
- Thin underline fields
- Textarea blocks
- Greyed-out inactive placeholders
- Utility form styling

### Buttons

Primary buttons use a subtle warm yellow/brown micro-gradient.

The CTA should feel premium and warm, not flat bright yellow.

---

# Product Consistency Rule

Quick Ping and Create Event must feel like siblings.

Quick Ping:
> immediate action

Create Event:
> same pattern, slower intent

The Create Event screen should only change the WHEN logic and CTA label.

Everything else should stay visually and structurally aligned with Quick Ping.
