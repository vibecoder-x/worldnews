/* ===========================
   LOCATION UI HANDLER
   User Interface for Geolocation Features
   =========================== */

// Global location UI functions

function toggleLocationMenu() {
    const menu = document.getElementById('location-menu');
    menu.classList.toggle('hidden');

    // Close language dropdown if open
    const langDropdown = document.getElementById('lang-dropdown');
    if (langDropdown) {
        langDropdown.classList.add('hidden');
    }
}

async function refreshLocation() {
    const display = document.getElementById('location-display');
    display.textContent = 'Detecting...';

    // Clear cache and re-detect
    geoService.clearLocationCache();
    await geoService.init();

    updateLocationDisplay();
    await localNewsManager.loadLocalNewsSources();
}

function saveCurrentLocation() {
    localNewsManager.saveCurrentLocation();
    renderSavedLocations();

    // Show confirmation
    showNotification('Location saved!', 'success');
}

function toggleLocationSettings() {
    showManualLocationModal();
}

function showManualLocationModal() {
    // Create modal for manual location entry
    const existingModal = document.getElementById('manual-location-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'manual-location-modal';
    modal.className = 'location-modal';
    modal.innerHTML = `
        <div class="location-modal-content">
            <div class="location-modal-header">
                <h3>
                    <i class="fas fa-map-marked-alt"></i>
                    Enter Location Manually
                </h3>
                <button onclick="closeManualLocationModal()" class="modal-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="location-modal-body">
                <form id="manual-location-form" onsubmit="submitManualLocation(event)">
                    <div class="form-group">
                        <label for="manual-city">
                            <i class="fas fa-city"></i>
                            City
                        </label>
                        <input
                            type="text"
                            id="manual-city"
                            placeholder="e.g., New York, London, Paris"
                            required
                        />
                    </div>
                    <div class="form-group">
                        <label for="manual-country">
                            <i class="fas fa-flag"></i>
                            Country
                        </label>
                        <input
                            type="text"
                            id="manual-country"
                            placeholder="e.g., United States, UK, France"
                            required
                        />
                    </div>
                    <div class="form-actions">
                        <button type="button" onclick="closeManualLocationModal()" class="btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" class="btn-primary">
                            <i class="fas fa-search"></i>
                            Search News
                        </button>
                    </div>
                </form>
                <div id="manual-location-status" class="location-status"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);
}

function closeManualLocationModal() {
    const modal = document.getElementById('manual-location-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

async function submitManualLocation(event) {
    event.preventDefault();

    const city = document.getElementById('manual-city').value.trim();
    const country = document.getElementById('manual-country').value.trim();
    const statusEl = document.getElementById('manual-location-status');

    if (!city || !country) {
        statusEl.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Please enter both city and country</p>';
        return;
    }

    statusEl.innerHTML = '<p class="loading"><i class="fas fa-spinner fa-spin"></i> Searching for location...</p>';

    try {
        // Geocode the location using Nominatim
        const query = `${city}, ${country}`;
        const params = new URLSearchParams({
            type: 'geocode',
            query: query
        });

        const response = await fetch(`/api/location?${params}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const result = data[0];

            // Update geolocation service with manual location
            await geoService.updateLocation(parseFloat(result.lat), parseFloat(result.lon));

            // Update display
            updateLocationDisplay();

            // Reload local news for this location
            await localNewsManager.loadLocalNewsSources();

            // Close modal
            closeManualLocationModal();

            showNotification(`Location set to ${city}, ${country}`, 'success');

            // Toggle location menu to show updated location
            toggleLocationMenu();
        } else {
            statusEl.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Location not found. Please check spelling.</p>';
        }
    } catch (error) {
        console.error('Manual location error:', error);
        statusEl.innerHTML = '<p class="error"><i class="fas fa-exclamation-circle"></i> Failed to find location. Please try again.</p>';
    }
}

function changeRadius(radiusKm) {
    localNewsManager.setRadius(parseInt(radiusKm));
    showNotification(`Radius updated to ${radiusKm}km`, 'success');
}

function updateLocationDisplay() {
    const location = geoService.getCurrentLocation();
    if (!location) return;

    // Update main display
    const display = document.getElementById('location-display');
    display.textContent = geoService.getLocationString();

    // Update coordinates
    const coords = document.getElementById('location-coords');
    if (coords) {
        coords.textContent = `${location.latitude.toFixed(4)}°, ${location.longitude.toFixed(4)}°`;
    }

    // Update accuracy
    const accuracy = document.getElementById('location-accuracy');
    if (accuracy && location.accuracy) {
        const accKm = (location.accuracy / 1000).toFixed(1);
        accuracy.textContent = `Accuracy: ±${accKm}km`;
        accuracy.style.color = location.accuracy < 5000 ? '#10b981' : '#f59e0b';
    }
}

function renderSavedLocations() {
    const container = document.getElementById('saved-locations');
    if (!container) return;

    const savedLocations = localNewsManager.getSavedLocations();

    if (savedLocations.length === 0) {
        container.innerHTML = '<p class="no-saved-locations">No saved locations yet</p>';
        return;
    }

    container.innerHTML = '<h4>Saved Locations</h4>';
    savedLocations.forEach((loc, index) => {
        const locationItem = document.createElement('div');
        locationItem.className = 'saved-location-item';
        locationItem.innerHTML = `
            <div class="location-item-info" onclick="loadSavedLocation(${index})">
                <i class="fas fa-map-pin"></i>
                <span>${loc.name}</span>
            </div>
            <button class="remove-location" onclick="removeSavedLocation(${index})" title="Remove">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(locationItem);
    });
}

async function loadSavedLocation(index) {
    await localNewsManager.loadSavedLocation(index);
    updateLocationDisplay();
    toggleLocationMenu();
    showNotification('Location loaded!', 'success');
}

function removeSavedLocation(index) {
    if (confirm('Remove this saved location?')) {
        localNewsManager.removeSavedLocation(index);
        renderSavedLocations();
        showNotification('Location removed', 'info');
    }
}

function renderNearbyNews() {
    const container = document.getElementById('nearby-news');
    if (!container) return;

    const nearbyArticles = localNewsManager.getNearbyNews(5);

    if (nearbyArticles.length === 0) {
        container.innerHTML = `
            <div class="no-local-news">
                <i class="fas fa-newspaper"></i>
                <p>No local news available</p>
                <small>Try increasing search radius</small>
            </div>
        `;
        return;
    }

    container.innerHTML = '';
    nearbyArticles.forEach((article, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'nearby-news-item';

        const distance = article.isLocal
            ? `<span class="distance-badge">${article.distance} km</span>`
            : `<span class="national-badge">National</span>`;

        newsItem.innerHTML = `
            <div class="nearby-news-header">
                <span class="nearby-news-source">${article.source}</span>
                ${distance}
            </div>
            <h4 class="nearby-news-title">${article.title}</h4>
            <p class="nearby-news-time">
                <i class="far fa-clock"></i>
                ${i18n.formatTime(article.publishedAt)}
            </p>
        `;

        newsItem.addEventListener('click', () => {
            window.open(article.url, '_blank');
        });

        container.appendChild(newsItem);
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `geo-notification geo-notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Initialize location features when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌍 Initializing geolocation features...');

    try {
        // Initialize geolocation service
        await geoService.init();
        updateLocationDisplay();

        // Initialize local news manager
        await localNewsManager.init();

        // Render UI components
        renderSavedLocations();

        // Listen for local news loaded
        window.addEventListener('localNewsLoaded', (event) => {
            console.log(`✅ ${event.detail.count} local news articles loaded for ${event.detail.location}`);
            renderNearbyNews();
        });

    } catch (error) {
        console.error('Geolocation initialization error:', error);
        const display = document.getElementById('location-display');
        if (display) {
            display.textContent = 'Location unavailable';
        }
    }
});

// Close location menu when clicking outside
document.addEventListener('click', (e) => {
    const locationIndicator = document.querySelector('.location-indicator');
    const locationMenu = document.getElementById('location-menu');

    if (!locationIndicator?.contains(e.target) && locationMenu) {
        locationMenu.classList.add('hidden');
    }
});

// Export functions if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleLocationMenu,
        refreshLocation,
        updateLocationDisplay,
        renderNearbyNews
    };
}
