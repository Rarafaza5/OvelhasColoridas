/**
 * ═══════════════════════════════════════════════════════════
 * Ovelhas Coloridas: Uma Aventura no Espaço — Website JS
 * Interactive starfield, scroll animations, hero tilt
 * ═══════════════════════════════════════════════════════════
 */

// ── Starfield Canvas Animation ──────────────────────────
(function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    let stars = [];
    let shootingStars = [];
    let rafId = null;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.6 + 0.2,
                opacity: Math.random() * 0.7 + 0.2,
                twinkleSpeed: Math.random() * 0.015 + 0.003,
                twinklePhase: Math.random() * Math.PI * 2,
                // Pre-pick color string once — avoid repeated hsl() calls
                color: Math.random() > 0.85 ? '#b8c8ff' : '#ffffff'
            });
        }
    }

    function maybeCreateShootingStar() {
        if (isMobile) return; // skip on mobile for perf
        if (Math.random() < 0.003 && shootingStars.length < 2) {
            shootingStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height * 0.4,
                speed: Math.random() * 5 + 4,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                opacity: 1,
                decay: Math.random() * 0.018 + 0.012,
            });
        }
    }

    // Batch all stars into a single path per color group for fewer ctx state changes
    function drawStars(time) {
        const whiteStars = [];
        const blueStars = [];
        stars.forEach(star => {
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
            star._opacity = star.opacity * (0.5 + twinkle * 0.5);
            star._radius = star.radius * (0.85 + twinkle * 0.15);
            (star.color === '#ffffff' ? whiteStars : blueStars).push(star);
        });

        [{ arr: whiteStars, col: '#ffffff' }, { arr: blueStars, col: '#b8c8ff' }].forEach(({ arr, col }) => {
            arr.forEach(star => {
                ctx.globalAlpha = star._opacity;
                ctx.fillStyle = col;
                ctx.beginPath();
                ctx.arc(star.x, star.y, star._radius, 0, Math.PI * 2);
                ctx.fill();
            });
        });
    }

    function drawShootingStars() {
        shootingStars.forEach(ss => {
            ss.x += Math.cos(ss.angle) * ss.speed;
            ss.y += Math.sin(ss.angle) * ss.speed;
            ss.opacity -= ss.decay;

            ctx.globalAlpha = ss.opacity * 0.9;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
        shootingStars = shootingStars.filter(ss => ss.opacity > 0);
    }

    function animate(time) {
        // Fill with space colour instead of clearRect — avoids composite on transparent canvas
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#0a0e27';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawStars(time);
        maybeCreateShootingStar();
        drawShootingStars();

        ctx.globalAlpha = 1;
        rafId = requestAnimationFrame(animate);
    }

    // Debounced resize to avoid thrashing on every pixel
    let resizeTimer;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            resize();
            const area = window.innerWidth * window.innerHeight;
            const count = isMobile
                ? Math.min(60, Math.floor(area / 10000))
                : Math.min(140, Math.floor(area / 5500));
            createStars(count);
        }, 150);
    }

    resize();
    const area = window.innerWidth * window.innerHeight;
    const initialCount = isMobile
        ? Math.min(60, Math.floor(area / 10000))
        : Math.min(140, Math.floor(area / 5500));
    createStars(initialCount);
    rafId = requestAnimationFrame(animate);

    window.addEventListener('resize', onResize, { passive: true });
})();






// ── Page Loader ──────────────────────────────────────────
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('loaded');
        }, 600);
    }
});


// ── Navigation Scroll Effect ─────────────────────────────
(function initNavScroll() {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
})();


// ── Mobile Navigation ────────────────────────────────────
(function initMobileNav() {
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');

    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();


// ── Smooth Scroll ────────────────────────────────────────
(function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetEl = document.querySelector(targetId);

            if (targetEl) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
                const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
})();


// ── Intersection Observer — Reveal Animations ────────────
(function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
})();


// ── Scroll Indicator Hide ────────────────────────────────
(function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            indicator.style.opacity = '0';
            indicator.style.pointerEvents = 'none';
        } else {
            indicator.style.opacity = '1';
            indicator.style.pointerEvents = 'auto';
        }
    }, { passive: true });
})();


// ── Character Card Tilt Effect ───────────────────────────
(function initCharacterCards() {
    const cards = document.querySelectorAll('.character-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / centerY * -4;
            const rotateY = (x - centerX) / centerX * 4;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();


// ── Mouse Parallax for Hero (two-column layout) ──────────
(function initHeroParallax() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection || window.innerWidth < 768) return;

    const heroBook = document.querySelector('.hero-book');
    const floatSheep = document.querySelectorAll('.float-sheep');

    let rafPending = false;
    heroSection.addEventListener('mousemove', (e) => {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(() => {
            rafPending = false;
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            if (heroBook) {
                heroBook.style.transform = `rotateY(${-4 + x * 10}deg) rotateX(${y * -5}deg) translateY(0)`;
            }
            floatSheep.forEach((sheep, i) => {
                const dir = (i % 2 === 0) ? 1 : -1;
                sheep.style.transform = `translateX(${x * dir * 8}px) translateY(${y * dir * 6}px)`;
            });
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        if (heroBook) heroBook.style.transform = '';
        floatSheep.forEach(s => s.style.transform = '');
    });
})();



// ── Canvas Particle Trail (no DOM churn) ────────────────
(function initMouseTrail() {
    const hero = document.querySelector('.hero');
    if (!hero || window.innerWidth < 768) return;

    // Create a single overlay canvas — no DOM node creation per particle
    const cvs = document.createElement('canvas');
    cvs.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:4;';
    document.body.appendChild(cvs);
    const c = cvs.getContext('2d');

    function resize() {
        cvs.width = window.innerWidth;
        cvs.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = ['#e8a0bf', '#b088d4', '#67d4e8', '#ffd166', '#ffffff'];
    const particles = [];
    let lastX = 0, lastY = 0, rafActive = false;

    function loop() {
        c.clearRect(0, 0, cvs.width, cvs.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.life -= 0.025;
            p.x += p.vx;
            p.y += p.vy;
            if (p.life <= 0) { particles.splice(i, 1); continue; }
            c.globalAlpha = p.life * 0.8;
            c.fillStyle = p.color;
            c.beginPath();
            c.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
            c.fill();
        }
        c.globalAlpha = 1;
        if (particles.length > 0) requestAnimationFrame(loop);
        else rafActive = false;
    }

    hero.addEventListener('mousemove', (e) => {
        // throttle: spawn at most one particle every 40px of movement
        const dx = e.clientX - lastX, dy = e.clientY - lastY;
        if (dx * dx + dy * dy < 1600) return;
        lastX = e.clientX; lastY = e.clientY;

        particles.push({
            x: e.clientX,
            y: e.clientY,
            r: Math.random() * 4 + 2,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            life: 1
        });
        if (particles.length > 20) particles.shift();
        if (!rafActive) { rafActive = true; requestAnimationFrame(loop); }
    });
})();



// ── Launch Countdown Timer ───────────────────────────────
(function initCountdown() {
    const releaseDate = new Date('2026-08-02T00:00:00').getTime();
    const widget = document.getElementById('launch-countdown');
    if (!widget) return;

    const elDays  = document.getElementById('cd-days');
    const elHours = document.getElementById('cd-hours');
    const elMins  = document.getElementById('cd-mins');
    const elSecs  = document.getElementById('cd-secs');

    function pad(n) { return String(n).padStart(2, '0'); }

    function tick() {
        const diff = releaseDate - Date.now();

        if (diff <= 0) {
            widget.classList.add('hidden');
            clearInterval(timer);
            return;
        }

        const days  = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const mins  = Math.floor((diff % 3600000)  / 60000);
        const secs  = Math.floor((diff % 60000)    / 1000);

        elDays.textContent  = pad(days);
        elHours.textContent = pad(hours);
        elMins.textContent  = pad(mins);
        elSecs.textContent  = pad(secs);
    }

    tick();
    const timer = setInterval(tick, 1000);
})();


// ── Console Greeting ─────────────────────────────────────
console.log('%c Ovelhas Coloridas: Uma Aventura no Espaço! ',
    'font-size: 18px; font-weight: bold; color: #e8a0bf; background: #0f1638; padding: 6px 12px; border-radius: 6px;');
console.log('%cPor Ana Carvalho & Rafael Diogo', 'font-size: 13px; color: #b088d4;');










// ── Bloqueio de Compra até Lançamento (02/08/2026) ───────────
(function initReleaseLock() {
    // Data exata de lançamento: 2 de Agosto de 2026 às 00:00:00
    const releaseDate = new Date('2026-08-02T00:00:00').getTime();

    function updateBuyButtons() {
        const now = new Date().getTime();

        // Seleciona os botões de compra existentes no HTML
        const buyButtons = document.querySelectorAll('.nav-btn-cta, #hero-cta-buy, .cta-actions .btn-primary');

        if (now < releaseDate) {
            buyButtons.forEach(btn => {
                // Adiciona o estilo desabilitado
                btn.classList.add('btn-disabled');

                // Evita navegação caso o pointer-events do CSS falhe em algum browser antigo
                btn.addEventListener('click', function preventClick(e) {
                    if (new Date().getTime() < releaseDate) {
                        e.preventDefault();
                    }
                });

                // Altera o texto mantendo o ícone da ovelha caso este exista no HTML
                const icon = btn.querySelector('.btn-icon');
                if (icon) {
                    btn.innerHTML = 'Disponível a 02/08 <img src="' + icon.src + '" alt="" class="btn-icon">';
                } else {
                    btn.innerText = 'Disponível a 02/08';
                }
            });
        }
    }

    // Corre a verificação assim que a página carrega
    updateBuyButtons();

    // Verifica a cada 1 minuto. Assim, se um utilizador tiver a aba aberta 
    // à meia-noite do dia 02/08/2026, os botões desbloqueiam sozinhos em tempo real!
    setInterval(updateBuyButtons, 60000);
})();