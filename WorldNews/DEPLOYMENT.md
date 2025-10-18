# WorldNews.day - Deployment Guide

## 🎉 Your Website is Now Active!

Your WorldNews.day website is now running and ready to use! It includes:
- ✅ News API integration (NewsAPI, GNews, CurrentsAPI)
- ✅ RSS Feed aggregation from major news sources
- ✅ Multi-language support (6 languages)
- ✅ Dark mode
- ✅ Responsive design
- ✅ Google AdSense ready

---

## 🚀 Quick Start (Local Development)

### Option 1: Using the Start Script
**Windows:**
```bash
START.bat
```

**Mac/Linux:**
```bash
chmod +x START.sh
./START.sh
```

### Option 2: Manual Start
```bash
node server.js
```

Then open your browser and visit: **http://localhost:5000**

---

## 📡 News Sources Configuration

Your website is already configured with:

### API Keys (in `js/config.js`)
- **NewsAPI**: `5ff2e88241d7494a8add4b009533eef1`
- **GNews**: `dba2727f20fd5a6d763df225da065b48`
- **CurrentsAPI**: `PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx`

### RSS Feeds
The system automatically pulls news from:
- BBC World News
- CNN International
- Reuters
- Al Jazeera
- TechCrunch
- The Verge
- And many more (check `js/config.js` for full list)

---

## 🌐 Deployment Options

### Option 1: Netlify (Recommended - FREE)

1. **Create a Netlify account**: https://netlify.com
2. **Deploy via Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin master
   ```
3. **Connect to Netlify**:
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repo
   - Deploy settings:
     - Build command: (leave empty)
     - Publish directory: `.`
4. **Custom Domain**: Add `worldnews.day` in Domain settings

### Option 2: Vercel (FREE)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```
2. **Deploy**:
   ```bash
   vercel
   ```
3. **Follow the prompts** and your site will be live!

### Option 3: GitHub Pages (FREE)

1. **Create GitHub repo** and push your code
2. **Go to Settings** → Pages
3. **Select branch**: main/master
4. **Your site will be live** at: `https://yourusername.github.io/worldnews`

### Option 4: Traditional Hosting (Shared/VPS)

1. **Upload files via FTP** to your web server
2. **Point domain** to your hosting
3. **No server-side code needed** - it's all static HTML/JS!

### Option 5: Firebase Hosting (FREE)

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```
2. **Login and Initialize**:
   ```bash
   firebase login
   firebase init hosting
   ```
3. **Deploy**:
   ```bash
   firebase deploy
   ```

---

## 🔧 Configuration

### Adding More News Sources

Edit `js/config.js` to add more RSS feeds:

```javascript
RSS_FEEDS: {
    en: [
        {
            name: 'Your News Source',
            url: 'https://example.com/rss',
            category: 'world'
        },
        // Add more feeds here
    ]
}
```

### Changing API Keys

Replace the API keys in `js/config.js`:

```javascript
API_KEYS: {
    newsapi: 'YOUR_NEWSAPI_KEY',
    gnews: 'YOUR_GNEWS_KEY',
    currentsapi: 'YOUR_CURRENTSAPI_KEY',
}
```

**Get free API keys from:**
- NewsAPI: https://newsapi.org
- GNews: https://gnews.io
- CurrentsAPI: https://currentsapi.services

### Setting up Google AdSense

1. **Sign up for Google AdSense**: https://adsense.google.com
2. **Get your Publisher ID** (ca-pub-XXXXXXXXXXXXXXXX)
3. **Update in `js/config.js`**:
   ```javascript
   ADSENSE: {
       client: 'ca-pub-YOUR-ID-HERE',
       slots: {
           leaderboard: 'SLOT-ID-1',
           sidebar: 'SLOT-ID-2',
           inContent: 'SLOT-ID-3',
           footer: 'SLOT-ID-4'
       }
   }
   ```
4. **Update in `index.html`** - Replace all instances of `ca-pub-XXXXXXXXXXXXXXXX`

---

## 🎨 Customization

### Change Colors

Edit `css/styles.css`:

```css
:root {
    --primary-blue: #your-color;
    --dark-blue: #your-color;
    --primary-red: #your-color;
}
```

### Add More Languages

1. Add translations in `js/translations.js`
2. Add RSS feeds in `js/config.js`
3. Add language option in `index.html`

---

## 📊 Analytics Setup

### Google Analytics

Already integrated! Just replace `GA_MEASUREMENT_ID` in `index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"></script>
<script>
    gtag('config', 'YOUR-GA-ID');
</script>
```

---

## 🔒 Security & Performance

- ✅ **CORS Proxy**: Using AllOrigins for RSS feeds
- ✅ **API Key Security**: Keys are visible client-side (normal for frontend apps)
- ✅ **Caching**: 15-minute cache to reduce API calls
- ✅ **Lazy Loading**: Images load on demand
- ✅ **Auto-refresh**: News updates every 30 minutes

**Note**: For production, consider:
- Setting up a backend proxy for API keys
- Implementing rate limiting
- Using a CDN for faster delivery

---

## 🐛 Troubleshooting

### No News Loading?
1. Check browser console for errors
2. Verify API keys are valid
3. Try different news category
4. RSS feeds may be blocked by CORS - they fall back to API

### Port Already in Use?
Change the port in `server.js`:
```javascript
const PORT = 5000; // Change to any available port
```

### RSS Feeds Not Working?
Some RSS feeds require CORS proxy. The code uses AllOrigins by default.

---

## 📱 Domain Setup

### Connecting worldnews.day

1. **Register domain** (if not already done) at:
   - Namecheap, GoDaddy, Google Domains, etc.

2. **Point domain to your hosting**:
   - For Netlify: Add custom domain in Netlify dashboard
   - For Vercel: `vercel domains add worldnews.day`
   - For traditional hosting: Update A records to your server IP

3. **Enable HTTPS** (free with Let's Encrypt on most platforms)

---

## 🎯 What's Working Right Now

✅ **News API Integration**: Fetches from 3 different APIs with automatic fallback
✅ **RSS Feeds**: Aggregates from 10+ major news sources
✅ **Multi-language**: Supports EN, ES, FR, DE, AR, ZH
✅ **Dark Mode**: Toggle between light and dark themes
✅ **Responsive**: Works on mobile, tablet, and desktop
✅ **Search**: Search across all news sources
✅ **Categories**: Filter by World, Politics, Business, Tech, Health, Sports, Entertainment
✅ **Social Sharing**: Share to Twitter, Facebook, LinkedIn, WhatsApp
✅ **Font Size Adjustment**: Accessibility feature
✅ **Newsletter**: Email subscription form (needs backend integration)

---

## 🚀 Next Steps

1. ✅ **Test locally**: Visit http://localhost:5000
2. 📝 **Customize content**: Update colors, logos, branding
3. 🔑 **Setup AdSense**: Add your publisher ID
4. 📊 **Add Analytics**: Insert your Google Analytics ID
5. 🌐 **Deploy**: Choose a hosting option above
6. 🔗 **Connect domain**: Point worldnews.day to your hosting
7. 📧 **Newsletter backend**: Integrate Mailchimp, SendGrid, or similar
8. 🔔 **Push notifications**: Add web push for breaking news

---

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Review API documentation:
   - https://newsapi.org/docs
   - https://gnews.io/docs
   - https://currentsapi.services/en/docs

---

## 🎉 Congratulations!

Your WorldNews.day website is ready to go live! 🚀

**Current Status**: ✅ Running at http://localhost:5000

**Ready to deploy?** Choose one of the deployment options above!
