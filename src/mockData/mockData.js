/**
 * mockData.js
 * ---------------------------------------------------------------------------
 * Single source of truth for the AI Savings Assistant PROTOTYPE.
 *
 * This file stands in for what will eventually be responses from:
 *   CHD Nimbus (BFF) -> Grimlock (primary APIs) / Doremon
 *
 * IMPORTANT: The shapes here intentionally resemble production contracts (see
 * schema.md). The repository layer (src/repository/savingsRepository.js) is the
 * ONLY thing that reads this file, so replacing it with live API calls requires
 * no changes in the service or UI layers.
 *
 * All amounts are in INR (minor unit NOT used here — values are whole rupees
 * for readability in a prototype). `currency` is carried on each money-bearing
 * entity so formatting stays locale-driven.
 */

const CURRENCY = "INR";

/** ---------------------------------------------------------------- Customer */
const customer = {
  customerId: "CUST10098234",
  name: "Himanshu Rajput",
  firstName: "Himanshu",
  maskedMobile: "+91 ******3210",
  email: "h****@example.com",
  segment: "PREMIUM",
  memberSince: "2020-12-01",
};

/** ---------------------------------------------------------------- Accounts */
/** Mirrors the multicarding home screen: Zenith Plus / Altura Plus / Vetta. */
const accounts = [
  {
    accountId: "ACC-ZENITH-001",
    programId: "ZENITH_PLUS",
    programName: "Zenith Plus",
    productName: "AU Zenith Plus Credit Card",
    status: "ACTIVE",
    maskedCardNumber: "**** **** **** 4821",
    isPrimary: true,
  },
  {
    accountId: "ACC-ALTURA-002",
    programId: "ALTURA_PLUS",
    programName: "Altura Plus",
    productName: "AU Altura Plus Credit Card",
    status: "ACTIVE",
    maskedCardNumber: "**** **** **** 7756",
    isPrimary: false,
  },
  {
    accountId: "ACC-VETTA-003",
    programId: "VETTA",
    programName: "Vetta",
    productName: "AU Vetta Credit Card",
    status: "BLOCKED",
    maskedCardNumber: "**** **** **** 9032",
    isPrimary: false,
    deactivatedOn: "2024-02-23",
  },
];

/**
 * ------------------------------------------------------------- Savings model
 * `totalSavings` is the hero number in the widget. `categorySavings` breaks it
 * down and MUST sum to totalSavings.amount so the assistant never contradicts
 * itself. Keep them in sync if you edit values.
 */
const totalSavings = {
  accountId: "ACC-ZENITH-001",
  currency: CURRENCY,
  amount: 58340,
  period: "LIFETIME",
  asOf: "2026-07-07",
  lifetimeEarnings: 15700, // matches the home-screen "lifetime earnings" card
};

const categorySavings = [
  {
    categoryId: "CASHBACK",
    label: "Cashback",
    currency: CURRENCY,
    amount: 18500,
    icon: "cashback",
    transactionsCount: 142,
  },
  {
    categoryId: "REWARD_POINTS",
    label: "Reward Points",
    currency: CURRENCY,
    amount: 12500,
    icon: "rewards",
    transactionsCount: 210,
  },
  {
    categoryId: "VOUCHERS",
    label: "Vouchers & Gift Cards",
    currency: CURRENCY,
    amount: 9000,
    icon: "voucher",
    transactionsCount: 12,
  },
  {
    categoryId: "LOUNGE",
    label: "Lounge Access",
    currency: CURRENCY,
    amount: 6500,
    icon: "lounge",
    transactionsCount: 8,
  },
  {
    categoryId: "DINING_DISCOUNT",
    label: "Dining & Shopping Discounts",
    currency: CURRENCY,
    amount: 4500,
    icon: "cashback",
    transactionsCount: 34,
  },
  {
    categoryId: "FUEL_SURCHARGE_WAIVER",
    label: "Fuel Surcharge Waiver",
    currency: CURRENCY,
    amount: 4200,
    icon: "fuel",
    transactionsCount: 46,
  },
  {
    categoryId: "FEE_REVERSAL",
    label: "Fee Reversal",
    currency: CURRENCY,
    amount: 3140,
    icon: "feeReversal",
    transactionsCount: 5,
  },
];

/** ----------------------------------------------------------- Reward summary */
const rewardSummary = {
  accountId: "ACC-ZENITH-001",
  currency: CURRENCY,
  totalSavings: 58340,
  cashbackEarned: 18500,
  rewardPointsValue: 12500,
  vouchersValue: 9000,
  potentialMissedSavings: 8100,
  savingsRatePct: 3.8, // savings as % of eligible spend
  ytdSpend: 1535000,
};

/** ---------------------------------------------------------------- Cashback */
const cashback = {
  accountId: "ACC-ZENITH-001",
  currency: CURRENCY,
  totalEarned: 18500,
  thisMonth: 1450,
  lastMonth: 2100,
  pending: 320,
  topCategory: "Online Shopping",
  ratePct: 5,
};

/** ------------------------------------------------------------ Reward points */
const rewardPoints = {
  accountId: "ACC-ZENITH-001",
  balance: 25000,
  currency: CURRENCY,
  valuePerPoint: 0.5,
  monetaryValue: 12500,
  expiringSoon: 3000,
  expiringOn: "2026-09-30",
  redeemedThisYear: 4000,
};

/** ---------------------------------------------------------------- Vouchers */
const vouchers = [
  {
    voucherId: "VCH-AMZN-1001",
    brand: "Amazon",
    currency: CURRENCY,
    value: 3000,
    status: "ACTIVE",
    expiryDate: "2026-12-31",
    code: "AMZ****XYZ",
  },
  {
    voucherId: "VCH-MMT-1002",
    brand: "MakeMyTrip",
    currency: CURRENCY,
    value: 4000,
    status: "ACTIVE",
    expiryDate: "2026-04-30",
    code: "MMT****ABC",
  },
  {
    voucherId: "VCH-NYK-1003",
    brand: "Nykaa",
    currency: CURRENCY,
    value: 2000,
    status: "REDEEMED",
    expiryDate: "2026-03-31",
    code: "NYK****PQR",
  },
];

/** ---------------------------------------------------------- Missed savings */
/** Actionable opportunities the assistant surfaces for "where am I missing?" */
const missedSavings = [
  {
    opportunityId: "MISS-FUEL-01",
    label: "Fuel surcharge waiver not maxed",
    currency: CURRENCY,
    potentialAmount: 1200,
    reason: "You are ₹4,000 short of this month's fuel spend threshold.",
    actionText: "Fuel up with your Zenith Plus card",
    category: "FUEL_SURCHARGE_WAIVER",
  },
  {
    opportunityId: "MISS-DINING-02",
    label: "Unused 20% dining offer",
    currency: CURRENCY,
    potentialAmount: 2000,
    reason: "A partner dining offer expires this month and is still unused.",
    actionText: "Explore dining offers",
    category: "DINING_DISCOUNT",
  },
  {
    opportunityId: "MISS-LOUNGE-03",
    label: "2 complimentary lounge visits unused",
    currency: CURRENCY,
    potentialAmount: 1800,
    reason: "You have 2 of 8 complimentary lounge visits left this quarter.",
    actionText: "View lounge benefits",
    category: "LOUNGE",
  },
  {
    opportunityId: "MISS-POINTS-04",
    label: "3,000 reward points expiring soon",
    currency: CURRENCY,
    potentialAmount: 1500,
    reason: "3,000 points expire on 30 Sep 2026 if not redeemed.",
    actionText: "Redeem points now",
    category: "REWARD_POINTS",
  },
  {
    opportunityId: "MISS-EMI-05",
    label: "Missed no-cost EMI on a large purchase",
    currency: CURRENCY,
    potentialAmount: 1600,
    reason: "A ₹40,000 purchase last month was eligible for no-cost EMI.",
    actionText: "Learn about no-cost EMI",
    category: "FEE_REVERSAL",
  },
];

/** --------------------------------------------------- Year-end projection */
const savingsProjection = {
  currency: CURRENCY,
  currentSavings: 58340,
  projectedYearEnd: 71200,
  monthsRemaining: 6,
  avgMonthlySavings: 2143,
  assumptions: "Based on your average monthly savings over the last 6 months.",
};

/**
 * ------------------------------------------------------------ AI responses
 * Canned answers used by the MOCK provider. Keyed first by suggested-question
 * id (see aiConstants.SUGGESTED_QUESTIONS), then a keyword map for free text,
 * then a default. Written in the assistant's voice (short, friendly, uses only
 * the numbers above). These are what a real LLM would generate at runtime.
 */
const aiResponses = {
  byQuestionId: {
    "where-saved":
      "You've saved ₹58,340 in total! 🎉 Here's the breakdown:\n" +
      "• Cashback: ₹18,500\n" +
      "• Reward Points: ₹12,500\n" +
      "• Vouchers & Gift Cards: ₹9,000\n" +
      "• Lounge Access: ₹6,500\n" +
      "• Dining & Shopping: ₹4,500\n" +
      "• Fuel Surcharge Waiver: ₹4,200\n" +
      "• Fee Reversal: ₹3,140\n" +
      "Cashback is your biggest win — mostly from online shopping.",
    "year-end":
      "You're on track to reach about ₹71,200 in savings by year end. " +
      "You're at ₹58,340 today and averaging ₹2,143/month, so ~₹12,860 more " +
      "over the next 6 months. Maxing your fuel and dining benefits could push " +
      "this even higher.",
    "missed-savings":
      "I spotted ₹8,100 in savings you could still unlock:\n" +
      "• ₹2,000 — an unused 20% dining offer expiring this month\n" +
      "• ₹1,800 — 2 complimentary lounge visits left this quarter\n" +
      "• ₹1,600 — a purchase that was eligible for no-cost EMI\n" +
      "• ₹1,500 — 3,000 reward points expiring on 30 Sep 2026\n" +
      "• ₹1,200 — you're ₹4,000 short of this month's fuel spend threshold\n" +
      "Want tips on any of these?",
    "maximize-rewards":
      "A few quick wins to maximize rewards:\n" +
      "• Redeem your 3,000 points before 30 Sep 2026 (worth ₹1,500).\n" +
      "• Use your Zenith Plus card for online shopping — that's your 5% cashback category.\n" +
      "• Hit the fuel spend threshold to unlock the full surcharge waiver.\n" +
      "• Use the 20% dining offer before it expires this month.\n" +
      "Together these are worth roughly ₹6,200 more.",
  },
  keywords: [
    {
      match: ["cashback", "cash back"],
      answer:
        "You've earned ₹18,500 in cashback so far — ₹1,450 this month. Your " +
        "top category is online shopping at a 5% rate. ₹320 is still pending.",
    },
    {
      match: ["point", "reward point"],
      answer:
        "You have 25,000 reward points worth about ₹12,500. Heads up: 3,000 " +
        "points (₹1,500) expire on 30 Sep 2026 — redeem them before then.",
    },
    {
      match: ["voucher", "gift card", "gift"],
      answer:
        "You're holding active vouchers worth ₹7,000: a ₹3,000 Amazon voucher " +
        "(valid till 31 Dec 2026) and a ₹4,000 MakeMyTrip voucher (valid till " +
        "30 Apr 2026). Your ₹2,000 Nykaa voucher has already been redeemed.",
    },
    {
      match: ["lounge"],
      answer:
        "Your lounge access has saved you ₹6,500. You still have 2 of 8 " +
        "complimentary visits left this quarter — worth about ₹1,800.",
    },
    {
      match: ["fuel"],
      answer:
        "Fuel surcharge waivers have saved you ₹4,200. You're ₹4,000 short of " +
        "this month's fuel spend threshold — closing that gap unlocks ₹1,200 more.",
    },
    {
      match: ["fee", "reversal"],
      answer:
        "You've saved ₹3,140 through fee reversals. Tip: a recent large purchase " +
        "was eligible for no-cost EMI — using it could have saved ₹1,600.",
    },
    {
      match: ["total", "how much saved", "overall"],
      answer:
        "Your total savings across all benefits is ₹58,340, as of 7 Jul 2026.",
    },
  ],
  default:
    "I can help with your savings, cashback, reward points, vouchers, lounge " +
    "access, and benefits you might be missing. Try asking \"Where have I " +
    "saved?\" or \"Where am I missing savings?\"",
};

/**
 * Full dataset assembled the way a BFF might return an aggregated payload.
 * The repository slices this into per-entity accessors.
 */
export const MOCK_DATASET = Object.freeze({
  customer,
  accounts,
  totalSavings,
  categorySavings,
  rewardSummary,
  cashback,
  rewardPoints,
  vouchers,
  missedSavings,
  savingsProjection,
  aiResponses,
});

export default MOCK_DATASET;
