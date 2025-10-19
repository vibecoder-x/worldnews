/* ===========================
   RSS FEED AGGREGATION
   Parse and display RSS feeds
   =========================== */

class RSSFeedManager {
    constructor() {
        this.feeds = [];
        this.parser = new DOMParser();
        this.combinedCache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache for combined results
    }

    // Fetch and parse RSS feed (via serverless function)
    async fetchFeed(feedUrl) {
        try {
            const params = new URLSearchParams({ url: feedUrl });
            const response = await fetch(`/api/rss?${params}`);
            const xmlText = await response.text();

            // Check if response is an error JSON
            if (xmlText.startsWith('{')) {
                const errorData = JSON.parse(xmlText);
                console.error('RSS fetch error:', errorData.error);
                return [];
            }

            const xmlDoc = this.parser.parseFromString(xmlText, 'text/xml');

            // Check if it's RSS or Atom
            if (xmlDoc.querySelector('rss')) {
                return this.parseRSS(xmlDoc, feedUrl);
            } else if (xmlDoc.querySelector('feed')) {
                return this.parseAtom(xmlDoc, feedUrl);
            } else {
                console.error('Unknown feed format');
                return [];
            }
        } catch (error) {
            console.error(`Error fetching RSS feed ${feedUrl}:`, error);
            return [];
        }
    }

    // Parse RSS 2.0 format
    parseRSS(xmlDoc, sourceUrl) {
        const items = xmlDoc.querySelectorAll('item');
        const articles = [];

        items.forEach((item, index) => {
            try {
                const title = item.querySelector('title')?.textContent || '';
                const description = item.querySelector('description')?.textContent || '';
                const link = item.querySelector('link')?.textContent || '';
                const pubDate = item.querySelector('pubDate')?.textContent || '';
                const source = xmlDoc.querySelector('channel > title')?.textContent || 'RSS Feed';

                // Try to extract image
                let image = item.querySelector('enclosure[type^="image"]')?.getAttribute('url') ||
                           item.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') ||
                           item.querySelector('media\\:content, content')?.getAttribute('url') ||
                           this.extractImageFromContent(description);

                // Skip articles without valid images
                if (!image || !image.startsWith('http')) {
                    return; // Skip this article
                }

                // Extract category
                const category = item.querySelector('category')?.textContent || 'general';

                articles.push({
                    id: newsAPI.generateId(link),
                    title: this.cleanHTML(title),
                    description: this.cleanHTML(description),
                    content: this.cleanHTML(description),
                    url: link,
                    image: image,
                    source: source,
                    author: source,
                    publishedAt: pubDate ? new Date(pubDate) : new Date(),
                    category: category.toLowerCase()
                });
            } catch (error) {
                console.error('Error parsing RSS item:', error);
            }
        });

        return articles;
    }

    // Parse Atom format
    parseAtom(xmlDoc, sourceUrl) {
        const entries = xmlDoc.querySelectorAll('entry');
        const articles = [];

        entries.forEach((entry, index) => {
            try {
                const title = entry.querySelector('title')?.textContent || '';
                const summary = entry.querySelector('summary')?.textContent || '';
                const link = entry.querySelector('link')?.getAttribute('href') || '';
                const updated = entry.querySelector('updated')?.textContent || '';
                const source = xmlDoc.querySelector('feed > title')?.textContent || 'Atom Feed';

                let image = entry.querySelector('media\\:thumbnail, thumbnail')?.getAttribute('url') ||
                           this.extractImageFromContent(summary);

                // Skip articles without valid images
                if (!image || !image.startsWith('http')) {
                    return; // Skip this article
                }

                const category = entry.querySelector('category')?.getAttribute('term') || 'general';

                articles.push({
                    id: newsAPI.generateId(link),
                    title: this.cleanHTML(title),
                    description: this.cleanHTML(summary),
                    content: this.cleanHTML(summary),
                    url: link,
                    image: image,
                    source: source,
                    author: source,
                    publishedAt: updated ? new Date(updated) : new Date(),
                    category: category.toLowerCase()
                });
            } catch (error) {
                console.error('Error parsing Atom entry:', error);
            }
        });

        return articles;
    }

    // Extract image from HTML content
    extractImageFromContent(html) {
        const imgMatch = html.match(/<img[^>]+src="([^">]+)"/);
        return imgMatch ? imgMatch[1] : null;
    }

    // Clean HTML tags from text
    cleanHTML(text) {
        const temp = document.createElement('div');
        temp.innerHTML = text;
        return temp.textContent || temp.innerText || '';
    }

    // Fetch all feeds for a language
    async fetchLanguageFeeds(language = 'en', category = 'all') {
        const languageFeeds = CONFIG.RSS_FEEDS[language] || CONFIG.RSS_FEEDS.en;

        // Filter by category if specified
        const feedsToFetch = category === 'all'
            ? languageFeeds
            : languageFeeds.filter(feed => feed.category === category);

        // Fetch all feeds in parallel
        const feedPromises = feedsToFetch.map(feed => this.fetchFeed(feed.url));
        const results = await Promise.allSettled(feedPromises);

        // Combine all articles
        const allArticles = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allArticles.push(...result.value);
            }
        });

        // Sort by date (newest first)
        allArticles.sort((a, b) => b.publishedAt - a.publishedAt);

        return allArticles;
    }

    // Combine RSS feeds with API results for MASSIVE content
    async getCombinedNews(category = 'general', language = 'en', page = 1, pageSize = 50) {
        const cacheKey = `combined_${category}_${language}`;

        // Check cache for the full dataset (not per page)
        const cached = this.combinedCache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            console.log(`📦 Using cached articles (${cached.articles.length} total)`);
            const uniqueArticles = cached.articles;

            // Return paginated results from cache
            if (page === 1) {
                return uniqueArticles.slice(0, 500);
            } else {
                const start = 500 + ((page - 2) * pageSize);
                const end = start + pageSize;
                return uniqueArticles.slice(start, end);
            }
        }

        // Cache miss - fetch fresh data
        const allArticles = [];

        try {
            // Fetch MINIMAL from APIs to avoid rate limits - just 1 page per API
            // Main content comes from RSS feeds (free and unlimited)
            const apiPromises = [];

            // Only fetch 1 page with 20 articles from each API
            apiPromises.push(newsAPI.fetchFromNewsAPI(category, language, 1, 20).catch(() => []));
            apiPromises.push(newsAPI.fetchFromGNews(category, language, 1, 20).catch(() => []));
            apiPromises.push(newsAPI.fetchFromCurrentsAPI(category, language, 1, 20).catch(() => []));
            apiPromises.push(newsAPI.fetchFromMediastack(category, language, 1, 20).catch(() => []));

            const apiResults = await Promise.all(apiPromises);
            apiResults.forEach(articles => {
                if (articles && articles.length > 0) {
                    allArticles.push(...articles);
                }
            });

            console.log(`✅ Fetched ${allArticles.length} articles from APIs (minimal to avoid rate limits)`);
        } catch (error) {
            console.warn('API failed:', error);
        }

        // Fetch ALL RSS feeds for maximum diversity
        try {
            const rssArticles = await this.fetchLanguageFeeds(language, category);
            if (rssArticles && rssArticles.length > 0) {
                allArticles.push(...rssArticles); // Add ALL RSS articles
                console.log(`✅ Added ${rssArticles.length} RSS articles`);
            }
        } catch (error) {
            console.warn('RSS failed:', error);
        }

        // Remove duplicates based on title similarity and URL
        const uniqueArticles = this.removeDuplicates(allArticles);

        // Sort by date (newest first)
        uniqueArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

        console.log(`📰 Total unique articles available: ${uniqueArticles.length}`);

        // Cache the full dataset for 5 minutes
        this.combinedCache.set(cacheKey, {
            articles: uniqueArticles,
            timestamp: Date.now()
        });

        // Clean old cache entries (keep only last 20 categories/languages)
        if (this.combinedCache.size > 20) {
            const firstKey = this.combinedCache.keys().next().value;
            this.combinedCache.delete(firstKey);
        }

        // For first page, return large amount from RSS+API; for subsequent pages, paginate
        if (page === 1) {
            // Return up to 200 articles on first load (mainly from RSS feeds)
            return uniqueArticles.slice(0, 200);
        } else {
            // Page 2 starts at 200, page 3 at 250, page 4 at 300, etc.
            const start = 200 + ((page - 2) * pageSize);
            const end = start + pageSize;
            return uniqueArticles.slice(start, end); // Subsequent loads: paginated
        }
    }

    // Remove duplicate articles
    removeDuplicates(articles) {
        const seen = new Set();
        const unique = [];

        articles.forEach(article => {
            // Create a unique key from URL and title
            const key = article.url || article.title.toLowerCase().replace(/\s+/g, '');

            if (!seen.has(key)) {
                seen.add(key);
                unique.push(article);
            }
        });

        return unique;
    }
}

// Initialize global RSS feed manager
const rssFeedManager = new RSSFeedManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSSFeedManager;
}
