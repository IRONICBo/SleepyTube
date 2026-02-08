# SleepyTube Audio Visualizer Guide

## Overview

The Audio Visualizer provides real-time visualization of SleepyTube's audio processing effects, allowing you to see exactly how the audio is being transformed for better sleep.

## Features

### 1. Real-Time Waveform Comparison
- **Before Processing** (Top, Red): Shows the original YouTube audio waveform
- **After Processing** (Bottom, Green): Shows the processed, sleep-safe audio
- **Side-by-Side Comparison**: Instantly see the smoothing effect

### 2. Live Metrics Dashboard

#### Current Loudness
- Displays the current audio loudness in dB
- Color-coded bar:
  - 🔵 Blue: Quiet (-60 to -20 dB)
  - 🟢 Green: Good (-20 to -10 dB)
  - 🔴 Red: Too loud (>-10 dB)
- Updates 60 times per second

#### AGC Gain
- Shows the current Auto Gain Control adjustment
- Range: -18 dB to +18 dB
- Positive values = boosting quiet audio
- Negative values = reducing loud audio

#### Peaks Suppressed
- Counts how many sudden volume spikes have been blocked
- Demonstrates the limiter's protection in action
- Resets when you refresh the page

#### Peak Reduction
- Shows how much volume reduction is being applied in real-time
- Higher values = more aggressive protection
- Measured in dB

#### Compression Activity
- Visual indicator of dynamic range compression
- Shows the compression ratio (e.g., 4:1)
- Animated bar shows compression intensity

## How to Use

### Opening the Visualizer

**Method 1: From Control Panel**
1. Click the Sleep Mode button in YouTube player
2. Right-click the button to open control panel
3. Click "Show Audio Monitor" button at the bottom

**Method 2: Keyboard Shortcut** (Coming Soon)
- Press `Alt+V` to toggle visualizer

### Reading the Visualization

#### Waveform Display
- **Vertical axis**: Audio amplitude (loudness)
- **Horizontal axis**: Time (scrolling left to right)
- **Center line**: Zero amplitude (silence)
- **Spikes above/below**: Louder moments

**Before Processing (Red)**:
- You'll see chaotic, uneven waveforms
- Large spikes represent sudden loud moments
- Wide variations show inconsistent volume

**After Processing (Green)**:
- Smoother, more consistent waveform
- Spikes are "flattened" by the limiter
- Tighter range shows stable volume

#### Understanding the Metrics

**What to look for**:
- ✅ **Good**: After waveform is visibly smoother than before
- ✅ **Good**: Peaks Suppressed counter increases during loud moments
- ✅ **Good**: Peak Reduction shows 3-10 dB during spikes
- ✅ **Good**: Compression bar shows activity (20-60%)

**What to avoid**:
- ❌ **Bad**: No visual difference between before/after
- ❌ **Bad**: Peaks Suppressed stays at 0 for a long time
- ❌ **Bad**: AGC Gain stuck at one extreme (-18 or +18)

### Real-World Examples

#### Example 1: ASMR Video with Whispers and Sudden Sounds
```
Before: Large spikes during sudden sounds (tapping, mouth sounds)
After: Spikes flattened, whispers slightly boosted
Metrics: Peaks Suppressed: 15+, Peak Reduction: 5-8 dB
```

#### Example 2: Podcast with Background Music
```
Before: Music drowns out speech, uneven levels
After: Speech clearer, music reduced, consistent volume
Metrics: AGC Gain: +3 to +6 dB, Voice Focus active
```

#### Example 3: Ambient Sound (Rain, Ocean)
```
Before: Random volume variations
After: Smooth, consistent flow
Metrics: Compression Ratio: 4:1, minimal peaks
```

## Technical Details

### Update Frequency
- Canvas: 60 FPS (frames per second)
- Metrics: 60 Hz
- Zero latency: What you see is what you hear

### Measurements
- **Loudness**: RMS (Root Mean Square) in dBFS
- **Peak Detection**: Threshold at -10 dBFS
- **History**: Last 100 frames (~1.67 seconds)

### Performance
- CPU usage: <3% on modern devices
- Memory: <20 MB additional
- No impact on audio quality or latency

## Troubleshooting

### Visualizer not showing
1. Make sure Sleep Mode is enabled
2. Refresh the YouTube page
3. Check browser console for errors

### Waveforms look identical
1. Try a video with more dynamic range (music, podcasts)
2. Increase compression strength in settings
3. Enable Voice Focus mode

### Metrics not updating
1. Check if video is actually playing
2. Disable and re-enable Sleep Mode
3. Close and reopen visualizer

### Performance issues
1. Close visualizer when not needed
2. Reduce YouTube video quality
3. Close other tabs

## Privacy & Data

- **No Recording**: Audio is never saved or transmitted
- **No Tracking**: Visualizer data stays in your browser
- **No Network**: All processing happens locally

## Tips for Best Results

1. **Use on Dynamic Content**: Visualizer is most impressive on content with varying volume (podcasts, ASMR, music)

2. **Compare Settings**: Open visualizer, then try different:
   - Compression strengths (Light vs Strong)
   - EQ presets (Natural vs Ultra Soft)
   - Voice Focus on/off

3. **Educational Use**: Great for understanding:
   - How audio compression works
   - What AGC actually does
   - Why limiters are important for sleep

4. **Take Screenshots**: Capture before/after for documentation or sharing feedback

## Keyboard Shortcuts (Planned)

- `Alt+V`: Toggle visualizer
- `Alt+R`: Reset peak counter
- `Esc`: Close visualizer

## Feedback

Found a bug or have suggestions for the visualizer?
- Report issues: [GitHub Issues](https://github.com/sleepytube/sleepytube/issues)
- Feature requests: [GitHub Discussions](https://github.com/sleepytube/sleepytube/discussions)

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-08
