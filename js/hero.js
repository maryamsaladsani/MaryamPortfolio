/* ============================================
   MODERN HERO SECTION - JAVASCRIPT (FIXED)
   Handles interactivity and dynamic features
   ============================================ */

class ModernHero {
    constructor() {
        this.greeting = document.getElementById('greeting');
        this.ctaPrimary = document.querySelector('.cta-button--primary');
        this.ctaSecondary = document.querySelector('.cta-button--secondary');
        this.scrollIndicator = document.querySelector('.scroll-indicator');

        this.initGreeting();
        this.initCTAHandlers();
        this.initScrollBehavior();
        this.initElementObserver();
        this.initRippleEffect();
    }

    /**
     * Display dynamic greeting based on time of day
     */
    initGreeting() {
        const hour = new Date().getHours();
        let greeting = '';

        if (hour < 12) {
            greeting = '☀️ Good Morning! Welcome to my portfolio.';
        } else if (hour < 18) {
            greeting = '🌤️ Good Afternoon! Explore my work below.';
        } else {
            greeting = '🌙 Good Evening! Check out my latest projects.';
        }

        if (this.greeting) {
            this.greeting.textContent = greeting;
            // Animate greeting appearance
            this.greeting.style.animation = 'slideInUp 0.8s ease-out 0.5s both';
        }
    }

    /**
     * Initialize CTA button functionality
     */
    initCTAHandlers() {
        if (this.ctaPrimary) {
            this.ctaPrimary.addEventListener('click', () => {
                this.scrollToSection('projects');
            });
        }

        if (this.ctaSecondary) {
            this.ctaSecondary.addEventListener('click', () => {
                this.scrollToSection('contact');
            });
        }
    }

    /**
     * Scroll to specific section with smooth behavior
     */
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            // Haptic feedback for mobile
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
    }

    /**
     * Hide scroll indicator when user starts scrolling
     */
    initScrollBehavior() {
        let hasScrolled = false;

        window.addEventListener('scroll', () => {
            if (!hasScrolled && window.scrollY > 100) {
                if (this.scrollIndicator) {
                    this.scrollIndicator.style.opacity = '0';
                    this.scrollIndicator.style.pointerEvents = 'none';
                }
                hasScrolled = true;
            } else if (hasScrolled && window.scrollY < 100) {
                if (this.scrollIndicator) {
                    this.scrollIndicator.style.opacity = '1';
                    this.scrollIndicator.style.pointerEvents = 'auto';
                }
                hasScrolled = false;
            }
        }, { passive: true });
    }

    /**
     * Observe elements for scroll-triggered animations
     */
    initElementObserver() {
        if (!window.IntersectionObserver) return;

        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe hero elements
        document.querySelectorAll('.hero__content > *').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Add ripple effect to buttons on click
     */
    initRippleEffect() {
        const buttons = document.querySelectorAll('.cta-button, .social-link');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    animation: rippleEffect 0.6s ease-out;
                    pointer-events: none;
                `;

                button.style.position = 'relative';
                button.style.overflow = 'hidden';
                button.appendChild(ripple);

                setTimeout(() => ripple.remove(), 600);
            });
        });
    }
}

// Initialize on DOM load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ModernHero();
    });
} else {
    new ModernHero();
}

// Ripple animation keyframes (add to stylesheet or here)
const style = document.createElement('style');
style.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);