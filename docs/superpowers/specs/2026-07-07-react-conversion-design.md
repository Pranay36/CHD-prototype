# CHD Prototype: Convert to a Vite + React app

## Context

The CHD AI Savings Assistant prototype is currently a hybrid:

- `src/components/aiSavingsAssistant/`, its hook, service, and repository are
  already real React (JSX + hooks) — written to be dropped into CHD-PWA later.
- The root `index.html` is a standalone, dependency-free demo: a ~300-line
  inline `<script>` that hand-builds the "Discover your Credit Card" phone
  frame (status bar, header, lifetime-earnings card, card tabs, milestones,
  offers) using `document.createElement`, and only reaches the AI feature's
  *data*, not the actual `AiSavingsAssistant` React component.
- There is no `package.json` or build tooling — the whole thing is opened via
  `file://` for a zero-install demo.

Goal: convert the whole thing into a real, runnable React application (Vite
dev server), reproducing the same phone-frame demo as actual React
components, and mounting the real `AiSavingsAssistant` component instead of
duplicating its behavior in plain JS.

## Decisions

- **Scope**: real React app via Vite (`npm install && npm run dev`), not a
  CDN/Babel-standalone zero-install page. The old zero-install demo file is
  fully replaced — this folder isn't tracked in git yet, so there's no
  history to preserve.
- **End state**: standalone prototype. Not restructured to mirror
  ironbank-face's Next.js/TypeScript conventions.
- **Language**: plain JS/JSX, matching the existing `src/` code style. No
  TypeScript.

## Tooling

- Add `package.json`, Vite + `@vitejs/plugin-react`, React 18.
- New `index.html` becomes the Vite entry point (loads `/src/main.jsx`),
  replacing the current hand-rolled demo file at the same path.
- `src/main.jsx` creates the root and renders `<App />` into `#root`.

## Component breakdown

New `src/components/chdHome/` holds the phone-frame chrome, replacing the
`document.createElement`-based rendering in the old `index.html`:

- `StatusBar.jsx`
- `ChdHeader.jsx`
- `LifetimeEarningsCard.jsx`
- `CardTabs.jsx`
- `EarningsCard.jsx`
- `MilestonesSection.jsx` (+ `MilestoneRow`)
- `OffersSection.jsx` (+ `OfferCard`)
- `icons.jsx` — SVG icon components, replacing the `IC` string-template object

`src/App.jsx` owns `selectedCardId` state (replacing the old module-level
`selectedId` variable) and composes the chrome components plus the existing
`<AiSavingsAssistant accountId={...} />` — used as-is, no changes to the
component, hook, service, or repository.

## Data

The card-tabs/milestones/offers data (`CUSTOMER`/`CARDS` vars currently
inlined in `index.html`) is decorative demo chrome, distinct from the AI
feature's grounding data in `mockData.js`. It becomes a new plain file,
`src/mockData/cardHomeMockData.js`, imported directly by chrome components —
**no** repository/service indirection, since that seam exists specifically
for the swappable AI data source (per the existing README), not for static
demo UI.

Numbers stay consistent with `mockData.js`:
- Lifetime earnings: ₹15,700
- Total savings: ₹58,340

## Styling

The single inline `<style>` block from the old `index.html` moves to
`src/App.css`. Split further only if a section grows unwieldy. The AI widget
keeps its existing separate `styles.css`.

## Env vars

`aiConstants.js` currently reads `process.env.REACT_APP_AI_*` (CRA
convention). Vite exposes env vars via `import.meta.env.VITE_*`, so this
becomes `import.meta.env.VITE_AI_API_KEY`, `VITE_AI_BASE_URL`,
`VITE_AI_MODEL`. README is updated to reference the new `VITE_` names.

## Verification

- `npm install`
- `npm run build` (catches syntax/import errors)
- `npm run dev`, confirm it serves (curl or similar)
- Drive it in a browser (via the `run` skill if available) to confirm the
  phone-frame UI renders correctly, card-tab switching works, and the AI chat
  flow (greeting, suggested chips, free-text send, typing indicator) still
  works end-to-end.
