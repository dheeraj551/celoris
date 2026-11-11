#!/usr/bin/env bash
set -e

ARCHIVE="$1"
if [ -z "$ARCHIVE" ] || [ ! -f "$ARCHIVE" ]; then
  echo "Usage: bash restore-vps.sh /root/celoris-vps-full-backup-YYYYMMDD_HHMMSS.tar.gz"
  exit 1
fi

echo "=========================================================="
echo "  Celoris Full VPS Restore Utility"
echo "=========================================================="

echo "[1/6] Installing prerequisites (Docker, Node.js, Python3)..."
apt-get update -y
apt-get install -y curl git tar ca-certificates python3
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

TMP_RESTORE="/root/celoris_restore_tmp"
rm -rf "$TMP_RESTORE"
mkdir -p "$TMP_RESTORE"
echo "[2/6] Extracting backup archive..."
tar -xzf "$ARCHIVE" -C "$TMP_RESTORE"
BACKUP_ROOT=$(find "$TMP_RESTORE" -maxdepth 1 -type d -name "celoris_backup_*" | head -n1)

echo "[3/6] Restoring directories (/opt/celoris-cloud, /root/celoris, /root/livekit)..."
[ -f "$BACKUP_ROOT/opt-celoris-cloud.tar.gz" ] && tar -xzf "$BACKUP_ROOT/opt-celoris-cloud.tar.gz" -C /opt
[ -f "$BACKUP_ROOT/root-celoris.tar.gz" ] && tar -xzf "$BACKUP_ROOT/root-celoris.tar.gz" -C /root
[ -f "$BACKUP_ROOT/var-www.tar.gz" ] && tar -xzf "$BACKUP_ROOT/var-www.tar.gz" -C /var
[ -f "$BACKUP_ROOT/root-livekit.tar.gz" ] && tar -xzf "$BACKUP_ROOT/root-livekit.tar.gz" -C /root

echo "[4/6] Restoring Docker named volumes..."
if [ -d "$BACKUP_ROOT/docker-volumes" ]; then
  for vol_tar in "$BACKUP_ROOT/docker-volumes"/*.tar.gz; do
    [ -e "$vol_tar" ] || continue
    VOL_NAME=$(basename "$vol_tar" .tar.gz)
    echo "  -> Restoring volume: $VOL_NAME"
    docker volume create "$VOL_NAME" >/dev/null
    docker run --rm -v "${VOL_NAME}:/volume" -v "$BACKUP_ROOT/docker-volumes:/backup:ro" alpine \
      sh -c "cd /volume && tar -xzf /backup/${VOL_NAME}.tar.gz"
  done
fi

echo "[5/6] Restoring systemd services & configs..."
cp -a "$BACKUP_ROOT/configs"/celoris*.service /etc/systemd/system/ 2>/dev/null || true
cp -a "$BACKUP_ROOT/configs"/livekit*.service /etc/systemd/system/ 2>/dev/null || true
[ -d "$BACKUP_ROOT/configs/wireguard" ] && cp -a "$BACKUP_ROOT/configs/wireguard" /etc/wireguard || true
systemctl daemon-reload

for svc in /etc/systemd/system/celoris*.service /etc/systemd/system/livekit*.service; do
  [ -e "$svc" ] || continue
  SVC_NAME=$(basename "$svc")
  systemctl enable "$SVC_NAME" || true
  systemctl restart "$SVC_NAME" || true
done

echo "[6/6] Starting Docker Compose stack (/opt/celoris-cloud)..."
if [ -f /opt/celoris-cloud/docker-compose.yml ]; then
  cd /opt/celoris-cloud
  docker compose up -d
fi

echo "=========================================================="
echo "  RESTORE COMPLETE!"
echo "  Next Steps:"
echo "  1. Check 'docker ps' and 'systemctl status celoris-media'"
echo "  2. Update DNS A-records in Cloudflare to this new VPS IP!"
echo "  3. Update VPS IP in Vercel env vars if any point to old IP."
echo "=========================================================="
