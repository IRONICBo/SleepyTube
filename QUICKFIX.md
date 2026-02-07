# SleepyTube Quick Fix Guide

## 🚨 Seeing Errors?

### Common Errors:
- ❌ "AudioEngine is not a constructor"
- ❌ "Unexpected token"
- ❌ "Cannot read properties of null (reading 'start')"
- ❌ Syntax errors in audio-engine.js, visualizer.js, or ui-components.js

### The Issue
Chrome is using old cached code from a previous version.

### The Solution (30 seconds)

**Step 1**: Reload the extension
1. Open new tab → type `chrome://extensions/`
2. Find **SleepyTube**
3. Click the **🔄 reload icon**

**Step 2**: Refresh YouTube
1. Go to your YouTube tab
2. Press `Ctrl + Shift + R` (Windows/Linux)
3. Press `Cmd + Shift + R` (Mac)

**Done!** The errors should be gone.

---

## ✅ Quick Checks

### Extension loaded correctly?
- Go to `chrome://extensions/`
- SleepyTube should show:
  - ✓ Blue toggle (enabled)
  - ✓ Version 1.0.0
  - ✓ No error messages

### Works on YouTube?
- Open any YouTube video
- Look for 📊 icon in player controls
- Click it → should turn blue
- Audio should process (watch for volume smoothing)

---

## 📖 Full Documentation
- [INSTALL.md](INSTALL.md) - Detailed installation guide
- [README.md](README.md) - Complete user manual
- [GitHub Issues](https://github.com/sleepytube/sleepytube/issues) - Report bugs

---

**Remember**: After updating code via Git, always reload the extension!
