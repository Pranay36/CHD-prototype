/**
 * useSavingsAssistant.js
 * ---------------------------------------------------------------------------
 * All business logic for the AI Savings Assistant lives here, keeping the
 * widget component purely presentational.
 *
 * Responsibilities:
 *  - load the grounding context (savings data) via the repository,
 *  - maintain the chat transcript,
 *  - send questions through aiService and append answers.
 *
 * The component consumes only the returned state + handlers, so nothing in the
 * UI depends on where data comes from or which AI provider is active.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import savingsRepository from "../repository/savingsRepository";
import aiService from "../services/aiService";
import { AI_WIDGET_COPY, SUGGESTED_QUESTIONS } from "../utils/aiConstants";

let messageSeq = 0;
const nextId = () => `msg-${++messageSeq}`;

const buildMessage = (role, text, extra = {}) => ({
  id: nextId(),
  role, // "assistant" | "user"
  text,
  ...extra,
});

/**
 * Session-scoped chat history. Persisted to sessionStorage so the transcript
 * survives closing/reopening the sheet and page reloads within the same
 * browser-tab session, then clears when the session ends. sessionStorage
 * access is guarded so SSR / privacy-mode / quota failures degrade gracefully
 * to an in-memory-only transcript.
 */
const HISTORY_KEY = "chd-ai-chat-history";

const loadHistory = () => {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length ? parsed : null;
  } catch {
    return null;
  }
};

const saveHistory = (messages) => {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(messages));
  } catch {
    /* private mode / quota exceeded — keep transcript in memory only */
  }
};

/** Seed the initial transcript from the session, or a fresh greeting. */
const initialMessages = () => {
  const saved = loadHistory();
  if (!saved) return [buildMessage("assistant", AI_WIDGET_COPY.greeting)];
  // Continue the id sequence past the highest restored id so new messages
  // never collide with restored ones (which would break React keys).
  const maxSeq = saved.reduce((max, m) => {
    const n = parseInt(String(m.id).replace("msg-", ""), 10);
    return Number.isFinite(n) ? Math.max(max, n) : max;
  }, 0);
  if (maxSeq > messageSeq) messageSeq = maxSeq;
  return saved;
};

/**
 * @param {string} [accountId] Account to ground answers in. Defaults to primary.
 * @param {object} [extraContext] Additional grounding data merged into the
 *   repository context before it's sent to the AI (e.g. UI-only data the
 *   repository doesn't know about, like the home screen's milestones/offers).
 * @param {object} [initialQuestion] A question to auto-ask once, when the chat
 *   is opened from a home-screen entry point. Shape: `{ token, text, id }`.
 *   The `token` must be unique per open so the same prompt can re-fire; the
 *   send happens after grounding context has loaded.
 */
const useSavingsAssistant = (accountId, extraContext, initialQuestion) => {
  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  // Persist the transcript for the rest of the browser-tab session.
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Load grounding data once (or when the selected account changes).
  useEffect(() => {
    let active = true;
    setLoadingContext(true);
    savingsRepository
      .getAiContext(accountId)
      .then((ctx) => active && setContext(ctx))
      .catch((err) => console.error("[useSavingsAssistant] context load", err))
      .finally(() => active && setLoadingContext(false));
    return () => {
      active = false;
    };
  }, [accountId]);

  const totalSavings = context?.totalSavings ?? null;

  /**
   * Core send. `questionId` (optional) lets suggested chips map to canned
   * mock answers; free-text sends omit it.
   */
  const send = useCallback(
    async (rawText, questionId) => {
      const text = (rawText ?? "").trim();
      if (!text || isThinking) return;

      setMessages((prev) => [...prev, buildMessage("user", text)]);
      setInput("");
      setIsThinking(true);

      const groundedContext = extraContext ? { ...context, ...extraContext } : context;
      const result = await aiService.askAI(text, groundedContext, { questionId });

      setMessages((prev) => [
        ...prev,
        buildMessage("assistant", result.text, { source: result.source }),
      ]);
      setIsThinking(false);
    },
    [context, extraContext, isThinking]
  );

  const sendCurrentInput = useCallback(() => send(input), [send, input]);

  // Auto-ask a question passed from a home-screen entry point. Fires once per
  // unique `token`, and only after the grounding context has finished loading
  // so the answer is properly grounded.
  const firedTokenRef = useRef(null);
  useEffect(() => {
    if (!initialQuestion || loadingContext) return;
    if (firedTokenRef.current === initialQuestion.token) return;
    firedTokenRef.current = initialQuestion.token;
    send(initialQuestion.text, initialQuestion.id);
  }, [initialQuestion, loadingContext, send]);

  const askSuggested = useCallback(
    (question) => send(question.text, question.id),
    [send]
  );

  // Start a fresh session transcript (clears persisted history).
  const clearHistory = useCallback(() => {
    firedTokenRef.current = null;
    setInput("");
    setMessages([buildMessage("assistant", AI_WIDGET_COPY.greeting)]);
  }, []);

  const suggestedQuestions = useMemo(() => SUGGESTED_QUESTIONS, []);

  return {
    // state
    messages,
    input,
    isThinking,
    loadingContext,
    totalSavings,
    suggestedQuestions,
    // handlers
    setInput,
    send,
    sendCurrentInput,
    askSuggested,
    clearHistory,
  };
};

export default useSavingsAssistant;
