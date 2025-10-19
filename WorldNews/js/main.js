/* ===========================
   MAIN APPLICATION LOGIC
   WorldNews.day
   =========================== */

class WorldNewsApp {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'all';
        this.currentView = 'grid';
        this.isLoading = false;
        this.articles = [];
        this.carouselPosition = 0;
        this.autoRefreshTimer = null;

        this.init();
    }

    // Initialize application
    async init() {
        this.setupEventListeners();
        this.startAutoRefresh();
        await this.loadInitialNews();
        this.initializeVideoManager();
        this.initializeAdSense();
    }

    // Initialize video manager
    initializeVideoManager() {
        if (typeof videoManager !== 'undefined') {
            videoManager.init();
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Navigation category clicks
        document.querySelectorAll('.main-nav a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                this.changeCategory(category);
                this.updateActiveNavLink(e.target);
            });
        });

        // Sidebar category clicks
        document.querySelectorAll('.categories-list a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                this.changeCategory(category);
            });
        });

        // Language change event
        window.addEventListener('languageChanged', () => {
            this.currentPage = 1;
            this.loadNews();
            this.loadFeaturedNews();
            this.loadTrendingNews();
        });

        // Search on Enter key
        document.getElementById('search-input')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchNews();
            }
        });

        // Window scroll for lazy loading images
        window.addEventListener('scroll', this.debounce(() => {
            this.lazyLoadImages();
        }, 200));
    }

    // Update active navigation link
    updateActiveNavLink(activeLink) {
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    // Load initial news
    async loadInitialNews() {
        await this.loadNews();
        await this.loadFeaturedNews();
        await this.loadTrendingNews();
    }

    // Load news articles
    async loadNews() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const language = i18n.getCurrentLanguage();
            const category = this.mapCategory(this.currentCategory);

            // Try RSS feeds combined with API
            const articles = await rssFeedManager.getCombinedNews(
                category,
                language,
                this.currentPage,
                CONFIG.DEFAULTS.articlesPerPage
            );

            if (this.currentPage === 1) {
                // Replace all articles on first page/refresh
                this.articles = articles;
            } else {
                // When loading more, remove duplicates before adding
                const existingIds = new Set(this.articles.map(a => a.id));
                const newArticles = articles.filter(a => !existingIds.has(a.id));
                this.articles = [...this.articles, ...newArticles];
            }

            // Keep all articles - they stay for 7 days naturally through cache
            this.renderArticles();

            // Hide load more button if no more articles
            if (articles.length < CONFIG.DEFAULTS.articlesPerPage) {
                document.getElementById('load-more-btn')?.classList.add('hidden');
            } else {
                document.getElementById('load-more-btn')?.classList.remove('hidden');
            }

        } catch (error) {
            console.error('Error loading news:', error);
            this.showError();
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    // Load featured news for carousel
    async loadFeaturedNews() {
        try {
            const language = i18n.getCurrentLanguage();

            // Always use 'general' for featured to ensure content
            const featured = await rssFeedManager.getCombinedNews('general', language, 1, 50);

            if (featured && featured.length > 0) {
                // Take first 10 articles with images for featured carousel
                this.renderFeaturedCarousel(featured.slice(0, 10));
            } else {
                console.warn('No featured articles found');
            }
        } catch (error) {
            console.error('Error loading featured news:', error);
        }
    }

    // Load trending news
    async loadTrendingNews() {
        try {
            const language = i18n.getCurrentLanguage();

            // Always use 'general' for trending to ensure content
            const trending = await rssFeedManager.getCombinedNews('general', language, 1, 50);

            if (trending && trending.length > 0) {
                // Take first 10 articles with images for trending
                this.renderTrendingNews(trending.slice(0, 10));
            } else {
                console.warn('No trending articles found');
            }
        } catch (error) {
            console.error('Error loading trending news:', error);
        }
    }

    // Render articles grid
    renderArticles() {
        const grid = document.getElementById('articles-grid');
        if (!grid) return;

        grid.innerHTML = '';

        this.articles.forEach((article, index) => {
            const articleCard = this.createArticleCard(article, index);
            grid.appendChild(articleCard);
        });

        this.lazyLoadImages();
    }

    // Create article card element
    createArticleCard(article, index) {
        const card = document.createElement('article');
        card.className = 'article-card';
        card.setAttribute('data-id', article.id);

        const timeAgo = i18n.formatTime(article.publishedAt);
        const readTime = newsAPI.calculateReadingTime(article.content || article.description);

        // Short preview for card (150 characters max)
        const shortLength = 150;
        let fullDescription = (article.description || '').replace(/\[\+\d+\s*chars?\]/gi, '...');
        let shortDescription = fullDescription;

        if (fullDescription.length > shortLength) {
            const truncated = fullDescription.substring(0, shortLength);
            const lastPeriod = truncated.lastIndexOf('.');
            const lastQuestion = truncated.lastIndexOf('?');
            const lastExclamation = truncated.lastIndexOf('!');
            const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

            if (sentenceEnd > shortLength * 0.5) {
                shortDescription = truncated.substring(0, sentenceEnd + 1);
            } else {
                shortDescription = truncated + '...';
            }
        }

        card.innerHTML = `
            <img src="${article.image}" alt="${article.title}" loading="lazy" onerror="this.src='${newsAPI.getPlaceholderImage(article.category)}'">
            <div class="article-content">
                <div class="article-meta">
                    <span class="article-source">
                        <i class="fas fa-newspaper"></i> ${article.source}
                    </span>
                    <span class="article-time">
                        <i class="far fa-clock"></i> ${timeAgo}
                    </span>
                </div>
                <h3>${article.title}</h3>
                <p class="article-description">${shortDescription}</p>
                <div class="article-footer">
                    <span class="read-time">
                        <i class="far fa-eye"></i> ${readTime} ${i18n.t('min_read')}
                    </span>
                    <button class="read-more-btn" onclick="event.stopPropagation()">
                        <i class="fas fa-book-open"></i> Read Full Story
                    </button>
                </div>
            </div>
        `;

        // Click to open article
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.share-btn')) {
                this.openArticle(article);
            }
        });

        return card;
    }

    // Create share buttons
    createShareButtons(article) {
        return `
            <button class="share-btn" onclick="shareArticle('twitter', '${article.url}', '${this.escapeHtml(article.title)}')" title="Share on Twitter">
                <i class="fab fa-twitter"></i>
            </button>
            <button class="share-btn" onclick="shareArticle('facebook', '${article.url}', '${this.escapeHtml(article.title)}')" title="Share on Facebook">
                <i class="fab fa-facebook"></i>
            </button>
            <button class="share-btn" onclick="shareArticle('linkedin', '${article.url}', '${this.escapeHtml(article.title)}')" title="Share on LinkedIn">
                <i class="fab fa-linkedin"></i>
            </button>
            <button class="share-btn" onclick="shareArticle('whatsapp', '${article.url}', '${this.escapeHtml(article.title)}')" title="Share on WhatsApp">
                <i class="fab fa-whatsapp"></i>
            </button>
        `;
    }

    // Render featured carousel
    renderFeaturedCarousel(articles) {
        const carousel = document.getElementById('featured-carousel');
        if (!carousel) return;

        carousel.innerHTML = '';

        articles.forEach(article => {
            const featuredCard = document.createElement('div');
            featuredCard.className = 'featured-article';

            featuredCard.innerHTML = `
                <img src="${article.image}" alt="${article.title}" onerror="this.src='${newsAPI.getPlaceholderImage(article.category)}'">
                <div class="featured-article-content">
                    <h3>${article.title}</h3>
                    <p>${article.description.substring(0, 120)}...</p>
                </div>
            `;

            featuredCard.addEventListener('click', () => this.openArticle(article));
            carousel.appendChild(featuredCard);
        });
    }

    // Render trending news
    renderTrendingNews(articles) {
        const trendingList = document.getElementById('trending-news');
        if (!trendingList) return;

        trendingList.innerHTML = '';

        articles.slice(0, 5).forEach((article, index) => {
            const trendingItem = document.createElement('div');
            trendingItem.className = 'trending-item';

            trendingItem.innerHTML = `
                <div class="trending-number">${index + 1}</div>
                <div>
                    <h4>${article.title}</h4>
                </div>
            `;

            trendingItem.addEventListener('click', () => this.openArticle(article));
            trendingList.appendChild(trendingItem);
        });
    }

    // Open article in modal
    openArticle(article) {
        const modal = document.getElementById('article-modal');
        const content = document.getElementById('modal-article-content');

        if (!modal || !content) return;

        const timeAgo = i18n.formatTime(article.publishedAt);
        const readTime = newsAPI.calculateReadingTime(article.content || article.description);
        const publishDate = new Date(article.publishedAt).toLocaleDateString(i18n.getCurrentLanguage(), {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Extract and clean content - remove [+chars] indicators
        let fullContent = article.content || article.description || '';
        let descriptionText = article.description || '';

        // Remove [+XXXX chars] patterns
        fullContent = fullContent.replace(/\[\+\d+\s*chars?\]/gi, '...');
        descriptionText = descriptionText.replace(/\[\+\d+\s*chars?\]/gi, '...');

        // Limit full story to 1500 characters
        if (fullContent.length > 1500) {
            fullContent = fullContent.substring(0, 1500);
            // Try to end at sentence
            const lastPeriod = fullContent.lastIndexOf('.');
            const lastQuestion = fullContent.lastIndexOf('?');
            const lastExclamation = fullContent.lastIndexOf('!');
            const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclamation);

            if (sentenceEnd > 900) { // At least 900 chars
                fullContent = fullContent.substring(0, sentenceEnd + 1);
            } else {
                fullContent = fullContent + '...';
            }
        }

        // Format content with paragraphs
        const formattedContent = fullContent
            .split('\n')
            .filter(p => p.trim().length > 0)
            .map(p => `<p>${p.trim()}</p>`)
            .join('');

        content.innerHTML = `
            <article class="modal-article">
                <div class="modal-article-header">
                    <img src="${article.image}" alt="${article.title}" class="modal-article-image" onerror="this.src='${newsAPI.getPlaceholderImage(article.category)}'">
                    <div class="modal-article-category-badge">${article.category || 'News'}</div>
                </div>

                <div class="modal-article-body">
                    <h1 class="modal-article-title">${article.title}</h1>

                    <div class="modal-article-meta">
                        <div class="meta-item">
                            <i class="fas fa-newspaper"></i>
                            <span>${article.source}</span>
                        </div>
                        ${article.author && article.author !== 'Unknown' ? `
                        <div class="meta-item">
                            <i class="fas fa-user"></i>
                            <span>${article.author}</span>
                        </div>
                        ` : ''}
                        <div class="meta-item">
                            <i class="far fa-calendar"></i>
                            <span>${publishDate}</span>
                        </div>
                        <div class="meta-item">
                            <i class="far fa-clock"></i>
                            <span>${timeAgo}</span>
                        </div>
                        <div class="meta-item">
                            <i class="far fa-eye"></i>
                            <span>${readTime} min read</span>
                        </div>
                    </div>

                    <div class="modal-article-content">
                        <h3>Full Story</h3>
                        ${formattedContent}
                    </div>

                    <div class="modal-article-actions">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn-read-source">
                            <i class="fas fa-external-link-alt"></i>
                            Read Full Article at Source
                        </a>

                        <div class="modal-share-buttons">
                            <span class="share-label">Share:</span>
                            ${this.createShareButtons(article)}
                        </div>
                    </div>
                </div>
            </article>
        `;

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Scroll to top of modal content
        content.scrollTop = 0;
    }

    // Change category
    changeCategory(category) {
        this.currentCategory = category;
        this.currentPage = 1;
        this.articles = [];

        // Close mobile menu if open
        const nav = document.querySelector('.main-nav ul');
        if (nav && nav.classList.contains('mobile-active')) {
            nav.classList.remove('mobile-active');
        }

        // Clear caches for fresh content
        if (window.newsAPI) {
            newsAPI.clearCache();
        }
        if (window.rssFeedManager && rssFeedManager.combinedCache) {
            rssFeedManager.combinedCache.clear();
        }

        // Reload all sections
        this.loadNews();
        this.loadFeaturedNews();
        this.loadTrendingNews();
    }

    // Map category names
    mapCategory(category) {
        if (category === 'all') return 'general';
        return category;
    }

    // Change view (grid/list)
    changeView(view) {
        this.currentView = view;
        const grid = document.getElementById('articles-grid');

        if (view === 'list') {
            grid?.classList.add('list-view');
        } else {
            grid?.classList.remove('list-view');
        }

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        document.querySelector(`.view-btn[data-view="${view}"]`)?.classList.add('active');
    }

    // Load more articles
    loadMoreArticles() {
        this.currentPage++;
        this.loadNews();
    }

    // Search news
    async searchNews() {
        const searchInput = document.getElementById('search-input');
        const query = searchInput?.value.trim();

        if (!query) return;

        this.showLoading();

        try {
            const language = i18n.getCurrentLanguage();
            const results = await newsAPI.searchNews(query, language, 1, 20);

            this.articles = results;
            this.renderArticles();

            if (results.length === 0) {
                this.showNoResults();
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError();
        } finally {
            this.hideLoading();
        }
    }

    // Move carousel
    moveCarousel(direction) {
        const carousel = document.getElementById('featured-carousel');
        if (!carousel) return;

        const cardWidth = 400 + 24; // Card width + gap
        this.carouselPosition += direction * cardWidth;

        const maxScroll = carousel.scrollWidth - carousel.clientWidth;
        this.carouselPosition = Math.max(0, Math.min(this.carouselPosition, maxScroll));

        carousel.scrollTo({
            left: this.carouselPosition,
            behavior: 'smooth'
        });
    }

    // Auto refresh news every 30 minutes
    startAutoRefresh() {
        this.autoRefreshTimer = setInterval(() => {
            console.log('Auto-refreshing news every 30 minutes...');
            this.showRefreshNotification();

            // Clear all caches for fresh content
            newsAPI.clearCache();
            rssFeedManager.combinedCache.clear();

            this.currentPage = 1;
            this.loadNews();
            this.loadFeaturedNews();
            this.loadTrendingNews();
        }, CONFIG.DEFAULTS.autoRefreshInterval);
    }

    // Show refresh notification
    showRefreshNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            animation: slideIn 0.3s ease;
        `;
        notification.innerHTML = `
            <i class="fas fa-sync-alt" style="margin-right: 8px;"></i>
            ${i18n.t('refreshing_news') || i18n.t('loading')}
        `;
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Show loading indicator
    showLoading() {
        document.getElementById('loading')?.classList.remove('hidden');
    }

    // Hide loading indicator
    hideLoading() {
        document.getElementById('loading')?.classList.add('hidden');
    }

    // Show error message
    showError() {
        const grid = document.getElementById('articles-grid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--primary-red); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem; color: var(--gray-600);">${i18n.t('error_loading')}</p>
                </div>
            `;
        }
    }

    // Show no results message
    showNoResults() {
        const grid = document.getElementById('articles-grid');
        if (grid) {
            grid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
                    <i class="fas fa-search" style="font-size: 3rem; color: var(--gray-400); margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem; color: var(--gray-600);">${i18n.t('no_articles')}</p>
                </div>
            `;
        }
    }

    // Lazy load images
    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src; // Trigger load
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Initialize Google AdSense
    initializeAdSense() {
        // AdSense is initialized in HTML, this is for dynamic ad insertion
        if (window.adsbygoogle) {
            document.querySelectorAll('.adsbygoogle').forEach(ad => {
                try {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                } catch (error) {
                    console.error('AdSense error:', error);
                }
            });
        }
    }

    // Utility: Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Utility: Escape HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Manual refresh function
function manualRefresh() {
    const btn = document.querySelector('.refresh-btn');
    btn.classList.add('refreshing');

    // Clear all caches for fresh content
    newsAPI.clearCache();
    rssFeedManager.combinedCache.clear();

    app.currentPage = 1;
    app.loadNews();
    app.loadFeaturedNews();
    app.loadTrendingNews();

    // Show notification
    app.showRefreshNotification();

    // Remove refreshing state after 2 seconds
    setTimeout(() => {
        btn.classList.remove('refreshing');
    }, 2000);
}

// Global functions for HTML onclick handlers
function changeView(view) {
    app.changeView(view);
}

function loadMoreArticles() {
    app.loadMoreArticles();
}

function searchNews() {
    app.searchNews();
}

function moveCarousel(direction) {
    app.moveCarousel(direction);
}

function closeArticleModal() {
    const modal = document.getElementById('article-modal');
    modal?.classList.add('hidden');
    document.body.style.overflow = '';
}

function closeBreakingNews() {
    const banner = document.getElementById('breaking-news-banner');
    banner?.classList.add('hidden');
}

function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav ul');
    nav?.classList.toggle('mobile-active');

    // Close menu when clicking outside (on overlay)
    if (nav && nav.classList.contains('mobile-active')) {
        const closeOnClickOutside = (e) => {
            if (!nav.contains(e.target) && !e.target.closest('.mobile-menu-toggle')) {
                nav.classList.remove('mobile-active');
                document.removeEventListener('click', closeOnClickOutside);
            }
        };
        // Add listener after a short delay to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', closeOnClickOutside);
        }, 100);
    }
}

function adjustFontSize(action) {
    const root = document.documentElement;
    const currentSize = parseFloat(getComputedStyle(root).getPropertyValue('--font-size-multiplier'));

    let newSize = currentSize;
    if (action === 'increase' && currentSize < 1.5) {
        newSize = currentSize + 0.1;
    } else if (action === 'decrease' && currentSize > 0.8) {
        newSize = currentSize - 0.1;
    }

    root.style.setProperty('--font-size-multiplier', newSize);
    localStorage.setItem('worldnews_fontsize', newSize);
}

function shareArticle(platform, url, title) {
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
    };

    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

function subscribeNewsletter(event) {
    event.preventDefault();

    const emailInput = document.getElementById('newsletter-email');
    const email = emailInput?.value;

    if (!email) return;

    // Here you would integrate with your newsletter service
    // For now, just show success message
    alert(i18n.t('subscription_success'));
    emailInput.value = '';
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorldNewsApp();

    // Restore font size
    const savedFontSize = localStorage.getItem('worldnews_fontsize');
    if (savedFontSize) {
        document.documentElement.style.setProperty('--font-size-multiplier', savedFontSize);
    }

    // Close modal on background click
    document.getElementById('article-modal')?.addEventListener('click', (e) => {
        if (e.target.id === 'article-modal') {
            closeArticleModal();
        }
    });
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WorldNewsApp;
}
