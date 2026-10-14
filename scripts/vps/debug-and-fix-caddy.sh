#!/usr/bin/env bash
set -e

CADDYFILE="/opt/celoris-cloud/caddy/Caddyfile"

echo "=== Current /opt/celoris-cloud/caddy/Caddyfile ==="
cat "$CADDYFILE"
echo ""

echo "=== Last 25 lines of celoris-caddy logs ==="
docker logs --tail 25 celoris-caddy || true
echo ""

echo "=== Testing container reachability from celoris-caddy ==="
docker exec celoris-caddy wget -q -O - http://livekit:7880 || echo "[!] Could not reach livekit:7880 from celoris-caddy"
