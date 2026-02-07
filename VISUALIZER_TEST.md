# Visualizer Quick Test Guide

## 🐛 Issue Found
**Problem**: Visualizer CSS was missing, causing the visualizer to be invisible even when opened.

## ✅ Fix Applied (Commit 18f7368)

### Changes Made:
1. **Added Complete Visualizer CSS** (264 lines)
   - Modern glassmorphism design
   - Smooth animations and transitions
   - Responsive layout (grid + flexbox)
   - Mobile support (< 900px breakpoint)

2. **Improved Render Loop**
   - Always requests next frame (prevents stutter)
   - Shows empty state during initialization
   - Better error handling with try-catch
   - Buffer size validation

3. **Enhanced Debugging**
   - Logs audio engine status on show()
   - Empty state displays loading animation
   - Clear error messages

---

## 🧪 How to Test

### Test 1: Visual Appearance
1. Load the extension
2. Open any YouTube video
3. Enable Sleep Mode (button turns green)
4. Wait 1.2 seconds for auto-show
5. **Expected**:
   - Visualizer appears in center of screen
   - Dark background with gradient
   - Header shows "SleepyTube Audio Monitor"
   - Canvas area visible (800x300px)
   - Metrics cards below canvas

### Test 2: Waveform Animation
1. With visualizer open, play the video
2. **Expected**:
   - Top half: Red waveform (before processing)
   - Bottom half: Green waveform (after processing)
   - Waveforms update in real-time at 60 FPS
   - Grid lines visible in background
   - dB labels on right side (0dB, -20dB, -40dB, -60dB)

### Test 3: Metrics Update
Watch the metric cards update in real-time:

**Current Loudness:**
- Shows dB value (e.g., "-18.5 dB")
- Progress bar fills left to right
- Color changes:
  - Blue: < -20 dB (quiet)
  - Green: -20 to -10 dB (good)
  - Red: > -10 dB (too loud)

**AGC Gain:**
- Shows gain adjustment (e.g., "+3.2 dB")
- Progress bar centered at 50% (0 dB)
- Left side: negative gain (reducing)
- Right side: positive gain (boosting)

**Peaks Suppressed:**
- Counter increments when spikes detected
- Shows total count since enabled

**Peak Reduction:**
- Shows dB amount of reduction
- Updates when compression active

**Compression Activity:**
- Bar fills based on compression ratio
- Label shows current ratio (e.g., "4.0:1")

### Test 4: Empty State
1. Open visualizer BEFORE audio engine is ready
2. **Expected**:
   - Black canvas with loading message
   - "Waiting for audio engine..."
   - Animated dots (...) cycling

### Test 5: Responsive Design
1. Resize browser window to < 900px wide
2. **Expected**:
   - Visualizer shrinks to 95vw
   - Metrics stack vertically (1 column)
   - Font sizes adjust smaller
   - Still fully functional

### Test 6: Animations
**Open:**
- Visualizer fades in (opacity 0 → 1)
- Scales up (0.95 → 1.0)
- Duration: 0.3 seconds
- Easing: cubic-bezier(0.4, 0, 0.2, 1)

**Close:**
- Click X button in top right
- Reverses open animation
- Fades out and scales down

**Hover Effects:**
- Metric cards brighten on hover
- Close button changes background
- Smooth transitions (0.2s)

---

## 🔍 Debugging

### Check Console Logs
```javascript
// Should see when visualizer opens:
"Visualizer starting with audio engine: {
  isInitialized: true,
  isConnected: true,
  hasNodes: true,
  hasSourceAnalyser: true,
  hasOutputAnalyser: true
}"
```

### Check DOM
```javascript
// In console:
document.querySelector('.sleepytube-visualizer')
// Should return the visualizer element

document.querySelector('#sleepytube-canvas')
// Should return the canvas element
```

### Check Styles
```javascript
// In console:
const viz = document.querySelector('.sleepytube-visualizer');
getComputedStyle(viz).opacity;
// Should be "1" when visible, "0" when hidden
```

---

## 📊 Performance Metrics

Expected performance with visualizer enabled:

| Metric | Target | Acceptable |
|--------|--------|------------|
| FPS | 60 | > 55 |
| CPU Increase | < 5% | < 10% |
| Memory | < 10 MB | < 15 MB |
| Frame Time | ~16ms | < 20ms |

---

## 🎨 Visual Design

### Color Palette
- **Background**: Gradient #1a1a1a → #0a0a0a
- **Before Waveform**: #ff4444 (red)
- **After Waveform**: #4caf50 (green)
- **Accent**: #3ea6ff (blue)
- **Text**: #fff (primary), #999 (secondary), #666 (tertiary)

### Typography
- **Font Family**: "Roboto", "Arial", sans-serif
- **Heading**: 16px, 600 weight
- **Metric Value**: 24px, 700 weight (20px on mobile)
- **Labels**: 11px, 500 weight, uppercase
- **Info**: 11-12px, regular

### Spacing
- **Panel Padding**: 20px
- **Card Padding**: 14px 16px
- **Gap Between Elements**: 12-20px
- **Border Radius**: 4-12px

---

## ✅ Success Criteria

Visualizer is working correctly if:
- [x] Appears centered on screen when opened
- [x] Shows two waveforms (red top, green bottom)
- [x] Waveforms animate smoothly at 60 FPS
- [x] Metrics update in real-time
- [x] Close button works
- [x] Responsive on small screens
- [x] No console errors
- [x] Smooth animations on open/close

---

## 🚨 Known Issues (Fixed)

| Issue | Status | Fix |
|-------|--------|-----|
| Visualizer invisible | ✅ Fixed | Added complete CSS
| Render loop stuttering | ✅ Fixed | Request frame first
| No empty state | ✅ Fixed | Added loading message
| Buffer size errors | ✅ Fixed | Validate before read
| No error handling | ✅ Fixed | Try-catch wrapper

---

## 📝 Next Steps

If visualizer still doesn't work:
1. Check browser console for errors
2. Verify audio engine is initialized
3. Check if canvas element exists
4. Verify CSS is loaded (check computed styles)
5. Test with different videos
6. Try refreshing the page

---

**Updated**: 2026-02-08 19:05  
**Version**: 1.2.0  
**Status**: ✅ Ready for Testing
