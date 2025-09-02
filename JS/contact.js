// Contact page specific functionality
document.addEventListener("DOMContentLoaded", () => {
  // Form elements
  const contactForm = document.getElementById("contact-form")
  const submitBtn = document.getElementById("submit-btn")
  const submitText = submitBtn.querySelector(".submit-text")
  const submitLoader = submitBtn.querySelector(".submit-loader")
  const formSuccess = document.getElementById("form-success")
  const messageTextarea = document.getElementById("message")
  const charCount = document.getElementById("char-count")

  // Form validation rules
  const validationRules = {
    firstName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: "First name must be at least 2 characters and contain only letters",
    },
    lastName: {
      required: true,
      minLength: 2,
      pattern: /^[a-zA-Z\s]+$/,
      message: "Last name must be at least 2 characters and contain only letters",
    },
    email: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Please enter a valid email address",
    },
    projectType: {
      required: true,
      message: "Please select a project type",
    },
    message: {
      required: true,
      minLength: 20,
      maxLength: 1000,
      message: "Message must be between 20 and 1000 characters",
    },
  }

  // Initialize animations
  const observerOptions = {
    threshold: 0.2,
    rootMargin: "0px 0px -50px 0px",
  }

  const formObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate")
        formObserver.unobserve(entry.target)
      }
    })
  }, observerOptions)

  document.querySelectorAll(".contact-form-container, .contact-info-container").forEach((element) => {
    formObserver.observe(element)
  })

  // Character counter for message textarea
  if (messageTextarea && charCount) {
    messageTextarea.addEventListener("input", function () {
      const length = this.value.length
      charCount.textContent = length

      const charCountElement = charCount.parentElement
      charCountElement.classList.remove("warning", "error")

      if (length > 800) {
        charCountElement.classList.add("warning")
      }
      if (length > 1000) {
        charCountElement.classList.add("error")
      }
    })
  }

  // Real-time validation
  function validateField(fieldName, value) {
    const rules = validationRules[fieldName]
    if (!rules) return { isValid: true }

    const errors = []

    // Required validation
    if (rules.required && (!value || value.trim() === "")) {
      errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`)
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === "") {
      return { isValid: errors.length === 0, errors }
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`Minimum ${rules.minLength} characters required`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`Maximum ${rules.maxLength} characters allowed`)
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || "Invalid format")
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    }
  }

  // Show field error
  function showFieldError(fieldName, errors) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}-error`)

    if (field && errorElement) {
      field.classList.add("error")
      field.classList.remove("success")
      errorElement.textContent = errors[0] || ""
      errorElement.classList.add("show")

      // Add shake animation
      field.classList.add("shake")
      setTimeout(() => field.classList.remove("shake"), 500)
    }
  }

  // Show field success
  function showFieldSuccess(fieldName) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}-error`)

    if (field && errorElement) {
      field.classList.remove("error")
      field.classList.add("success")
      errorElement.classList.remove("show")
    }
  }

  // Clear field validation
  function clearFieldValidation(fieldName) {
    const field = document.getElementById(fieldName)
    const errorElement = document.getElementById(`${fieldName}-error`)

    if (field && errorElement) {
      field.classList.remove("error", "success")
      errorElement.classList.remove("show")
    }
  }

  // Add real-time validation to form fields
  Object.keys(validationRules).forEach((fieldName) => {
    const field = document.getElementById(fieldName)
    if (field) {
      // Validate on blur
      field.addEventListener("blur", function () {
        const validation = validateField(fieldName, this.value)
        if (validation.isValid) {
          showFieldSuccess(fieldName)
        } else {
          showFieldError(fieldName, validation.errors)
        }
      })

      // Clear validation on focus
      field.addEventListener("focus", () => {
        clearFieldValidation(fieldName)
      })

      // Real-time validation for certain fields
      if (fieldName === "email" || fieldName === "message") {
        let timeout
        field.addEventListener("input", function () {
          clearTimeout(timeout)
          timeout = setTimeout(() => {
            const validation = validateField(fieldName, this.value)
            if (this.value.length > 0) {
              if (validation.isValid) {
                showFieldSuccess(fieldName)
              } else {
                showFieldError(fieldName, validation.errors)
              }
            }
          }, 500)
        })
      }
    }
  })

  // Form submission
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault()

      // Collect form data
      const formData = new FormData(this)
      const data = Object.fromEntries(formData.entries())

      // Validate all fields
      let isFormValid = true
      const validationErrors = {}

      Object.keys(validationRules).forEach((fieldName) => {
        const validation = validateField(fieldName, data[fieldName] || "")
        if (!validation.isValid) {
          isFormValid = false
          validationErrors[fieldName] = validation.errors
          showFieldError(fieldName, validation.errors)
        } else {
          showFieldSuccess(fieldName)
        }
      })

      if (!isFormValid) {
        // Scroll to first error
        const firstErrorField = Object.keys(validationErrors)[0]
        const firstErrorElement = document.getElementById(firstErrorField)
        if (firstErrorElement) {
          firstErrorElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
          firstErrorElement.focus()
        }
        return
      }

      // Show loading state
      submitBtn.disabled = true
      submitText.style.opacity = "0"
      submitLoader.style.display = "block"

      try {
        // Simulate API call (replace with actual endpoint)
        await simulateFormSubmission(data)

        // Show success message
        contactForm.style.display = "none"
        formSuccess.style.display = "block"

        // Scroll to success message
        formSuccess.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })

        // Track form submission (replace with your analytics)
        console.log("[Analytics] Contact form submitted:", {
          projectType: data.projectType,
          budget: data.budget,
          timeline: data.timeline,
          hasCompany: !!data.company,
          messageLength: data.message.length,
        })
      } catch (error) {
        console.error("Form submission error:", error)

        // Show error message
        alert("Sorry, there was an error sending your message. Please try again or contact me directly via email.")
      } finally {
        // Reset loading state
        submitBtn.disabled = false
        submitText.style.opacity = "1"
        submitLoader.style.display = "none"
      }
    })
  }

  // Simulate form submission (replace with actual API call)
  async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success (90% of the time)
        if (Math.random() > 0.1) {
          resolve({ success: true, message: "Message sent successfully!" })
        } else {
          reject(new Error("Network error"))
        }
      }, 2000)
    })
  }

  // Actual API integration function (ready to use)
  async function submitContactForm(data) {
    const apiEndpoint = "/api/contact" // Replace with your API endpoint

    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API submission error:", error)
      throw error
    }
  }

  // Enhanced form interactions
  const formInputs = document.querySelectorAll(".form-input, .form-select, .form-textarea")
  formInputs.forEach((input) => {
    // Add floating label effect
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused")
      }
    })

    // Check if field has value on load
    if (input.value) {
      input.parentElement.classList.add("focused")
    }
  })

  // Social link click tracking
  document.querySelectorAll(".social-link").forEach((link) => {
    link.addEventListener("click", function (e) {
      const platform = this.querySelector(".social-text").textContent
      console.log(`[Analytics] Social link clicked: ${platform}`)
    })
  })

  // Contact method click tracking
  document.querySelectorAll(".contact-method").forEach((method) => {
    method.addEventListener("click", function () {
      const methodType = this.querySelector(".method-title").textContent
      const methodValue = this.querySelector(".method-text").textContent

      console.log(`[Analytics] Contact method clicked: ${methodType} - ${methodValue}`)

      // Auto-copy email or phone to clipboard
      if (methodType === "Email" || methodType === "Phone") {
        navigator.clipboard
          .writeText(methodValue)
          .then(() => {
            // Show temporary feedback
            const originalText = this.querySelector(".method-text").textContent
            this.querySelector(".method-text").textContent = "Copied!"
            this.classList.add("copied")

            setTimeout(() => {
              this.querySelector(".method-text").textContent = originalText
              this.classList.remove("copied")
            }, 2000)
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard:", err)
          })
      }
    })
  })

  // Initialize dark mode for contact page
  const initializeDarkMode = () => {
    // Placeholder for dark mode initialization logic
    console.log("Dark mode initialized")
  }

  if (typeof initializeDarkMode === "function") {
    initializeDarkMode()
  }
})
