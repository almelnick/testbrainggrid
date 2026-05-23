# Skill: rebalancing
**Command:** `/rebalance`

## Purpose
Generate portfolio rebalancing recommendations to restore alignment with the client's target asset allocation.

## Steps
1. Load current portfolio holdings and values.
2. Load client's target asset allocation (by asset class, sector, geography).
3. Calculate current vs. target weights and identify drift (flag if >5% absolute).
4. Generate trade recommendations: sell over-weight positions, buy under-weight.
5. Apply tax constraints: prioritize harvesting losses, avoid short-term gains where possible.
6. Apply transaction cost estimates.
7. Produce a rebalancing order list.

## Output Format
- Current vs. target allocation table with drift
- Trade recommendations: security, action (buy/sell), shares, estimated proceeds
- Post-rebalance projected allocation
- Estimated transaction costs and tax impact

## Disclaimer
For informational purposes only. Not investment advice. All trades require advisor approval and client consent.
