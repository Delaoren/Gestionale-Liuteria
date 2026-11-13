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
                        <i data-lucide="book-open" class="lucide-book-open" style="color: var(--accent-blue);"></i>
                        Biblioteca & Documentazione Tecnica (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('biblioteca')">
                        <i data-lucide="plus" class="lucide-plus"></i> Aggiungi Documento
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
                                        <i data-lucide="file-text" class="lucide-file-text"></i> Leggi PDF
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('biblioteca', '${item.id}', '${item.titolo}')" title="Elimina documento">
                                        <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                        <i data-lucide="calendar-days" class="lucide-calendar-days" style="color: var(--accent-violet);"></i>
                        Calendario Appuntamenti & Visite Cliente
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('calendarioAppuntamenti')">
                        <i data-lucide="plus" class="lucide-plus"></i> Nuovo Appuntamento
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
                                                <i data-lucide="bell" class="lucide-bell"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('calendarioAppuntamenti', '${item.id}', '${item.cliente}')" title="Elimina appuntamento">
                                                <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                        <i data-lucide="clock" class="lucide-clock" style="color: #ec4899;"></i>
                        Calendario & Tempistiche Lavorazioni
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('calendarioLavorazioni')">
                        <i data-lucide="plus" class="lucide-plus"></i> Pianifica Lavorazione
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
                            <p style="font-size:0.85rem; color:var(--accent-gold); margin-bottom:0.4rem;"><i data-lucide="disc" class="lucide-disc"></i> ${item.strumento}</p>
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
                                    <i data-lucide="trending-up" class="lucide-trending-up"></i> +10% Progresso
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('calendarioLavorazioni', '${item.id}', '${item.titolo}')" title="Elimina lavorazione">
                                    <i data-lucide="trash-2" class="lucide-trash-2"></i> Elimina
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // Helper per generare l'HTML del Certificato su Carta Intestata (A4)
    buildCertificatoPaperHTML: function(cert) {
        if (!cert) return '';
        const m = cert.misure || {};
        const fotos = Array.isArray(cert.fotografie) ? cert.fotografie : [];
        const dataFormattata = cert.dataEmissione
            ? new Date(cert.dataEmissione + 'T12:00:00').toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' })
            : new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'long', year: 'numeric' });

        return `
            <div class="cert-letterhead-sheet" id="certPrintableSheet_${cert.id}">
                <div class="cert-border-outer">
                    <div class="cert-border-inner">
                        <!-- Filigrana centrale di sfondo -->
                        <img src="./assets/logo.png" onerror="this.src='/assets/logo.png'" class="cert-watermark-logo" alt="">

                        <!-- INTESTAZIONE CARTA INTESTATA (LETTERHEAD HEADER) -->
                        <header class="cert-header">
                            <div class="cert-header-top">
                                <div class="cert-brand-block">
                                    <img src="./assets/logo.png" onerror="this.src='/assets/logo.png'" alt="Logo Liuteria De Lorenzi" class="cert-header-logo">
                                    <div class="cert-brand-titles">
                                        <h1>LIUTERIA DE LORENZI</h1>
                                        <p class="cert-brand-sub">MAESTRO LIUTAIO &bull; COSTRUZIONE E RESTAURO STRUMENTI AD ARCO</p>
                                        <p class="cert-brand-contact">Bottega d'Arte Liutaria &bull; www.liuteriadelorenzi.it &bull; info@liuteriadelorenzi.it</p>
                                    </div>
                                </div>
                                <div class="cert-meta-box">
                                    <div class="cert-reg-num">N° REGISTRO: <strong>${cert.numeroCertificato || 'CERT-001'}</strong></div>
                                    <div class="cert-reg-date">Data: <strong>${dataFormattata}</strong></div>
                                    <div class="cert-reg-place">${cert.luogoEmissione || 'Bottega Liuteria De Lorenzi'}</div>
                                </div>
                            </div>
                            <div class="cert-ornamental-divider">
                                <span>&#10022; &#9830; &#10022;</span>
                            </div>
                        </header>

                        <!-- TITOLO DEL CERTIFICATO -->
                        <div class="cert-doc-title-block">
                            <span class="cert-doc-kicker">DOCUMENTO UFFICIALE DI PERIZIA ED AUTENTICITÀ</span>
                            <h2>${cert.tipologiaCertificato || "Certificato di Autenticità d'Autore"}</h2>
                        </div>

                        <!-- 1. IDENTIFICAZIONE STRUMENTO & AUTORE -->
                        <section class="cert-section">
                            <div class="cert-declaration-lead">
                                Si certifica e si attesta che lo strumento ad arco di seguito descritto ed illustrato:
                            </div>

                            <div class="cert-identity-grid">
                                <div class="cert-identity-item">
                                    <span class="cert-field-label">Strumento & Denominazione</span>
                                    <strong class="cert-field-value cert-highlight">${cert.strumento || '-'}</strong>
                                </div>
                                <div class="cert-identity-item">
                                    <span class="cert-field-label">Nome dell'Autore / Liutaio</span>
                                    <strong class="cert-field-value cert-author-name">${cert.autore || 'Maestro Fabio De Lorenzi'}</strong>
                                </div>
                                <div class="cert-identity-item">
                                    <span class="cert-field-label">Tipologia & Modello</span>
                                    <span class="cert-field-value">${cert.tipologiaStrumento ? cert.tipologiaStrumento + ' &mdash; ' : ''}${cert.modello || '-'}</span>
                                </div>
                                <div class="cert-identity-item">
                                    <span class="cert-field-label">Anno / Epoca di Costruzione</span>
                                    <span class="cert-field-value">${cert.annoCostruzione || '-'}</span>
                                </div>
                            </div>

                            ${cert.etichetta ? `
                                <div class="cert-label-cartiglio">
                                    <span class="cert-cartiglio-tag">Etichetta / Cartiglio Interno:</span>
                                    <em>&ldquo;${cert.etichetta}&rdquo;</em>
                                </div>
                            ` : ''}
                        </section>

                        <!-- 2. BREVE BIOGRAFIA DELL'AUTORE -->
                        <section class="cert-section">
                            <h3 class="cert-section-title">
                                <span class="cert-sec-roman">I.</span> Profilo Biografico dell'Autore (${cert.autore || 'Maestro Liutaio'})
                            </h3>
                            <p class="cert-prose-text">${cert.bioAutore || 'Nessuna nota biografica specificata.'}</p>
                        </section>

                        <!-- 3. STATO DI CONSERVAZIONE & DESCRIZIONE -->
                        <section class="cert-section">
                            <div style="display:flex; justify-content:space-between; align-items:baseline; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.35rem;">
                                <h3 class="cert-section-title" style="margin-bottom:0;">
                                    <span class="cert-sec-roman">II.</span> Stato di Conservazione & Caratteristiche Costruttive
                                </h3>
                                <span class="cert-conservation-pill">Stato: <strong>${cert.statoConservazione || 'Eccellente'}</strong></span>
                            </div>
                            <p class="cert-prose-text">${cert.noteConservazione || 'Strumento in ottimo stato di conservazione.'}</p>
                        </section>

                        <!-- 4. RILIEVI METRICI E MISURE -->
                        <section class="cert-section">
                            <h3 class="cert-section-title">
                                <span class="cert-sec-roman">III.</span> Rilievi Metrici e Misure Principali
                            </h3>
                            <div class="cert-measures-grid">
                                <div class="cert-measure-box">
                                    <span class="m-label">Lunghezza Cassa</span>
                                    <strong class="m-val">${m.lunghezzaCassa || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Largh. Superiore</span>
                                    <strong class="m-val">${m.larghezzaSuperiore || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Largh. nelle CC</span>
                                    <strong class="m-val">${m.larghezzaCC || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Largh. Inferiore</span>
                                    <strong class="m-val">${m.larghezzaInferiore || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Fasce Superiori</span>
                                    <strong class="m-val">${m.altezzaFasceSup || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Fasce Inferiori</span>
                                    <strong class="m-val">${m.altezzaFasceInf || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Diapason (Mensura)</span>
                                    <strong class="m-val">${m.diapason || '-'}</strong>
                                </div>
                                <div class="cert-measure-box">
                                    <span class="m-label">Lunghezza Manico</span>
                                    <strong class="m-val">${m.lunghezzaManico || '-'}</strong>
                                </div>
                            </div>
                        </section>

                        <!-- 5. FOTOGRAFIE AUTENTICATE -->
                        <section class="cert-section">
                            <h3 class="cert-section-title">
                                <span class="cert-sec-roman">IV.</span> Documentazione Fotografica Autenticata
                            </h3>
                            ${fotos.length > 0 ? `
                                <div class="cert-photos-grid cert-photos-count-${Math.min(fotos.length, 4)}">
                                    ${fotos.map((f, idx) => `
                                        <figure class="cert-photo-frame">
                                            <div class="cert-photo-img-wrap">
                                                <img src="${f.url}" alt="${f.didascalia || 'Foto ' + (idx + 1)}" onerror="this.src='/assets/violin-1.jpg'">
                                            </div>
                                            <figcaption>Tav. ${idx + 1} &mdash; ${f.didascalia || 'Vista dello strumento'}</figcaption>
                                        </figure>
                                    `).join('')}
                                </div>
                            ` : `
                                <p class="cert-prose-text" style="font-style:italic; color:#78716c;">Nessuna fotografia allegata al presente certificato.</p>
                            `}
                        </section>

                        <!-- PIE' DI PAGINA CARTA INTESTATA: TIMBRO E FIRMA -->
                        <footer class="cert-footer">
                            <div class="cert-footer-left">
                                ${cert.destinatario ? `<div class="cert-recipient">Rilasciato a: <strong>${cert.destinatario}</strong></div>` : ''}
                                <div class="cert-legal-note">
                                    Il presente certificato è registrato nell'Archivio Storico dell'Atelier Liuteria De Lorenzi con codice <strong>${cert.numeroCertificato}</strong>.
                                </div>
                            </div>

                            <div class="cert-seal-stamp">
                                <div class="cert-wax-seal">
                                    <img src="./assets/logo.png" onerror="this.src='/assets/logo.png'" alt="Sigillo">
                                </div>
                                <span>SIGILLO AUTENTICO ATELIER</span>
                            </div>

                            <div class="cert-signature-block">
                                <div class="cert-signature-handwriting">Fabio De Lorenzi</div>
                                <div class="cert-signature-line"></div>
                                <div class="cert-signature-caption">Il Maestro Liutaio &bull; Fabio De Lorenzi</div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        `;
    },

    // 4. Certificati (Certificates App)
    renderCertificati: function(container) {
        const items = window.atelierDB.data.certificati || [];
        if (!window.selectedCertificateId || !items.some(i => i.id === window.selectedCertificateId)) {
            window.selectedCertificateId = items.length > 0 ? items[0].id : null;
        }
        const selectedCert = items.find(i => i.id === window.selectedCertificateId) || null;

        container.innerHTML = `
            <!-- Archivio Certificati Emessi -->
            <div class="glass-panel">
                <div class="panel-header" style="flex-wrap:wrap; gap:1rem;">
                    <div>
                        <div class="panel-title">
                            <i data-lucide="award" class="lucide-award" style="color: var(--accent-gold);"></i>
                            Certificati di Autenticità & Perizie su Carta Intestata (${items.length})
                        </div>
                        <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.2rem;">
                            Redazione, archiviazione e stampa su carta intestata ufficiale con autore, biografia, stato di conservazione, misure millimetriche e fotografie.
                        </p>
                    </div>
                    <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                        <button class="btn btn-primary" onclick="window.openAddModal('certificati')">
                            <i data-lucide="file-plus" class="lucide-file-plus"></i> + Crea Nuovo Certificato
                        </button>
                    </div>
                </div>

                ${items.length === 0 ? `
                    <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                        <i data-lucide="award" style="width:48px; height:48px; color:var(--accent-gold); margin-bottom:1rem;"></i>
                        <h4 style="color:#fff; margin-bottom:0.5rem;">Nessun certificato presente in archivio</h4>
                        <p style="margin-bottom:1.2rem;">Crea il tuo primo Certificato di Autenticità su carta intestata.</p>
                        <button class="btn btn-primary" onclick="window.openAddModal('certificati')">
                            <i data-lucide="plus"></i> Crea Certificato
                        </button>
                    </div>
                ` : `
                    <div class="cards-subgrid">
                        ${items.map(item => {
                            const isSelected = selectedCert && selectedCert.id === item.id;
                            const m = item.misure || {};
                            const fotos = item.fotografie || [];
                            return `
                                <div class="info-card" style="border: ${isSelected ? '1.5px solid var(--accent-gold)' : '1px solid rgba(255,255,255,0.08)'}; box-shadow: ${isSelected ? '0 0 25px rgba(245, 158, 11, 0.18)' : 'none'}; cursor:pointer;" onclick="window.selectCertificatePreview('${item.id}')">
                                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                                        <span class="badge badge-warning" style="font-family:var(--font-mono);">${item.numeroCertificato}</span>
                                        <span class="badge badge-success">${item.statoConservazione ? item.statoConservazione.split('—')[0].trim() : 'Autentico'}</span>
                                    </div>
                                    <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.15rem; margin-bottom:0.25rem;">${item.strumento}</h3>
                                    <p style="font-size:0.85rem; color:var(--accent-gold); margin-bottom:0.6rem;">
                                        <i data-lucide="feather" class="lucide-feather"></i> Autore: <strong>${item.autore}</strong> (${item.annoCostruzione || 'N/D'})
                                    </p>

                                    <div style="background:rgba(0,0,0,0.35); padding:0.65rem 0.8rem; border-radius:8px; font-size:0.78rem; color:var(--text-secondary); margin-bottom:0.8rem; border:1px solid rgba(255,255,255,0.05);">
                                        <div>📏 <strong>Cassa:</strong> ${m.lunghezzaCassa || '-'} | <strong>Sup:</strong> ${m.larghezzaSuperiore || '-'} | <strong>CC:</strong> ${m.larghezzaCC || '-'} | <strong>Inf:</strong> ${m.larghezzaInferiore || '-'}</div>
                                        <div style="margin-top:0.25rem;">📷 <strong>Fotografie allegate:</strong> ${fotos.length} tavole &bull; 📅 ${item.dataEmissione || '-'}</div>
                                    </div>

                                    ${fotos.length > 0 ? `
                                        <div style="display:flex; gap:0.4rem; margin-bottom:0.85rem; overflow-x:auto; padding-bottom:2px;">
                                            ${fotos.slice(0, 4).map(f => `
                                                <img src="${f.url}" alt="${f.didascalia || ''}" title="${f.didascalia || ''}" onerror="this.src='/assets/violin-1.jpg'" style="width:52px; height:52px; object-fit:cover; border-radius:6px; border:1px solid rgba(245,158,11,0.35); flex-shrink:0;">
                                            `).join('')}
                                        </div>
                                    ` : ''}

                                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; border-top:1px solid rgba(255,255,255,0.06); padding-top:0.75rem; flex-wrap:wrap;" onclick="event.stopPropagation();">
                                        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                                            <button class="btn ${isSelected ? 'btn-primary' : 'btn-secondary'}" style="padding:0.3rem 0.65rem; font-size:0.75rem;" onclick="window.selectCertificatePreview('${item.id}', true)" title="Mostra nella Carta Intestata">
                                                <i data-lucide="eye" class="lucide-eye"></i> Carta Intestata
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.65rem; font-size:0.75rem; color:var(--accent-gold); border-color:rgba(245,158,11,0.35);" onclick="window.printCertificate('${item.id}')" title="Stampa o salva PDF su Carta Intestata A4">
                                                <i data-lucide="printer" class="lucide-printer"></i> Stampa / PDF
                                            </button>
                                        </div>
                                        <div style="display:flex; gap:0.35rem;">
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.55rem; font-size:0.75rem;" onclick="window.openEditCertificatoModal('${item.id}')" title="Modifica Certificato">
                                                <i data-lucide="edit-3" class="lucide-edit-3"></i>
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.55rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('certificati', '${item.id}', '${item.numeroCertificato}')" title="Elimina Certificato">
                                                <i data-lucide="trash-2" class="lucide-trash-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>

            <!-- Anteprima Live Carta Intestata Ufficiale A4 -->
            ${selectedCert ? `
                <div class="glass-panel" id="certPreviewPanel" style="border: 1px solid rgba(245, 158, 11, 0.35);">
                    <div class="panel-header" style="flex-wrap:wrap; gap:1rem;">
                        <div>
                            <div class="panel-title" style="color:var(--accent-gold);">
                                <i data-lucide="scroll" class="lucide-scroll"></i>
                                Anteprima Ufficiale su Carta Intestata &mdash; ${selectedCert.numeroCertificato}
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-secondary); margin-top:0.2rem;">
                                Documento impaginato in formato A4 su Carta Intestata <strong>Liuteria De Lorenzi</strong> pronto per la stampa o l'esportazione PDF.
                            </p>
                        </div>
                        <div style="display:flex; gap:0.6rem; flex-wrap:wrap; align-items:center;">
                            <select class="form-control" style="width:auto; min-width:220px; padding:0.45rem 0.8rem; font-size:0.85rem;" onchange="window.selectCertificatePreview(this.value)">
                                ${items.map(c => `<option value="${c.id}" ${c.id === selectedCert.id ? 'selected' : ''}>${c.numeroCertificato} — ${c.strumento}</option>`).join('')}
                            </select>
                            <button class="btn btn-secondary" onclick="window.openEditCertificatoModal('${selectedCert.id}')">
                                <i data-lucide="edit-3" class="lucide-edit-3"></i> Modifica Certificato
                            </button>
                            <button class="btn btn-primary" onclick="window.printCertificate('${selectedCert.id}')">
                                <i data-lucide="printer" class="lucide-printer"></i> Stampa / Salva PDF Carta Intestata
                            </button>
                        </div>
                    </div>

                    <div class="cert-preview-viewport">
                        ${window.AppModules.buildCertificatoPaperHTML(selectedCert)}
                    </div>
                </div>
            ` : ''}
        `;
    },

    // 5. Clienti
    renderClienti: function(container) {
        const items = window.atelierDB.data.clienti || [];
        container.innerHTML = `
            <div class="glass-panel">
                <div class="panel-header">
                    <div class="panel-title">
                        <i data-lucide="users" class="lucide-users" style="color: var(--accent-emerald);"></i>
                        Anagrafica Clienti & Musicisti (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('clienti')">
                        <i data-lucide="user-plus" class="lucide-user-plus"></i> Nuovo Cliente
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
                                        <i data-lucide="mail" class="lucide-mail"></i> ${item.email}<br>
                                        <i data-lucide="phone" class="lucide-phone"></i> ${item.telefono}
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
                                                <i data-lucide="external-link" class="lucide-external-link"></i> Dettagli
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('clienti', '${item.id}', '${item.nome}')" title="Elimina cliente">
                                                <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                        <i data-lucide="hammer" class="lucide-hammer" style="color: var(--accent-amber);"></i>
                        Registro Costruzione Nuovi Strumenti
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('costruzione')">
                        <i data-lucide="plus" class="lucide-plus"></i> Avvia Nuovo Opus
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
                                    <i data-lucide="trending-up" class="lucide-trending-up"></i> +10% Progresso
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteCostruzioneItem('${item.id}', '${item.opNumero}')" title="Rimuovi strumento">
                                    <i data-lucide="trash-2" class="lucide-trash-2"></i> Elimina
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
                        <i data-lucide="receipt" class="lucide-receipt" style="color: var(--accent-cyan);"></i>
                        Gestione Contabilità & Fatturazione
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('gestioneContabilita')">
                        <i data-lucide="file-plus" class="lucide-file-plus"></i> Nuova Fattura
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
                                                <i data-lucide="download" class="lucide-download"></i> PDF
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('gestioneContabilita', '${item.id}', '${item.numero}')" title="Elimina fattura">
                                                <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                                    <i data-lucide="trash-2" class="lucide-trash-2"></i> Elimina
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
                                            <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                        <i data-lucide="music" class="lucide-music" style="color: var(--accent-gold);"></i>
                        Magazzino Strumenti Finiti & Showroom (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('magazzinoStrumenti')">
                        <i data-lucide="plus" class="lucide-plus"></i> Inserisci Strumento
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
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.75rem;" onclick="window.openCertificateForInstrument('${item.id}')">
                                        <i data-lucide="award" class="lucide-award"></i> Certificato
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.3rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('magazzinoStrumenti', '${item.id}', '${item.nome}')" title="Elimina strumento">
                                        <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                                    <i data-lucide="external-link" class="lucide-external-link"></i> Apri
                                </button>
                                <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('media', '${item.id}', '${item.titolo}')" title="Elimina media">
                                    <i data-lucide="trash-2" class="lucide-trash-2"></i> Elimina
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
                        <i data-lucide="bar-chart-3" class="lucide-bar-chart-3" style="color: var(--accent-cyan);"></i>
                        Report Statistiche & Analisi Rendimento (${items.length})
                    </div>
                    <div style="display:flex; gap:0.5rem;">
                        <button class="btn btn-primary" onclick="window.openAddModal('report')">
                            <i data-lucide="plus" class="lucide-plus"></i> Genera Report
                        </button>
                        <button class="btn btn-secondary" onclick="window.showToast('Esportazione Report PDF in corso...')">
                            <i data-lucide="download-cloud" class="lucide-download-cloud"></i> Esporta PDF
                        </button>
                    </div>
                </div>
                <div class="cards-subgrid">
                    ${items.map(item => `
                        <div class="info-card">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                                <span class="badge badge-info">${item.periodo}</span>
                                <button class="btn btn-secondary" style="padding:0.2rem 0.4rem; font-size:0.7rem; color:#ef4444;" onclick="window.deleteRecord('report', '${item.id}', '${item.titolo}')" title="Elimina report">
                                    <i data-lucide="trash-2" class="lucide-trash-2"></i>
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
                        <i data-lucide="sparkles" class="lucide-sparkles" style="color: var(--accent-rosewood);"></i>
                        Registro Interventi di Restauro & Riparazioni d'Epoca (${items.length})
                    </div>
                    <button class="btn btn-primary" onclick="window.openAddModal('restauro')">
                        <i data-lucide="plus" class="lucide-plus"></i> Registra Scheda Restauro
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
                                        <i data-lucide="file-text" class="lucide-file-text"></i> Perizia
                                    </button>
                                    <button class="btn btn-secondary" style="padding:0.25rem 0.5rem; font-size:0.75rem; color:#ef4444;" onclick="window.deleteRecord('restauro', '${item.id}', '${item.codice}')" title="Elimina scheda">
                                        <i data-lucide="trash-2" class="lucide-trash-2"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    // 13. Social (Studio Programmazione Foto & Video Grandi Dimensioni Multi-Social)
    renderSocial: function(container) {
        const allItems = window.atelierDB.data.social || [];
        const activeFilter = window.socialFilterState || 'all';
        const activePlatformFilter = window.socialPlatformFilter || 'all';

        const platformMeta = {
            "Instagram": { icon: "instagram", color: "#e1306c", bg: "rgba(225, 48, 108, 0.16)", border: "rgba(225, 48, 108, 0.45)" },
            "Facebook": { icon: "facebook", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.16)", border: "rgba(59, 130, 246, 0.45)" },
            "YouTube": { icon: "youtube", color: "#ef4444", bg: "rgba(239, 68, 68, 0.16)", border: "rgba(239, 68, 68, 0.45)" },
            "TikTok": { icon: "video", color: "#06b6d4", bg: "rgba(6, 182, 212, 0.16)", border: "rgba(6, 182, 212, 0.45)" },
            "LinkedIn": { icon: "linkedin", color: "#0ea5e9", bg: "rgba(14, 165, 233, 0.16)", border: "rgba(14, 165, 233, 0.45)" }
        };

        const getPlatforms = (item) => {
            if (Array.isArray(item.piattaforme) && item.piattaforme.length > 0) return item.piattaforme;
            if (item.piattaforma) return item.piattaforma.split(',').map(s => s.trim()).filter(Boolean);
            return ["Instagram"];
        };

        // Calculate stats
        let totalPhotos = 0;
        let totalVideos = 0;
        let totalBytes = 0;
        let scheduledCount = 0;
        let publishedCount = 0;

        allItems.forEach(item => {
            if (item.stato === 'Programmato') scheduledCount++;
            if (item.stato === 'Pubblicato') publishedCount++;
            const media = Array.isArray(item.mediaAttachments) ? item.mediaAttachments : [];
            media.forEach(m => {
                if (m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/'))) {
                    totalVideos++;
                } else {
                    totalPhotos++;
                }
                if (typeof m.sizeBytes === 'number' && !isNaN(m.sizeBytes)) {
                    totalBytes += m.sizeBytes;
                }
            });
        });

        const formatBytes = window.formatSocialBytes || function(bytes) {
            if (!bytes || bytes <= 0) return "0 MB";
            const mb = bytes / (1024 * 1024);
            if (mb >= 1024) return (mb / 1024).toFixed(2) + " GB";
            if (mb >= 1) return mb.toFixed(1) + " MB";
            return Math.max(1, Math.round(bytes / 1024)) + " KB";
        };

        // Filter items
        const filteredItems = allItems.filter(item => {
            const media = Array.isArray(item.mediaAttachments) ? item.mediaAttachments : [];
            const hasVideo = media.some(m => m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/')));
            const hasPhoto = media.some(m => m.kind === 'image' || (m.mimeType && m.mimeType.startsWith('image/')));

            if (activeFilter === 'scheduled' && item.stato !== 'Programmato') return false;
            if (activeFilter === 'published' && item.stato !== 'Pubblicato') return false;
            if (activeFilter === 'draft' && (item.stato === 'Programmato' || item.stato === 'Pubblicato')) return false;
            if (activeFilter === 'video' && !hasVideo) return false;
            if (activeFilter === 'photo' && !hasPhoto) return false;

            if (activePlatformFilter !== 'all') {
                const plats = getPlatforms(item);
                if (!plats.some(p => p.toLowerCase().includes(activePlatformFilter.toLowerCase()))) return false;
            }
            return true;
        });

        const formatScheduleDate = (rawDate) => {
            if (!rawDate) return "Data da definire";
            const normalized = rawDate.includes('T') ? rawDate : rawDate.replace(' ', 'T');
            const d = new Date(normalized);
            if (isNaN(d.getTime())) return rawDate;
            return d.toLocaleDateString('it-IT', {
                weekday: 'short',
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }) + ' • ore ' + d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
        };

        const getCountdownInfo = (item) => {
            if (item.stato === 'Pubblicato') {
                const pubTime = item.dataPubblicazioneEffettiva
                    ? new Date(item.dataPubblicazioneEffettiva).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : formatScheduleDate(item.dataProgrammata);
                return { label: `Pubblicato (${pubTime})`, color: "var(--accent-emerald)", bg: "rgba(16, 185, 129, 0.14)", icon: "check-circle" };
            }
            if (item.stato === 'Errore Accessi' || item.stato === 'Errore Invio') {
                return { label: item.stato === 'Errore Accessi' ? "Bloccato: Manca Webhook IG/FB" : "Errore Invio Webhook", color: "#f87171", bg: "rgba(239, 68, 68, 0.18)", icon: "alert-triangle" };
            }
            if (!item.dataProgrammata) {
                return { label: "In attesa di data", color: "var(--text-muted)", bg: "rgba(255,255,255,0.06)", icon: "clock" };
            }
            const normalized = item.dataProgrammata.includes('T') ? item.dataProgrammata : item.dataProgrammata.replace(' ', 'T');
            const target = new Date(normalized).getTime();
            if (isNaN(target)) {
                return { label: item.stato, color: "var(--accent-gold)", bg: "rgba(245, 158, 11, 0.14)", icon: "clock" };
            }
            const diff = target - Date.now();
            if (diff <= 0) {
                if (item.stato === 'Programmato') {
                    return { label: "Scaduto • Pronto per invio", color: "var(--accent-amber)", bg: "rgba(245, 158, 11, 0.2)", icon: "zap" };
                }
                return { label: "Data programmata raggiunta", color: "var(--text-secondary)", bg: "rgba(255,255,255,0.06)", icon: "calendar" };
            }
            const totalMinutes = Math.floor(diff / 60000);
            const days = Math.floor(totalMinutes / (60 * 24));
            const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
            const mins = totalMinutes % 60;
            let timeStr = "";
            if (days > 0) timeStr = `Mancano ${days}g ${hours}h`;
            else if (hours > 0) timeStr = `Mancano ${hours}h ${mins}m`;
            else timeStr = `Mancano ${Math.max(1, mins)} min`;

            return {
                label: item.stato === 'Programmato' ? `${timeStr} al lancio` : timeStr,
                color: "var(--accent-cyan)",
                bg: "rgba(6, 182, 212, 0.14)",
                icon: "timer"
            };
        };

        const socCfg = (window.atelierDB.data.settings && window.atelierDB.data.settings.socialIntegration) || {};
        const isWebhookConfigured = Boolean(
            (socCfg.webhookUrl && socCfg.webhookUrl.trim()) ||
            (socCfg.instagramWebhookUrl && socCfg.instagramWebhookUrl.trim()) ||
            (socCfg.facebookWebhookUrl && socCfg.facebookWebhookUrl.trim())
        );
        const providerNames = { make: "Make.com", zapier: "Zapier", n8n: "n8n", custom: "Webhook Custom" };
        const providerLabel = providerNames[socCfg.provider] || "Make.com";

        container.innerHTML = `
            <!-- Instagram & Facebook Webhook Connection Status Banner -->
            <div class="glass-panel" style="margin-bottom:1.25rem; padding:1.1rem 1.4rem; border-left:4px solid ${isWebhookConfigured ? 'var(--accent-emerald)' : '#f43f5e'}; background:${isWebhookConfigured ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.05))' : 'linear-gradient(135deg, rgba(244, 63, 94, 0.14), rgba(245, 158, 11, 0.08))'};">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
                    <div style="display:flex; align-items:center; gap:0.95rem; flex:1; min-width:260px;">
                        <div style="width:48px; height:48px; border-radius:12px; background:${isWebhookConfigured ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}; color:${isWebhookConfigured ? 'var(--accent-emerald)' : '#fb7185'}; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i data-lucide="${isWebhookConfigured ? 'check-circle-2' : 'key-round'}" style="width:24px; height:24px;"></i>
                        </div>
                        <div>
                            <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap; margin-bottom:0.2rem;">
                                <strong style="color:#fff; font-size:0.98rem;">
                                    ${isWebhookConfigured
                                        ? `Accessi Automatici Instagram & Facebook Attivi (${providerLabel})`
                                        : `Accessi Social Non Configurati — Impossibile Pubblicare in Automatico`}
                                </strong>
                                <span class="badge ${isWebhookConfigured ? 'badge-success' : 'badge-warning'}" style="font-size:0.7rem;">
                                    ${isWebhookConfigured ? '✓ Webhook Collegato & Scheduler 24/7' : '⚠️ Azione Richiesta'}
                                </span>
                            </div>
                            <p style="font-size:0.8rem; color:var(--text-secondary); margin:0;">
                                ${isWebhookConfigured
                                    ? `Profili collegati: <strong style="color:#e1306c;">Instagram (${socCfg.instagramAccountLabel || '@liuteriadelorenzi'})</strong> & <strong style="color:#3b82f6;">Facebook (${socCfg.facebookPageLabel || 'Liuteria De Lorenzi'})</strong> • Formato: <code>${socCfg.payloadFormat === 'json' ? 'JSON' : 'File Binario Diretto (Multipart)'}</code>${socCfg.lastTestTime ? ` • Ultimo test: ${socCfg.lastTestTime}` : ''}`
                                    : `Per far postare automaticamente il Gestionale su <strong>Instagram</strong> e <strong>Facebook</strong> all'ora stabilita, clicca qui a destra e incolla l'URL del tuo Webhook (<strong>Make.com</strong>, Zapier o n8n).`}
                            </p>
                        </div>
                    </div>
                    <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
                        ${isWebhookConfigured ? `
                            <button type="button" class="btn btn-secondary" style="padding:0.55rem 0.95rem; font-size:0.82rem; border-color:rgba(16,185,129,0.4); color:var(--accent-emerald);" onclick="window.testSocialWebhookNow()">
                                <i data-lucide="zap"></i> 🧪 Invia Test a IG & FB
                            </button>
                        ` : ''}
                        <button type="button" class="btn ${isWebhookConfigured ? 'btn-secondary' : 'btn-primary'}" style="padding:0.55rem 1.05rem; font-size:0.84rem;" onclick="window.openSocialConfigModal()">
                            <i data-lucide="settings"></i> ${isWebhookConfigured ? '⚙️ Impostazioni Webhook IG & FB' : '🔗 Configura Accessi IG & FB (Webhook)'}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Top KPI & Large Media Engine Status Banner -->
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:1rem; margin-bottom:1.5rem;">
                <div class="glass-panel" style="padding:1.2rem 1.4rem; display:flex; align-items:center; gap:1rem; border-left:3px solid var(--accent-cyan);">
                    <div style="width:46px; height:46px; border-radius:12px; background:rgba(6, 182, 212, 0.15); color:var(--accent-cyan); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="calendar-clock"></i>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">Post Programmati</div>
                        <div style="font-size:1.5rem; font-weight:800; color:#fff; font-family:var(--font-heading);">${scheduledCount} <small style="font-size:0.78rem; color:var(--accent-cyan); font-family:var(--font-body); font-weight:600;">in coda</small></div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">Pubblicazione automatica attiva</div>
                    </div>
                </div>

                <div class="glass-panel" style="padding:1.2rem 1.4rem; display:flex; align-items:center; gap:1rem; border-left:3px solid var(--accent-amber);">
                    <div style="width:46px; height:46px; border-radius:12px; background:rgba(245, 158, 11, 0.15); color:var(--accent-gold); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="film"></i>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">Foto & Video Caricati</div>
                        <div style="font-size:1.45rem; font-weight:800; color:#fff; font-family:var(--font-heading);">${totalPhotos} Foto • ${totalVideos} Video</div>
                        <div style="font-size:0.72rem; color:var(--accent-gold);">Volume: <strong>${formatBytes(totalBytes)}</strong> (Engine 4K/Large File)</div>
                    </div>
                </div>

                <div class="glass-panel" style="padding:1.2rem 1.4rem; display:flex; align-items:center; gap:1rem; border-left:3px solid var(--accent-emerald);">
                    <div style="width:46px; height:46px; border-radius:12px; background:rgba(16, 185, 129, 0.15); color:var(--accent-emerald); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="send"></i>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">Post Pubblicati</div>
                        <div style="font-size:1.5rem; font-weight:800; color:#fff; font-family:var(--font-heading);">${publishedCount} <small style="font-size:0.78rem; color:var(--accent-emerald); font-family:var(--font-body); font-weight:600;">online</small></div>
                        <div style="font-size:0.72rem; color:var(--text-muted);">Multi-canale IG • FB • YT • TikTok • IN</div>
                    </div>
                </div>

                <div class="glass-panel" style="padding:1.2rem 1.4rem; display:flex; align-items:center; gap:1rem; border-left:3px solid var(--accent-violet);">
                    <div style="width:46px; height:46px; border-radius:12px; background:rgba(139, 92, 246, 0.15); color:var(--accent-violet); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i data-lucide="hard-drive-upload"></i>
                    </div>
                    <div>
                        <div style="font-size:0.75rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.05em;">Storage Grandi Dimensioni</div>
                        <div style="font-size:1.1rem; font-weight:700; color:#fff;">IndexedDB Stream</div>
                        <div style="font-size:0.72rem; color:var(--accent-emerald);">✓ Supporto Video 4K / File > 500MB</div>
                    </div>
                </div>
            </div>

            <!-- Direct Upload Studio Banner (Always visible at the top of Social App) -->
            <div class="glass-panel" style="margin-bottom:1.5rem; background:linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(245, 158, 11, 0.08)); border:1.5px dashed rgba(6, 182, 212, 0.5); padding:1.4rem 1.6rem;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.2rem;">
                    <div style="display:flex; align-items:center; gap:1rem; flex:1; min-width:260px;">
                        <div style="width:56px; height:56px; border-radius:14px; background:rgba(245, 158, 11, 0.2); border:1px solid var(--accent-gold); color:var(--accent-gold); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i data-lucide="upload-cloud" style="width:28px; height:28px;"></i>
                        </div>
                        <div>
                            <h3 style="font-family:var(--font-heading); color:#fff; font-size:1.15rem; margin-bottom:0.2rem;">
                                Carica Materiale Fotografico o Video per i Social
                            </h3>
                            <p style="font-size:0.83rem; color:var(--text-secondary); margin:0;">
                                Carica <strong>Foto ad alta risoluzione</strong> e <strong>Video anche di grandi dimensioni (4K / FullHD > 500MB)</strong>, scegli i social (<em>Instagram, Facebook, YouTube, TikTok, LinkedIn</em>) e imposta data e ora di pubblicazione.
                            </p>
                        </div>
                    </div>

                    <div style="display:flex; gap:0.65rem; flex-wrap:wrap; align-items:center;">
                        <label class="btn btn-primary" style="cursor:pointer; margin:0; padding:0.65rem 1.15rem; font-size:0.86rem;">
                            <i data-lucide="camera"></i> 📷 Carica Foto
                            <input type="file" accept="image/*" multiple onchange="window.handleDirectSocialPageUpload(event)" style="display:none;">
                        </label>
                        <label class="btn btn-primary" style="cursor:pointer; margin:0; padding:0.65rem 1.15rem; font-size:0.86rem; background:linear-gradient(135deg, #e11d48, #be123c); color:#fff; border-color:#fb7185;">
                            <i data-lucide="video"></i> 🎬 Carica Video (Anche Grandi Dimensioni)
                            <input type="file" accept="video/*" multiple onchange="window.handleDirectSocialPageUpload(event)" style="display:none;">
                        </label>
                        <button type="button" class="btn btn-secondary" style="padding:0.65rem 1.15rem; font-size:0.86rem; border-color:var(--accent-cyan); color:#fff;" onclick="window.openAddModal('social')">
                            <i data-lucide="calendar-plus"></i> 🗓️ Crea & Programma Post
                        </button>
                    </div>
                </div>
            </div>

            <!-- Main Social Studio Panel -->
            <div class="glass-panel">
                <div class="panel-header" style="flex-wrap:wrap; gap:1rem;">
                    <div>
                        <div class="panel-title">
                            <i data-lucide="share-2" class="lucide-share-2" style="color: var(--accent-cyan);"></i>
                            Pianificazione & Pubblicazione Foto / Video Multi-Social (${filteredItems.length})
                        </div>
                        <p style="font-size:0.82rem; color:var(--text-secondary); margin-top:0.25rem;">
                            Carica materiale fotografico ad alta risoluzione e video anche di grandi dimensioni (4K/HD), scegli i social e stabilisci data e ora di pubblicazione automatica.
                        </p>
                    </div>
                    <div style="display:flex; gap:0.6rem; flex-wrap:wrap;">
                        <button class="btn btn-secondary" onclick="window.openSocialConfigModal()" title="Configura il Webhook (Make.com / Zapier / n8n) per Instagram e Facebook">
                            <i data-lucide="key-round"></i> Accessi IG & FB
                        </button>
                        <button class="btn btn-secondary" onclick="window.checkScheduledSocialPosts(true)" title="Controlla e pubblica i post la cui data programmata è scattata">
                            <i data-lucide="refresh-cw" class="lucide-refresh-cw"></i> Verifica Coda Ora
                        </button>
                        <button class="btn btn-primary" onclick="window.openAddModal('social')">
                            <i data-lucide="upload-cloud" class="lucide-upload-cloud"></i> + Carica Foto/Video & Programma Post
                        </button>
                    </div>
                </div>

                <!-- Filter Bar (Status + Social Platform) -->
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.8rem; margin-bottom:1.4rem; padding-bottom:1rem; border-bottom:1px solid rgba(255,255,255,0.06);">
                    <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
                        ${[
                            { id: 'all', label: `Tutti (${allItems.length})`, icon: 'layers' },
                            { id: 'scheduled', label: `Programmati (${scheduledCount})`, icon: 'calendar-clock' },
                            { id: 'published', label: `Pubblicati (${publishedCount})`, icon: 'check-circle-2' },
                            { id: 'draft', label: 'Bozze / Montaggio', icon: 'file-edit' },
                            { id: 'video', label: `Con Video (${totalVideos})`, icon: 'video' },
                            { id: 'photo', label: `Con Foto (${totalPhotos})`, icon: 'image' }
                        ].map(tab => `
                            <button type="button" class="btn ${activeFilter === tab.id ? 'btn-primary' : 'btn-secondary'}" style="padding:0.38rem 0.8rem; font-size:0.78rem; border-radius:20px;" onclick="window.setSocialFilter('${tab.id}')">
                                <i data-lucide="${tab.icon}"></i> ${tab.label}
                            </button>
                        `).join('')}
                    </div>

                    <div style="display:flex; align-items:center; gap:0.5rem;">
                        <span style="font-size:0.76rem; color:var(--text-muted);">Filtra Social:</span>
                        <select class="form-control" style="width:auto; padding:0.35rem 0.75rem; font-size:0.8rem;" onchange="window.setSocialPlatformFilter(this.value)">
                            <option value="all" ${activePlatformFilter === 'all' ? 'selected' : ''}>Tutti i Social</option>
                            <option value="Instagram" ${activePlatformFilter === 'Instagram' ? 'selected' : ''}>Instagram</option>
                            <option value="Facebook" ${activePlatformFilter === 'Facebook' ? 'selected' : ''}>Facebook</option>
                            <option value="YouTube" ${activePlatformFilter === 'YouTube' ? 'selected' : ''}>YouTube</option>
                            <option value="TikTok" ${activePlatformFilter === 'TikTok' ? 'selected' : ''}>TikTok</option>
                            <option value="LinkedIn" ${activePlatformFilter === 'LinkedIn' ? 'selected' : ''}>LinkedIn</option>
                        </select>
                    </div>
                </div>

                ${filteredItems.length === 0 ? `
                    <div style="text-align:center; padding:3rem 1rem; color:var(--text-muted);">
                        <i data-lucide="film" style="width:48px; height:48px; color:var(--accent-cyan); margin-bottom:0.8rem;"></i>
                        <h4 style="color:#fff; margin-bottom:0.4rem;">Nessun post trovato con i filtri selezionati</h4>
                        <p style="font-size:0.85rem; margin-bottom:1.2rem;">Carica foto ad alta risoluzione o video 4K e programmali sui tuoi canali social.</p>
                        <button class="btn btn-primary" onclick="window.setSocialFilter('all'); window.setSocialPlatformFilter('all'); window.openAddModal('social');">
                            <i data-lucide="upload-cloud"></i> Programma Nuovo Post Foto / Video
                        </button>
                    </div>
                ` : `
                    <div class="cards-subgrid">
                        ${filteredItems.map(item => {
                            const platforms = getPlatforms(item);
                            const mediaList = Array.isArray(item.mediaAttachments) ? item.mediaAttachments : [];
                            const primaryMedia = mediaList[0] || null;
                            const hasVideo = mediaList.some(m => m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/')));
                            const totalPostBytes = mediaList.reduce((acc, m) => acc + (m.sizeBytes || 0), 0);
                            const cd = getCountdownInfo(item);

                            const statusBadgeClass = item.stato === 'Pubblicato'
                                ? 'badge-success'
                                : item.stato === 'Programmato'
                                    ? 'badge-info'
                                    : 'badge-warning';

                            return `
                                <div class="info-card social-post-card" style="display:flex; flex-direction:column; justify-content:space-between; overflow:hidden; padding:0; border:1px solid ${item.stato === 'Programmato' ? 'rgba(6, 182, 212, 0.3)' : item.stato === 'Pubblicato' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255,255,255,0.08)'};">
                                    <div>
                                        <!-- Media Preview Header -->
                                        <div class="social-card-media-preview" onclick="window.openSocialPreviewModal('${item.id}')" style="height:185px; background:linear-gradient(135deg, #0d1119, #171e2e); position:relative; overflow:hidden; cursor:pointer; display:flex; align-items:center; justify-content:center; border-bottom:1px solid rgba(255,255,255,0.06);">
                                            ${primaryMedia ? (
                                                (primaryMedia.kind === 'video' || (primaryMedia.mimeType && primaryMedia.mimeType.startsWith('video/'))) ? `
                                                    ${primaryMedia.thumbnailDataUrl ? `
                                                        <img src="${primaryMedia.thumbnailDataUrl}" alt="${primaryMedia.name}" onerror="this.style.display='none'" style="width:100%; height:100%; object-fit:cover; opacity:0.82;">
                                                    ` : ''}
                                                    <video data-social-media-id="${primaryMedia.id}" ${primaryMedia.url ? `src="${primaryMedia.url}"` : ''} muted playsinline preload="metadata" style="width:100%; height:100%; object-fit:cover; position:absolute; inset:0; ${primaryMedia.thumbnailDataUrl ? 'opacity:0;' : 'opacity:0.85;'}" onloadeddata="this.style.opacity='0.9'"></video>
                                                    <div style="position:absolute; inset:0; background:radial-gradient(circle, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:0.35rem;">
                                                        <div style="width:50px; height:50px; border-radius:50%; background:rgba(245, 158, 11, 0.92); color:#000; display:flex; align-items:center; justify-content:center; box-shadow:0 0 25px rgba(245, 158, 11, 0.6);">
                                                            <i data-lucide="play" style="width:24px; height:24px; margin-left:2px;"></i>
                                                        </div>
                                                        <span style="font-size:0.72rem; font-weight:700; color:#fff; background:rgba(0,0,0,0.65); padding:2px 8px; border-radius:12px;">
                                                            🎬 Riproduci Video ${primaryMedia.duration ? `(${primaryMedia.duration})` : ''}
                                                        </span>
                                                    </div>
                                                ` : `
                                                    <img data-social-media-id="${primaryMedia.id}" src="${primaryMedia.thumbnailDataUrl || primaryMedia.url || './assets/violin-1.jpg'}" alt="${primaryMedia.name || item.titolo}" onerror="this.src='./assets/violin-1.jpg'" style="width:100%; height:100%; object-fit:cover; transition:transform 0.35s ease;">
                                                `
                                            ) : `
                                                <div style="text-align:center; color:var(--text-muted); padding:1rem;">
                                                    <i data-lucide="image-plus" style="width:36px; height:36px; color:var(--accent-gold); margin-bottom:0.4rem;"></i>
                                                    <div style="font-size:0.78rem;">Nessun file allegato • Clicca su Modifica per caricare Foto o Video</div>
                                                </div>
                                            `}

                                            <!-- Top-left Media Type & Size Badges -->
                                            <div style="position:absolute; top:10px; left:10px; display:flex; gap:0.4rem; flex-wrap:wrap;">
                                                ${hasVideo ? `
                                                    <span style="background:rgba(239, 68, 68, 0.9); color:#fff; font-size:0.7rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:6px; display:inline-flex; align-items:center; gap:0.3rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">
                                                        <i data-lucide="video" style="width:12px; height:12px;"></i> VIDEO
                                                    </span>
                                                ` : mediaList.length > 0 ? `
                                                    <span style="background:rgba(16, 185, 129, 0.9); color:#000; font-size:0.7rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:6px; display:inline-flex; align-items:center; gap:0.3rem; box-shadow:0 2px 8px rgba(0,0,0,0.5);">
                                                        <i data-lucide="camera" style="width:12px; height:12px;"></i> FOTO HD
                                                    </span>
                                                ` : ''}
                                                ${mediaList.length > 1 ? `
                                                    <span style="background:rgba(0,0,0,0.78); color:var(--accent-gold); border:1px solid rgba(245,158,11,0.4); font-size:0.7rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:6px;">
                                                        +${mediaList.length} File
                                                    </span>
                                                ` : ''}
                                                ${totalPostBytes > 0 ? `
                                                    <span style="background:rgba(0,0,0,0.78); color:#fff; font-family:var(--font-mono); font-size:0.68rem; padding:0.2rem 0.5rem; border-radius:6px;">
                                                        ${formatBytes(totalPostBytes)}
                                                    </span>
                                                ` : ''}
                                            </div>

                                            <!-- Top-right Post Status Badge -->
                                            <div style="position:absolute; top:10px; right:10px;">
                                                <span class="badge ${statusBadgeClass}" style="box-shadow:0 2px 10px rgba(0,0,0,0.6);">
                                                    ${item.stato}
                                                </span>
                                            </div>
                                        </div>

                                        <!-- Card Body -->
                                        <div style="padding:1.25rem 1.35rem 0.9rem 1.35rem;">
                                            <!-- Selected Social Networks Pills -->
                                            <div style="display:flex; flex-wrap:wrap; gap:0.38rem; margin-bottom:0.75rem;">
                                                ${platforms.map(pName => {
                                                    const key = Object.keys(platformMeta).find(k => pName.toLowerCase().includes(k.toLowerCase()));
                                                    const meta = key ? platformMeta[key] : { icon: "share-2", color: "#38bdf8", bg: "rgba(56, 189, 248, 0.15)", border: "rgba(56, 189, 248, 0.4)" };
                                                    return `
                                                        <span style="display:inline-flex; align-items:center; gap:0.3rem; font-size:0.72rem; font-weight:700; padding:0.2rem 0.55rem; border-radius:14px; background:${meta.bg}; color:${meta.color}; border:1px solid ${meta.border};">
                                                            <i data-lucide="${meta.icon}" style="width:12px; height:12px;"></i> ${pName}
                                                        </span>
                                                    `;
                                                }).join('')}
                                                ${item.formatoPost ? `
                                                    <span style="font-size:0.68rem; color:var(--text-muted); background:rgba(255,255,255,0.05); padding:0.2rem 0.5rem; border-radius:12px;">
                                                        ${item.formatoPost}
                                                    </span>
                                                ` : ''}
                                            </div>

                                            <!-- Title -->
                                            <h4 style="font-family:var(--font-heading); color:#fff; font-size:1.05rem; margin-bottom:0.5rem; line-height:1.35;">
                                                ${item.titolo}
                                            </h4>

                                            <!-- Scheduled Date & Countdown Box -->
                                            <div style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:0.6rem 0.8rem; margin-bottom:0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
                                                <div style="font-size:0.78rem; color:var(--accent-gold); display:flex; align-items:center; gap:0.35rem;">
                                                    <i data-lucide="calendar" style="width:14px; height:14px;"></i>
                                                    <strong>${formatScheduleDate(item.dataProgrammata)}</strong>
                                                </div>
                                                <span style="font-size:0.7rem; font-weight:700; padding:0.18rem 0.55rem; border-radius:12px; background:${cd.bg}; color:${cd.color}; display:inline-flex; align-items:center; gap:0.25rem;">
                                                    <i data-lucide="${cd.icon}" style="width:11px; height:11px;"></i> ${cd.label}
                                                </span>
                                            </div>

                                            ${item.errorePubblicazione ? `
                                                <div style="background:rgba(244, 63, 94, 0.14); border:1px solid rgba(244, 63, 94, 0.45); border-radius:8px; padding:0.55rem 0.75rem; margin-bottom:0.7rem; font-size:0.74rem; color:#fda4af;">
                                                    <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; margin-bottom:0.2rem;">
                                                        <strong style="color:#fb7185;">⚠️ Invio Automatico Bloccato:</strong>
                                                        <button type="button" class="btn btn-secondary" style="padding:0.15rem 0.5rem; font-size:0.68rem; border-color:#fb7185; color:#fff;" onclick="window.openSocialConfigModal()">Configura Webhook</button>
                                                    </div>
                                                    <div>${item.errorePubblicazione}</div>
                                                </div>
                                            ` : ''}

                                            ${item.note ? `
                                                <p style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:0.65rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
                                                    ${item.note}
                                                </p>
                                            ` : ''}

                                            <!-- Attached Media Files Summary -->
                                            ${mediaList.length > 0 ? `
                                                <div style="display:flex; flex-direction:column; gap:0.3rem; margin-bottom:0.7rem;">
                                                    ${mediaList.slice(0, 3).map(m => {
                                                        const isVid = m.kind === 'video' || (m.mimeType && m.mimeType.startsWith('video/'));
                                                        return `
                                                            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:0.3rem 0.55rem; border-radius:6px; font-size:0.73rem; border:1px solid rgba(255,255,255,0.05);">
                                                                <span style="color:#e5e7eb; display:flex; align-items:center; gap:0.35rem; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:65%;">
                                                                    <i data-lucide="${isVid ? 'film' : 'image'}" style="width:13px; height:13px; color:${isVid ? '#f43f5e' : 'var(--accent-emerald)'}; flex-shrink:0;"></i>
                                                                    <span style="overflow:hidden; text-overflow:ellipsis;">${m.name || 'File multimediale'}</span>
                                                                </span>
                                                                <span style="color:var(--text-muted); font-family:var(--font-mono); font-size:0.68rem; flex-shrink:0;">
                                                                    ${m.dimensions ? m.dimensions.split(' ')[0] + ' • ' : ''}${m.sizeFormatted || formatBytes(m.sizeBytes)}
                                                                </span>
                                                            </div>
                                                        `;
                                                    }).join('')}
                                                    ${mediaList.length > 3 ? `<div style="font-size:0.7rem; color:var(--accent-gold); text-align:right;">+${mediaList.length - 3} altri file allegati</div>` : ''}
                                                </div>
                                            ` : ''}

                                            <p style="font-size:0.74rem; color:var(--accent-cyan); margin-bottom:0.2rem; word-break:break-word;">${item.hashtag || ''}</p>
                                        </div>
                                    </div>

                                    <!-- Card Footer Actions -->
                                    <div style="padding:0.75rem 1.35rem; background:rgba(0,0,0,0.25); border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.4rem;">
                                        <div style="display:flex; gap:0.35rem;">
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.74rem;" onclick="window.openSocialPreviewModal('${item.id}')" title="Apri anteprima post e riproduci foto/video">
                                                <i data-lucide="play-circle" class="lucide-play-circle"></i> Player / Anteprima
                                            </button>
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.55rem; font-size:0.74rem;" onclick="window.openEditSocialModal('${item.id}')" title="Modifica post, file foto/video, data o social scelti">
                                                <i data-lucide="edit-3" class="lucide-edit-3"></i> Modifica
                                            </button>
                                        </div>
                                        <div style="display:flex; gap:0.35rem;">
                                            ${item.stato !== 'Pubblicato' ? `
                                                <button class="btn btn-primary" style="padding:0.3rem 0.65rem; font-size:0.74rem;" onclick="window.publishSocialPostNow('${item.id}')" title="Pubblica subito sui social scelti">
                                                    <i data-lucide="send" class="lucide-send"></i> Pubblica Ora
                                                </button>
                                            ` : `
                                                <button class="btn btn-secondary" style="padding:0.3rem 0.6rem; font-size:0.74rem; color:var(--accent-emerald); border-color:rgba(16,185,129,0.35);" onclick="window.openSocialPreviewModal('${item.id}')" title="Visualizza dettagli pubblicazione">
                                                    <i data-lucide="check-circle" class="lucide-check-circle"></i> Online
                                                </button>
                                            `}
                                            <button class="btn btn-secondary" style="padding:0.3rem 0.5rem; font-size:0.74rem; color:#ef4444;" onclick="window.deleteSocialPost('${item.id}', '${(item.titolo || '').replace(/'/g, "\\'")}')" title="Elimina post e file">
                                                <i data-lucide="trash-2" class="lucide-trash-2"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;

        // Hydrate any video/photo elements backed by IndexedDB large-file blobs
        if (window.socialMediaDB && typeof window.socialMediaDB.hydrateDOMMedia === 'function') {
            setTimeout(() => window.socialMediaDB.hydrateDOMMedia(container), 40);
        }
    }
};
