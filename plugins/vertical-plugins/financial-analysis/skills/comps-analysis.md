# Skill: comps-analysis
**Command:** `/comps`

## Purpose
Build a trading comparables (comps) table for a target company using public peer data.

## Steps
1. Identify the target company and relevant peer group (5–10 public comps).
2. Pull LTM and NTM financials: Revenue, EBITDA, EBIT, EPS, FCF.
3. Calculate trading multiples: EV/Revenue, EV/EBITDA, EV/EBIT, P/E, P/FCF.
4. Compute median, mean, 25th, and 75th percentiles for each multiple.
5. Apply the peer multiple range to the target's metrics to derive an implied valuation range.
6. Present in a formatted table with source footnotes.

## Output Format
- Summary table: peer name, market cap, EV, multiples
- Implied valuation range for target
- Key observations (premium/discount to peers, outlier notes)

## Data Sources
- Preferred: FactSet, S&P Global, Morningstar
- Fallback: public filings (10-K, 10-Q, press releases)

## Disclaimer
For informational purposes only. Not investment advice.
