/*
 * My AI App - Main JavaScript (No Theme)
 * Handles: Navbar loading and Interactions
 * All theme-switching code has been removed.
 */

// --- 1. Navbar Loading ------------------------------------------------------

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
}

// --- 2. Active Nav Link Highlighting ----------------------------------------

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
            // Active styles: (Dark mode: dark gray bg, white text)
            link.classList.add('font-semibold', 'text-white', 'bg-gray-800');
            link.classList.remove('text-gray-300');
        } else {
            // Default styles: (Dark mode: light gray text)
            link.classList.add('text-gray-300');
            link.classList.remove('font-semibold', 'text-white', 'bg-gray-800');
        }
    });
}

// --- 3. Initial Execution ---------------------------------------------------
// Since this script has 'defer', it runs after the DOM is ready.
loadNavbar();

