/**
 * Programming Club Website - FAQ JavaScript
 * Handles FAQ accordion/toggle functionality
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('FAQ functionality initialized');
    
    // Initialize FAQ functionality
    initFAQ();
});

/**
 * Initialize FAQ accordion functionality
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) {
        console.log('No FAQ items found on this page');
        return;
    }
    
    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (question && answer) {
            // Set initial state
            item.setAttribute('data-index', index);
            answer.style.maxHeight = '0px';
            
            // Add click event listener
            question.addEventListener('click', () => {
                toggleFAQ(item);
            });
            
            // Add keyboard support
            question.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleFAQ(item);
                }
            });
            
            // Set ARIA attributes for accessibility
            question.setAttribute('role', 'button');
            question.setAttribute('tabindex', '0');
            question.setAttribute('aria-expanded', 'false');
            question.setAttribute('aria-controls', `faq-answer-${index}`);
            
            answer.setAttribute('id', `faq-answer-${index}`);
            answer.setAttribute('aria-labelledby', `faq-question-${index}`);
            
            // Add unique IDs
            question.setAttribute('id', `faq-question-${index}`);
        }
    });
    
    // Initialize search functionality if search input exists
    initFAQSearch();
    
    // Initialize category filtering if categories exist
    initFAQCategories();
    
    // Initialize FAQ analytics
    initFAQAnalytics();
}

/**
 * Toggle FAQ item open/closed
 */
function toggleFAQ(item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    const isOpen = answer.classList.contains('active');
    
    // Close all other FAQ items (accordion behavior)
    if (!isOpen) {
        closeAllFAQItems();
    }
    
    // Toggle current item
    if (isOpen) {
        closeFAQItem(item);
    } else {
        openFAQItem(item);
    }
    
    // Update ARIA attributes
    question.setAttribute('aria-expanded', !isOpen);
    
    // Track FAQ interaction
    trackFAQInteraction(item, !isOpen);
}

/**
 * Open FAQ item
 */
function openFAQItem(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    // Add active classes
    answer.classList.add('active');
    toggle.classList.add('active');
    item.classList.add('open');
    
    // Animate height
    const contentHeight = answer.scrollHeight;
    answer.style.maxHeight = contentHeight + 'px';
    
    // Add smooth transition
    answer.style.transition = 'max-height 0.3s ease-in-out';
    
    // Scroll to opened item if it's not fully visible
    setTimeout(() => {
        if (!isElementInViewport(item)) {
            item.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }
    }, 100);
}

/**
 * Close FAQ item
 */
function closeFAQItem(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    
    // Remove active classes
    answer.classList.remove('active');
    toggle.classList.remove('active');
    item.classList.remove('open');
    
    // Animate height
    answer.style.maxHeight = '0px';
}

/**
 * Close all FAQ items
 */
function closeAllFAQItems() {
    const openItems = document.querySelectorAll('.faq-item.open');
    openItems.forEach(item => {
        closeFAQItem(item);
    });
}

/**
 * Initialize FAQ search functionality
 */
function initFAQSearch() {
    const searchInput = document.querySelector('.faq-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', debounce(() => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        searchFAQ(searchTerm);
    }, 300));
    
    // Add clear search functionality
    const clearBtn = document.querySelector('.faq-clear-search');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearFAQSearch();
        });
    }
}

/**
 * Search FAQ items
 */
function searchFAQ(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h4').textContent.toLowerCase();
        const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
            item.style.display = 'block';
            hasResults = true;
            
            // Highlight search terms
            if (searchTerm) {
                highlightSearchTerms(item, searchTerm);
            }
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    showNoResultsMessage(hasResults, searchTerm);
    
    // Update search results count
    updateSearchResultsCount(searchTerm, hasResults);
}

/**
 * Clear FAQ search
 */
function clearFAQSearch() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        item.style.display = 'block';
        removeHighlighting(item);
    });
    
    // Hide no results message
    hideNoResultsMessage();
    
    // Reset search results count
    resetSearchResultsCount();
}

/**
 * Highlight search terms in FAQ items
 */
function highlightSearchTerms(item, searchTerm) {
    const question = item.querySelector('.faq-question h4');
    const answer = item.querySelector('.faq-answer');
    
    // Remove existing highlighting
    removeHighlighting(item);
    
    // Highlight in question
    if (question.textContent.toLowerCase().includes(searchTerm)) {
        const highlightedQuestion = question.textContent.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<mark class="search-highlight">${match}</mark>`
        );
        question.innerHTML = highlightedQuestion;
    }
    
    // Highlight in answer
    if (answer.textContent.toLowerCase().includes(searchTerm)) {
        const highlightedAnswer = answer.textContent.replace(
            new RegExp(searchTerm, 'gi'),
            match => `<mark class="search-highlight">${match}</mark>`
        );
        answer.innerHTML = highlightedAnswer;
    }
}

/**
 * Remove highlighting from FAQ items
 */
function removeHighlighting(item) {
    const question = item.querySelector('.faq-question h4');
    const answer = item.querySelector('.faq-answer');
    
    // Remove highlighting from question
    if (question.innerHTML.includes('<mark')) {
        question.innerHTML = question.textContent;
    }
    
    // Remove highlighting from answer
    if (answer.innerHTML.includes('<mark')) {
        answer.innerHTML = answer.textContent;
    }
}

/**
 * Show no results message
 */
function showNoResultsMessage(hasResults, searchTerm) {
    let noResultsMsg = document.querySelector('.faq-no-results');
    
    if (!hasResults && searchTerm) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'faq-no-results';
            noResultsMsg.innerHTML = `
                <div class="text-center">
                    <p>No FAQ items found for "<strong>${searchTerm}</strong>"</p>
                    <p>Try different keywords or check the spelling.</p>
                </div>
            `;
            
            const faqContainer = document.querySelector('.faq-container');
            if (faqContainer) {
                faqContainer.appendChild(noResultsMsg);
            }
        }
        noResultsMsg.style.display = 'block';
    } else if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

/**
 * Hide no results message
 */
function hideNoResultsMessage() {
    const noResultsMsg = document.querySelector('.faq-no-results');
    if (noResultsMsg) {
        noResultsMsg.style.display = 'none';
    }
}

/**
 * Update search results count
 */
function updateSearchResultsCount(searchTerm, hasResults) {
    let resultsCount = document.querySelector('.faq-results-count');
    
    if (!resultsCount) {
        resultsCount = document.createElement('div');
        resultsCount.className = 'faq-results-count';
        const searchContainer = document.querySelector('.faq-search-container');
        if (searchContainer) {
            searchContainer.appendChild(resultsCount);
        }
    }
    
    if (searchTerm) {
        const visibleItems = document.querySelectorAll('.faq-item[style*="block"]').length;
        resultsCount.textContent = `${visibleItems} result${visibleItems !== 1 ? 's' : ''} found`;
        resultsCount.style.display = 'block';
    } else {
        resultsCount.style.display = 'none';
    }
}

/**
 * Reset search results count
 */
function resetSearchResultsCount() {
    const resultsCount = document.querySelector('.faq-results-count');
    if (resultsCount) {
        resultsCount.style.display = 'none';
    }
}

/**
 * Initialize FAQ categories
 */
function initFAQCategories() {
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    if (categoryButtons.length === 0) return;
    
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');
            filterFAQByCategory(category);
            
            // Update active category button
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

/**
 * Filter FAQ by category
 */
function filterFAQByCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
    
    // Close all open items when filtering
    closeAllFAQItems();
}

/**
 * Initialize FAQ analytics
 */
function initFAQAnalytics() {
    // Track FAQ page views
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: 'FAQ',
            page_location: window.location.href
        });
    }
}

/**
 * Track FAQ interactions
 */
function trackFAQInteraction(item, isOpen) {
    const question = item.querySelector('.faq-question h4').textContent;
    const action = isOpen ? 'open' : 'close';
    
    // Track with Google Analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', 'faq_interaction', {
            event_category: 'FAQ',
            event_label: question,
            value: isOpen ? 1 : 0
        });
    }
    
    // Log to console for development
    console.log(`FAQ ${action}: ${question}`);
}

/**
 * Utility function to check if element is in viewport
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
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
 * Expand all FAQ items
 */
function expandAllFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        if (!item.classList.contains('open')) {
            openFAQItem(item);
        }
    });
}

/**
 * Collapse all FAQ items
 */
function collapseAllFAQ() {
    closeAllFAQItems();
}

/**
 * Get FAQ statistics
 */
function getFAQStats() {
    const totalItems = document.querySelectorAll('.faq-item').length;
    const openItems = document.querySelectorAll('.faq-item.open').length;
    
    return {
        total: totalItems,
        open: openItems,
        closed: totalItems - openItems
    };
}

/**
 * Export FAQ data
 */
function exportFAQData() {
    const faqItems = document.querySelectorAll('.faq-item');
    const data = [];
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question h4').textContent;
        const answer = item.querySelector('.faq-answer').textContent;
        const category = item.getAttribute('data-category') || 'General';
        
        data.push({
            question,
            answer,
            category
        });
    });
    
    // Create downloadable JSON file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'faq-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Add global functions for external use
window.FAQ = {
    init: initFAQ,
    toggle: toggleFAQ,
    open: openFAQItem,
    close: closeFAQItem,
    openAll: expandAllFAQ,
    closeAll: collapseAllFAQ,
    search: searchFAQ,
    clearSearch: clearFAQSearch,
    filterByCategory: filterFAQByCategory,
    getStats: getFAQStats,
    exportData: exportFAQData
};

// Export functions for use in other modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initFAQ,
        toggleFAQ,
        openFAQItem,
        closeFAQItem,
        expandAllFAQ,
        collapseAllFAQ,
        searchFAQ,
        clearFAQSearch,
        filterFAQByCategory,
        getFAQStats,
        exportFAQData
    };
} 