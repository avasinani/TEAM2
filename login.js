document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("errorMessage");

    // Simple hardcoded credentials for demonstration purposes
    const validUsername = "XanderBrus";
    const validPassword = "password";
    if (username === validUsername && password === validPassword) {
      // Store username in sessionStorage
      sessionStorage.setItem("loggedInUser", username);
      window.location.href = "index.html"; // Redirect to the homepage
    } else {
      errorMessage.textContent = "Invalid username or password.";
    }
  });
