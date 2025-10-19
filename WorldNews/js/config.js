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

    // RSS Feeds by Language - MASSIVE CONTENT STRATEGY
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
        ],
        es: [
            { name: 'BBC Mundo', url: 'https://feeds.bbci.co.uk/mundo/rss.xml', category: 'world' },
            { name: 'CNN Español', url: 'https://cnnespanol.cnn.com/feed/', category: 'world' },
            { name: 'El País', url: 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada', category: 'world' },
            { name: 'El Mundo', url: 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml', category: 'world' },
        ],
        fr: [
            { name: 'BBC Afrique', url: 'https://feeds.bbci.co.uk/afrique/rss.xml', category: 'world' },
            { name: 'France 24', url: 'https://www.france24.com/en/rss', category: 'world' },
            { name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml', category: 'world' },
            { name: 'Le Figaro', url: 'https://www.lefigaro.fr/rss/figaro_actualites.xml', category: 'world' },
        ],
        de: [
            { name: 'Deutsche Welle', url: 'https://rss.dw.com/xml/rss-de-all', category: 'world' },
            { name: 'Spiegel Online', url: 'https://www.spiegel.de/index.rss', category: 'world' },
            { name: 'Die Zeit', url: 'https://www.zeit.de/index', category: 'world' },
        ],
        ar: [
            { name: 'Al Jazeera Arabic', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
            { name: 'BBC Arabic', url: 'https://feeds.bbci.co.uk/arabic/rss.xml', category: 'world' },
            { name: 'Al Arabiya', url: 'https://www.alarabiya.net/rss.xml', category: 'world' },
        ],
        zh: [
            { name: 'Xinhua News', url: 'http://www.xinhuanet.com/english/rss/worldrss.xml', category: 'world' },
            { name: 'China Daily', url: 'http://www.chinadaily.com.cn/rss/world_rss.xml', category: 'world' },
            { name: 'CCTV News', url: 'http://english.cctv.com/rss/china.xml', category: 'world' },
        ],
        hi: [
            { name: 'NDTV India', url: 'https://feeds.feedburner.com/ndtvnews-india-news', category: 'world' },
            { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'world' },
            { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'world' },
            { name: 'India Today', url: 'https://www.indiatoday.in/rss/home', category: 'world' },
            { name: 'Economic Times', url: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms', category: 'business' },
            { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'world' },
            { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', category: 'world' },
            { name: 'NDTV Business', url: 'https://feeds.feedburner.com/ndtvprofit-latest', category: 'business' },
        ]
    },

    // Default Settings
    DEFAULTS: {
        language: 'en',
        articlesPerPage: 50, // Show 50 articles per page for rich content
        autoRefreshInterval: 300000, // 5 minutes - very frequent updates
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
        en: { name: 'English', code: 'en', dir: 'ltr' },
        es: { name: 'Español', code: 'es', dir: 'ltr' },
        fr: { name: 'Français', code: 'fr', dir: 'ltr' },
        de: { name: 'Deutsch', code: 'de', dir: 'ltr' },
        ar: { name: 'العربية', code: 'ar', dir: 'rtl' },
        zh: { name: '中文', code: 'zh', dir: 'ltr' },
        hi: { name: 'हिंदी', code: 'hi', dir: 'ltr' }
    },

    // Country Codes for API
    COUNTRY_CODES: {
        en: 'us',
        es: 'es',
        fr: 'fr',
        de: 'de',
        ar: 'ae',
        zh: 'cn',
        hi: 'in'
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
