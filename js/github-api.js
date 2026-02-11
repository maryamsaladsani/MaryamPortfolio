/**
 * GitHub API Integration Module
 * Fetches and displays public repositories with error handling
 *
 * @author Maryam Aladsani
 * @version 2.0
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        username: 'maryamsaladsani',
        maxRepos: 6,
        apiUrl: 'https://api.github.com/users',
        cacheKey: 'github_repos_cache',
        cacheDuration: 5 * 60 * 1000, // 5 minutes
        retryDelay: 1000,
        maxRetries: 2
    };

    // DOM Elements
    const container = document.getElementById('projects-container');
    const loadingEl = document.getElementById('projects-loading');
    const errorEl = document.getElementById('projects-error');
    const retryBtn = document.getElementById('retry-fetch');

    // Exit early if container doesn't exist
    if (!container) {
        console.warn('[GitHub] Projects container not found');
        return;
    }

    /**
     * Show loading state
     */
    function showLoading() {
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (errorEl) errorEl.classList.add('hidden');
        container.innerHTML = '';
    }

    /**
     * Hide loading state
     */
    function hideLoading() {
        if (loadingEl) loadingEl.classList.add('hidden');
    }

    /**
     * Show error state
     * @param {string} message
     */
    function showError(message) {
        hideLoading();
        if (errorEl) {
            errorEl.classList.remove('hidden');
            const msgEl = errorEl.querySelector('.error-message');
            if (msgEl) {
                msgEl.textContent = message || 'Unable to load projects. Please try again.';
            }
        }
    }

    /**
     * Hide error state
     */
    function hideError() {
        if (errorEl) errorEl.classList.add('hidden');
    }

    /**
     * Check if cached data is still valid
     * @returns {Object|null}
     */
    function getCachedData() {
        try {
            const cached = localStorage.getItem(CONFIG.cacheKey);
            if (!cached) return null;

            const { data, timestamp } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp > CONFIG.cacheDuration;

            return isExpired ? null : data;
        } catch (e) {
            return null;
        }
    }

    /**
     * Cache repository data
     * @param {Array} data
     */
    function cacheData(data) {
        try {
            localStorage.setItem(CONFIG.cacheKey, JSON.stringify({
                data,
                timestamp: Date.now()
            }));
        } catch (e) {
            // Silently fail if storage is full
        }
    }

    /**
     * Fetch repositories from GitHub API
     * @param {number} retryCount
     * @returns {Promise<Array>}
     */
    async function fetchRepos(retryCount = 0) {
        const url = `${CONFIG.apiUrl}/${CONFIG.username}/repos?sort=updated&per_page=100`;

        const response = await fetch(url, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            // Handle rate limiting
            if (response.status === 403) {
                const resetTime = response.headers.get('X-RateLimit-Reset');
                if (resetTime) {
                    const waitTime = new Date(resetTime * 1000).toLocaleTimeString();
                    throw new Error(`API rate limit exceeded. Try again after ${waitTime}`);
                }
            }
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const repos = await response.json();

        // Filter and sort
        return repos
            .filter(repo => !repo.fork) // Exclude forks
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, CONFIG.maxRepos);
    }

    /**
     * Format date for display
     * @param {string} dateString
     * @returns {string}
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} text
     * @returns {string}
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Create HTML for a repository card
     * @param {Object} repo
     * @returns {string}
     */
    function createRepoCard(repo) {
        const name = escapeHtml(repo.name);
        const description = escapeHtml(repo.description || 'No description available');
        const language = repo.language || '';
        const languageLower = language.toLowerCase();
        const languageClass = language ? '' : 'no-language';
        const url = escapeHtml(repo.html_url);
        const date = formatDate(repo.updated_at);

        // Topics/tags
        const topicsHtml = repo.topics && repo.topics.length > 0
            ? `<div class="project-topics">
                ${repo.topics.slice(0, 3).map(topic =>
                `<span class="topic-tag">${escapeHtml(topic)}</span>`
            ).join('')}
               </div>`
            : '';

        return `
            <article class="project-card" data-language="${languageLower}">
                <div class="project-header">
                    <h3 class="project-title">
                        <a href="${url}" target="_blank" rel="noopener noreferrer">
                            ${name}
                        </a>
                    </h3>
                    ${language
            ? `<span class="project-language ${languageClass}">${escapeHtml(language)}</span>`
            : ''}
                </div>
                <p class="project-description">${description}</p>
                <div class="project-meta">
                    <span class="project-date">
                        <span aria-hidden="true">🕒</span>
                        <span class="visually-hidden">Last updated:</span>
                        ${date}
                    </span>
                </div>
                ${topicsHtml}
            </article>
        `;
    }

    /**
     * Render repositories
     * @param {Array} repos
     */
    function renderRepos(repos) {
        hideLoading();
        hideError();

        if (!repos || repos.length === 0) {
            container.innerHTML = `
                <div class="no-repos">
                    <p>No repositories found. Check back later!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = repos.map(createRepoCard).join('');
    }

    /**
     * Main fetch function with caching and retry logic
     */
    async function loadProjects() {
        // Try cache first
        const cached = getCachedData();
        if (cached) {
            renderRepos(cached);
            // Fetch fresh data in background
            fetchRepos().then(repos => {
                cacheData(repos);
                renderRepos(repos);
            }).catch(() => {
                // Keep showing cached data on background fetch failure
            });
            return;
        }

        // No cache, show loading
        showLoading();

        try {
            const repos = await fetchRepos();
            cacheData(repos);
            renderRepos(repos);
        } catch (error) {
            console.error('[GitHub] Fetch error:', error);
            showError(error.message);
        }
    }

    /**
     * Initialize module
     */
    function init() {
        // Set up retry button
        if (retryBtn) {
            retryBtn.addEventListener('click', () => {
                loadProjects();
            });
        }

        // Initial load
        loadProjects();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();