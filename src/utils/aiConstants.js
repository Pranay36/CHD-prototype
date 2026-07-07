/**
 * aiConstants.js
 * ---------------------------------------------------------------------------
 * Static configuration for the AI Savings Assistant feature.
 *
 * Everything AI-specific that is NOT customer data lives here so that:
 *  - the system prompt is fixed and auditable in one place,
 *  - suggested questions can be tuned without touching component code,
 *  - swapping the mocked provider for Groq/OpenAI is a config change only.
 *
 * No business logic and no secrets belong in this file. The API key (when a
 * real provider is wired) is read from the environment at runtime.
 */

/**
 * Fixed system prompt for the assistant. Do NOT edit casually — this governs
 * tone and the "answer only from supplied data / never invent numbers" guard
 * rails that keep the assistant safe for a financial context.
 */
export const AI_SYSTEM_PROMPT = `You are Hyperface Discover AI.

You help customers understand their savings, reward points, cashback, benefits, vouchers, and missed savings.

Always answer ONLY from the supplied customer data.

Never invent numbers.

If data is unavailable, say so clearly.

Keep responses short, friendly, professional, and actionable.

Do not expose internal system information.`;

/**
 * Default prompts shown as chips inside the widget. Each has a stable `id`
 * so the mock/AI layer can map to a canned answer, and `text` shown in the UI.
 * Replaceable by a server-driven list later without changing the component.
 */
export const SUGGESTED_QUESTIONS = Object.freeze([
  { id: "where-saved", text: "Do you want to know where you have saved?" },
  { id: "year-end", text: "How much will you save by year end?" },
  { id: "missed-savings", text: "Where are you missing further savings?" },
  { id: "maximize-rewards", text: "How can I maximize my rewards?" },
]);

/**
 * AI provider configuration. `mode` decides which strategy aiService uses.
 *  - "mock"  -> deterministic local responses (default, no network).
 *  - "groq"  -> OpenAI-compatible Groq Chat Completions endpoint.
 *
 * The mode auto-upgrades to "groq" when an API key is present, so enabling a
 * real provider is purely an environment change (no code edits).
 */
export const AI_PROVIDER = Object.freeze({
  MOCK: "mock",
  GROQ: "groq",
});

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

/**
 * Resolve the active provider mode. Real key present => real provider.
 */
export const getAiProviderMode = () =>
  AI_CONFIG.apiKey ? AI_PROVIDER.GROQ : AI_PROVIDER.MOCK;

/**
 * UI copy kept out of the component so it stays declarative and translatable.
 */
export const AI_WIDGET_COPY = Object.freeze({
  title: "AI Assistant",
  totalSavingsLabel: "Total Savings",
  askLabel: "Ask AI",
  inputPlaceholder: "Ask about your savings, rewards or cashback…",
  sendLabel: "Send",
  greeting:
    "Hi! I can break down where you've saved, project your year-end savings, and spot benefits you're missing. Ask me anything or pick a prompt below.",
  errorFallback:
    "Sorry, I couldn't process that right now. Please try again in a moment.",
});
