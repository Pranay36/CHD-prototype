import { SparkleIcon, StarBurstIcon } from "./icons";
import { formatRewardValue } from "../../utils/functions";

const LifetimeEarningsCard = ({ customerName, lifetimeEarnings }) => (
  <div className="lifetime-card">
    <div>
      <div className="hey">Hey, {customerName}!</div>
      <div className="lbl">
        Your lifetime earnings
        <span className="lbl-badge">
          <SparkleIcon />
        </span>
      </div>
      <div className="amt">{formatRewardValue(lifetimeEarnings)}</div>
    </div>
    <StarBurstIcon />
  </div>
);

export default LifetimeEarningsCard;
