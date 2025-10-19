/* ===========================
   LOCAL NEWS MANAGER
   Location-Based News Aggregation
   =========================== */

class LocalNewsManager {
    constructor() {
        this.localFeeds = [];
        this.nearbyNews = [];
        this.radiusKm = 100; // Default radius for nearby news
        this.userPreferences = this.loadPreferences();
    }

    // Initialize with geolocation
    async init() {
        if (!geoService.getCurrentLocation()) {
            await geoService.init();
        }

        // Auto-switch language based on location
        this.autoSwitchLanguage();

        // Load local news sources
        await this.loadLocalNewsSources();

        // Listen for location changes
        geoService.onLocationChange(() => {
            this.autoSwitchLanguage();
            this.loadLocalNewsSources();
        });
    }

    // Auto-switch language based on location
    autoSwitchLanguage() {
        const detectedLanguage = geoService.getLanguageFromLocation();
        const currentLanguage = i18n.getCurrentLanguage();

        // Only auto-switch if user hasn't manually selected a language
        const manualSelection = localStorage.getItem('worldnews_manual_language');

        if (!manualSelection && detectedLanguage !== currentLanguage) {
            console.log(`🌍 Auto-switching language to: ${detectedLanguage}`);
            i18n.changeLanguage(detectedLanguage);
        }
    }

    // Load local news sources based on location
    async loadLocalNewsSources() {
        const location = geoService.getCurrentLocation();
        if (!location) {
            console.warn('No location available for local news');
            this.displayNoLocalNews();
            return;
        }

        console.log(`📍 Loading news for: ${geoService.getLocationString()}`);

        // Get nearby RSS feeds
        this.localFeeds = geoService.getLocalNewsSources(this.radiusKm);

        if (this.localFeeds.length === 0) {
            console.log('No local feeds found, using regional/national feeds');
            this.loadRegionalFeeds();
        }

        // Fetch news from local feeds with timeout
        try {
            await Promise.race([
                this.fetchLocalNews(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
        } catch (error) {
            console.warn('Local news loading timed out or failed:', error);
            this.displayNoLocalNews();
        }
    }

    // Display no local news message
    displayNoLocalNews() {
        const container = document.getElementById('nearby-news');
        if (container) {
            container.innerHTML = `
                <div class="no-local-news">
                    <i class="fas fa-map-marker-alt"></i>
                    <p>Local news unavailable</p>
                    <small>Showing general news instead</small>
                </div>
            `;
        }
    }

    // Load regional feeds if no local feeds available
    loadRegionalFeeds() {
        const location = geoService.getCurrentLocation();
        const countryCode = location?.countryCode;
        const language = geoService.getLanguageFromLocation();

        // Get RSS feeds for the user's language/country
        const countryFeeds = CONFIG.RSS_FEEDS[language] || CONFIG.RSS_FEEDS.en;

        this.localFeeds = countryFeeds.map(feed => ({
            ...feed,
            distance: 'National',
            isRegional: true
        }));
    }

    // Fetch news from local sources
    async fetchLocalNews() {
        if (this.localFeeds.length === 0) return;

        console.log(`📰 Fetching news from ${this.localFeeds.length} local sources...`);

        const fetchPromises = this.localFeeds.map(async feed => {
            try {
                const articles = await rssFeedManager.fetchFeed(feed.url);
                return articles.map(article => ({
                    ...article,
                    source: feed.name,
                    distance: feed.distance,
                    isLocal: !feed.isRegional
                }));
            } catch (error) {
                console.error(`Failed to fetch from ${feed.name}:`, error);
                return [];
            }
        });

        const results = await Promise.allSettled(fetchPromises);

        this.nearbyNews = [];
        results.forEach(result => {
            if (result.status === 'fulfilled') {
                this.nearbyNews.push(...result.value);
            }
        });

        // Sort by local proximity, then by date
        this.nearbyNews.sort((a, b) => {
            // Prioritize local news
            if (a.isLocal && !b.isLocal) return -1;
            if (!a.isLocal && b.isLocal) return 1;

            // Then by date
            return b.publishedAt - a.publishedAt;
        });

        console.log(`✅ Loaded ${this.nearbyNews.length} local news articles`);

        // Notify the app
        this.notifyNewsLoaded();
    }

    // Get nearby news articles
    getNearbyNews(limit = 10) {
        return this.nearbyNews.slice(0, limit);
    }

    // Set search radius
    setRadius(radiusKm) {
        this.radiusKm = radiusKm;
        this.userPreferences.radius = radiusKm;
        this.savePreferences();
        this.loadLocalNewsSources();
    }

    // Get current radius
    getRadius() {
        return this.radiusKm;
    }

    // Save user preferences
    savePreferences() {
        localStorage.setItem('worldnews_local_prefs', JSON.stringify(this.userPreferences));
    }

    // Load user preferences
    loadPreferences() {
        const prefs = localStorage.getItem('worldnews_local_prefs');
        const defaultPrefs = {
            radius: 100,
            savedLocations: [],
            notificationsEnabled: false
        };
        return prefs ? { ...defaultPrefs, ...JSON.parse(prefs) } : defaultPrefs;
    }

    // Save current location to favorites
    saveCurrentLocation() {
        const location = geoService.getCurrentLocation();
        if (!location) return;

        const savedLocation = {
            name: geoService.getLocationString(),
            latitude: location.latitude,
            longitude: location.longitude,
            savedAt: Date.now()
        };

        // Avoid duplicates
        const exists = this.userPreferences.savedLocations.find(
            loc => loc.name === savedLocation.name
        );

        if (!exists) {
            this.userPreferences.savedLocations.push(savedLocation);
            this.savePreferences();
            console.log('📌 Location saved:', savedLocation.name);
        }
    }

    // Load a saved location
    async loadSavedLocation(index) {
        const savedLocation = this.userPreferences.savedLocations[index];
        if (!savedLocation) return;

        await geoService.updateLocation(savedLocation.latitude, savedLocation.longitude);
        console.log('📍 Loaded saved location:', savedLocation.name);
    }

    // Get saved locations
    getSavedLocations() {
        return this.userPreferences.savedLocations;
    }

    // Remove saved location
    removeSavedLocation(index) {
        this.userPreferences.savedLocations.splice(index, 1);
        this.savePreferences();
    }

    // Notify when news is loaded
    notifyNewsLoaded() {
        const event = new CustomEvent('localNewsLoaded', {
            detail: {
                count: this.nearbyNews.length,
                location: geoService.getLocationString()
            }
        });
        window.dispatchEvent(event);
    }

    // Get location statistics
    getLocationStats() {
        const location = geoService.getCurrentLocation();
        return {
            location: geoService.getLocationString(),
            coordinates: location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Unknown',
            localSources: this.localFeeds.length,
            articlesLoaded: this.nearbyNews.length,
            radius: this.radiusKm,
            language: geoService.getLanguageFromLocation(),
            timezone: location?.timezone || 'Unknown'
        };
    }
}

// Initialize global local news manager
const localNewsManager = new LocalNewsManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalNewsManager;
}
