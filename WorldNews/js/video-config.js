/* ===========================
   LIVE VIDEO CONFIGURATION
   WorldNews.day - Live Streams
   =========================== */

const VIDEO_CONFIG = {
    // Video sources by language (regular news videos, always available)
    LIVE_STREAMS: {
        en: [
            {
                id: 'news-1',
                name: 'CNN News Report',
                category: 'news',
                type: 'youtube',
                videoId: 'w_Ma8oQLmSM',
                thumbnail: 'https://i.ytimg.com/vi/w_Ma8oQLmSM/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-2',
                name: 'BBC World News',
                category: 'news',
                type: 'youtube',
                videoId: '9Auq9mYxFEE',
                thumbnail: 'https://i.ytimg.com/vi/9Auq9mYxFEE/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-3',
                name: 'NBC News Today',
                category: 'news',
                type: 'youtube',
                videoId: 'iwPS6M5RRJ4',
                thumbnail: 'https://i.ytimg.com/vi/iwPS6M5RRJ4/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-4',
                name: 'Sky News Report',
                category: 'news',
                type: 'youtube',
                videoId: 'XOacA3RYrXk',
                thumbnail: 'https://i.ytimg.com/vi/XOacA3RYrXk/maxresdefault.jpg',
                featured: false
            },
            {
                id: 'business-1',
                name: 'Bloomberg Markets',
                category: 'business',
                type: 'youtube',
                videoId: 'dp8PhLsUcFE',
                thumbnail: 'https://i.ytimg.com/vi/dp8PhLsUcFE/maxresdefault.jpg',
                featured: false
            },
            {
                id: 'business-2',
                name: 'CNBC Business News',
                category: 'business',
                type: 'youtube',
                videoId: '9NyxcX3rhQs',
                thumbnail: 'https://i.ytimg.com/vi/9NyxcX3rhQs/maxresdefault.jpg',
                featured: false
            }
        ],
        es: [
            {
                id: 'news-es-1',
                name: 'DW Español Noticias',
                category: 'news',
                type: 'youtube',
                videoId: 'QCjk_NPsIqU',
                thumbnail: 'https://i.ytimg.com/vi/QCjk_NPsIqU/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-es-2',
                name: 'Euronews Español',
                category: 'news',
                type: 'youtube',
                videoId: 'O9mOtdZ-nSk',
                thumbnail: 'https://i.ytimg.com/vi/O9mOtdZ-nSk/maxresdefault.jpg',
                featured: true
            }
        ],
        fr: [
            {
                id: 'news-fr-1',
                name: 'France 24',
                category: 'news',
                type: 'youtube',
                videoId: 'l8PMl7tUDIE',
                thumbnail: 'https://i.ytimg.com/vi/l8PMl7tUDIE/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-fr-2',
                name: 'Euronews Français',
                category: 'news',
                type: 'youtube',
                videoId: 'NvqKZl_7r2w',
                thumbnail: 'https://i.ytimg.com/vi/NvqKZl_7r2w/maxresdefault.jpg',
                featured: true
            }
        ],
        de: [
            {
                id: 'news-de-1',
                name: 'DW Deutsch',
                category: 'news',
                type: 'youtube',
                videoId: 'comp1hXd3w0',
                thumbnail: 'https://i.ytimg.com/vi/comp1hXd3w0/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-de-2',
                name: 'WELT Nachrichten',
                category: 'news',
                type: 'youtube',
                videoId: 'iHu7N2OdvXg',
                thumbnail: 'https://i.ytimg.com/vi/iHu7N2OdvXg/maxresdefault.jpg',
                featured: true
            }
        ],
        ar: [
            {
                id: 'news-ar-1',
                name: 'الجزيرة',
                category: 'news',
                type: 'youtube',
                videoId: 'gCNeDWCI0vo',
                thumbnail: 'https://i.ytimg.com/vi/gCNeDWCI0vo/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-ar-2',
                name: 'العربية',
                category: 'news',
                type: 'youtube',
                videoId: 'Dd6NHzP4xmY',
                thumbnail: 'https://i.ytimg.com/vi/Dd6NHzP4xmY/maxresdefault.jpg',
                featured: true
            }
        ],
        zh: [
            {
                id: 'news-zh-1',
                name: 'CCTV中文国际',
                category: 'news',
                type: 'youtube',
                videoId: 'B-4PoDq3tAM',
                thumbnail: 'https://i.ytimg.com/vi/B-4PoDq3tAM/maxresdefault.jpg',
                featured: true
            }
        ],
        hi: [
            {
                id: 'news-hi-1',
                name: 'NDTV India',
                category: 'news',
                type: 'youtube',
                videoId: 'WP5ShsAAoro',
                thumbnail: 'https://i.ytimg.com/vi/WP5ShsAAoro/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'news-hi-2',
                name: 'Aaj Tak',
                category: 'news',
                type: 'youtube',
                videoId: 'Nq2wYlWFucg',
                thumbnail: 'https://i.ytimg.com/vi/Nq2wYlWFucg/maxresdefault.jpg',
                featured: true
            }
        ]
    },

    // Video categories
    CATEGORIES: {
        news: 'News',
        business: 'Business',
        sports: 'Sports',
        events: 'Events',
        weather: 'Weather'
    },

    // Auto-refresh interval (10 minutes)
    REFRESH_INTERVAL: 600000,

    // Video player settings
    PLAYER_SETTINGS: {
        autoplay: true,
        muted: true,
        controls: true,
        modestbranding: true,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin
    },

    // Layout options
    LAYOUTS: {
        SINGLE_FEATURED: 'single',
        GRID_FOUR: 'grid',
        CAROUSEL: 'carousel'
    },

    // Default layout
    DEFAULT_LAYOUT: 'grid',

    // YouTube API settings
    YOUTUBE: {
        // Note: In production, use environment variable or server-side API
        enabled: true,
        embedUrl: 'https://www.youtube.com/embed/',
        apiUrl: 'https://www.googleapis.com/youtube/v3'
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VIDEO_CONFIG;
}
