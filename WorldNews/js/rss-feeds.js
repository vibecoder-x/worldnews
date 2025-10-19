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

                // Extract category
                const category = item.querySelector('category')?.textContent || 'general';

                // Use placeholder if no image found
                if (!image || !image.startsWith('http')) {
                    image = newsAPI.getPlaceholderImage(category);
                }

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

                const category = entry.querySelector('category')?.getAttribute('term') || 'general';

                // Use placeholder if no image found
                if (!image || !image.startsWith('http')) {
                    image = newsAPI.getPlaceholderImage(category);
                }

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
        // 'general' and 'all' should fetch ALL feeds
        let feedsToFetch = (category === 'all' || category === 'general')
            ? languageFeeds
            : languageFeeds.filter(feed => feed.category === category);

        // For non-English languages without category-specific feeds:
        // Instead of showing ALL feeds (which makes every category identical),
        // fetch all feeds but filter articles by keyword matching
        const needsKeywordFiltering = feedsToFetch.length === 0 && category !== 'all' && category !== 'general';
        if (needsKeywordFiltering) {
            console.log(`No RSS feeds for category "${category}" in language "${language}", will use keyword filtering`);
            feedsToFetch = languageFeeds;
        }

        // Fetch all feeds in parallel
        const feedPromises = feedsToFetch.map(feed => this.fetchFeed(feed.url));
        const results = await Promise.allSettled(feedPromises);

        // Combine all articles
        let allArticles = [];
        results.forEach(result => {
            if (result.status === 'fulfilled' && result.value) {
                allArticles.push(...result.value);
            }
        });

        // Apply keyword filtering if needed
        if (needsKeywordFiltering) {
            allArticles = this.filterArticlesByCategory(allArticles, category, language);
            console.log(`Keyword filtering: ${allArticles.length} articles matched category "${category}"`);
        }

        // Sort by date (newest first)
        allArticles.sort((a, b) => b.publishedAt - a.publishedAt);

        return allArticles;
    }

    // Filter articles by category using keyword matching
    filterArticlesByCategory(articles, category, language) {
        // Category keywords for filtering (multilingual)
        const categoryKeywords = {
            business: ['business', 'economy', 'market', 'stock', 'finance', 'company', 'trade', 'banco', 'economía', 'mercado', 'économie', 'marché', 'wirtschaft', 'unternehmen', 'اقتصاد', 'سوق', '经济', '市场', 'व्यापार', 'बाजार'],
            technology: ['technology', 'tech', 'digital', 'software', 'computer', 'internet', 'AI', 'app', 'tecnología', 'technologie', 'technik', 'تقنية', 'تكنولوجيا', '科技', '技术', 'प्रौद्योगिकी'],
            sports: ['sport', 'football', 'soccer', 'basketball', 'tennis', 'game', 'match', 'player', 'team', 'deporte', 'fútbol', 'رياضة', 'كرة', '体育', '足球', 'खेल', 'फुटबॉल'],
            health: ['health', 'medical', 'doctor', 'hospital', 'disease', 'medicine', 'patient', 'salud', 'médico', 'santé', 'médecin', 'gesundheit', 'arzt', 'صحة', 'طبيب', '健康', '医疗', 'स्वास्थ्य', 'चिकित्सा'],
            entertainment: ['entertainment', 'movie', 'film', 'music', 'celebrity', 'actor', 'TV', 'show', 'entretenimiento', 'película', 'divertissement', 'film', 'unterhaltung', 'ترفيه', 'فيلم', '娱乐', '电影', 'मनोरंजन', 'फिल्म'],
            politics: ['politic', 'government', 'president', 'minister', 'election', 'vote', 'parliament', 'política', 'gobierno', 'politique', 'gouvernement', 'politik', 'regierung', 'سياسة', 'حكومة', '政治', '政府', 'राजनीति', 'सरकार'],
            world: ['world', 'international', 'global', 'country', 'nation', 'mundial', 'monde', 'welt', 'عالمي', 'دولي', '世界', '国际', 'विश्व', 'अंतरराष्ट्रीय']
        };

        const keywords = categoryKeywords[category] || [];
        if (keywords.length === 0) return articles;

        // Filter articles that contain category keywords in title or description
        return articles.filter(article => {
            const text = `${article.title} ${article.description}`.toLowerCase();
            return keywords.some(keyword => text.includes(keyword.toLowerCase()));
        });
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
                return uniqueArticles.slice(0, 200);
            } else {
                const start = 200 + ((page - 2) * pageSize);
                const end = start + pageSize;
                return uniqueArticles.slice(start, end);
            }
        }

        // Cache miss - fetch fresh data
        const allArticles = [];

        // Only use APIs for English to avoid language mixing issues
        // Non-English languages rely purely on curated RSS feeds
        if (language === 'en') {
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

                console.log(`✅ Fetched ${allArticles.length} articles from APIs (English only)`);
            } catch (error) {
                console.warn('API failed:', error);
            }
        } else {
            console.log(`📰 Using RSS feeds only for language: ${language} (avoids language mixing)`);
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
