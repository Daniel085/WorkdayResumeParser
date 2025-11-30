# Workday Resume Parser

> **Stop wasting 30 minutes per Workday application.** Auto-fill job applications using your resume with local AI.

[![Privacy](https://img.shields.io/badge/Privacy-100%25%20Local-green)](extension/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)
[![Chrome](https://img.shields.io/badge/Chrome-127%2B-orange)](https://www.google.com/chrome/canary/)

---

## 🎯 The Problem

Workday's Applicant Tracking System (ATS) is **legitimately awful** for job seekers:

- 📉 **92% abandonment rate** - Most people quit mid-application
- ⏱️ **30 minutes per application** - What should take 5 minutes
- 🔁 **Repetitive data entry** - Despite uploading your resume
- 💔 **99% wrong parsing** - Their resume parser is terrible
- 🔐 **Multiple accounts** - Need separate login for every company
- 📱 **Poor mobile UX** - Doesn't work well on phones

**Result:** Companies using Workday see **70% fewer applications** than competitors.

**Read the full research:** [Why Workday Sucks](WHY_WORKDAY_SUCKS.md) (with citations)

---

## 💡 The Solution

A Chrome extension that:

- ✅ **Parses your resume locally** using Chrome's built-in AI (Gemini Nano)
- ✅ **Auto-fills Workday forms** intelligently
- ✅ **100% private** - No data sent to servers
- ✅ **Open source** - Verify our code yourself

### Why This Works

1. **Privacy-First:** All AI processing happens in your browser using Chrome's built-in Gemini Nano
2. **Smart Mapping:** Detects field types and matches resume data correctly
3. **Time Savings:** Turn 30-minute applications into 5-minute applications
4. **Trust:** Open source + minimal permissions + local-only processing

---

## 🚀 Quick Start

### Prerequisites

- **Chrome Canary/Dev/Beta 127+** ([Download](https://www.google.com/chrome/canary/))
- **22GB free disk space** (for AI model download)
- **4GB+ GPU RAM** (recommended)

### Install & Test Locally

```bash
# 1. Clone the repository
git clone https://github.com/Daniel085/WorkdayResumeParser.git
cd WorkdayResumeParser

# 2. Load the extension
# - Open chrome://extensions
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the "extension" folder

# 3. Enable Chrome AI (for best results)
# - Go to chrome://flags/#prompt-api-for-gemini-nano
# - Set to "Enabled"
# - Go to chrome://flags/#optimization-guide-on-device-model
# - Set to "Enabled BypassPerfRequirement"
# - Restart Chrome

# 4. Test it!
# - Find a Workday job application
# - Click the extension icon
# - Upload your resume
# - Click "Auto-Fill"
```

**Detailed instructions:** See [extension/README.md](extension/README.md)

---

## 📸 How It Works

```mermaid
graph LR
    A[Upload Resume] --> B[Chrome AI Parses]
    B --> C[Extract Data]
    C --> D[Detect Form Fields]
    D --> E[Smart Mapping]
    E --> F[Auto-Fill]
    F --> G[Review & Submit]

    style A fill:#4CAF50
    style B fill:#2196F3
    style F fill:#FF9800
    style G fill:#9C27B0
```

### Architecture

- **popup.js** - UI and resume upload
- **Chrome AI (Gemini Nano)** - Local LLM for parsing
- **content.js** - Field detection and auto-fill
- **background.js** - Service worker for lifecycle

---

## 🔒 Privacy & Security

### What We DON'T Do

- ❌ No data sent to external servers
- ❌ No analytics or tracking
- ❌ No account creation required
- ❌ No resume storage in the cloud

### What We DO

- ✅ Process everything locally with Chrome AI
- ✅ Use minimal permissions (activeTab + storage)
- ✅ Open source code (audit anytime)
- ✅ Encrypt local storage (if enabled)

**Privacy Policy:** [Link to policy](extension/PRIVACY.md)

---

## 📊 Current Status

**Version:** 0.1.0 (MVP)

### ✅ Working

- Email, phone, name extraction
- Basic field detection (text inputs)
- Chrome AI integration
- Fallback parsing (regex)

### 🚧 In Progress

- PDF text extraction (currently placeholder)
- Work history auto-fill (multi-entry sections)
- Education auto-fill
- Dropdown field support

### 📋 Roadmap

- [ ] Full PDF parsing with pdf.js
- [ ] Work experience sections (dynamic forms)
- [ ] Education history
- [ ] Skills matching
- [ ] Custom field mappings
- [ ] Save multiple resume profiles
- [ ] Chrome Web Store publishing
- [ ] Firefox support

---

## 🛠️ Tech Stack

- **Chrome Extension Manifest V3**
- **Chrome AI API** (Gemini Nano)
- **Vanilla JavaScript** (no frameworks for minimal size)
- **Content Scripts** for DOM manipulation
- **Service Workers** for background tasks

**No external dependencies.** Everything runs client-side.

---

## 🤝 Contributing

We need help! Priority areas:

1. **PDF Parsing** - Integrate pdf.js for proper text extraction
2. **Field Detection** - Improve heuristics for Workday variations
3. **UI/UX** - Make the popup more intuitive
4. **Testing** - Test against different companies' Workday instances
5. **Documentation** - Improve setup guides

### How to Contribute

```bash
# Fork and clone
git fork https://github.com/Daniel085/WorkdayResumeParser.git
git clone your-fork-url
cd WorkdayResumeParser

# Create a feature branch
git checkout -b feature/your-feature

# Make changes and test locally
# See extension/README.md for testing instructions

# Commit and push
git commit -m "feat: your feature description"
git push origin feature/your-feature

# Open a PR!
```

---

## 📚 Resources

### Research
- [Why Workday Sucks (Full Report)](WHY_WORKDAY_SUCKS.md)

### Documentation
- [Extension README](extension/README.md)
- [Chrome AI Documentation](https://developer.chrome.com/docs/ai/built-in)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

### Related Projects
- [Simplify Jobs](https://simplify.jobs/) - Similar problem, different approach
- [Job Wizard AI](https://www.jobwizard.ai/) - Workday automation

---

## 💰 Future Monetization (Optional)

If this project gains traction, potential models:

- **Freemium:** Basic auto-fill free, advanced features paid
- **One-time:** $10-20 purchase
- **Subscription:** $5/month during active job search
- **Enterprise:** Sell to universities/bootcamps for students

**All revenue would support development and hosting costs.**

---

## 📄 License

MIT License - See [LICENSE](LICENSE) for details

---

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/Daniel085/WorkdayResumeParser/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Daniel085/WorkdayResumeParser/discussions)
- **Email:** (your email)

---

## ⭐ Star This Repo

If this project helps you land a job, please:

1. ⭐ **Star the repository**
2. 🐦 **Share on social media**
3. 💬 **Tell other job seekers**
4. 🤝 **Contribute improvements**

---

**Built with ❤️ for frustrated job seekers everywhere.**

*Because life's too short to manually re-enter data Workday already has.*
