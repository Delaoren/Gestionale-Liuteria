/**
 * Renderers for all 13 Apps in Atelier Liuteria
 */

window.AppModules = {

    // 1. Biblioteca
    renderBiblioteca: function(container) {
        const items = window.atelierDB.data.biblioteca || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-book-open" style="color: var(--accent-blue);"></i>
                        Biblioteca & Documentazione Tecnica (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('biblioteca')">
                        <i class="lucide-plus"></i> Aggiungi Documento
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
                                <span class="badge badge-info">${item.categoria}</span>
                                <span style="font-size:0.8rem; color:var(--text-muted);">${item.anno} • ${item.pagine} pag.</span>
                            </div>
                            <h4 style="font-family:var(--font-heading); color:#fff; font-size:1.1rem; margin-bottom:0.5rem;">${item.titolo}</h4>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.8rem;"><strong>Autore:</strong> ${item.autore}</p>
                            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem; font-style:italic;">"${item.note}"</p>
                            <div style="display:flex; flex-wrap:wrap; gap:0.4rem; margin-bottom:1rem;">
                                ${item.tags ? item.tags.map(t => `<span style="background:rgba(255,255,255,0.06); font-size:0.7rem; padding:0.2rem 0.5rem; border-radius:4px; color:var(--accent-gold);">${t}</span>`).join('') : ''}
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
                                <span class="badge badge-purple">${item.formato}</span>
                                <div style="display:flex; gap:0.4rem;">
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Apertura anteprima documentale per: ${item.titolo}')">
                                        <i class="lucide-file-text"></i> Leggi PDF
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('biblioteca', '${item.id}', '${item.titolo}')" title="Elimina documento">
                                        <i class="lucide-trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 2. Calendario appuntamenti
    renderCalendarioAppuntamenti: function(container) {
        const items = window.atelierDB.data.calendarioAppuntamenti || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-calendar-days" style="color: var(--accent-violet);"></i>
                        Calendario Appuntamenti & Visite Cliente
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('calendarioAppuntamenti')">
                        <i class="lucide-plus"></i> Nuovo Appuntamento
                    </button>
                </div>
                <div class="custom-table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Data & Ora</th>
                                <th>Cliente</th>
                                <th>Tipo Incontro</th>
                                <th>Strumento Riferimento</th>
                                <th>Stato</th>
                                <th>Note Atelier</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>
                                        <strong style="color:var(--accent-gold);">${item.data}</strong><br>
                                        <small style="color:var(--text-muted);">${item.ora}</small>
                                    </td>
                                    <td><strong>${item.cliente}</strong></td>
                                    <td><span class="badge badge-purple">${item.tipo}</span></td>
                                    <td>${item.strumento}</td>
                                    <td>
                                        <span class="badge ${item.stato === 'Confermato' ? 'badge-success' : 'badge-warning'}">${item.stato}</span>
                                    </td>
                                    <td style="font-size:0.85rem; color:var(--text-secondary);">${item.note}</td>
                                    <td>
                                        <div style="display:flex; gap:0.4rem;">
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Appuntamento confermato con sms/email a ${item.cliente}')" title="Notifica cliente">
                                                <i class="lucide-bell"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('calendarioAppuntamenti', '${item.id}', '${item.cliente}')" title="Elimina appuntamento">
                                                <i class="lucide-trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 3. Calendario Lavorazioni
    renderCalendarioLavorazioni: function(container) {
        const items = window.atelierDB.data.calendarioLavorazioni || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-clock" style="color: #ec4899;"></i>
                        Calendario & Tempistiche Lavorazioni
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('calendarioLavorazioni')">
                        <i class="lucide-plus"></i> Pianifica Lavorazione
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <span class="badge ${item.priorita === 'Urgentissima' ? 'badge-danger' : 'badge-warning'}">${item.priorita}</span>
                                <span style="font-size:0.8rem; color:var(--text-muted);">${item.inizio} al ${item.fine}</span>
                            </div>
                            <h4 style="font-family:var(--font-heading); color:#fff; margin-bottom:0.4rem;">${item.titolo}</h4>
                            <p style="font-size:0.85rem; color:var(--accent-gold); margin-bottom:0.4rem;"><i class="lucide-disc"></i> ${item.strumento}</p>
                            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:1rem;">Fase: <strong>${item.fase}</strong> | Resp: ${item.responsabile}</p>
                            
                            <div style="margin-bottom:0.5rem; display:flex; justify-content:space-between; font-size:0.8rem;">
                                <span>Avanzamento Stage</span>
                                <strong style="color:var(--accent-gold);">${item.progresso}%</strong>
                            </div>
                            <div class="progress-bar-bg" style="margin-bottom:0.8rem;">
                                <div class="progress-bar-fill" style="width: ${item.progresso}%;"></div>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.quickUpdateProgress('calendarioLavorazioni', '${item.id}', 10, '${item.titolo}')" title="Avanza progresso +10%">
                                    <i class="lucide-trending-up"></i> +10% Progresso
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('calendarioLavorazioni', '${item.id}', '${item.titolo}')" title="Elimina lavorazione">
                                    <i class="lucide-trash-2"></i> Elimina
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 4. Clienti
    renderClienti: function(container) {
        const items = window.atelierDB.data.clienti || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-users" style="color: var(--accent-emerald);"></i>
                        Anagrafica Clienti & Musicisti (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('clienti')">
                        <i class="lucide-user-plus"></i> Nuovo Cliente
                    </button>
                </div>
                <div class="custom-table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Nome & Ruolo</th>
                                <th>Contatti</th>
                                <th>Città</th>
                                <th>Strumenti Assegnati</th>
                                <th>Storico Spesa</th>
                                <th>Note Atelier</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>
                                        <strong style="color:#fff; font-size:0.95rem;">${item.nome}</strong><br>
                                        <small style="color:var(--text-muted);">${item.ruolo}</small>
                                    </td>
                                    <td style="font-size:0.85rem;">
                                        <i class="lucide-mail"></i> ${item.email}<br>
                                        <i class="lucide-phone"></i> ${item.telefono}
                                    </td>
                                    <td>${item.citta}</td>
                                    <td>
                                        ${(item.strumentiPosseduti || []).map(s => `<span class="badge badge-info" style="margin:2px 0;">${s}</span>`).join('<br>')}
                                    </td>
                                    <td><strong style="color:var(--accent-gold); font-size:1rem;">€ ${item.spesaTotale.toLocaleString()}</strong></td>
                                    <td style="font-size:0.82rem; color:var(--text-secondary); max-width:200px;">${item.note}</td>
                                    <td>
                                        <div style="display:flex; gap:0.4rem;">
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Scheda cliente aperta per ${item.nome}')">
                                                <i class="lucide-external-link"></i> Dettagli
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('clienti', '${item.id}', '${item.nome}')" title="Elimina cliente">
                                                <i class="lucide-trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 5. Costruzione
    renderCostruzione: function(container) {
        const items = window.atelierDB.data.costruzione || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-hammer" style="color: var(--accent-amber);"></i>
                        Registro Costruzione Nuovi Strumenti
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('costruzione')">
                        <i class="lucide-plus"></i> Avvia Nuovo Opus
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.8rem;">
                                <span class="badge badge-warning" style="font-size:0.85rem; font-weight:700;">${item.opNumero}</span>
                                <span class="badge badge-success">${item.faseAttuale}</span>
                            </div>
                            <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.2rem; margin-bottom:0.4rem;">${item.modello}</h3>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.8rem;">Committente: <strong style="color:var(--accent-gold);">${item.committente}</strong></p>
                            
                            <div style="background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:8px; font-size:0.8rem; margin-bottom:0.8rem; border:1px solid rgba(255,255,255,0.05);">
                                <div>🌲 <strong>Tavola:</strong> ${item.legnoTavola}</div>
                                <div style="margin-top:0.3rem;">🍁 <strong>Fondo:</strong> ${item.legnoFondo}</div>
                                <div style="margin-top:0.3rem;">🔊 <strong>Nota Risonanza:</strong> ${item.frequenzaTavola} | ⚖️ ${item.pesoTavola}</div>
                            </div>

                            <div style="display:flex; justify-content:space-between; font-size:0.78rem; color:var(--text-muted); margin-bottom:0.8rem;">
                                <span>📅 Inizio: <strong style="color:var(--text-primary);">${item.dataInizio || 'N/D'}</strong></span>
                                <span>🏁 Consegna: <strong style="color:var(--text-primary);">${item.consegnaPrevista || 'N/D'}</strong></span>
                            </div>

                            ${item.note ? `
                                <div style="background:rgba(245, 158, 11, 0.08); border-left:3px solid var(--accent-amber); padding:0.5rem 0.7rem; border-radius:4px; font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.8rem; font-style:italic;">
                                    📝 ${item.note}
                                </div>
                            ` : ''}

                            <div style="margin-bottom:0.4rem; display:flex; justify-content:space-between; font-size:0.8rem;">
                                <span>Stato Avanzamento Lavoro</span>
                                <strong style="color:var(--accent-gold);">${item.progresso}%</strong>
                            </div>
                            <div class="progress-bar-bg" style="margin-bottom:0.8rem;">
                                <div class="progress-bar-fill" style="width: ${item.progresso}%;"></div>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.quickUpdateCostruzione('${item.id}', 10)" title="Avanza progresso di +10%">
                                    <i class="lucide-trending-up"></i> +10% Progresso
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteCostruzioneItem('${item.id}', '${item.opNumero}')" title="Rimuovi strumento">
                                    <i class="lucide-trash-2"></i> Elimina
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 6. Gestione contabilità
    renderGestioneContabilita: function(container) {
        const items = window.atelierDB.data.gestioneContabilita || [];
        const totaleIncassato = items.filter(i => i.stato === 'Pagata').reduce((acc, i) => acc + i.importo, 0);
        const totaleInSospeso = items.filter(i => i.stato === 'In Sospeso').reduce((acc, i) => acc + i.importo, 0);

        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-receipt" style="color: var(--accent-cyan);"></i>
                        Gestione Contabilità & Fatturazione
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('gestioneContabilita')">
                        <i class="lucide-file-plus"></i> Nuova Fattura
                    </button>
                </div>

                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                    <div style="background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16,185,129,0.3); padding:1rem; border-radius:12px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); uppercase;">Incassato Pagato</span>
                        <h3 style="font-family:var(--font-heading); color:var(--accent-emerald); font-size:1.6rem; margin-top:0.2rem;">€ ${totaleIncassato.toLocaleString()}</h3>
                    </div>
                    <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245,158,11,0.3); padding:1rem; border-radius:12px;">
                        <span style="font-size:0.8rem; color:var(--text-secondary); uppercase;">In Sospeso / Crediti</span>
                        <h3 style="font-family:var(--font-heading); color:var(--accent-gold); font-size:1.6rem; margin-top:0.2rem;">€ ${totaleInSospeso.toLocaleString()}</h3>
                    </div>
                </div>

                <div class="custom-table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>N° Fattura</th>
                                <th>Cliente</th>
                                <th>Causale Lavoro</th>
                                <th>Importo</th>
                                <th>Data / Scadenza</th>
                                <th>Stato</th>
                                <th>Metodo</th>
                                <th>Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td><strong style="color:var(--accent-gold);">${item.numero}</strong></td>
                                    <td>${item.cliente}</td>
                                    <td style="font-size:0.85rem; color:var(--text-secondary);">${item.causale}</td>
                                    <td><strong style="font-size:1rem; color:#fff;">€ ${item.importo.toLocaleString()}</strong></td>
                                    <td style="font-size:0.8rem;">Emessa: ${item.data}<br>Scad: ${item.scadenza}</td>
                                    <td>
                                        <span class="badge ${item.stato === 'Pagata' ? 'badge-success' : 'badge-warning'}">${item.stato}</span>
                                    </td>
                                    <td style="font-size:0.85rem; color:var(--text-muted);">${item.metodo}</td>
                                    <td>
                                        <div style="display:flex; gap:0.4rem;">
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Download PDF Fattura ${item.numero}')" title="Scarica PDF">
                                                <i class="lucide-download"></i> PDF
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('gestioneContabilita', '${item.id}', '${item.numero}')" title="Elimina fattura">
                                                <i class="lucide-trash-2"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 7. Laboratorio
    renderLaboratorio: function(container) {
        const items = window.atelierDB.data.laboratorio || [];
        const ha = window.haService || { 
            status: 'connected', 
            lastReadings: { temp: 24.3, humidity: 61.3, emc: 11.2, lastUpdate: new Date(), isSimulated: false, evaluation: { status: 'optimal', badgeClass: 'badge-success', title: 'Condizioni Ottimali', description: 'Ottimale per legni da risonanza.' } },
            history: [],
            getConfig: () => ({ host: 'http://192.168.68.108:8123', tempEntityId: 'sensor.temperatura_laboratorio', humidityEntityId: 'sensor.umidita_laboratorio' })
        };
        const readings = ha.lastReadings;
        const evalObj = readings.evaluation || { status: 'optimal', badgeClass: 'badge-success', title: 'Ottimale', description: '' };
        const emcVal = (readings.emc !== undefined && readings.emc !== null) ? readings.emc : (ha.calculateEMC ? ha.calculateEMC(readings.temp, readings.humidity) : 11.2);
        const emcEval = readings.emcEvaluation || (ha.evaluateEMC ? ha.evaluateEMC(emcVal) : { statusLabel: 'Equilibrio', badgeClass: 'badge-success', badgeColor: 'var(--accent-emerald)', description: 'Stagionatura ottimale.' });
        const haConfig = ha.getConfig();

        // Calculate gauge percentages
        // Temp range 10°C - 35°C (target ~21°C)
        const tempPct = Math.min(100, Math.max(0, ((readings.temp - 10) / 25) * 100));
        // Humidity range 20% - 80% (target 45% - 55%)
        const humPct = Math.min(100, Math.max(0, ((readings.humidity - 20) / 60) * 100));
        // Wood EMC range 4% - 16% (target 8% - 9.8%)
        const emcPct = Math.min(100, Math.max(0, ((emcVal - 4) / 12) * 100));

        container.innerHTML = `
            <!-- Home Assistant Telemetry Center -->
            <div class="glass-panel" style="border: 1px solid var(--accent-cyan); box-shadow: 0 8px 32px rgba(6, 182, 212, 0.15);">
                <div class="panel-header" style="flex-wrap:wrap; gap:1rem;">
                    <div>
                        <div class="panel-title" style="color:var(--accent-cyan);">
                            <i data-lucide="radio" class="lucide-radio"></i>
                            Stazione Telemetria Ambientale &bull; Sensore Bottega
                        </div>
                        <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.2rem;">
                            Dispositivo: <strong style="color:var(--accent-emerald);">${readings.device || 'M5Stack STAMPLC'}</strong> &bull; 
                            Stato: <strong style="color:${ha.status === 'connected' ? 'var(--accent-emerald)' : 'var(--accent-gold)'};">${ha.status === 'connected' ? 'Sensore Online' : 'Simulazione / Demo'}</strong> &bull;
                            Ultimo agg.: ${new Date(readings.lastUpdate).toLocaleTimeString()}
                        </p>
                    </div>
                    <div style="display:flex; gap:0.6rem;">
                        <button class="btn btn-secondary" onclick="window.haService.fetchTelemetry(); window.showToast('Aggiornamento telemetria in corso...');">
                            <i data-lucide="refresh-cw" class="lucide-refresh-cw"></i> Sincronizza T, H & EMC
                        </button>
                        <button class="btn btn-primary" onclick="window.openHaModal()">
                            <i data-lucide="settings" class="lucide-settings"></i> Configura Telemetria
                        </button>
                    </div>
                </div>

                <!-- Live Climate Gauges (T, H, EMC) & Safety Assessment -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:1.2rem; margin-bottom:1.5rem;">
                    <!-- Temperature Card -->
                    <div class="telemetry-gauge-card" style="background:rgba(245, 158, 11, 0.06); border:1px solid rgba(245, 158, 11, 0.25); border-radius:14px; padding:1.4rem;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
                            <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--accent-gold); display:flex; align-items:center; gap:0.4rem;">
                                <i data-lucide="thermometer" class="lucide-thermometer"></i> Temperatura (T)
                            </span>
                            <span class="badge badge-warning" style="font-size:0.75rem;">Range: 18 - 24 °C</span>
                        </div>
                        <div style="display:flex; align-items:baseline; gap:0.5rem; margin-bottom:0.5rem;">
                            <span style="font-size:2.8rem; font-weight:800; font-family:var(--font-heading); color:#fff; line-height:1;">
                                ${readings.temp.toFixed(1)}
                            </span>
                            <span style="font-size:1.4rem; color:var(--accent-gold); font-weight:700;">°C</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                            Entità: <code style="color:var(--text-secondary); font-family:var(--font-mono);">${readings.tempName || haConfig.tempEntityId || 'sensore_temperatura'}</code>
                        </div>
                        <!-- Gauge bar -->
                        <div style="background:rgba(255,255,255,0.08); height:10px; border-radius:5px; overflow:hidden; position:relative; margin-bottom:0.5rem;">
                            <div style="width:${tempPct}%; height:100%; background:linear-gradient(90deg, #3b82f6, var(--accent-amber), #f43f5e); transition:width 0.5s ease;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted);">
                            <span>10°C (Freddo)</span>
                            <span style="color:var(--accent-gold);">21°C (Target)</span>
                            <span>35°C (Caldo)</span>
                        </div>
                    </div>

                    <!-- Humidity Card -->
                    <div class="telemetry-gauge-card" style="background:rgba(6, 182, 212, 0.06); border:1px solid rgba(6, 182, 212, 0.25); border-radius:14px; padding:1.4rem;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
                            <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--accent-cyan); display:flex; align-items:center; gap:0.4rem;">
                                <i data-lucide="droplets" class="lucide-droplets"></i> Umidità Relativa (H)
                            </span>
                            <span class="badge ${evalObj.badgeClass}" style="font-size:0.75rem;">Target: 45 - 55% RH</span>
                        </div>
                        <div style="display:flex; align-items:baseline; gap:0.5rem; margin-bottom:0.5rem;">
                            <span style="font-size:2.8rem; font-weight:800; font-family:var(--font-heading); color:#fff; line-height:1;">
                                ${readings.humidity.toFixed(1)}
                            </span>
                            <span style="font-size:1.4rem; color:var(--accent-cyan); font-weight:700;">% RH</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                            Entità: <code style="color:var(--text-secondary); font-family:var(--font-mono);">${readings.humidityName || haConfig.humidityEntityId || 'sensore_umidita'}</code>
                        </div>
                        <!-- Gauge bar -->
                        <div style="background:rgba(255,255,255,0.08); height:10px; border-radius:5px; overflow:hidden; position:relative; margin-bottom:0.5rem;">
                            <div style="width:${humPct}%; height:100%; background:linear-gradient(90deg, #f43f5e 0%, var(--accent-gold) 35%, var(--accent-emerald) 45%, var(--accent-emerald) 55%, var(--accent-gold) 65%, #f43f5e 100%); transition:width 0.5s ease;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted);">
                            <span>20% (Secco)</span>
                            <span style="color:var(--accent-emerald); font-weight:700;">45% - 55% (Ottimale)</span>
                            <span>80% (Umido)</span>
                        </div>
                    </div>

                    <!-- Wood EMC (Equilibrium Moisture Content) Card -->
                    <div class="telemetry-gauge-card" style="background:rgba(16, 185, 129, 0.06); border:1px solid rgba(16, 185, 129, 0.25); border-radius:14px; padding:1.4rem;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.8rem;">
                            <span style="font-size:0.85rem; font-weight:700; text-transform:uppercase; color:var(--accent-emerald); display:flex; align-items:center; gap:0.4rem;">
                                <i data-lucide="tree-pine" class="lucide-tree-pine"></i> EMC Legno (Umidità Equilibrio)
                            </span>
                            <span class="badge ${emcEval.badgeClass}" style="font-size:0.75rem;">Target: 8.0 - 9.8%</span>
                        </div>
                        <div style="display:flex; align-items:baseline; gap:0.5rem; margin-bottom:0.5rem;">
                            <span style="font-size:2.8rem; font-weight:800; font-family:var(--font-heading); color:#fff; line-height:1;">
                                ${emcVal.toFixed(1)}
                            </span>
                            <span style="font-size:1.4rem; color:var(--accent-emerald); font-weight:700;">%</span>
                            <span style="font-size:0.82rem; color:${emcEval.badgeColor || 'var(--accent-emerald)'}; font-weight:600; margin-left:0.5rem;">(${emcEval.statusLabel || 'Equilibrio'})</span>
                        </div>
                        <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                            Modello: <span style="color:var(--text-secondary); font-family:var(--font-mono);">USDA FPL Simpson &bull; Abete / Acero</span>
                        </div>
                        <!-- Gauge bar -->
                        <div style="background:rgba(255,255,255,0.08); height:10px; border-radius:5px; overflow:hidden; position:relative; margin-bottom:0.5rem;">
                            <div style="width:${emcPct}%; height:100%; background:linear-gradient(90deg, #f43f5e 0%, var(--accent-gold) 30%, var(--accent-emerald) 40%, var(--accent-emerald) 55%, var(--accent-gold) 65%, #f43f5e 100%); transition:width 0.5s ease;"></div>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:0.7rem; color:var(--text-muted);">
                            <span>5% (Troppo Secco)</span>
                            <span style="color:var(--accent-emerald); font-weight:700;">8.0% - 9.8% (Perfetto)</span>
                            <span>15% (Troppo Umido)</span>
                        </div>
                    </div>
                </div>

                <!-- Lutherie Tone Wood Protection Banner -->
                <div style="background:${evalObj.status === 'optimal' ? 'rgba(16, 185, 129, 0.12)' : evalObj.status === 'warning' ? 'rgba(245, 158, 11, 0.12)' : 'rgba(244, 63, 94, 0.15)'}; border:1px solid ${evalObj.status === 'optimal' ? 'rgba(16, 185, 129, 0.35)' : evalObj.status === 'warning' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(244, 63, 94, 0.4)'}; border-radius:10px; padding:1rem 1.2rem; display:flex; align-items:center; gap:1rem;">
                    <div style="font-size:1.8rem;">
                        ${evalObj.status === 'optimal' ? '🛡️' : evalObj.status === 'warning' ? '⚠️' : '🚨'}
                    </div>
                    <div>
                        <strong style="color:#fff; font-size:1rem; display:block; margin-bottom:0.2rem;">${evalObj.title} &bull; EMC Legno: ${emcVal.toFixed(1)}% (${emcEval.statusLabel || 'Equilibrio'})</strong>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">${evalObj.description} &bull; ${emcEval.description} &bull; <em>${evalObj.tempNote}</em></span>
                    </div>
                </div>
            </div>

            <!-- Workshop Benches with Live Climate Annotation -->
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i data-lucide="gauge" class="lucide-gauge" style="color: var(--accent-violet);"></i>
                        Monitoraggio Stazioni & Banchi di Lavoro Atelier
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-primary" onclick="window.openAddModal('laboratorio')">
                            <i data-lucide="plus" class="lucide-plus"></i> Nuova Stazione
                        </button>
                        <button class="btn btn-secondary" onclick="window.showToast('Sensori igrometrici sincronizzati con la bottega.')">
                            <i data-lucide="refresh-cw" class="lucide-refresh-cw"></i> Aggiorna Banchi
                        </button>
                    </div>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.8rem;">
                                <span class="badge badge-purple">${item.banco}</span>
                                <span class="badge ${item.statoStazione === 'Attivo' ? 'badge-success' : 'badge-info'}">${item.statoStazione}</span>
                            </div>
                            <h4 style="font-family:var(--font-heading); color:#fff; margin-bottom:0.4rem;">Operatore: ${item.assegnatoA}</h4>
                            <p style="font-size:0.85rem; color:var(--accent-gold); margin-bottom:0.8rem;">Strumento: <strong>${item.strumentoInLavorazione}</strong></p>
                            
                            <div style="background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:8px; font-size:0.8rem; margin-bottom:1rem;">
                                🌡️ <strong>Clima Banco:</strong> <span style="color:var(--accent-gold); font-weight:700;">${readings.temp.toFixed(1)}°C / ${readings.humidity.toFixed(1)}% RH</span> &bull; 🌲 <strong>EMC:</strong> <span style="color:var(--accent-emerald); font-weight:700;">${emcVal.toFixed(1)}%</span><br>
                                🛠️ <strong>Utensili in Uso:</strong><br>
                                <ul style="margin-left:1.2rem; margin-top:0.3rem; color:var(--text-secondary);">
                                    ${(item.utensiliInUso || []).map(u => `<li>${u}</li>`).join('')}
                                </ul>
                            </div>

                            <div style="display:flex; justify-content:flex-end; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('laboratorio', '${item.id}', '${item.banco}')" title="Elimina stazione">
                                    <i class="lucide-trash-2"></i> Elimina
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <!-- Recent Telemetry Log from Sensore Bottega -->
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i data-lucide="clock" class="lucide-clock" style="color: var(--accent-emerald);"></i>
                        Storico Letture Telemetria Recenti (Bottega)
                    </div>
                    <span style="font-size:0.8rem; color:var(--text-muted);">Ultime misurazioni registrate in bottega</span>
                </div>
                <div class="custom-table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Orario Lettura</th>
                                <th>Temperatura (T)</th>
                                <th>Umidità Relativa (H)</th>
                                <th>EMC Legno</th>
                                <th>Valutazione Legni</th>
                                <th>Sorgente Dati</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${ha.history.length === 0 ? `
                                <tr>
                                    <td>${new Date().toLocaleTimeString()}</td>
                                    <td><strong style="color:var(--accent-gold);">${readings.temp.toFixed(1)} °C</strong></td>
                                    <td><strong style="color:var(--accent-cyan);">${readings.humidity.toFixed(1)}% RH</strong></td>
                                    <td><strong style="color:var(--accent-emerald);">${emcVal.toFixed(1)}%</strong></td>
                                    <td><span class="badge ${evalObj.badgeClass}">${evalObj.title}</span></td>
                                    <td><span class="badge badge-info">${ha.status === 'connected' ? 'Sensore Bottega' : 'Simulazione Locale'}</span></td>
                                </tr>
                            ` : ha.history.slice(0, 8).map(h => `
                                <tr>
                                    <td style="color:var(--text-muted); font-family:var(--font-mono);">${h.time}</td>
                                    <td><strong style="color:var(--accent-gold);">${h.temp.toFixed(1)} °C</strong></td>
                                    <td><strong style="color:var(--accent-cyan);">${h.humidity.toFixed(1)}% RH</strong></td>
                                    <td><strong style="color:var(--accent-emerald);">${(h.emc !== undefined ? h.emc : emcVal).toFixed(1)}%</strong></td>
                                    <td><span class="badge ${h.evaluation ? h.evaluation.badgeClass : 'badge-success'}">${h.evaluation ? h.evaluation.title : 'Ottimale'}</span></td>
                                    <td><span class="badge ${h.status === 'connected' ? 'badge-success' : 'badge-warning'}">${h.status === 'connected' ? 'Sensore Bottega' : 'Simulazione'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 8. Magazzino Legno
    renderMagazzinoLegno: function(container) {
        const items = window.atelierDB.data.magazzinoLegno || [];
        const ha = window.haService || { lastReadings: { temp: 24.3, humidity: 61.3, emc: 11.2 } };
        const readings = ha.lastReadings;
        const emcVal = readings.emc !== undefined ? readings.emc : 11.2;

        container.innerHTML = `
            <!-- Live Climate Telemetry Warning for Tonewood Storage -->
            <div style="background:rgba(217, 119, 6, 0.1); border:1px solid rgba(217, 119, 6, 0.3); border-radius:12px; padding:1rem 1.4rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div style="display:flex; align-items:center; gap:1rem;">
                    <div style="font-size:2rem;">🌲</div>
                    <div>
                        <strong style="color:#fff; font-size:1rem; display:block;">Clima Magazzino Tonewood & Stabilità Igrometrica:</strong>
                        <span style="font-size:0.85rem; color:var(--text-secondary);">
                            Temperatura: <strong style="color:var(--accent-gold);">${readings.temp.toFixed(1)} °C</strong> &bull;
                            Umidità Relativa: <strong style="color:var(--accent-cyan);">${readings.humidity.toFixed(1)}% RH</strong> &bull;
                            EMC Legno: <strong style="color:var(--accent-emerald);">${emcVal.toFixed(1)}%</strong> &bull;
                            <span style="color:var(--accent-emerald); font-weight:700;">Equilibrio igrometrico per Abete della Val di Fiemme & Acero dei Balcani.</span>
                        </span>
                    </div>
                </div>
                <button class="btn btn-secondary" onclick="window.openHaModal()" style="font-size:0.8rem; padding:0.4rem 0.8rem;">
                    <i data-lucide="radio" class="lucide-radio"></i> Configura Telemetria
                </button>
            </div>

            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i data-lucide="trees" class="lucide-trees" style="color: var(--accent-timber);"></i>
                        Magazzino Legno & Legnami di Risonanza (${items.length} Essenze)
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('magazzinoLegno')">
                        <i data-lucide="plus" class="lucide-plus"></i> Registra Nuovo Legno
                    </button>
                </div>
                <div class="custom-table-container">
                    <table class="custom-table">
                        <thead>
                            <tr>
                                <th>Essenza & Provenienza</th>
                                <th>Stagionatura</th>
                                <th>Formato Pezzo</th>
                                <th>Stock</th>
                                <th>Parametri Acustici</th>
                                <th>Valore Unità</th>
                                <th>Stato</th>
                                <th style="text-align:center;">Azione</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${items.map(item => `
                                <tr>
                                    <td>
                                        <strong style="color:#fff; font-size:0.95rem;">${item.essenza}</strong><br>
                                        <small style="color:var(--text-muted);"><i data-lucide="map-pin" class="lucide-map-pin"></i> ${item.provenienza}</small>
                                    </td>
                                    <td>
                                        <span class="badge badge-warning">Taglio ${item.annoTaglio}</span><br>
                                        <small style="color:var(--accent-gold);">${item.stagionaturaAnni} Anni Stag.</small>
                                    </td>
                                    <td style="font-size:0.85rem; color:var(--text-secondary);">${item.tipoPezzo}</td>
                                    <td><strong style="font-size:1.1rem; color:#fff;">${item.quantita}</strong> pezzi</td>
                                    <td style="font-size:0.8rem;">
                                        Densità: ${item.densita}<br>
                                        Velocità Suono: ${item.velocitaSuono}
                                    </td>
                                    <td><strong style="color:var(--accent-gold);">€ ${item.prezzoUnitario}</strong></td>
                                    <td><span class="badge badge-success">${item.stato}</span></td>
                                    <td style="text-align:center;">
                                        <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('magazzinoLegno', '${item.id}', '${item.essenza}')" title="Elimina legno">
                                            <i class="lucide-trash-2"></i>
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    // 9. Magazzino strumenti
    renderMagazzinoStrumenti: function(container) {
        const items = window.atelierDB.data.magazzinoStrumenti || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-music" style="color: var(--accent-gold);"></i>
                        Magazzino Strumenti Finiti & Showroom (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('magazzinoStrumenti')">
                        <i class="lucide-plus"></i> Inserisci Strumento
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <span class="badge badge-info">${item.codice}</span>
                                <span class="badge ${item.stato === 'Venduto' ? 'badge-danger' : 'badge-success'}">${item.stato}</span>
                            </div>
                            <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.2rem; margin-bottom:0.3rem;">${item.nome}</h3>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.6rem;">Modello: <strong>${item.modello} (${item.annoCostruzione})</strong></p>
                            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:1rem;"><strong>Vernice:</strong> ${item.vernice}</p>
                            
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.8rem;">
                                <span style="font-size:1.3rem; font-weight:800; color:var(--accent-gold); font-family:var(--font-heading);">€ ${item.prezzo.toLocaleString()}</span>
                                <div style="display:flex; gap:0.4rem;">
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Certificato di Autenticità generato per ${item.codice}')">
                                        <i class="lucide-award"></i> Certificato
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('magazzinoStrumenti', '${item.id}', '${item.nome}')" title="Elimina strumento">
                                        <i class="lucide-trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 10. Media
    renderMedia: function(container) {
        const items = window.atelierDB.data.media || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i data-lucide="image" class="lucide-image" style="color: var(--accent-purple);"></i>
                        Media Library & Archivio Acustico / Fotografico (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('media')">
                        <i data-lucide="upload" class="lucide-upload"></i> Carica Media
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="height:140px; background:rgba(0,0,0,0.5); border-radius:8px; margin-bottom:0.8rem; overflow:hidden; position:relative; display:flex; align-items:center; justify-content:center;">
                                ${item.url && (item.url.endsWith('.png') || item.url.endsWith('.jpg') || item.url.startsWith('data:image')) ? `
                                     <img src="${item.url}" style="width:100%; height:100%; object-fit:cover;">
                                ` : `
                                     <i data-lucide="music" class="lucide-music" style="font-size:3rem; color:var(--accent-gold);"></i>
                                `}
                                <span class="badge badge-purple" style="position:absolute; top:8px; right:8px;">${item.tipo}</span>
                            </div>
                            <h4 style="font-family:var(--font-heading); color:#fff; font-size:1rem; margin-bottom:0.3rem;">${item.titolo}</h4>
                            <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.8rem;">${item.descrizione}</p>
                            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); margin-bottom:0.6rem;">
                                <span>Formato: ${item.formato}</span>
                                <span>Dim: ${item.dimensione}</span>
                            </div>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem;">
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="window.showToast('Apertura file multimediale: ${item.titolo}')">
                                    <i class="lucide-external-link"></i> Apri
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('media', '${item.id}', '${item.titolo}')" title="Elimina media">
                                    <i class="lucide-trash-2"></i> Elimina
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 11. Report
    renderReport: function(container) {
        const items = window.atelierDB.data.report || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-bar-chart-3" style="color: var(--accent-cyan);"></i>
                        Report Statistiche & Analisi Rendimento (${items.length})
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-primary" onclick="window.openAddModal('report')">
                            <i class="lucide-plus"></i> Genera Report
                        </button>
                        <button class="btn btn-secondary" onclick="window.showToast('Esportazione Report PDF in corso...')">
                            <i class="lucide-download-cloud"></i> Esporta PDF
                        </button>
                    </div>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                                <span class="badge badge-info">${item.periodo}</span>
                                <button class="btn btn-secondary" style="padding:0.2rem 0.4rem; font-size:0.7rem; color:#ef4444;" onclick="window.deleteRecord('report', '${item.id}', '${item.titolo}')" title="Elimina report">
                                    <i class="lucide-trash-2"></i>
                                </button>
                            </div>
                            <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.2rem; margin-bottom:0.8rem;">${item.titolo}</h3>
                            
                            <div style="background:rgba(0,0,0,0.3); padding:1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1rem;">
                                <div>🎻 <strong>Strumenti Costruiti:</strong> ${item.strumentiCostruiti}</div>
                                <div>🛠️ <strong>Restauri Completati:</strong> ${item.strumentiRestaurati}</div>
                                <div>💰 <strong>Ricavo Totale:</strong> ${typeof item.ricavoTotale === 'number' ? '€ ' + item.ricavoTotale.toLocaleString() : item.ricavoTotale}</div>
                                <div>📈 <strong>Margine Netto:</strong> <span style="color:var(--accent-emerald); font-weight:700;">${item.margineNetto}</span></div>
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-gold);">⭐️ <strong>Top Performance:</strong> ${item.indicatoreTop}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 12. Restauro
    renderRestauro: function(container) {
        const items = window.atelierDB.data.restauro || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-sparkles" style="color: var(--accent-rosewood);"></i>
                        Registro Interventi di Restauro & Riparazioni d'Epoca (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('restauro')">
                        <i class="lucide-plus"></i> Registra Scheda Restauro
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem;">
                                <span class="badge badge-purple">${item.codice}</span>
                                <span class="badge ${item.statoIntervento.includes('Completato') ? 'badge-success' : 'badge-warning'}">${item.statoIntervento}</span>
                            </div>
                            <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.15rem; margin-bottom:0.3rem;">${item.strumento}</h3>
                            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.8rem;">Proprietario: <strong>${item.proprietario}</strong></p>
                            
                            <div style="background:rgba(0,0,0,0.3); padding:0.8rem; border-radius:8px; font-size:0.8rem; margin-bottom:1rem;">
                                <div style="color:#f43f5e; margin-bottom:0.3rem;">🩺 <strong>Diagnosi:</strong> ${item.diagnosi}</div>
                                <div style="color:var(--text-secondary);">🔧 <strong>Interventi:</strong> ${item.interventiPrevisti}</div>
                            </div>

                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.8rem;">
                                <div>
                                    <span style="font-size:1.1rem; font-weight:700; color:var(--accent-gold);">€ ${item.preventivo.toLocaleString()}</span><br>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">Consegna: ${item.consegnaPrevista}</span>
                                </div>
                                <div style="display:flex; gap:0.4rem;">
                                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem;" onclick="window.showToast('Scheda perizia di restauro per ${item.codice} aperta.')" title="Dettagli Perizia">
                                        <i class="lucide-file-text"></i> Perizia
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('restauro', '${item.id}', '${item.codice}')" title="Elimina scheda">
                                        <i class="lucide-trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 13. Social
    renderSocial: function(container) {
        const items = window.atelierDB.data.social || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i class="lucide-share-2" style="color: var(--accent-cyan);"></i>
                        Social Media & Comunicazione Atelier (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('social')">
                        <i class="lucide-plus"></i> Programma Post
                    </button>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; margin-bottom:0.6rem;">
                                <span class="badge badge-info">${item.piattaforma}</span>
                                <span class="badge badge-warning">${item.stato}</span>
                            </div>
                            <h4 style="font-family:var(--font-heading); color:#fff; font-size:1.05rem; margin-bottom:0.4rem;">${item.titolo}</h4>
                            <p style="font-size:0.8rem; color:var(--accent-gold); margin-bottom:0.8rem;">📅 ${item.dataProgrammata}</p>
                            <p style="font-size:0.78rem; color:var(--accent-cyan); margin-bottom:0.8rem;">${item.hashtag}</p>
                            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.6rem; margin-top:0.6rem;">
                                <span style="font-size:0.8rem; color:var(--text-muted);">❤️ Engagement: ${item.likesPrevisti}</span>
                                <div style="display:flex; gap:0.4rem;">
                                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:var(--accent-cyan);" onclick="window.showToast('Post pubblicato con successo sui canali social!')" title="Pubblica subito">
                                        <i class="lucide-send"></i> Pubblica
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('social', '${item.id}', '${item.titolo}')" title="Elimina post">
                                        <i class="lucide-trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
};
