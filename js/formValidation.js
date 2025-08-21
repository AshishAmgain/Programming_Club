/**
 * Programming Club Website - Form Validation JavaScript
 * Handles validation for membership and contact forms
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Form validation initialized');
    
    // Initialize form validation
    initFormValidation();
});

/**
 * Initialize form validation for all forms
 */
function initFormValidation() {
    const membershipForm = document.getElementById('membership-form');
    const contactForm = document.getElementById('contact-form');
    
    if (membershipForm) {
        initMembershipForm(membershipForm);
    }
    
    if (contactForm) {
        initContactForm(contactForm);
    }
}

/**
 * Initialize membership form validation
 */
function initMembershipForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData();
    
    // Add event listeners for real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateMembershipForm()) {
            submitMembershipForm(form);
        }
    });
}

/**
 * Initialize contact form validation
 */
function initContactForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Add event listeners for real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateContactForm()) {
            submitContactForm(form);
        }
    });
}

/**
 * Validate membership form
 */
function validateMembershipForm() {
    const form = document.getElementById('membership-form');
    let isValid = true;
    
    // Required fields validation
    const requiredFields = ['full-name', 'email', 'student-id', 'major', 'graduation-year'];
    requiredFields.forEach(fieldId => {
        const field = form.querySelector(`#${fieldId}`);
        if (field && !validateRequired(field)) {
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Student ID validation
    const studentIdField = form.querySelector('#student-id');
    if (studentIdField && !validateStudentId(studentIdField.value)) {
        showFieldError(studentIdField, 'Student ID must be 8-10 digits');
        isValid = false;
    }
    
    // Graduation year validation
    const graduationYearField = form.querySelector('#graduation-year');
    if (graduationYearField && !validateGraduationYear(graduationYearField.value)) {
        showFieldError(graduationYearField, 'Please select a valid graduation year');
        isValid = false;
    }
    
    // Programming experience validation
    const experienceField = form.querySelector('#programming-experience');
    if (experienceField && !validateRequired(experienceField)) {
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate contact form
 */
function validateContactForm() {
    const form = document.getElementById('contact-form');
    let isValid = true;
    
    // Required fields validation
    const requiredFields = ['name', 'email', 'subject', 'message'];
    requiredFields.forEach(fieldId => {
        const field = form.querySelector(`#${fieldId}`);
        if (field && !validateRequired(field)) {
            isValid = false;
        }
    });
    
    // Email validation
    const emailField = form.querySelector('#email');
    if (emailField && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Message length validation
    const messageField = form.querySelector('#message');
    if (messageField && messageField.value.length < 10) {
        showFieldError(messageField, 'Message must be at least 10 characters long');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Validate individual field
 */
function validateField(field) {
    const fieldType = field.type;
    const fieldValue = field.value.trim();
    
    // Clear previous errors
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !validateRequired(field)) {
        return false;
    }
    
    // Type-specific validation
    switch (fieldType) {
        case 'email':
            if (fieldValue && !validateEmail(fieldValue)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
            break;
            
        case 'tel':
            if (fieldValue && !validatePhone(fieldValue)) {
                showFieldError(field, 'Please enter a valid phone number');
                return false;
            }
            break;
            
        case 'url':
            if (fieldValue && !validateUrl(fieldValue)) {
                showFieldError(field, 'Please enter a valid URL');
                return false;
            }
            break;
    }
    
    // Custom validation based on field ID
    const fieldId = field.id;
    if (fieldId === 'student-id' && fieldValue && !validateStudentId(fieldValue)) {
        showFieldError(field, 'Student ID must be 8-10 digits');
        return false;
    }
    
    if (fieldId === 'graduation-year' && fieldValue && !validateGraduationYear(fieldValue)) {
        showFieldError(field, 'Please select a valid graduation year');
        return false;
    }
    
    if (fieldId === 'message' && fieldValue && fieldValue.length < 10) {
        showFieldError(field, 'Message must be at least 10 characters long');
        return false;
    }
    
    return true;
}

/**
 * Validate required field
 */
function validateRequired(field) {
    const value = field.value.trim();
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    return true;
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

/**
 * Validate URL format
 */
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validate student ID format
 */
function validateStudentId(studentId) {
    const studentIdRegex = /^\d{8,10}$/;
    return studentIdRegex.test(studentId);
}

/**
 * Validate graduation year
 */
function validateGraduationYear(year) {
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    return yearNum >= currentYear && yearNum <= currentYear + 6;
}

/**
 * Show field error message
 */
function showFieldError(field, message) {
    // Remove existing error
    clearFieldError(field);
    
    // Add error class
    field.classList.add('error');
    
    // Create and insert error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Insert error message after the field
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
}

/**
 * Clear field error message
 */
function clearFieldError(field) {
    // Remove error class
    field.classList.remove('error');
    
    // Remove error message
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Submit membership form
 */
function submitMembershipForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success simulation
        showFormSuccess(form, 'Thank you! Your membership application has been submitted successfully.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Scroll to success message
        const successMessage = form.querySelector('.success-message');
        if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }, 2000);
}

/**
 * Submit contact form
 */
function submitContactForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success simulation
        showFormSuccess(form, 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.');
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Scroll to success message
        const successMessage = form.querySelector('.success-message');
        if (successMessage) {
            successMessage.scrollIntoView({ behavior: 'smooth' });
        }
    }, 2000);
}

/**
 * Show form success message
 */
function showFormSuccess(form, message) {
    // Remove existing success message
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    // Insert at the top of the form
    form.insertBefore(successDiv, form.firstChild);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.remove();
        }
    }, 8000);
}

/**
 * Reset form validation state
 */
function resetFormValidation(form) {
    // Clear all error states
    const errorFields = form.querySelectorAll('.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
    
    // Remove all error messages
    const errorMessages = form.querySelectorAll('.error-message');
    errorMessages.forEach(message => {
        message.remove();
    });
    
    // Remove success message
    const successMessage = form.querySelector('.success-message');
    if (successMessage) {
        successMessage.remove();
    }
}

/**
 * Validate form on input change (real-time validation)
 */
function initRealTimeValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Validate on blur
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Clear error on input
            input.addEventListener('input', () => {
                clearFieldError(input);
            });
        });
    });
}

/**
 * Utility function to format form data
 */
function formatFormData(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

/**
 * Utility function to validate form data object
 */
function validateFormData(data, rules) {
    const errors = {};
    
    for (const [field, rule] of Object.entries(rules)) {
        if (rule.required && (!data[field] || data[field].trim() === '')) {
            errors[field] = `${field} is required`;
        } else if (data[field] && rule.pattern && !rule.pattern.test(data[field])) {
            errors[field] = rule.message || `${field} format is invalid`;
        } else if (data[field] && rule.minLength && data[field].length < rule.minLength) {
            errors[field] = `${field} must be at least ${rule.minLength} characters`;
        }
    }
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}

// Initialize real-time validation
initRealTimeValidation();

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFormValidation,
        validateMembershipForm,
        validateContactForm,
        validateField,
        showFieldError,
        clearFieldError,
        submitMembershipForm,
        submitContactForm,
        resetFormValidation,
        formatFormData,
        validateFormData
    };
} 