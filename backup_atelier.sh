#!/usr/bin/env bash
# ==============================================================================
# Backup automatico MongoDB + MinIO per Atelier Liuteria Master
# Esempio cron giornaliero alle 03:30:
#   30 3 * * * /opt/atelier-liuteria/backup_atelier.sh >> /var/log/atelier_backup.log 2>&1
# ==============================================================================

set -euo pipefail

BASE_DIR="${BASE_DIR:-/opt/atelier-liuteria}"
BACKUP_ROOT="${BACKUP_ROOT:-/opt/atelier-backups}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
STAMP="$(date +%Y%m%d_%H%M%S)"
DEST_DIR="${BACKUP_ROOT}/${STAMP}"

mkdir -p "${DEST_DIR}"

if [ -f "${BASE_DIR}/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "${BASE_DIR}/.env"
    set +a
    cp "${BASE_DIR}/.env" "${DEST_DIR}/env.backup"
fi

echo "[${STAMP}] Avvio backup MongoDB..."
MONGO_USER="${MONGO_INITDB_ROOT_USERNAME:-atelier}"
MONGO_PASS="${MONGO_INITDB_ROOT_PASSWORD:-}"
if docker ps --format '{{.Names}}' | grep -q '^atelier-mongodb$'; then
    if [ -n "${MONGO_PASS}" ]; then
        docker exec atelier-mongodb mongodump \
            --username "${MONGO_USER}" \
            --password "${MONGO_PASS}" \
            --authenticationDatabase admin \
            --archive --gzip > "${DEST_DIR}/mongodb_${STAMP}.archive.gz"
    else
        docker exec atelier-mongodb mongodump \
            --archive --gzip > "${DEST_DIR}/mongodb_${STAMP}.archive.gz"
    fi
    echo "[${STAMP}] MongoDB salvato in ${DEST_DIR}/mongodb_${STAMP}.archive.gz"
else
    echo "[${STAMP}] AVVISO: container atelier-mongodb non attivo, salto mongodump."
fi

echo "[${STAMP}] Avvio backup MinIO..."
if [ -d "${BASE_DIR}/data/minio" ]; then
    tar -czf "${DEST_DIR}/minio_${STAMP}.tar.gz" -C "${BASE_DIR}/data" minio
    echo "[${STAMP}] MinIO salvato in ${DEST_DIR}/minio_${STAMP}.tar.gz"
else
    echo "[${STAMP}] AVVISO: directory ${BASE_DIR}/data/minio non trovata."
fi

echo "[${STAMP}] Pulizia backup più vecchi di ${RETENTION_DAYS} giorni..."
find "${BACKUP_ROOT}" -maxdepth 1 -mindepth 1 -type d -mtime +"${RETENTION_DAYS}" -exec rm -rf {} +

echo "[${STAMP}] Backup completato con successo."
