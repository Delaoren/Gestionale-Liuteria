# Atelier Liuteria - Gestionale Laboratory

Sistema di gestione e monitoraggio ambientale per il laboratorio di liuteria.

## Caratteristiche

- **Monitoraggio Ambientale & EMC (Equilibrium Moisture Content)**:
  - Misurazione in tempo reale di Temperatura e Umidità per legni da liuteria.
  - Calcolo dinamico dell'EMC secondo le formule USDA Forest Products Laboratory.
  - Bridge MQTT locale per sensori (Zigbee2MQTT, Tasmota, ESPHome).
  - Proxy REST integrato per Home Assistant (bypass CORS).

- **Interfaccia Web**:
  - Dashboard interattiva HTML/JS/CSS.
  - Gestione clienti, strumenti, riparazioni e magazzino legni.
  - Visualizzazione dati meteo ed ambientali.

## Avvio Rapido

### Prerequisiti
- Python 3.x
- `paho-mqtt` (opzionale, per supporto MQTT avanzato)

### Esecuzione
È possibile avviare il server locale tramite il file batch:
```cmd
avvia_gestionale.bat
```
oppure eseguendo direttamente lo script Python:
```bash
python server.py
```
Il gestionale sarà accessibile su `http://localhost:8080`.
