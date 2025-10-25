/*
 * My AI App - Main JavaScript (From Scratch)
 * Handles: Theme, Navbar loading, and Interactions
 * This script is loaded with 'defer' in index.html,
 * so it runs after the HTML is parsed.
 */

// --- 1. Theme Logic ---------------------------------------------------------
// These functions are defined in the global scope so the
// 'onclick=""' attributes in navbar.html can find them.

/**
 * Toggles the theme between 'light' and 'dark' in localStorage
 * and calls applyTheme() to update the UI.
 */
function toggleTheme() {
    // 1. Get current theme (default to 'light' if nothing is set)
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // 2. Set the new theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    
    // 3. Apply the changes to the page
    applyTheme();
}

/**
 * Reads the theme from localStorage and applies it to the
 * <html> element (adding/removing 'dark' class) and updates toggle icons.
 */
function applyTheme() {
    // 1. Get theme from storage OR check system preference
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // 2. Apply it to the <html> tag
    if (theme === 'light') {
        document.documentElement.classList.remove('dark');
    } else {
        document.documentElement.classList.add('dark');
    }
    
    // 3. Update the sun/moon icons
    updateThemeIcons(theme);
}

/**
 * Updates the visibility of moon and sun icons on both
 * desktop and mobile toggle buttons based on the current theme.
 * @param {string} theme - The current theme ('dark' or 'light').
 */
function updateThemeIcons(theme) {
    const isDark = (theme === 'dark');

    // Find *all* theme buttons (desktop and mobile)
    const allToggleBtns = document.querySelectorAll('#theme-toggle-btn, #theme-toggle-btn-mobile');
    
    allToggleBtns.forEach(btn => {
        if (btn) {
            const moonIcon = btn.querySelector('ion-icon[name="moon-outline"]');
            const sunIcon = btn.querySelector('ion-icon[name="sunny-outline"]');
            
            if (moonIcon && sunIcon) {
                // If it's dark mode, show SUN icon, hide MOON icon
                // If it's light mode, show MOON icon, hide SUN icon
                moonIcon.style.display = isDark ? 'none' : 'block';
                sunIcon.style.display = isDark ? 'block' : 'none';
            }
        }
    });
}

// --- 2. Navbar Loading ------------------------------------------------------

/**
 * Fetches 'components/navbar.html' and injects it into
 * the '#navbar-placeholder' div, then calls initNavbar().
 */
async function loadNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) {
        console.error('Navbar placeholder not found!');
        return;
    }

    try {
        const response = await fetch('components/navbar.html');
        if (!response.ok) {
            throw new Error(`Navbar component not found at 'components/navbar.html' (Status: ${response.status})`);
        }
        
        const navbarHTML = await response.text();
        placeholder.innerHTML = navbarHTML;
        
        // Now that the navbar HTML is loaded, initialize its scripts
        initNavbar();

    } catch (error) {
        console.error('Failed to load navbar:', error);
        placeholder.innerHTML = '<p class="text-center text-red-500">Error loading navigation. Check file path.</p>';
    }
}

/**
 * Initializes all event listeners for the dynamically loaded navbar elements
 * (dropdowns, mobile menu).
 * NOTE: Theme buttons are handled by 'onclick=""' in the HTML.
 */
function initNavbar() {
    const dropdownToggle = document.getElementById('dropdown-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const dropdownIcon = document.getElementById('dropdown-icon');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const closeIcon = document.getElementById('close-icon');

    // Desktop Dropdown
    if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent window click listener from closing it
            dropdownMenu.classList.toggle('hidden');
            
            // Rotate icon
            if (dropdownIcon) {
                dropdownIcon.style.transform = dropdownMenu.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
            }
        });
    }
    
    // Mobile Menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle menu/close icons
            if (menuIcon && closeIcon) {
                menuIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            }
        });
    }
    
    // Close dropdown if clicked outside
    window.addEventListener('click', (e) => {
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && dropdownToggle && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
            if (dropdownIcon) {
                dropdownIcon.style.transform = 'rotate(0deg)';
            }
        }
    });

    // Set the active nav link style
    setActiveNav();
    
    // IMPORTANT: Call applyTheme() *after* navbar is loaded
    // This sets the correct sun/moon icon visibility on page load.
    applyTheme();
}

// --- 3. Active Nav Link Highlighting ----------------------------------------

/**
 * Checks the current page URL and applies active styles
 * to the corresponding navigation link.
 */
function setActiveNav() {
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
            // Active styles: (Light: gray bg, black text | Dark: dark gray bg, white text)
            link.classList.add('font-semibold', 'text-black', 'dark:text-white', 'bg-gray-100', 'dark:bg-gray-800');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
        } else {
            // Default styles: (Light: gray text | Dark: light gray text)
            link.classList.add('text-gray-700', 'dark:text-gray-300');
            link.classList.remove('font-semibold', 'text-black', 'dark:text-white', 'bg-gray-100', 'dark:bg-gray-800');
        }
    });
}

// --- 4. Initial Execution ---------------------------------------------------
// Since this script has 'defer', it runs after the DOM is ready.
// We can just call loadNavbar() directly.
loadNavbar();

