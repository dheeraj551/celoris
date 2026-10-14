#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - Fix Caddy, LiveKit & Configure Firewall"
echo "=========================================================="

# 1. Configure Ubuntu Local Firewall (UFW) if present
echo "=== [1/5] Configuring Local OS Firewall (UFW) ==="
if command -v ufw >/dev/null 2>&1; then
    echo "[+] Ensuring required ports are open in UFW..."
    ufw allow 22/tcp comment "SSH" 2>/dev/null || true
    ufw allow 80/tcp comment "HTTP Web" 2>/dev/null || true
    ufw allow 443/tcp comment "HTTPS Web" 2>/dev/null || true
    ufw allow 7880/tcp comment "LiveKit Signaling" 2>/dev/null || true
    ufw allow 7881/tcp comment "LiveKit WebRTC TCP" 2>/dev/null || true
    ufw allow 50000:50100/udp comment "LiveKit WebRTC Media UDP" 2>/dev/null || true
    ufw allow 51820/udp comment "WireGuard VPN" 2>/dev/null || true
    ufw allow 51821/tcp comment "WireGuard Web UI" 2>/dev/null || true
    if ufw status | grep -q "Status: active"; then
        ufw reload 2>/dev/null || true
        echo "[+] UFW reloaded with all ports permitted."
    else
        echo "[*] UFW is installed but inactive (Contabo CCP firewall is likely controlling traffic)."
    fi
else
    echo "[*] UFW not installed, relying on Contabo Cloud Firewall."
fi

# 2. Connect LiveKit container to Caddy Docker Network
echo "=== [2/5] Connecting LiveKit to Docker Network ==="
CADDY_NET="celoris-cloud_celoris-net"
if docker network inspect "$CADDY_NET" >/dev/null 2>&1; then
    echo "[+] Connecting livekit to network '$CADDY_NET'..."
    docker network connect "$CADDY_NET" livekit 2>/dev/null || echo "[*] livekit is already connected to $CADDY_NET"
else
    echo "[!] Network $CADDY_NET not found, listing available networks:"
    docker network ls
fi

# 3. Write Correct Caddyfile with Global Block at Line 1
echo "=== [3/5] Writing Clean Caddyfile ==="
CADDYFILE="/opt/celoris-cloud/caddy/Caddyfile"
mkdir -p "$(dirname "$CADDYFILE")"

cat << 'EOF' > "$CADDYFILE"
{
    email admin@celorisdesigns.com
    on_demand_tls {
        ask http://provisioner:4000/check-domain
    }
}

http://livekit.celoris.in, https://livekit.celoris.in {
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

echo "[+] Caddyfile successfully updated at $CADDYFILE"

# 4. Restart Caddy container and check health
echo "=== [4/5] Restarting celoris-caddy Container ==="
docker restart celoris-caddy
sleep 4

echo "[+] Docker container status:"
docker ps --filter "name=celoris-" --filter "name=livekit" --filter "name=wg-easy"

# 5. Connectivity Verification
echo "=== [5/5] Verification & Health Check ==="
echo -n "[*] Local LiveKit 7880: "
curl -s -I -o /dev/null -w "HTTP %{http_code}\n" http://127.0.0.1:7880 || echo "Failed"

echo -n "[*] Public livekit.celoris.in: "
curl -s -I -o /dev/null -w "HTTP %{http_code}\n" https://livekit.celoris.in || echo "Failed"

echo ""
echo "=========================================================="
echo "          CONTABO CLOUD FIREWALL PORT GUIDE               "
echo "=========================================================="
echo "In Contabo Customer Control Panel (https://my.contabo.com):"
echo "Go to: Cloud Instances -> Manage -> Cloud Firewall"
echo ""
echo "Ensure these INBOUND rules are added:"
echo "----------------------------------------------------------"
echo " 1. SSH               : TCP   22"
echo " 2. Web HTTP          : TCP   80"
echo " 3. Web HTTPS         : TCP   443"
echo " 4. LiveKit Signaling : TCP   7880"
echo " 5. LiveKit WebRTC TCP: TCP   7881"
echo " 6. LiveKit Media UDP : UDP   50000 - 50100"
echo " 7. WireGuard VPN     : UDP   51820"
echo " 8. WireGuard Web UI  : TCP   51821"
echo "=========================================================="
