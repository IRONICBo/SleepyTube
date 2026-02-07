# SleepyTube Installation Guide

## Quick Install (5 minutes)

### Step 1: Get the Code
```bash
git clone https://github.com/sleepytube/sleepytube.git
cd sleepytube
```

### Step 2: Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Select the `extension` folder inside the SleepyTube directory
5. Done! You should see the SleepyTube icon appear

### Step 3: Test It
1. Go to any YouTube video
2. Look for the equalizer icon (📊) in the video player controls
3. Click it to enable Sleep Mode
4. Audio processing should start immediately!

---

## After Updating Code

**IMPORTANT**: If you pull updates from Git, you MUST reload the extension for changes to take effect.

### Method 1: Quick Reload
1. Go to `chrome://extensions/`
2. Find "SleepyTube"
3. Click the **refresh icon** (🔄) next to the extension

### Method 2: Toggle Off/On
1. Go to `chrome://extensions/`
2. Find "SleepyTube"  
3. Toggle it **OFF**
4. Toggle it back **ON**

### Method 3: Full Reinstall
1. Go to `chrome://extensions/`
2. Click **"Remove"** on SleepyTube
3. Click **"Load unpacked"** again
4. Select the `extension` folder

**After reloading**, refresh any open YouTube tabs (`F5` or `Ctrl+R`).

---

## Troubleshooting

### "AudioEngine is not a constructor" Error

This means Chrome is using cached old code. Solution:

1. **Reload extension** (Method 1 above)
2. **Hard refresh YouTube**: `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
3. **Close all YouTube tabs** and reopen

### "Unexpected token" Errors

Same issue - old cached code. Follow the same steps as above.

### Extension Not Appearing

- Check that Developer mode is enabled
- Make sure you selected the `extension` folder (not the root `sleepytube` folder)
- Look for error messages in the Extensions page

### Sleep Mode Button Missing

- Refresh the YouTube page (`F5`)
- Check the extension is enabled in `chrome://extensions/`
- Try a different video
- Check browser console for errors (`F12` → Console tab)

---

## Verifying Installation

### Check Extension is Loaded
1. Go to `chrome://extensions/`
2. You should see:
   - **Name**: SleepyTube
   - **Version**: 1.0.0
   - **Status**: Enabled (blue toggle)

### Check It Works
1. Open https://www.youtube.com/watch?v=dQw4w9WgXcQ
2. Look for the equalizer icon (📊) in the player controls
3. Click it - icon should turn blue/highlighted
4. Right-click it - a settings panel should appear
5. Click "Show Audio Monitor" - visualizer should appear

If all of the above work, you're good to go! 🎉

---

## Advanced: Development Mode

If you're developing/modifying the code:

### Watch for Changes
Chrome does NOT auto-reload extensions. After every code change:
1. Save your files
2. Go to `chrome://extensions/`
3. Click reload on SleepyTube
4. Refresh YouTube tab

### View Logs
- **Extension logs**: `chrome://extensions/` → SleepyTube → "Inspect views: service worker"
- **Content script logs**: Open YouTube → `F12` → Console tab
- Look for messages starting with `[SleepyTube]`

### Test Different Scenarios
- Watch page: `youtube.com/watch?v=...`
- Shorts page: `youtube.com/shorts/...`
- Playlist: `youtube.com/watch?v=...&list=...`
- YouTube Music: `music.youtube.com`

---

## Uninstalling

If you want to remove SleepyTube:

1. Go to `chrome://extensions/`
2. Find "SleepyTube"
3. Click **"Remove"**
4. Confirm removal

All settings will be deleted. You can reinstall anytime using the installation steps above.

---

## Need Help?

- **Documentation**: See [README.md](README.md)
- **Report bugs**: [GitHub Issues](https://github.com/sleepytube/sleepytube/issues)
- **Get support**: [GitHub Discussions](https://github.com/sleepytube/sleepytube/discussions)
