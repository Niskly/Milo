/*
 * My AI App - Main JavaScript
 * Handles: Theme, Navbar loading, and Interactions
 */

// --- 1. Theme Logic ---------------------------------------------------------

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme();
}

function applyTheme() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// --- 2. Navbar Loading ------------------------------------------------------

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
        
        initNavbar();

    } catch (error) {
        console.error('Failed to load navbar:', error);
        placeholder.innerHTML = '<p class="text-center text-red-500">Error loading navigation.</p>';
    }
}

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
    
    // Theme Toggle Buttons
    const themeToggleBtns = [
        document.getElementById('theme-toggle-btn'),
        document.getElementById('theme-toggle-btn-mobile')
    ];
    
    themeToggleBtns.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                toggleTheme();
            });
        }
    });

    // Close dropdown if clicked outside
    window.addEventListener('click', (e) => {
        if (dropdownMenu && !dropdownMenu.classList.contains('hidden') && !dropdownToggle.contains(e.target)) {
            dropdownMenu.classList.add('hidden');
            if (dropdownIcon) {
                dropdownIcon.style.transform = 'rotate(0deg)';
            }
        }
    });

    setActiveNav();
    applyTheme();
}

// --- 3. Active Nav Link Highlighting ----------------------------------------

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
            // Active styles
            link.classList.add('font-semibold', 'text-white', 'dark:text-black', 'bg-gray-800', 'dark:bg-gray-100');
            link.classList.remove('text-gray-300', 'dark:text-gray-700');
        } else {
            // Default styles
            link.classList.add('text-gray-300', 'dark:text-gray-700');
            link.classList.remove('font-semibold', 'text-white', 'dark:text-black', 'bg-gray-800', 'dark:bg-gray-100');
        }
    });
}

// --- 4. Initial Execution ---------------------------------------------------

function applyInitialTheme() {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

applyInitialTheme();

document.addEventListener('DOMContentLoaded', loadNavbar);
