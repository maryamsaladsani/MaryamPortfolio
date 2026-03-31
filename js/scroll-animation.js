/**
 * Scroll Animation Module
 * Uses Intersection Observer for optimal performance
 * Animates elements on scroll with fade-in, slide, and scale effects
 *
 * @author Maryam Aladsani
 * @version 1.0
 */

(function() {
    'use strict';

    // Animation configuration
    const ANIMATION_CONFIG = {
        // Intersection Observer options
        observerOptions: {
            root: null,
            rootMargin: '0px 0px -100px 0px', // Trigger when 100px from bottom
            threshold: 0.1
        },

        // Animation delays (in milliseconds)
        delays: {
            stagger: 100, // Delay between staggered elements
            single: 0     // Single element animation delay
        }
    };

    // Animation classes to add
    const ANIMATIONS = {
        fadeInUp: 'animate-fade-in-up',
        slideInLeft: 'animate-slide-in-left',
        slideInRight: 'animate-slide-in-right',
        scaleIn: 'animate-scale-in',
        fadeIn: 'animate-fade-in'
    };

    /**
     * Add animation CSS to document
     */
    function injectAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Fade In Up */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(40px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .animate-fade-in-up {
                animation: fadeInUp 0.8s ease-out forwards;
            }

            /* Slide In Left */
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-60px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .animate-slide-in-left {
                animation: slideInLeft 0.8s ease-out forwards;
            }

            /* Slide In Right */
            @keyframes slideInRight {
                from {
                    opacity: 0;
                    transform: translateX(60px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            .animate-slide-in-right {
                animation: slideInRight 0.8s ease-out forwards;
            }

            /* Scale In */
            @keyframes scaleIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }

            .animate-scale-in {
                animation: scaleIn 0.8s ease-out forwards;
            }

            /* Fade In */
            @keyframes fadeIn {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }

            .animate-fade-in {
                animation: fadeIn 0.8s ease-out forwards;
            }

            /* Respect prefers-reduced-motion */
            @media (prefers-reduced-motion: reduce) {
                .animate-fade-in-up,
                .animate-slide-in-left,
                .animate-slide-in-right,
                .animate-scale-in,
                .animate-fade-in {
                    animation: none;
                    opacity: 1;
                    transform: none;
                }
            }

            /* Hide elements before animation */
            .will-animate {
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Assign animations to elements based on section and position
     */
    function assignAnimations() {
        // Hero section
        const heroPhoto = document.querySelector('.hero__photo');
        if (heroPhoto) {
            heroPhoto.classList.add('will-animate');
            heroPhoto.dataset.animation = ANIMATIONS.slideInLeft;
        }

        const heroContent = document.querySelector('.hero__content');
        if (heroContent) {
            heroContent.classList.add('will-animate');
            heroContent.dataset.animation = ANIMATIONS.slideInRight;
            heroContent.dataset.delay = ANIMATION_CONFIG.delays.single + 200;
        }

        // About section
        const aboutContent = document.querySelector('.about-intro__content');
        if (aboutContent) {
            aboutContent.classList.add('will-animate');
            aboutContent.dataset.animation = ANIMATIONS.fadeInUp;
        }

        // Skill cards
        const skillCards = document.querySelectorAll('.skill-card');
        skillCards.forEach((card, index) => {
            card.classList.add('will-animate');
            card.dataset.animation = ANIMATIONS.scaleIn;
            card.dataset.delay = index * ANIMATION_CONFIG.delays.stagger;
        });

        // Project cards
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.classList.add('will-animate');
            card.dataset.animation = ANIMATIONS.fadeInUp;
            card.dataset.delay = index * ANIMATION_CONFIG.delays.stagger;
        });

        // Timeline items (only visible ones)
        const timelineItems = document.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            item.classList.add('will-animate');
            item.dataset.animation = ANIMATIONS.slideInRight;
            item.dataset.delay = index * ANIMATION_CONFIG.delays.stagger;
        });

        // Contact section
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.classList.add('will-animate');
            contactForm.dataset.animation = ANIMATIONS.fadeInUp;
        }

        // Section headings
        const headings = document.querySelectorAll(
            '.skills h2, .projects h2, .volunteering h2, .contact h2'
        );
        headings.forEach(heading => {
            heading.classList.add('will-animate');
            heading.dataset.animation = ANIMATIONS.fadeInUp;
        });
    }

    /**
     * Animate element with optional delay
     * @param {HTMLElement} element
     * @param {string} animationClass
     * @param {number} delay
     */
    function animateElement(element, animationClass, delay = 0) {
        if (delay > 0) {
            setTimeout(() => {
                element.classList.remove('will-animate');
                element.classList.add(animationClass);
            }, delay);
        } else {
            element.classList.remove('will-animate');
            element.classList.add(animationClass);
        }
    }

    /**
     * Create and setup Intersection Observer
     */
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Trigger animation when element comes into view
                if (entry.isIntersecting && entry.target.classList.contains('will-animate')) {
                    const animationClass = entry.target.dataset.animation;
                    const delay = parseInt(entry.target.dataset.delay) || 0;

                    if (animationClass) {
                        animateElement(entry.target, animationClass, delay);
                    }

                    // Stop observing after animation triggers
                    observer.unobserve(entry.target);
                }
            });
        }, ANIMATION_CONFIG.observerOptions);

        // Observe all elements with will-animate class
        document.querySelectorAll('.will-animate').forEach(element => {
            observer.observe(element);
        });

        return observer;
    }

    /**
     * Handle window resize - re-trigger animations for elements already in view
     */
    function handleResize() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Optional: Add custom resize logic if needed
            }, 250);
        }, { passive: true });
    }

    /**
     * Initialize scroll animations
     */
    function init() {
        // Inject animation styles
        injectAnimationStyles();

        // Assign animations to elements
        assignAnimations();

        // Setup Intersection Observer
        setupIntersectionObserver();

        // Handle resize events
        handleResize();

        console.log('[ScrollAnimations] Scroll animations initialized');
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();