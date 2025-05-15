document.addEventListener("DOMContentLoaded", function () {
  // Contact form handling
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get current language
      const currentLang = localStorage.getItem("language") || "nl";

      // Get form values
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;

      // Normally you would send this data to a server
      // For now, we'll just show a success message

      // Clear the form
      contactForm.reset();

      // Show success message
      const formContainer = document.querySelector(".contact-form");
      const successMessage = document.createElement("div");
      successMessage.className = "success-message";

      // Add translated success message
      if (
        translations &&
        translations[currentLang] &&
        translations[currentLang].successMessage
      ) {
        successMessage.textContent = translations[currentLang].successMessage;
      } else {
        // Fallback if translations not available
        if (currentLang === "nl") {
          successMessage.textContent =
            "Bericht succesvol verzonden. We nemen zo snel mogelijk contact met je op!";
        } else {
          successMessage.textContent =
            "Message sent successfully. We will contact you as soon as possible!";
        }
      }

      // Replace form with success message
      formContainer.innerHTML = "";
      formContainer.appendChild(successMessage);

      // Scroll to the success message
      successMessage.scrollIntoView({ behavior: "smooth" });
    });
  }
});
