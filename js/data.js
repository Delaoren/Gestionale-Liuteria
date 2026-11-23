/**
 * Data store with persistent LocalStorage support for Liuteria De Lorenzi Gestionale
 */
const STORAGE_KEY = 'liuteria_gestionale_db_v1';

window.escapeHtml = window.escapeHtml || function(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
};

const _getTodayIso = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
};

const _getFutureDateTimeIso = (daysAhead = 2, timeStr = "18:00") => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}T${timeStr}`;
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
            sourceType: "mqtt",
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
        },
        socialIntegration: {
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
        },
        sendinblue: {
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
        },
        mailAccounts: {
            gmail: {
                id: "gmail",
                email: "liuteriadelorenzi@gmail.com",
                label: "Gmail Bottega",
                provider: "gmail",
                enabled: false,
                imapHost: "imap.gmail.com",
                imapPort: 993,
                imapSsl: true,
                smtpHost: "smtp.gmail.com",
                smtpPort: 465,
                smtpSsl: true,
                username: "liuteriadelorenzi@gmail.com",
                detectForwardedDomain: true,
                hasPassword: false,
                status: "unconfigured",
                lastSync: "",
                lastError: ""
            },
            domain: {
                id: "domain",
                email: "info@liuteriadelorenzi.it",
                label: "Dominio Ufficiale (.it)",
                provider: "custom_imap",
                enabled: false,
                imapHost: "mail.liuteriadelorenzi.it",
                imapPort: 993,
                imapSsl: true,
                smtpHost: "mail.liuteriadelorenzi.it",
                smtpPort: 465,
                smtpSsl: true,
                username: "info@liuteriadelorenzi.it",
                forwardedToGmail: false,
                hasPassword: false,
                status: "unconfigured",
                lastSync: "",
                lastError: ""
            }
        },
        noleggioReminderTemplate: {
            customSubject: "",
            customBodyText: ""
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
        },
        {
            id: "bib-5",
            titolo: "Guida Tecnica ai Pattern di Chladni e Analisi Modale (M1, M2, M5)",
            autore: "Liuteria Making — Laboratorio Acustico",
            categoria: "Analisi Scientifica",
            anno: 2026,
            formato: "PDF (.pdf)",
            pagine: 28,
            note: "Manuale operativo integrato da Liuteria Making per l'identificazione dei nodi modali M1, M2, M5 e delle risonanze di cavità B1- / B1+ su tavole e fondi.",
            tags: ["Chladni", "FFT", "M2", "M5", "LiuteriaMaking"],
            fileName: "ChladniGuide.pdf",
            fileExt: "pdf",
            fileMime: "application/pdf",
            fileSizeBytes: 1631779,
            fileSizeFormatted: "1.56 MB",
            fileUrl: "./assets/ChladniGuide.pdf",
            isIndexedDB: false
        }
    ],
    // 2. Calendario appuntamenti
    calendarioAppuntamenti: [
        {
            id: "app-1",
            cliente: "Maestro Marco Rossi (Primo Violino)",
            emailCliente: "m.rossi.violin@orchestra.it",
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
            emailCliente: "amministrazione@fiorentina-orchestra.it",
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
            emailCliente: "elena.moretti@cello.edu",
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
    // 4. Certificati (Certificates of Authenticity & Expertise)
    certificati: [
        {
            id: "cert-1",
            numeroCertificato: "CERT-2026-001",
            dataEmissione: _getTodayIso(),
            luogoEmissione: "Bottega Liuteria De Lorenzi",
            tipologiaCertificato: "Certificato di Autenticità d'Autore",
            strumento: "Violino Master 'La Fenice' Opus 38",
            tipologiaStrumento: "Violino 4/4",
            modello: "Ispirato ad Antonio Stradivari 1715 'Il Cremonese'",
            annoCostruzione: "2024",
            autore: "Maestro Fabio De Lorenzi",
            etichetta: "Fabio De Lorenzi fecit anno Domini 2024 — Opus XXXVIII",
            statoConservazione: "Eccellente — Stato Integro d'Autore",
            noteConservazione: "Strumento in perfetto stato di conservazione, integro in ogni sua parte originale. Tavola armonica in abete rosso della Val di Fiemme a venatura medio-fina regolare; fondo in due pezzi di acero marezzato balcanico a fiammatura profonda ascendente. Vernice originale ad olio d'ambra di colore arancio-dorato su fondo ambrato luminoso.",
            bioAutore: "Il Maestro Liutaio Fabio De Lorenzi dedica la propria ricerca all'arte liutaria classica italiana, coniugando il metodo costruttivo tradizionale cremonese con lo studio acustico-modale dei legni da risonanza stagionati naturalmente. Ogni strumento è interamente scolpito e verniciato a mano nella propria bottega.",
            destinatario: "Maestro Marco Rossi",
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
                { url: "./assets/violin-1.jpg", didascalia: "Tavola Armonica (Vista Frontale)" },
                { url: "./assets/cremonese.jpg", didascalia: "Fondo in Acero Marezzato & Profilo" },
                { url: "./assets/craft-1.jpg", didascalia: "Dettaglio Scultura Riccio e Filettatura" }
            ]
        },
        {
            id: "cert-2",
            numeroCertificato: "CERT-2026-002",
            dataEmissione: "2026-10-12",
            luogoEmissione: "Bottega Liuteria De Lorenzi",
            tipologiaCertificato: "Perizia Tecnica & Stato di Conservazione",
            strumento: "Viola d'Arco 'Gaspare' 41.5 cm",
            tipologiaStrumento: "Viola",
            modello: "Modello Gaspare da Salò (Brescia)",
            annoCostruzione: "2025",
            autore: "Maestro Fabio De Lorenzi",
            etichetta: "Fabio De Lorenzi fecit anno 2025 — Modello Gaspare da Salò",
            statoConservazione: "Ottimo — Pari al Nuovo",
            noteConservazione: "Cassa armonica perfettamente integra, priva di fessurazioni o restauri. Tavola in abete di Paneveggio e fondo in pioppo marezzato maschio selezionato per la ricchezza timbrica nel registro grave. Vernice a spirito e resine naturali di tonalità bruno-ambrata calda.",
            bioAutore: "Il Maestro Liutaio Fabio De Lorenzi realizza violini, viole e violoncelli da concerto seguendo la grande tradizione liutaria italiana, con particolare attenzione alla proiezione sonora, alla prontezza d'emissione e alla formulazione storica delle vernici naturali.",
            destinatario: "Conservatorio G. Verdi - Prof.ssa Bianchi",
            misure: {
                lunghezzaCassa: "415.0 mm",
                larghezzaSuperiore: "198.0 mm",
                larghezzaCC: "134.0 mm",
                larghezzaInferiore: "246.0 mm",
                altezzaFasceSup: "37.5 mm",
                altezzaFasceInf: "39.5 mm",
                diapason: "223.0 mm",
                lunghezzaManico: "148.0 mm"
            },
            fotografie: [
                { url: "./assets/viola-1.jpg", didascalia: "Tavola Armonica e C-Bouts" },
                { url: "./assets/craft-2.jpg", didascalia: "Dettaglio Vernice e Bombatura" }
            ]
        }
    ],
    // 5. Clienti
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
    // 5b. Costi Laboratorio
    costiLaboratorio: [],
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
            piattaforma: "Instagram, Facebook",
            piattaforme: ["Instagram", "Facebook"],
            formatoPost: "Carosello Foto High-Res",
            titolo: "Dettaglio del filetto e riflessi di rifrazione della vernice all'ambra",
            dataProgrammata: _getFutureDateTimeIso(2, "18:00"),
            stato: "Programmato",
            autoPublish: true,
            hashtag: "#lutherie #violinmaker #cremona #woodworking #stradivari #artisan",
            likesPrevisti: 1450,
            note: "Foto macro ad alta risoluzione con luce radente calda. Mostrare l'incastro del filetto in ebano e pero sulle punte.",
            mediaAttachments: [
                {
                    id: "smed-default-1",
                    name: "dettaglio_filetto_vernice_4k.jpg",
                    kind: "image",
                    mimeType: "image/jpeg",
                    sizeBytes: 18454937,
                    sizeFormatted: "17.6 MB",
                    dimensions: "4000×3000 px",
                    url: "./assets/craft-1.jpg",
                    thumbnailDataUrl: "./assets/craft-1.jpg",
                    isIndexedDB: false
                },
                {
                    id: "smed-default-2",
                    name: "fondo_acero_marezzato_macro.jpg",
                    kind: "image",
                    mimeType: "image/jpeg",
                    sizeBytes: 15204352,
                    sizeFormatted: "14.5 MB",
                    dimensions: "3840×2160 px",
                    url: "./assets/cremonese.jpg",
                    thumbnailDataUrl: "./assets/cremonese.jpg",
                    isIndexedDB: false
                }
            ]
        },
        {
            id: "soc-2",
            piattaforma: "YouTube, Instagram, TikTok",
            piattaforme: ["YouTube", "Instagram", "TikTok"],
            formatoPost: "Video 4K / Reel Showcase",
            titolo: "Prova del Suono & Scultura: Violino Master Opus 38 in Sala Acustica",
            dataProgrammata: _getFutureDateTimeIso(5, "14:00"),
            stato: "Programmato",
            autoPublish: true,
            hashtag: "#soundtest #violin #classicalmusic #luthier #acoustics #4kvideo",
            likesPrevisti: 3800,
            note: "Video 4K masterizzato con microfoni Neumann KM184 e grafico spettrogramma delle armoniche a 440Hz.",
            mediaAttachments: [
                {
                    id: "smed-default-3",
                    name: "showcase_acustico_opus38_4k_master.mp4",
                    kind: "video",
                    mimeType: "video/mp4",
                    sizeBytes: 440401920,
                    sizeFormatted: "420.0 MB",
                    dimensions: "3840×2160 (4K UHD)",
                    duration: "03:42",
                    url: "",
                    thumbnailDataUrl: "./assets/violin-1.jpg",
                    isIndexedDB: false
                }
            ]
        },
        {
            id: "soc-3",
            piattaforma: "Facebook, LinkedIn",
            piattaforme: ["Facebook", "LinkedIn"],
            formatoPost: "Evento & Galleria Fotografica",
            titolo: "Porte Aperte in Atelier: Incontro sulla scelta dei legni da risonanza",
            dataProgrammata: _getFutureDateTimeIso(10, "10:00"),
            stato: "Bozza",
            autoPublish: false,
            hashtag: "#atelierliuteria #valdifiemme #artigianatoitaliano #tonewood",
            likesPrevisti: 600,
            note: "Invitare gli studenti del Conservatorio, solisti e collezionisti.",
            mediaAttachments: [
                {
                    id: "smed-default-4",
                    name: "atelier_legni_risonanza_banner.png",
                    kind: "image",
                    mimeType: "image/png",
                    sizeBytes: 9437184,
                    sizeFormatted: "9.0 MB",
                    dimensions: "2560×1440 px",
                    url: "./assets/lutherie_banner.png",
                    thumbnailDataUrl: "./assets/lutherie_banner.png",
                    isIndexedDB: false
                }
            ]
        }
    ],
    // 15. Liuteria Making (CAD 3D Parametrico, Analisi Acustica FFT, Chladni & Database Fisico Legni)
    liuteriaMaking: {
        activeInstrumentType: "violin",
        selectedTopWood: "Abete di Paneveggio",
        selectedBackWood: "Acero marezzato",
        measurements: {
            violin: {
                rib_height: 30.0, rib_thickness: 1.2,
                top_center: 2.8, top_upper: 2.5, top_lower: 2.5, top_f_holes: 2.3, edge_height: 4.5,
                back_center: 4.2, back_upper: 3.5, back_lower: 3.5,
                body_length: 356.0, upper_bout_width: 168.0, lower_bout_width: 208.0, waist_width: 110.0,
                f_hole_length: 76.0, f_hole_width: 6.5, f_hole_position: 195.0,
                purfling_depth: 2.0,
                neck_length: 130.0, pegbox_width: 42.0, neck_cheek_thickness: 20.0,
                corner_length: 15.0
            },
            viola: {
                rib_height: 37.0, rib_thickness: 1.3,
                top_center: 3.0, top_upper: 2.7, top_lower: 2.7, top_f_holes: 2.4, edge_height: 5.0,
                back_center: 4.5, back_upper: 3.8, back_lower: 3.8,
                body_length: 410.0, upper_bout_width: 195.0, lower_bout_width: 245.0, waist_width: 135.0,
                f_hole_length: 82.0, f_hole_width: 7.0, f_hole_position: 210.0,
                purfling_depth: 2.0,
                neck_length: 152.0, pegbox_width: 46.0, neck_cheek_thickness: 23.0,
                corner_length: 16.0
            },
            cello: {
                rib_height: 118.0, rib_thickness: 1.8,
                top_center: 4.5, top_upper: 3.8, top_lower: 3.8, top_f_holes: 3.2, edge_height: 7.0,
                back_center: 6.0, back_upper: 5.0, back_lower: 5.0,
                body_length: 755.0, upper_bout_width: 340.0, lower_bout_width: 440.0, waist_width: 240.0,
                f_hole_length: 128.0, f_hole_width: 11.0, f_hole_position: 370.0,
                purfling_depth: 2.5,
                neck_length: 285.0, pegbox_width: 75.0, neck_cheek_thickness: 42.0,
                corner_length: 22.0
            }
        },
        woods: [
            { id: "w-1", name: "Abete rosso (Picea abies)", density_kg_m3: 440, elastic_modulus_long: 12.8, elastic_modulus_trans: 0.7, sound_velocity: 5400, damping_factor: 0.008, notes: "Tavola armonica - standard liuteria classica", is_custom: false },
            { id: "w-2", name: "Abete di Paneveggio", density_kg_m3: 420, elastic_modulus_long: 13.5, elastic_modulus_trans: 0.65, sound_velocity: 5600, damping_factor: 0.006, notes: "Abete di risonanza della Val di Fiemme", is_custom: false },
            { id: "w-3", name: "Acero montano (Acer pseudoplatanus)", density_kg_m3: 660, elastic_modulus_long: 10.7, elastic_modulus_trans: 1.6, sound_velocity: 4000, damping_factor: 0.012, notes: "Fondo, fasce, manico - standard liuteria", is_custom: false },
            { id: "w-4", name: "Acero marezzato", density_kg_m3: 680, elastic_modulus_long: 10.2, elastic_modulus_trans: 1.8, sound_velocity: 3900, damping_factor: 0.013, notes: "Fondo con marezzatura pronunciata", is_custom: false },
            { id: "w-5", name: "Ebano (Diospyros ebenum)", density_kg_m3: 1150, elastic_modulus_long: 17.0, elastic_modulus_trans: 2.5, sound_velocity: 3800, damping_factor: 0.015, notes: "Tastiera, piroli, mentoniera, bottone", is_custom: false },
            { id: "w-6", name: "Palissandro (Dalbergia nigra)", density_kg_m3: 850, elastic_modulus_long: 13.9, elastic_modulus_trans: 2.0, sound_velocity: 4000, damping_factor: 0.014, notes: "Tastiera alternativa, accessori", is_custom: false },
            { id: "w-7", name: "Bosso (Buxus sempervirens)", density_kg_m3: 910, elastic_modulus_long: 8.9, elastic_modulus_trans: 1.4, sound_velocity: 3100, damping_factor: 0.016, notes: "Piroli, bottone, accessori barocchi", is_custom: false },
            { id: "w-8", name: "Pioppo (Populus spp.)", density_kg_m3: 380, elastic_modulus_long: 8.5, elastic_modulus_trans: 0.5, sound_velocity: 4700, damping_factor: 0.010, notes: "Fondo e fasce - strumenti storici veneziani", is_custom: false },
            { id: "w-9", name: "Salice (Salix alba)", density_kg_m3: 400, elastic_modulus_long: 7.8, elastic_modulus_trans: 0.45, sound_velocity: 4400, damping_factor: 0.011, notes: "Blocchetti interni, controfasce", is_custom: false },
            { id: "w-10", name: "Cedro (Cedrus libani)", density_kg_m3: 490, elastic_modulus_long: 9.8, elastic_modulus_trans: 0.6, sound_velocity: 4500, damping_factor: 0.009, notes: "Tavola armonica per chitarra classica", is_custom: false },
            { id: "w-11", name: "Abete Sitka (Picea sitchensis)", density_kg_m3: 380, elastic_modulus_long: 11.6, elastic_modulus_trans: 0.6, sound_velocity: 5500, damping_factor: 0.007, notes: "Tavola armonica alternativa, chitarra", is_custom: false },
            { id: "w-12", name: "Cipresso (Cupressus sempervirens)", density_kg_m3: 510, elastic_modulus_long: 9.5, elastic_modulus_trans: 0.55, sound_velocity: 4300, damping_factor: 0.010, notes: "Fondo e fasce chitarra, liuto", is_custom: false },
            { id: "w-13", name: "Pero (Pyrus communis)", density_kg_m3: 700, elastic_modulus_long: 9.2, elastic_modulus_trans: 1.3, sound_velocity: 3600, damping_factor: 0.014, notes: "Utilizzato in strumenti storici", is_custom: false },
            { id: "w-14", name: "Noce (Juglans regia)", density_kg_m3: 640, elastic_modulus_long: 11.6, elastic_modulus_trans: 1.1, sound_velocity: 4200, damping_factor: 0.012, notes: "Fasce, fondo - liuto, mandolino", is_custom: false },
            { id: "w-15", name: "Mogano (Swietenia macrophylla)", density_kg_m3: 540, elastic_modulus_long: 10.1, elastic_modulus_trans: 0.8, sound_velocity: 4300, damping_factor: 0.011, notes: "Manico chitarra, fondo", is_custom: false },
            { id: "w-16", name: "Tiglio (Tilia europaea)", density_kg_m3: 520, elastic_modulus_long: 8.0, elastic_modulus_trans: 0.5, sound_velocity: 3900, damping_factor: 0.012, notes: "Blocchetti interni, controfasce, sculture", is_custom: false },
            { id: "w-17", name: "Cirmolo (Pinus cembra)", density_kg_m3: 430, elastic_modulus_long: 10.0, elastic_modulus_trans: 0.55, sound_velocity: 4800, damping_factor: 0.009, notes: "Utilizzato in viola da gamba e strumenti barocchi", is_custom: false },
            { id: "w-18", name: "Carpino (Carpinus betulus)", density_kg_m3: 740, elastic_modulus_long: 12.5, elastic_modulus_trans: 1.7, sound_velocity: 4100, damping_factor: 0.013, notes: "Meccaniche di pianoforte, accessori strumenti", is_custom: false },
            { id: "w-19", name: "Cocobolo (Dalbergia retusa)", density_kg_m3: 1100, elastic_modulus_long: 18.1, elastic_modulus_trans: 2.3, sound_velocity: 4100, damping_factor: 0.014, notes: "Accessori di pregio, archetti", is_custom: false },
            { id: "w-20", name: "Pernambuco (Paubrasilia echinata)", density_kg_m3: 950, elastic_modulus_long: 19.5, elastic_modulus_trans: 2.1, sound_velocity: 4500, damping_factor: 0.008, notes: "Bacchetta archetto - standard professionale", is_custom: false }
        ],
        historicalInstruments: [
            {
                id: "hist-1",
                name: "Stradivari 'Il Cremonese' 1715",
                instrument_type: "violino",
                m1_freq: 100.0, m2_freq: 145.0, m5_freq: 340.0,
                b1_minus_freq: 430.0, b1_plus_freq: 540.0,
                notes: "Dati medi da letteratura tecnica standard (Forma G Cremonese)."
            },
            {
                id: "hist-2",
                name: "Guarneri del Gesù 'Il Cannone' 1743",
                instrument_type: "violino",
                m1_freq: 105.0, m2_freq: 155.0, m5_freq: 365.0,
                b1_minus_freq: 440.0, b1_plus_freq: 555.0,
                notes: "Caratterizzato da spessori maggiorati e risposta energica sulle alte frequenze."
            },
            {
                id: "hist-3",
                name: "A. Amati 'Stauffer' 1560",
                instrument_type: "viola",
                m1_freq: 85.0, m2_freq: 125.0, m5_freq: 280.0,
                b1_minus_freq: 350.0, b1_plus_freq: 420.0,
                notes: "Viola tenore classica cremonese."
            },
            {
                id: "hist-4",
                name: "D. Montagnana 'Sleeping Beauty' 1739",
                instrument_type: "violoncello",
                m1_freq: 58.0, m2_freq: 88.0, m5_freq: 185.0,
                b1_minus_freq: 172.0, b1_plus_freq: 225.0,
                notes: "Violoncello veneziano a cassa larga con profonda risonanza di cavità."
            }
        ],
        archivedInstruments: [
            {
                id: "lm-inst-1",
                name: "Provanone (Archivio Liuteria Making)",
                instrument_type: "violin",
                production_date: "07/03/2026",
                owner_name: "Atelier Liuteria De Lorenzi",
                owner_phone: "+39 0372 000000",
                owner_email: "fabio.delorenzi@gmail.com",
                notes: "Sperimentazione sugli spessori della tavola armonica (importato dal database SQLite di Liuteria Making).",
                measurements: {
                    rib_height: 30.0, rib_thickness: 1.2,
                    top_center: 2.8, top_upper: 2.4, top_lower: 2.4, top_f_holes: 2.3, edge_height: 4.5,
                    back_center: 4.3, back_upper: 3.5, back_lower: 3.5,
                    body_length: 356.0, upper_bout_width: 168.0, lower_bout_width: 208.0, waist_width: 110.0,
                    f_hole_length: 76.0, f_hole_width: 6.5, f_hole_position: 195.0,
                    purfling_depth: 2.0, neck_length: 130.0, pegbox_width: 42.0, neck_cheek_thickness: 20.0, corner_length: 15.0
                },
                restorations: [
                    {
                        id: "lm-rest-1",
                        intervention_type: "Calibrazione spessori polmone inferiore e controllo tap-tone M5 (346 Hz)",
                        intervention_date: "2026-03-07"
                    }
                ],
                savedSpectrums: [
                    {
                        id: "spec-1",
                        label: "Tap-Tone Tavola Libera (Modo M5 F#)",
                        created_at: "2026-03-07 10:15",
                        fundamental: 346.0,
                        peaks: [148.0, 346.0, 438.0, 542.0, 692.0]
                    }
                ]
            },
            {
                id: "lm-inst-2",
                name: "Opus 42 - Violino Modello Guarneri 'Il Cannone'",
                instrument_type: "violin",
                production_date: "25/09/2026",
                owner_name: "Maestro Marco Rossi",
                owner_phone: "+39 348 9123456",
                owner_email: "m.rossi.violin@orchestra.it",
                notes: "Tavola in Abete di Paneveggio 2012 (M5 = 358 Hz) e Fondo in Acero Marezzato Balcanico.",
                measurements: {
                    rib_height: 31.0, rib_thickness: 1.2,
                    top_center: 3.0, top_upper: 2.6, top_lower: 2.6, top_f_holes: 2.5, edge_height: 4.6,
                    back_center: 4.5, back_upper: 3.7, back_lower: 3.6,
                    body_length: 354.0, upper_bout_width: 167.0, lower_bout_width: 207.0, waist_width: 112.0,
                    f_hole_length: 77.0, f_hole_width: 6.8, f_hole_position: 194.0,
                    purfling_depth: 2.0, neck_length: 130.0, pegbox_width: 42.0, neck_cheek_thickness: 20.5, corner_length: 14.0
                },
                restorations: [],
                    savedSpectrums: [
                        {
                            id: "spec-2",
                            label: "Analisi Spettrale Cassa Chiusa (B1- / B1+)",
                            created_at: "2026-09-29 16:40",
                            fundamental: 440.0,
                            peaks: [154.0, 362.0, 440.0, 552.0, 880.0]
                        }
                    ]
                }
            ]
        },
        // 15. Mail (liuteriadelorenzi@gmail.com & info@liuteriadelorenzi.it)
        mail: [],
        // 16. Noleggio Strumenti
        noleggio: []
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
                    if (!parsed.settings.socialIntegration) {
                        parsed.settings.socialIntegration = JSON.parse(JSON.stringify(defaultData.settings.socialIntegration));
                    }
                    if (!parsed.settings.sendinblue) {
                        parsed.settings.sendinblue = JSON.parse(JSON.stringify(defaultData.settings.sendinblue));
                    }
                    if (!parsed.settings.mailAccounts) {
                        parsed.settings.mailAccounts = JSON.parse(JSON.stringify(defaultData.settings.mailAccounts));
                    }
                    if (!parsed.settings.noleggioReminderTemplate) {
                        parsed.settings.noleggioReminderTemplate = { customSubject: "", customBodyText: "" };
                    }
                    if (parsed.settings.atelierName === "Atelier Liuteria Master" || !parsed.settings.atelierName) {
                        parsed.settings.atelierName = "Liuteria De Lorenzi";
                    }
                }
                if (!Array.isArray(parsed.mail)) {
                    parsed.mail = [];
                } else {
                    parsed.mail = parsed.mail.filter(m => m && !String(m.id || "").startsWith("mail-init-"));
                }
                if (!Array.isArray(parsed.costiLaboratorio)) {
                    parsed.costiLaboratorio = [];
                }
                if (!Array.isArray(parsed.noleggio)) {
                    parsed.noleggio = [];
                }
                if (!parsed.liuteriaMaking || !parsed.liuteriaMaking.measurements) {
                    parsed.liuteriaMaking = JSON.parse(JSON.stringify(defaultData.liuteriaMaking));
                }
                if (Array.isArray(parsed.biblioteca) && !parsed.biblioteca.some(b => b.id === "bib-5")) {
                    const bib5 = defaultData.biblioteca.find(b => b.id === "bib-5");
                    if (bib5) parsed.biblioteca.push(JSON.parse(JSON.stringify(bib5)));
                }
                // Align sample appointment to today if still on initial fixture
                if (parsed.calendarioAppuntamenti && Array.isArray(parsed.calendarioAppuntamenti)) {
                    const sample = parsed.calendarioAppuntamenti.find(a => a.id === "app-1" && a.data === "2026-09-29");
                    if (sample) {
                        sample.data = _getTodayIso();
                    }
                }
                if (!parsed.certificati || !Array.isArray(parsed.certificati)) {
                    parsed.certificati = JSON.parse(JSON.stringify(defaultData.certificati));
                    this.saveData(parsed);
                } else {
                    parsed.certificati.forEach(c => {
                        if (Array.isArray(c.fotografie)) {
                            c.fotografie.forEach(f => {
                                if (f.url && f.url.startsWith('/assets/')) {
                                    f.url = '.' + f.url;
                                }
                            });
                        }
                    });
                }
                if (Array.isArray(parsed.social)) {
                    parsed.social.forEach((s, idx) => {
                        const defItem = defaultData.social.find(d => d.id === s.id) || defaultData.social[idx];
                        if (!Array.isArray(s.piattaforme) || s.piattaforme.length === 0) {
                            if (defItem && Array.isArray(defItem.piattaforme)) {
                                s.piattaforme = [...defItem.piattaforme];
                                s.piattaforma = defItem.piattaforma;
                            } else if (s.piattaforma) {
                                s.piattaforme = s.piattaforma.split(',').map(p => p.trim()).filter(Boolean);
                            } else {
                                s.piattaforme = ["Instagram"];
                            }
                        }
                        if (!Array.isArray(s.mediaAttachments)) {
                            s.mediaAttachments = (defItem && Array.isArray(defItem.mediaAttachments))
                                ? JSON.parse(JSON.stringify(defItem.mediaAttachments))
                                : [];
                        }
                        if (s.autoPublish === undefined) {
                            s.autoPublish = s.stato === "Programmato";
                        }
                        if (!s.formatoPost && defItem && defItem.formatoPost) {
                            s.formatoPost = defItem.formatoPost;
                        }
                        if (s.dataProgrammata === "2026-09-28 18:00" || s.dataProgrammata === "2026-10-01 14:00" || s.dataProgrammata === "2026-10-10 10:00") {
                            if (defItem) s.dataProgrammata = defItem.dataProgrammata;
                        }
                    });
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
        this._scheduleSingletonSync();
    }

    _scheduleSingletonSync() {
        if (this._isSyncingFromRemote || !this.data) return;
        clearTimeout(this._singletonSyncTimer);
        this._singletonSyncTimer = setTimeout(() => {
            if (this.data.liuteriaMaking) {
                this.syncCollectionToMongo('liuteriaMaking');
            }
            if (this.data.settings) {
                this.syncCollectionToMongo('settings');
            }
        }, 500);
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
        const stamped = { ...item, updatedAt: item.updatedAt || new Date().toISOString() };
        this.data[collection].unshift(stamped);
        this.saveData();
        this.upsertToMongo(collection, stamped);
        if (window.appController && window.appController.updateHeaderStats) {
            window.appController.updateHeaderStats();
        }
    }

    updateItem(collection, id, updatedFields) {
        if (!this.data[collection]) return false;
        const index = this.data[collection].findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[collection][index] = {
                ...this.data[collection][index],
                ...updatedFields,
                updatedAt: new Date().toISOString()
            };
            this.saveData();
            this.upsertToMongo(collection, this.data[collection][index]);
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
        this.deleteFromMongo(collection, id);
        if (window.appController && window.appController.updateHeaderStats) {
            window.appController.updateHeaderStats();
        }
        return true;
    }

    deleteItem(collection, id) {
        return this.removeItem(collection, id);
    }

    async syncCollectionToMongo(collection) {
        if (!this.data || !this.data[collection]) return;
        try {
            await fetch(`/api/db/${encodeURIComponent(collection)}/sync`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: this.data[collection] })
            });
        } catch (e) {
            // Modalità offline / statica
        }
    }

    async upsertToMongo(collection, item) {
        if (!item) return;
        try {
            await fetch(`/api/db/${encodeURIComponent(collection)}/upsert`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item })
            });
        } catch (e) {
            // Modalità offline / statica
        }
    }

    async deleteFromMongo(collection, id) {
        if (!id) return;
        try {
            await fetch(`/api/db/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`, {
                method: 'DELETE'
            });
        } catch (e) {
            // Modalità offline / statica
        }
    }

    async syncFromMongo() {
        try {
            const res = await fetch('/api/db/all');
            if (!res.ok) return false;
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            if (!ct.includes('application/json')) return false;
            const payload = await res.json();
            if (!payload || !payload.mongo || !payload.data) return false;

            const remote = payload.data;
            let changed = false;

            Object.keys(this.data).forEach(key => {
                if (Array.isArray(remote[key]) && remote[key].length > 0) {
                    const localArr = Array.isArray(this.data[key]) ? this.data[key] : [];
                    const localById = new Map(localArr.filter(x => x && x.id).map(x => [x.id, x]));
                    const merged = [];
                    const seenIds = new Set();

                    remote[key].forEach(remItem => {
                        if (!remItem || !remItem.id) {
                            merged.push(remItem);
                            return;
                        }
                        if (key === 'mail' && String(remItem.id).startsWith('mail-init-')) {
                            this.deleteFromMongo('mail', remItem.id);
                            changed = true;
                            return;
                        }
                        seenIds.add(remItem.id);
                        const locItem = localById.get(remItem.id);
                        if (locItem && locItem.updatedAt && remItem.updatedAt && new Date(locItem.updatedAt) > new Date(remItem.updatedAt)) {
                            // Il record locale è più recente: mantieni il locale e aggiorna MongoDB
                            merged.push(locItem);
                            this.upsertToMongo(key, locItem);
                        } else {
                            merged.push(remItem);
                            if (!locItem || JSON.stringify(locItem) !== JSON.stringify(remItem)) {
                                changed = true;
                            }
                        }
                    });

                    // Conserva eventuali elementi locali creati offline non ancora su MongoDB
                    localArr.forEach(locItem => {
                        if (locItem && locItem.id && !seenIds.has(locItem.id) && locItem.updatedAt) {
                            merged.unshift(locItem);
                            this.upsertToMongo(key, locItem);
                        }
                    });

                    this.data[key] = merged;
                } else if (!Array.isArray(this.data[key]) && remote[key] && typeof remote[key] === 'object') {
                    const locTs = this.data[key] && this.data[key].updatedAt ? new Date(this.data[key].updatedAt).getTime() : 0;
                    const remTs = remote[key].updatedAt ? new Date(remote[key].updatedAt).getTime() : 0;
                    if (locTs > remTs && locTs > 0) {
                        this.syncCollectionToMongo(key);
                    } else {
                        this.data[key] = { ...this.data[key], ...remote[key] };
                        changed = true;
                    }
                } else if ((Array.isArray(this.data[key]) && this.data[key].length > 0) || (!Array.isArray(this.data[key]) && this.data[key])) {
                    // Collezioni presenti solo in locale: inizializza MongoDB
                    this.syncCollectionToMongo(key);
                }
            });

            if (changed) {
                this._isSyncingFromRemote = true;
                this.saveData();
                this._isSyncingFromRemote = false;
                if (window.appController) {
                    if (window.appController.updateHeaderStats) window.appController.updateHeaderStats();
                    if (window.appController.activeModuleId && window.appController.renderActiveModule) {
                        window.appController.renderActiveModule();
                    }
                }
            }
            return true;
        } catch (e) {
            return false;
        }
    }
}

window.atelierDB = new DataStore();
