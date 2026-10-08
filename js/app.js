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

    let formHTML = '';

    if (collectionName === 'clienti') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'clienti')">
                <div class="form-group">
                    <label>Nome Completo Cliente</label>
                    <input type="text" id="f_nome" class="form-control" required placeholder="Es. Maestro Giuseppe Verdi">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Ruolo / Titolo</label>
                        <input type="text" id="f_ruolo" class="form-control" placeholder="Es. Violoncellista Solista">
                    </div>
                    <div class="form-group">
                        <label>Città</label>
                        <input type="text" id="f_citta" class="form-control" placeholder="Es. Cremona">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="f_email" class="form-control" placeholder="email@dominio.it">
                    </div>
                    <div class="form-group">
                        <label>Telefono</label>
                        <input type="text" id="f_telefono" class="form-control" placeholder="+39 340 ...">
                    </div>
                </div>
                <div class="form-group">
                    <label>Note & Preferenze Timbriche</label>
                    <textarea id="f_note" class="form-control" placeholder="Note del liutaio su preferenze suono..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">Salva Cliente</button>
            </form>
        `;
    } else if (collectionName === 'magazzinoLegno') {
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'magazzinoLegno')">
                <div class="form-group">
                    <label>Essenza Legno</label>
                    <input type="text" id="f_essenza" class="form-control" required placeholder="Es. Abete Rosso Val di Fiemme">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Provenienza</label>
                        <input type="text" id="f_provenienza" class="form-control" placeholder="Es. Paneveggio (TN)">
                    </div>
                    <div class="form-group">
                        <label>Anno Taglio</label>
                        <input type="number" id="f_annoTaglio" class="form-control" value="2015">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label>Quantità Pezzi</label>
                        <input type="number" id="f_quantita" class="form-control" value="1">
                    </div>
                    <div class="form-group">
                        <label>Prezzo Unitario (€)</label>
                        <input type="number" id="f_prezzoUnitario" class="form-control" value="250">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">Registra Legno</button>
            </form>
        `;
    } else if (collectionName === 'calendarioAppuntamenti') {
        const todayIso = new Date().toISOString().split('T')[0];
        formHTML = `
            <form onsubmit="window.saveNewRecord(event, 'calendarioAppuntamenti')">
                <div class="form-group">
                    <label>Cliente / Richiedente</label>
                    <input type="text" id="f_app_cliente" class="form-control" required placeholder="Es. Maestro Marco Rossi (Primo Violino)">
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
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Strumento di Riferimento</label>
                        <input type="text" id="f_app_strumento" class="form-control" placeholder="Es. Violino Stradivari Copy 2021">
                    </div>
                    <div class="form-group">
                        <label>Stato Appuntamento</label>
                        <select id="f_app_stato" class="form-control">
                            <option value="Confermato">Confermato</option>
                            <option value="In attesa">In attesa</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Note Atelier</label>
                    <textarea id="f_app_note" class="form-control" placeholder="Dettagli sulle lavorazioni da concordare..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">Salva Appuntamento</button>
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
                        <input type="text" id="f_str_nome" class="form-control" required placeholder="Es. Violino Master 'La Fenice' Opus 44">
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
                <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:1rem;">Registra Strumento Finito</button>
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
    if (collectionName === 'clienti') {
        const item = {
            id: "cli-" + Date.now(),
            nome: document.getElementById("f_nome").value,
            ruolo: document.getElementById("f_ruolo").value || "Cliente Atelier",
            citta: document.getElementById("f_citta").value || "Italia",
            email: document.getElementById("f_email").value || "-",
            telefono: document.getElementById("f_telefono").value || "-",
            strumentiPosseduti: ["Nuova Richiesta"],
            spesaTotale: 0,
            note: document.getElementById("f_note").value || "Nuova scheda cliente."
        };
        window.atelierDB.addItem("clienti", item);
    } else if (collectionName === 'magazzinoLegno') {
        const item = {
            id: "leg-" + Date.now(),
            essenza: document.getElementById("f_essenza").value,
            provenienza: document.getElementById("f_provenienza").value || "Italia",
            annoTaglio: parseInt(document.getElementById("f_annoTaglio").value) || 2020,
            stagionaturaAnni: new Date().getFullYear() - (parseInt(document.getElementById("f_annoTaglio").value) || 2020),
            tipoPezzo: "Set da Risonanza",
            quantita: parseInt(document.getElementById("f_quantita").value) || 1,
            densita: "0.39 g/cm³",
            velocitaSuono: "5100 m/s",
            prezzoUnitario: parseFloat(document.getElementById("f_prezzoUnitario").value) || 100,
            stato: "Stagionato / PRONTO"
        };
        window.atelierDB.addItem("magazzinoLegno", item);
    } else if (collectionName === 'calendarioAppuntamenti') {
        const item = {
            id: "app-" + Date.now(),
            cliente: document.getElementById("f_app_cliente").value,
            data: document.getElementById("f_app_data").value || new Date().toISOString().split('T')[0],
            ora: document.getElementById("f_app_ora").value || "10:00",
            tipo: document.getElementById("f_app_tipo").value || "Incontro",
            strumento: document.getElementById("f_app_strumento").value || "-",
            stato: document.getElementById("f_app_stato").value || "Confermato",
            note: document.getElementById("f_app_note").value || ""
        };
        window.atelierDB.addItem("calendarioAppuntamenti", item);
    } else if (collectionName === 'magazzinoStrumenti') {
        const item = {
            id: "str-" + Date.now(),
            codice: document.getElementById("f_str_codice").value || `VIO-${Date.now().toString().slice(-4)}`,
            nome: document.getElementById("f_str_nome").value,
            tipologia: document.getElementById("f_str_tipologia").value || "Violino",
            modello: document.getElementById("f_str_modello").value || "Modello Classico",
            annoCostruzione: new Date().getFullYear(),
            prezzo: parseFloat(document.getElementById("f_str_prezzo").value) || 15000,
            stato: document.getElementById("f_str_stato").value || "Disponibile in Showroom",
            certificato: document.getElementById("f_str_certificato").value || "Presente",
            vernice: document.getElementById("f_str_vernice").value || "Finitura tradizionale a olio"
        };
        window.atelierDB.addItem("magazzinoStrumenti", item);
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
