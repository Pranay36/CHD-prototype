import { useRef, useState } from "react";
import ChdHeader from "./components/chdHome/ChdHeader";
import LifetimeEarningsCard from "./components/chdHome/LifetimeEarningsCard";
import CardTabs from "./components/chdHome/CardTabs";
import EarningsCard from "./components/chdHome/EarningsCard";
import MilestonesSection from "./components/chdHome/MilestonesSection";
import OffersSection from "./components/chdHome/OffersSection";
import AiFab from "./components/chdHome/AiFab";
import AiTeaserCard from "./components/chdHome/AiTeaserCard";
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
  const [pendingQuestion, setPendingQuestion] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const toastTimeoutRef = useRef(null);
  const questionSeqRef = useRef(0);
  const selectedCard = CARD_PROGRAMS.find((c) => c.id === selectedCardId);

  const showToast = (message) => {
    setToastMessage(message);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => setToastMessage(null), 2000);
  };

  // Open the assistant, optionally auto-asking a question. `payload` may be a
  // raw string (free text typed on the home card), a suggested-question object
  // (a tapped chip), or nothing (just open). A fresh `token` each time lets the
  // same prompt re-fire on a later open.
  const openChat = (payload) => {
    if (payload) {
      const q = typeof payload === "string" ? { text: payload } : payload;
      setPendingQuestion({
        token: ++questionSeqRef.current,
        text: q.text,
        id: q.id,
      });
    } else {
      setPendingQuestion(null);
    }
    setIsChatOpen(true);
  };

  return (
    <div className="phone">
      <div className="phone-scroll">
        <ChdHeader />
        <LifetimeEarningsCard
          customerName={CUSTOMER.name}
          lifetimeEarnings={LIFETIME_EARNINGS}
        />
        <AiTeaserCard totalSavings={LIFETIME_EARNINGS} onOpen={openChat} />
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
      <AiFab onClick={() => openChat()} />
      <AiChatSheet isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <AiSavingsAssistant
          accountId={selectedCard.accountId}
          extraContext={{
            lifetimeEarnings: LIFETIME_EARNINGS,
            cardPrograms: CARD_PROGRAMS,
          }}
          initialQuestion={pendingQuestion}
        />
      </AiChatSheet>
    </div>
  );
};

export default App;
