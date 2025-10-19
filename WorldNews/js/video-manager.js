/* ===========================
   LIVE VIDEO MANAGER
   Handle live streams and video playback
   =========================== */

class VideoManager {
    constructor() {
        this.currentLayout = VIDEO_CONFIG.DEFAULT_LAYOUT;
        this.currentCategory = 'all';
        this.streams = [];
        this.refreshTimer = null;
        this.players = new Map();
    }

    // Initialize video manager
    init() {
        this.loadStreams();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    // Setup event listeners
    setupEventListeners() {
        // Category filter buttons
        document.querySelectorAll('.video-category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.target.getAttribute('data-category');
                this.filterByCategory(category);
                this.updateActiveCategoryBtn(e.target);
            });
        });

        // Layout switcher buttons
        document.querySelectorAll('.video-layout-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const layout = e.target.getAttribute('data-layout');
                this.changeLayout(layout);
                this.updateActiveLayoutBtn(e.target);
            });
        });

        // Language change event
        window.addEventListener('languageChanged', () => {
            this.loadStreams();
        });
    }

    // Load streams for current language
    loadStreams() {
        const language = i18n.getCurrentLanguage();
        this.streams = VIDEO_CONFIG.LIVE_STREAMS[language] || VIDEO_CONFIG.LIVE_STREAMS.en;
        this.renderStreams();
    }

    // Filter streams by category
    filterByCategory(category) {
        this.currentCategory = category;
        this.renderStreams();
    }

    // Change layout
    changeLayout(layout) {
        this.currentLayout = layout;
        const container = document.getElementById('live-video-grid');
        if (container) {
            container.className = `video-grid video-grid-${layout}`;
        }
        this.renderStreams();
    }

    // Render video streams
    renderStreams() {
        const container = document.getElementById('live-video-grid');
        if (!container) return;

        // Filter streams by category
        let filteredStreams = this.currentCategory === 'all'
            ? this.streams
            : this.streams.filter(s => s.category === this.currentCategory);

        // Sort by featured first
        filteredStreams.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

        // Limit based on layout
        const maxStreams = this.getMaxStreamsForLayout();
        filteredStreams = filteredStreams.slice(0, maxStreams);

        // Clear existing players
        this.clearPlayers();

        // Render streams
        container.innerHTML = '';
        filteredStreams.forEach(stream => {
            const videoCard = this.createVideoCard(stream);
            container.appendChild(videoCard);
        });

        // Initialize lazy loading
        this.initializeLazyLoading();
    }

    // Get maximum streams for current layout
    getMaxStreamsForLayout() {
        switch (this.currentLayout) {
            case 'single':
                return 1;
            case 'grid':
                return 4;
            case 'carousel':
                return 6;
            default:
                return 4;
        }
    }

    // Create video card element
    createVideoCard(stream) {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.setAttribute('data-stream-id', stream.id);

        const embedUrl = this.getEmbedUrl(stream);

        card.innerHTML = `
            <div class="video-player-wrapper">
                ${stream.isLive ? `<span class="live-badge">
                    <i class="fas fa-circle live-indicator"></i>
                    <span data-i18n="live_now">LIVE NOW</span>
                </span>` : ''}
                <div class="video-player-container" data-stream-id="${stream.id}">
                    <div class="video-placeholder" style="background-image: url('${stream.thumbnail}')">
                        <div class="play-button-overlay">
                            <i class="fas fa-play-circle"></i>
                        </div>
                        <div class="loading-spinner hidden">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                    </div>
                </div>

                <button class="fullscreen-btn" onclick="videoManager.toggleFullscreen('${stream.id}')" title="Fullscreen">
                    <i class="fas fa-expand"></i>
                </button>
            </div>

            <div class="video-info">
                <h3 class="video-title">${stream.name}</h3>
                <div class="video-meta">
                    <span class="video-source">
                        <i class="fab fa-youtube"></i> ${this.getSourceName(stream.type)}
                    </span>
                    <span class="video-category">
                        <i class="fas fa-tag"></i> ${VIDEO_CONFIG.CATEGORIES[stream.category] || stream.category}
                    </span>
                </div>
            </div>
        `;

        // Add click to load player
        const placeholder = card.querySelector('.video-placeholder');
        placeholder.addEventListener('click', () => {
            this.loadPlayer(stream, card);
        });

        return card;
    }

    // Load video player
    loadPlayer(stream, card) {
        const container = card.querySelector('.video-player-container');
        const placeholder = card.querySelector('.video-placeholder');
        const spinner = card.querySelector('.loading-spinner');

        // Show loading
        spinner.classList.remove('hidden');

        const embedUrl = this.getEmbedUrl(stream);
        const iframe = document.createElement('iframe');
        iframe.src = embedUrl;
        iframe.className = 'video-iframe';
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');

        // Remove placeholder and add iframe
        iframe.addEventListener('load', () => {
            placeholder.remove();
            spinner.classList.add('hidden');
        });

        container.appendChild(iframe);
        this.players.set(stream.id, iframe);
    }

    // Get embed URL for stream
    getEmbedUrl(stream) {
        const settings = VIDEO_CONFIG.PLAYER_SETTINGS;
        const params = new URLSearchParams({
            autoplay: settings.autoplay ? 1 : 0,
            mute: settings.muted ? 1 : 0,
            controls: settings.controls ? 1 : 0,
            modestbranding: settings.modestbranding ? 1 : 0,
            rel: settings.rel,
            enablejsapi: settings.enablejsapi,
            origin: settings.origin
        });

        if (stream.type === 'youtube') {
            // Use regular video ID
            return `${VIDEO_CONFIG.YOUTUBE.embedUrl}${stream.videoId}?${params}`;
        }

        return stream.url || '';
    }

    // Get source name
    getSourceName(type) {
        const sources = {
            youtube: 'YouTube',
            twitch: 'Twitch',
            facebook: 'Facebook',
            rtmp: 'Live Stream'
        };
        return sources[type] || 'Live';
    }

    // Toggle fullscreen
    toggleFullscreen(streamId) {
        const player = this.players.get(streamId);
        if (!player) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            player.requestFullscreen();
        }
    }

    // Initialize lazy loading for videos
    initializeLazyLoading() {
        const observerOptions = {
            root: null,
            rootMargin: '50px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const streamId = card.getAttribute('data-stream-id');
                    const stream = this.streams.find(s => s.id === streamId);

                    if (stream && !this.players.has(streamId)) {
                        // Auto-load featured streams when visible
                        if (stream.featured) {
                            setTimeout(() => this.loadPlayer(stream, card), 500);
                        }
                    }

                    observer.unobserve(card);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.video-card').forEach(card => {
            observer.observe(card);
        });
    }

    // Clear all players
    clearPlayers() {
        this.players.forEach(player => {
            if (player && player.parentNode) {
                player.parentNode.removeChild(player);
            }
        });
        this.players.clear();
    }

    // Update active category button
    updateActiveCategoryBtn(activeBtn) {
        document.querySelectorAll('.video-category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Update active layout button
    updateActiveLayoutBtn(activeBtn) {
        document.querySelectorAll('.video-layout-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        activeBtn.classList.add('active');
    }

    // Start auto-refresh
    startAutoRefresh() {
        this.refreshTimer = setInterval(() => {
            console.log('Auto-refreshing video streams...');
            this.loadStreams();
        }, VIDEO_CONFIG.REFRESH_INTERVAL);
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    // Refresh streams manually
    refreshStreams() {
        this.loadStreams();

        // Show refresh feedback
        const refreshBtn = document.querySelector('.video-refresh-btn');
        if (refreshBtn) {
            const icon = refreshBtn.querySelector('i');
            icon.classList.add('fa-spin');
            setTimeout(() => icon.classList.remove('fa-spin'), 1000);
        }
    }
}

// Initialize global video manager
const videoManager = new VideoManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VideoManager;
}
