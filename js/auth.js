/**
 * Atelier Liuteria - Modulo di Autenticazione e Sicurezza
 * - Verifica dominio di terzo livello: consentito solo gestionale.liuteriadelorenzi.it (e localhost per sviluppo/LAN)
 * - Autenticazione esclusiva per: fabio.delorenzi@gmail.com
 */

(function() {
    const AUTHORIZED_EMAIL = "fabio.delorenzi@gmail.com";
    const AUTHORIZED_DOMAIN = "gestionale.liuteriadelorenzi.it";
    const SESSION_KEY = "atelier_auth_session";

    class AuthController {
        constructor() {
            this.session = null;
            this.init();
        }

        init() {
            // 1. Verifica dominio di terzo livello
            if (!this.isDomainAllowed()) {
                this.renderDomainBlock();
                return;
            }

            // 2. Verifica sessione attiva
            this.session = this.loadSession();
            
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.onReady());
            } else {
                this.onReady();
            }
        }

        async onReady() {
            if (!this.isDomainAllowed()) return;

            if (!this.isAuthenticated()) {
                this.showLoginOverlay();
            } else {
                this.hideLoginOverlay();
                this.renderUserBadge();
            }

            this.bindEvents();
            await this.verifyServerSession();
        }

        async verifyServerSession() {
            try {
                const res = await fetch("/api/auth/session", { credentials: "same-origin" });
                if (!res.ok) return;
                const ct = (res.headers.get("content-type") || "").toLowerCase();
                if (!ct.includes("application/json")) return;
                const data = await res.json();
                if (data && data.authenticated === true) {
                    if (!this.isAuthenticated()) {
                        this.session = {
                            email: data.email || AUTHORIZED_EMAIL,
                            name: "Fabio De Lorenzi",
                            role: "Maestro Liutaio",
                            loginTime: new Date().toISOString()
                        };
                        localStorage.setItem(SESSION_KEY, JSON.stringify(this.session));
                        this.hideLoginOverlay();
                        this.renderUserBadge();
                    }
                } else if (data && data.authenticated === false) {
                    localStorage.removeItem(SESSION_KEY);
                    sessionStorage.removeItem(SESSION_KEY);
                    this.session = null;
                    const badge = document.getElementById("userProfileWidget");
                    if (badge) badge.remove();
                    this.showLoginOverlay();
                }
            } catch (e) {
                // Modalità offline / statica
            }
        }

        isDomainAllowed() {
            const host = window.location.hostname.toLowerCase();
            // Consenti localhost, indirizzi di rete locale (LAN bottega) e Tailscale (IP 100.x.x.x o MagicDNS .ts.net / hostname locale)
            if (
                host === "localhost" ||
                host === "127.0.0.1" ||
                host.startsWith("192.168.") ||
                host.startsWith("10.") ||
                host.startsWith("100.") ||
                host.endsWith(".ts.net") ||
                host.endsWith(".local") ||
                !host.includes(".")
            ) {
                return true;
            }

            // In produzione: consentito ESCLUSIVAMENTE gestionale.liuteriadelorenzi.it
            return host === AUTHORIZED_DOMAIN;
        }

        renderDomainBlock() {
            document.body.innerHTML = `
                <div style="min-height: 100vh; background: #120a05; color: #f4e8d3; display: flex; align-items: center; justify-content: center; font-family: 'Playfair Display', serif; padding: 2rem;">
                    <div style="max-width: 520px; background: rgba(28, 20, 13, 0.95); border: 1px solid #d68910; border-radius: 16px; padding: 2.5rem; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                        <div style="font-size: 3rem; margin-bottom: 1rem;">🔒</div>
                        <h2 style="color: #f39c12; margin-bottom: 1rem; font-size: 1.8rem;">Accesso Non Consentito</h2>
                        <p style="color: #e5d5c0; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; font-family: sans-serif;">
                            Questa suite gestionale è protetta e può essere utilizzata <strong>esclusivamente</strong> dal dominio ufficiale di terzo livello:
                        </p>
                        <div style="background: rgba(0,0,0,0.4); border: 1px dashed rgba(214,137,16,0.5); padding: 0.8rem; border-radius: 8px; font-family: monospace; color: #f5b041; margin-bottom: 2rem;">
                            https://${AUTHORIZED_DOMAIN}
                        </div>
                        <a href="https://${AUTHORIZED_DOMAIN}" style="display: inline-block; background: #d68910; color: #1c140d; padding: 0.85rem 1.8rem; border-radius: 30px; font-weight: 700; text-decoration: none; font-family: sans-serif; transition: all 0.3s ease;">
                            Vai a ${AUTHORIZED_DOMAIN}
                        </a>
                    </div>
                </div>
            `;
        }

        loadSession() {
            try {
                const raw = localStorage.getItem(SESSION_KEY);
                if (!raw) return null;
                const data = JSON.parse(raw);
                if (data && data.email && data.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase()) {
                    return data;
                }
            } catch (e) {
                console.error("Errore lettura sessione auth:", e);
            }
            return null;
        }

        isAuthenticated() {
            return this.session && this.session.email && this.session.email.toLowerCase() === AUTHORIZED_EMAIL.toLowerCase();
        }

        showLoginOverlay() {
            const overlay = document.getElementById("loginOverlay");
            if (overlay) {
                overlay.style.display = "flex";
                document.body.classList.add("auth-locked");
                const emailInput = document.getElementById("authEmail");
                if (emailInput && !emailInput.value) {
                    emailInput.value = AUTHORIZED_EMAIL;
                }
            }
        }

        hideLoginOverlay() {
            const overlay = document.getElementById("loginOverlay");
            if (overlay) {
                overlay.style.display = "none";
                document.body.classList.remove("auth-locked");
            }
        }

        bindEvents() {
            const loginForm = document.getElementById("loginForm");
            if (loginForm) {
                loginForm.addEventListener("submit", (e) => this.handleLogin(e));
            }

            const togglePwdBtn = document.getElementById("togglePwdBtn");
            if (togglePwdBtn) {
                togglePwdBtn.addEventListener("click", () => {
                    const pwdInput = document.getElementById("authPassword");
                    if (pwdInput) {
                        const isPassword = pwdInput.type === "password";
                        pwdInput.type = isPassword ? "text" : "password";
                        togglePwdBtn.innerHTML = isPassword ? `<i data-lucide="eye-off"></i>` : `<i data-lucide="eye"></i>`;
                        if (window.lucide) window.lucide.createIcons();
                    }
                });
            }
        }

        async handleLogin(e) {
            e.preventDefault();
            const errBox = document.getElementById("loginErrorBox");
            if (errBox) {
                errBox.style.display = "none";
                errBox.innerText = "";
            }

            const emailInput = document.getElementById("authEmail");
            const pwdInput = document.getElementById("authPassword");
            const rememberCheck = document.getElementById("authRemember");

            const email = emailInput ? emailInput.value.trim().toLowerCase() : "";
            const pwd = pwdInput ? pwdInput.value : "";
            const remember = Boolean(rememberCheck && rememberCheck.checked);

            if (email !== AUTHORIZED_EMAIL.toLowerCase()) {
                this.showError(`Accesso Negato: L'indirizzo "${email}" non è autorizzato. Solo l'utente ${AUTHORIZED_EMAIL} può accedere a questo gestionale.`);
                return;
            }

            let serverHandled = false;
            try {
                const res = await fetch("/api/auth/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin",
                    body: JSON.stringify({ email, password: pwd, remember })
                });
                const ct = (res.headers.get("content-type") || "").toLowerCase();
                if (ct.includes("application/json")) {
                    serverHandled = true;
                    const data = await res.json();
                    if (!res.ok || !data.success) {
                        this.showError(data.error || "Chiave di accesso / Password errata. Riprova.");
                        return;
                    }
                }
            } catch (err) {
                // Server non raggiungibile -> modalità offline
            }

            if (!serverHandled && !pwd) {
                this.showError("Inserisci la password di accesso.");
                return;
            }

            const sessionData = {
                email: AUTHORIZED_EMAIL,
                name: "Fabio De Lorenzi",
                role: "Maestro Liutaio",
                loginTime: new Date().toISOString()
            };

            if (remember) {
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            } else {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
                localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            }

            this.session = sessionData;
            this.hideLoginOverlay();
            this.renderUserBadge();

            if (window.atelierDB && typeof window.atelierDB.syncFromMongo === "function") {
                window.atelierDB.syncFromMongo();
            }
            if (typeof window.syncBibliotecaFromServer === "function") {
                window.syncBibliotecaFromServer();
            }
            if (typeof window.refreshDbStatusIndicator === "function") {
                window.refreshDbStatusIndicator();
            }

            if (window.showToast) {
                window.showToast(`Bentornato Maestro De Lorenzi (${AUTHORIZED_EMAIL})`);
            }
        }

        showError(msg) {
            const errBox = document.getElementById("loginErrorBox");
            if (errBox) {
                errBox.innerText = msg;
                errBox.style.display = "block";
            }
        }

        async logout() {
            if (confirm("Sei sicuro di voler effettuare la disconnessione dalla suite gestionale?")) {
                try {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
                } catch (e) {
                    // ignore
                }
                localStorage.removeItem(SESSION_KEY);
                sessionStorage.removeItem(SESSION_KEY);
                this.session = null;
                const badge = document.getElementById("userProfileWidget");
                if (badge) badge.remove();
                this.showLoginOverlay();
                if (window.showToast) {
                    window.showToast("Disconnessione effettuata con successo.");
                }
            }
        }

        renderUserBadge() {
            const headerRight = document.querySelector(".header-right-section");
            if (!headerRight || document.getElementById("userProfileWidget")) return;

            const widget = document.createElement("div");
            widget.id = "userProfileWidget";
            widget.className = "user-profile-widget";
            widget.innerHTML = `
                <div class="user-info-pill" title="Utente autorizzato: ${AUTHORIZED_EMAIL}">
                    <span class="user-status-dot"></span>
                    <i data-lucide="shield-check" class="lucide-shield-check" style="width:14px; height:14px; color:var(--accent-emerald);"></i>
                    <span class="user-name-label">F. De Lorenzi</span>
                </div>
                <button class="btn btn-secondary btn-icon btn-logout" onclick="window.authController.logout()" title="Disconnetti (${AUTHORIZED_EMAIL})">
                    <i data-lucide="log-out" class="lucide-log-out"></i>
                </button>
            `;

            // Inserisci prima della riga delle icone
            const iconsRow = headerRight.querySelector(".header-icons-row");
            if (iconsRow) {
                headerRight.insertBefore(widget, iconsRow);
            } else {
                headerRight.appendChild(widget);
            }

            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    window.authController = new AuthController();
})();
