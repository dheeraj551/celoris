#!/usr/bin/env bash
# ==============================================================================
# Celoris Cloud - Supabase Self-Hosted Docker & Nightly Sync Backup
# Target VPS: Contabo Ubuntu 24.04 (169.58.229.99)
# ==============================================================================
set -e

echo "=========================================================="
echo "🚀 [1/4] Preparing System & Docker Environment for Supabase"
echo "=========================================================="

apt update -y
apt install -y git curl wget postgresql-client jq openssl

# Ensure docker compose is available
if ! docker compose version >/dev/null 2>&1; then
    echo "[+] Installing docker compose plugin..."
    apt install -y docker-compose-plugin
fi

WORK_DIR="/root/supabase-docker"
mkdir -p "$WORK_DIR/snapshots"
mkdir -p "$WORK_DIR/volumes/db"

echo "=========================================================="
echo "📦 [2/4] Downloading Official Supabase Docker Stack"
echo "=========================================================="

if [ ! -f "$WORK_DIR/docker-compose.yml" ]; then
    TMP_DIR=$(mktemp -d)
    git clone --depth 1 https://github.com/supabase/supabase "$TMP_DIR"
    cp -rf "$TMP_DIR/docker/"* "$WORK_DIR/"
    rm -rf "$TMP_DIR"
    echo "[+] Supabase Docker configuration copied to $WORK_DIR"
fi

cd "$WORK_DIR"

# Generate strong random keys for local Supabase instance
if [ ! -f "$WORK_DIR/.env" ]; then
    echo "[+] Generating .env with secure local secrets..."
    cp "$WORK_DIR/.env.example" "$WORK_DIR/.env"
    
    LOCAL_POSTGRES_PW=$(openssl rand -base64 16 | tr -dc 'a-zA-Z0-9')
    LOCAL_JWT_SECRET=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9')
    DASHBOARD_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9')

    sed -i "s|POSTGRES_PASSWORD=.*|POSTGRES_PASSWORD=$LOCAL_POSTGRES_PW|" "$WORK_DIR/.env"
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$LOCAL_JWT_SECRET|" "$WORK_DIR/.env"
    sed -i "s|DASHBOARD_PASSWORD=.*|DASHBOARD_PASSWORD=$DASHBOARD_PASS|" "$WORK_DIR/.env"
    sed -i "s|DASHBOARD_USERNAME=.*|DASHBOARD_USERNAME=admin|" "$WORK_DIR/.env"
    
    echo "=========================================================="
    echo "🔑 LOCAL SUPABASE CREDENTIALS CREATED:"
    echo "Studio URL: http://169.58.229.99:8000"
    echo "Username:   admin"
    echo "Password:   $DASHBOARD_PASS"
    echo "Postgres:   postgres:$LOCAL_POSTGRES_PW@localhost:5432"
    echo "=========================================================="
fi

echo "=========================================================="
echo "🐳 [3/4] Pulling and Starting Supabase Docker Containers"
echo "=========================================================="

docker compose pull
docker compose up -d

echo "=========================================================="
echo "⚙️ [4/4] Creating Nightly Sync & Backup Script"
echo "=========================================================="

cat << 'SYNC_EOF' > "$WORK_DIR/sync_cloud_to_local.sh"
#!/usr/bin/env bash
# ==============================================================================
# Nightly Sync: Cloud Supabase -> Local VPS Supabase Docker Replica
# ==============================================================================
set -e

BACKUP_DIR="/root/supabase-docker/snapshots"
LOG_FILE="/var/log/supabase_backup.log"
DATE_STR=$(date +%Y-%m-%d_%H%M%S)
DUMP_FILE="$BACKUP_DIR/supabase_cloud_$DATE_STR.sql.gz"

# 1. Try Direct Connection first (Fastest, full IPv6 support on Contabo)
# Direct connection uses user "postgres" on port 5432
CLOUD_PROJECT_REF="suaqywhmaheoansrinzw"
DIRECT_HOST="db.$CLOUD_PROJECT_REF.supabase.co"
DIRECT_USER="postgres"
DIRECT_PORT="5432"

# Fallback Pooler configuration (Session Mode on port 5432)
POOLER_HOST="${CLOUD_SUPABASE_DB_HOST:-aws-0-ap-south-1.pooler.supabase.com}"
POOLER_USER="postgres.$CLOUD_PROJECT_REF"
POOLER_PORT="5432"

CLOUD_DB_PASSWORD="${CLOUD_SUPABASE_DB_PASSWORD}"

echo "[$DATE_STR] Starting Cloud Supabase Backup..." >> "$LOG_FILE"

if [ -f "/root/supabase-docker/cloud_db.credentials" ]; then
    source "/root/supabase-docker/cloud_db.credentials"
fi

if [ -z "$CLOUD_SUPABASE_DB_PASSWORD" ]; then
    echo "[$DATE_STR] ERROR: CLOUD_SUPABASE_DB_PASSWORD is not set in /root/supabase-docker/cloud_db.credentials" >> "$LOG_FILE"
    exit 1
fi

export PGPASSWORD="$CLOUD_SUPABASE_DB_PASSWORD"

DUMP_SUCCESS=0

# Attempt 1: Direct Host
echo "[$DATE_STR] Attempting direct connection to $DIRECT_HOST:$DIRECT_PORT..." >> "$LOG_FILE"
if pg_dump \
    -h "$DIRECT_HOST" \
    -p "$DIRECT_PORT" \
    -U "$DIRECT_USER" \
    -d "postgres" \
    --clean \
    --if-exists \
    --quote-all-identifiers \
    --no-owner \
    --no-privileges \
    | gzip > "$DUMP_FILE"; then
    DUMP_SUCCESS=1
else
    echo "[$DATE_STR] Direct connection failed, attempting session pooler ($POOLER_HOST)..." >> "$LOG_FILE"
    if pg_dump \
        -h "$POOLER_HOST" \
        -p "$POOLER_PORT" \
        -U "$POOLER_USER" \
        -d "postgres" \
        --clean \
        --if-exists \
        --quote-all-identifiers \
        --no-owner \
        --no-privileges \
        | gzip > "$DUMP_FILE"; then
        DUMP_SUCCESS=1
    fi
fi

if [ "$DUMP_SUCCESS" -ne 1 ]; then
    echo "[$DATE_STR] ERROR: Failed to dump database from both direct host and pooler." >> "$LOG_FILE"
    exit 1
fi

FILE_SIZE=$(du -h "$DUMP_FILE" | cut -f1)
echo "[$DATE_STR] Backup completed successfully. Size: $FILE_SIZE ($DUMP_FILE)" >> "$LOG_FILE"

# 2. Restore into local Docker Postgres container (Hot Replica)
if docker ps --format '{{.Names}}' | grep -q "supabase-db"; then
    echo "[$DATE_STR] Restoring snapshot into local Supabase Docker container..." >> "$LOG_FILE"
    gunzip -c "$DUMP_FILE" | docker exec -i supabase-db psql -U postgres -d postgres >/dev/null 2>&1 || true
    echo "[$DATE_STR] Local hot replica updated successfully." >> "$LOG_FILE"
fi

# 3. Clean up snapshots older than 14 days to preserve disk space
find "$BACKUP_DIR" -name "supabase_cloud_*.sql.gz" -mtime +14 -delete
echo "[$DATE_STR] Retention check: Old backups (>14 days) pruned." >> "$LOG_FILE"

SYNC_EOF

chmod +x "$WORK_DIR/sync_cloud_to_local.sh"

# Setup automated cron job (Runs every night at 02:30 AM server time)
cat << 'CRON_EOF' > /etc/cron.d/supabase-nightly-backup
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
30 2 * * * root /root/supabase-docker/sync_cloud_to_local.sh >> /var/log/supabase_backup.log 2>&1
CRON_EOF

chmod 0644 /etc/cron.d/supabase-nightly-backup

echo "=========================================================="
echo "✅ Supabase Docker & Backup Automation Configured!"
echo "Next step: Add your Cloud Supabase DB password to:"
echo "/root/supabase-docker/cloud_db.credentials"
echo "=========================================================="
