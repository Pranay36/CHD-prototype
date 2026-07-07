# AI Savings Assistant — Data Schema

Documentation of every entity used by the **AI Savings Assistant** prototype.

These shapes intentionally resemble production contracts served by
**CHD Nimbus (BFF) → Grimlock / Doremon**. The prototype fulfils them from
[`mockData.js`](./mockData.js); going live means swapping the resolver inside
[`../repository/savingsRepository.js`](../repository/savingsRepository.js) —
**no changes to the service or UI layers**.

## Architecture / data flow

```
UI (aiSavingsAssistant)
   └─ useSavingsAssistant (hook: chat state, orchestration)
        ├─ savingsRepository   ← data source boundary (mock today, APIs later)
        │     └─ mockData.js   (→ CHD Nimbus → Grimlock / Doremon)
        └─ aiService.askAI()   ← provider boundary (mock today, Groq/OpenAI later)
```

Conventions:

- All monetary `amount`/`value` fields are **whole INR rupees** in this
  prototype; each money-bearing entity carries a `currency` field (`"INR"`).
- Dates are ISO-8601 (`YYYY-MM-DD`) or full ISO timestamps.
- `accountId` is the join key across savings entities.

---

## 1. Customer

Identity of the signed-in card holder. Sensitive fields are masked.

| Field | Type | Notes |
|---|---|---|
| `customerId` | string | Stable customer identifier |
| `name` | string | Full display name |
| `firstName` | string | Used for greetings |
| `maskedMobile` | string | PII-masked |
| `email` | string | PII-masked |
| `segment` | enum | `PREMIUM` \| `PRIORITY` \| `STANDARD` |
| `memberSince` | date | Relationship start date |

```json
{
  "customerId": "CUST10098234",
  "name": "Himanshu Rajput",
  "firstName": "Himanshu",
  "maskedMobile": "+91 ******3210",
  "email": "h****@example.com",
  "segment": "PREMIUM",
  "memberSince": "2020-12-01"
}
```

---

## 2. Account

A single credit card program held by the customer (multicarding supported).

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | Join key |
| `programId` | enum | `ZENITH_PLUS` \| `ALTURA_PLUS` \| `VETTA` |
| `programName` | string | Display name |
| `productName` | string | Full product name |
| `status` | enum | `ACTIVE` \| `BLOCKED` \| `TRANSFERRED` |
| `maskedCardNumber` | string | PII-masked PAN |
| `isPrimary` | boolean | Default account |
| `deactivatedOn` | date? | Present when not `ACTIVE` |

```json
{
  "accountId": "ACC-ZENITH-001",
  "programId": "ZENITH_PLUS",
  "programName": "Zenith Plus",
  "productName": "AU Zenith Plus Credit Card",
  "status": "ACTIVE",
  "maskedCardNumber": "**** **** **** 4821",
  "isPrimary": true
}
```

---

## 3. Reward Summary

Aggregated benefit rollup for one account — the headline metrics.

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | |
| `currency` | string | `INR` |
| `totalSavings` | number | Equals Savings Summary `amount` |
| `cashbackEarned` | number | |
| `rewardPointsValue` | number | Monetary value of points |
| `vouchersValue` | number | Value of active vouchers |
| `potentialMissedSavings` | number | Sum of Missed Savings opportunities |
| `savingsRatePct` | number | Savings ÷ eligible spend |
| `ytdSpend` | number | Year-to-date spend |

```json
{
  "accountId": "ACC-ZENITH-001",
  "currency": "INR",
  "totalSavings": 58340,
  "cashbackEarned": 18500,
  "rewardPointsValue": 12500,
  "vouchersValue": 9000,
  "potentialMissedSavings": 8100,
  "savingsRatePct": 3.8,
  "ytdSpend": 1535000
}
```

---

## 4. Savings Summary (Total Savings)

The hero number shown in the widget. **Invariant:** `amount` equals the sum of
all Category Savings `amount`s.

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | |
| `currency` | string | `INR` |
| `amount` | number | Total savings (hero value) |
| `period` | enum | `LIFETIME` \| `YTD` \| `MTD` |
| `asOf` | date | Freshness |
| `lifetimeEarnings` | number | Matches home-screen earnings card |

```json
{
  "accountId": "ACC-ZENITH-001",
  "currency": "INR",
  "amount": 58340,
  "period": "LIFETIME",
  "asOf": "2026-07-07",
  "lifetimeEarnings": 15700
}
```

---

## 5. Category Savings

Breakdown of total savings by benefit category (array). Sums to Total Savings.

| Field | Type | Notes |
|---|---|---|
| `categoryId` | enum | `CASHBACK` \| `REWARD_POINTS` \| `VOUCHERS` \| `LOUNGE` \| `DINING_DISCOUNT` \| `FUEL_SURCHARGE_WAIVER` \| `FEE_REVERSAL` |
| `label` | string | Display label |
| `currency` | string | `INR` |
| `amount` | number | Savings in this category |
| `icon` | string | Icon key mapping to app assets |
| `transactionsCount` | number | Contributing transactions |

```json
[
  { "categoryId": "CASHBACK", "label": "Cashback", "currency": "INR", "amount": 18500, "icon": "cashback", "transactionsCount": 142 },
  { "categoryId": "REWARD_POINTS", "label": "Reward Points", "currency": "INR", "amount": 12500, "icon": "rewards", "transactionsCount": 210 }
]
```

---

## 6. Cashback

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | |
| `currency` | string | `INR` |
| `totalEarned` | number | Lifetime cashback |
| `thisMonth` | number | Current month |
| `lastMonth` | number | Prior month |
| `pending` | number | Accrued, not yet credited |
| `topCategory` | string | Highest-earning spend category |
| `ratePct` | number | Headline cashback rate |

```json
{
  "accountId": "ACC-ZENITH-001",
  "currency": "INR",
  "totalEarned": 18500,
  "thisMonth": 1450,
  "lastMonth": 2100,
  "pending": 320,
  "topCategory": "Online Shopping",
  "ratePct": 5
}
```

---

## 7. Reward Points

| Field | Type | Notes |
|---|---|---|
| `accountId` | string | |
| `balance` | number | Points balance (count) |
| `currency` | string | `INR` |
| `valuePerPoint` | number | Conversion rate |
| `monetaryValue` | number | `balance × valuePerPoint` |
| `expiringSoon` | number | Points expiring in `expiringOn` window |
| `expiringOn` | date | Expiry date of `expiringSoon` |
| `redeemedThisYear` | number | Points redeemed YTD |

```json
{
  "accountId": "ACC-ZENITH-001",
  "balance": 25000,
  "currency": "INR",
  "valuePerPoint": 0.5,
  "monetaryValue": 12500,
  "expiringSoon": 3000,
  "expiringOn": "2026-09-30",
  "redeemedThisYear": 4000
}
```

---

## 8. Voucher

Gift cards / vouchers held by the customer (array).

| Field | Type | Notes |
|---|---|---|
| `voucherId` | string | |
| `brand` | string | Issuing brand |
| `currency` | string | `INR` |
| `value` | number | Face value |
| `status` | enum | `ACTIVE` \| `REDEEMED` \| `EXPIRED` |
| `expiryDate` | date | |
| `code` | string | Masked voucher code |

```json
{
  "voucherId": "VCH-AMZN-1001",
  "brand": "Amazon",
  "currency": "INR",
  "value": 3000,
  "status": "ACTIVE",
  "expiryDate": "2026-12-31",
  "code": "AMZ****XYZ"
}
```

---

## 9. Missed Savings

Actionable opportunities the assistant surfaces (array).

| Field | Type | Notes |
|---|---|---|
| `opportunityId` | string | |
| `label` | string | Short title |
| `currency` | string | `INR` |
| `potentialAmount` | number | Recoverable savings |
| `reason` | string | Human-readable explanation |
| `actionText` | string | Suggested next action / CTA |
| `category` | enum | Matches Category Savings `categoryId` |

```json
{
  "opportunityId": "MISS-DINING-02",
  "label": "Unused 20% dining offer",
  "currency": "INR",
  "potentialAmount": 2000,
  "reason": "A partner dining offer expires this month and is still unused.",
  "actionText": "Explore dining offers",
  "category": "DINING_DISCOUNT"
}
```

---

## 10. Savings Projection (year-end)

| Field | Type | Notes |
|---|---|---|
| `currency` | string | `INR` |
| `currentSavings` | number | Today's total |
| `projectedYearEnd` | number | Forecast |
| `monthsRemaining` | number | Months left in the year |
| `avgMonthlySavings` | number | Trailing average |
| `assumptions` | string | Forecast basis |

```json
{
  "currency": "INR",
  "currentSavings": 58340,
  "projectedYearEnd": 71200,
  "monthsRemaining": 6,
  "avgMonthlySavings": 2143,
  "assumptions": "Based on your average monthly savings over the last 6 months."
}
```

---

## 11. Suggested Question

Default prompts rendered as chips. Server-drivable later without UI changes.
Defined in [`../utils/aiConstants.js`](../utils/aiConstants.js).

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable id; maps to a canned mock answer |
| `text` | string | Display text |

```json
[
  { "id": "where-saved", "text": "Do you want to know where you have saved?" },
  { "id": "year-end", "text": "How much will you save by year end?" },
  { "id": "missed-savings", "text": "Where are you missing further savings?" },
  { "id": "maximize-rewards", "text": "How can I maximize my rewards?" }
]
```

---

## 12. AI Request / Response

### Request — `aiService.askAI(question, context, options)`

| Field | Type | Notes |
|---|---|---|
| `question` | string | User's free text or chip text |
| `context` | object | Grounding payload. Base: `savingsRepository.getAiContext()` — bundles customer, accounts (full list), selectedAccount, totalSavings, categorySavings, rewardSummary, cashback, rewardPoints, vouchers, missedSavings, savingsProjection. Merged with: `extraContext` — UI-only data the repository doesn't know about, passed by the host page via `<AiSavingsAssistant extraContext={...}>` (currently `lifetimeEarnings` and `cardPrograms` from [`cardHomeMockData.js`](./cardHomeMockData.js), so the assistant also knows every card's milestones/offers, not just the selected one) |
| `options.questionId` | string? | Suggested-question id (enables canned mock answers) |

### Response

Normalized so the UI is provider-agnostic (identical for mock and Groq/OpenAI).

| Field | Type | Notes |
|---|---|---|
| `text` | string | Assistant answer (may contain `\n` bullet lines) |
| `source` | enum | `mock` \| `groq` \| `error` (telemetry; UI ignores) |
| `meta` | object | e.g. `{ questionId, matched, model }` |
| `timestamp` | string | ISO timestamp |

```json
{
  "text": "You've saved ₹58,340 in total! 🎉 Here's the breakdown: ...",
  "source": "mock",
  "meta": { "questionId": "where-saved", "matched": "questionId" },
  "timestamp": "2026-07-07T10:15:00.000Z"
}
```

### Provider wire format (Groq / OpenAI-compatible)

`aiService` sends an OpenAI-style Chat Completions request. The fixed system
prompt plus the customer `context` (as JSON) enforces *answer-only-from-data*:

```json
{
  "model": "llama-3.3-70b-versatile",
  "temperature": 0.3,
  "max_tokens": 512,
  "messages": [
    { "role": "system", "content": "You are Hyperface Discover AI. ..." },
    { "role": "system", "content": "CUSTOMER DATA (authoritative...): { ...context... }" },
    { "role": "user", "content": "Where have I saved?" }
  ]
}
```

---

## 13. Card Program (home-screen chrome)

Defined in [`cardHomeMockData.js`](./cardHomeMockData.js), **not** `mockData.js` —
this backs the phone-frame's card tabs/milestones/offers UI and has no
repository seam (it's decorative demo data, not a swappable API-backed
entity). It's still passed to the AI as `extraContext` (see §12) so the
assistant knows about every card, not just the selected one.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Tab id (`zenith` \| `altura` \| `vetta`) |
| `accountId` | string | Matches an `accountId` in `mockData.js`'s `accounts` |
| `name` | string | Display name |
| `status` | enum | `ACTIVE` \| `BLOCKED` |
| `earnings` | number | Per-card earnings shown on the earnings card |
| `deactivatedOn` | date? | Present when `status` is `BLOCKED` |
| `milestones` | array | `{ icon, bg, title, sub, progress, tag: { type, text } }` |
| `offers` | array | `{ brand, initials, color, desc, valid }` |

```json
{
  "id": "altura",
  "accountId": "ACC-ALTURA-002",
  "name": "Altura Plus",
  "status": "ACTIVE",
  "earnings": 5200,
  "milestones": [
    { "icon": "wallet", "bg": "bg-blue", "title": "Dining Bonanza", "sub": "Spend ₹5,000 on dining", "progress": 0.8, "tag": { "type": "time", "text": "10 DAYS LEFT" } }
  ],
  "offers": []
}
```

---

## Going live (replacement guide)

| Layer | Prototype | Production swap |
|---|---|---|
| Data | `mockData.js` | Replace resolvers in `savingsRepository.js` with `PublicService` calls to CHD Nimbus → Grimlock / Doremon. Keep return shapes identical. |
| AI | Mock strategy | Set `VITE_AI_API_KEY` (+ optional `VITE_AI_BASE_URL` / `VITE_AI_MODEL`), e.g. in `.env.local`. `aiService` auto-switches to Groq; no code change. |
| UI / Hook | — | No changes required. |
