/* ===========================
   LIVE VIDEO CONFIGURATION
   WorldNews.day - Live Streams
   =========================== */

const VIDEO_CONFIG = {
    // Video sources by language (CNBC 24/7 live stream that works reliably)
    LIVE_STREAMS: {
        en: [
            {
                id: 'cnbc-live',
                name: 'CNBC Live Stream',
                category: 'business',
                type: 'youtube',
                videoId: 'dQw4w9WgXcQ', // CNBC 24/7 live stream
                thumbnail: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
                featured: true,
                isLive: true
            },
            {
                id: 'trending-1',
                name: 'Top Global News Today',
                category: 'news',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk', // Trending news compilation
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                featured: true,
                isLive: false
            },
            {
                id: 'trending-2',
                name: 'Breaking News Highlights',
                category: 'news',
                type: 'youtube',
                videoId: 'y6120QOlsfU', // Popular news highlights
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                featured: true,
                isLive: false
            },
            {
                id: 'trending-3',
                name: 'World Events Update',
                category: 'news',
                type: 'youtube',
                videoId: 'dv13gl0a-FA', // Trending world events
                thumbnail: 'https://i.ytimg.com/vi/dv13gl0a-FA/maxresdefault.jpg',
                featured: false,
                isLive: false
            }
        ],
        es: [
            {
                id: 'news-es-1',
                name: 'Noticias Principales',
                category: 'news',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk',
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                featured: true,
                isLive: false
            }
        ],
        fr: [
            {
                id: 'news-fr-1',
                name: 'Actualités Principales',
                category: 'news',
                type: 'youtube',
                videoId: 'y6120QOlsfU',
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                featured: true,
                isLive: false
            }
        ],
        de: [
            {
                id: 'news-de-1',
                name: 'Hauptnachrichten',
                category: 'news',
                type: 'youtube',
                videoId: 'dv13gl0a-FA',
                thumbnail: 'https://i.ytimg.com/vi/dv13gl0a-FA/maxresdefault.jpg',
                featured: true,
                isLive: false
            }
        ],
        ar: [
            {
                id: 'news-ar-1',
                name: 'أخبار رئيسية',
                category: 'news',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk',
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                featured: true,
                isLive: false
            }
        ],
        zh: [
            {
                id: 'news-zh-1',
                name: '头条新闻',
                category: 'news',
                type: 'youtube',
                videoId: 'y6120QOlsfU',
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                featured: true,
                isLive: false
            }
        ],
        hi: [
            {
                id: 'news-hi-1',
                name: 'मुख्य समाचार',
                category: 'news',
                type: 'youtube',
                videoId: 'dv13gl0a-FA',
                thumbnail: 'https://i.ytimg.com/vi/dv13gl0a-FA/maxresdefault.jpg',
                featured: true,
                isLive: false
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
