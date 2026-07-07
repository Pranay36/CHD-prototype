# AI Savings Assistant — CHD Prototype

A **frontend-only, mock-backed** prototype of an AI Savings Assistant for the
Hyperface CHD (Card Holder Dashboard) PWA. No backend, no API integration —
everything runs on local mock data. The real CHD-PWA codebase is **not**
modified; this folder is fully self-contained.

## Run the app

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically http://localhost:5173). It renders the
widget inside a CHD-style phone frame. Click a suggested prompt or type a
question — answers come from the mocked AI service.

To build a production bundle: `npm run build` (output in `dist/`).

## Project structure

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

## Architecture

```
UI  →  useSavingsAssistant  →  aiService.askAI()  →  { mock | Groq/OpenAI }
                            →  savingsRepository   →  { mockData | live APIs }
```

Two clean seams keep the prototype swappable:

- **Data seam** (`savingsRepository`): today resolves `mockData.js`; going live
  means routing each method to `PublicService` (CHD Nimbus → Grimlock/Doremon)
  with the same return shapes. UI/service untouched.
- **Provider seam** (`aiService`): no API key → deterministic mock answers; set
  `VITE_AI_API_KEY` (e.g. in a `.env.local` file) → auto-switches to Groq's
  OpenAI-compatible endpoint. No code change.

## Dropping into CHD-PWA

Copy `src/components/aiSavingsAssistant`, `src/customHooks/useSavingsAssistant.js`,
`src/services/aiService.js`, `src/repository/`, `src/mockData/`, and
`src/utils/aiConstants.js` into the CHD-PWA `src/` tree, then render the widget
on the home page:

```jsx
import AiSavingsAssistant from "../../components/aiSavingsAssistant/aiSavingsAssistant";
// ...
<AiSavingsAssistant accountId={accounts?.selectedAccount?.accountId} />
```

Delete this folder's `src/utils/functions.js` — CHD-PWA already provides
`formatRewardValue` with the same signature.

See [`src/mockData/schema.md`](./src/mockData/schema.md) for full entity contracts.
