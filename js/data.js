/**
 * Data store with persistent LocalStorage support for Liuteria De Lorenzi Gestionale
 */
const STORAGE_KEY = 'liuteria_gestionale_db_v1';

const _getTodayIso = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const defaultData = {
    settings: {
        atelierName: "Liuteria De Lorenzi",
        luthier: "Maestro Liutaio De Lorenzi",
        currency: "€",
        workshopTemp: 21.8,
        workshopHumidity: 47.5,
        lastSync: new Date().toISOString(),
        homeAssistant: {
            enabled: true,
            host: "http://homeassistant.local:8123",
            token: "",
            tempEntityId: "sensor.temperatura_laboratorio",
            humidityEntityId: "sensor.umidita_laboratorio",
            pollingInterval: 30,
            status: "ready",
            useSimulationFallback: true
        }
    },
    // 1. Biblioteca (Library)
    biblioteca: [
        {
            id: "bib-1",
            titolo: "Rilievi Acustici e Sesto Stradivari 'Cremonese' 1715",
            autore: "E. Sacconi",
            categoria: "Disegni e Modelli",
            anno: 1972,
            formato: "PDF Blueprint",
            pagine: 48,
            note: "Spessori tavola armonica (2.4mm - 4.2mm). Frequenze di risonanza Chladni F# e C.",
            tags: ["Stradivari", "Violino", "Spessori", "Risonanza"]
        },
        {
            id: "bib-2",
            titolo: "I Segreti della Vernice Cremonese al Colofonia e Ambra",
            autore: "G. Baese",
            categoria: "Ricette e Trattamenti",
            anno: 1985,
            formato: "Manuale Tecnico",
            pagine: 120,
            note: "Preparazione dell'olio cotto con ossido di piombo, solubilizzazione della resina di pino e pigmenti di robbia.",
            tags: ["Vernici", "Olio Cot", "Ambra", "Pigmenti"]
        },
        {
            id: "bib-3",
            titolo: "Guarneri del Gesù 1743 'Cannone' - Studio Spettrale CT-Scan",
            autore: "Museo del Violino Cremona",
            categoria: "Analisi Scientifica",
            anno: 2018,
            formato: "Rapporto Tomografico",
            pagine: 34,
            note: "Densità media abete 0.38 g/cm³, acero marezzato 0.59 g/cm³. Bombatura posteriore 15.2mm.",
            tags: ["Guarneri", "Tomografia", "Densità", "Cannone"]
        },
        {
            id: "bib-4",
            titolo: "Manuale di Incatenatura Violoncello e Proporzioni del Ponticello",
            autore: "M. Bisceglia",
            categoria: "Tecnica Costruttiva",
            anno: 2005,
            formato: "PDF Guida",
            pagine: 62,
            note: "Angolatura catena armonica 1.5° rispetto al filo d'abete. Tensione delle corde C-G-D-A.",
            tags: ["Violoncello", "Catena", "Ponticello"]
        }
    ],
    // 2. Calendario appuntamenti
    calendarioAppuntamenti: [
        {
            id: "app-1",
            cliente: "Maestro Marco Rossi (Primo Violino)",
            data: _getTodayIso(),
            ora: "10:30",
            tipo: "Messa a punto suoni",
            strumento: "Violino Stradivari Copy 2021",
            stato: "Confermato",
            note: "Regolazione anima e altezza tastiera per concerto autunnale."
        },
        {
            id: "app-2",
            cliente: "Quartetto d'Archi di Milano",
            data: "2026-10-02",
            ora: "15:00",
            tipo: "Consulenza e Valutazione",
            strumento: "Cello Gagliano 1780",
            stato: "In attesa",
            note: "Ispezione crepa sulla fasciata e controllo capotasto."
        },
        {
            id: "app-3",
            cliente: "Conservatorio G. Verdi - Prof.ssa Bianchi",
            data: "2026-10-05",
            ora: "11:00",
            tipo: "Consegna Strumento",
            strumento: "Viola 41.5cm Progetto Gaspare da Salò",
            stato: "Confermato",
            note: "Consegna ufficiale con certificato di autenticità e prova acustica."
        }
    ],
    // 3. Calendario Lavorazioni
    calendarioLavorazioni: [
        {
            id: "lav-1",
            titolo: "Scultura Riccio Violino Op. 42",
            responsabile: "Maestro Liutaio",
            inizio: "2026-09-25",
            fine: "2026-09-30",
            progresso: 75,
            priorita: "Alta",
            fase: "Sbozzatura e Occhioli",
            strumento: "Violino Guarneri 1742"
        },
        {
            id: "lav-2",
            titolo: "Verniciatura Olio - Stesura Mano 8/12",
            responsabile: "Assistente Atelier",
            inizio: "2026-09-20",
            fine: "2026-10-10",
            progresso: 65,
            priorita: "Media",
            fase: "Ossidazione UV e Verniciatura",
            strumento: "Violoncello Montagnana"
        },
        {
            id: "lav-3",
            titolo: "Riparazione Crepa Tavola & Spessori Anima",
            responsabile: "Restauratore Capo",
            inizio: "2026-09-28",
            fine: "2026-10-04",
            progresso: 30,
            priorita: "Urgentissima",
            fase: "Applicazione Tacchetti di Abete",
            strumento: "Viola d'Amore XVIII Sec."
        }
    ],
    // 4. Clienti
    clienti: [
        {
            id: "cli-1",
            nome: "Marco Rossi",
            ruolo: "Solista & Primo Violino Teatro alla Scala",
            email: "m.rossi.violin@orchestra.it",
            telefono: "+39 335 8492011",
            citta: "Milano",
            strumentiPosseduti: ["Violino Liuteria Master 2021", "Arco Sartory 1910"],
            spesaTotale: 18500,
            note: "Cliente VIP. Predilige timbro caldo nei bassi e anima leggermente avanzata."
        },
        {
            id: "cli-2",
            nome: "Elena Moretti",
            ruolo: "Docente di Violoncello Conservatorio",
            email: "elena.moretti@cello.edu",
            telefono: "+39 347 1204992",
            citta: "Cremona",
            strumentiPosseduti: ["Violoncello Modello Ruggieri"],
            spesaTotale: 24000,
            note: "Ha in ordine una copia Montagnana in legno d'acero marezzato balcanico 2010."
        },
        {
            id: "cli-3",
            nome: "Orchestra da Camera Fiorentina",
            ruolo: "Istituzione Sinfonica",
            email: "amministrazione@fiorentina-orchestra.it",
            telefono: "+39 055 4829100",
            citta: "Firenze",
            strumentiPosseduti: ["Quartetto d'Archi Completo Atelier"],
            spesaTotale: 52000,
            note: "Manutenzione annuale programmata ogni mese di Settembre."
        }
    ],
    // 5. Costruzione
    costruzione: [
        {
            id: "cost-1",
            opNumero: "Opus 42",
            modello: "Violino Guarneri del Gesù 1742 'Lord Wilton'",
            committente: "In Vendita (Disponibile)",
            legnoTavola: "Abete Rosso Val di Fiemme 2012 (Stagionatura 14 anni)",
            legnoFondo: "Acero Marezzato Balcanico 2008 Pezzo Unico",
            faseAttuale: "Intavolazione & Scultura Riccio",
            progresso: 60,
            frequenzaTavola: "F# (288 Hz)",
            pesoTavola: "64.2 g (senza catena)",
            dataInizio: "2026-08-01",
            consegnaPrevista: "2026-11-15"
        },
        {
            id: "cost-2",
            opNumero: "Opus 43",
            modello: "Violoncello Domenico Montagnana 1739 'Sleeping Beauty'",
            committente: "Elena Moretti",
            legnoTavola: "Abete della Val di Non 2005",
            legnoFondo: "Acero Bosniaco a Taglio di Quarto",
            faseAttuale: "Verniciatura ad Olio (Mano 8)",
            progresso: 80,
            frequenzaTavola: "D (144 Hz)",
            pesoTavola: "410 g",
            dataInizio: "2026-05-10",
            consegnaPrevista: "2026-10-25"
        },
        {
            id: "cost-3",
            opNumero: "Opus 44",
            modello: "Viola Gaspare da Salò 41.5 cm",
            committente: "Prof.ssa Bianchi",
            legnoTavola: "Abete Paneveggio 2015",
            legnoFondo: "Pioppo Marezzato Maschio",
            faseAttuale: "Chiusura Cassa e Filettatura",
            progresso: 45,
            frequenzaTavola: "E (162 Hz)",
            pesoTavola: "118 g",
            dataInizio: "2026-08-20",
            consegnaPrevista: "2026-12-01"
        }
    ],
    // 6. Gestione contabilità
    gestioneContabilita: [
        {
            id: "fat-101",
            numero: "FATT-2026-042",
            cliente: "Marco Rossi",
            causale: "Vendita Violino Master Opus 39 + Arco in Pernambuco",
            importo: 18500,
            data: "2026-09-15",
            scadenza: "2026-09-30",
            stato: "Pagata",
            metodo: "Bonifico Bancario"
        },
        {
            id: "fat-102",
            numero: "FATT-2026-043",
            cliente: "Orchestra da Camera Fiorentina",
            causale: "Manutenzione e Messa a Punto Quartetto d'Archi",
            importo: 3200,
            data: "2026-09-20",
            scadenza: "2026-10-20",
            stato: "In Sospeso",
            metodo: "Riba 30 gg"
        },
        {
            id: "fat-103",
            numero: "FATT-2026-044",
            cliente: "Elena Moretti",
            causale: "Acconto 50% Costruzione Violoncello Montagnana",
            importo: 12000,
            data: "2026-09-22",
            scadenza: "2026-09-25",
            stato: "Pagata",
            metodo: "Bonifico Bancario"
        }
    ],
    // 7. Laboratorio
    laboratorio: [
        {
            id: "lab-1",
            banco: "Banco A - Costruzione Nuova",
            assegnatoA: "Maestro Liutaio",
            strumentoInLavorazione: "Violino Opus 42",
            condizioniAmbiente: "21.8°C / 47.5% RH (Ottimale)",
            utensiliInUso: ["Pialletto a botte 8mm", "Sgorga Dastra #7 18mm", "Colla di pelle 60°C"],
            statoStazione: "Attivo"
        },
        {
            id: "lab-2",
            banco: "Banco B - Restauro e Riparazioni",
            assegnatoA: "Restauratore Capo",
            strumentoInLavorazione: "Viola d'Amore XVIII Sec.",
            condizioniAmbiente: "21.5°C / 48.0% RH (Ottimale)",
            utensiliInUso: ["Morsetti in Acero", "Lente d'ingrandimento 10x", "Lampada UV 365nm"],
            statoStazione: "Attivo"
        },
        {
            id: "lab-3",
            banco: "Banco C - Montaggio e Acoustic Testing",
            assegnatoA: "Acustico / Collaudatore",
            strumentoInLavorazione: "Violoncello Opus 43",
            condizioniAmbiente: "22.0°C / 46.8% RH",
            utensiliInUso: ["Calibro digitale dial 0.01mm", "Spettrometro audio FFT", "Catena anima micro"],
            statoStazione: "Libero"
        }
    ],
    // 8. Magazzino Legno
    magazzinoLegno: [
        {
            id: "leg-1",
            essenza: "Abete Rosso da Risonanza (Picea abies)",
            provenienza: "Forest dei Violini - Val di Fiemme (TN)",
            annoTaglio: 2010,
            stagionaturaAnni: 16,
            tipoPezzo: "Spaccato a Cuneo per Tavola Violino",
            quantita: 18,
            densita: "0.37 g/cm³",
            velocitaSuono: "5450 m/s",
            prezzoUnitario: 350,
            stato: "Stagionato / PRONTO"
        },
        {
            id: "leg-2",
            essenza: "Acero Marezzato Balcanico (Acer pseudoplatanus)",
            provenienza: "Bosnia ed Erzegovina",
            annoTaglio: 2008,
            stagionaturaAnni: 18,
            tipoPezzo: "Set Fondo Unico + Fasce + Manico",
            quantita: 12,
            densita: "0.58 g/cm³",
            velocitaSuono: "4200 m/s",
            prezzoUnitario: 680,
            stato: "Stagionato / PRONTO"
        },
        {
            id: "leg-3",
            essenza: "Ebano Nero Naturale (Diospyros ebenum)",
            provenienza: "Camerun (Certificato CITES)",
            annoTaglio: 2014,
            stagionaturaAnni: 12,
            tipoPezzo: "Blocchetti per Tastiera Violoncello e Violino",
            quantita: 35,
            densita: "1.15 g/cm³",
            velocitaSuono: "N/D",
            prezzoUnitario: 95,
            stato: "In Giacenza"
        },
        {
            id: "leg-4",
            essenza: "Pernambuco Premium (Paubrasilia echinata)",
            provenienza: "Brasile (Licenza Speciale FSC)",
            annoTaglio: 2002,
            stagionaturaAnni: 24,
            tipoPezzo: "Bacchette Ottagonali per Archi Violino",
            quantita: 8,
            densita: "1.05 g/cm³",
            velocitaSuono: "5600 m/s",
            prezzoUnitario: 420,
            stato: "Rarità / PRONTO"
        }
    ],
    // 9. Magazzino strumenti
    magazzinoStrumenti: [
        {
            id: "str-1",
            codice: "VIO-2024-001",
            nome: "Violino Master 'La Fenice' Opus 38",
            tipologia: "Violino 4/4",
            modello: "Stradivari 1715",
            annoCostruzione: 2024,
            prezzo: 16500,
            stato: "Disponibile in Showroom",
            certificato: "Presente (Certificato di Autenticità Atelier)",
            vernice: "Olio di ambra colore ambrato dorato rossastro"
        },
        {
            id: "str-2",
            codice: "VLA-2025-002",
            nome: "Viola d'Arco 'Gaspare' 41.5cm",
            tipologia: "Viola",
            modello: "Gaspare da Salò",
            annoCostruzione: 2025,
            prezzo: 19000,
            stato: "In Prova presso Cliente",
            certificato: "Presente",
            vernice: "Spirito e resine naturali marrone scuro warm"
        },
        {
            id: "str-3",
            codice: "CEL-2023-005",
            nome: "Violoncello 'Il Gigante' Modello Gofriller",
            tipologia: "Violoncello",
            modello: "Matteo Gofriller 1700",
            annoCostruzione: 2023,
            prezzo: 32000,
            stato: "Venduto",
            certificato: "Rilasciato a Conservatorio Milano",
            vernice: "Olio trasparente rosso melograno"
        }
    ],
    // 10. Media
    media: [
        {
            id: "med-1",
            titolo: "Dettaglio Filetto e C-Bout Violino Opus 42",
            tipo: "Foto High-Res",
            formato: "JPG / 4K",
            dimensione: "14.2 MB",
            categoria: "Finitura & Dettagli",
            url: "./assets/lutherie_banner.png",
            descrizione: "Macro del filetto a tre strati in acero tinto ed ebano montato su tavola d'abete."
        },
        {
            id: "med-2",
            titolo: "Registrazione Acustica Prova Comparativa Stradivari vs Opus 38",
            tipo: "Audio Lossless",
            formato: "FLAC 24bit/96kHz",
            dimensione: "88.4 MB",
            categoria: "Test Acustici",
            url: "#",
            descrizione: "Esecuzione Ciaccona di Bach in sala acustica. Microfoni Neumann KM184."
        },
        {
            id: "med-3",
            titolo: "Video Timelapse Scultura Fondo in Acero Marezzato",
            tipo: "Video 4K",
            formato: "MP4 H.265",
            dimensione: "420 MB",
            categoria: "Lavorazione Atelier",
            url: "#",
            descrizione: "Processo completo di sgorbiatura e piallatura del fondo in acero durato 18 ore."
        }
    ],
    // 11. Report
    report: [
        {
            id: "rep-1",
            titolo: "Rapporto Annuale Produzione e Ricavi 2025-2026",
            periodo: "Ottobre 2025 - Settembre 2026",
            strumentiCostruiti: 8,
            strumentiRestaurati: 14,
            ricavoTotale: 184500,
            costoMateriali: 28400,
            margineNetto: "84.6%",
            indicatoreTop: "Violini Stradivari Copy e Restauri Violoncelli"
        },
        {
            id: "rep-2",
            titolo: "Monitoraggio Scorte Legname da Risonanza",
            periodo: "Terzo Trimestre 2026",
            strumentiCostruiti: "N/D",
            strumentiRestaurati: "N/D",
            ricavoTotale: "Valore Magazzino: € 64,200",
            costoMateriali: "Tavole Abete: 45 pz | Fondi Acero: 28 pz",
            margineNetto: "Autonomia 5 Anni",
            indicatoreTop: "Abete Val di Fiemme 2010 top qualità"
        }
    ],
    // 12. Restauro
    restauro: [
        {
            id: "res-1",
            codice: "RST-2026-08",
            strumento: "Viola d'Amore Anonima Bolognese (XVIII Secolo)",
            proprietario: "Collezione Privata Marchese de Sanctis",
            diagnosi: "Spaccatura della tavola armonica vicino all'anima, vernice degradata, catena originale collassata.",
            interventiPrevisti: "Apertura cassa, pulizia intercapedini, applicazione tacchetti in abete di risonanza, sostituzione catena acustica.",
            statoIntervento: "In Corso (Fase Tacchetti)",
            preventivo: 4800,
            consegnaPrevista: "2026-10-20"
        },
        {
            id: "res-2",
            codice: "RST-2026-09",
            strumento: "Violoncello Cesare Candi 1920",
            proprietario: "Conservatorio G. Verdi",
            diagnosi: "Usura profonda della tastiera, capotasto scheggiato e montaggio anima fuori asse.",
            interventiPrevisti: "Rettifica tastiera in ebano, nuovo capotasto in osso rigenerato, nuova anima calibrata.",
            statoIntervento: "Completato & Testato",
            preventivo: 1250,
            consegnaPrevista: "2026-09-24"
        }
    ],
    // 13. Social
    social: [
        {
            id: "soc-1",
            piattaforma: "Instagram",
            titolo: "Dettaglio del filetto e riflessi di rifrazione della vernice all'ambra",
            dataProgrammata: "2026-09-28 18:00",
            stato: "Programmato",
            hashtag: "#lutherie #violinmaker #cremona #woodworking #stradivari #artisan",
            likesPrevisti: 1450,
            note: "Foto macro ad alta risoluzione con luce radente calda."
        },
        {
            id: "soc-2",
            piattaforma: "YouTube Showcase",
            titolo: "Prova del Suono: Violino Master Opus 38 vs Violino di Fabbrica",
            dataProgrammata: "2026-10-01 14:00",
            stato: "In Montaggio",
            hashtag: "#soundtest #violin #classicalmusic #luthier #acoustics",
            likesPrevisti: 3800,
            note: "Includere grafico spettrogramma delle armoniche a 440Hz."
        },
        {
            id: "soc-3",
            piattaforma: "Facebook Atelier Page",
            titolo: "Porte Aperte in Atelier: Incontro sulla scelta dei legni da risonanza",
            dataProgrammata: "2026-10-10 10:00",
            stato: "Bozza",
            hashtag: "#atelierliuteria #valdifiemme #artigianatoitaliano",
            likesPrevisti: 600,
            note: "Invitare gli studenti del Conservatorio e collezionisti."
        }
    ]
};

class DataStore {
    constructor() {
        this.data = this.loadData();
    }

    loadData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed.settings) {
                    if (!parsed.settings.homeAssistant) {
                        parsed.settings.homeAssistant = JSON.parse(JSON.stringify(defaultData.settings.homeAssistant));
                    }
                    if (parsed.settings.atelierName === "Atelier Liuteria Master" || !parsed.settings.atelierName) {
                        parsed.settings.atelierName = "Liuteria De Lorenzi";
                    }
                }
                // Align sample appointment to today if still on initial fixture
                if (parsed.calendarioAppuntamenti && Array.isArray(parsed.calendarioAppuntamenti)) {
                    const sample = parsed.calendarioAppuntamenti.find(a => a.id === "app-1" && a.data === "2026-09-29");
                    if (sample) {
                        sample.data = _getTodayIso();
                    }
                }
                return parsed;
            }
        } catch (e) {
            console.warn('Impossibile caricare da LocalStorage, uso i dati predefiniti.', e);
        }
        this.saveData(defaultData);
        return JSON.parse(JSON.stringify(defaultData));
    }

    saveData(dataObj = this.data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataObj));
        } catch (e) {
            console.error('Errore nel salvataggio LocalStorage:', e);
        }
    }

    resetToDefault() {
        this.data = JSON.parse(JSON.stringify(defaultData));
        this.saveData();
        if (window.appController && window.appController.updateHeaderStats) {
            window.appController.updateHeaderStats();
        }
    }

    getItem(collection, id) {
        if (!this.data[collection]) return null;
        return this.data[collection].find(item => item.id === id);
    }

    addItem(collection, item) {
        if (!this.data[collection]) {
            this.data[collection] = [];
        }
        this.data[collection].unshift(item);
        this.saveData();
        if (window.appController && window.appController.updateHeaderStats) {
            window.appController.updateHeaderStats();
        }
    }

    updateItem(collection, id, updatedFields) {
        if (!this.data[collection]) return false;
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[collection][index] = { ...this.data[collection][index], ...updatedFields };
            this.saveData();
            if (window.appController && window.appController.updateHeaderStats) {
                window.appController.updateHeaderStats();
            }
            return true;
        }
        return false;
    }

    removeItem(collection, id) {
        if (!this.data[collection]) return false;
        this.data[collection] = this.data[collection].filter(item => item.id !== id);
        this.saveData();
        if (window.appController && window.appController.updateHeaderStats) {
            window.appController.updateHeaderStats();
        }
        return true;
    }
}

window.atelierDB = new DataStore();
