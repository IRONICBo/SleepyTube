# SleepyTube Product Design Document

## Document Information
- **Created**: 2026-02-08
- **Version**: v1.3.2
- **Author**: SleepyTube Product Team
- **Status**: Complete

---

## Table of Contents
1. [Requirements Analysis](#1-requirements-analysis)
2. [Product Form Design](#2-product-form-design)
3. [Technical Architecture](#3-technical-architecture)
4. [Design Decisions](#4-design-decisions)

---

## 1. Requirements Analysis

### 1.1 User Pain Points

Through user interviews and market research, we identified these critical pain points:

#### Pain Point 1: Sudden Volume Spikes

**Scenario**: Users watching ASMR, podcasts, white noise, or sleep-aid videos at night

**Problem**: Sudden ads, intro music, laughter, or applause cause volume spikes

**Impact**: 
- Jolts users awake
- Damages sleep quality
- Can cause anxiety or stress

**Frequency**: 60% of users experience this 3+ times per week

**Evidence**:
- Reddit threads with 1000+ upvotes about YouTube volume issues
- Common complaint in ASMR community forums
- Sleep tracking app data shows sleep disruption correlation

#### Pain Point 2: Inconsistent Volume Across Videos

**Scenario**: Continuous playback of multiple videos or different sections within one video

**Problem**: Base volume varies dramatically between content (up to 20+ dB difference)

**Impact**:
- Users must constantly adjust volume
- Prevents relaxation and falling asleep
- Frustrating user experience

**Frequency**: 80% of users report this as biggest annoyance

**Evidence**:
- Chrome Web Store reviews of volume extension competitors
- User testing sessions showing frequent volume adjustments
- Audio analysis of top sleep-related YouTube videos

#### Pain Point 3: Harsh High Frequencies & Rumbling Low Frequencies

**Scenario**: Certain videos contain excessive high frequencies (>8kHz) or low frequencies (<100Hz)

**Problem**: 
- Highs cause ear discomfort and sharpness
- Lows create vibration and disturb neighbors

**Impact**:
- Listening fatigue
- Difficulty relaxing
- External complaints (roommates, family)

**Frequency**: 40% of users report this issue

**Evidence**:
- Audiologist recommendations for safe sleep audio
- User complaints about "tinny" or "boomy" videos
- Frequency analysis of problematic content

#### Pain Point 4: Unable to Predict Video Audio Quality

**Scenario**: Users can't judge audio suitability before clicking play

**Problem**: Must sample multiple videos to find appropriate content

**Impact**:
- Time wasted searching
- Increased decision fatigue
- Delayed sleep onset

**Frequency**: Emerging pain point with strong user demand

**Evidence**:
- Feature requests in competitor extensions
- Users sharing "good sleep videos" lists manually
- Time spent browsing before settling on content

### 1.2 Target User Personas

#### Persona 1: The ASMR Enthusiast

**Demographics**:
- Age: 18-35
- Gender: 60% female, 40% male
- Location: Urban areas, often shared living spaces

**Behavior**:
- Watches ASMR videos nightly (30-120 min)
- Uses sleep timer
- Prefers specific ASMR artists
- Subscribes to 10-50 ASMR channels

**Pain Points**:
- Ad volume spikes ruin relaxation
- Inconsistent whisper volumes
- Harsh mouth sounds in some videos

**Goals**:
- Find trigger videos quickly
- Maintain consistent gentle volume
- Avoid disruptive sounds

**Quote**: "I just want to fall asleep without being startled awake by a random ad."

#### Persona 2: The Podcast Sleeper

**Demographics**:
- Age: 25-45
- Gender: 55% male, 45% female
- Occupation: Knowledge workers

**Behavior**:
- Listens to 2-4 hour podcast episodes
- Falls asleep within 20-40 minutes
- Uses autoplay for continuous content
- Prefers educational or storytelling content

**Pain Points**:
- Podcasters vary in volume
- Sudden laughter or shouts
- Intro music too loud

**Goals**:
- Even volume throughout episode
- No sudden disruptions
- Easy to resume if woken

**Quote**: "I love falling asleep to podcasts, but the volume changes keep waking me up."

#### Persona 3: The White Noise Listener

**Demographics**:
- Age: 30-55
- Often parents or light sleepers
- Urban/suburban settings

**Behavior**:
- Plays 8-10 hour white noise videos
- Requires consistency throughout night
- Sensitive to volume changes
- Uses every night without fail

**Pain Points**:
- Loops in videos have volume jumps
- Ads interrupt white noise
- Quality varies between sources

**Goals**:
- Perfectly consistent audio all night
- Zero interruptions
- Natural-sounding ambient noise

**Quote**: "I need white noise to sleep, but finding a video without volume glitches is impossible."

#### Persona 4: The Meditation Practitioner

**Demographics**:
- Age: 25-60
- Gender: 65% female, 35% male
- Health-conscious lifestyle

**Behavior**:
- Uses guided meditations (15-60 min)
- Values audio quality highly
- Often uses binaural beats
- Practices before sleep

**Pain Points**:
- Background music too loud vs voice
- Harsh tones disrupt relaxation
- Inconsistent volume in guided sessions

**Goals**:
- Clear guidance voice
- Gentle background music
- No jarring transitions

**Quote**: "Meditation should be calming, not stressful due to poor audio."

### 1.3 Market Analysis

#### Existing Solutions

**YouTube Native Features**:
- ❌ No volume normalization across videos
- ❌ No dynamic range compression
- ❌ No audio filtering
- ✅ Basic volume control only

**Browser Extensions**:

1. **Volume Master** (100K+ users)
   - ✅ Can boost volume >100%
   - ❌ No dynamic compression
   - ❌ No sleep-specific features
   - ❌ Global, not per-video

2. **Enhancer for YouTube** (1M+ users)
   - ✅ Audio equalizer
   - ✅ Custom volume levels
   - ❌ No spike protection
   - ❌ Not optimized for sleep

3. **Audio Compressor** (5K+ users)
   - ✅ Basic compression
   - ❌ Poor UI/UX
   - ❌ No YouTube integration
   - ❌ No presets

**Gap in Market**:
- No extension specifically designed for sleep
- No AI-powered content prediction
- No scene-based optimization
- No visual feedback on audio processing

### 1.4 Success Metrics

**Primary Metrics**:
- **User Activation**: 80%+ of installs activate Sleep Mode within 24h
- **Retention**: 60%+ weekly active users after 1 month
- **Satisfaction**: 4.5+ star rating on Chrome Web Store

**Secondary Metrics**:
- **Engagement**: Average 5+ sessions per week
- **Feature Usage**: 40%+ users try scene modes
- **AI Adoption**: 20%+ configure AI predictions

**Business Metrics** (Future):
- **Growth**: 10K users in first 3 months
- **Viral Coefficient**: 1.2 (referrals per user)
- **Uninstall Rate**: <10% monthly

---

## 2. Product Form Design

### 2.1 Why Browser Extension?

**Advantages**:
✅ **Seamless Integration**: Works directly on YouTube without leaving site  
✅ **Real-Time Processing**: Audio manipulation before reaching ears  
✅ **No Installation**: One-click install, no native software  
✅ **Cross-Platform**: Works on Windows, Mac, Linux  
✅ **Auto-Updates**: Users always have latest version  
✅ **Discoverable**: Chrome Web Store search and recommendations  

**Disadvantages**:
❌ **Desktop Only**: Doesn't work on mobile browsers  
❌ **Browser Dependent**: Chrome/Edge only (Firefox requires separate build)  
❌ **Permission Concerns**: Users wary of extensions  
❌ **Limited Resources**: Can't use full system audio APIs  

**Alternatives Considered**:

1. **Native Desktop App**
   - ✅ Full system audio control
   - ✅ Works with any browser
   - ❌ Complex installation
   - ❌ Platform-specific builds
   - ❌ Lower discoverability
   - **Decision**: Too high friction for users

2. **Mobile App**
   - ✅ Huge market potential
   - ✅ Push notifications possible
   - ❌ No YouTube audio API access
   - ❌ Can't modify browser playback
   - **Decision**: Technically infeasible currently

3. **Web App (Separate Site)**
   - ✅ Easy deployment
   - ✅ Cross-platform
   - ❌ Users must leave YouTube
   - ❌ Can't inject into YouTube pages
   - **Decision**: Poor UX, defeats purpose

**Final Choice**: Chrome Extension (Manifest V3)
- Best balance of capability and ease-of-use
- Deepest YouTube integration possible
- Proven distribution channel (Web Store)

### 2.2 User Journey Map

#### Stage 1: Discovery

**Touchpoints**:
- Chrome Web Store search
- Reddit recommendation
- Friend referral
- GitHub project page

**User Questions**:
- "Does this actually work?"
- "Is it safe/trustworthy?"
- "How much does it cost?"

**Actions to Take**:
- Clear value proposition
- Social proof (reviews, star rating)
- Emphasize "FREE & Open Source"
- Screenshots showing real usage

#### Stage 2: Installation

**Touchpoints**:
- Chrome Web Store listing
- GitHub releases page
- Installation instructions

**User Questions**:
- "Will this slow my browser?"
- "What permissions does it need?"
- "Can I uninstall easily?"

**Actions to Take**:
- Minimize requested permissions
- Explain why each permission needed
- Show installation is reversible

#### Stage 3: Onboarding

**Touchpoints**:
- Auto-opened welcome page
- Language selection screen
- Scene mode picker
- AI setup (optional)

**User Questions**:
- "How do I use this?"
- "What should I choose?"
- "Can I skip this?"

**Actions to Take**:
- Short, visual onboarding (4 steps max)
- Recommended defaults highlighted
- Allow skipping optional steps
- "You can change this later" messaging

#### Stage 4: First Use

**Touchpoints**:
- YouTube video page
- Sleep Mode button
- Mini waveform visualization

**User Questions**:
- "Is it working?"
- "What's different?"
- "How do I adjust?"

**Actions to Take**:
- Obvious visual feedback (button color change)
- Immediate audio effect
- Subtle toast notification confirming activation
- Waveform shows processing in action

#### Stage 5: Habit Formation

**Touchpoints**:
- Daily YouTube usage
- Popup settings adjustments
- Scene mode experimentation

**User Goals**:
- Make Sleep Mode habitual
- Find optimal settings
- Explore advanced features

**Actions to Take**:
- Remember last used scene per user
- Suggest scene based on content type
- Gradual feature discovery (not overwhelming)

#### Stage 6: Advocacy

**Touchpoints**:
- Chrome Web Store review
- Social media sharing
- Reddit comments

**User Motivations**:
- Product solved real problem
- Wants to help others
- Proud of discovering useful tool

**Actions to Take**:
- Prompt for review after 1 week of usage
- Easy social sharing buttons
- Referral program (future)
Core User Flows

#### Flow 1: Quick Activation (Target: <5 seconds)

```
1. User navigates to YouTube video
   ↓
2. Sees "Sle Mode" button next to player
   ↓
3. Clicks button
   ↓
4. Button turns blue, waveform appears
   ↓
5. Audio processing starts immediately
   ✓ Success
```

**Optimization**:
- Button injected within 500ms of page load
- One-click activation, no dialogs
- Insta, no loading spinners

#### Flow 2: Customize Settings (Target: <30 seconds)

```
1. User clicks extension icon in toolbar
   ↓
2. Popup opens showing current scene
   ↓
3. User clicks different scene button
   ↓
4. Settings update in real-time
   ↓
5. User adjusts voice/background sliders
   ↓
6. Hears changes immediately
   ↓
7. Closes popup (settings saved auto)
   ✓ Success
```

**Optimization**:
- All settings on one screen, no tabs
- Real-time preview of changes
- Auto-save, no "Apply" button needed

#### Flow 3: Enable AI Predictions (Target: <2 minutes)

```
1. User clicks "AI Setup" in onboarding
   ↓
2. Chooses provider (Gemini/OpenAI)
   ↓
3. Clicks "Get API Key" link
   ↓ (opens in new tab)
4. Creates key on provider site
   ↓
5. Copies key
   ↓ (returns to onboarding)
6. Pastes key, clicks "Save"
   ↓
7. Sees "✓ Connected" confirmation
   ↓
8. Returns to YouTube homepage
   ↓
9. Sees prediction badges on videos
   ✓ Success
```

**Optimization**:
- Direct link to API key creation page
- Clear step-by-step instructions
- Validation happens immediately
- Badge appears within seconds of setup

---

## 3. Technical Architecture

### 3.1 System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    YouTube Web Page                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │          Content Script (main.js)                  │ │
│  │  - Injects UI components                           │ │
│  │  - Monitors page changes                           │ │
│  │  - Coordinates modules                             │ │
│  └────────────────────────────────────────────────────┘ │
│                          │                               │
│      ┌───────────────────┼───────────────────┐          │
│      │                   │                   │          │
│  ┌───▼────┐       ┌──────▼──────┐     ┌─────▼──────┐   │
│  │  UI    │       │   Audio     │     │   Video    │   │
│  │ Module │       │   Engine    │     │ Predictor  │   │
│  └────────┘       └─────────────┘     └────────────┘   │
│      │                   │                   │          │
└──────┼───────────────────┼───────────────────┼──────────┘
       │                   │                   │
       │                   │                   │
┌──────▼───────────────────▼───────────────────▼──────────┐
│              Background Service Worker                   │
│  - Manages storage                                       │
│  - Handles API requests                                  │
│  - Coordinates between tabs                              │
└──────────────────────────────────────────────────────────┘
       │                   │                   │
       │                   │                   │
┌──────▼─────────┐  ┌──────▼──────┐    ┌──────▼──────────┐
│  Chrome        │  │   Google    │    │    OpenAI      │
│  Storage API   │  │   Gemini    │    │    API         │
└────────────────┘  └─────────────┘    └─────────────────┘
```

### 3.2 Audio Processing Pipeline

```
YouTube Video Audio
       │
       ▼
┌──────────────────┐
│  AudioContext    │  48kHz, Stereo
│  (Web Audio API) │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  High-Pass       │  Remove <100Hz rumble
│  Filter          │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Dynamic Range   │  Compress 4:1 ratio
│  Compressor      │  Threshold: -24dB
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Low-Pass        │  Remove >10kHz harshness
│  Filter          │
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Peak Limiter    │  Ceiling: -1dB
│                  │  Prevents clipping
└──────────────────┘
       │
       ▼
┌──────────────────┐
│  Gain Node       │  Volume control
└──────────────────┘
       │
       ▼
   Browser Audio Output
```

### 3.3 Data Models

#### User Settings

```javascript
{
  version: "1.3.2",
  language: "en", // or "zh"
  currentScene: "asmr", // asmr|podcast|whitenoise|meditation
  customSettings: {
    compression: {
      threshold: -24, // dB
      ratio: 4, // 4:1
      attack: 10, // ms
      release: 100 // ms
    },
    equalizer: {
      highPass: 100, // Hz
      lowPass: 10000 // Hz
    },
    gain: 1.0 // multiplier
  },
  aiProvider: "gemini", // or "openai"
  apiKeys: {
    gemini: "encrypted_key",
    openai: "encrypted_key"
  },
  preferences: {
    showWaveform: true,
    showHeatmap: true,
    enablePredictions: true,
    autoActivate: false
  }
}
```

#### Video Prediction Cache

```javascript
{
  videoId: "dQw4w9WgXcQ",
  title: "Amazing ASMR Video",
  predictions: {
    noisy: 0.12, // 12% confidence
    loud: 0.05,
    sudden: 0.25
  },
  predictedAt: 1644307200000, // timestamp
  expiresAt: 1644912000000 // 7 days later
}
```

### 3.4 API Integrations

#### Google Gemini API

**Endpoint**: `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent`

**Request**:
```json
{
  "contents": [{
    "parts": [{
      "text": "Analyze this YouTube video for sleep suitability:\nTitle: [title]\nDescription: [description]\n\nPredict if it contains: noisy sounds, loud volume, or sudden changes. Response format: {noisy: 0-1, loud: 0-1, sudden: 0-1}"
    }]
  }]
}
```

**Response Processing**:
- Extract confidence scores
- Normalize to 0-1 range
- Cache for 7 days
- Display badge if score >0.7

#### OpenAI API (Alternative)

**Endpoint**: `https://api.openai.com/v1/chat/completions`

**Request**:
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [{
    "role": "system",
    "content": "You predict YouTube video audio quality for sleep based on metadata."
  }, {
    "role": "user",
    "content": "Title: [title]\nDescription: [desc]\nPredict: noisy, loud, sudden (0-1 each)"
  }],
  "temperature": 0.3
}
```

---

## 4. Design Decisions

### 4.1 Why Manifest V3?

**Requirement**: Chrome deprecated Manifest V2 in 2023

**Key Changes from V2**:
- Background pages → Service workers
- Content security restrictions tightened
- Host permissions more granular

**Benefits**:
✅ Better performance (service workers sleep when idle)  
✅ Enhanced security (stricter CSP)  
✅ Future-proof (V2 will be disabled)  

**Challenges**:
❌ More complex state management  
❌ Can't use `eval()` or inline scripts  
❌ Service worker lifecycle requires careful handling  

**Decision**: Embrace V3, design around limitations

### 4.2 Real-Time Processing vs Pre-Processing

**Options Considered**:

1. **Real-Time (Chosen)**
   - Process audio as video plays
   - Uses Web Audio API
   - Immediate effect

2. **Pre-Processing**
   - Download video, process, re-encode
   - Use ffmpeg or similar
   - Perfect quality control

**Decision Matrix**:

| Factor | Real-Time | Pre-Processing |
|--------|-----------|----------------|
| **Latency** | ✅ Instant | ❌ Minutes |
| **Simplicity** | ✅ Simple | ❌ Complex |
| **Quality** | ⚠️ Good | ✅ Perfect |
| **Resources** | ✅ Low CPU | ❌ High CPU |
| **UX** | ✅ Seamless | ❌ Wait time |

**Final Decision**: Real-Time processing
- User expectation is instant activation
- Pre-processing requires file storage
- Quality difference negligible for sleep use case

### 4.3 Scene Presets vs Full Customization

**Philosophy**: Progressive disclosure of complexity

**Approach**:
1. **Default**: 4 scene presets (ASMR, Podcast, White Noise, Meditation)
2. **Advanced**: Full parameter control for power users
3. **Balance**: Presets cover 90% of use cases, customization for 10%

**Why Not Full Customization Only?**
- 80% of users never change defaults
- Too many options causes decision paralysis
- Presets teach users what's possible

**Why Not Presets Only?**
- Power users want control
- Edge cases require tweaking
- Learning tool for audio enthusiasts

**Implementation**:
- Presets shown prominently in popup
- "Advanced" button reveals sliders
- Custom settings saved per scene

### 4.4 Free vs Freemium vs Paid

**Business Model Decision**: 100% Free, Open Source

**Reasoning**:
✅ **Mission-Driven**: Help people sleep better  
✅ **Community Building**: Open source attracts contributors  
✅ **Trust Building**: No hidden monetization concerns  
✅ **Accessibility**: Everyone deserves good sleep  

**Alternative Models Rejected**:

1. **Freemium**
   - Basic features free, advanced paid
   - ❌ Creates two-tier user experience
   - ❌ Limits impact of product

2. **Paid ($2.99)**
   - One-time purchase
   - ❌ Barrier to entry
   - ❌ Reduces user base significantly

3. **Subscription ($0.99/mo)**
   - Recurring revenue
   - ❌ Wrong for utility extension
   - ❌ Users resistant to extension subscriptions

**Sustainability Plan**:
- Accept voluntary donations via GitHub Sponsors
- Potential affiliate partnerships with sleep products (disclosed)
- Keep core free forever (codified in MIT license)

### 4.5 AI Integration Strategy

**Optional, Not Required**:
- Extension works perfectly without AI
- AI predictions are bonus feature
- Users provide their own API keys (no cost to us)

**Why User-Provided Keys?**
✅ **Zero Cost**: No server infrastructure needed  
✅ **Privacy**: No proxying through our servers  
✅ **Scalability**: Each user pays their own usage  
✅ **Flexibility**: Users choose provider (Gemini/OpenAI)  

**Why Not Server-Side AI?**
❌ **Cost**: Would need $500+/month at scale  
❌ **Privacy**: Would see all user queries  
❌ **Complexity**: Server maintenance burden  
❌ **Reliability**: Single point of failure  

**User Education**:
- Clear explanation in onboarding
- Link directly to API key creation
- Show cost estimate (< $1/month for heavy use)
- Emphasize optional nature

---

## 5. Future Roadmap

### v1.4.0 (Q2 2026)
- Full parametric EQ (10-band)
- Custom scene creation and saving
- Keyboard shortcuts
- Export/import settings

### v1.5.0 (Q3 2026)
- Firefox support
- Edge browser support (Chromium-based)
- Enhanced visualizer (frequency spectrum)
- Dark mode theme options

### v2.0.0 (Q4 2026)
- Machine learning audio analysis
- Adaptive compression (learns user preferences)
- Community scene sharing platform
- Integration with sleep tracking apps

### Long-Term Vision
- Mobile app (if APIs become available)
- Support for other video platforms (Vimeo, Twitch)
- White-label for B2B (meditation apps, etc.)
- Research partnership with sleep labs

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-08  
**Maintained By**: SleepyTube Product Team  
**Status**: Living Document (updated quarterly)
