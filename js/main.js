/*
 * My AI App - Main JavaScript
 * Handles: Theme, Navbar loading, and Interactions
 */

// --- 1. Theme Logic ---------------------------------------------------------

/**
 * Toggles the theme between 'light' and 'dark' in localStorage
 * and calls applyTheme() to update the UI.
 * This function is called directly from the onclick="" in navbar.html.
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(); // Update the UI
}

/**
 * Reads the theme from localStorage and applies it to the
 * <html> element (adding/removing 'dark' class) and updates toggle icons.
 */
function applyTheme() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    
    // This function will show/hide the correct sun/moon icon
    updateThemeIcons(theme);
}

/**
 * Updates the visibility of moon and sun icons on both
 * desktop and mobile toggle buttons based on the current theme.
 * @param {string} theme - The current theme ('dark' or 'light').
 */
function updateThemeIcons(theme) {
    const isDark = (theme === 'dark');

    // Desktop button
    const desktopBtn = document.getElementById('theme-toggle-btn');
    if (desktopBtn) {
        const moonIcon = desktopBtn.querySelector('ion-icon[name="moon-outline"]');
        const sunIcon = desktopBtn.querySelector('ion-icon[name="sunny-outline"]');
        
        if (moonIcon && sunIcon) {
            moonIcon.style.display = isDark ? 'none' : 'block';
            sunIcon.style.display = isDark ? 'block' : 'none';
        }
    }
    
    // Mobile button
    const mobileBtn = document.getElementById('theme-toggle-btn-mobile');
    if (mobileBtn) {
        const moonIcon = mobileBtn.querySelector('ion-icon[name="moon-outline"]');
        const sunIcon = mobileBtn.querySelector('ion-icon[name="sunny-outline"]');
        
        if (moonIcon && sunIcon) {
            moonIcon.style.display = isDark ? 'none' : 'block';
            sunIcon.style.display = isDark ? 'block' : 'none';
        }
    }
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
        if (!response.ok) throw new Error('Navbar component not found.');
        
        const navbarHTML = await response.text();
        placeholder.innerHTML = navbarHTML;
        
        // Now that the navbar HTML is loaded, initialize its event listeners
        initNavbar();

    } catch (error) {
        console.error('Failed to load navbar:', error);
        placeholder.innerHTML = '<p class="text-center text-red-500">Error loading navigation.</p>';
    }
}

/**
 * Initializes all event listeners for the dynamically loaded navbar elements
 * (dropdowns, mobile menu).
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
            e.stopPropagation();
            dropdownMenu.classList.toggle('hidden');
            
            // Rotate icon
            if (dropdownIcon) {
                if (dropdownMenu.classList.contains('hidden')) {
                    dropdownIcon.style.transform = 'rotate(0deg)';
                } else {
                    dropdownIcon.style.transform = 'rotate(180deg)';
                }
            }
        });
    }
    
    // Mobile Menu
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Toggle icons
            if (menuIcon && closeIcon) {
                if (mobileMenu.classList.contains('hidden')) {
                    menuIcon.classList.remove('hidden');
                    closeIcon.classList.add('hidden');
                } else {
                    menuIcon.classList.add('hidden');
                    closeIcon.classList.remove('hidden');
                }
            }
        });
    }
    
    // --- FIX ---
    // The conflicting theme toggle event listeners have been
    // completely removed from here. The onclick="" in the
    // HTML now handles it directly.
    // ---
    
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
    // Apply theme *after* navbar is loaded to style the icons correctly
    // This is what makes the correct icon (sun/moon) show on page load.
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
            // Active styles (Light: gray bg, black text | Dark: dark gray bg, white text)
            link.classList.add('font-semibold', 'text-black', 'dark:text-white', 'bg-gray-100', 'dark:bg-gray-800');
            link.classList.remove('text-gray-700', 'dark:text-gray-300');
        } else {
            // Default styles (Light: gray text | Dark: light gray text)
            link.classList.add('text-gray-700', 'dark:text-gray-300');
            link.classList.remove('font-semibold', 'text-black', 'dark:text-white', 'bg-gray-100', 'dark:bg-gray-800');
        }
    });
}

// --- 4. Initial Execution ---------------------------------------------------

// The inline script in index.html handles the *initial* theme class on <html>.
// This script waits for the DOM to be ready, then loads the navbar.
document.addEventListener('DOMContentLoaded', loadNavbar);

