window.onload = function () {
    document.getElementById("aboutMe").click();
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

// Event listeners for navigation links
document.getElementById("aboutMe").addEventListener("click", function () {
    loadContent('about_me', 'aboutMe');
});

document.getElementById("skills").addEventListener("click", function () {
    loadContent('skills', 'skills');
});

document.getElementById("workplace").addEventListener("click", function () {
    loadContent('workplace', 'workplace');
});

document.getElementById("projects").addEventListener("click", function () {
    loadContent('projects', 'projects');
});

document.getElementById("blogs").addEventListener("click", function () {
    loadContent('blogs', 'blogs');
});
