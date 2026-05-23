# Claude for Microsoft 365 — Add-in Provisioning

This directory contains provisioning scripts and configuration for deploying Claude financial services skills as Microsoft 365 add-ins (Word, Excel, Outlook, Teams).

## Prerequisites
- Microsoft 365 tenant admin access
- Azure AD application registration
- Anthropic API key

## Add-in Types

| Add-in | Host | Skills |
|--------|------|--------|
| `excel-model-builder` | Excel | DCF, LBO, 3-statement, comps |
| `word-cim-drafter` | Word | CIM, teaser, IC memo, earnings note |
| `outlook-meeting-prep` | Outlook | Meeting prep briefing pack |
| `teams-deal-tracker` | Teams | Deal status, pipeline summary |

## Deployment

```bash
# 1. Register Azure AD app
az ad app create --display-name "Claude Financial Services" \
  --sign-in-audience AzureADMyOrg

# 2. Set environment variables
export AZURE_TENANT_ID=<your-tenant-id>
export AZURE_CLIENT_ID=<your-client-id>
export ANTHROPIC_API_KEY=<your-api-key>

# 3. Deploy add-ins
./provision.sh --addin excel-model-builder
./provision.sh --addin word-cim-drafter
```

## Configuration
Edit `manifest.json` to customize:
- Allowed domains
- Skill enablement per add-in
- User group restrictions
