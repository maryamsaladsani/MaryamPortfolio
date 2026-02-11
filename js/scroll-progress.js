/**
 * Scroll Progress Bar Module
 * Displays a visual indicator showing scroll position
 *
 * @author Maryam Aladsani
 * @version 2.0
 */

(function() {
    'use strict';

    // DOM Elements
    const progressBar = document.getElementById('scrollProgress');

    // Exit early if element doesn't exist
    if (!progressBar) {
        console.warn('[ScrollProgress] Progress bar element not found');
        return;
    }

    // Throttle configuration
    let ticking = false;

    /**
     * Calculate and update scroll progress
     */
    function updateProgress() {
        const doc = document.documentElement;
        const scrollTop = window.pageYOffset || doc.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;

        // Handle edge case where there's no scrollable content
        if (scrollHeight <= 0) {
            progressBar.style.width = '0%';
            return;
        }

        const progress = Math.min((scrollTop / scrollHeight) * 100, 100);
        progressBar.style.width = `${progress}%`;
    }

    /**
     * Throttled scroll handler using requestAnimationFrame
     */
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateProgress();
                ticking = false;
            });
            ticking = true;
        }
    }

    /**
     * Initialize scroll progress module
     */
    function init() {
        // Initial update
        updateProgress();

        // Listen for scroll events (passive for performance)
        window.addEventListener('scroll', onScroll, { passive: true });

        // Update on resize (content height may change)
        window.addEventListener('resize', updateProgress, { passive: true });

        // Update after images load (may change document height)
        window.addEventListener('load', updateProgress);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();