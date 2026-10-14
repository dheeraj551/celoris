#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - WireGuard (wg-easy) Docker Installer   "
echo "=========================================================="

# 1. Detect Host Public IP
HOST_IP=$(curl -4 -s --max-time 5 https://api.ipify.org || curl -4 -s --max-time 5 https://ifconfig.me || echo "169.58.229.99")
echo "[+] Detected Public Host IP: $HOST_IP"

# 2. Get or set Admin Password
DEFAULT_PASS="CelorisSecureVPN2026!"
WG_PASS="${1:-$DEFAULT_PASS}"

echo "[+] Target Web UI Admin Password: $WG_PASS"
echo "[+] Pulling latest official wg-easy image..."
docker pull ghcr.io/wg-easy/wg-easy:latest

# 3. Generate Bcrypt Password Hash using wg-easy built-in utility
echo "[+] Generating bcrypt hash for Web UI..."
RAW_HASH=$(docker run --rm ghcr.io/wg-easy/wg-easy wgpw "$WG_PASS" | tr -d '\r' | tr -d '\n')

# Verify hash starts with $2
if [[ ! "$RAW_HASH" =~ ^\$2 ]]; then
    echo "[!] Error generating bcrypt hash. Output was: $RAW_HASH"
    exit 1
fi
echo "[+] Password hash generated successfully."

# 4. Enable IPv4 forwarding on host kernel
echo "[+] Enabling net.ipv4.ip_forward in host kernel..."
modprobe wireguard || true
sysctl -w net.ipv4.ip_forward=1
grep -q "net.ipv4.ip_forward=1" /etc/sysctl.conf || echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf

# 5. Prepare persistent storage directory
mkdir -p /root/wireguard-data

# 6. Stop and remove existing wg-easy container if running
if docker ps -a --format '{{.Names}}' | grep -q "^wg-easy$"; then
    echo "[+] Removing existing wg-easy container..."
    docker rm -f wg-easy || true
fi

# 7. Launch wg-easy container
echo "[+] Launching wg-easy container..."
docker run -d \
  --name wg-easy \
  --env WG_HOST="$HOST_IP" \
  --env PASSWORD_HASH="$RAW_HASH" \
  --env WG_PORT=51820 \
  --env PORT=51821 \
  --env WG_DEFAULT_DNS="1.1.1.1,1.0.0.1" \
  --volume /root/wireguard-data:/etc/wireguard \
  --publish 51820:51820/udp \
  --publish 51821:51821/tcp \
  --cap-add=NET_ADMIN \
  --cap-add=SYS_MODULE \
  --sysctl="net.ipv4.ip_forward=1" \
  --sysctl="net.ipv4.conf.all.src_valid_mark=1" \
  --restart unless-stopped \
  ghcr.io/wg-easy/wg-easy:latest

# 8. Allow firewall ports if UFW is active
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
    echo "[+] Opening UFW firewall ports 51820/udp and 51821/tcp..."
    ufw allow 51820/udp comment "WireGuard VPN"
    ufw allow 51821/tcp comment "WireGuard Web UI"
    ufw reload || true
fi

echo ""
echo "=========================================================="
echo "    WireGuard (wg-easy) Successfully Deployed!           "
echo "=========================================================="
echo " Web UI URL : http://$HOST_IP:51821"
echo " Password   : $WG_PASS"
echo ""
echo " Next Steps:"
echo " 1. Open http://$HOST_IP:51821 in your browser"
echo " 2. Log in with the password above"
echo " 3. Click '+ New' to create a client (e.g. 'MyPhone' or 'MyLaptop')"
echo " 4. Scan the QR code with the WireGuard app, or download the .conf file!"
echo "=========================================================="
