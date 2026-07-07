# CHD Prototype React Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the CHD AI Savings Assistant prototype from a hybrid (vanilla-JS demo `index.html` + already-React `src/` widget) into a single, real Vite + React application.

**Architecture:** Vite scaffolds the app (`index.html` → `src/main.jsx` → `src/App.jsx`). The phone-frame chrome (status bar, header, lifetime card, tabs, earnings, milestones, offers) becomes plain presentational React components under `src/components/chdHome/`, backed by a new `src/mockData/cardHomeMockData.js`. The existing `src/components/aiSavingsAssistant/` component, its hook, service, and repository are reused unchanged and mounted inside `App.jsx`.

**Tech Stack:** Vite 5, React 18, plain JS/JSX (no TypeScript), no test framework (none existed before; verification is via `npm run build` + manual/browser checks — see Global Constraints).

## Global Constraints

- Plain JavaScript/JSX only — no TypeScript. (Matches existing `src/` code style.)
- No new dependencies beyond `react`, `react-dom`, `vite`, `@vitejs/plugin-react`. Do not add a test framework — none exists in this project and the approved spec's verification plan relies on `npm run build` + browser checks, not unit tests.
- Do not modify `src/components/aiSavingsAssistant/aiSavingsAssistant.js`, `src/customHooks/useSavingsAssistant.js`, `src/services/aiService.js`, `src/repository/savingsRepository.js`, or `src/mockData/mockData.js` — they are already correct React and out of scope, except for the env-var rename in Task 2.
- The phone-frame chrome mock data (`cardHomeMockData.js`) is imported directly by components — no repository/service indirection. That seam is reserved for the AI feature's swappable data source only.
- This project directory is **not a git repository** (`Is a git repository: false`). Skip all `git commit` steps — verify each task via the build/dev/curl commands specified instead.
- Env vars use the `VITE_` prefix (Vite convention), replacing the old CRA-style `REACT_APP_` prefix.

---

### Task 1: Vite scaffold, chrome stylesheet, and docs

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Modify (overwrite): `index.html`
- Create: `src/main.jsx`
- Create: `src/App.jsx`
- Create: `src/App.css`
- Create: `.gitignore`
- Modify: `README.md`

**Interfaces:**
- Produces: `package.json` scripts `dev`, `build`, `preview`. `src/main.jsx` mounts `<App />` (default export from `./App`) into `document.getElementById("root")`. `src/App.jsx` default-exports a function component `App`. `src/App.css` defines classes: `.phone`, `.statusbar` (+ `.icons`), `.chd-header` (+ `.title`), `.lifetime-card` (+ `.hey`, `.lbl`, `.amt`), `.card-tabs`, `.card-tab` (+ `.active`), `.section`, `.section-head`, `.section-title`, `.view-all`, `.earn-card`, `.icon-circle` (+ `.bg-peach`, `.bg-lav`, `.bg-blue`, `.bg-pink`), `.earn-label`, `.earn-amt`, `.deactivated-note`, `.milestone`, `.m-title`, `.m-sub`, `.m-track`, `.m-fill`, `.m-tag` (+ `.expiry`, `.time`), `.m-dot`, `.empty` (+ `.bubble`, `.msg`), `.offer-row`, `.offer` (+ `.brand`, `.desc`, `.valid`), `.brand-logo`, `.dots` (+ `span.on`).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "chd-ai-savings-assistant-prototype",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^5.4.11"
  }
}
```

- [ ] **Step 2: Write `vite.config.js`**

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: Overwrite `index.html` with the Vite entry point**

Read the current `index.html` first (for context only — its content is being fully replaced), then overwrite it with:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AU CHD — AI Savings Assistant Prototype</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 4: Write `src/main.jsx`**

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: Write a minimal placeholder `src/App.jsx`**

This gets replaced incrementally in Tasks 4–6. For now it proves the scaffold mounts.

```jsx
const App = () => (
  <div className="phone">CHD Prototype — React app scaffold OK</div>
);

export default App;
```

- [ ] **Step 6: Write `src/App.css`**

Ported verbatim from the old `index.html`'s inline `<style>` block, excluding the `.ai-*` rules (those stay in `src/components/aiSavingsAssistant/styles.css`, already separate and unchanged).

```css
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  font-family: "Quicksand", "Segoe UI", "Roboto", sans-serif;
  background: #dfe3ec;
  display: flex;
  justify-content: center;
  min-height: 100vh;
}

.phone {
  width: 450px;
  max-width: 100%;
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 40px rgba(0, 0, 0, 0.08);
}

/* ---- status bar ---- */
.statusbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 18px 4px;
  font-size: 13px;
  font-weight: 700;
  color: #303030;
}
.statusbar .icons {
  display: flex;
  gap: 5px;
  align-items: center;
}

/* ---- header ---- */
.chd-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px 16px;
}
.chd-header .title {
  color: #6d3078;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
}

/* ---- lifetime earnings hero ---- */
.lifetime-card {
  margin: 0 16px;
  padding: 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #efe4fb 0%, #e6ddf7 100%);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.lifetime-card .hey {
  font-size: 11px;
  font-weight: 600;
  color: #6b6580;
}
.lifetime-card .lbl {
  font-size: 14px;
  font-weight: 600;
  color: #303030;
  margin-top: 4px;
}
.lifetime-card .amt {
  font-size: 26px;
  font-weight: 700;
  color: #303030;
  margin-top: 2px;
}

/* ---- card tabs ---- */
.card-tabs {
  display: flex;
  gap: 10px;
  padding: 16px;
  flex-wrap: wrap;
}
.card-tab {
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: #303030;
  background: #fff;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 7px 14px;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 2px rgba(48, 48, 48, 0.06);
}
.card-tab.active {
  color: #6d3078;
  background: #fefaff;
  border-color: #6d3078;
}

/* ---- generic section card ---- */
.section {
  margin: 0 16px 12px;
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  box-shadow: 0 1px 3px rgba(48, 48, 48, 0.05);
}
.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303030;
}
.view-all {
  font-size: 14px;
  font-weight: 700;
  color: #f37435;
  cursor: pointer;
}

/* ---- per-card earnings ---- */
.earn-card {
  display: flex;
  align-items: center;
  gap: 12px;
}
.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  flex-shrink: 0;
}
.bg-peach {
  background: #fae3d7;
}
.bg-lav {
  background: #edd7fa;
}
.bg-blue {
  background: #d7e0fa;
}
.bg-pink {
  background: #fadceb;
}
.earn-card .txt {
  flex: 1;
}
.earn-card .earn-label {
  font-size: 14px;
  font-weight: 600;
  color: #303030;
}
.earn-card .earn-amt {
  font-size: 20px;
  font-weight: 700;
  color: #6d3078;
  margin-top: 2px;
}
.deactivated-note {
  font-size: 12px;
  font-weight: 500;
  color: rgba(48, 48, 48, 0.6);
  margin-top: 8px;
}

/* ---- milestone rows ---- */
.milestone {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #f0f0f3;
}
.milestone:first-of-type {
  border-top: none;
}
.milestone .txt {
  flex: 1;
}
.m-title {
  font-size: 14px;
  font-weight: 700;
  color: #303030;
  display: flex;
  justify-content: space-between;
}
.m-sub {
  font-size: 12px;
  font-weight: 500;
  color: #7a7a7a;
  margin-top: 2px;
}
.m-track {
  height: 6px;
  background: #efe6f3;
  border-radius: 4px;
  margin-top: 8px;
  overflow: hidden;
}
.m-fill {
  height: 100%;
  background: #6d3078;
  border-radius: 4px;
}
.m-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 700;
  margin-top: 6px;
  letter-spacing: 0.3px;
}
.m-tag.expiry {
  color: #e5484d;
}
.m-tag.time {
  color: #8a8a8a;
}
.m-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #e5484d;
}

/* ---- empty state ---- */
.empty {
  text-align: center;
  padding: 18px 0;
}
.empty .bubble {
  font-size: 40px;
}
.empty .msg {
  font-size: 13px;
  font-weight: 600;
  color: #7a7a7a;
  margin-top: 6px;
}

/* ---- curated offers ---- */
.offer-row {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
.offer {
  flex: 1;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 12px;
}
.offer .brand {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: #303030;
}
.brand-logo {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
}
.offer .desc {
  font-size: 12px;
  font-weight: 500;
  color: #4a4a4a;
  line-height: 17px;
  margin-top: 8px;
  min-height: 51px;
}
.offer .valid {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  color: #7a7a7a;
  margin-top: 8px;
  border-top: 1px solid #f0f0f3;
  padding-top: 8px;
}
.dots {
  display: flex;
  gap: 5px;
  justify-content: center;
  margin-top: 12px;
}
.dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d5cdda;
}
.dots span.on {
  width: 16px;
  border-radius: 3px;
  background: #6d3078;
}
```

- [ ] **Step 7: Write `.gitignore`**

```
node_modules
dist
.env
.env.local
```

- [ ] **Step 8: Update `README.md`**

Replace the "Run the clickable demo (zero install)" section with:

```markdown
## Run the app

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173). It renders the
widget inside a CHD-style phone frame. Click a suggested prompt or type a
question — answers come from the mocked AI service.

To build a production bundle: `npm run build` (output in `dist/`).
```

Update the "Project structure" code block to add the new files:

```
src/
├── components/
│   ├── aiSavingsAssistant/
│   │   ├── aiSavingsAssistant.js   # widget (presentational only)
│   │   └── styles.css              # matches CHD design system
│   └── chdHome/
│       ├── icons.jsx                # inline SVG icon components
│       ├── StatusBar.jsx
│       ├── ChdHeader.jsx
│       ├── LifetimeEarningsCard.jsx
│       ├── CardTabs.jsx
│       ├── EarningsCard.jsx
│       ├── MilestonesSection.jsx
│       └── OffersSection.jsx
├── customHooks/
│   └── useSavingsAssistant.js  # chat state + orchestration (business logic)
├── services/
│   └── aiService.js            # askAI() — mock today, Groq/OpenAI-ready
├── repository/
│   └── savingsRepository.js    # data-source boundary (mock → APIs later)
├── mockData/
│   ├── mockData.js             # AI feature entities (customer, savings, rewards…)
│   ├── cardHomeMockData.js     # phone-frame chrome demo data (cards, milestones, offers)
│   └── schema.md               # production-style contract docs
├── utils/
│   ├── aiConstants.js          # fixed system prompt, suggested Qs, config
│   └── functions.js            # formatRewardValue (mirrors CHD-PWA)
├── App.jsx                     # composes the phone frame + AI widget
├── App.css                     # phone-frame chrome styles
└── main.jsx                    # Vite/React entry point
index.html                      # Vite entry (loads /src/main.jsx)
```

- [ ] **Step 9: Verify — install and build**

Run: `npm install`
Expected: completes with no errors, creates `node_modules/` and `package-lock.json`.

Run: `npm run build`
Expected: `vite build` completes, prints `dist/` output summary, exit code 0.

- [ ] **Step 10: Verify — dev server serves the page**

Run:
```bash
nohup npm run dev -- --port 5173 --strictPort > /tmp/vite-dev.log 2>&1 &
echo $! > /tmp/vite-dev.pid
sleep 2
curl -sS http://localhost:5173/
kill "$(cat /tmp/vite-dev.pid)"
```
Expected: the curl output is the `index.html` content, including `<div id="root"></div>` and `<script type="module" src="/src/main.jsx">`. No connection error.

---

### Task 2: Migrate env vars from `process.env` (CRA) to `import.meta.env` (Vite)

**Files:**
- Modify: `src/utils/aiConstants.js`
- Modify: `README.md`

**Interfaces:**
- Consumes: nothing new.
- Produces: `AI_CONFIG.baseUrl`, `AI_CONFIG.apiKey`, `AI_CONFIG.model` now sourced from `import.meta.env.VITE_AI_BASE_URL`, `import.meta.env.VITE_AI_API_KEY`, `import.meta.env.VITE_AI_MODEL`. `getAiProviderMode()` behavior unchanged (still keys off `AI_CONFIG.apiKey` truthiness).

- [ ] **Step 1: Update `AI_CONFIG` in `src/utils/aiConstants.js`**

Replace:

```js
export const AI_CONFIG = Object.freeze({
  // Groq exposes an OpenAI-compatible surface; the OpenAI SDK can point here too.
  baseUrl:
    process.env.REACT_APP_AI_BASE_URL || "https://api.groq.com/openai/v1",
  apiKey: process.env.REACT_APP_AI_API_KEY || "",
  model: process.env.REACT_APP_AI_MODEL || "llama-3.3-70b-versatile",
  temperature: 0.3,
  maxTokens: 512,
  // Simulated latency (ms) for the mock provider so the demo feels real.
  mockLatencyMs: 700,
});
```

With:

```js
export const AI_CONFIG = Object.freeze({
  // Groq exposes an OpenAI-compatible surface; the OpenAI SDK can point here too.
  baseUrl:
    import.meta.env.VITE_AI_BASE_URL || "https://api.groq.com/openai/v1",
  apiKey: import.meta.env.VITE_AI_API_KEY || "",
  model: import.meta.env.VITE_AI_MODEL || "llama-3.3-70b-versatile",
  temperature: 0.3,
  maxTokens: 512,
  // Simulated latency (ms) for the mock provider so the demo feels real.
  mockLatencyMs: 700,
});
```

- [ ] **Step 2: Update the "Provider seam" bullet in `README.md`**

Replace:

```markdown
- **Provider seam** (`aiService`): no API key → deterministic mock answers; set
  `REACT_APP_AI_API_KEY` → auto-switches to Groq's OpenAI-compatible endpoint.
  No code change.
```

With:

```markdown
- **Provider seam** (`aiService`): no API key → deterministic mock answers; set
  `VITE_AI_API_KEY` (e.g. in a `.env.local` file) → auto-switches to Groq's
  OpenAI-compatible endpoint. No code change.
```

- [ ] **Step 3: Verify — build succeeds and no CRA-style env vars remain**

Run: `npm run build`
Expected: succeeds, exit code 0.

Run: `grep -rn "process.env" src/`
Expected: no output (no matches).

---

### Task 3: Phone-frame chrome mock data and icon components

**Files:**
- Create: `src/mockData/cardHomeMockData.js`
- Create: `src/components/chdHome/icons.jsx`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `cardHomeMockData.js` exports `CUSTOMER` (`{firstName, name}`), `LIFETIME_EARNINGS` (number), `CARD_PROGRAMS` (array of `{id, accountId, name, status, earnings, deactivatedOn?, milestones: [{icon, bg, title, sub, progress, tag: {type, text}}], offers: [{brand, initials, color, desc, valid}]}`).
  - `icons.jsx` exports zero-prop function components: `HomeIcon`, `StarIcon`, `WalletIcon`, `RewardIcon`, `ChevronIcon`, `LockIcon`, `ClockIcon`, `TicketIcon`, `SignalIcon`, `WifiIcon`, `BatteryIcon`.

- [ ] **Step 1: Write `src/mockData/cardHomeMockData.js`**

```js
/**
 * cardHomeMockData.js
 * ---------------------------------------------------------------------------
 * Mock data for the CHD "Discover your Credit Card" home-screen chrome:
 * customer greeting, lifetime earnings, and the per-card tabs/milestones/
 * offers shown around the AI Savings Assistant widget.
 *
 * This is demo-only decorative data — unlike src/mockData/mockData.js (which
 * backs the swappable AI feature via savingsRepository), this file is
 * imported directly by the chrome components with no repository seam, since
 * there's no live-API replacement planned for this cosmetic UI.
 *
 * `accountId` on each entry matches an entry in mockData.js's `accounts`
 * array, so switching card tabs also changes which account the AI Savings
 * Assistant grounds its answers in.
 */

export const CUSTOMER = {
  firstName: "Himanshu",
  name: "Himanshu Rajput",
};

export const LIFETIME_EARNINGS = 15700;

export const CARD_PROGRAMS = [
  {
    id: "zenith",
    accountId: "ACC-ZENITH-001",
    name: "Zenith Plus",
    status: "ACTIVE",
    earnings: 8750,
    milestones: [
      {
        icon: "wallet",
        bg: "bg-lav",
        title: "Get 10% Cashback",
        sub: "Spend ₹80,000 more",
        progress: 0.34,
        tag: { type: "expiry", text: "EXPIRES TODAY" },
      },
      {
        icon: "reward",
        bg: "bg-peach",
        title: "Earn 1000 Reward Points",
        sub: "Complete 3 transactions",
        progress: 0.62,
        tag: { type: "time", text: "25 DAYS LEFT" },
      },
    ],
    offers: [
      {
        brand: "MakeMyTrip",
        initials: "MMT",
        color: "#e0322f",
        desc: "Upto 50% off on flights, hotels and holiday bookings.",
        valid: "30th April",
      },
      {
        brand: "Nykaa",
        initials: "N",
        color: "#e5399a",
        desc: "Flat 70% discount on purchases on modern and ethnic jewellery",
        valid: "30th April",
      },
    ],
  },
  {
    id: "altura",
    accountId: "ACC-ALTURA-002",
    name: "Altura Plus",
    status: "ACTIVE",
    earnings: 5200,
    milestones: [
      {
        icon: "wallet",
        bg: "bg-blue",
        title: "Dining Bonanza",
        sub: "Spend ₹5,000 on dining",
        progress: 0.8,
        tag: { type: "time", text: "10 DAYS LEFT" },
      },
    ],
    offers: [
      {
        brand: "MakeMyTrip",
        initials: "MMT",
        color: "#e0322f",
        desc: "Upto 50% off on flights, hotels and holiday bookings.",
        valid: "30th April",
      },
      {
        brand: "Nykaa",
        initials: "N",
        color: "#e5399a",
        desc: "Flat 70% discount on purchases on modern and ethnic jewellery",
        valid: "30th April",
      },
    ],
  },
  {
    id: "vetta",
    accountId: "ACC-VETTA-003",
    name: "Vetta",
    status: "BLOCKED",
    earnings: 8750,
    deactivatedOn: "23 Feb 2024",
    milestones: [],
    offers: [],
  },
];
```

- [ ] **Step 2: Write `src/components/chdHome/icons.jsx`**

```jsx
export const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 10.8L12 4l8 6.8V20a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1v-9.2z"
      fill="#fff"
      stroke="#6D3078"
      strokeWidth="1.7"
      strokeLinejoin="round"
    />
  </svg>
);

export const StarIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 2.4l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 17.5l-5.8 3.05 1.1-6.5-4.7-4.6 6.5-.95L12 2.4z"
      fill="#6D3078"
    />
  </svg>
);

export const WalletIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="6" width="18" height="13" rx="3" fill="#6D3078" />
    <path d="M3 9h18" stroke="#a771b3" strokeWidth="1.4" />
    <circle cx="17" cy="13.5" r="1.7" fill="#fff" />
  </svg>
);

export const RewardIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2l7 3v6c0 4.5-3 8-7 9-4-1-7-4.5-7-9V5l7-3z" fill="#6D3078" />
    <path
      d="M12 7l1.15 2.4 2.6.35-1.9 1.85.47 2.6L12 13.35 9.6 14.65l.47-2.6L8.2 10.2l2.6-.35L12 7z"
      fill="#fff"
    />
  </svg>
);

export const ChevronIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6l6 6-6 6"
      stroke="#b3b3b3"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="#6D3078" />
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" stroke="#6D3078" strokeWidth="1.8" fill="none" />
  </svg>
);

export const ClockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#8a8a8a" strokeWidth="1.8" />
    <path d="M12 7.5v5l3 2" stroke="#8a8a8a" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

export const TicketIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 1.6 1.6 0 0 0 0 3.2 2 2 0 0 1-2 2H5a2 2 0 0 1-2-2 1.6 1.6 0 0 0 0-3.2z"
      fill="#f5a623"
    />
  </svg>
);

export const SignalIcon = () => (
  <svg width="17" height="12" viewBox="0 0 18 12" fill="#303030" aria-hidden="true">
    <rect x="0" y="8" width="3" height="4" rx="1" />
    <rect x="5" y="5" width="3" height="7" rx="1" />
    <rect x="10" y="2.5" width="3" height="9.5" rx="1" />
    <rect x="15" y="0" width="3" height="12" rx="1" />
  </svg>
);

export const WifiIcon = () => (
  <svg width="16" height="12" viewBox="0 0 18 13" fill="none" aria-hidden="true">
    <path
      d="M9 11l-.01.01M2 5a10 10 0 0 1 14 0M4.5 7.7a6 6 0 0 1 9 0M9 10.5l.01-.01"
      stroke="#303030"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export const BatteryIcon = () => (
  <svg width="24" height="12" viewBox="0 0 26 13" fill="none" aria-hidden="true">
    <rect x="1" y="1" width="21" height="11" rx="3" stroke="#303030" strokeWidth="1.3" />
    <rect x="3" y="3" width="16" height="7" rx="1.5" fill="#303030" />
    <rect x="23.5" y="4.5" width="2" height="4" rx="1" fill="#303030" />
  </svg>
);
```

- [ ] **Step 3: Verify — mock data module loads and build succeeds**

Run: `node -e "import('./src/mockData/cardHomeMockData.js').then(m => console.log(Object.keys(m)))"`
Expected: prints `[ 'CUSTOMER', 'LIFETIME_EARNINGS', 'CARD_PROGRAMS' ]`, no error.

Run: `npm run build`
Expected: succeeds, exit code 0. Note: `icons.jsx` isn't imported by anything yet, so this only confirms no regressions in the files built so far (Task 1/2) — `icons.jsx`'s JSX gets validated for real once Task 4 imports it.

---

### Task 4: Status bar, header, and lifetime-earnings card

**Files:**
- Create: `src/components/chdHome/StatusBar.jsx`
- Create: `src/components/chdHome/ChdHeader.jsx`
- Create: `src/components/chdHome/LifetimeEarningsCard.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `icons.jsx` (`HomeIcon`, `StarIcon`, `SignalIcon`, `WifiIcon`, `BatteryIcon`), `cardHomeMockData.js` (`CUSTOMER`, `LIFETIME_EARNINGS`), `utils/functions.js` (`formatRewardValue`).
- Produces: `StatusBar` (default export, no props), `ChdHeader` (default export, no props), `LifetimeEarningsCard` (default export, props `{customerName, lifetimeEarnings}`).

- [ ] **Step 1: Write `src/components/chdHome/StatusBar.jsx`**

```jsx
import { SignalIcon, WifiIcon, BatteryIcon } from "./icons";

const StatusBar = () => (
  <div className="statusbar">
    <span>9:41</span>
    <span className="icons">
      <SignalIcon />
      <WifiIcon />
      <BatteryIcon />
    </span>
  </div>
);

export default StatusBar;
```

- [ ] **Step 2: Write `src/components/chdHome/ChdHeader.jsx`**

```jsx
import { HomeIcon } from "./icons";

const ChdHeader = () => (
  <div className="chd-header">
    <div className="title">Discover your Credit Card</div>
    <HomeIcon />
  </div>
);

export default ChdHeader;
```

- [ ] **Step 3: Write `src/components/chdHome/LifetimeEarningsCard.jsx`**

```jsx
import { StarIcon } from "./icons";
import { formatRewardValue } from "../../utils/functions";

const LifetimeEarningsCard = ({ customerName, lifetimeEarnings }) => (
  <div className="lifetime-card">
    <div>
      <div className="hey">Hey, {customerName}!</div>
      <div className="lbl">Your lifetime earnings</div>
      <div className="amt">{formatRewardValue(lifetimeEarnings)}</div>
    </div>
    <StarIcon />
  </div>
);

export default LifetimeEarningsCard;
```

- [ ] **Step 4: Replace `src/App.jsx` to render the three new components**

```jsx
import StatusBar from "./components/chdHome/StatusBar";
import ChdHeader from "./components/chdHome/ChdHeader";
import LifetimeEarningsCard from "./components/chdHome/LifetimeEarningsCard";
import { CUSTOMER, LIFETIME_EARNINGS } from "./mockData/cardHomeMockData";

const App = () => (
  <div className="phone">
    <StatusBar />
    <ChdHeader />
    <LifetimeEarningsCard
      customerName={CUSTOMER.name}
      lifetimeEarnings={LIFETIME_EARNINGS}
    />
  </div>
);

export default App;
```

- [ ] **Step 5: Verify — build and dev server**

Run: `npm run build`
Expected: succeeds, exit code 0.

Run:
```bash
nohup npm run dev -- --port 5173 --strictPort > /tmp/vite-dev.log 2>&1 &
echo $! > /tmp/vite-dev.pid
sleep 2
curl -sS http://localhost:5173/src/App.jsx | head -5
kill "$(cat /tmp/vite-dev.pid)"
```
Expected: curl returns transformed JS (Vite's on-the-fly JSX transform output) with no 404/500 — confirms `App.jsx` and its new imports resolve.

---

### Task 5: Card tabs and per-card earnings, with selection state

**Files:**
- Create: `src/components/chdHome/CardTabs.jsx`
- Create: `src/components/chdHome/EarningsCard.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `icons.jsx` (`LockIcon`, `WalletIcon`, `ChevronIcon`), `utils/functions.js` (`formatRewardValue`), `cardHomeMockData.js` (`CARD_PROGRAMS`).
- Produces: `CardTabs` (default export, props `{cards, selectedCardId, onSelect}`), `EarningsCard` (default export, props `{card}`).

- [ ] **Step 1: Write `src/components/chdHome/CardTabs.jsx`**

```jsx
import { LockIcon } from "./icons";

const CardTabs = ({ cards, selectedCardId, onSelect }) => (
  <div className="card-tabs">
    {cards.map((card) => (
      <button
        key={card.id}
        type="button"
        className={`card-tab${card.id === selectedCardId ? " active" : ""}`}
        onClick={() => onSelect(card.id)}
      >
        <span>{card.name}</span>
        {card.status === "BLOCKED" && <LockIcon />}
      </button>
    ))}
  </div>
);

export default CardTabs;
```

- [ ] **Step 2: Write `src/components/chdHome/EarningsCard.jsx`**

```jsx
import { WalletIcon, ChevronIcon } from "./icons";
import { formatRewardValue } from "../../utils/functions";

const EarningsCard = ({ card }) => (
  <div className="section">
    <div className="earn-card">
      <div className="icon-circle bg-peach">
        <WalletIcon />
      </div>
      <div className="txt">
        <div className="earn-label">Your {card.name} Earnings</div>
        <div className="earn-amt">{formatRewardValue(card.earnings)}</div>
        {card.status === "BLOCKED" && (
          <div className="deactivated-note">
            This card was deactivated on {card.deactivatedOn}
          </div>
        )}
      </div>
      {card.status !== "BLOCKED" && <ChevronIcon />}
    </div>
  </div>
);

export default EarningsCard;
```

- [ ] **Step 3: Update `src/App.jsx` to add selection state and render tabs + earnings**

```jsx
import { useState } from "react";
import StatusBar from "./components/chdHome/StatusBar";
import ChdHeader from "./components/chdHome/ChdHeader";
import LifetimeEarningsCard from "./components/chdHome/LifetimeEarningsCard";
import CardTabs from "./components/chdHome/CardTabs";
import EarningsCard from "./components/chdHome/EarningsCard";
import {
  CUSTOMER,
  LIFETIME_EARNINGS,
  CARD_PROGRAMS,
} from "./mockData/cardHomeMockData";

const App = () => {
  const [selectedCardId, setSelectedCardId] = useState(CARD_PROGRAMS[0].id);
  const selectedCard = CARD_PROGRAMS.find((c) => c.id === selectedCardId);

  return (
    <div className="phone">
      <StatusBar />
      <ChdHeader />
      <LifetimeEarningsCard
        customerName={CUSTOMER.name}
        lifetimeEarnings={LIFETIME_EARNINGS}
      />
      <CardTabs
        cards={CARD_PROGRAMS}
        selectedCardId={selectedCardId}
        onSelect={setSelectedCardId}
      />
      <EarningsCard card={selectedCard} />
    </div>
  );
};

export default App;
```

- [ ] **Step 4: Verify — build and dev server**

Run: `npm run build`
Expected: succeeds, exit code 0.

Run:
```bash
nohup npm run dev -- --port 5173 --strictPort > /tmp/vite-dev.log 2>&1 &
echo $! > /tmp/vite-dev.pid
sleep 2
curl -sS http://localhost:5173/src/App.jsx | head -5
kill "$(cat /tmp/vite-dev.pid)"
```
Expected: same as Task 4 — resolves with no 404/500.

---

### Task 6: Milestones, offers, AI widget wiring, and final assembly

**Files:**
- Create: `src/components/chdHome/MilestonesSection.jsx`
- Create: `src/components/chdHome/OffersSection.jsx`
- Modify: `src/App.jsx`

**Interfaces:**
- Consumes: `icons.jsx` (`WalletIcon`, `RewardIcon`, `ChevronIcon`, `ClockIcon`, `TicketIcon`), `cardHomeMockData.js` (`CARD_PROGRAMS` shape), `src/components/aiSavingsAssistant/aiSavingsAssistant.js` default export (props `{accountId}`).
- Produces: `MilestonesSection` (default export, props `{milestones}`), `OffersSection` (default export, props `{offers}`). Final `App.jsx`.

- [ ] **Step 1: Write `src/components/chdHome/MilestonesSection.jsx`**

```jsx
import { WalletIcon, RewardIcon, ChevronIcon, ClockIcon } from "./icons";

const MILESTONE_ICONS = {
  wallet: WalletIcon,
  reward: RewardIcon,
};

const MilestoneRow = ({ milestone }) => {
  const Icon = MILESTONE_ICONS[milestone.icon];
  return (
    <div className="milestone">
      <div className={`icon-circle ${milestone.bg}`}>
        <Icon />
      </div>
      <div className="txt">
        <div className="m-title">
          <span>{milestone.title}</span>
          <ChevronIcon />
        </div>
        <div className="m-sub">{milestone.sub}</div>
        <div className="m-track">
          <div
            className="m-fill"
            style={{ width: `${Math.round(milestone.progress * 100)}%` }}
          />
        </div>
        <div className={`m-tag ${milestone.tag.type}`}>
          {milestone.tag.type === "expiry" ? (
            <span className="m-dot" />
          ) : (
            <ClockIcon />
          )}
          <span>{milestone.tag.text}</span>
        </div>
      </div>
    </div>
  );
};

const MilestonesSection = ({ milestones }) => (
  <div className="section">
    <div className="section-head">
      <div className="section-title">Milestones &amp; Exclusive Offers</div>
      {milestones.length > 0 && <div className="view-all">View All</div>}
    </div>
    {milestones.length > 0 ? (
      milestones.map((m) => <MilestoneRow key={m.title} milestone={m} />)
    ) : (
      <div className="empty">
        <div className="bubble">🤔</div>
        <div className="msg">No active milestones for you</div>
      </div>
    )}
  </div>
);

export default MilestonesSection;
```

- [ ] **Step 2: Write `src/components/chdHome/OffersSection.jsx`**

```jsx
import { TicketIcon } from "./icons";

const OfferCard = ({ offer }) => (
  <div className="offer">
    <div className="brand">
      <div className="brand-logo" style={{ background: offer.color }}>
        {offer.initials}
      </div>
      <span>{offer.brand}</span>
    </div>
    <div className="desc">{offer.desc}</div>
    <div className="valid">
      <TicketIcon />
      <span>Valid Till {offer.valid}</span>
    </div>
  </div>
);

const OffersSection = ({ offers }) => {
  if (offers.length === 0) return null;
  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">Offers Curated For You</div>
        <div className="view-all">View All</div>
      </div>
      <div className="offer-row">
        {offers.map((offer) => (
          <OfferCard key={offer.brand} offer={offer} />
        ))}
      </div>
      <div className="dots">
        <span className="on" />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default OffersSection;
```

- [ ] **Step 3: Finalize `src/App.jsx`**

Order matches the original demo: status bar → header → lifetime card → tabs → earnings → **AI widget** → milestones → offers.

```jsx
import { useState } from "react";
import StatusBar from "./components/chdHome/StatusBar";
import ChdHeader from "./components/chdHome/ChdHeader";
import LifetimeEarningsCard from "./components/chdHome/LifetimeEarningsCard";
import CardTabs from "./components/chdHome/CardTabs";
import EarningsCard from "./components/chdHome/EarningsCard";
import MilestonesSection from "./components/chdHome/MilestonesSection";
import OffersSection from "./components/chdHome/OffersSection";
import AiSavingsAssistant from "./components/aiSavingsAssistant/aiSavingsAssistant";
import {
  CUSTOMER,
  LIFETIME_EARNINGS,
  CARD_PROGRAMS,
} from "./mockData/cardHomeMockData";

const App = () => {
  const [selectedCardId, setSelectedCardId] = useState(CARD_PROGRAMS[0].id);
  const selectedCard = CARD_PROGRAMS.find((c) => c.id === selectedCardId);

  return (
    <div className="phone">
      <StatusBar />
      <ChdHeader />
      <LifetimeEarningsCard
        customerName={CUSTOMER.name}
        lifetimeEarnings={LIFETIME_EARNINGS}
      />
      <CardTabs
        cards={CARD_PROGRAMS}
        selectedCardId={selectedCardId}
        onSelect={setSelectedCardId}
      />
      <EarningsCard card={selectedCard} />
      <AiSavingsAssistant accountId={selectedCard.accountId} />
      <MilestonesSection milestones={selectedCard.milestones} />
      <OffersSection offers={selectedCard.offers} />
    </div>
  );
};

export default App;
```

- [ ] **Step 4: Verify — build and dev server**

Run: `npm run build`
Expected: succeeds, exit code 0.

Run:
```bash
nohup npm run dev -- --port 5173 --strictPort > /tmp/vite-dev.log 2>&1 &
echo $! > /tmp/vite-dev.pid
sleep 2
curl -sS http://localhost:5173/src/App.jsx | head -5
kill "$(cat /tmp/vite-dev.pid)"
```
Expected: resolves with no 404/500 — confirms the full component graph (including `AiSavingsAssistant` and its hook/service/repository chain) is wired without import errors.

---

### Task 7: Full verification pass

**Files:** none (verification only).

**Interfaces:** none.

- [ ] **Step 1: Clean install and build from scratch**

Run:
```bash
rm -rf node_modules dist
npm install
npm run build
```
Expected: both commands succeed with exit code 0, `dist/` is created.

- [ ] **Step 2: Start the dev server**

Run:
```bash
nohup npm run dev -- --port 5173 --strictPort > /tmp/vite-dev.log 2>&1 &
echo $! > /tmp/vite-dev.pid
sleep 2
curl -sS -o /dev/null -w "%{http_code}\n" http://localhost:5173/
```
Expected: prints `200`.

- [ ] **Step 3: Browser walkthrough**

Use the `run` skill (or, if unavailable, any browser automation tool already configured in this environment) to open `http://localhost:5173/` and confirm:
- The phone frame renders: status bar, "Discover your Credit Card" header, purple lifetime-earnings card showing "Hey, Himanshu Rajput!" and ₹15,700.
- Three card tabs are visible: "Zenith Plus", "Altura Plus", "Vetta" (with a lock icon on Vetta).
- With "Zenith Plus" selected (default): earnings ₹8,750, two milestones ("Get 10% Cashback", "Earn 1000 Reward Points"), two offers (MakeMyTrip, Nykaa).
- Clicking "Altura Plus" updates earnings to ₹5,200 and shows its one milestone ("Dining Bonanza").
- Clicking "Vetta" shows the deactivated note ("This card was deactivated on 23 Feb 2024"), no chevron icon, an empty-milestones state ("No active milestones for you"), and no offers section.
- The AI Savings Assistant widget appears between the earnings card and the milestones section, shows the shimmer then ₹58,340 total savings, and displays the greeting message.
- Clicking a suggested-question chip (e.g. "Do you want to know where you have saved?") shows a typing indicator, then a canned answer breaking down savings by category.
- Typing free text containing a keyword (e.g. "What about my cashback?") and pressing Enter returns the cashback-specific canned answer.
- Typing unrelated free text (e.g. "hello") returns the default fallback answer.

- [ ] **Step 4: Stop the dev server**

Run: `kill "$(cat /tmp/vite-dev.pid)"`
Expected: process terminates, no error.
