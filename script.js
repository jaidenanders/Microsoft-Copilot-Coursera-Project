/**
 * Developer Portfolio Interactive Script
 * Handles responsive navigation, smooth scrolling, category filtering,
 * modal lightbox image viewing, and real-time accessible form validation.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSmoothScroll();
  initProjectFilters();
  initLightbox();
  initFormValidation();
  console.log("Portfolio interactive features initialized successfully.");
});

/* ==========================================================================
   Mobile Menu & Smooth Scrolling
   ========================================================================== */

function initMobileMenu() {
  const toggleBtn = document.getElementById("menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!toggleBtn || !navLinks) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("nav-open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
        targetElement.focus({ preventScroll: true });
      }
    });
  });
}

/* ==========================================================================
   Section Interactivity - Filter Projects & Lightbox Modal
   ========================================================================== */

function initProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedCategory = button.getAttribute("data-filter");

      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");
        if (selectedCategory === "all" || cardCategory === selectedCategory) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

function initLightbox() {
  const projectImages = document.querySelectorAll(".project-card figure img");
  if (!projectImages.length) return;

  const modal = document.createElement("div");
  modal.className = "lightbox-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-label", "Image Preview");

  const modalImg = document.createElement("img");
  modalImg.className = "lightbox-content";

  const closeBtn = document.createElement("button");
  closeBtn.className = "lightbox-close";
  closeBtn.setAttribute("aria-label", "Close modal");
  closeBtn.innerHTML = "&times;";

  modal.appendChild(closeBtn);
  modal.appendChild(modalImg);
  document.body.appendChild(modal);

  function openLightbox(src, alt) {
    modalImg.src = src;
    modalImg.alt = alt;
    modal.classList.add("active");
    closeBtn.focus();
  }

  function closeLightbox() {
    modal.classList.remove("active");
  }

  projectImages.forEach((img) => {
    img.style.cursor = "zoom-in";
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.setAttribute("aria-label", `Enlarge image: ${img.alt}`);

    img.addEventListener("click", () => openLightbox(img.src, img.alt));
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(img.src, img.alt);
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/* ==========================================================================
   Form Validation with Real-Time Feedback
   ========================================================================== */

function initFormValidation() {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  const fields = {
    name: document.getElementById("full-name"),
    email: document.getElementById("email-address"),
    message: document.getElementById("message")
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(input) {
    const group = input.closest(".form-group");
    let errorSpan = group.querySelector(".error-message");
    let isValid = true;
    let errorText = "";

    const value = input.value.trim();

    if (input === fields.name && value.length < 2) {
      isValid = false;
      errorText = "Please enter your name (at least 2 characters).";
    } else if (input === fields.email && !emailRegex.test(value)) {
      isValid = false;
      errorText = "Please enter a valid email address.";
    } else if (input === fields.message && value.length < 10) {
      isValid = false;
      errorText = "Message must be at least 10 characters long.";
    }

    if (!isValid) {
      group.classList.add("has-error");
      if (!errorSpan) {
        errorSpan = document.createElement("span");
        errorSpan.className = "error-message";
        errorSpan.id = `${input.id}-error`;
        errorSpan.setAttribute("role", "alert");
        group.appendChild(errorSpan);
        input.setAttribute("aria-describedby", errorSpan.id);
      }
      errorSpan.textContent = errorText;
      input.setAttribute("aria-invalid", "true");
    } else {
      group.classList.remove("has-error");
      if (errorSpan) {
        errorSpan.remove();
        input.removeAttribute("aria-describedby");
      }
      input.setAttribute("aria-invalid", "false");
    }

    return isValid;
  }

  Object.values(fields).forEach((input) => {
    if (!input) return;
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (input.closest(".form-group").classList.contains("has-error")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let formIsValid = true;
    let firstInvalidField = null;

    Object.values(fields).forEach((input) => {
      if (input) {
        const valid = validateField(input);
        if (!valid) {
          formIsValid = false;
          if (!firstInvalidField) firstInvalidField = input;
        }
      }
    });

    if (!formIsValid) {
      if (firstInvalidField) firstInvalidField.focus();
      return;
    }

    let successBanner = form.querySelector(".form-success-banner");
    if (!successBanner) {
      successBanner = document.createElement("div");
      successBanner.className = "form-success-banner";
      successBanner.setAttribute("role", "status");
      form.prepend(successBanner);
    }
    successBanner.textContent = "Thank you! Your message has been sent successfully.";

    form.reset();
    Object.values(fields).forEach((input) => {
      if (input) input.removeAttribute("aria-invalid");
    });
  });
}