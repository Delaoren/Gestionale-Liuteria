/**
 * Atelier Liuteria - Main Application Controller
 */

// Master list of 13 apps in alphabetical order
const APPS = [
    {
        id: "biblioteca",
        name: "Biblioteca",
        tag: "Documenti & Manuali",
        icon: "book-open",
        color: "linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.4))",
        borderColor: "#3b82f6",
        desc: "Raccolta disegni, sesti acustici, ricette di vernici tradizionali e trattati di liuteria classica.",
        renderer: window.AppModules.renderBiblioteca
    },
    {
        id: "calendarioAppuntamenti",
        name: "Calendario appuntamenti",
        tag: "Incontri & Visite",
        icon: "calendar-days",
        color: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.4))",
        borderColor: "#8b5cf6",
        desc: "Agenda appuntamenti con clienti, solisti e conservatori per prove acustiche e consegne.",
        renderer: window.AppModules.renderCalendarioAppuntamenti
    },
    {
        id: "calendarioLavorazioni",
        name: "Calendario Lavorazioni",
        tag: "Pianificazione Atelier",
        icon: "clock",
        color: "linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.4))",
        borderColor: "#ec4899",
        desc: "Pianificazione delle fasi di lavoro, scultura ricci, intavolazione e tempi di essiccazione vernici.",
        renderer: window.AppModules.renderCalendarioLavorazioni
    },
    {
        id: "clienti",
        name: "Clienti",
        tag: "Anagrafica & CRM",
        icon: "users",
        color: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.4))",
        borderColor: "#10b981",
        desc: "Anagrafica dei clienti, musicisti, collezionisti, storico acquisti e preferenze timbriche.",
        renderer: window.AppModules.renderClienti
    },
    {
        id: "costruzione",
        name: "Costruzione",
        tag: "Nuovi Strumenti",
        icon: "hammer",
        color: "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.4))",
        borderColor: "#f59e0b",
        desc: "Registro di costruzione di nuovi violini, viole, violoncelli e strumenti a pizzico in lavorazione.",
        renderer: window.AppModules.renderCostruzione
    },
    {
        id: "gestioneContabilita",
        name: "Gestione contabilità",
        tag: "Fatture & Bilancio",
        icon: "receipt",
        color: "linear-gradient(135deg, rgba(6, 182, 212, 0.2), rgba(8, 145, 178, 0.4))",
        borderColor: "#06b6d4",
        desc: "Emissione fatture, registro entrate/uscite, acconti per commissioni e controllo bilancio.",
        renderer: window.AppModules.renderGestioneContabilita
    },
    {
        id: "laboratorio",
        name: "Laboratorio",
        tag: "Sensori & Utensili",
        icon: "gauge",
        color: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(79, 70, 229, 0.4))",
        borderColor: "#6366f1",
        desc: "Monitoraggio temperatura ed umidità relativa dei banchi per la conservazione dei tonewoods.",
        renderer: window.AppModules.renderLaboratorio
    },
    {
        id: "magazzinoLegno",
        name: "Magazzino Legno",
        tag: "Legnami da Risonanza",
        icon: "trees",
        color: "linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(180, 83, 9, 0.4))",
        borderColor: "#d97706",
        desc: "Inventario legni di risonanza: abete della Val di Fiemme, acero marezzato balcanico ed ebano.",
        renderer: window.AppModules.renderMagazzinoLegno
    },
    {
        id: "magazzinoStrumenti",
        name: "Magazzino strumenti",
        tag: "Strumenti Finiti",
        icon: "music",
        color: "linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(202, 138, 4, 0.4))",
        borderColor: "#eab308",
        desc: "Showroom strumenti completati pronti per vendita o prova, codici matricola e certificati.",
        renderer: window.AppModules.renderMagazzinoStrumenti
    },
    {
        id: "media",
        name: "Media",
        tag: "Foto & Audio",
        icon: "image",
        color: "linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.4))",
        borderColor: "#a855f7",
        desc: "Archivio fotografico ad alta risoluzione del dettaglio dei filetti e registrazioni audio acustiche.",
        renderer: window.AppModules.renderMedia
    },
    {
        id: "report",
        name: "Report",
        tag: "Statistiche & KPI",
        icon: "bar-chart-3",
        color: "linear-gradient(135deg, rgba(20, 184, 166, 0.2), rgba(13, 148, 136, 0.4))",
        borderColor: "#14b8a6",
        desc: "Analisi sull'efficienza produttiva dell'atelier, ricavi annui, consumo legnami e interventi.",
        renderer: window.AppModules.renderReport
    },
    {
        id: "restauro",
        name: "Restauro",
        tag: "Interventi & Riparazioni",
        icon: "sparkles",
        color: "linear-gradient(135deg, rgba(244, 63, 94, 0.2), rgba(225, 29, 72, 0.4))",
        borderColor: "#f43f5e",
        desc: "Schede di diagnosi e restauro conservativo per strumenti antichi d'epoca, violini e violoncelli.",
        renderer: window.AppModules.renderRestauro
    },
    {
        id: "social",
        name: "Social",
        tag: "Marketing & Community",
        icon: "share-2",
        color: "linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(3, 105, 161, 0.4))",
        borderColor: "#0284c7",
        desc: "Pianificazione post social, showcase delle ultime creazioni e interazione con la liuteria globale.",
        renderer: window.AppModules.renderSocial
    }
];

class AppController {
    constructor() {
        this.activeModuleId = null;
        this.init();
    }

    init() {
        this.renderHomeGrid();
        this.setupSearch();
        this.setupLucideIcons();
        this.updateHeaderStats();
    }

    renderHomeGrid(filterText = "") {
        const gridContainer = document.getElementById("appsGrid");
        if (!gridContainer) return;

        const filtered = APPS.filter(app => {
            const text = (app.name + " " + app.tag + " " + app.desc).toLowerCase();
            return text.includes(filterText.toLowerCase());
        });

        if (filtered.length === 0) {
            gridContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:3rem; color:var(--text-muted);">
                    <i class="lucide-search-x" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>
                    <p style="font-size:1.1rem;">Nessuna app trovata per "${filterText}"</p>
                </div>
            `;
            return;
        }

        gridContainer.innerHTML = filtered.map((app, idx) => `
            <div class="app-card" onclick="window.appController.openModule('${app.id}')" style="border-top: 3px solid ${app.borderColor};">
                <div class="app-card-top">
                    <div class="app-icon-box" style="background: ${app.color}; color: ${app.borderColor};">
                        <i data-lucide="${app.icon}" class="lucide-${app.icon}"></i>
                    </div>
                    <span class="app-alpha-index">${idx + 1}</span>
                </div>
                <div class="app-card-body">
                    <h4>${app.name}</h4>
                    <p>${app.desc}</p>
                </div>
                <div class="app-card-footer">
                    <span class="app-category-tag">${app.tag}</span>
                    <span class="app-open-btn">Apri App <i data-lucide="chevron-right" class="lucide-chevron-right"></i></span>
                </div>
            </div>
        `).join('');

        this.setupLucideIcons();
    }

    openModule(moduleId) {
        const app = APPS.find(a => a.id === moduleId);
        if (!app) return;

        this.activeModuleId = moduleId;

        // Hide home view, show module view
        document.getElementById("homeView").style.display = "none";
        const moduleView = document.getElementById("moduleView");
        moduleView.classList.add("active");

        // Render header
        document.getElementById("moduleHeaderNav").innerHTML = `
            <div class="module-title-group">
                <div class="module-icon-large" style="background: ${app.color}; border:1px solid ${app.borderColor}; color: ${app.borderColor};">
                    <i data-lucide="${app.icon}" class="lucide-${app.icon}"></i>
                </div>
                <div>
                    <h2>${app.name}</h2>
                    <p>${app.desc}</p>
                </div>
            </div>
            <button class="btn btn-secondary" onclick="window.appController.closeModule()">
                <i data-lucide="arrow-left" class="lucide-arrow-left"></i> Torna alla Home
            </button>
        `;

        // Render content
        const container = document.getElementById("moduleContentContainer");
        if (app.renderer) {
            app.renderer(container);
        } else {
            container.innerHTML = `<p>Modulo in caricamento...</p>`;
        }

        this.setupLucideIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    closeModule() {
        this.activeModuleId = null;
        document.getElementById("moduleView").classList.remove("active");
        document.getElementById("homeView").style.display = "block";
        this.renderHomeGrid();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupSearch() {
        const searchInput = document.getElementById("globalSearchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const query = e.target.value;
                if (this.activeModuleId) {
                    this.closeModule();
                }
                this.renderHomeGrid(query);
            });
        }
    }

    setupLucideIcons() {
        // Automatically ensure all elements with class starting with lucide- have data-lucide attribute
        document.querySelectorAll('[class*="lucide-"]').forEach(el => {
            el.classList.forEach(cls => {
                if (cls.startsWith('lucide-') && cls !== 'lucide-icon') {
                    const iconName = cls.replace('lucide-', '');
                    if (!el.getAttribute('data-lucide')) {
                        el.setAttribute('data-lucide', iconName);
                    }
                }
            });
        });

        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    updateHeaderStats() {
        if (!window.atelierDB || !window.atelierDB.data) return;

        // 1. Numero preciso di clienti
        const clientCount = (window.atelierDB.data.clienti || []).length;

        // 2. Numero preciso di strumenti finiti (magazzino strumenti completati)
        const instrumentCount = (window.atelierDB.data.magazzinoStrumenti || []).length;

        // 3. Numero preciso di appuntamenti della giornata odierna
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;

        const appointments = window.atelierDB.data.calendarioAppuntamenti || [];
        const todayCount = appointments.filter(app => {
            if (!app || !app.data) return false;
            const str = String(app.data).trim();
            if (str === todayStr) return true;
            // Parse DD/MM/YYYY or DD-MM-YYYY
            const parts = str.split(/[-/]/);
            if (parts.length === 3) {
                if (parts[0].length === 4) {
                    return parseInt(parts[0], 10) === year &&
                           parseInt(parts[1], 10) === (now.getMonth() + 1) &&
                           parseInt(parts[2], 10) === now.getDate();
                } else if (parts[2].length === 4) {
                    return parseInt(parts[2], 10) === year &&
                           parseInt(parts[1], 10) === (now.getMonth() + 1) &&
                           parseInt(parts[0], 10) === now.getDate();
                }
            }
            return false;
        }).length;

        const statClient = document.getElementById("statClientsNum");
        const statInstr = document.getElementById("statInstrNum");
        const statAppToday = document.getElementById("statAppointmentsTodayNum");

        if (statClient) statClient.innerText = clientCount;
        if (statInstr) statInstr.innerText = instrumentCount;
        if (statAppToday) statAppToday.innerText = todayCount;
    }
}

// Toast System
window.showToast = function(msg) {
    let container = document.getElementById("toastContainer");
    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<i class="lucide-check-circle" style="color:var(--accent-gold);"></i> <span>${msg}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => toast.remove(), 300);
    }, 3500);
};

// Modal Handler for dynamic additions
window.openAddModal = function(collectionName) {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    const appInfo = APPS.find(a => a.id === collectionName);
    modalTitle.innerText = `Nuovo Inserimento: ${appInfo ? appInfo.name : collectionName}`;

    const todayIso = new Date().toISOString().split('T')[0];
    const d30 = new Date(); d30.setDate(d30.getDate() + 30);
    const nextMonthIso = d30.toISOString().split('T')[0];
    const d7 = new Date(); d7.setDate(d7.getDate() + 7);
    const weekAfterIso = d7.toISOString().split('T')[0];
    const todayDateTimeLocal = new Date().toISOString().slice(0, 16);

    const clientsList = ((window.atelierDB && window.atelierDB.data.clienti) || [])
        .map(c => `<option value="${c.nome}">`).join('');
    const woodsList = ((window.atelierDB && window.atelierDB.data.magazzinoLegno) || [])
        .map(w => `<option value="${w.essenza} (${w.annoTaglio})">`).join('');
    const instrumentsList = [
        ...(((window.atelierDB && window.atelierDB.data.costruzione) || []).map(i => `<option value="${i.opNumero} - ${i.modello}">`)),
        ...(((window.atelierDB && window.atelierDB.data.magazzinoStrumenti) || []).map(i => `<option value="${i.nome}">`))
    ].join('');

    const ha = window.haService || { lastReadings: { temp: 21.8, humidity: 47.5 } };
    const curTemp = (ha.lastReadings && ha.lastReadings.temp) ? ha.lastReadings.temp.toFixed(1) : "21.8";
    const curHum = (ha.lastReadings && ha.lastReadings.humidity) ? ha.lastReadings.humidity.toFixed(1) : "47.5";
    const currentClimateString = `${curTemp}°C / ${curHum}% RH (Ottimale)`;

    let formHTML = '';

    if (collectionName === 'biblioteca') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'biblioteca')">
                <div class="form-group">
                    <label>Titolo Opera / Trattato / Documento Tecnico</label>
                    <input type="text" id="f_bib_titolo" class="form-control" required placeholder="Es. Rilievi Acustici e Sesto Stradivari 'Cremonese' 1715">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Autore / Ente di Ricerca</label>
                        <input type="text" id="f_bib_autore" class="form-control" required placeholder="Es. S. F. Sacconi / G. Baese / Museo del Violino">
                    </div>
                    <div class="form-group">
                        <label>Categoria</label>
                        <select id="f_bib_categoria" class="form-control">
                            <option value="Disegni e Modelli">Disegni e Modelli</option>
                            <option value="Ricette e Trattamenti">Ricette e Trattamenti</option>
                            <option value="Analisi Scientifica">Analisi Scientifica</option>
                            <option value="Tecnica Costruttiva">Tecnica Costruttiva</option>
                            <option value="Storia & Liuteria">Storia & Liuteria</option>
                            <option value="Acustica Applicata">Acustica Applicata</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Anno Pubblicazione</label>
                        <input type="number" id="f_bib_anno" class="form-control" value="2018">
                    </div>
                    <div class="form-group">
                        <label>Formato Documento</label>
                        <select id="f_bib_formato" class="form-control">
                            <option value="PDF Blueprint">PDF Blueprint</option>
                            <option value="Manuale Tecnico">Manuale Tecnico</option>
                            <option value="Rapporto Tomografico">Rapporto Tomografico (CT-Scan)</option>
                            <option value="PDF Guida">PDF Guida</option>
                            <option value="Articolo Scientifico">Articolo Scientifico</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Numero Pagine</label>
                        <input type="number" id="f_bib_pagine" class="form-control" value="48">
                    </div>
                </div>
                <div class="form-group">
                    <label>Tags & Parole Chiave (separate da virgola)</label>
                    <input type="text" id="f_bib_tags" class="form-control" placeholder="Es. Stradivari, Violino, Spessori, Frequenze, Vernici">
                </div>
                <div class="form-group">
                    <label>Note & Sintesi Documento</label>
                    <textarea id="f_bib_note" class="form-control" placeholder="Dettagli essenziali, spessori della tavola, note di laboratorio o frequenze citate..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-book-plus"></i> Archivia Documento in Biblioteca
                </button>
            </form>
        `;
    } else if (collectionName === 'calendarioAppuntamenti') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'calendarioAppuntamenti')">
                <div class="form-group">
                    <label>Cliente / Richiedente</label>
                    <input type="text" id="f_app_cliente" list="app_clienti_list" class="form-control" required placeholder="Es. Maestro Marco Rossi (Primo Violino)">
                    <datalist id="app_clienti_list">
                        ${clientsList}
                    </datalist>
                </div>
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>Data Appuntamento</label>
                        <input type="date" id="f_app_data" class="form-control" required value="${todayIso}">
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Orario Incontro</label>
                        <input type="time" id="f_app_ora" class="form-control" required value="10:30">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipo Incontro</label>
                        <select id="f_app_tipo" class="form-control">
                            <option value="Messa a punto suoni">Messa a punto suoni</option>
                            <option value="Prova acustica e bilanciamento">Prova acustica e bilanciamento</option>
                            <option value="Consulenza e Valutazione">Consulenza e Valutazione</option>
                            <option value="Consegna Strumento">Consegna Strumento</option>
                            <option value="Regolazione tastiera e ponticello">Regolazione tastiera e ponticello</option>
                            <option value="Ispezione e Diagnosi Restauro">Ispezione e Diagnosi Restauro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Strumento di Riferimento</label>
                        <input type="text" id="f_app_strumento" list="app_strumenti_list" class="form-control" placeholder="Es. Violino Guarneri 1742">
                        <datalist id="app_strumenti_list">
                            ${instrumentsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Stato Appuntamento</label>
                        <select id="f_app_stato" class="form-control">
                            <option value="Confermato">Confermato</option>
                            <option value="In attesa">In attesa</option>
                            <option value="Completato">Completato</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Note Atelier</label>
                    <textarea id="f_app_note" class="form-control" placeholder="Dettagli sulle lavorazioni da concordare, preferenze acustiche del musicista..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-calendar-plus"></i> Salva Appuntamento
                </button>
            </form>
        `;
    } else if (collectionName === 'calendarioLavorazioni') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'calendarioLavorazioni')">
                <div class="form-group">
                    <label>Titolo Lavorazione / Attività</label>
                    <input type="text" id="f_lav_titolo" class="form-control" required placeholder="Es. Scultura Riccio e Cassetta Pirolo Opus 45">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Strumento di Riferimento</label>
                        <input type="text" id="f_lav_strumento" list="lav_strumenti_list" class="form-control" required placeholder="Es. Violino Opus 45 Guarneri">
                        <datalist id="lav_strumenti_list">
                            ${instrumentsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Responsabile / Operatore</label>
                        <select id="f_lav_responsabile" class="form-control">
                            <option value="Maestro Liutaio">Maestro Liutaio</option>
                            <option value="Assistente Atelier">Assistente Atelier</option>
                            <option value="Restauratore Capo">Restauratore Capo</option>
                            <option value="Allievo di Bottega">Allievo di Bottega</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Fase Lavorazione</label>
                        <input type="text" id="f_lav_fase" list="lav_fasi_list" class="form-control" required placeholder="Es. Sbozzatura & Occhioli">
                        <datalist id="lav_fasi_list">
                            <option value="Sbozzatura e Occhioli">
                            <option value="Piallatura Giunta e Bombatura">
                            <option value="Scavo Spessori e Intaglio Effi">
                            <option value="Incatenatura e Chiusura Cassa">
                            <option value="Filettatura e Finitura Bordi">
                            <option value="Incastro Manico e Tastiera">
                            <option value="Ossidazione UV e Verniciatura Mano 1/12">
                            <option value="Applicazione Tacchetti di Restauro">
                            <option value="Montatura, Ponticello e Anima">
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Priorità</label>
                        <select id="f_lav_priorita" class="form-control">
                            <option value="Media">Media</option>
                            <option value="Alta">Alta</option>
                            <option value="Urgentissima">Urgentissima</option>
                            <option value="Bassa">Bassa</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>📅 Data Inizio</label>
                        <input type="date" id="f_lav_inizio" class="form-control" required value="${todayIso}">
                    </div>
                    <div class="form-group">
                        <label>🏁 Data Consegna / Fine</label>
                        <input type="date" id="f_lav_fine" class="form-control" required value="${weekAfterIso}">
                    </div>
                    <div class="form-group">
                        <label>Avanzamento: <strong id="f_lav_progVal" style="color:var(--accent-gold);">20%</strong></label>
                        <input type="range" id="f_lav_progresso" class="form-control" min="0" max="100" value="20" oninput="document.getElementById('f_lav_progVal').innerText = this.value + '%'" style="cursor:pointer; padding:0.4rem;">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-clock"></i> Pianifica Lavorazione in Atelier
                </button>
            </form>
        `;
    } else if (collectionName === 'clienti') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'clienti')">
                <div class="form-group">
                    <label>Nome Completo Cliente / Musicista</label>
                    <input type="text" id="f_nome" class="form-control" required placeholder="Es. Maestro Marco Rossi">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ruolo / Titolo</label>
                        <input type="text" id="f_ruolo" class="form-control" placeholder="Es. Solista & Primo Violino Teatro alla Scala">
                    </div>
                    <div class="form-group">
                        <label>Città & Nazione</label>
                        <input type="text" id="f_citta" class="form-control" placeholder="Es. Milano (Italia)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="f_email" class="form-control" placeholder="email@orchestra.it">
                    </div>
                    <div class="form-group">
                        <label>Telefono</label>
                        <input type="text" id="f_telefono" class="form-control" placeholder="+39 335 ...">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Strumenti Posseduti / Assegnati</label>
                        <input type="text" id="f_strumentiPosseduti" class="form-control" placeholder="Es. Violino Master Opus 38, Arco Sartory">
                    </div>
                    <div class="form-group">
                        <label>Storico Spesa Totale (€)</label>
                        <input type="number" id="f_spesaTotale" class="form-control" value="0">
                    </div>
                </div>
                <div class="form-group">
                    <label>Note & Preferenze Timbriche del Musicista</label>
                    <textarea id="f_note" class="form-control" placeholder="Es. Predilige timbro caldo nei bassi, anima leggermente avanzata, ponticello modello belga..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-user-plus"></i> Salva Cliente
                </button>
            </form>
        `;
    } else if (collectionName === 'costruzione') {
        const existingCost = (window.atelierDB && window.atelierDB.data.costruzione) || [];
        let highestNum = 0;
        existingCost.forEach(c => {
            const match = (c.opNumero || '').match(/(\d+)/);
            if (match) {
                const n = parseInt(match[1]);
                if (n > highestNum) highestNum = n;
            }
        });
        const nextOpusNum = highestNum > 0 ? highestNum + 1 : 45;
        const defaultOpus = `Opus ${nextOpusNum}`;
        const targetDate = new Date();
        targetDate.setMonth(targetDate.getMonth() + 3);
        const estDeliveryIso = targetDate.toISOString().split('T')[0];

        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'costruzione')">
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>N° Opus / Identificativo</label>
                        <input type="text" id="f_cost_opNumero" class="form-control" required value="${defaultOpus}" placeholder="Es. Opus 42">
                    </div>
                    <div class="form-group" style="flex:2;">
                        <label>Modello di Strumento</label>
                        <input type="text" id="f_cost_modello" list="cost_modelli_list" class="form-control" required placeholder="Es. Violino Guarneri del Gesù 1742 'Lord Wilton'">
                        <datalist id="cost_modelli_list">
                            <option value="Violino Guarneri del Gesù 1742 'Lord Wilton'">
                            <option value="Violino Guarneri del Gesù 1743 'Cannone'">
                            <option value="Violino Antonio Stradivari 1715 'Il Cremonese'">
                            <option value="Violino Antonio Stradivari 1716 'Messie'">
                            <option value="Viola Gaspare da Salò 41.5 cm">
                            <option value="Viola Andrea Guarneri 1676 'Conte Vitale'">
                            <option value="Violoncello Domenico Montagnana 1739 'Sleeping Beauty'">
                            <option value="Violoncello Matteo Gofriller 1700">
                            <option value="Violoncello Stradivari 1707 'Forma B'">
                        </datalist>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Committente / Destinatario</label>
                        <input type="text" id="f_cost_committente" list="cost_committenti_list" class="form-control" required value="In Vendita (Disponibile)" placeholder="Es. In Vendita / Solista...">
                        <datalist id="cost_committenti_list">
                            <option value="In Vendita (Disponibile)">
                            ${clientsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Fase Attuale di Lavorazione</label>
                        <input type="text" id="f_cost_faseAttuale" list="cost_fasi_list" class="form-control" required value="Intavolazione & Scultura Riccio" placeholder="Es. Intavolazione & Scultura Riccio">
                        <datalist id="cost_fasi_list">
                            <option value="Scelta e Preparazione Legni">
                            <option value="Piallatura Giunta Fondo e Tavola">
                            <option value="Sbozzatura & Sesto Bombature">
                            <option value="Scavo Spessori Tavola & Fondo">
                            <option value="Taglio Effi & Incatenatura">
                            <option value="Fasce, Zocchetti & Controfasce">
                            <option value="Intavolazione & Scultura Riccio">
                            <option value="Filettatura & Chiusura Cassa">
                            <option value="Incastro Manico & Tastiera in Ebano">
                            <option value="Preparazione a Vernice (Imprimitura)">
                            <option value="Verniciatura ad Olio (Mano 1/12)">
                            <option value="Verniciatura ad Olio (Mani Finali)">
                            <option value="Lucidatura & Essiccazione UV">
                            <option value="Montatura, Ponticello & Anima">
                            <option value="Messa a Punto Acustica Finale">
                        </datalist>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>🌲 Legno Tavola Armonica</label>
                        <input type="text" id="f_cost_legnoTavola" list="cost_tavola_list" class="form-control" required value="Abete Rosso Val di Fiemme 2012 (Stagionatura 14 anni)" placeholder="Es. Abete Rosso Val di Fiemme 2012">
                        <datalist id="cost_tavola_list">
                            <option value="Abete Rosso Val di Fiemme 2012 (Stagionatura 14 anni)">
                            <option value="Abete della Val di Non 2005">
                            <option value="Abete Paneveggio 2015">
                            <option value="Abete Rosso Svizzero (Val Müstair)">
                            ${woodsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>🍁 Legno Fondo & Fasce</label>
                        <input type="text" id="f_cost_legnoFondo" list="cost_fondo_list" class="form-control" required value="Acero Marezzato Balcanico 2008 Pezzo Unico" placeholder="Es. Acero Marezzato Balcanico 2008">
                        <datalist id="cost_fondo_list">
                            <option value="Acero Marezzato Balcanico 2008 Pezzo Unico">
                            <option value="Acero Bosniaco a Taglio di Quarto">
                            <option value="Pioppo Marezzato Maschio">
                            <option value="Acero Campestre Antico a 2 Pezzi">
                            ${woodsList}
                        </datalist>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>🔊 Frequenza / Nota Risonanza Tavola (Chladni)</label>
                        <input type="text" id="f_cost_frequenzaTavola" list="cost_freq_list" class="form-control" value="F# (288 Hz)" placeholder="Es. F# (288 Hz)">
                        <datalist id="cost_freq_list">
                            <option value="F# (288 Hz)">
                            <option value="F (275 Hz)">
                            <option value="E (260 Hz)">
                            <option value="G (300 Hz)">
                            <option value="D (144 Hz)">
                            <option value="C# (138 Hz)">
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>⚖️ Peso Tavola Armonica</label>
                        <input type="text" id="f_cost_pesoTavola" class="form-control" value="64.2 g (senza catena)" placeholder="Es. 64.2 g (senza catena)">
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Avanzamento Lavorazione: <strong id="f_cost_progVal" style="color:var(--accent-gold);">60%</strong></label>
                        <input type="range" id="f_cost_progresso" class="form-control" min="0" max="100" value="60" oninput="document.getElementById('f_cost_progVal').innerText = this.value + '%'" style="cursor:pointer; padding:0.4rem;">
                    </div>
                    <div class="form-group">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:0.5rem;">
                            <div>
                                <label>📅 Data Inizio</label>
                                <input type="date" id="f_cost_dataInizio" class="form-control" value="${todayIso}">
                            </div>
                            <div>
                                <label>🏁 Consegna Prevista</label>
                                <input type="date" id="f_cost_consegnaPrevista" class="form-control" value="${estDeliveryIso}">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label>📝 Note Tecniche & Dettagli di Liuteria</label>
                    <textarea id="f_cost_note" class="form-control" placeholder="Specifiche su bombature (15.2mm), spessori tavola (2.4-4.2mm), modello anima, vernice a olio programmata..."></textarea>
                </div>

                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem; font-size:1rem; padding:0.8rem;">
                    <i class="lucide-hammer"></i> Registra Strumento in Costruzione
                </button>
            </form>
        `;
    } else if (collectionName === 'gestioneContabilita') {
        const existingFat = (window.atelierDB && window.atelierDB.data.gestioneContabilita) || [];
        const suggestedFatNum = `FATT-${new Date().getFullYear()}-${String(existingFat.length + 42).padStart(3, '0')}`;
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'gestioneContabilita')">
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>N° Fattura / Ricevuta</label>
                        <input type="text" id="f_fat_numero" class="form-control" required value="${suggestedFatNum}" placeholder="Es. FATT-2026-045">
                    </div>
                    <div class="form-group" style="flex:2;">
                        <label>Cliente Intestatario</label>
                        <input type="text" id="f_fat_cliente" list="fat_clienti_list" class="form-control" required placeholder="Es. Marco Rossi / Orchestra...">
                        <datalist id="fat_clienti_list">
                            ${clientsList}
                        </datalist>
                    </div>
                </div>
                <div class="form-group">
                    <label>Causale Lavoro / Prestazione</label>
                    <input type="text" id="f_fat_causale" class="form-control" required placeholder="Es. Vendita Violino Master Opus 42 + Certificato di Autenticità">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Importo (€)</label>
                        <input type="number" id="f_fat_importo" class="form-control" required value="18000" min="0" step="10">
                    </div>
                    <div class="form-group">
                        <label>Metodo di Pagamento</label>
                        <select id="f_fat_metodo" class="form-control">
                            <option value="Bonifico Bancario">Bonifico Bancario</option>
                            <option value="Carta di Credito">Carta di Credito</option>
                            <option value="Assegno Circolare">Assegno Circolare</option>
                            <option value="Contanti">Contanti</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Stato Pagamento</label>
                        <select id="f_fat_stato" class="form-control">
                            <option value="In Sospeso">In Sospeso</option>
                            <option value="Pagata">Pagata</option>
                            <option value="Annullata">Annullata</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Data Emissione</label>
                        <input type="date" id="f_fat_data" class="form-control" required value="${todayIso}">
                    </div>
                    <div class="form-group">
                        <label>Data Scadenza Pagamento</label>
                        <input type="date" id="f_fat_scadenza" class="form-control" required value="${nextMonthIso}">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-file-plus"></i> Emetti e Registra Fattura
                </button>
            </form>
        `;
    } else if (collectionName === 'laboratorio') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'laboratorio')">
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>Postazione / Banco di Lavoro</label>
                        <input type="text" id="f_lab_banco" class="form-control" required placeholder="Es. Banco C - Finitura & Verniciatura">
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Assegnato A (Operatore)</label>
                        <select id="f_lab_assegnatoA" class="form-control">
                            <option value="Maestro Liutaio">Maestro Liutaio</option>
                            <option value="Restauratore Capo">Restauratore Capo</option>
                            <option value="Assistente Atelier">Assistente Atelier</option>
                            <option value="Allievo Bottega">Allievo Bottega</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Strumento in Lavorazione</label>
                        <input type="text" id="f_lab_strumento" list="lab_str_list" class="form-control" required placeholder="Es. Violino Opus 45">
                        <datalist id="lab_str_list">
                            ${instrumentsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Stato Stazione</label>
                        <select id="f_lab_statoStazione" class="form-control">
                            <option value="Attivo">Attivo</option>
                            <option value="In Manutenzione">In Manutenzione</option>
                            <option value="Libero / Disponibile">Libero / Disponibile</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Condizioni Ambientali Rilevate</label>
                    <input type="text" id="f_lab_condizioni" class="form-control" value="${currentClimateString}" placeholder="Es. 22.1°C / 48.5% RH (Ottimale)">
                </div>
                <div class="form-group">
                    <label>Utensili & Attrezzature in Uso (separate da virgola)</label>
                    <textarea id="f_lab_utensili" class="form-control" placeholder="Es. Pialletto a botte 8mm, Sgorga Dastra #7 18mm, Colla di pelle 60°C, Spessimetro rapido"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-gauge"></i> Registra Stazione Laboratorio
                </button>
            </form>
        `;
    } else if (collectionName === 'magazzinoLegno') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'magazzinoLegno')">
                <div class="form-group">
                    <label>Essenza Legno da Risonanza</label>
                    <input type="text" id="f_essenza" list="leg_essenze_list" class="form-control" required placeholder="Es. Abete Rosso da Risonanza (Picea abies)">
                    <datalist id="leg_essenze_list">
                        <option value="Abete Rosso da Risonanza (Picea abies)">
                        <option value="Acero Marezzato Balcanico (Acer pseudoplatanus)">
                        <option value="Ebano Nero Naturale (Diospyros ebenum)">
                        <option value="Pernambuco Premium (Paubrasilia echinata)">
                        <option value="Pioppo Marezzato Maschio">
                        <option value="Salice per Controfasce e Zocchetti">
                    </datalist>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Provenienza / Foresta</label>
                        <input type="text" id="f_provenienza" class="form-control" placeholder="Es. Foresta dei Violini - Val di Fiemme (TN)">
                    </div>
                    <div class="form-group">
                        <label>Anno Taglio</label>
                        <input type="number" id="f_annoTaglio" class="form-control" value="2012">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipologia Pezzo / Formato</label>
                        <select id="f_tipoPezzo" class="form-control">
                            <option value="Spaccato a Cuneo per Tavola Violino">Spaccato a Cuneo per Tavola Violino</option>
                            <option value="Set Fondo Unico + Fasce + Manico">Set Fondo Unico + Fasce + Manico</option>
                            <option value="Fondo a Due Pezzi Speculari + Fasce">Fondo a Due Pezzi Speculari + Fasce</option>
                            <option value="Blocchetti per Tastiera Violoncello e Violino">Blocchetti per Tastiera</option>
                            <option value="Bacchette Ottagonali per Archi Violino">Bacchette per Archi</option>
                            <option value="Tavola e Fondo per Violoncello">Set per Violoncello</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Quantità Pezzi</label>
                        <input type="number" id="f_quantita" class="form-control" value="5" min="1">
                    </div>
                    <div class="form-group">
                        <label>Prezzo Unitario (€)</label>
                        <input type="number" id="f_prezzoUnitario" class="form-control" value="350">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Densità Legno</label>
                        <input type="text" id="f_densita" class="form-control" value="0.38 g/cm³" placeholder="Es. 0.38 g/cm³">
                    </div>
                    <div class="form-group">
                        <label>Velocità del Suono (m/s)</label>
                        <input type="text" id="f_velocitaSuono" class="form-control" value="5400 m/s" placeholder="Es. 5450 m/s">
                    </div>
                    <div class="form-group">
                        <label>Stato Conservazione</label>
                        <select id="f_leg_stato" class="form-control">
                            <option value="Stagionato / PRONTO">Stagionato / PRONTO</option>
                            <option value="In Stagionatura">In Stagionatura</option>
                            <option value="Rarità / PRONTO">Rarità / PRONTO</option>
                            <option value="In Giacenza">In Giacenza</option>
                        </select>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-trees"></i> Registra Legno nel Magazzino Tonewood
                </button>
            </form>
        `;
    } else if (collectionName === 'magazzinoStrumenti') {
        const rndCode = `VIO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'magazzinoStrumenti')">
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>Codice Identificativo</label>
                        <input type="text" id="f_str_codice" class="form-control" required value="${rndCode}">
                    </div>
                    <div class="form-group" style="flex:2;">
                        <label>Nome Strumento</label>
                        <input type="text" id="f_str_nome" class="form-control" required placeholder="Es. Violino Master 'La Fenice' Opus 45">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipologia</label>
                        <select id="f_str_tipologia" class="form-control">
                            <option value="Violino 4/4">Violino 4/4</option>
                            <option value="Viola">Viola</option>
                            <option value="Violoncello">Violoncello</option>
                            <option value="Contrabbasso">Contrabbasso</option>
                            <option value="Arco da Concerto">Arco da Concerto</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Modello</label>
                        <input type="text" id="f_str_modello" class="form-control" placeholder="Es. Stradivari 1715 Cremonese">
                    </div>
                    <div class="form-group">
                        <label>Anno Costruzione</label>
                        <input type="number" id="f_str_anno" class="form-control" value="${new Date().getFullYear()}">
                    </div>
                    <div class="form-group">
                        <label>Prezzo (€)</label>
                        <input type="number" id="f_str_prezzo" class="form-control" value="16000">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Stato Strumento</label>
                        <select id="f_str_stato" class="form-control">
                            <option value="Disponibile in Showroom">Disponibile in Showroom</option>
                            <option value="In Prova presso Cliente">In Prova presso Cliente</option>
                            <option value="Venduto">Venduto</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Certificato</label>
                        <input type="text" id="f_str_certificato" class="form-control" value="Certificato di Autenticità Liuteria De Lorenzi">
                    </div>
                </div>
                <div class="form-group">
                    <label>Vernice & Finitura</label>
                    <input type="text" id="f_str_vernice" class="form-control" placeholder="Es. Olio di ambra e resine naturali colore ambrato dorato">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-music"></i> Registra Strumento Finito in Showroom
                </button>
            </form>
        `;
    } else if (collectionName === 'media') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'media')">
                <div class="form-group">
                    <label>Titolo File / Registrazione Acustica</label>
                    <input type="text" id="f_med_titolo" class="form-control" required placeholder="Es. Macro Scultura Riccio e Filetto Violino Opus 42">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Tipologia Media</label>
                        <select id="f_med_tipo" class="form-control">
                            <option value="Foto High-Res">Foto High-Res</option>
                            <option value="Audio Lossless">Audio Lossless (Test Acustico)</option>
                            <option value="Video 4K">Video 4K (Lavorazione)</option>
                            <option value="Rilievo CT-Scan">Rilievo CT-Scan</option>
                            <option value="Disegno Vettoriale">Disegno Vettoriale Blueprint</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Categoria</label>
                        <select id="f_med_categoria" class="form-control">
                            <option value="Finitura & Dettagli">Finitura & Dettagli</option>
                            <option value="Test Acustici">Test Acustici</option>
                            <option value="Lavorazione Atelier">Lavorazione Atelier</option>
                            <option value="Certificati & Foto Ufficiali">Certificati & Foto Ufficiali</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Formato File</label>
                        <input type="text" id="f_med_formato" class="form-control" value="JPG / 4K" placeholder="Es. JPG / 4K, FLAC 24bit/96kHz, MP4">
                    </div>
                    <div class="form-group">
                        <label>Dimensione File</label>
                        <input type="text" id="f_med_dimensione" class="form-control" value="15 MB" placeholder="Es. 15 MB, 88 MB">
                    </div>
                    <div class="form-group">
                        <label>URL / Percorso Immagine</label>
                        <input type="text" id="f_med_url" class="form-control" value="./assets/lutherie_banner.png" placeholder="Es. ./assets/...">
                    </div>
                </div>
                <div class="form-group">
                    <label>Descrizione Tecnica & Note Scatto/Audio</label>
                    <textarea id="f_med_descrizione" class="form-control" placeholder="Dettagli sulle condizioni di ripresa o registrazione, microfoni usati, macro ottica..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-upload"></i> Carica Media nell'Archivio
                </button>
            </form>
        `;
    } else if (collectionName === 'report') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'report')">
                <div class="form-group">
                    <label>Titolo Report / Analisi</label>
                    <input type="text" id="f_rep_titolo" class="form-control" required placeholder="Es. Rendimento e Produzione Trimestre Q4 2026">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Periodo di Riferimento</label>
                        <input type="text" id="f_rep_periodo" class="form-control" required placeholder="Es. Ottobre - Dicembre 2026">
                    </div>
                    <div class="form-group">
                        <label>Strumenti Costruiti</label>
                        <input type="number" id="f_rep_costruiti" class="form-control" value="3">
                    </div>
                    <div class="form-group">
                        <label>Restauri Completati</label>
                        <input type="number" id="f_rep_restaurati" class="form-control" value="5">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ricavo Totale (€)</label>
                        <input type="number" id="f_rep_ricavo" class="form-control" value="48000">
                    </div>
                    <div class="form-group">
                        <label>Margine Netto</label>
                        <input type="text" id="f_rep_margine" class="form-control" value="68%" placeholder="Es. 70%">
                    </div>
                    <div class="form-group">
                        <label>Top Performance / Strumento Faro</label>
                        <input type="text" id="f_rep_top" class="form-control" value="Violino Guarneri Lord Wilton Opus 42">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-bar-chart-3"></i> Salva Report Statistico
                </button>
            </form>
        `;
    } else if (collectionName === 'restauro') {
        const existingRes = (window.atelierDB && window.atelierDB.data.restauro) || [];
        const suggestedResCodice = `RST-${new Date().getFullYear()}-${String(existingRes.length + 8).padStart(2, '0')}`;
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'restauro')">
                <div class="form-row">
                    <div class="form-group" style="flex:1;">
                        <label>Codice Scheda Restauro</label>
                        <input type="text" id="f_res_codice" class="form-control" required value="${suggestedResCodice}" placeholder="Es. RST-2026-10">
                    </div>
                    <div class="form-group" style="flex:2;">
                        <label>Strumento Storico da Restaurare</label>
                        <input type="text" id="f_res_strumento" class="form-control" required placeholder="Es. Viola d'Amore Anonima Bolognese (XVIII Secolo)">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Proprietario / Committente</label>
                        <input type="text" id="f_res_proprietario" list="res_clienti_list" class="form-control" required placeholder="Es. Collezione Privata / Musicista">
                        <datalist id="res_clienti_list">
                            ${clientsList}
                        </datalist>
                    </div>
                    <div class="form-group">
                        <label>Stato Intervento</label>
                        <select id="f_res_stato" class="form-control">
                            <option value="Diagnosi & Preventivo">Diagnosi & Preventivo</option>
                            <option value="In Corso (Apertura Cassa)">In Corso (Apertura Cassa)</option>
                            <option value="In Corso (Fase Tacchetti)">In Corso (Fase Tacchetti)</option>
                            <option value="Chiusura Cassa e Ritocco Vernice">Chiusura Cassa e Ritocco Vernice</option>
                            <option value="Messa a Punto & Consegna">Messa a Punto & Consegna</option>
                            <option value="Completato">Completato</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Diagnosi Danni & Stato di Conservazione</label>
                    <textarea id="f_res_diagnosi" class="form-control" required placeholder="Es. Spaccatura della tavola armonica vicino all'anima, vernice originale degradata, catena collassata..."></textarea>
                </div>
                <div class="form-group">
                    <label>Interventi di Restauro Previsti</label>
                    <textarea id="f_res_interventi" class="form-control" required placeholder="Es. Apertura cassa con lama riscaldata, pulizia colle antiche, posa tacchetti in abete di risonanza, sostituzione catena..."></textarea>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Preventivo Economico (€)</label>
                        <input type="number" id="f_res_preventivo" class="form-control" value="3500">
                    </div>
                    <div class="form-group">
                        <label>Data Consegna Stimata</label>
                        <input type="date" id="f_res_consegna" class="form-control" value="${nextMonthIso}">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-sparkles"></i> Registra Scheda di Restauro
                </button>
            </form>
        `;
    } else if (collectionName === 'social') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'social')">
                <div class="form-group">
                    <label>Titolo / Argomento Post</label>
                    <input type="text" id="f_soc_titolo" class="form-control" required placeholder="Es. Showcase Scultura Riccio e Filetto Violino Opus 42">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Piattaforma</label>
                        <select id="f_soc_piattaforma" class="form-control">
                            <option value="Instagram">Instagram</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Facebook">Facebook</option>
                            <option value="TikTok">TikTok</option>
                            <option value="LinkedIn">LinkedIn</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Stato Programmazione</label>
                        <select id="f_soc_stato" class="form-control">
                            <option value="Programmato">Programmato</option>
                            <option value="Bozza">Bozza</option>
                            <option value="In Revisione">In Revisione</option>
                            <option value="Pubblicato">Pubblicato</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Data e Ora Pubblicazione</label>
                        <input type="datetime-local" id="f_soc_data" class="form-control" value="${todayDateTimeLocal}">
                    </div>
                    <div class="form-group">
                        <label>Stima Likes / Interazioni</label>
                        <input type="text" id="f_soc_likes" class="form-control" value="1.5K" placeholder="Es. 2.4K">
                    </div>
                </div>
                <div class="form-group">
                    <label>Hashtag Strategici</label>
                    <input type="text" id="f_soc_hashtag" class="form-control" value="#lutherie #cremona #violinmaker #tonewood #handmade #stradivari" placeholder="Es. #lutherie #cremona...">
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">
                    <i class="lucide-share-2"></i> Programma Pubblicazione Social
                </button>
            </form>
        `;
    } else {
        // Generic fallback form
        formHTML = `
            <form onsubmit="window.saveNewRecordGeneric(event, '${collectionName}')">
                <div class="form-group">
                    <label>Titolo / Descrizione Voce</label>
                    <input type="text" id="f_generic_title" class="form-control" required placeholder="Inserisci titolo...">
                </div>
                <div class="form-group">
                    <label>Note Aggiuntive</label>
                    <textarea id="f_generic_note" class="form-control" placeholder="Dettagli..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">Salva Inserimento</button>
            </form>
        `;
    }

    modalBody.innerHTML = formHTML;
    modalOverlay.classList.add("active");
};

window.closeModal = function() {
    document.getElementById("modalOverlay").classList.remove("active");
};

window.saveNewRecord = function(e, collectionName) {
    e.preventDefault();
    if (collectionName === 'biblioteca') {
        const item = {
            id: "bib-" + Date.now(),
            titolo: document.getElementById("f_bib_titolo").value.trim(),
            autore: document.getElementById("f_bib_autore").value.trim(),
            categoria: document.getElementById("f_bib_categoria").value,
            anno: parseInt(document.getElementById("f_bib_anno").value) || new Date().getFullYear(),
            formato: document.getElementById("f_bib_formato").value,
            pagine: parseInt(document.getElementById("f_bib_pagine").value) || 1,
            note: document.getElementById("f_bib_note").value.trim(),
            tags: (document.getElementById("f_bib_tags").value || "").split(',').map(t => t.trim()).filter(Boolean)
        };
        window.atelierDB.addItem("biblioteca", item);
    } else if (collectionName === 'calendarioAppuntamenti') {
        const item = {
            id: "app-" + Date.now(),
            cliente: document.getElementById("f_app_cliente").value.trim(),
            data: document.getElementById("f_app_data").value || new Date().toISOString().split('T')[0],
            ora: document.getElementById("f_app_ora").value || "10:30",
            tipo: document.getElementById("f_app_tipo").value || "Incontro",
            strumento: document.getElementById("f_app_strumento").value.trim() || "-",
            stato: document.getElementById("f_app_stato").value || "Confermato",
            note: document.getElementById("f_app_note").value.trim()
        };
        window.atelierDB.addItem("calendarioAppuntamenti", item);
    } else if (collectionName === 'calendarioLavorazioni') {
        const item = {
            id: "lav-" + Date.now(),
            titolo: document.getElementById("f_lav_titolo").value.trim(),
            responsabile: document.getElementById("f_lav_responsabile").value || "Maestro Liutaio",
            inizio: document.getElementById("f_lav_inizio").value || new Date().toISOString().split('T')[0],
            fine: document.getElementById("f_lav_fine").value || "",
            progresso: parseInt(document.getElementById("f_lav_progresso").value) || 0,
            priorita: document.getElementById("f_lav_priorita").value || "Media",
            fase: document.getElementById("f_lav_fase").value.trim() || "Lavorazione in corso",
            strumento: document.getElementById("f_lav_strumento").value.trim() || "-"
        };
        window.atelierDB.addItem("calendarioLavorazioni", item);
    } else if (collectionName === 'clienti') {
        const strList = (document.getElementById("f_strumentiPosseduti").value || "Nuovo Cliente")
            .split(',').map(s => s.trim()).filter(Boolean);
        const item = {
            id: "cli-" + Date.now(),
            nome: document.getElementById("f_nome").value.trim(),
            ruolo: document.getElementById("f_ruolo").value.trim() || "Cliente Atelier",
            citta: document.getElementById("f_citta").value.trim() || "Italia",
            email: document.getElementById("f_email").value.trim() || "-",
            telefono: document.getElementById("f_telefono").value.trim() || "-",
            strumentiPosseduti: strList.length ? strList : ["Nuovo Cliente"],
            spesaTotale: parseFloat(document.getElementById("f_spesaTotale").value) || 0,
            note: document.getElementById("f_note").value.trim() || "Nuova anagrafica cliente."
        };
        window.atelierDB.addItem("clienti", item);
    } else if (collectionName === 'costruzione') {
        const item = {
            id: "cost-" + Date.now(),
            opNumero: document.getElementById("f_cost_opNumero").value.trim() || `Opus ${Date.now().toString().slice(-2)}`,
            modello: document.getElementById("f_cost_modello").value.trim() || "Violino d'Autore",
            committente: document.getElementById("f_cost_committente").value.trim() || "In Vendita (Disponibile)",
            legnoTavola: document.getElementById("f_cost_legnoTavola").value.trim() || "Abete Rosso Val di Fiemme",
            legnoFondo: document.getElementById("f_cost_legnoFondo").value.trim() || "Acero Marezzato Balcanico",
            faseAttuale: document.getElementById("f_cost_faseAttuale").value.trim() || "Intavolazione & Scultura Riccio",
            progresso: Math.min(100, Math.max(0, parseInt(document.getElementById("f_cost_progresso").value) || 0)),
            frequenzaTavola: document.getElementById("f_cost_frequenzaTavola").value.trim() || "F# (288 Hz)",
            pesoTavola: document.getElementById("f_cost_pesoTavola").value.trim() || "64.2 g (senza catena)",
            dataInizio: document.getElementById("f_cost_dataInizio").value || new Date().toISOString().split('T')[0],
            consegnaPrevista: document.getElementById("f_cost_consegnaPrevista").value || "",
            note: document.getElementById("f_cost_note") ? document.getElementById("f_cost_note").value.trim() : ""
        };
        window.atelierDB.addItem("costruzione", item);
    } else if (collectionName === 'gestioneContabilita') {
        const item = {
            id: "fat-" + Date.now(),
            numero: document.getElementById("f_fat_numero").value.trim(),
            cliente: document.getElementById("f_fat_cliente").value.trim(),
            causale: document.getElementById("f_fat_causale").value.trim(),
            importo: parseFloat(document.getElementById("f_fat_importo").value) || 0,
            data: document.getElementById("f_fat_data").value || new Date().toISOString().split('T')[0],
            scadenza: document.getElementById("f_fat_scadenza").value || "",
            stato: document.getElementById("f_fat_stato").value || "In Sospeso",
            metodo: document.getElementById("f_fat_metodo").value || "Bonifico Bancario"
        };
        window.atelierDB.addItem("gestioneContabilita", item);
    } else if (collectionName === 'laboratorio') {
        const utensils = (document.getElementById("f_lab_utensili").value || "")
            .split(',').map(u => u.trim()).filter(Boolean);
        const item = {
            id: "lab-" + Date.now(),
            banco: document.getElementById("f_lab_banco").value.trim(),
            assegnatoA: document.getElementById("f_lab_assegnatoA").value || "Maestro Liutaio",
            strumentoInLavorazione: document.getElementById("f_lab_strumento").value.trim() || "-",
            condizioniAmbiente: document.getElementById("f_lab_condizioni").value.trim(),
            utensiliInUso: utensils.length ? utensils : ["Pialletti e sgorbie standard"],
            statoStazione: document.getElementById("f_lab_statoStazione").value || "Attivo"
        };
        window.atelierDB.addItem("laboratorio", item);
    } else if (collectionName === 'magazzinoLegno') {
        const item = {
            id: "leg-" + Date.now(),
            essenza: document.getElementById("f_essenza").value.trim(),
            provenienza: document.getElementById("f_provenienza").value.trim() || "Italia",
            annoTaglio: parseInt(document.getElementById("f_annoTaglio").value) || 2020,
            stagionaturaAnni: new Date().getFullYear() - (parseInt(document.getElementById("f_annoTaglio").value) || 2020),
            tipoPezzo: document.getElementById("f_tipoPezzo").value || "Set da Risonanza",
            quantita: parseInt(document.getElementById("f_quantita").value) || 1,
            densita: document.getElementById("f_densita").value.trim() || "0.38 g/cm³",
            velocitaSuono: document.getElementById("f_velocitaSuono").value.trim() || "5200 m/s",
            prezzoUnitario: parseFloat(document.getElementById("f_prezzoUnitario").value) || 100,
            stato: document.getElementById("f_leg_stato").value || "Stagionato / PRONTO"
        };
        window.atelierDB.addItem("magazzinoLegno", item);
    } else if (collectionName === 'magazzinoStrumenti') {
        const item = {
            id: "str-" + Date.now(),
            codice: document.getElementById("f_str_codice").value.trim() || `VIO-${Date.now().toString().slice(-4)}`,
            nome: document.getElementById("f_str_nome").value.trim(),
            tipologia: document.getElementById("f_str_tipologia").value || "Violino 4/4",
            modello: document.getElementById("f_str_modello").value.trim() || "Modello Classico",
            annoCostruzione: parseInt(document.getElementById("f_str_anno") ? document.getElementById("f_str_anno").value : new Date().getFullYear()) || new Date().getFullYear(),
            prezzo: parseFloat(document.getElementById("f_str_prezzo").value) || 15000,
            stato: document.getElementById("f_str_stato").value || "Disponibile in Showroom",
            certificato: document.getElementById("f_str_certificato").value.trim() || "Presente",
            vernice: document.getElementById("f_str_vernice").value.trim() || "Finitura tradizionale a olio"
        };
        window.atelierDB.addItem("magazzinoStrumenti", item);
    } else if (collectionName === 'media') {
        const item = {
            id: "med-" + Date.now(),
            titolo: document.getElementById("f_med_titolo").value.trim(),
            tipo: document.getElementById("f_med_tipo").value,
            formato: document.getElementById("f_med_formato").value.trim() || "JPG / 4K",
            dimensione: document.getElementById("f_med_dimensione").value.trim() || "15 MB",
            categoria: document.getElementById("f_med_categoria").value,
            url: document.getElementById("f_med_url").value.trim() || "./assets/lutherie_banner.png",
            descrizione: document.getElementById("f_med_descrizione").value.trim()
        };
        window.atelierDB.addItem("media", item);
    } else if (collectionName === 'report') {
        const item = {
            id: "rep-" + Date.now(),
            titolo: document.getElementById("f_rep_titolo").value.trim(),
            periodo: document.getElementById("f_rep_periodo").value.trim(),
            strumentiCostruiti: parseInt(document.getElementById("f_rep_costruiti").value) || 0,
            strumentiRestaurati: parseInt(document.getElementById("f_rep_restaurati").value) || 0,
            ricavoTotale: parseFloat(document.getElementById("f_rep_ricavo").value) || 0,
            margineNetto: document.getElementById("f_rep_margine").value.trim() || "65%",
            indicatoreTop: document.getElementById("f_rep_top").value.trim() || "Attività Atelier"
        };
        window.atelierDB.addItem("report", item);
    } else if (collectionName === 'restauro') {
        const item = {
            id: "res-" + Date.now(),
            codice: document.getElementById("f_res_codice").value.trim(),
            strumento: document.getElementById("f_res_strumento").value.trim(),
            proprietario: document.getElementById("f_res_proprietario").value.trim(),
            diagnosi: document.getElementById("f_res_diagnosi").value.trim(),
            interventiPrevisti: document.getElementById("f_res_interventi").value.trim(),
            statoIntervento: document.getElementById("f_res_stato").value,
            preventivo: parseFloat(document.getElementById("f_res_preventivo").value) || 0,
            consegnaPrevista: document.getElementById("f_res_consegna").value || ""
        };
        window.atelierDB.addItem("restauro", item);
    } else if (collectionName === 'social') {
        const item = {
            id: "soc-" + Date.now(),
            titolo: document.getElementById("f_soc_titolo").value.trim(),
            piattaforma: document.getElementById("f_soc_piattaforma").value,
            dataProgrammata: document.getElementById("f_soc_data").value || new Date().toISOString(),
            hashtag: document.getElementById("f_soc_hashtag").value.trim(),
            likesPrevisti: document.getElementById("f_soc_likes").value.trim() || "1.0K",
            stato: document.getElementById("f_soc_stato").value
        };
        window.atelierDB.addItem("social", item);
    }

    window.closeModal();
    window.showToast("Nuovo elemento salvato con successo!");
    if (window.appController && window.appController.updateHeaderStats) {
        window.appController.updateHeaderStats();
    }
    if (window.appController.activeModuleId === collectionName) {
        window.appController.openModule(collectionName);
    }
};

window.saveNewRecordGeneric = function(e, collectionName) {
    e.preventDefault();
    const title = document.getElementById("f_generic_title").value;
    const note = document.getElementById("f_generic_note").value;

    const newItem = {
        id: collectionName.slice(0, 3) + "-" + Date.now(),
        titolo: title,
        nome: title,
        note: note,
        data: new Date().toISOString().split('T')[0],
        stato: "Attivo"
    };

    window.atelierDB.addItem(collectionName, newItem);
    window.closeModal();
    window.showToast("Elemento aggiunto con successo!");
    if (window.appController && window.appController.updateHeaderStats) {
        window.appController.updateHeaderStats();
    }
    if (window.appController.activeModuleId === collectionName) {
        window.appController.openModule(collectionName);
    }
};

// Universal Record Management (Delete & Progress update across all modules)
window.deleteRecord = function(collection, id, label) {
    if (confirm(`Sei sicuro di voler eliminare "${label || 'questo elemento'}" da ${collection}?`)) {
        window.atelierDB.removeItem(collection, id);
        window.showToast(`${label || 'Elemento'} eliminato con successo!`);
        if (window.appController && window.appController.activeModuleId === collection) {
            window.appController.openModule(collection);
        }
    }
};

window.quickUpdateProgress = function(collection, id, delta, label) {
    const list = window.atelierDB.data[collection] || [];
    const item = list.find(i => i.id === id);
    if (!item) return;
    const currentProg = parseInt(item.progresso) || 0;
    const newProg = Math.min(100, Math.max(0, currentProg + delta));
    window.atelierDB.updateItem(collection, id, { progresso: newProg });
    window.showToast(`${label || item.titolo || item.opNumero || 'Lavorazione'}: progresso avanzato al ${newProg}%`);
    if (window.appController && window.appController.activeModuleId === collection) {
        window.appController.openModule(collection);
    }
};

window.quickUpdateCostruzione = function(id, delta) {
    window.quickUpdateProgress('costruzione', id, delta);
};

window.deleteCostruzioneItem = function(id, opNumero) {
    window.deleteRecord('costruzione', id, opNumero);
};

// ==========================================================================
// TELEMETRY & CLIMATE INTEGRATION MODAL CONTROLS (MQTT / HOME ASSISTANT)
// ==========================================================================

window.telemetryActiveTab = window.telemetryActiveTab || 'mqtt';

window.switchTelemetryTab = function(tab) {
    window.telemetryActiveTab = tab;
    const tabMqttBtn = document.getElementById("tabBtnMqtt");
    const tabHaBtn = document.getElementById("tabBtnHa");
    const secMqtt = document.getElementById("tabSectionMqtt");
    const secHa = document.getElementById("tabSectionHa");

    if (tab === 'mqtt') {
        if (tabMqttBtn) { tabMqttBtn.style.background = 'var(--accent-amber)'; tabMqttBtn.style.color = '#000'; }
        if (tabHaBtn) { tabHaBtn.style.background = 'rgba(255,255,255,0.06)'; tabHaBtn.style.color = 'var(--text-secondary)'; }
        if (secMqtt) secMqtt.style.display = 'block';
        if (secHa) secHa.style.display = 'none';
    } else {
        if (tabMqttBtn) { tabMqttBtn.style.background = 'rgba(255,255,255,0.06)'; tabMqttBtn.style.color = 'var(--text-secondary)'; }
        if (tabHaBtn) { tabHaBtn.style.background = 'var(--accent-amber)'; tabHaBtn.style.color = '#000'; }
        if (secMqtt) secMqtt.style.display = 'none';
        if (secHa) secHa.style.display = 'block';
    }
};

window.openHaModal = function() {
    const modalOverlay = document.getElementById("haModalOverlay");
    const modalBody = document.getElementById("haModalBody");
    if (!modalOverlay || !modalBody || !window.haService) return;

    const config = window.haService.getConfig();
    const currentReadings = window.haService.lastReadings;
    const activeTab = window.telemetryActiveTab || config.sourceType || 'mqtt';

    modalBody.innerHTML = `
        <form onsubmit="window.saveHaConfig(event)">
            <!-- Top Status Card -->
            <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); padding:1.2rem; border-radius:12px; margin-bottom:1.2rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                <div>
                    <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">Stato Sensori Rete Locale Bottega</div>
                    <div style="display:flex; align-items:center; gap:0.6rem; margin-top:0.3rem;">
                        <span class="status-dot" style="background:${window.haService.status === 'connected' ? 'var(--accent-emerald)' : window.haService.status === 'simulated' ? 'var(--accent-gold)' : '#f43f5e'};"></span>
                        <strong style="color:#fff; font-size:1.05rem;">
                            ${window.haService.status === 'connected' ? 'Sensore Bottega: Online' : window.haService.status === 'simulated' ? 'Modalità Simulazione / Demo' : 'Sensori Offline'}
                        </strong>
                    </div>
                    <div style="font-size:0.85rem; color:var(--text-muted); margin-top:0.4rem;">
                        Misurazioni attuali: Temp = <strong style="color:var(--accent-amber);">${currentReadings.temp.toFixed(1)} °C</strong> &bull; Umidità = <strong style="color:var(--accent-cyan);">${currentReadings.humidity.toFixed(1)}% RH</strong> &bull; EMC Legno = <strong style="color:var(--accent-emerald);">${(currentReadings.emc !== undefined ? currentReadings.emc : 11.2).toFixed(1)}%</strong>
                        ${currentReadings.topic ? `<br><small style="color:var(--text-secondary);">Topic attivo: <code>${currentReadings.topic}</code></small>` : ''}
                    </div>
                </div>
                <div style="display:flex; gap:0.5rem;">
                    <button type="button" class="btn btn-secondary" onclick="window.haService.fetchTelemetry(); window.openHaModal();" title="Ricarica telemetria adesso">
                        <i data-lucide="refresh-cw"></i> Sincronizza Ora
                    </button>
                </div>
            </div>

            <!-- Tab Buttons: MQTT vs Home Assistant -->
            <div style="display:flex; gap:0.6rem; margin-bottom:1.2rem; border-bottom:1px solid var(--border-subtle); padding-bottom:0.8rem;">
                <button type="button" id="tabBtnMqtt" onclick="window.switchTelemetryTab('mqtt')" class="btn" style="flex:1; justify-content:center; font-weight:600; font-size:0.85rem; padding:0.6rem; background:${activeTab === 'mqtt' ? 'var(--accent-amber)' : 'rgba(255,255,255,0.06)'}; color:${activeTab === 'mqtt' ? '#000' : 'var(--text-secondary)'}; border:1px solid var(--border-subtle); border-radius:8px;">
                    <i data-lucide="radio"></i> MQTT Broker (192.168.68.108) <span style="font-size:0.7rem; background:rgba(0,0,0,0.25); padding:2px 6px; border-radius:4px; margin-left:4px;">Attivo in Bottega</span>
                </button>
                <button type="button" id="tabBtnHa" onclick="window.switchTelemetryTab('ha')" class="btn" style="flex:1; justify-content:center; font-weight:600; font-size:0.85rem; padding:0.6rem; background:${activeTab === 'ha' ? 'var(--accent-amber)' : 'rgba(255,255,255,0.06)'}; color:${activeTab === 'ha' ? '#000' : 'var(--text-secondary)'}; border:1px solid var(--border-subtle); border-radius:8px;">
                    <i data-lucide="home"></i> Home Assistant REST API
                </button>
            </div>

            <!-- ================= SECTION 1: MQTT BROKER ================= -->
            <div id="tabSectionMqtt" style="display:${activeTab === 'mqtt' ? 'block' : 'none'};">
                <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:0.9rem 1.2rem; margin-bottom:1.2rem; font-size:0.83rem; line-height:1.5;">
                    <strong style="color:var(--accent-emerald); display:flex; align-items:center; gap:0.4rem; margin-bottom:0.3rem;">
                        <i data-lucide="check-circle"></i> Lettura Diretta via MQTT (Consigliata):
                    </strong>
                    <div style="color:var(--text-secondary);">
                        Nella tua rete locale la lettura avviene direttamente tramite il broker <strong>MQTT Mosquitto (192.168.68.108:1883)</strong>.
                        Il gestionale ascolta e decodifica automaticamente i pacchetti di temperatura e umidità inviati da Zigbee2MQTT, Sonoff, Shelly, Tasmota ed ESPHome.
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group" style="flex:2;">
                        <label>Indirizzo Broker MQTT</label>
                        <input type="text" id="ha_mqtt_broker" class="form-control" value="${config.mqttBroker || '192.168.68.108'}" required placeholder="192.168.68.108">
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Porta</label>
                        <input type="number" id="ha_mqtt_port" class="form-control" value="${config.mqttPort || 1883}" required placeholder="1883">
                    </div>
                </div>

                <div class="form-group">
                    <label>Filtro Topic Sensore (opzionale)</label>
                    <input type="text" id="ha_mqtt_topic" class="form-control" value="${config.mqttTopic || ''}" placeholder="# (ascolta tutti i sensori della bottega)">
                    <small style="color:var(--text-muted); font-size:0.75rem; margin-top:0.3rem; display:block;">
                        Lascia vuoto o <code>#</code> per rilevare automaticamente qualsiasi sensore T e H, oppure specifica il topic esatto (es. <code>zigbee2mqtt/sensore_atelier</code>).
                    </small>
                </div>

                <!-- MQTT Action Tools -->
                <div style="display:flex; gap:0.8rem; margin-bottom:1.2rem; flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center; min-width:200px;" onclick="window.showMqttTopics()">
                        <i data-lucide="list"></i> Mostra Topic Rilevati sul Broker
                    </button>
                    <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center; min-width:200px;" onclick="window.testMqttSend()">
                        <i data-lucide="send"></i> Invia Misurazione Test MQTT
                    </button>
                </div>

                <div id="mqtt_action_result" style="display:none; padding:1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1.2rem; line-height:1.5;"></div>
            </div>

            <!-- ================= SECTION 2: HOME ASSISTANT REST API ================= -->
            <div id="tabSectionHa" style="display:${activeTab === 'ha' ? 'block' : 'none'};">
                <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); border-radius:10px; padding:0.9rem 1.2rem; margin-bottom:1.2rem; font-size:0.83rem; line-height:1.5;">
                    <strong style="color:var(--accent-gold); display:flex; align-items:center; gap:0.4rem; margin-bottom:0.3rem;">
                        <i data-lucide="info"></i> Connessione Home Assistant HTTP (Porta 8123):
                    </strong>
                    <div style="color:var(--text-secondary);">
                        Richiede che l'istanza Home Assistant web sia attiva su porta 8123 e che sia fornito un Long-Lived Token. Se le letture avvengono tramite MQTT, usa la prima scheda.
                    </div>
                </div>

                <div class="form-group">
                    <label>Indirizzo IP o Host di Home Assistant</label>
                    <input type="text" id="ha_host" class="form-control" value="${config.host || 'http://192.168.68.108:8123'}" placeholder="http://192.168.68.108:8123">
                </div>

                <div class="form-group">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <label>Token di Accesso di Lunga Durata (Long-Lived Token)</label>
                        <span style="font-size:0.75rem; color:var(--accent-gold);">Profilo Utente &rarr; Sicurezza &rarr; Token</span>
                    </div>
                    <div style="position:relative;">
                        <input type="password" id="ha_token" class="form-control" value="${config.token || ''}" placeholder="Incolla il Bearer Token generato in Home Assistant..." style="padding-right:40px;">
                        <button type="button" onclick="const f=document.getElementById('ha_token'); f.type=f.type==='password'?'text':'password';" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; color:var(--text-muted); cursor:pointer;">
                            <i data-lucide="eye"></i>
                        </button>
                    </div>
                </div>

                <div style="display:flex; gap:0.8rem; margin-bottom:1.2rem;">
                    <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center;" onclick="window.testHaConnection()">
                        <i data-lucide="activity"></i> Test Connessione API
                    </button>
                    <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center;" onclick="window.discoverHaSensors()">
                        <i data-lucide="search"></i> Cerca Sensori T e H
                    </button>
                </div>
                <div id="ha_test_result" style="display:none; padding:1rem; border-radius:8px; font-size:0.85rem; margin-bottom:1.2rem; line-height:1.5;"></div>

                <div class="form-row">
                    <div class="form-group">
                        <label>Entità Sensore Temperatura (T)</label>
                        <input type="text" id="ha_temp_entity" class="form-control" value="${config.tempEntityId || 'sensor.temperatura_laboratorio'}" placeholder="sensor.temperatura_laboratorio">
                        <div id="ha_temp_select_wrap" style="display:none; margin-top:0.4rem;"></div>
                    </div>
                    <div class="form-group">
                        <label>Entità Sensore Umidità (H)</label>
                        <input type="text" id="ha_humidity_entity" class="form-control" value="${config.humidityEntityId || 'sensor.umidita_laboratorio'}" placeholder="sensor.umidita_laboratorio">
                        <div id="ha_hum_select_wrap" style="display:none; margin-top:0.4rem;"></div>
                    </div>
                </div>
            </div>

            <!-- Common General Settings -->
            <div class="form-row" style="margin-top:1rem; border-top:1px solid var(--border-subtle); padding-top:1rem;">
                <div class="form-group">
                    <label>Frequenza di Polling / Lettura</label>
                    <select id="ha_poll_interval" class="form-control">
                        <option value="5" ${config.pollingInterval == 5 ? 'selected' : ''}>Ogni 5 secondi (Tempo Reale)</option>
                        <option value="10" ${config.pollingInterval == 10 ? 'selected' : ''}>Ogni 10 secondi (Consigliato)</option>
                        <option value="30" ${config.pollingInterval == 30 ? 'selected' : ''}>Ogni 30 secondi</option>
                        <option value="60" ${config.pollingInterval == 60 ? 'selected' : ''}>Ogni 1 minuto</option>
                    </select>
                </div>
                <div class="form-group" style="display:flex; flex-direction:column; justify-content:center;">
                    <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer; margin-top:1.5rem;">
                        <input type="checkbox" id="ha_simulation_fallback" ${config.useSimulationFallback !== false ? 'checked' : ''} style="width:18px; height:18px; accent-color:var(--accent-amber);">
                        <span>Simulazione realistica atelier se offline</span>
                    </label>
                </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.8rem; margin-top:1rem;">
                <i data-lucide="check-circle"></i> Salva Configurazione & Collega
            </button>
        </form>
    `;

    modalOverlay.classList.add("active");
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.closeHaModal = function() {
    const modalOverlay = document.getElementById("haModalOverlay");
    if (modalOverlay) modalOverlay.classList.remove("active");
};

// ==========================================================================
// MQTT INTERACTIVE TOOLS
// ==========================================================================

window.showMqttTopics = async function() {
    const resBox = document.getElementById("mqtt_action_result");
    if (!resBox) return;

    resBox.style.display = 'block';
    resBox.style.background = 'rgba(6, 182, 212, 0.15)';
    resBox.style.border = '1px solid var(--accent-cyan)';
    resBox.style.color = '#fff';
    resBox.innerHTML = '<i data-lucide="refresh-cw"></i> Interrogazione broker MQTT in corso...';
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();

    const data = await window.haService.getMqttTopics();

    if (data && data.topics && data.topics.length > 0) {
        resBox.style.background = 'rgba(16, 185, 129, 0.15)';
        resBox.style.border = '1px solid var(--accent-emerald)';
        resBox.style.color = '#fff';
        
        let html = `
            <div style="color:var(--accent-emerald); font-weight:600; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem;">
                <i data-lucide="check-circle"></i> Connesso al broker (${data.broker || '192.168.68.108:1883'}). Topic attivi rilevati:
            </div>
            <div style="max-height:180px; overflow-y:auto; display:flex; flex-direction:column; gap:0.4rem;">
        `;

        data.topics.forEach(t => {
            const topicName = typeof t === 'string' ? t : t.topic;
            const preview = typeof t === 'object' && t.preview ? t.preview : '';
            const time = typeof t === 'object' && t.time ? t.time : '';

            html += `
                <div style="background:rgba(0,0,0,0.4); padding:0.5rem 0.8rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center; gap:0.6rem;">
                    <div>
                        <code style="color:var(--accent-amber); font-weight:bold;">${topicName}</code>
                        ${time ? `<span style="font-size:0.72rem; color:var(--text-muted); margin-left:6px;">(${time})</span>` : ''}
                        ${preview ? `<div style="font-size:0.75rem; color:var(--text-secondary); max-width:350px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${preview}</div>` : ''}
                    </div>
                    <button type="button" class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem;" onclick="document.getElementById('ha_mqtt_topic').value='${topicName}'; window.showToast('Topic selezionato: ${topicName}');">
                        Seleziona
                    </button>
                </div>
            `;
        });

        html += `</div>`;
        resBox.innerHTML = html;
    } else {
        resBox.style.background = 'rgba(245, 158, 11, 0.15)';
        resBox.style.border = '1px solid var(--accent-gold)';
        resBox.style.color = '#fff';
        resBox.innerHTML = `
            <div style="display:flex; align-items:flex-start; gap:0.6rem;">
                <i data-lucide="info" style="color:var(--accent-gold); font-size:1.2rem; flex-shrink:0; margin-top:2px;"></i>
                <div>
                    <strong>Broker Connesso (192.168.68.108:1883)</strong><br>
                    Nessun topic recente ricevuto negli ultimi secondi (i sensori ambientali trasmettono a intervalli di 30-60 secondi).<br>
                    <small style="color:var(--text-muted);">Puoi cliccare su <em>"Invia Misurazione Test MQTT"</em> per verificare subito la trasmissione.</small>
                </div>
            </div>
        `;
    }
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();
};

window.testMqttSend = async function() {
    const resBox = document.getElementById("mqtt_action_result");
    if (!resBox) return;

    resBox.style.display = 'block';
    resBox.style.background = 'rgba(6, 182, 212, 0.15)';
    resBox.style.border = '1px solid var(--accent-cyan)';
    resBox.style.color = '#fff';
    resBox.innerHTML = '<i data-lucide="refresh-cw"></i> Pubblicazione pacchetto di test su MQTT (192.168.68.108:1883)...';
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();

    const topic = document.getElementById("ha_mqtt_topic") ? document.getElementById("ha_mqtt_topic").value.trim() : "";
    const targetTopic = (topic && topic !== '#') ? topic : "atelier/sensore_laboratorio";
    const testTemp = 21.9;
    const testHum = 48.2;

    const result = await window.haService.sendMqttTest(targetTopic, testTemp, testHum);

    if (result && result.success) {
        resBox.style.background = 'rgba(16, 185, 129, 0.15)';
        resBox.style.border = '1px solid var(--accent-emerald)';
        resBox.style.color = 'var(--accent-emerald)';
        resBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.6rem;">
                <i data-lucide="check-circle" style="font-size:1.3rem;"></i>
                <div>
                    <strong>TEST MQTT RIUSCITO!</strong><br>
                    Inviati <strong>${testTemp} °C</strong> e <strong>${testHum}% RH</strong> sul topic <code>${targetTopic}</code>.<br>
                    <small style="color:var(--text-secondary);">Il broker e il gestionale hanno recepito la misurazione in tempo reale.</small>
                </div>
            </div>
        `;
        window.haService.fetchTelemetry();
        window.openHaModal();
    } else {
        resBox.style.background = 'rgba(244, 63, 94, 0.15)';
        resBox.style.border = '1px solid #f43f5e';
        resBox.style.color = '#fff';
        resBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:0.6rem;">
                <i data-lucide="alert-triangle" style="color:#f43f5e; font-size:1.3rem;"></i>
                <div>
                    <strong>Errore Invio MQTT:</strong><br>
                    ${result.error || 'Server bridge locale non raggiungibile. Avvia con avvia_gestionale.bat.'}
                </div>
            </div>
        `;
    }
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();
};

// ==========================================================================
// HOME ASSISTANT HTTP TOOLS
// ==========================================================================

window.testHaConnection = async function() {
    const host = document.getElementById("ha_host").value;
    const token = document.getElementById("ha_token").value;
    const resBox = document.getElementById("ha_test_result");
    if (!resBox) return;

    resBox.style.display = 'block';
    resBox.style.background = 'rgba(6, 182, 212, 0.15)';
    resBox.style.border = '1px solid var(--accent-cyan)';
    resBox.style.color = '#fff';
    resBox.innerHTML = '<i data-lucide="refresh-cw"></i> Verifica API in corso su ' + host + '...';
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();

    const result = await window.haService.testConnection(host, token);

    if (result.success) {
        resBox.style.background = 'rgba(16, 185, 129, 0.15)';
        resBox.style.border = '1px solid var(--accent-emerald)';
        resBox.style.color = 'var(--accent-emerald)';
        resBox.innerHTML = `<div style="display:flex; align-items:flex-start; gap:0.6rem;"><i data-lucide="check-circle" style="font-size:1.3rem; margin-top:2px; flex-shrink:0;"></i><div><strong>SUCCESSO:</strong><br>${result.message.replace(/\n/g, '<br>')}</div></div>`;
    } else {
        resBox.style.background = 'rgba(244, 63, 94, 0.15)';
        resBox.style.border = '1px solid #f43f5e';
        resBox.style.color = '#fff';
        resBox.innerHTML = `<div style="display:flex; align-items:flex-start; gap:0.6rem;"><i data-lucide="alert-triangle" style="font-size:1.3rem; color:#f43f5e; margin-top:2px; flex-shrink:0;"></i><div style="line-height:1.5;">${result.message.replace(/\n/g, '<br>')}</div></div>`;
    }
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();
};

window.discoverHaSensors = async function() {
    const host = document.getElementById("ha_host").value;
    const token = document.getElementById("ha_token").value;
    const resBox = document.getElementById("ha_test_result");
    const tempWrap = document.getElementById("ha_temp_select_wrap");
    const humWrap = document.getElementById("ha_hum_select_wrap");

    if (resBox) {
        resBox.style.display = 'block';
        resBox.style.background = 'rgba(6, 182, 212, 0.15)';
        resBox.style.border = '1px solid var(--accent-cyan)';
        resBox.style.color = '#fff';
        resBox.innerHTML = '<i data-lucide="refresh-cw"></i> Scansione sensori in corso su Home Assistant...';
        if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();
    }

    const result = await window.haService.discoverSensors(host, token);

    if (result.success && (result.tempSensors.length > 0 || result.humiditySensors.length > 0)) {
        if (resBox) {
            resBox.style.background = 'rgba(16, 185, 129, 0.15)';
            resBox.style.border = '1px solid var(--accent-emerald)';
            resBox.style.color = 'var(--accent-emerald)';
            resBox.innerHTML = `<i data-lucide="check-circle"></i> Trovati <strong>${result.tempSensors.length} sensori temperatura</strong> e <strong>${result.humiditySensors.length} sensori umidità</strong>! Seleziona dal menu per impostare.`;
        }

        if (tempWrap && result.tempSensors.length > 0) {
            tempWrap.style.display = 'block';
            tempWrap.innerHTML = `
                <select class="form-control" onchange="document.getElementById('ha_temp_entity').value=this.value;">
                    <option value="">-- Seleziona sensore temperatura da Home Assistant --</option>
                    ${result.tempSensors.map(s => `
                        <option value="${s.entity_id}">${s.attributes.friendly_name || s.entity_id} (${s.state} ${s.attributes.unit_of_measurement || '°C'})</option>
                    `).join('')}
                </select>
            `;
        }

        if (humWrap && result.humiditySensors.length > 0) {
            humWrap.style.display = 'block';
            humWrap.innerHTML = `
                <select class="form-control" onchange="document.getElementById('ha_humidity_entity').value=this.value;">
                    <option value="">-- Seleziona sensore umidità da Home Assistant --</option>
                    ${result.humiditySensors.map(s => `
                        <option value="${s.entity_id}">${s.attributes.friendly_name || s.entity_id} (${s.state} ${s.attributes.unit_of_measurement || '%'})</option>
                    `).join('')}
                </select>
            `;
        }
    } else {
        if (resBox) {
            resBox.style.background = 'rgba(245, 158, 11, 0.15)';
            resBox.style.border = '1px solid var(--accent-gold)';
            resBox.style.color = 'var(--accent-gold)';
            resBox.innerHTML = `<i data-lucide="alert-circle"></i> Nessun sensore trovato automaticamente (${result.message || 'Verifica token'}). Puoi digitare l'Entity ID manualmente.`;
        }
    }
    if (window.appController && window.appController.setupLucideIcons) window.appController.setupLucideIcons();
};

window.saveHaConfig = function(e) {
    e.preventDefault();

    const activeTab = window.telemetryActiveTab || 'mqtt';
    const mqttBroker = document.getElementById("ha_mqtt_broker") ? document.getElementById("ha_mqtt_broker").value.trim() : "192.168.68.108";
    const mqttPort = document.getElementById("ha_mqtt_port") ? parseInt(document.getElementById("ha_mqtt_port").value, 10) || 1883 : 1883;
    const mqttTopic = document.getElementById("ha_mqtt_topic") ? document.getElementById("ha_mqtt_topic").value.trim() : "";

    const haHost = document.getElementById("ha_host") ? document.getElementById("ha_host").value.trim() : "";
    const haToken = document.getElementById("ha_token") ? document.getElementById("ha_token").value.trim() : "";
    const haTempEntity = document.getElementById("ha_temp_entity") ? document.getElementById("ha_temp_entity").value.trim() : "";
    const haHumEntity = document.getElementById("ha_humidity_entity") ? document.getElementById("ha_humidity_entity").value.trim() : "";

    const pollingInterval = parseInt(document.getElementById("ha_poll_interval").value, 10) || 10;
    const useSimulationFallback = document.getElementById("ha_simulation_fallback") ? document.getElementById("ha_simulation_fallback").checked : true;

    const newConfig = {
        sourceType: activeTab,
        mqttBroker: mqttBroker,
        mqttPort: mqttPort,
        mqttTopic: mqttTopic,
        host: haHost,
        token: haToken,
        tempEntityId: haTempEntity,
        humidityEntityId: haHumEntity,
        pollingInterval: pollingInterval,
        useSimulationFallback: useSimulationFallback,
        enabled: true
    };

    window.haService.saveConfig(newConfig);
    if (activeTab === 'mqtt') {
        window.haService.saveMqttConfig(mqttBroker, mqttPort, mqttTopic);
    }

    window.closeHaModal();
    window.showToast("Configurazione salvata con successo! Aggiornamento telemetria in corso...");
};

document.addEventListener("DOMContentLoaded", () => {
    window.appController = new AppController();
    if (window.haService) {
        window.haService.init();
    }
});
