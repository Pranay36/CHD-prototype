import { TicketIcon } from "./icons";

const OfferCard = ({ offer }) => (
  <div className="offer">
    <div className="brand">
      <div className="brand-logo" style={{ background: offer.color }}>
        {offer.initials}
      </div>
      <span>{offer.brand}</span>
    </div>
    <div className="desc">{offer.desc}</div>
    <div className="valid">
      <TicketIcon />
      <span>Valid Till {offer.valid}</span>
    </div>
  </div>
);

const OffersSection = ({ offers, onViewAll }) => {
  if (offers.length === 0) return null;
  return (
    <div className="section">
      <div className="section-head">
        <div className="section-title">Offers Curated For You</div>
        <button type="button" className="view-all" onClick={onViewAll}>
          View All
        </button>
      </div>
      <div className="offer-row">
        {offers.map((offer) => (
          <OfferCard key={offer.brand} offer={offer} />
        ))}
      </div>
      <div className="dots">
        <span className="on" />
        <span />
        <span />
        <span />
      </div>
    </div>
  );
};

export default OffersSection;
