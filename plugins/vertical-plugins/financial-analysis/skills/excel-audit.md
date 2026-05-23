# Skill: excel-audit
**Command:** `/audit-excel`

## Purpose
Audit an Excel financial model for errors, inconsistencies, and best-practice violations.

## Checks Performed
- **Hardcodes in formulas:** flag cells with mixed hard-coded values and references
- **Broken links:** identify external references that resolve to #REF! or missing sources
- **Circular references:** detect and flag circular dependency chains
- **Balance sheet balance:** confirm Assets = Liabilities + Equity each period
- **Cash flow tie-out:** confirm ending cash on CF statement equals BS cash
- **Consistency:** check that same line item uses consistent formulas across columns
- **Sign conventions:** flag unusual sign conventions (positive debt, negative revenue)
- **Named ranges:** identify broken or shadowed named ranges

## Output Format
- Audit log: issue type, cell reference, description, severity (High / Medium / Low)
- Summary scorecard
- Recommended fixes

## Disclaimer
Audit output is advisory. Human review required before relying on model outputs.
