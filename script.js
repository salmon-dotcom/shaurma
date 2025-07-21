document.addEventListener('DOMContentLoaded', () => {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;

    // Load saved theme from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlEl.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        htmlEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- DYNAMIC MENU LOADING ---
    const menuContainer = document.getElementById('menu-container');
    const categoryTitles = {
        shawarma: '🍗 Шаурма',
        coffee: '☕ Кофе',
        drinks: '🧋 Напитки',
        snacks: '🍟 Закуски'
    };

    const createMenuItemHTML = (item) => `
        <div class="menu-item fade-in">
            <img src="${item.image}" alt="${item.name}" class="menu-item-image" loading="lazy">
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <div class="menu-item-footer">
                    <span class="price">${item.price}</span>
                    <a href="https://wa.me/79774302007?text=Здравствуйте!%20Хочу%20заказать:%20${encodeURIComponent(item.name)}" target="_blank" class="btn btn-secondary">Заказать</a>
                </div>
            </div>
        </div>
    `;

    fetch('menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            for (const category in data) {
                if (data[category].length > 0) {
                    const categorySection = document.createElement('div');
                    categorySection.className = 'menu-category';
                    
                    const title = document.createElement('h3');
                    title.className = 'menu-category-title fade-in';
                    title.textContent = categoryTitles[category] || category;
                    categorySection.appendChild(title);

                    const grid = document.createElement('div');
                    grid.className = 'menu-grid';
                    
                    data[category].forEach(item => {
                        grid.innerHTML += createMenuItemHTML(item);
                    });

                    categorySection.appendChild(grid);
                    menuContainer.appendChild(categorySection);
                }
            }
            // Re-initialize observer after adding new dynamic elements
            setupScrollAnimations();
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            menuContainer.innerHTML = '<p style="text-align: center; color: var(--accent-hot);">Не удалось загрузить меню. Пожалуйста, попробуйте обновить страницу.</p>';
        });


    // --- SCROLL ANIMATIONS (Intersection Observer) ---
    const setupScrollAnimations = () => {
        const fadeInElements = document.querySelectorAll('.fade-in');

        const observerOptions = {
            root: null, // relative to the viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of the item must be visible
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible for performance
                }
            });
        }, observerOptions);

        fadeInElements.forEach(el => {
            observer.observe(el);
        });
    };
    
    // Initial setup for static elements already on page
    setupScrollAnimations();
});
