document.addEventListener("DOMContentLoaded", function () {
  // Find or create elements
  const menuIcon = document.querySelector(".bi-list");
  const navMenu = document.querySelector("nav");
  const header = document.querySelector("header");
  let currentLang = localStorage.getItem("language") || "nl";

  // Initial language setup - must be first for translation to work properly
  updateLanguage(currentLang);

  // Toggle mobile menu
  if (menuIcon) {
    menuIcon.addEventListener("click", function () {
      navMenu.classList.toggle("visible");
    });
  }

  // Close menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !e.target.closest("header") ||
      e.target.classList.contains("lang-switch")
    ) {
      navMenu.classList.remove("visible");
    }
  });

  // Fix header on scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 10) {
      header.style.padding = "0.3rem 0";
    } else {
      header.style.padding = "0.5rem 0";
    }
  });

  // Add click event to language button
  const langSwitchBtn = document.querySelector(".lang-switch");
  if (langSwitchBtn) {
    langSwitchBtn.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event from bubbling
      const newLang = currentLang === "nl" ? "en" : "nl";
      updateLanguage(newLang);
    });
  }

  // Language switching functionality
  function updateLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    // Update all elements with data-translate attribute
    document.querySelectorAll("[data-translate]").forEach((element) => {
      const key = element.getAttribute("data-translate");
      if (translations && translations[lang] && translations[lang][key]) {
        if (element.tagName === "A" || element.tagName === "BUTTON") {
          element.textContent = translations[lang][key];
        } else {
          element.innerHTML = translations[lang][key];
        }
      }
    });

    // Update language button text
    const langBtn = document.querySelector(".lang-switch");
    if (langBtn) {
      langBtn.textContent = lang.toUpperCase();
    }
  }
});
