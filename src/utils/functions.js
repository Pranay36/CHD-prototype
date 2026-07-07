/**
 * functions.js
 * ---------------------------------------------------------------------------
 * Minimal helper subset needed by the AI Savings Assistant prototype.
 *
 * NOTE: In the real CHD-PWA this helper already exists in src/utils/functions.js
 * (with many more utilities). It is duplicated here only so the prototype folder
 * is self-contained. When dropping these files into CHD-PWA, delete this file
 * and rely on the existing one — the signature matches exactly.
 */

/**
 * Format a numeric value as Indian-locale currency (or a plain number for
 * reward points). Mirrors CHD-PWA's formatRewardValue.
 *
 * @param {number} value
 * @param {"REWARDS"|undefined} type  "REWARDS" -> plain point count, else INR.
 */
export const formatRewardValue = (value, type) => {
  return type === "REWARDS"
    ? value?.toLocaleString("en-IN")
    : value?.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      });
};
