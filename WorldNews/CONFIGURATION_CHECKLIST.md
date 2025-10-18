# WorldNews.day - Configuration Checklist

Use this checklist to ensure your website is properly configured before going live.

## ✅ Pre-Launch Checklist

### 1. API Configuration
- [x] NewsAPI key configured in `js/config.js`
- [x] GNews API key configured in `js/config.js`
- [x] CurrentsAPI key configured in `js/config.js`
- [ ] Test API calls are working
- [ ] Verify API rate limits are sufficient

### 2. Google AdSense Setup
- [ ] AdSense account created and approved
- [ ] Publisher ID added to `index.html`
- [ ] Publisher ID added to `js/config.js`
- [ ] Ad units created (4 units minimum)
- [ ] Ad slot IDs updated in `index.html`
- [ ] Ad slot IDs updated in `js/config.js`
- [ ] Test ads displaying correctly
- [ ] Ads comply with AdSense policies

**Ad Unit Locations to Update:**
1. `index.html` line ~110: Header Leaderboard
2. `index.html` line ~203: Sidebar Ad 1
3. `index.html` line ~228: Sidebar Ad 2
4. `index.html` line ~251: Footer Ad

### 3. Google Analytics Setup
- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] Measurement ID updated in `index.html` (2 locations)
- [ ] Test tracking is working
- [ ] Custom dimension for language configured

**Locations to Update:**
1. `index.html` line ~281: Analytics script URL
2. `index.html` line ~287: Config measurement ID

### 4. Content Verification
- [ ] News articles loading correctly
- [ ] RSS feeds working
- [ ] All categories functional
- [ ] Search working properly
- [ ] Featured carousel displaying
- [ ] Trending section populating

### 5. Multi-Language Testing
- [ ] English (en) - Complete
- [ ] Spanish (es) - Complete
- [ ] French (fr) - Complete
- [ ] German (de) - Complete
- [ ] Arabic (ar) - Complete + RTL working
- [ ] Chinese (zh) - Complete
- [ ] Language switcher functional
- [ ] All UI elements translated
- [ ] Language-specific news loading

### 6. Design & UI
- [ ] Red/Blue color scheme applied
- [ ] Dark mode toggle working
- [ ] Dark mode preference saved
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] Font size adjustment working
- [ ] All images loading
- [ ] Placeholder images working

### 7. Features Testing
- [ ] Newsletter signup form working
- [ ] Social share buttons working (Twitter, Facebook, LinkedIn, WhatsApp)
- [ ] Article modal opening/closing
- [ ] Category filtering
- [ ] Load more pagination
- [ ] Breaking news banner (if enabled)
- [ ] Reading time calculations
- [ ] Time formatting (minutes ago, etc.)

### 8. Performance
- [ ] Page loads in under 3 seconds
- [ ] Images lazy loading
- [ ] No console errors
- [ ] API caching working
- [ ] Auto-refresh (30 min) configured
- [ ] Mobile performance acceptable

### 9. SEO & Metadata
- [ ] Page title set
- [ ] Meta description set
- [ ] Meta keywords set
- [ ] Open Graph tags configured
- [ ] Hreflang tags for all languages
- [ ] Favicon added (create your own)
- [ ] Robots.txt created (if needed)
- [ ] Sitemap.xml created (if needed)

### 10. Security
- [ ] HTTPS enabled
- [ ] SSL certificate valid
- [ ] No mixed content warnings
- [ ] CORS configured for RSS feeds
- [ ] XSS protection in place
- [ ] Content Security Policy (optional)

### 11. Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### 12. Deployment
- [ ] Domain purchased (worldnews.day)
- [ ] DNS configured
- [ ] Hosting set up
- [ ] Files uploaded
- [ ] Permissions set correctly
- [ ] Server configured (Nginx/Apache)
- [ ] SSL configured
- [ ] Redirects working (www to non-www or vice versa)

### 13. Legal & Compliance
- [ ] Privacy Policy page created
- [ ] Terms of Service page created
- [ ] Cookie consent (if required)
- [ ] GDPR compliance (if applicable)
- [ ] Contact information added
- [ ] About Us page created

### 14. Monitoring & Analytics
- [ ] Google Analytics tracking working
- [ ] Search Console configured
- [ ] Error monitoring set up (optional)
- [ ] Uptime monitoring (optional)
- [ ] Performance monitoring

### 15. Backup & Maintenance
- [ ] Initial backup created
- [ ] Backup schedule established
- [ ] Update procedure documented
- [ ] Support contact configured
- [ ] Maintenance plan created

## 🔧 Quick Configuration Guide

### Replace These Values:

**In `index.html`:**
```html
<!-- Line ~110, ~203, ~228, ~251 -->
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"  → Your Publisher ID
data-ad-slot="XXXXXXXXXX"                  → Your Ad Slot ID

<!-- Line ~281, ~287 -->
GA_MEASUREMENT_ID                          → Your Analytics ID (G-XXXXXXXXXX)
```

**In `js/config.js`:**
```javascript
// Line ~17-19 (Already configured, but verify)
API_KEYS: {
    newsapi: '5ff2e88241d7494a8add4b009533eef1',
    gnews: 'dba2727f20fd5a6d763df225da065b48',
    currentsapi: 'PtGocmbDg_VtVUH-VvBMm0agRDJzdF3Zy-sgTc8lovnF0MFx'
}

// Line ~113-119 (Update with your AdSense IDs)
ADSENSE: {
    client: 'ca-pub-XXXXXXXXXXXXXXXX',     → Your Publisher ID
    slots: {
        leaderboard: 'XXXXXXXXXX',         → Header Ad Slot
        sidebar: 'XXXXXXXXXX',             → Sidebar Ad Slot
        inContent: 'XXXXXXXXXX',           → Content Ad Slot
        footer: 'XXXXXXXXXX'               → Footer Ad Slot
    }
}
```

## 📝 Post-Launch Tasks

### Week 1
- [ ] Monitor API usage
- [ ] Check AdSense impressions
- [ ] Review Analytics data
- [ ] Fix any reported bugs
- [ ] Gather user feedback

### Month 1
- [ ] Analyze traffic patterns
- [ ] Optimize based on analytics
- [ ] Add more RSS feeds if needed
- [ ] Update content categories
- [ ] Review monetization performance

### Ongoing
- [ ] Weekly: Check for broken RSS feeds
- [ ] Weekly: Review error logs
- [ ] Monthly: Update translations
- [ ] Monthly: Check API limits
- [ ] Quarterly: Update dependencies
- [ ] Quarterly: Security audit

## 🚨 Common Issues & Quick Fixes

### Issue: No articles showing
```javascript
// Check in browser console (F12)
// Should see API responses
// If not, verify API keys in js/config.js
```

### Issue: Ads not displaying
```html
<!-- Verify in index.html -->
<!-- 1. Publisher ID is correct -->
<!-- 2. Slot IDs are correct -->
<!-- 3. Wait 24-48 hours after setup -->
<!-- 4. Check AdSense account status -->
```

### Issue: Language not changing
```javascript
// Check browser console
// Verify translations.js is loaded
// Clear localStorage and try again
```

## ✨ Optional Enhancements

### Add Custom Logo
Replace text logo in `index.html`:
```html
<div class="logo">
    <img src="logo.png" alt="WorldNews.day" height="40">
</div>
```

### Add Custom Favicon
Create favicon.png (32x32 or 64x64) and update:
```html
<link rel="icon" type="image/png" href="favicon.png">
```

### Add More Languages
1. Add to `js/translations.js`
2. Add to `js/config.js` LANGUAGES
3. Add RSS feeds for that language
4. Test thoroughly

### Newsletter Integration
Replace in `js/main.js` `subscribeNewsletter()`:
```javascript
// Integrate with Mailchimp, SendGrid, etc.
// Use their API to add subscribers
```

## 📊 Success Metrics

Track these KPIs:
- [ ] Daily active users
- [ ] Average session duration
- [ ] Bounce rate
- [ ] Pages per session
- [ ] Ad CTR and revenue
- [ ] Newsletter signups
- [ ] Social shares
- [ ] Mobile vs Desktop traffic
- [ ] Language distribution

## 🎯 Goals

**Week 1:**
- 100+ visitors
- 1% ad CTR
- 5+ newsletter signups

**Month 1:**
- 1,000+ visitors
- $10+ ad revenue
- 50+ newsletter subscribers

**Month 3:**
- 10,000+ visitors
- $100+ ad revenue
- 500+ newsletter subscribers

---

## ✅ Final Verification

Before launching, answer YES to all:
- [ ] Can I load the website?
- [ ] Do news articles appear?
- [ ] Does language switching work?
- [ ] Can I search for news?
- [ ] Do social share buttons work?
- [ ] Is dark mode functional?
- [ ] Does the mobile view work?
- [ ] Are ads showing (or will show soon)?
- [ ] Is Analytics tracking?
- [ ] Is HTTPS working?

**If all YES → You're ready to launch! 🚀**

---

*Last updated: 2025*
*WorldNews.day Configuration Team*
