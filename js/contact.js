/**
 * Contact Form Module
 * Handles validation, feedback, and EmailJS integration
 *
 * @author Maryam Aladsani
 * @version 2.1
 */

(function() {
    'use strict';

    // EmailJS Configuration
    const EMAILJS_CONFIG = {
        publicKey: '-aTao5h9dzB31NTll',
        serviceId: 'service_pfu3cg6',
        templateId: 'template_ry5ew38'
    };

    // Storage keys
    const STORAGE_KEYS = {
        name: 'contact_name',
        email: 'contact_email'
    }; 

    // Validation rules
    const VALIDATION = {
        name: {
            minLength: 2,
            maxLength: 100
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        message: {
            minLength: 10,
            maxLength: 2000
        }
    };

    // Track if EmailJS is initialized
    let emailjsReady = false;

    // DOM Elements
    const form = document.querySelector('.contact-form');

    // Exit early if form doesn't exist
    if (!form) {
        console.warn('[Contact] Contact form not found');
        return;
    }

    const elements = {
        name: form.querySelector('#name'),
        email: form.querySelector('#email'),
        message: form.querySelector('#message'),
        status: form.querySelector('#formStatus'),
        submit: form.querySelector('button[type="submit"]')
    };

    // Check required elements
    if (!elements.name || !elements.email || !elements.message || !elements.submit) {
        console.error('[Contact] Required form elements missing');
        return;
    }

    /**
     * Initialize EmailJS when it's available
     */
    function initEmailJS() {
        if (typeof emailjs !== 'undefined' && !emailjsReady) {
            try {
                emailjs.init(EMAILJS_CONFIG.publicKey);
                emailjsReady = true;
                console.log('[Contact] EmailJS initialized successfully');
            } catch (e) {
                console.error('[Contact] EmailJS init error:', e);
            }
        }
    }

    /**
     * Safely check if localStorage is available
     * @returns {boolean}
     */
    function canUseStorage() {
        try {
            const testKey = '__contact_test__';
            localStorage.setItem(testKey, '1');
            localStorage.removeItem(testKey);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Get or create field message element
     * @param {HTMLElement} input
     * @returns {HTMLElement}
     */
    function getFieldMessage(input) {
        let msg = input.parentElement.querySelector('.field-msg');
        if (!msg) {
            msg = document.createElement('small');
            msg.className = 'field-msg';
            msg.setAttribute('aria-live', 'polite');
            input.parentElement.appendChild(msg);
        }
        return msg;
    }

    /**
     * Set inline validation message
     * @param {HTMLElement} input
     * @param {string} text
     * @param {boolean} isValid
     */
    function setFieldMessage(input, text, isValid = false) {
        const msg = getFieldMessage(input);
        msg.textContent = text || '';
        msg.classList.toggle('err', Boolean(text) && !isValid);
        msg.classList.toggle('ok', isValid && Boolean(text));

        input.classList.toggle('input-error', Boolean(text) && !isValid);
        input.setAttribute('aria-invalid', (!isValid && Boolean(text)).toString());
    }

    /**
     * Clear all validation messages
     */
    function clearAllMessages() {
        form.querySelectorAll('.field-msg').forEach(el => {
            el.textContent = '';
            el.className = 'field-msg';
        });
        form.querySelectorAll('.input-error').forEach(el => {
            el.classList.remove('input-error');
        });
        [elements.name, elements.email, elements.message].forEach(input => {
            input.setAttribute('aria-invalid', 'false');
        });
    }

    /**
     * Show form status message
     * @param {string} text
     * @param {boolean} isSuccess
     * @param {boolean} isLoading
     */
    function showStatus(text, isSuccess = false, isLoading = false) {
        if (!elements.status) return;

        elements.status.textContent = text || '';
        elements.status.className = 'form-status';

        if (isLoading) {
            elements.status.classList.add('loading');
        } else if (isSuccess) {
            elements.status.classList.add('status-ok');
        } else if (text) {
            elements.status.classList.add('status-err');
        }
    }

    /**
     * Validate name field
     * @returns {boolean}
     */
    function validateName() {
        const value = elements.name.value.trim();
        const rules = VALIDATION.name;

        if (value.length < rules.minLength) {
            setFieldMessage(elements.name, `Name must be at least ${rules.minLength} characters.`, false);
            return false;
        }

        if (value.length > rules.maxLength) {
            setFieldMessage(elements.name, `Name must be less than ${rules.maxLength} characters.`, false);
            return false;
        }

        setFieldMessage(elements.name, 'Looks good ✓', true);
        return true;
    }

    /**
     * Validate email field
     * @returns {boolean}
     */
    function validateEmail() {
        const value = elements.email.value.trim();
        const rules = VALIDATION.email;

        if (!rules.pattern.test(value)) {
            setFieldMessage(elements.email, 'Please enter a valid email address.', false);
            return false;
        }

        setFieldMessage(elements.email, 'Looks good ✓', true);
        return true;
    }

    /**
     * Validate message field
     * @returns {boolean}
     */
    function validateMessage() {
        const value = elements.message.value.trim();
        const rules = VALIDATION.message;

        if (value.length < rules.minLength) {
            setFieldMessage(elements.message, `Message must be at least ${rules.minLength} characters.`, false);
            return false;
        }

        if (value.length > rules.maxLength) {
            setFieldMessage(elements.message, `Message must be less than ${rules.maxLength} characters.`, false);
            return false;
        }

        setFieldMessage(elements.message, 'Thanks for the details ✓', true);
        return true;
    }

    /**
     * Validate all fields
     * @returns {Object}
     */
    function validateAll() {
        clearAllMessages();

        const nameValid = validateName();
        const emailValid = validateEmail();
        const messageValid = validateMessage();

        return {
            isValid: nameValid && emailValid && messageValid,
            data: {
                name: elements.name.value.trim(),
                email: elements.email.value.trim(),
                message: elements.message.value.trim()
            }
        };
    }

    /**
     * Save form data to localStorage
     * @param {string} name
     * @param {string} email
     */
    function saveFormData(name, email) {
        if (!canUseStorage()) return;

        try {
            localStorage.setItem(STORAGE_KEYS.name, name);
            localStorage.setItem(STORAGE_KEYS.email, email);
        } catch (e) {
            // Silently fail
        }
    }

    /**
     * Load saved form data from localStorage
     */
    function loadSavedData() {
        if (!canUseStorage()) return;

        const savedName = localStorage.getItem(STORAGE_KEYS.name);
        const savedEmail = localStorage.getItem(STORAGE_KEYS.email);

        if (savedName) elements.name.value = savedName;
        if (savedEmail) elements.email.value = savedEmail;
    }

    /**
     * Send email via EmailJS
     * @param {Object} data
     * @returns {Promise}
     */
    async function sendEmail(data) {
        // Try to initialize EmailJS if not ready
        if (!emailjsReady) {
            initEmailJS();
        }

        if (typeof emailjs === 'undefined') {
            throw new Error('Email service not available. Please try again in a moment.');
        }

        return emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                from_name: data.name,
                from_email: data.email,
                message: data.message,
                to_name: 'Maryam'
            }
        );
    }

    /**
     * Handle form submission
     * @param {Event} event
     */
    async function handleSubmit(event) {
        event.preventDefault();

        const { isValid, data } = validateAll();

        if (!isValid) {
            showStatus('Please fix the highlighted fields.', false, false);
            // Focus first invalid field
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Save data for next time
        saveFormData(data.name, data.email);

        // Disable submit and show loading
        elements.submit.disabled = true;
        showStatus('Sending…', false, true);

        try {
            await sendEmail(data);

            showStatus('Thanks! Your message has been sent. ✓', true, false);
            form.reset();
            clearAllMessages();

        } catch (error) {
            console.error('[Contact] Send error:', error);
            showStatus('Could not send message. Please try again or email directly.', false, false);
        } finally {
            elements.submit.disabled = false;
        }
    }

    /**
     * Initialize module
     */
    function init() {
        // Load saved data
        loadSavedData();

        // Try to init EmailJS immediately
        initEmailJS();

        // Also try after a short delay (in case EmailJS loads later)
        setTimeout(initEmailJS, 500);
        setTimeout(initEmailJS, 1500);

        // Set up validation on blur/input
        elements.name.addEventListener('blur', validateName);
        elements.name.addEventListener('input', () => {
            if (elements.name.classList.contains('input-error')) {
                validateName();
            }
        });

        elements.email.addEventListener('blur', validateEmail);
        elements.email.addEventListener('input', () => {
            if (elements.email.classList.contains('input-error')) {
                validateEmail();
            }
        });

        elements.message.addEventListener('blur', validateMessage);
        elements.message.addEventListener('input', () => {
            if (elements.message.classList.contains('input-error')) {
                validateMessage();
            }
        });

        // Set up form submission
        form.addEventListener('submit', handleSubmit);

        // Set initial ARIA attributes
        form.setAttribute('novalidate', '');
        [elements.name, elements.email, elements.message].forEach(input => {
            input.setAttribute('aria-invalid', 'false');
        });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();