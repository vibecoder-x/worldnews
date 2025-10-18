/* ===========================
   DARK MODE FUNCTIONALITY
   =========================== */

class DarkMode {
    constructor() {
        this.isDark = this.getSavedMode();
        this.init();
    }

    // Get saved dark mode preference
    getSavedMode() {
        const saved = localStorage.getItem('worldnews_darkmode');
        if (saved !== null) {
            return saved === 'true';
        }

        // Check system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Initialize dark mode
    init() {
        if (this.isDark) {
            this.enable();
        }

        // Listen for system preference changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (localStorage.getItem('worldnews_darkmode') === null) {
                    e.matches ? this.enable() : this.disable();
                }
            });
        }
    }

    // Enable dark mode
    enable() {
        document.body.classList.add('dark-mode');
        this.isDark = true;
        localStorage.setItem('worldnews_darkmode', 'true');
        this.updateIcon();
    }

    // Disable dark mode
    disable() {
        document.body.classList.remove('dark-mode');
        this.isDark = false;
        localStorage.setItem('worldnews_darkmode', 'false');
        this.updateIcon();
    }

    // Toggle dark mode
    toggle() {
        this.isDark ? this.disable() : this.enable();
    }

    // Update toggle icon
    updateIcon() {
        const icon = document.querySelector('.dark-mode-toggle i');
        if (icon) {
            icon.className = this.isDark ? 'fas fa-sun' : 'fas fa-moon';
        }
    }
}

// Initialize dark mode
const darkMode = new DarkMode();

// Global toggle function
function toggleDarkMode() {
    darkMode.toggle();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DarkMode;
}
