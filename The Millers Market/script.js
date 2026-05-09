/**
 * The Millers Market — Main Script
 * Vintage Glass & Curated Treasures
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // --- Hash-based section routing ---
    var sections = {
        home: document.getElementById('home-content'),
        shop: document.getElementById('shop-content'),
        about: document.getElementById('about-content'),
        contact: document.getElementById('contact-content')
    };

    var navLinks = document.querySelectorAll('.nav-link');
    var currentSection = null;

    function showSection(name) {
        // Hide all sections
        Object.keys(sections).forEach(function (key) {
            if (sections[key]) {
                sections[key].classList.remove('visible');
                sections[key].setAttribute('aria-hidden', 'true');
            }
        });

        // Show target section
        var target = sections[name];
        if (target) {
            target.classList.add('visible');
            target.setAttribute('aria-hidden', 'false');
            currentSection = name;

            // Re-trigger scroll animations for newly visible elements
            initScrollAnimations(target);
        }

        // Update active nav
        navLinks.forEach(function (link) {
            var href = link.getAttribute('href');
            if (href === '#' + name) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function getSectionFromHash() {
        var hash = window.location.hash.replace('#', '');
        if (hash && sections[hash]) {
            return hash;
        }
        return 'home';
    }

    function handleRoute() {
        var section = getSectionFromHash();
        showSection(section);
    }

    // Route on page load
    handleRoute();

    // Route on hash change (browser back/forward)
    window.addEventListener('hashchange', handleRoute);

    // --- Logo click → home ---
    var logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function (e) {
            // Let the hash change handle routing naturally
        });
    }

    // --- Smooth scroll for same-page anchor links ---
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;

        var targetId = link.getAttribute('href');
        if (targetId === '#') {
            e.preventDefault();
            return;
        }

        // Hash-based page sections are handled by hashchange
        if (['#home', '#shop', '#about', '#contact'].indexOf(targetId) !== -1) {
            // hashchange listener will handle this
            return;
        }

        // In-page anchor scroll
        var targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });

    // --- Newsletter form ---
    var newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var emailInput = document.getElementById('newsletter-email');
            var email = emailInput.value.trim();

            if (email) {
                var existingMsg = document.querySelector('.newsletter-message');
                if (existingMsg) existingMsg.remove();

                var message = document.createElement('p');
                message.className = 'newsletter-message';
                message.textContent = 'Thank you for subscribing!';

                newsletterForm.appendChild(message);
                emailInput.value = '';

                setTimeout(function () {
                    if (message.parentNode) message.remove();
                }, 5000);
            }
        });
    }

    // --- Contact form ---
    var contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameInput = document.getElementById('contact-name');
            var emailInput = document.getElementById('contact-email');
            var msgInput = document.getElementById('contact-message');

            if (nameInput.value.trim() && emailInput.value.trim() && msgInput.value.trim()) {
                var existingMsg = document.querySelector('.contact-message');
                if (existingMsg) existingMsg.remove();

                var message = document.createElement('p');
                message.className = 'contact-message';
                message.textContent = 'Thanks for reaching out! We\'ll get back to you soon.';

                contactForm.appendChild(message);
                contactForm.reset();

                setTimeout(function () {
                    if (message.parentNode) message.remove();
                }, 5000);
            }
        });
    }

    // --- Intersection Observer for scroll-in animations ---
    function initScrollAnimations(container) {
        var animateElements = container.querySelectorAll('.featured-item, .product-card, .about-main, .about-gallery-item, .contact-info, .contact-form');

        if (!('IntersectionObserver' in window)) {
            animateElements.forEach(function (el) {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        // Filter to only elements not yet animated
        var freshElements = [];
        animateElements.forEach(function (el) {
            if (!el.dataset.animated) {
                freshElements.push(el);
            }
        });

        if (freshElements.length === 0) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '0';
                    entry.target.style.transform = 'translateY(20px)';
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';

                    requestAnimationFrame(function () {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    });

                    entry.target.dataset.animated = 'true';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        freshElements.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            observer.observe(el);
        });
    }

    // Note: initial animations are handled by handleRoute() → showSection() above
});
