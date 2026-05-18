# SosialT — End-to-end Review Build

This folder is a **review-only fork** of `../prototype`. It exists so the customer
can sign off on a clean, end-to-end version of the app without touching the
original prototype deployment.

To revert, simply delete this folder. The original `prototype/` directory is
untouched.

## What's different vs `../prototype`

All review-only additions are tagged with `// REVIEW:` in the source so they're
trivial to find and remove.

- New onboarding flow (splash → welcome → phone → OTP → name → contacts)
  in the latest visual design.
- Friend-invite-link, **circle-invite-link**, and event-invite-link landing screens.
- New-user empty home state (encouraging prompts instead of full upcoming list).
- Pre-filled inputs across phone / OTP / name / event title / location for
  instant click-through.
- "Screens" overlay (top-right, in-frame) — jump to any screen for review.
- All screens audited for working back buttons.

## Demo URLs

**This build (v7) — production:** **`https://prototype-review-v7.vercel.app`**

Deploy from this folder with `npx vercel deploy --prod` (links to Vercel project **`prototype-review-v7`**).

Other review hosts in the org (older iterations): **`https://sosialt-review-v2.vercel.app`**, **`https://sosialt-review.vercel.app`**, **`https://prototype-review-v6.vercel.app`** (v6 codebase).

Rollback either project in Vercel → that project → **Deployments** → **Promote to Production**.
- `/#/`                  Home (returning user, full upcoming)
- `/#/?newuser=1`        Home (new user, empty state)
- `/#/onboarding`        Start onboarding from the splash
- `/#/invite/friend/eleanor`  Friend invite-link landing
- `/#/invite/circle/inner-circle` Circle invite-link landing
- `/#/invite/event/jazz-vigeland` Event invite-link landing

The "Screens" panel (top-right of the device frame) lists every screen
in flow order with one tap to jump.

## Run locally

```
npm install
npm run dev
```

## Deploy — two stable hostnames

| URL | Vercel project | Use |
|-----|-----------------|-----|
| **https://sosialt-review-v2.vercel.app** | `sosialt-review-v2` | Latest customer / iteration work **`vercel deploy` from this folder** links here (via `.vercel`, gitignored). |
| **https://sosialt-review.vercel.app** | `sosialt-review` | Legacy / stable comparison build; redeploy only if you **`vercel link`** that project explicitly. |

Each deploy still gets its own **`*.safah99xs-projects.vercel.app`** URL on top of these aliases.

To revert **`sosialt-review`** (first hostname only): Promote an older deployment in the Vercel dashboard for project **sosialt-review**.
