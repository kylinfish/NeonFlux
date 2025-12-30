# NeonFlux Intro & Privacy Pages

## Overview

Two new pages have been added to enhance the NeonFlux extension:

### 1. **intro.html** - Welcome/Onboarding Page
A beautiful, modern introduction page showcasing NeonFlux features with:

**Features:**
- Liquid glass design with animated background blobs
- Bilingual support (Traditional Chinese & English)
- Language toggle in header
- Hero section with compelling headline
- 6 feature cards with icons and descriptions
- Screenshot gallery with **lightbox functionality**
- Call-to-action section
- Responsive design for all screen sizes

**Lightbox Features:**
- Click any screenshot to open fullscreen view
- Navigate with arrow buttons or keyboard (← →)
- Close with ESC key or close button
- Smooth animations and transitions

**Usage:**
```
intro.html - Main entry point for new users
```

### 2. **privacy.html** - Privacy Policy Page
A comprehensive privacy policy compliant with Chrome Web Store requirements:

**Sections:**
- Overview
- Data Collection (browsing history, shortcuts, settings, favicons)
- Data Usage (categorization, search, display, preferences)
- Data Storage (local-only, no cloud upload)
- Permissions (history, storage, tabs)
- Third-Party Services (DuckDuckGo, Google Favicon API)
- User Rights (access, delete, uninstall, opt-out)
- Contact Information

**Compliance:**
✅ Complies with Chrome Web Store Privacy Policy requirements
✅ Clearly states local-only data storage
✅ Explains all permissions usage
✅ Discloses third-party services
✅ Provides user control information

**Bilingual Support:**
- Traditional Chinese (繁體中文)
- English
- Language preference synced with intro.html

**Anchor Navigation:**
- Direct links to sections via URL hash
- Example: `privacy.html#data-storage`
- Table of contents with clickable links

### 3. **Integration**

**From intro.html:**
- "Get Started" button → navigates to `newtab.html`
- "Learn More" button → scrolls to features section
- Privacy link in footer → navigates to `privacy.html`

**From privacy.html:**
- Logo click → returns to `intro.html`
- Language toggle synced across pages

### 4. **Manifest Configuration**

To set intro.html as the default new tab page, update `manifest.json`:

```json
{
  "chrome_url_overrides": {
    "newtab": "intro.html"
  }
}
```

Or keep both pages and link them appropriately.

### 5. **Features Implemented**

✅ Lightbox image viewer with keyboard navigation
✅ Bilingual UI (Chinese/English)
✅ Liquid glass design matching existing theme
✅ Chrome Web Store compliant privacy policy
✅ Anchor-based navigation
✅ Responsive design
✅ Smooth animations
✅ Accessibility considerations

### 6. **SVG Icons Used**

The intro page uses lightweight SVG icons from the icons.js library:

- **tag** - Auto-categorize feature
- **search** - Smart search feature
- **eye** - Privacy curtain feature
- **star** - Quick links feature
- **layers** - Focus view feature
- **globe** - Multi-language support

All icons are:
- Lightweight and scalable
- Consistent with the design system
- Accessible and clear
- Properly colored with CSS variables

### 7. **File Structure**

```
NeonFlux/
├── intro.html           # Welcome/onboarding page
├── privacy.html         # Privacy policy page
├── newtab.html          # Main app (existing)
├── i18n.js              # Shared translations
├── icons.js             # Shared icons (updated with new SVG icons)
└── screenshots/         # Used in intro.html
    ├── auto-categorized.png
    ├── customized-categories.png
    ├── display-mode-change.png
    ├── focus-mode.png
    ├── header-shortcut&four-columns.png
    └── curtain&two-column.png
```

### 8. **Testing**

1. Open `intro.html` in browser
2. Test language toggle (Chinese ↔ English)
3. Click screenshots to open lightbox
4. Use arrow keys to navigate images
5. Click privacy link to go to privacy.html
6. Test anchor navigation: `privacy.html#data-storage`
7. Test responsive design on mobile/tablet

### 9. **Browser Compatibility**

- Chrome 90+
- Edge 90+
- Brave
- Other Chromium-based browsers

All modern CSS features used are widely supported.
