/**
 * Volunteering Timeline Module
 * Handles timeline interaction and filtering
 *
 * @author Maryam Aladsani
 * @version 2.0
 */

(function() {
    'use strict';

    // DOM Elements
    const timeline = document.querySelector('.volunteer-timeline');
    const items = document.querySelectorAll('.timeline-item');
    const filters = document.querySelectorAll('.filter-chip');

    // Exit early if timeline doesn't exist
    if (!timeline || items.length === 0) {
        console.warn('[Volunteering] Timeline elements not found');
        return;
    }

    /**
     * Collapse all timeline items
     */
    function collapseAll() {
        items.forEach(item => {
            item.classList.remove('expanded');
            item.setAttribute('aria-expanded', 'false');
        });
    }

    /**
     * Toggle item expansion
     * @param {HTMLElement} item
     */
    function toggleItem(item) {
        const isExpanded = item.classList.contains('expanded');

        // Close all others first
        collapseAll();

        // Toggle current item
        if (!isExpanded) {
            item.classList.add('expanded');
            item.setAttribute('aria-expanded', 'true');

            // Scroll item into view on mobile
            if (window.innerWidth < 768) {
                setTimeout(() => {
                    item.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center'
                    });
                }, 100);
            }
        }
    }

    /**
     * Update filter counts
     */
    function updateFilterCounts() {
        filters.forEach(filter => {
            const filterValue = filter.dataset.filter;
            const countEl = filter.querySelector('.count');

            if (!countEl) return;

            let count;
            if (filterValue === 'all') {
                count = items.length;
            } else if (filterValue === 'current') {
                count = document.querySelectorAll('.timeline-item.current').length;
            }

            countEl.textContent = `(${count})`;
        });
    }

    /**
     * Filter timeline items
     * @param {string} filterValue
     */
    function filterItems(filterValue) {
        let visibleCount = 0;

        items.forEach(item => {
            let shouldShow = true;

            if (filterValue === 'current') {
                shouldShow = item.classList.contains('current');
            }

            item.classList.toggle('hidden', !shouldShow);
            if (shouldShow) visibleCount++;
        });

        // Center timeline when few items
        centerTimeline(visibleCount);

        // Collapse all when filtering
        collapseAll();
    }

    /**
     * Center timeline items when there are few visible
     * @param {number} visibleCount
     */
    function centerTimeline(visibleCount) {
        if (visibleCount <= 3 && timeline) {
            const visibleItems = Array.from(items).filter(
                item => !item.classList.contains('hidden')
            );

            // Calculate total width
            const totalWidth = visibleItems.reduce((sum, item) => {
                const style = getComputedStyle(item);
                const gap = 24; // var(--space-6) in pixels
                return sum + item.offsetWidth + gap;
            }, 0);

            const containerWidth = timeline.offsetWidth;

            timeline.style.justifyContent =
                totalWidth < containerWidth ? 'center' : 'flex-start';
        } else if (timeline) {
            timeline.style.justifyContent = 'flex-start';
        }

        // Reset scroll position
        if (timeline) {
            timeline.scrollLeft = 0;
        }
    }

    /**
     * Handle filter click
     * @param {Event} event
     */
    function handleFilterClick(event) {
        const filter = event.currentTarget;
        const filterValue = filter.dataset.filter;

        // Update active state
        filters.forEach(f => {
            f.classList.remove('active');
            f.setAttribute('aria-pressed', 'false');
        });
        filter.classList.add('active');
        filter.setAttribute('aria-pressed', 'true');

        // Apply filter
        filterItems(filterValue);
    }

    /**
     * Handle item click
     * @param {Event} event
     */
    function handleItemClick(event) {
        // Don't toggle if clicking a link
        if (event.target.tagName === 'A') return;

        toggleItem(event.currentTarget);
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event
     */
    function handleKeyDown(event) {
        const item = event.currentTarget;

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleItem(item);
        }
    }

    /**
     * Initialize module
     */
    function init() {
        // Set up item click handlers
        items.forEach(item => {
            item.addEventListener('click', handleItemClick);
            item.addEventListener('keydown', handleKeyDown);
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-expanded', 'false');
        });

        // Set up filter handlers
        filters.forEach(filter => {
            filter.addEventListener('click', handleFilterClick);
            filter.setAttribute('aria-pressed', filter.classList.contains('active'));
        });

        // Update counts
        updateFilterCounts();

        // Initial centering calculation
        centerTimeline(items.length);

        // Recalculate on resize (debounced)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const visibleItems = Array.from(items).filter(
                    item => !item.classList.contains('hidden')
                );
                centerTimeline(visibleItems.length);
            }, 150);
        }, { passive: true });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();