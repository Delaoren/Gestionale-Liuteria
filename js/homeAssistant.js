/**
 * Atelier Liuteria - Home Assistant Local Integration Service
 * Real-time Temperature (T) and Humidity (H) monitoring for workshop & tonewood preservation
 * Supports both direct browser fetch and local proxy (server.py) to eliminate CORS restrictions
 */

class HomeAssistantService {
    constructor() {
        this.status = 'disconnected'; // 'disconnected' | 'connecting' | 'connected' | 'error' | 'simulated'
        this.lastError = null;
        this.pollTimer = null;
        this.discoveredSensors = { tempSensors: [], humiditySensors: [] };
        this.history = [];
        
        // Default telemetry values (optimal for lutherie: ~21.8°C and ~47.5% RH, EMC ~8.8%)
        this.lastReadings = {
            temp: 24.3,
            tempUnit: '°C',
            tempName: 'Sensore Temperatura',
            humidity: 61.3,
            humidityUnit: '% RH',
            humidityName: 'Sensore Umidità',
            emc: 11.2,
            emcUnit: '%',
            emcName: 'EMC Legno',
            lastUpdate: new Date(),
            isSimulated: false,
            evaluation: this.evaluateClimate(24.3, 61.3)
        };
    }

    getConfig() {
        if (window.atelierDB && window.atelierDB.data && window.atelierDB.data.settings && window.atelierDB.data.settings.homeAssistant) {
            return window.atelierDB.data.settings.homeAssistant;
        }
        return {
            enabled: true,
            sourceType: "mqtt", // "mqtt" or "ha"
            mqttBroker: "192.168.68.108",
            mqttPort: 1883,
            mqttTopic: "",
            host: "http://192.168.68.108:8123",
            token: "",
            tempEntityId: "sensor.temperatura_laboratorio",
            humidityEntityId: "sensor.umidita_laboratorio",
            pollingInterval: 10,
            status: "ready",
            useSimulationFallback: true
        };
    }

    init() {
        const config = this.getConfig();
        if (config.enabled) {
            this.startPolling();
        } else {
            this.status = 'disconnected';
            this.updateUI();
        }
    }

    startPolling() {
        this.stopPolling();
        // Initial fetch immediately
        this.fetchTelemetry();

        const config = this.getConfig();
        const intervalSec = Math.max(5, parseInt(config.pollingInterval, 10) || 30);
        this.pollTimer = setInterval(() => {
            this.fetchTelemetry();
        }, intervalSec * 1000);
    }

    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }

    /**
     * Unified API Request Method (supports Local Python Proxy to bypass CORS, and direct fetch)
     */
    async makeRequest(endpoint, targetHost, targetToken) {
        const cleanHost = (targetHost || this.getConfig().host || '').trim().replace(/\/$/, '');
        const authToken = targetToken !== undefined ? targetToken : (this.getConfig().token || '');
        const targetUrl = `${cleanHost}${endpoint}`;

        // 1. Check if running on local Python server (http://localhost:8080)
        const isLocalServer = window.location.protocol.startsWith('http') && 
                              (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        if (isLocalServer) {
            try {
                const proxyRes = await fetch('/api/ha-proxy', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url: targetUrl, token: authToken })
                });

                if (proxyRes.ok) {
                    return await proxyRes.json();
                } else if (proxyRes.status === 401) {
                    throw new Error("Errore 401: Token Home Assistant non autorizzato o non valido.");
                } else if (proxyRes.status === 404) {
                    throw new Error(`Errore 404: Risorsa non trovata in Home Assistant (${endpoint})`);
                }
            } catch (proxyErr) {
                if (proxyErr.message && proxyErr.message.includes('401')) throw proxyErr;
                // If local proxy network error, continue to direct fetch
            }
        }

        // 2. Direct browser fetch
        const headers = { 'Content-Type': 'application/json' };
        if (authToken && authToken.trim()) {
            headers['Authorization'] = `Bearer ${authToken.trim()}`;
        }

        try {
            const res = await fetch(targetUrl, {
                method: 'GET',
                headers: headers,
                mode: 'cors'
            });

            if (res.status === 401) {
                throw new Error("Errore 401: Token di accesso non autorizzato o scaduto.");
            }
            if (!res.ok) {
                throw new Error(`Errore HTTP ${res.status}: ${res.statusText}`);
            }
            return await res.json();
        } catch (fetchErr) {
            if (fetchErr.message && (fetchErr.message.includes('fetch') || fetchErr.name === 'TypeError')) {
                let diagnostic = `Impossibile raggiungere ${cleanHost} (Failed to fetch).`;
                if (cleanHost.includes('homeassistant.local')) {
                    diagnostic += `\n\n📌 ATTENZIONE: Su Windows l'host "homeassistant.local" spesso NON viene risolto dal DNS di sistema. Usa l'indirizzo IP numerico (es. http://192.168.68.xxx:8123).`;
                }
                diagnostic += `\n\n💡 COME RISOLVERE SUBITO IL BLOCCO CORS:\n1. Avvia il gestionale con "avvia_gestionale.bat" nella cartella del programma per usare il proxy locale (nessun blocco CORS).\n2. Oppure in configuration.yaml di Home Assistant aggiungi:\nhttp:\n  cors_allowed_origins:\n    - "*"`;
                throw new Error(diagnostic);
            }
            throw fetchErr;
        }
    }

    /**
     * Test connection to Home Assistant API
     */
    async testConnection(host, token) {
        const cleanHost = (host || '').trim().replace(/\/$/, '');
        if (!cleanHost) {
            return { success: false, message: 'Specificare l\'indirizzo IP o host di Home Assistant.' };
        }

        try {
            const data = await this.makeRequest('/api/', cleanHost, token);
            return { 
                success: true, 
                message: `Connessione riuscita! API Home Assistant attiva: "${data.message || 'Running'}"` 
            };
        } catch (err) {
            return { 
                success: false, 
                message: err.message 
            };
        }
    }

    /**
     * Auto-discover Temperature and Humidity sensors from Home Assistant
     */
    async discoverSensors(host, token) {
        const cleanHost = (host || this.getConfig().host).trim().replace(/\/$/, '');
        const authToken = token !== undefined ? token : this.getConfig().token;

        try {
            const states = await this.makeRequest('/api/states', cleanHost, authToken);
            
            const tempSensors = states.filter(s => {
                const entityId = s.entity_id.toLowerCase();
                const unit = (s.attributes && s.attributes.unit_of_measurement) ? s.attributes.unit_of_measurement.toLowerCase() : '';
                const deviceClass = (s.attributes && s.attributes.device_class) || '';
                const friendly = (s.attributes && s.attributes.friendly_name) ? s.attributes.friendly_name.toLowerCase() : '';

                return entityId.startsWith('sensor.') && (
                    deviceClass === 'temperature' ||
                    unit.includes('°c') || unit.includes('°f') ||
                    entityId.includes('temperature') || entityId.includes('temp') ||
                    friendly.includes('temperatura') || friendly.includes('temp')
                );
            });

            const humiditySensors = states.filter(s => {
                const entityId = s.entity_id.toLowerCase();
                const unit = (s.attributes && s.attributes.unit_of_measurement) ? s.attributes.unit_of_measurement : '';
                const deviceClass = (s.attributes && s.attributes.device_class) || '';
                const friendly = (s.attributes && s.attributes.friendly_name) ? s.attributes.friendly_name.toLowerCase() : '';

                return entityId.startsWith('sensor.') && (
                    deviceClass === 'humidity' ||
                    (unit === '%' && !entityId.includes('battery') && !friendly.includes('batteria')) ||
                    entityId.includes('humidity') || entityId.includes('umid') ||
                    friendly.includes('umidità') || friendly.includes('humidity')
                );
            });

            this.discoveredSensors = { tempSensors, humiditySensors };
            return { success: true, tempSensors, humiditySensors };
        } catch (err) {
            return { success: false, message: err.message, tempSensors: [], humiditySensors: [] };
        }
    }

    /**
     * Fetch live readings from configured sensors (MQTT Broker or Home Assistant)
     */
    async fetchTelemetry() {
        const config = this.getConfig();
        if (!config.enabled) return;

        // 1. PRIMARY: Query MQTT Telemetry from local server bridge (192.168.68.108:1883)
        if (config.sourceType !== 'ha') {
            try {
                const res = await fetch('/api/telemetry');
                if (res.ok) {
                    const data = await res.json();
                    if (data && (data.status === 'connected' || data.source === 'mqtt')) {
                        const tempVal = parseFloat(data.temp);
                        const humVal = parseFloat(data.humidity);
                        if (!isNaN(tempVal) && !isNaN(humVal)) {
                            this.status = 'connected';
                            this.lastError = null;

                            const emcVal = (data.emc !== undefined && data.emc !== null) ? parseFloat(data.emc) : this.calculateEMC(tempVal, humVal);
                            const emcEval = this.evaluateEMC(emcVal);
                            const deviceLabel = data.source === 'm5stack'
                                ? (data.device || 'M5Stack STAMPLC')
                                : (data.topic ? `MQTT (${data.topic})` : `Broker MQTT`);

                            this.lastReadings = {
                                temp: Math.round(tempVal * 10) / 10,
                                tempUnit: '°C',
                                tempName: deviceLabel,
                                humidity: Math.round(humVal * 10) / 10,
                                humidityUnit: '% RH',
                                humidityName: deviceLabel,
                                emc: emcVal,
                                emcUnit: '%',
                                emcName: 'EMC Legno',
                                emcEvaluation: emcEval,
                                lastUpdate: data.lastUpdate ? new Date(data.lastUpdate) : new Date(),
                                isSimulated: data.source === 'simulated',
                                source: data.source || 'mqtt',
                                device: data.device || 'M5Stack STAMPLC',
                                sensors: data.sensors,
                                topic: data.topic,
                                broker: data.broker,
                                evaluation: this.evaluateClimate(tempVal, humVal)
                            };

                            this.recordHistory(this.lastReadings.temp, this.lastReadings.humidity, 'connected', emcVal);
                            this.syncWithAtelierDB(this.lastReadings.temp, this.lastReadings.humidity, emcVal);
                            this.updateUI();
                            return;
                        }
                    }
                }
            } catch (mqttErr) {
                // If local server is not running, proceed to fallback/HA check
            }
        }

        // 2. SECONDARY: Query Home Assistant REST API
        const host = (config.host || '').trim().replace(/\/$/, '');
        const token = (config.token || '').trim();
        const tempEntity = (config.tempEntityId || '').trim();
        const humEntity = (config.humidityEntityId || '').trim();

        if (config.sourceType === 'ha' && host && token && tempEntity && humEntity) {
            this.status = 'connecting';
            this.updateHeaderTicker();

            try {
                const [tempData, humData] = await Promise.all([
                    this.makeRequest(`/api/states/${tempEntity}`, host, token),
                    this.makeRequest(`/api/states/${humEntity}`, host, token)
                ]);

                let tempVal = parseFloat(tempData.state);
                let humVal = parseFloat(humData.state);

                if (isNaN(tempVal) || isNaN(humVal)) {
                    throw new Error(`Dati sensore non numerici (T: "${tempData.state}", H: "${humData.state}")`);
                }

                if (tempData.attributes && tempData.attributes.unit_of_measurement === '°F') {
                    tempVal = (tempVal - 32) * (5 / 9);
                }

                tempVal = Math.round(tempVal * 10) / 10;
                humVal = Math.round(humVal * 10) / 10;
                const emcVal = this.calculateEMC(tempVal, humVal);
                const emcEval = this.evaluateEMC(emcVal);

                this.status = 'connected';
                this.lastError = null;

                this.lastReadings = {
                    temp: tempVal,
                    tempUnit: '°C',
                    tempName: (tempData.attributes && tempData.attributes.friendly_name) || tempEntity,
                    humidity: humVal,
                    humidityUnit: '% RH',
                    humidityName: (humData.attributes && humData.attributes.friendly_name) || humEntity,
                    emc: emcVal,
                    emcUnit: '%',
                    emcName: 'EMC Legno',
                    emcEvaluation: emcEval,
                    lastUpdate: new Date(),
                    isSimulated: false,
                    source: 'ha',
                    evaluation: this.evaluateClimate(tempVal, humVal)
                };

                this.recordHistory(tempVal, humVal, 'connected', emcVal);
                this.syncWithAtelierDB(tempVal, humVal, emcVal);
                this.updateUI();
                return;

            } catch (err) {
                console.warn('[Home Assistant Integration] Fetch error:', err);
                this.lastError = err.message;
                this.handleFallback(`Home Assistant non raggiungibile (${err.message})`);
                return;
            }
        }

        // 3. Fallback when neither MQTT bridge nor HA is responding
        this.handleFallback("In attesa di dati dal sensore di bottega o da Home Assistant.");
    }

    /**
     * Fallback to realistic simulation if offline
     */
    handleFallback(reason) {
        const config = this.getConfig();
        if (config.useSimulationFallback !== false) {
            this.status = 'simulated';
            this.lastError = reason;

            // Generate subtle realistic drift around 21.8°C and 47.5% RH
            const currentTemp = this.lastReadings.temp || 24.3;
            const currentHum = this.lastReadings.humidity || 61.3;
            
            // Random tiny variation: ±0.1°C and ±0.2% RH
            const tempDelta = (Math.random() - 0.5) * 0.2;
            const humDelta = (Math.random() - 0.5) * 0.4;
            
            let simulatedTemp = Math.round((currentTemp + tempDelta) * 10) / 10;
            let simulatedHum = Math.round((currentHum + humDelta) * 10) / 10;

            // Clamp within realistic workshop boundaries
            simulatedTemp = Math.max(18.0, Math.min(27.0, simulatedTemp));
            simulatedHum = Math.max(40.0, Math.min(70.0, simulatedHum));
            const emcVal = this.calculateEMC(simulatedTemp, simulatedHum);
            const emcEval = this.evaluateEMC(emcVal);

            this.lastReadings = {
                temp: simulatedTemp,
                tempUnit: '°C',
                tempName: config.tempEntityId || 'Sensore Laboratorio (Simulato)',
                humidity: simulatedHum,
                humidityUnit: '% RH',
                humidityName: config.humidityEntityId || 'Sensore Igrometro (Simulato)',
                emc: emcVal,
                emcUnit: '%',
                emcName: 'EMC Legno (Simulato)',
                emcEvaluation: emcEval,
                lastUpdate: new Date(),
                isSimulated: true,
                evaluation: this.evaluateClimate(simulatedTemp, simulatedHum)
            };

            this.recordHistory(simulatedTemp, simulatedHum, 'simulated', emcVal);
            this.syncWithAtelierDB(simulatedTemp, simulatedHum, emcVal);
        } else {
            this.status = 'error';
        }
        this.updateUI();
    }

    /**
     * Record telemetry reading in history
     */
    recordHistory(temp, humidity, status, emc) {
        const emcVal = emc !== undefined ? emc : this.calculateEMC(temp, humidity);
        this.history.unshift({
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            temp,
            humidity,
            emc: emcVal,
            status,
            evaluation: this.evaluateClimate(temp, humidity)
        });
        if (this.history.length > 20) {
            this.history.pop();
        }
    }

    /**
     * Sync with local database
     */
    syncWithAtelierDB(temp, humidity, emc) {
        if (window.atelierDB && window.atelierDB.data && window.atelierDB.data.settings) {
            window.atelierDB.data.settings.workshopTemp = temp;
            window.atelierDB.data.settings.workshopHumidity = humidity;
            if (emc !== undefined) {
                window.atelierDB.data.settings.workshopEmc = emc;
            }
            window.atelierDB.data.settings.lastSync = new Date().toISOString();
            window.atelierDB.saveData();
        }
    }

    /**
     * Calculate Equilibrium Moisture Content (EMC / UMC) for Tonewood
     * USDA Forest Products Laboratory formula (Simpson / Hailwood-Horrobin)
     * Target for high-resonance Spruce (Abete della Val di Fiemme) and Maple (Acero): 8.0% - 9.5%
     */
    calculateEMC(tempC, humPct) {
        try {
            const tc = parseFloat(tempC) || 20.0;
            const rh = parseFloat(humPct) || 50.0;
            const h = Math.max(0.01, Math.min(0.99, rh / 100.0));
            const tf = tc * 1.8 + 32.0;
            const w = 330.0 + 0.452 * tf + 0.00415 * (tf * tf);
            const k = 0.791 + 0.000463 * tf - 0.000000844 * (tf * tf);
            const k1 = 6.34 + 0.000775 * tf - 0.0000935 * (tf * tf);
            const k2 = 1.09 + 0.0171 * tf - 0.0000905 * (tf * tf);
            const kh = k * h;
            const term1 = kh / (1.0 - kh);
            const term2 = (k1 * kh + 2.0 * k1 * k2 * kh * kh) / (1.0 + k1 * kh + k1 * k2 * kh * kh);
            const emc = (1800.0 / w) * (term1 + term2);
            return Math.round(emc * 10) / 10;
        } catch (e) {
            return 9.0;
        }
    }

    /**
     * Lutherie evaluation for Wood Equilibrium Moisture Content (EMC)
     * Optimal target for soundboard, ribs, and hide-glue: 8.0% - 9.8%
     */
    evaluateEMC(emc) {
        const val = parseFloat(emc) || 9.0;
        if (val < 6.5) {
            return {
                status: 'danger',
                statusLabel: 'Critico Secco',
                badgeClass: 'badge-danger',
                badgeColor: '#f43f5e',
                title: 'EMC Troppo Basso (< 6.5%)',
                description: 'Legno disidratato: altissimo rischio di crepe da ritiro su tavola armonica e scollatura catene.'
            };
        } else if (val < 8.0) {
            return {
                status: 'warning',
                statusLabel: 'Secco',
                badgeClass: 'badge-warning',
                badgeColor: '#f59e0b',
                title: 'EMC Basso (6.5% - 7.9%)',
                description: 'Legno asciutto. Attenzione alle lavorazioni di giunzione e piegatura fasce.'
            };
        } else if (val <= 9.8) {
            return {
                status: 'optimal',
                statusLabel: 'Equilibrio Perfetto',
                badgeClass: 'badge-success',
                badgeColor: 'var(--accent-emerald)',
                title: 'EMC Ottimale (8.0% - 9.8%)',
                description: 'Condizioni ideali di stagionatura e risonanza per Abete e Acero. Massima stabilità dimensionale.'
            };
        } else if (val <= 11.5) {
            return {
                status: 'warning',
                statusLabel: 'Umidità Moderata',
                badgeClass: 'badge-warning',
                badgeColor: '#f59e0b',
                title: 'EMC Sopra la Norma (9.9% - 11.5%)',
                description: 'Il legno assorbe umidità ambientale. Evitare chiusura cassa e incollaggio catene finché non si stabilizza.'
            };
        } else {
            return {
                status: 'danger',
                statusLabel: 'Critico Umido',
                badgeClass: 'badge-danger',
                badgeColor: '#f43f5e',
                title: 'EMC Troppo Elevato (> 11.5%)',
                description: 'Dilatazione delle fibre, smorzamento acustico delle frequenze di risonanza e pericolo di muffe o distacco colla animale.'
            };
        }
    }

    /**
     * Lutherie Climate Safety Evaluation
     * High acoustic resonance woods (Spruce & Maple) must be kept strictly at 45% - 55% RH
     */
    evaluateClimate(temp, humidity) {
        let status = 'optimal';
        let badgeClass = 'badge-success';
        let title = 'Condizioni Ottimali per Liuteria';
        let description = 'Umidità e temperatura ideali per legni da risonanza, incollaggio a caldo e verniciatura.';

        if (humidity < 40.0) {
            status = 'danger';
            badgeClass = 'badge-danger';
            title = '⚠️ PERICOLO: Umidità Troppo Bassa (<40% RH)';
            description = 'Rischio fessurazioni e spaccature su tavole armoniche in abete e fondo in acero. Accendere subito umidificatore atelier!';
        } else if (humidity < 45.0) {
            status = 'warning';
            badgeClass = 'badge-warning';
            title = 'Attenzione: Umidità Leggermente Bassa';
            description = 'Umidità sotto la soglia ideale del 45%. Monitorare i legni aperti sui banchi di lavoro.';
        } else if (humidity > 60.0) {
            status = 'danger';
            badgeClass = 'badge-danger';
            title = '⚠️ PERICOLO: Umidità Troppo Elevata (>60% RH)';
            description = 'Rischio dilatazione dei legni, rallentamento essiccazione vernici ad olio e cedimento colla di pelle animale.';
        } else if (humidity > 55.0) {
            status = 'warning';
            badgeClass = 'badge-warning';
            title = 'Attenzione: Umidità Leggermente Elevata';
            description = 'Umidità oltre il 55%. Arieggiare il laboratorio o attivare deumidificatore.';
        }

        // Temperature evaluation
        let tempNote = 'Temp ottimale (18°C - 24°C)';
        if (temp < 18.0) {
            tempNote = 'Temperatura bassa: la colla a caldo gelatinizza troppo rapidamente!';
            if (status === 'optimal') {
                status = 'warning';
                badgeClass = 'badge-warning';
            }
        } else if (temp > 26.0) {
            tempNote = 'Temperatura elevata: solventi vernici evaporano velocemente.';
        }

        return {
            status,
            badgeClass,
            title,
            description,
            tempNote,
            isSafe: status === 'optimal'
        };
    }

    /**
     * Save configuration changes from UI modal
     */
    saveConfig(newConfig) {
        if (!window.atelierDB || !window.atelierDB.data || !window.atelierDB.data.settings) return;

        window.atelierDB.data.settings.homeAssistant = {
            ...this.getConfig(),
            ...newConfig
        };
        window.atelierDB.saveData();

        this.startPolling();
        this.fetchTelemetry();
    }

    /**
     * Update all UI elements observing telemetry
     */
    updateUI() {
        this.updateHeaderTicker();
        
        // Update Laboratorio module if currently open
        if (window.appController && window.appController.activeModuleId === 'laboratorio') {
            const container = document.getElementById("moduleContentContainer");
            if (container && window.AppModules && window.AppModules.renderLaboratorio) {
                window.AppModules.renderLaboratorio(container);
            }
        }

        // Update Magazzino Legno climate alert if open
        if (window.appController && window.appController.activeModuleId === 'magazzinoLegno') {
            const container = document.getElementById("moduleContentContainer");
            if (container && window.AppModules && window.AppModules.renderMagazzinoLegno) {
                window.AppModules.renderMagazzinoLegno(container);
            }
        }
    }

    /**
     * Update the Live Header Ticker in the top bar
     */
    updateHeaderTicker() {
        const statusDot = document.getElementById("haStatusDot");
        const statusText = document.getElementById("haStatusText");
        const tempText = document.getElementById("haTempText");
        const humidityText = document.getElementById("haHumidityText");
        const emcText = document.getElementById("haEmcText");
        const haBadge = document.getElementById("haStatusBadge");

        const readings = this.lastReadings;

        if (tempText) {
            tempText.innerHTML = `${readings.temp.toFixed(1)} °C`;
        }

        if (humidityText) {
            const evalObj = readings.evaluation || this.evaluateClimate(readings.temp, readings.humidity);
            let note = evalObj.status === 'optimal' ? '(Ottimale Legni)' : '(Attenzione RH)';
            humidityText.innerHTML = `${readings.humidity.toFixed(1)}% RH <small style="font-size:0.75rem; color:var(--text-secondary);">${note}</small>`;
        }

        if (emcText) {
            const emcVal = (readings.emc !== undefined && readings.emc !== null) ? readings.emc : this.calculateEMC(readings.temp, readings.humidity);
            const emcEval = readings.emcEvaluation || this.evaluateEMC(emcVal);
            emcText.innerHTML = `${emcVal.toFixed(1)}% <small style="font-size:0.75rem; color:${emcEval.badgeColor || 'var(--text-secondary)'};">(${emcEval.statusLabel || 'Equilibrio'})</small>`;
        }

        if (statusDot) {
            statusDot.className = 'status-dot';
            if (this.status === 'connected') {
                statusDot.style.backgroundColor = 'var(--accent-emerald)';
                statusDot.style.boxShadow = '0 0 10px var(--accent-emerald)';
            } else if (this.status === 'simulated') {
                statusDot.style.backgroundColor = 'var(--accent-gold)';
                statusDot.style.boxShadow = '0 0 10px var(--accent-gold)';
            } else if (this.status === 'connecting') {
                statusDot.style.backgroundColor = 'var(--accent-cyan)';
                statusDot.style.boxShadow = '0 0 10px var(--accent-cyan)';
            } else {
                statusDot.style.backgroundColor = '#f43f5e';
                statusDot.style.boxShadow = '0 0 10px #f43f5e';
            }
        }

        if (statusText) {
            if (this.status === 'connected') {
                statusText.innerHTML = 'Sensore Bottega: <strong style="color:var(--accent-emerald);">Online</strong>';
            } else if (this.status === 'simulated') {
                statusText.innerHTML = 'Sensore Bottega: <strong style="color:var(--accent-gold);">Demo Telemetria</strong>';
            } else if (this.status === 'connecting') {
                statusText.innerHTML = 'Sensore Bottega: <strong style="color:var(--accent-cyan);">Sincronizzazione...</strong>';
            } else {
                statusText.innerHTML = 'Sensore Bottega: <strong style="color:#f43f5e;">Disconnesso</strong>';
            }
        }

        if (haBadge) {
            if (this.status === 'connected') {
                haBadge.className = 'badge badge-success';
                haBadge.innerHTML = '<i data-lucide="radio"></i> Sensore Attivo';
            } else if (this.status === 'simulated') {
                haBadge.className = 'badge badge-warning';
                haBadge.innerHTML = '<i data-lucide="activity"></i> Demo Telemetria';
            } else {
                haBadge.className = 'badge badge-danger';
                haBadge.innerHTML = '<i data-lucide="wifi-off"></i> Offline';
            }
        }

        if (window.appController && window.appController.setupLucideIcons) {
            window.appController.setupLucideIcons();
        }
    }

    /**
     * Get recent topics received on the local MQTT broker
     */
    async getMqttTopics() {
        try {
            const res = await fetch('/api/mqtt/topics');
            if (res.ok) return await res.json();
        } catch (e) {}
        return { status: 'offline', topics: [] };
    }

    /**
     * Publish a test measurement to MQTT broker
     */
    async sendMqttTest(topic, temp, hum) {
        try {
            const res = await fetch('/api/mqtt/test-publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, temp, humidity: hum })
            });
            if (res.ok) return await res.json();
            return { success: false, error: `HTTP ${res.status}` };
        } catch (e) {
            return { success: false, error: e.message };
        }
    }

    /**
     * Update runtime MQTT settings
     */
    async saveMqttConfig(broker, port, topic) {
        try {
            const res = await fetch('/api/mqtt/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ broker, port, topic })
            });
            if (res.ok) return await res.json();
        } catch (e) {}
        return { success: false };
    }
}

window.haService = new HomeAssistantService();
