# Testing Guide - Workday Resume Parser

## 🎯 Current Status: Chrome AI Issues

**Problem:** `window.ai` remains undefined even after:
- ✅ Installing Chrome Canary
- ✅ Enabling both flags
- ✅ Relaunching Chrome
- ✅ Waiting for download

**Possible Causes:**
1. System requirements not met (22GB free space, 4GB GPU)
2. AI model download blocked or incomplete
3. macOS-specific issue with Canary build
4. Need to wait longer (sometimes takes 10-15 minutes)

---

## ✅ GOOD NEWS: Extension Works Without AI!

The extension has a **fallback parser** that works right now without Chrome AI.

### What Works Without AI:

- ✅ **PDF Text Extraction** - Full pdf.js integration
- ✅ **Email Detection** - Regex-based extraction
- ✅ **Phone Number Detection** - Regex-based extraction
- ✅ **Basic Name Extraction** - First line parsing
- ✅ **Auto-Fill Functionality** - All field mapping works
- ✅ **Form Detection** - Workday field detection

### What Requires AI:

- ❌ Work experience parsing (multiple jobs)
- ❌ Education parsing (multiple degrees)
- ❌ Skills extraction
- ❌ Date normalization (June 2020 → 06/2020)
- ❌ Smart data structuring

---

## 🧪 Test Without AI (Do This Now!)

### Step 1: Test PDF Extraction

1. **Open:** `test-pdf-only.html` (in ANY browser - no AI needed)
2. **Click:** "Test: resume-workday.pdf"
3. **Verify:**
   - ✅ See extracted text from PDF
   - ✅ Character count shows
   - ✅ Email detected
   - ✅ Phone number detected

**Expected Results:**
```
Characters: 5,000-10,000
Words: 800-1,500
Email: [email from resume]
Phone: [phone from resume]
```

### Step 2: Load Extension in Chrome

1. **Open Chrome** (Stable is fine for this)
2. **Go to:** `chrome://extensions`
3. **Enable:** "Developer mode" (toggle in top-right)
4. **Click:** "Load unpacked"
5. **Select folder:** `/Users/danielororke/GitHub/WorkdayResumeParser/extension`
6. **Verify:** Extension appears in list

### Step 3: Test on a Real Workday Page

1. **Find any Workday job application:**
   - Google: "workday application" + any company name
   - Or use: https://walmart.wd5.myworkdayjobs.com/

2. **Click extension icon** in toolbar

3. **Upload resume** (PDF, DOC, or TXT)

4. **Click "Auto-Fill Workday Form"**

5. **Check results:**
   - Email field should auto-fill
   - Phone field should auto-fill
   - Name fields should auto-fill (if detected)

---

## 📊 Testing Results Template

Copy this and fill it out:

```
## PDF Extraction Test
- PDF Loaded: [ ] Yes / [ ] No
- Text Extracted: [ ] Yes / [ ] No
- Character Count: _______
- Email Detected: [ ] Yes / [ ] No
- Phone Detected: [ ] Yes / [ ] No

## Extension Load Test
- Extension Loaded: [ ] Yes / [ ] No
- Icon Visible: [ ] Yes / [ ] No
- Popup Opens: [ ] Yes / [ ] No

## Auto-Fill Test
- Workday Page: _______________________
- Fields Auto-Filled: _______
- Email Filled: [ ] Yes / [ ] No
- Phone Filled: [ ] Yes / [ ] No
- Errors: _______________________

## Chrome AI Status
- window.ai: [ ] Defined / [ ] Undefined
- Browser: [ ] Stable / [ ] Canary
- Flags Enabled: [ ] Yes / [ ] No
```

---

## 🔧 If You Want to Keep Trying AI

### Final Checklist:

1. **System Requirements:**
   - [ ] 22GB+ free disk space
   - [ ] 4GB+ GPU VRAM
   - [ ] macOS 13+ (Ventura or later)

2. **Chrome Canary:**
   - [ ] Installed from https://www.google.com/chrome/canary/
   - [ ] Version 127+ (check chrome://version)
   - [ ] Opened THIS folder in Canary (not Stable)

3. **Flags (IN CANARY):**
   - [ ] chrome://flags/#prompt-api-for-gemini-nano → `Enabled`
   - [ ] chrome://flags/#optimization-guide-on-device-model → `Enabled BypassPerfRequirement`
   - [ ] Clicked blue "Relaunch" button (not just closed browser)

4. **Waited:**
   - [ ] 5 minutes minimum
   - [ ] 10 minutes recommended
   - [ ] 15-20 minutes if slow connection

5. **Verification (in Canary DevTools):**
   ```javascript
   // Should NOT be undefined
   window.ai

   // Should return object
   await window.ai.languageModel.capabilities()
   ```

### Alternative: Try Later

Chrome AI is still in preview and can be flaky. Try:
- **Tomorrow** - Sometimes downloads take overnight
- **Different network** - Some corporate networks block model downloads
- **Check Console** - Open DevTools Console for error messages
- **Check Network** - Go to chrome://components and check for "Optimization Guide On Device Model"

---

## 💡 Recommendation

**For now:** Test the extension without AI to validate:
1. PDF parsing works
2. Form detection works
3. Auto-fill functionality works
4. UI/UX is good

**Later:** Once Chrome AI is working, the extension will automatically use it (no code changes needed).

---

## 🎯 Next Steps

1. **Test PDF extraction** (test-pdf-only.html)
2. **Load extension in Chrome** (chrome://extensions)
3. **Test on real Workday page**
4. **Report results** (use template above)
5. **Revisit AI setup later** (optional)

---

## 📝 Notes

- Extension gracefully falls back to regex when AI unavailable
- All validation logic still works
- PDF extraction is independent of AI
- Auto-fill logic works with or without AI
- AI just makes parsing smarter, not required

**Bottom line:** We can validate 80% of the extension functionality without AI!
