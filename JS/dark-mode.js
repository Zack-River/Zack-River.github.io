// Dark Mode Toggle System
class DarkModeManager {
  constructor() {
    this.theme = this.getStoredTheme() || this.getSystemTheme()
    this.toggleButton = null
    this.init()
  }

  init() {
    // Apply theme immediately to prevent flash
    this.applyTheme(this.theme)

    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setupToggle())
    } else {
      this.setupToggle()
    }

    // Listen for system theme changes
    this.watchSystemTheme()
  }

  getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }

  getStoredTheme() {
    try {
      return localStorage.getItem("theme")
    } catch (error) {
      console.warn("Unable to access localStorage for theme:", error)
      return null
    }
  }

  setStoredTheme(theme) {
    try {
      localStorage.setItem("theme", theme)
    } catch (error) {
      console.warn("Unable to save theme to localStorage:", error)
    }
  }

  applyTheme(theme) {
    // Disable transitions temporarily to prevent flash
    document.documentElement.classList.add("theme-transition-disable")

    // Apply theme
    document.documentElement.setAttribute("data-theme", theme)

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(theme)

    // Re-enable transitions after a brief delay
    setTimeout(() => {
      document.documentElement.classList.remove("theme-transition-disable")
    }, 50)

    this.theme = theme
    this.setStoredTheme(theme)

    // Dispatch custom event for other components
    window.dispatchEvent(
      new CustomEvent("themeChanged", {
        detail: { theme },
      }),
    )

    // Analytics tracking
    this.trackThemeChange(theme)
  }

  updateMetaThemeColor(theme) {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", theme === "dark" ? "#0f172a" : "#ffffff")
    }
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark"
    this.applyTheme(newTheme)

    // Add a subtle animation to the toggle button
    if (this.toggleButton) {
      this.toggleButton.style.transform = "scale(0.95)"
      setTimeout(() => {
        this.toggleButton.style.transform = "scale(1)"
      }, 150)
    }
  }

  setupToggle() {
    // Create toggle button if it doesn't exist
    if (!document.querySelector(".dark-mode-toggle")) {
      this.createToggleButton()
    }

    this.toggleButton = document.querySelector(".dark-mode-toggle")

    if (this.toggleButton) {
      // Remove existing listeners to prevent duplicates
      this.toggleButton.removeEventListener("click", this.handleToggleClick)

      // Add click listener
      this.handleToggleClick = () => this.toggleTheme()
      this.toggleButton.addEventListener("click", this.handleToggleClick)

      // Add keyboard support
      this.toggleButton.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          this.toggleTheme()
        }
      })

      // Update button state
      this.updateToggleButton()
    }
  }

  createToggleButton() {
    const toggle = document.createElement("button")
    toggle.className = "dark-mode-toggle"
    toggle.setAttribute("aria-label", "Toggle dark mode")
    toggle.setAttribute("title", "Toggle dark mode")
    toggle.innerHTML = `
      <span class="toggle-icon sun-icon">☀️</span>
      <span class="toggle-icon moon-icon">🌙</span>
    `

    document.body.appendChild(toggle)
  }

  updateToggleButton() {
    if (this.toggleButton) {
      const isDark = this.theme === "dark"
      this.toggleButton.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode")
      this.toggleButton.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode")
    }
  }

  watchSystemTheme() {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    const handleSystemThemeChange = (e) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!this.getStoredTheme()) {
        this.applyTheme(e.matches ? "dark" : "light")
        this.updateToggleButton()
      }
    }

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemThemeChange)
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemThemeChange)
    }
  }

  trackThemeChange(theme) {
    // Analytics tracking (replace with your analytics service)
    // Declare gtag variable here or import it from your analytics service
    const gtag = window.gtag // Assuming gtag is available globally
    if (typeof gtag !== "undefined") {
      gtag("event", "theme_change", {
        theme: theme,
        timestamp: new Date().toISOString(),
      })
    }

    // Console logging for development
    console.log(`[Theme] Switched to ${theme} mode`)
  }

  // Public API methods
  getCurrentTheme() {
    return this.theme
  }

  setTheme(theme) {
    if (theme === "dark" || theme === "light") {
      this.applyTheme(theme)
      this.updateToggleButton()
    }
  }

  // Utility method to check if dark mode is active
  isDarkMode() {
    return this.theme === "dark"
  }

  // Method to reset to system preference
  resetToSystemTheme() {
    try {
      localStorage.removeItem("theme")
    } catch (error) {
      console.warn("Unable to remove theme from localStorage:", error)
    }

    const systemTheme = this.getSystemTheme()
    this.applyTheme(systemTheme)
    this.updateToggleButton()
  }
}

// Initialize dark mode manager
const darkModeManager = new DarkModeManager()

// Export for use in other scripts
window.darkModeManager = darkModeManager

// Expose utility functions globally
window.toggleDarkMode = () => darkModeManager.toggleTheme()
window.setTheme = (theme) => darkModeManager.setTheme(theme)
window.getCurrentTheme = () => darkModeManager.getCurrentTheme()
window.isDarkMode = () => darkModeManager.isDarkMode()

// Handle page visibility changes to sync theme across tabs
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    const storedTheme = darkModeManager.getStoredTheme()
    if (storedTheme && storedTheme !== darkModeManager.getCurrentTheme()) {
      darkModeManager.setTheme(storedTheme)
    }
  }
})

// Listen for storage changes from other tabs
window.addEventListener("storage", (e) => {
  if (e.key === "theme" && e.newValue) {
    darkModeManager.setTheme(e.newValue)
  }
})

// Keyboard shortcut for theme toggle (Ctrl/Cmd + Shift + D)
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "D") {
    e.preventDefault()
    darkModeManager.toggleTheme()
  }
})

// Initialize theme-aware components
document.addEventListener("DOMContentLoaded", () => {
  // Update any theme-dependent elements
  const themeElements = document.querySelectorAll("[data-theme-element]")
  themeElements.forEach((element) => {
    const themeClass = element.dataset.themeElement
    if (darkModeManager.isDarkMode()) {
      element.classList.add(`${themeClass}-dark`)
    } else {
      element.classList.add(`${themeClass}-light`)
    }
  })
})

// Listen for theme changes to update theme-dependent elements
window.addEventListener("themeChanged", (e) => {
  const { theme } = e.detail
  const themeElements = document.querySelectorAll("[data-theme-element]")

  themeElements.forEach((element) => {
    const themeClass = element.dataset.themeElement
    element.classList.remove(`${themeClass}-dark`, `${themeClass}-light`)
    element.classList.add(`${themeClass}-${theme}`)
  })
})
