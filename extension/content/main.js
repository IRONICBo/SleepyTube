/**
 * Main entry point for SleepyTube content script
 * Orchestrates video detection, audio processing, and UI injection
 */

class SleepyTubeController {
  constructor() {
    this.currentVideo = null;
    this.audioEngine = null;
    this.uiManager = null;
    this.miniWaveform = null;
    this.globalHeatmap = null;
    this.isInitialized = false;
    this.videoObserver = null;
    this.navigationTimer = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.boot = this.boot.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
  }
  
  /**
   * Initialize the controller
   */
  async init() {
    window.SleepyTubeUtils.log('Initializing SleepyTube...');
    
    // Load configuration
    await window.SleepyTubeConfig.load();
    
    // Wait for page to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', this.boot);
    } else {
      this.boot();
    }
    
    // Listen for YouTube SPA navigation
    document.addEventListener('yt-navigate-finish', this.handleNavigation);
    
    // Listen for configuration changes
    window.SleepyTubeConfig.onChange((config) => {
      if (this.audioEngine && config.sleepModeEnabled !== this.audioEngine.isEnabled) {
        if (config.sleepModeEnabled) {
          this.audioEngine.connect();
          // Show mini waveform if enabled
          if (this.miniWaveform && config.miniWaveformEnabled) {
            this.miniWaveform.show();
          }
          // Show global heatmap
          if (this.globalHeatmap) {
            this.globalHeatmap.show();
          }
        } else {
          this.audioEngine.disconnect();
          // Hide mini waveform
          if (this.miniWaveform) {
            this.miniWaveform.hide();
          }
          // Hide global heatmap
          if (this.globalHeatmap) {
            this.globalHeatmap.hide();
          }
        }
      }
      
      // Handle mini waveform toggle
      if (this.miniWaveform && config.miniWaveformEnabled !== undefined) {
        if (config.miniWaveformEnabled && config.sleepModeEnabled) {
          this.miniWaveform.show();
        } else if (!config.miniWaveformEnabled) {
          this.miniWaveform.hide();
        }
      }
      
      if (this.audioEngine) {
        this.audioEngine.updateSettings(config);
      }
      
      if (this.uiManager) {
        this.uiManager.updateButtonState();
      }
    });
    
    this.isInitialized = true;
  }
  
  /**
   * Boot the extension on the current page
   */
  async boot() {
    if (!window.SleepyTubeUtils.isSleepModeAllowed()) {
      window.SleepyTubeUtils.log('Page type not supported, skipping initialization');
      return;
    }
    
    window.SleepyTubeUtils.log('Booting on', window.location.pathname);
    
    try {
      // STRATEGY: Inject UI FIRST, then connect audio when video is ready
      // This ensures button appears immediately, even if video isn't loaded yet
      
      // Step 1: Inject UI immediately (doesn't need video element)
      if (!this.uiManager) {
        this.uiManager = new window.UIManager(null); // Pass null initially
        await this.uiManager.injectSleepModeButton();
        window.SleepyTubeUtils.log('UI injected early ✨');
      }
      
      // Step 2: Find and connect to video element (can be delayed)
      const video = await this.findVideoElement();
      
      if (!video) {
        window.SleepyTubeUtils.logError('Video element not found, UI available but audio disabled');
        return;
      }
      
      this.currentVideo = video;
      
      // Step 3: Initialize audio engine and connect to UI
      this.audioEngine = new window.AudioEngine(video);
      await this.audioEngine.init();
      
      // Connect audio engine to UI manager
      this.uiManager.updateAudioEngine(this.audioEngine);
      
      // Get config for feature initialization
      const config = window.SleepyTubeConfig.get();
      
      // Step 4: Initialize mini waveform
      if (window.MiniWaveform) {
        this.miniWaveform = new window.MiniWaveform(this.audioEngine);
        
        // Check if mini waveform should be shown
        if (config.miniWaveformEnabled && config.sleepModeEnabled) {
          this.miniWaveform.show();
        }
      }
      
      // Step 5: Initialize global heatmap
      if (window.GlobalHeatmap) {
        this.globalHeatmap = new window.GlobalHeatmap(this.audioEngine);
        
        // Auto-show heatmap when sleep mode is enabled
        if (config.sleepModeEnabled) {
          this.globalHeatmap.show();
        }
      }
      
      // Check if sleep mode should be enabled
      if (config.sleepModeEnabled) {
        await this.audioEngine.connect();
      }
      
      // Start observing for video changes
      this.observeVideoChanges();
      
      window.SleepyTubeUtils.log('SleepyTube ready (audio connected) 🎵');
      
    } catch (error) {
      window.SleepyTubeUtils.logError('Boot failed:', error);
    }
  }
  
  /**
   * Find the active video element
   */
  async findVideoElement() {
    const selectors = [
      // Standard watch page
      '.html5-video-player > video.html5-main-video',
      
      // Shorts page
      'ytd-reel-video-renderer[is-active] video',
      'ytd-reel-player-overlay-renderer ytd-reel-video-renderer video',
      
      // Generic fallback
      'video.html5-main-video'
    ];
    
    for (const selector of selectors) {
      try {
        // Reduced timeout from 3000ms to 1500ms for faster fallback
        const video = await window.SleepyTubeUtils.waitForElement(selector, 1500);
        if (video) {
          window.SleepyTubeUtils.log('Found video element:', selector);
          return video;
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    return null;
  }
  
  /**
   * Observe DOM for video element changes
   */
  observeVideoChanges() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
    }
    
    this.videoObserver = new MutationObserver((mutations) => {
      // Check if video element has changed
      const newVideo = document.querySelector('.html5-video-player > video.html5-main-video') ||
                       document.querySelector('ytd-reel-video-renderer[is-active] video');
      
      if (newVideo && newVideo !== this.currentVideo) {
        window.SleepyTubeUtils.log('Video element changed');
        this.handleVideoChange(newVideo);
      }
    });
    
    this.videoObserver.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
  
  /**
   * Handle video element change (playlist, autoplay, etc.)
   */
  async handleVideoChange(newVideo) {
    window.SleepyTubeUtils.log('Handling video change');
    
    // Cleanup old audio engine
    if (this.audioEngine) {
      this.audioEngine.destroy();
    }
    
    // Create new audio engine for new video
    this.audioEngine = new window.AudioEngine(newVideo);
    await this.audioEngine.init();
    
    // Check if sleep mode should be enabled
    const config = window.SleepyTubeConfig.get();
    if (config.sleepModeEnabled) {
      await this.audioEngine.connect();
    }
    
    // Update UI manager
    if (this.uiManager) {
      this.uiManager.updateAudioEngine(this.audioEngine);
    }
    
    // Update mini waveform
    if (this.miniWaveform) {
      this.miniWaveform.updateAudioEngine(this.audioEngine);
    }
    
    // Update global heatmap
    if (this.globalHeatmap) {
      this.globalHeatmap.updateAudioEngine(this.audioEngine);
    }
    
    this.currentVideo = newVideo;
  }
  
  /**
   * Handle YouTube SPA navigation
   */
  handleNavigation() {
    window.SleepyTubeUtils.log('Navigation detected');
    
    // Prevent duplicate initialization
    if (this.navigationTimer) {
      clearTimeout(this.navigationTimer);
    }
    
    // Reinitialize on navigation
    this.navigationTimer = setTimeout(() => {
      this.navigationTimer = null;
      this.boot();
    }, 500); // Give YouTube time to render
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
      this.videoObserver = null;
    }
    
    if (this.audioEngine) {
      this.audioEngine.destroy();
      this.audioEngine = null;
    }
    
    if (this.uiManager) {
      if (this.uiManager.sleepModeButton) {
        this.uiManager.sleepModeButton.remove();
      }
      if (this.uiManager.controlPanel) {
        this.uiManager.controlPanel.remove();
      }
      this.uiManager = null;
    }
    
    this.isInitialized = false;
    window.SleepyTubeUtils.log('SleepyTube destroyed');
  }
}

// Initialize controller when script loads
const controller = new SleepyTubeController();
controller.init();

// Export for debugging
window.SleepyTubeController = controller;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  window.SleepyTubeUtils.log('Received message:', message);
  
  switch (message.type) {
    case 'CONFIG_UPDATED':
      // Configuration was updated in popup, already handled by storage listener
      sendResponse({ success: true });
      break;
      
    case 'GET_WAVEFORM_DATA':
      // Send waveform data to popup
      if (controller.audioEngine && controller.audioEngine.nodes) {
        const nodes = controller.audioEngine.nodes;
        if (nodes.sourceAnalyser && nodes.outputAnalyser) {
          const beforeData = new Float32Array(128);
          const afterData = new Float32Array(128);
          
          nodes.sourceAnalyser.getFloatTimeDomainData(beforeData);
          nodes.outputAnalyser.getFloatTimeDomainData(afterData);
          
          sendResponse({
            beforeData: Array.from(beforeData),
            afterData: Array.from(afterData)
          });
        } else {
          sendResponse({ beforeData: null, afterData: null });
        }
      } else {
        sendResponse({ beforeData: null, afterData: null });
      }
      break;
      
    case 'UPDATE_PLAYER_BUTTON':
      // Update player button state from popup
      if (controller.uiManager) {
        controller.uiManager.updateButtonState();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'UI Manager not ready' });
      }
      break;
      
    case 'TOGGLE_SLEEP_MODE':
      // Toggle sleep mode from popup
      if (controller.uiManager) {
        controller.uiManager.toggleSleepMode();
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false, error: 'UI Manager not ready' });
      }
      break;
      
    case 'getSpeechRateStatus':
      // Get speech rate status
      if (controller.audioEngine && controller.audioEngine.speechRateController) {
        const status = controller.audioEngine.speechRateController.getStatus();
        sendResponse({ status });
      } else {
        sendResponse({ status: null });
      }
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown message type' });
  }
  
  return true; // Keep channel open for async response
});

window.SleepyTubeUtils.log('Content script loaded');

// Initialize and start the controller (only once)
(function initSleepyTube() {
  // Prevent multiple initialization
  if (window.SleepyTubeController) {
    window.SleepyTubeUtils.log('Controller already initialized, skipping');
    return;
  }
  
  // Create controller instance
  window.SleepyTubeController = new SleepyTubeController();
  
  // Initialize
  window.SleepyTubeController.init();
  
  // Boot on current page
  window.SleepyTubeController.boot();
  
  window.SleepyTubeUtils.log('SleepyTube initialized 🚀');
})();
