/**
 * Main entry point for SleepyTube content script
 * Orchestrates video detection, audio processing, and UI injection
 */

class SleepyTubeController {
  constructor() {
    this.currentVideo = null;
    this.audioEngine = null;
    this.uiManager = null;
    this.isInitialized = false;
    this.videoObserver = null;
    
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
        } else {
          this.audioEngine.disconnect();
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
      // Find video element
      const video = await this.findVideoElement();
      
      if (!video) {
        window.SleepyTubeUtils.logError('Video element not found');
        return;
      }
      
      this.currentVideo = video;
      
      // Initialize audio engine
      this.audioEngine = new window.AudioEngine(video);
      await this.audioEngine.init();
      
      // Check if sleep mode should be enabled
      const config = window.SleepyTubeConfig.get();
      if (config.sleepModeEnabled) {
        await this.audioEngine.connect();
      }
      
      // Initialize UI manager
      this.uiManager = new window.UIManager(this.audioEngine);
      await this.uiManager.injectSleepModeButton();    // Start observing for video changes
      this.observeVideoChanges();
      
      window.SleepyTubeUtils.log('SleepyTube ready');
      
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
        const video = await window.SleepyTubeUtils.waitForElement(selector, 3000);
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
    
    this.currentVideo = newVideo;
  }
  
  /**
   * Handle YouTube SPA navigation
   */
  handleNavigation() {
    window.SleepyTubeUtils.log('Navigation detected');
    
    // Reinitialize on navigation
    setTimeout(() => {
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

window.SleepyTubeUtils.log('Content script loaded');
