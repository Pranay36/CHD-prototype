/**
 * aiService.js
 * ---------------------------------------------------------------------------
 * The AI abstraction layer. The UI calls exactly ONE function — askAI() — and
 * never knows whether the answer came from local mocks or a real LLM.
 *
 *      UI  ->  aiService.askAI(question, context)  ->  { mock | Groq/OpenAI }
 *
 * Switching providers is a config change only (see utils/aiConstants.js):
 *   - No API key   -> deterministic MOCK responses (default, offline-friendly).
 *   - API key set  -> Groq's OpenAI-compatible Chat Completions endpoint.
 *
 * Because Groq is OpenAI-compatible, moving to the official OpenAI SDK later is
 * a drop-in: build the same `messages` array and call `client.chat.completions
 * .create(...)`. All prompt/provider logic stays inside this file.
 */

import {
  AI_SYSTEM_PROMPT,
  AI_CONFIG,
  AI_PROVIDER,
  AI_WIDGET_COPY,
  getAiProviderMode,
} from "../utils/aiConstants";
import savingsRepository from "../repository/savingsRepository";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Normalize the shape every strategy returns, so the UI is provider-agnostic. */
const makeResult = ({ text, source, meta = {} }) => ({
  text: (text || "").trim(),
  source, // "mock" | "groq" — useful for debugging/telemetry, ignored by UI
  meta, // e.g. { questionId, matched, model }
  timestamp: new Date().toISOString(),
});

/* ------------------------------------------------------------------ MOCK ---- */
/**
 * Deterministic local strategy. Grounds answers in the canned response bank so
 * numbers always match the mock dataset. Resolution order:
 *   1) exact suggested-question id  2) keyword match  3) default fallback
 */
const askMock = async (question, context, options = {}) => {
  const bank = await savingsRepository.getAiResponseBank();
  await delay(AI_CONFIG.mockLatencyMs); // simulate think time

  const q = (question || "").toLowerCase().trim();

  // 1) Suggested-question chip -> canned answer.
  if (options.questionId && bank.byQuestionId?.[options.questionId]) {
    return makeResult({
      text: bank.byQuestionId[options.questionId],
      source: AI_PROVIDER.MOCK,
      meta: { questionId: options.questionId, matched: "questionId" },
    });
  }

  // 2) Free-text -> first keyword group that matches.
  const hit = bank.keywords?.find((group) =>
    group.match.some((kw) => q.includes(kw))
  );
  if (hit) {
    return makeResult({
      text: hit.answer,
      source: AI_PROVIDER.MOCK,
      meta: { matched: "keyword" },
    });
  }

  // 3) Nothing matched -> safe default that steers the user.
  return makeResult({
    text: bank.default,
    source: AI_PROVIDER.MOCK,
    meta: { matched: "default" },
  });
};

/* ------------------------------------------------------------------ GROQ ---- */
/**
 * Real strategy against Groq's OpenAI-compatible endpoint. The fixed system
 * prompt plus the customer context (as JSON) is what enforces "answer ONLY
 * from supplied data / never invent numbers".
 */
const askGroq = async (question, context) => {
  const messages = [
    { role: "system", content: AI_SYSTEM_PROMPT },
    {
      role: "system",
      content:
        "CUSTOMER DATA (authoritative — answer only from this JSON):\n" +
        JSON.stringify(context),
    },
    { role: "user", content: question },
  ];

  const response = await fetch(`${AI_CONFIG.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AI_CONFIG.apiKey}`,
    },
    body: JSON.stringify({
      model: AI_CONFIG.model,
      temperature: AI_CONFIG.temperature,
      max_tokens: AI_CONFIG.maxTokens,
      messages,
    }),
  });

  if (!response.ok) {
    throw new Error(`AI provider error: ${response.status}`);
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content || "";

  return makeResult({
    text,
    source: AI_PROVIDER.GROQ,
    meta: { model: AI_CONFIG.model },
  });
};

/* ------------------------------------------------------------- PUBLIC API --- */
/**
 * Ask the assistant a question, grounded in the supplied customer context.
 *
 * @param {string} question               The user's question (free text or chip).
 * @param {object} context                 Customer data from savingsRepository.getAiContext().
 * @param {object} [options]
 * @param {string} [options.questionId]    Suggested-question id, enables canned mock answers.
 * @returns {Promise<{text:string, source:string, meta:object, timestamp:string}>}
 */
export const askAI = async (question, context = {}, options = {}) => {
  const mode = getAiProviderMode();
  try {
    if (mode === AI_PROVIDER.GROQ) {
      return await askGroq(question, context);
    }
    return await askMock(question, context, options);
  } catch (error) {
    // Never surface raw errors/internals to the user (system-prompt rule).
    console.error("[aiService] askAI failed:", error);
    return makeResult({
      text: AI_WIDGET_COPY.errorFallback,
      source: "error",
      meta: { error: true },
    });
  }
};

const aiService = { askAI };

export default aiService;
