# Skill: deal-tracker
**Command:** `/deal-status`

## Purpose
Generate a deal pipeline status summary for banker team review.

## Steps
1. Ingest current deal pipeline data (deal name, stage, counterparty, expected close, fee).
2. Categorize by stage: origination, mandate, diligence, negotiation, signing, closing.
3. Flag deals at risk: stalled, past expected close date, or requiring banker action.
4. Summarize pipeline metrics: total deals, total expected fees, weighted pipeline by stage.
5. Highlight upcoming milestones for the next 30 days.

## Output Format
- Pipeline table: deal name, type, stage, counterparty, expected close, expected fee, flag
- Pipeline summary metrics
- 30-day milestone calendar
- Deals requiring immediate action (flagged items)

## Disclaimer
For internal tracking only. Expected fees are estimates and not guaranteed.
