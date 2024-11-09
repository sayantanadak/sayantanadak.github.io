window.onload = function () {
    document.getElementById("skills").click();
};

// Function to load content and set active link
function loadContent(pageId, activeId) {
    fetch(`/pages/${pageId}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("contentArea").innerHTML = data;
            setActive(activeId);
        })
        .catch(error => console.error('Error loading the HTML:', error));
}

// Function to set the active class on the clicked link
function setActive(activeId) {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        if (link.id === activeId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Function to add event listener and collapse navbar
function addNavListener(elementId, pageId) {
    document.getElementById(elementId).addEventListener("click", function () {
        loadContent(pageId, elementId);
        if (window.innerWidth < 992) { // Check if the view is mobile
            var navbarCollapse = new bootstrap.Collapse(document.getElementById('navbarCollapse'), {
                toggle: true
            });
        }
    });
}

// Add event listeners for navigation links
addNavListener("aboutMe", "about_me");
addNavListener("skills", "skills");
addNavListener("workplace", "workplace");
addNavListener("projects", "projects");
addNavListener("blogs", "blogs");