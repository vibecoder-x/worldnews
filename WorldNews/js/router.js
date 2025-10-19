/* ===========================
   URL ROUTING SYSTEM
   Handle /category/language URLs
   =========================== */

class Router {
    constructor() {
        this.currentCategory = 'all';
        this.currentLanguage = 'en';
        this.init();
    }

    init() {
        // Parse URL on page load
        this.parseURL();

        // Listen for browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.parseURL();
            this.reloadPage();
        });
    }

    // Parse current URL and extract category/language
    parseURL() {
        const path = window.location.pathname;

        // Remove leading/trailing slashes
        const cleanPath = path.replace(/^\/+|\/+$/g, '');

        if (!cleanPath) {
            // Root URL - default to home/en
            this.currentCategory = 'all';
            this.currentLanguage = 'en';
            return;
        }

        // Split path into parts: /category/language
        const parts = cleanPath.split('/');

        if (parts.length >= 1) {
            // First part is category
            const category = parts[0].toLowerCase();
            const validCategories = ['home', 'world', 'politics', 'business', 'technology', 'health', 'sports', 'entertainment'];

            if (validCategories.includes(category)) {
                this.currentCategory = category === 'home' ? 'all' : category;
            }
        }

        if (parts.length >= 2) {
            // Second part is language
            const lang = parts[1].toLowerCase();
            const validLanguages = ['en', 'es', 'fr', 'de', 'ar', 'zh', 'hi'];

            if (validLanguages.includes(lang)) {
                this.currentLanguage = lang;
            }
        }

        console.log(`📍 Parsed URL: Category=${this.currentCategory}, Language=${this.currentLanguage}`);
    }

    // Navigate to a new category/language
    navigate(category, language) {
        const displayCategory = category === 'all' ? 'home' : category;
        const newPath = `/${displayCategory}/${language}`;

        // Update browser URL without reload
        window.history.pushState({ category, language }, '', newPath);

        // Update current state
        this.currentCategory = category;
        this.currentLanguage = language;

        // Reload content
        this.reloadPage();
    }

    // Reload page content based on current category/language
    reloadPage() {
        // Update language
        if (window.i18n) {
            i18n.setLanguage(this.currentLanguage);
        }

        // Update app category and reload news
        if (window.app) {
            app.currentCategory = this.currentCategory;
            app.currentPage = 1;
            app.articles = [];

            // Clear cache for fresh content
            if (window.newsAPI) {
                newsAPI.clearCache();
            }
            if (window.rssFeedManager && rssFeedManager.combinedCache) {
                rssFeedManager.combinedCache.clear();
            }

            // Reload all sections
            app.loadNews();
            app.loadFeaturedNews();
            app.loadTrendingNews();

            // Update active nav link
            this.updateActiveNavLink();
        }
    }

    // Update active navigation link based on current category
    updateActiveNavLink() {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
            const linkCategory = link.getAttribute('data-category');
            if (linkCategory === this.currentCategory) {
                link.classList.add('active');
            }
        });
    }

    // Get current category
    getCategory() {
        return this.currentCategory;
    }

    // Get current language
    getLanguage() {
        return this.currentLanguage;
    }
}

// Initialize router
const router = new Router();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
}
