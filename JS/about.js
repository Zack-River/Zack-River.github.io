// About page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Animated counter for personal stats
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
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    // Timeline animation observer
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 200);
                timelineObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Value cards animation observer
    const valueCardsObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 150);
                valueCardsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Personal stats counter observer
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateCounter(entry.target, target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Apply observers to elements
    document.querySelectorAll('.timeline-item').forEach(item => {
        timelineObserver.observe(item);
    });
    
    document.querySelectorAll('.value-card').forEach(card => {
        valueCardsObserver.observe(card);
    });
    
    document.querySelectorAll('.personal-stat .stat-number').forEach(counter => {
        statsObserver.observe(counter);
    });
    
    // Profile image hover effect
    const profileImage = document.querySelector('.profile-image');
    const imageContainer = document.querySelector('.image-container');
    
    if (profileImage && imageContainer) {
        imageContainer.addEventListener('mouseenter', function() {
            profileImage.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            profileImage.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    // Timeline marker activation on scroll
    const timelineMarkers = document.querySelectorAll('.timeline-marker');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const markerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const marker = entry.target.querySelector('.timeline-marker');
            if (entry.isIntersecting) {
                marker.classList.add('active');
            } else {
                marker.classList.remove('active');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '0px 0px -200px 0px'
    });
    
    timelineItems.forEach(item => {
        markerObserver.observe(item);
    });
    
    // Smooth scroll enhancement for about page
    function smoothScrollTo(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 100; // Account for navbar
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Enhanced parallax effect for hero section
    const aboutHero = document.querySelector('.about-hero');
    const profileImageContainer = document.querySelector('.image-container');
    
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    if (aboutHero && profileImageContainer) {
        window.addEventListener('scroll', debounce(function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (scrolled < window.innerHeight) {
                profileImageContainer.style.transform = `translateY(${rate}px) scale(${1 + scrolled * 0.0001})`;
            }
        }, 10));
    }
    
    // Tech tags hover effect
    document.querySelectorAll('.tech-tag').forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 8px rgba(16, 185, 129, 0.3)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Value cards enhanced interaction
    document.querySelectorAll('.value-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Code snippet typing effect
    const codeContent = document.querySelector('.code-snippet .code-content code');
    if (codeContent) {
        const originalText = codeContent.textContent;
        codeContent.textContent = '';
        
        let i = 0;
        function typeCode() {
            if (i < originalText.length) {
                codeContent.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeCode, 30);
            }
        }
        
        // Start typing when code snippet comes into view
        const codeObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeCode, 500);
                    codeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        codeObserver.observe(document.querySelector('.code-snippet'));
    }
    
    // Theme-aware animations
    window.addEventListener('themeChanged', function(e) {
        const isDark = e.detail.theme === 'dark';
        
        // Update timeline markers glow effect
        document.querySelectorAll('.timeline-marker.active').forEach(marker => {
            if (isDark) {
                marker.style.boxShadow = '0 0 20px rgba(52, 211, 153, 0.4)';
            } else {
                marker.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.3)';
            }
        });
        
        // Update profile image overlay
        const imageOverlay = document.querySelector('.image-overlay');
        if (imageOverlay && isDark) {
            imageOverlay.style.background = 'linear-gradient(45deg, rgba(52, 211, 153, 0.1), rgba(129, 140, 248, 0.1))';
        }
    });
    
    // Performance optimization: Pause animations when page is not visible
    document.addEventListener('visibilitychange', function() {
        const isHidden = document.hidden;
        const animatedElements = document.querySelectorAll('.timeline-item, .value-card, .image-container');
        
        animatedElements.forEach(element => {
            if (isHidden) {
                element.style.animationPlayState = 'paused';
            } else {
                element.style.animationPlayState = 'running';
            }
        });
    });
});

// Utility function for enhanced scroll effects
function getScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return scrollTop / docHeight;
}

// Export for potential use in other scripts
window.aboutPageUtils = {
    getScrollProgress,
    smoothScrollTo: (target, duration) => smoothScrollTo(target, duration)
};