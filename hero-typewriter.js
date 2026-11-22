/**
 * Types any element with class `.type-animate` character by character and
 * leaves a blinking "_" cursor at the end. The original text is captured
 * once on first run into data-text, so re-triggering (e.g. when a view is
 * re-shown) always types the same source text.
 *
 * Elements inside the hero (#home) type immediately. Elements outside the
 * hero are deferred and animate the first time they scroll into view, so the
 * typewriter effect is actually visible when the user reaches each section.
 *
 * Exposes `window.heroTypewriter.type(el)` for other scripts to re-trigger.
 */
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TYPE_DELAY_MS = 55;

    function typeInto(el, text) {
        el.innerHTML = '';
        const typed = document.createElement('span');
        typed.className = 'typed';
        const cursor = document.createElement('span');
        cursor.className = 'type-cursor';
        cursor.setAttribute('aria-hidden', 'true');
        cursor.textContent = '_';
        el.appendChild(typed);
        el.appendChild(cursor);

        if (reduceMotion) {
            typed.textContent = text;
            return;
        }

        let i = 0;
        (function tick() {
            if (i <= text.length) {
                typed.textContent = text.slice(0, i);
                i += 1;
                setTimeout(tick, TYPE_DELAY_MS);
            }
        })();
    }

    function type(el) {
        if (!el) return;
        let text = el.getAttribute('data-text');
        if (!text) {
            text = el.textContent.trim();
            el.setAttribute('data-text', text);
        }
        typeInto(el, text);
    }

    const hero = document.getElementById('home');
    const all = document.querySelectorAll('.type-animate');

    const deferred = [];
    all.forEach((el) => {
        // Capture the original text so re-triggers always have the source.
        if (!el.getAttribute('data-text')) {
            el.setAttribute('data-text', el.textContent.trim());
        }
        if (hero && hero.contains(el)) {
            // Hero titles type immediately on load. Mark them as visible so
            // the IntersectionObserver below doesn't re-type them until the
            // user scrolls away and returns.
            type(el);
            el.dataset.typeVisible = '1';
        } else {
            // Clear now so no static text flashes before the animation.
            el.textContent = '';
        }
        deferred.push(el);
    });

    if (deferred.length && 'IntersectionObserver' in window) {
        // Retype every time the title scrolls into view, not just the first
        // time. We track visibility so we only retype on a fresh enter (not
        // every observer callback as the user scrolls within the section).
        // Clear content on exit so the title doesn't flash its finished text
        // the next time it enters the viewport.
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const el = entry.target;
                const wasVisible = el.dataset.typeVisible === '1';
                if (entry.isIntersecting && !wasVisible) {
                    type(el);
                    el.dataset.typeVisible = '1';
                } else if (!entry.isIntersecting && wasVisible) {
                    el.dataset.typeVisible = '0';
                    el.textContent = '';
                }
            });
        }, { threshold: 0.4 });
        deferred.forEach((el) => io.observe(el));
    } else {
        // No IO support — just type everything immediately.
        deferred.forEach(type);
    }

    window.heroTypewriter = { type: type, typeInto: typeInto };
})();
