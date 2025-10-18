/* ===========================
   GEOLOCATION SERVICE
   Location-Aware News System
   =========================== */

class GeolocationService {
    constructor() {
        this.currentLocation = null;
        this.ipLocation = null;
        this.isLocationPermitted = false;
        this.watchId = null;
        this.locationCache = this.loadLocationCache();
        this.callbacks = [];

        // Country to language mapping
        this.countryLanguageMap = {
            'US': 'en', 'GB': 'en', 'CA': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en',
            'ES': 'es', 'MX': 'es', 'AR': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'VE': 'es',
            'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'LU': 'fr', 'MC': 'fr',
            'DE': 'de', 'AT': 'de', 'LI': 'de',
            'SA': 'ar', 'AE': 'ar', 'EG': 'ar', 'JO': 'ar', 'LB': 'ar', 'MA': 'ar', 'DZ': 'ar',
            'CN': 'zh', 'TW': 'zh', 'HK': 'zh', 'SG': 'zh'
        };

        // Major cities with RSS feeds
        this.localNewsSources = {
            'US': {
                'New York': [
                    { name: 'New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml', lat: 40.7128, lon: -74.0060 },
                    { name: 'NY Daily News', url: 'https://www.nydailynews.com/feed/', lat: 40.7128, lon: -74.0060 }
                ],
                'Los Angeles': [
                    { name: 'LA Times', url: 'https://www.latimes.com/local/rss2.0.xml', lat: 34.0522, lon: -118.2437 }
                ],
                'Chicago': [
                    { name: 'Chicago Tribune', url: 'https://www.chicagotribune.com/arcio/rss/', lat: 41.8781, lon: -87.6298 }
                ]
            },
            'GB': {
                'London': [
                    { name: 'Evening Standard', url: 'https://www.standard.co.uk/rss', lat: 51.5074, lon: -0.1278 }
                ]
            },
            'FR': {
                'Paris': [
                    { name: 'Le Monde', url: 'https://www.lemonde.fr/rss/une.xml', lat: 48.8566, lon: 2.3522 }
                ]
            },
            'DE': {
                'Berlin': [
                    { name: 'Berliner Zeitung', url: 'https://www.berliner-zeitung.de/feed', lat: 52.5200, lon: 13.4050 }
                ]
            }
        };
    }

    // Initialize geolocation
    async init() {
        console.log('🌍 Initializing geolocation service...');

        // Check for cached location
        if (this.locationCache && this.isLocationCacheValid()) {
            console.log('📍 Using cached location');
            this.currentLocation = this.locationCache;
            this.notifyLocationChange();
            return this.currentLocation;
        }

        // Try HTML5 geolocation first
        if (this.isGeolocationSupported()) {
            try {
                const position = await this.requestGeolocation();
                await this.enrichLocationData(position);
                this.startWatchingPosition();
                return this.currentLocation;
            } catch (error) {
                console.warn('HTML5 Geolocation failed:', error.message);
            }
        }

        // Fallback to IP-based location
        console.log('🌐 Falling back to IP-based location...');
        await this.getIPLocation();
        return this.currentLocation;
    }

    // Check if geolocation is supported
    isGeolocationSupported() {
        return 'geolocation' in navigator;
    }

    // Request HTML5 geolocation
    requestGeolocation() {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Geolocation permission granted');
                    this.isLocationPermitted = true;
                    resolve(position);
                },
                (error) => {
                    console.warn('⚠️ Geolocation permission denied:', error.message);
                    this.isLocationPermitted = false;
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    // Enrich location data with reverse geocoding
    async enrichLocationData(position) {
        const { latitude, longitude } = position.coords;

        this.currentLocation = {
            latitude,
            longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
            source: 'html5'
        };

        // Get city, country, timezone from reverse geocoding
        try {
            const locationInfo = await this.reverseGeocode(latitude, longitude);
            this.currentLocation = { ...this.currentLocation, ...locationInfo };
            this.saveLocationCache();
            this.notifyLocationChange();
        } catch (error) {
            console.error('Reverse geocoding failed:', error);
        }
    }

    // Reverse geocoding using OpenStreetMap Nominatim
    async reverseGeocode(lat, lon) {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'WorldNews.day/1.0'
                }
            });

            const data = await response.json();

            return {
                city: data.address.city || data.address.town || data.address.village || 'Unknown',
                country: data.address.country,
                countryCode: data.address.country_code?.toUpperCase(),
                state: data.address.state,
                timezone: this.getTimezoneFromCoords(lat, lon),
                formattedAddress: data.display_name
            };
        } catch (error) {
            console.error('Reverse geocoding error:', error);
            return {
                city: 'Unknown',
                country: 'Unknown',
                countryCode: null
            };
        }
    }

    // Get IP-based location (fallback)
    async getIPLocation() {
        try {
            // Using ipapi.co for IP geolocation
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();

            this.ipLocation = {
                latitude: data.latitude,
                longitude: data.longitude,
                city: data.city,
                country: data.country_name,
                countryCode: data.country_code,
                timezone: data.timezone,
                accuracy: 5000, // IP-based is less accurate
                timestamp: Date.now(),
                source: 'ip'
            };

            this.currentLocation = this.ipLocation;
            this.saveLocationCache();
            this.notifyLocationChange();

            console.log('📍 IP Location detected:', this.currentLocation);
        } catch (error) {
            console.error('IP geolocation failed:', error);
            // Ultimate fallback to browser language
            this.useBrowserLanguageFallback();
        }
    }

    // Watch position for real-time updates
    startWatchingPosition() {
        if (!this.isGeolocationSupported() || !this.isLocationPermitted) return;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const distance = this.calculateDistance(
                    this.currentLocation.latitude,
                    this.currentLocation.longitude,
                    latitude,
                    longitude
                );

                // Only update if moved more than 1km
                if (distance > 1) {
                    console.log(`📍 Location changed: ${distance.toFixed(2)}km`);
                    this.enrichLocationData(position);
                }
            },
            (error) => {
                console.warn('Position watch error:', error);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 300000, // 5 minutes
                timeout: 30000
            }
        );
    }

    // Stop watching position
    stopWatchingPosition() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Get language from location
    getLanguageFromLocation() {
        if (!this.currentLocation || !this.currentLocation.countryCode) {
            return this.getBrowserLanguage();
        }

        const language = this.countryLanguageMap[this.currentLocation.countryCode];
        return language || 'en'; // Default to English
    }

    // Get browser language
    getBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];

        // Check if we support this language
        if (CONFIG.LANGUAGES[langCode]) {
            return langCode;
        }
        return 'en'; // Default to English
    }

    // Browser language fallback
    useBrowserLanguageFallback() {
        this.currentLocation = {
            city: 'Unknown',
            country: 'Unknown',
            countryCode: null,
            latitude: 0,
            longitude: 0,
            source: 'browser',
            timestamp: Date.now()
        };
        this.notifyLocationChange();
    }

    // Get local news sources based on location
    getLocalNewsSources(radiusKm = 100) {
        if (!this.currentLocation) return [];

        const nearbyFeeds = [];
        const userLat = this.currentLocation.latitude;
        const userLon = this.currentLocation.longitude;
        const countryCode = this.currentLocation.countryCode;

        // Get feeds for user's country
        const countrySources = this.localNewsSources[countryCode];
        if (!countrySources) return [];

        // Find feeds within radius
        Object.values(countrySources).forEach(cityFeeds => {
            cityFeeds.forEach(feed => {
                const distance = this.calculateDistance(
                    userLat, userLon,
                    feed.lat, feed.lon
                );

                if (distance <= radiusKm) {
                    nearbyFeeds.push({
                        ...feed,
                        distance: distance.toFixed(1)
                    });
                }
            });
        });

        // Sort by distance
        return nearbyFeeds.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    // Get timezone from coordinates (simplified)
    getTimezoneFromCoords(lat, lon) {
        // This is a simplified version - for production, use a proper timezone API
        const offset = Math.round(lon / 15);
        return `UTC${offset >= 0 ? '+' : ''}${offset}`;
    }

    // Cache management
    saveLocationCache() {
        localStorage.setItem('worldnews_location', JSON.stringify(this.currentLocation));
        localStorage.setItem('worldnews_location_timestamp', Date.now().toString());
    }

    loadLocationCache() {
        const cached = localStorage.getItem('worldnews_location');
        return cached ? JSON.parse(cached) : null;
    }

    isLocationCacheValid() {
        const timestamp = localStorage.getItem('worldnews_location_timestamp');
        if (!timestamp) return false;

        const age = Date.now() - parseInt(timestamp);
        const maxAge = 1000 * 60 * 60; // 1 hour
        return age < maxAge;
    }

    clearLocationCache() {
        localStorage.removeItem('worldnews_location');
        localStorage.removeItem('worldnews_location_timestamp');
    }

    // Location change notification
    onLocationChange(callback) {
        this.callbacks.push(callback);
    }

    notifyLocationChange() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.currentLocation);
            } catch (error) {
                console.error('Location callback error:', error);
            }
        });
    }

    // Get current location
    getCurrentLocation() {
        return this.currentLocation;
    }

    // Manual location update
    async updateLocation(lat, lon) {
        const position = {
            coords: { latitude: lat, longitude: lon, accuracy: 100 },
            timestamp: Date.now()
        };
        await this.enrichLocationData(position);
    }

    // Get location display string
    getLocationString() {
        if (!this.currentLocation) return 'Unknown';

        const { city, country } = this.currentLocation;
        return city && country ? `${city}, ${country}` : country || 'Unknown';
    }
}

// Initialize global geolocation service
const geoService = new GeolocationService();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeolocationService;
}
