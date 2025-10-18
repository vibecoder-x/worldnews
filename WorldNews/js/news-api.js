/* ===========================
   NEWS API INTEGRATION
   Multiple API Support with Fallbacks
   =========================== */

class NewsAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 15 * 60 * 1000; // 15 minutes
        this.currentApiIndex = 0;
        this.apis = ['newsapi', 'gnews', 'currentsapi'];
    }

    // Fetch news from NewsAPI.org (via serverless function)
    async fetchFromNewsAPI(category = 'general', language = 'en', page = 1, pageSize = 12) {
        const params = new URLSearchParams({
            api: 'newsapi',
            category,
            language,
            page,
            pageSize
        });

        try {
            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.status === 'ok' && data.articles) {
                return this.normalizeNewsAPIData(data.articles);
            } else {
                throw new Error(data.message || 'NewsAPI error');
            }
        } catch (error) {
            console.error('NewsAPI fetch error:', error);
            throw error;
        }
    }

    // Fetch news from GNews (via serverless function)
    async fetchFromGNews(category = 'general', language = 'en', page = 1, pageSize = 12) {
        const params = new URLSearchParams({
            api: 'gnews',
            category,
            language,
            page,
            pageSize
        });

        try {
            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.articles) {
                return this.normalizeGNewsData(data.articles);
            } else {
                throw new Error('GNews error');
            }
        } catch (error) {
            console.error('GNews fetch error:', error);
            throw error;
        }
    }

    // Fetch news from CurrentsAPI (via serverless function)
    async fetchFromCurrentsAPI(category = 'general', language = 'en', page = 1, pageSize = 12) {
        const params = new URLSearchParams({
            api: 'currentsapi',
            category,
            language,
            page,
            pageSize
        });

        try {
            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.status === 'ok' && data.news) {
                return this.normalizeCurrentsAPIData(data.news);
            } else {
                throw new Error('CurrentsAPI error');
            }
        } catch (error) {
            console.error('CurrentsAPI fetch error:', error);
            throw error;
        }
    }

    // Search news across APIs (via serverless function)
    async searchNews(query, language = 'en', page = 1, pageSize = 12) {
        const cacheKey = `search_${query}_${language}_${page}`;

        // Check cache
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // Try NewsAPI search via serverless function
            const params = new URLSearchParams({
                api: 'newsapi',
                query,
                language,
                page,
                pageSize
            });

            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.status === 'ok' && data.articles) {
                const articles = this.normalizeNewsAPIData(data.articles);
                this.setCache(cacheKey, articles);
                return articles;
            }
        } catch (error) {
            console.error('Search error:', error);
        }

        // Fallback to GNews search
        try {
            const params = new URLSearchParams({
                api: 'gnews',
                query,
                language,
                pageSize
            });

            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.articles) {
                const articles = this.normalizeGNewsData(data.articles);
                this.setCache(cacheKey, articles);
                return articles;
            }
        } catch (error) {
            console.error('GNews search error:', error);
        }

        return [];
    }

    // Fetch news with automatic fallback
    async fetchNews(category = 'general', language = 'en', page = 1, pageSize = 12) {
        const cacheKey = `news_${category}_${language}_${page}`;

        // Check cache
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        // Try each API in sequence
        for (let i = 0; i < this.apis.length; i++) {
            const apiName = this.apis[(this.currentApiIndex + i) % this.apis.length];

            try {
                let articles;

                switch (apiName) {
                    case 'newsapi':
                        articles = await this.fetchFromNewsAPI(category, language, page, pageSize);
                        break;
                    case 'gnews':
                        articles = await this.fetchFromGNews(category, language, page, pageSize);
                        break;
                    case 'currentsapi':
                        articles = await this.fetchFromCurrentsAPI(category, language, page, pageSize);
                        break;
                }

                if (articles && articles.length > 0) {
                    this.setCache(cacheKey, articles);
                    this.currentApiIndex = (this.currentApiIndex + i) % this.apis.length;
                    return articles;
                }
            } catch (error) {
                console.warn(`API ${apiName} failed, trying next...`);
                continue;
            }
        }

        throw new Error('All news APIs failed');
    }

    // Normalize NewsAPI data
    normalizeNewsAPIData(articles) {
        return articles.map(article => ({
            id: this.generateId(article.url),
            title: article.title,
            description: article.description || article.content || '',
            content: article.content || article.description || '',
            url: article.url,
            image: article.urlToImage || this.getPlaceholderImage(),
            source: article.source?.name || 'Unknown',
            author: article.author,
            publishedAt: new Date(article.publishedAt),
            category: this.extractCategory(article)
        }));
    }

    // Normalize GNews data
    normalizeGNewsData(articles) {
        return articles.map(article => ({
            id: this.generateId(article.url),
            title: article.title,
            description: article.description || '',
            content: article.content || article.description || '',
            url: article.url,
            image: article.image || this.getPlaceholderImage(),
            source: article.source?.name || 'Unknown',
            author: article.source?.name,
            publishedAt: new Date(article.publishedAt),
            category: 'general'
        }));
    }

    // Normalize CurrentsAPI data
    normalizeCurrentsAPIData(articles) {
        return articles.map(article => ({
            id: article.id || this.generateId(article.url),
            title: article.title,
            description: article.description || '',
            content: article.description || '',
            url: article.url,
            image: article.image || this.getPlaceholderImage(),
            source: article.author || 'Unknown',
            author: article.author,
            publishedAt: new Date(article.published),
            category: article.category?.[0] || 'general'
        }));
    }

    // Generate unique ID from URL
    generateId(url) {
        return btoa(url).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
    }

    // Extract category from article
    extractCategory(article) {
        // Try to infer category from source or content
        return 'general';
    }

    // Get placeholder image
    getPlaceholderImage() {
        return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="24"%3ENo Image%3C/text%3E%3C/svg%3E';
    }

    // Cache management
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    setCache(key, data) {
        // Limit cache size
        if (this.cache.size > CONFIG.DEFAULTS.maxArticlesCache) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }

        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
    }

    // Calculate reading time
    calculateReadingTime(text) {
        const words = text.split(/\s+/).length;
        const minutes = Math.ceil(words / CONFIG.DEFAULTS.readingWordsPerMinute);
        return minutes;
    }
}

// Initialize global news API instance
const newsAPI = new NewsAPI();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NewsAPI;
}
