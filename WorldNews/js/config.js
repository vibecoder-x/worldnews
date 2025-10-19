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
        mediastack: 'ef5c3f284f33678af655e00ddefe2971',
    },

    // API Endpoints
    API_ENDPOINTS: {
        newsapi: 'https://newsapi.org/v2',
        gnews: 'https://gnews.io/api/v4',
        currentsapi: 'https://api.currentsapi.services/v1',
        mediastack: 'http://api.mediastack.com/v1',
    },

    // RSS Feeds - English Only
    RSS_FEEDS: {
        en: [
            // World News
            { name: 'BBC World News', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'world' },
            { name: 'CNN International', url: 'http://rss.cnn.com/rss/edition.rss', category: 'world' },
            { name: 'Reuters Top News', url: 'https://www.reutersagency.com/feed/?best-topics=top-news', category: 'world' },
            { name: 'Al Jazeera English', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
            { name: 'Reuters World', url: 'https://www.reutersagency.com/feed/?best-topics=international', category: 'world' },
            { name: 'The Guardian World', url: 'https://www.theguardian.com/world/rss', category: 'world' },

            // Business
            { name: 'BBC Business', url: 'http://feeds.bbci.co.uk/news/business/rss.xml', category: 'business' },
            { name: 'Reuters Business', url: 'https://www.reutersagency.com/feed/?best-topics=business-finance', category: 'business' },
            { name: 'Financial Times', url: 'https://www.ft.com/?format=rss', category: 'business' },
            { name: 'Bloomberg', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'business' },

            // Technology
            { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology' },
            { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology' },
            { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'technology' },
            { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'technology' },
            { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'technology' },
            { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'technology' },

            // Sports
            { name: 'ESPN', url: 'https://www.espn.com/espn/rss/news', category: 'sports' },
            { name: 'BBC Sport', url: 'http://feeds.bbci.co.uk/sport/rss.xml', category: 'sports' },
            { name: 'Sky Sports', url: 'https://www.skysports.com/rss/12040', category: 'sports' },

            // Entertainment
            { name: 'Hollywood Reporter', url: 'https://www.hollywoodreporter.com/feed/', category: 'entertainment' },
            { name: 'Variety', url: 'https://variety.com/feed/', category: 'entertainment' },
            { name: 'Entertainment Weekly', url: 'https://ew.com/feed/', category: 'entertainment' },

            // Health
            { name: 'BBC Health', url: 'http://feeds.bbci.co.uk/news/health/rss.xml', category: 'health' },
            { name: 'Medical News Today', url: 'https://www.medicalnewstoday.com/rss/news.xml', category: 'health' },
            { name: 'WebMD', url: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC', category: 'health' },

            // Science
            { name: 'Science Daily', url: 'https://www.sciencedaily.com/rss/all.xml', category: 'science' },
            { name: 'Nature News', url: 'https://www.nature.com/nature.rss', category: 'science' },
            { name: 'Scientific American', url: 'https://www.scientificamerican.com/feed/', category: 'science' },

            // Politics
            { name: 'Politico', url: 'https://www.politico.com/rss/politics08.xml', category: 'politics' },
            { name: 'The Hill', url: 'https://thehill.com/feed/', category: 'politics' },
            { name: 'Reuters Politics', url: 'https://www.reutersagency.com/feed/?best-topics=political-general', category: 'politics' },
        ]
    },

    // Default Settings
    DEFAULTS: {
        language: 'en',
        articlesPerPage: 50, // Show 50 articles per page for rich content
        autoRefreshInterval: 1800000, // 30 minutes - automatic refresh
        defaultCategory: 'all',
        maxArticlesCache: 10000, // Cache up to 10,000 articles
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
        en: { name: 'English', code: 'en', dir: 'ltr' }
    },

    // Country Codes for API
    COUNTRY_CODES: {
        en: 'us'
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
        client: 'ca-pub-9175515910132435',
        slots: {
            leaderboard: 'auto',
            sidebar: 'auto',
            inContent: 'auto',
            footer: 'auto'
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
