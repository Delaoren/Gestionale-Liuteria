#!/usr/bin/env bash
# ==============================================================================
# Script di Installazione Automatica su Server Ubuntu
# Atelier Liuteria Master - Suite Gestionale (Avvio automatico systemd)
# ==============================================================================

set -e

APP_NAME="atelier-liuteria"
INSTALL_DIR="/opt/atelier-liuteria"
SERVICE_FILE="/etc/systemd/system/${APP_NAME}.service"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Parametri configurabili tramite variabili d'ambiente (opzionali)
PORT="${PORT:-8080}"
MQTT_BROKER="${MQTT_BROKER:-192.168.68.108}"
MQTT_PORT="${MQTT_PORT:-1883}"
ESPHOME_HOST="${ESPHOME_HOST:-192.168.68.101}"
SERVICE_USER="${SUDO_USER:-$USER}"

echo "=================================================================="
echo "  INSTALLAZIONE ATELIER LIUTERIA MASTER SU UBUNTU"
echo "=================================================================="

if [ "$EUID" -ne 0 ]; then
    echo "[!] Esegui questo script con privilegi di amministratore:"
    echo "    sudo ./install_ubuntu.sh"
    exit 1
fi

echo "[1/5] Installazione pacchetti di sistema (Python 3 + venv + git)..."
apt-get update -qq || true
apt-get install -y python3 python3-venv python3-pip rsync git || true

echo "[2/5] Copia dei file dell'applicazione in ${INSTALL_DIR}..."
mkdir -p "${INSTALL_DIR}"
if [ "${SCRIPT_DIR}" != "${INSTALL_DIR}" ]; then
    rsync -av --exclude='.venv' --exclude='__pycache__' --exclude='.git' --exclude='social_uploads' --exclude='biblioteca_uploads' --exclude='social_state.json' "${SCRIPT_DIR}/" "${INSTALL_DIR}/"
fi

# Configura repository Git collegato al branch 'main' per Auto-Update automatico
git config --global --add safe.directory "${INSTALL_DIR}" || true
if [ ! -d "${INSTALL_DIR}/.git" ]; then
    cd "${INSTALL_DIR}"
    git init -b main || git init
    git remote add origin https://github.com/Delaoren/Gestionale-Liuteria.git || git remote set-url origin https://github.com/Delaoren/Gestionale-Liuteria.git
    git fetch origin main || true
    git branch --set-upstream-to=origin/main main 2>/dev/null || true
fi

echo "[3/5] Creazione ambiente virtuale Python e installazione paho-mqtt..."
python3 -m venv "${INSTALL_DIR}/.venv"
"${INSTALL_DIR}/.venv/bin/pip" install --upgrade pip -q
"${INSTALL_DIR}/.venv/bin/pip" install paho-mqtt -q

chown -R "${SERVICE_USER}:${SERVICE_USER}" "${INSTALL_DIR}"

echo "[4/5] Configurazione del servizio systemd (${SERVICE_FILE})..."
cat > "${SERVICE_FILE}" <<EOF
[Unit]
Description=Atelier Liuteria Master - Suite Gestionale & Bridge MQTT/ESPHome
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=${SERVICE_USER}
WorkingDirectory=${INSTALL_DIR}
Environment="PYTHONUNBUFFERED=1"
Environment="NO_BROWSER=1"
Environment="PORT=${PORT}"
Environment="MQTT_BROKER=${MQTT_BROKER}"
Environment="MQTT_PORT=${MQTT_PORT}"
Environment="ESPHOME_HOST=${ESPHOME_HOST}"
ExecStart=${INSTALL_DIR}/.venv/bin/python ${INSTALL_DIR}/server.py --no-browser
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

echo "[5/5] Abilitazione e avvio automatico del servizio..."
systemctl daemon-reload
systemctl enable "${APP_NAME}.service"
systemctl restart "${APP_NAME}.service"

# Apertura porta sul firewall UFW se attivo
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
    echo "[+] Configurazione firewall UFW per la porta ${PORT}/tcp..."
    ufw allow "${PORT}/tcp" >/dev/null || true
fi

SERVER_IP=$(hostname -I | awk '{print $1}')

echo "=================================================================="
echo "  INSTALLAZIONE COMPLETATA CON SUCCESSO!"
echo "=================================================================="
echo "  Stato servizio:   attivo e abilitato all'avvio del server"
echo "  URL Gestionale:   http://${SERVER_IP}:${PORT}"
echo "  Directory:        ${INSTALL_DIR}"
echo ""
echo "  Comandi utili:"
echo "  - Stato:          sudo systemctl status ${APP_NAME}"
echo "  - Log in diretta: sudo journalctl -u ${APP_NAME} -f"
echo "  - Riavvio:        sudo systemctl restart ${APP_NAME}"
echo "  - Arresto:        sudo systemctl stop ${APP_NAME}"
echo "=================================================================="
