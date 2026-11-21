/**
 * Modulo Osservabilità & UX:
 * - Indicatore live stato MongoDB + MinIO nella barra superiore
 * - Ricerca globale rapida (Ctrl+K / Cmd+K) su tutti i moduli del Gestionale
 */

(function() {
    let lastDbStatus = null;

    window.refreshDbStatusIndicator = async function() {
        const btn = document.getElementById("dbSyncStatusBtn");
        const dot = document.getElementById("dbSyncStatusDot");
        const label = document.getElementById("dbSyncStatusLabel");
        if (!btn) return;

        try {
            const res = await fetch("/api/db/status", { credentials: "same-origin" });
            if (!res.ok) {
                if (dot) dot.style.background = "#f59e0b";
                if (label) label.textContent = res.status === 401 ? "Auth" : "Locale";
                btn.title = res.status === 401
                    ? "Effettua il login per verificare MongoDB e MinIO"
                    : "Server non autenticato / modalità locale";
                return;
            }
            const ct = (res.headers.get("content-type") || "").toLowerCase();
            if (!ct.includes("application/json")) return;
            const data = await res.json();
            lastDbStatus = data;

            const mongoOk = Boolean(data && data.mongo && data.mongo.connected);
            const minioOk = Boolean(data && data.minio && data.minio.connected);

            if (mongoOk && minioOk) {
                if (dot) dot.style.background = "#10b981";
                if (label) label.textContent = "DB + S3";
                btn.style.borderColor = "rgba(16, 185, 129, 0.45)";
                btn.title = `MongoDB (${data.mongo.database}) ✓ • MinIO (${data.minio.bucket}) ✓`;
            } else if (mongoOk || minioOk) {
                if (dot) dot.style.background = "#f59e0b";
                if (label) label.textContent = mongoOk ? "Solo DB" : "Solo S3";
                btn.style.borderColor = "rgba(245, 158, 11, 0.45)";
                btn.title = `MongoDB: ${mongoOk ? "OK" : "OFF"} • MinIO: ${minioOk ? "OK" : "OFF"}`;
            } else {
                if (dot) dot.style.background = "#ef4444";
                if (label) label.textContent = "Offline";
                btn.style.borderColor = "rgba(239, 68, 68, 0.4)";
                btn.title = "Modalità fallback locale (MongoDB e MinIO non connessi)";
            }
        } catch (e) {
            if (dot) dot.style.background = "#64748b";
            if (label) label.textContent = "Locale";
            btn.title = "Modalità offline / statica (LocalStorage + IndexedDB)";
        }
    };

    window.openDbStatusModal = async function() {
        await window.refreshDbStatusIndicator();
        const modalOverlay = document.getElementById("modalOverlay");
        const modalTitle = document.getElementById("modalTitle");
        const modalBody = document.getElementById("modalBody");
        const modalContainer = modalOverlay && modalOverlay.querySelector(".modal-container");
        if (!modalOverlay || !modalTitle || !modalBody) return;
        if (modalContainer) modalContainer.style.maxWidth = "640px";

        const esc = window.escapeHtml || (s => String(s ?? ""));
        const d = lastDbStatus;
        const mongoOk = Boolean(d && d.mongo && d.mongo.connected);
        const minioOk = Boolean(d && d.minio && d.minio.connected);
        const cols = (d && d.mongo && d.mongo.collections) ? d.mongo.collections : {};

        modalTitle.innerText = "Stato Database & Object Storage (MongoDB + MinIO)";
        modalBody.innerHTML = `
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap:1rem; margin-bottom:1.2rem;">
                <div style="background:rgba(255,255,255,0.03); border:1px solid ${mongoOk ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}; border-radius:10px; padding:1rem;">
                    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">MongoDB</div>
                    <div style="font-size:1.1rem; font-weight:700; color:${mongoOk ? "#10b981" : "#ef4444"}; margin:0.25rem 0;">
                        ${mongoOk ? "✓ Connesso" : "✕ Non connesso"}
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-secondary);">Database: <code>${esc((d && d.mongo && d.mongo.database) || "N/D")}</code></div>
                </div>
                <div style="background:rgba(255,255,255,0.03); border:1px solid ${minioOk ? "rgba(16,185,129,0.4)" : "rgba(239,68,68,0.4)"}; border-radius:10px; padding:1rem;">
                    <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">MinIO (S3 Storage)</div>
                    <div style="font-size:1.1rem; font-weight:700; color:${minioOk ? "#10b981" : "#ef4444"}; margin:0.25rem 0;">
                        ${minioOk ? "✓ Connesso" : "✕ Non connesso"}
                    </div>
                    <div style="font-size:0.8rem; color:var(--text-secondary);">Bucket: <code>${esc((d && d.minio && d.minio.bucket) || "N/D")}</code></div>
                </div>
            </div>

            ${Object.keys(cols).length ? `
                <div style="background:rgba(0,0,0,0.25); border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:0.9rem; margin-bottom:1rem;">
                    <strong style="font-size:0.8rem; color:var(--accent-cyan); display:block; margin-bottom:0.5rem;">Documenti salvati su MongoDB</strong>
                    <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:0.4rem; font-size:0.78rem;">
                        ${Object.entries(cols).map(([k, v]) => `
                            <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.03); padding:0.3rem 0.55rem; border-radius:6px;">
                                <span style="color:var(--text-secondary);">${esc(k)}</span>
                                <strong style="color:#fff;">${esc(v)}</strong>
                            </div>
                        `).join("")}
                    </div>
                </div>
            ` : ""}

            <div style="display:flex; justify-content:flex-end; gap:0.6rem;">
                <button type="button" class="btn btn-primary" onclick="window.forceFullDbSync()">
                    <i data-lucide="refresh-cw"></i> Sincronizza Ora
                </button>
            </div>
        `;
        modalOverlay.classList.add("active");
        if (window.appController && window.appController.setupLucideIcons) {
            window.appController.setupLucideIcons();
        }
    };

    window.forceFullDbSync = async function() {
        if (window.atelierDB && typeof window.atelierDB.syncFromMongo === "function") {
            await window.atelierDB.syncFromMongo();
        }
        if (typeof window.syncBibliotecaFromServer === "function") {
            await window.syncBibliotecaFromServer(true);
        }
        await window.refreshDbStatusIndicator();
        window.openDbStatusModal();
    };

    const SEARCH_MODULES = [
        { key: "biblioteca", label: "Biblioteca", icon: "book-open", fields: ["titolo", "autore", "categoria", "note", "fileName"] },
        { key: "clienti", label: "Clienti", icon: "users", fields: ["nome", "email", "telefono", "strumento", "note"] },
        { key: "costiLaboratorio", label: "Costi Laboratorio", icon: "wallet", fields: ["tipoSpesa", "categoria", "fornitore", "note", "fileName"] },
        { key: "certificati", label: "Certificati", icon: "award", fields: ["codice", "strumento", "proprietario", "modello", "note"] },
        { key: "costruzione", label: "Costruzione", icon: "hammer", fields: ["codice", "modello", "strumento", "legno", "note"] },
        { key: "restauro", label: "Restauro", icon: "wrench", fields: ["codice", "strumento", "proprietario", "diagnosi", "interventiPrevisti"] },
        { key: "magazzinoLegno", label: "Magazzino Legno", icon: "trees", fields: ["codice", "specie", "provenienza", "note"] },
        { key: "magazzinoStrumenti", label: "Magazzino Strumenti", icon: "music", fields: ["codice", "nome", "tipologia", "modello"] },
        { key: "media", label: "Media", icon: "image", fields: ["titolo", "tipo", "categoria", "fileName", "descrizione"] },
        { key: "calendarioAppuntamenti", label: "Calendario", icon: "calendar", fields: ["cliente", "tipo", "strumento", "data", "note"] },
        { key: "social", label: "Social", icon: "share-2", fields: ["titolo", "testo", "stato"] },
        { key: "mail", label: "Mail", icon: "mail", fields: ["subject", "fromName", "fromEmail", "snippet"] }
    ];

    window.openGlobalSearchModal = function() {
        const modalOverlay = document.getElementById("modalOverlay");
        const modalTitle = document.getElementById("modalTitle");
        const modalBody = document.getElementById("modalBody");
        const modalContainer = modalOverlay && modalOverlay.querySelector(".modal-container");
        if (!modalOverlay || !modalTitle || !modalBody) return;
        if (modalContainer) modalContainer.style.maxWidth = "720px";

        modalTitle.innerText = "Ricerca Globale Gestionale (Ctrl+K)";
        modalBody.innerHTML = `
            <div style="margin-bottom:0.9rem;">
                <input type="text" id="globalSearchInput" class="form-control" placeholder="Cerca clienti, strumenti, certificati, testi Biblioteca, restauri, mail..." oninput="window.runGlobalSearchQuery(this.value)" autofocus style="font-size:0.95rem; padding:0.75rem 1rem;">
            </div>
            <div id="globalSearchResultsBox" style="max-height:400px; overflow-y:auto; display:flex; flex-direction:column; gap:0.45rem;"></div>
        `;
        modalOverlay.classList.add("active");
        window.runGlobalSearchQuery("");
        setTimeout(() => {
            const inp = document.getElementById("globalSearchInput");
            if (inp) inp.focus();
        }, 40);
    };

    window.runGlobalSearchQuery = function(rawQuery) {
        const box = document.getElementById("globalSearchResultsBox");
        if (!box || !window.atelierDB || !window.atelierDB.data) return;
        const q = (rawQuery || "").trim().toLowerCase();
        const esc = window.escapeHtml || (s => String(s ?? ""));
        const results = [];

        SEARCH_MODULES.forEach(mod => {
            const arr = window.atelierDB.data[mod.key];
            if (!Array.isArray(arr)) return;
            arr.forEach(item => {
                if (!item || typeof item !== "object") return;
                const hay = mod.fields.map(f => item[f] || "").concat(Array.isArray(item.tags) ? item.tags : []).join(" ").toLowerCase();
                if (!q || hay.includes(q)) {
                    const title = item.titolo || item.nome || item.tipoSpesa || item.subject || item.cliente || item.strumento || item.modello || item.codice || item.id;
                    const sub = item.autore || item.proprietario || item.fornitore || item.fromName || item.email || item.categoria || item.tipologia || item.data || "";
                    results.push({ mod, item, title: String(title || "Elemento"), sub: String(sub || "") });
                }
            });
        });

        const limited = results.slice(0, 35);
        if (limited.length === 0) {
            box.innerHTML = `<div style="text-align:center; padding:2rem; color:var(--text-muted);">Nessun risultato trovato per "${esc(rawQuery)}".</div>`;
            return;
        }

        box.innerHTML = limited.map(r => `
            <div onclick="window.openGlobalSearchResult('${esc(r.mod.key)}', '${esc(r.item.id || "")}')" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center; gap:0.8rem; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:0.65rem 0.9rem;" onmouseover="this.style.borderColor='var(--accent-cyan)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.07)'">
                <div style="min-width:0;">
                    <div style="color:#fff; font-weight:600; font-size:0.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(r.title)}</div>
                    ${r.sub ? `<div style="color:var(--text-secondary); font-size:0.76rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(r.sub)}</div>` : ""}
                </div>
                <span class="badge badge-info" style="flex-shrink:0;">${esc(r.mod.label)}</span>
            </div>
        `).join("");
    };

    window.openGlobalSearchResult = function(moduleKey, itemId) {
        if (typeof window.closeModal === "function") window.closeModal();
        if (window.appController && typeof window.appController.openModule === "function") {
            window.appController.openModule(moduleKey);
        }
        if (moduleKey === "biblioteca" && itemId && typeof window.openBibliotecaReaderModal === "function") {
            setTimeout(() => window.openBibliotecaReaderModal(itemId), 80);
        }
    };

    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            window.openGlobalSearchModal();
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => window.refreshDbStatusIndicator(), 600);
        setInterval(() => window.refreshDbStatusIndicator(), 60000);
    });
})();
