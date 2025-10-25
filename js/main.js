/*
 * My AI App - Main JavaScript
 * Handles:
 * 1. Theme (Dark/Light) logic
 * 2. Loading the navbar component
 * 3. Making the navbar interactive (menus, active links)
 */

// --- 1. Theme Logic ---------------------------------------------------------

/**
 * Toggles the theme between 'light' and 'dark' and saves it.
 */
function toggleTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme();
}

/**
 * Applies the saved theme to the <html> tag and updates button icons.
 */
function applyTheme() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Select *all* theme toggle buttons (desktop and mobile)
    const themeToggleBtns = [
        document.getElementById('theme-toggle-btn'),
        document.getElementById('theme-toggle-btn-mobile')
    ];

    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    themeToggleBtns.forEach(btn => {
        if (!btn) return; // Skip if the button isn't on the page

        // Find icons within this specific button
        const moonIcon = btn.querySelector('ion-icon[name="moon-outline"]');
        const sunIcon = btn.querySelector('ion-icon[name="sunny-outline"]');

        if (!moonIcon || !sunIcon) return; // Skip if icons aren't found

        if (theme === 'dark') {
            moonIcon.style.display = 'none';
            sunIcon.style.display = 'block';
        } else {
            moonIcon.style.display = 'block';
            sunIcon.style.display = 'none';
        }
    });
}

// --- 2. Navbar Loading ------------------------------------------------------

/**
 * Fetches the navbar HTML and injects it into the placeholder.
 */
async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) {
        console.error('Navbar placeholder not found!');
        return;
    }

    try {
        // We assume navbar.html is in a 'components' folder relative to the root
        const response = await fetch('components/navbar.html');
        if (!response.ok) throw new Error('Navbar component not found.');
        
        const navbarHTML = await response.text();
        placeholder.innerHTML = navbarHTML;
        
        // After loading, make it interactive
        initNavbar();

    } catch (error) {
        console.error('Failed to load navbar:', error);
        placeholder.innerHTML = '<p class="text-center text-red-500">Error loading navigation.</p>';
    }
}

/**
 * Attaches event listeners to the newly loaded navbar.
 */
function initNavbar() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Desktop Dropdown
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent window click from firing immediately
            dropdownMenu.classList.toggle('hidden');
        });
    }
    
    // Mobile Menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Theme Toggle Buttons (FIXED: Attach to both)
    const themeToggleBtns = [
        document.getElementById('theme-toggle-btn'),
        document.getElementById('theme-toggle-btn-mobile')
    ];
    
    themeToggleBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', toggleTheme);
        }
    });

    // Close dropdown if clicked outside
    window.addEventListener('click', (e) => {
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
        }
    });

    // Set the active link and apply the theme
    setActiveNav();
    applyTheme(); // Apply theme icons *after* navbar is loaded
}

/**
 * Finds the current page and highlights the correct nav link.
 */
function setActiveNav() {
    // Get the current page (e.g., "index.html" -> "index")
    let currentPage = window.location.pathname.split('/').pop();
    if (currentPage === '' || currentPage === 'index.html') {
        currentPage = 'index';
    } else {
        currentPage = currentPage.replace('.html', '');
    }

    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('data-page');
        
        if (linkPage === currentPage) {
            // Apply active styles (for new inverted navbar)
            link.classList.add('font-bold', 'text-white', 'dark:text-black');
            link.classList.remove('text-gray-300', 'dark:text-gray-600'); // Remove default
        } else {
            // Apply default styles (for new inverted navbar)
            link.classList.add('text-gray-300', 'dark:text-gray-600');
            link.classList.remove('font-bold', 'text-white', 'dark:text-black');
        }
    });
}


// --- 3. Initial Execution ---------------------------------------------------

/**
 * Applies the theme *before* DOM content is fully loaded to prevent flicker.
 */
function applyInitialTheme() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

applyInitialTheme();

// When the DOM is loaded, load the navbar
document.addEventListener('DOMContentLoaded', loadNavbar);

