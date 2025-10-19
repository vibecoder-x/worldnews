/* ===========================
   NEWS API INTEGRATION
   Multiple API Support with Fallbacks
   =========================== */

class NewsAPI {
    constructor() {
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes - shorter for fresher content
        this.currentApiIndex = 0;
        this.apis = ['newsapi', 'gnews', 'currentsapi', 'mediastack'];
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

    // Fetch news from Mediastack (via serverless function)
    async fetchFromMediastack(category = 'general', language = 'en', page = 1, pageSize = 12) {
        const params = new URLSearchParams({
            api: 'mediastack',
            category,
            language,
            page,
            pageSize
        });

        try {
            const response = await fetch(`/api/news?${params}`);
            const data = await response.json();

            if (data.data) {
                return this.normalizeMediastackData(data.data);
            } else {
                throw new Error(data.error?.message || 'Mediastack error');
            }
        } catch (error) {
            console.error('Mediastack fetch error:', error);
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
                    case 'mediastack':
                        articles = await this.fetchFromMediastack(category, language, page, pageSize);
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
        return articles
            .filter(article => {
                // Only filter out removed articles, keep those with/without images
                return article.title &&
                       article.title !== '[Removed]' &&
                       article.url;
            })
            .map(article => {
                // Clean content - remove [+chars] indicators
                let description = (article.description || article.content || 'No description available')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');
                let content = (article.content || article.description || '')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');

                return {
                    id: this.generateId(article.url),
                    title: article.title,
                    description: description,
                    content: content,
                    url: article.url,
                    image: this.validateImage(article.urlToImage),
                    source: article.source?.name || 'Unknown',
                    author: article.author || article.source?.name || 'Unknown',
                    publishedAt: new Date(article.publishedAt),
                    category: this.extractCategory(article)
                };
            });
    }

    // Normalize GNews data
    normalizeGNewsData(articles) {
        return articles
            .filter(article => {
                // Only filter out articles without title/URL
                return article.title && article.url;
            })
            .map(article => {
                // Clean content - remove [+chars] indicators
                let description = (article.description || 'No description available')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');
                let content = (article.content || article.description || '')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');

                return {
                    id: this.generateId(article.url),
                    title: article.title,
                    description: description,
                    content: content,
                    url: article.url,
                    image: this.validateImage(article.image),
                    source: article.source?.name || 'Unknown',
                    author: article.source?.name || 'Unknown',
                    publishedAt: new Date(article.publishedAt),
                    category: 'general'
                };
            });
    }

    // Normalize CurrentsAPI data
    normalizeCurrentsAPIData(articles) {
        return articles
            .filter(article => {
                // Only filter out articles without title/URL
                return article.title && article.url;
            })
            .map(article => {
                // Clean content - remove [+chars] indicators
                let description = (article.description || 'No description available')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');

                return {
                    id: article.id || this.generateId(article.url),
                    title: article.title,
                    description: description,
                    content: description,
                    url: article.url,
                    image: this.validateImage(article.image),
                    source: article.author || 'Unknown',
                    author: article.author || 'Unknown',
                    publishedAt: new Date(article.published),
                    category: article.category?.[0] || 'general'
                };
            });
    }

    // Normalize Mediastack data
    normalizeMediastackData(articles) {
        return articles
            .filter(article => {
                // Only filter out articles without title/URL
                return article.title && article.url;
            })
            .map(article => {
                // Clean content - remove [+chars] indicators
                let description = (article.description || 'No description available')
                    .replace(/\[\+\d+\s*chars?\]/gi, '...');

                return {
                    id: this.generateId(article.url),
                    title: article.title,
                    description: description,
                    content: description,
                    url: article.url,
                    image: this.validateImage(article.image),
                    source: article.source || 'Unknown',
                    author: article.author || article.source || 'Unknown',
                    publishedAt: new Date(article.published_at),
                    category: article.category || 'general'
                };
            });
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

    // Validate and return image URL or placeholder
    validateImage(imageUrl) {
        // Check if image URL exists and is valid
        if (!imageUrl || imageUrl === 'null' || imageUrl === 'undefined') {
            return this.getPlaceholderImage();
        }

        // Check if it's a valid URL
        try {
            const url = new URL(imageUrl);
            // Check if it's a proper image URL
            if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                return this.getPlaceholderImage();
            }
            return imageUrl;
        } catch (e) {
            return this.getPlaceholderImage();
        }
    }

    // Get placeholder image with variety
    getPlaceholderImage(category = 'general') {
        const gradients = {
            world: '%233b82f6,%232563eb',
            politics: '%23ef4444,%23dc2626',
            business: '%2310b981,%23059669',
            technology: '%238b5cf6,%237c3aed',
            health: '%23f59e0b,%23d97706',
            sports: '%2306b6d4,%230891b2',
            entertainment: '%23ec4899,%23db2777',
            general: '%233b82f6,%232563eb'
        };

        const colors = gradients[category] || gradients.general;
        const [color1, color2] = colors.split(',');

        return `data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Cdefs%3E%3ClinearGradient id="grad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:${color1};stop-opacity:1" /%3E%3Cstop offset="100%25" style="stop-color:${color2};stop-opacity:1" /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23grad)" width="400" height="300"/%3E%3Ctext fill="white" x="50%25" y="45%25" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" font-weight="bold"%3EWorldNews%3C/text%3E%3Ctext fill="white" x="50%25" y="55%25" text-anchor="middle" font-family="Arial,sans-serif" font-size="14" opacity="0.9" text-transform="capitalize"%3E${category}%3C/text%3E%3C/svg%3E`;
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
