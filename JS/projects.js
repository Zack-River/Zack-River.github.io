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
    
    // Filter projects function
    function filterProjects() {
        let visibleCount = 0;
        
        projectCards.forEach((card, index) => {
            const categories = card.dataset.category.toLowerCase();
            const title = card.dataset.title.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check filter match
            const filterMatch = currentFilter === 'all' || categories.includes(currentFilter);
            
            // Check search match
            const searchMatch = currentSearch === '' || 
                title.includes(currentSearch) || 
                description.includes(currentSearch) ||
                techTags.some(tag => tag.includes(currentSearch));
            
            const shouldShow = filterMatch && searchMatch;
            
            if (shouldShow) {
                visibleCount++;
                card.classList.remove('hidden');
                card.style.display = 'block';
                
                // Animate in with delay
                setTimeout(() => {
                    card.classList.add('fade-in');
                    card.classList.remove('fade-out');
                }, index * 50);
            } else {
                card.classList.add('fade-out');
                card.classList.remove('fade-in');
                
                // Hide after animation
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
        
        // Update URL with current filter (for bookmarking)
        const url = new URL(window.location);
        if (currentFilter !== 'all') {
            url.searchParams.set('filter', currentFilter);
        } else {
            url.searchParams.delete('filter');
        }
        if (currentSearch !== '') {
            url.searchParams.set('search', currentSearch);
        } else {
            url.searchParams.delete('search');
        }
        window.history.replaceState({}, '', url);
    }
    
    // Filter button event listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            this.classList.add('filter-animation');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.classList.remove('filter-animation');
            }, 300);
            
            // Update current filter
            currentFilter = this.dataset.filter;
            
            // Add loading state
            projectsGrid.classList.add('loading');
            
            // Filter projects with slight delay for better UX
            setTimeout(() => {
                filterProjects();
                projectsGrid.classList.remove('loading');
            }, 200);
        });
    });
    
    // Search input event listener
    if (searchInput) {
        // Debounce search input
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            currentSearch = this.value.toLowerCase().trim();
            
            searchTimeout = setTimeout(() => {
                projectsGrid.classList.add('loading');
                setTimeout(() => {
                    filterProjects();
                    projectsGrid.classList.remove('loading');
                }, 150);
            }, 300);
        });
        
        // Clear search on escape key
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                this.value = '';
                currentSearch = '';
                filterProjects();
            }
        });
    }
    
    // Initialize from URL parameters
    function initializeFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const filterParam = urlParams.get('filter');
        const searchParam = urlParams.get('search');
        
        if (filterParam && filterParam !== 'all') {
            const filterButton = document.querySelector(`[data-filter="${filterParam}"]`);
            if (filterButton) {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                filterButton.classList.add('active');
                currentFilter = filterParam;
            }
        }
        
        if (searchParam && searchInput) {
            searchInput.value = searchParam;
            currentSearch = searchParam.toLowerCase().trim();
        }
        
        // Apply initial filters
        setTimeout(filterProjects, 100);
    }
    
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
        
        // Project link analytics (ready for integration)
        const projectLinks = card.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Prevent default for demo
                e.preventDefault();
                
                const projectTitle = card.querySelector('.project-title').textContent;
                const linkType = this.getAttribute('aria-label');
                
                // Analytics tracking (replace with your analytics service)
                console.log(`[Analytics] Project link clicked: ${projectTitle} - ${linkType}`);
                
                // You can replace this with actual links
                if (linkType === 'View Code') {
                    // window.open('https://github.com/johndoe/project-repo', '_blank');
                    console.log('Would open GitHub repository');
                } else if (linkType === 'Live Demo') {
                    // window.open('https://project-demo.com', '_blank');
                    console.log('Would open live demo');
                }
            });
        });
    });
    
    // Keyboard navigation for filters
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            let targetIndex;
            
            switch(e.key) {
                case 'ArrowLeft':
                    targetIndex = index > 0 ? index - 1 : filterButtons.length - 1;
                    break;
                case 'ArrowRight':
                    targetIndex = index < filterButtons.length - 1 ? index + 1 : 0;
                    break;
                case 'Home':
                    targetIndex = 0;
                    break;
                case 'End':
                    targetIndex = filterButtons.length - 1;
                    break;
                default:
                    return;
            }
            
            e.preventDefault();
            filterButtons[targetIndex].focus();
        });
    });
    
    // Lazy loading for project images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    }, {
        rootMargin: '50px 0px'
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Theme-aware updates
    window.addEventListener('themeChanged', function(e) {
        const isDark = e.detail.theme === 'dark';
        
        // Update search input placeholder color
        if (searchInput) {
            searchInput.style.setProperty('--placeholder-color', 
                isDark ? 'var(--text-muted)' : 'var(--text-secondary)');
        }
    });
    
    // Performance optimization: Pause animations when page is not visible
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        
        projectCards.forEach(card => {
            if (isHidden) {
                card.style.animationPlayState = 'paused';
            } else {
                card.style.animationPlayState = 'running';
            }
        });
    });
    
    // Initialize everything
    initializeFromURL();
    
    // Export utility functions for potential external use
    window.projectsPageUtils = {
        filterProjects,
        setFilter: (filter) => {
            const button = document.querySelector(`[data-filter="${filter}"]`);
            if (button) button.click();
        },
        setSearch: (query) => {
            if (searchInput) {
                searchInput.value = query;
                searchInput.dispatchEvent(new Event('input'));
            }
        },
        getCurrentFilter: () => currentFilter,
        getCurrentSearch: () => currentSearch
    };
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