import { useRef, useState } from "react";
import ChdHeader from "./components/chdHome/ChdHeader";
import LifetimeEarningsCard from "./components/chdHome/LifetimeEarningsCard";
import CardTabs from "./components/chdHome/CardTabs";
import EarningsCard from "./components/chdHome/EarningsCard";
import MilestonesSection from "./components/chdHome/MilestonesSection";
import OffersSection from "./components/chdHome/OffersSection";
import AiFab from "./components/chdHome/AiFab";
import AiChatSheet from "./components/chdHome/AiChatSheet";
import Toast from "./components/chdHome/Toast";
import AiSavingsAssistant from "./components/aiSavingsAssistant/aiSavingsAssistant";
import {
  CUSTOMER,
  LIFETIME_EARNINGS,
  CARD_PROGRAMS,
} from "./mockData/cardHomeMockData";

const App = () => {
  const [selectedCardId, setSelectedCardId] = useState(CARD_PROGRAMS[0].id);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);
  const selectedCard = CARD_PROGRAMS.find((c) => c.id === selectedCardId);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="phone">
      <div className="phone-scroll">
        <ChdHeader />
        <LifetimeEarningsCard
          customerName={CUSTOMER.name}
          lifetimeEarnings={LIFETIME_EARNINGS}
        />
        <CardTabs
          cards={CARD_PROGRAMS}
          selectedCardId={selectedCardId}
          onSelect={setSelectedCardId}
        />
        <EarningsCard card={selectedCard} />
        <MilestonesSection
          milestones={selectedCard.milestones}
          onViewAll={() => showToast("Coming soon")}
        />
        <OffersSection
          offers={selectedCard.offers}
          onViewAll={() => showToast("Coming soon")}
        />
      </div>

      <Toast message={toastMessage} />
      <AiFab onClick={() => setIsChatOpen(true)} />
      <AiChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <AiSavingsAssistant
          accountId={selectedCard.accountId}
          extraContext={{
            lifetimeEarnings: LIFETIME_EARNINGS,
            cardPrograms: CARD_PROGRAMS,
          }}
        />
      </AiChatSheet>
    </div>
  );
};

export default App;
