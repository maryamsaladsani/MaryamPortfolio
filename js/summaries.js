/* ============================================
   SUMMARIES - SEARCH, FILTER & PREVIEW
   ============================================ */

(function() {
    'use strict';

    // DOM Elements
    const searchInput = document.getElementById('summaries-search');
    const yearFilter = document.getElementById('year-filter');
    const summariesGrid = document.getElementById('summaries-grid');
    const shownCount = document.getElementById('shown-count');
    const totalCount = document.getElementById('total-count');
    const emptyState = document.getElementById('empty-state');
    const resetButton = document.getElementById('reset-filters');

    // Get all note cards
    let noteCards = [];

    // Initialize when DOM is ready
    function init() {
        noteCards = Array.from(document.querySelectorAll('.note-card'));

        if (noteCards.length === 0) {
            console.warn('No note cards found');
            return;
        }

        // Sort cards by priority on initial load
        sortByPriority();

        // Update total count
        updateCounts();

        // Event listeners
        if (searchInput) {
            searchInput.addEventListener('input', handleSearch);
        }

        if (yearFilter) {
            yearFilter.addEventListener('change', applyFilters);
        }

        if (resetButton) {
            resetButton.addEventListener('click', resetAllFilters);
        }

        // Add click handlers for card preview/download
        noteCards.forEach(card => {
            const downloadBtn = card.querySelector('.download-btn');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', handleDownload);
            }

            // Optional: Click card to preview (you can customize this)
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the download button
                if (!e.target.closest('.download-btn')) {
                    handleCardClick(card);
                }
            });
        });
    }

    /* ============================================
       SORTING
       ============================================ */
    function sortByPriority() {
        // Sort cards by priority (lower number = higher priority)
        noteCards.sort((a, b) => {
            const priorityA = parseInt(a.dataset.priority) || 999;
            const priorityB = parseInt(b.dataset.priority) || 999;
            return priorityA - priorityB;
        });

        // Re-append cards in sorted order
        noteCards.forEach(card => {
            summariesGrid.appendChild(card);
        });
    }

    /* ============================================
       SEARCH FUNCTIONALITY
       ============================================ */
    function handleSearch() {
        applyFilters();
    }

    /* ============================================
       FILTER LOGIC
       ============================================ */
    function applyFilters() {
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const selectedYear = yearFilter ? yearFilter.value : 'all';

        let visibleCount = 0;

        noteCards.forEach(card => {
            const name = (card.dataset.name || '').toLowerCase();
            const code = (card.dataset.code || '').toLowerCase();
            const year = card.dataset.year || '';

            // Check search match (name OR code)
            const matchesSearch = searchTerm === '' ||
                name.includes(searchTerm) ||
                code.includes(searchTerm);

            // Check year filter
            const matchesYear = selectedYear === 'all' || year === selectedYear;

            // Show card if it matches ALL filters
            if (matchesSearch && matchesYear) {
                card.classList.remove('hidden');
                card.style.display = '';
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Update counts and empty state
        updateCounts(visibleCount);
        toggleEmptyState(visibleCount === 0);
    }

    /* ============================================
       COUNTER UPDATES
       ============================================ */
    function updateCounts(visible = null) {
        const total = noteCards.length;
        const shown = visible !== null ? visible : noteCards.filter(card => !card.classList.contains('hidden')).length;

        if (shownCount) shownCount.textContent = shown;
        if (totalCount) totalCount.textContent = total;
    }

    /* ============================================
       EMPTY STATE
       ============================================ */
    function toggleEmptyState(show) {
        if (emptyState) {
            emptyState.style.display = show ? 'flex' : 'none';
        }
    }

    /* ============================================
       RESET FILTERS
       ============================================ */
    function resetAllFilters() {
        // Clear search
        if (searchInput) {
            searchInput.value = '';
        }

        // Reset year filter
        if (yearFilter) {
            yearFilter.value = 'all';
        }

        // Reapply filters (will show all)
        applyFilters();

        // Optional: Focus search for better UX
        if (searchInput) {
            searchInput.focus();
        }
    }

    /* ============================================
       CARD CLICK HANDLER (Preview)
       ============================================ */
    function handleCardClick(card) {
        const courseName = card.dataset.name;
        const courseCode = card.dataset.code;

        // You can customize this behavior:
        // Option 1: Show a modal with PDF preview
        // Option 2: Open PDF in new tab
        // Option 3: Just flip the card (already handled by CSS hover)

        console.log(`Card clicked: ${courseName} (${courseCode})`);

        // Example: If you want to open PDF in new tab on click
        // const pdfUrl = card.dataset.pdfUrl; // Add data-pdf-url to HTML
        // if (pdfUrl) {
        //     window.open(pdfUrl, '_blank');
        // }
    }

    /* ============================================
       DOWNLOAD HANDLER
       ============================================ */
    function handleDownload(event) {
        event.preventDefault();
        event.stopPropagation(); // Prevent card click event

        const card = event.currentTarget.closest('.note-card');
        const courseName = card.dataset.name;
        const courseCode = card.dataset.code;

        // You'll need to add data-pdf-url attribute to your HTML cards
        const pdfUrl = card.dataset.pdfUrl;

        if (pdfUrl) {
            // Option 1: Direct download
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = `${courseCode}_${courseName.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`Downloading: ${courseName} (${courseCode})`);
        } else {
            console.warn(`No PDF URL found for: ${courseName}`);
            // You can show a notification to the user here
            alert('PDF file is not available yet. Please check back later.');
        }
    }

    /* ============================================
       PDF PREVIEW MODAL (Optional Enhancement)
       ============================================ */
    function showPdfPreview(pdfUrl, title) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'pdf-preview-modal';
        modal.innerHTML = `
            <div class="pdf-preview-overlay" onclick="this.parentElement.remove()"></div>
            <div class="pdf-preview-container">
                <div class="pdf-preview-header">
                    <h3>${title}</h3>
                    <button class="pdf-preview-close" onclick="this.closest('.pdf-preview-modal').remove()">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <div class="pdf-preview-content">
                    <iframe src="${pdfUrl}" width="100%" height="100%"></iframe>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';

        // Restore scroll when modal closes
        modal.querySelector('.pdf-preview-close').addEventListener('click', () => {
            document.body.style.overflow = '';
        });
    }

    /* ============================================
       KEYBOARD SHORTCUTS (Optional Enhancement)
       ============================================ */
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K to focus search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (searchInput) {
                    searchInput.focus();
                    searchInput.select();
                }
            }

            // Escape to clear search/filters
            if (e.key === 'Escape') {
                if (searchInput && searchInput.value) {
                    resetAllFilters();
                }
            }
        });
    }

    /* ============================================
       URL PARAMETERS (Optional Enhancement)
       Save filter state in URL
       ============================================ */
    function saveFiltersToUrl() {
        const params = new URLSearchParams();

        if (searchInput && searchInput.value) {
            params.set('search', searchInput.value);
        }

        if (yearFilter && yearFilter.value !== 'all') {
            params.set('year', yearFilter.value);
        }

        const newUrl = params.toString()
            ? `${window.location.pathname}?${params.toString()}#summaries`
            : `${window.location.pathname}#summaries`;

        window.history.replaceState({}, '', newUrl);
    }

    function loadFiltersFromUrl() {
        const params = new URLSearchParams(window.location.search);

        const search = params.get('search');
        if (search && searchInput) {
            searchInput.value = search;
        }

        const year = params.get('year');
        if (year && yearFilter) {
            yearFilter.value = year;
        }

        // Apply filters if any were loaded from URL
        if (search || year) {
            applyFilters();
        }
    }

    /* ============================================
       ANALYTICS TRACKING (Optional)
       ============================================ */
    function trackDownload(courseName, courseCode) {
        // If you use Google Analytics or similar
        if (typeof gtag !== 'undefined') {
            gtag('event', 'download', {
                'event_category': 'Study Notes',
                'event_label': `${courseCode} - ${courseName}`
            });
        }
    }

    function trackSearch(searchTerm) {
        if (typeof gtag !== 'undefined' && searchTerm) {
            gtag('event', 'search', {
                'event_category': 'Study Notes',
                'search_term': searchTerm
            });
        }
    }

    /* ============================================
       INITIALIZATION
       ============================================ */
    // Initialize when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Optional: Load filters from URL on page load
    // Uncomment if you want to use URL parameters
    // if (document.readyState === 'loading') {
    //     document.addEventListener('DOMContentLoaded', () => {
    //         loadFiltersFromUrl();
    //         init();
    //     });
    // } else {
    //     loadFiltersFromUrl();
    //     init();
    // }

    // Optional: Setup keyboard shortcuts
    // Uncomment if you want keyboard shortcuts
    // setupKeyboardShortcuts();

})();