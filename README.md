# SleepyTube

> Transform YouTube into a sleep-safe audio experience

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-brightgreen)](https://chrome.google.com/webstore)

## What is SleepyTube?

SleepyTube is a Chrome extension that makes YouTube safe for sleeping by eliminating unpredictable audio stimuli that can wake you up. Whether you're listening to ASMR, podcasts, ambient sounds, or educational content to fall asleep, SleepyTube ensures you won't be startled awake by:

- Sudden volume spikes (applause, laughter, sound effects)
- Inconsistent loudness between videos
- Harsh high frequencies or rumbling bass
- Fast, stimulating speech

## Features

### Core Audio Protection
- **Smart Compression**: Automatically smooths out volume differences
- **Brickwall Limiter**: Hard cap on maximum volume to prevent sudden spikes
- **Auto Gain Control (AGC)**: Maintains consistent loudness across videos (-18 LUFS target)
- **Sleep EQ**: Reduces harsh frequencies for gentler sound

### Advanced Controls
- **Voice Focus Mode**: Enhances speech clarity while ducking background noise
- **Multiband Processing**: Separates low/mid/high frequencies for surgical control
- **Configurable Strength**: Light, Medium, or Strong compression presets
- **Sound Softening**: Natural, Gentle, or Ultra Soft EQ presets

### Intelligent Features
- **Sleep Score** (Coming Soon): Rates videos for sleep-friendliness
- **One-Click Activation**: Toggle button integrated into YouTube player
- **Real-Time Processing**: Zero-latency audio modification
- **Settings Sync**: Configuration saved across browser sessions

## Installation

### From Chrome Web Store (Recommended)
1. Visit [Chrome Web Store - SleepyTube](https://chrome.google.com/webstore) _(coming soon)_
2. Click "Add to Chrome"
3. Confirm installation

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/sleepytube/sleepytube.git
   cd sleepytube
   ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" (toggle in top-right corner)

4. Click "Load unpacked" and select the `extension` folder

5. The SleepyTube icon should appear in your extensions toolbar

## Usage

### Quick Start
1. Open any YouTube video
2. Look for the Sleep Mode button (equalizer icon) in the player controls
3. Click to enable Sleep Mode - audio processing starts immediately
4. Right-click the button or open extension popup for advanced settings

### Recommended Settings
For best sleep experience, we recommend:
- **Compression**: Medium or Strong
- **EQ**: Gentle or Ultra Soft
- **Voice Focus**: Enabled (for podcasts/ASMR with speech)
- **Auto Gain**: Enabled

# Shortcuts
- `Alt+S`: Toggle Sleep Mode (configurable in Chrome settings)
- `Esc`: Close control panel

## How It Works

SleepyTube uses the Web Audio API to process YouTube's audio in real-time:

```
Video Audio → Multiband Split → EQ → Compressor → AGC → Limiter → Output
```

### Technical Details
- **Compression**: Reduces dynamic range (quiet-to-loud difference)
- **Limiting**: Hard ceiling at -1.0 dBFS prevents clipping/distortion
- **AGC**: Slowly adjusts gain to maintain target loudness
- **Voice Focus**: Detects speech energy and reduces background frequencies

See [Technical Design Document](docs/1.tech-design.md) for full architecture details.

## Screenshots

_Coming soon_

## Roadmap

### Version 1.0 (Current)
- [x] Core audio stabilization
- [x] Sleep Mode toggle
- [x] Compression presets
- [x] Sleep EQ presets
- [x] Auto Gain Control
- [x] Voice Focus Mode
- [x] Settings panel

### Version 1.1
- [ ] Sleep Score calculation
- [ ] Thumbnail badges (homepage/search)
- [ ] Advanced metrics panel
- [ ] Onboarding tour

### Version 2.0
- [ ] Machine learning event detection (laughter, applause)
- [ ] Adaptive learning from user behavior
- [ ] Sleep analytics dashboard
- [ ] Auto-fade after N minutes

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup
```bash
# Clone repository
git clone https://github.com/sleepytube/sleepytube.git
cd sleepytube

# Load extensionn Chrome (see Manual Installation above)

# Make changes to code in extension/ directory

# Reload extension in chrome://extensions to test changes
```

### Project Structure
```
sleepytube/
├── extension/              # Chrome extension source
│   ├── manifest.json       # Extension configuration
│   ├── background/         # Service worker
│   ├── content/            # Content scripts (main logic)
│   ├── popup/              # Extension popup UI
│   ├── icons/              # Extension icons
│   └── assets/             # Additional resources
├── docs/                   # Documentation
│   ├── 0.product-design.md # Product specification
│   ├── 1.tech-design.md    # Technical architecture
│   └── 2.features.md       # Feature roadmap
└── README.md               # This file
```

## Privacy

SleepyTube is committed to user privacy:
- **Zero Telemetry**: No usage data sent to external servers
- **Local Processing**: All audio analysis done in-browser
- **No Recording**: Never stores or transmits audio streams
- **Minimal Permissions**: Only requires `storage` and YouTube host access

See [Privacy Policy](https://sleepytube.github.io/privacy) for details.

## FAQ

**Q: Does SleepyTube work on mobile?**  
A: Currently Chrome extensions don't support mobile browsers. We're exploring mobile app options for the future.

**Q: Will this affect audio quality?**  
A: Modern audio processing is imperceptible to most listeners. The slight compression/limiting trade-off is worthwhile for sleep safety.

**Q: Does it work with YouTube Premium/Music?**  
A: Yes! SleepyTube works with any YouTube audio, including Premium and Music.

**Q: Can I use it with other websites?**  
A: Currently YouTube-only. Future versions may support other platforms.

**Q: Is it compatible with other YouTube extensions?**  
A: Generally yes, but extensions that modify audio (e.g., equalizers) may conflict.

## Support

- **Documentation**: [https://sleepytube.github.io](https://sleepytube.github.io)
- **Issues**: [GitHub Issues](https://github.com/sleepytube/sleepytube/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sleepytube/sleepytube/discussions)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Inspired by community discussions about YouTube sleep audio challenges
- Built with Web Audio API and Chrome Extensions API
- Special thanks to reference projects:
  - [NebulaNorm](https://github.com/references/NebulaNorm)
  - [YouTube Volume Normalizer](https://github.com/Kelvin-Ng/youtube-volume-normalizer)

## Disclaimer

SleepyTube is an independent project and is not affiliated with, endorsed by, or sponsored by YouTube or Google.

---

**Made with care for better sleep** 🌙

[Website](https://sleepytube.github.io) • [Chrome Store](https://chrome.google.com/webstore) • [GitHub](https://github.com/sleepytube/sleepytube)
