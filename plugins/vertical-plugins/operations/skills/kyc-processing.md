# Skill: kyc-processing
**Command:** `/kyc`

## Purpose
Parse KYC onboarding documents and evaluate them against compliance rules engine.

## Steps
1. Ingest onboarding documents: government ID, proof of address, entity docs, beneficial ownership.
2. Extract key data fields: name, DOB, address, entity type, ownership structure.
3. Run automated checks:
   - Identity verification (document authenticity signals)
   - Sanctions screening (OFAC, EU, UN lists)
   - PEP screening (Politically Exposed Persons)
   - Adverse media search
   - Beneficial ownership thresholds (25% rule)
4. Score overall risk: Low / Medium / High.
5. Flag items requiring enhanced due diligence (EDD).
6. Draft onboarding decision memo for compliance officer review.

## Output Format
- Extracted data summary
- Screening results by check type
- Risk score and rationale
- EDD flag list
- Compliance officer decision memo (draft)

## Disclaimer
Draft only. Does not approve onboarding. All decisions require qualified compliance officer review.
