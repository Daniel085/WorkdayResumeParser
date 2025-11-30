# Workday Resume Auto-Fill Extension

🚀 **Stop wasting 30 minutes per application!** Auto-fill Workday job applications using your resume.

## 🔒 Privacy-First Design

- ✅ **100% Local Processing** - Your resume NEVER leaves your browser
- ✅ **Chrome Built-in AI** - Uses Gemini Nano (no external servers)
- ✅ **Open Source** - Verify our code yourself
- ✅ **Minimal Permissions** - Only accesses Workday when you activate it

---

## ⚡ Quick Start - Test Locally

### 1. **Enable Chrome AI** (Required for AI parsing)

Chrome AI is currently in preview. To use it:

1. **Install Chrome Canary, Dev, or Beta**
   - [Chrome Canary](https://www.google.com/chrome/canary/)
   - [Chrome Dev](https://www.google.com/chrome/dev/)
   - [Chrome Beta](https://www.google.com/chrome/beta/)

2. **Enable AI flags:**
   - Navigate to `chrome://flags/#prompt-api-for-gemini-nano`
   - Set to **"Enabled"**
   - Navigate to `chrome://flags/#optimization-guide-on-device-model`
   - Set to **"Enabled BypassPerfRequirement"**
   - **Restart Chrome**

3. **Verify AI is available:**
   - Open DevTools Console (F12)
   - Type: `(await window.ai?.languageModel.capabilities())?.available`
   - Should return `"readily"` or `"after-download"`
   - If `"after-download"`, Chrome will download Gemini Nano (~1.5GB) in the background

**Note:** If Chrome AI isn't available, the extension will use fallback parsing (email/phone extraction only).

### 2. **Load the Extension**

1. **Open Chrome Extensions Page:**
   - Go to `chrome://extensions`
   - OR click ⋮ (menu) → Extensions → Manage Extensions

2. **Enable Developer Mode:**
   - Toggle "Developer mode" in the top-right corner

3. **Load Unpacked Extension:**
   - Click "Load unpacked"
   - Select the `/home/user/WorkdayResumeParser/extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension:**
   - Click the puzzle piece icon in the toolbar
   - Find "Workday Resume Auto-Fill"
   - Click the pin icon to keep it visible

### 3. **Test It Out**

1. **Navigate to a Workday job application:**
   - Find any company using Workday (e.g., search "workday application" + company name)
   - URL should be `https://*.myworkdayjobs.com/*`
   - The extension icon should show a green checkmark badge

2. **Click the extension icon:**
   - Upload your resume (PDF, DOC, DOCX, or TXT)
   - Wait for AI parsing (or use fallback)

3. **Click "Auto-Fill Workday Form":**
   - The extension will detect form fields and fill them
   - Review the filled data before submitting

---

## 🎯 How It Works

### Architecture

```
┌─────────────┐
│   popup.js  │  ← User uploads resume
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│ Chrome AI (Gemini│  ← Parses resume locally
│      Nano)      │     Extracts: name, email, phone,
└──────┬──────────┘     experience, education, skills
       │
       ▼
┌─────────────┐
│ content.js  │  ← Detects Workday form fields
└──────┬──────┘     Maps data to correct fields
       │            Fills and triggers events
       ▼
┌─────────────┐
│   Workday   │  ← Auto-filled application!
│    Form     │
└─────────────┘
```

### Key Features

1. **AI-Powered Parsing:**
   - Uses Chrome's built-in Gemini Nano
   - Extracts structured data from resume
   - Falls back to regex if AI unavailable

2. **Smart Field Detection:**
   - Analyzes labels, IDs, names, placeholders
   - Matches to resume data intelligently
   - Skips already-filled fields

3. **Safe Auto-Fill:**
   - Triggers proper DOM events
   - Works with Workday's JavaScript
   - Doesn't submit automatically (manual review)

---

## 🛠️ Development

### File Structure

```
extension/
├── manifest.json          # Extension configuration
├── popup.html            # Extension popup UI
├── scripts/
│   ├── popup.js          # Popup logic & AI parsing
│   ├── content.js        # Form detection & auto-fill
│   └── background.js     # Service worker
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

### Tech Stack

- **Manifest V3** (latest Chrome extension format)
- **Chrome AI API** (Gemini Nano for local LLM)
- **Vanilla JavaScript** (no dependencies for privacy)
- **Content Scripts** for DOM manipulation
- **Service Worker** for background tasks

### Debugging

1. **View Extension Logs:**
   - `chrome://extensions` → Click "Details" → Click "Inspect views: service worker"

2. **Debug Popup:**
   - Right-click extension icon → "Inspect popup"

3. **Debug Content Script:**
   - Open DevTools on Workday page (F12)
   - Check Console for content script logs

4. **Reload After Changes:**
   - Go to `chrome://extensions`
   - Click reload icon on the extension card

---

## 🚧 Current Limitations (MVP v0.1.0)

- ✅ **Works:** Email, phone, name, address fields
- ⚠️ **Partial:** Work history, education (AI-dependent)
- ❌ **Not Yet:** File uploads, custom questions, dropdowns
- ❌ **Not Yet:** PDF parsing (shows placeholder text)

### Roadmap

- [ ] Proper PDF text extraction (pdf.js integration)
- [ ] Support for work history sections (dynamic fields)
- [ ] Education history auto-fill
- [ ] Skills/certifications matching
- [ ] Dropdown field handling (locations, job types, etc.)
- [ ] Save multiple resume profiles
- [ ] Export/import settings
- [ ] Analytics (anonymized, opt-in)

---

## 📊 System Requirements

### Minimum

- Chrome 127+ (Canary/Dev/Beta) for AI features
- 4GB RAM (for basic operation)
- Chrome Stable 100+ (for non-AI fallback mode)

### Recommended for Chrome AI

- **Chrome:** Canary/Dev/Beta 127+
- **Disk Space:** ≥22 GB free (for Gemini Nano download)
- **GPU:** ≥4GB VRAM
- **OS:** Windows 10/11, macOS 13+, or Linux

**Not Supported:** Android, iOS, ChromeOS (standard)

---

## 🤝 Contributing

This is an open-source MVP! Contributions welcome:

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a PR

### Priority Areas

- PDF parsing implementation
- Better field detection heuristics
- Support for more Workday field types
- UI/UX improvements

---

## 📄 License

MIT License - See repository for details

---

## 🆘 Troubleshooting

### "Chrome AI Not Available"

- **Solution:** Install Chrome Canary/Dev/Beta and enable flags (see Step 1)
- **Workaround:** Extension will use basic regex parsing (email/phone only)

### "No form fields found"

- **Solution:** Make sure you're on the actual application page, not the job description
- **Check:** URL should include `/apply` or have visible form fields

### Fields not filling correctly

- **Solution:** Workday has many variations. Check browser console for logs
- **Report:** File an issue with the company name and field types that failed

### Extension not loading

- **Solution:** Check for errors in `chrome://extensions`
- **Check:** Make sure manifest.json is valid
- **Try:** Reload the extension

---

## 📚 Resources

- [Chrome Built-in AI Documentation](https://developer.chrome.com/docs/ai/built-in)
- [Chrome Extensions Get Started](https://developer.chrome.com/docs/extensions/get-started)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Why Workday Sucks](../WHY_WORKDAY_SUCKS.md) - Research on the problem we're solving

---

## ⭐ Feedback

Found a bug? Have a feature request?

- Open an issue on GitHub
- Email: (your contact)
- Twitter: (your handle)

---

**Built with ❤️ to save job seekers' time and sanity.**
