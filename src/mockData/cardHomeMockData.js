/**
 * cardHomeMockData.js
 * ---------------------------------------------------------------------------
 * Mock data for the CHD "Discover your Credit Card" home-screen chrome:
 * customer greeting, lifetime earnings, and the per-card tabs/milestones/
 * offers shown around the AI Savings Assistant widget.
 *
 * This is demo-only decorative data — unlike src/mockData/mockData.js (which
 * backs the swappable AI feature via savingsRepository), this file is
 * imported directly by the chrome components with no repository seam, since
 * there's no live-API replacement planned for this cosmetic UI.
 *
 * `accountId` on each entry matches an entry in mockData.js's `accounts`
 * array, so switching card tabs also changes which account the AI Savings
 * Assistant grounds its answers in.
 */

export const CUSTOMER = {
  firstName: "Himanshu",
  name: "Himanshu Rajput",
};

export const LIFETIME_EARNINGS = 15700;

export const CARD_PROGRAMS = [
  {
    id: "zenith",
    accountId: "ACC-ZENITH-001",
    name: "Zenith Plus",
    status: "ACTIVE",
    earnings: 8750,
    milestones: [
      {
        icon: "wallet",
        bg: "bg-blue",
        title: "Get 10% Cashback",
        sub: "Spend ₹80,000 more",
        progress: 0.34,
        tag: { type: "expiry", text: "EXPIRES TODAY" },
      },
      {
        icon: "reward",
        bg: "bg-pink",
        title: "Earn 1000 Reward Points",
        sub: "Complete 3 transactions",
        progress: 0.62,
        tag: { type: "time", text: "25 DAYS LEFT" },
      },
    ],
    offers: [
      {
        brand: "MakeMyTrip",
        initials: "MMT",
        color: "#e0322f",
        desc: "Upto 50% off on flights, hotels and holiday bookings.",
        valid: "30th April",
      },
      {
        brand: "Nykaa",
        initials: "N",
        color: "#e5399a",
        desc: "Flat 70% discount on purchases on modern and ethnic jewellery",
        valid: "30th April",
      },
    ],
  },
  {
    id: "altura",
    accountId: "ACC-ALTURA-002",
    name: "Altura Plus",
    status: "ACTIVE",
    earnings: 5200,
    milestones: [
      {
        icon: "wallet",
        bg: "bg-blue",
        title: "Dining Bonanza",
        sub: "Spend ₹5,000 on dining",
        progress: 0.8,
        tag: { type: "time", text: "10 DAYS LEFT" },
      },
    ],
    offers: [
      {
        brand: "MakeMyTrip",
        initials: "MMT",
        color: "#e0322f",
        desc: "Upto 50% off on flights, hotels and holiday bookings.",
        valid: "30th April",
      },
      {
        brand: "Nykaa",
        initials: "N",
        color: "#e5399a",
        desc: "Flat 70% discount on purchases on modern and ethnic jewellery",
        valid: "30th April",
      },
    ],
  },
  {
    id: "vetta",
    accountId: "ACC-VETTA-003",
    name: "Vetta",
    status: "BLOCKED",
    earnings: 8750,
    deactivatedOn: "23 Feb 2024",
    milestones: [],
    offers: [],
  },
];
