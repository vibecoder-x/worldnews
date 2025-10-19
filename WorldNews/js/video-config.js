/* ===========================
   LIVE VIDEO CONFIGURATION
   WorldNews.day - Live Streams
   =========================== */

const VIDEO_CONFIG = {
    // Live stream sources by language
    LIVE_STREAMS: {
        en: [
            {
                id: 'cnn-live',
                name: 'CNN Live',
                category: 'news',
                type: 'youtube',
                channelId: 'UCupvZG-5ko_eiXAupbDfxWw',
                videoId: 'live', // Will be auto-fetched
                thumbnail: 'https://i.ytimg.com/vi/w_Ma8oQLmSM/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'bbc-news',
                name: 'BBC News Live',
                category: 'news',
                type: 'youtube',
                channelId: 'UC16niRr50-MSBwiO3YDb3RA',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/9Auq9mYxFEE/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'nbc-news',
                name: 'NBC News NOW',
                category: 'news',
                type: 'youtube',
                channelId: 'UCeY0bbntWzzVIaj2z3QigXg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/iwPS6M5RRJ4/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'sky-news',
                name: 'Sky News',
                category: 'news',
                type: 'youtube',
                channelId: 'UCoMdktPbSTixAyNGwb-UYkQ',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/9Auq9mYxFEE/maxresdefault.jpg',
                featured: false
            },
            {
                id: 'bloomberg',
                name: 'Bloomberg TV',
                category: 'business',
                type: 'youtube',
                channelId: 'UCIALMKvObZNtJ6AmdCLP7Lg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/dp8PhLsUcFE/maxresdefault.jpg',
                featured: false
            },
            {
                id: 'cnbc',
                name: 'CNBC Television',
                category: 'business',
                type: 'youtube',
                channelId: 'UCrp_UI8XtuYfpiqluWLD7Lw',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/9NyxcX3rhQs/maxresdefault.jpg',
                featured: false
            }
        ],
        es: [
            {
                id: 'dw-espanol',
                name: 'DW Español',
                category: 'news',
                type: 'youtube',
                channelId: 'UCT4Jg8h03dD0iN3Pb5L0PMA',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/QCjk_NPsIqU/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'euronews-es',
                name: 'Euronews Español',
                category: 'news',
                type: 'youtube',
                channelId: 'UCtu5cRncCBDB66WMxQp64cQ',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/O9mOtdZ-nSk/maxresdefault.jpg',
                featured: true
            }
        ],
        fr: [
            {
                id: 'france24',
                name: 'France 24',
                category: 'news',
                type: 'youtube',
                channelId: 'UCQfwfsi5VrQ8yKZ-UWmAEFg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/l8PMl7tUDIE/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'euronews-fr',
                name: 'Euronews Français',
                category: 'news',
                type: 'youtube',
                channelId: 'UCW2QcKZiU8aUGg4yxCIditg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/NvqKZl_7r2w/maxresdefault.jpg',
                featured: true
            }
        ],
        de: [
            {
                id: 'dw-deutsch',
                name: 'DW Deutsch',
                category: 'news',
                type: 'youtube',
                channelId: 'UCknLrEdhRCp1aegoMqRaCZg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/comp1hXd3w0/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'welt',
                name: 'WELT Nachrichtensender',
                category: 'news',
                type: 'youtube',
                channelId: 'UCZMsvbAhhRblVGXmEXW8BhA',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/iHu7N2OdvXg/maxresdefault.jpg',
                featured: true
            }
        ],
        ar: [
            {
                id: 'aljazeera-arabic',
                name: 'الجزيرة مباشر',
                category: 'news',
                type: 'youtube',
                channelId: 'UCfiwzLy-8yKzIbsmZTzxDgw',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/gCNeDWCI0vo/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'alarabiya',
                name: 'العربية',
                category: 'news',
                type: 'youtube',
                channelId: 'UCNye-wNBqNL5ZzHSJj3l8Bg',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/Dd6NHzP4xmY/maxresdefault.jpg',
                featured: true
            }
        ],
        zh: [
            {
                id: 'cctv4',
                name: 'CCTV中文国际',
                category: 'news',
                type: 'youtube',
                channelId: 'UCj0TRKvcoqOdabbLxMCola4w',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/B-4PoDq3tAM/maxresdefault.jpg',
                featured: true
            }
        ],
        hi: [
            {
                id: 'ndtv-india',
                name: 'NDTV India',
                category: 'news',
                type: 'youtube',
                channelId: 'UCZFMm1mMw0F81Z37aaEzTUA',
                videoId: 'live',
                thumbnail: 'https://i.ytimg.com/vi/WP5ShsAAoro/maxresdefault.jpg',
                featured: true
            },
            {
                id: 'aaj-tak',
                name: 'Aaj Tak',
                category: 'news',
                type: 'youtube',
                channelId: 'UCt4t-jeY85JegMlZ-E5UWtA',
                videoId: 'live',
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
