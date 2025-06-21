/**
 * Email Handler Module for Patat Palace
 * Handles contact form submission and email functionality
 */
class EmailHandler {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Initializing email handler module...');
        
        // Add event listener to contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactFormSubmission(contactForm);
            });
        }
    }
    
    handleContactFormSubmission(form) {
        // Get form data
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        // Validate form data
        if (!this.validateFormData(name, email, message)) {
            return;
        }
        
        // In a real environment, this would send data to a backend server
        // For demonstration purposes, we'll simulate a successful submission
        this.simulateSuccessfulSubmission(form, name);
    }
    
    validateFormData(name, email, message) {
        // Basic validation
        if (!name || name.trim() === '') {
            this.showFormError('Vul uw naam in.');
            return false;
        }
        
        if (!email || !this.isValidEmail(email)) {
            this.showFormError('Vul een geldig e-mailadres in.');
            return false;
        }
        
        if (!message || message.trim() === '') {
            this.showFormError('Vul een bericht in.');
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showFormError(message) {
        // Create or update error message
        let errorDiv = document.querySelector('.contact-form-error');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger contact-form-error mt-3';
            
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(errorDiv, form.nextSibling);
        }
        
        errorDiv.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    showFormSuccess(message) {
        // Create success message
        let successDiv = document.querySelector('.contact-form-success');
        
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'alert alert-success contact-form-success mt-3';
            
            const form = document.getElementById('contactForm');
            form.parentNode.insertBefore(successDiv, form.nextSibling);
        }
        
        successDiv.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 5000);
    }
    
    simulateSuccessfulSubmission(form, name) {
        // Show loading indicator
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Verzenden...';
        submitButton.disabled = true;
        
        // Simulate server delay
        setTimeout(() => {
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
            
            // Show success message
            this.showFormSuccess(`Thank you ${name}! Your message has been sent successfully.`);

            console.log('Form submitted successfully!');
        }, 1500);
    }
}

// Initialize email handler when script is loaded
window.emailHandler = new EmailHandler();