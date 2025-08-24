/**
 * Kiddies Teen Fan Club with Bobo - Main Application
 * Professional JavaScript implementation for fan club website
 * @version 1.0.0
 * @author Kiddies Teen Fan Club with Bobo Development Team
 */

'use strict';

/**
 * Application Configuration
 */
const APP_CONFIG = {
    SELECTORS: {
        JOIN_FORM: '#joinForm',
        MODAL: '#modal',
        MODAL_IMG: '#modalImg',
        MESSAGE_DIV: '#message'
    },
    ENDPOINTS: {
        JOIN: '/join'
    },
    MESSAGES: {
        CONNECTION_ERROR: 'Connection error. Please try again.',
        WELCOME: 'Welcome to the Kiddies Teen Fan Club with Bobo! 🎉'
    }
};

/**
 * Photo Gallery Manager
 * Handles photo modal functionality
 */
class PhotoGallery {
    /**
     * Display photo in modal overlay
     * @param {HTMLElement} element - Photo container element
     */
    static selectPhoto(element) {
        try {
            const modal = document.getElementById('modal');
            const modalImg = document.getElementById('modalImg');
            const img = element.querySelector('img');
            
            if (!modal || !modalImg || !img) {
                console.error('Required elements not found for photo modal');
                return;
            }
            
            modal.style.display = 'block';
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'Fan club photo';
            
            // Add keyboard support for accessibility
            document.addEventListener('keydown', PhotoGallery.handleKeydown);
        } catch (error) {
            console.error('Error opening photo modal:', error);
        }
    }

    /**
     * Close photo modal
     */
    static closeModal() {
        try {
            const modal = document.getElementById('modal');
            if (modal) {
                modal.style.display = 'none';
                document.removeEventListener('keydown', PhotoGallery.handleKeydown);
            }
        } catch (error) {
            console.error('Error closing photo modal:', error);
        }
    }

    /**
     * Handle keyboard events for modal
     * @param {KeyboardEvent} event - Keyboard event
     */
    static handleKeydown(event) {
        if (event.key === 'Escape') {
            PhotoGallery.closeModal();
        }
    }
}

/**
 * Form Manager
 * Handles form submissions and validation
 */
class FormManager {
    /**
     * Initialize form event listeners
     */
    static init() {
        const joinForm = document.querySelector(APP_CONFIG.SELECTORS.JOIN_FORM);
        if (joinForm) {
            joinForm.addEventListener('submit', FormManager.handleJoinSubmission);
        }
    }

    /**
     * Handle join form submission
     * @param {Event} event - Form submit event
     */
    static async handleJoinSubmission(event) {
        event.preventDefault();
        
        const form = event.target;
        const messageDiv = document.querySelector(APP_CONFIG.SELECTORS.MESSAGE_DIV);
        
        try {
            // Show loading state
            FormManager.showMessage(messageDiv, 'Processing...', 'info');
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Validate form data
            const validation = FormManager.validateFormData(data);
            if (!validation.isValid) {
                FormManager.showMessage(messageDiv, validation.message, 'error');
                return;
            }
            
            // Submit form data
            const response = await fetch(APP_CONFIG.ENDPOINTS.JOIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                FormManager.showMessage(messageDiv, `✅ ${result.message || APP_CONFIG.MESSAGES.WELCOME}`, 'success');
                form.reset();
            } else {
                FormManager.showMessage(messageDiv, `❌ ${result.error || 'Submission failed'}`, 'error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            FormManager.showMessage(messageDiv, `❌ ${APP_CONFIG.MESSAGES.CONNECTION_ERROR}`, 'error');
        }
    }

    /**
     * Validate form data
     * @param {Object} data - Form data object
     * @returns {Object} Validation result
     */
    static validateFormData(data) {
        if (!data.name || data.name.trim().length < 2) {
            return { isValid: false, message: 'Please enter a valid name (at least 2 characters)' };
        }
        
        if (!data.email || !FormManager.isValidEmail(data.email)) {
            return { isValid: false, message: 'Please enter a valid email address' };
        }
        
        return { isValid: true };
    }

    /**
     * Validate email format
     * @param {string} email - Email address
     * @returns {boolean} Is valid email
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Display message to user
     * @param {HTMLElement} messageDiv - Message container
     * @param {string} message - Message text
     * @param {string} type - Message type (success, error, info)
     */
    static showMessage(messageDiv, message, type) {
        if (!messageDiv) return;
        
        const colors = {
            success: 'green',
            error: 'red',
            info: 'blue'
        };
        
        messageDiv.innerHTML = `<p style="color: ${colors[type] || 'black'}; padding: 1rem; border-radius: 5px; background: rgba(${type === 'success' ? '0,255,0' : type === 'error' ? '255,0,0' : '0,0,255'},0.1);">${message}</p>`;
    }
}

/**
 * Application Initializer
 * Main application entry point
 */
class App {
    /**
     * Initialize application
     */
    static init() {
        document.addEventListener('DOMContentLoaded', () => {
            FormManager.init();
            App.bindGlobalEvents();
            console.log('Kiddies Teen Fan Club with Bobo application initialized');
        });
    }

    /**
     * Bind global event listeners
     */
    static bindGlobalEvents() {
        // Close modal when clicking outside
        const modal = document.querySelector(APP_CONFIG.SELECTORS.MODAL);
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    PhotoGallery.closeModal();
                }
            });
        }
    }
}

// Global functions for backward compatibility
window.selectPhoto = PhotoGallery.selectPhoto;
window.closeModal = PhotoGallery.closeModal;

// Initialize application
App.init();