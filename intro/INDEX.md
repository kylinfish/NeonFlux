# NeonFlux Intro Pages - Quick Start

Welcome to the NeonFlux intro folder! This folder contains all onboarding and privacy-related pages for the NeonFlux Chrome extension.

## 📁 Folder Contents

```
intro/
├── index.html          # Main intro/welcome page
├── privacy.html        # Privacy policy page
├── README.md           # Complete documentation
├── SVG_ICONS.md        # Icon implementation guide
├── STRUCTURE.md        # Folder structure details
└── INDEX.md            # This file
```

## 🚀 Quick Links

### Pages
- **[Intro Page](./index.html)** - Welcome page with features showcase
- **[Privacy Policy](./privacy.html)** - Chrome Web Store compliant privacy policy

### Documentation
- **[Full Guide](./README.md)** - Complete intro and privacy pages documentation
- **[SVG Icons](./SVG_ICONS.md)** - Details about SVG icon implementation
- **[Structure](./STRUCTURE.md)** - Folder organization and file structure

## ✨ Features

### Intro Page (index.html)
- 🌐 Bilingual support (Traditional Chinese & English)
- 🎨 Liquid glass design with animated backgrounds
- 📸 Screenshot gallery with lightbox viewer
- ⌨️ Keyboard navigation (arrow keys, ESC)
- 📱 Fully responsive design
- 🎯 Call-to-action buttons
- 🎭 Smooth animations and transitions

### Privacy Policy (privacy.html)
- ✅ Chrome Web Store compliant
- 🌐 Bilingual support
- 📑 Table of contents with anchor links
- 🔒 Comprehensive privacy information
- 📋 Clear permission explanations
- 🔗 Direct section navigation

## 🎯 Getting Started

### Local Testing
```bash
# Open in browser
open intro/index.html
open intro/privacy.html
```

### In Chrome Extension
```
chrome-extension://[EXTENSION_ID]/intro/index.html
chrome-extension://[EXTENSION_ID]/intro/privacy.html
```

### Set as Default New Tab
Update `manifest.json`:
```json
{
  "chrome_url_overrides": {
    "newtab": "intro/index.html"
  }
}
```

## 🔗 Navigation

### From Intro Page
- **"Get Started"** → Main app (`../newtab.html`)
- **"Learn More"** → Scroll to features
- **Privacy link** → Privacy policy (`./privacy.html`)
- **Language toggle** → Switch between Chinese/English

### From Privacy Page
- **Logo click** → Back to intro (`./index.html`)
- **Anchor links** → Jump to sections
- **Language toggle** → Switch between Chinese/English

## 🎨 Design System

### Colors
- **Background**: Dark blue gradient (`#0b0f14`)
- **Accent**: Light blue (`#7cc3ff`)
- **Secondary**: Purple (`#ad7cff`)
- **Text**: Light gray (`#e9eef6`)
- **Muted**: Medium gray (`#b6c2d0`)

### Icons
All icons are lightweight SVG icons:
- `tag` - Auto-categorize
- `search` - Smart search
- `eye` - Privacy curtain
- `star` - Quick links
- `layers` - Focus view
- `globe` - Multi-language

### Typography
- Font: Inter (system-ui fallback)
- Sizes: 12px - 48px
- Weights: 400, 500, 600, 700, 800

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: < 768px

All pages are fully responsive and tested on various screen sizes.

## 🌍 Multilingual Support

Both pages support:
- **中文 (Traditional Chinese)** - Default
- **English** - Toggle available

Language preference is stored in `localStorage` and synced across pages.

## 🔐 Privacy & Security

- ✅ No external tracking
- ✅ No analytics
- ✅ No data collection
- ✅ All data stored locally
- ✅ Chrome Web Store compliant

## 🧪 Testing Checklist

- [ ] Open `index.html` in browser
- [ ] Test language toggle
- [ ] Click screenshots to open lightbox
- [ ] Navigate images with arrow keys
- [ ] Close lightbox with ESC
- [ ] Click privacy link
- [ ] Test anchor navigation
- [ ] Verify responsive design
- [ ] Check all links work
- [ ] Verify console has no errors

## 📚 Documentation

For detailed information, see:
- **[README.md](./README.md)** - Full documentation
- **[STRUCTURE.md](./STRUCTURE.md)** - Folder structure
- **[SVG_ICONS.md](./SVG_ICONS.md)** - Icon details

## 🔄 Path References

All paths are relative to the intro folder:

```
intro/
├── index.html              # Current location
├── privacy.html            # Same folder
├── README.md               # Same folder
└── (references to parent)
    ├── ../icon.png         # App icon
    ├── ../i18n.js          # Translations
    ├── ../icons.js         # SVG icons
    ├── ../newtab.html      # Main app
    └── ../screenshots/     # Feature images
```

## 🚀 Deployment

### Chrome Web Store
1. Ensure `manifest.json` is configured correctly
2. Test all pages thoroughly
3. Submit extension to Chrome Web Store
4. Privacy policy will be displayed in store listing

### Local Installation
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the NeonFlux folder
5. Access intro at `chrome-extension://[ID]/intro/index.html`

## 💡 Tips

- Use keyboard shortcuts for faster navigation
- Language preference persists across sessions
- Screenshots are optimized for web viewing
- All animations are smooth and performant
- Mobile experience is fully optimized

## 🐛 Troubleshooting

### Pages not loading?
- Check file paths (should use `../` for parent directory)
- Verify all referenced files exist
- Check browser console for errors

### Images not showing?
- Verify screenshot paths are correct
- Check file permissions
- Ensure screenshots folder exists

### Links not working?
- Check relative paths
- Verify target files exist
- Test in different browsers

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review the code comments
3. Test in different browsers
4. Check browser console for errors

## 📄 License

Part of NeonFlux Chrome Extension. All rights reserved.

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Production Ready ✅
