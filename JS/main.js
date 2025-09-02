// Enhanced Main JavaScript functionality with modern features
class PortfolioApp {
  constructor() {
    this.isLoaded = false;
    this.observers = new Map();
    this.animationFrame = null;
    this.init();
  }

  async init() {
    // Show loading screen
    this.showLoadingScreen();
    
    // Wait for DOM and fonts to load
    await this.waitForLoad();
    
    // Initialize all components
    this.initializeComponents();
    
    // Hide loading screen
    this.hideLoadingScreen();
    
    this.isLoaded = true;
    this.dispatchEvent('appReady');
  }

  async waitForLoad() {
    // Wait for DOM
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    // Wait for fonts
    if (document.fonts) {
      await document.fonts.ready;
    }

    // Minimum loading time for smooth UX
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.style.display = 'flex';
    }
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 500);
    }
  }

  initializeComponents() {
    this.initMobileMenu();
    this.initNavbarEffects();
    this.initCounterAnimations();
    this.initCodeAnimation();
    this.initScrollEffects();
    this.initSmoothScrolling();
    this.initIntersectionObservers();
    this.initKeyboardNavigation();
    this.initPerformanceOptimizations();
  }

  // Enhanced Mobile Menu
  initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    if (!hamburger || !navMenu) return;

    const toggleMenu = () => {
      const isActive = hamburger.classList.contains('active');
      
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      
      // Update ARIA attributes
      hamburger.setAttribute('aria-expanded', !isActive);
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? 'auto' : 'hidden';
      
      // Focus management
      if (!isActive) {
        const firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) {
          setTimeout(() => firstLink.focus(), 100);
        }
      }
    };

    hamburger.addEventListener('click', toggleMenu);

    // Close menu when clicking on links
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = 'auto';
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !hamburger.contains(e.target)) {
        toggleMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        toggleMenu();
        hamburger.focus();
      }
    });
  }

  // Enhanced Navbar Effects
  initNavbarEffects() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let isScrollingDown = false;

    const updateNavbar = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;
      
      // Add scrolled class
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Auto-hide navbar on scroll down (except on mobile)
      if (window.innerWidth > 768) {
        if (scrollDifference > 5 && currentScrollY > 100) {
          navbar.style.transform = 'translateY(-100%)';
          isScrollingDown = true;
        } else if (scrollDifference < -5 || currentScrollY < 100) {
          navbar.style.transform = 'translateY(0)';
          isScrollingDown = false;
        }
      }

      lastScrollY = currentScrollY;
    };

    // Throttled scroll handler
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
      if (scrollTimer) return;
      
      scrollTimer = setTimeout(() => {
        updateNavbar();
        scrollTimer = null;
      }, 10);
    });

    // Reset navbar position on resize
    window.addEventListener('resize', this.debounce(() => {
      if (window.innerWidth <= 768) {
        navbar.style.transform = 'translateY(0)';
      }
    }, 250));
  }

  // Enhanced Counter Animations
  initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;

    const animateCounter = (element, target, duration = 2000) => {
      const start = performance.now();
      const initialValue = 0;

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smoother animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(initialValue + (target - initialValue) * easeOutQuart);
        
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(updateCounter);
        } else {
          element.textContent = target.toLocaleString();
        }
      };

      this.animationFrame = requestAnimationFrame(updateCounter);
    };

    // Intersection Observer for counter animation
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.target);
          if (!isNaN(target)) {
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
          }
        }
      });
    }, {
      threshold: 0.5,
      rootMargin: '0px 0px -100px 0px'
    });

    counters.forEach(counter => {
      counter.textContent = '0';
      counterObserver.observe(counter);
    });

    this.observers.set('counter', counterObserver);
  }

  // Enhanced Code Animation
  initCodeAnimation() {
    const codeElement = document.querySelector('#code-animation code');
    const lineNumbersElement = document.querySelector('.line-numbers');
    
    if (!codeElement) return;

    const codeLines = [
      "const express = require('express');",
      "const helmet = require('helmet');",
      "const rateLimit = require('express-rate-limit');",
      "",
      "const app = express();",
      "",
      "// Security middleware",
      "app.use(helmet());",
      "app.use(express.json({ limit: '10mb' }));",
      "",
      "// Rate limiting",
      "const limiter = rateLimit({",
      "  windowMs: 15 * 60 * 1000, // 15 minutes",
      "  max: 100 // limit each IP to 100 requests",
      "});",
      "app.use('/api/', limiter);",
      "",
      "// Routes",
      "app.get('/api/health', (req, res) => {",
      "  res.json({ status: 'OK', timestamp: Date.now() });",
      "});",
      "",
      "app.get('/api/users', async (req, res) => {",
      "  try {",
      "    const users = await User.findAll({",
      "      attributes: ['id', 'name', 'email'],",
      "      where: { active: true }",
      "    });",
      "    ",
      "    res.json({ ",
      "      success: true, ",
      "      data: users,",
      "      count: users.length",
      "    });",
      "  } catch (error) {",
      "    console.error('Database error:', error);",
      "    res.status(500).json({ ",
      "      error: 'Internal server error' ",
      "    });",
      "  }",
      "});",
      "",
      "const PORT = process.env.PORT || 3000;",
      "app.listen(PORT, () => {",
      "  console.log(`🚀 Server running on port ${PORT}`);",
      "});",
    ];

    let animationActive = false;

    const typeCode = async () => {
      if (animationActive) return;
      animationActive = true;

      let currentText = '';
      let lineNumbers = '';

      // Generate line numbers
      for (let i = 1; i <= codeLines.length; i++) {
        lineNumbers += i + '\n';
      }
      
      if (lineNumbersElement) {
        lineNumbersElement.textContent = lineNumbers;
      }

      for (let lineIndex = 0; lineIndex < codeLines.length; lineIndex++) {
        const line = codeLines[lineIndex];
        
        for (let charIndex = 0; charIndex < line.length; charIndex++) {
          currentText += line[charIndex];
          codeElement.textContent = currentText;
          
          // Variable typing speed for more natural feel
          const isComment = line.trim().startsWith('//');
          const baseDelay = isComment ? 20 : 30;
          const randomDelay = Math.random() * 20 + baseDelay;
          
          await new Promise(resolve => setTimeout(resolve, randomDelay));
        }
        
        currentText += '\n';
        codeElement.textContent = currentText;
        
        // Pause at end of line
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Restart animation after pause
      setTimeout(() => {
        animationActive = false;
        typeCode();
      }, 5000);
    };

    // Start animation when code window is visible
    const codeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationActive) {
          setTimeout(() => typeCode(), 500);
          codeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const codeWindow = document.querySelector('.code-window');
    if (codeWindow) {
      codeObserver.observe(codeWindow);
    }

    this.observers.set('code', codeObserver);
  }

  // Enhanced Scroll Effects
  initScrollEffects() {
    // Smooth scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        const overviewSection = document.querySelector('.overview-section');
        if (overviewSection) {
          overviewSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });

      // Hide scroll indicator when scrolling
      let scrollTimer = null;
      window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
        } else {
          scrollIndicator.style.opacity = '1';
          scrollIndicator.style.pointerEvents = 'auto';
        }
      });
    }

    // Parallax effect for hero background
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground) {
      const updateParallax = () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        heroBackground.style.transform = `translateY(${rate}px)`;
      };

      let parallaxTimer = null;
      window.addEventListener('scroll', () => {
        if (parallaxTimer) return;
        
        parallaxTimer = setTimeout(() => {
          requestAnimationFrame(updateParallax);
          parallaxTimer = null;
        }, 16);
      });
    }
  }

  // Enhanced Smooth Scrolling
  initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const headerOffset = 80;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL without jumping
          if (history.pushState) {
            history.pushState(null, null, targetId);
          }

          // Focus management for accessibility
          setTimeout(() => {
            targetElement.focus({ preventScroll: true });
          }, 500);
        }
      });
    });
  }

  // Enhanced Intersection Observers
  initIntersectionObservers() {
    // Fade in animation observer
    const fadeInObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    // Apply fade-in to cards with stagger effect
    document.querySelectorAll('.overview-card').forEach((card, index) => {
      card.classList.add('fade-in-hidden');
      card.style.setProperty('--animation-delay', `${index * 100}ms`);
      fadeInObserver.observe(card);
    });

    this.observers.set('fadeIn', fadeInObserver);

    // Section visibility observer for navigation
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          this.updateActiveNavLink(sectionId);
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '-20% 0px -20% 0px'
    });

    // Observe main sections
    ['hero', 'overview'].forEach(id => {
      const section = document.getElementById(id) || document.querySelector(`.${id}-section`);
      if (section) {
        if (!section.id) section.id = id;
        sectionObserver.observe(section);
      }
    });

    this.observers.set('section', sectionObserver);
  }

  // Update active navigation link
  updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${sectionId}` || 
          (sectionId === 'hero' && href === './index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  // Enhanced Keyboard Navigation
  initKeyboardNavigation() {
    // Skip links navigation
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Arrow key navigation for cards
    const cards = document.querySelectorAll('.overview-card');
    if (cards.length > 0) {
      cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
          let nextIndex = index;
          
          switch (e.key) {
            case 'ArrowRight':
            case 'ArrowDown':
              nextIndex = (index + 1) % cards.length;
              break;
            case 'ArrowLeft':
            case 'ArrowUp':
              nextIndex = (index - 1 + cards.length) % cards.length;
              break;
            case 'Enter':
            case ' ':
              e.preventDefault();
              const link = card.querySelector('.card-link');
              if (link) link.click();
              return;
            default:
              return;
          }
          
          e.preventDefault();
          cards[nextIndex].focus();
        });
      });
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + H: Go to home
      if (e.altKey && e.key === 'h') {
        e.preventDefault();
        window.location.href = './index.html';
      }
      
      // Alt + C: Go to contact
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        window.location.href = './contact.html';
      }
      
      // Alt + P: Go to projects
      if (e.altKey && e.key === 'p') {
        e.preventDefault();
        window.location.href = './projects.html';
      }
    });
  }

  // Performance Optimizations
  initPerformanceOptimizations() {
    // Preload critical resources
    this.preloadResources();
    
    // Lazy load images
    this.initLazyLoading();
    
    // Optimize animations for reduced motion
    this.handleReducedMotion();
    
    // Memory cleanup on page unload
    this.initCleanup();
  }

  preloadResources() {
    const criticalResources = [
      './CSS/main.css',
      './CSS/dark-mode.css',
      './JS/dark-mode.js'
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.endsWith('.css') ? 'style' : 'script';
      document.head.appendChild(link);
    });
  }

  initLazyLoading() {
    if ('IntersectionObserver' in window) {
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
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });

      this.observers.set('image', imageObserver);
    }
  }

  handleReducedMotion() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Disable floating shapes animation
      document.querySelectorAll('.shape').forEach(shape => {
        shape.style.animation = 'none';
      });
      
      // Reduce transition durations
      document.documentElement.style.setProperty('--transition-fast', '0.01s');
      document.documentElement.style.setProperty('--transition-normal', '0.01s');
      document.documentElement.style.setProperty('--transition-slow', '0.01s');
    }
  }

  initCleanup() {
    window.addEventListener('beforeunload', () => {
      // Cancel any running animations
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      
      // Disconnect observers
      this.observers.forEach(observer => {
        if (observer && observer.disconnect) {
          observer.disconnect();
        }
      });
      
      // Clear timers
      this.clearAllTimers();
    });
  }

  clearAllTimers() {
    // Clear any setTimeout/setInterval that might be running
    const highestTimeoutId = setTimeout(() => {});
    for (let i = 0; i < highestTimeoutId; i++) {
      clearTimeout(i);
    }
  }

  // Utility Methods
  debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }

  throttle(func, delay) {
    let timeoutId;
    let lastExecTime = 0;
    return function (...args) {
      const currentTime = Date.now();
      
      if (currentTime - lastExecTime > delay) {
        func.apply(this, args);
        lastExecTime = currentTime;
      } else {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          func.apply(this, args);
          lastExecTime = Date.now();
        }, delay - (currentTime - lastExecTime));
      }
    };
  }

  // API utility function for future backend integration
  async apiCall(endpoint, options = {}) {
    const baseURL = options.baseURL || 'http://localhost:3000/api';
    const url = `${baseURL}${endpoint}`;

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Loading state utility
  setLoadingState(element, isLoading) {
    if (!element) return;

    if (isLoading) {
      element.style.opacity = '0.6';
      element.style.pointerEvents = 'none';
      element.setAttribute('aria-busy', 'true');
      element.classList.add('loading');
    } else {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
      element.removeAttribute('aria-busy');
      element.classList.remove('loading');
    }
  }

  // Event dispatcher
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event);
  }

  // Form validation utility
  validateForm(form) {
    if (!form) return false;

    let isValid = true;
    const errors = [];

    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      const fieldError = this.validateField(input);
      if (fieldError) {
        errors.push(fieldError);
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');

    // Required field validation
    if (required && !value) {
      return { field: field.name, message: 'This field is required' };
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { field: field.name, message: 'Please enter a valid email address' };
      }
    }

    // Phone validation
    if (type === 'tel' && value) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(value)) {
        return { field: field.name, message: 'Please enter a valid phone number' };
      }
    }

    // URL validation
    if (type === 'url' && value) {
      try {
        new URL(value);
      } catch {
        return { field: field.name, message: 'Please enter a valid URL' };
      }
    }

    return null;
  }

  // Notification system
  showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-message">${message}</span>
        <button class="notification-close" aria-label="Close notification">×</button>
      </div>
    `;

    // Add styles if not already present
    if (!document.querySelector('#notification-styles')) {
      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: var(--shadow-lg);
          backdrop-filter: blur(10px);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          max-width: 400px;
        }
        .notification-info { background: rgba(59, 130, 246, 0.9); color: white; }
        .notification-success { background: rgba(16, 185, 129, 0.9); color: white; }
        .notification-warning { background: rgba(245, 158, 11, 0.9); color: white; }
        .notification-error { background: rgba(239, 68, 68, 0.9); color: white; }
        .notification.show { transform: translateX(0); }
        .notification-content { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
        .notification-close { background: none; border: none; color: inherit; font-size: 1.2rem; cursor: pointer; padding: 0; }
      `;
      document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);

    // Auto remove
    const removeNotification = () => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    };

    // Close button
    notification.querySelector('.notification-close').addEventListener('click', removeNotification);

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(removeNotification, duration);
    }

    return notification;
  }
}

// Enhanced CSS for fade-in animations
const fadeInStyles = document.createElement('style');
fadeInStyles.textContent = `
  .fade-in-hidden {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease var(--animation-delay, 0ms), 
                transform 0.6s ease var(--animation-delay, 0ms);
  }
  
  .fade-in-visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  @media (prefers-reduced-motion: reduce) {
    .fade-in-hidden {
      opacity: 1;
      transform: translateY(0);
      transition: none;
    }
  }
`;
document.head.appendChild(fadeInStyles);

// Initialize the application
const portfolioApp = new PortfolioApp();

// Global exports for external use
window.portfolioApp = portfolioApp;
window.apiCall = (endpoint, options) => portfolioApp.apiCall(endpoint, options);
window.setLoadingState = (element, isLoading) => portfolioApp.setLoadingState(element, isLoading);
window.showNotification = (message, type, duration) => portfolioApp.showNotification(message, type, duration);
window.debounce = (func, wait, immediate) => portfolioApp.debounce(func, wait, immediate);
window.throttle = (func, delay) => portfolioApp.throttle(func, delay);

// Service Worker registration for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker support detected');
    } catch (error) {
      console.log('Service Worker registration failed:', error);
    }
  });
}

// Web Share API integration
if (navigator.share) {
  window.sharePortfolio = async () => {
    try {
      await navigator.share({
        title: 'Abdallah Wageeh - Backend Developer',
        text: 'Check out my portfolio showcasing backend development skills',
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };
}

// Enhanced error handling
window.addEventListener('error', (event) => {
  console.error('JavaScript Error:', event.error);
  // You could send this to an error tracking service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
  // You could send this to an error tracking service
});

// Performance monitoring
if ('performance' in window) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log('Page Load Performance:', {
          'DOM Content Loaded': Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
          'Full Load Time': Math.round(perfData.loadEventEnd - perfData.loadEventStart),
          'First Paint': Math.round(performance.getEntriesByType('paint')[0]?.startTime || 0),
        });
      }
    }, 0);
  });
}