// Main JavaScript functionality
document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Navbar scroll effect
  const navbar = document.getElementById("navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }

      // Ensure theme stays applied
      const theme = darkModeManager.getCurrentTheme();
      navbar.classList.remove("navbar-light", "navbar-dark");
      navbar.classList.add(`navbar-${theme}`);
    });
  }

  // Animated counter for stats
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
  const observerOptions = {
    threshold: 0.5,
    rootMargin: "0px 0px -100px 0px",
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll(".stat-number").forEach((counter) => {
    counterObserver.observe(counter);
  });

  // Code animation in hero section
  const codeLines = [
    "const express = require('express');",
    "const app = express();",
    "",
    "app.use(express.json());",
    "",
    "app.get('/api/users', async (req, res) => {",
    "  try {",
    "    const users = await User.findAll();",
    "    res.json({ success: true, data: users });",
    "  } catch (error) {",
    "    res.status(500).json({ error: error.message });",
    "  }",
    "});",
    "",
    "app.listen(3000, () => {",
    "  console.log('Server running on port 3000');",
    "});",
  ];

  function typeCode() {
    const codeElement = document.querySelector("#code-animation code");
    if (!codeElement) return;

    let lineIndex = 0;
    let charIndex = 0;
    let currentText = "";

    function typeNextChar() {
      if (lineIndex < codeLines.length) {
        if (charIndex < codeLines[lineIndex].length) {
          currentText += codeLines[lineIndex][charIndex];
          charIndex++;
        } else {
          currentText += "\n";
          lineIndex++;
          charIndex = 0;
        }

        codeElement.textContent = currentText;

        // Variable typing speed for more natural feel
        const delay = Math.random() * 50 + 30;
        setTimeout(typeNextChar, delay);
      } else {
        // Restart animation after a pause
        setTimeout(() => {
          currentText = "";
          lineIndex = 0;
          charIndex = 0;
          typeCode();
        }, 3000);
      }
    }

    typeNextChar();
  }

  // Start code animation
  setTimeout(typeCode, 1000);

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Add scroll-triggered animations
  const fadeInObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  // Apply fade-in animation to cards
  document.querySelectorAll(".overview-card").forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";
    card.style.transition = `opacity 0.6s ease ${
      index * 0.2
    }s, transform 0.6s ease ${index * 0.2}s`;
    fadeInObserver.observe(card);
  });

  // Utility function for API calls (ready for backend integration)
  window.apiCall = async function (endpoint, options = {}) {
    const baseURL = "http://localhost:3000/api"; // Update with your API URL

    try {
      const response = await fetch(`${baseURL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  // Loading state utility
  window.setLoadingState = function (element, isLoading) {
    if (isLoading) {
      element.style.opacity = "0.6";
      element.style.pointerEvents = "none";
      element.setAttribute("aria-busy", "true");
    } else {
      element.style.opacity = "1";
      element.style.pointerEvents = "auto";
      element.removeAttribute("aria-busy");
    }
  };
});

// Debounced scroll handler for performance
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

// Export for use in other files
window.debounce = debounce;
