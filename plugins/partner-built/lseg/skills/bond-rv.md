# Skill: bond-rv (LSEG)
**Command:** `/bond-rv`

## Purpose
Analyze bond relative value versus benchmark curves using LSEG / Refinitiv data.

## Steps
1. Pull bond terms from LSEG: coupon, maturity, rating, issue size, currency.
2. Fetch current benchmark curve (Treasury, Gilt, Bund, Swap) from LSEG.
3. Calculate Z-spread, OAS, G-spread, I-spread.
4. Compare to peer bonds in same rating bucket and sector.
5. Assess richness/cheapness vs. peers and historical average.
6. Produce RV analysis table and recommendation summary.

## Output Format
- Bond fact sheet
- Spread decomposition table
- Peer RV matrix (Z-spread, OAS ranked vs. peers)
- Historical spread chart (narrative description)

## Data Source
LSEG Workspace / Refinitiv Eikon

## Disclaimer
For informational purposes only. Not investment advice.
