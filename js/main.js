/**
 * Main JavaScript file for My AI App
 * Handles:
 * 1. Theme (Dark/Light Mode)
 * 2. Shared Navbar Loading & Interactivity
 */

// --- 1. THEME LOGIC ---

/**
 * Applies the saved theme (dark/light) on page load.
 */
function applyTheme() {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

/**
 * Toggles the theme between dark and light and saves the preference.
 */
function toggleTheme() {
    if (localStorage.theme === 'dark') {
        localStorage.theme = 'light';
        document.documentElement.classList.remove('dark');
    } else {
        localStorage.theme = 'dark';
        document.documentElement.classList.add('dark');
    }
    // Re-apply theme to update icons (in case they are controlled by JS, good practice)
    updateThemeIcons();
}

/**
 * Updates the visibility of theme toggle icons.
 */
function updateThemeIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    
    // Find all theme toggle icons (desktop and mobile)
    document.querySelectorAll('#theme-toggle-btn, #theme-toggle-btn-mobile').forEach(btn => {
        const moonIcon = btn.querySelector('ion-icon[name="moon-outline"]');
        const sunnyIcon = btn.querySelector('ion-icon[name="sunny-outline"]');
        
        if (moonIcon && sunnyIcon) {
            moonIcon.style.display = isDark ? 'block' : 'none';
            sunnyIcon.style.display = isDark ? 'none' : 'block';
        }
    });
}


// --- 2. NAVBAR LOGIC ---

/**
 * Loads the navbar, attaches event listeners, and highlights the active page.
 */
async function loadNavbar() {
    try {
        const response = await fetch('components/navbar.html');
        if (!response.ok) {
            throw new Error('Navbar component not found.');
        }
        const navbarHTML = await response.text();
        
        // Inject the navbar HTML into the placeholder
        const navbarPlaceholder = document.getElementById('navbar-placeholder');
        if (navbarPlaceholder) {
            navbarPlaceholder.innerHTML = navbarHTML;
            
            // Once navbar is loaded, attach all its event listeners
            attachNavbarListeners();
            
            // And highlight the active link
            highlightActiveLink();
        }
    } catch (error) {
        console.error('Failed to load navbar:', error);
    }
}

/**
 * Attaches all event listeners for the interactive elements in the navbar.
 */
function attachNavbarListeners() {
    // Desktop Dropdown
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', () => {
            dropdownMenu.classList.toggle('hidden');
        });
        
        // Close dropdown if clicked outside
        window.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target)) {
                dropdownMenu.classList.add('hidden');
            }
        });
    }

    // Mobile Menu
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Theme Toggle Buttons (Desktop and Mobile)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    if (themeToggleBtnMobile) {
        themeToggleBtnMobile.addEventListener('click', toggleTheme);
    }

    // Ensure icons are correct on load
    updateThemeIcons();
}

/**
 * Highlights the active page link in the navbar.
 */
function highlightActiveLink() {
    // Get the current page (e.g., "index.html", "claude.html")
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.split('.')[0]; // "index", "claude", "openai"

    // Find all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        const linkPage = link.getAttribute('data-page');
        
        if (linkPage === pageName) {
            // This is the active link
            link.classList.add('text-gray-900', 'dark:text-white', 'bg-gray-100', 'dark:bg-gray-800');
            link.classList.add('font-semibold'); // Make it bold
            
            // Specific styling for dropdown links
            if (link.closest('#dropdown-menu')) {
                 link.classList.add('text-blue-600', 'dark:text-blue-400', 'bg-slate-100', 'dark:bg-slate-900');
            }
            
        } else {
            // This is an inactive link
            link.classList.add('text-gray-600', 'dark:text-gray-300');
             // Specific styling for dropdown links
            if (link.closest('#dropdown-menu')) {
                 link.classList.add('text-slate-700', 'dark:text-slate-200', 'hover:bg-slate-100', 'dark:hover:bg-slate-700');
            } else {
                link.classList.add('hover:bg-gray-100', 'dark:hover:bg-gray-800');
            }
        }
    });
}


// --- 3. INITIALIZATION ---

/**
 * Runs when the DOM is fully loaded.
 * We use 'DOMContentLoaded' to make sure the <navbar-placeholder> exists.
 */
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(); // 1. Set the theme first
    loadNavbar(); // 2. Load the navbar and attach its logic
});
