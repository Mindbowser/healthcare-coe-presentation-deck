document.addEventListener('DOMContentLoaded', () => {
    // ── Mobile Menu Toggle ──────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });

        // Close sidebar when a link is clicked on mobile
        const navLinks = sidebar.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 800) {
                    sidebar.classList.remove('open');
                }
            });
        });
    }

    // ── SPA Router ─────────────────────────────────────────────────
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('main.content section.page-section');
    const progressEl = document.getElementById('progress-bar');

    function navigateToSection(hash) {
        if (!hash || hash === '#') {
            hash = '#section-1';
        }

        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));

        // Show target section
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            targetSection.classList.add('active');
        } else {
            const defaultSection = document.getElementById('section-1');
            if (defaultSection) defaultSection.classList.add('active');
        }

        // Scroll to the very top
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Re-render Feather icons in the newly visible section
        if (typeof feather !== 'undefined') feather.replace();

        // Reset progress bar on section change
        if (progressEl) progressEl.style.width = '0%';

        // Update active nav link
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });
    }

    // ── Initial load ────────────────────────────────────────────────
    navigateToSection(window.location.hash);

    // ── Sidebar nav link clicks ──────────────────────────────────────
    navItems.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            history.pushState(null, null, targetId);
            navigateToSection(targetId);
        });
    });

    // ── Page navigation button clicks (Prev / Next) ──────────────────
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button.nav-btn[data-target]');
        if (!btn) return;
        const targetId = btn.getAttribute('data-target');
        history.pushState(null, null, targetId);
        navigateToSection(targetId);
    });

    // ── Back / Forward browser buttons ──────────────────────────────
    window.addEventListener('popstate', () => {
        navigateToSection(window.location.hash);
    });

    // ── Reading Progress Bar ─────────────────────────────────────────
    window.addEventListener('scroll', () => {
        if (!progressEl) return;
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressEl.style.width = Math.min(progress, 100) + '%';
    }, { passive: true });
});
