# Test Document

> **Tip:** This is code test document

```
#!/usr/bin/env bash
# Registers the two sample MCP servers in ContextForge as team-scoped virtual
# servers: creates the Engineering/Partner teams, creates a user per identity
# (internal, partner-standard, partner-elevated), grants each the built-in
# "developer" RBAC role scoped to their team, federates both sample servers
# as gateways, and wraps their tools into per-team virtual servers.
#
# Idempotent-ish: safe to re-run against a fresh ContextForge (re-running
# against an already-registered stack will hit 409s on team/user/gateway
# creation — tear down with `docker compose down -v` in vendor/mcp-context-forge
# first if you want a clean slate).
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

VENDOR_DIR="vendor/mcp-context-forge"
GW="${CONTEXTFORGE_URL:-http://localhost:8080}"
STATE_FILE="scripts/.poc-state.env"

command -v jq >/dev/null 2>&1 || { echo "jq is required." >&2; exit 1; }

echo "==> Waiting for ContextForge to be healthy at $GW"
for i in $(seq 1 30); do
  if curl -sf "$GW/health" >/dev/null 2>&1; then break; fi
  sleep 2
  if [ "$i" -eq 30 ]; then echo "ContextForge did not become healthy in time." >&2; exit 1; fi
done

echo "==> Minting admin token"
ADMIN_TOKEN=$(cd "$VENDOR_DIR" && uv run python3 -m mcpgateway.utils.create_jwt_token \
  -u admin@example.com --admin --full-name "POC Admin" --exp 10080 2>/dev/null)

api() {
  # api METHOD PATH [JSON_BODY]
  method=$1; path=$2; body=${3:-}
  if [ -n "$body" ]; then
    curl -s -X "$method" "$GW$path" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d "$body"
  else
    curl -s -X "$method" "$GW$path" -H "Authorization: Bearer $ADMIN_TOKEN"
  fi
}

gen_password() {
  # Avoid the password strength check's "too many sequential characters"
  # rejection: mix a fixed non-sequential anchor with random alnum.
  echo "Qz7!$(LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c 20)!Mn2"
}

create_user() {
  email=$1; full_name=$2
  for _ in 1 2 3 4 5; do
    pass=$(gen_password)
    resp=$(curl -s -w '\n%{http_code}' -X POST "$GW/admin/users" \
      -H "Authorization: Bearer $ADMIN_TOKEN" \
      --data-urlencode "email=$email" \
      --data-urlencode "password=$pass" \
      --data-urlencode "full_name=$full_name")
    code=$(echo "$resp" | tail -1)
    if [ "$code" = "201" ]; then
      echo "  created $email" >&2
      return 0
    fi
    echo "  retrying $email (http $code)" >&2
  done
  echo "Failed to create user $email" >&2
  exit 1
}

echo "==> Creating teams"
ENG_TEAM=$(api POST /teams/ '{"name":"Engineering","description":"Internal engineering team","visibility":"private"}' | jq -r .id)
PARTNER_TEAM=$(api POST /teams/ '{"name":"Partner","description":"External partner team","visibility":"private"}' | jq -r .id)
echo "  engineering team: $ENG_TEAM"
echo "  partner team:     $PARTNER_TEAM"

echo "==> Looking up built-in 'developer' role"
DEV_ROLE=$(api GET /rbac/roles | jq -r '.[] | select(.name=="developer") | .id')
echo "  developer role: $DEV_ROLE"

echo "==> Creating users"
create_user "internal-user@example.com" "Internal User"
create_user "partner-standard@example.com" "Partner Standard"
create_user "partner-elevated@example.com" "Partner Elevated"

add_member_and_role() {
  email=$1; team_id=$2
  api POST "/teams/$team_id/members" "{\"email\":\"$email\",\"role\":\"member\"}" >/dev/null
  api POST "/rbac/users/$email/roles" "{\"role_id\":\"$DEV_ROLE\",\"scope\":\"team\",\"scope_id\":\"$team_id\"}" >/dev/null
  echo "  $email -> team $team_id (member + developer role)"
}

echo "==> Adding team memberships + RBAC roles"
add_member_and_role "internal-user@example.com" "$ENG_TEAM"
add_member_and_role "partner-standard@example.com" "$PARTNER_TEAM"
add_member_and_role "partner-elevated@example.com" "$PARTNER_TEAM"

echo "==> Registering sample servers as federated gateways"
GW_INTERNAL=$(api POST /gateways "{\"name\":\"internal-directory-gateway\",\"url\":\"http://internal-directory-server:3001/mcp\",\"transport\":\"STREAMABLEHTTP\",\"team_id\":\"$ENG_TEAM\",\"visibility\":\"team\",\"description\":\"Internal engineering employee directory\"}")
GW_PARTNER=$(api POST /gateways "{\"name\":\"partner-orders-gateway\",\"url\":\"http://partner-orders-server:3002/mcp\",\"transport\":\"STREAMABLEHTTP\",\"team_id\":\"$PARTNER_TEAM\",\"visibility\":\"team\",\"description\":\"Partner order status and refunds\"}")
echo "$GW_INTERNAL" | jq -e '.reachable == true' >/dev/null || { echo "internal-directory-gateway not reachable: $GW_INTERNAL" >&2; exit 1; }
echo "$GW_PARTNER" | jq -e '.reachable == true' >/dev/null || { echo "partner-orders-gateway not reachable: $GW_PARTNER" >&2; exit 1; }

echo "==> Discovering federated tools"
TOOLS=$(api GET /tools)
LOOKUP_TOOL=$(echo "$TOOLS" | jq -r '.[] | select(.name=="internal-directory-gateway-lookup-employee") | .id')
ORDER_STATUS_TOOL=$(echo "$TOOLS" | jq -r '.[] | select(.name=="partner-orders-gateway-get-order-status") | .id')
REFUND_TOOL=$(echo "$TOOLS" | jq -r '.[] | select(.name=="partner-orders-gateway-refund-order") | .id')
[ -n "$LOOKUP_TOOL" ] && [ -n "$ORDER_STATUS_TOOL" ] && [ -n "$REFUND_TOOL" ] || { echo "Could not resolve tool IDs" >&2; exit 1; }

echo "==> Creating virtual servers"
SERVER_INTERNAL=$(api POST /servers "{\"server\":{\"name\":\"internal-directory\",\"description\":\"Engineering employee directory (internal-only)\",\"associated_tools\":[\"$LOOKUP_TOOL\"]},\"team_id\":\"$ENG_TEAM\",\"visibility\":\"team\"}")
SERVER_PARTNER=$(api POST /servers "{\"server\":{\"name\":\"partner-orders\",\"description\":\"Partner order status and refunds\",\"associated_tools\":[\"$ORDER_STATUS_TOOL\",\"$REFUND_TOOL\"]},\"team_id\":\"$PARTNER_TEAM\",\"visibility\":\"team\"}")
INTERNAL_SERVER_ID=$(echo "$SERVER_INTERNAL" | jq -r .id)
PARTNER_SERVER_ID=$(echo "$SERVER_PARTNER" | jq -r .id)
[ "$INTERNAL_SERVER_ID" != "null" ] || { echo "internal-directory server creation failed: $SERVER_INTERNAL" >&2; exit 1; }
[ "$PARTNER_SERVER_ID" != "null" ] || { echo "partner-orders server creation failed: $SERVER_PARTNER" >&2; exit 1; }

cat > "$STATE_FILE" <<EOF
# Generated by scripts/register-servers.sh — do not commit (gitignored).
ADMIN_TOKEN=$ADMIN_TOKEN
ENG_TEAM=$ENG_TEAM
PARTNER_TEAM=$PARTNER_TEAM
GATEWAY_INTERNAL_ID=$(echo "$GW_INTERNAL" | jq -r .id)
GATEWAY_PARTNER_ID=$(echo "$GW_PARTNER" | jq -r .id)
INTERNAL_SERVER_ID=$INTERNAL_SERVER_ID
PARTNER_SERVER_ID=$PARTNER_SERVER_ID
LOOKUP_TOOL_NAME=internal-directory-gateway-lookup-employee
ORDER_STATUS_TOOL_NAME=partner-orders-gateway-get-order-status
REFUND_TOOL_NAME=partner-orders-gateway-refund-order
EOF

echo "==> Done. State written to $STATE_FILE"
echo "    internal-directory virtual server: $INTERNAL_SERVER_ID"
echo "    partner-orders virtual server:     $PARTNER_SERVER_ID"
echo "    Next: scripts/generate-tokens.sh"

```
