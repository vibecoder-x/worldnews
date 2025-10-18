# WorldNews.day - Testing Guide

## ✅ What I Just Fixed

### Issue: Language Change Not Updating Featured News
**Problem**: When changing languages, the "Featured News" heading text would update, but the actual news articles in the carousel wouldn't reload in the new language.

**Solution**: Updated `main.js` to reload both featured news and trending news when the language changes:
```javascript
window.addEventListener('languageChanged', () => {
    this.currentPage = 1;
    this.loadNews();           // Main articles
    this.loadFeaturedNews();   // ✅ NEW - Featured carousel
    this.loadTrendingNews();   // ✅ NEW - Trending sidebar
});
```

---

## 🧪 How to Test Language Switching

### Step 1: Open Your Website
Visit: **http://localhost:5000**

### Step 2: Test Language Changes

1. **Click the Globe Icon** (🌐) in the header
2. **Select a Language**:
   - English (EN)
   - Español (ES)
   - Français (FR)
   - Deutsch (DE)
   - العربية (AR) - Right-to-left layout
   - 中文 (ZH)

### Step 3: What Should Change

When you change languages, verify these updates:

#### ✅ Static UI Elements (Should Update Immediately):
- [ ] Navigation menu (Home, World, Politics, etc.)
- [ ] "Featured News" heading
- [ ] "Latest News" heading
- [ ] "Trending Now" heading
- [ ] "Categories" sidebar
- [ ] "Stay Updated" newsletter section
- [ ] "Load More" button
- [ ] Search placeholder text
- [ ] Footer text
- [ ] All button labels

#### ✅ Dynamic Content (May Take 1-2 Seconds):
- [ ] Featured news carousel articles (should reload)
- [ ] Main news articles (should reload)
- [ ] Trending news list (should reload)
- [ ] Article timestamps format
- [ ] Article sources (if available in that language)

#### ✅ Layout Changes:
- [ ] **Arabic (AR)**: Page should flip to right-to-left layout
- [ ] **All others**: Left-to-right layout

---

## 🔍 What's Actually Happening When You Change Language

### Behind the Scenes:

1. **User clicks language** → `changeLanguage('es')` is called
2. **i18n updates**:
   - Sets `currentLanguage = 'es'`
   - Saves to localStorage
   - Updates HTML `lang` attribute
   - Updates text direction (RTL for Arabic)
3. **Translations update**:
   - All elements with `data-i18n` attributes get new text
   - Placeholders update
   - Aria labels update
4. **Event fired**: `languageChanged` event is dispatched
5. **Content reloads**:
   - Main articles reload with Spanish news
   - Featured carousel reloads with Spanish news
   - Trending sidebar reloads with Spanish news

---

## 🌍 How News Sources Work Per Language

### Language → News Sources Mapping:

**English (en)**:
- NewsAPI: US news
- RSS: BBC, CNN, Reuters, Al Jazeera, TechCrunch

**Spanish (es)**:
- NewsAPI: Spanish news
- RSS: BBC Mundo, CNN Español

**French (fr)**:
- NewsAPI: French news
- RSS: BBC Afrique, France 24

**German (de)**:
- NewsAPI: German news
- RSS: Deutsche Welle

**Arabic (ar)**:
- NewsAPI: UAE/Middle East news
- RSS: Al Jazeera Arabic

**Chinese (zh)**:
- NewsAPI: Chinese news
- RSS: Xinhua News

---

## 🐛 Troubleshooting Language Issues

### Problem: UI Text Updates But News Stays the Same

**Possible Causes**:
1. **API Rate Limit**: You may have hit the API request limit
   - Solution: Wait 15 minutes (cache expiry) or clear cache

2. **No News Available**: That language/category combo has no articles
   - Solution: Try a different category or language

3. **Network Error**: API request failed
   - Solution: Check browser console for errors

**How to Check**:
```javascript
// Open browser console (F12) and type:
newsAPI.clearCache();
app.loadNews();
app.loadFeaturedNews();
app.loadTrendingNews();
```

### Problem: Some Text Not Translating

**Check**:
1. Is the element in `index.html` missing `data-i18n` attribute?
2. Is the translation key in `js/translations.js`?
3. Try hard refresh: `Ctrl + Shift + R`

### Problem: Arabic Not Right-to-Left

**Check**:
1. Verify `dir="rtl"` is set on `<html>` and `<body>`
2. Check browser console for errors
3. Refresh page

---

## 📊 Test Checklist

### Basic Functionality
- [ ] Change to Spanish → UI updates + News reloads in Spanish
- [ ] Change to French → UI updates + News reloads in French
- [ ] Change to German → UI updates + News reloads in German
- [ ] Change to Arabic → RTL layout + UI updates + Arabic news
- [ ] Change to Chinese → UI updates + Chinese news
- [ ] Change back to English → Everything returns to English

### Featured News Carousel
- [ ] Changes language when switching
- [ ] Shows 5 articles
- [ ] Articles are clickable
- [ ] Carousel navigation works (left/right arrows)

### Main News Section
- [ ] Shows articles in selected language
- [ ] Articles have correct timestamps
- [ ] "Load More" button works
- [ ] Grid/List view toggle works

### Trending Section
- [ ] Updates when language changes
- [ ] Shows 5 trending items
- [ ] Items are clickable

### Categories
- [ ] Category names translate
- [ ] Clicking categories loads correct news
- [ ] Active category is highlighted

### Search
- [ ] Search placeholder translates
- [ ] Search works in all languages
- [ ] Results appear correctly

---

## 🎯 Expected Behavior

### ✅ CORRECT:
- **Switch to Spanish** → Headlines like "El presidente anuncia...", "Economía española..."
- **Switch to French** → Headlines like "Le président annonce...", "L'économie française..."
- **Switch to Arabic** → Headlines in Arabic script, page flips to RTL
- **All UI elements** translate immediately

### ❌ INCORRECT:
- UI translates but news stays in English
- Page doesn't reload featured/trending news
- Layout doesn't flip for Arabic
- Timestamps don't update

---

## 💡 Pro Tips

1. **Clear Cache**: If news doesn't update, clear browser cache or wait 15 minutes
2. **Check Console**: Open F12 → Console to see any errors
3. **Network Tab**: F12 → Network → See API requests being made
4. **localStorage**: Check `worldnews_language` in localStorage to see saved language

---

## 🚀 Quick Test Commands

Open browser console (F12) and try:

```javascript
// Check current language
i18n.getCurrentLanguage()

// Manually change language
changeLanguage('es')

// Reload all news
app.loadNews()
app.loadFeaturedNews()
app.loadTrendingNews()

// Clear cache and reload
newsAPI.clearCache()
location.reload()

// Check translations
i18n.t('featured_news')  // Should return translated text
```

---

## ✅ All Fixed Issues

1. ✅ Script loading order (translations.js before i18n.js)
2. ✅ Favicon 404 error
3. ✅ Featured news not reloading on language change
4. ✅ Trending news not reloading on language change
5. ✅ i18n is not defined error

---

## 🎉 Your Website is Ready!

Everything should now work perfectly. Refresh your browser and test the language switcher!

**Server**: http://localhost:5000
**Current Status**: ✅ Running and Fixed
