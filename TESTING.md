# SleepyTube Testing Guide

## Quick Start Testing

### 1. Load Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Verify the SleepyTube icon appears in the toolbar

### 2. Basic Functionality Test

#### Test A: Watch Page Button Injection
1. Open https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. **Expected**: Sleep Mode button appears within 2 seconds in player controls
3. **Verify**: Button is visible next to settings gear icon
4. **Verify**: Button has equalizer icon (vertical bars)

#### Test B: Enable Sleep Mode
1. Click the Sleep Mode button
2. **Expected**: 
   - Button turns green/highlighted
   - Audio visualizer automatically opens after 1.2s
   - Waveform shows red (before) and green (after) comparison
   - Metrics show: Loudness, AGC Gain, Peaks Suppressed
3. **Verify**: Audio volume gradually increases (fade-in)
4. **Verify**: No sudden audio spikes

#### Test C: Disable Sleep Mode
1. Click the Sleep Mode button again
2. **Expected**:
   - Button returns to normal color
   - Audio visualizer automatically closes
   - Volume gradually decreases (fade-out)
3. **Verify**: Smooth transition, no audio pops

#### Test D: Settings Panel
1. Right-click the Sleep Mode button
2. **Expected**: Settings panel opens
3. **Test each control**:
   - Sleep Mode toggle works
   - Compression presets (Light/Medium/Strong) apply
   - EQ presets (Natural/Gentle/Ultra Soft) apply
   - Voice Focus checkbox works
   - Ducking slider adjusts (0-12 dB)
   - AGC checkbox works
   - "Show Audio Monitor" button opens visualizer

### 3. Advanced Tests

#### Test E: Navigation Handling
1. Start on YouTube homepage
2. Click a video thumbnail
3. **Expected**: Button appears within 2s
4. Click "Up next" video
5. **Expected**: Button persists or re-appears quickly
6. Use browser back/forward buttons
7. **Expected**: Button remains functional

#### Test F: Shorts Page
1. Navigate to https://www.youtube.com/shorts/
2. **Expected**: Button appears in Shorts controls (right side)
3. **Expected**: Button integrates with Shorts vertical layout
4. Swipe/click to next Short
5. **Expected**: Sleep Mode state persists

#### Test G: Playlist Autoplay
1. Open a playlist video
2. Enable Sleep Mode
3. Let video end and next video start
4. **Expected**: 
   - Button stays enabled
   - Audio processing continues on new video
   - Settings preserved

#### Test H: Rapid Navigation
1. Quickly click Home → Video → Home → Video
2. **Expected**: No duplicate buttons
3. **Expected**: No JavaScript errors in console
4. **Expected**: Audio processing stops/starts correctly

### 4. Audio Processing Tests

#### Test I: Compression Effectiveness
1. Find a video with varying loudness (e.g., movie trailer)
2. Enable Sleep Mode with "Strong" compression
3. **Expected**: Loud parts are quieter, quiet parts are louder
4. **Verify**: Visualizer shows green waveform is more consistent

#### Test J: Voice Focus
1. Find a podcast or interview video
2. Enable Voice Focus Mode
3. Set Ducking to -9 dB
4. **Expected**: Speech is clearer, background noise reduced
5. **Verify**: Mid-band frequency boost visible in metrics

#### Test K: Auto Gain Control
1. Play a quiet video
2. Enable AGC
3. **Expected**: Volume gradually increases to comfortable level
4. Switch to a loud video
5. **Expected**: Volume automatically reduces
6. **Verify**: AGC Gain metric shows adjustment (-12 to +12 dB)

### 5. Edge Cases

#### Test L: Fast Page Load
1. Open YouTube in a fresh tab
2. Immediately click a video
3. **Expected**: Button still appears quickly
4. **Expected**: No initialization errors

#### Test M: Slow Connection
1. Open Chrome DevTools → Network tab
2. Set throttling to "Slow 3G"
3. Load a video
4. **Expected**: Button appears even on slow connection
5. **Expected**: Audio processing still works

#### Test N: Multiple Tabs
1. Open 3 YouTube videos in different tabs
2. Enable Sleep Mode in Tab 1
3. Switch to Tab 2
4. **Expected**: Sleep Mode can be independently toggled
5. **Expected**: Each tab has its own state

#### Test O: YouTube Live Streams
1. Open a live stream video
2. Enable Sleep Mode
3. **Expected**: Audio processing works on live audio
4. **Verify**: No buffering issues introduced

### 6. Performance Tests

#### Test P: CPU Usage
1. Open Chrome Task Manager (Shift+Esc)
2. Play a video without Sleep Mode
3. Note CPU usage
4. Enable Sleep Mode
5. **Expected**: CPU increase < 5%

#### Test Q: Memory Usage
1. Check extension memory in Task Manager
2. **Expected**: < 5 MB memory usage
3. Enable visualizer
4. **Expected**: < 10 MB total

### 7. Regression Tests

#### Test R: No Console Errors
1. Open Chrome DevTools Console
2. Perform all basic tests (A-D)
3. **Expected**: No JavaScript errors
4. **Verify**: Only info/log messages from SleepyTube

#### Test S: Extension Icon Badge
1. Enable Sleep Mode
2. **Expected**: Extension icon shows badge or color change
3. Disable Sleep Mode
4. **Expected**: Badge clears

## Automated Testing (Future)

### Unit Tests (Planned)
```javascript
// Example test structure
describe('AudioEngine', () => {
  it('should initialize without errors', () => {
    const engine = new AudioEngine(mockVideo);
    expect(engine.init()).resolves.toBe(true);
  });
  
  it('should apply fade-in on connect', async () => {
    await engine.connect();
    expect(engine.nodes.makeupGain.gain.value).toBeCloseTo(0.3);
    // Wait 1 second
    expect(engine.nodes.makeupGain.gain.value).toBeCloseTo(1.0);
  });
});
```

### Integration Tests (Planned)
- Puppeteer tests for button injection
- Audio analysis validation
- Cross-browser compatibility

## Debugging Tips

### Common Issues

**Button doesn't appear:**
1. Check console for errors
2. Verify `.ytp-right-controls` exists on page
3. Check if YouTube changed their DOM structure
4. Try refreshing the page

**Audio processing not working:**
1. Check if video element has audio track
2. Verify Web Audio API is supported
3. Check browser console for initialization errors
4. Try disabling and re-enabling Sleep Mode

**Visualizer not showing:**
1. Check if `AudioVisualizer` class is loaded
2. Verify `window.AudioVisualizer` is defined
3. Check z-index conflicts with YouTube UI
4. Try manually opening via settings panel

### Debug Logging

Enable verbose logging:
```javascript
// In console
window.SleepyTubeUtils.DEBUG_MODE = true;
```

Check audio engine state:
```javascript
// In console
window.SleepyTubeController.audioEngine.getState();
```

## Test Coverage Goals

- [x] Core functionality: 100%
- [x] Edge cases: 80%
- [ ] Automated tests: 0% (future work)
- [x] Browser compatibility: 25% (Chrome only)

## Reporting Issues

When reporting bugs, include:
1. Chrome version
2. Extension version
3. YouTube page URL
4. Steps to reproduce
5. Console error messages
6. Screenshots/video if applicable

## Next Steps

After manual testing:
1. ✅ Fix any discovered bugs
2. ✅ Update documentation
3. ⏳ Add automated tests
4. ⏳ Test on other Chromium browsers
5. ⏳ Prepare for Chrome Web Store submission
