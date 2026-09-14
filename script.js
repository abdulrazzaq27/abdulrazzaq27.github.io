/* ============================================================
   PREMIUM PORTFOLIO — script.js
   Handles: Theme toggle, Navbar scroll, Mobile menu,
            Scroll spy, Scroll-reveal animations
   ============================================================ */

(function () {
    'use strict';

    /* ---- Theme Toggle (default: light) ---- */
    const html      = document.documentElement;
    const themeBtn  = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function applyTheme(dark) {
        if (dark) {
            html.setAttribute('data-theme', 'dark');
            themeIcon.className = 'fas fa-sun';
            themeBtn.setAttribute('aria-label', 'Switch to light mode');
        } else {
            html.removeAttribute('data-theme');
            themeIcon.className = 'fas fa-moon';
            themeBtn.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    // Read saved pref; default to light
    const saved = localStorage.getItem('ar-theme');
    applyTheme(saved === 'dark');

    themeBtn.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        applyTheme(!isDark);
        localStorage.setItem('ar-theme', !isDark ? 'dark' : 'light');
    });

    /* ---- Navbar scroll state ---- */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });

    /* ---- Mobile menu toggle ---- */
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks  = document.getElementById('nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('open');
            mobileBtn.classList.toggle('open', isOpen);
            mobileBtn.setAttribute('aria-expanded', isOpen);
        });

        // Smooth scroll and close menu on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                const targetId = link.getAttribute('href');
                if (targetId && targetId.startsWith('#')) {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        e.preventDefault();
                        const navOffset = navbar.offsetHeight + 20;
                        const elementPosition = targetEl.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - navOffset;

                        window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target)) {
                navLinks.classList.remove('open');
                mobileBtn.classList.remove('open');
                mobileBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* ---- Scroll Spy — active nav link ---- */
    const sections  = document.querySelectorAll('section[id]');
    const navItems  = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollY = window.scrollY + 100;
        let current = '';

        // If the user has scrolled (near) the bottom of the page, force the
        // last section active — its offsetTop + 100 may never be reachable
        // when there isn't enough content below it (e.g. a short footer).
        const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

        if (nearBottom && sections.length) {
            current = sections[sections.length - 1].id;
        } else {
            sections.forEach(section => {
                if (scrollY >= section.offsetTop) {
                    current = section.id;
                }
            });
        }

        navItems.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    /* ---- Scroll Reveal (Intersection Observer) ---- */
    const revealEls = document.querySelectorAll(
        '.about-card, .about-leetcode-highlight, .skill-group, .project-card, .edu-item, .contact-card, .hero-content, .hero-image-wrap'
    );

    revealEls.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger siblings slightly
                const delay = (entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // Add stagger delays to grouped elements
    document.querySelectorAll('.about-grid, .skills-layout, .projects-grid, .education-timeline, .contact-right').forEach(parent => {
        parent.querySelectorAll('.reveal').forEach((child, i) => {
            child.dataset.delay = i * 80;
        });
    });

    revealEls.forEach(el => observer.observe(el));

    /* ---- Smooth hero entrance ---- */
    window.addEventListener('load', () => {
        document.querySelectorAll('.hero-content, .hero-image-wrap').forEach((el, i) => {
            setTimeout(() => el.classList.add('visible'), 200 + i * 180);
        });
    });

})();
