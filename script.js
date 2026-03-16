// Ahmad Aidil Azazi - Portfolio Script
// Compatible with Mi Browser, Samsung Internet, Chrome, Firefox

(function () {

    // ---- LOADER ----
    var loader = document.getElementById('loader');
    function hideLoader() {
        if (!loader) return;
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
        loader.style.pointerEvents = 'none';
        setTimeout(function () { loader.style.display = 'none'; }, 500);
    }
    // Hide on DOMContentLoaded (fast)
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () { setTimeout(hideLoader, 400); });
    } else {
        setTimeout(hideLoader, 400);
    }
    window.addEventListener('load', hideLoader);
    // Hard fallback
    setTimeout(hideLoader, 1500);

    // ---- MOBILE MENU ----
    var navToggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            var isOpen = navLinks.classList.toggle('open');
            navToggle.classList.toggle('active', isOpen);
            navToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });
        // Close on link click
        var links = navLinks.querySelectorAll('a');
        for (var i = 0; i < links.length; i++) {
            links[i].addEventListener('click', function () {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        }
        // Close on outside click
        document.addEventListener('click', function (e) {
            if (navLinks.classList.contains('open') &&
                !navLinks.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ---- SMOOTH SCROLL ----
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var a = 0; a < anchors.length; a++) {
        anchors[a].addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            var target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            var navbar = document.getElementById('navbar');
            var offset = navbar ? navbar.offsetHeight + 20 : 80;
            var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: top, behavior: 'smooth' });
        });
    }

    // ---- NAVBAR + SCROLL TOP ----
    var navbar = document.getElementById('navbar');
    var scrollTopBtn = document.getElementById('scroll-top');
    var lastScroll = 0;

    function onScroll() {
        var y = window.pageYOffset;
        if (navbar) navbar.classList.toggle('scrolled', y > 50);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 400);
        lastScroll = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- TYPED TEXT ----
    var typedEl = document.getElementById('typed-text');
    var roles = [
        'Aspiring Penetration Tester',
        'Ethical Hacker in Training',
        'Network Security Enthusiast',
        'Linux & Kali Linux User',
        'MikroTik Network Engineer'
    ];
    var ri = 0, ci = 0, deleting = false, paused = false;

    function typeLoop() {
        if (!typedEl || paused) return;
        var current = roles[ri];
        if (!deleting) {
            ci++;
            typedEl.textContent = current.slice(0, ci);
            if (ci === current.length) {
                paused = true;
                setTimeout(function () { paused = false; deleting = true; typeLoop(); }, 2000);
                return;
            }
            setTimeout(typeLoop, 65);
        } else {
            ci--;
            typedEl.textContent = current.slice(0, ci);
            if (ci === 0) {
                deleting = false;
                ri = (ri + 1) % roles.length;
                setTimeout(typeLoop, 350);
                return;
            }
            setTimeout(typeLoop, 35);
        }
    }
    if (typedEl) setTimeout(typeLoop, 800);

    // ---- REVEAL ON SCROLL ----
    // Safe approach: add animation class only if IntersectionObserver works
    var revealEls = document.querySelectorAll('.reveal');

    function supportsIO() {
        try { return 'IntersectionObserver' in window; }
        catch (e) { return false; }
    }

    if (supportsIO()) {
        // Mark elements for animation
        for (var r = 0; r < revealEls.length; r++) {
            revealEls[r].classList.add('will-animate');
        }
        var observer = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    entries[i].target.classList.remove('will-animate');
                    entries[i].target.classList.add('in-view');
                    observer.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });

        for (var r2 = 0; r2 < revealEls.length; r2++) {
            observer.observe(revealEls[r2]);
        }

        // Skill bars
        var skillLists = document.querySelectorAll('.skill-list');
        var skillObs = new IntersectionObserver(function (entries) {
            for (var i = 0; i < entries.length; i++) {
                if (entries[i].isIntersecting) {
                    var fills = entries[i].target.querySelectorAll('.skill-fill');
                    for (var f = 0; f < fills.length; f++) {
                        fills[f].style.width = fills[f].getAttribute('data-w') + '%';
                    }
                    skillObs.unobserve(entries[i].target);
                }
            }
        }, { threshold: 0.3 });
        for (var s = 0; s < skillLists.length; s++) {
            skillObs.observe(skillLists[s]);
        }
    } else {
        // Fallback: show all immediately
        for (var r3 = 0; r3 < revealEls.length; r3++) {
            revealEls[r3].classList.add('in-view');
        }
        var fills = document.querySelectorAll('.skill-fill');
        for (var f2 = 0; f2 < fills.length; f2++) {
            fills[f2].style.width = fills[f2].getAttribute('data-w') + '%';
        }
    }

    // ---- NEURAL CANVAS ----
    try {
        var canvas = document.getElementById('neural-bg');
        if (!canvas || !canvas.getContext) throw new Error('no canvas');

        var ctx = canvas.getContext('2d');
        var nodes = [], animId, running = true;
        var mobile = window.innerWidth <= 768;
        var COUNT = mobile ? 30 : 70;
        var DIST  = mobile ? 90 : 130;
        var SPEED = mobile ? 0.25 : 0.4;

        function setSize() {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function makeNodes() {
            nodes = [];
            for (var i = 0; i < COUNT; i++) {
                nodes.push({
                    x:  Math.random() * canvas.width,
                    y:  Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * SPEED,
                    vy: (Math.random() - 0.5) * SPEED,
                    r:  Math.random() * 2 + 1
                });
            }
        }

        function draw() {
            if (!running) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];
                n.x += n.vx; n.y += n.vy;
                if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
                if (n.y < 0 || n.y > canvas.height)  n.vy *= -1;
                ctx.beginPath();
                ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                ctx.fillStyle = '#00c8a0';
                ctx.fill();
                for (var j = i + 1; j < nodes.length; j++) {
                    var m = nodes[j];
                    var dx = n.x - m.x, dy = n.y - m.y;
                    var d = Math.sqrt(dx*dx + dy*dy);
                    if (d < DIST) {
                        ctx.beginPath();
                        ctx.moveTo(n.x, n.y);
                        ctx.lineTo(m.x, m.y);
                        ctx.strokeStyle = 'rgba(0,200,160,' + ((1 - d / DIST) * 0.4) + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        }

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { running = false; cancelAnimationFrame(animId); }
            else { running = true; draw(); }
        });

        // Pause canvas on mobile scroll (battery save)
        var scrollPause;
        window.addEventListener('scroll', function () {
            if (window.innerWidth > 768) return;
            running = false;
            clearTimeout(scrollPause);
            scrollPause = setTimeout(function () { running = true; draw(); }, 200);
        }, { passive: true });

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () { setSize(); makeNodes(); }, 250);
        });

        setSize(); makeNodes(); draw();

    } catch (err) {
        // Canvas not supported — silently skip
    }

    // ---- CUSTOM CURSOR (desktop only) ----
    try {
        var cur = document.getElementById('cursor');
        var curF = document.getElementById('cursor-follower');
        var mx = 0, my = 0, fx = 0, fy = 0;

        var hasHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
        if (cur && curF && hasHover) {
            document.addEventListener('mousemove', function (e) {
                mx = e.clientX; my = e.clientY;
                cur.style.left = mx + 'px';
                cur.style.top  = my + 'px';
            });
            (function followLoop() {
                fx += (mx - fx) * 0.12;
                fy += (my - fy) * 0.12;
                curF.style.left = fx + 'px';
                curF.style.top  = fy + 'px';
                requestAnimationFrame(followLoop);
            })();
        }
    } catch (e) {}

})();
