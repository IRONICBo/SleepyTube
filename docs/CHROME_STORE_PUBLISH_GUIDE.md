# Chrome Web Store Publishing Guide

## 📦 Complete Publishing Process for SleepyTube

**Objective**: Publish SleepyTube extension to Chrome Web Store for one-click installation.

**Version**: v1.3.2  
**Target Release**: 2026-03-01  
**Review Time**: 1-3 business days

---

## Table of Contents

1. [Pre-Publishing Checklist](#1-pre-publishing-checklist)
2. [Create Developer Account](#2-create-developer-account)
3. [Prepare Extension Assets](#3-prepare-extension-assets)
4. [Fill Store Listing](#4-fill-store-listing)
5. [Submit for Review](#5-submit-for-review)
6. [After Approval](#6-after-approval)
7. [Common Review Issues](#7-common-review-issues)
8. [Post-Launch Operations](#8-post-launch-operations)

---

## 1. Pre-Publishing Checklist

### 1.1 Required Materials

#### ✅ Technical Files

| File/Item | Requirements | Status | Notes |
|-----------|--------------|--------|-------|
| **manifest.json** | V3 format | ✅ Complete | All permissions clearly declared |
| **Icon Set** | 16x16, 32x32, 48x48, 128x128 | ✅ Complete | PNG format, transparent background |
| **Privacy Policy** | Public URL | ⚠️ Needed | Must be hosted publicly |
| **Terms of Service** | Optional | ⚠️ Needed | Recommended |
| **Source Code** | ZIP package | ✅ Ready | Exclude node_modules |

#### ✅ Marketing Materials

| Material | Size Requirements | Quantity | Status | Notes |
|----------|------------------|----------|--------|-------|
| **Small Icon** | 128x128px | 1 | ✅ Ready | icon-128.png |
| **Promo Tile** | 440x280px | 1 | 📸 Needed | Feature highlights |
| **Marquee Tile** | 1400x560px | 1 | 📸 Needed | Store header image |
| **Screenshots** | 1280x800px or 640x400px | 3-5 | 📸 Needed | Show main features |
| **Promo Video** | YouTube link | Optional | ❌ None | Can add later |

---

### 1.2 Extension Quality Checklist

**Code Quality**:
- [ ] No console errors in normal operation
- [ ] Handles network failures gracefully
- [ ] Proper error messages shown to users
- [ ] No hardcoded credentials
- [ ] Code follows Chrome Extension Best Practices

**Performance**:
- [ ] Extension loads in < 2 seconds
- [ ] CPU usage < 5% during normal use
- [ ] Memory footprint < 50MB
- [ ] No memory leaks detected
- [ ] Works smoothly with 20+ tabs open

**Security**:
- [ ] All external requests use HTTPS
- [ ] Content Security Policy properly configured
- [ ] No eval() or inline scripts
- [ ] Permissions justified and minimal
- [ ] API keys never exposed in client code

**Compatibility**:
- [ ] Tested on Chrome 90+
- [ ] Works on Windows, Mac, Linux
- [ ] Handles YouTube layout changes gracefully
- [ ] No conflicts with popular extensions

**User Experience**:
- [ ] Onboarding flow tested with real users
- [ ] All UI text properly translated
- [ ] Icons and imagery are clear
- [ ] Tooltips and help textprehensive
- [ ] Settings persist correctly

---

## 2. Create Developer Account

### 2.1 Registration Process

**Cost**: $5 USD one-time registration fee

**Steps**:

1. **Visit Chrome Web Store Developer Dashboard**
   - URL: https://chrome.google.com/webstore/devconsole
   - Sign in with Google account

2. **Pay Registration Fee**
   - One-time $5 USD fee
   - Payment via credit card or Google Pay
   - Non-refundable

3. **Verify Email**
   - Check inbox for verification email
   - Click verification link
   - Email must be verified to publish

4. **Complete Profile**
   - Developer name (displayed publicly)
   - Email address (for support inquiries)
   - Website URL (optional but recommended)

### 2.2 Account Settings

**Publisher Name**:
- Shown on store listing
- Should match brand name
- Example: "SleepyTube Team"

**Verified Publisher Badge**:
- Requires domain ownership verification
- Adds trust indicator
- Follow: https://developer.chrome.com/docs/webstore/verify

---

## 3. Prepare Extension Assets

### 3.1 Package Extension Files

**Create ZIP Archive**:

```bash
# Navigate to project root
cd /path/to/SleepyTube

# Create clean distribution
zip -r sleepytube-v1.3.2.zip extension/ -x "*.DS_Store" -x "*node_modules/*"

# Verify package contents
unzip -l sleepytube-v1.3.2.zip
```

**Included Files**:
- manifest.json
- All JS files (background/, content/, popup/)
- All CSS files
- Icons (16, 32, 48, 128)
- Onboarding pages
- README.md (optional)

**Excluded Files**:
- Source maps (.map files)
- Development tools
- Test files
- Documentation (except README)
- .git directory
- node_modules

### 3.2 Create Store Images

#### Small Tile (128x128px)

**Purpose**: Extension icon in store listings

**Requirements**:
- Format: PNG
- Size: Exactly 128x128 pixels
- Background: Transparent or solid color
- File size: < 100KB

**Design Tips**:
- Simple, recognizable icon
- Should match extension icon
- High contrast for visibility

#### Promo Tile (440x280px)

**Purpose**: Featured carousel on store homepage

**Requirements**:
- Format: PNG or JPEG
- Size: Exactly 440x280 pixels
- File size: < 300KB

**Design Elements**:
- Extension icon (top left)
- Tagline: "Sleep-Safe YouTube Audio"
- Key benefit: "Eliminate Sudden Volume Spikes"
- Background: Calm gradient (purple to blue)

#### Marquee (1400x560px)

**Purpose**: Large header on extension detail page

**Requirements**:
- Format: PNG or JPEG
- Size: Exactly 1400x560 pixels
- File size: < 2MB

**Design Elements**:
- Hero text: "Transform YouTube into Sleep-Safe Audio"
- 3-4 feature icons with labels
- Screenshot preview
- Call to action: "Add to Chrome - It's Free"

#### Screenshots (1280x800px)

**Quantity**: 3-5 screenshots recommended

**Screenshot 1: Sleep Mode in Action**
- YouTube video with Sleep Mode active
- Mini waveform visible
- Compression indicators shown
- Caption: "One-Click Sleep Mode Activation"

**Screenshot 2: Popup Settings**
- Extension popup interface
- Scene selection highlighted
- Volume sliders shown
- Caption: "Customize Your Audio Experience"

**Screenshot 3: AI Predictions**
- YouTube homepage with prediction badges
- Multiple videos labeled
- Hover tooltip shown
- Caption: "AI-Powered Video Quality Predictions"

**Screenshot 4: Onboarding Flow**
- Welcome screen or scene selection
- Clean, friendly interface
- Caption: "Easy 3-Step Setup"

**Screenshot 5: Advanced Settings** (Optional)
- Full settings page
- EQ curves, compression graphs
- Caption: "Advanced Controls for Power Users"

### 3.3 Write Store Listing Copy

#### Title (45 characters max)

**Options**:
1. "SleepyTube - YouTube Sleep Mode" (34 chars) ✅
2. "SleepyTube: Sleep-Safe YouTube Audio" (37 chars)
3. "Sleep Mode for YouTube Videos" (30 chars)

**Chosen**: "SleepyTube - YouTube Sleep Mode"

#### Summary (132 characters max)

**Final**:
"Stabilize YouTube audio for sleep. Eliminate volume spikes, filter harsh sounds, predict video quality with AI. Free & open source."
(131 characters) ✅

#### Detailed Description (16,000 characters max)

```
Transform YouTube into a Sleep-Safe Audio Experience

SleepyTube is a free Chrome extension that makes YouTube safe for sleep by intelligently processing audio in real-time. Never be jolted awake by sudden volume spikes, jarring sounds, or inconsistent audio levels again.

🌙 CORE FEATURES

1. Intelligent Volume Stabilization
   • Automatic dynamic range compression
   • Prevents sudden volume jumps between videos
   • Customizable threshold and ratio controls
   • Real-time waveform visualization

2. Gentle Audio Processing
   • Removes harsh high frequencies (>8kHz)
   • Reduces rumbling low frequencies (<100Hz)
   • Creates warm, soothing audio profile
   • Optimized for sleep and relaxation

3. AI Video Quality Prediction
   • Predicts audio issues before you watch
   • Labels videos: Noisy, Loud, or Sudden
   • Powered by Google Gemini or OpenAI
   • Saves time finding sleep-friendly content

4. Scene-Based Presets
   • ASMR: Optimized for whispers and soft sounds
   • Podcast: Balanced for speech clarity
   • White Noise: Consistent ambient processing
   • Meditation: Gentle, relaxing profile

✨ KEY BENEFITS

• Never be woken by audio spikes again
• Consistent volume across all videos
• Smooth, comfortable listening levels
• One-click activation per video
• No account required, works instantly
• Open source & privacy-focused
• Completely free to use

🎯 PERFECT FOR

• ASMR enthusiasts
• Podcast listeners
• Meditation practitioners
• White noise users
• Anyone who falls asleep to YouTube
• Light sleepers sensitive to sound
• People in shared living spaces

🛠 HOW IT WORKS

1. Install extension
2. Navigate to any YouTube video
3. Click "Sleep Mode" button
4. Audio processing starts automatically
5. Adjust settings via popup icon

⚙️ TECHNICAL FEATURES

• Real-time audio processing using Web Audio API
• Dynamic range compression (adjustable ratio)
• High/low-pass filtering (customizable cutoffs)
• Speech rate adjustment (0.5x to 2.0x)
• Mini waveform visualization
• Compression heatmap display
• Multi-language support (English/中文)

🔒 PRIVACY & SECURITY

• Zero data collection
• All processing happens locally
• API keys stored only in your browser
• No analytics or tracking
• Open source code (GitHub)
• MIT licensed

🆕 LATEST UPDATES (v1.3.2)

• Redesigned onboarding flow
• Enhanced AI prediction accuracy
• Improved scene mode presets
• Better i18n support
• Bug fixes and performance improvements

📚 NEED HELP?

• User Guide: Full documentation included
• GitHub: Report issues or contribute
• Active community support

🌟 COMPARE TO ALTERNATIVES

Unlike browser volume controls or system-wide audio processors, SleepyTube:
✅ Works per-video, not globally
✅ Processes audio in real-time
✅ Provides visual feedback
✅ Predicts video quality with AI
✅ Completely free and open source

🎁 COMPLETELY FREE

No subscriptions, no hidden fees, no premium tiers. SleepyTube is 100% free forever.

💝 SUPPORT THE PROJECT

If you find SleepyTube useful, please:
• Leave a 5-star review
• Share with friends and family
• Star the project on GitHub
• Report bugs to help improve quality
• Contribute code or translations

🔗 LINKS

• GitHub: https://github.com/IRONICBo/SleepyTube
• User Guide: See documentation in extension
• Privacy Policy: https://sleepytube.com/privacy (coming soon)

---

Made with ❤️ for better sleep.

Tags: sleep, youtube, audio, volume, asmr, podcast, white noise, meditation, compression, equalizer, ai, predictions
```

---

## 4. Fill Store Listing

### 4.1 Basic Information

**Extension Name**: SleepyTube - YouTube Sleep Mode  
**Short Description**: Stabilize YouTube audio for sleep  
**Category**: Productivity  
**Language**: English (primary), Chinese (secondary)

### 4.2 Privacy Practices

**Single Purpose Description**:
"SleepyTube processes YouTube audio in real-time to stabilize volume levels and prevent sudden spikes, making videos safe for sleep."

**Permission Justifications**:

| Permission | Justification |
|------------|---------------|
| `storage` | Store user settings and scene preferences locally |
| `*://*.youtube.com/*` | Inject sleep mode controls and process audio on YouTube pages |
| `*://generativelanguage.googleapis.com/*` | Optional AI video predictions via Google Gemini API |
| `*://api.openai.com/*` | Optional AI video predictions via OpenAI API |

**Data Usage**:
- ✅ No user data collected
- ✅ API keys stored locally only
- ✅ No analytics or tracking
- ✅ No third-party data sharing

### 4.3 Distribution Settings

**Visibility**: Public  
**Regions**: All countries  
**Mature Content**: No  
**Language Support**: English, Chinese (Simplified)

---

## 5. Submit for Review

### 5.1 Pre-Submission Checklist

**Final Checks**:
- [ ] Extension tested on clean Chrome profile
- [ ] All screenshots show correct version number
- [ ] Privacy policy URL is live and accessible
- [ ] Contact email is monitored
- [ ] Description has no typos or broken links
- [ ] All images meet size requirements
- [ ] ZIP file < 100MB
- [ ] manifest.json version matches release version

### 5.2 Submission Process

**Steps**:

1. **Upload ZIP File**
   - Drag and drop or browse to file
   - Wait for upload completion
   - System validates manifest automatically

2. **Add Store Listing**
   - Fill all required fields
   - Upload images (icon, tiles, screenshots)
   - Save draft frequently

3. **Preview Listing**
   - Click "Preview" button
   - Review how it appears to users
   - Check on different screen sizes

4. **Submit for Review**
   - Click "Submit for Review"
   - Cannot edit while in review
   - Check email for updates

### 5.3 Review Timeline

**Typical Timeline**:
- Submitted → In Review: 1-12 hours
- In Review → Decision: 1-3 business days
- Approval → Published: Immediate

**Status Tracking**:
- Dashboard shows current status
- Email notifications for status changes
- Can see reviewer notes if rejected

---

## 6. After Approval

### 6.1 Post-Publish Checklist

**Immediate Actions**:
- [ ] Test installation from store
- [ ] Verify all features work as expected
- [ ] Check analytics dashboard (if enabled)
- [ ] Monitor user reviews
- [ ] Respond to initial feedback

**Marketing**:
- [ ] Announce on social media
- [ ] Update GitHub README with store link
- [ ] Post on relevant subreddits (r/chrome, r/asmr)
- [ ] Add store badge to website
- [ ] Email beta testers

### 6.2 Monitoring & Maintenance

**Daily Checks**:
- Review new user ratings and reviews
- Respond to support questions
- Monitor crash reports (if any)

**Weekly Tasks**:
- Analyze usage statistics
- Identify feature requests
- Plan improvements

**Monthly Goals**:
- Target: 1000+ users by month 2
- Target: 4.5+ star rating
- Target: <1% uninstall rate

---

## 7. Common Review Issues

### 7.1 Rejection Reasons & Fixes

**Issue: Misleading Description**
- **Reason**: Claims AI is "100% accurate" or "never wrong"
- **Fix**: Use "AI-powered predictions with ~80% accuracy"

**Issue: Excessive Permissions**
- **Reason**: Requests more permissions than needed
- **Fix**: Remove unused host_permissions, justify all permissions

**Issue: Broken Functionality**
- **Reason**: Extension doesn't work on reviewer's test account
- **Fix**: Test on clean profile, remove dependencies on specific accounts

**Issue: Trademark Violation**
- **Reason**: Uses "YouTube" in name without permission
- **Fix**: Contact Google for trademark clearance (usually OK for functional descriptors)

**Issue: Privacy Policy Missing**
- **Reason**: Collects data but no privacy policy provided
- **Fix**: Add privacy policy URL, or better: don't collect data

### 7.2 Appealing Rejections

**If Rejected**:

1. **Read Rejection Email Carefully**
   - Note specific policy violations
   - Check attached screenshots

2. **Fix All Issues**
   - Address every point mentioned
   - Don't skip minor issues

3. **Re-Submit with Changes**
   - Increment version number
   - Add "Changelog" notes explaining fixes
   - Reference rejection email ticket number

4. **Appeal If Necessary**
   - Use "Appeal" button in dashboard
   - Provide clear, professional explanation
   - Include evidence (screenshots, code snippets)

---

## 8. Post-Launch Operations

### 8.1 Update Process

**For Bug Fixes** (v1.3.2 → v1.3.3):
1. Fix bugs in codebase
2. Update version in manifest.json
3. Create new ZIP package
4. Upload to dashboard
5. Review typically faster (1 day)

**For New Features** (v1.3.x → v1.4.0):
1. Develop and test new features
2. Update screenshots if UI changed
3. Add changelog to description
4. Full review process (1-3 days)

### 8.2 User Engagement

**Responding to Reviews**:
- Reply to negative reviews with solutions
- Thank users for positive feedback
- Ask for more details if bug reported
- Update review reply if issue fixed

**Building Community**:
- Create GitHub Discussions board
- Set up Discord server (optional)
- Regular blog posts about updates
- Feature user suggestions

**Metrics to Track**:
- Weekly active users (WAU)
- Install/uninstall rate
- Average rating over time
- Most requested features
- Common support questions

### 8.3 Monetization (Future)

**Current**: 100% free, no monetization

**Possible Future Options**:
- ❌ **No ads**: Ruins sleep experience
- ❌ **No subscriptions**: Against open source philosophy
- ✅ **Donations**: Voluntary support via GitHub Sponsors
- ✅ **Affiliate links**: Partner with sleep products (must disclose)
- ✅ **Premium AI tier**: Higher prediction quota for power users

---

## 📋 Checklists

### Pre-Launch Checklist

```
Technical
[ ] All features tested and working
[ ] No console errors
[ ] Performance optimized
[ ] Security review passed
[ ] Permissions minimized

Assets
[ ] 128x128 icon ready
[ ] 440x280 promo tile ready
[ ] 1400x560 marquee ready
[ ] 3-5 screenshots captured
[ ] All images < size limits

Legal
[ ] Privacy policy published
[ ] Terms of service (if needed)
[ ] Trademark clearance (if applicable)
[ ] Open source license clear

Marketing
[ ] Store description written
[ ] SEO keywords included
[ ] GitHub README updated
[ ] Social media posts drafted
[ ] Support email set up
```

### Post-Launch Checklist

```
Week 1
[ ] Monitor reviews daily
[ ] Respond to all feedback
[ ] Fix critical bugs ASAP
[ ] Announce launch
[ ] Thank beta testers

Month 1
[ ] Analyze usage data
[ ] Plan next features
[ ] Gather feature requests
[ ] Improve documentation
[ ] Build community

Month 3
[ ] Major feature update
[ ] Refresh store screenshots
[ ] Optimize conversion rate
[ ] Expand to other browsers (Firefox, Edge)
[ ] Reach 5000+ users
```

---

## 🔗 Resources

**Official Documentation**:
- Chrome Web Store Developer Guide: https://developer.chrome.com/docs/webstore
- Extension Best Practices: https://developer.chrome.com/docs/extensions/mv3/
- Publishing Guidelines: https://developer.chrome.com/docs/webstore/program-policies

**Tools**:
- Chrome Extension Manifest Validator: https://webstore.google.com/
- Image Size Checker: https://www.imagesize.org
- ZIP File Validator: Built into Chrome Web Store dashboard

**Community**:
- Stack Overflow: https://stackoverflow.com/questions/tagged/google-chrome-extension
- Reddit: r/chrome, r/chromeextensions
- Google Groups: chromium-extensions

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-08  
**Next Review**: Before v1.4.0 release  
**Maintained By**: SleepyTube Team
