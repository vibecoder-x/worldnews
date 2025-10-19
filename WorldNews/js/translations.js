/* ===========================
   TRANSLATIONS
   English Only Support
   =========================== */

const TRANSLATIONS = {
    en: {
        // Navigation
        nav_home: 'Home',
        nav_world: 'World',
        nav_politics: 'Politics',
        nav_business: 'Business',
        nav_tech: 'Technology',
        nav_health: 'Health',
        nav_sports: 'Sports',
        nav_entertainment: 'Entertainment',

        // UI Elements
        breaking: 'BREAKING',
        featured_news: 'Featured News',
        latest_news: 'Latest News',
        trending: 'Trending Now',
        categories: 'Categories',
        search_placeholder: 'Search news...',
        loading: 'Loading news...',
        load_more: 'Load More',
        read_more: 'Read More',
        all: 'All',

        // Video Section
        video_section: 'Video',
        live_video: 'Live Video',
        live_now: 'LIVE NOW',
        nav_news: 'News',

        // Newsletter
        newsletter_title: 'Stay Updated',
        newsletter_subtitle: 'Get the latest news delivered to your inbox',
        email_placeholder: 'Enter your email',
        subscribe: 'Subscribe',
        privacy_note: 'We respect your privacy',
        subscription_success: 'Thank you for subscribing!',
        subscription_error: 'Subscription failed. Please try again.',

        // Footer
        footer_about: 'Your trusted source for international news coverage.',
        quick_links: 'Quick Links',
        about: 'About Us',
        contact: 'Contact',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        follow_us: 'Follow Us',
        rights: 'All rights reserved',
        disclaimer: 'News content aggregated from various trusted international sources.',

        // Time
        minutes_ago: 'minutes ago',
        hours_ago: 'hours ago',
        days_ago: 'days ago',
        just_now: 'Just now',
        min_read: 'min read',

        // Messages
        no_articles: 'No articles found',
        error_loading: 'Error loading articles. Please try again.',
        share_article: 'Share this article',
        copy_link: 'Copy link',
        link_copied: 'Link copied!',
        refreshing_news: 'Refreshing news...',

        // Geolocation
        nearby_news: 'Nearby News',
        search_radius: 'Radius',
        loading_local: 'Detecting location...',
        location_detected: 'Location detected',
        location_error: 'Location unavailable',
        refresh_location: 'Refresh Location',
        save_location: 'Save Location',
        saved_locations: 'Saved Locations',
        no_local_news: 'No local news available',
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TRANSLATIONS;
}
