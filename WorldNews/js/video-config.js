/* ===========================
   LIVE VIDEO CONFIGURATION
   WorldNews.day - Live Streams
   =========================== */

const VIDEO_CONFIG = {
    // News video sources by language (BBC-style news videos)
    LIVE_STREAMS: {
        en: [
            {
                id: 'world-news-1',
                name: 'Global Headlines Today',
                category: 'world',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk',
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                duration: '15:30',
                description: 'Latest global news coverage and breaking stories from around the world',
                featured: true
            },
            {
                id: 'politics-1',
                name: 'Political Analysis',
                category: 'politics',
                type: 'youtube',
                videoId: 'y6120QOlsfU',
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                duration: '12:45',
                description: 'In-depth political coverage and expert analysis',
                featured: true
            },
            {
                id: 'business-1',
                name: 'Business Update',
                category: 'business',
                type: 'youtube',
                videoId: 'dv13gl0a-FA',
                thumbnail: 'https://i.ytimg.com/vi/dv13gl0a-FA/maxresdefault.jpg',
                duration: '10:20',
                description: 'Markets, economy and business news roundup',
                featured: false
            },
            {
                id: 'tech-1',
                name: 'Technology Report',
                category: 'technology',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk',
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                duration: '8:15',
                description: 'Latest developments in tech and innovation',
                featured: false
            },
            {
                id: 'world-news-2',
                name: 'International Report',
                category: 'world',
                type: 'youtube',
                videoId: 'y6120QOlsfU',
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                duration: '14:00',
                description: 'International affairs and diplomatic developments',
                featured: false
            },
            {
                id: 'health-1',
                name: 'Health News',
                category: 'health',
                type: 'youtube',
                videoId: 'dv13gl0a-FA',
                thumbnail: 'https://i.ytimg.com/vi/dv13gl0a-FA/maxresdefault.jpg',
                duration: '9:30',
                description: 'Medical breakthroughs and health updates',
                featured: false
            },
            {
                id: 'sports-1',
                name: 'Sports Highlights',
                category: 'sports',
                type: 'youtube',
                videoId: 'jfKfPfyJRdk',
                thumbnail: 'https://i.ytimg.com/vi/jfKfPfyJRdk/maxresdefault.jpg',
                duration: '11:45',
                description: 'Top sports stories and match highlights',
                featured: false
            },
            {
                id: 'entertainment-1',
                name: 'Entertainment News',
                category: 'entertainment',
                type: 'youtube',
                videoId: 'y6120QOlsfU',
                thumbnail: 'https://i.ytimg.com/vi/y6120QOlsfU/maxresdefault.jpg',
                duration: '7:20',
                description: 'Latest from film, music and culture',
                featured: false
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
