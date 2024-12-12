// Set the current year
function setCurrentYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}

// Load capabilities for the quote form
function loadCapabilities() {
    const capabilitySelect = document.getElementById('capability');
    if (!capabilitySelect) return;

    fetch('/api/capabilities')
        .then(response => response.json())
        .then(capabilities => {
            capabilities.forEach(cap => {
                const option = document.createElement('option');
                option.value = cap.id;
                option.textContent = cap.name;
                capabilitySelect.appendChild(option);
            });
        })
        .catch(err => console.error('Error loading capabilities:', err));
}

// Load flavor categories for Flavors page and submenu
function loadFlavorCategories() {
    fetch('/categories')
        .then(response => response.json())
        .then(categories => {
            const flavorMenu = document.getElementById('flavor-categories');
            const categoriesContainer = document.getElementById('categories');
            categories.forEach(category => {
                // Populate flavor submenu if it exists
                if (flavorMenu) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="/flavors/${category.id}">${category.name}</a>`;
                    flavorMenu.appendChild(li);
                }

                // Populate categories container if on flavors page
                if (categoriesContainer && categoriesContainer.classList.contains('categories-container')) {
                    const div = document.createElement('div');
                    div.className = 'category-card';
                    div.innerHTML = `
                        <img src="images/slider/sample.jpg" alt="${category.name}">
                        <a href="/flavors/${category.id}"><h3>${category.name}</h3></a>
                    `;
                    categoriesContainer.appendChild(div);
                }
            });
        })
        .catch(err => console.error('Error loading categories:', err));
}

// Load flavors for category page
function loadCategoryFlavors() {
    const flavorList = document.getElementById('flavors');
    if (!flavorList) return; // Only execute if on category page

    const categoryId = window.location.pathname.split('/').pop();
    fetch(`/categories/${categoryId}/flavors`)
        .then(response => response.json())
        .then(flavors => {
            const ul = document.createElement('ul');
            ul.classList.add('flavor-list');
            flavors.forEach(flavor => {
                const li = document.createElement('li');
                li.textContent = flavor.name.replace(/^"|"$/g, ''); // Remove stray quotes
                ul.appendChild(li);
            });
            flavorList.appendChild(ul);
        })
        .catch(err => console.error('Error loading flavors:', err));
}

// Slider functionality
let slideIndex = 1;

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

function initSlider() {
    const requestedSlide = getQueryParam('slide');
    if (requestedSlide) {
        slideIndex = parseInt(requestedSlide, 10);
    }
    showSlides(slideIndex);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return;

    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

// Initialize scripts
document.addEventListener('DOMContentLoaded', () => {
    setCurrentYear();
    loadCapabilities();
    loadFlavorCategories();
    loadCategoryFlavors();
    initSlider();
});
