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

import { useCallback, useEffect, useMemo, useState } from "react";
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
 * @param {string} [accountId] Account to ground answers in. Defaults to primary.
 * @param {object} [extraContext] Additional grounding data merged into the
 *   repository context before it's sent to the AI (e.g. UI-only data the
 *   repository doesn't know about, like the home screen's milestones/offers).
 */
const useSavingsAssistant = (accountId, extraContext) => {
  const [context, setContext] = useState(null);
  const [loadingContext, setLoadingContext] = useState(true);
  const [messages, setMessages] = useState([
    buildMessage("assistant", AI_WIDGET_COPY.greeting),
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

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

  const askSuggested = useCallback(
    (question) => send(question.text, question.id),
    [send]
  );

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
  };
};

export default useSavingsAssistant;
