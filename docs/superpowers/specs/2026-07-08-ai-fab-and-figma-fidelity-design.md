# AI floating action button + Figma fidelity pass

## Context

The AI Savings Assistant currently renders inline in the page flow, between
the earnings card and the milestones section. The user shared a screenshot
of the actual CHD-PWA Figma design showing the "Discover your Credit Card"
home screen with no AI widget inline at all — confirming it's meant to be
reached via a floating trigger, not embedded permanently in the scroll.

The same screenshot also shows several visual details that differ from the
current build: a circular badge behind the header's home icon, outline-style
icons with tinted circle backgrounds (vs. today's solid-fill icons), a
cooler blue-lavender lifetime-earnings gradient, and slightly different
copy ("Your Vetta **Card** Earnings", "This **Card** was deactivated on...").

Decided in brainstorming: the phone's status bar stays removed (a prior,
separate request) even though the reference screenshot shows one — that
instruction takes precedence over matching the screenshot on this one point.

## Decisions

**A. AI floating action button + bottom sheet**

- `AiFab.jsx`: a circular button fixed at the bottom-right of the phone
  frame, using a robot icon (new small icon component, since the existing
  `RobotIcon` is private to `aiSavingsAssistant.js` and that file stays
  unmodified). Always visible, opens the chat.
- `AiChatSheet.jsx`: a bottom sheet that slides up from the bottom of the
  phone frame on open, containing `<AiSavingsAssistant>` unchanged. A
  semi-transparent backdrop covers the rest of the phone; tapping the
  backdrop or a close (✕) button dismisses the sheet. Plain CSS
  transform/opacity transitions — no new dependencies.
- `App.jsx` owns `isChatOpen` boolean state, toggled by the FAB and by the
  sheet's close actions.
- Layout restructuring: `.phone` becomes a fixed-height, non-scrolling
  positioning context (`position: relative; height: 100vh; overflow: hidden`).
  Its existing header/cards content moves into a new inner wrapper,
  `.phone-scroll` (`overflow-y: auto; height: 100%`), so the FAB and sheet —
  siblings of `.phone-scroll`, absolutely positioned against `.phone` — stay
  correctly pinned to the phone frame's own box regardless of scroll
  position or viewport width (a plain CSS `position: fixed` FAB would
  instead pin to the browser window, misaligning with the phone frame on
  any viewport wider than 450px, since the phone is a centered fixed-width
  column).

**B. Figma fidelity fixes**

- `ChdHeader.jsx`: wrap `HomeIcon` in a circular purple badge (new `.home-badge`
  CSS class: circular, purple background, centers the icon).
- `MilestonesSection.jsx` / `EarningsCard.jsx`: swap the solid-fill
  `WalletIcon`/`RewardIcon` for new outline-style variants matching the
  reference (blue-outline wallet, pink-outline shield/badge for rewards),
  paired with lighter tinted circle backgrounds. New icons added to
  `icons.jsx` as `WalletOutlineIcon` / `RewardOutlineIcon`; old solid icons
  removed if no longer used anywhere.
- `EarningsCard.jsx`: copy fix — "Your {card.name} Card Earnings" (adds the
  word "Card").
- `EarningsCard.jsx`: copy fix — "This Card was deactivated on {date}"
  (capitalizes "Card").
- `App.css`: adjust `.lifetime-card` gradient to the cooler blue-lavender
  tone shown in the reference (`#e4ecfb` → `#e9e3f8`-ish range, sampled from
  the screenshot).

## Out of scope

- No live Figma file access (MCP connector not authorized this session) —
  fidelity work is based on visual inspection of the shared screenshot.
- No changes to `aiSavingsAssistant.js`, its hook, service, or repository —
  the widget is wrapped, not modified.
