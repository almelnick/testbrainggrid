# Skill: tax-loss-harvesting
**Command:** `/tlh`

## Purpose
Identify tax-loss harvesting (TLH) opportunities in a client's taxable portfolio.

## Steps
1. Scan taxable account holdings for positions with unrealized losses.
2. Calculate loss amount and holding period (short-term vs. long-term).
3. Identify suitable replacement securities (similar exposure, avoids wash-sale rule).
4. Estimate tax savings at client's marginal rate (federal + state).
5. Flag positions where harvesting would trigger wash-sale violations.
6. Rank opportunities by net tax benefit after transaction costs.

## Output Format
- TLH opportunity table: security, cost basis, current value, unrealized loss, holding period, tax savings estimate
- Replacement security suggestions for each harvested position
- Estimated total tax benefit
- Wash-sale risk flags

## Disclaimer
For informational purposes only. Not tax advice. Consult a qualified tax advisor before executing.
