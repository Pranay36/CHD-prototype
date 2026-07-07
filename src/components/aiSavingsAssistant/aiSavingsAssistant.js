import React, { useEffect, useRef } from "react";
import "./styles.css";
import useSavingsAssistant from "../../customHooks/useSavingsAssistant";
import { AI_WIDGET_COPY } from "../../utils/aiConstants";
import { formatRewardValue } from "../../utils/functions";

/**
 * AI Savings Assistant widget.
 *
 * Purely presentational — all data loading, chat state and AI calls are owned
 * by the useSavingsAssistant hook. Drop it anywhere (e.g. the home page):
 *
 *   <AiSavingsAssistant accountId={selectedAccountId} />
 *
 * @param {string} [props.accountId] Account to ground answers in.
 * @param {object} [props.extraContext] Extra grounding data merged into the
 *   repository context (e.g. host-page-only data the repository can't see).
 */
const RobotIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="8" width="16" height="11" rx="3" fill="#6D3078" />
    <circle cx="9" cy="13" r="1.6" fill="#fff" />
    <circle cx="15" cy="13" r="1.6" fill="#fff" />
    <path d="M9.5 16.2h5" stroke="#fff" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M12 4v3" stroke="#6D3078" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="3.2" r="1.4" fill="#6D3078" />
    <path d="M4 12H2.5M20 12h1.5" stroke="#6D3078" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 12l16-8-6 16-3-6-7-2z"
      fill="#fff"
      stroke="#fff"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

/** Render multi-line assistant text (mock answers use \n bullet lists). */
const MessageText = ({ text }) => (
  <>
    {text.split("\n").map((line, i) => (
      <span key={i} className="ai-msg-line">
        {line}
      </span>
    ))}
  </>
);

const AiSavingsAssistant = ({ accountId, extraContext }) => {
  const {
    messages,
    input,
    isThinking,
    loadingContext,
    totalSavings,
    suggestedQuestions,
    setInput,
    sendCurrentInput,
    askSuggested,
  } = useSavingsAssistant(accountId, extraContext);

  const scrollRef = useRef(null);

  // Keep the transcript pinned to the latest message.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isThinking]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendCurrentInput();
    }
  };

  const canSend = input.trim().length > 0 && !isThinking;

  return (
    <div className="ai-assistant">
      {/* Header */}
      <div className="ai-header">
        <div className="ai-icon-circle">
          <RobotIcon />
        </div>
        <div className="ai-title">{AI_WIDGET_COPY.title}</div>
        <span className="ai-badge">AI</span>
      </div>

      {/* Total savings hero */}
      <div className="ai-savings-block">
        <div className="ai-savings-label">{AI_WIDGET_COPY.totalSavingsLabel}</div>
        {loadingContext ? (
          <div className="ai-savings-amount ai-shimmer">&nbsp;</div>
        ) : (
          <div className="ai-savings-amount">
            {formatRewardValue(totalSavings?.amount ?? 0)}
          </div>
        )}
      </div>

      {/* Chat transcript */}
      <div className="ai-chat" ref={scrollRef}>
        {messages.map((m) => (
          <div
            key={m.id}
            className={`ai-msg ai-msg-${m.role}`}
          >
            <MessageText text={m.text} />
          </div>
        ))}
        {isThinking && (
          <div className="ai-msg ai-msg-assistant ai-typing">
            <span className="ai-dot" />
            <span className="ai-dot" />
            <span className="ai-dot" />
          </div>
        )}
      </div>

      {/* Suggested questions */}
      <div className="ai-suggest-label">{AI_WIDGET_COPY.askLabel}</div>
      <div className="ai-suggestions">
        {suggestedQuestions.map((q) => (
          <button
            key={q.id}
            type="button"
            className="ai-chip"
            disabled={isThinking}
            onClick={() => askSuggested(q)}
          >
            {q.text}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="ai-input-row">
        <input
          className="ai-input"
          type="text"
          value={input}
          placeholder={AI_WIDGET_COPY.inputPlaceholder}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={AI_WIDGET_COPY.inputPlaceholder}
        />
        <button
          type="button"
          className="ai-send-btn"
          disabled={!canSend}
          onClick={sendCurrentInput}
          aria-label={AI_WIDGET_COPY.sendLabel}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default AiSavingsAssistant;
