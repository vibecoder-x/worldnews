# WorldNews.day - Detailed Setup Guide

Complete step-by-step instructions for setting up and deploying WorldNews.day.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [API Configuration](#api-configuration)
4. [AdSense Setup](#adsense-setup)
5. [Analytics Setup](#analytics-setup)
6. [Deployment Options](#deployment-options)
7. [Domain Configuration](#domain-configuration)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required
- Modern web browser
- Text editor (VS Code, Sublime, etc.)
- Web server (local or remote)
- Basic HTML/CSS/JavaScript knowledge

### Optional
- Git for version control
- Node.js for local development server
- FTP client for file uploads

## Installation

### Step 1: Download Files
```bash
# Option A: Clone repository
git clone https://github.com/yourusername/worldnews.day.git
cd worldnews

# Option B: Download ZIP and extract
unzip worldnews.zip
cd worldnews
```

### Step 2: Verify File Structure
Ensure you have all these files:
```
worldnews/
├── index.html
├── css/
│   ├── styles.css
│   ├── dark-mode.css
│   └── responsive.css
├── js/
│   ├── config.js
│   ├── translations.js
│   ├── i18n.js
│   ├── news-api.js
│   ├── rss-feeds.js
│   ├── dark-mode.js
│   └── main.js
└── README.md
```

## API Configuration

### News APIs

#### NewsAPI (Already Configured)
The API key is already set in `js/config.js`:
```javascript
newsapi: '5ff2e88241d7494a8add4b009533eef1'
```

**To get your own key:**
1. Visit https://newsapi.org/register
2. Create free account (500 requests/day)
3. Copy your API key
4. Replace in `js/config.js`

#### GNews (Already Configured)
The API key is already set in `js/config.js`:
```javascript
gnews: 'dba2727f20fd5a6d763df225da065b48'
```

**To get your own key:**
1. Visit https://gnews.io/register
2. Create free account (100 requests/day)
3. Copy your API key
4. Replace in `js/config.js`

#### CurrentsAPI (Already Configured)
The API key is already set in `js/config.js`:
```javascript
currentsapi: 'PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx'
```

**To get your own key:**
1. Visit https://currentsapi.services/en/register
2. Create free account
3. Copy your API key
4. Replace in `js/config.js`

### RSS Feeds Configuration

RSS feeds are pre-configured in `js/config.js`. To add more:

```javascript
RSS_FEEDS: {
    en: [
        {
            name: 'Your News Source',
            url: 'https://example.com/rss.xml',
            category: 'world' // or 'business', 'technology', etc.
        },
        // Add more feeds...
    ]
}
```

## AdSense Setup

### Step 1: Create AdSense Account
1. Go to https://www.google.com/adsense
2. Sign up with your Google account
3. Add your website URL
4. Wait for approval (can take 1-3 days)

### Step 2: Get Publisher ID
1. Once approved, go to AdSense dashboard
2. Click "Ads" → "Overview"
3. Find your Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)

### Step 3: Create Ad Units
Create these ad units:
1. **Header Leaderboard**: 728x90 (Desktop) / Responsive (Mobile)
2. **Sidebar Rectangle**: 300x250
3. **In-Content**: Responsive
4. **Footer**: 728x90 / Responsive

For each ad unit, copy the Ad Slot ID (10-digit number)

### Step 4: Update Code

**In `index.html`**, replace all instances:
```html
<!-- Replace this -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
data-ad-slot="XXXXXXXXXX"

<!-- With your actual IDs -->
data-ad-client="ca-pub-1234567890123456"
data-ad-slot="1234567890"
```

**In `js/config.js`**:
```javascript
ADSENSE: {
    client: 'ca-pub-1234567890123456',  // Your publisher ID
    slots: {
        leaderboard: '1234567890',       // Header ad slot
        sidebar: '0987654321',           // Sidebar ad slot
        inContent: '1122334455',         // In-content ad slot
        footer: '5544332211'             // Footer ad slot
    }
}
```

### Step 5: Add AdSense Script
The AdSense script is already in `index.html`:
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
```

## Analytics Setup

### Google Analytics 4

#### Step 1: Create Property
1. Go to https://analytics.google.com
2. Click "Admin" → "Create Property"
3. Enter property name: "WorldNews.day"
4. Configure timezone and currency
5. Click "Create"

#### Step 2: Create Data Stream
1. Select "Web" platform
2. Enter website URL: `https://worldnews.day`
3. Enter stream name
4. Click "Create stream"

#### Step 3: Get Measurement ID
1. Copy Measurement ID (format: `G-XXXXXXXXXX`)
2. Find in stream details

#### Step 4: Update Code

**In `index.html`**, replace:
```html
<!-- Replace GA_MEASUREMENT_ID with your actual ID -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    'custom_map': {'dimension1': 'language'}
  });
</script>
```

## Deployment Options

### Option 1: GitHub Pages (Free)

1. Create GitHub repository
2. Upload all files
3. Go to Settings → Pages
4. Select branch: `main`
5. Click Save
6. Access at: `https://yourusername.github.io/worldnews`

### Option 2: Netlify (Free)

1. Create account at https://netlify.com
2. Connect GitHub repository OR drag & drop folder
3. Deploy settings:
   - Build command: (leave empty)
   - Publish directory: `/`
4. Click "Deploy"
5. Get free subdomain: `random-name.netlify.app`
6. Add custom domain if desired

### Option 3: Vercel (Free)

1. Create account at https://vercel.com
2. Import GitHub repository OR upload files
3. Framework Preset: "Other"
4. Click "Deploy"
5. Get free subdomain: `projectname.vercel.app`

### Option 4: Traditional Web Hosting

#### Upload via FTP:
```bash
# Using FileZilla or similar
Host: ftp.yourhosting.com
Username: your-username
Password: your-password
Port: 21

# Upload all files to public_html or www directory
```

#### Upload via cPanel:
1. Login to cPanel
2. Go to File Manager
3. Navigate to `public_html`
4. Click Upload
5. Select all project files
6. Wait for upload to complete

### Option 5: VPS/Cloud Server

#### Using Nginx:
```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create site configuration
sudo nano /etc/nginx/sites-available/worldnews

# Add configuration
server {
    listen 80;
    server_name worldnews.day www.worldnews.day;
    root /var/www/worldnews;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/worldnews /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Upload files
sudo mkdir -p /var/www/worldnews
# Upload all files to /var/www/worldnews
```

#### Using Apache:
```bash
# Install Apache
sudo apt update
sudo apt install apache2

# Create virtual host
sudo nano /etc/apache2/sites-available/worldnews.conf

# Add configuration
<VirtualHost *:80>
    ServerName worldnews.day
    ServerAlias www.worldnews.day
    DocumentRoot /var/www/worldnews

    <Directory /var/www/worldnews>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>

# Enable site
sudo a2ensite worldnews
sudo systemctl reload apache2

# Upload files
sudo mkdir -p /var/www/worldnews
# Upload all files to /var/www/worldnews
```

## Domain Configuration

### Step 1: Purchase Domain
Purchase `worldnews.day` from:
- Namecheap
- GoDaddy
- Google Domains
- Cloudflare

### Step 2: Configure DNS

#### For GitHub Pages:
```
Type: A
Name: @
Value: 185.199.108.153

Type: CNAME
Name: www
Value: yourusername.github.io
```

#### For Netlify:
```
Type: CNAME
Name: @
Value: your-site.netlify.app

Type: CNAME
Name: www
Value: your-site.netlify.app
```

#### For VPS:
```
Type: A
Name: @
Value: YOUR.SERVER.IP.ADDRESS

Type: A
Name: www
Value: YOUR.SERVER.IP.ADDRESS
```

### Step 3: SSL Certificate

#### Free SSL with Let's Encrypt:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d worldnews.day -d www.worldnews.day

# Auto-renewal
sudo certbot renew --dry-run
```

## Testing

### Local Testing
1. Start local server:
   ```bash
   python -m http.server 8000
   ```
2. Open http://localhost:8000
3. Test all features:
   - [ ] News articles loading
   - [ ] Language switcher
   - [ ] Dark mode toggle
   - [ ] Search functionality
   - [ ] Category filtering
   - [ ] Mobile responsive
   - [ ] Article modal
   - [ ] Social sharing

### Production Testing
1. Check all pages load correctly
2. Verify HTTPS is working
3. Test on multiple devices
4. Check different browsers
5. Validate HTML/CSS
6. Test loading speed
7. Check SEO meta tags

### Performance Testing
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse audit

## Troubleshooting

### Issue: Articles not loading
**Solution:**
1. Check browser console for errors
2. Verify API keys are valid
3. Check internet connection
4. Clear browser cache
5. Try different API in `news-api.js`

### Issue: CORS errors with RSS feeds
**Solution:**
1. RSS feeds require CORS proxy
2. Default proxy: `https://api.allorigins.win/raw?url=`
3. Alternative: `https://corsproxy.io/?`
4. Change in `js/rss-feeds.js`:
   ```javascript
   this.corsProxy = 'https://corsproxy.io/?';
   ```

### Issue: Dark mode not saving
**Solution:**
1. Check localStorage is enabled
2. Clear browser data
3. Check console for errors
4. Verify `dark-mode.js` is loaded

### Issue: Wrong language displayed
**Solution:**
1. Check browser language settings
2. Clear localStorage
3. Manually select language
4. Verify translation files

### Issue: Ads not showing
**Solution:**
1. Verify AdSense account approved
2. Check ad codes are correct
3. Wait 24-48 hours for ads to activate
4. Check browser ad blockers
5. Verify site is HTTPS

### Issue: Mobile menu not working
**Solution:**
1. Check JavaScript loaded
2. Clear cache
3. Test in different mobile browser
4. Check console for errors

## Performance Optimization

### Images
```javascript
// Already implemented lazy loading
<img loading="lazy" src="...">
```

### Caching
Add to `.htaccess` (Apache):
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType text/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
</IfModule>
```

### Compression
Enable Gzip (Nginx):
```nginx
gzip on;
gzip_types text/css application/javascript;
```

## Maintenance

### Regular Tasks
- [ ] Monitor API usage limits
- [ ] Check for broken RSS feeds
- [ ] Update translations
- [ ] Review analytics
- [ ] Test on new browsers
- [ ] Update dependencies
- [ ] Backup files regularly

### Updates
```bash
# Keep local copy
git pull origin main

# Re-deploy
# Upload changed files only
```

## Support

Need help? Check:
1. README.md for features
2. Browser console for errors
3. API documentation
4. Create GitHub issue

---

**Setup Complete! 🎉**

Your WorldNews.day website should now be live and ready to serve global news to readers worldwide!
