/**
 * savingsRepository.js
 * ---------------------------------------------------------------------------
 * The Repository layer. It is the ONLY module that knows where savings data
 * comes from. Today it resolves from mockData.js; tomorrow each method becomes
 * a call to PublicService (CHD Nimbus -> Grimlock / Doremon) with NO change
 * required in the AI service or UI layers.
 *
 *      UI  ->  aiService  ->  savingsRepository  ->  (mockData | live APIs)
 *
 * Every accessor is async and returns a Promise, so the async contract is
 * already what the real network calls will use. Methods return deep copies so
 * callers can never mutate the shared mock dataset.
 */

import MOCK_DATASET from "../mockData/mockData";
// When going live, uncomment and route methods through the BFF instead:
// import PublicService from "../services/PublicService";

/** Simulated network latency (ms) so the prototype feels like real I/O. */
const SIMULATED_LATENCY_MS = 250;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Structured-clone with a JSON fallback so callers get isolated copies. */
const clone = (value) =>
  typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));

/** Resolve a mock slice as if it came from an API. */
const resolveMock = async (selector) => {
  await delay(SIMULATED_LATENCY_MS);
  return clone(selector(MOCK_DATASET));
};

const savingsRepository = {
  getCustomer: () => resolveMock((d) => d.customer),

  getAccounts: () => resolveMock((d) => d.accounts),

  getTotalSavings: (/* accountId */) => resolveMock((d) => d.totalSavings),

  getCategorySavings: (/* accountId */) =>
    resolveMock((d) => d.categorySavings),

  getRewardSummary: (/* accountId */) => resolveMock((d) => d.rewardSummary),

  getCashback: (/* accountId */) => resolveMock((d) => d.cashback),

  getRewardPoints: (/* accountId */) => resolveMock((d) => d.rewardPoints),

  getVouchers: (/* accountId */) => resolveMock((d) => d.vouchers),

  getMissedSavings: (/* accountId */) => resolveMock((d) => d.missedSavings),

  getSavingsProjection: (/* accountId */) =>
    resolveMock((d) => d.savingsProjection),

  /** Canned answers — only the mock provider uses these; live mode ignores them. */
  getAiResponseBank: () => resolveMock((d) => d.aiResponses),

  /**
   * Aggregate everything the assistant needs to ground its answers into a
   * single context object. This is the payload handed to aiService.askAI so
   * the model (mock or real) "answers ONLY from the supplied customer data".
   *
   * In live mode this becomes one BFF aggregate call (or a Promise.all of a
   * few Grimlock/Doremon calls) — the returned shape stays identical.
   */
  getAiContext: async (accountId) => {
    const [
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
    ] = await Promise.all([
      savingsRepository.getCustomer(),
      savingsRepository.getAccounts(),
      savingsRepository.getTotalSavings(accountId),
      savingsRepository.getCategorySavings(accountId),
      savingsRepository.getRewardSummary(accountId),
      savingsRepository.getCashback(accountId),
      savingsRepository.getRewardPoints(accountId),
      savingsRepository.getVouchers(accountId),
      savingsRepository.getMissedSavings(accountId),
      savingsRepository.getSavingsProjection(accountId),
    ]);

    const selectedAccount =
      accounts.find((a) => a.accountId === accountId) ||
      accounts.find((a) => a.isPrimary) ||
      accounts[0];

    return {
      customer,
      accounts,
      selectedAccount,
      totalSavings,
      categorySavings,
      rewardSummary,
      cashback,
      rewardPoints,
      vouchers,
      missedSavings,
      savingsProjection,
    };
  },
};

export default savingsRepository;
