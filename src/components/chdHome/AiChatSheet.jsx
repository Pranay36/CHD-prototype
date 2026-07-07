import { CloseIcon } from "./icons";

const AiChatSheet = ({ isOpen, onClose, children }) => (
  <>
    <div
      className={`ai-sheet-backdrop${isOpen ? " open" : ""}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <div
      className={`ai-sheet${isOpen ? " open" : ""}`}
      role="dialog"
      aria-label="AI Assistant"
      aria-hidden={!isOpen}
    >
      <div className="ai-sheet-grabber" />
      <button
        type="button"
        className="ai-sheet-close"
        onClick={onClose}
        aria-label="Close AI Assistant"
      >
        <CloseIcon />
      </button>
      <div className="ai-sheet-body">{children}</div>
    </div>
  </>
);

export default AiChatSheet;
