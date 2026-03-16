// Ahmad Aidil Azazi — Portfolio v2
// Optimized & Clean JavaScript

(function () {
    'use strict';

    // ---- UTILS ----
    function debounce(fn, ms) {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
    }
    function throttle(fn, ms) {
        let ok = true;
        return (...args) => { if (!ok) return; fn(...args); ok = false; setTimeout(() => ok = true, ms); };
    }
    const isMobile = () => window.innerWidth <= 768;
    const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- LOADER ----
    const loader = document.getElementById('loader');
    function hideLoader() {
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.style.display = 'none', 600);
        }
    }
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 3000);

    // ---- CUSTOM CURSOR ----
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0, followX = 0, followY = 0;

    if (cursor && cursorFollower && !isMobile()) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });

        function animateFollower() {
            followX += (mouseX - followX) * 0.12;
            followY += (mouseY - followY) * 0.12;
            cursorFollower.style.left = followX + 'px';
            cursorFollower.style.top = followY + 'px';
            requestAnimationFrame(animateFollower);
        }
        animateFollower();

        document.querySelectorAll('a, button, .port-card').forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorFollower.style.width = '48px';
                cursorFollower.style.height = '48px';
                cursorFollower.style.opacity = '0.8';
            });
            el.addEventListener('mouseleave', () => {
                cursorFollower.style.width = '32px';
                cursorFollower.style.height = '32px';
                cursorFollower.style.opacity = '0.5';
            });
        });
    }

    // ---- NEURAL CANVAS ----
    try {
        const canvas = document.getElementById('neural-bg');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            let nodes = [], animId, isAnim = true;

            const cfg = () => ({
                count: isMobile() ? 35 : 80,
                dist: isMobile() ? 100 : 140,
                speed: isMobile() ? 0.25 : 0.45,
            });

            function resize() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            class Node {
                constructor() {
                    const c = cfg();
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.vx = (Math.random() - 0.5) * c.speed;
                    this.vy = (Math.random() - 0.5) * c.speed;
                    this.r = Math.random() * 2 + 1;
                }
                update() {
                    this.x += this.vx; this.y += this.vy;
                    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
                }
                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                    ctx.fillStyle = '#00c8a0';
                    ctx.fill();
                }
            }

            function init() {
                nodes = Array.from({ length: cfg().count }, () => new Node());
            }

            function connect() {
                const d = cfg().dist;
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dx = nodes[i].x - nodes[j].x;
                        const dy = nodes[i].y - nodes[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < d) {
                            ctx.beginPath();
                            ctx.moveTo(nodes[i].x, nodes[i].y);
                            ctx.lineTo(nodes[j].x, nodes[j].y);
                            ctx.strokeStyle = `rgba(0, 200, 160, ${(1 - dist / d) * 0.5})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }

            function animate() {
                if (!isAnim) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                nodes.forEach(n => { n.update(); n.draw(); });
                connect();
                animId = requestAnimationFrame(animate);
            }

            document.addEventListener('visibilitychange', () => {
                if (document.hidden) { isAnim = false; cancelAnimationFrame(animId); }
                else { isAnim = true; animate(); }
            });

            if (!reducedMotion()) {
                resize(); init(); animate();
            }

            window.addEventListener('resize', debounce(() => { resize(); init(); }, 250));

            let scrollTimer;
            window.addEventListener('scroll', () => {
                if (isMobile()) {
                    isAnim = false;
                    clearTimeout(scrollTimer);
                    scrollTimer = setTimeout(() => { isAnim = true; animate(); }, 200);
                }
            }, { passive: true });
        }
    } catch (e) {
        console.warn('Canvas animation skipped:', e);
    }

    // ---- TYPED TEXT ----
    const typedEl = document.getElementById('typed-text');
    const roles = [
        'Aspiring Penetration Tester',
        'Ethical Hacker in Training',
        'Network Security Enthusiast',
        'Linux & Kali Linux User',
        'MikroTik Network Engineer',
    ];
    let ri = 0, ci = 0, deleting = false, typePause = false;

    function typeLoop() {
        if (typePause) return;
        const current = roles[ri];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++ci);
            if (ci === current.length) { typePause = true; setTimeout(() => { typePause = false; deleting = true; typeLoop(); }, 2200); return; }
            setTimeout(typeLoop, 65);
        } else {
            typedEl.textContent = current.slice(0, --ci);
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 400); return; }
            setTimeout(typeLoop, 35);
        }
    }
    if (typedEl) typeLoop();

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');
    const handleScroll = throttle(() => {
        const scrollY = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', scrollY > 50);
        const st = document.getElementById('scroll-top');
        if (st) st.classList.toggle('visible', scrollY > 500);
    }, 100);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ---- SCROLL TO TOP ----
    const st = document.getElementById('scroll-top');
    if (st) st.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));

    // ---- MOBILE MENU ----
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const open = navLinks.classList.toggle('active');
            navToggle.classList.toggle('active', open);
            navToggle.setAttribute('aria-expanded', String(open));
            document.body.style.overflow = open ? 'hidden' : '';
        });
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ---- SMOOTH SCROLL ----
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
            const target = document.querySelector(a.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = (navbar?.offsetHeight || 70) + 20;
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - offset,
                behavior: reducedMotion() ? 'auto' : 'smooth'
            });
        });
    });

    // ---- INTERSECTION OBSERVER (reveal + skill bars) ----
    const revealEls = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window && !reducedMotion()) {
        // Hide elements first (only if JS is running and observer is supported)
        revealEls.forEach(el => el.classList.add('hidden-init'));

        const revealObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.remove('hidden-init');
                    e.target.classList.add('visible');
                    revealObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.06, rootMargin: '0px 0px -30px 0px' });

        revealEls.forEach(el => revealObs.observe(el));

        // Skill bar fill
        const skillObs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.querySelectorAll('.skill-fill').forEach(f => { f.style.width = f.dataset.w + '%'; });
                    skillObs.unobserve(e.target);
                }
            });
        }, { threshold: 0.3 });
        document.querySelectorAll('.skill-list').forEach(el => skillObs.observe(el));

    } else {
        // Fallback: show everything immediately
        revealEls.forEach(el => el.classList.add('visible'));
        document.querySelectorAll('.skill-fill').forEach(f => f.style.width = f.dataset.w + '%');
    }

    // ---- CONTACT FORM ----
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = form.querySelector('#c-name')?.value.trim();
            const email = form.querySelector('#c-email')?.value.trim();
            const msg = form.querySelector('#c-message')?.value.trim();
            if (!name || !email || !msg) { alert('Mohon isi semua field wajib.'); return; }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { alert('Email tidak valid.'); return; }
            alert('Pesan terkirim! Terima kasih, Aidil akan segera merespons. (Demo)');
            form.reset();
        });
    }

})();
