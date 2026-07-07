import { LockIcon } from "./icons";

const CardTabs = ({ cards, selectedCardId, onSelect }) => (
  <div className="card-tabs">
    {cards.map((card) => (
      <button
        key={card.id}
        type="button"
        className={`card-tab${card.id === selectedCardId ? " active" : ""}`}
        onClick={() => onSelect(card.id)}
      >
        <span>{card.name}</span>
        {card.status === "BLOCKED" && <LockIcon />}
      </button>
    ))}
  </div>
);

export default CardTabs;
