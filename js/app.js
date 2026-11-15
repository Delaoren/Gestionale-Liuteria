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
        id: "certificati",
        name: "Certificati",
        tag: "Autenticità & Perizie",
        icon: "award",
        color: "linear-gradient(135deg, rgba(217, 119, 6, 0.25), rgba(146, 64, 14, 0.45))",
        borderColor: "#f59e0b",
        desc: "Creazione e stampa di certificati su carta intestata con nome autore, stato di conservazione, bio, misure e fotografie.",
        renderer: window.AppModules.renderCertificati
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
        id: "liuteriaMaking",
        name: "Liuteria Making",
        tag: "CAD 3D, Chladni & Acustica FFT",
        icon: "activity",
        color: "linear-gradient(135deg, rgba(212, 175, 55, 0.25), rgba(180, 83, 9, 0.45))",
        borderColor: "#d4af37",
        desc: "Progettazione parametrica 3D (Violino, Viola, Violoncello), calcolo volume cassa, pattern nodali Chladni M1/M2/M5, analisi FFT microfono e database fisico legni.",
        renderer: window.AppModules.renderLiuteriaMaking
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
                    <i data-lucide="search-x" class="lucide-search-x" style="font-size:3rem; margin-bottom:1rem; display:block;"></i>
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
    toast.innerHTML = `<i data-lucide="check-circle" class="lucide-check-circle" style="color:var(--accent-gold);"></i> <span>${msg}</span>`;
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
        formHTML = window.buildBibliotecaModalForm(null);
    } else if (collectionName === 'calendarioAppuntamenti') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'calendarioAppuntamenti')">
                <div class="form-row">
                    <div class="form-group" style="flex:1.2;">
                        <label>Cliente / Richiedente</label>
                        <input type="text" id="f_app_cliente" list="app_clienti_list" class="form-control" required placeholder="Es. Maestro Marco Rossi (Primo Violino)" oninput="window.autoFillAppointmentClientEmail && window.autoFillAppointmentClientEmail(this.value)">
                        <datalist id="app_clienti_list">
                            ${clientsList}
                        </datalist>
                    </div>
                    <div class="form-group" style="flex:1;">
                        <label>Email Cliente (per Promemoria Sendinblue)</label>
                        <input type="email" id="f_app_email" class="form-control" placeholder="es. cliente@orchestra.it">
                    </div>
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
                    <i data-lucide="calendar-plus" class="lucide-calendar-plus"></i> Salva Appuntamento
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
                    <i data-lucide="clock" class="lucide-clock"></i> Pianifica Lavorazione in Atelier
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
                    <i data-lucide="user-plus" class="lucide-user-plus"></i> Salva Cliente
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
                    <i data-lucide="hammer" class="lucide-hammer"></i> Registra Strumento in Costruzione
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
                    <i data-lucide="file-plus" class="lucide-file-plus"></i> Emetti e Registra Fattura
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
                    <i data-lucide="gauge" class="lucide-gauge"></i> Registra Stazione Laboratorio
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
                    <i data-lucide="trees" class="lucide-trees"></i> Registra Legno nel Magazzino Tonewood
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
                    <i data-lucide="music" class="lucide-music"></i> Registra Strumento Finito in Showroom
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
                    <i data-lucide="upload" class="lucide-upload"></i> Carica Media nell'Archivio
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
                    <i data-lucide="bar-chart-3" class="lucide-bar-chart-3"></i> Salva Report Statistico
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
                    <i data-lucide="sparkles" class="lucide-sparkles"></i> Registra Scheda di Restauro
                </button>
            </form>
        `;
    } else if (collectionName === 'social') {
        formHTML = window.buildSocialModalForm(null);
    } else if (collectionName === 'certificati') {
        formHTML = window.buildCertificatoModalForm(null);
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

    const modalContainer = modalOverlay.querySelector('.modal-container');
    if (modalContainer) {
        if (collectionName === 'social' || collectionName === 'certificati' || collectionName === 'biblioteca') {
            modalContainer.style.maxWidth = '820px';
        } else {
            modalContainer.style.maxWidth = '';
        }
    }

    modalBody.innerHTML = formHTML;
    modalOverlay.classList.add("active");
    if (collectionName === 'certificati') {
        window.renderCertPhotoDraftList();
    } else if (collectionName === 'social') {
        window.renderSocialMediaDraftList();
        window.setupSocialDropzone();
    } else if (collectionName === 'biblioteca') {
        window.renderBibliotecaFileDraft();
        window.setupBibliotecaModalDropzone();
    }
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.closeModal = function() {
    document.getElementById("modalOverlay").classList.remove("active");
};

window.saveNewRecord = function(e, collectionName) {
    e.preventDefault();
    if (collectionName === 'biblioteca') {
        const editingId = document.getElementById("f_bib_edit_id") ? document.getElementById("f_bib_edit_id").value.trim() : "";
        const existing = editingId ? window.atelierDB.getItem("biblioteca", editingId) : null;
        const draftFile = window.bibliotecaFileDraft || null;

        const item = {
            id: editingId || ("bib-" + Date.now()),
            titolo: document.getElementById("f_bib_titolo").value.trim(),
            autore: document.getElementById("f_bib_autore").value.trim() || "Autore / Liutaio",
            categoria: document.getElementById("f_bib_categoria").value,
            anno: parseInt(document.getElementById("f_bib_anno").value) || new Date().getFullYear(),
            formato: document.getElementById("f_bib_formato").value,
            pagine: parseInt(document.getElementById("f_bib_pagine").value) || 1,
            note: document.getElementById("f_bib_note").value.trim(),
            tags: (document.getElementById("f_bib_tags").value || "").split(',').map(t => t.trim()).filter(Boolean),
            fileId: draftFile ? draftFile.id : (existing ? existing.fileId || "" : ""),
            fileName: draftFile ? draftFile.name : (existing ? existing.fileName || "" : ""),
            fileExt: draftFile ? draftFile.ext : (existing ? existing.fileExt || "" : ""),
            fileMime: draftFile ? draftFile.mimeType : (existing ? existing.fileMime || "" : ""),
            fileSizeBytes: draftFile ? draftFile.sizeBytes : (existing ? existing.fileSizeBytes || 0 : 0),
            fileSizeFormatted: draftFile ? draftFile.sizeFormatted : (existing ? existing.fileSizeFormatted || "" : ""),
            fileUrl: draftFile ? draftFile.url : (existing ? existing.fileUrl || "" : ""),
            isIndexedDB: draftFile ? Boolean(draftFile.isIndexedDB) : (existing ? Boolean(existing.isIndexedDB) : false)
        };

        if (editingId) {
            window.atelierDB.updateItem("biblioteca", editingId, item);
        } else {
            window.atelierDB.addItem("biblioteca", item);
        }
    } else if (collectionName === 'calendarioAppuntamenti') {
        const clienteVal = document.getElementById("f_app_cliente").value.trim();
        const emailFieldVal = document.getElementById("f_app_email") ? document.getElementById("f_app_email").value.trim() : "";
        const item = {
            id: "app-" + Date.now(),
            cliente: clienteVal,
            emailCliente: emailFieldVal || (window.resolveClientEmailByName ? window.resolveClientEmailByName(clienteVal) : ""),
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
        const editingId = document.getElementById("f_soc_edit_id") ? document.getElementById("f_soc_edit_id").value.trim() : "";
        const checkedPlatforms = Array.from(document.querySelectorAll(".soc-platform-checkbox:checked")).map(cb => cb.value);
        const piattaforme = checkedPlatforms.length > 0 ? checkedPlatforms : ["Instagram"];
        const statoScelto = document.getElementById("f_soc_stato") ? document.getElementById("f_soc_stato").value : "Programmato";
        const autoPublish = document.getElementById("f_soc_autopublish") ? document.getElementById("f_soc_autopublish").checked : true;
        const dataProg = document.getElementById("f_soc_data") ? document.getElementById("f_soc_data").value : new Date().toISOString().slice(0, 16);

        const shouldPublishImmediately = (statoScelto === "Pubblicato");

        const socialObj = {
            id: editingId || ("soc-" + Date.now()),
            titolo: document.getElementById("f_soc_titolo").value.trim(),
            piattaforme: piattaforme,
            piattaforma: piattaforme.join(", "),
            formatoPost: document.getElementById("f_soc_formato") ? document.getElementById("f_soc_formato").value : "Post Foto / Video",
            dataProgrammata: dataProg,
            hashtag: document.getElementById("f_soc_hashtag") ? document.getElementById("f_soc_hashtag").value.trim() : "",
            note: document.getElementById("f_soc_note") ? document.getElementById("f_soc_note").value.trim() : "",
            likesPrevisti: document.getElementById("f_soc_likes") ? document.getElementById("f_soc_likes").value.trim() || "1.5K" : "1.5K",
            stato: shouldPublishImmediately ? "Programmato" : statoScelto,
            autoPublish: autoPublish,
            errorePubblicazione: "",
            updatedAt: new Date().toISOString(),
            mediaAttachments: Array.isArray(window.socialMediaDrafts) ? JSON.parse(JSON.stringify(window.socialMediaDrafts)) : []
        };

        if (editingId) {
            window.atelierDB.updateItem("social", editingId, socialObj);
        } else {
            window.atelierDB.addItem("social", socialObj);
        }

        if (typeof window.syncSocialWithServer === "function") {
            window.syncSocialWithServer();
        }

        if (shouldPublishImmediately) {
            setTimeout(() => {
                window.publishSocialPostNow(socialObj.id, false);
            }, 120);
        }
    } else if (collectionName === 'certificati') {
        window.syncCertPhotoCaptionsFromDOM();
        const editingId = document.getElementById("f_cert_edit_id") ? document.getElementById("f_cert_edit_id").value.trim() : "";
        const certObj = {
            id: editingId || ("cert-" + Date.now()),
            numeroCertificato: document.getElementById("f_cert_numero").value.trim() || `CERT-${new Date().getFullYear()}-001`,
            dataEmissione: document.getElementById("f_cert_data").value || new Date().toISOString().split('T')[0],
            luogoEmissione: document.getElementById("f_cert_luogo").value.trim() || "Bottega Liuteria De Lorenzi",
            tipologiaCertificato: document.getElementById("f_cert_tipoDoc").value || "Certificato di Autenticità d'Autore",
            strumento: document.getElementById("f_cert_strumento").value.trim(),
            tipologiaStrumento: document.getElementById("f_cert_tipologiaStrumento").value || "Violino 4/4",
            modello: document.getElementById("f_cert_modello").value.trim() || "Modello Classico Cremonese",
            annoCostruzione: document.getElementById("f_cert_anno").value.trim() || String(new Date().getFullYear()),
            autore: document.getElementById("f_cert_autore").value.trim() || "Maestro Fabio De Lorenzi",
            etichetta: document.getElementById("f_cert_etichetta").value.trim(),
            statoConservazione: document.getElementById("f_cert_statoCons").value.trim() || "Eccellente — Stato Integro d'Autore",
            noteConservazione: document.getElementById("f_cert_noteCons").value.trim(),
            bioAutore: document.getElementById("f_cert_bio").value.trim(),
            destinatario: document.getElementById("f_cert_destinatario").value.trim(),
            misure: {
                lunghezzaCassa: document.getElementById("f_cert_m_cassa").value.trim() || "-",
                larghezzaSuperiore: document.getElementById("f_cert_m_sup").value.trim() || "-",
                larghezzaCC: document.getElementById("f_cert_m_cc").value.trim() || "-",
                larghezzaInferiore: document.getElementById("f_cert_m_inf").value.trim() || "-",
                altezzaFasceSup: document.getElementById("f_cert_m_fasceSup").value.trim() || "-",
                altezzaFasceInf: document.getElementById("f_cert_m_fasceInf").value.trim() || "-",
                diapason: document.getElementById("f_cert_m_diapason").value.trim() || "-",
                lunghezzaManico: document.getElementById("f_cert_m_manico").value.trim() || "-"
            },
            fotografie: Array.isArray(window.certPhotoDrafts) ? JSON.parse(JSON.stringify(window.certPhotoDrafts)) : []
        };

        if (editingId) {
            window.atelierDB.updateItem("certificati", editingId, certObj);
            window.selectedCertificateId = editingId;
        } else {
            window.atelierDB.addItem("certificati", certObj);
            window.selectedCertificateId = certObj.id;
        }
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
// CERTIFICATI SU CARTA INTESTATA: GESTIONE FORM, FOTO, MISURE E STAMPA A4
// ==========================================================================

window.certPhotoDrafts = [];

window.DEFAULT_LUTHIER_BIO = "Il Maestro Liutaio Fabio De Lorenzi dedica la propria ricerca all'arte liutaria classica italiana, coniugando il metodo costruttivo tradizionale cremonese con lo studio acustico-modale dei legni da risonanza stagionati naturalmente. Ogni strumento è interamente scolpito e verniciato a mano nella propria bottega.";

window.buildCertificatoModalForm = function(existingCert = null) {
    const todayIso = new Date().toISOString().split('T')[0];
    const existingList = (window.atelierDB && window.atelierDB.data.certificati) || [];
    const nextNum = String(existingList.length + 1).padStart(3, '0');
    const suggestedCode = `CERT-${new Date().getFullYear()}-${nextNum}`;

    const c = existingCert || {
        id: "",
        numeroCertificato: suggestedCode,
        dataEmissione: todayIso,
        luogoEmissione: "Bottega Liuteria De Lorenzi",
        tipologiaCertificato: "Certificato di Autenticità d'Autore",
        strumento: "",
        tipologiaStrumento: "Violino 4/4",
        modello: "Ispirato ad Antonio Stradivari 1715 'Il Cremonese'",
        annoCostruzione: String(new Date().getFullYear()),
        autore: "Maestro Fabio De Lorenzi",
        etichetta: `Fabio De Lorenzi fecit anno Domini ${new Date().getFullYear()}`,
        statoConservazione: "Eccellente — Stato Integro d'Autore",
        noteConservazione: "Strumento in perfetto stato di conservazione, integro in ogni sua parte originale. Tavola armonica in abete rosso della Val di Fiemme; fondo in acero marezzato balcanico. Vernice originale ad olio d'ambra.",
        bioAutore: window.DEFAULT_LUTHIER_BIO,
        destinatario: "",
        misure: {
            lunghezzaCassa: "355.5 mm",
            larghezzaSuperiore: "167.5 mm",
            larghezzaCC: "111.5 mm",
            larghezzaInferiore: "207.8 mm",
            altezzaFasceSup: "30.0 mm",
            altezzaFasceInf: "31.8 mm",
            diapason: "195.0 mm",
            lunghezzaManico: "130.0 mm"
        },
        fotografie: [
            { url: "/assets/violin-1.jpg", didascalia: "Tavola Armonica (Vista Frontale)" },
            { url: "/assets/cremonese.jpg", didascalia: "Fondo in Acero Marezzato & Profilo" }
        ]
    };

    const m = c.misure || {};
    window.certPhotoDrafts = Array.isArray(c.fotografie) ? JSON.parse(JSON.stringify(c.fotografie)) : [];

    const clientsOptions = ((window.atelierDB && window.atelierDB.data.clienti) || [])
        .map(cl => `<option value="${cl.nome}">`).join('');

    const showroomInstruments = ((window.atelierDB && window.atelierDB.data.magazzinoStrumenti) || []);
    const buildInstruments = ((window.atelierDB && window.atelierDB.data.costruzione) || []);
    const restoreInstruments = ((window.atelierDB && window.atelierDB.data.restauro) || []);

    return `
        <form onsubmit="window.saveNewRecord(event, 'certificati')">
            <input type="hidden" id="f_cert_edit_id" value="${c.id || ''}">

            ${!existingCert ? `
                <div style="background:rgba(245, 158, 11, 0.08); border:1px solid rgba(245, 158, 11, 0.3); border-radius:10px; padding:0.85rem 1rem; margin-bottom:1.2rem;">
                    <label style="font-size:0.8rem; color:var(--accent-gold); font-weight:700; display:block; margin-bottom:0.35rem;">
                        ⚡ Precompila Rapido da Strumento in Archivio (Opzionale)
                    </label>
                    <select class="form-control" onchange="window.prefillCertFromInstrument(this.value)" style="font-size:0.85rem; padding:0.5rem 0.8rem;">
                        <option value="">-- Seleziona uno strumento da Magazzino / Costruzione / Restauro --</option>
                        ${showroomInstruments.map(s => `<option value="str:${s.id}">🎻 [Showroom] ${s.nome} (${s.modello} - ${s.annoCostruzione})</option>`).join('')}
                        ${buildInstruments.map(b => `<option value="cost:${b.id}">🔨 [Costruzione] ${b.opNumero} - ${b.modello}</option>`).join('')}
                        ${restoreInstruments.map(r => `<option value="res:${r.id}">✨ [Restauro] ${r.strumento} (${r.codice})</option>`).join('')}
                    </select>
                </div>
            ` : ''}

            <!-- 1. Dati Intestazione e Identificazione -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin-bottom:0.8rem;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">1. Intestazione & Identificazione Strumento</strong>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>N° Registro Certificato</label>
                    <input type="text" id="f_cert_numero" class="form-control" required value="${c.numeroCertificato || suggestedCode}">
                </div>
                <div class="form-group">
                    <label>Data Emissione</label>
                    <input type="date" id="f_cert_data" class="form-control" required value="${c.dataEmissione || todayIso}">
                </div>
                <div class="form-group">
                    <label>Luogo di Emissione</label>
                    <input type="text" id="f_cert_luogo" class="form-control" value="${c.luogoEmissione || 'Bottega Liuteria De Lorenzi'}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Titolo su Carta Intestata</label>
                    <select id="f_cert_tipoDoc" class="form-control">
                        <option value="Certificato di Autenticità d'Autore" ${c.tipologiaCertificato === "Certificato di Autenticità d'Autore" ? 'selected' : ''}>Certificato di Autenticità d'Autore</option>
                        <option value="Perizia Tecnica & Stato di Conservazione" ${c.tipologiaCertificato === "Perizia Tecnica & Stato di Conservazione" ? 'selected' : ''}>Perizia Tecnica & Stato di Conservazione</option>
                        <option value="Certificato di Attribuzione & Expertise Liutaria" ${c.tipologiaCertificato === "Certificato di Attribuzione & Expertise Liutaria" ? 'selected' : ''}>Certificato di Attribuzione & Expertise Liutaria</option>
                        <option value="Certificato di Restauro Conservativo" ${c.tipologiaCertificato === "Certificato di Restauro Conservativo" ? 'selected' : ''}>Certificato di Restauro Conservativo</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Tipologia Strumento</label>
                    <select id="f_cert_tipologiaStrumento" class="form-control">
                        <option value="Violino 4/4" ${c.tipologiaStrumento === 'Violino 4/4' ? 'selected' : ''}>Violino 4/4</option>
                        <option value="Viola" ${c.tipologiaStrumento === 'Viola' ? 'selected' : ''}>Viola d'Arco</option>
                        <option value="Violoncello" ${c.tipologiaStrumento === 'Violoncello' ? 'selected' : ''}>Violoncello</option>
                        <option value="Contrabbasso" ${c.tipologiaStrumento === 'Contrabbasso' ? 'selected' : ''}>Contrabbasso</option>
                        <option value="Viola d'Amore / Strumento Storico" ${c.tipologiaStrumento === "Viola d'Amore / Strumento Storico" ? 'selected' : ''}>Viola d'Amore / Strumento Storico</option>
                        <option value="Arco da Concerto" ${c.tipologiaStrumento === 'Arco da Concerto' ? 'selected' : ''}>Arco da Concerto</option>
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex:2;">
                    <label>Denominazione Strumento</label>
                    <input type="text" id="f_cert_strumento" class="form-control" required value="${c.strumento || ''}" placeholder="Es. Violino Master 'La Fenice' Opus 42">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Anno / Epoca di Costruzione</label>
                    <input type="text" id="f_cert_anno" class="form-control" required value="${c.annoCostruzione || ''}" placeholder="Es. 2026 o Fine XVIII Sec.">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Modello / Scuola di Riferimento</label>
                    <input type="text" id="f_cert_modello" class="form-control" value="${c.modello || ''}" placeholder="Es. Antonio Stradivari 1715 'Il Cremonese'">
                </div>
                <div class="form-group">
                    <label>Etichetta / Cartiglio Interno</label>
                    <input type="text" id="f_cert_etichetta" class="form-control" value="${c.etichetta || ''}" placeholder="Es. Fabio De Lorenzi fecit anno Domini 2026">
                </div>
            </div>

            <!-- 2. Nome dell'Autore e Breve Biografia -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin:1.1rem 0 0.8rem 0;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">2. Autore & Breve Biografia dell'Autore</strong>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Nome dell'Autore / Maestro Liutaio</label>
                    <input type="text" id="f_cert_autore" class="form-control" required value="${c.autore || 'Maestro Fabio De Lorenzi'}" placeholder="Es. Maestro Fabio De Lorenzi">
                </div>
                <div class="form-group">
                    <label>Intestatario / Proprietario (Opzionale)</label>
                    <input type="text" id="f_cert_destinatario" list="cert_clienti_list" class="form-control" value="${c.destinatario || ''}" placeholder="Es. Maestro Marco Rossi">
                    <datalist id="cert_clienti_list">${clientsOptions}</datalist>
                </div>
            </div>

            <div class="form-group">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
                    <label style="margin-bottom:0;">Breve Biografia dell'Autore</label>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.72rem;" onclick="document.getElementById('f_cert_bio').value = window.DEFAULT_LUTHIER_BIO;">
                        Ripristina Bio Maestro De Lorenzi
                    </button>
                </div>
                <textarea id="f_cert_bio" class="form-control" rows="3" required placeholder="Profilo biografico, formazione, ricerca acustica e stile costruttivo dell'autore...">${c.bioAutore || window.DEFAULT_LUTHIER_BIO}</textarea>
            </div>

            <!-- 3. Stato di Conservazione -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin:1.1rem 0 0.8rem 0;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">3. Stato di Conservazione & Vernice</strong>
            </div>

            <div class="form-group">
                <label>Valutazione Stato di Conservazione</label>
                <input type="text" id="f_cert_statoCons" list="cert_stato_list" class="form-control" required value="${c.statoConservazione || 'Eccellente — Stato Integro d\'Autore'}" placeholder="Es. Eccellente — Stato Integro d'Autore">
                <datalist id="cert_stato_list">
                    <option value="Eccellente — Stato Integro d'Autore">
                    <option value="Ottimo — Pari al Nuovo">
                    <option value="Molto Buono — Lievi segni d'uso compatibili con l'epoca">
                    <option value="Buono — Restaurato conservativamente a regola d'arte">
                    <option value="Storico — Con interventi di restauro documentati">
                </datalist>
            </div>

            <div class="form-group">
                <label>Descrizione Analitica Stato di Conservazione, Legni e Vernice</label>
                <textarea id="f_cert_noteCons" class="form-control" rows="3" required placeholder="Descrivi l'integrità strutturale della tavola armonica, del fondo, delle fasce, del riccio e la composizione/colore della vernice...">${c.noteConservazione || ''}</textarea>
            </div>

            <!-- 4. Misure Rilevate -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin:1.1rem 0 0.8rem 0;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">4. Rilievi Metrici e Misure (in mm)</strong>
                <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.applyCertMeasurePreset('violino')">Preset Violino 4/4</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.applyCertMeasurePreset('viola')">Preset Viola 41.5</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.7rem;" onclick="window.applyCertMeasurePreset('violoncello')">Preset Violoncello</button>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap:0.75rem; margin-bottom:1.2rem;">
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Lunghezza Cassa</label>
                    <input type="text" id="f_cert_m_cassa" class="form-control" value="${m.lunghezzaCassa || '355.5 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Largh. Superiore</label>
                    <input type="text" id="f_cert_m_sup" class="form-control" value="${m.larghezzaSuperiore || '167.5 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Largh. nelle CC</label>
                    <input type="text" id="f_cert_m_cc" class="form-control" value="${m.larghezzaCC || '111.5 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Largh. Inferiore</label>
                    <input type="text" id="f_cert_m_inf" class="form-control" value="${m.larghezzaInferiore || '207.8 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Fasce Superiori</label>
                    <input type="text" id="f_cert_m_fasceSup" class="form-control" value="${m.altezzaFasceSup || '30.0 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Fasce Inferiori</label>
                    <input type="text" id="f_cert_m_fasceInf" class="form-control" value="${m.altezzaFasceInf || '31.8 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Diapason (Mensura)</label>
                    <input type="text" id="f_cert_m_diapason" class="form-control" value="${m.diapason || '195.0 mm'}">
                </div>
                <div class="form-group" style="margin-bottom:0;">
                    <label style="font-size:0.76rem;">Lunghezza Manico</label>
                    <input type="text" id="f_cert_m_manico" class="form-control" value="${m.lunghezzaManico || '130.0 mm'}">
                </div>
            </div>

            <!-- 5. Fotografie dello Strumento -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin:1.1rem 0 0.8rem 0;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">5. Fotografie dello Strumento</strong>
            </div>

            <div style="background:rgba(0,0,0,0.35); border:1px dashed rgba(245, 158, 11, 0.4); border-radius:10px; padding:1rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; margin-bottom:0.8rem;">
                    <div>
                        <strong style="color:#fff; font-size:0.88rem; display:block;">Aggiungi Fotografie (Tavola, Fondo, Profilo, Riccio, Cartiglio)</strong>
                        <small style="color:var(--text-muted);">Puoi caricare file immagine dal tuo PC/telefono oppure scegliere dall'archivio.</small>
                    </div>
                    <label class="btn btn-primary" style="cursor:pointer; margin:0; padding:0.45rem 0.9rem; font-size:0.8rem;">
                        <i data-lucide="camera" class="lucide-camera"></i> Carica Foto dal PC
                        <input type="file" accept="image/*" multiple onchange="window.handleCertPhotoUpload(event)" style="display:none;">
                    </label>
                </div>

                <div style="display:flex; gap:0.4rem; flex-wrap:wrap; align-items:center; padding-top:0.6rem; border-top:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:0.75rem; color:var(--text-secondary);">Foto rapide Atelier:</span>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="window.addCertGalleryPhoto('./assets/violin-1.jpg', 'Tavola Armonica (Fronte)')">+ Violino Fronte</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="window.addCertGalleryPhoto('./assets/cremonese.jpg', 'Fondo in Acero Marezzato')">+ Fondo Cremonese</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="window.addCertGalleryPhoto('./assets/viola-1.jpg', 'Viola d\\'Arco - Vista Completa')">+ Viola</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="window.addCertGalleryPhoto('./assets/cello-1.jpg', 'Violoncello - Tavola e C-Bouts')">+ Violoncello</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.5rem; font-size:0.72rem;" onclick="window.addCertGalleryPhoto('./assets/craft-1.jpg', 'Dettaglio Riccio e Filettatura')">+ Dettaglio Riccio</button>
                </div>

                <div id="certPhotoDraftListContainer" style="margin-top:0.9rem; display:flex; flex-direction:column; gap:0.5rem;"></div>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:0.8rem; padding:0.85rem; font-size:0.95rem;">
                <i data-lucide="award" class="lucide-award"></i> ${existingCert ? 'Salva Modifiche al Certificato' : 'Genera Certificato su Carta Intestata'}
            </button>
        </form>
    `;
};

window.renderCertPhotoDraftList = function() {
    const container = document.getElementById("certPhotoDraftListContainer");
    if (!container) return;
    const drafts = window.certPhotoDrafts || [];
    if (drafts.length === 0) {
        container.innerHTML = `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:0.5rem;">Nessuna foto allegata. Clicca su "Carica Foto dal PC" per inserire le immagini dello strumento.</div>`;
        return;
    }
    container.innerHTML = drafts.map((f, idx) => `
        <div style="display:flex; align-items:center; gap:0.75rem; background:rgba(255,255,255,0.04); padding:0.45rem 0.65rem; border-radius:8px; border:1px solid rgba(255,255,255,0.08);">
            <img src="${f.url}" alt="Foto ${idx + 1}" onerror="this.src='/assets/violin-1.jpg'" style="width:46px; height:46px; object-fit:cover; border-radius:6px; border:1px solid var(--accent-gold); flex-shrink:0;">
            <div style="flex:1;">
                <label style="font-size:0.7rem; color:var(--text-muted); margin-bottom:0.15rem;">Didascalia Tavola ${idx + 1}</label>
                <input type="text" class="form-control cert-photo-caption-input" data-idx="${idx}" value="${(f.didascalia || '').replace(/"/g, '&quot;')}" placeholder="Es. Tavola Armonica (Fronte)" style="padding:0.35rem 0.65rem; font-size:0.82rem;">
            </div>
            <button type="button" class="btn btn-secondary" style="padding:0.3rem 0.55rem; color:#ef4444;" onclick="window.removeCertDraftPhoto(${idx})" title="Rimuovi foto">
                &times;
            </button>
        </div>
    `).join('');
};

window.syncCertPhotoCaptionsFromDOM = function() {
    const inputs = document.querySelectorAll(".cert-photo-caption-input");
    inputs.forEach(inp => {
        const idx = parseInt(inp.getAttribute("data-idx"), 10);
        if (!isNaN(idx) && window.certPhotoDrafts[idx]) {
            window.certPhotoDrafts[idx].didascalia = inp.value.trim() || `Tavola ${idx + 1}`;
        }
    });
};

window.addCertGalleryPhoto = function(url, caption) {
    window.syncCertPhotoCaptionsFromDOM();
    window.certPhotoDrafts.push({ url: url, didascalia: caption });
    window.renderCertPhotoDraftList();
};

window.removeCertDraftPhoto = function(idx) {
    window.syncCertPhotoCaptionsFromDOM();
    window.certPhotoDrafts.splice(idx, 1);
    window.renderCertPhotoDraftList();
};

window.handleCertPhotoUpload = function(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    window.syncCertPhotoCaptionsFromDOM();

    const defaultCaptions = [
        "Tavola Armonica (Vista Frontale)",
        "Fondo in Acero Marezzato (Vista Posteriore)",
        "Profilo Laterale & Fascia",
        "Scultura del Riccio e Cassetta Piroli",
        "Dettaglio Effe e Cartiglio Interno"
    ];

    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Ridimensiona a max 900px per garantire leggerezza in LocalStorage e nitidezza in stampa A4
                const maxDim = 900;
                let w = img.width;
                let h = img.height;
                if (w > maxDim || h > maxDim) {
                    if (w > h) {
                        h = Math.round((h * maxDim) / w);
                        w = maxDim;
                    } else {
                        w = Math.round((w * maxDim) / h);
                        h = maxDim;
                    }
                }
                const canvas = document.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.84);

                const nextIdx = window.certPhotoDrafts.length;
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
                const suggestedCaption = defaultCaptions[nextIdx] || cleanName || `Tavola Fotografica ${nextIdx + 1}`;

                window.certPhotoDrafts.push({
                    url: compressedDataUrl,
                    didascalia: suggestedCaption
                });
                window.renderCertPhotoDraftList();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    event.target.value = "";
};

window.applyCertMeasurePreset = function(type) {
    const presets = {
        violino: {
            cassa: "355.5 mm",
            sup: "167.5 mm",
            cc: "111.5 mm",
            inf: "207.8 mm",
            fasceSup: "30.0 mm",
            fasceInf: "31.8 mm",
            diapason: "195.0 mm",
            manico: "130.0 mm"
        },
        viola: {
            cassa: "415.0 mm",
            sup: "198.0 mm",
            cc: "134.0 mm",
            inf: "246.0 mm",
            fasceSup: "37.5 mm",
            fasceInf: "39.5 mm",
            diapason: "223.0 mm",
            manico: "148.0 mm"
        },
        violoncello: {
            cassa: "755.0 mm",
            sup: "348.0 mm",
            cc: "242.0 mm",
            inf: "440.0 mm",
            fasceSup: "118.0 mm",
            fasceInf: "124.0 mm",
            diapason: "400.0 mm",
            manico: "280.0 mm"
        }
    };
    const p = presets[type];
    if (!p) return;
    document.getElementById("f_cert_m_cassa").value = p.cassa;
    document.getElementById("f_cert_m_sup").value = p.sup;
    document.getElementById("f_cert_m_cc").value = p.cc;
    document.getElementById("f_cert_m_inf").value = p.inf;
    document.getElementById("f_cert_m_fasceSup").value = p.fasceSup;
    document.getElementById("f_cert_m_fasceInf").value = p.fasceInf;
    document.getElementById("f_cert_m_diapason").value = p.diapason;
    document.getElementById("f_cert_m_manico").value = p.manico;
};

window.prefillCertFromInstrument = function(val) {
    if (!val) return;
    const [source, id] = val.split(':');
    if (source === 'str') {
        const s = window.atelierDB.getItem('magazzinoStrumenti', id);
        if (!s) return;
        document.getElementById("f_cert_strumento").value = s.nome || "";
        document.getElementById("f_cert_tipologiaStrumento").value = s.tipologia || "Violino 4/4";
        document.getElementById("f_cert_modello").value = s.modello || "";
        document.getElementById("f_cert_anno").value = String(s.annoCostruzione || new Date().getFullYear());
        document.getElementById("f_cert_etichetta").value = `Fabio De Lorenzi fecit anno Domini ${s.annoCostruzione || new Date().getFullYear()} — ${s.codice || ''}`;
        document.getElementById("f_cert_noteCons").value = `Strumento d'autore in perfetto stato di conservazione, integro in ogni sua parte originale. Vernice: ${s.vernice || 'tradizionale a olio'}.`;
        if ((s.tipologia || '').toLowerCase().includes('viola')) window.applyCertMeasurePreset('viola');
        else if ((s.tipologia || '').toLowerCase().includes('cello')) window.applyCertMeasurePreset('violoncello');
        else window.applyCertMeasurePreset('violino');
    } else if (source === 'cost') {
        const b = window.atelierDB.getItem('costruzione', id);
        if (!b) return;
        document.getElementById("f_cert_strumento").value = `${b.modello} (${b.opNumero})`;
        document.getElementById("f_cert_modello").value = b.modello || "";
        document.getElementById("f_cert_destinatario").value = b.committente && !b.committente.includes('Vendita') ? b.committente : "";
        document.getElementById("f_cert_noteCons").value = `Strumento nuovo d'autore (${b.opNumero}). Tavola armonica: ${b.legnoTavola}. Fondo e fasce: ${b.legnoFondo}. Frequenza tavola: ${b.frequenzaTavola}.`;
    } else if (source === 'res') {
        const r = window.atelierDB.getItem('restauro', id);
        if (!r) return;
        document.getElementById("f_cert_tipoDoc").value = "Perizia Tecnica & Stato di Conservazione";
        document.getElementById("f_cert_strumento").value = r.strumento || "";
        document.getElementById("f_cert_destinatario").value = r.proprietario || "";
        document.getElementById("f_cert_statoCons").value = "Buono — Restaurato conservativamente a regola d'arte";
        document.getElementById("f_cert_noteCons").value = `Diagnosi storica: ${r.diagnosi} Interventi eseguiti in Atelier: ${r.interventiPrevisti}`;
    }
};

window.openEditCertificatoModal = function(certId) {
    const cert = window.atelierDB.getItem("certificati", certId);
    if (!cert) return;
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");

    modalTitle.innerText = `Modifica Certificato: ${cert.numeroCertificato}`;
    modalBody.innerHTML = window.buildCertificatoModalForm(cert);
    modalOverlay.classList.add("active");
    window.renderCertPhotoDraftList();
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.selectCertificatePreview = function(certId, scrollToPreview = false) {
    window.selectedCertificateId = certId;
    if (window.appController && window.appController.activeModuleId === 'certificati') {
        const container = document.getElementById("moduleContentContainer");
        if (container && window.AppModules.renderCertificati) {
            window.AppModules.renderCertificati(container);
            window.appController.setupLucideIcons();
            if (scrollToPreview) {
                const panel = document.getElementById("certPreviewPanel");
                if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }
};

window.openCertificateForInstrument = function(instrId) {
    const s = window.atelierDB.getItem("magazzinoStrumenti", instrId);
    if (!s) return;
    const certs = window.atelierDB.data.certificati || [];
    const match = certs.find(c =>
        (c.strumento && s.nome && c.strumento.toLowerCase().includes(s.nome.toLowerCase())) ||
        (s.nome && c.strumento && s.nome.toLowerCase().includes(c.strumento.toLowerCase()))
    );
    window.appController.openModule('certificati');
    if (match) {
        window.selectCertificatePreview(match.id, true);
        window.showToast(`Certificato ${match.numeroCertificato} aperto su Carta Intestata`);
    } else {
        window.openAddModal('certificati');
        setTimeout(() => {
            window.prefillCertFromInstrument(`str:${instrId}`);
        }, 50);
    }
};

window.printCertificate = function(certId) {
    const cert = window.atelierDB.getItem("certificati", certId);
    if (!cert) return;

    const paperHTML = window.AppModules.buildCertificatoPaperHTML(cert);
    const origin = window.location.origin;
    const baseHref = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);

    const printWin = window.open('', '_blank', 'width=1024,height=900');
    if (!printWin) {
        window.showToast("Abilita i pop-up nel browser per stampare il certificato A4.");
        return;
    }

    const stylesEl = document.querySelector('link[href*="styles.css"]');
    const stylesHref = stylesEl ? stylesEl.href : `${baseHref}css/styles.css`;

    printWin.document.open();
    printWin.document.write(`<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <base href="${baseHref}">
    <title>${cert.numeroCertificato} - ${cert.strumento} | Liuteria De Lorenzi</title>
    <link rel="stylesheet" href="${stylesHref}">
    <style>
        @page {
            size: A4 portrait;
            margin: 8mm;
        }
        body {
            background: #1a1815;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        .print-Floating-bar {
            position: sticky;
            top: 0;
            z-index: 9999;
            width: 100%;
            background: #121620;
            border-bottom: 1px solid rgba(245, 158, 11, 0.4);
            padding: 0.75rem 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #fff;
            font-family: 'Plus Jakarta Sans', sans-serif;
            box-shadow: 0 4px 20px rgba(0,0,0,0.6);
        }
        .print-sheet-wrapper {
            padding: 1.5rem;
            width: 100%;
            display: flex;
            justify-content: center;
        }
        @media print {
            html, body {
                background: #fff !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .print-Floating-bar {
                display: none !important;
            }
            .print-sheet-wrapper {
                padding: 0 !important;
                margin: 0 !important;
                display: block !important;
            }
            .cert-letterhead-sheet {
                box-shadow: none !important;
                margin: 0 auto !important;
                width: 100% !important;
                max-width: 100% !important;
            }
        }
    </style>
</head>
<body>
    <div class="print-Floating-bar">
        <div>
            <strong style="color:#fbbf24; font-family:'Cinzel', serif;">LIUTERIA DE LORENZI</strong>
            <span style="margin-left:0.75rem; font-size:0.85rem; color:#9ca3af;">Anteprima di Stampa A4 su Carta Intestata &bull; <strong>${cert.numeroCertificato}</strong></span>
        </div>
        <div style="display:flex; gap:0.6rem;">
            <button onclick="window.print()" style="background:linear-gradient(135deg,#f59e0b,#d97706); color:#000; border:none; padding:0.5rem 1.1rem; border-radius:6px; font-weight:700; cursor:pointer;">
                🖨️ Stampa / Salva in PDF
            </button>
            <button onclick="window.close()" style="background:rgba(255,255,255,0.1); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:0.5rem 0.9rem; border-radius:6px; cursor:pointer;">
                ✕ Chiudi
            </button>
        </div>
    </div>
    <div class="print-sheet-wrapper">
        ${paperHTML}
    </div>
    <script>
        window.addEventListener('load', function() {
            setTimeout(function() { window.print(); }, 450);
        });
    </script>
</body>
</html>`);
    printWin.document.close();
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

// ==========================================================================
// SOCIAL STUDIO: UPLOAD FOTO & VIDEO GRANDI DIMENSIONI (INDEXEDDB) & SCHEDULER
// ==========================================================================

window.SOCIAL_PLATFORMS_CATALOG = [
    { id: "Instagram", label: "Instagram", sub: "Post, Carosello, Reel", icon: "instagram", color: "#e1306c", bg: "rgba(225, 48, 108, 0.14)", border: "rgba(225, 48, 108, 0.45)" },
    { id: "Facebook", label: "Facebook", sub: "Pagina Atelier & Video HD", icon: "facebook", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.14)", border: "rgba(59, 130, 246, 0.45)" },
    { id: "YouTube", label: "YouTube", sub: "Showcase 4K & Shorts", icon: "youtube", color: "#ef4444", bg: "rgba(239, 68, 68, 0.14)", border: "rgba(239, 68, 68, 0.45)" },
    { id: "TikTok", label: "TikTok", sub: "Clip & Timelapse Liuteria", icon: "video", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.14)", border: "rgba(6, 182, 212, 0.45)" },
    { id: "LinkedIn", label: "LinkedIn", sub: "Network & Collezionisti", icon: "linkedin", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.14)", border: "rgba(14, 165, 233, 0.45)" }
];

window.formatSocialBytes = function(bytes) {
    if (!bytes || bytes <= 0) return "0 MB";
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
    if (mb >= 1) return mb.toFixed(1) + " MB";
    return Math.max(1, Math.round(bytes / 1024)) + " KB";
};

/**
 * IndexedDB Storage Engine for Large Photo & Video Files (supports >500MB / 4K Videos)
 */
class SocialMediaStorageEngine {
    constructor() {
        this.dbName = "AtelierLiuteriaSocialMediaDB_v1";
        this.storeName = "media_blobs";
        this.db = null;
        this.objectUrlCache = {};
    }

    init() {
        return new Promise((resolve) => {
            if (this.db) return resolve(this.db);
            if (!window.indexedDB) {
                console.warn("[SocialMediaDB] IndexedDB non supportato dal browser.");
                return resolve(null);
            }
            const req = window.indexedDB.open(this.dbName, 1);
            req.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(this.storeName)) {
                    db.createObjectStore(this.storeName, { keyPath: "id" });
                }
            };
            req.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            req.onerror = (e) => {
                console.warn("[SocialMediaDB] Errore apertura IndexedDB:", e);
                resolve(null);
            };
        });
    }

    async saveBlob(id, fileOrBlob, metadata = {}) {
        const db = await this.init();
        // Create immediate in-memory ObjectURL so playback works right away
        if (fileOrBlob instanceof Blob) {
            if (this.objectUrlCache[id]) {
                URL.revokeObjectURL(this.objectUrlCache[id]);
            }
            this.objectUrlCache[id] = URL.createObjectURL(fileOrBlob);
        }
        if (!db) return false;

        return new Promise((resolve) => {
            try {
                const tx = db.transaction([this.storeName], "readwrite");
                const store = tx.objectStore(this.storeName);
                store.put({
                    id: id,
                    blob: fileOrBlob,
                    name: metadata.name || fileOrBlob.name || id,
                    mimeType: metadata.mimeType || fileOrBlob.type || "application/octet-stream",
                    sizeBytes: metadata.sizeBytes || fileOrBlob.size || 0,
                    createdAt: new Date().toISOString()
                });
                tx.oncomplete = () => resolve(true);
                tx.onerror = (err) => {
                    console.warn("[SocialMediaDB] Errore salvataggio blob:", err);
                    resolve(false);
                };
            } catch (err) {
                console.warn("[SocialMediaDB] Eccezione salvataggio blob:", err);
                resolve(false);
            }
        });
    }

    async getObjectUrl(id) {
        if (!id) return null;
        if (this.objectUrlCache[id]) return this.objectUrlCache[id];
        const db = await this.init();
        if (!db) return null;

        return new Promise((resolve) => {
            try {
                const tx = db.transaction([this.storeName], "readonly");
                const store = tx.objectStore(this.storeName);
                const req = store.get(id);
                req.onsuccess = () => {
                    const res = req.result;
                    if (res && res.blob instanceof Blob) {
                        const objUrl = URL.createObjectURL(res.blob);
                        this.objectUrlCache[id] = objUrl;
                        resolve(objUrl);
                    } else {
                        resolve(null);
                    }
                };
                req.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    }

    async getBlob(id) {
        if (!id) return null;
        const db = await this.init();
        if (!db) return null;
        return new Promise((resolve) => {
            try {
                const tx = db.transaction([this.storeName], "readonly");
                const store = tx.objectStore(this.storeName);
                const req = store.get(id);
                req.onsuccess = () => {
                    const res = req.result;
                    resolve((res && res.blob instanceof Blob) ? res.blob : null);
                };
                req.onerror = () => resolve(null);
            } catch (e) {
                resolve(null);
            }
        });
    }

    async deleteBlob(id) {
        if (!id) return;
        if (this.objectUrlCache[id]) {
            URL.revokeObjectURL(this.objectUrlCache[id]);
            delete this.objectUrlCache[id];
        }
        const db = await this.init();
        if (!db) return;
        try {
            const tx = db.transaction([this.storeName], "readwrite");
            tx.objectStore(this.storeName).delete(id);
        } catch (e) {
            // ignore
        }
    }

    async hydrateDOMMedia(rootEl = document) {
        const elements = (rootEl || document).querySelectorAll("[data-social-media-id]");
        for (const el of elements) {
            const mediaId = el.getAttribute("data-social-media-id");
            if (!mediaId) continue;
            const objUrl = await this.getObjectUrl(mediaId);
            if (objUrl) {
                if (el.tagName === "VIDEO") {
                    if (el.src !== objUrl) {
                        el.src = objUrl;
                    }
                } else if (el.tagName === "IMG") {
                    el.src = objUrl;
                } else if (el.tagName === "A") {
                    el.href = objUrl;
                }
            }
        }
    }
}

window.socialMediaDB = new SocialMediaStorageEngine();
window.socialMediaDrafts = [];
window.socialFilterState = 'all';
window.socialPlatformFilter = 'all';

window.setSocialFilter = function(filterId) {
    window.socialFilterState = filterId;
    if (window.appController && window.appController.activeModuleId === 'social') {
        const container = document.getElementById("moduleContentContainer");
        if (container && window.AppModules.renderSocial) {
            window.AppModules.renderSocial(container);
            window.appController.setupLucideIcons();
        }
    }
};

window.setSocialPlatformFilter = function(platformId) {
    window.socialPlatformFilter = platformId;
    if (window.appController && window.appController.activeModuleId === 'social') {
        const container = document.getElementById("moduleContentContainer");
        if (container && window.AppModules.renderSocial) {
            window.AppModules.renderSocial(container);
            window.appController.setupLucideIcons();
        }
    }
};

window.buildSocialModalForm = function(existingPost = null) {
    const dDefault = new Date();
    dDefault.setHours(dDefault.getHours() + 2, 0, 0, 0);
    const localIso = new Date(dDefault.getTime() - dDefault.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    const p = existingPost || {
        id: "",
        titolo: "",
        piattaforme: ["Instagram", "Facebook"],
        formatoPost: "Post Foto / Carosello HD",
        dataProgrammata: localIso,
        stato: "Programmato",
        autoPublish: true,
        likesPrevisti: "1.8K",
        hashtag: "#lutherie #cremona #violinmaker #tonewood #handmade #stradivari #liuteriadelorenzi",
        note: "",
        mediaAttachments: []
    };

    const normalizedDate = p.dataProgrammata
        ? (p.dataProgrammata.includes('T') ? p.dataProgrammata.slice(0, 16) : p.dataProgrammata.replace(' ', 'T').slice(0, 16))
        : localIso;

    const selectedPlats = Array.isArray(p.piattaforme) && p.piattaforme.length > 0
        ? p.piattaforme
        : (p.piattaforma ? p.piattaforma.split(',').map(s => s.trim()) : ["Instagram"]);

    window.socialMediaDrafts = Array.isArray(p.mediaAttachments)
        ? JSON.parse(JSON.stringify(p.mediaAttachments))
        : [];

    const archiveMedia = (window.atelierDB && window.atelierDB.data.media) || [];

    return `
        <form onsubmit="window.saveNewRecord(event, 'social')">
            <input type="hidden" id="f_soc_edit_id" value="${p.id || ''}">

            <!-- 1. CARICAMENTO MATERIALE FOTOGRAFICO E VIDEO (ANCHE GRANDI DIMENSIONI) -->
            <div style="border-left:3px solid var(--accent-cyan); padding-left:0.75rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <strong style="color:var(--accent-cyan); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">1. Materiale Fotografico & Video (Anche Grandi Dimensioni)</strong>
                    <span style="display:block; font-size:0.75rem; color:var(--text-secondary);">Supporto nativo multi-file per Foto High-Res (JPG, PNG, WEBP, RAW) e Video 4K/FullHD (MP4, MOV, WEBM, MKV > 500MB).</span>
                </div>
                <span class="badge badge-info" style="font-size:0.7rem;">
                    <i data-lucide="hard-drive"></i> IndexedDB Large-File Engine
                </span>
            </div>

            <!-- Drag & Drop Zone -->
            <div id="socialDropzone" style="background:linear-gradient(135deg, rgba(6, 182, 212, 0.07), rgba(245, 158, 11, 0.06)); border:2px dashed rgba(6, 182, 212, 0.45); border-radius:12px; padding:1.3rem 1.2rem; text-align:center; margin-bottom:1rem; transition:all 0.25s ease;">
                <div style="display:flex; justify-content:center; gap:0.8rem; margin-bottom:0.6rem;">
                    <div style="width:44px; height:44px; border-radius:10px; background:rgba(16, 185, 129, 0.16); color:var(--accent-emerald); display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="camera" style="width:22px; height:22px;"></i>
                    </div>
                    <div style="width:44px; height:44px; border-radius:10px; background:rgba(244, 63, 94, 0.16); color:#f43f5e; display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="film" style="width:22px; height:22px;"></i>
                    </div>
                </div>
                <h4 style="color:#fff; font-size:0.98rem; margin-bottom:0.25rem;">Trascina qui Foto e Video oppure selezionali dal dispositivo</h4>
                <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.9rem;">
                    Nessun limite di compressione: i video 4K e le foto pesanti vengono salvati in streaming diretto nel database multimediale locale.
                </p>

                <div style="display:flex; justify-content:center; gap:0.65rem; flex-wrap:wrap;">
                    <label class="btn btn-primary" style="cursor:pointer; margin:0; padding:0.55rem 1.1rem; font-size:0.84rem;">
                        <i data-lucide="image-plus"></i> + Carica Foto High-Res
                        <input type="file" accept="image/*" multiple onchange="window.handleSocialMediaUpload(event)" style="display:none;">
                    </label>
                    <label class="btn btn-secondary" style="cursor:pointer; margin:0; padding:0.55rem 1.1rem; font-size:0.84rem; border-color:rgba(244, 63, 94, 0.45); color:#fda4af; background:rgba(244, 63, 94, 0.12);">
                        <i data-lucide="video"></i> + Carica Video (4K / Grandi Dimensioni)
                        <input type="file" accept="video/*" multiple onchange="window.handleSocialMediaUpload(event)" style="display:none;">
                    </label>
                    <label class="btn btn-secondary" style="cursor:pointer; margin:0; padding:0.55rem 1rem; font-size:0.82rem;">
                        <i data-lucide="folder-up"></i> Foto + Video Insieme
                        <input type="file" accept="image/*,video/*" multiple onchange="window.handleSocialMediaUpload(event)" style="display:none;">
                    </label>
                </div>

                <!-- Quick Add from Atelier Media Library -->
                <div style="display:flex; justify-content:center; align-items:center; gap:0.4rem; flex-wrap:wrap; margin-top:0.85rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06);">
                    <span style="font-size:0.73rem; color:var(--text-muted);">Libreria Rapida Atelier:</span>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.71rem;" onclick="window.addQuickAtelierSocialMedia('image', './assets/violin-1.jpg', 'violino_master_fronte_4k.jpg', 16252928, '3840×2160 px')">+ Foto Violino 4K</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.71rem;" onclick="window.addQuickAtelierSocialMedia('image', './assets/cremonese.jpg', 'fondo_acero_marezzato_raw.jpg', 22020096, '4500×3000 px')">+ Foto Fondo Marezzato</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.71rem;" onclick="window.addQuickAtelierSocialMedia('image', './assets/craft-1.jpg', 'scultura_riccio_macro.jpg', 14680064, '4000×3000 px')">+ Macro Riccio</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.71rem; color:#fda4af;" onclick="window.addQuickAtelierSocialMedia('video', '', 'timelapse_sgorbiatura_fondo_4k.mp4', 440401920, '3840×2160 (4K UHD)', '04:15', './assets/craft-2.jpg')">+ Video 4K Timelapse (420 MB)</button>
                </div>
            </div>

            <!-- Live Upload Progress Box (shown when processing large files) -->
            <div id="socialUploadProgressBox" style="display:none; background:rgba(6, 182, 212, 0.12); border:1px solid var(--accent-cyan); border-radius:10px; padding:0.85rem 1rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.82rem; margin-bottom:0.4rem;">
                    <span id="socialUploadStatusText" style="color:#fff; font-weight:600;">Caricamento file multimediale in corso...</span>
                    <strong id="socialUploadPercentText" style="color:var(--accent-gold); font-family:var(--font-mono);">0%</strong>
                </div>
                <div class="progress-bar-bg">
                    <div id="socialUploadProgressBar" class="progress-bar-fill" style="width:0%; background:linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald));"></div>
                </div>
            </div>

            <!-- Uploaded Media List Preview -->
            <div id="socialMediaDraftListContainer" style="margin-bottom:1.25rem; display:flex; flex-direction:column; gap:0.55rem;"></div>

            <!-- 2. SELEZIONE DEI SOCIAL SCELTI (MULTI-PIATTAFORMA) -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">2. Scegli i Social su cui Pubblicare</strong>
                    <span style="display:block; font-size:0.75rem; color:var(--text-secondary);">Seleziona uno o più canali social per la pubblicazione simultanea alla data stabilita.</span>
                </div>
                <div style="display:flex; gap:0.4rem;">
                    <button type="button" class="btn btn-secondary" style="padding:0.22rem 0.6rem; font-size:0.72rem;" onclick="window.toggleAllSocialPlatforms(true)">Seleziona Tutti</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.22rem 0.6rem; font-size:0.72rem;" onclick="window.toggleAllSocialPlatforms(false)">Deseleziona</button>
                </div>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap:0.6rem; margin-bottom:1.25rem;">
                ${window.SOCIAL_PLATFORMS_CATALOG.map(plat => {
                    const isChecked = selectedPlats.some(sp => sp.toLowerCase().includes(plat.id.toLowerCase()));
                    return `
                        <label class="social-platform-OptionCard" style="display:flex; align-items:center; gap:0.6rem; padding:0.65rem 0.8rem; border-radius:10px; cursor:pointer; background:${isChecked ? plat.bg : 'rgba(255,255,255,0.03)'}; border:1.5px solid ${isChecked ? plat.border : 'rgba(255,255,255,0.08)'}; transition:all 0.2s ease;" onclick="setTimeout(() => window.syncSocialPlatformCardStyles(), 10)">
                            <input type="checkbox" class="soc-platform-checkbox" value="${plat.id}" ${isChecked ? 'checked' : ''} style="accent-color:${plat.color}; width:16px; height:16px; cursor:pointer;">
                            <div style="overflow:hidden;">
                                <div style="color:#fff; font-weight:700; font-size:0.84rem; display:flex; align-items:center; gap:0.3rem;">
                                    <i data-lucide="${plat.icon}" style="width:14px; height:14px; color:${plat.color};"></i> ${plat.label}
                                </div>
                                <div style="font-size:0.68rem; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${plat.sub}</div>
                            </div>
                        </label>
                    `;
                }).join('')}
            </div>

            <!-- 3. PROGRAMMAZIONE DATA E ORA STABILITA -->
            <div style="border-left:3px solid var(--accent-emerald); padding-left:0.75rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <strong style="color:var(--accent-emerald); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">3. Data e Ora Stabilita per la Pubblicazione</strong>
                    <span style="display:block; font-size:0.75rem; color:var(--text-secondary);">Imposta quando il post verrà pubblicato automaticamente sui social scelti.</span>
                </div>
                <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.7rem;" onclick="window.setSocialSchedulePreset(0, 18, 0)">Oggi 18:00</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.7rem;" onclick="window.setSocialSchedulePreset(1, 12, 30)">Domani 12:30</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.7rem;" onclick="window.setSocialSchedulePreset(3, 19, 0)">+3 Giorni 19:00</button>
                    <button type="button" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.7rem;" onclick="window.setSocialSchedulePreset(7, 18, 0)">+1 Settimana</button>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>📅 Data e Ora di Pubblicazione Stabilita</label>
                    <input type="datetime-local" id="f_soc_data" class="form-control" required value="${normalizedDate}">
                </div>
                <div class="form-group">
                    <label>Stato Programmazione</label>
                    <select id="f_soc_stato" class="form-control">
                        <option value="Programmato" ${p.stato === 'Programmato' ? 'selected' : ''}>⏱️ Programmato (Pubblica alla data stabilita)</option>
                        <option value="In Montaggio" ${p.stato === 'In Montaggio' ? 'selected' : ''}>🎬 In Montaggio / Post-Produzione</option>
                        <option value="Bozza" ${p.stato === 'Bozza' ? 'selected' : ''}>📝 Bozza (Non pubblicare ancora)</option>
                        <option value="Pubblicato" ${p.stato === 'Pubblicato' ? 'selected' : ''}>✅ Pubblicato Subito</option>
                    </select>
                </div>
            </div>

            <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:8px; padding:0.65rem 0.9rem; margin-bottom:1.1rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                <label style="display:flex; align-items:center; gap:0.55rem; cursor:pointer; margin:0; font-size:0.82rem; color:#fff;">
                    <input type="checkbox" id="f_soc_autopublish" ${p.autoPublish !== false ? 'checked' : ''} style="accent-color:var(--accent-emerald); width:16px; height:16px; cursor:pointer;">
                    <span><strong>Pubblicazione Automatica alla Data Stabilita</strong> sui social selezionati</span>
                </label>
                <span style="font-size:0.72rem; color:var(--accent-emerald); font-weight:600;">Scheduler Attivo</span>
            </div>

            <!-- 4. CONTENUTO DEL POST, FORMATO E HASHTAG -->
            <div style="border-left:3px solid var(--accent-violet); padding-left:0.75rem; margin-bottom:0.75rem;">
                <strong style="color:var(--accent-violet); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">4. Titolo, Didascalia & Hashtag</strong>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex:2;">
                    <label>Titolo / Argomento del Post</label>
                    <input type="text" id="f_soc_titolo" class="form-control" required value="${(p.titolo || '').replace(/"/g, '&quot;')}" placeholder="Es. Showcase Scultura Riccio e Prova Acustica Violino Opus 42">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Formato Contenuto</label>
                    <select id="f_soc_formato" class="form-control">
                        <option value="Post Foto / Carosello HD" ${p.formatoPost === 'Post Foto / Carosello HD' ? 'selected' : ''}>Post Foto / Carosello HD</option>
                        <option value="Video 4K / Reel Showcase" ${p.formatoPost === 'Video 4K / Reel Showcase' ? 'selected' : ''}>Video 4K / Reel Showcase</option>
                        <option value="Reel / Short Verticale (9:16)" ${p.formatoPost === 'Reel / Short Verticale (9:16)' ? 'selected' : ''}>Reel / Short Verticale (9:16)</option>
                        <option value="Video Lungo YouTube 4K (16:9)" ${p.formatoPost === 'Video Lungo YouTube 4K (16:9)' ? 'selected' : ''}>Video Lungo YouTube 4K (16:9)</option>
                        <option value="Storia / Dietro le Quinte Bottega" ${p.formatoPost === 'Storia / Dietro le Quinte Bottega' ? 'selected' : ''}>Storia / Dietro le Quinte Bottega</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label>Testo del Post / Didascalia Completa (Caption)</label>
                <textarea id="f_soc_note" class="form-control" rows="3" placeholder="Scrivi qui la descrizione del post da pubblicare sui social scelti (es. dettagli sulla vernice ad olio d'ambra, legni della Val di Fiemme, prova del suono)...">${p.note || ''}</textarea>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex:2;">
                    <label>Hashtag Strategici</label>
                    <input type="text" id="f_soc_hashtag" class="form-control" value="${(p.hashtag || '').replace(/"/g, '&quot;')}" placeholder="#lutherie #cremona #violinmaker #tonewood">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Target Engagement / Likes</label>
                    <input type="text" id="f_soc_likes" class="form-control" value="${p.likesPrevisti || '1.8K'}" placeholder="Es. 2.5K">
                </div>
            </div>

            <div style="display:flex; gap:0.75rem; margin-top:0.8rem; flex-wrap:wrap;">
                <button type="submit" class="btn btn-primary" style="flex:2; justify-content:center; padding:0.85rem; font-size:0.95rem;">
                    <i data-lucide="calendar-check"></i> ${existingPost ? 'Salva Modifiche & Programmazione' : 'Salva e Programma sui Social Scelti'}
                </button>
                <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center; padding:0.85rem; font-size:0.9rem; border-color:rgba(16,185,129,0.45); color:var(--accent-emerald);" onclick="document.getElementById('f_soc_stato').value='Pubblicato'; this.closest('form').requestSubmit();">
                    <i data-lucide="send"></i> Pubblica Subito Ora
                </button>
            </div>
        </form>
    `;
};

window.syncSocialPlatformCardStyles = function() {
    const cards = document.querySelectorAll(".social-platform-OptionCard");
    cards.forEach(card => {
        const cb = card.querySelector(".soc-platform-checkbox");
        if (!cb) return;
        const plat = window.SOCIAL_PLATFORMS_CATALOG.find(p => p.id === cb.value);
        if (cb.checked && plat) {
            card.style.background = plat.bg;
            card.style.borderColor = plat.border;
        } else {
            card.style.background = "rgba(255,255,255,0.03)";
            card.style.borderColor = "rgba(255,255,255,0.08)";
        }
    });
};

window.toggleAllSocialPlatforms = function(checkAll) {
    document.querySelectorAll(".soc-platform-checkbox").forEach(cb => {
        cb.checked = !!checkAll;
    });
    window.syncSocialPlatformCardStyles();
};

window.setSocialSchedulePreset = function(daysAhead, hours, minutes) {
    const inp = document.getElementById("f_soc_data");
    if (!inp) return;
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    d.setHours(hours, minutes, 0, 0);
    const localIso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    inp.value = localIso;
};

window.setupSocialDropzone = function() {
    const dz = document.getElementById("socialDropzone");
    if (!dz) return;
    dz.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "var(--accent-gold)";
        dz.style.background = "rgba(245, 158, 11, 0.14)";
    });
    dz.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(6, 182, 212, 0.45)";
        dz.style.background = "linear-gradient(135deg, rgba(6, 182, 212, 0.07), rgba(245, 158, 11, 0.06))";
    });
    dz.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(6, 182, 212, 0.45)";
        dz.style.background = "linear-gradient(135deg, rgba(6, 182, 212, 0.07), rgba(245, 158, 11, 0.06))";
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            window.processSocialFiles(Array.from(e.dataTransfer.files));
        }
    });
};

window.handleSocialMediaUpload = function(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    window.processSocialFiles(files);
    event.target.value = "";
};

window.handleDirectSocialPageUpload = function(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    event.target.value = "";
    window.openAddModal('social');
    setTimeout(() => {
        window.processSocialFiles(files);
    }, 60);
};

window.processSocialFiles = async function(files) {
    const progBox = document.getElementById("socialUploadProgressBox");
    const progBar = document.getElementById("socialUploadProgressBar");
    const statusText = document.getElementById("socialUploadStatusText");
    const pctText = document.getElementById("socialUploadPercentText");

    if (progBox) progBox.style.display = "block";

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name);
        const mediaId = "smed-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
        const sizeStr = window.formatSocialBytes(file.size);

        if (statusText) statusText.innerText = `[${i + 1}/${files.length}] Elaborazione ${isVideo ? 'Video' : 'Foto'} "${file.name}" (${sizeStr})...`;
        if (pctText) pctText.innerText = "25%";
        if (progBar) progBar.style.width = "25%";

        let metaInfo = {
            dimensions: isVideo ? "Video HD/4K" : "Foto High-Res",
            duration: "",
            thumbnailDataUrl: ""
        };

        try {
            if (isVideo) {
                metaInfo = await window.extractVideoMetadataAndThumbnail(file);
            } else {
                metaInfo = await window.extractImageMetadataAndThumbnail(file);
            }
        } catch (err) {
            console.warn("Impossibile estrarre anteprima file:", err);
        }

        if (statusText) statusText.innerText = `[${i + 1}/${files.length}] Salvataggio stream binario (${sizeStr}) in IndexedDB...`;
        if (pctText) pctText.innerText = "75%";
        if (progBar) progBar.style.width = "75%";

        await window.socialMediaDB.saveBlob(mediaId, file, {
            name: file.name,
            mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
            sizeBytes: file.size
        });

        // Upload also to local/Ubuntu server so 24/7 background scheduler can post even when browser is closed
        let serverMediaUrl = "";
        try {
            if (statusText) statusText.innerText = `[${i + 1}/${files.length}] Sincronizzazione file con Server Scheduler 24/7...`;
            const upResp = await fetch("/api/social/upload-media", {
                method: "POST",
                headers: {
                    "Content-Type": file.type || "application/octet-stream",
                    "X-Media-Id": mediaId,
                    "X-Media-Name": encodeURIComponent(file.name),
                    "X-Media-Mime": file.type || (isVideo ? "video/mp4" : "image/jpeg")
                },
                body: file
            });
            if (upResp.ok) {
                const upJson = await upResp.json();
                if (upJson && upJson.url) {
                    serverMediaUrl = upJson.url;
                }
            }
        } catch (e) {
            // Static mode fallback: IndexedDB is used
        }

        window.socialMediaDrafts.push({
            id: mediaId,
            name: file.name,
            kind: isVideo ? "video" : "image",
            mimeType: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
            sizeBytes: file.size,
            sizeFormatted: sizeStr,
            dimensions: metaInfo.dimensions || (isVideo ? "1920×1080 (HD)" : "High-Res"),
            duration: metaInfo.duration || "",
            thumbnailDataUrl: metaInfo.thumbnailDataUrl || (isVideo ? "./assets/violin-1.jpg" : ""),
            url: serverMediaUrl || "",
            isIndexedDB: true
        });

        // Auto-FILL title if empty
        const titleInput = document.getElementById("f_soc_titolo");
        if (titleInput && !titleInput.value.trim()) {
            const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
            titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
        }
        // Auto-select video format if video uploaded
        const fmtSelect = document.getElementById("f_soc_formato");
        if (isVideo && fmtSelect) {
            fmtSelect.value = "Video 4K / Reel Showcase";
        }

        if (pctText) pctText.innerText = "100%";
        if (progBar) progBar.style.width = "100%";
        window.renderSocialMediaDraftList();
    }

    setTimeout(() => {
        if (progBox) progBox.style.display = "none";
    }, 800);

    window.showToast(`${files.length} file multimediale/i caricato/i con successo!`);
};

window.extractImageMetadataAndThumbnail = function(file) {
    return new Promise((resolve) => {
        const objUrl = URL.createObjectURL(file);
        const img = new Image();
        const timer = setTimeout(() => {
            URL.revokeObjectURL(objUrl);
            resolve({ dimensions: "Foto High-Res", duration: "", thumbnailDataUrl: "./assets/violin-1.jpg" });
        }, 4000);

        img.onload = function() {
            clearTimeout(timer);
            const origW = img.width;
            const origH = img.height;
            const maxDim = 520;
            let w = origW;
            let h = origH;
            if (w > maxDim || h > maxDim) {
                if (w > h) {
                    h = Math.round((h * maxDim) / w);
                    w = maxDim;
                } else {
                    w = Math.round((w * maxDim) / h);
                    h = maxDim;
                }
            }
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, w, h);
            const thumb = canvas.toDataURL("image/jpeg", 0.78);
            URL.revokeObjectURL(objUrl);
            resolve({
                dimensions: `${origW}×${origH} px`,
                duration: "",
                thumbnailDataUrl: thumb
            });
        };
        img.onerror = function() {
            clearTimeout(timer);
            URL.revokeObjectURL(objUrl);
            resolve({ dimensions: "Foto High-Res", duration: "", thumbnailDataUrl: "./assets/violin-1.jpg" });
        };
        img.src = objUrl;
    });
};

window.extractVideoMetadataAndThumbnail = function(file) {
    return new Promise((resolve) => {
        const objUrl = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.muted = true;
        video.playsInline = true;

        let resolved = false;
        const finish = (res) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(timer);
            URL.revokeObjectURL(objUrl);
            resolve(res);
        };

        const timer = setTimeout(() => {
            finish({
                dimensions: "Video 4K / HD",
                duration: "",
                thumbnailDataUrl: "./assets/violin-1.jpg"
            });
        }, 3500);

        const formatDur = (sec) => {
            if (!sec || !isFinite(sec)) return "";
            const total = Math.round(sec);
            const m = Math.floor(total / 60);
            const s = total % 60;
            return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
        };

        video.onloadedmetadata = function() {
            const vw = video.videoWidth || 1920;
            const vh = video.videoHeight || 1080;
            const tag = (vw >= 3840 || vh >= 3840) ? " (4K UHD)" : (vw >= 1920 || vh >= 1920) ? " (Full HD)" : "";
            const dims = `${vw}×${vh}${tag}`;
            const dur = formatDur(video.duration);

            video.currentTime = Math.min(1.0, (video.duration || 2) * 0.25);
            video.onseeked = function() {
                try {
                    const maxDim = 480;
                    let cw = vw;
                    let ch = vh;
                    if (cw > maxDim || ch > maxDim) {
                        if (cw > ch) {
                            ch = Math.round((ch * maxDim) / cw);
                            cw = maxDim;
                        } else {
                            cw = Math.round((cw * maxDim) / ch);
                            ch = maxDim;
                        }
                    }
                    const canvas = document.createElement("canvas");
                    canvas.width = cw;
                    canvas.height = ch;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, cw, ch);
                    const thumb = canvas.toDataURL("image/jpeg", 0.76);
                    finish({ dimensions: dims, duration: dur, thumbnailDataUrl: thumb });
                } catch (e) {
                    finish({ dimensions: dims, duration: dur, thumbnailDataUrl: "./assets/violin-1.jpg" });
                }
            };
        };

        video.onerror = function() {
            finish({
                dimensions: "Video 4K / HD",
                duration: "",
                thumbnailDataUrl: "./assets/violin-1.jpg"
            });
        };

        video.src = objUrl;
    });
};

window.addQuickAtelierSocialMedia = function(kind, url, name, sizeBytes, dimensions, duration = "", thumbUrl = "") {
    window.socialMediaDrafts.push({
        id: "smed-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        name: name,
        kind: kind,
        mimeType: kind === 'video' ? 'video/mp4' : 'image/jpeg',
        sizeBytes: sizeBytes,
        sizeFormatted: window.formatSocialBytes(sizeBytes),
        dimensions: dimensions,
        duration: duration,
        url: url,
        thumbnailDataUrl: thumbUrl || url || "./assets/violin-1.jpg",
        isIndexedDB: false
    });
    window.renderSocialMediaDraftList();
};

window.removeSocialMediaDraft = function(idx) {
    const removed = window.socialMediaDrafts[idx];
    if (removed && removed.isIndexedDB && removed.id) {
        window.socialMediaDB.deleteBlob(removed.id);
    }
    window.socialMediaDrafts.splice(idx, 1);
    window.renderSocialMediaDraftList();
};

window.renderSocialMediaDraftList = function() {
    const container = document.getElementById("socialMediaDraftListContainer");
    if (!container) return;
    const drafts = window.socialMediaDrafts || [];

    if (drafts.length === 0) {
        container.innerHTML = `
            <div style="font-size:0.8rem; color:var(--text-muted); text-align:center; padding:0.65rem; background:rgba(0,0,0,0.25); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                Nessun file allegato al momento. Carica una o più <strong>Foto</strong> o <strong>Video (anche 4K di grandi dimensioni)</strong> qui sopra.
            </div>
        `;
        return;
    }

    const totalSize = drafts.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);

    container.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.78rem; color:var(--text-secondary); padding:0 0.2rem;">
            <span><strong>File Allegati al Post (${drafts.length}):</strong></span>
            <span>Dimensione Totale: <strong style="color:var(--accent-gold); font-family:var(--font-mono);">${window.formatSocialBytes(totalSize)}</strong></span>
        </div>
        ${drafts.map((m, idx) => {
            const isVid = m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/'));
            return `
                <div style="display:flex; align-items:center; gap:0.8rem; background:rgba(255,255,255,0.04); padding:0.55rem 0.75rem; border-radius:10px; border:1px solid ${isVid ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.3)'};">
                    <div style="width:60px; height:48px; border-radius:6px; overflow:hidden; background:#000; position:relative; flex-shrink:0; border:1px solid rgba(255,255,255,0.15);">
                        <img src="${m.thumbnailDataUrl || m.url || './assets/violin-1.jpg'}" alt="${m.name}" onerror="this.src='./assets/violin-1.jpg'" style="width:100%; height:100%; object-fit:cover;">
                        <span style="position:absolute; bottom:2px; right:2px; background:rgba(0,0,0,0.8); color:#fff; font-size:0.6rem; padding:1px 4px; border-radius:3px; font-weight:700;">
                            ${isVid ? '🎬 VID' : '📷 IMG'}
                        </span>
                    </div>
                    <div style="flex:1; min-width:0;">
                        <div style="color:#fff; font-weight:600; font-size:0.84rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                            ${m.name}
                        </div>
                        <div style="font-size:0.73rem; color:var(--text-secondary); display:flex; gap:0.6rem; flex-wrap:wrap; margin-top:0.15rem;">
                            <span style="color:${isVid ? '#fda4af' : 'var(--accent-emerald)'}; font-weight:700;">${isVid ? 'Video' : 'Fotografia'}</span>
                            <span>• ${m.dimensions || 'HD'}</span>
                            ${m.duration ? `<span>• ⏱️ ${m.duration}</span>` : ''}
                            <span style="color:var(--accent-gold); font-family:var(--font-mono);">• ${m.sizeFormatted || window.formatSocialBytes(m.sizeBytes)}</span>
                            ${m.isIndexedDB ? `<span style="color:var(--accent-cyan);">• ✓ Salvato in IndexedDB</span>` : ''}
                        </div>
                    </div>
                    <button type="button" class="btn btn-secondary" style="padding:0.3rem 0.55rem; color:#ef4444; flex-shrink:0;" onclick="window.removeSocialMediaDraft(${idx})" title="Rimuovi file">
                        &times;
                    </button>
                </div>
            `;
        }).join('')}
    `;
};

window.openEditSocialModal = function(postId) {
    const post = window.atelierDB.getItem("social", postId);
    if (!post) return;
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector('.modal-container');
    if (modalContainer) modalContainer.style.maxWidth = '820px';

    modalTitle.innerText = `Modifica Post & Media Social: ${post.titolo}`;
    modalBody.innerHTML = window.buildSocialModalForm(post);
    modalOverlay.classList.add("active");
    window.renderSocialMediaDraftList();
    window.setupSocialDropzone();
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.deleteSocialPost = function(postId, title) {
    const post = window.atelierDB.getItem("social", postId);
    if (!confirm(`Sei sicuro di voler eliminare il post "${title || 'selezionato'}" e i relativi file multimediali?`)) return;
    if (post && Array.isArray(post.mediaAttachments)) {
        post.mediaAttachments.forEach(m => {
            if (m.isIndexedDB && m.id) {
                window.socialMediaDB.deleteBlob(m.id);
            }
        });
    }
    window.atelierDB.removeItem("social", postId);
    if (typeof window.syncSocialWithServer === "function") {
        window.syncSocialWithServer();
    }
    window.showToast("Post e file multimediali rimossi con successo.");
    if (window.appController && window.appController.activeModuleId === 'social') {
        window.appController.openModule('social');
    }
};

window.openSocialPreviewModal = async function(postId) {
    const post = window.atelierDB.getItem("social", postId);
    if (!post) return;

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector('.modal-container');
    if (modalContainer) modalContainer.style.maxWidth = '840px';

    const platforms = Array.isArray(post.piattaforme) && post.piattaforme.length > 0
        ? post.piattaforme
        : (post.piattaforma ? post.piattaforma.split(',').map(s => s.trim()) : ["Instagram"]);
    const mediaList = Array.isArray(post.mediaAttachments) ? post.mediaAttachments : [];

    modalTitle.innerText = `Anteprima Player & Programmazione Multi-Social`;

    modalBody.innerHTML = `
        <div>
            <!-- Status & Platforms Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; background:rgba(0,0,0,0.35); padding:0.9rem 1.1rem; border-radius:10px; border:1px solid rgba(255,255,255,0.08); margin-bottom:1.2rem;">
                <div>
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.3rem;">Canali Social Scelti per la Pubblicazione</div>
                    <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
                        ${platforms.map(pName => `
                            <span class="badge badge-info" style="font-size:0.78rem; padding:0.3rem 0.7rem;">
                                <i data-lucide="share-2"></i> ${pName}
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div style="text-align:right;">
                    <span class="badge ${post.stato === 'Pubblicato' ? 'badge-success' : post.stato === 'Programmato' ? 'badge-info' : 'badge-warning'}" style="font-size:0.8rem;">
                        ${post.stato}
                    </span>
                    <div style="font-size:0.78rem; color:var(--accent-gold); margin-top:0.3rem;">
                        📅 Data stabilita: <strong>${(post.dataProgrammata || '').replace('T', ' ')}</strong>
                    </div>
                </div>
            </div>

            <!-- Media Player / Gallery Viewer -->
            ${mediaList.length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:1.2rem;">
                    ${mediaList.map((m, idx) => {
                        const isVid = m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/'));
                        return `
                            <div style="background:#080a0f; border:1px solid rgba(255,255,255,0.12); border-radius:12px; overflow:hidden;">
                                <div style="padding:0.55rem 0.9rem; background:rgba(255,255,255,0.04); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; font-size:0.78rem;">
                                    <span style="color:#fff; font-weight:600;">
                                        ${isVid ? '🎬 Video Player HD/4K' : '📷 Fotografia High-Res'} (${idx + 1}/${mediaList.length}): <strong>${m.name}</strong>
                                    </span>
                                    <div style="display:flex; align-items:center; gap:0.6rem;">
                                        <span style="color:var(--accent-gold); font-family:var(--font-mono);">${m.dimensions || ''} • ${m.sizeFormatted || window.formatSocialBytes(m.sizeBytes)}</span>
                                        <a data-social-media-id="${m.id}" href="${m.url || m.thumbnailDataUrl || '#'}" download="${m.name || 'media_atelier'}" class="btn btn-secondary" style="padding:0.2rem 0.55rem; font-size:0.72rem;">
                                            <i data-lucide="download"></i> Scarica File
                                        </a>
                                    </div>
                                </div>
                                <div style="display:flex; align-items:center; justify-content:center; max-height:430px; background:#000; position:relative;">
                                    ${isVid ? `
                                        <video data-social-media-id="${m.id}" ${m.url ? `src="${m.url}"` : ''} poster="${m.thumbnailDataUrl || './assets/violin-1.jpg'}" controls playsinline style="width:100%; max-height:420px; object-fit:contain;"></video>
                                    ` : `
                                        <img data-social-media-id="${m.id}" src="${m.url || m.thumbnailDataUrl || './assets/violin-1.jpg'}" alt="${m.name}" style="width:100%; max-height:420px; object-fit:contain;">
                                    `}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            ` : ''}

            <!-- Post Copy & Hashtags -->
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1.1rem; margin-bottom:1.2rem;">
                <h4 style="font-family:var(--font-heading); color:#fff; font-size:1.15rem; margin-bottom:0.5rem;">${post.titolo}</h4>
                ${post.note ? `<p style="font-size:0.88rem; color:var(--text-primary); white-space:pre-line; margin-bottom:0.8rem;">${post.note}</p>` : ''}
                <div style="font-size:0.82rem; color:var(--accent-cyan); font-weight:600;">${post.hashtag || ''}</div>
            </div>

            ${Array.isArray(post.esitoPubblicazione) && post.esitoPubblicazione.length > 0 ? `
                <div style="background:rgba(16, 185, 129, 0.08); border:1px solid rgba(16, 185, 129, 0.3); border-radius:10px; padding:0.9rem 1.1rem; margin-bottom:1.2rem;">
                    <strong style="color:var(--accent-emerald); font-size:0.84rem; display:block; margin-bottom:0.4rem;">✓ Registro Pubblicazione Multi-Social Completata:</strong>
                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                        ${post.esitoPubblicazione.map(ep => `
                            <span class="badge badge-success">${ep.piattaforma}: ${ep.stato} (${ep.timestamp})</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Modal Footer Actions -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem;">
                <button type="button" class="btn btn-secondary" onclick="window.openEditSocialModal('${post.id}')">
                    <i data-lucide="edit-3"></i> Modifica Post / Media / Data
                </button>
                <div style="display:flex; gap:0.6rem;">
                    ${post.stato !== 'Pubblicato' ? `
                        <button type="button" class="btn btn-primary" onclick="window.publishSocialPostNow('${post.id}')">
                            <i data-lucide="send"></i> Pubblica Ora sui Social Scelti (${platforms.join(', ')})
                        </button>
                    ` : ''}
                    <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Chiudi</button>
                </div>
            </div>
        </div>
    `;

    modalOverlay.classList.add("active");
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
    if (window.socialMediaDB) {
        await window.socialMediaDB.hydrateDOMMedia(modalBody);
    }
};

// ==========================================================================
// SOCIAL WEBHOOK BRIDGE (MAKE.COM / ZAPIER / N8N) & SERVER-SIDE SCHEDULER SYNC
// ==========================================================================

window.getSocialIntegrationConfig = function() {
    if (!window.atelierDB.data.settings) window.atelierDB.data.settings = {};
    if (!window.atelierDB.data.settings.socialIntegration) {
        window.atelierDB.data.settings.socialIntegration = {
            enabled: false,
            provider: "make",
            webhookUrl: "",
            instagramWebhookUrl: "",
            facebookWebhookUrl: "",
            webhookSecret: "",
            payloadFormat: "multipart",
            publicBaseUrl: "",
            instagramAccountLabel: "@liuteriadelorenzi",
            facebookPageLabel: "Liuteria De Lorenzi",
            lastTestStatus: "unconfigured",
            lastTestTime: "",
            lastTestMessage: ""
        };
    }
    return window.atelierDB.data.settings.socialIntegration;
};

window.isSocialWebhookConfigured = function(cfgObj = null) {
    const cfg = cfgObj || window.getSocialIntegrationConfig();
    return Boolean(
        (cfg.webhookUrl && cfg.webhookUrl.trim()) ||
        (cfg.instagramWebhookUrl && cfg.instagramWebhookUrl.trim()) ||
        (cfg.facebookWebhookUrl && cfg.facebookWebhookUrl.trim())
    );
};

window.syncSocialWithServer = async function() {
    if (!window.atelierDB || !window.atelierDB.data) return;
    const cfg = window.getSocialIntegrationConfig();
    const posts = Array.isArray(window.atelierDB.data.social) ? window.atelierDB.data.social : [];

    try {
        const resp = await fetch("/api/social/sync-posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ posts: posts, config: cfg })
        });
        if (!resp.ok) return;
        const data = await resp.json();
        if (data && data.success) {
            let changed = false;
            if (Array.isArray(data.posts)) {
                const oldJson = JSON.stringify(window.atelierDB.data.social);
                const newJson = JSON.stringify(data.posts);
                if (oldJson !== newJson) {
                    window.atelierDB.data.social = data.posts;
                    changed = true;
                }
            }
            if (data.config && typeof data.config === "object") {
                const localHasUrl = window.isSocialWebhookConfigured(cfg);
                const serverHasUrl = window.isSocialWebhookConfigured(data.config);
                if (serverHasUrl && !localHasUrl) {
                    window.atelierDB.data.settings.socialIntegration = { ...cfg, ...data.config };
                    changed = true;
                }
            }
            if (changed) {
                window.atelierDB.saveData();
                if (window.appController && window.appController.activeModuleId === "social") {
                    const container = document.getElementById("moduleContentContainer");
                    if (container && window.AppModules.renderSocial) {
                        window.AppModules.renderSocial(container);
                        window.appController.setupLucideIcons();
                    }
                }
            }
        }
    } catch (e) {
        // Server Python non raggiungibile (modalità statica): continua con LocalStorage/IndexedDB
    }
};

window.resolveMediaBlobForBrowserWebhook = async function(mediaItem) {
    if (!mediaItem) return null;
    // 1. Check IndexedDB
    if (window.socialMediaDB && mediaItem.id) {
        const idbBlob = await window.socialMediaDB.getBlob(mediaItem.id);
        if (idbBlob) return idbBlob;
    }
    // 2. Check URL / asset / dataURL
    const srcUrl = mediaItem.url || mediaItem.thumbnailDataUrl || "";
    if (srcUrl) {
        try {
            const r = await fetch(srcUrl);
            if (r.ok) return await r.blob();
        } catch (e) {
            // ignore
        }
    }
    return null;
};

window.dispatchSocialWebhookFromBrowser = async function(post, cfg, isTest = false) {
    const mainUrl = (cfg.webhookUrl || "").trim();
    const igUrl = (cfg.instagramWebhookUrl || "").trim();
    const fbUrl = (cfg.facebookWebhookUrl || "").trim();
    const payloadFmt = (cfg.payloadFormat || "multipart").trim().toLowerCase();
    const providerName = (cfg.provider || "make").toUpperCase();

    const platforms = Array.isArray(post.piattaforme) && post.piattaforme.length > 0
        ? post.piattaforme
        : (post.piattaforma ? post.piattaforma.split(",").map(s => s.trim()).filter(Boolean) : ["Instagram", "Facebook"]);

    const urlTargets = new Map();
    platforms.forEach(p => {
        const pLow = p.toLowerCase();
        let targetU = mainUrl;
        if (pLow.includes("instagram") && igUrl) targetU = igUrl;
        else if (pLow.includes("facebook") && fbUrl) targetU = fbUrl;
        if (targetU) {
            if (!urlTargets.has(targetU)) urlTargets.set(targetU, []);
            urlTargets.get(targetU).push(p);
        }
    });

    if (urlTargets.size === 0) {
        const fallback = mainUrl || igUrl || fbUrl;
        if (fallback) urlTargets.set(fallback, platforms);
    }

    if (urlTargets.size === 0) {
        return {
            success: false,
            code: "MISSING_WEBHOOK",
            error: "Accessi Social non configurati: inserisci l'URL del Webhook (Make.com / Zapier / n8n) per Instagram e Facebook."
        };
    }

    const titolo = (post.titolo || "Post Liuteria De Lorenzi").trim();
    const note = (post.note || "").trim();
    const hashtag = (post.hashtag || "").trim();
    const captionFull = [titolo, note, hashtag].filter(Boolean).join("\n\n");
    const mediaList = Array.isArray(post.mediaAttachments) ? post.mediaAttachments : [];
    const primaryMedia = mediaList[0] || null;
    const primaryBlob = primaryMedia ? await window.resolveMediaBlobForBrowserWebhook(primaryMedia) : null;
    const nowIso = new Date().toISOString();
    const nowTimeStr = new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

    const esitoList = [];
    const errors = [];

    for (const [targetUrl, targetPlats] of urlTargets.entries()) {
        const wantsIg = targetPlats.some(p => p.toLowerCase().includes("instagram"));
        const wantsFb = targetPlats.some(p => p.toLowerCase().includes("facebook"));

        try {
            let fetchOptions;
            if (payloadFmt === "multipart" && primaryBlob) {
                const fd = new FormData();
                fd.append("event", isTest ? "test_webhook" : "publish_social_post");
                fd.append("is_test", isTest ? "true" : "false");
                fd.append("atelier", "Liuteria De Lorenzi - Cremona");
                fd.append("post_id", post.id || "soc-test");
                fd.append("title", titolo);
                fd.append("caption", note || titolo);
                fd.append("hashtags", hashtag);
                fd.append("caption_full", captionFull);
                fd.append("formato_post", post.formatoPost || "Post Foto / Carosello HD");
                fd.append("platforms", JSON.stringify(targetPlats));
                fd.append("platforms_csv", targetPlats.join(", "));
                fd.append("publish_instagram", wantsIg ? "true" : "false");
                fd.append("publish_facebook", wantsFb ? "true" : "false");
                fd.append("instagram_account", cfg.instagramAccountLabel || "@liuteriadelorenzi");
                fd.append("facebook_page", cfg.facebookPageLabel || "Liuteria De Lorenzi");
                fd.append("media_type", (primaryMedia && primaryMedia.kind === "video") ? "VIDEO" : "IMAGE");
                fd.append("scheduled_at", post.dataProgrammata || nowIso);
                fd.append("published_at", nowIso);
                fd.append("file", primaryBlob, (primaryMedia && primaryMedia.name) || "media_atelier.jpg");
                fetchOptions = { method: "POST", body: fd };
            } else {
                const payloadObj = {
                    event: isTest ? "test_webhook" : "publish_social_post",
                    is_test: isTest,
                    atelier: "Liuteria De Lorenzi - Cremona",
                    post_id: post.id || "soc-test",
                    title: titolo,
                    caption: note || titolo,
                    hashtags: hashtag,
                    caption_full: captionFull,
                    formato_post: post.formatoPost || "Post Foto / Carosello HD",
                    platforms: targetPlats,
                    platforms_csv: targetPlats.join(", "),
                    publish_instagram: wantsIg,
                    publish_facebook: wantsFb,
                    instagram_account: cfg.instagramAccountLabel || "@liuteriadelorenzi",
                    facebook_page: cfg.facebookPageLabel || "Liuteria De Lorenzi",
                    media_type: (primaryMedia && primaryMedia.kind === "video") ? "VIDEO" : "IMAGE",
                    media_filename: (primaryMedia && primaryMedia.name) || "",
                    scheduled_at: post.dataProgrammata || nowIso,
                    published_at: nowIso
                };
                fetchOptions = {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payloadObj)
                };
            }

            const resp = await fetch(targetUrl, fetchOptions);
            if (resp.ok) {
                targetPlats.forEach(pName => {
                    esitoList.push({
                        piattaforma: pName,
                        stato: `Pubblicato via ${providerName} (HTTP ${resp.status})`,
                        timestamp: nowTimeStr
                    });
                });
            } else {
                errors.push(`HTTP ${resp.status} su ${targetPlats.join(", ")}`);
            }
        } catch (err) {
            errors.push(`Errore connessione Webhook (${targetPlats.join(", ")}): ${err.message || err}`);
        }
    }

    if (errors.length === 0 && esitoList.length > 0) {
        return {
            success: true,
            httpStatus: 200,
            esito: esitoList,
            publishedAt: nowIso
        };
    }
    return {
        success: false,
        code: "WEBHOOK_ERROR",
        error: errors.join(" | ")
    };
};

window.publishSocialPostNow = async function(postId, isAutomatic = false) {
    const post = window.atelierDB.getItem("social", postId);
    if (!post) return;

    const cfg = window.getSocialIntegrationConfig();
    const platforms = Array.isArray(post.piattaforme) && post.piattaforme.length > 0
        ? post.piattaforme
        : (post.piattaforma ? post.piattaforma.split(",").map(s => s.trim()) : ["Instagram", "Facebook"]);

    // 1. Verifica che gli accessi (Webhook URL) siano configurati!
    if (!window.isSocialWebhookConfigured(cfg)) {
        const errMsg = "Accesso Webhook non configurato per Instagram e Facebook. Clicca su 'Configura Accessi IG & FB' e inserisci l'URL del tuo Webhook (Make.com / Zapier / n8n).";
        window.atelierDB.updateItem("social", postId, {
            stato: "Errore Accessi",
            errorePubblicazione: errMsg,
            updatedAt: new Date().toISOString()
        });
        window.showToast("⚠️ Pubblicazione bloccata: manca il Webhook per Instagram e Facebook!");
        if (window.appController && window.appController.activeModuleId === "social") {
            window.appController.openModule("social");
        }
        if (!isAutomatic) {
            window.openSocialConfigModal();
        }
        return;
    }

    if (!isAutomatic) {
        window.showToast(`⏳ Invio in corso a ${platforms.join(" & ")} tramite Webhook...`);
    }

    // Assicurati che eventuali file in IndexedDB siano stati caricati sul server prima dell'invio
    if (Array.isArray(post.mediaAttachments) && window.socialMediaDB) {
        for (const m of post.mediaAttachments) {
            if (m.isIndexedDB && m.id && !m.url) {
                try {
                    const blob = await window.socialMediaDB.getBlob(m.id);
                    if (blob) {
                        const upR = await fetch("/api/social/upload-media", {
                            method: "POST",
                            headers: {
                                "Content-Type": m.mimeType || blob.type || "application/octet-stream",
                                "X-Media-Id": m.id,
                                "X-Media-Name": encodeURIComponent(m.name || "media.jpg"),
                                "X-Media-Mime": m.mimeType || blob.type || "image/jpeg"
                            },
                            body: blob
                        });
                        if (upR.ok) {
                            const upData = await upR.json();
                            if (upData && upData.url) m.url = upData.url;
                        }
                    }
                } catch (e) {
                    // ignore if static mode
                }
            }
        }
    }

    let result = null;
    try {
        const resp = await fetch("/api/social/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                postId: post.id,
                post: post,
                config: cfg,
                test: false
            })
        });
        if (resp.ok) {
            result = await resp.json();
        } else {
            result = await window.dispatchSocialWebhookFromBrowser(post, cfg, false);
        }
    } catch (e) {
        result = await window.dispatchSocialWebhookFromBrowser(post, cfg, false);
    }

    if (result && result.success) {
        window.atelierDB.updateItem("social", postId, {
            stato: "Pubblicato",
            dataPubblicazioneEffettiva: result.publishedAt || new Date().toISOString(),
            esitoPubblicazione: result.esito || platforms.map(p => ({
                piattaforma: p,
                stato: "Pubblicato via Webhook",
                timestamp: new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })
            })),
            errorePubblicazione: "",
            updatedAt: new Date().toISOString()
        });

        const mediaCount = Array.isArray(post.mediaAttachments) ? post.mediaAttachments.length : 0;
        const msgPrefix = isAutomatic ? "⏰ [Pubblicazione Automatica]" : "🚀 Post inviato con successo";
        window.showToast(`${msgPrefix} su ${platforms.join(", ")}: "${post.titolo}" (${mediaCount} file)`);
    } else {
        const errMsg = (result && result.error) || "Errore durante la chiamata al Webhook.";
        window.atelierDB.updateItem("social", postId, {
            stato: (result && result.code === "MISSING_WEBHOOK") ? "Errore Accessi" : "Errore Invio",
            errorePubblicazione: errMsg,
            updatedAt: new Date().toISOString()
        });
        window.showToast(`❌ Errore pubblicazione Social: ${errMsg}`);
    }

    if (window.appController && window.appController.activeModuleId === "social") {
        window.appController.openModule("social");
    }
    const modalOverlay = document.getElementById("modalOverlay");
    if (modalOverlay && modalOverlay.classList.contains("active") && !isAutomatic && result && result.success) {
        window.openSocialPreviewModal(postId);
    }
};

window.checkScheduledSocialPosts = async function(manualClick = false) {
    if (!window.atelierDB || !window.atelierDB.data || !Array.isArray(window.atelierDB.data.social)) return;

    // 1. Sincronizza prima con lo scheduler 24/7 del server Python
    await window.syncSocialWithServer();

    const now = Date.now();
    let processedAny = 0;

    for (const post of window.atelierDB.data.social) {
        if (post.stato === "Programmato" && post.autoPublish !== false && post.dataProgrammata) {
            const norm = post.dataProgrammata.includes("T") ? post.dataProgrammata : post.dataProgrammata.replace(" ", "T");
            const targetTime = new Date(norm).getTime();
            if (!isNaN(targetTime) && targetTime <= now) {
                await window.publishSocialPostNow(post.id, !manualClick);
                processedAny++;
            }
        }
    }

    if (manualClick && processedAny === 0) {
        const waiting = window.atelierDB.data.social.filter(p => p.stato === "Programmato").length;
        const cfgOk = window.isSocialWebhookConfigured();
        if (!cfgOk) {
            window.showToast(`⚠️ Attenzione: ${waiting} post in coda ma il Webhook per Instagram & Facebook non è ancora configurato!`);
        } else {
            window.showToast(`✓ Coda verificata: ${waiting} post programmati in attesa dell'orario stabilito (Webhook IG & FB attivo).`);
        }
        if (window.appController && window.appController.activeModuleId === "social") {
            window.appController.openModule("social");
        }
    }
};

window.openSocialConfigModal = function() {
    const cfg = window.getSocialIntegrationConfig();
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector(".modal-container");
    if (modalContainer) modalContainer.style.maxWidth = "820px";

    modalTitle.innerText = "🔗 Configurazione Accessi Automatici Instagram & Facebook (Opzione B — Webhook)";

    modalBody.innerHTML = `
        <form onsubmit="window.saveSocialConfigFromModal(event)">
            <!-- Spiegazione architettura Opzione B -->
            <div style="background:linear-gradient(135deg, rgba(225, 48, 108, 0.12), rgba(59, 130, 246, 0.12)); border:1px solid rgba(225, 48, 108, 0.35); border-radius:10px; padding:1rem 1.15rem; margin-bottom:1.2rem;">
                <div style="display:flex; align-items:center; gap:0.65rem; margin-bottom:0.35rem;">
                    <i data-lucide="share-2" style="color:#e1306c; width:20px; height:20px;"></i>
                    <strong style="color:#fff; font-size:0.95rem;">Ponte Automatico verso Instagram & Facebook (Make.com / Zapier / n8n)</strong>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                    Quando scatta la data e l'ora stabilita (anche a browser chiuso grazie al servizio 24/7 su Server Ubuntu), il Gestionale invia automaticamente <strong>Foto High-Res / Video 4K, Titolo, Didascalia e Hashtag</strong> al tuo Webhook, che li pubblica istantaneamente sulla tua pagina <strong>Facebook</strong> e sul profilo <strong>Instagram</strong>.
                </p>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Piattaforma Automazione Scelta</label>
                    <select id="f_soc_cfg_provider" class="form-control">
                        <option value="make" ${cfg.provider === "make" ? "selected" : ""}>Make.com (Consigliato — Gratuito fino a 1.000 post/mese)</option>
                        <option value="zapier" ${cfg.provider === "zapier" ? "selected" : ""}>Zapier (Webhooks by Zapier)</option>
                        <option value="n8n" ${cfg.provider === "n8n" ? "selected" : ""}>n8n (Self-Hosted o Cloud)</option>
                        <option value="custom" ${cfg.provider === "custom" ? "selected" : ""}>Webhook HTTP Custom</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Formato Trasmissione Media & Dati</label>
                    <select id="f_soc_cfg_format" class="form-control">
                        <option value="multipart" ${cfg.payloadFormat !== "json" ? "selected" : ""}>📦 Multipart File Diretto (Consigliato — Invia il file binario anche da rete locale)</option>
                        <option value="json" ${cfg.payloadFormat === "json" ? "selected" : ""}>📄 JSON Payload (Metadati + Base64 / URL Pubblico)</option>
                    </select>
                </div>
            </div>

            <!-- Webhook URL Principale -->
            <div class="form-group" style="margin-bottom:1rem;">
                <label style="color:var(--accent-gold); font-weight:700;">
                    🌐 URL Webhook Principale (Unico per Instagram + Facebook) *
                </label>
                <input type="url" id="f_soc_cfg_webhook" class="form-control" value="${(cfg.webhookUrl || "").replace(/"/g, "&quot;")}" placeholder="Es. https://hook.eu1.make.com/xxxxxxxxxxxxxxxxxxxx oppure https://hooks.zapier.com/..." style="font-family:var(--font-mono); font-size:0.85rem;">
                <small style="color:var(--text-muted); font-size:0.74rem; display:block; margin-top:0.25rem;">
                    Incolla qui l'URL del modulo <strong>Custom Webhook</strong> creato su Make.com (o Zapier/n8n). Riceverà i flag <code>publish_instagram</code> e <code>publish_facebook</code>, il testo <code>caption_full</code> e il file allegato <code>file</code>.
                </small>
            </div>

            <!-- URL separati opzionali -->
            <details style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem;">
                <summary style="cursor:pointer; font-size:0.82rem; color:var(--accent-cyan); font-weight:600;">
                    Opzionale: Usa due Webhook separati (uno per Instagram e uno per Facebook) o Token di sicurezza
                </summary>
                <div style="margin-top:0.85rem;">
                    <div class="form-row">
                        <div class="form-group">
                            <label>URL Webhook Dedicato solo a Instagram (opzionale)</label>
                            <input type="url" id="f_soc_cfg_ig_webhook" class="form-control" value="${(cfg.instagramWebhookUrl || "").replace(/"/g, "&quot;")}" placeholder="Lascia vuoto per usare il Webhook principale" style="font-family:var(--font-mono); font-size:0.8rem;">
                        </div>
                        <div class="form-group">
                            <label>URL Webhook Dedicato solo a Facebook (opzionale)</label>
                            <input type="url" id="f_soc_cfg_fb_webhook" class="form-control" value="${(cfg.facebookWebhookUrl || "").replace(/"/g, "&quot;")}" placeholder="Lascia vuoto per usare il Webhook principale" style="font-family:var(--font-mono); font-size:0.8rem;">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>URL Pubblico Gestionale (opzionale)</label>
                            <input type="url" id="f_soc_cfg_public_base" class="form-control" value="${(cfg.publicBaseUrl || "").replace(/"/g, "&quot;")}" placeholder="Es. https://gestionale.liuteriadelorenzi.it">
                        </div>
                        <div class="form-group">
                            <label>Secret / Bearer Token Header (opzionale)</label>
                            <input type="text" id="f_soc_cfg_secret" class="form-control" value="${(cfg.webhookSecret || "").replace(/"/g, "&quot;")}" placeholder="Opzionale">
                        </div>
                    </div>
                </div>
            </details>

            <!-- Etichette Profili -->
            <div class="form-row">
                <div class="form-group">
                    <label><i data-lucide="instagram" style="width:14px; height:14px; color:#e1306c;"></i> Nome Profilo Instagram Collegato</label>
                    <input type="text" id="f_soc_cfg_ig_label" class="form-control" value="${(cfg.instagramAccountLabel || "@liuteriadelorenzi").replace(/"/g, "&quot;")}" placeholder="@liuteriadelorenzi">
                </div>
                <div class="form-group">
                    <label><i data-lucide="facebook" style="width:14px; height:14px; color:#3b82f6;"></i> Nome Pagina Facebook Collegata</label>
                    <input type="text" id="f_soc_cfg_fb_label" class="form-control" value="${(cfg.facebookPageLabel || "Liuteria De Lorenzi").replace(/"/g, "&quot;")}" placeholder="Liuteria De Lorenzi">
                </div>
            </div>

            <!-- Box Esito Test Live -->
            <div id="socialWebhookTestResultBox" style="display:${cfg.lastTestMessage ? 'block' : 'none'}; background:${cfg.lastTestStatus === 'connected' ? 'rgba(16,185,129,0.12)' : 'rgba(244,63,94,0.12)'}; border:1px solid ${cfg.lastTestStatus === 'connected' ? 'var(--accent-emerald)' : '#f43f5e'}; border-radius:8px; padding:0.75rem 1rem; margin-bottom:1rem; font-size:0.82rem; color:#fff;">
                <strong>${cfg.lastTestStatus === 'connected' ? '✅ Ultimo Test:' : '⚠️ Stato Test:'}</strong> ${cfg.lastTestMessage || ''} ${cfg.lastTestTime ? `<span style="color:var(--text-muted);">(${cfg.lastTestTime})</span>` : ''}
            </div>

            <!-- Guida Passo-Passo Make.com -->
            <div style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1rem 1.15rem; margin-bottom:1.2rem;">
                <strong style="color:var(--accent-cyan); font-size:0.84rem; display:block; margin-bottom:0.45rem;">
                    📋 Guida Rapida in 3 Passi per collegare Instagram e Facebook su Make.com:
                </strong>
                <ol style="margin:0; padding-left:1.2rem; font-size:0.78rem; color:var(--text-secondary); line-height:1.55;">
                    <li>Accedi a <strong>make.com</strong> → clicca <em>Create a new scenario</em> → aggiungi il modulo <strong>Webhooks → Custom webhook</strong> → clicca <em>Add</em>, copia l'URL generato e incollalo nel campo <strong>URL Webhook Principale</strong> qui sopra.</li>
                    <li>Clicca sul pulsante <strong>"🧪 Salva & Invia Post di Prova"</strong> qui sotto: Make.com riceverà subito la struttura dati pronta (<code>caption_full</code>, <code>publish_instagram</code>, <code>publish_facebook</code> e il file foto/video <code>file</code>).</li>
                    <li>Su Make.com aggiungi un modulo <strong>Flow Control → Router</strong> con 2 rami:
                        <br>• <strong>Ramo Facebook:</strong> modulo <em>Facebook Pages → Create a Post with a Photo</em> (mappa <code>Data = file</code> e <code>Message = caption_full</code>, con filtro <code>publish_facebook = true</code>).
                        <br>• <strong>Ramo Instagram:</strong> modulo <em>Instagram for Business → Create a Photo Post / Reel</em> (mappa <code>Caption = caption_full</code>, con filtro <code>publish_instagram = true</code>). Attiva lo scenario su <strong>ON</strong>!
                    </li>
                </ol>
            </div>

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <button type="submit" class="btn btn-primary" style="flex:2; justify-content:center; padding:0.85rem; font-size:0.92rem;">
                    <i data-lucide="save"></i> Salva Accessi Webhook IG & FB
                </button>
                <button type="button" class="btn btn-secondary" style="flex:1.5; justify-content:center; padding:0.85rem; font-size:0.88rem; border-color:rgba(16,185,129,0.5); color:var(--accent-emerald);" onclick="window.testSocialWebhookNow(true)">
                    <i data-lucide="zap"></i> 🧪 Salva & Invia Post di Prova
                </button>
            </div>
        </form>
    `;

    modalOverlay.classList.add("active");
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.readSocialConfigFormValues = function() {
    const cfg = window.getSocialIntegrationConfig();
    const webhookUrl = document.getElementById("f_soc_cfg_webhook") ? document.getElementById("f_soc_cfg_webhook").value.trim() : cfg.webhookUrl;
    const igUrl = document.getElementById("f_soc_cfg_ig_webhook") ? document.getElementById("f_soc_cfg_ig_webhook").value.trim() : cfg.instagramWebhookUrl;
    const fbUrl = document.getElementById("f_soc_cfg_fb_webhook") ? document.getElementById("f_soc_cfg_fb_webhook").value.trim() : cfg.facebookWebhookUrl;

    return {
        ...cfg,
        enabled: Boolean(webhookUrl || igUrl || fbUrl),
        provider: document.getElementById("f_soc_cfg_provider") ? document.getElementById("f_soc_cfg_provider").value : (cfg.provider || "make"),
        payloadFormat: document.getElementById("f_soc_cfg_format") ? document.getElementById("f_soc_cfg_format").value : (cfg.payloadFormat || "multipart"),
        webhookUrl: webhookUrl,
        instagramWebhookUrl: igUrl,
        facebookWebhookUrl: fbUrl,
        publicBaseUrl: document.getElementById("f_soc_cfg_public_base") ? document.getElementById("f_soc_cfg_public_base").value.trim() : (cfg.publicBaseUrl || ""),
        webhookSecret: document.getElementById("f_soc_cfg_secret") ? document.getElementById("f_soc_cfg_secret").value.trim() : (cfg.webhookSecret || ""),
        instagramAccountLabel: document.getElementById("f_soc_cfg_ig_label") ? document.getElementById("f_soc_cfg_ig_label").value.trim() || "@liuteriadelorenzi" : "@liuteriadelorenzi",
        facebookPageLabel: document.getElementById("f_soc_cfg_fb_label") ? document.getElementById("f_soc_cfg_fb_label").value.trim() || "Liuteria De Lorenzi" : "Liuteria De Lorenzi"
    };
};

window.saveSocialConfigFromModal = async function(event) {
    if (event) event.preventDefault();
    const updatedCfg = window.readSocialConfigFormValues();
    window.atelierDB.data.settings.socialIntegration = updatedCfg;

    // Se alcuni post erano in stato "Errore Accessi" e ora il webhook c'è, riportali in "Programmato"
    if (updatedCfg.enabled && Array.isArray(window.atelierDB.data.social)) {
        window.atelierDB.data.social.forEach(p => {
            if (p.stato === "Errore Accessi") {
                p.stato = "Programmato";
                p.errorePubblicazione = "";
                p.updatedAt = new Date().toISOString();
            }
        });
    }

    window.atelierDB.saveData();

    try {
        await fetch("/api/social/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedCfg)
        });
        await window.syncSocialWithServer();
    } catch (e) {
        // ignore if static
    }

    window.closeModal();
    window.showToast(updatedCfg.enabled
        ? "✅ Accessi Webhook Instagram & Facebook salvati e attivi!"
        : "Impostazioni Social salvate (nessun URL Webhook inserito).");

    if (window.appController && window.appController.activeModuleId === "social") {
        window.appController.openModule("social");
    }
};

window.testSocialWebhookNow = async function(fromModal = false) {
    const cfg = fromModal ? window.readSocialConfigFormValues() : window.getSocialIntegrationConfig();
    window.atelierDB.data.settings.socialIntegration = cfg;
    window.atelierDB.saveData();

    const resBox = document.getElementById("socialWebhookTestResultBox");
    if (!window.isSocialWebhookConfigured(cfg)) {
        const msg = "Inserisci prima l'URL del Webhook (es. https://hook.eu1.make.com/...) nel campo 'URL Webhook Principale'.";
        if (resBox) {
            resBox.style.display = "block";
            resBox.style.background = "rgba(244, 63, 94, 0.14)";
            resBox.style.borderColor = "#f43f5e";
            resBox.innerHTML = `<strong>⚠️ URL Mancante:</strong> ${msg}`;
        } else {
            window.showToast("⚠️ " + msg);
            window.openSocialConfigModal();
        }
        return;
    }

    if (resBox) {
        resBox.style.display = "block";
        resBox.style.background = "rgba(6, 182, 212, 0.14)";
        resBox.style.borderColor = "var(--accent-cyan)";
        resBox.innerHTML = `<strong>⏳ Invio pacchetto di prova in corso a Make/Zapier/n8n...</strong>`;
    } else {
        window.showToast("⏳ Test connessione Webhook IG & FB in corso...");
    }

    const samplePost = {
        id: "soc-test-" + Date.now(),
        titolo: "Test Connessione Automatica Instagram & Facebook — Liuteria De Lorenzi",
        note: "Verifica collegamento Webhook dal Gestionale Bottega Liuteria De Lorenzi (Cremona). Pubblicazione automatica di Foto High-Res e Video 4K attiva.",
        hashtag: "#liuteriadelorenzi #cremona #violinmaker #lutherie #stradivari",
        piattaforme: ["Instagram", "Facebook"],
        formatoPost: "Post Foto / Carosello HD",
        dataProgrammata: new Date().toISOString().slice(0, 16),
        mediaAttachments: [
            {
                id: "smed-test-sample",
                name: "violin-1.jpg",
                kind: "image",
                mimeType: "image/jpeg",
                url: "./assets/violin-1.jpg",
                thumbnailDataUrl: "./assets/violin-1.jpg"
            }
        ]
    };

    let result = null;
    try {
        const resp = await fetch("/api/social/publish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ test: true, config: cfg, post: samplePost })
        });
        if (resp.ok) {
            result = await resp.json();
        } else {
            result = await window.dispatchSocialWebhookFromBrowser(samplePost, cfg, true);
        }
    } catch (e) {
        result = await window.dispatchSocialWebhookFromBrowser(samplePost, cfg, true);
    }

    const nowStr = new Date().toLocaleString("it-IT");
    cfg.lastTestTime = nowStr;
    if (result && result.success) {
        cfg.lastTestStatus = "connected";
        cfg.lastTestMessage = `Connessione Webhook verificata con successo (HTTP ${result.httpStatus || 200})!`;
        window.atelierDB.saveData();
        if (resBox) {
            resBox.style.background = "rgba(16, 185, 129, 0.15)";
            resBox.style.borderColor = "var(--accent-emerald)";
            resBox.innerHTML = `<strong>✅ ${cfg.lastTestMessage}</strong><br><span style="font-size:0.76rem; color:var(--text-secondary);">Il Webhook ha ricevuto titolo, didascalia, hashtag, flag Instagram/Facebook e foto di prova (${nowStr}).</span>`;
        }
        window.showToast("✅ Test Webhook Instagram & Facebook riuscito!");
    } else {
        cfg.lastTestStatus = "error";
        cfg.lastTestMessage = (result && result.error) || "Impossibile contattare l'URL Webhook specificato.";
        window.atelierDB.saveData();
        if (resBox) {
            resBox.style.background = "rgba(244, 63, 94, 0.15)";
            resBox.style.borderColor = "#f43f5e";
            resBox.innerHTML = `<strong>❌ Errore Test Webhook:</strong> ${cfg.lastTestMessage}`;
        }
        window.showToast(`❌ Errore Test Webhook: ${cfg.lastTestMessage}`);
    }

    if (window.appController && window.appController.activeModuleId === "social" && !fromModal) {
        window.appController.openModule("social");
    }
};

window.startSocialScheduler = function() {
    if (window._socialSchedulerInterval) clearInterval(window._socialSchedulerInterval);
    // Primo sync immediato all'avvio con il Server 24/7
    setTimeout(() => {
        window.syncSocialWithServer();
    }, 800);
    // Controllo e sincronizzazione ogni 15 secondi
    window._socialSchedulerInterval = setInterval(() => {
        window.checkScheduledSocialPosts(false);
    }, 15000);
};

// ==========================================================================
// SERVER AUTO-UPDATE MODAL (GITHUB BRANCH 'main' + OTA HTTP)
// ==========================================================================
window.openServerUpdateModal = async function() {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector(".modal-container");
    if (modalContainer) modalContainer.style.maxWidth = "720px";

    modalTitle.innerText = "🔄 Auto-Update Server Ubuntu (GitHub branch 'main' + OTA HTTP)";
    modalBody.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-secondary);">Lettura stato aggiornamento dal server in corso...</div>`;
    modalOverlay.classList.add("active");

    let upd = {
        repo: "Delaoren/Gestionale-Liuteria",
        branch: "main",
        autoUpdateEnabled: true,
        intervalSeconds: 120,
        currentCommit: "N/D",
        lastCheckTime: "In attesa",
        lastUpdateTime: "N/D",
        status: "ready",
        lastMessage: "Auto-Update attivo",
        history: []
    };

    try {
        const r = await fetch("/api/system/update-status");
        if (r.ok) {
            const j = await r.json();
            if (j && j.update) upd = j.update;
        }
    } catch (e) {
        upd.lastMessage = "Modalità statica o endpoint OTA non ancora caricato sul server.";
    }

    const hist = Array.isArray(upd.history) ? upd.history : [];

    modalBody.innerHTML = `
        <div>
            <div style="background:linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 182, 212, 0.08)); border:1px solid rgba(16, 185, 129, 0.35); border-radius:10px; padding:1rem 1.2rem; margin-bottom:1.2rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.4rem;">
                    <strong style="color:#fff; font-size:0.96rem;">✅ Aggiornamento Automatico Combinato Attivo (Zero SSH)</strong>
                    <span class="badge badge-success">Branch: ${upd.branch || "main"}</span>
                </div>
                <p style="font-size:0.8rem; color:var(--text-secondary); margin:0; line-height:1.45;">
                    Il server Ubuntu controlla autonomamente <strong>GitHub (${upd.repo} → branch <code>${upd.branch}</code>)</strong> ogni ${upd.intervalSeconds || 120} secondi e accetta aggiornamenti istantanei <strong>OTA via HTTP</strong> direttamente dallo script di sincronizzazione su Windows, senza bisogno di <code>trasferisci_a_ubuntu.bat</code>.
                </p>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:0.8rem; margin-bottom:1.2rem;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.75rem 0.9rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Repository & Branch</div>
                    <div style="font-size:0.88rem; color:#fff; font-weight:700; margin-top:0.2rem;">${upd.repo}</div>
                    <div style="font-size:0.76rem; color:var(--accent-cyan);">Branch: <code>${upd.branch}</code></div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.75rem 0.9rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Commit Attuale sul Server</div>
                    <div style="font-size:0.92rem; color:var(--accent-gold); font-family:var(--font-mono); font-weight:700; margin-top:0.2rem;">${(upd.currentCommit || "N/D").slice(0, 12)}</div>
                    <div style="font-size:0.73rem; color:var(--text-secondary);">Ultimo check: ${upd.lastCheckTime || "N/D"}</div>
                </div>
            </div>

            <div id="serverUpdateLiveStatusBox" style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:0.8rem 1rem; margin-bottom:1.2rem; font-size:0.82rem; color:#e5e7eb;">
                <strong>Stato:</strong> ${upd.lastMessage || "Pronto"}
            </div>

            ${hist.length > 0 ? `
                <div style="margin-bottom:1.2rem;">
                    <strong style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:0.45rem;">Cronologia Ultimi Aggiornamenti Automatici:</strong>
                    <div style="display:flex; flex-direction:column; gap:0.35rem; max-height:150px; overflow-y:auto;">
                        ${hist.slice(0, 6).map(h => `
                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:0.4rem 0.7rem; border-radius:6px; font-size:0.75rem;">
                                <span><strong>${h.source}</strong> • Commit <code>${h.commit}</code> (${h.filesCount} file)</span>
                                <span style="color:var(--text-muted); font-family:var(--font-mono);">${h.timestamp}</span>
                            </div>
                        `).join("")}
                    </div>
                </div>
            ` : ""}

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
                <button type="button" class="btn btn-primary" style="flex:2; justify-content:center; padding:0.8rem;" onclick="window.triggerServerGithubUpdateNow(false)">
                    <i data-lucide="refresh-cw"></i> Controlla & Aggiorna Ora da GitHub (branch main)
                </button>
                <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center; padding:0.8rem;" onclick="window.triggerServerGithubUpdateNow(true)">
                    <i data-lucide="download-cloud"></i> Forza Riallineamento
                </button>
            </div>
        </div>
    `;

    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.triggerServerGithubUpdateNow = async function(force = false) {
    const box = document.getElementById("serverUpdateLiveStatusBox");
    if (box) {
        box.style.borderColor = "var(--accent-cyan)";
        box.innerHTML = `<strong>⏳ Controllo branch 'main' su GitHub (Delaoren/Gestionale-Liuteria) in corso...</strong>`;
    }
    try {
        const r = await fetch("/api/system/check-update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ force: force })
        });
        const data = await r.json();
        if (data && data.success) {
            if (box) {
                box.style.borderColor = "var(--accent-emerald)";
                box.innerHTML = `<strong>✅ ${data.message}</strong>`;
            }
            window.showToast(data.updated ? "🚀 Server aggiornato da GitHub! Ricarico l'interfaccia..." : "✓ Server già allineato all'ultimo commit su main.");
            if (data.updated) {
                setTimeout(() => window.location.reload(), 1600);
            }
        } else {
            if (box) {
                box.style.borderColor = "#f43f5e";
                box.innerHTML = `<strong>❌ Errore:</strong> ${(data && data.error) || "Impossibile verificare aggiornamenti"}`;
            }
        }
    } catch (e) {
        if (box) {
            box.style.borderColor = "#f43f5e";
            box.innerHTML = `<strong>❌ Errore di connessione al server:</strong> ${e.message || e}`;
        }
    }
};

// ==========================================================================
// BIBLIOTECA DIGITALE: CARICAMENTO EBOOK (EPUB, MOBI, AZW3, DJVU, FB2, TXT) & PDF
// ==========================================================================

window.bibliotecaFormatFilter = "all";
window.bibliotecaCategoryFilter = "all";
window.bibliotecaFileDraft = null;

window.EBOOK_FORMATS_MAP = {
    ".pdf":  { label: "PDF Documento / Blueprint", mime: "application/pdf", short: "PDF" },
    ".epub": { label: "EPUB Ebook", mime: "application/epub+zip", short: "EPUB" },
    ".mobi": { label: "MOBI Ebook (Kindle)", mime: "application/x-mobipocket-ebook", short: "MOBI" },
    ".azw":  { label: "AZW Ebook (Kindle)", mime: "application/vnd.amazon.ebook", short: "AZW" },
    ".azw3": { label: "AZW3 Ebook (Kindle KF8)", mime: "application/vnd.amazon.ebook", short: "AZW3" },
    ".kfx":  { label: "KFX Ebook (Kindle)", mime: "application/vnd.amazon.ebook", short: "KFX" },
    ".djvu": { label: "DJVU Scansione Storica", mime: "image/vnd.djvu", short: "DJVU" },
    ".djv":  { label: "DJVU Scansione Storica", mime: "image/vnd.djvu", short: "DJVU" },
    ".fb2":  { label: "FB2 Ebook (FictionBook)", mime: "application/x-fictionbook+xml", short: "FB2" },
    ".cbz":  { label: "CBZ Tavole / Disegni", mime: "application/vnd.comicbook+zip", short: "CBZ" },
    ".cbr":  { label: "CBR Tavole / Disegni", mime: "application/vnd.comicbook-rar", short: "CBR" },
    ".txt":  { label: "TXT Testo / Appunti", mime: "text/plain", short: "TXT" },
    ".md":   { label: "Markdown Trattato", mime: "text/markdown", short: "MD" },
    ".rtf":  { label: "RTF Documento", mime: "application/rtf", short: "RTF" },
    ".doc":  { label: "DOC Word", mime: "application/msword", short: "DOC" },
    ".docx": { label: "DOCX Word", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", short: "DOCX" },
    ".odt":  { label: "ODT OpenDocument", mime: "application/vnd.oasis.opendocument.text", short: "ODT" }
};

window.setBibliotecaFormatFilter = function(fId) {
    window.bibliotecaFormatFilter = fId;
    if (window.appController && window.appController.activeModuleId === "biblioteca") {
        const container = document.getElementById("moduleContentContainer");
        if (container && window.AppModules.renderBiblioteca) {
            window.AppModules.renderBiblioteca(container);
            window.appController.setupLucideIcons();
        }
    }
};

window.setBibliotecaCategoryFilter = function(cat) {
    window.bibliotecaCategoryFilter = cat;
    if (window.appController && window.appController.activeModuleId === "biblioteca") {
        const container = document.getElementById("moduleContentContainer");
        if (container && window.AppModules.renderBiblioteca) {
            window.AppModules.renderBiblioteca(container);
            window.appController.setupLucideIcons();
        }
    }
};

window.buildBibliotecaModalForm = function(existingBook = null) {
    const b = existingBook || {
        id: "",
        titolo: "",
        autore: "",
        categoria: "Tecnica Costruttiva",
        anno: new Date().getFullYear(),
        formato: "PDF Documento / Blueprint",
        pagine: 48,
        tags: [],
        note: "",
        fileId: "",
        fileName: "",
        fileExt: "",
        fileMime: "",
        fileSizeBytes: 0,
        fileSizeFormatted: "",
        fileUrl: "",
        isIndexedDB: false
    };

    window.bibliotecaFileDraft = (b.fileId || b.fileName || b.fileUrl) ? {
        id: b.fileId || ("ebk-" + Date.now()),
        name: b.fileName || (b.titolo + ".pdf"),
        ext: b.fileExt || ".pdf",
        mimeType: b.fileMime || "application/pdf",
        sizeBytes: b.fileSizeBytes || 0,
        sizeFormatted: b.fileSizeFormatted || window.formatSocialBytes(b.fileSizeBytes || 0),
        url: b.fileUrl || "",
        isIndexedDB: Boolean(b.isIndexedDB)
    } : null;

    const formatOptions = [
        "PDF Documento / Blueprint",
        "PDF Blueprint",
        "EPUB Ebook",
        "MOBI Ebook (Kindle)",
        "AZW3 Ebook (Kindle KF8)",
        "AZW Ebook (Kindle)",
        "DJVU Scansione Storica",
        "FB2 Ebook (FictionBook)",
        "CBZ Tavole / Disegni",
        "CBR Tavole / Disegni",
        "DOCX Word",
        "ODT OpenDocument",
        "TXT Testo / Appunti",
        "Markdown Trattato",
        "RTF Documento",
        "Manuale Tecnico",
        "Rapporto Tomografico",
        "Articolo Scientifico"
    ];
    if (b.formato && !formatOptions.includes(b.formato)) {
        formatOptions.unshift(b.formato);
    }

    const categories = [
        "Disegni e Modelli",
        "Ricette e Trattamenti",
        "Analisi Scientifica",
        "Tecnica Costruttiva",
        "Storia & Liuteria",
        "Acustica Applicata"
    ];

    const acceptAllEbooks = ".pdf,.epub,.mobi,.azw,.azw3,.kfx,.djvu,.djv,.fb2,.cbz,.cbr,.txt,.md,.rtf,.doc,.docx,.odt,application/pdf,application/epub+zip,application/x-mobipocket-ebook,image/vnd.djvu,text/plain,text/markdown";

    return `
        <form onsubmit="window.saveNewRecord(event, 'biblioteca')">
            <input type="hidden" id="f_bib_edit_id" value="${b.id || ''}">

            <!-- 1. UPLOAD FILE EBOOK O PDF -->
            <div style="border-left:3px solid var(--accent-cyan); padding-left:0.75rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <strong style="color:var(--accent-cyan); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">1. File Ebook o Documento PDF</strong>
                    <span style="display:block; font-size:0.75rem; color:var(--text-secondary);">Formati supportati: <strong>PDF, EPUB, MOBI, AZW, AZW3, KFX, DJVU, FB2, CBZ, CBR, TXT, MD, RTF, DOCX, ODT</strong>.</span>
                </div>
                <span class="badge badge-info" style="font-size:0.7rem;">
                    <i data-lucide="book-open-check"></i> Lettore PDF & EPUB Integrato
                </span>
            </div>

            <div id="bibliotecaModalDropzone" style="background:linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.06)); border:2px dashed rgba(59, 130, 246, 0.45); border-radius:12px; padding:1.25rem; text-align:center; margin-bottom:1rem; transition:all 0.25s ease;">
                <div style="display:flex; justify-content:center; gap:0.75rem; margin-bottom:0.55rem;">
                    <div style="width:42px; height:42px; border-radius:10px; background:rgba(168, 85, 247, 0.16); color:#c084fc; display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="file-text" style="width:22px; height:22px;"></i>
                    </div>
                    <div style="width:42px; height:42px; border-radius:10px; background:rgba(16, 185, 129, 0.16); color:var(--accent-emerald); display:flex; align-items:center; justify-content:center;">
                        <i data-lucide="book-open" style="width:22px; height:22px;"></i>
                    </div>
                </div>
                <h4 style="color:#fff; font-size:0.95rem; margin-bottom:0.25rem;">Trascina qui il tuo Ebook o PDF oppure selezionalo dal computer</h4>
                <p style="font-size:0.76rem; color:var(--text-secondary); margin-bottom:0.85rem;">
                    Il titolo, l'anno, il formato e il numero di pagine (per i PDF) vengono rilevati automaticamente dal file caricato.
                </p>

                <div style="display:flex; justify-content:center; gap:0.6rem; flex-wrap:wrap;">
                    <label class="btn btn-primary" style="cursor:pointer; margin:0; padding:0.55rem 1.05rem; font-size:0.83rem;">
                        <i data-lucide="file-text"></i> + Scegli File PDF
                        <input type="file" accept=".pdf,application/pdf" onchange="window.handleBibliotecaFileInput(event)" style="display:none;">
                    </label>
                    <label class="btn btn-secondary" style="cursor:pointer; margin:0; padding:0.55rem 1.05rem; font-size:0.83rem; border-color:rgba(16, 185, 129, 0.45); color:#6ee7b7; background:rgba(16, 185, 129, 0.12);">
                        <i data-lucide="book-open"></i> + Scegli Ebook (EPUB, MOBI, AZW3, DJVU, FB2, TXT...)
                        <input type="file" accept="${acceptAllEbooks}" onchange="window.handleBibliotecaFileInput(event)" style="display:none;">
                    </label>
                </div>
            </div>

            <!-- Live Upload Progress Box -->
            <div id="bibliotecaUploadProgressBox" style="display:none; background:rgba(59, 130, 246, 0.12); border:1px solid var(--accent-cyan); border-radius:10px; padding:0.75rem 1rem; margin-bottom:1rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.8rem; margin-bottom:0.35rem;">
                    <span id="bibliotecaUploadStatusText" style="color:#fff; font-weight:600;">Elaborazione file Ebook/PDF in corso...</span>
                    <strong id="bibliotecaUploadPercentText" style="color:var(--accent-gold); font-family:var(--font-mono);">0%</strong>
                </div>
                <div class="progress-bar-bg">
                    <div id="bibliotecaUploadProgressBar" class="progress-bar-fill" style="width:0%; background:linear-gradient(90deg, var(--accent-blue), var(--accent-emerald));"></div>
                </div>
            </div>

            <!-- Attached Ebook File Preview Box -->
            <div id="bibliotecaFileDraftContainer" style="margin-bottom:1.15rem;"></div>

            <!-- 2. METADATI CATALOGAZIONE VOLUME -->
            <div style="border-left:3px solid var(--accent-gold); padding-left:0.75rem; margin-bottom:0.75rem;">
                <strong style="color:var(--accent-gold); font-size:0.9rem; text-transform:uppercase; letter-spacing:0.5px;">2. Dati Bibliografici & Catalogazione Tecnica</strong>
            </div>

            <div class="form-group">
                <label>Titolo Opera / Trattato / Ebook *</label>
                <input type="text" id="f_bib_titolo" class="form-control" required value="${(b.titolo || '').replace(/"/g, '&quot;')}" placeholder="Es. I Segreti di Stradivari — S. F. Sacconi">
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Autore / Ente di Ricerca *</label>
                    <input type="text" id="f_bib_autore" class="form-control" required value="${(b.autore || '').replace(/"/g, '&quot;')}" placeholder="Es. Simone Fernando Sacconi / G. Baese">
                </div>
                <div class="form-group">
                    <label>Categoria</label>
                    <select id="f_bib_categoria" class="form-control">
                        ${categories.map(c => `<option value="${c}" ${b.categoria === c ? 'selected' : ''}>${c}</option>`).join('')}
                    </select>
                </div>
            </div>

            <div class="form-row">
                <div class="form-group">
                    <label>Formato Ebook / Documento</label>
                    <select id="f_bib_formato" class="form-control">
                        ${formatOptions.map(fo => `<option value="${fo}" ${b.formato === fo ? 'selected' : ''}>${fo}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label>Anno Pubblicazione</label>
                    <input type="number" id="f_bib_anno" class="form-control" value="${b.anno || new Date().getFullYear()}">
                </div>
                <div class="form-group">
                    <label>Numero Pagine (stima)</label>
                    <input type="number" id="f_bib_pagine" class="form-control" value="${b.pagine || 48}">
                </div>
            </div>

            <div class="form-group">
                <label>Tags & Parole Chiave (separate da virgola)</label>
                <input type="text" id="f_bib_tags" class="form-control" value="${Array.isArray(b.tags) ? b.tags.join(', ') : (b.tags || '')}" placeholder="Es. Stradivari, Violino, Spessori, Frequenze, Vernici, Ebook">
            </div>

            <div class="form-group">
                <label>Note, Sintesi o Indice dei Contenuti</label>
                <textarea id="f_bib_note" class="form-control" rows="3" placeholder="Dettagli essenziali, spessori della tavola, ricette citate o note di studio...">${b.note || ''}</textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.85rem; font-size:0.94rem; margin-top:0.5rem;">
                <i data-lucide="book-plus" class="lucide-book-plus"></i> ${existingBook ? 'Salva Modifiche Volume / Ebook' : 'Archivia Ebook / Documento in Biblioteca'}
            </button>
        </form>
    `;
};

window.renderBibliotecaFileDraft = function() {
    const container = document.getElementById("bibliotecaFileDraftContainer");
    if (!container) return;
    const d = window.bibliotecaFileDraft;
    if (!d) {
        container.innerHTML = `
            <div style="font-size:0.79rem; color:var(--text-muted); text-align:center; padding:0.6rem; background:rgba(0,0,0,0.25); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                Nessun file allegato al momento. Seleziona o trascina un file <strong>PDF, EPUB, MOBI, AZW3, DJVU, FB2, CBZ, TXT o DOCX</strong> qui sopra.
            </div>
        `;
        return;
    }

    const extLabel = (d.ext || ".pdf").replace(".", "").toUpperCase();
    container.innerHTML = `
        <div style="display:flex; align-items:center; justify-content:space-between; gap:0.8rem; background:rgba(16, 185, 129, 0.1); border:1px solid rgba(16, 185, 129, 0.4); border-radius:10px; padding:0.65rem 0.9rem;">
            <div style="display:flex; align-items:center; gap:0.75rem; min-width:0;">
                <div style="width:44px; height:44px; border-radius:8px; background:rgba(16, 185, 129, 0.22); color:var(--accent-emerald); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.76rem; flex-shrink:0;">
                    ${extLabel}
                </div>
                <div style="min-width:0;">
                    <div style="color:#fff; font-weight:700; font-size:0.86rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${d.name}
                    </div>
                    <div style="font-size:0.74rem; color:var(--text-secondary);">
                        Formato: <strong style="color:var(--accent-emerald);">${extLabel}</strong> • Dimensione: <strong style="color:var(--accent-gold); font-family:var(--font-mono);">${d.sizeFormatted}</strong> • ✓ Pronto per lettura e download
                    </div>
                </div>
            </div>
            <button type="button" class="btn btn-secondary" style="padding:0.3rem 0.6rem; color:#ef4444;" onclick="window.removeBibliotecaFileDraft()" title="Rimuovi file">
                &times;
            </button>
        </div>
    `;
};

window.removeBibliotecaFileDraft = function() {
    if (window.bibliotecaFileDraft && window.bibliotecaFileDraft.id && window.socialMediaDB) {
        window.socialMediaDB.deleteBlob(window.bibliotecaFileDraft.id);
    }
    window.bibliotecaFileDraft = null;
    window.renderBibliotecaFileDraft();
};

window.setupBibliotecaModalDropzone = function() {
    const dz = document.getElementById("bibliotecaModalDropzone");
    if (!dz) return;
    dz.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "var(--accent-emerald)";
        dz.style.background = "rgba(16, 185, 129, 0.14)";
    });
    dz.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(59, 130, 246, 0.45)";
        dz.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.06))";
    });
    dz.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(59, 130, 246, 0.45)";
        dz.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(16, 185, 129, 0.06))";
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            window.processBibliotecaEbookFiles(Array.from(e.dataTransfer.files), false);
        }
    });
};

window.setupBibliotecaPageDropzone = function() {
    const dz = document.getElementById("bibliotecaPageDropzone");
    if (!dz) return;
    dz.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "var(--accent-emerald)";
        dz.style.background = "rgba(16, 185, 129, 0.16)";
    });
    dz.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(59, 130, 246, 0.5)";
        dz.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.08))";
    });
    dz.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        dz.style.borderColor = "rgba(59, 130, 246, 0.5)";
        dz.style.background = "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.08))";
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = Array.from(e.dataTransfer.files);
            window.openAddModal("biblioteca");
            setTimeout(() => {
                window.processBibliotecaEbookFiles(files, files.length > 1);
            }, 60);
        }
    });
};

window.handleBibliotecaFileInput = function(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    event.target.value = "";
    window.processBibliotecaEbookFiles(files, false);
};

window.handleDirectBibliotecaPageUpload = function(event) {
    const files = Array.from((event.target && event.target.files) || []);
    if (!files.length) return;
    event.target.value = "";
    window.openAddModal("biblioteca");
    setTimeout(() => {
        window.processBibliotecaEbookFiles(files, files.length > 1);
    }, 60);
};

window.estimatePdfPageCount = async function(file) {
    try {
        // Leggi fino ai primi 8MB del PDF per stimare il numero di pagine
        const slice = file.slice(0, Math.min(file.size, 8 * 1024 * 1024));
        const buf = await slice.arrayBuffer();
        const text = new TextDecoder("latin1").decode(buf);
        const countMatches = Array.from(text.matchAll(/\/Count\s+(\d+)/g)).map(m => parseInt(m[1], 10)).filter(n => n > 0 && n < 5000);
        if (countMatches.length > 0) {
            return Math.max(...countMatches);
        }
        const pageMatches = text.match(/\/Type\s*\/Page\b/g);
        if (pageMatches && pageMatches.length > 0) {
            return pageMatches.length;
        }
    } catch (e) {
        // ignore
    }
    return 0;
};

window.processBibliotecaEbookFiles = async function(files, autoSaveExtraFiles = false) {
    if (!files || !files.length) return;

    const progBox = document.getElementById("bibliotecaUploadProgressBox");
    const progBar = document.getElementById("bibliotecaUploadProgressBar");
    const statusText = document.getElementById("bibliotecaUploadStatusText");
    const pctText = document.getElementById("bibliotecaUploadPercentText");

    if (progBox) progBox.style.display = "block";

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const dotIdx = file.name.lastIndexOf(".");
        const ext = dotIdx !== -1 ? file.name.slice(dotIdx).toLowerCase() : ".pdf";
        const fmtInfo = window.EBOOK_FORMATS_MAP[ext] || {
            label: `${ext.replace(".", "").toUpperCase() || "EBOOK"} Ebook / Documento`,
            mime: file.type || "application/octet-stream",
            short: ext.replace(".", "").toUpperCase() || "DOC"
        };

        const bookFileId = "ebk-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
        const sizeStr = window.formatSocialBytes(file.size);

        if (statusText) statusText.innerText = `[${i + 1}/${files.length}] Analisi "${file.name}" (${fmtInfo.short} • ${sizeStr})...`;
        if (pctText) pctText.innerText = "35%";
        if (progBar) progBar.style.width = "35%";

        let estimatedPages = 0;
        if (ext === ".pdf") {
            estimatedPages = await window.estimatePdfPageCount(file);
        } else {
            // Stima approssimativa pagine per ebook in base al peso
            estimatedPages = Math.max(12, Math.min(1200, Math.round(file.size / 18000)));
        }

        // Salva in IndexedDB
        if (window.socialMediaDB) {
            await window.socialMediaDB.saveBlob(bookFileId, file, {
                name: file.name,
                mimeType: fmtInfo.mime,
                sizeBytes: file.size
            });
        }

        if (statusText) statusText.innerText = `[${i + 1}/${files.length}] Sincronizzazione "${file.name}" nell'archivio Server...`;
        if (pctText) pctText.innerText = "75%";
        if (progBar) progBar.style.width = "75%";

        let serverFileUrl = "";
        try {
            const upR = await fetch("/api/biblioteca/upload-file", {
                method: "POST",
                headers: {
                    "Content-Type": fmtInfo.mime,
                    "X-Book-Id": bookFileId,
                    "X-Book-Name": encodeURIComponent(file.name),
                    "X-Book-Mime": fmtInfo.mime
                },
                body: file
            });
            if (upR.ok) {
                const upJson = await upR.json();
                if (upJson && upJson.url) serverFileUrl = upJson.url;
            }
        } catch (e) {
            // Modalità statica: usa IndexedDB
        }

        const draftObj = {
            id: bookFileId,
            name: file.name,
            ext: ext,
            mimeType: fmtInfo.mime,
            sizeBytes: file.size,
            sizeFormatted: sizeStr,
            url: serverFileUrl,
            isIndexedDB: true
        };

        const cleanTitle = file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
        const prettyTitle = cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1);
        const yearMatch = cleanTitle.match(/\b(16\d\d|17\d\d|18\d\d|19\d\d|20\d\d)\b/);

        if (i === 0) {
            window.bibliotecaFileDraft = draftObj;
            window.renderBibliotecaFileDraft();

            const titleInp = document.getElementById("f_bib_titolo");
            if (titleInp && !titleInp.value.trim()) {
                titleInp.value = prettyTitle;
            }
            const autoreInp = document.getElementById("f_bib_autore");
            if (autoreInp && !autoreInp.value.trim()) {
                autoreInp.value = "Archivio Liuteria De Lorenzi";
            }
            const fmtSel = document.getElementById("f_bib_formato");
            if (fmtSel) {
                if (!Array.from(fmtSel.options).some(o => o.value === fmtInfo.label)) {
                    const opt = document.createElement("option");
                    opt.value = fmtInfo.label;
                    opt.text = fmtInfo.label;
                    fmtSel.prepend(opt);
                }
                fmtSel.value = fmtInfo.label;
            }
            if (yearMatch) {
                const yrInp = document.getElementById("f_bib_anno");
                if (yrInp) yrInp.value = yearMatch[1];
            }
            if (estimatedPages > 0) {
                const pgInp = document.getElementById("f_bib_pagine");
                if (pgInp) pgInp.value = estimatedPages;
            }
            const tagsInp = document.getElementById("f_bib_tags");
            if (tagsInp && !tagsInp.value.trim()) {
                tagsInp.value = `${fmtInfo.short}, Liuteria, Trattato`;
            }
        } else if (autoSaveExtraFiles) {
            // Se l'utente ha selezionato più ebook insieme, archivia automaticamente i successivi
            window.atelierDB.addItem("biblioteca", {
                id: "bib-" + Date.now() + "-" + i,
                titolo: prettyTitle,
                autore: "Archivio Liuteria De Lorenzi",
                categoria: "Tecnica Costruttiva",
                anno: yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear(),
                formato: fmtInfo.label,
                pagine: estimatedPages || 48,
                note: `Volume digitale in formato ${fmtInfo.short} (${sizeStr}).`,
                tags: [fmtInfo.short, "Ebook", "Liuteria"],
                fileId: draftObj.id,
                fileName: draftObj.name,
                fileExt: draftObj.ext,
                fileMime: draftObj.mimeType,
                fileSizeBytes: draftObj.sizeBytes,
                fileSizeFormatted: draftObj.sizeFormatted,
                fileUrl: draftObj.url,
                isIndexedDB: true
            });
        }

        if (pctText) pctText.innerText = "100%";
        if (progBar) progBar.style.width = "100%";
    }

    setTimeout(() => {
        if (progBox) progBox.style.display = "none";
    }, 700);

    window.showToast(files.length > 1
        ? `${files.length} Ebook/PDF caricati! Completa il primo volume e salva.`
        : `File "${files[0].name}" caricato e pronto!`);
};

window.openEditBibliotecaModal = function(itemId) {
    const item = window.atelierDB.getItem("biblioteca", itemId);
    if (!item) return;

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector(".modal-container");
    if (modalContainer) modalContainer.style.maxWidth = "820px";

    modalTitle.innerText = `Modifica Volume / Allega Ebook o PDF: ${item.titolo}`;
    modalBody.innerHTML = window.buildBibliotecaModalForm(item);
    modalOverlay.classList.add("active");
    window.renderBibliotecaFileDraft();
    window.setupBibliotecaModalDropzone();
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.deleteBibliotecaItem = function(itemId, title) {
    const item = window.atelierDB.getItem("biblioteca", itemId);
    if (!confirm(`Vuoi eliminare il volume "${title || 'selezionato'}" dalla Biblioteca?`)) return;
    if (item && item.fileId && window.socialMediaDB) {
        window.socialMediaDB.deleteBlob(item.fileId);
    }
    window.atelierDB.removeItem("biblioteca", itemId);
    window.showToast("Volume rimosso dalla Biblioteca.");
    if (window.appController && window.appController.activeModuleId === "biblioteca") {
        window.appController.openModule("biblioteca");
    }
};

window.resolveBibliotecaFileUrlAndBlob = async function(item) {
    if (!item) return { url: "", blob: null };
    if (item.fileId && window.socialMediaDB) {
        const blob = await window.socialMediaDB.getBlob(item.fileId);
        if (blob) {
            const objUrl = await window.socialMediaDB.getObjectUrl(item.fileId);
            return { url: objUrl, blob: blob };
        }
    }
    if (item.fileUrl) {
        try {
            const r = await fetch(item.fileUrl);
            if (r.ok) {
                const b = await r.blob();
                return { url: item.fileUrl, blob: b };
            }
        } catch (e) {
            return { url: item.fileUrl, blob: null };
        }
    }
    return { url: "", blob: null };
};

window.downloadBibliotecaFile = async function(itemId) {
    const item = window.atelierDB.getItem("biblioteca", itemId);
    if (!item) return;

    const { url, blob } = await window.resolveBibliotecaFileUrlAndBlob(item);
    const dlUrl = blob ? URL.createObjectURL(blob) : url;
    if (!dlUrl) {
        window.showToast("⚠️ Nessun file binario allegato a questa scheda. Clicca su Modifica per caricare l'Ebook o il PDF.");
        return;
    }

    const a = document.createElement("a");
    a.href = dlUrl;
    a.download = item.fileName || (item.titolo.replace(/[^a-z0-9]/gi, "_") + (item.fileExt || ".pdf"));
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (blob) {
        setTimeout(() => URL.revokeObjectURL(dlUrl), 5000);
    }
    window.showToast(`Download avviato: ${item.fileName || item.titolo}`);
};

/**
 * Decompressore ZIP nativo in browser per leggere i capitoli XHTML dentro file .EPUB e .FB2/.CBZ
 */
window.extractZipEntriesFromBlob = async function(blob) {
    const buf = await blob.arrayBuffer();
    const view = new DataView(buf);
    const bytes = new Uint8Array(buf);
    const entries = [];

    // Cerca End of Central Directory (0x06054b50)
    let eocdPos = -1;
    const minSearch = Math.max(0, bytes.length - 65557);
    for (let i = bytes.length - 22; i >= minSearch; i--) {
        if (view.getUint32(i, true) === 0x06054b50) {
            eocdPos = i;
            break;
        }
    }
    if (eocdPos === -1) return entries;

    const totalEntries = view.getUint16(eocdPos + 10, true);
    const cdOffset = view.getUint32(eocdPos + 16, true);
    let ptr = cdOffset;

    for (let i = 0; i < totalEntries && ptr + 46 <= bytes.length; i++) {
        if (view.getUint32(ptr, true) !== 0x02014b50) break;
        const compression = view.getUint16(ptr + 10, true);
        const compSize = view.getUint32(ptr + 20, true);
        const uncompSize = view.getUint32(ptr + 24, true);
        const nameLen = view.getUint16(ptr + 28, true);
        const extraLen = view.getUint16(ptr + 30, true);
        const commentLen = view.getUint16(ptr + 32, true);
        const localHeaderOffset = view.getUint32(ptr + 42, true);

        const nameBytes = bytes.slice(ptr + 46, ptr + 46 + nameLen);
        const name = new TextDecoder("utf-8").decode(nameBytes);
        ptr += 46 + nameLen + extraLen + commentLen;

        if (localHeaderOffset + 30 > bytes.length) continue;
        const lNameLen = view.getUint16(localHeaderOffset + 26, true);
        const lExtraLen = view.getUint16(localHeaderOffset + 28, true);
        const dataStart = localHeaderOffset + 30 + lNameLen + lExtraLen;
        const compBytes = bytes.slice(dataStart, dataStart + compSize);

        entries.push({
            name,
            compression,
            compSize,
            uncompSize,
            compBytes
        });
    }
    return entries;
};

window.decodeZipEntryText = async function(entry) {
    if (!entry) return "";
    if (entry.compression === 0) {
        return new TextDecoder("utf-8").decode(entry.compBytes);
    }
    if (entry.compression === 8 && typeof DecompressionStream !== "undefined") {
        try {
            const ds = new DecompressionStream("deflate-raw");
            const writer = ds.writable.getWriter();
            writer.write(entry.compBytes);
            writer.close();
            const outBuf = await new Response(ds.readable).arrayBuffer();
            return new TextDecoder("utf-8").decode(outBuf);
        } catch (e) {
            return "";
        }
    }
    return "";
};

window.renderEpubInsideContainer = async function(blob, targetEl) {
    try {
        const entries = await window.extractZipEntriesFromBlob(blob);
        const htmlEntries = entries.filter(e =>
            /\.(xhtml|html|htm|xml)$/i.test(e.name) &&
            !e.name.toLowerCase().includes("meta-inf") &&
            !e.name.toLowerCase().includes("toc.") &&
            !e.name.toLowerCase().includes("nav.")
        );

        if (htmlEntries.length === 0) {
            targetEl.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-secondary);">File EPUB caricato correttamente. Usa il pulsante <strong>Scarica File Originale</strong> qui sotto per aprirlo nel tuo lettore esterno preferito.</div>`;
            return;
        }

        const chapters = [];
        for (let i = 0; i < Math.min(htmlEntries.length, 40); i++) {
            const rawHtml = await window.decodeZipEntryText(htmlEntries[i]);
            if (!rawHtml || rawHtml.trim().length < 40) continue;
            const parser = new DOMParser();
            const doc = parser.parseFromString(rawHtml, "text/html");
            doc.querySelectorAll("script, style, link, meta").forEach(el => el.remove());
            const bodyText = (doc.body && doc.body.innerText ? doc.body.innerText.trim() : "");
            if (bodyText.length < 20) continue;
            const headingEl = doc.querySelector("h1, h2, h3, title");
            const chTitle = (headingEl && headingEl.innerText.trim()) ? headingEl.innerText.trim().slice(0, 75) : `Capitolo ${chapters.length + 1}`;
            chapters.push({
                title: chTitle,
                html: doc.body ? doc.body.innerHTML : rawHtml
            });
        }

        if (chapters.length === 0) {
            targetEl.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-secondary);">Archivio EPUB pronto. Clicca su <strong>Scarica Ebook</strong> per leggerlo sul tuo e-reader.</div>`;
            return;
        }

        window._activeEpubChapters = chapters;
        window.selectEpubChapter = function(idx) {
            const ch = window._activeEpubChapters[idx];
            const viewer = document.getElementById("epubChapterContentViewer");
            const sel = document.getElementById("epubChapterSelect");
            if (ch && viewer) {
                viewer.innerHTML = ch.html;
                viewer.scrollTop = 0;
            }
            if (sel) sel.value = String(idx);
        };

        targetEl.innerHTML = `
            <div style="background:#101520; border:1px solid rgba(16, 185, 129, 0.35); border-radius:12px; overflow:hidden;">
                <div style="background:rgba(16, 185, 129, 0.12); padding:0.65rem 1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; border-bottom:1px solid rgba(255,255,255,0.08);">
                    <span style="color:var(--accent-emerald); font-weight:700; font-size:0.82rem;">
                        📖 Lettore Ebook EPUB Integrato (${chapters.length} sezioni/capitoli estratti)
                    </span>
                    <div style="display:flex; align-items:center; gap:0.45rem;">
                        <select id="epubChapterSelect" class="form-control" style="width:auto; max-width:280px; padding:0.28rem 0.6rem; font-size:0.78rem;" onchange="window.selectEpubChapter(parseInt(this.value, 10))">
                            ${chapters.map((c, idx) => `<option value="${idx}">${idx + 1}. ${c.title}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div id="epubChapterContentViewer" style="max-height:460px; overflow-y:auto; padding:1.6rem 2rem; color:#e5e7eb; font-size:0.95rem; line-height:1.75; font-family:Georgia, serif;">
                    ${chapters[0].html}
                </div>
            </div>
        `;
    } catch (e) {
        targetEl.innerHTML = `<div style="padding:1.5rem; text-align:center; color:var(--text-secondary);">Ebook pronto per il download.</div>`;
    }
};

window.openBibliotecaReaderModal = async function(itemId) {
    const item = window.atelierDB.getItem("biblioteca", itemId);
    if (!item) return;

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    const modalContainer = modalOverlay.querySelector(".modal-container");
    if (modalContainer) modalContainer.style.maxWidth = "920px";

    const ext = (item.fileExt || (item.fileName ? item.fileName.slice(item.fileName.lastIndexOf(".")).toLowerCase() : "")).toLowerCase();
    const hasFile = Boolean(item.fileId || item.fileUrl || item.fileName);

    modalTitle.innerText = `📖 Lettore Biblioteca & Ebook: ${item.titolo}`;
    modalBody.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-secondary);">Apertura volume in corso...</div>`;
    modalOverlay.classList.add("active");

    const { url, blob } = await window.resolveBibliotecaFileUrlAndBlob(item);

    let readerAreaHtml = "";
    const isPdf = ext === ".pdf" || (!ext && (item.formato || "").toLowerCase().includes("pdf"));
    const isEpub = ext === ".epub" || (item.formato || "").toLowerCase().includes("epub");
    const isTextOrFb2 = [".txt", ".md", ".fb2"].includes(ext);

    if (url && isPdf) {
        readerAreaHtml = `
            <div style="background:#090c12; border:1px solid rgba(168, 85, 247, 0.4); border-radius:12px; overflow:hidden; margin-bottom:1.2rem;">
                <div style="background:rgba(168, 85, 247, 0.14); padding:0.55rem 1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; font-size:0.8rem;">
                    <span style="color:#e9d5ff; font-weight:700;">📄 Visualizzatore PDF Integrato — ${item.fileName || item.titolo}</span>
                    <a href="${url}" target="_blank" rel="noopener" class="btn btn-secondary" style="padding:0.22rem 0.65rem; font-size:0.74rem;">
                        <i data-lucide="external-link"></i> Apri a Tutto Schermo
                    </a>
                </div>
                <iframe src="${url}" style="width:100%; height:520px; border:none; background:#1a1d24;"></iframe>
            </div>
        `;
    } else if (blob && isEpub) {
        readerAreaHtml = `<div id="bibliotecaDynamicEbookViewer" style="margin-bottom:1.2rem;"></div>`;
    } else if (blob && isTextOrFb2) {
        const rawText = await blob.text();
        let displayHtml = "";
        if (ext === ".fb2") {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(rawText, "text/xml");
            const pars = Array.from(xmlDoc.querySelectorAll("body p")).map(p => `<p style="margin-bottom:0.8rem;">${p.textContent}</p>`).join("");
            displayHtml = pars || `<pre style="white-space:pre-wrap;">${rawText.slice(0, 30000)}</pre>`;
        } else {
            displayHtml = `<div style="white-space:pre-wrap;">${rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
        }
        readerAreaHtml = `
            <div style="background:#101520; border:1px solid rgba(56, 189, 248, 0.35); border-radius:12px; overflow:hidden; margin-bottom:1.2rem;">
                <div style="background:rgba(56, 189, 248, 0.12); padding:0.55rem 1rem; color:#7dd3fc; font-weight:700; font-size:0.82rem;">
                    📖 Lettore Testo / ${ext.replace(".", "").toUpperCase()} — ${item.fileName || item.titolo}
                </div>
                <div style="max-height:460px; overflow-y:auto; padding:1.5rem 1.8rem; color:#e5e7eb; font-size:0.93rem; line-height:1.7; font-family:Georgia, serif;">
                    ${displayHtml}
                </div>
            </div>
        `;
    } else if (hasFile) {
        const extBadge = (ext || ".ebook").replace(".", "").toUpperCase();
        readerAreaHtml = `
            <div style="background:linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(59, 130, 246, 0.08)); border:1px solid rgba(245, 158, 11, 0.4); border-radius:12px; padding:1.6rem; text-align:center; margin-bottom:1.2rem;">
                <div style="width:58px; height:58px; border-radius:14px; background:rgba(245, 158, 11, 0.2); color:var(--accent-gold); display:flex; align-items:center; justify-content:center; margin:0 auto 0.8rem auto; font-weight:800; font-size:0.95rem;">
                    ${extBadge}
                </div>
                <h4 style="color:#fff; font-size:1.05rem; margin-bottom:0.35rem;">File Ebook ${extBadge} Archiviato: ${item.fileName || item.titolo}</h4>
                <p style="font-size:0.84rem; color:var(--text-secondary); max-width:560px; margin:0 auto 1rem auto;">
                    Formato: <strong>${item.formato}</strong> • Dimensione: <strong>${item.fileSizeFormatted || window.formatSocialBytes(item.fileSizeBytes)}</strong>.<br>
                    Scarica il file originale per leggerlo su Kindle, Calibre, Kobo, DjVu Reader o sul tuo dispositivo preferito.
                </p>
                <button type="button" class="btn btn-primary" onclick="window.downloadBibliotecaFile('${item.id}')" style="padding:0.65rem 1.3rem;">
                    <i data-lucide="download"></i> ⬇ Scarica ${item.fileName || ("Ebook " + extBadge)}
                </button>
            </div>
        `;
    } else {
        readerAreaHtml = `
            <div style="background:rgba(255,255,255,0.03); border:1px dashed rgba(255,255,255,0.18); border-radius:12px; padding:1.4rem; text-align:center; margin-bottom:1.2rem;">
                <p style="font-size:0.85rem; color:var(--text-secondary); margin:0 0 0.85rem 0;">
                    Questa scheda fa parte del catalogo storico di bottega e non ha ancora un file Ebook o PDF binario allegato.
                </p>
                <button type="button" class="btn btn-primary" onclick="window.openEditBibliotecaModal('${item.id}')">
                    <i data-lucide="upload-cloud"></i> 📤 Allega Ora un File PDF / EPUB / MOBI / AZW3 a questo Volume
                </button>
            </div>
        `;
    }

    modalBody.innerHTML = `
        <div>
            <!-- Header metadati opera -->
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.8rem; background:rgba(0,0,0,0.35); padding:0.95rem 1.15rem; border-radius:10px; border:1px solid rgba(255,255,255,0.08); margin-bottom:1.15rem;">
                <div>
                    <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap; margin-bottom:0.35rem;">
                        <span class="badge badge-info">${item.categoria || "Trattato"}</span>
                        <span class="badge badge-purple">${item.formato || "PDF / Ebook"}</span>
                        <span style="font-size:0.78rem; color:var(--text-muted);">Anno ${item.anno || "-"} • ${item.pagine || "-"} pagine</span>
                    </div>
                    <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.15rem; margin:0 0 0.2rem 0;">${item.titolo}</h4>
                    <div style="font-size:0.84rem; color:var(--accent-gold);">Autore: <strong>${item.autore || "-"}</strong></div>
                </div>
                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    ${hasFile ? `
                        <button type="button" class="btn btn-primary" onclick="window.downloadBibliotecaFile('${item.id}')">
                            <i data-lucide="download"></i> Scarica Ebook / PDF
                        </button>
                    ` : ""}
                    <button type="button" class="btn btn-secondary" onclick="window.openEditBibliotecaModal('${item.id}')">
                        <i data-lucide="edit-3"></i> Modifica / Sostituisci File
                    </button>
                </div>
            </div>

            ${readerAreaHtml}

            <!-- Note e Tags -->
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:1rem 1.15rem;">
                <strong style="color:var(--accent-cyan); font-size:0.8rem; text-transform:uppercase; display:block; margin-bottom:0.35rem;">Note Tecniche & Sintesi Contenuto</strong>
                <p style="font-size:0.88rem; color:#e5e7eb; margin:0 0 0.75rem 0; white-space:pre-line;">${item.note || "Nessuna nota aggiuntiva."}</p>
                <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                    ${Array.isArray(item.tags) ? item.tags.map(t => `<span style="background:rgba(255,255,255,0.06); font-size:0.72rem; padding:0.2rem 0.55rem; border-radius:4px; color:var(--accent-gold);">#${t}</span>`).join("") : ""}
                </div>
            </div>
        </div>
    `;

    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }

    if (blob && isEpub) {
        const epubTarget = document.getElementById("bibliotecaDynamicEbookViewer");
        if (epubTarget) {
            await window.renderEpubInsideContainer(blob, epubTarget);
        }
    }
};

// =========================================================================
// SERVIZIO INVIO PROMEMORIA CALENDARIO TRAMITE SENDINBLUE (BREVO API v3)
// =========================================================================

window.getSendinblueConfig = function() {
    if (!window.atelierDB || !window.atelierDB.data) return {};
    if (!window.atelierDB.data.settings) window.atelierDB.data.settings = {};
    if (!window.atelierDB.data.settings.sendinblue) {
        window.atelierDB.data.settings.sendinblue = {
            enabled: false,
            apiKey: "",
            senderName: "Liuteria De Lorenzi - Cremona",
            senderEmail: "fabio.delorenzi@gmail.com",
            replyToEmail: "fabio.delorenzi@gmail.com",
            atelierAddress: "Bottega Liuteria De Lorenzi — Cremona",
            atelierPhone: "+39 0372 000000",
            lastTestStatus: "unconfigured",
            lastTestTime: "",
            lastTestMessage: ""
        };
    }
    return window.atelierDB.data.settings.sendinblue;
};

window.initSendinblueService = async function() {
    const localCfg = window.getSendinblueConfig();
    try {
        const res = await fetch("/api/sendinblue/status", { method: "GET" });
        if (res.ok) {
            const data = await res.json();
            if (data && data.config) {
                const srvCfg = data.config;
                if (srvCfg.apiKey && !localCfg.apiKey) {
                    Object.assign(localCfg, srvCfg);
                    window.atelierDB.saveData();
                } else if (localCfg.apiKey && !srvCfg.apiKey) {
                    await fetch("/api/sendinblue/config", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ config: localCfg })
                    });
                }
            }
        }
    } catch (e) {
        // Modalità statica o offline: usa localStorage
    }
};

window.resolveClientEmailByName = function(clientName) {
    if (!clientName || !window.atelierDB || !window.atelierDB.data) return "";
    const needle = String(clientName).toLowerCase().trim();
    const clienti = window.atelierDB.data.clienti || [];
    for (const c of clienti) {
        if (!c || !c.nome || !c.email || c.email === "-") continue;
        const cName = String(c.nome).toLowerCase().trim();
        if (cName === needle || needle.includes(cName) || cName.includes(needle)) {
            return c.email.trim();
        }
        // Controlla corrispondenza sul cognome
        const parts = cName.split(/\s+/).filter(p => p.length > 3);
        for (const p of parts) {
            if (needle.includes(p)) {
                return c.email.trim();
            }
        }
    }
    return "";
};

window.resolveClientEmailForCalendarItem = function(item) {
    if (!item) return "";
    if (item.emailCliente && String(item.emailCliente).includes("@")) {
        return String(item.emailCliente).trim();
    }
    if (item.cliente) {
        return window.resolveClientEmailByName(item.cliente);
    }
    const cfg = window.getSendinblueConfig();
    return cfg.senderEmail || "";
};

window.autoFillAppointmentClientEmail = function(clientVal) {
    const emailInput = document.getElementById("f_app_email");
    if (!emailInput) return;
    const found = window.resolveClientEmailByName(clientVal);
    if (found) {
        emailInput.value = found;
    }
};

window.openSendinblueConfigModal = function() {
    const cfg = window.getSendinblueConfig();
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    if (!modalOverlay || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `<i data-lucide="mail-check" style="color:#38bdf8;"></i> Configurazione Sendinblue (Brevo) — Promemoria Calendario`;
    modalBody.innerHTML = `
        <form onsubmit="window.saveSendinblueConfigFromModal(event)">
            <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.28); border-radius:10px; padding:0.9rem 1.05rem; margin-bottom:1.1rem; font-size:0.83rem; color:#e5e7eb; line-height:1.5;">
                <strong style="color:#38bdf8; display:block; margin-bottom:0.25rem;">ℹ️ Come ottenere la API Key di Sendinblue (ora Brevo):</strong>
                1. Accedi al tuo account su <strong>app.brevo.com</strong> (ex Sendinblue).<br>
                2. Clicca sul tuo profilo in alto a destra → <strong>SMTP & API</strong> → scheda <strong>API Keys</strong>.<br>
                3. Genera una nuova chiave API v3 (inizia con <code>xkeysib-...</code>) e incollala qui sotto. Assicurati che l'email mittente sia verificata in Sendinblue.
            </div>

            <div class="form-group">
                <label style="display:flex; align-items:center; gap:0.5rem; cursor:pointer;">
                    <input type="checkbox" id="sib_enabled" ${cfg.enabled ? "checked" : ""} style="width:17px; height:17px; accent-color:#0284c7;">
                    <strong>Abilita invio email promemoria con Sendinblue (Brevo API v3)</strong>
                </label>
            </div>

            <div class="form-group">
                <label>Sendinblue / Brevo API Key v3 (<code>xkeysib-...</code>) *</label>
                <input type="password" id="sib_api_key" class="form-control" required placeholder="xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxx" value="${cfg.apiKey || ""}" autocomplete="off">
                <small style="color:var(--text-muted); font-size:0.74rem; display:block; margin-top:0.25rem;">
                    La chiave viene salvata in modo permanente sia nel browser che sul server Ubuntu (protetta negli aggiornamenti OTA).
                </small>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Nome Mittente Atelier *</label>
                    <input type="text" id="sib_sender_name" class="form-control" required value="${cfg.senderName || "Liuteria De Lorenzi - Cremona"}">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Email Mittente Verificata su Sendinblue *</label>
                    <input type="email" id="sib_sender_email" class="form-control" required value="${cfg.senderEmail || "fabio.delorenzi@gmail.com"}">
                </div>
            </div>

            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Email per Risposte (Reply-To)</label>
                    <input type="email" id="sib_reply_to" class="form-control" value="${cfg.replyToEmail || cfg.senderEmail || "fabio.delorenzi@gmail.com"}">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Telefono Contatto Bottega</label>
                    <input type="text" id="sib_atelier_phone" class="form-control" value="${cfg.atelierPhone || "+39 0372 000000"}">
                </div>
            </div>

            <div class="form-group">
                <label>Indirizzo / Firma Sede Atelier (mostrato a piè di pagina nell'email)</label>
                <input type="text" id="sib_atelier_address" class="form-control" value="${cfg.atelierAddress || "Bottega Liuteria De Lorenzi — Cremona"}">
            </div>

            <div id="sibConfigTestFeedback" style="display:none; margin:0.8rem 0; padding:0.75rem 0.95rem; border-radius:8px; font-size:0.82rem;"></div>

            <div style="display:flex; gap:0.6rem; justify-content:flex-end; flex-wrap:wrap; margin-top:1.2rem;">
                <button type="button" class="btn btn-secondary" onclick="window.sendTestSendinblueEmailFromConfig()">
                    <i data-lucide="send"></i> 🧪 Invia Email di Prova al Mittente
                </button>
                <button type="submit" class="btn btn-primary" style="background:linear-gradient(135deg, #0284c7, #2563eb); border:none;">
                    <i data-lucide="check-circle-2"></i> Salva Configurazione Sendinblue
                </button>
            </div>
        </form>
    `;

    modalOverlay.classList.add("active");
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.collectSendinblueFormValues = function() {
    const apiKey = (document.getElementById("sib_api_key")?.value || "").trim();
    const enabled = Boolean(document.getElementById("sib_enabled")?.checked || apiKey.length > 8);
    return {
        enabled,
        apiKey,
        senderName: (document.getElementById("sib_sender_name")?.value || "Liuteria De Lorenzi - Cremona").trim(),
        senderEmail: (document.getElementById("sib_sender_email")?.value || "fabio.delorenzi@gmail.com").trim(),
        replyToEmail: (document.getElementById("sib_reply_to")?.value || "fabio.delorenzi@gmail.com").trim(),
        atelierPhone: (document.getElementById("sib_atelier_phone")?.value || "+39 0372 000000").trim(),
        atelierAddress: (document.getElementById("sib_atelier_address")?.value || "Bottega Liuteria De Lorenzi — Cremona").trim()
    };
};

window.saveSendinblueConfigFromModal = async function(e) {
    if (e) e.preventDefault();
    const values = window.collectSendinblueFormValues();
    const cfg = window.getSendinblueConfig();
    Object.assign(cfg, values);
    window.atelierDB.saveData();

    try {
        await fetch("/api/sendinblue/config", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ config: cfg })
        });
    } catch (err) {
        // Ignora se server statico
    }

    window.closeModal();
    window.showToast("Configurazione Sendinblue salvata con successo!");
    if (window.appController && (window.appController.currentModule === "calendarioAppuntamenti" || window.appController.currentModule === "calendarioLavorazioni")) {
        window.appController.loadModule(window.appController.currentModule);
    }
};

window.dispatchSendinblueEmailPayload = async function(payload, configOverride) {
    const cfg = Object.assign({}, window.getSendinblueConfig(), configOverride || {});
    // 1. Tenta l'invio tramite il backend Python del server Gestionale (/api/sendinblue/send-reminder)
    try {
        const res = await fetch("/api/sendinblue/send-reminder", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...payload,
                config: cfg
            })
        });
        if (res.ok || res.status === 400 || res.status === 502) {
            const data = await res.json();
            if (typeof data.ok === "boolean") {
                return data;
            }
        }
    } catch (serverErr) {
        // Fallback diretto al browser verso l'API REST v3 di Sendinblue/Brevo
    }

    // 2. Fallback diretto browser -> https://api.brevo.com/v3/smtp/email
    if (!cfg.apiKey || String(cfg.apiKey).trim().length < 8) {
        return {
            ok: false,
            error: "Chiave API Sendinblue (Brevo) mancante. Configura la tua chiave API (xkeysib-...) nelle impostazioni Sendinblue."
        };
    }

    const brevoBody = {
        sender: {
            name: cfg.senderName || "Liuteria De Lorenzi - Cremona",
            email: cfg.senderEmail || "fabio.delorenzi@gmail.com"
        },
        to: [
            {
                email: payload.recipientEmail,
                name: payload.recipientName || payload.cliente || "Cliente"
            }
        ],
        replyTo: {
            email: cfg.replyToEmail || cfg.senderEmail || "fabio.delorenzi@gmail.com",
            name: cfg.senderName || "Liuteria De Lorenzi - Cremona"
        },
        subject: payload.subject || `Promemoria Appuntamento del ${payload.data || ""} — Liuteria De Lorenzi`,
        htmlContent: payload.htmlContent || `<p>${payload.customMessage || "Promemoria appuntamento presso Liuteria De Lorenzi."}</p>`,
        textContent: payload.textContent || payload.customMessage || "Promemoria appuntamento presso Liuteria De Lorenzi."
    };

    try {
        const directRes = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "api-key": String(cfg.apiKey).trim()
            },
            body: JSON.stringify(brevoBody)
        });
        const directData = await directRes.json().catch(() => ({}));
        if (directRes.ok) {
            return {
                ok: true,
                messageId: directData.messageId || "brevo-direct-ok",
                message: `Promemoria inviato con successo a ${payload.recipientEmail} tramite Sendinblue!`
            };
        } else {
            return {
                ok: false,
                error: directData.message || directData.code || `Errore Sendinblue HTTP ${directRes.status}`
            };
        }
    } catch (directErr) {
        return {
            ok: false,
            error: `Errore di rete durante la connessione a Sendinblue: ${directErr.message || directErr}`
        };
    }
};

window.sendTestSendinblueEmailFromConfig = async function() {
    const feedbackEl = document.getElementById("sibConfigTestFeedback");
    const values = window.collectSendinblueFormValues();
    if (!values.apiKey) {
        if (feedbackEl) {
            feedbackEl.style.display = "block";
            feedbackEl.style.background = "rgba(239,68,68,0.12)";
            feedbackEl.style.border = "1px solid rgba(239,68,68,0.35)";
            feedbackEl.style.color = "#fca5a5";
            feedbackEl.textContent = "⚠️ Inserisci prima la chiave API Sendinblue (xkeysib-...).";
        }
        return;
    }

    if (feedbackEl) {
        feedbackEl.style.display = "block";
        feedbackEl.style.background = "rgba(56,189,248,0.12)";
        feedbackEl.style.border = "1px solid rgba(56,189,248,0.35)";
        feedbackEl.style.color = "#bae6fd";
        feedbackEl.textContent = "⏳ Invio email di prova tramite Sendinblue in corso...";
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const result = await window.dispatchSendinblueEmailPayload({
        appointmentId: "test-config",
        recipientEmail: values.senderEmail,
        recipientName: values.senderName,
        cliente: "Test Configurazione Atelier",
        data: todayStr,
        ora: "10:30",
        tipo: "Verifica Connessione Sendinblue",
        strumento: "Violino d'Autore — Liuteria De Lorenzi",
        note: "Questa è un'email di prova generata dal Gestionale Liuteria per verificare il corretto funzionamento dei promemoria Calendario tramite Sendinblue (Brevo).",
        subject: `✅ Test Promemoria Sendinblue — ${values.senderName}`
    }, values);

    if (result && result.ok) {
        const cfg = window.getSendinblueConfig();
        Object.assign(cfg, values, {
            lastTestStatus: "success",
            lastTestTime: new Date().toLocaleString("it-IT"),
            lastTestMessage: result.message || `Test inviato a ${values.senderEmail}`
        });
        window.atelierDB.saveData();
        if (feedbackEl) {
            feedbackEl.style.background = "rgba(16,185,129,0.14)";
            feedbackEl.style.border = "1px solid rgba(16,185,129,0.4)";
            feedbackEl.style.color = "#6ee7b7";
            feedbackEl.innerHTML = `✅ <strong>${result.message}</strong> (ID: <code>${result.messageId || "OK"}</code>)`;
        }
    } else {
        if (feedbackEl) {
            feedbackEl.style.background = "rgba(239,68,68,0.14)";
            feedbackEl.style.border = "1px solid rgba(239,68,68,0.4)";
            feedbackEl.style.color = "#fca5a5";
            feedbackEl.innerHTML = `❌ <strong>Invio non riuscito:</strong> ${result?.error || "Controlla la chiave API e che l'email mittente sia autorizzata su Sendinblue."}`;
        }
    }
};

window.openSendinblueReminderModal = function(collectionName, itemId) {
    const col = collectionName || "calendarioAppuntamenti";
    const item = window.atelierDB.getItem(col, itemId);
    if (!item) {
        window.showToast("Voce di calendario non trovata", "error");
        return;
    }

    const cfg = window.getSendinblueConfig();
    const isLavorazione = col === "calendarioLavorazioni";

    const clienteLabel = isLavorazione ? (item.responsabile || "Maestro Liutaio") : (item.cliente || "Cliente Atelier");
    const dataLabel = isLavorazione ? `${item.inizio || "-"} → ${item.fine || "-"}` : (item.data || "-");
    const oraLabel = isLavorazione ? `Avanzamento ${item.progresso || 0}% (${item.priorita || "Normale"})` : (item.ora || "10:30");
    const tipoLabel = isLavorazione ? (item.titolo || "Lavorazione in Bottega") : (item.tipo || "Appuntamento in Atelier");
    const strumentoLabel = item.strumento || "-";
    const noteLabel = isLavorazione ? `Fase attuale: ${item.fase || "-"}` : (item.note || "");

    const defaultEmail = isLavorazione
        ? (item.emailCliente || cfg.senderEmail || "fabio.delorenzi@gmail.com")
        : (window.resolveClientEmailForCalendarItem(item) || "");

    const defaultSubject = isLavorazione
        ? `Promemoria Lavorazione: ${tipoLabel} (${strumentoLabel}) — ${cfg.senderName || "Liuteria De Lorenzi"}`
        : `Promemoria Appuntamento del ${dataLabel} alle ${oraLabel} — ${cfg.senderName || "Liuteria De Lorenzi"}`;

    const defaultCustomMsg = isLavorazione
        ? `Gentile ${clienteLabel}, ti inviamo un promemoria relativo alla lavorazione "${tipoLabel}" sullo strumento ${strumentoLabel}, programmata con scadenza ${item.fine || dataLabel}.`
        : `Gentile ${clienteLabel}, siamo lieti di ricordarLe il Suo prossimo appuntamento presso la nostra Bottega di Liuteria per "${tipoLabel}" in data ${dataLabel} alle ore ${oraLabel}.`;

    const clientsWithEmails = (window.atelierDB.data.clienti || [])
        .filter(c => c && c.email && c.email !== "-")
        .map(c => `<option value="${c.email}">${c.nome} (${c.email})</option>`)
        .join("");

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    if (!modalOverlay || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `<i data-lucide="send" style="color:#38bdf8;"></i> Invia Promemoria con Sendinblue (Brevo)`;

    modalBody.innerHTML = `
        <form onsubmit="window.sendSendinblueReminderNow(event)">
            <input type="hidden" id="sib_rem_collection" value="${col}">
            <input type="hidden" id="sib_rem_id" value="${item.id}">

            <!-- Riepilogo Appuntamento -->
            <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.3); border-radius:10px; padding:0.9rem 1.1rem; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
                <div>
                    <div style="font-size:0.74rem; text-transform:uppercase; letter-spacing:1px; color:var(--accent-gold); font-weight:700;">
                        ${isLavorazione ? "🛠️ Scadenza Lavorazione" : "📅 Dettagli Appuntamento"}
                    </div>
                    <div style="font-size:1rem; font-weight:700; color:#fff; margin-top:0.15rem;">
                        ${clienteLabel} — <span style="color:var(--accent-gold);">${dataLabel}</span> (${oraLabel})
                    </div>
                    <div style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.15rem;">
                        <strong>${tipoLabel}</strong> • Strumento: <em>${strumentoLabel}</em>
                    </div>
                </div>
                <button type="button" class="btn btn-secondary" style="font-size:0.75rem; padding:0.35rem 0.7rem;" onclick="window.openSendinblueConfigModal()">
                    <i data-lucide="settings" style="width:13px; height:13px;"></i> API Key Sendinblue
                </button>
            </div>

            ${(!cfg.apiKey || String(cfg.apiKey).trim().length < 8) ? `
                <div style="background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.4); border-radius:9px; padding:0.85rem 1rem; margin-bottom:1rem;">
                    <label style="color:#fbbf24; font-weight:700; font-size:0.82rem; display:block; margin-bottom:0.35rem;">
                        🔑 Chiave API Sendinblue (Brevo) richiesta per il primo invio:
                    </label>
                    <input type="password" id="sib_rem_inline_apikey" class="form-control" placeholder="Incolla qui la tua API Key Sendinblue (xkeysib-...)" required autocomplete="off">
                    <small style="color:#fde68a; font-size:0.73rem; display:block; margin-top:0.25rem;">
                        Verrà salvata automaticamente anche per tutti i prossimi promemoria.
                    </small>
                </div>
            ` : ""}

            <div class="form-row">
                <div class="form-group" style="flex:1.2;">
                    <label>Email Destinatario *</label>
                    <input type="email" id="sib_rem_email" list="sib_client_emails_datalist" class="form-control" required placeholder="es. cliente@orchestra.it" value="${defaultEmail}">
                    <datalist id="sib_client_emails_datalist">
                        ${clientsWithEmails}
                    </datalist>
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Nome Destinatario</label>
                    <input type="text" id="sib_rem_name" class="form-control" required value="${clienteLabel}">
                </div>
            </div>

            <div class="form-group">
                <label>Oggetto Email</label>
                <input type="text" id="sib_rem_subject" class="form-control" required value="${defaultSubject}">
            </div>

            <div class="form-group">
                <label>Messaggio di Apertura Personalizzato</label>
                <textarea id="sib_rem_message" class="form-control" rows="3" required>${defaultCustomMsg}</textarea>
            </div>

            <div id="sibReminderStatusBox" style="display:none; margin:0.85rem 0; padding:0.8rem 1rem; border-radius:8px; font-size:0.84rem;"></div>

            <div style="display:flex; justify-content:space-between; align-items:center; gap:0.6rem; flex-wrap:wrap; margin-top:1.15rem; padding-top:0.85rem; border-top:1px solid rgba(255,255,255,0.08);">
                <span style="font-size:0.75rem; color:var(--text-muted);">
                    Mittente: <strong>${cfg.senderName || "Liuteria De Lorenzi"}</strong> &lt;${cfg.senderEmail || "fabio.delorenzi@gmail.com"}&gt;
                </span>
                <div style="display:flex; gap:0.5rem;">
                    <button type="button" class="btn btn-secondary" onclick="window.closeModal()">Annulla</button>
                    <button type="submit" id="sibRemSubmitBtn" class="btn btn-primary" style="background:linear-gradient(135deg, #0284c7, #2563eb); border:none; padding:0.55rem 1.2rem;">
                        <i data-lucide="send"></i> 🚀 Invia Ora con Sendinblue
                    </button>
                </div>
            </div>
        </form>
    `;

    modalOverlay.classList.add("active");
    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }
};

window.sendSendinblueReminderNow = async function(e) {
    if (e) e.preventDefault();
    const col = document.getElementById("sib_rem_collection")?.value || "calendarioAppuntamenti";
    const itemId = document.getElementById("sib_rem_id")?.value || "";
    const item = window.atelierDB.getItem(col, itemId);
    if (!item) return;

    const inlineKeyEl = document.getElementById("sib_rem_inline_apikey");
    const cfg = window.getSendinblueConfig();
    if (inlineKeyEl && inlineKeyEl.value.trim()) {
        cfg.apiKey = inlineKeyEl.value.trim();
        cfg.enabled = true;
        window.atelierDB.saveData();
    }

    const recipientEmail = (document.getElementById("sib_rem_email")?.value || "").trim();
    const recipientName = (document.getElementById("sib_rem_name")?.value || "").trim();
    const subject = (document.getElementById("sib_rem_subject")?.value || "").trim();
    const customMessage = (document.getElementById("sib_rem_message")?.value || "").trim();

    const statusBox = document.getElementById("sibReminderStatusBox");
    const submitBtn = document.getElementById("sibRemSubmitBtn");
    if (submitBtn) submitBtn.disabled = true;

    if (statusBox) {
        statusBox.style.display = "block";
        statusBox.style.background = "rgba(56,189,248,0.12)";
        statusBox.style.border = "1px solid rgba(56,189,248,0.35)";
        statusBox.style.color = "#bae6fd";
        statusBox.textContent = `⏳ Invio promemoria a ${recipientEmail} tramite Sendinblue in corso...`;
    }

    const isLavorazione = col === "calendarioLavorazioni";
    const payload = {
        appointmentId: item.id,
        recipientEmail,
        recipientName,
        cliente: recipientName,
        data: isLavorazione ? `${item.inizio || "-"} → ${item.fine || "-"}` : (item.data || "-"),
        ora: isLavorazione ? `Avanzamento ${item.progresso || 0}%` : (item.ora || "10:30"),
        tipo: isLavorazione ? (item.titolo || "Lavorazione") : (item.tipo || "Appuntamento"),
        strumento: item.strumento || "-",
        note: isLavorazione ? `Fase: ${item.fase || "-"}` : (item.note || ""),
        subject,
        customMessage
    };

    const result = await window.dispatchSendinblueEmailPayload(payload, cfg);
    if (submitBtn) submitBtn.disabled = false;

    if (result && result.ok) {
        const nowStamp = new Date().toLocaleString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
        item.emailCliente = recipientEmail;
        item.ultimoPromemoriaInviato = nowStamp;
        cfg.lastTestStatus = "success";
        cfg.lastTestTime = nowStamp;
        cfg.lastTestMessage = `Inviato a ${recipientEmail} (${nowStamp})`;
        window.atelierDB.updateItem(col, item.id, item);

        window.showToast(`Promemoria Sendinblue inviato a ${recipientEmail}!`);
        window.closeModal();
        if (window.appController && window.appController.currentModule === col) {
            window.appController.loadModule(col);
        }
    } else {
        if (statusBox) {
            statusBox.style.background = "rgba(239,68,68,0.14)";
            statusBox.style.border = "1px solid rgba(239,68,68,0.4)";
            statusBox.style.color = "#fca5a5";
            statusBox.innerHTML = `❌ <strong>Errore Sendinblue:</strong> ${result?.error || "Impossibile inviare il promemoria. Verifica la API Key Sendinblue."}`;
        }
    }
};

window.sendBulkSendinblueReminders = async function() {
    const cfg = window.getSendinblueConfig();
    if (!cfg.apiKey || String(cfg.apiKey).trim().length < 8) {
        window.showToast("Configura prima la tua API Key Sendinblue per l'invio multiplo", "info");
        window.openSendinblueConfigModal();
        return;
    }

    const items = (window.atelierDB.data.calendarioAppuntamenti || []).filter(a => a && a.stato !== "Completato");
    const withEmail = items.filter(a => {
        const em = window.resolveClientEmailForCalendarItem(a);
        return em && em.includes("@");
    });

    if (withEmail.length === 0) {
        window.showToast("Nessun appuntamento attivo con indirizzo email associato", "info");
        return;
    }

    if (!confirm(`Vuoi inviare un promemoria email tramite Sendinblue a tutti i ${withEmail.length} appuntamenti attivi in calendario?`)) {
        return;
    }

    let okCount = 0;
    let errCount = 0;
    for (const item of withEmail) {
        const recipientEmail = window.resolveClientEmailForCalendarItem(item);
        const res = await window.dispatchSendinblueEmailPayload({
            appointmentId: item.id,
            recipientEmail,
            recipientName: item.cliente,
            cliente: item.cliente,
            data: item.data,
            ora: item.ora,
            tipo: item.tipo,
            strumento: item.strumento,
            note: item.note
        }, cfg);

        if (res && res.ok) {
            okCount++;
            item.emailCliente = recipientEmail;
            item.ultimoPromemoriaInviato = new Date().toLocaleString("it-IT", {
                day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
            });
        } else {
            errCount++;
        }
    }

    window.atelierDB.saveData();
    if (window.appController && window.appController.currentModule === "calendarioAppuntamenti") {
        window.appController.loadModule("calendarioAppuntamenti");
    }

    if (errCount === 0) {
        window.showToast(`Inviati ${okCount} promemoria tramite Sendinblue!`);
    } else {
        window.showToast(`Inviati ${okCount} promemoria (${errCount} errori).`, "info");
    }
};

// =========================================================================
// MODULO INTEGRATO: LIUTERIA MAKING (CAD 3D, CHLADNI M1/M2/M5, FFT & LEGNI)
// =========================================================================

window.LM_MEASUREMENT_SCHEMA = {
    violin: {
        name: "Violino",
        icon: "🎻",
        fields: [
            { key: "rib_height", label: "Altezza fasce", unit: "mm", min: 28, max: 34, def: 30.0, step: 0.2, group: "Fasce" },
            { key: "rib_thickness", label: "Spessore fasce", unit: "mm", min: 1.0, max: 1.5, def: 1.2, step: 0.05, group: "Fasce" },
            { key: "top_center", label: "Spessore tavola al centro", unit: "mm", min: 2.0, max: 4.0, def: 2.8, step: 0.1, group: "Tavola" },
            { key: "top_upper", label: "Spessore tavola polmone sup.", unit: "mm", min: 2.0, max: 3.5, def: 2.5, step: 0.1, group: "Tavola" },
            { key: "top_lower", label: "Spessore tavola polmone inf.", unit: "mm", min: 2.0, max: 3.5, def: 2.5, step: 0.1, group: "Tavola" },
            { key: "top_f_holes", label: "Spessore tavola attorno effe", unit: "mm", min: 2.0, max: 3.5, def: 2.3, step: 0.1, group: "Tavola" },
            { key: "edge_height", label: "Altezza bordo tavola", unit: "mm", min: 3.0, max: 6.0, def: 4.5, step: 0.1, group: "Tavola" },
            { key: "back_center", label: "Spessore fondo al centro", unit: "mm", min: 3.0, max: 6.0, def: 4.2, step: 0.1, group: "Fondo" },
            { key: "back_upper", label: "Spessore fondo polmone sup.", unit: "mm", min: 2.5, max: 5.0, def: 3.5, step: 0.1, group: "Fondo" },
            { key: "back_lower", label: "Spessore fondo polmone inf.", unit: "mm", min: 2.5, max: 5.0, def: 3.5, step: 0.1, group: "Fondo" },
            { key: "body_length", label: "Lunghezza cassa", unit: "mm", min: 340, max: 365, def: 356.0, step: 0.5, group: "Dimensioni" },
            { key: "upper_bout_width", label: "Larghezza polmone sup.", unit: "mm", min: 155, max: 175, def: 168.0, step: 0.5, group: "Dimensioni" },
            { key: "lower_bout_width", label: "Larghezza polmone inf.", unit: "mm", min: 195, max: 215, def: 208.0, step: 0.5, group: "Dimensioni" },
            { key: "waist_width", label: "Larghezza al centro (vita)", unit: "mm", min: 100, max: 115, def: 110.0, step: 0.5, group: "Dimensioni" },
            { key: "f_hole_length", label: "Lunghezza effe", unit: "mm", min: 70, max: 82, def: 76.0, step: 0.5, group: "Effe" },
            { key: "f_hole_width", label: "Larghezza effe al centro", unit: "mm", min: 5, max: 9, def: 6.5, step: 0.1, group: "Effe" },
            { key: "f_hole_position", label: "Posizione taglio effe (da fondo)", unit: "mm", min: 155, max: 205, def: 195.0, step: 0.5, group: "Effe" },
            { key: "purfling_depth", label: "Profondità canale filetto", unit: "mm", min: 1.5, max: 3.0, def: 2.0, step: 0.1, group: "Filetto" },
            { key: "neck_length", label: "Lunghezza manico", unit: "mm", min: 125, max: 135, def: 130.0, step: 0.5, group: "Manico" },
            { key: "pegbox_width", label: "Larghezza testa (cavigliere)", unit: "mm", min: 38, max: 48, def: 42.0, step: 0.5, group: "Manico" },
            { key: "neck_cheek_thickness", label: "Spessore ganasce manico", unit: "mm", min: 18, max: 24, def: 20.0, step: 0.5, group: "Manico" },
            { key: "corner_length", label: "Lunghezza punte", unit: "mm", min: 10, max: 20, def: 15.0, step: 0.5, group: "Punte" }
        ]
    },
    viola: {
        name: "Viola",
        icon: "🎻",
        fields: [
            { key: "rib_height", label: "Altezza fasce", unit: "mm", min: 33, max: 42, def: 37.0, step: 0.5, group: "Fasce" },
            { key: "rib_thickness", label: "Spessore fasce", unit: "mm", min: 1.0, max: 1.6, def: 1.3, step: 0.05, group: "Fasce" },
            { key: "top_center", label: "Spessore tavola al centro", unit: "mm", min: 2.5, max: 4.5, def: 3.0, step: 0.1, group: "Tavola" },
            { key: "top_upper", label: "Spessore tavola polmone sup.", unit: "mm", min: 2.0, max: 4.0, def: 2.7, step: 0.1, group: "Tavola" },
            { key: "top_lower", label: "Spessore tavola polmone inf.", unit: "mm", min: 2.0, max: 4.0, def: 2.7, step: 0.1, group: "Tavola" },
            { key: "top_f_holes", label: "Spessore tavola attorno effe", unit: "mm", min: 2.0, max: 3.5, def: 2.4, step: 0.1, group: "Tavola" },
            { key: "edge_height", label: "Altezza bordo tavola", unit: "mm", min: 3.0, max: 7.0, def: 5.0, step: 0.1, group: "Tavola" },
            { key: "back_center", label: "Spessore fondo al centro", unit: "mm", min: 3.5, max: 6.5, def: 4.5, step: 0.1, group: "Fondo" },
            { key: "back_upper", label: "Spessore fondo polmone sup.", unit: "mm", min: 3.0, max: 5.5, def: 3.8, step: 0.1, group: "Fondo" },
            { key: "back_lower", label: "Spessore fondo polmone inf.", unit: "mm", min: 3.0, max: 5.5, def: 3.8, step: 0.1, group: "Fondo" },
            { key: "body_length", label: "Lunghezza cassa", unit: "mm", min: 380, max: 430, def: 410.0, step: 0.5, group: "Dimensioni" },
            { key: "upper_bout_width", label: "Larghezza polmone sup.", unit: "mm", min: 180, max: 210, def: 195.0, step: 0.5, group: "Dimensioni" },
            { key: "lower_bout_width", label: "Larghezza polmone inf.", unit: "mm", min: 225, max: 260, def: 245.0, step: 0.5, group: "Dimensioni" },
            { key: "waist_width", label: "Larghezza al centro (vita)", unit: "mm", min: 120, max: 145, def: 135.0, step: 0.5, group: "Dimensioni" },
            { key: "f_hole_length", label: "Lunghezza effe", unit: "mm", min: 75, max: 90, def: 82.0, step: 0.5, group: "Effe" },
            { key: "f_hole_width", label: "Larghezza effe al centro", unit: "mm", min: 5, max: 10, def: 7.0, step: 0.1, group: "Effe" },
            { key: "f_hole_position", label: "Posizione taglio effe (da fondo)", unit: "mm", min: 175, max: 225, def: 210.0, step: 0.5, group: "Effe" },
            { key: "purfling_depth", label: "Profondità canale filetto", unit: "mm", min: 1.5, max: 3.0, def: 2.0, step: 0.1, group: "Filetto" },
            { key: "neck_length", label: "Lunghezza manico", unit: "mm", min: 140, max: 160, def: 152.0, step: 0.5, group: "Manico" },
            { key: "pegbox_width", label: "Larghezza testa (cavigliere)", unit: "mm", min: 40, max: 52, def: 46.0, step: 0.5, group: "Manico" },
            { key: "neck_cheek_thickness", label: "Spessore ganasce manico", unit: "mm", min: 20, max: 28, def: 23.0, step: 0.5, group: "Manico" },
            { key: "corner_length", label: "Lunghezza punte", unit: "mm", min: 10, max: 22, def: 16.0, step: 0.5, group: "Punte" }
        ]
    },
    cello: {
        name: "Violoncello",
        icon: "🎻",
        fields: [
            { key: "rib_height", label: "Altezza fasce", unit: "mm", min: 110, max: 130, def: 118.0, step: 0.5, group: "Fasce" },
            { key: "rib_thickness", label: "Spessore fasce", unit: "mm", min: 1.5, max: 2.5, def: 1.8, step: 0.05, group: "Fasce" },
            { key: "top_center", label: "Spessore tavola al centro", unit: "mm", min: 3.5, max: 6.0, def: 4.5, step: 0.1, group: "Tavola" },
            { key: "top_upper", label: "Spessore tavola polmone sup.", unit: "mm", min: 3.0, max: 5.0, def: 3.8, step: 0.1, group: "Tavola" },
            { key: "top_lower", label: "Spessore tavola polmone inf.", unit: "mm", min: 3.0, max: 5.0, def: 3.8, step: 0.1, group: "Tavola" },
            { key: "top_f_holes", label: "Spessore tavola attorno effe", unit: "mm", min: 2.5, max: 4.5, def: 3.2, step: 0.1, group: "Tavola" },
            { key: "edge_height", label: "Altezza bordo tavola", unit: "mm", min: 5.0, max: 10.0, def: 7.0, step: 0.2, group: "Tavola" },
            { key: "back_center", label: "Spessore fondo al centro", unit: "mm", min: 5.0, max: 8.0, def: 6.0, step: 0.1, group: "Fondo" },
            { key: "back_upper", label: "Spessore fondo polmone sup.", unit: "mm", min: 4.0, max: 7.0, def: 5.0, step: 0.1, group: "Fondo" },
            { key: "back_lower", label: "Spessore fondo polmone inf.", unit: "mm", min: 4.0, max: 7.0, def: 5.0, step: 0.1, group: "Fondo" },
            { key: "body_length", label: "Lunghezza cassa", unit: "mm", min: 740, max: 780, def: 755.0, step: 1.0, group: "Dimensioni" },
            { key: "upper_bout_width", label: "Larghezza polmone sup.", unit: "mm", min: 330, max: 360, def: 340.0, step: 1.0, group: "Dimensioni" },
            { key: "lower_bout_width", label: "Larghezza polmone inf.", unit: "mm", min: 420, max: 460, def: 440.0, step: 1.0, group: "Dimensioni" },
            { key: "waist_width", label: "Larghezza al centro (vita)", unit: "mm", min: 220, max: 260, def: 240.0, step: 1.0, group: "Dimensioni" },
            { key: "f_hole_length", label: "Lunghezza effe", unit: "mm", min: 115, max: 140, def: 128.0, step: 0.5, group: "Effe" },
            { key: "f_hole_width", label: "Larghezza effe al centro", unit: "mm", min: 8, max: 14, def: 11.0, step: 0.2, group: "Effe" },
            { key: "f_hole_position", label: "Posizione taglio effe (da fondo)", unit: "mm", min: 330, max: 400, def: 370.0, step: 1.0, group: "Effe" },
            { key: "purfling_depth", label: "Profondità canale filetto", unit: "mm", min: 2.0, max: 4.0, def: 2.5, step: 0.1, group: "Filetto" },
            { key: "neck_length", label: "Lunghezza manico", unit: "mm", min: 275, max: 295, def: 285.0, step: 1.0, group: "Manico" },
            { key: "pegbox_width", label: "Larghezza testa (cavigliere)", unit: "mm", min: 65, max: 85, def: 75.0, step: 0.5, group: "Manico" },
            { key: "neck_cheek_thickness", label: "Spessore ganasce manico", unit: "mm", min: 35, max: 48, def: 42.0, step: 0.5, group: "Manico" },
            { key: "corner_length", label: "Lunghezza punte", unit: "mm", min: 15, max: 30, def: 22.0, step: 0.5, group: "Punte" }
        ]
    }
};

window.lmState = {
    leftTab: "measurements", // "measurements" | "woods"
    woodSearch: "",
    activeComponentFilter: -1, // -1=All, 0=Tavola, 1=Fondo, 2=Fasce, 3=Manico, 4=Effe
    wireframe: false,
    showDimensions: true,
    autoRotate: false,
    simMode: "wood", // "wood" | "m1" | "m2" | "m5" | "vib440" | "thickness"
    rotX: -0.62,
    rotY: 0.42,
    zoom: 1.0,
    isDragging: false,
    lastMouseX: 0,
    lastMouseY: 0,
    importedCustomMesh: null,
    importedMeshName: "",
    animPhase: 0,
    animReqId: null,
    // Audio / FFT state
    audioCtx: null,
    analyser: null,
    micStream: null,
    synthOscs: [],
    isCapturing: false,
    isSynthetic: false,
    isCalibrating: false,
    calibrationFrames: [],
    noiseProfile: null,
    fftSize: 4096,
    windowType: "hann",
    selectedHistoricalId: "hist-1",
    selectedArchiveId: "lm-inst-1",
    latestFft: null
};

window.getLiuteriaMakingData = function() {
    if (!window.atelierDB || !window.atelierDB.data) return {};
    if (!window.atelierDB.data.liuteriaMaking) {
        window.atelierDB.data.liuteriaMaking = JSON.parse(JSON.stringify(defaultData.liuteriaMaking));
    }
    return window.atelierDB.data.liuteriaMaking;
};

// Formula esatta da Violin.calculate_volume() in LiuteriaMaking/luthier_app/geometry/instruments/violin.py
window.calculateLmInstrumentVolume = function(m) {
    const body_len = Number(m.body_length) || 356;
    const upper_w = (Number(m.upper_bout_width) || 168) / 2;
    const lower_w = (Number(m.lower_bout_width) || 208) / 2;
    const waist_w = (Number(m.waist_width) || 110) / 2;
    const rib_h = Number(m.rib_height) || 30;
    const rib_t = Number(m.rib_thickness) || 1.2;

    const v_lower = Math.PI * lower_w * (lower_w * 0.55) * (body_len * 0.35) / 4;
    const v_waist = Math.PI * waist_w * (waist_w * 0.48) * (body_len * 0.30) / 4;
    const v_upper = Math.PI * upper_w * (upper_w * 0.55) * (body_len * 0.25) / 4;

    const depth_ref = Math.max(lower_w * 0.55, upper_w * 0.55, waist_w * 0.48);
    const total_ext = (v_lower + v_waist + v_upper) * (rib_h / depth_ref);

    const top_avg = ((Number(m.top_center) || 2.8) + (Number(m.top_upper) || 2.5) + (Number(m.top_lower) || 2.5)) / 3;
    const back_avg = ((Number(m.back_center) || 4.2) + (Number(m.back_upper) || 3.5) + (Number(m.back_lower) || 3.5)) / 3;
    const h_internal = rib_h - top_avg - back_avg;
    const reduction = Math.max(h_internal / rib_h, 0.5);
    const perim_reduction = 1.0 - (2 * rib_t / Math.min(waist_w, 50));

    return Number((total_ext * reduction * perim_reduction / 1000.0).toFixed(1));
};

window.calculateLmAcousticEstimates = function(instType, m, topWood, backWood) {
    const volCm3 = window.calculateLmInstrumentVolume(m);
    const topRho = (topWood && topWood.density_kg_m3) || 420;
    const topVel = (topWood && topWood.sound_velocity) || 5600;
    const backRho = (backWood && backWood.density_kg_m3) || 680;
    const backVel = (backWood && backWood.sound_velocity) || 3900;

    const bodyLenM = (Number(m.body_length) || 356) / 1000;
    const avgWidthM = (((Number(m.upper_bout_width) || 168) + (Number(m.lower_bout_width) || 208) + (Number(m.waist_width) || 110)) / 3) / 1000;
    const plateAreaM2 = bodyLenM * avgWidthM * 0.78;

    const topAvgMm = ((Number(m.top_center) || 2.8) + (Number(m.top_upper) || 2.5) + (Number(m.top_lower) || 2.5)) / 3;
    const backAvgMm = ((Number(m.back_center) || 4.2) + (Number(m.back_upper) || 3.5) + (Number(m.back_lower) || 3.5)) / 3;

    const topWeightG = Math.round(plateAreaM2 * (topAvgMm / 1000) * topRho * 1000 * 10) / 10;
    const backWeightG = Math.round(plateAreaM2 * (backAvgMm / 1000) * backRho * 1000 * 10) / 10;

    // Stima fisica frequenze modali M1, M2, M5 (legge di scala h / L^2 * c)
    const refL = instType === "cello" ? 755 : (instType === "viola" ? 410 : 356);
    const refH = instType === "cello" ? 4.5 : (instType === "viola" ? 3.0 : 2.8);
    const baseM5 = instType === "cello" ? 185 : (instType === "viola" ? 280 : 345);
    const baseM2 = instType === "cello" ? 88 : (instType === "viola" ? 125 : 148);
    const baseM1 = instType === "cello" ? 58 : (instType === "viola" ? 85 : 102);

    const scaleFactor = ((topAvgMm / refH) * Math.pow(refL / (Number(m.body_length) || refL), 1.85) * ((topVel / 5500 + backVel / 3950) / 2));
    const m1 = Math.round(baseM1 * scaleFactor);
    const m2 = Math.round(baseM2 * scaleFactor);
    const m5 = Math.round(baseM5 * scaleFactor);

    // Stima Helmholtz A0 dalla superficie effe e volume cassa
    const fAreaMm2 = 2 * (Number(m.f_hole_length) || 76) * (Number(m.f_hole_width) || 6.5) * 0.82;
    const a0Base = instType === "cello" ? 98 : (instType === "viola" ? 215 : 278);
    const refVol = instType === "cello" ? 17500 : (instType === "viola" ? 2650 : 1720);
    const a0 = Math.round(a0Base * Math.sqrt(refVol / Math.max(volCm3, 200)) * Math.pow(fAreaMm2 / (instType === "cello" ? 2300 : 810), 0.25));

    return {
        volumeCm3: volCm3,
        topWeightG,
        backWeightG,
        m1,
        m2,
        m5,
        a0,
        noteM5: window.freqToMusicalNote(m5)
    };
};

window.freqToMusicalNote = function(freq) {
    if (!freq || freq <= 20) return "-";
    const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const midi = Math.round(69 + 12 * Math.log2(freq / 440.0));
    const note = notes[((midi % 12) + 12) % 12];
    const octave = Math.floor(midi / 12) - 1;
    return `${note}${octave}`;
};

// =========================================================================
// MOTORE 3D HARDWARE WEBGL FOTOREALISTICO (Scansioni 3D Reali + Texture 2K + Vernice Cremonese + Chladni GPU)
// =========================================================================

window.lmWebGL = {
    gl: null,
    canvas: null,
    program: null,
    extUint: null,
    modelsCache: {},      // { violin: { numV, numT, minY, maxY, maxHalfW, pos, normMat, uv, idx, gpuBuffers }, ... }
    loadingModels: {},    // { violin: Promise, ... }
    texturesCache: {},    // { url: WebGLTexture }
    loadingTextures: {},  // { url: true }
    whiteTex: null,
    usePhotoTexture: true // true = texture fotografica 2K ove presente, false = shader procedurale Acero Marezzato & Vernice Cremonese
};

// Carica una texture 2K in WebGL con mipmapping trilineare e filtro anisotropico
window.getOrLoadLmWebGLTexture = function(gl, url) {
    if (!window.lmWebGL.whiteTex) {
        const wt = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, wt);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([225, 175, 115, 255]));
        window.lmWebGL.whiteTex = wt;
    }
    if (!url) return window.lmWebGL.whiteTex;
    if (window.lmWebGL.texturesCache[url]) {
        return window.lmWebGL.texturesCache[url];
    }
    if (!window.lmWebGL.loadingTextures[url]) {
        window.lmWebGL.loadingTextures[url] = true;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            if (!window.lmWebGL.gl) return;
            const g = window.lmWebGL.gl;
            const tex = g.createTexture();
            g.bindTexture(g.TEXTURE_2D, tex);
            g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, img);
            // Power of 2 check
            const isPOT = (v) => (v & (v - 1)) === 0;
            if (isPOT(img.width) && isPOT(img.height)) {
                g.generateMipmap(g.TEXTURE_2D);
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR_MIPMAP_LINEAR);
            } else {
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
                g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
            }
            g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
            const extAniso = g.getExtension("EXT_texture_filter_anisotropic") || g.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
            if (extAniso) {
                const maxAniso = g.getParameter(extAniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
                g.texParameterf(g.TEXTURE_2D, extAniso.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(8, maxAniso));
            }
            window.lmWebGL.texturesCache[url] = tex;
            window.renderLm3dCanvas();
        };
        img.src = url;
    }
    return window.lmWebGL.whiteTex;
};

// Carica i modelli 3D ad alta risoluzione convertiti da violin.obj (228k tris), v_Reduced.obj (306k tris) e sketchfab.obj (74k tris)
window.loadLmBinaryModel = async function(instType) {
    if (window.lmWebGL.modelsCache[instType]) {
        return window.lmWebGL.modelsCache[instType];
    }
    if (window.lmWebGL.loadingModels[instType]) {
        return window.lmWebGL.loadingModels[instType];
    }

    const badge = document.getElementById("lm3dLoadingBadge");
    if (badge) {
        badge.style.display = "flex";
        badge.innerHTML = `⏳ Caricamento modello 3D ad alta risoluzione (${instType.toUpperCase()})...`;
    }

    const promise = (async () => {
        try {
            const res = await fetch(`./assets/models/${instType}.bin`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const buf = await res.arrayBuffer();
            const dv = new DataView(buf);
            const numV = dv.getUint32(8, true);
            const numT = dv.getUint32(12, true);
            const minY = dv.getFloat32(16, true);
            const maxY = dv.getFloat32(20, true);
            const maxHalfW = dv.getFloat32(24, true);

            let off = 32;
            const pos = new Float32Array(buf, off, numV * 3); off += numV * 12;
            const normMat = new Int8Array(buf, off, numV * 4); off += numV * 4;
            const uv = new Float32Array(buf, off, numV * 2); off += numV * 8;
            const idx = new Uint32Array(buf, off, numT * 3);

            const modelObj = {
                instType,
                numV,
                numT,
                minY,
                maxY,
                maxHalfW,
                pos,
                normMat,
                uv,
                idx,
                gpuBuffers: null
            };
            window.lmWebGL.modelsCache[instType] = modelObj;
            if (badge) badge.style.display = "none";
            const infoTag = document.getElementById("lm3dModelInfoTag");
            if (infoTag) {
                infoTag.innerHTML = `✓ Scansione 3D Reale: <strong>${numV.toLocaleString("it-IT")} vertici</strong> • <strong>${numT.toLocaleString("it-IT")} triangoli</strong>`;
            }
            window.renderLm3dCanvas();
            return modelObj;
        } catch (err) {
            if (badge) {
                badge.innerHTML = `⚠️ Errore caricamento modello 3D: ${err.message}`;
            }
            return null;
        } finally {
            delete window.lmWebGL.loadingModels[instType];
        }
    })();

    window.lmWebGL.loadingModels[instType] = promise;
    return promise;
};

window.initLmWebGLContext = function(canvas) {
    if (window.lmWebGL.gl && window.lmWebGL.canvas === canvas) {
        return window.lmWebGL.gl;
    }

    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false, preserveDrawingBuffer: true }) ||
               canvas.getContext("webgl", { antialias: true, alpha: false, preserveDrawingBuffer: true });
    if (!gl) return null;

    const isWebGL2 = (typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext);
    const extUint = isWebGL2 ? true : gl.getExtension("OES_element_index_uint");

    const vsSource = `
        attribute vec3 a_pos;
        attribute vec4 a_normMat;
        attribute vec2 a_uv;

        uniform vec3 u_paramScale;
        uniform float u_rotX;
        uniform float u_rotY;
        uniform float u_zoom;
        uniform float u_aspect;
        uniform float u_minY;
        uniform float u_maxY;
        uniform float u_maxHalfW;
        uniform int u_simMode;
        uniform float u_phase;
        uniform float u_topCenterMm;
        uniform float u_topUpperMm;

        varying vec3 v_worldPos;
        varying vec3 v_rawPos;
        varying vec3 v_normal;
        varying vec2 v_uv;
        varying float v_comp;
        varying float v_texSlot;
        varying float v_scalar;

        void main() {
            float matByte = a_normMat.w;
            if (matByte < 0.0) matByte += 256.0;
            float texSlot = floor((matByte + 0.1) / 16.0);
            float comp = matByte - texSlot * 16.0;

            vec3 n = normalize(a_normMat.xyz / 127.0);
            vec3 p = a_pos * u_paramScale;

            // Coordinate normalizzate sulla cassa armonica per pattern di Chladni (M1, M2, M5)
            float spanY = max(u_maxY - u_minY, 1.0);
            float bodyMaxY = u_minY + spanY * 0.60;
            float bodyCy = (u_minY + bodyMaxY) * 0.5;
            float bodyHalfL = max((bodyMaxY - u_minY) * 0.5, 1.0);
            float xn = clamp(a_pos.x / max(u_maxHalfW, 1.0), -1.2, 1.2);
            float yn = clamp((a_pos.y - bodyCy) / bodyHalfL, -1.3, 1.3);
            float r = sqrt(xn * xn + yn * yn);

            float scalar = 0.0;
            if (u_simMode == 1) {
                // Chladni Modo 1: torsione longitudinale (x * y con nodi centrali)
                scalar = clamp(abs(sin(xn * 2.7) * sin(yn * 2.8)), 0.0, 1.0);
            } else if (u_simMode == 2) {
                // Chladni Modo 2 (da main_window.py): |x_norm * y_norm|
                scalar = clamp(abs(xn * yn) * 2.15, 0.0, 1.0);
            } else if (u_simMode == 3) {
                // Chladni Modo 5 Ring Mode (da main_window.py): (cos(r * pi / 0.6) + 1.0) / 2.0
                scalar = clamp((cos(r * 3.14159265 / 0.60) + 1.0) * 0.5, 0.0, 1.0);
            } else if (u_simMode == 4) {
                // Vibrazione Sincrona 440 Hz
                float wave = sin(r * 5.5 - u_phase * 2.4) * cos(xn * 2.6);
                scalar = clamp((wave + 1.0) * 0.5, 0.0, 1.0);
            } else if (u_simMode == 5) {
                // Heatmap Spessori Tavola/Fondo
                float rr = clamp(r, 0.0, 1.0);
                scalar = clamp((1.0 - rr) * (u_topCenterMm / 3.6) + rr * (u_topUpperMm / 3.6), 0.0, 1.0);
            }

            // Deformazione armonica 3D reale lungo la normale durante la vibrazione Chladni / 440Hz
            if (u_simMode >= 1 && u_simMode <= 4 && comp < 2.5) {
                float disp = (scalar - 0.45) * (spanY * 0.012) * sin(u_phase);
                p += n * disp;
            }

            // Rotazione camera (orbita Y e X)
            float cy = cos(u_rotY), sy = sin(u_rotY);
            float cx = cos(u_rotX), sx = sin(u_rotX);

            vec3 p1 = vec3(p.x * cy + p.z * sy, p.y, -p.x * sy + p.z * cy);
            vec3 p2 = vec3(p1.x, p1.y * cx - p1.z * sx, p1.y * sx + p1.z * cx);

            vec3 n1 = vec3(n.x * cy + n.z * sy, n.y, -n.x * sy + n.z * cy);
            vec3 n2 = vec3(n1.x, n1.y * cx - n1.z * sx, n1.y * sx + n1.z * cx);

            float normScale = (2.15 / max(spanY, 1.0)) * u_zoom;
            vec3 viewPos = p2 * normScale;

            // Proiezione prospettica con depth buffer
            float camDist = 3.4;
            float zEye = camDist - viewPos.z;
            float fovScale = 2.45;
            gl_Position = vec4(
                (viewPos.x * fovScale) / max(u_aspect, 0.1),
                viewPos.y * fovScale,
                (viewPos.z * -0.45) / camDist,
                max(zEye / camDist, 0.1)
            );

            v_worldPos = viewPos;
            v_rawPos = a_pos;
            v_normal = normalize(n2);
            v_uv = a_uv;
            v_comp = comp;
            v_texSlot = texSlot;
            v_scalar = scalar;
        }
    `;

    const fsSource = `
        precision highp float;

        varying vec3 v_worldPos;
        varying vec3 v_rawPos;
        varying vec3 v_normal;
        varying vec2 v_uv;
        varying float v_comp;
        varying float v_texSlot;
        varying float v_scalar;

        uniform int u_instId;        // 0=violin, 1=viola, 2=cello, 3=custom
        uniform int u_simMode;       // 0=wood, 1=m1, 2=m2, 3=m5, 4=vib440, 5=thickness
        uniform int u_compFilter;    // -1=all, 0..4
        uniform int u_useTexture;    // 1=use photo texture, 0=procedural master varnish
        uniform int u_wireframe;

        uniform sampler2D u_tex0;    // Main body texture
        uniform sampler2D u_tex1;    // AO (violin) or Neck (cello)
        uniform sampler2D u_tex2;    // Bridge (cello)
        uniform sampler2D u_tex3;    // Fingerboard (cello)
        uniform sampler2D u_tex4;    // Tailpiece (cello)

        // Colormap scientifica "coolwarm" + isolinee nodali di Chladni
        vec3 coolwarm(float t) {
            float v = clamp(t, 0.0, 1.0);
            vec3 cBlue = vec3(0.23, 0.30, 0.75);
            vec3 cWhite = vec3(0.94, 0.94, 0.96);
            vec3 cRed = vec3(0.78, 0.12, 0.15);
            vec3 col = (v < 0.5) ? mix(cBlue, cWhite, v * 2.0) : mix(cWhite, cRed, (v - 0.5) * 2.0);
            // Evidenzia la linea nodale (dove v è vicino a 0.12) come la sabbia di Chladni dorata
            float nodalLine = exp(-pow((v - 0.12) / 0.035, 2.0));
            col = mix(col, vec3(0.98, 0.84, 0.35), nodalLine * 0.65);
            return col;
        }

        // Marezzatura 3D Acero Balcanico & Venatura Abete Val di Fiemme con Vernice ad Olio Cremonese
        vec3 proceduralCremoneseWood(vec3 rawP, vec3 N, vec3 V, float comp, float slot) {
            // Slot 5: Ebano (Tastiera, Piroli, Cordiera, Mentoniera)
            if (abs(slot - 5.0) < 0.4) {
                float pore = sin(rawP.y * 0.8 + rawP.x * 3.5) * 0.015;
                return vec3(0.08 + pore, 0.08 + pore, 0.095 + pore);
            }
            // Slot 6: Corde metalliche (A, D, G, C)
            if (abs(slot - 6.0) < 0.4) {
                return vec3(0.82, 0.83, 0.86);
            }
            // Slot 7: Tiracantini / Viti dorate
            if (abs(slot - 7.0) < 0.4) {
                return vec3(0.85, 0.68, 0.28);
            }
            // Slot 2: Ponticello in acero grezzo non verniciato
            if (abs(slot - 2.0) < 0.4) {
                float rays = 0.5 + 0.5 * sin(rawP.x * 1.8 + sin(rawP.y * 0.9));
                return mix(vec3(0.80, 0.64, 0.44), vec3(0.89, 0.75, 0.56), rays);
            }

            // Tavola Armonica (comp == 0): Abete Rosso di Paneveggio a venatura longitudinale fine + vernice dorata-ambrata
            if (comp < 0.5) {
                float grain = 0.5 + 0.5 * sin(rawP.x * 3.4 + sin(rawP.y * 0.04) * 1.2);
                float fine = 0.5 + 0.5 * sin(rawP.x * 11.0);
                vec3 spruceEarly = vec3(0.82, 0.46, 0.17);
                vec3 spruceLate  = vec3(0.62, 0.28, 0.09);
                vec3 base = mix(spruceEarly, spruceLate, grain * 0.65 + fine * 0.25);
                // Sfumatura antica cremonese (sunburst leggero verso il centro)
                return base;
            }

            // Fondo, Fasce e Manico/Riccio (comp == 1, 2, 3): Acero Marezzato Balcanico con chatoyance (cangianza ottica 3D)
            float wave = sin(rawP.y * 0.42 + sin(rawP.x * 0.12 + rawP.z * 0.15) * 2.2);
            float viewShift = dot(N, V) * 1.4;
            float chatoyance = 0.5 + 0.5 * sin(rawP.y * 0.42 + viewShift);
            float flame = mix(0.5 + 0.5 * wave, chatoyance, 0.55);
            vec3 mapleDark  = vec3(0.55, 0.22, 0.07);
            vec3 mapleLight = vec3(0.86, 0.48, 0.18);
            return mix(mapleDark, mapleLight, flame);
        }

        void main() {
            if (u_compFilter >= 0 && abs(v_comp - float(u_compFilter)) > 0.45) {
                discard;
            }

            vec3 N = normalize(v_normal);
            if (!gl_FrontFacing) N = -N;
            vec3 V = normalize(vec3(0.0, 0.0, 1.0) - v_worldPos * 0.25);

            if (u_wireframe == 1) {
                vec3 wfCol = (u_simMode > 0) ? coolwarm(v_scalar) : vec3(0.88, 0.72, 0.36);
                gl_FragColor = vec4(wfCol, 1.0);
                return;
            }

            // Illuminazione Studio a 3 punti per Liuteria
            vec3 L1 = normalize(vec3(0.48, 0.62, 0.75));   // Key light calda
            vec3 L2 = normalize(vec3(-0.65, 0.25, 0.55));  // Fill light morbida
            vec3 L3 = normalize(vec3(0.0, -0.75, -0.65));  // Rim / controluce

            float diff1 = max(dot(N, L1), 0.0);
            float diff2 = max(dot(N, L2), 0.0);
            float diff3 = max(dot(N, L3), 0.0);

            // Speculare vernice ad olio (doppio lobo: base satinata + clearcoat lucido)
            vec3 H1 = normalize(L1 + V);
            vec3 H2 = normalize(L2 + V);
            float specCoat = pow(max(dot(N, H1), 0.0), 72.0) * 0.62 + pow(max(dot(N, H2), 0.0), 36.0) * 0.22;
            float specBase = pow(max(dot(N, H1), 0.0), 16.0) * 0.18;
            float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.2) * 0.22;

            // Modalità Simulazione Chladni / Vibrazione / Heatmap Spessori
            if (u_simMode > 0) {
                vec3 heatCol = coolwarm(v_scalar);
                float lightTerm = 0.38 + diff1 * 0.52 + diff2 * 0.22;
                vec3 finalHeat = heatCol * lightTerm + vec3(specCoat * 0.35);
                gl_FragColor = vec4(finalHeat, 1.0);
                return;
            }

            // Modalità Fotorealistica Legno & Texture
            vec3 albedo = vec3(0.78, 0.52, 0.26);
            float ao = 1.0;
            float glossWeight = 1.0;

            if (u_instId == 0) {
                // VIOLINO: Scansione 3D museale MT_E_3270_Skrzypce con Texture Fotografica 2K + Mappa AO 2K
                if (u_useTexture == 1) {
                    vec3 texCol = texture2D(u_tex0, v_uv).rgb;
                    ao = mix(0.65, 1.0, texture2D(u_tex1, v_uv).r);
                    // Esalta il calore della vernice cremonese
                    albedo = pow(texCol, vec3(0.92)) * vec3(1.08, 1.01, 0.94);
                } else {
                    albedo = proceduralCremoneseWood(v_rawPos, N, V, v_comp, v_texSlot);
                }
            } else if (u_instId == 1) {
                // VIOLA: Scansione 3D v_Reduced.obj con Shader Maestro Liutaio Cremonese (Acero Marezzato + Abete + Ebano) o Texture Scanner
                if (u_useTexture == 1) {
                    albedo = texture2D(u_tex0, v_uv).rgb * vec3(1.06, 0.98, 0.90);
                } else {
                    albedo = proceduralCremoneseWood(v_rawPos, N, V, v_comp, v_texSlot);
                    if (abs(v_texSlot - 5.0) < 0.4 || abs(v_texSlot - 2.0) < 0.4) {
                        glossWeight = 0.28; // Ebano e ponticello sono satinati, non laccati a specchio
                    }
                }
            } else if (u_instId == 2) {
                // VIOLONCELLO: Modello multi-materiale sketchfab.obj con 5 texture dedicate + Ebano + Corde metalliche
                if (u_useTexture == 1) {
                    if (abs(v_texSlot - 0.0) < 0.4) {
                        vec3 bodyTex = texture2D(u_tex0, v_uv).rgb;
                        vec3 procFlame = proceduralCremoneseWood(v_rawPos * 0.55, N, V, v_comp, 0.0);
                        albedo = mix(bodyTex * vec3(1.25, 1.05, 0.88), procFlame, 0.35);
                    } else if (abs(v_texSlot - 1.0) < 0.4) {
                        vec3 neckTex = texture2D(u_tex1, v_uv).rgb;
                        vec3 procNeck = proceduralCremoneseWood(v_rawPos * 0.55, N, V, 3.0, 1.0);
                        albedo = mix(neckTex * vec3(1.15, 1.0, 0.88), procNeck, 0.35);
                    } else if (abs(v_texSlot - 2.0) < 0.4) {
                        albedo = texture2D(u_tex2, v_uv).rgb;
                        glossWeight = 0.2;
                    } else if (abs(v_texSlot - 3.0) < 0.4) {
                        albedo = texture2D(u_tex3, v_uv).rgb * 0.55;
                        glossWeight = 0.3;
                    } else if (abs(v_texSlot - 4.0) < 0.4) {
                        albedo = texture2D(u_tex4, v_uv).rgb * 0.65;
                        glossWeight = 0.35;
                    } else {
                        albedo = proceduralCremoneseWood(v_rawPos, N, V, v_comp, v_texSlot);
                        glossWeight = (abs(v_texSlot - 6.0) < 0.4 || abs(v_texSlot - 7.0) < 0.4) ? 1.35 : 0.3;
                    }
                } else {
                    albedo = proceduralCremoneseWood(v_rawPos * 0.55, N, V, v_comp, v_texSlot);
                }
            } else {
                albedo = proceduralCremoneseWood(v_rawPos, N, V, v_comp, v_texSlot);
            }

            vec3 ambient = vec3(0.28, 0.25, 0.22) * ao;
            vec3 diffuse = (diff1 * vec3(1.02, 0.97, 0.90) * 0.72 +
                            diff2 * vec3(0.75, 0.82, 0.95) * 0.32 +
                            diff3 * vec3(0.95, 0.75, 0.50) * 0.20) * ao;

            vec3 specular = (specCoat * vec3(1.0, 0.96, 0.88) + specBase * albedo + fresnel * vec3(0.90, 0.68, 0.38)) * glossWeight;
            vec3 color = albedo * (ambient + diffuse) + specular;

            // Tone mapping morbido per evitare saturazione sulle alte luci della vernice
            color = color / (color + vec3(0.18));
            gl_FragColor = vec4(color, 1.0);
        }
    `;

    const compileShader = (type, src) => {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src);
        gl.compileShader(sh);
        if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
            console.error("LM WebGL Shader Error:", gl.getShaderInfoLog(sh));
            return null;
        }
        return sh;
    };

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return null;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        console.error("LM WebGL Program Link Error:", gl.getProgramInfoLog(prog));
        return null;
    }

    window.lmWebGL.gl = gl;
    window.lmWebGL.canvas = canvas;
    window.lmWebGL.program = prog;
    window.lmWebGL.extUint = extUint;
    window.lmWebGL.whiteTex = null;
    window.lmWebGL.texturesCache = {};
    window.lmWebGL.loadingTextures = {};

    // Invalida eventuali GPU buffer legati a un contesto precedente
    Object.values(window.lmWebGL.modelsCache).forEach(mObj => {
        if (mObj) mObj.gpuBuffers = null;
    });
    if (window.lmState.importedCustomMesh) {
        window.lmState.importedCustomMesh.gpuBuffers = null;
    }

    return gl;
};

window.ensureLmModelGpuBuffers = function(gl, modelObj) {
    if (modelObj.gpuBuffers) return modelObj.gpuBuffers;

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, modelObj.pos, gl.STATIC_DRAW);

    const normBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuf);
    gl.bufferData(gl.ARRAY_BUFFER, modelObj.normMat, gl.STATIC_DRAW);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, modelObj.uv, gl.STATIC_DRAW);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, modelObj.idx, gl.STATIC_DRAW);

    modelObj.gpuBuffers = { posBuf, normBuf, uvBuf, idxBuf };
    return modelObj.gpuBuffers;
};

window.renderLm3dCanvas = function() {
    const canvas = document.getElementById("lm3dCanvas");
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const targetW = Math.max(300, Math.floor(rect.width * dpr));
    const targetH = Math.max(220, Math.floor(rect.height * dpr));
    if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
    }

    const gl = window.initLmWebGLContext(canvas);
    if (!gl) return;

    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    const m = (lmData.measurements && lmData.measurements[instType]) || defaultData.liuteriaMaking.measurements.violin;
    const defM = defaultData.liuteriaMaking.measurements[instType] || defaultData.liuteriaMaking.measurements.violin;

    // Determina il modello 3D attivo (importato dall'utente oppure scansione 3D di violino/viola/violoncello)
    let modelObj = window.lmState.importedCustomMesh;
    if (!modelObj) {
        modelObj = window.lmWebGL.modelsCache[instType];
        if (!modelObj) {
            window.loadLmBinaryModel(instType);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(0.08, 0.09, 0.12, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            return;
        }
    }

    const bufs = window.ensureLmModelGpuBuffers(gl, modelObj);
    const prog = window.lmWebGL.program;
    gl.useProgram(prog);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clearColor(0.075, 0.085, 0.115, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Scala parametrica in tempo reale rispetto alle quote di default dello strumento
    const scaleX = ((Number(m.lower_bout_width) || defM.lower_bout_width) / defM.lower_bout_width +
                    (Number(m.upper_bout_width) || defM.upper_bout_width) / defM.upper_bout_width) * 0.5;
    const scaleY = (Number(m.body_length) || defM.body_length) / defM.body_length;
    const scaleZ = (Number(m.rib_height) || defM.rib_height) / defM.rib_height;

    const simMap = { wood: 0, m1: 1, m2: 2, m5: 3, vib440: 4, thickness: 5 };
    const simModeInt = simMap[window.lmState.simMode] || 0;
    const instIdInt = window.lmState.importedCustomMesh ? 3 : (instType === "violin" ? 0 : (instType === "viola" ? 1 : 2));

    // Per Violino e Violoncello usiamo di default le texture fotografiche 2K; per la Viola usiamo di default lo shader Cremonese (come in viola.py) ma l'utente può attivare la texture scanner
    const useTexInt = window.lmWebGL.usePhotoTexture ? 1 : 0;

    // Bind Uniforms
    gl.uniform3f(gl.getUniformLocation(prog, "u_paramScale"), scaleX, scaleY, scaleZ);
    gl.uniform1f(gl.getUniformLocation(prog, "u_rotX"), window.lmState.rotX);
    gl.uniform1f(gl.getUniformLocation(prog, "u_rotY"), window.lmState.rotY);
    gl.uniform1f(gl.getUniformLocation(prog, "u_zoom"), window.lmState.zoom);
    gl.uniform1f(gl.getUniformLocation(prog, "u_aspect"), canvas.width / Math.max(canvas.height, 1));
    gl.uniform1f(gl.getUniformLocation(prog, "u_minY"), modelObj.minY);
    gl.uniform1f(gl.getUniformLocation(prog, "u_maxY"), modelObj.maxY);
    gl.uniform1f(gl.getUniformLocation(prog, "u_maxHalfW"), modelObj.maxHalfW);
    gl.uniform1i(gl.getUniformLocation(prog, "u_simMode"), simModeInt);
    gl.uniform1f(gl.getUniformLocation(prog, "u_phase"), window.lmState.animPhase);
    gl.uniform1f(gl.getUniformLocation(prog, "u_topCenterMm"), Number(m.top_center) || 2.8);
    gl.uniform1f(gl.getUniformLocation(prog, "u_topUpperMm"), Number(m.top_upper) || 2.5);
    gl.uniform1i(gl.getUniformLocation(prog, "u_instId"), instIdInt);
    gl.uniform1i(gl.getUniformLocation(prog, "u_compFilter"), window.lmState.activeComponentFilter);
    gl.uniform1i(gl.getUniformLocation(prog, "u_useTexture"), useTexInt);
    gl.uniform1i(gl.getUniformLocation(prog, "u_wireframe"), window.lmState.wireframe ? 1 : 0);

    // Bind Textures (Unit 0..4)
    const bindUnit = (unitIdx, uniformName, texUrl) => {
        const tex = window.getOrLoadLmWebGLTexture(gl, texUrl);
        gl.activeTexture(gl.TEXTURE0 + unitIdx);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(gl.getUniformLocation(prog, uniformName), unitIdx);
    };

    if (instType === "violin") {
        bindUnit(0, "u_tex0", "./assets/models/violin_basecolor.jpg");
        bindUnit(1, "u_tex1", "./assets/models/violin_ao.jpg");
        bindUnit(2, "u_tex2", null);
        bindUnit(3, "u_tex3", null);
        bindUnit(4, "u_tex4", null);
    } else if (instType === "viola") {
        bindUnit(0, "u_tex0", "./assets/models/viola_mat0.jpg");
        bindUnit(1, "u_tex1", "./assets/models/viola_mat1.jpg");
        bindUnit(2, "u_tex2", null);
        bindUnit(3, "u_tex3", null);
        bindUnit(4, "u_tex4", null);
    } else {
        bindUnit(0, "u_tex0", "./assets/models/cello_body.jpg");
        bindUnit(1, "u_tex1", "./assets/models/cello_neck.jpg");
        bindUnit(2, "u_tex2", "./assets/models/cello_bridge.jpg");
        bindUnit(3, "u_tex3", "./assets/models/cello_fingerboard.jpg");
        bindUnit(4, "u_tex4", "./assets/models/cello_tailpiece.jpg");
    }

    // Bind Attributes
    const locPos = gl.getAttribLocation(prog, "a_pos");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufs.posBuf);
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, 0, 0);

    const locNorm = gl.getAttribLocation(prog, "a_normMat");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufs.normBuf);
    gl.enableVertexAttribArray(locNorm);
    gl.vertexAttribPointer(locNorm, 4, gl.BYTE, false, 0, 0);

    const locUv = gl.getAttribLocation(prog, "a_uv");
    gl.bindBuffer(gl.ARRAY_BUFFER, bufs.uvBuf);
    gl.enableVertexAttribArray(locUv);
    gl.vertexAttribPointer(locUv, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufs.idxBuf);
    const drawMode = window.lmState.wireframe ? gl.LINES : gl.TRIANGLES;
    gl.drawElements(drawMode, modelObj.numT * 3, gl.UNSIGNED_INT, 0);

    // Disegna l'overlay 2D (Quote CAD 3D e Legenda Chladni) sopra il canvas WebGL
    window.renderLm3dOverlayCanvas(modelObj, m, scaleX, scaleY, scaleZ);
};

window.renderLm3dOverlayCanvas = function(modelObj, m, scaleX, scaleY, scaleZ) {
    const ov = document.getElementById("lm3dOverlayCanvas");
    if (!ov) return;
    const rect = ov.getBoundingClientRect();
    if (rect.width > 0 && (ov.width !== Math.floor(rect.width) || ov.height !== Math.floor(rect.height))) {
        ov.width = Math.floor(rect.width);
        ov.height = Math.floor(rect.height);
    }
    const W = ov.width;
    const H = ov.height;
    const ctx = ov.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    const spanY = Math.max(modelObj.maxY - modelObj.minY, 1.0);
    const normScale = (2.15 / spanY) * window.lmState.zoom;
    const aspect = W / Math.max(H, 1);
    const cy = Math.cos(window.lmState.rotY), sy = Math.sin(window.lmState.rotY);
    const cx = Math.cos(window.lmState.rotX), sx = Math.sin(window.lmState.rotX);

    const projectOverlayPt = (rx, ry, rz) => {
        const px = rx * scaleX, py = ry * scaleY, pz = rz * scaleZ;
        const x1 = px * cy + pz * sy;
        const y1 = py;
        const z1 = -px * sy + pz * cy;
        const x2 = x1;
        const y2 = y1 * cx - z1 * sx;
        const z2 = y1 * sx + z1 * cx;

        const vx = x2 * normScale;
        const vy = y2 * normScale;
        const vz = z2 * normScale;
        const camDist = 3.4;
        const wClip = Math.max((camDist - vz) / camDist, 0.1);
        const ndcX = ((vx * 2.45) / aspect) / wClip;
        const ndcY = (vy * 2.45) / wClip;
        return {
            sx: (ndcX * 0.5 + 0.5) * W,
            sy: (0.5 - ndcY * 0.5) * H
        };
    };

    // Sovrapposizione Quote CAD 3D (da visualization/dimension_overlay.py)
    if (window.lmState.showDimensions && !window.lmState.importedCustomMesh) {
        const minY = modelObj.minY;
        const bodyTopY = minY + spanY * 0.61;
        const scrollTopY = modelObj.maxY;
        const lbY = minY + spanY * 0.16;
        const waistY = minY + spanY * 0.34;
        const ubY = minY + spanY * 0.48;
        const hw = modelObj.maxHalfW;

        const drawCadDim = (pA, pB, label, color) => {
            const sA = projectOverlayPt(pA[0], pA[1], pA[2]);
            const sB = projectOverlayPt(pB[0], pB[1], pB[2]);
            ctx.save();
            ctx.strokeStyle = color;
            ctx.lineWidth = 1.6;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(sA.sx, sA.sy);
            ctx.lineTo(sB.sx, sB.sy);
            ctx.stroke();
            ctx.setLineDash([]);

            [sA, sB].forEach(pt => {
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(pt.sx, pt.sy, 3.2, 0, Math.PI * 2);
                ctx.fill();
            });

            const mx = (sA.sx + sB.sx) * 0.5;
            const my = (sA.sy + sB.sy) * 0.5;
            ctx.font = "600 11px Inter, sans-serif";
            const tw = ctx.measureText(label).width;
            ctx.fillStyle = "rgba(15, 17, 23, 0.88)";
            ctx.fillRect(mx - tw * 0.5 - 6, my - 9, tw + 12, 18);
            ctx.strokeStyle = color;
            ctx.lineWidth = 1;
            ctx.strokeRect(mx - tw * 0.5 - 6, my - 9, tw + 12, 18);
            ctx.fillStyle = color;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(label, mx, my);
            ctx.restore();
        };

        drawCadDim([-hw * 1.25, minY, 0], [-hw * 1.25, bodyTopY, 0], `Cassa: ${m.body_length} mm`, "#c8a96e");
        drawCadDim([-hw * 0.82, ubY, hw * 0.25], [hw * 0.82, ubY, hw * 0.25], `Polm. Sup: ${m.upper_bout_width} mm`, "#60b0e0");
        drawCadDim([-hw * 0.56, waistY, hw * 0.28], [hw * 0.56, waistY, hw * 0.28], `Vita: ${m.waist_width} mm`, "#b080d0");
        drawCadDim([-hw, lbY, hw * 0.25], [hw, lbY, hw * 0.25], `Polm. Inf: ${m.lower_bout_width} mm`, "#e07070");
        drawCadDim([hw * 1.22, bodyTopY, 0], [hw * 1.22, scrollTopY, 0], `Manico: ${m.neck_length} mm`, "#d0a060");
        drawCadDim([hw * 0.68, waistY, -hw * 0.16], [hw * 0.68, waistY, hw * 0.16], `Fasce: ${m.rib_height} mm`, "#e8a040");
    }

    // Barra Colori Heatmap Chladni / Spessori
    const simMode = window.lmState.simMode;
    if (simMode !== "wood") {
        const barW = 160, barH = 12;
        const bx = W - barW - 18, by = H - 34;
        const grad = ctx.createLinearGradient(bx, by, bx + barW, by);
        grad.addColorStop(0, "rgb(59,76,192)");
        grad.addColorStop(0.12, "rgb(250,214,89)");
        grad.addColorStop(0.5, "rgb(240,240,245)");
        grad.addColorStop(1, "rgb(199,31,38)");
        ctx.fillStyle = "rgba(15,17,23,0.86)";
        ctx.fillRect(bx - 8, by - 20, barW + 16, 44);
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, barW, barH);
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.strokeRect(bx, by, barW, barH);
        ctx.fillStyle = "#e5e7eb";
        ctx.font = "600 10px Inter, sans-serif";
        ctx.textAlign = "left";
        ctx.fillText(simMode === "thickness" ? "Sottile (2mm)" : "0.0 (Nodo)", bx, by - 5);
        ctx.textAlign = "right";
        ctx.fillText(simMode === "thickness" ? "Spesso (5mm)" : "1.0 (Ventre)", bx + barW, by - 5);
    }
};

window.startLm3dAnimationLoop = function() {
    if (window.lmState.animReqId) {
        cancelAnimationFrame(window.lmState.animReqId);
        window.lmState.animReqId = null;
    }
    const tick = () => {
        const canvas = document.getElementById("lm3dCanvas");
        if (!canvas) return;
        let needsRedraw = false;
        if (window.lmState.autoRotate && !window.lmState.isDragging) {
            window.lmState.rotY += 0.012;
            needsRedraw = true;
        }
        if (window.lmState.simMode !== "wood") {
            window.lmState.animPhase += 0.14;
            needsRedraw = true;
        }
        if (needsRedraw) {
            window.renderLm3dCanvas();
        }
        window.lmState.animReqId = requestAnimationFrame(tick);
    };
    window.lmState.animReqId = requestAnimationFrame(tick);
};

window.setupLm3dCanvasInteractions = function() {
    const canvas = document.getElementById("lm3dCanvas");
    if (!canvas) return;

    canvas.onmousedown = (e) => {
        window.lmState.isDragging = true;
        window.lmState.lastMouseX = e.clientX;
        window.lmState.lastMouseY = e.clientY;
    };
    window.onmousemove = (e) => {
        if (!window.lmState.isDragging) return;
        const dx = e.clientX - window.lmState.lastMouseX;
        const dy = e.clientY - window.lmState.lastMouseY;
        window.lmState.lastMouseX = e.clientX;
        window.lmState.lastMouseY = e.clientY;
        window.lmState.rotY += dx * 0.01;
        window.lmState.rotX = Math.max(-1.48, Math.min(1.48, window.lmState.rotX + dy * 0.01));
        window.renderLm3dCanvas();
    };
    window.onmouseup = () => {
        window.lmState.isDragging = false;
    };
    canvas.onwheel = (e) => {
        e.preventDefault();
        const factor = e.deltaY < 0 ? 1.1 : 0.9;
        window.lmState.zoom = Math.max(0.45, Math.min(2.8, window.lmState.zoom * factor));
        window.renderLm3dCanvas();
    };
};

window.toggleLmTextureFinish = function() {
    window.lmWebGL.usePhotoTexture = !window.lmWebGL.usePhotoTexture;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

// Importazione file 3D .OBJ esterno direttamente nei buffer WebGL
window.triggerLiuteriaMakingMeshImport = function() {
    const inp = document.getElementById("lmHiddenMeshInput");
    if (inp) inp.click();
};

window.handleLmMeshFileSelected = function(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const text = String(ev.target.result || "");
        const rawV = [];
        const rawVt = [];
        const rawVn = [];
        const tris = [];

        const lines = text.split(/\r?\n/);
        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (line.startsWith("v ")) {
                const p = line.split(/\s+/);
                rawV.push([parseFloat(p[1]) || 0, parseFloat(p[2]) || 0, parseFloat(p[3]) || 0]);
            } else if (line.startsWith("vt ")) {
                const p = line.split(/\s+/);
                rawVt.push([parseFloat(p[1]) || 0, 1.0 - (parseFloat(p[2]) || 0)]);
            } else if (line.startsWith("vn ")) {
                const p = line.split(/\s+/);
                rawVn.push([parseFloat(p[1]) || 0, parseFloat(p[2]) || 0, parseFloat(p[3]) || 1]);
            } else if (line.startsWith("f ")) {
                const parts = line.split(/\s+/).slice(1);
                const c = parts.map(tok => {
                    const sp = tok.split("/");
                    return [(parseInt(sp[0], 10) || 1) - 1, (parseInt(sp[1], 10) || 1) - 1, (parseInt(sp[2], 10) || 1) - 1];
                });
                for (let k = 1; k < c.length - 1; k++) {
                    tris.push([c[0], c[k], c[k + 1]]);
                }
            }
        }
        if (rawV.length === 0 || tris.length === 0) {
            window.showToast("Formato mesh non riconosciuto. Seleziona un file .OBJ valido.", "error");
            return;
        }

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
        for (const v of rawV) {
            if (v[0] < minX) minX = v[0]; if (v[0] > maxX) maxX = v[0];
            if (v[1] < minY) minY = v[1]; if (v[1] > maxY) maxY = v[1];
            if (v[2] < minZ) minZ = v[2]; if (v[2] > maxZ) maxZ = v[2];
        }
        const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, cz = (minZ + maxZ) / 2;
        const span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-6);
        const scale = 580.0 / span;

        const numV = rawV.length;
        const numT = tris.length;
        const pos = new Float32Array(numV * 3);
        const normMat = new Int8Array(numV * 4);
        const uv = new Float32Array(numV * 2);
        const idx = new Uint32Array(numT * 3);

        for (let i = 0; i < numV; i++) {
            pos[i * 3 + 0] = (rawV[i][0] - cx) * scale;
            pos[i * 3 + 1] = (rawV[i][1] - cy) * scale;
            pos[i * 3 + 2] = (rawV[i][2] - cz) * scale;
            const n = rawVn[i] || [0, 0, 1];
            normMat[i * 4 + 0] = Math.round(n[0] * 127);
            normMat[i * 4 + 1] = Math.round(n[1] * 127);
            normMat[i * 4 + 2] = Math.round(n[2] * 127);
            normMat[i * 4 + 3] = 0;
            const t = rawVt[i] || [0.5, 0.5];
            uv[i * 2 + 0] = t[0];
            uv[i * 2 + 1] = t[1];
        }
        for (let t = 0; t < numT; t++) {
            idx[t * 3 + 0] = tris[t][0][0];
            idx[t * 3 + 1] = tris[t][1][0];
            idx[t * 3 + 2] = tris[t][2][0];
        }

        window.lmState.importedCustomMesh = {
            instType: "custom",
            numV,
            numT,
            minY: (minY - cy) * scale,
            maxY: (maxY - cy) * scale,
            maxHalfW: Math.max((maxX - minX) * scale * 0.5, 50),
            pos,
            normMat,
            uv,
            idx,
            gpuBuffers: null
        };
        window.lmState.importedMeshName = file.name;
        window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
        window.showToast(`Modello 3D "${file.name}" caricato in WebGL (${numV.toLocaleString()} vertici, ${numT.toLocaleString()} triangoli)!`);
    };
    reader.readAsText(file);
};

// =========================================================================
// ANALIZZATORE ACUSTICO FFT REAL-TIME (Microfono + Sintetizzatore Tap-Tone)
// =========================================================================

window.renderLmFftCanvas = function(freqArray, dbArray, peakList, fundamentalHz) {
    const canvas = document.getElementById("lmFftCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && (canvas.width !== Math.floor(rect.width) || canvas.height !== Math.floor(rect.height))) {
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);
    }
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    const padL = 46, padR = 16, padT = 18, padB = 28;
    const plotW = W - padL - padR;
    const plotH = H - padT - padB;

    ctx.fillStyle = "#161922";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#1f2430";
    ctx.fillRect(padL, padT, plotW, plotH);

    const maxFreq = 2000; // focus 0..2000 Hz dove risiedono M1, M2, M5, B1-, B1+ e armoniche
    const minDb = -85, maxDb = 0;

    const xOfFreq = (f) => padL + Math.min(1, Math.max(0, f / maxFreq)) * plotW;
    const yOfDb = (db) => padT + (1 - (Math.min(maxDb, Math.max(minDb, db)) - minDb) / (maxDb - minDb)) * plotH;

    // Griglia Hz e dB
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    ctx.font = "10px Inter, sans-serif";
    ctx.fillStyle = "#9ca3af";
    for (let f = 0; f <= maxFreq; f += 250) {
        const x = xOfFreq(f);
        ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillText(`${f}Hz`, x, H - 8);
    }
    for (let db = -80; db <= 0; db += 20) {
        const y = yOfDb(db);
        ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + plotW, y); ctx.stroke();
        ctx.textAlign = "right";
        ctx.fillText(`${db}dB`, padL - 6, y + 3);
    }

    // 1. Marcatori di Confronto Storico (M1, M2, M5, B1-, B1+) come in audio_panel.py
    const lmData = window.getLiuteriaMakingData();
    const hist = (lmData.historicalInstruments || []).find(h => h.id === window.lmState.selectedHistoricalId);
    if (hist) {
        const markers = [
            { f: hist.m1_freq, label: `M1 (${hist.m1_freq}Hz)`, color: "#f59e0b" },
            { f: hist.m2_freq, label: `M2 (${hist.m2_freq}Hz)`, color: "#ec4899" },
            { f: hist.m5_freq, label: `M5 (${hist.m5_freq}Hz)`, color: "#a855f7" },
            { f: hist.b1_minus_freq, label: `B1- (${hist.b1_minus_freq}Hz)`, color: "#3b82f6" },
            { f: hist.b1_plus_freq, label: `B1+ (${hist.b1_plus_freq}Hz)`, color: "#22c55e" }
        ];
        markers.forEach((mk, idx) => {
            if (!mk.f) return;
            const x = xOfFreq(mk.f);
            ctx.save();
            ctx.strokeStyle = mk.color;
            ctx.lineWidth = 1.4;
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(x, padT);
            ctx.lineTo(x, padT + plotH);
            ctx.stroke();
            ctx.fillStyle = mk.color;
            ctx.font = "600 9.5px Inter, sans-serif";
            ctx.textAlign = "left";
            ctx.fillText(mk.label, x + 4, padT + 14 + (idx % 3) * 13);
            ctx.restore();
        });
    }

    // 2. Tracciato Spettro FFT
    if (freqArray && dbArray && freqArray.length > 0) {
        ctx.save();
        ctx.beginPath();
        let started = false;
        for (let i = 0; i < freqArray.length; i++) {
            const f = freqArray[i];
            if (f > maxFreq) break;
            const x = xOfFreq(f);
            const y = yOfDb(dbArray[i]);
            if (!started) {
                ctx.moveTo(x, y);
                started = true;
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.strokeStyle = "#c8a96e";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Area sottesa dorata
        ctx.lineTo(xOfFreq(Math.min(maxFreq, freqArray[freqArray.length - 1] || maxFreq)), padT + plotH);
        ctx.lineTo(padL, padT + plotH);
        ctx.closePath();
        const fillG = ctx.createLinearGradient(0, padT, 0, padT + plotH);
        fillG.addColorStop(0, "rgba(200, 169, 110, 0.32)");
        fillG.addColorStop(1, "rgba(200, 169, 110, 0.02)");
        ctx.fillStyle = fillG;
        ctx.fill();
        ctx.restore();
    }

    // 3. Evidenzia Picchi (cerchi rossi #e05040 come in audio_panel.py)
    if (Array.isArray(peakList)) {
        peakList.slice(0, 8).forEach(pk => {
            if (pk.freq <= maxFreq) {
                const x = xOfFreq(pk.freq);
                const y = yOfDb(pk.db);
                ctx.fillStyle = "#e05040";
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fca5a5";
                ctx.font = "600 9.5px Inter, sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${Math.round(pk.freq)}Hz`, x, Math.max(padT + 10, y - 7));
            }
        });
    }

    const infoEl = document.getElementById("lmFftStatusLabel");
    if (infoEl && fundamentalHz) {
        infoEl.innerHTML = `🔴 <strong>Fondamentale rilevata:</strong> <span style="color:var(--accent-gold);">${fundamentalHz.toFixed(1)} Hz (${window.freqToMusicalNote(fundamentalHz)})</span> • Picchi principali: ${(peakList || []).slice(0, 5).map(p => Math.round(p.freq) + "Hz").join(", ")}`;
    }
};

// Avvia acquisizione da microfono reale tramite Web Audio API
window.startLmMicrophoneCapture = async function() {
    window.stopLmAudioCapture();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContextClass();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = Number(document.getElementById("lmFftSizeSelect")?.value || 4096);
        analyser.smoothingTimeConstant = 0.75;
        source.connect(analyser);

        window.lmState.audioCtx = audioCtx;
        window.lmState.analyser = analyser;
        window.lmState.micStream = stream;
        window.lmState.isCapturing = true;
        window.lmState.isSynthetic = false;

        window.loopLmRealtimeFft();
        window.showToast("Acquisizione microfono FFT avviata in tempo reale!");
    } catch (err) {
        // Se non c'è microfono o permesso negato, avvia la simulazione acustica Tap-Tone
        window.showToast("Microfono non rilevato: avvio generatore Tap-Tone acustico integrato!", "info");
        window.startLmSyntheticTapTone();
    }
};

// Simulatore Tap-Tone / Spettro Acustico basato sulle misure e sui legni correnti dello strumento
window.startLmSyntheticTapTone = function() {
    window.stopLmAudioCapture();
    window.lmState.isCapturing = true;
    window.lmState.isSynthetic = true;
    window.lmState.simMode = "m5";
    window.loopLmRealtimeFft();
    window.showToast("Simulazione spettro Tap-Tone + risonanza 3D attivata!");
};

window.stopLmAudioCapture = function() {
    window.lmState.isCapturing = false;
    window.lmState.isSynthetic = false;
    if (window.lmState.micStream) {
        window.lmState.micStream.getTracks().forEach(t => t.stop());
        window.lmState.micStream = null;
    }
    if (window.lmState.audioCtx) {
        window.lmState.audioCtx.close().catch(() => {});
        window.lmState.audioCtx = null;
    }
};

window.calibrateLmNoiseFloor = function() {
    if (!window.lmState.isCapturing) {
        window.startLmSyntheticTapTone();
    }
    window.lmState.isCalibrating = true;
    window.lmState.calibrationFrames = [];
    const infoEl = document.getElementById("lmFftStatusLabel");
    if (infoEl) infoEl.innerHTML = "⏱ <strong>Calibrazione rumore ambientale in corso (20 frame)...</strong>";
};

window.loopLmRealtimeFft = function() {
    if (!window.lmState.isCapturing) return;
    const canvas = document.getElementById("lmFftCanvas");
    if (!canvas) {
        window.stopLmAudioCapture();
        return;
    }

    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    const m = (lmData.measurements && lmData.measurements[instType]) || defaultData.liuteriaMaking.measurements.violin;
    const topW = (lmData.woods || []).find(w => w.name === lmData.selectedTopWood);
    const backW = (lmData.woods || []).find(w => w.name === lmData.selectedBackWood);
    const est = window.calculateLmAcousticEstimates(instType, m, topW, backW);

    const nBins = 512;
    const freqs = new Array(nBins);
    const mags = new Array(nBins);

    if (window.lmState.analyser && !window.lmState.isSynthetic) {
        const bufLen = window.lmState.analyser.frequencyBinCount;
        const dataArr = new Float32Array(bufLen);
        window.lmState.analyser.getFloatFrequencyData(dataArr);
        const sr = window.lmState.audioCtx ? window.lmState.audioCtx.sampleRate : 44100;
        const step = Math.max(1, Math.floor((2000 / (sr / 2)) * bufLen / nBins));
        for (let i = 0; i < nBins; i++) {
            const idx = Math.min(bufLen - 1, i * step);
            freqs[i] = (idx * sr) / (2 * bufLen);
            let db = dataArr[idx];
            if (window.lmState.noiseProfile && window.lmState.noiseProfile[i] !== undefined) {
                if (db < window.lmState.noiseProfile[i] + 5) db = -82;
            }
            mags[i] = Math.max(-85, Math.min(0, db));
        }
    } else {
        // Spettro sintetico realistico calcolato sulle risonanze fisiche M1, M2, M5, A0, B1-, B1+ dello strumento
        const resonances = [
            { f: est.m1, amp: 28, w: 14 },
            { f: est.m2, amp: 38, w: 16 },
            { f: est.a0, amp: 44, w: 18 },
            { f: est.m5, amp: 64, w: 18 },
            { f: est.m5 * 1.26, amp: 48, w: 22 },
            { f: est.m5 * 1.58, amp: 45, w: 25 },
            { f: est.m5 * 2.0, amp: 32, w: 30 },
            { f: est.m5 * 3.0, amp: 24, w: 40 }
        ];
        for (let i = 0; i < nBins; i++) {
            const f = (i / nBins) * 2000;
            freqs[i] = f;
            let val = -76 + (Math.random() - 0.5) * 3.2;
            for (const r of resonances) {
                const dist = (f - r.f) / r.w;
                val += r.amp * Math.exp(-0.5 * dist * dist);
            }
            if (window.lmState.noiseProfile) val -= 3;
            mags[i] = Math.max(-84, Math.min(-2, val));
        }
    }

    if (window.lmState.isCalibrating) {
        window.lmState.calibrationFrames.push([...mags]);
        if (window.lmState.calibrationFrames.length >= 18) {
            window.lmState.isCalibrating = false;
            window.lmState.noiseProfile = mags.map((_, idx) => {
                return window.lmState.calibrationFrames.reduce((acc, fr) => acc + fr[idx], 0) / window.lmState.calibrationFrames.length;
            });
            window.showToast("Calibrazione rumore ambientale completata!");
        }
    }

    // Trova i picchi principali
    const peaks = [];
    for (let i = 3; i < nBins - 3; i++) {
        if (mags[i] > -58 && mags[i] > mags[i - 1] && mags[i] > mags[i + 1] && mags[i] > mags[i - 2] && mags[i] > mags[i + 2]) {
            peaks.push({ freq: freqs[i], db: mags[i] });
        }
    }
    peaks.sort((a, b) => b.db - a.db);
    const topPeaks = [];
    for (const p of peaks) {
        if (!topPeaks.some(tp => Math.abs(tp.freq - p.freq) < 35)) {
            topPeaks.push(p);
        }
        if (topPeaks.length >= 6) break;
    }

    const fundamental = topPeaks.length > 0 ? topPeaks[0].freq : est.m5;
    window.lmState.latestFft = {
        frequencies: freqs,
        magnitudes: mags,
        peaks: topPeaks,
        fundamental
    };

    window.renderLmFftCanvas(freqs, mags, topPeaks, fundamental);

    setTimeout(() => {
        if (window.lmState.isCapturing) {
            requestAnimationFrame(window.loopLmRealtimeFft);
        }
    }, 65);
};

window.saveCurrentLmFftSpectrum = function() {
    const lmData = window.getLiuteriaMakingData();
    if (!window.lmState.latestFft) {
        window.startLmSyntheticTapTone();
    }
    const fft = window.lmState.latestFft;
    if (!fft) return;

    const label = prompt("Etichetta lettura FFT (es. Tap-Tone Tavola Libera M5 oppure Pre-restauro cassa chiusa):", `Tap-Tone ${lmData.selectedTopWood} (${Math.round(fft.fundamental)} Hz)`);
    if (!label) return;

    const archList = lmData.archivedInstruments || [];
    let targetInst = archList.find(a => a.id === window.lmState.selectedArchiveId) || archList[0];
    if (!targetInst) {
        targetInst = {
            id: "lm-inst-" + Date.now(),
            name: "Nuovo Strumento Atelier",
            instrument_type: lmData.activeInstrumentType || "violin",
            production_date: new Date().toLocaleDateString("it-IT"),
            owner_name: "Liuteria De Lorenzi",
            notes: "Creato durante analisi spettrale FFT",
            measurements: JSON.parse(JSON.stringify(lmData.measurements[lmData.activeInstrumentType || "violin"])),
            restorations: [],
            savedSpectrums: []
        };
        archList.unshift(targetInst);
        window.lmState.selectedArchiveId = targetInst.id;
    }
    if (!Array.isArray(targetInst.savedSpectrums)) targetInst.savedSpectrums = [];
    targetInst.savedSpectrums.unshift({
        id: "spec-" + Date.now(),
        label: label.trim(),
        created_at: new Date().toLocaleString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        fundamental: Math.round(fft.fundamental * 10) / 10,
        peaks: (fft.peaks || []).map(p => Math.round(p.freq * 10) / 10)
    });

    window.atelierDB.saveData();
    window.showToast(`Spettro "${label}" salvato su ${targetInst.name}!`);
    if (window.appController && window.appController.activeModuleId === "liuteriaMaking") {
        window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
    }
};

// =========================================================================
// RENDER PRINCIPALE WORKSPACE LIUTERIA MAKING NEL GESTIONALE
// =========================================================================

window.renderLiuteriaMakingWorkspace = function(container) {
    if (!container) return;
    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    const schema = window.LM_MEASUREMENT_SCHEMA[instType] || window.LM_MEASUREMENT_SCHEMA.violin;
    const m = (lmData.measurements && lmData.measurements[instType]) || defaultData.liuteriaMaking.measurements.violin;
    const woods = lmData.woods || [];
    const topWood = woods.find(w => w.name === lmData.selectedTopWood) || woods[1] || woods[0];
    const backWood = woods.find(w => w.name === lmData.selectedBackWood) || woods[3] || woods[2];
    const est = window.calculateLmAcousticEstimates(instType, m, topWood, backWood);

    // Raggruppa i 22 campi per categoria (Fasce, Tavola, Fondo, Dimensioni, Effe, Filetto, Manico, Punte)
    const groups = {};
    for (const f of schema.fields) {
        if (!groups[f.group]) groups[f.group] = [];
        groups[f.group].push(f);
    }

    const groupColors = {
        Dimensioni: "#c8a96e",
        Tavola: "#60b0e0",
        Fondo: "#e07070",
        Fasce: "#e8a040",
        Effe: "#b080d0",
        Filetto: "#70c0a0",
        Manico: "#d0a060",
        Punte: "#c0c060"
    };

    const activeArch = (lmData.archivedInstruments || []).find(a => a.id === window.lmState.selectedArchiveId) || (lmData.archivedInstruments || [])[0];
    const savedSpecs = (activeArch && Array.isArray(activeArch.savedSpectrums)) ? activeArch.savedSpectrums : [];

    const filteredWoods = woods.filter(w => !window.lmState.woodSearch || w.name.toLowerCase().includes(window.lmState.woodSearch.toLowerCase()) || (w.notes || "").toLowerCase().includes(window.lmState.woodSearch.toLowerCase()));

    container.innerHTML = `
        <div class="glass-panel" style="padding:1.25rem;">
            <!-- Input nascosto per importazione file 3D .OBJ / .STL -->
            <input type="file" id="lmHiddenMeshInput" accept=".obj,.stl,.ply" style="display:none;" onchange="window.handleLmMeshFileSelected(event)">

            <!-- Top Toolbar: Selettore Strumento + Azioni Menu di Liuteria Making -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.85rem; padding-bottom:1rem; margin-bottom:1.1rem; border-bottom:1px solid rgba(255,255,255,0.08);">
                <div style="display:flex; align-items:center; gap:0.55rem; flex-wrap:wrap;">
                    <span style="font-size:0.78rem; text-transform:uppercase; letter-spacing:1px; color:var(--text-muted); font-weight:700; margin-right:0.25rem;">Modello Parametrico:</span>
                    ${["violin", "viola", "cello"].map(typeKey => {
                        const s = window.LM_MEASUREMENT_SCHEMA[typeKey];
                        const isAct = instType === typeKey;
                        return `
                            <button type="button" class="btn ${isAct ? 'btn-primary' : 'btn-secondary'}" style="padding:0.42rem 0.9rem; font-size:0.82rem; ${isAct ? 'box-shadow:0 0 14px rgba(212,175,55,0.35);' : ''}" onclick="window.switchLmInstrumentType('${typeKey}')">
                                ${s.icon} ${s.name}
                            </button>
                        `;
                    }).join("")}
                </div>

                <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
                    <button type="button" class="btn btn-secondary" style="font-size:0.78rem; padding:0.4rem 0.8rem;" onclick="window.triggerLiuteriaMakingMeshImport()" title="Importa un file mesh 3D esterno (.OBJ)">
                        <i data-lucide="box" style="width:14px; height:14px; color:var(--accent-cyan);"></i> Importa Mesh 3D (.OBJ)
                    </button>
                    <button type="button" class="btn btn-secondary" style="font-size:0.78rem; padding:0.4rem 0.8rem;" onclick="window.openLiuteriaMakingArchiveModal()" title="Apri l'Archivio Strumenti, Diario Restauri ed Esportazione Scheda PDF">
                        <i data-lucide="archive" style="width:14px; height:14px; color:var(--accent-gold);"></i> 🗄 Archivio Strumenti (${(lmData.archivedInstruments || []).length})
                    </button>
                    <button type="button" class="btn btn-secondary" style="font-size:0.78rem; padding:0.4rem 0.8rem;" onclick="window.openBibliotecaReaderModal('bib-5')" title="Apri il manuale PDF sui Pattern di Chladni integrato da Liuteria Making">
                        <i data-lucide="book-open" style="width:14px; height:14px; color:#a855f7;"></i> 📘 Guida Chladni (PDF)
                    </button>
                    <button type="button" class="btn btn-primary" style="font-size:0.78rem; padding:0.4rem 0.85rem;" onclick="window.saveLmToGestionaleCostruzione()" title="Salva questo progetto con misure e frequenze nel modulo Costruzione del Gestionale">
                        <i data-lucide="hammer" style="width:14px; height:14px;"></i> Invia a Costruzione
                    </button>
                </div>
            </div>

            <!-- KPI Acustici e Volumetrici in Tempo Reale -->
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(195px, 1fr)); gap:0.85rem; margin-bottom:1.25rem;">
                <div style="background:rgba(212,175,55,0.08); border:1px solid rgba(212,175,55,0.28); border-radius:10px; padding:0.8rem 1rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Volume Aria Cassa Armonica</div>
                    <div style="font-size:1.35rem; font-weight:800; color:var(--accent-gold); margin-top:0.15rem;" id="lmKpiVol">${est.volumeCm3} cm³</div>
                    <div style="font-size:0.73rem; color:var(--text-secondary);">Risonanza Cavità A0 ≈ <strong id="lmKpiA0">${est.a0} Hz</strong></div>
                </div>
                <div style="background:rgba(168,85,247,0.08); border:1px solid rgba(168,85,247,0.28); border-radius:10px; padding:0.8rem 1rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Modi Chladni Stimati (Tavola)</div>
                    <div style="font-size:1.15rem; font-weight:800; color:#c084fc; margin-top:0.2rem;" id="lmKpiModes">
                        M1: ${est.m1}Hz • M2: ${est.m2}Hz • M5: ${est.m5}Hz
                    </div>
                    <div style="font-size:0.73rem; color:var(--text-secondary);">Nota Tap-Tone M5: <strong style="color:#fff;" id="lmKpiNote">${est.noteM5}</strong></div>
                </div>
                <div style="background:rgba(56,189,248,0.08); border:1px solid rgba(56,189,248,0.28); border-radius:10px; padding:0.8rem 1rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Legno Tavola Selezionato</div>
                    <div style="font-size:0.95rem; font-weight:700; color:#38bdf8; margin-top:0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${topWood ? topWood.name : "-"}</div>
                    <div style="font-size:0.73rem; color:var(--text-secondary);">
                        ρ: ${topWood ? topWood.density_kg_m3 : 420} kg/m³ • c: ${topWood ? topWood.sound_velocity : 5600} m/s • Peso ≈ <strong id="lmKpiTopW">${est.topWeightG} g</strong>
                    </div>
                </div>
                <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.28); border-radius:10px; padding:0.8rem 1rem;">
                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Legno Fondo & Fasce</div>
                    <div style="font-size:0.95rem; font-weight:700; color:#34d399; margin-top:0.2rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${backWood ? backWood.name : "-"}</div>
                    <div style="font-size:0.73rem; color:var(--text-secondary);">
                        ρ: ${backWood ? backWood.density_kg_m3 : 680} kg/m³ • c: ${backWood ? backWood.sound_velocity : 3900} m/s • Peso ≈ <strong id="lmKpiBackW">${est.backWeightG} g</strong>
                    </div>
                </div>
            </div>

            <!-- Layout Principale a 2 Colonne (come MainWindow QSplitter in LiuteriaMaking) -->
            <div style="display:grid; grid-template-columns:minmax(340px, 410px) 1fr; gap:1.2rem; align-items:start;">

                <!-- COLONNA SINISTRA: Schede "📏 Misure (22 Quote)" | "🪵 Legni (20 Essenze)" -->
                <div style="background:rgba(0,0,0,0.28); border:1px solid rgba(255,255,255,0.08); border-radius:12px; overflow:hidden;">
                    <div style="display:flex; border-bottom:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02);">
                        <button type="button" onclick="window.switchLmLeftTab('measurements')" style="flex:1; padding:0.75rem; border:none; background:${window.lmState.leftTab === 'measurements' ? 'rgba(212,175,55,0.16)' : 'transparent'}; color:${window.lmState.leftTab === 'measurements' ? 'var(--accent-gold)' : 'var(--text-secondary)'}; font-weight:700; font-size:0.84rem; cursor:pointer; border-bottom:2px solid ${window.lmState.leftTab === 'measurements' ? 'var(--accent-gold)' : 'transparent'};">
                            📏 Misure Parametriche (22)
                        </button>
                        <button type="button" onclick="window.switchLmLeftTab('woods')" style="flex:1; padding:0.75rem; border:none; background:${window.lmState.leftTab === 'woods' ? 'rgba(212,175,55,0.16)' : 'transparent'}; color:${window.lmState.leftTab === 'woods' ? 'var(--accent-gold)' : 'var(--text-secondary)'}; font-weight:700; font-size:0.84rem; cursor:pointer; border-bottom:2px solid ${window.lmState.leftTab === 'woods' ? 'var(--accent-gold)' : 'transparent'};">
                            🪵 Database Legni (${woods.length})
                        </button>
                    </div>

                    ${window.lmState.leftTab === "measurements" ? `
                        <div style="padding:0.9rem; max-height:690px; overflow-y:auto;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                                <span style="font-size:0.76rem; color:var(--text-secondary);">Modifica le quote per aggiornare Mesh 3D, Volume e Chladni:</span>
                                <button type="button" class="btn btn-secondary" style="font-size:0.72rem; padding:0.25rem 0.55rem;" onclick="window.resetLmMeasurementsToDefault()">
                                    ↺ Reset Default
                                </button>
                            </div>

                            ${Object.keys(groups).map(gName => `
                                <div style="margin-bottom:0.85rem; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); border-left:3px solid ${groupColors[gName] || '#c8a96e'}; border-radius:8px; padding:0.65rem 0.75rem;">
                                    <div style="font-size:0.75rem; font-weight:700; text-transform:uppercase; color:${groupColors[gName] || '#c8a96e'}; margin-bottom:0.45rem; letter-spacing:0.5px;">
                                        ${gName}
                                    </div>
                                    ${groups[gName].map(field => {
                                        const val = m[field.key] !== undefined ? m[field.key] : field.def;
                                        return `
                                            <div style="margin-bottom:0.45rem;">
                                                <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.77rem; margin-bottom:0.15rem;">
                                                    <span style="color:#e5e7eb;">${field.label}</span>
                                                    <span style="color:var(--accent-gold); font-family:var(--font-mono); font-weight:600;">
                                                        <span id="lmValLbl_${field.key}">${Number(val).toFixed(1)}</span> ${field.unit}
                                                    </span>
                                                </div>
                                                <div style="display:flex; align-items:center; gap:0.45rem;">
                                                    <input type="range" min="${field.min}" max="${field.max}" step="${field.step}" value="${val}"
                                                        style="flex:1; accent-color:${groupColors[gName] || '#d4af37'}; cursor:pointer;"
                                                        oninput="window.onLmMeasurementInput('${field.key}', this.value)">
                                                </div>
                                            </div>
                                        `;
                                    }).join("")}
                                </div>
                            `).join("")}
                        </div>
                    ` : `
                        <div style="padding:0.9rem; max-height:690px; overflow-y:auto;">
                            <div style="display:flex; gap:0.45rem; margin-bottom:0.75rem;">
                                <input type="text" class="form-control" placeholder="Cerca essenza (es. Abete, Acero, Pernambuco...)" value="${window.lmState.woodSearch}" oninput="window.filterLmWoodTable(this.value)" style="font-size:0.8rem; padding:0.4rem 0.65rem;">
                                <button type="button" class="btn btn-primary" style="font-size:0.76rem; padding:0.4rem 0.65rem; white-space:nowrap;" onclick="window.openAddLmCustomWoodModal()">
                                    + Legno
                                </button>
                            </div>
                            <div style="display:flex; flex-direction:column; gap:0.5rem;">
                                ${filteredWoods.map(w => {
                                    const isTop = lmData.selectedTopWood === w.name;
                                    const isBack = lmData.selectedBackWood === w.name;
                                    const radCoeff = (w.sound_velocity / w.density_kg_m3).toFixed(1);
                                    return `
                                        <div style="background:rgba(255,255,255,0.03); border:1px solid ${(isTop || isBack) ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.07)'}; border-radius:8px; padding:0.65rem 0.75rem;">
                                            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:0.4rem;">
                                                <strong style="color:#fff; font-size:0.83rem;">${w.name}</strong>
                                                <div style="display:flex; gap:0.25rem;">
                                                    ${isTop ? '<span class="badge badge-info" style="font-size:0.64rem;">Tavola</span>' : ''}
                                                    ${isBack ? '<span class="badge badge-success" style="font-size:0.64rem;">Fondo</span>' : ''}
                                                </div>
                                            </div>
                                            <div style="font-size:0.73rem; color:var(--text-secondary); margin:0.25rem 0;">
                                                Densità: <strong>${w.density_kg_m3} kg/m³</strong> • E<sub>L</sub>: <strong>${w.elastic_modulus_long} GPa</strong> • Suono: <strong>${w.sound_velocity} m/s</strong> • R: <strong>${radCoeff}</strong>
                                            </div>
                                            <div style="font-size:0.71rem; color:var(--text-muted); margin-bottom:0.45rem;">${w.notes || ""}</div>
                                            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                                                <button type="button" class="btn btn-secondary" style="font-size:0.7rem; padding:0.22rem 0.5rem; color:#38bdf8;" onclick="window.selectLmWoodForPlate('${w.name.replace(/'/g, "\\'")}', 'top')">
                                                    Usa per Tavola
                                                </button>
                                                <button type="button" class="btn btn-secondary" style="font-size:0.7rem; padding:0.22rem 0.5rem; color:#34d399;" onclick="window.selectLmWoodForPlate('${w.name.replace(/'/g, "\\'")}', 'back')">
                                                    Usa per Fondo
                                                </button>
                                            </div>
                                        </div>
                                    `;
                                }).join("")}
                            </div>
                        </div>
                    `}
                </div>

                <!-- COLONNA DESTRA: Visualizzatore 3D Interattivo + Simulazione Chladni + Analizzatore Spettrale Audio FFT -->
                <div style="display:flex; flex-direction:column; gap:1.1rem;">

                    <!-- PANNELLO 1: VISUALIZZATORE 3D & SIMULAZIONE CHLADNI -->
                    <div style="background:rgba(0,0,0,0.32); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.9rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.65rem;">
                            <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
                                <span style="font-size:0.8rem; font-weight:700; color:#fff;">🌐 Vista 3D & Simulazione Chladni:</span>
                                ${[
                                    { id: "wood", label: "🎨 Legno" },
                                    { id: "m1", label: "🔵 Chladni M1" },
                                    { id: "m2", label: "🟣 Chladni M2" },
                                    { id: "m5", label: "🔴 Chladni M5 (Ring)" },
                                    { id: "vib440", label: "〰️ Vibrazione 440Hz" },
                                    { id: "thickness", label: "🌡️ Heatmap Spessori" }
                                ].map(sm => `
                                    <button type="button" class="btn ${window.lmState.simMode === sm.id ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.72rem; padding:0.26rem 0.55rem;" onclick="window.setLmSimMode('${sm.id}')">
                                        ${sm.label}
                                    </button>
                                `).join("")}
                            </div>
                            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.24rem 0.5rem; color:var(--accent-gold); border-color:rgba(212,175,55,0.4);" onclick="window.toggleLmTextureFinish()" title="Alterna tra Texture Fotografica 8K/2K e Shader Vernice ad Olio Cremonese (Acero Marezzato + Abete Val di Fiemme)">
                                    ${window.lmWebGL && window.lmWebGL.usePhotoTexture ? "📷 Texture Scan 3D" : "🎻 Vernice Cremonese"}
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.24rem 0.5rem;" onclick="window.toggleLmWireframe()">
                                    ${window.lmState.wireframe ? "◼ Solido" : "🕸 Wireframe"}
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.24rem 0.5rem;" onclick="window.toggleLmDimensions()">
                                    📏 Misure ${window.lmState.showDimensions ? "ON" : "OFF"}
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.24rem 0.5rem;" onclick="window.toggleLmAutoRotate()">
                                    🔄 Auto-Rot ${window.lmState.autoRotate ? "ON" : "OFF"}
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.24rem 0.5rem;" onclick="window.resetLm3dView()">
                                    Reset Vista
                                </button>
                            </div>
                        </div>

                        <div style="position:relative; width:100%; height:440px; border-radius:10px; overflow:hidden; border:1px solid rgba(255,255,255,0.08); background:radial-gradient(circle at 50% 42%, #1d212b 0%, #090b10 100%);">
                            <canvas id="lm3dCanvas" style="width:100%; height:100%; display:block; cursor:grab;"></canvas>
                            <canvas id="lm3dOverlayCanvas" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none; display:block;"></canvas>
                            <div style="position:absolute; top:10px; left:12px; font-size:0.72rem; color:rgba(255,255,255,0.85); background:rgba(15,17,23,0.82); padding:0.32rem 0.65rem; border-radius:6px; border:1px solid rgba(255,255,255,0.08); pointer-events:none; display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;">
                                ${window.lmState.importedMeshName ? `📦 Mesh Importata: <strong>${window.lmState.importedMeshName}</strong>` : `${schema.icon} <strong>${schema.name} High-Poly 3D WebGL</strong> <span id="lm3dModelInfoTag" style="color:var(--accent-gold); font-size:0.68rem;">• Scansione 3D Reale PBR</span>`}
                            </div>
                            <div id="lm3dLoadingBadge" style="display:none; position:absolute; bottom:12px; left:12px; font-size:0.73rem; color:#fbbf24; background:rgba(15,17,23,0.88); padding:0.35rem 0.75rem; border-radius:6px; border:1px solid rgba(251,191,36,0.35); pointer-events:none;">
                                ⏳ Caricamento scansione 3D ad alta risoluzione...
                            </div>
                        </div>

                        <!-- Barra Filtro Singoli Componenti (come in viewer_3d.py: Tutto, Tavola, Fondo, Fasce, Manico, Effe) -->
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem; margin-top:0.65rem;">
                            <div style="display:flex; gap:0.35rem; flex-wrap:wrap; align-items:center;">
                                <span style="font-size:0.73rem; color:var(--text-muted);">Isola Componente:</span>
                                ${[
                                    { id: -1, label: "Tutto" },
                                    { id: 0, label: "Tavola" },
                                    { id: 1, label: "Fondo" },
                                    { id: 2, label: "Fasce" },
                                    { id: 3, label: "Manico & Tastiera" },
                                    { id: 4, label: "Effe" }
                                ].map(c => `
                                    <button type="button" class="btn ${window.lmState.activeComponentFilter === c.id ? 'btn-primary' : 'btn-secondary'}" style="font-size:0.71rem; padding:0.22rem 0.55rem;" onclick="window.setLmComponentFilter(${c.id})">
                                        ${c.label}
                                    </button>
                                `).join("")}
                            </div>
                            ${window.lmState.importedCustomMesh ? `
                                <button type="button" class="btn btn-secondary" style="font-size:0.71rem; padding:0.22rem 0.55rem; color:#f59e0b;" onclick="window.lmState.importedCustomMesh=null; window.lmState.importedMeshName=''; window.renderLiuteriaMakingWorkspace(document.getElementById('moduleContentContainer'));">
                                    Torna a Mesh Parametrica
                                </button>
                            ` : ""}
                        </div>
                    </div>

                    <!-- PANNELLO 2: ANALIZZATORE ACUSTICO FFT REAL-TIME & CONFRONTO STORICO -->
                    <div style="background:rgba(0,0,0,0.32); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:0.9rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.65rem;">
                            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                                <span style="font-size:0.82rem; font-weight:700; color:#fff;">🎙️ Analisi Spettrale FFT & Confronto Storico:</span>
                                <select id="lmFftSizeSelect" class="form-control" style="width:auto; font-size:0.75rem; padding:0.22rem 0.5rem;">
                                    <option value="2048">FFT 2048</option>
                                    <option value="4096" selected>FFT 4096 (Hann)</option>
                                    <option value="8192">FFT 8192</option>
                                </select>
                                <select id="lmHistSelect" class="form-control" style="width:auto; font-size:0.75rem; padding:0.22rem 0.5rem;" onchange="window.onLmHistoricalChanged(this.value)">
                                    <option value="">Nessun Confronto Storico</option>
                                    ${(lmData.historicalInstruments || []).map(h => `
                                        <option value="${h.id}" ${window.lmState.selectedHistoricalId === h.id ? "selected" : ""}>
                                            Ref: ${h.name}
                                        </option>
                                    `).join("")}
                                </select>
                            </div>

                            <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                                <button type="button" class="btn btn-primary" style="font-size:0.73rem; padding:0.28rem 0.65rem; background:linear-gradient(135deg, #10b981, #059669); border:none;" onclick="window.startLmMicrophoneCapture()">
                                    ▶ Microfono Live
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.73rem; padding:0.28rem 0.65rem; color:var(--accent-gold);" onclick="window.startLmSyntheticTapTone()">
                                    🎶 Simula Tap-Tone
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.73rem; padding:0.28rem 0.55rem;" onclick="window.stopLmAudioCapture()">
                                    ■ Stop
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.73rem; padding:0.28rem 0.55rem;" onclick="window.calibrateLmNoiseFloor()">
                                    🔇 Calibra Rumore
                                </button>
                                <button type="button" class="btn btn-secondary" style="font-size:0.73rem; padding:0.28rem 0.6rem; color:#38bdf8;" onclick="window.saveCurrentLmFftSpectrum()">
                                    💾 Salva Spettro
                                </button>
                            </div>
                        </div>

                        <div style="width:100%; height:205px; border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.08);">
                            <canvas id="lmFftCanvas" style="width:100%; height:100%; display:block;"></canvas>
                        </div>

                        <div id="lmFftStatusLabel" style="font-size:0.76rem; color:var(--text-secondary); margin-top:0.45rem;">
                            Pronto • Marcatori storici attivi: <strong>M1, M2, M5 (Modi del legno)</strong> e <strong>B1-, B1+ (Modi d'aria/corpo)</strong>. Premi <em>"▶ Microfono Live"</em> o <em>"🎶 Simula Tap-Tone"</em>.
                        </div>

                        <!-- Lista Spettri FFT Salvati per lo strumento attivo -->
                        <div style="margin-top:0.65rem; padding-top:0.55rem; border-top:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem;">
                            <div style="font-size:0.74rem; color:var(--text-muted);">
                                Spettri salvati su <strong>${activeArch ? activeArch.name : "Strumento"}</strong>:
                            </div>
                            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                                ${savedSpecs.map(sp => `
                                    <button type="button" class="btn btn-secondary" style="font-size:0.7rem; padding:0.2rem 0.55rem;" onclick="window.loadSavedLmSpectrum('${sp.id}')">
                                        📊 ${sp.label} (${sp.fundamental}Hz)
                                    </button>
                                `).join("")}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    `;

    if (window.appController && window.appController.setupLucideIcons) {
        window.appController.setupLucideIcons();
    }

    setTimeout(() => {
        window.setupLm3dCanvasInteractions();
        window.renderLm3dCanvas();
        window.startLm3dAnimationLoop();
        if (window.lmState.latestFft) {
            window.renderLmFftCanvas(
                window.lmState.latestFft.frequencies,
                window.lmState.latestFft.magnitudes,
                window.lmState.latestFft.peaks,
                window.lmState.latestFft.fundamental
            );
        } else {
            window.renderLmFftCanvas([], [], [], null);
        }
    }, 30);
};

// Handlers interattivi per Liuteria Making
window.switchLmInstrumentType = function(typeKey) {
    const lmData = window.getLiuteriaMakingData();
    lmData.activeInstrumentType = typeKey;
    window.lmState.importedCustomMesh = null;
    window.lmState.importedMeshName = "";
    if (window.lmWebGL) {
        // Come nel modello originale LiuteriaMaking (viola.py: use_obj_texture = False),
        // per la Viola attiviamo di default lo Shader Vernice Cremonese + Acero Marezzato 3D
        // mentre per Violino (scansione museale 8K) e Violoncello (9 materiali PBR) usiamo le texture fotografiche
        window.lmWebGL.usePhotoTexture = (typeKey !== "viola");
    }
    window.atelierDB.saveData();
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.switchLmLeftTab = function(tabName) {
    window.lmState.leftTab = tabName;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.onLmMeasurementInput = function(key, rawVal) {
    const val = parseFloat(rawVal);
    if (isNaN(val)) return;
    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    if (!lmData.measurements[instType]) {
        lmData.measurements[instType] = JSON.parse(JSON.stringify(defaultData.liuteriaMaking.measurements[instType]));
    }
    lmData.measurements[instType][key] = val;
    window.atelierDB.saveData();

    const lbl = document.getElementById(`lmValLbl_${key}`);
    if (lbl) lbl.textContent = val.toFixed(1);

    const woods = lmData.woods || [];
    const topWood = woods.find(w => w.name === lmData.selectedTopWood) || woods[1];
    const backWood = woods.find(w => w.name === lmData.selectedBackWood) || woods[3];
    const est = window.calculateLmAcousticEstimates(instType, lmData.measurements[instType], topWood, backWood);

    const vEl = document.getElementById("lmKpiVol");
    const a0El = document.getElementById("lmKpiA0");
    const mEl = document.getElementById("lmKpiModes");
    const nEl = document.getElementById("lmKpiNote");
    const twEl = document.getElementById("lmKpiTopW");
    const bwEl = document.getElementById("lmKpiBackW");

    if (vEl) vEl.textContent = `${est.volumeCm3} cm³`;
    if (a0El) a0El.textContent = `${est.a0} Hz`;
    if (mEl) mEl.textContent = `M1: ${est.m1}Hz • M2: ${est.m2}Hz • M5: ${est.m5}Hz`;
    if (nEl) nEl.textContent = est.noteM5;
    if (twEl) twEl.textContent = `${est.topWeightG} g`;
    if (bwEl) bwEl.textContent = `${est.backWeightG} g`;

    window.renderLm3dCanvas();
};

window.resetLmMeasurementsToDefault = function() {
    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    lmData.measurements[instType] = JSON.parse(JSON.stringify(defaultData.liuteriaMaking.measurements[instType]));
    window.atelierDB.saveData();
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
    window.showToast("Quote parametriche ripristinate ai valori standard!");
};

window.filterLmWoodTable = function(query) {
    window.lmState.woodSearch = query;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.selectLmWoodForPlate = function(woodName, target) {
    const lmData = window.getLiuteriaMakingData();
    if (target === "top") {
        lmData.selectedTopWood = woodName;
        window.showToast(`"${woodName}" impostato per la Tavola Armonica!`);
    } else {
        lmData.selectedBackWood = woodName;
        window.showToast(`"${woodName}" impostato per Fondo e Fasce!`);
    }
    window.atelierDB.saveData();
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.setLmSimMode = function(mode) {
    window.lmState.simMode = mode;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.setLmComponentFilter = function(compId) {
    window.lmState.activeComponentFilter = compId;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.toggleLmWireframe = function() {
    window.lmState.wireframe = !window.lmState.wireframe;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.toggleLmDimensions = function() {
    window.lmState.showDimensions = !window.lmState.showDimensions;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.toggleLmAutoRotate = function() {
    window.lmState.autoRotate = !window.lmState.autoRotate;
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
};

window.resetLm3dView = function() {
    window.lmState.rotX = -0.62;
    window.lmState.rotY = 0.42;
    window.lmState.zoom = 1.0;
    window.renderLm3dCanvas();
};

window.onLmHistoricalChanged = function(histId) {
    window.lmState.selectedHistoricalId = histId;
    if (window.lmState.latestFft) {
        window.renderLmFftCanvas(
            window.lmState.latestFft.frequencies,
            window.lmState.latestFft.magnitudes,
            window.lmState.latestFft.peaks,
            window.lmState.latestFft.fundamental
        );
    } else {
        window.renderLmFftCanvas([], [], [], null);
    }
};

window.loadSavedLmSpectrum = function(specId) {
    window.stopLmAudioCapture();
    const lmData = window.getLiuteriaMakingData();
    const activeArch = (lmData.archivedInstruments || []).find(a => a.id === window.lmState.selectedArchiveId) || (lmData.archivedInstruments || [])[0];
    if (!activeArch || !Array.isArray(activeArch.savedSpectrums)) return;
    const sp = activeArch.savedSpectrums.find(s => s.id === specId);
    if (!sp) return;

    const nBins = 512;
    const freqs = [];
    const mags = [];
    const peaks = (sp.peaks || [sp.fundamental]).map((f, i) => ({ freq: f, db: -12 - i * 6 }));
    for (let i = 0; i < nBins; i++) {
        const f = (i / nBins) * 2000;
        freqs.push(f);
        let v = -75;
        for (const p of peaks) {
            const d = (f - p.freq) / 16;
            v += (80 + p.db) * Math.exp(-0.5 * d * d);
        }
        mags.push(Math.min(-2, Math.max(-82, v)));
    }
    window.lmState.latestFft = { frequencies: freqs, magnitudes: mags, peaks, fundamental: sp.fundamental };
    window.renderLmFftCanvas(freqs, mags, peaks, sp.fundamental);
    window.showToast(`Caricato spettro "${sp.label}" (Fond. ${sp.fundamental} Hz)`);
};

window.openAddLmCustomWoodModal = function() {
    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    if (!modalOverlay || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `<i data-lucide="trees" style="color:var(--accent-gold);"></i> Aggiungi Nuovo Legno al Database Fisico`;
    modalBody.innerHTML = `
        <form onsubmit="window.saveNewLmCustomWood(event)">
            <div class="form-group">
                <label>Nome Essenza Legnosa *</label>
                <input type="text" id="lm_w_name" class="form-control" required placeholder="Es. Abete Rosso Val di Fiemme Stagionato 2010">
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Densità (kg/m³) *</label>
                    <input type="number" step="1" id="lm_w_density" class="form-control" required value="415">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Velocità del Suono (m/s) *</label>
                    <input type="number" step="10" id="lm_w_vel" class="form-control" required value="5650">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group" style="flex:1;">
                    <label>Modulo Elastico Long. E<sub>L</sub> (GPa)</label>
                    <input type="number" step="0.1" id="lm_w_el" class="form-control" required value="13.8">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Modulo Elastico Trasv. E<sub>T</sub> (GPa)</label>
                    <input type="number" step="0.05" id="lm_w_et" class="form-control" required value="0.68">
                </div>
                <div class="form-group" style="flex:1;">
                    <label>Smorzamento (tan δ)</label>
                    <input type="number" step="0.001" id="lm_w_damp" class="form-control" required value="0.006">
                </div>
            </div>
            <div class="form-group">
                <label>Note Tecniche & Impiego</label>
                <input type="text" id="lm_w_notes" class="form-control" placeholder="Es. Tavola armonica ad altissima radiazione acustica">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:0.8rem;">
                Salva Essenza nel Database
            </button>
        </form>
    `;
    modalOverlay.classList.add("active");
};

window.saveNewLmCustomWood = function(e) {
    e.preventDefault();
    const lmData = window.getLiuteriaMakingData();
    const newWood = {
        id: "w-" + Date.now(),
        name: document.getElementById("lm_w_name").value.trim(),
        density_kg_m3: parseFloat(document.getElementById("lm_w_density").value) || 420,
        sound_velocity: parseFloat(document.getElementById("lm_w_vel").value) || 5500,
        elastic_modulus_long: parseFloat(document.getElementById("lm_w_el").value) || 13.0,
        elastic_modulus_trans: parseFloat(document.getElementById("lm_w_et").value) || 0.7,
        damping_factor: parseFloat(document.getElementById("lm_w_damp").value) || 0.008,
        notes: document.getElementById("lm_w_notes").value.trim(),
        is_custom: true
    };
    lmData.woods.unshift(newWood);
    window.atelierDB.saveData();
    window.closeModal();
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
    window.showToast(`Essenza "${newWood.name}" aggiunta al database!`);
};

// Modale Archivio Strumenti di Liuteria Making (con Diario Restauri e Stampa Scheda Tecnica PDF)
window.openLiuteriaMakingArchiveModal = function() {
    const lmData = window.getLiuteriaMakingData();
    const list = lmData.archivedInstruments || [];
    const active = list.find(a => a.id === window.lmState.selectedArchiveId) || list[0];

    const modalOverlay = document.getElementById("modalOverlay");
    const modalTitle = document.getElementById("modalTitle");
    const modalBody = document.getElementById("modalBody");
    if (!modalOverlay || !modalTitle || !modalBody) return;

    modalTitle.innerHTML = `<i data-lucide="archive" style="color:var(--accent-gold);"></i> Archivio Strumenti & Schede Tecniche (Liuteria Making)`;
    modalBody.innerHTML = `
        <div style="display:grid; grid-template-columns:240px 1fr; gap:1rem; min-height:360px;">
            <div style="border-right:1px solid rgba(255,255,255,0.08); padding-right:0.85rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem;">
                    <strong style="color:var(--accent-gold); font-size:0.85rem;">I Miei Strumenti</strong>
                    <button type="button" class="btn btn-primary" style="font-size:0.72rem; padding:0.25rem 0.55rem;" onclick="window.addCurrentLmInstrumentToArchive()">
                        + Salva Attuale
                    </button>
                </div>
                <div style="display:flex; flex-direction:column; gap:0.4rem;">
                    ${list.map(inst => `
                        <div onclick="window.lmState.selectedArchiveId='${inst.id}'; window.openLiuteriaMakingArchiveModal();"
                             style="padding:0.6rem 0.7rem; border-radius:8px; cursor:pointer; background:${active && active.id === inst.id ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.03)'}; border:1px solid ${active && active.id === inst.id ? 'rgba(212,175,55,0.5)' : 'rgba(255,255,255,0.06)'};">
                            <div style="font-weight:700; font-size:0.82rem; color:#fff;">${inst.name}</div>
                            <div style="font-size:0.7rem; color:var(--text-muted);">${inst.production_date || "-"} • ${inst.owner_name || "-"}</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div>
                ${active ? `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
                        <div>
                            <h4 style="margin:0; color:#fff; font-size:1.1rem;">${active.name}</h4>
                            <div style="font-size:0.78rem; color:#88eedd; margin-top:0.2rem;">
                                👤 Cliente: ${active.owner_name || "-"} | ${active.owner_phone || ""} | ${active.owner_email || ""}
                            </div>
                        </div>
                        <div style="display:flex; gap:0.4rem;">
                            <button type="button" class="btn btn-secondary" style="font-size:0.74rem; padding:0.3rem 0.65rem;" onclick="window.loadArchivedLmMeasurements('${active.id}')">
                                📐 Carica Quote nel 3D
                            </button>
                            <button type="button" class="btn btn-primary" style="font-size:0.74rem; padding:0.3rem 0.7rem;" onclick="window.printLmInstrumentPdfSheet('${active.id}')">
                                📑 Esporta Scheda PDF
                            </button>
                        </div>
                    </div>
                    <p style="font-size:0.82rem; color:var(--text-secondary); background:rgba(255,255,255,0.03); padding:0.6rem 0.8rem; border-radius:8px;">
                        ${active.notes || "Nessuna nota."}
                    </p>

                    <div style="margin-top:0.9rem;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                            <strong style="color:var(--accent-gold); font-size:0.82rem;">Diario Restauri e Interventi Acustici</strong>
                            <button type="button" class="btn btn-secondary" style="font-size:0.72rem; padding:0.22rem 0.55rem;" onclick="window.addLmRestorationEntry('${active.id}')">
                                + Aggiungi Intervento
                            </button>
                        </div>
                        ${(active.restorations && active.restorations.length > 0) ? active.restorations.map(r => `
                            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:7px; padding:0.55rem 0.75rem; margin-bottom:0.4rem; font-size:0.8rem;">
                                <strong style="color:#fff;">${r.intervention_type}</strong>
                                <div style="font-size:0.71rem; color:var(--text-muted);">Data: ${r.intervention_date}</div>
                            </div>
                        `).join("") : `<div style="font-size:0.78rem; color:var(--text-muted); font-style:italic;">Nessun intervento registrato.</div>`}
                    </div>
                ` : `<p>Seleziona uno strumento dall'elenco.</p>`}
            </div>
        </div>
    `;
    modalOverlay.classList.add("active");
};

window.addCurrentLmInstrumentToArchive = function() {
    const name = prompt("Nome del nuovo strumento / modello da salvare in Archivio:", "Violino Cremonese Opus " + new Date().getFullYear());
    if (!name) return;
    const owner = prompt("Nome Cliente / Destinatario (opzionale):", "Atelier Liuteria De Lorenzi") || "";
    const notes = prompt("Note tecniche sugli spessori e sul legno:", "Tavola in Abete di Paneveggio, Fondo in Acero Marezzato") || "";

    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    const newInst = {
        id: "lm-inst-" + Date.now(),
        name: name.trim(),
        instrument_type: instType,
        production_date: new Date().toLocaleDateString("it-IT"),
        owner_name: owner.trim(),
        owner_phone: "",
        owner_email: "",
        notes: notes.trim(),
        measurements: JSON.parse(JSON.stringify(lmData.measurements[instType])),
        restorations: [],
        savedSpectrums: []
    };
    lmData.archivedInstruments.unshift(newInst);
    window.lmState.selectedArchiveId = newInst.id;
    window.atelierDB.saveData();
    window.openLiuteriaMakingArchiveModal();
    window.showToast(`Strumento "${newInst.name}" salvato nell'Archivio Liuteria Making!`);
};

window.loadArchivedLmMeasurements = function(instId) {
    const lmData = window.getLiuteriaMakingData();
    const inst = (lmData.archivedInstruments || []).find(a => a.id === instId);
    if (!inst || !inst.measurements) return;
    const typeKey = inst.instrument_type || "violin";
    lmData.activeInstrumentType = typeKey;
    lmData.measurements[typeKey] = JSON.parse(JSON.stringify(inst.measurements));
    window.lmState.selectedArchiveId = inst.id;
    window.atelierDB.saveData();
    window.closeModal();
    window.renderLiuteriaMakingWorkspace(document.getElementById("moduleContentContainer"));
    window.showToast(`Quote di "${inst.name}" caricate nel modello 3D!`);
};

window.addLmRestorationEntry = function(instId) {
    const lmData = window.getLiuteriaMakingData();
    const inst = (lmData.archivedInstruments || []).find(a => a.id === instId);
    if (!inst) return;
    const desc = prompt("Descrizione intervento o calibrazione acustica:");
    if (!desc) return;
    if (!Array.isArray(inst.restorations)) inst.restorations = [];
    inst.restorations.unshift({
        id: "lm-rest-" + Date.now(),
        intervention_type: desc.trim(),
        intervention_date: new Date().toISOString().split("T")[0]
    });
    window.atelierDB.saveData();
    window.openLiuteriaMakingArchiveModal();
};

window.printLmInstrumentPdfSheet = function(instId) {
    const lmData = window.getLiuteriaMakingData();
    const inst = (lmData.archivedInstruments || []).find(a => a.id === instId);
    if (!inst) return;
    const m = inst.measurements || {};
    const vol = window.calculateLmInstrumentVolume(m);
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
        <html><head><title>Scheda Tecnica - ${inst.name}</title>
        <style>
            body { font-family: Georgia, serif; padding: 36px; color: #1a1a1a; }
            h1 { color: #8b6914; border-bottom: 2px solid #d4af37; padding-bottom: 8px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-top: 16px; font-size: 14px; }
            .row { display: flex; justify-content: space-between; border-bottom: 1px dotted #ccc; padding: 4px 0; }
        </style></head><body>
            <h1>Liuteria De Lorenzi — Scheda Tecnica & Acustica (Liuteria Making)</h1>
            <p><strong>Strumento:</strong> ${inst.name} &nbsp;|&nbsp; <strong>Data:</strong> ${inst.production_date || "-"} &nbsp;|&nbsp; <strong>Proprietario:</strong> ${inst.owner_name || "-"}</p>
            <p><strong>Volume Cassa Stimato:</strong> ${vol} cm³ &nbsp;|&nbsp; <strong>Legni:</strong> ${lmData.selectedTopWood} / ${lmData.selectedBackWood}</p>
            <p><strong>Note:</strong> ${inst.notes || "-"}</p>
            <h3>Quote Parametriche (mm)</h3>
            <div class="grid">
                ${Object.entries(m).map(([k, v]) => `<div class="row"><span>${k}</span><strong>${v} mm</strong></div>`).join("")}
            </div>
            <script>window.onload = () => window.print();<\/script>
        </body></html>
    `);
    w.document.close();
};

window.saveLmToGestionaleCostruzione = function() {
    const lmData = window.getLiuteriaMakingData();
    const instType = lmData.activeInstrumentType || "violin";
    const schema = window.LM_MEASUREMENT_SCHEMA[instType];
    const m = lmData.measurements[instType];
    const woods = lmData.woods || [];
    const topWood = woods.find(w => w.name === lmData.selectedTopWood);
    const backWood = woods.find(w => w.name === lmData.selectedBackWood);
    const est = window.calculateLmAcousticEstimates(instType, m, topWood, backWood);

    const opNum = prompt("Numero d'Opera per il registro Costruzione:", `Opus ${(window.atelierDB.data.costruzione || []).length + 43}`);
    if (!opNum) return;

    const newCostruzione = {
        id: "cost-" + Date.now(),
        opNumero: opNum.trim(),
        modello: `${schema.name} Parametrico (${m.body_length} mm)`,
        committente: "Progetto Liuteria Making",
        legnoTavola: lmData.selectedTopWood,
        legnoFondo: lmData.selectedBackWood,
        faseAttuale: `Calibrazione Spessori (Centro ${m.top_center}mm / Fondo ${m.back_center}mm)`,
        progresso: 35,
        frequenzaTavola: `${est.noteM5} (${est.m5} Hz) • M2: ${est.m2} Hz`,
        pesoTavola: `${est.topWeightG} g (Volume cassa ${est.volumeCm3} cm³)`,
        dataInizio: new Date().toISOString().split("T")[0],
        consegnaPrevista: ""
    };

    window.atelierDB.addItem("costruzione", newCostruzione);
    window.showToast(`Progetto "${opNum}" salvato nel modulo Costruzione con frequenze M5 (${est.m5} Hz) e peso tavola (${est.topWeightG} g)!`);
};

document.addEventListener("DOMContentLoaded", () => {
    if (window.socialMediaDB) {
        window.socialMediaDB.init();
    }
    window.appController = new AppController();
    if (window.haService) {
        window.haService.init();
    }
    window.startSocialScheduler();
    if (window.initSendinblueService) {
        window.initSendinblueService();
    }
});
