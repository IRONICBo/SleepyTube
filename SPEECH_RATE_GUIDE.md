# Speech Rate Detection & Adjustment Guide

## Overview

SleepyTube v1.4.0 introduces automatic speech rate detection and playback speed adjustment to help you listen to fast-talking content at a comfortable pace.

## How It Works

### Detection Method

The system uses **energy-based syllable detection** to analyze speech patterns:

1. **Short-term Energy Analysis**: Identifies high-energy portions (vowels)
2. **Zero-Crossing Rate**: Distinguishes speech from noise  
3. **Syllable Counting**: Tracks syllable intervals over time
4. **Rate Calculation**: Converts to syllables per second

### Speech Rate Categories

| Category | Syllables/Second | Description |
|----------|------------------|-------------|
| **Very Slow** | < 2.0 syl/s | Deliberate speaking |
| **Slow** | 2.0-3.0 syl/s | Relaxed pace |
| **Normal** | 3.0-4.0 syl/s | Standard conversation |
| **Fast** | 4.0-5.0 syl/s | Quick speaking |
| **Very Fast** | > 5.0 syl/s | Rapid speech |

## Usage

### Enable Speech Rate Adjustment

1. Open SleepyTube popup
2. Click ⚙️ (Settings) icon
3. Scroll to **Speech Rate** section
4. Toggle **Speech Rate Adjustment** ON

### Target Rate Options

- **Slow** (2.5 syl/s): For maximum clarity
- **Normal** (3.5 syl/s): Comfortable listening pace
- **Fast** (4.5 syl/s): Keep some speed
- **Auto**: Automatically adjust to normal pace

### Monitoring

When enabled, the UI shows:
- **Detected Rate**: Current speech speed (e.g., "4.2 syl/s (fast)")
- **Playback Rate**: Adjusted speed multiplier (e.g., "0.85x")

## Podcast Scene Mode

The **Podcast** scene automatically enables speech rate adjustment with these settings:

```yaml
Speech Rate: Enabled
Target Rate: Normal (3.5 syl/s)
Adjustment Range: 0.5x - 1.5x
```

Perfect for:
- Fast-talking interviewers
- Rushed podcast episodes  
- Dense educational content
- Non-native language listening

## Technical Details

### Adjustment Limits

- **Minimum**: 0.5x speed (50% slower)
- **Maximum**: 1.5x speed (50% faster)
- **Threshold**: Only adjusts if difference > 10%

### Smoothing

- Updates every 2 seconds
- Maximum 5% change per update
- Prevents abrupt speed changes

### Detection Accuracy

- Requires 5+ syllables for initial detection
- Confidence increases with more samples
- Updates in real-time as you listen

## Performance

- **CPU Impact**: ~1-2% additional
- **Detection Latency**: < 100ms
- **Adjustment Delay**: 2-4 seconds (smoothed)

## When to Use

✅ **Recommended**:
- Podcast interviews with fast talkers
- Educational lectures
- News programs
- Non-native language practice

❌ **Not Recommended**:
- Music content
- Already slow-paced videos
- Content with frequent silence
- Multi-speaker overlapping dialogue

## Troubleshooting

### Rate Not Detected

**Symptoms**: Shows "Detecting..." continuously

**Solutions**:
- Ensure video has clear speech
- Check volume is audible
- Wait 10-15 seconds for detection
- Try content with continuous dialogue

### Playback Too Slow/Fast

**Symptoms**: Speed feels unnatural

**Solutions**:
- Adjust **Target Rate** setting
- Switch to different preset (Slow/Normal/Fast)
- Disable for specific content
- Check browser's native playback speed is 1.0x

### Choppy Playback

**Symptoms**: Audio stutters or glitches

**Solutions**:
- This is a browser/system limitation
- Reduce target adjustment range
- Use lighter stability settings
- Close other browser tabs

## Combining with Other Features

Speech rate works alongside:

- ✅ **Voice Focus**: Enhance clarity + adjust speed
- ✅ **AGC**: Consistent volume + comfortable pace  
- ✅ **EQ Settings**: Gentle sound + slower speech
- ⚠️ **Manual playback speed**: May conflict - use one or the other

## Examples

### Fast Podcast

```
Detected: 5.2 syl/s (very_fast)
Target: 3.5 syl/s (normal)
Adjustment: 0.67x (slowed down 33%)
Result: More comfortable listening
```

### Already Normal Speech

```
Detected: 3.4 syl/s (normal)
Target: 3.5 syl/s (normal)
Difference: < 10% threshold
Result: No adjustment (1.0x speed)
```

### Slow Lecture

```
Detected: 2.3 syl/s (slow)  
Target: 3.5 syl/s (normal)
Adjustment: 1.52x → Limited to 1.5x (max)
Result: Slightly faster (50% speedup)
```

## Advanced Settings

Currently available via popup UI:

- Enable/Disable toggle
- Target rate selection (Slow/Normal/Fast/Auto)
- Real-time monitoring

Future enhancements may include:
- Custom syllable rate targets
- Per-channel memory
- Adjustment smoothness control
- Detection sensitivity tuning

## Privacy & Data

- All detection happens **locally** in your browser
- No speech data is sent to servers
- No audio recording or storage
- Settings saved in browser sync storage only

---

**Note**: Speech rate detection works best with:
- Clear single-speaker audio
- Consistent speech patterns
- Minimal background noise  
- English language content (optimized for)

For multilingual support and advanced features, check future updates!
