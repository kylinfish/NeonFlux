# Intro Folder Structure

## Overview

This folder contains all NeonFlux intro and privacy-related pages.

## Files

### Pages
- **index.html** - Main intro/welcome page with features showcase
- **privacy.html** - Privacy policy page (Chrome Web Store compliant)

### Documentation
- **README.md** - Complete guide for intro and privacy pages
- **SVG_ICONS.md** - SVG icons implementation details
- **STRUCTURE.md** - This file

## Features

### index.html (Intro Page)
- Bilingual support (Traditional Chinese & English)
- Language toggle in header
- Hero section with compelling headline
- 6 feature cards with SVG icons
- Screenshot gallery with lightbox functionality
- Call-to-action section
- Responsive design
- Liquid glass design aesthetic

**Key Features:**
- Click screenshots to open fullscreen lightbox
- Navigate with arrow buttons or keyboard (← →)
- Close with ESC key
- Smooth animations and transitions

### privacy.html (Privacy Policy)
- Chrome Web Store compliant
- Bilingual support (Traditional Chinese & English)
- Table of contents with anchor links
- Sections covering:
  - Data collection
  - Data usage
  - Data storage (local-only)
  - Permissions explanation
  - Third-party services
  - User rights
  - Contact information

## Navigation

### From index.html
- "Get Started" button → `../newtab.html` (main app)
- "Learn More" button → scrolls to features
- Privacy link in footer → `./privacy.html`

### From privacy.html
- Logo click → `./index.html`
- Anchor links → direct navigation to sections

## Path References

All paths are relative to the intro folder:

```
intro/
├── index.html              # Main intro page
├── privacy.html            # Privacy policy
├── README.md               # Full documentation
├── SVG_ICONS.md            # Icon details
├── STRUCTURE.md            # This file
└── (references to parent folder)
    ├── ../icon.png         # App icon
    ├── ../i18n.js          # Translations
    ├── ../icons.js         # SVG icons
    ├── ../newtab.html      # Main app
    └── ../screenshots/     # Feature screenshots
```

## Manifest Configuration

To set intro as default new tab page, update `manifest.json`:

```json
{
  "chrome_url_overrides": {
    "newtab": "intro/index.html"
  }
}
```

## SVG Icons Used

- **tag** - Auto-categorize
- **search** - Smart search
- **eye** - Privacy curtain
- **star** - Quick links
- **layers** - Focus view
- **globe** - Multi-language

All icons are lightweight, scalable, and inherit theme colors.

## Bilingual Support

Both pages support:
- **中文 (Traditional Chinese)** - Default
- **English** - Toggle available

Language preference is stored in localStorage and synced across pages.

## Browser Support

- Chrome 90+
- Edge 90+
- Firefox 88+
- Safari 14+
- All modern Chromium-based browsers

## Testing Checklist

- [ ] Open `intro/index.html` in browser
- [ ] Test language toggle (Chinese ↔ English)
- [ ] Click screenshots to open lightbox
- [ ] Use arrow keys to navigate images
- [ ] Click privacy link to go to privacy.html
- [ ] Test anchor navigation: `privacy.html#data-storage`
- [ ] Test responsive design on mobile/tablet
- [ ] Verify all links work correctly
- [ ] Check console for errors

## Future Enhancements

- [ ] Add more feature cards
- [ ] Expand screenshot gallery
- [ ] Add video tutorials
- [ ] Implement analytics
- [ ] Add FAQ section
- [ ] Create onboarding flow
