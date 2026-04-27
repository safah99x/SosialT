# SocialT

A small, calm social app for spending more time with friends in real life. Built for people aged 40 to 70 in Norway who want a warmer alternative to feeds.

The voice is dry, observant, short. The look is "Atmospheric Hygge". The product is two flows: a Quick Ping for now-ish plans, and a Create Event for plans on purpose.

## Stack

- Vanilla JavaScript, modular ES modules
- Vite for dev/build
- CSS variables and component CSS, no framework
- Hash-based SPA router

## Project structure

```
prototype/
  index.html
  package.json
  src/
    main.js
    js/
      router.js
      lib/dynamicCopy.js     <- context-aware hero copy
      components/            <- header, topBar, bottomNav, chip, ...
      screens/               <- home, quickPing, createEvent, eventDetail, ...
    styles/
      tokens.css             <- design tokens
      global.css
      components.css
SKILL.md                     <- single source of truth for the design system
FONTS.md                     <- typography research and rationale
context.md                   <- product context
systemprompt.md              <- design rules
```

## Local development

```bash
cd prototype
npm install
npm run dev
```

The app runs at http://localhost:5173.

## Build

```bash
cd prototype
npm run build
```

Output goes to `prototype/dist`.

## Design system

All design decisions, copy rules, components and screen recipes live in `SKILL.md`. That file is the single source of truth. Change the design, change the doc.

## Deployment

This repo is configured for Vercel. The root `vercel.json` points the build at the `prototype/` directory.
