#!/usr/bin/env bash
set -e

CADDYFILE="/opt/celoris-cloud/caddy/Caddyfile"
echo "=== [1/3] Restoring Caddyfile with Global Block at Line 1 ==="

cat << 'EOF' > "$CADDYFILE"
{
    email admin@celorisdesigns.com
    on_demand_tls {
        ask http://provisioner:4000/check-domain
    }
}

livekit.celoris.in {
    reverse_proxy livekit:7880
}

:80, :443 {
    tls {
        on_demand
    }
    reverse_proxy wordpress:80 {
        header_up Host {host}
        header_up X-Real-IP {remote}
        header_up X-Forwarded-For {remote}
        header_up X-Forwarded-Proto {scheme}
    }
}
EOF

echo "[+] Caddyfile written correctly."

echo "=== [2/3] Restarting celoris-caddy Container ==="
docker restart celoris-caddy
sleep 3

echo "=== [3/3] Checking Caddy Container Status ==="
docker ps --filter "name=celoris-caddy"

echo ""
echo "=== Testing LiveKit endpoint ==="
sleep 2
TEST_RESP=$(curl -s -I -o /dev/null -w "%{http_code}" https://livekit.celoris.in || echo "000")
echo "HTTP Status for https://livekit.celoris.in: $TEST_RESP"

if [ "$TEST_RESP" = "200" ]; then
    echo ""
    echo "=========================================================="
    echo " SUCCESS! https://livekit.celoris.in is now LIVE! 🎉     "
    echo " WebRTC Signaling URL : wss://livekit.celoris.in         "
    echo "=========================================================="
fi
