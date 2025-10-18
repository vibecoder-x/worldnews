# WorldNews.day - Auto-Refresh Feature Guide

## 🔄 How Auto-Refresh Works

Your WorldNews.day website has **TWO ways** to refresh news:

### 1. ✅ Automatic Refresh (Background)
**Happens automatically every 30 minutes**

### 2. ✅ Manual Refresh (Button Click)
**Click the refresh button anytime you want fresh news**

---

## 🤖 Automatic Refresh

### How It Works:
- **Interval**: Every 30 minutes (1,800,000 milliseconds)
- **What Refreshes**:
  - ✅ Featured News carousel
  - ✅ Main news articles
  - ✅ Trending sidebar
  - ✅ All categories
- **Notification**: A slide-in notification appears in the top-right corner
- **Cache**: Clears old news cache before loading new articles

### Configuration:
Located in `js/config.js`:
```javascript
DEFAULTS: {
    autoRefreshInterval: 1800000, // 30 minutes in milliseconds
}
```

### Change the Auto-Refresh Interval:

**To refresh every 15 minutes:**
```javascript
autoRefreshInterval: 900000, // 15 minutes
```

**To refresh every 60 minutes:**
```javascript
autoRefreshInterval: 3600000, // 60 minutes
```

**To refresh every 5 minutes:**
```javascript
autoRefreshInterval: 300000, // 5 minutes
```

**Common intervals:**
- 5 minutes = 300000
- 10 minutes = 600000
- 15 minutes = 900000
- 30 minutes = 1800000 (default)
- 1 hour = 3600000
- 2 hours = 7200000

### Disable Auto-Refresh:

If you want to disable automatic refresh completely:

**Option 1: In `js/main.js`, comment out the auto-refresh:**
```javascript
async init() {
    this.setupEventListeners();
    // this.startAutoRefresh(); // ← Comment this line
    await this.loadInitialNews();
    this.initializeAdSense();
}
```

**Option 2: Set a very long interval:**
```javascript
autoRefreshInterval: 86400000, // 24 hours
```

---

## 🔘 Manual Refresh Button

### Location:
Top-right corner of the header, next to the language switcher

### Features:
- **Icon**: Rotating sync icon (🔄)
- **Hover Effect**: Button lifts up, icon rotates
- **Click Effect**:
  - Icon spins continuously while refreshing
  - Blue notification slides in from right
  - All news sections reload
  - Notification disappears after 3 seconds

### What It Does:
1. Clears news cache
2. Reloads featured news
3. Reloads main articles
4. Reloads trending news
5. Shows visual feedback

### How to Use:
Simply click the refresh button (🔄) anytime you want fresh news!

---

## 📊 What Gets Refreshed

### Featured News Carousel:
- Fetches 5 latest articles
- Updates in current language
- Shows in carousel at top

### Main News Grid:
- Fetches 12 articles per page
- Filtered by current category
- Language-specific sources

### Trending Sidebar:
- Fetches 5 trending articles
- Updates with current language
- Shows numbered list

---

## 🎨 Visual Feedback

### Notification:
- **Position**: Top-right corner
- **Color**: Blue gradient (matches theme)
- **Icon**: Spinning sync icon
- **Text**: "Refreshing news..." (translates to current language)
- **Animation**: Slides in from right, slides out after 3 seconds
- **Languages**:
  - English: "Refreshing news..."
  - Spanish: "Actualizando noticias..."
  - French: "Actualisation des nouvelles..."
  - German: "Nachrichten aktualisieren..."
  - Arabic: "جاري تحديث الأخبار..."
  - Chinese: "正在刷新新闻..."

### Button States:
- **Normal**: Blue gradient button with sync icon
- **Hover**: Lifts up, icon rotates 180°
- **Clicking**: Icon spins continuously
- **After Refresh**: Returns to normal after 2 seconds

---

## ⏱️ Timing Breakdown

### Auto-Refresh Timeline:
```
Page Load → Initial News Load
   ↓
30 minutes pass
   ↓
Auto-Refresh Triggered
   ↓
- Clear cache
- Show notification
- Fetch new news (all sections)
- Update display
   ↓
30 minutes pass
   ↓
Auto-Refresh again
   ↓
(continues indefinitely)
```

### Manual Refresh Timeline:
```
User Clicks Refresh Button
   ↓
Immediate Response:
- Button shows "refreshing" animation
- Notification appears
   ↓
Within 1-3 seconds:
- Cache cleared
- New news fetched from APIs/RSS
- All sections update
   ↓
After 2 seconds:
- Button animation stops
   ↓
After 3 seconds:
- Notification disappears
```

---

## 🔧 Customization Options

### 1. Change Refresh Interval

Edit `js/config.js`:
```javascript
DEFAULTS: {
    autoRefreshInterval: YOUR_INTERVAL_HERE, // in milliseconds
}
```

### 2. Disable Notification

Edit `js/main.js` in the `startAutoRefresh()` function:
```javascript
startAutoRefresh() {
    this.autoRefreshTimer = setInterval(() => {
        console.log('Auto-refreshing news...');
        // this.showRefreshNotification(); // ← Comment this line
        newsAPI.clearCache();
        this.currentPage = 1;
        this.loadNews();
        this.loadFeaturedNews();
        this.loadTrendingNews();
    }, CONFIG.DEFAULTS.autoRefreshInterval);
}
```

### 3. Change Notification Duration

Edit `js/main.js` in the `showRefreshNotification()` function:
```javascript
// Remove after 3 seconds (change 3000 to your preferred duration)
setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
}, 3000); // ← Change this number (in milliseconds)
```

### 4. Change Notification Position

Edit `js/main.js` in the `showRefreshNotification()` function:
```javascript
notification.style.cssText = `
    position: fixed;
    top: 80px;      // ← Change vertical position
    right: 20px;    // ← Change horizontal position (use left: for left side)
    ...
`;
```

### 5. Hide Manual Refresh Button

Edit `index.html` and remove or comment out:
```html
<!-- Manual Refresh Button -->
<!-- Comment out to hide:
<button class="refresh-btn" onclick="manualRefresh()" title="Refresh news">
    <i class="fas fa-sync-alt"></i>
</button>
-->
```

---

## 🐛 Troubleshooting

### Auto-Refresh Not Working?

**Check 1: Is it enabled?**
```javascript
// In main.js, verify startAutoRefresh() is being called
async init() {
    this.setupEventListeners();
    this.startAutoRefresh(); // ← Should be here
    await this.loadInitialNews();
}
```

**Check 2: Console logs**
Open browser console (F12) and look for:
```
Auto-refreshing news...
```
This should appear every 30 minutes.

**Check 3: Interval setting**
Verify in `js/config.js`:
```javascript
autoRefreshInterval: 1800000, // Should be a number
```

### Manual Refresh Button Not Showing?

**Check 1: HTML**
Verify in `index.html` around line 65:
```html
<button class="refresh-btn" onclick="manualRefresh()" ...>
```

**Check 2: CSS loaded**
Verify `css/styles.css` is loaded and contains `.refresh-btn` styles

**Check 3: Browser cache**
Clear cache and hard refresh: `Ctrl + Shift + R`

### Notification Not Appearing?

**Check 1: Browser console for errors**
Open F12 → Console tab

**Check 2: Verify function exists**
In console, type:
```javascript
app.showRefreshNotification()
```

**Check 3: Check z-index**
The notification has `z-index: 10000` to appear on top

---

## 📱 Mobile Considerations

### Auto-Refresh on Mobile:
- ✅ Works the same as desktop
- ✅ Notification appears (adjusted for smaller screens)
- ✅ Manual refresh button visible

### Battery Impact:
- **Minimal**: Only fetches data every 30 minutes
- **Optimized**: Uses cached data when available
- **Efficient**: Only updates when tab is active

### Mobile Data Usage:
- **Per Refresh**: ~50-100KB (depending on images)
- **Per Hour**: ~100-200KB (2 refreshes)
- **Per Day**: ~2-5MB (if tab stays open)

---

## 🎯 Best Practices

### For News Websites:
- ✅ Keep auto-refresh at 15-30 minutes
- ✅ Show visual feedback (notification)
- ✅ Provide manual refresh button
- ✅ Cache articles to reduce API calls

### For Testing:
- Set to 1 minute (60000) to test quickly
- Watch console for "Auto-refreshing news..."
- Monitor Network tab for API calls

### For Production:
- 30 minutes is optimal
- Balances freshness vs. API limits
- Reduces server load
- Better user experience

---

## 📊 API Rate Limits

### NewsAPI:
- **Free**: 100 requests/day
- **With 30-min refresh**: ~48 requests/day ✅
- **With 15-min refresh**: ~96 requests/day ✅
- **With 5-min refresh**: ~288 requests/day ❌ (exceeds limit)

### GNews:
- **Free**: 100 requests/day
- **Safe interval**: 15-30 minutes

### CurrentsAPI:
- **Free**: 600 requests/day
- **Safe interval**: Any (very generous)

### Recommendation:
**Use 30-minute interval** to stay well within all API limits.

---

## 🚀 Testing Auto-Refresh

### Quick Test (1-minute interval):

1. **Open `js/config.js`**
2. **Change interval**:
   ```javascript
   autoRefreshInterval: 60000, // 1 minute for testing
   ```
3. **Save and refresh browser**
4. **Wait 1 minute** → Should see notification
5. **Check console** → Should see "Auto-refreshing news..."
6. **Restore to 30 minutes** when done testing

### Monitor Refreshes:

Open browser console (F12) and run:
```javascript
// See when last refresh happened
console.log('Last refresh will happen in:',
    CONFIG.DEFAULTS.autoRefreshInterval / 60000, 'minutes');

// Force a refresh now
manualRefresh();

// Check current articles
console.log('Current articles:', app.articles.length);
```

---

## ✅ Summary

### Current Setup:
- ✅ Auto-refresh: Every 30 minutes
- ✅ Manual refresh: Button in header
- ✅ Visual feedback: Slide-in notification
- ✅ Refreshes all sections: Featured, Main, Trending
- ✅ Multi-language: Notification text translates
- ✅ Cache clearing: Fresh news every time
- ✅ API-friendly: Stays within rate limits

### You DON'T need to refresh manually unless:
- You want news RIGHT NOW (can't wait 30 minutes)
- You changed categories
- You want to force a cache clear

### The system will automatically:
- ✅ Refresh every 30 minutes
- ✅ Show you a notification
- ✅ Load fresh news
- ✅ Update all sections
- ✅ Clear old cache

---

## 🎉 Enjoy Automatic Fresh News!

Your website is set up for the perfect balance of:
- **Freshness**: News updates every 30 minutes
- **Efficiency**: Doesn't exceed API limits
- **User Control**: Manual refresh button available
- **Visual Feedback**: Clear notifications
- **Performance**: Cached data when possible

**Your website is now FULLY AUTOMATIC!** 🚀
