#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - 24/7 AI VPS Supervisor Installer      "
echo "=========================================================="

# Check root
if [ "$EUID" -ne 0 ]; then
  echo "[!] Please run as root (sudo bash install-supervisor.sh)"
  exit 1
fi

# 1. Collect Telegram credentials if not passed as environment variables
if [ -z "$CELORIS_TELEGRAM_BOT_TOKEN" ]; then
    read -rp "Enter your Telegram Bot Token (from @BotFather): " CELORIS_TELEGRAM_BOT_TOKEN
fi

if [ -z "$CELORIS_ADMIN_CHAT_ID" ]; then
    read -rp "Enter your Telegram User ID (from @userinfobot): " CELORIS_ADMIN_CHAT_ID
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    if [ -f "/var/www/celoris/.env.local" ]; then
        GOOGLE_API_KEY=$(grep -E "^GOOGLE_API_KEY=" /var/www/celoris/.env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
    fi
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    read -rp "Enter your Gemini/Google API Key: " GOOGLE_API_KEY
fi

if [ -z "$CELORIS_TELEGRAM_BOT_TOKEN" ]; then
    echo "[!] Error: Telegram Bot Token cannot be empty."
    exit 1
fi

if [ -z "$GOOGLE_API_KEY" ]; then
    echo "[!] Error: Google API Key cannot be empty."
    exit 1
fi

# 2. Install Python dependencies
echo "[+] Installing system and Python dependencies..."
apt update -y
apt install -y python3-pip git curl
pip3 install --upgrade pip
pip3 install google-genai python-telegram-bot psutil

# 3. Create destination folder
mkdir -p /opt/celoris-supervisor
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/celoris_supervisor.py" ]; then
    cp "$SCRIPT_DIR/celoris_supervisor.py" /opt/celoris-supervisor/celoris_supervisor.py
else
    # Fallback: copy from /root if placed there
    cp /root/celoris_supervisor.py /opt/celoris-supervisor/celoris_supervisor.py 2>/dev/null || true
fi

chmod +x /opt/celoris-supervisor/celoris_supervisor.py

# 4. Create environment file
cat << EOF > /opt/celoris-supervisor/.env
CELORIS_TELEGRAM_BOT_TOKEN="$CELORIS_TELEGRAM_BOT_TOKEN"
CELORIS_ADMIN_CHAT_ID="$CELORIS_ADMIN_CHAT_ID"
GOOGLE_API_KEY="$GOOGLE_API_KEY"
CELORIS_PROJECT_DIR="/var/www/celoris"
EOF

chmod 600 /opt/celoris-supervisor/.env

# 5. Create Systemd Service for 24/7 persistence
echo "[+] Creating systemd service: celoris-supervisor.service..."
cat << 'EOF' > /etc/systemd/system/celoris-supervisor.service
[Unit]
Description=Celoris 24/7 AI VPS Supervisor
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/celoris-supervisor
EnvironmentFile=/opt/celoris-supervisor/.env
ExecStart=/usr/bin/python3 /opt/celoris-supervisor/celoris_supervisor.py
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable and Start Service
systemctl daemon-reload
systemctl enable celoris-supervisor
systemctl restart celoris-supervisor

echo "=========================================================="
echo " ✅ SUCCESS! Celoris AI VPS Supervisor is now ACTIVE!    "
echo " Send a message to your Telegram bot to test!             "
echo " Check logs anytime: journalctl -u celoris-supervisor -f  "
echo "=========================================================="
