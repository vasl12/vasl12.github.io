/**
 * Toggles between the hero's two views: the default "home" bio and the
 * "contact" panel. Intercepts nav clicks on #contact and #home.
 */
(function () {
    const section = document.getElementById('home');
    if (!section) return;
    const home = section.querySelector('[data-view="home"]');
    const contact = section.querySelector('[data-view="contact"]');
    if (!home || !contact) return;

    function setActive(hash) {
        document.querySelectorAll('.nav-link').forEach((l) => {
            l.classList.toggle('active', l.getAttribute('href') === hash);
        });
    }

    function show(view, options) {
        const showContact = view === 'contact';
        const animate = !options || options.animate !== false;
        home.hidden = showContact;
        contact.hidden = !showContact;
        document.body.classList.toggle('contact-only', showContact);
        setActive(showContact ? '#contact' : '#home');
        if (animate && window.heroTypewriter) {
            const target = showContact ? contact : home;
            const title = target.querySelector('.type-animate');
            if (title) window.heroTypewriter.type(title);
        }
    }

    function scrollHeroIntoView() {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const href = a.getAttribute('href') || '';
            if (href === '#contact') {
                e.preventDefault();
                show('contact');
                scrollHeroIntoView();
                history.replaceState(null, '', '#contact');
            } else if (href === '#home') {
                // script.js handles the scrollend-synced typewriter for #home
                // nav clicks, so skip the immediate retype here to avoid a
                // double animation.
                show('home', { animate: false });
                history.replaceState(null, '', '#home');
            } else if (href.length > 1) {
                show('home', { animate: false });
            }
        });
    });

    if (window.location.hash === '#contact') {
        show('contact');
    }
})();
