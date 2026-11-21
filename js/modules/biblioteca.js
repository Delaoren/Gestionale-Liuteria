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

    if (autoSaveExtraFiles && files.length > 1 && typeof window.syncBibliotecaToServer === "function") {
        window.syncBibliotecaToServer();
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
    if (typeof window.syncBibliotecaToServer === "function") {
        window.syncBibliotecaToServer();
    }
    window.showToast("Volume rimosso dalla Biblioteca.");
    if (window.appController && window.appController.activeModuleId === "biblioteca") {
        window.appController.openModule("biblioteca");
    }
};

window.syncBibliotecaToServer = async function() {
    if (!window.atelierDB || !window.atelierDB.data) return;
    try {
        await fetch("/api/biblioteca/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: window.atelierDB.data.biblioteca || [] })
        });
    } catch (e) {
        // Modalità statica offline
    }
};

window.syncBibliotecaFromServer = async function(showFeedback = false) {
    if (!window.atelierDB || !window.atelierDB.data) return;
    try {
        const res = await fetch("/api/biblioteca/state");
        if (!res.ok) return;
        const ct = (res.headers.get("content-type") || "").toLowerCase();
        if (!ct.includes("application/json")) return;
        const data = await res.json();
        if (!data || !data.success || !Array.isArray(data.items)) return;

        const localList = Array.isArray(window.atelierDB.data.biblioteca) ? window.atelierDB.data.biblioteca : [];
        let changed = false;
        let restoredCount = 0;

        data.items.forEach(srvItem => {
            if (!srvItem || typeof srvItem !== "object") return;
            const matchIdx = localList.findIndex(loc =>
                (srvItem.id && loc.id === srvItem.id) ||
                (srvItem.fileId && loc.fileId && loc.fileId === srvItem.fileId) ||
                (srvItem.fileUrl && loc.fileUrl && loc.fileUrl === srvItem.fileUrl)
            );
            if (matchIdx === -1) {
                localList.push(srvItem);
                changed = true;
                restoredCount++;
            } else {
                // Aggiorna eventuale fileUrl mancante o vecchio percorso /biblioteca_uploads/
                const loc = localList[matchIdx];
                if (!loc.fileUrl && srvItem.fileUrl) {
                    loc.fileUrl = srvItem.fileUrl;
                    changed = true;
                }
            }
        });

        if (changed) {
            window.atelierDB.data.biblioteca = localList;
            window.atelierDB.saveData();
            if (window.appController && window.appController.activeModuleId === "biblioteca") {
                const container = document.getElementById("moduleContentContainer");
                if (container && window.AppModules && window.AppModules.renderBiblioteca) {
                    window.AppModules.renderBiblioteca(container);
                    window.appController.setupLucideIcons();
                }
            }
            if (restoredCount > 0) {
                window.showToast(`📚 Ripristinati ${restoredCount} testi/volumi dall'archivio server!`);
            }
        } else if (showFeedback) {
            window.showToast("Biblioteca già sincronizzata con il server.");
        }

        // Se il server aveva meno schede di quelle locali, allinea il server
        if (localList.length > data.items.length) {
            window.syncBibliotecaToServer();
        }
    } catch (e) {
        // Modalità statica offline
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
    const candidates = [];
    if (item.fileUrl) {
        candidates.push(item.fileUrl);
        if (item.fileUrl.startsWith("/biblioteca_uploads/")) {
            const fname = item.fileUrl.slice("/biblioteca_uploads/".length);
            candidates.push("/api/biblioteca/file/" + fname);
        }
    } else if (item.fileId && item.fileName) {
        const safeName = item.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        candidates.push(`/api/biblioteca/file/${item.fileId}_${safeName}`);
    }

    const isHtmlDoc = /\.(html?|xhtml)$/i.test(item.fileName || item.fileExt || "");
    for (const candidateUrl of candidates) {
        try {
            const r = await fetch(candidateUrl);
            if (!r.ok) continue;
            const ct = (r.headers.get("content-type") || "").toLowerCase();
            if (!isHtmlDoc && ct.includes("text/html")) {
                // Evita falsi positivi dal fallback SPA di Vite/Nginx
                continue;
            }
            const b = await r.blob();
            return { url: candidateUrl, blob: b };
        } catch (e) {
            // prova il prossimo candidato
        }
    }
    return { url: item.fileUrl || "", blob: null };
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

    let ext = (item.fileExt || (item.fileName && item.fileName.includes(".") ? item.fileName.slice(item.fileName.lastIndexOf(".")) : "")).toLowerCase().trim();
    if (ext && !ext.startsWith(".")) ext = "." + ext;
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

