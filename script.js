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
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    function createStars(count) {
        stars = [];
        for (let i = 0; i < count; i++) {
            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.8 + 0.3,
                opacity: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.02 + 0.005,
                twinklePhase: Math.random() * Math.PI * 2,
                color: Math.random() > 0.8 
                    ? `hsl(${Math.random() * 60 + 220}, 75%, 82%)` 
                    : '#ffffff'
            });
        }
    }
    
    function maybeCreateShootingStar() {
        if (Math.random() < 0.004 && shootingStars.length < 2) {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * canvas.height * 0.5;
            shootingStars.push({
                x: startX,
                y: startY,
                length: Math.random() * 80 + 40,
                speed: Math.random() * 6 + 4,
                angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
                opacity: 1,
                decay: Math.random() * 0.015 + 0.01,
                trail: []
            });
        }
    }
    
    function drawStar(star, time) {
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
        const opacity = star.opacity * (0.5 + twinkle * 0.5);
        const radius = star.radius * (0.8 + twinkle * 0.2);
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
        
        if (star.radius > 1.2) {
            ctx.beginPath();
            ctx.arc(star.x, star.y, radius * 3, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
                star.x, star.y, 0,
                star.x, star.y, radius * 3
            );
            gradient.addColorStop(0, star.color);
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.globalAlpha = opacity * 0.15;
            ctx.fill();
        }
    }
    
    function drawShootingStar(ss) {
        const dx = Math.cos(ss.angle) * ss.speed;
        const dy = Math.sin(ss.angle) * ss.speed;
        
        ss.trail.unshift({ x: ss.x, y: ss.y });
        if (ss.trail.length > 15) ss.trail.pop();
        
        ss.x += dx;
        ss.y += dy;
        ss.opacity -= ss.decay;
        
        for (let i = 0; i < ss.trail.length; i++) {
            const t = ss.trail[i];
            const alpha = ss.opacity * (1 - i / ss.trail.length);
            const width = (1 - i / ss.trail.length) * 2;
            
            ctx.beginPath();
            ctx.arc(t.x, t.y, width, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = alpha;
            ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 3, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(ss.x, ss.y, 0, ss.x, ss.y, 6);
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = ss.opacity * 0.8;
        ctx.fill();
    }
    
    function animate(time) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
        
        stars.forEach(star => drawStar(star, time));
        
        maybeCreateShootingStar();
        shootingStars = shootingStars.filter(ss => ss.opacity > 0);
        shootingStars.forEach(ss => drawShootingStar(ss));
        
        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }
    
    resize();
    createStars(Math.min(220, Math.floor(window.innerWidth * window.innerHeight / 4500)));
    animate(0);
    
    window.addEventListener('resize', () => {
        resize();
        createStars(Math.min(220, Math.floor(window.innerWidth * window.innerHeight / 4500)));
    });
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
        anchor.addEventListener('click', function(e) {
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

    const heroBook   = document.querySelector('.hero-book');
    const floatSheep = document.querySelectorAll('.float-sheep');

    heroSection.addEventListener('mousemove', (e) => {
        const rect = heroSection.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to 0.5
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        // Book gentle 3D tilt
        if (heroBook) {
            heroBook.style.transform = `rotateY(${-4 + x * 10}deg) rotateX(${y * -5}deg) translateY(0)`;
        }

        // Floating corner sheep subtle parallax (each in opposite directions)
        floatSheep.forEach((sheep, i) => {
            const dir = (i % 2 === 0) ? 1 : -1;
            sheep.style.transform = `translateX(${x * dir * 8}px) translateY(${y * dir * 6}px)`;
        });
    });

    heroSection.addEventListener('mouseleave', () => {
        if (heroBook) heroBook.style.transform = '';
        floatSheep.forEach(s => s.style.transform = '');
    });
})();


// ── Particle Trail Effect ────────────────────────────────
(function initMouseTrail() {
    const hero = document.querySelector('.hero');
    if (!hero || window.innerWidth < 768) return;
    
    let particles = [];
    const maxParticles = 10;
    
    hero.addEventListener('mousemove', (e) => {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        const size = Math.random() * 5 + 2;
        const colors = ['#e8a0bf', '#b088d4', '#67d4e8', '#ffd166', '#ffffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            position: fixed;
            pointer-events: none;
            z-index: 4;
            opacity: 0.8;
            border-radius: 50%;
            transition: all 0.7s ease;
        `;
        
        document.body.appendChild(particle);
        particles.push(particle);
        
        requestAnimationFrame(() => {
            particle.style.opacity = '0';
            particle.style.transform = `translate(${(Math.random() - 0.5) * 30}px, ${(Math.random() - 0.5) * 30}px) scale(0)`;
        });
        
        setTimeout(() => {
            particle.remove();
            particles = particles.filter(p => p !== particle);
        }, 700);
        
        if (particles.length > maxParticles) {
            const old = particles.shift();
            old.remove();
        }
    });
})();


// ── Console Greeting ─────────────────────────────────────
console.log('%c Ovelhas Coloridas: Uma Aventura no Espaço! ', 
    'font-size: 18px; font-weight: bold; color: #e8a0bf; background: #0f1638; padding: 6px 12px; border-radius: 6px;');
console.log('%cPor Ana Carvalho & Rafael Diogo', 'font-size: 13px; color: #b088d4;');
