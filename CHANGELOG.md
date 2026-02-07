# SleepyTube Changelog

## Version 1.3.0 - Enhanced Popup Interface (2026-02-08)

### 🎉 Major UX Improvement

**Comprehensive Settings in Popup**
- Complete redesign of extension popup
- All detailed settings moved from in-page panel to popup
- More intuitive and accessible interface
- Settings accessible from any page via toolbar icon

### ✨ New Popup Features
- **Main toggle card** - Prominent Sleep Mode on/off switch
- **Status indicator** - Color-coded badge (Active/Ready/Inactive)
- **Expandable sections** - Advanced settings collapse/expand
- **Preset buttons** - Visual selection for compression and EQ
- **Live sliders** - Real-time value display for all parameters
- **Direct visualizer launch** - "Show Audio Monitor" button in popup

### ⚙️ Available Settings
1. Sleep Mode toggle
2. Stability Level (Light/Medium/Strong compression)
3. Sound Softening (Natural/Gentle/Ultra Soft EQ)
4. Voice Focus Mode with background ducking slider
5. Auto Gain Control with target loudness slider
6. Output Volume adjustment (-12 to +12 dB)

### 🎨 Design Improvements
- Modern dark theme with gradients
- Smooth animations and transitions
- Icon-based visual language
- Responsive layout (380px width)
- Color-coded status and indicators
- Professional UI/UX standards

### 🔧 Technical Enhancements
- Chrome storage sync for all settings
- Real-time message passing popup ↔ content
- Auto-save on all changes
- Cross-tab synchronization
- Persistent configuration

### 📝 Documentation
- Added POPUP_GUIDE.md with complete usage instructions
- Visual diagrams and comparison tables
- Common scenarios and recommendations
- Troubleshooting section

### 🚀 User Benefits
- **Faster access** - Click icon instead of navigating to video
- **Better organization** - Logical grouping of features
- **Clearer feedback** - Visual states and live updates
- **Persistent UI** - Doesn't disappear when navigating
- **More intuitive** - Standard extension popup pattern

---

## Version 1.2.1 - Visualizer CSS Fix (2026-02-08)

### 🐛 Bug Fixes

**Missing Visualizer Styles**
- Added complete CSS for audio visualizer (264 lines)
- Fixed invisible visualizer issue
- Visualizer now properly displays when opened

**Improved Render Loop**
- Fixed animation frame request order
- Added empty state display during initialization
- Enhanced error handling with try-catch
- Better buffer size validation

### 🎨 Visual Improvements
- Modern glassmorphism design
- Smooth fade-in/scale animation (0.3s)
- Responsive layout with mobile support (< 900px)
- Color-coded metric bars (loudness: blue/green/red)
- Hover effects on metric cards

### 📝 Documentation
- Added VISUALIZER_TEST.md with comprehensive test cases
- Debugging instructions and DOM checks
- Performance benchmarks and success criteria

---

## Version 1.2.0 - Early UI Injection (2026-02-08)

### 🚀 Performance Improvements

**Faster Button Injection**
- Button now appears **immediately** when YouTube player controls load
- No longer waits for video element to be ready
- Reduced button injection delay from ~3-5 seconds to ~0.5-2 seconds

### 🔧 Technical Changes

**New Loading Strategy:**
1. **Step 1**: Inject UI button as soon as player controls appear (`.ytp-right-controls`)
2. **Step 2**: Initialize audio engine when video element is ready
3. **Step 3**: Connect audio engine to already-injected UI

**Code Changes:**
- `main.js`: Separated UI injection from audio initialization
- `ui-components.js`: Added null-safety checks for audio engine
- `ui-components.js`: Reduced button injection timeout to 2 seconds
- `main.js`: Reduced video detection timeout to 1.5 seconds
- `main.js`: Added navigation debouncing to prevent duplicate initialization

### 🎯 User Experience

**Before:**
```
YouTube page loads → Wait for video → Initialize audio → Inject button (3-5s delay)
```

**After:**
```
YouTube page loads → Inject button immediately (0.5-2s) → Initialize audio in background
```

### 📝 Notes

- Button may appear before audio engine is ready (shows "Audio engine not ready" if clicked too early)
- Settings panel will save configuration even if audio engine isn't connected yet
- Changes will apply when audio engine finishes initializing

---

## Version 1.1.0 - Audio Visualization (2026-02-08)

### ✨ New Features

**Real-time Audio Visualizer**
- Side-by-side waveform comparison (red = before, green = after)
- Live metrics dashboard (loudness, AGC gain, peak suppression, compression)
- Auto-show when enabling Sleep Mode
- Access via settings panel or right-click button

**Audio Fade In/Out**
- Smooth 1-second fade-in when enabling (30% → 100%)
- Smooth 0.5-second fade-out when disabling (100% → 30%)
- Prevents sudden volume jumps

**Enhanced UI**
- Custom tooltip with status and hints
- Improved button visual feedback
- Better Shorts page integration

### 🐛 Bug Fixes

**Code Repairs:**
- Fixed `audio-engine.js`: Missing `class` keywords, variable typos
- Fixed `visualizer.js`: Duplicate methods, syntax errors
- Fixed `ui-components.js`: Event listener syntax
- Fixed `utils.js`: Incomplete `getVideoId()` function

---

## Version 1.0.0 - Initial Release (2026-02-06)

### ✨ Core Features

**Audio Processing:**
- Multi-band dynamic range compression
- Automatic Gain Control (AGC)
- Voice Focus Mode with multiband ducking
- Parametric EQ (high-shelf & low-shelf)
- Brickwall limiter protection

**User Interface:**
- Sleep Mode toggle button in YouTube player
- Comprehensive settings panel
- Preset configurations (Light/Medium/Strong compression)
- EQ presets (Natural/Gentle/Ultra Soft)

**Platform Support:**
- YouTube watch pages
- YouTube Shorts
- Playlist autoplay detection
- SPA navigation handling
