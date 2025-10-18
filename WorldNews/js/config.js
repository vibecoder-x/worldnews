/* ===========================
   CONFIGURATION FILE
   WorldNews.day
   =========================== */

const CONFIG = {
    // API Keys
    API_KEYS: {
        newsapi: '5ff2e88241d7494a8add4b009533eef1',
        gnews: 'dba2727f20fd5a6d763df225da065b48',
        currentsapi: 'PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx',
        // Newscatcher API key would go here if needed
    },

    // API Endpoints
    API_ENDPOINTS: {
        newsapi: 'https://newsapi.org/v2',
        gnews: 'https://gnews.io/api/v4',
        currentsapi: 'https://api.currentsapi.services/v1',
    },

    // RSS Feeds by Language
    RSS_FEEDS: {
        en: [
            { name: 'BBC World News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'world' },
            { name: 'CNN International', url: 'http://rss.cnn.com/rss/edition.rss', category: 'world' },
            { name: 'Reuters Top News', url: 'https://www.reutersagency.com/feed/?best-topics=top-news', category: 'world' },
            { name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
            { name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'business' },
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology' },
            { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology' },
        ],
        es: [
            { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml', category: 'world' },
            { name: 'CNN Español', url: 'https://cnnespanol.cnn.com/feed/', category: 'world' },
        ],
        fr: [
            { name: 'BBC Afrique', url: 'https://feeds.bbci.co.uk/afrique/rss.xml', category: 'world' },
            { name: 'France 24', url: 'https://www.france24.com/en/rss', category: 'world' },
        ],
        de: [
            { name: 'Deutsche Welle', url: 'https://rss.dw.com/xml/rss-de-all', category: 'world' },
        ],
        ar: [
            { name: 'Al Jazeera Arabic', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
        ],
        zh: [
            { name: 'Xinhua News', url: 'http://www.xinhuanet.com/english/rss/worldrss.xml', category: 'world' },
        ]
    },

    // Default Settings
    DEFAULTS: {
        language: 'en',
        articlesPerPage: 12,
        autoRefreshInterval: 1800000, // 30 minutes in milliseconds
        defaultCategory: 'all',
        maxArticlesCache: 100,
        readingWordsPerMinute: 200,
    },

    // Category Mappings
    CATEGORIES: {
        all: ['general', 'world', 'politics', 'business', 'technology', 'health', 'sports', 'entertainment', 'science'],
        world: ['world', 'general'],
        politics: ['politics'],
        business: ['business'],
        technology: ['technology', 'tech'],
        health: ['health'],
        sports: ['sports'],
        entertainment: ['entertainment'],
        science: ['science']
    },

    // Language Codes
    LANGUAGES: {
        en: { name: 'English', code: 'en', dir: 'ltr' },
        es: { name: 'Español', code: 'es', dir: 'ltr' },
        fr: { name: 'Français', code: 'fr', dir: 'ltr' },
        de: { name: 'Deutsch', code: 'de', dir: 'ltr' },
        ar: { name: 'العربية', code: 'ar', dir: 'rtl' },
        zh: { name: '中文', code: 'zh', dir: 'ltr' }
    },

    // Country Codes for API
    COUNTRY_CODES: {
        en: 'us',
        es: 'es',
        fr: 'fr',
        de: 'de',
        ar: 'ae',
        zh: 'cn'
    },

    // Social Share URLs
    SOCIAL_SHARE: {
        twitter: 'https://twitter.com/intent/tweet?url={url}&text={text}',
        facebook: 'https://www.facebook.com/sharer/sharer.php?u={url}',
        linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url={url}',
        whatsapp: 'https://api.whatsapp.com/send?text={text}%20{url}',
        wechat: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={url}',
    },

    // Google AdSense Settings
    ADSENSE: {
        client: 'ca-pub-XXXXXXXXXXXXXXXX',
        slots: {
            leaderboard: 'XXXXXXXXXX',
            sidebar: 'XXXXXXXXXX',
            inContent: 'XXXXXXXXXX',
            footer: 'XXXXXXXXXX'
        }
    },

    // Feature Flags
    FEATURES: {
        darkMode: true,
        newsletter: true,
        breakingNews: true,
        trending: true,
        socialShare: true,
        printMode: true,
        fontSizeAdjust: true,
        infiniteScroll: false, // Using pagination instead
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
