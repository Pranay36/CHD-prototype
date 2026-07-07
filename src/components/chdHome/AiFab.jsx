import { RobotIcon } from "./icons";

const AiFab = ({ onClick }) => (
  <button
    type="button"
    className="ai-fab"
    onClick={onClick}
    aria-label="Open AI Assistant"
  >
    <RobotIcon />
  </button>
);

export default AiFab;
