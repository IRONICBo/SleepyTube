# SleepyTube Audio Visualizer Guide

## Overview

The Audio Visualizer provides real-time visualization of SleepyTube's audio processing, allowing you to see exactly how audio is being transformed for better sleep.

**Features**:
- Real-time waveform comparison (before/after)
- Live audio metrics dashboard
- Compression activity indicators
- Peak suppression counter

---

## Visualization Components

### 1. Mini Waveform Display

**Location**: Appears on YouTube video page when Sleep Mode is active

**What It Shows**:
- Real-time audio levels
- Compression activity (color-coded)
- Current processing status

**Color Coding**:
- 🟢 **Green**: Normal audio levels
- 🟡 **Yellow**: Compression actively reducing volume
- 🔴 **Red**: Peak limiting engaged (protecting from spikes)
- ⚪ **Gray**: Sleep Mode inactive

**How to Read**:
- Height of bars = Current audio level
- Color intensity = Amount of processing applied
- Smooth bars = Good compression
- Erratic bars = Challenging audio (lots of spikes)

### 2. Compression Heatmap

**Location**: Below mini waveform on video page

**What It Shows**:
- Visual history of compression activity
- Temporal patterns of volume changes
- Frequency of audio spikes

**Color Intensity**:
- **Dark/Off**: No compression needed
- **Light Blue**: Light compression (1-3 dB reduction)
- **Medium Blue**: Moderate compression (3-6 dB reduction)
- **Bright Blue**: Heavy compression (6+ dB reduction)

**Interpretation**:
- Consistent light blue = Good, stable content
- Frequent bright spots = Lots of volume spikes
- Solid dark = Very quiet content (might need gain boost)

### 3. Popup Metrics (Optional)

**Location**: Click extension icon in toolbar

**Metrics Displayed**:

#### Current Loudness
- Real-time audio level in dB
- Range: -60 dB (very quiet) to 0 dB (maximum)
- Target: -20 dB to -12 dB for comfortable listening

#### Compression Gain Reduction
- How much volume is being reduced
- Shown in dB (e.g., "-6 dB")
- Higher values = more aggressive compression

#### Peaks Suppressed Count
- Total number of sudden spikes blocked
- Resets when you reload page
- Higher count = more protection provided

---

## How to Use the Visualizer

### Activating Visual Feedback

**Step 1: Enable Sleep Mode**
1. Navigate to YouTube video page
2. Click "Sleep Mode" button (appears next to player)
3. Mini waveform automatically appears

**Step 2: View Detailed Metrics** (Optional)
1. Click SleepyTube icon in browser toolbar
2. Popup shows current compression settings
3. Real-time metrics update while video plays

### Reading Waveform Patterns

#### Healthy Sleep-Safe Audio

**Characteristics**:
- Smooth, consistent waveform bars
- Mostly green with occasional yellow
- Compression heatmap shows light, even blue
- Peaks suppressed count increases slowly

**What This Means**:
✅ Audio is stable and safe for sleep  
✅ No jarring volume changes  
✅ Compression working efficiently  

#### Problematic Audio (Before Processing)

**Characteristics**:
- Erratic waveform with extreme variations
- Frequent bright blue in heatmap
- Peaks suppressed counter rapidly increasing
- Compression gain reduction >10 dB

**What This Means**:
⚠️ Original audio has many volume spikes  
⚠️ Without SleepyTube, would be disruptive  
✅ **But** extension is protecting you  

**Action**: Consider switching to a different video if compression is constantly maxed out.

### Understanding Compression Activity

**Light Compression (1-3 dB)**:
- Normal for most content
- Subtle smoothing of dynamics
- Audio sounds natural

**Moderate Compression (3-6 dB)**:
- Common in mixed-volume content
- Noticeable smoothing effect
- Still sounds good for sleep

**Heavy Compression (6-12 dB)**:
- Used during extreme volume spikes
- Very noticeable "squashing" effect
- Protects ears but may sound less natural

**Excessive Compression (>12 dB)**:
- Rare, only in very poorly mastered content
- May cause pumping/breathing artifacts
- Consider different video or scene mode

---

## Advanced Features

### Compression Threshold Visualization

**In Popup Settings**:
- Threshold slider shows dB level
- Waveform changes color as you adjust
- See effect in real-time

**How It Works**:
- Audio below threshold = passes unchanged
- Audio above threshold = gets compressed
- Lower threshold = more compression

**Visual Feedback**:
- Green bars = below threshold (no compression)
- Yellow/red bars = above threshold (compressed)

### Ratio Indicator

**What It Shows**:
- Compression ratio (e.g., "4:1")
- Higher ratio = more aggressive compression

**Reading the Ratio**:
- 1:1 = No compression (bypass)
- 2:1 = Gentle compression
- 4:1 = Moderate compression (default)
- 8:1 = Heavy compression
- 20:1 = Limiting (brick wall)

---

## Troubleshooting Visual Feedback

### Waveform Not Appearing

**Possible Causes**:
1. Sleep Mode not activated
2. Video not playing
3. Audio muted or volume at 0
4. Browser extension conflict

**Solutions**:
1. Click "Sleep Mode" button on video page
2. Play video (press spacebar)
3. Unmute and set volume >20%
4. Disable other audio extensions temporarily

### Waveform Stuck/Frozen

**Symptoms**:
- Bars not moving
- Metrics not updating
- Heatmap not changing

**Solutions**:
1. Pause and resume video
2. Refresh page (F5)
3. Toggle Sleep Mode off/on
4. Check DevTools console for errors

### Metrics Show All Zeros

**Possible Causes**:
- Audio engine not initialized
- Video has no audio track
- System audio processing disabled

**Solutions**:
1. Verify video has audio (check volume icon)
2. Reload extension: chrome://extensions → Reload
3. Try different video to test
4. Check browser audio permissions

### Colors Look Wrong

**Issue**: Heatmap showing unexpected colors

**Explanation**:
- Colorblind mode may be enabled
- Browser color profile affecting display

**Solutions**:
- Check extension settings for colorblind mode
- Disable browser color adjustments
- Use metrics numbers instead of colors

---

## Performance Considerations

### CPU Usage

**Normal**: 2-5% CPU during playback

**High**: >10% CPU

**If High CPU**:
- Disable visualizer (close popup)
- Reduce video quality
- Close other tabs
- Update Chrome to latest version

### Memory Usage

**Normal**: 30-50 MB RAM

**High**: >100 MB RAM

**If High Memory**:
- Refresh page to clear buffers
- Disable compression heatmap
- Reduce scene complexity

---

## Technical Details

### Audio Analysis

**Sample Rate**: 48 kHz (YouTube standard)  
**Buffer Size**: 2048 samples  
**Update Rate**: 60 fps (16.67ms intervals)  
**Latency**: <50ms (imperceptible)

### Waveform Rendering

**Technology**: HTML5 Canvas API  
**Resolution**: 200x60 pixels (mini waveform)  
**Color Depth**: 24-bit RGB  
**Smoothing**: Enabled for anti-aliasing

### Metrics Calculation

**Loudness**: LUFS (Loudness Units Full Scale)  
**Peak Detection**: True Peak (ITU-R BS.1770)  
**Compression**: Real-time gain reduction in dB  
**Update Frequency**: Every 16.67ms (60 Hz)

---

## Keyboard Shortcuts (Planned)

| Shortcut | Action |
|----------|--------|
| `Alt + V` | Toggle visualizer on/off |
| `Alt + H` | Toggle heatmap display |
| `Alt + M` | Toggle metrics panel |
| `Alt + R` | Reset peak counter |

> ⚠️ **Note**: Keyboard shortcuts not yet implemented in v1.3.2

---

## FAQ

**Q: Does the visualizer affect audio quality?**  
A: No. Visualization is separate from processing. Disabling visuals doesn't change audio.

**Q: Can I customize visualizer colors?**  
A: Not yet. Custom color themes planned for v1.4.0.

**Q: Why does the waveform sometimes lag?**  
A: High CPU usage or slow browser can cause lag. Try closing other tabs.

**Q: Can I export visualizer data?**  
A: Not currently. CSV export planned for future release.

**Q: Does visualizer work on mobile?**  
A: No. Extension is desktop-only. Mobile support not planned.

---

## Best Practices

### For Accurate Readings

1. **Let it stabilize**: Wait 10-15 seconds after activating
2. **Consistent volume**: Don't change system volume while monitoring
3. **Single tab**: Close other audio/video tabs for accurate metrics
4. **Quality matters**: Higher video quality = better audio analysis

### For Performance

1. **Close popup when not needed**: Saves CPU/RAM
2. **Disable heatmap**: If experiencing lag
3. **Lower video quality**: On slower computers
4. **Use scene presets**: Instead of custom settings (more optimized)

### For Learning

1. **Compare videos**: See which types need more compression
2. **Experiment with settings**: Watch how metrics change
3. **Note patterns**: Learn which content is sleep-safe
4. **Use predictions**: AI labels correlate with visualizer patterns

---

## Future Enhancements

**Planned for v1.4.0**:
- [ ] Full-screen visualizer mode
- [ ] Frequency spectrum analyzer
- [ ] Stereo field visualization
- [ ] Recording and playback of compression history
- [ ] Export metrics to CSV
- [ ] Custom color themes
- [ ] Keyboard shortcuts
- [ ] Accessibility improvements

**Planned for v2.0**:
- [ ] Machine learning analysis of audio patterns
- [ ] Predictive compression adjustment
- [ ] Cloud-based compression profile sharing
- [ ] Integration with sleep tracking apps

---

## Support

**Need Help?**
- GitHub Issues: https://github.com/IRONICBo/SleepyTube/issues
- User Guide: See main documentation
- Community: Join GitHub Discussions

**Found a Bug?**
- Report with visualizer screenshot
- Include browser/extension version
- Describe expected vs actual behavior

---

**Document Version**: 1.0  
**Last Updated**: 2026-02-08  
**Applies to**: SleepyTube v1.3.2+  
**Maintained By**: SleepyTube Team
