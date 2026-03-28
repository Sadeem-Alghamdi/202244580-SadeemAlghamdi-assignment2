const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

/* greeting */
function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById("greeting");

    if (hour < 12) {
        greetingEl.textContent = "Good Morning ☀️";
    } else if (hour < 18) {
        greetingEl.textContent = "Good Afternoon 👋";
    } else {
        greetingEl.textContent = "Good Evening 🌙";
    }
}
updateGreeting();

/* theme */
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
const html = document.documentElement;

function updateThemeIcon(theme) {
    if (theme === "dark") {
        themeIcon.classList.remove("fa-moon");
        themeIcon.classList.add("fa-sun");
    } else {
        themeIcon.classList.remove("fa-sun");
        themeIcon.classList.add("fa-moon");
    }
}

const savedTheme = localStorage.getItem("theme") || "dark";
html.setAttribute("data-theme", savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener("click", function () {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
});

/* mobile nav */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

menuToggle.addEventListener("click", function () {
    navMenu.classList.toggle("active");

    const icon = menuToggle.querySelector("i");
    if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        const icon = menuToggle.querySelector("i");
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});

/* smooth anchor scroll */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
        const targetId = this.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

/* scroll progress */
const progressBar = document.getElementById("progressBar");

function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = `${progress}%`;
}
window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

/* personalized greeting */
const visitorNameInput = document.getElementById("visitorName");
const saveNameBtn = document.getElementById("saveNameBtn");
const personalGreeting = document.getElementById("personalGreeting");

function renderSavedName() {
    const savedName = localStorage.getItem("visitorName");
    if (savedName) {
        personalGreeting.textContent = `Welcome back, ${savedName}!`;
    } else {
        personalGreeting.textContent = "Save your name to personalize this portfolio.";
    }
}
renderSavedName();

saveNameBtn.addEventListener("click", function () {
    const nameValue = visitorNameInput.value.trim();

    if (!nameValue) {
        personalGreeting.textContent = "Please enter your name before saving.";
        return;
    }

    localStorage.setItem("visitorName", nameValue);
    personalGreeting.textContent = `Welcome back, ${nameValue}!`;
    visitorNameInput.value = "";
});

/* counter animation */
const counters = document.querySelectorAll(".counter");
let countersStarted = false;

function startCounters() {
    if (countersStarted) return;
    countersStarted = true;

    counters.forEach((counter) => {
        const target = Number(counter.dataset.target);
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 30));

        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(interval);
            } else {
                counter.textContent = current;
            }
        }, 40);
    });
}

/* reveal on scroll */
const revealSections = document.querySelectorAll(".section");
revealSections.forEach((section) => section.classList.add("reveal"));

function revealOnScroll() {
    revealSections.forEach((section, index) => {
        const top = section.getBoundingClientRect().top;
        const visiblePoint = window.innerHeight - 110;

        if (top < visiblePoint) {
            section.classList.add("visible");
            if (index === 0) startCounters();
        }
    });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

/* project search + filter */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const projectSearch = document.getElementById("projectSearch");
const emptyMessage = document.getElementById("emptyMessage");

let activeFilter = "all";

function updateProjects() {
    const searchValue = projectSearch.value.toLowerCase().trim();
    let visibleCount = 0;

    projectCards.forEach((card) => {
        const category = card.dataset.category;
        const title = card.dataset.title.toLowerCase();
        const keywords = card.dataset.keywords.toLowerCase();

        const matchesFilter = activeFilter === "all" || category === activeFilter;
        const matchesSearch =
            title.includes(searchValue) || keywords.includes(searchValue);

        if (matchesFilter && matchesSearch) {
            card.classList.remove("hidden");
            visibleCount++;
        } else {
            card.classList.add("hidden");
        }
    });

    emptyMessage.textContent =
        visibleCount === 0
            ? "No projects found. Try another keyword or category."
            : "";
}

filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
        activeFilter = this.dataset.filter;

        filterButtons.forEach((btn) => btn.classList.remove("active"));
        this.classList.add("active");

        updateProjects();
    });
});

projectSearch.addEventListener("input", updateProjects);
updateProjects();

/* favorite project localStorage */
const favoriteMessage = document.getElementById("favoriteMessage");
const favoriteButtons = document.querySelectorAll(".favorite-btn");

function renderFavoriteState() {
    const savedFavorite = localStorage.getItem("favoriteProject");

    favoriteButtons.forEach((button) => {
        const card = button.closest(".project-card");
        const projectName = card.dataset.project;
        const icon = button.querySelector("i");

        if (savedFavorite === projectName) {
            button.classList.add("saved");
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
        } else {
            button.classList.remove("saved");
            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");
        }
    });

    if (savedFavorite) {
        favoriteMessage.textContent = `Favorite project saved: ${savedFavorite}`;
    } else {
        favoriteMessage.textContent = "You have not selected a favorite project yet.";
    }
}

favoriteButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const card = this.closest(".project-card");
        const projectName = card.dataset.project;
        const currentFavorite = localStorage.getItem("favoriteProject");

        if (currentFavorite === projectName) {
            localStorage.removeItem("favoriteProject");
        } else {
            localStorage.setItem("favoriteProject", projectName);
        }

        renderFavoriteState();
    });
});

renderFavoriteState();

/* modal */
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalIcon = document.getElementById("modalIcon");

document.querySelectorAll(".open-modal-btn").forEach((button) => {
    button.addEventListener("click", function () {
        const card = this.closest(".project-card");
        const title = card.dataset.project;
        const description = card.dataset.description;
        const iconHTML = card.querySelector(".project-icon").innerHTML;

        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalIcon.innerHTML = iconHTML;

        modalOverlay.classList.add("active");
    });
});

function closeModal() {
    modalOverlay.classList.remove("active");
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
});

/* tabs */
const tabButtons = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
    button.addEventListener("click", function () {
        const selectedTab = this.dataset.tab;

        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        this.classList.add("active");
        document.getElementById(selectedTab).classList.add("active");
    });
});

/* contact form */
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");

contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
        formMessage.textContent = "❌ Please fill in all fields.";
        formMessage.style.color = "#f87171";
        return;
    }

    if (!emailPattern.test(email)) {
        formMessage.textContent = "❌ Please enter a valid email address.";
        formMessage.style.color = "#f87171";
        return;
    }

    formMessage.textContent = "✅ Thank you! Your message has been received.";
    formMessage.style.color = "#4ade80";
    contactForm.reset();

    setTimeout(() => {
        formMessage.textContent = "";
    }, 4500);
});