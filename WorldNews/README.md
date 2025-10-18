# WorldNews.day - Multi-Language Global News Website

A professional, modern news aggregation website featuring real-time news from trusted sources worldwide in 6 languages.

![WorldNews.day](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🌟 Features

### Multi-Language Support
- **6 Languages**: English, Spanish, French, German, Arabic, Chinese
- Automatic browser language detection
- RTL (Right-to-left) support for Arabic
- Language-specific URL structure
- Fully translated UI elements

### Content Aggregation
- **Multiple News APIs**: NewsAPI, GNews, CurrentsAPI with automatic fallback
- **RSS Feed Integration**: Real-time feeds from BBC, CNN, Reuters, Al Jazeera, and more
- Auto-refresh every 30 minutes
- Smart caching system
- Category-based filtering

### Professional Design
- Modern red & blue color scheme
- Responsive mobile-first design
- Dark mode with system preference detection
- Newspaper-style layout
- Fast loading optimized

### User Features
- Advanced search functionality
- Category navigation (World, Politics, Business, Technology, Health, Sports, Entertainment)
- Featured articles carousel
- Trending news section
- Reading time estimates
- Font size adjustment for accessibility
- Social sharing (Twitter, Facebook, LinkedIn, WhatsApp, WeChat)
- Newsletter subscription
- Print-friendly views

### Monetization
- Google AdSense integration
- Strategic ad placements:
  - Header leaderboard (728x90)
  - Sidebar rectangles (300x250)
  - In-content ads
  - Footer ads
- Non-intrusive positioning

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Web server (Apache, Nginx, or any static file server)
- Internet connection for API calls and RSS feeds

## 🚀 Quick Start

### 1. Installation

```bash
# Clone or download the files
git clone https://github.com/yourusername/worldnews.day.git

# Navigate to the directory
cd worldnews
```

### 2. Configuration

#### API Keys Setup
The API keys are already configured in `js/config.js`:
- **NewsAPI**: `5ff2e88241d7494a8add4b009533eef1`
- **GNews**: `dba2727f20fd5a6d763df225da065b48`
- **CurrentsAPI**: `PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx`

#### Google AdSense Setup
1. Open `index.html`
2. Replace `ca-pub-XXXXXXXXXXXXXXXX` with your AdSense publisher ID
3. Replace all `XXXXXXXXXX` slot IDs with your actual ad unit IDs
4. Update the same in `js/config.js`

#### Google Analytics Setup
1. Open `index.html`
2. Replace `GA_MEASUREMENT_ID` with your Google Analytics measurement ID

### 3. Deployment

#### Option A: Local Development
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000
```

#### Option B: Production Deployment
1. Upload all files to your web server
2. Ensure proper file permissions
3. Configure SSL certificate for HTTPS (recommended)
4. Point your domain to the web server

### 4. Domain Setup
Point your domain `worldnews.day` to your server:
- Update DNS A record to your server IP
- Configure virtual host/server block
- Enable HTTPS with Let's Encrypt or similar

## 📁 Project Structure

```
worldnews/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main styles (red/blue theme)
│   ├── dark-mode.css       # Dark mode styles
│   └── responsive.css      # Mobile responsive styles
├── js/
│   ├── config.js           # Configuration & API keys
│   ├── translations.js     # Multi-language translations
│   ├── i18n.js             # Internationalization system
│   ├── news-api.js         # News API integration
│   ├── rss-feeds.js        # RSS feed aggregation
│   ├── dark-mode.js        # Dark mode functionality
│   └── main.js             # Main application logic
├── README.md               # This file
├── SETUP.md                # Detailed setup instructions
└── favicon.png             # Website favicon (add your own)
```

## 🔧 Configuration Options

### Modify Settings in `js/config.js`:

```javascript
DEFAULTS: {
    language: 'en',              // Default language
    articlesPerPage: 12,         // Articles per page
    autoRefreshInterval: 1800000, // 30 minutes
    defaultCategory: 'all',
    maxArticlesCache: 100,
    readingWordsPerMinute: 200
}
```

### Add More RSS Feeds:

```javascript
RSS_FEEDS: {
    en: [
        {
            name: 'Your Source',
            url: 'https://example.com/rss.xml',
            category: 'world'
        }
    ]
}
```

## 🌐 Supported Languages

| Language | Code | Direction | Status |
|----------|------|-----------|--------|
| English | en | LTR | ✅ Complete |
| Spanish | es | LTR | ✅ Complete |
| French | fr | LTR | ✅ Complete |
| German | de | LTR | ✅ Complete |
| Arabic | ar | RTL | ✅ Complete |
| Chinese | zh | LTR | ✅ Complete |

## 📰 News Sources

### English
- BBC World News
- CNN International
- Reuters
- Al Jazeera English
- Associated Press
- TechCrunch
- The Verge

### Spanish
- BBC Mundo
- CNN Español
- El País

### French
- BBC Afrique
- France 24
- Le Monde

### German
- Deutsche Welle
- Der Spiegel

### Arabic
- Al Jazeera Arabic
- BBC Arabic

### Chinese
- Xinhua News
- China Daily

## 🎨 Customization

### Color Scheme
Edit CSS variables in `css/styles.css`:
```css
:root {
    --primary-red: #DC2626;
    --primary-blue: #2563EB;
    /* Modify as needed */
}
```

### Layout
- Grid/List view toggle
- Adjustable font sizes
- Customizable article cards
- Flexible sidebar widgets

## 🔒 Security & Privacy

- No user data collection (without consent)
- HTTPS recommended for production
- CORS proxy for RSS feeds
- Content Security Policy ready
- Privacy-compliant newsletter signup

## ⚡ Performance Optimization

- Lazy loading images
- Smart caching (15-minute expiry)
- Debounced scroll events
- Optimized API calls
- Minimal external dependencies
- CDN-ready assets

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

### No articles loading?
- Check browser console for errors
- Verify API keys are valid
- Check internet connection
- Try clearing cache

### RSS feeds not working?
- CORS proxy might be down
- Try alternative proxy in `rss-feeds.js`
- Some feeds may block proxies

### Dark mode not working?
- Clear browser cache
- Check localStorage permissions
- Verify dark-mode.css is loaded

## 📄 License

MIT License - Feel free to use for personal or commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## 📧 Support

For questions or support:
- Create an issue on GitHub
- Email: support@worldnews.day

## 🙏 Credits

- News APIs: NewsAPI.org, GNews.io, CurrentsAPI
- Icons: Font Awesome
- Fonts: Google Fonts (Roboto, Merriweather)

## 🔮 Future Enhancements

- [ ] User accounts and preferences
- [ ] Bookmarking/saving articles
- [ ] Comment system
- [ ] Push notifications
- [ ] Progressive Web App (PWA)
- [ ] Offline mode
- [ ] More languages
- [ ] AI-powered recommendations

---

**Made with ❤️ for global news readers**

*Last updated: 2025*
