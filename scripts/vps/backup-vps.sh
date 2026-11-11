#!/usr/bin/env bash
set -e

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/celoris_backup_${TIMESTAMP}"
ARCHIVE_PATH="/root/celoris-vps-full-backup-${TIMESTAMP}.tar.gz"

echo "=========================================================="
echo "  Celoris Full VPS Backup Utility ($TIMESTAMP)"
echo "=========================================================="

mkdir -p "$BACKUP_DIR/databases"
mkdir -p "$BACKUP_DIR/configs"
mkdir -p "$BACKUP_DIR/docker-volumes"

echo "[1/6] Saving system state, crontabs, and systemd services..."
crontab -l > "$BACKUP_DIR/configs/root-crontab.txt" 2>/dev/null || true
docker ps -a --format '{{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}' > "$BACKUP_DIR/configs/docker-containers.txt" 2>/dev/null || true
cp -a /etc/systemd/system/celoris*.service "$BACKUP_DIR/configs/" 2>/dev/null || true
cp -a /etc/systemd/system/livekit*.service "$BACKUP_DIR/configs/" 2>/dev/null || true
[ -d /etc/wireguard ] && cp -a /etc/wireguard "$BACKUP_DIR/configs/wireguard" || true
[ -d /etc/caddy ] && cp -a /etc/caddy "$BACKUP_DIR/configs/caddy-etc" || true

echo "[2/6] Dumping MySQL / MariaDB / Postgres databases cleanly..."
for c in $(docker ps --format '{{.Names}}' 2>/dev/null); do
  IMAGE=$(docker inspect --format '{{.Config.Image}}' "$c" 2>/dev/null || echo "")
  if echo "$IMAGE" | grep -qiE "mysql|mariadb"; then
    echo "  -> Dumping MySQL/MariaDB from container: $c"
    docker exec "$c" sh -c 'exec mysqldump --all-databases --single-transaction --quick -uroot -p"$MYSQL_ROOT_PASSWORD"' \
      > "$BACKUP_DIR/databases/${c}_all_databases.sql" 2>/dev/null || \
    docker exec "$c" sh -c 'exec mysqldump --all-databases --single-transaction --quick -uroot -p"$MARIADB_ROOT_PASSWORD"' \
      > "$BACKUP_DIR/databases/${c}_all_databases.sql" 2>/dev/null || \
    echo "  [!] Warning: Could not auto-dump $c (volume will still be backed up)"
  fi
  if echo "$IMAGE" | grep -qi "postgres"; then
    echo "  -> Dumping Postgres from container: $c"
    docker exec "$c" sh -c 'pg_dumpall -U postgres' > "$BACKUP_DIR/databases/${c}_pg_all.sql" 2>/dev/null || true
  fi
done

echo "[3/6] Backing up /opt/celoris-cloud (Caddy, WordPress, Provisioner)..."
[ -d /opt/celoris-cloud ] && tar -czf "$BACKUP_DIR/opt-celoris-cloud.tar.gz" -C /opt celoris-cloud || true

echo "[4/6] Backing up /root/celoris (Media Server, Reels, Uploaded Social Media)..."
if [ -d /root/celoris ]; then
  tar --exclude='celoris/node_modules' --exclude='celoris/.next' -czf "$BACKUP_DIR/root-celoris.tar.gz" -C /root celoris
fi
[ -d /var/www ] && tar -czf "$BACKUP_DIR/var-www.tar.gz" -C /var www || true

echo "[5/6] Backing up LiveKit & Supabase snapshots..."
[ -d /root/livekit ] && tar -czf "$BACKUP_DIR/root-livekit.tar.gz" -C /root livekit || true
[ -d /root/supabase-docker ] && tar --exclude='supabase-docker/volumes/db/data' -czf "$BACKUP_DIR/root-supabase-docker.tar.gz" -C /root supabase-docker || true

echo "[6/6] Backing up Docker named volumes..."
for vol in $(docker volume ls -q 2>/dev/null); do
  echo "  -> Archiving Docker volume: $vol"
  docker run --rm -v "${vol}:/volume:ro" -v "$BACKUP_DIR/docker-volumes:/backup" alpine \
    tar -czf "/backup/${vol}.tar.gz" -C /volume . 2>/dev/null || true
done

echo "[*] Creating single master backup archive..."
tar -czf "$ARCHIVE_PATH" -C /root "celoris_backup_${TIMESTAMP}"
rm -rf "$BACKUP_DIR"

SIZE=$(du -h "$ARCHIVE_PATH" | cut -f1)
echo "=========================================================="
echo "  BACKUP COMPLETE!"
echo "  Archive: $ARCHIVE_PATH"
echo "  Size:    $SIZE"
echo "=========================================================="
echo ""
echo "Download to your Windows PC with PowerShell:"
echo "  scp root@$(curl -4 -s --max-time 4 ifconfig.me || echo '169.58.229.99'):$ARCHIVE_PATH E:\\Celoris-VPS-Backup\\"
echo ""
echo "Or transfer directly to your NEW VPS:"
echo "  scp $ARCHIVE_PATH root@NEW_VPS_IP:/root/"
echo "=========================================================="
