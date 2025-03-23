document.addEventListener("DOMContentLoaded", function() {
    const menuIcon = document.querySelector(".bi-list");
    const navMenu = document.querySelector("nav");
    const mainPadding = document.querySelector('main');
    
    function adjustPadding() {
        if (window.innerWidth <= 600) {
            if (!navMenu.classList.contains("hidden")) {
                mainPadding.style.paddingTop = "350px";
            } else {
                mainPadding.style.paddingTop = "125px";
            }
        } else {
            mainPadding.style.paddingTop = "250px";
        }
    }

    adjustPadding();

    window.addEventListener("resize", adjustPadding);

    menuIcon.addEventListener("click", function() {
        navMenu.classList.toggle("hidden");
        adjustPadding();
    });
});
