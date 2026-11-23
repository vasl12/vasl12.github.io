/**
 * Hero network background — drifting dots connected by faint lines, with a
 * coral pointer-glow when the mouse enters the hero. Pure canvas, no deps.
 */
(function () {
    const section = document.getElementById('home');
    if (!section) return;
    const canvas = section.querySelector('.hero-network');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');

    const CFG = {
        // Dot count scales linearly with hero area (width × height) and
        // is clamped to [minDots, maxDots]. At 2560×900 that's ~105
        // dots; 1440×900 gets ~59; 1024×768 gets ~36; small tablets
        // drop toward the 13-dot floor.
        areaPerDot: 22000,
        maxDots: 118,
        minDots: 13,
        minRadius: 3,
        maxRadius: 6.6,
        speed: 0.4,
        dotOpacity: 0.55,
        linkDist: 280,
        linkOpacity: 0.22,
        mouseDist: 360,
        mouseOpacity: 0.45,
    };

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const darkMq = window.matchMedia('(prefers-color-scheme: dark)');

    let width = 0;
    let height = 0;
    let dpr = 1;
    let dots = [];
    let mouse = { x: 0, y: 0, active: false };
    let rafId = null;
    let visible = true;
    let running = false;

    function isDark() {
        if (document.body.classList.contains('dark-mode')) return true;
        const dt = document.documentElement.getAttribute('data-theme');
        if (dt === 'dark') return true;
        if (dt === 'light') return false;
        return darkMq.matches;
    }

    function palette() {
        return isDark()
            ? { brand: '170, 180, 230', coral: '255, 122, 92' }
            : { brand: '130, 142, 205', coral: '232, 85, 58' };
    }

    function rand(min, max) { return min + Math.random() * (max - min); }

    function makeDots() {
        const area = Math.max(1, width * height);
        const n = Math.min(
            CFG.maxDots,
            Math.max(CFG.minDots, Math.floor(area / CFG.areaPerDot))
        );
        dots = new Array(n);
        for (let i = 0; i < n; i++) {
            const angle = Math.random() * Math.PI * 2;
            dots[i] = {
                x: Math.random() * width,
                y: Math.random() * height,
                vx: Math.cos(angle) * CFG.speed,
                vy: Math.sin(angle) * CFG.speed,
                r: rand(CFG.minRadius, CFG.maxRadius),
            };
        }
    }

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = section.getBoundingClientRect();
        width = Math.max(1, rect.width);
        height = Math.max(1, rect.height);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        makeDots();
    }

    function step() {
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < d.r)              { d.x = d.r;              d.vx = -d.vx; }
            else if (d.x > width - d.r) { d.x = width - d.r;      d.vx = -d.vx; }
            if (d.y < d.r)              { d.y = d.r;              d.vy = -d.vy; }
            else if (d.y > height - d.r){ d.y = height - d.r;     d.vy = -d.vy; }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        const c = palette();

        ctx.lineWidth = 2;
        for (let i = 0; i < dots.length; i++) {
            const a = dots[i];
            for (let j = i + 1; j < dots.length; j++) {
                const b = dots[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CFG.linkDist) {
                    const op = CFG.linkOpacity * (1 - dist / CFG.linkDist);
                    ctx.strokeStyle = 'rgba(' + c.brand + ',' + op + ')';
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.stroke();
                }
            }
        }

        ctx.fillStyle = 'rgba(' + c.brand + ',' + CFG.dotOpacity + ')';
        for (let i = 0; i < dots.length; i++) {
            const d = dots[i];
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fill();
        }

        if (mouse.active) {
            const since = performance.now() - lastMoveTime;
            const fade = since <= IDLE_HOLD_MS
                ? 1
                : Math.max(0, 1 - (since - IDLE_HOLD_MS) / FADE_MS);
            if (fade <= 0) {
                mouse.active = false;
            } else {
                for (let i = 0; i < dots.length; i++) {
                    const d = dots[i];
                    const dx = d.x - mouse.x;
                    const dy = d.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < CFG.mouseDist) {
                        const op = CFG.mouseOpacity * fade * (1 - dist / CFG.mouseDist);
                        ctx.strokeStyle = 'rgba(' + c.coral + ',' + op + ')';
                        ctx.beginPath();
                        ctx.moveTo(mouse.x, mouse.y);
                        ctx.lineTo(d.x, d.y);
                        ctx.stroke();
                    }
                }
            }
        }
    }

    function tick() {
        if (!running) return;
        step();
        draw();
        rafId = requestAnimationFrame(tick);
    }

    function start() {
        if (running || reduceMotion || !visible) return;
        running = true;
        rafId = requestAnimationFrame(tick);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
    }

    const IDLE_HOLD_MS = 0;
    const FADE_MS = 1000;
    let lastMoveTime = 0;
    section.addEventListener('mousemove', (e) => {
        const rect = section.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
        mouse.active = true;
        lastMoveTime = performance.now();
        if (reduceMotion) draw();
    });
    section.addEventListener('mouseleave', () => {
        mouse.active = false;
        if (reduceMotion) draw();
    });

    if (typeof ResizeObserver !== 'undefined') {
        const ro = new ResizeObserver(() => {
            resize();
            if (reduceMotion) draw();
        });
        ro.observe(section);
    } else {
        window.addEventListener('resize', () => {
            resize();
            if (reduceMotion) draw();
        });
    }

    if (typeof IntersectionObserver !== 'undefined') {
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                visible = e.isIntersecting;
                if (visible) start();
                else stop();
            }
        }, { threshold: 0 });
        io.observe(section);
    }

    const redrawOnThemeChange = () => { if (!running) draw(); };
    const mo = new MutationObserver(redrawOnThemeChange);
    mo.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (darkMq.addEventListener) darkMq.addEventListener('change', redrawOnThemeChange);
    else if (darkMq.addListener) darkMq.addListener(redrawOnThemeChange);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else if (visible) start();
    });

    resize();
    if (reduceMotion) draw();
    else start();
})();
