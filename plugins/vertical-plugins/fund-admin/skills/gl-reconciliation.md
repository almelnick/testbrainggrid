# Skill: gl-reconciliation
**Command:** `/gl-recon`

## Purpose
Trace general ledger breaks and identify root cause for fund accounting reconciliation.

## Steps
1. Ingest trial balance and sub-ledger data for the reconciliation period.
2. Identify accounts with unexplained variances (actual vs. expected).
3. Trace breaks to source: timing differences, missing entries, classification errors, FX translation issues.
4. Flag items requiring journal entry vs. items pending counterparty confirmation.
5. Draft explanatory commentary for each break by account.
6. Produce a break summary for controller/CFO review.

## Output Format
- Break log: account, amount, aging, root cause, status, responsible party
- Summary dashboard: total breaks by type and materiality
- Draft journal entries for correctable items

## Disclaimer
Draft only. All journal entries require controller approval. Does not post to ledger.
