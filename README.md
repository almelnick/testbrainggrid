# Claude for Financial Services — Plugins & Agents

Reference implementation of Claude agents, skills, and data connectors for financial services workflows. Deploy as **Cowork plugins** or **Claude Managed Agents** via the `/v1/agents` API.

> ⚠️ **Disclaimer:** All outputs are drafts for human review only. Nothing here constitutes investment advice, executes transactions, posts to ledgers, approves onboarding, or constitutes legal/tax/accounting advice. All outputs require qualified professional sign-off.

---

## Quick Start

### Cowork Plugin Install
```
Settings → Plugins → Add plugin
→ https://github.com/anthropics/financial-services-plugins
```

### Claude Code CLI
```bash
claude plugin install financial-analysis@financial-services-plugins
claude plugin install pitch-agent@financial-services-plugins
```

### Managed Agents API
```bash
scripts/deploy-managed-agent.sh gl-reconciler
```

---

## Repository Structure

```
plugins/
  ├── vertical-plugins/       # Skill & command bundles by domain
  │   ├── financial-analysis/
  │   ├── investment-banking/
  │   ├── equity-research/
  │   ├── private-equity/
  │   ├── wealth-management/
  │   ├── fund-admin/
  │   └── operations/
  ├── agent-plugins/          # Self-contained named agents
  │   ├── pitch-agent/
  │   ├── meeting-prep/
  │   ├── market-researcher/
  │   ├── earnings-reviewer/
  │   ├── model-builder/
  │   ├── valuation-reviewer/
  │   ├── gl-reconciler/
  │   ├── month-end-closer/
  │   ├── statement-auditor/
  │   └── kyc-screener/
  └── partner-built/
      ├── lseg/
      └── sp-global/
managed-agent-cookbooks/      # Per-agent Managed Agent deployment configs
claude-for-msft-365-install/  # Microsoft 365 add-in provisioning
scripts/
  ├── deploy-managed-agent.sh
  ├── sync-agent-skills.py
  ├── orchestrate.py
  └── check.py
.mcp.json                     # MCP data connector configuration
```

---

## Vertical Plugins

| Plugin | Key Skills | Commands |
|--------|-----------|----------|
| `financial-analysis` | comps, DCF, LBO, 3-statement, Excel audit | `/comps` `/dcf` `/lbo` |
| `investment-banking` | CIMs, teasers, merger models, deal tracking | `/merger-model` `/cim` |
| `equity-research` | earnings notes, initiations, thesis tracking | `/earnings` `/initiation` |
| `private-equity` | sourcing, screening, IC memos, portfolio monitoring | `/ic-memo` `/screen` |
| `wealth-management` | client reviews, financial plans, rebalancing, TLH | `/client-review` `/plan` |
| `fund-admin` | GL reconciliation, NAV tie-out | `/gl-recon` `/nav` |
| `operations` | KYC processing | `/kyc` |

### Partner Plugins
| Plugin | Provider | Key Features |
|--------|----------|-------------|
| `lseg` | LSEG / Refinitiv | Bond RV, swap curves, FX data |
| `sp-global` | S&P Global | Tear sheets, earnings previews |

---

## Named Agents

### Coverage & Advisory
| Agent | Description |
|-------|-------------|
| `pitch-agent` | Comps → precedents → LBO → branded pitch deck |
| `meeting-prep` | Client meeting briefing packs |

### Research & Modeling
| Agent | Description |
|-------|-------------|
| `market-researcher` | Industry overview, competitive landscape, peer comps |
| `earnings-reviewer` | Earnings call analysis → model update → note draft |
| `model-builder` | DCF, LBO, 3-statement, comps in Excel |

### Fund Admin & Finance Ops
| Agent | Description |
|-------|-------------|
| `valuation-reviewer` | GP package ingestion, valuation template, LP reporting |
| `gl-reconciler` | Break tracing, root cause analysis |
| `month-end-closer` | Accruals, roll-forwards, variance commentary |
| `statement-auditor` | LP statement audits |

### Operations & Onboarding
| Agent | Description |
|-------|-------------|
| `kyc-screener` | Document parsing, rules engine evaluation |

---

## MCP Data Connectors

Configured in `.mcp.json`. Swap in your own providers as needed.

| Provider | Data Types |
|----------|-----------|
| Daloopa | AI-extracted financial model data |
| Morningstar | Fund data, ratings, ESG |
| S&P Global | Company financials, credit ratings |
| FactSet | Market data, estimates, ownership |
| Moody's | Credit research, ratings |
| MT Newswires | Real-time financial news |
| Aiera | Earnings call transcripts, events |
| LSEG | FX, rates, fixed income |
| PitchBook | Private market data, VC/PE |
| Chronograph | LP portfolio analytics |
| Egnyte | Document management |

---

## Customization

- Swap MCP connectors in `.mcp.json` for your data providers
- Add firm terminology/formatting to skill files
- Bring branded PowerPoint/Excel templates
- Deploy headlessly via Managed Agents for custom orchestration

---

## License

Apache 2.0
