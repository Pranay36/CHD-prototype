import { WalletOutlineIcon, RewardOutlineIcon, ChevronIcon, ClockIcon } from "./icons";

const MILESTONE_ICONS = {
  wallet: WalletOutlineIcon,
  reward: RewardOutlineIcon,
};

const MilestoneRow = ({ milestone }) => {
  const Icon = MILESTONE_ICONS[milestone.icon];
  return (
    <div className="milestone">
      <div className={`icon-circle ${milestone.bg}`}>
        <Icon />
      </div>
      <div className="txt">
        <div className="m-title">
          <span>{milestone.title}</span>
          <ChevronIcon />
        </div>
        <div className="m-sub">{milestone.sub}</div>
        <div className="m-track">
          <div
            className="m-fill"
            style={{ width: `${Math.round(milestone.progress * 100)}%` }}
          />
        </div>
        <div className={`m-tag ${milestone.tag.type}`}>
          {milestone.tag.type === "expiry" ? (
            <span className="m-dot" />
          ) : (
            <ClockIcon />
          )}
          <span>{milestone.tag.text}</span>
        </div>
      </div>
    </div>
  );
};

const MilestonesSection = ({ milestones, onViewAll }) => (
  <div className="section">
    <div className="section-head">
      <div className="section-title">Milestones &amp; Exclusive Offers</div>
      {milestones.length > 0 && (
        <button type="button" className="view-all" onClick={onViewAll}>
          View All
        </button>
      )}
    </div>
    {milestones.length > 0 ? (
      milestones.map((m) => <MilestoneRow key={m.title} milestone={m} />)
    ) : (
      <div className="empty">
        <div className="bubble">🤔</div>
        <div className="msg">No active milestones for you</div>
      </div>
    )}
  </div>
);

export default MilestonesSection;
