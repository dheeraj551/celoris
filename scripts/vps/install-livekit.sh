#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - LiveKit WebRTC Server Installer       "
echo "=========================================================="

# 1. Detect Host Public IP
HOST_IP=$(curl -4 -s --max-time 5 https://api.ipify.org || curl -4 -s --max-time 5 https://ifconfig.me || echo "169.58.229.99")
echo "[+] Detected Public Host IP: $HOST_IP"

# 2. Setup Working Directory
mkdir -p /root/livekit
cd /root/livekit

# 3. Generate API Key and Secret (or accept as arguments)
DEFAULT_KEY="celoris_livekit_key"
LIVEKIT_KEY="${1:-$DEFAULT_KEY}"

if [ -n "$2" ]; then
    LIVEKIT_SECRET="$2"
else
    # Generate 48-char secure hex secret
    LIVEKIT_SECRET=$(openssl rand -hex 24)
fi

echo "[+] Using LiveKit API Key: $LIVEKIT_KEY"

# 4. Create livekit.yaml configuration
cat << EOF > /root/livekit/livekit.yaml
port: 7880
bind_addresses:
  - "0.0.0.0"
rtc:
  tcp_port: 7881
  port_range_start: 50000
  port_range_end: 50100
  use_external_ip: true
  node_ip: "$HOST_IP"
keys:
  $LIVEKIT_KEY: "$LIVEKIT_SECRET"
logging:
  level: info
EOF

echo "[+] Configuration written to /root/livekit/livekit.yaml"

# 5. Pull latest official LiveKit image
echo "[+] Pulling latest LiveKit Docker image..."
docker pull livekit/livekit-server:latest

# 6. Stop previous LiveKit container if running
if docker ps -a --format '{{.Names}}' | grep -q "^livekit$"; then
    echo "[+] Removing existing livekit container..."
    docker rm -f livekit || true
fi

# 7. Run LiveKit container
echo "[+] Launching LiveKit container..."
docker run -d \
  --name livekit \
  --restart unless-stopped \
  -v /root/livekit/livekit.yaml:/etc/livekit.yaml \
  -p 7880:7880 \
  -p 7881:7881 \
  -p 50000-50100:50000-50100/udp \
  livekit/livekit-server:latest \
  --config /etc/livekit.yaml

# 8. Configure Reverse Proxy in Caddy (if Caddy is installed on host)
CADDY_CONFIG="/etc/caddy/Caddyfile"
if [ -f "$CADDY_CONFIG" ]; then
    if ! grep -q "livekit.celoris.in" "$CADDY_CONFIG"; then
        echo "[+] Adding livekit.celoris.in reverse proxy to $CADDY_CONFIG..."
        cat << 'EOF' >> "$CADDY_CONFIG"

livekit.celoris.in {
    reverse_proxy 127.0.0.1:7880
}
EOF
        if systemctl is-active --quiet caddy; then
            systemctl reload caddy || true
            echo "[+] Caddy service reloaded with livekit.celoris.in HTTPS certificate!"
        elif docker ps | grep -q "caddy"; then
            CADDY_CONTAINER=$(docker ps --format '{{.Names}}' | grep "caddy" | head -n1)
            docker exec "$CADDY_CONTAINER" caddy reload || true
            echo "[+] Caddy container ($CADDY_CONTAINER) reloaded!"
        fi
    fi
fi

# 9. Configure Firewall if UFW is active
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
    echo "[+] Opening UFW firewall ports (7880/tcp, 7881/tcp, 50000-50100/udp)..."
    ufw allow 7880/tcp comment "LiveKit Signaling"
    ufw allow 7881/tcp comment "LiveKit WebRTC TCP"
    ufw allow 50000:50100/udp comment "LiveKit WebRTC Media UDP"
    ufw reload || true
fi

# 10. Verify LiveKit is running
sleep 3
if docker ps | grep -q "livekit"; then
    echo ""
    echo "=========================================================="
    echo "    LiveKit Server Successfully Deployed! 🎉             "
    echo "=========================================================="
    echo " WebRTC Signaling URL : wss://livekit.celoris.in"
    echo " Fallback Direct URL  : ws://$HOST_IP:7880"
    echo " API Key              : $LIVEKIT_KEY"
    echo " API Secret           : $LIVEKIT_SECRET"
    echo ""
    echo " Add these to your Next.js environment (Vercel / .env.local):"
    echo " --------------------------------------------------------"
    echo " LIVEKIT_URL=wss://livekit.celoris.in"
    echo " LIVEKIT_API_KEY=$LIVEKIT_KEY"
    echo " LIVEKIT_API_SECRET=$LIVEKIT_SECRET"
    echo " =========================================================="
else
    echo "[!] LiveKit container failed to start. Run 'docker logs livekit' to inspect."
    exit 1
fi
