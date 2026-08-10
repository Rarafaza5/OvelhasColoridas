/**
 * ═══════════════════════════════════════════════════════════════
 *  COOKIE CONSENT + GOOGLE ANALYTICS — Ovelhas Coloridas
 *  RGPD / GDPR compliant — GA Consent Mode v2
 *  Measurement ID: G-BGCQT355WJ
 * ═══════════════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    /* ── Config ── */
    const GA_ID = 'G-BGCQT355WJ';
    const STORAGE_KEY = 'oc_cookie_consent';
    const CONSENT_VERSION = '1';

    /* ── Detect base path from the script tag itself (robust on any protocol / subdirectory) ── */
    // document.currentScript is set while this script executes synchronously
    const _scriptEl = document.currentScript;

    function sheepPath(filename) {
        // Use the script's own src to find the root assets folder
        const src = (_scriptEl || {}).src || '';
        const base = src
            ? src.replace(/[^\/]*\.js[^/]*$/, '') // strip 'cookie-consent.js' from URL
            : '';
        return base + 'assets/personagens/' + filename;
    }

    function policyPath() {
        const src = (_scriptEl || {}).src || '';
        const base = src ? src.replace(/[^\/]*\.js[^/]*$/, '') : '';
        return base + 'politica-cookies.html';
    }

    /* ══════════════════════════════════════════
       1. GA CONSENT MODE v2 — Default DENIED
       ══════════════════════════════════════════ */
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    // Set default consent state BEFORE gtag loads
    gtag('consent', 'default', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        wait_for_update: 500
    });

    // Load GA script dynamically
    (function loadGAScript() {
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
        document.head.appendChild(s);
    })();

    gtag('js', new Date());
    gtag('config', GA_ID, {
        send_page_view: false // We'll send manually after consent check
    });

    /* ══════════════════════════════════════════
       2. CONSENT STATE MANAGEMENT
       ══════════════════════════════════════════ */
    function getConsent() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            return null;
        }
    }

    function saveConsent(analytics, version) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                analytics: analytics,
                version: version || CONSENT_VERSION,
                timestamp: new Date().toISOString()
            }));
        } catch (e) { /* storage not available */ }
    }

    function applyConsent(analyticsGranted) {
        const state = analyticsGranted ? 'granted' : 'denied';
        gtag('consent', 'update', {
            analytics_storage: state,
            ad_storage: 'denied',   // We don't run ads, keep denied
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });

        if (analyticsGranted) {
            // Now send the page view
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: location.href
            });
        }
    }

    /* ══════════════════════════════════════════
       3. ADVANCED TRACKING EVENTS
       ══════════════════════════════════════════ */
    function trackEvent(name, params) {
        const consent = getConsent();
        if (!consent || !consent.analytics) return;
        gtag('event', name, params || {});
    }

    /* ── Scroll Depth ── */
    function initScrollTracking() {
        const milestones = [25, 50, 75, 100];
        const reached = new Set();

        function checkScroll() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;
            const pct = Math.round((scrollTop / docHeight) * 100);

            milestones.forEach(function (m) {
                if (pct >= m && !reached.has(m)) {
                    reached.add(m);
                    trackEvent('scroll_depth', {
                        depth_percent: m,
                        page_title: document.title
                    });
                }
            });
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
    }

    /* ── Session Duration ── */
    function initSessionTracking() {
        const checkpoints = [30, 60, 120]; // seconds
        checkpoints.forEach(function (secs) {
            setTimeout(function () {
                trackEvent('session_duration', {
                    seconds: secs,
                    page_title: document.title
                });
            }, secs * 1000);
        });
    }

    /* ── Outbound / Purchase link clicks ── */
    function initLinkTracking() {
        document.addEventListener('click', function (e) {
            const anchor = e.target.closest('a[href]');
            if (!anchor) return;

            const href = anchor.href || '';
            const id = anchor.id || '';

            // Amazon or external purchase links
            if (href.includes('amazon.')) {
                trackEvent('outbound_link_click', {
                    link_url: href,
                    link_id: id,
                    link_text: anchor.textContent.trim().substring(0, 60),
                    destination: 'amazon'
                });
                trackEvent('purchase_intent', {
                    link_id: id,
                    link_url: href,
                    method: 'direct_link'
                });
            }

            // Email links
            if (href.startsWith('mailto:')) {
                trackEvent('outbound_link_click', {
                    link_url: href,
                    link_id: id,
                    destination: 'email'
                });
            }

            // Any other external link
            const isExternal = anchor.hostname && anchor.hostname !== location.hostname;
            if (isExternal && !href.includes('amazon.')) {
                trackEvent('outbound_link_click', {
                    link_url: href,
                    link_id: id,
                    destination: anchor.hostname
                });
            }
        });
    }

    /* ── Purchase buttons (not anchor tags) ── */
    function initButtonTracking() {
        // CTA buy buttons
        ['cta-buy-trigger', 'hero-cta-buy'].forEach(function (btnId) {
            const btn = document.getElementById(btnId);
            if (!btn) return;
            btn.addEventListener('click', function () {
                trackEvent('purchase_intent', {
                    button_id: btnId,
                    method: 'button_click',
                    page_section: btnId.includes('hero') ? 'hero' : 'cta'
                });
            });
        });

        // Modal format selection
        ['purchase-option-fisico', 'purchase-option-ebook', 'purchase-option-english'].forEach(function (optId) {
            const el = document.getElementById(optId);
            if (!el) return;
            const formatMap = {
                'purchase-option-fisico': 'Físico',
                'purchase-option-ebook': 'eBook',
                'purchase-option-english': 'English'
            };
            el.addEventListener('click', function () {
                trackEvent('purchase_format_selected', {
                    format: formatMap[optId],
                    element_id: optId
                });
                trackEvent('purchase_intent', {
                    method: 'modal_format',
                    format: formatMap[optId]
                });
            });
        });
    }

    /* ── Character card clicks ── */
    function initCharacterTracking() {
        const charIds = [
            'char-arcoiris', 'char-azul', 'char-roxa',
            'char-melancia', 'char-verde', 'char-rosa', 'char-laranja'
        ];
        charIds.forEach(function (id) {
            const el = document.getElementById(id);
            if (!el) return;
            el.addEventListener('click', function () {
                trackEvent('character_card_click', {
                    character_id: id,
                    character_name: id.replace('char-', '')
                });
            });
        });
    }

    /* ── Navigation tracking ── */
    function initNavTracking() {
        // Navbar section links
        document.querySelectorAll('.nav-link, .nav-btn-cta').forEach(function (link) {
            link.addEventListener('click', function () {
                trackEvent('nav_section_click', {
                    section: link.getAttribute('href') || link.textContent.trim(),
                    link_text: link.textContent.trim()
                });
            });
        });

        // Hamburger menu
        const hamburger = document.getElementById('nav-hamburger');
        if (hamburger) {
            hamburger.addEventListener('click', function () {
                trackEvent('mobile_menu_toggle', {
                    page_title: document.title
                });
            });
        }

        // Link tree cards (i/ page)
        document.querySelectorAll('.link-card').forEach(function (card) {
            card.addEventListener('click', function () {
                trackEvent('linktree_click', {
                    link_id: card.id,
                    link_title: (card.querySelector('.card-title') || {}).textContent || card.id
                });
            });
        });
    }

    /* ── Countdown page specific ── */
    function initCountdownTracking() {
        // Track when user submits email/notify-me form if exists
        const notifyForm = document.getElementById('notify-form') || document.querySelector('form');
        if (notifyForm) {
            notifyForm.addEventListener('submit', function () {
                trackEvent('notify_me_submit', { page_title: document.title });
            });
        }
    }

    /* ── Init all trackers ── */
    function initAllTracking() {
        initScrollTracking();
        initSessionTracking();
        initLinkTracking();
        initButtonTracking();
        initCharacterTracking();
        initNavTracking();
        initCountdownTracking();
    }

    /* ══════════════════════════════════════════
       4. BUILD BANNER HTML
       ══════════════════════════════════════════ */
    function buildBanner() {
        const sheepImg = sheepPath('ovelha-arcoiris.png');
        const sheepImgSmall = sheepPath('ovelha-roxa.png');
        const policyHref = policyPath();

        // Overlay
        const overlay = document.createElement('div');
        overlay.id = 'cc-overlay';

        // Banner
        const banner = document.createElement('div');
        banner.id = 'cc-banner';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-modal', 'false');
        banner.setAttribute('aria-label', 'Aviso de cookies');
        banner.innerHTML = `
            <div class="cc-banner-inner">
                <img src="${sheepImg}" alt="" class="cc-sheep-icon" loading="lazy">
                <div class="cc-text">
                    <h3>🍪 Usamos cookies neste site</h3>
                    <p>
                        Utilizamos cookies analíticos (Google Analytics) para perceber como os visitantes usam o site
                        e melhorar a experiência. Os teus dados são tratados de forma anónima.
                        <a href="${policyHref}">Saber mais</a>
                    </p>
                </div>
                <div class="cc-buttons">
                    <button class="cc-btn cc-btn-settings" id="cc-settings-trigger" type="button">Preferências</button>
                    <button class="cc-btn cc-btn-reject" id="cc-reject-btn" type="button">Só Essenciais</button>
                    <button class="cc-btn cc-btn-accept" id="cc-accept-btn" type="button">✓ Aceitar Todos</button>
                </div>
            </div>
        `;

        // Settings panel
        const panel = document.createElement('div');
        panel.id = 'cc-settings-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-labelledby', 'cc-panel-title');
        panel.innerHTML = `
            <div class="cc-settings-header">
                <div class="cc-settings-title">
                    <img src="${sheepImgSmall}" alt="">
                    <span id="cc-panel-title">Preferências de Cookies</span>
                </div>
                <button class="cc-close-btn" id="cc-panel-close" type="button" aria-label="Fechar">×</button>
            </div>
            <p class="cc-settings-desc">
                Podes escolher quais os cookies que aceitas. Os cookies essenciais são sempre necessários para o
                funcionamento básico do site e não podem ser desativados.
            </p>

            <div class="cc-category">
                <div class="cc-category-header">
                    <div class="cc-category-info">
                        <div class="cc-category-name">🔒 Cookies Essenciais</div>
                        <div class="cc-category-desc">
                            Necessários para o funcionamento do site (navegação, preferências de sessão).
                            Não recolhem dados pessoais identificáveis.
                        </div>
                    </div>
                    <span class="cc-always-on">Sempre Ativo</span>
                </div>
            </div>

            <div class="cc-category">
                <div class="cc-category-header">
                    <div class="cc-category-info">
                        <div class="cc-category-name">📊 Cookies Analíticos (Google Analytics)</div>
                        <div class="cc-category-desc">
                            Ajudam-nos a perceber como os visitantes interagem com o site — páginas visitadas,
                            tempo de sessão, origem do tráfego. Dados anónimos e agregados. Fornecido pela Google LLC.
                        </div>
                    </div>
                    <div class="cc-toggle-wrapper">
                        <input type="checkbox" class="cc-toggle" id="cc-toggle-analytics" role="switch"
                            aria-label="Ativar cookies analíticos">
                    </div>
                </div>
            </div>

            <div class="cc-settings-footer">
                <button class="cc-btn cc-btn-reject" id="cc-save-essential" type="button">Guardar Seleção</button>
                <button class="cc-btn cc-btn-accept" id="cc-save-all" type="button">✓ Aceitar Todos</button>
            </div>
        `;

        // Revoke button (shown after consent given)
        const revokeBtn = document.createElement('button');
        revokeBtn.id = 'cc-revoke-btn';
        revokeBtn.type = 'button';
        revokeBtn.setAttribute('aria-label', 'Gerir preferências de cookies');
        revokeBtn.innerHTML = `<img src="${sheepImg}" alt=""> Cookies`;

        document.body.appendChild(overlay);
        document.body.appendChild(banner);
        document.body.appendChild(panel);
        document.body.appendChild(revokeBtn);
    }

    /* ══════════════════════════════════════════
       5. BANNER LOGIC & EVENT HANDLERS
       ══════════════════════════════════════════ */
    function showBanner() {
        requestAnimationFrame(function () {
            document.getElementById('cc-banner').classList.add('cc-visible');
        });
    }

    function hideBanner() {
        document.getElementById('cc-banner').classList.remove('cc-visible');
    }

    function showPanel() {
        document.getElementById('cc-overlay').classList.add('cc-visible');
        document.getElementById('cc-settings-panel').classList.add('cc-visible');
        // Sync toggle with current state
        const consent = getConsent();
        const toggle = document.getElementById('cc-toggle-analytics');
        if (toggle) toggle.checked = consent && consent.analytics ? true : false;
    }

    function hidePanel() {
        document.getElementById('cc-overlay').classList.remove('cc-visible');
        document.getElementById('cc-settings-panel').classList.remove('cc-visible');
    }

    function showRevokeBtn() {
        setTimeout(function () {
            const btn = document.getElementById('cc-revoke-btn');
            if (btn) btn.classList.add('cc-visible');
        }, 2000);
    }

    function onAcceptAll() {
        saveConsent(true, CONSENT_VERSION);
        applyConsent(true);
        hideBanner();
        hidePanel();
        showRevokeBtn();
        trackEvent('cookie_consent_accepted', { method: 'accept_all' });
        initAllTracking();
    }

    function onRejectAll() {
        saveConsent(false, CONSENT_VERSION);
        applyConsent(false);
        hideBanner();
        hidePanel();
        showRevokeBtn();
        gtag('event', 'cookie_consent_rejected', { method: 'reject_all' });
    }

    function onSaveSelection() {
        const toggle = document.getElementById('cc-toggle-analytics');
        const analyticsGranted = toggle ? toggle.checked : false;
        saveConsent(analyticsGranted, CONSENT_VERSION);
        applyConsent(analyticsGranted);
        hideBanner();
        hidePanel();
        showRevokeBtn();
        if (analyticsGranted) {
            trackEvent('cookie_consent_accepted', { method: 'custom_selection' });
            initAllTracking();
        } else {
            gtag('event', 'cookie_consent_rejected', { method: 'custom_selection' });
        }
    }

    function bindEvents() {
        document.getElementById('cc-accept-btn').addEventListener('click', onAcceptAll);
        document.getElementById('cc-reject-btn').addEventListener('click', onRejectAll);
        document.getElementById('cc-settings-trigger').addEventListener('click', showPanel);
        document.getElementById('cc-panel-close').addEventListener('click', hidePanel);
        document.getElementById('cc-overlay').addEventListener('click', hidePanel);
        document.getElementById('cc-save-all').addEventListener('click', onAcceptAll);
        document.getElementById('cc-save-essential').addEventListener('click', onSaveSelection);
        document.getElementById('cc-revoke-btn').addEventListener('click', function () {
            showPanel();
            // Also show banner so user can change mind
            showBanner();
        });

        // Keyboard: close panel with Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hidePanel();
            }
        });
    }

    /* ══════════════════════════════════════════
       6. INITIALISE
       ══════════════════════════════════════════ */
    function init() {
        buildBanner();
        bindEvents();

        const consent = getConsent();

        if (consent === null) {
            // First visit — show banner
            setTimeout(showBanner, 800);
        } else {
            // Returning visitor — apply saved consent immediately
            applyConsent(consent.analytics);
            showRevokeBtn();

            if (consent.analytics) {
                initAllTracking();
            }
        }
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
