import { WalletOutlineIcon, ChevronIcon } from "./icons";
import { formatRewardValue } from "../../utils/functions";

const EarningsCard = ({ card }) => (
  <div className="section earn-section">
    <div className="earn-card">
      <div className="icon-circle bg-blue">
        <WalletOutlineIcon />
      </div>
      <div className="txt">
        <div className="earn-label">Your {card.name} Card Earnings</div>
        <div className="earn-amt">{formatRewardValue(card.earnings)}</div>
        {card.status === "BLOCKED" && (
          <div className="deactivated-note">
            This Card was deactivated on {card.deactivatedOn}
          </div>
        )}
      </div>
      {card.status !== "BLOCKED" && <ChevronIcon />}
    </div>
  </div>
);

export default EarningsCard;
