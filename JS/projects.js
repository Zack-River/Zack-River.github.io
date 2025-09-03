// Projects page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Project filtering and search functionality
    const projectCards = document.querySelectorAll('.project-card');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('project-search');
    const noResults = document.getElementById('no-results');
    const projectsGrid = document.getElementById('projects-grid');
    
    let currentFilter = 'all';
    let currentSearch = '';
    
    // Animated counter for project stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Initialize counters when they come into view
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.stat-number').forEach(counter => {
        statsObserver.observe(counter);
    });
    
    // Project cards entrance animation
    const cardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
                cardsObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    projectCards.forEach(card => {
        cardsObserver.observe(card);
    });
    // Enhanced project card interactions
    projectCards.forEach(card => {
        const projectImage = card.querySelector('.project-image img');
        const techTags = card.querySelectorAll('.tech-tag');
        
        // Image hover effect
        card.addEventListener('mouseenter', function() {
            if (projectImage) {
                projectImage.style.filter = 'brightness(1.1) contrast(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (projectImage) {
                projectImage.style.filter = 'brightness(1) contrast(1)';
            }
        });
        
        // Tech tag click to filter
        techTags.forEach(tag => {
            tag.addEventListener('click', function(e) {
                e.stopPropagation();
                const tagText = this.textContent.toLowerCase();
                
                // Find matching filter button
                const matchingFilter = Array.from(filterButtons).find(btn => {
                    const filterValue = btn.dataset.filter;
                    return tagText.includes(filterValue) || filterValue.includes(tagText);
                });
                
                if (matchingFilter) {
                    matchingFilter.click();
                } else {
                    // Use search instead
                    if (searchInput) {
                        searchInput.value = tagText;
                        searchInput.dispatchEvent(new Event('input'));
                        searchInput.focus();
                    }
                }
            });
            
            // Add hover effect to tech tags
            tag.addEventListener('mouseenter', function() {
                this.style.cursor = 'pointer';
                this.style.boxShadow = '0 2px 8px rgba(16, 185, 129, 0.3)';
            });
            
            tag.addEventListener('mouseleave', function() {
                this.style.boxShadow = 'none';
            });
        });
    });


// Utility function for smooth scrolling to projects section
function scrollToProjects() {
    const projectsSection = document.querySelector('.projects-grid-section');
    if (projectsSection) {
        projectsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Export for external use
window.scrollToProjects = scrollToProjects;
});