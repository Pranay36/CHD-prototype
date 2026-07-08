import { useState } from "react";
import { RobotIcon, SparkleIcon } from "./icons";
import { formatRewardValue } from "../../utils/functions";
import { SUGGESTED_QUESTIONS, AI_WIDGET_COPY } from "../../utils/aiConstants";

/**
 * AiTeaserCard
 * ---------------------------------------------------------------------------
 * Inline home-screen entry point for the AI Savings Assistant. Gives the
 * feature visible "real estate" on the home feed and lets the customer start
 * the conversation right here — by typing a question or tapping a suggested
 * prompt. Either action opens the full chat sheet and auto-asks, so the
 * assistant answers immediately and the session continues in the sheet.
 *
 * The card is a launcher only: it holds no chat state itself. The typed/tapped
 * question is handed to `onOpen`, and the persistent transcript lives in the
 * assistant (session-scoped), so history carries over every time it reopens.
 *
 * @param {number} [props.totalSavings] Amount shown as the savings hook.
 * @param {(payload?: string|object) => void} props.onOpen Opens the chat.
 *   Pass a raw string for free text, a suggested-question object for a chip,
 *   or nothing to just open the assistant.
 */
const TEASER_PROMPTS = SUGGESTED_QUESTIONS.slice(0, 3);

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

const AiTeaserCard = ({ totalSavings, onOpen }) => {
  const [draft, setDraft] = useState("");

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    onOpen(text);
    setDraft("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitDraft();
    }
  };

  return (
    <div className="ai-teaser">
      <div className="ai-teaser-head">
        <div className="ai-teaser-icon">
          <RobotIcon />
        </div>
        <div className="ai-teaser-copy">
          <div className="ai-teaser-title">
            AI Savings Assistant
            <span className="ai-teaser-badge">AI</span>
          </div>
          <div className="ai-teaser-sub">
            {typeof totalSavings === "number" ? (
              <>
                You've saved{" "}
                <strong>{formatRewardValue(totalSavings)}</strong> so far — ask
                me how to save more.
              </>
            ) : (
              "Ask about your savings, rewards and cashback."
            )}
          </div>
        </div>
      </div>

      {/* Ask box — typing here launches the chat with the question */}
      <div className="ai-teaser-input-row">
        <input
          className="ai-teaser-input"
          type="text"
          value={draft}
          placeholder={AI_WIDGET_COPY.inputPlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label={AI_WIDGET_COPY.inputPlaceholder}
        />
        <button
          type="button"
          className="ai-teaser-send"
          onClick={submitDraft}
          disabled={draft.trim().length === 0}
          aria-label={AI_WIDGET_COPY.sendLabel}
        >
          <SendIcon />
        </button>
      </div>

      {/* Suggested prompts — tapping launches the chat with that question */}
      <div className="ai-teaser-prompts">
        {TEASER_PROMPTS.map((q) => (
          <button
            key={q.id}
            type="button"
            className="ai-teaser-chip"
            onClick={() => onOpen(q)}
          >
            <SparkleIcon />
            <span>{q.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AiTeaserCard;
