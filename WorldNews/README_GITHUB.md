# 🌍 WorldNews.day

> **Multilingual News Aggregator** - Real-time international news in 6 languages

[![Live Demo](https://img.shields.io/badge/demo-live-success)](http://localhost:5000)
[![GitHub](https://img.shields.io/badge/github-vibecoder--x%2Fworldnews-blue)](https://github.com/vibecoder-x/worldnews)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Languages](https://img.shields.io/badge/languages-6-orange)](https://github.com/vibecoder-x/worldnews)

---

## ✨ Features

### 🌐 Multi-Language Support
- **6 Languages**: English, Spanish, French, German, Arabic, Chinese
- **RTL Support**: Automatic layout flip for Arabic
- **Real-time Translation**: All UI elements translate instantly

### 📰 News Aggregation
- **Multiple APIs**: NewsAPI, GNews, CurrentsAPI
- **RSS Feeds**: 10+ major international sources
- **Auto-Refresh**: Every 30 minutes automatically
- **Manual Refresh**: One-click instant update

### 🎨 User Experience
- **Dark Mode**: Toggle light/dark themes
- **Responsive Design**: Mobile, tablet, and desktop
- **Accessibility**: Font size adjustment (A-/A+)
- **Fast Loading**: Optimized with caching

### 📊 Content Organization
- **8 Categories**: World, Politics, Business, Technology, Health, Sports, Entertainment
- **Featured Carousel**: Top stories slideshow
- **Trending Sidebar**: Most popular articles
- **Search**: Find news by keyword

### 🚀 Performance
- **Client-side Caching**: 15-minute expiry
- **Lazy Loading**: Images load on demand
- **API Fallback**: Automatic failover between sources
- **CORS Proxy**: RSS feed compatibility

---

## 🚀 Quick Start

### Prerequisites
- Node.js (for local development server)
- Modern web browser
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/vibecoder-x/worldnews.git

# Navigate to project directory
cd worldnews

# Start the server
node server.js
```

**Or use the startup scripts:**

**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
chmod +x START.sh
./START.sh
```

### Open in Browser
```
http://localhost:5000
```

---

## 📁 Project Structure

```
worldnews/
├── index.html              # Main HTML file
├── server.js               # Local development server
├── favicon.svg             # Website favicon
│
├── css/
│   ├── styles.css          # Main styles
│   ├── dark-mode.css       # Dark mode styles
│   └── responsive.css      # Mobile responsive styles
│
├── js/
│   ├── config.js           # Configuration (API keys, RSS feeds)
│   ├── translations.js     # All language translations
│   ├── i18n.js             # Internationalization logic
│   ├── news-api.js         # News API integration
│   ├── rss-feeds.js        # RSS feed parser
│   ├── main.js             # Main application logic
│   └── dark-mode.js        # Dark mode toggle
│
├── docs/
│   ├── README.md           # Quick start guide
│   ├── SETUP.md            # Detailed setup instructions
│   ├── DEPLOYMENT.md       # Deployment guide
│   ├── AUTO_REFRESH_GUIDE.md   # Auto-refresh documentation
│   ├── TESTING_GUIDE.md    # Testing guide
│   └── CONFIGURATION_CHECKLIST.md
│
└── START.bat / START.sh    # Startup scripts
```

---

## 🔑 Configuration

### API Keys

The project comes with working API keys in `js/config.js`:

```javascript
API_KEYS: {
    newsapi: '5ff2e88241d7494a8add4b009533eef1',
    gnews: 'dba2727f20fd5a6d763df225da065b48',
    currentsapi: 'PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx',
}
```

**Get your own free API keys:**
- [NewsAPI](https://newsapi.org) - 100 requests/day
- [GNews](https://gnews.io) - 100 requests/day
- [CurrentsAPI](https://currentsapi.services) - 600 requests/day

### RSS Feeds

Configured in `js/config.js`:
- BBC World News
- CNN International
- Reuters
- Al Jazeera
- TechCrunch
- The Verge
- And more...

### Auto-Refresh Interval

Change in `js/config.js`:
```javascript
DEFAULTS: {
    autoRefreshInterval: 1800000, // 30 minutes (in milliseconds)
}
```

---

## 🌐 Deployment

### Option 1: Netlify (Recommended)

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/vibecoder-x/worldnews)

1. Click the button above
2. Connect your GitHub account
3. Deploy!

### Option 2: Vercel

```bash
npm i -g vercel
vercel
```

### Option 3: GitHub Pages

1. Go to Settings → Pages
2. Select branch: `main`
3. Your site will be live at: `https://vibecoder-x.github.io/worldnews`

### Option 4: Static Hosting

Upload files via FTP to any static hosting provider:
- Hostinger
- Bluehost
- SiteGround
- Or any web hosting service

**See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions**

---

## 📖 Documentation

- **[README.md](README.md)** - Quick start guide
- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment options
- **[AUTO_REFRESH_GUIDE.md](AUTO_REFRESH_GUIDE.md)** - Auto-refresh feature
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Testing guide
- **[CONFIGURATION_CHECKLIST.md](CONFIGURATION_CHECKLIST.md)** - Configuration checklist

---

## 🎨 Customization

### Change Colors

Edit `css/styles.css`:
```css
:root {
    --primary-blue: #2563EB;
    --primary-red: #DC2626;
    --dark-blue: #1E40AF;
}
```

### Add More Languages

1. Add translations in `js/translations.js`
2. Add RSS feeds in `js/config.js`
3. Add language option in `index.html`

### Add More News Sources

Edit `js/config.js`:
```javascript
RSS_FEEDS: {
    en: [
        {
            name: 'Your Source',
            url: 'https://example.com/rss',
            category: 'world'
        },
    ]
}
```

---

## 🧪 Testing

### Test Language Switching
```bash
# Open http://localhost:5000
# Click globe icon → Select language
# Verify UI updates and news reloads
```

### Test Auto-Refresh
```bash
# Set interval to 1 minute for testing
# Edit js/config.js:
autoRefreshInterval: 60000

# Wait 1 minute → Notification appears
```

### Test Manual Refresh
```bash
# Click refresh button (🔄) in header
# Watch for spinning animation
# See notification appear
```

---

## 📊 API Rate Limits

| API | Free Tier | Requests/Day | Recommended Interval |
|-----|-----------|--------------|---------------------|
| NewsAPI | 100/day | 100 | 30 minutes ✅ |
| GNews | 100/day | 100 | 30 minutes ✅ |
| CurrentsAPI | 600/day | 600 | Any interval ✅ |

**With 30-minute auto-refresh**: ~48 requests/day per API ✅

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js (local development)
- **APIs**: NewsAPI, GNews, CurrentsAPI
- **RSS**: AllOrigins CORS proxy
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Roboto, Merriweather)

---

## 🌟 Features Breakdown

### Content Features
✅ News from 3 different APIs
✅ RSS feed aggregation
✅ 6 language support
✅ 8 news categories
✅ Search functionality
✅ Featured news carousel
✅ Trending sidebar

### UI/UX Features
✅ Dark mode toggle
✅ Responsive design
✅ Font size adjustment
✅ Social sharing
✅ Newsletter signup
✅ Reading time estimate
✅ Time ago formatting

### Technical Features
✅ Auto-refresh (30 min)
✅ Manual refresh button
✅ Client-side caching
✅ Lazy loading images
✅ API fallback system
✅ CORS proxy for RSS
✅ SEO optimized
✅ Google AdSense ready

---

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ IE11 (limited support)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **News Sources**: NewsAPI, GNews, CurrentsAPI
- **RSS Feeds**: BBC, CNN, Reuters, Al Jazeera, TechCrunch, The Verge
- **CORS Proxy**: AllOrigins
- **Icons**: Font Awesome
- **Fonts**: Google Fonts

---

## 📞 Support

- **GitHub Issues**: [Report a bug](https://github.com/vibecoder-x/worldnews/issues)
- **Documentation**: Check the `/docs` folder
- **Email**: support@worldnews.day

---

## 🔮 Roadmap

- [ ] User accounts and preferences
- [ ] Saved articles/bookmarks
- [ ] Push notifications for breaking news
- [ ] Mobile app (React Native)
- [ ] Email newsletter integration
- [ ] More languages (Japanese, Korean, Portuguese)
- [ ] Advanced search filters
- [ ] Article comments section
- [ ] Social media integration

---

## 📈 Stats

- **29 files** committed
- **6,549 lines** of code
- **6 languages** supported
- **10+ RSS feeds** integrated
- **3 APIs** with fallback
- **8 categories** of news

---

## 🌐 Live Demo

**Local**: http://localhost:5000
**Production**: Coming soon...

---

<div align="center">

**Made with ❤️ by [vibecoder-x](https://github.com/vibecoder-x)**

⭐ Star this repo if you find it useful!

🤖 Generated with [Claude Code](https://claude.com/claude-code)

[Report Bug](https://github.com/vibecoder-x/worldnews/issues) · [Request Feature](https://github.com/vibecoder-x/worldnews/issues)

</div>
