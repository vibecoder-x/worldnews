/* ===========================
   INTERNATIONALIZATION (i18n)
   Language Management System
   =========================== */

class I18n {
    constructor() {
        this.currentLanguage = this.detectLanguage();
        this.translations = TRANSLATIONS;
        this.init();
    }

    // Detect browser language
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        // Check if we support this language
        if (CONFIG.LANGUAGES[langCode]) {
            return langCode;
        }

        // Check localStorage
        const savedLang = localStorage.getItem('worldnews_language');
        if (savedLang && CONFIG.LANGUAGES[savedLang]) {
            return savedLang;
        }

        // Default to English
        return CONFIG.DEFAULTS.language;
    }

    // Initialize i18n
    init() {
        this.applyLanguage(this.currentLanguage);
    }

    // Get translation
    t(key) {
        const translation = this.translations[this.currentLanguage]?.[key];
        return translation || key;
    }

    // Apply language to page
    applyLanguage(lang) {
        if (!CONFIG.LANGUAGES[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('worldnews_language', lang);

        // Update HTML lang attribute
        document.documentElement.lang = lang;

        // Update text direction for RTL languages
        const direction = CONFIG.LANGUAGES[lang].dir;
        document.documentElement.dir = direction;
        document.body.dir = direction;

        // Update all translatable elements
        this.updateTranslations();

        // Update language selector display
        this.updateLanguageSelector();

        // Trigger custom event for other components to react
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    // Update all translations on the page
    updateTranslations() {
        // Update elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });

        // Update aria-labels
        document.querySelectorAll('[data-i18n-aria]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria');
            element.setAttribute('aria-label', this.t(key));
        });

        // Update titles
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    // Update language selector display
    updateLanguageSelector() {
        const currentLangElement = document.getElementById('current-lang');
        if (currentLangElement) {
            currentLangElement.textContent = this.currentLanguage.toUpperCase();
        }

        // Highlight active language in dropdown
        document.querySelectorAll('.lang-dropdown a').forEach(link => {
            const linkLang = link.getAttribute('data-lang');
            if (linkLang === this.currentLanguage) {
                link.style.fontWeight = '700';
                link.style.color = 'var(--primary-blue)';
            } else {
                link.style.fontWeight = '400';
                link.style.color = 'var(--gray-700)';
            }
        });
    }

    // Change language
    changeLanguage(lang) {
        if (lang === this.currentLanguage) return;
        this.applyLanguage(lang);
    }

    // Get current language
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Get language name
    getLanguageName(langCode) {
        return CONFIG.LANGUAGES[langCode]?.name || langCode;
    }

    // Format time based on language
    formatTime(date, lang = this.currentLanguage) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) {
            return this.t('just_now');
        } else if (minutes < 60) {
            return `${minutes} ${this.t('minutes_ago')}`;
        } else if (hours < 24) {
            return `${hours} ${this.t('hours_ago')}`;
        } else if (days < 7) {
            return `${days} ${this.t('days_ago')}`;
        } else {
            return date.toLocaleDateString(lang, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    // Format number based on language
    formatNumber(number, lang = this.currentLanguage) {
        return new Intl.NumberFormat(lang).format(number);
    }

    // Get language-specific RSS feeds
    getLanguageFeeds() {
        return CONFIG.RSS_FEEDS[this.currentLanguage] || CONFIG.RSS_FEEDS.en;
    }

    // Get country code for current language
    getCountryCode() {
        return CONFIG.COUNTRY_CODES[this.currentLanguage] || CONFIG.COUNTRY_CODES.en;
    }
}

// Initialize i18n globally
const i18n = new I18n();

// Global functions for easy access
function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    toggleLanguageDropdown(); // Close dropdown after selection
}

function toggleLanguageDropdown() {
    const dropdown = document.getElementById('lang-dropdown');
    dropdown.classList.toggle('hidden');
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const langSwitcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('lang-dropdown');

    if (!langSwitcher?.contains(e.target) && dropdown) {
        dropdown.classList.add('hidden');
    }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18n;
}
