/* ===========================
   RSS FEED AGGREGATION
   Parse and display RSS feeds
   =========================== */

class RSSFeedManager {
    constructor() {
        this.feeds = [];
        this.parser = new DOMParser();
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

                if (!image) {
                    image = newsAPI.getPlaceholderImage();
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

                if (!image) {
                    image = newsAPI.getPlaceholderImage();
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

    // Combine RSS feeds with API results
    async getCombinedNews(category = 'general', language = 'en', page = 1, pageSize = 12) {
        try {
            // Try to fetch from API first
            const apiArticles = await newsAPI.fetchNews(category, language, page, pageSize);

            // If API succeeds, return those articles
            if (apiArticles && apiArticles.length > 0) {
                return apiArticles;
            }
        } catch (error) {
            console.warn('API failed, falling back to RSS feeds');
        }

        // Fallback to RSS feeds
        const rssArticles = await this.fetchLanguageFeeds(language, category);

        // Paginate RSS results
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return rssArticles.slice(start, end);
    }
}

// Initialize global RSS feed manager
const rssFeedManager = new RSSFeedManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RSSFeedManager;
}
