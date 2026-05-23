#!/usr/bin/env bash
# Deploy or update a Claude Managed Agent from a cookbook definition.
# Usage: ./deploy-managed-agent.sh <agent-name>
# Example: ./deploy-managed-agent.sh gl-reconciler

set -euo pipefail

AGENT_NAME="${1:-}"
COOKBOOK_DIR="$(dirname "$0")/../managed-agent-cookbooks"
COOKBOOK_FILE="${COOKBOOK_DIR}/${AGENT_NAME}.yaml"

if [[ -z "$AGENT_NAME" ]]; then
  echo "Usage: $0 <agent-name>"
  echo "Available agents:"
  ls "$COOKBOOK_DIR"/*.yaml | xargs -n1 basename | sed 's/\.yaml$//'
  exit 1
fi

if [[ ! -f "$COOKBOOK_FILE" ]]; then
  echo "Error: No cookbook found for agent '${AGENT_NAME}'"
  echo "Expected: ${COOKBOOK_FILE}"
  exit 1
fi

if [[ -z "${ANTHROPIC_API_KEY:-}" ]]; then
  echo "Error: ANTHROPIC_API_KEY environment variable not set"
  exit 1
fi

echo "Deploying managed agent: ${AGENT_NAME}"
echo "Cookbook: ${COOKBOOK_FILE}"

# Parse cookbook fields
MODEL=$(grep '^model:' "$COOKBOOK_FILE" | awk '{print $2}')
MAX_TOKENS=$(grep '^max_tokens:' "$COOKBOOK_FILE" | awk '{print $2}')
SYSTEM_PROMPT_FILE=$(grep '^system_prompt_file:' "$COOKBOOK_FILE" | awk '{print $2}')
SYSTEM_PROMPT_PATH="$(dirname "$COOKBOOK_FILE")/${SYSTEM_PROMPT_FILE}"
SYSTEM_PROMPT=$(cat "$SYSTEM_PROMPT_PATH")

MANAGED_AGENT_ID=$(grep '^managed_agent_id:' "$COOKBOOK_FILE" | awk '{print $2}' | tr -d '"')

if [[ -z "$MANAGED_AGENT_ID" ]]; then
  echo "Creating new managed agent..."
  RESPONSE=$(curl -s -X POST "https://api.anthropic.com/v1/agents" \
    -H "x-api-key: ${ANTHROPIC_API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2025-04-01" \
    -H "content-type: application/json" \
    -d "{
      \"name\": \"${AGENT_NAME}\",
      \"model\": \"${MODEL}\",
      \"max_tokens\": ${MAX_TOKENS},
      \"system\": $(echo "$SYSTEM_PROMPT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
    }")
  NEW_ID=$(echo "$RESPONSE" | python3 -c 'import json,sys; print(json.loads(sys.stdin.read())["id"])')
  echo "Created agent with ID: ${NEW_ID}"
  # Update cookbook with the new ID
  sed -i "s/^managed_agent_id: \"\"$/managed_agent_id: \"${NEW_ID}\"/" "$COOKBOOK_FILE"
  echo "Updated cookbook with agent ID."
else
  echo "Updating existing managed agent: ${MANAGED_AGENT_ID}"
  curl -s -X PUT "https://api.anthropic.com/v1/agents/${MANAGED_AGENT_ID}" \
    -H "x-api-key: ${ANTHROPIC_API_KEY}" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2025-04-01" \
    -H "content-type: application/json" \
    -d "{
      \"model\": \"${MODEL}\",
      \"max_tokens\": ${MAX_TOKENS},
      \"system\": $(echo "$SYSTEM_PROMPT" | python3 -c 'import json,sys; print(json.dumps(sys.stdin.read()))')
    }" > /dev/null
  echo "Agent updated successfully."
fi

echo "Done: ${AGENT_NAME} deployed."
