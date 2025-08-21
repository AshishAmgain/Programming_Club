/**
 * Programming Club Website - Main JavaScript File
 * Handles slideshow/carousel functionality and navigation interactivity
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Programming Club website loaded successfully!');
    
    // Initialize all components
    initNavigation();
    initSlideshow();
    initSmoothScrolling();
    initScrollAnimations();
});

/**
 * Initialize mobile navigation functionality
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (navToggle && nav) {
        navToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Update toggle button icon
            const icon = navToggle.querySelector('i') || navToggle;
            if (nav.classList.contains('active')) {
                icon.textContent = '✕';
            } else {
                icon.textContent = '☰';
            }
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', function(event) {
            if (!nav.contains(event.target) && !navToggle.contains(event.target)) {
                nav.classList.remove('active');
                const icon = navToggle.querySelector('i') || navToggle;
                icon.textContent = '☰';
            }
        });
    }
}

/**
 * Initialize slideshow/carousel functionality
 */
function initSlideshow() {
    const slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;
    
    const container = slideshow.querySelector('.slideshow-container');
    const slides = slideshow.querySelectorAll('.slide');
    const prevBtn = slideshow.querySelector('.slideshow-prev');
    const nextBtn = slideshow.querySelector('.slideshow-next');
    const dots = slideshow.querySelectorAll('.dot');
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Auto-play slideshow
    let autoPlayInterval = setInterval(nextSlide, 5000);
    
    // Pause auto-play on hover
    slideshow.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    slideshow.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(nextSlide, 5000);
    });
    
    // Navigation button event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    /**
     * Go to next slide
     */
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlideshow();
    }
    
    /**
     * Go to previous slide
     */
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlideshow();
    }
    
    /**
     * Go to specific slide
     */
    function goToSlide(index) {
        currentSlide = index;
        updateSlideshow();
    }
    
    /**
     * Update slideshow display
     */
    function updateSlideshow() {
        // Update slide position
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Update active dot
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Add fade-in animation to current slide
        slides.forEach((slide, index) => {
            if (index === currentSlide) {
                slide.classList.add('fade-in');
            } else {
                slide.classList.remove('fade-in');
            }
        });
    }
    
    // Initialize first slide
    updateSlideshow();
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .gallery-item, .section-title');
    animateElements.forEach(el => observer.observe(el));
}

/**
 * Utility function to show loading state
 */
function showLoading(element) {
    if (element) {
        element.classList.add('loading');
        element.innerHTML = '<div class="spinner"></div>';
    }
}

/**
 * Utility function to hide loading state
 */
function hideLoading(element, content) {
    if (element) {
        element.classList.remove('loading');
        element.innerHTML = content;
    }
}

/**
 * Utility function to show success message
 */
function showSuccessMessage(element, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    element.parentNode.insertBefore(successDiv, element);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

/**
 * Utility function to show error message
 */
function showErrorMessage(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    element.parentNode.insertBefore(errorDiv, element);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

/**
 * Utility function to format dates
 */
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

/**
 * Utility function to truncate text
 */
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

/**
 * Utility function to debounce function calls
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Handle window resize events
 */
window.addEventListener('resize', debounce(() => {
    // Recalculate any layout-dependent elements
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
        // Force slideshow to recalculate dimensions
        slideshow.style.height = 'auto';
        setTimeout(() => {
            slideshow.style.height = '';
        }, 100);
    }
}, 250));

/**
 * Handle page visibility changes
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause auto-play when page is not visible
        const slideshow = document.querySelector('.slideshow');
        if (slideshow) {
            slideshow.setAttribute('data-paused', 'true');
        }
    } else {
        // Resume auto-play when page becomes visible
        const slideshow = document.querySelector('.slideshow');
        if (slideshow && slideshow.getAttribute('data-paused') === 'true') {
            slideshow.removeAttribute('data-paused');
            // Reinitialize slideshow
            initSlideshow();
        }
    }
});

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavigation,
        initSlideshow,
        initSmoothScrolling,
        initScrollAnimations,
        showLoading,
        hideLoading,
        showSuccessMessage,
        showErrorMessage,
        formatDate,
        truncateText,
        debounce
    };
} 