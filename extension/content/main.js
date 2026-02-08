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
    this.videoPredictor = null;
    this.videoBadgeObserver = null;
    this.isInitialized = false;
    this.videoObserver = null;
    this.navigationTimer = null;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.boot = this.boot.bind(this);
    this.handleNavigation = this.handleNavigation.bind(this);
    this.handleVideoChange = this.handleVideoChange.bind(this);
    this.startVideoBadgeObserver = this.startVideoBadgeObserver.bind(this);
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
   * Initialize AI predictor badges (works on all YouTube pages)
   */
  async initAIPredictorBadges(config) {
    window.SleepyTubeUtils.log('Checking AI predictor config:', {
      hasVideoPredictor: !!window.VideoPredictor,
      aiPredictorEnabled: config.aiPredictorEnabled,
      aiPredictorProvider: config.aiPredictorProvider,
      hasApiKey: !!config.aiPredictorApiKey,
      apiKeyLength: config.aiPredictorApiKey ? config.aiPredictorApiKey.length : 0
    });
    
    if (window.VideoPredictor && config.aiPredictorEnabled) {
      window.SleepyTubeUtils.log('[AI Predictor] Initializing with config:', {
        enabled: config.aiPredictorEnabled,
        provider: config.aiPredictorProvider,
        hasKey: !!config.aiPredictorApiKey
      });
      
      // Initialize video predictor if not already initialized
      if (!this.videoPredictor) {
        this.videoPredictor = new window.VideoPredictor();
        await this.videoPredictor.loadConfig();
        
        window.SleepyTubeUtils.log('[AI Predictor] Config loaded, state:', {
          isEnabled: this.videoPredictor.isEnabled,
          hasApiKey: !!this.videoPredictor.apiKey,
          provider: this.videoPredictor.apiProvider,
          configLoaded: this.videoPredictor.configLoaded
        });
      }
      
      // Start badge observer on all YouTube pages
      this.startVideoBadgeObserver();
      window.SleepyTubeUtils.log('Video predictor initialized and badge observer started 🤖');
    } else {
      if (!window.VideoPredictor) {
        window.SleepyTubeUtils.log('[AI Predictor] ❌ VideoPredictor class not found');
      }
      if (!config.aiPredictorEnabled) {
        window.SleepyTubeUtils.log('[AI Predictor] ⚠️ AI predictor is disabled in config');
      }
    }
  }
  
  /**
   * Boot the extension on the current page
   */
  async boot() {
    window.SleepyTubeUtils.log('Booting on', window.location.pathname);
    
    // Get config first
    const config = window.SleepyTubeConfig.get();
    
    // Initialize AI predictor badges on ALL YouTube pages (homepage, search, etc.)
    await this.initAIPredictorBadges(config);
    
    // Only continue with audio processing on watch/shorts pages
    if (!window.SleepyTubeUtils.isSleepModeAllowed()) {
      window.SleepyTubeUtils.log('Not a watch/shorts page, skipping audio initialization');
      return;
    }
    
    window.SleepyTubeUtils.log('Watch/Shorts page detected, initializing audio processing');
    
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
      
      // Step 4: Initialize mini waveform
      window.SleepyTubeUtils.log('[Boot] Checking MiniWaveform class:', !!window.MiniWaveform);
      if (window.MiniWaveform) {
        window.SleepyTubeUtils.log('[Boot] Creating MiniWaveform instance...');
        this.miniWaveform = new window.MiniWaveform(this.audioEngine);
        window.SleepyTubeUtils.log('[Boot] MiniWaveform instance created:', !!this.miniWaveform);
        
        // Check if mini waveform should be shown
        window.SleepyTubeUtils.log('[Boot] Config check - miniWaveformEnabled:', config.miniWaveformEnabled, 'sleepModeEnabled:', config.sleepModeEnabled);
        if (config.miniWaveformEnabled && config.sleepModeEnabled) {
          window.SleepyTubeUtils.log('[Boot] Calling miniWaveform.show()...');
          this.miniWaveform.show();
        } else {
          window.SleepyTubeUtils.log('[Boot] MiniWaveform NOT shown - config check failed');
        }
      } else {
        window.SleepyTubeUtils.log('[Boot] ❌ MiniWaveform class not found!');
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
   * Start observing video cards for badge injection
   */
  startVideoBadgeObserver() {
    if (!this.videoPredictor) {
      window.SleepyTubeUtils.log('[Badge Observer] ❌ No video predictor available');
      return;
    }
    
    // Stop existing observer
    if (this.videoBadgeObserver) {
      this.videoBadgeObserver.disconnect();
    }
    
    window.SleepyTubeUtils.log('[Badge Observer] 🚀 Starting video badge observer');
    
    // Debounce processing to avoid excessive API calls
    let processingTimeout = null;
    const processNewVideos = () => {
      if (processingTimeout) clearTimeout(processingTimeout);
      
      processingTimeout = setTimeout(async () => {
        // Find all video cards without badges
        const videoCards = document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer, ytd-video-renderer, yt-lockup-view-model');
        
        window.SleepyTubeUtils.log(`[Badge Observer] Found ${videoCards.length} video cards`);
        
        let newCardsCount = 0;
        
        for (const card of videoCards) {
          // Skip if already processed
          if (card.hasAttribute('data-sleepytube-predicted')) {
            continue;
          }
          
          newCardsCount++;
          
          // Mark as processed
          card.setAttribute('data-sleepytube-predicted', 'true');
          
          // Extract video info
          const videoInfo = this.videoPredictor.extractVideoInfo(card);
          if (!videoInfo || !videoInfo.videoId) {
            window.SleepyTubeUtils.log('[Badge Observer] ⚠️ Failed to extract video info from card');
            continue;
          }
          
          window.SleepyTubeUtils.log('[Badge Observer] Processing video:', videoInfo.videoId, videoInfo.title);
          
          // Predict and add badge
          this.predictAndAddBadge(card, videoInfo);
        }
        
        if (newCardsCount > 0) {
          window.SleepyTubeUtils.log(`[Badge Observer] ✅ Processing ${newCardsCount} new video cards`);
        }
      }, 300); // 300ms debounce
    };
    
    // Initial processing
    processNewVideos();
    
    // Observe for new video cards
    this.videoBadgeObserver = new MutationObserver((mutations) => {
      processNewVideos();
    });
    
    this.videoBadgeObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    window.SleepyTubeUtils.log('[Badge Observer] ✅ Observer initialized and watching for video cards');
  }
  
  /**
   * Predict video quality and add badge
   */
  async predictAndAddBadge(cardElement, videoInfo) {
    try {
      // Find thumbnail container - 支持多种选择器
      const thumbnailSelectors = [
        'yt-thumbnail-view-model',          // 新布局
        'ytd-thumbnail',
        'yt-thumbnail',
        '.yt-lockup-view-model__content-image',
        '#thumbnail',
        'a.yt-simple-endpoint.inline-block'  // Fallback
      ];
      
      let thumbnail = null;
      for (const selector of thumbnailSelectors) {
        thumbnail = cardElement.querySelector(selector);
        if (thumbnail) {
          window.SleepyTubeUtils.log('[Badge Observer] Found thumbnail with:', selector);
          break;
        }
      }
      
      if (!thumbnail) {
        window.SleepyTubeUtils.log('[Badge Observer] ⚠️ No thumbnail found for:', videoInfo.videoId);
        window.SleepyTubeUtils.log('[Badge Observer] Card element:', cardElement.className);
        return;
      }
      
      window.SleepyTubeUtils.log('[Badge Observer] 🎯 Starting prediction for:', videoInfo.videoId, videoInfo.title);
      
      // Show loading badge
      this.addBadge(thumbnail, { loading: true });
      
      // Get prediction
      const prediction = await this.videoPredictor.predict(videoInfo);
      
      window.SleepyTubeUtils.log('[Badge Observer] 📊 Prediction result:', {
        videoId: videoInfo.videoId,
        prediction: prediction,
        hasIssues: prediction && !prediction.safe,
        issueCount: prediction?.issues?.length || 0
      });
      
      if (!prediction) {
        window.SleepyTubeUtils.log('[Badge Observer] ❌ No prediction returned, removing badge');
        // Remove loading badge if prediction fails
        this.removeBadge(thumbnail);
        return;
      }
      
      // Remove loading badge and add result badge
      this.removeBadge(thumbnail);
      this.addBadge(thumbnail, prediction);
      
      window.SleepyTubeUtils.log('[Badge Observer] ✅ Badge added for:', videoInfo.videoId);
      
    } catch (error) {
      window.SleepyTubeUtils.logError('[Badge Observer] ❌ Failed to predict video:', error);
      this.removeBadge(cardElement.querySelector('yt-thumbnail, ytd-thumbnail'));
    }
  }
  
  /**
   * Add badge to thumbnail
   */
  addBadge(thumbnail, prediction) {
    if (!thumbnail) {
      window.SleepyTubeUtils.log('[Badge] ⚠️ No thumbnail provided');
      return;
    }
    
    window.SleepyTubeUtils.log('[Badge] 🎨 Adding badge with prediction:', prediction);
    
    // Remove existing badge
    this.removeBadge(thumbnail);
    
    const config = window.SleepyTubeConfig.get();
    const badgeConfig = window.SleepyTubeConstants.AI_PREDICTOR_CONFIG;
    
    // Create badge element
    const badge = document.createElement('div');
    badge.className = 'sleepytube-badge';
    badge.setAttribute('data-sleepytube-badge', 'true');
    
    // Add size class
    badge.classList.add(`sleepytube-badge--${config.aiPredictorBadgeSize || 'small'}`);
    
    // Add position class
    const position = config.aiPredictorBadgePosition || 'top-right';
    badge.classList.add(`sleepytube-badge--${position}`);
    
    // Get language
    const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    
    if (prediction.loading) {
      // Loading state
      badge.classList.add('sleepytube-badge--loading');
      const loadingText = lang === 'zh' ? '分析中' : 'Analyzing';
      badge.innerHTML = `
        <span class="sleepytube-badge__icon">⏳</span>
        <span class="sleepytube-badge__text">${loadingText}</span>
      `;
      window.SleepyTubeUtils.log('[Badge] 📊 Adding loading badge');
    } else if (prediction.safe) {
      // Safe (no issues) - 只显示图标，不显示文字
      badge.classList.add('sleepytube-badge--safe');
      badge.innerHTML = `
        <span class="sleepytube-badge__icon">✓</span>
      `;
      
      window.SleepyTubeUtils.log('[Badge] ✅ Adding safe badge');
      
      // Add tooltip
      this.addTooltip(thumbnail, {
        type: 'safe',
        lang: lang
      });
    } else {
      // Has issues - 显示图标+英文单词
      const issues = prediction.issues || [];
      const issueCount = issues.length;
      const severity = issueCount >= 2 ? 'danger' : 'warning';
      
      badge.classList.add(`sleepytube-badge--${severity}`);
      
      // Get language for tooltip only (badge always English)
      const lang = navigator.language.startsWith('zh') ? 'zh' : 'en';
      
      // Show up to 3 issues with icon + English text
      const displayIssues = issues.slice(0, 3);
      const badgeContent = displayIssues.map(issue => {
        const issueConfig = badgeConfig.issueTypes[issue];
        if (!issueConfig) return '';
        
        // Always use English for badge
        let shortLabel = '';
        if (issue === 'noisy') shortLabel = 'Noisy';
        else if (issue === 'loud') shortLabel = 'Loud';
        else if (issue === 'sudden') shortLabel = 'Sudden';
        
        return `<span class="sleepytube-badge__item">${issueConfig.icon}${shortLabel}</span>`;
      }).join('');
      
      badge.innerHTML = `
        <span class="sleepytube-badge__icon">${badgeContent}</span>
      `;
      
      window.SleepyTubeUtils.log(`[Badge] ⚠️ Adding ${severity} badge with ${issueCount} issues:`, prediction.issues);
      
      // Add tooltip with issues (tooltip can be in user's language)
      this.addTooltip(thumbnail, {
        type: severity,
        issues: issues,
        confidence: prediction.confidence,
        lang: lang
      });
    }
    
    // Append badge to thumbnail
    // For yt-thumbnail-view-model, find the link parent
    let parent = thumbnail.querySelector('a') || thumbnail.closest('a') || thumbnail;
    
    // If parent is yt-thumbnail-view-model itself, we need to add to it directly
    if (thumbnail.tagName === 'YT-THUMBNAIL-VIEW-MODEL') {
      parent = thumbnail;
    }
    
    if (parent.style.position !== 'relative' && parent.style.position !== 'absolute') {
      parent.style.position = 'relative';
    }
    parent.appendChild(badge);
    
    window.SleepyTubeUtils.log('[Badge] ✅ Badge appended to parent:', parent.tagName, parent.className);
  }
  
  /**
   * Remove badge from thumbnail
   */
  removeBadge(thumbnail) {
    if (!thumbnail) return;
    
    // Check multiple possible parents
    const badge = thumbnail.querySelector('[data-sleepytube-badge]');
    if (badge) {
      badge.remove();
    }
    
    const tooltip = thumbnail.querySelector('[data-sleepytube-tooltip]');
    if (tooltip) {
      tooltip.remove();
    }
  }
  
  /**
   * Add tooltip to badge
   */
  addTooltip(thumbnail, data) {
    if (!thumbnail) return;
    
    const badgeConfig = window.SleepyTubeConstants.AI_PREDICTOR_CONFIG;
    const lang = data.lang || (navigator.language.startsWith('zh') ? 'zh' : 'en');
    
    const tooltip = document.createElement('div');
    tooltip.className = 'sleepytube-tooltip';
    tooltip.setAttribute('data-sleepytube-tooltip', 'true');
    
    let content = '';
    
    if (data.type === 'safe') {
      content = `
        <div class="sleepytube-tooltip__header">✓ ${lang === 'zh' ? '音质良好' : 'Good Quality'}</div>
        <div class="sleepytube-tooltip__content">${lang === 'zh' ? '未检测到明显的音频质量问题' : 'No obvious audio quality issues detected'}</div>
      `;
    } else {
      // 只显示前3个问题
      const displayIssues = data.issues.slice(0, 3);
      const issueLabels = displayIssues.map(issue => {
        const issueConfig = badgeConfig.issueTypes[issue];
        if (!issueConfig) return '';
        
        const label = lang === 'zh' ? issueConfig.label_zh : issueConfig.label_en;
        return `
          <li class="sleepytube-tooltip__issue">
            <span class="sleepytube-tooltip__issue-icon">${issueConfig.icon}</span>
            <span class="sleepytube-tooltip__issue-text">${label}</span>
          </li>
        `;
      }).join('');
      
      const headerText = lang === 'zh' ? '检测到音频问题' : 'Audio Issues Detected';
      
      content = `
        <div class="sleepytube-tooltip__header sleepytube-tooltip__header--${data.type}">
          ⚠ ${headerText}
        </div>
        <div class="sleepytube-tooltip__content">
          <ul class="sleepytube-tooltip__issues">
            ${issueLabels}
          </ul>
        </div>
      `;
    }
    
    tooltip.innerHTML = content;
    
    // Add to thumbnail (same parent as badge)
    let parent = thumbnail.querySelector('a') || thumbnail.closest('a') || thumbnail;
    if (thumbnail.tagName === 'YT-THUMBNAIL-VIEW-MODEL') {
      parent = thumbnail;
    }
    parent.appendChild(tooltip);
    
    // Show/hide tooltip on hover
    const badge = parent.querySelector('[data-sleepytube-badge]');
    if (badge) {
      badge.addEventListener('mouseenter', () => {
        tooltip.classList.add('sleepytube-tooltip--visible');
      });
      
      badge.addEventListener('mouseleave', () => {
        tooltip.classList.remove('sleepytube-tooltip--visible');
      });
    }
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.videoObserver) {
      this.videoObserver.disconnect();
      this.videoObserver = null;
    }
    
    if (this.videoBadgeObserver) {
      this.videoBadgeObserver.disconnect();
      this.videoBadgeObserver = null;
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

// Verify dependencies before initialization
(function verifyDependencies() {
  const required = {
    'SleepyTubeUtils': window.SleepyTubeUtils,
    'SleepyTubeConfig': window.SleepyTubeConfig,
    'AudioEngine': window.AudioEngine,
    'MiniWaveform': window.MiniWaveform,
    'GlobalHeatmap': window.GlobalHeatmap,
    'UIManager': window.UIManager,
    'VideoPredictor': window.VideoPredictor
  };
  
  const missing = [];
  const present = [];
  
  for (const [name, obj] of Object.entries(required)) {
    if (typeof obj === 'undefined') {
      missing.push(name);
      console.error(`[SleepyTube] ❌ Missing dependency: ${name}`);
    } else {
      present.push(name);
    }
  }
  
  if (missing.length > 0) {
    console.error('[SleepyTube] ⚠️ CRITICAL: Missing dependencies:', missing);
    console.error('[SleepyTube] Extension will not function correctly!');
    console.log('[SleepyTube] Present dependencies:', present);
    return false;
  } else {
    console.log('[SleepyTube] ✓ All dependencies loaded:', present.length);
    return true;
  }
})();

// Initialize and start the controller (only once)
(function initSleepyTube() {
  try {
    console.log('[SleepyTube] Starting initialization...');
    
    // Check if already initialized (must be an instance, not just defined)
    if (window.SleepyTubeController && typeof window.SleepyTubeController === 'object') {
      console.log('[SleepyTube] Controller already initialized (instance exists), skipping');
      return;
    }
    
    // Check if SleepyTubeController class is defined
    if (typeof SleepyTubeController === 'undefined') {
      console.error('[SleepyTube] ❌ FATAL: SleepyTubeController class not defined!');
      console.error('[SleepyTube] This means main.js did not load correctly.');
      return;
    }
    
    console.log('[SleepyTube] Creating controller instance...');
    
    // Create controller instance
    const controller = new SleepyTubeController();
    window.SleepyTubeController = controller;
    
    console.log('[SleepyTube] Controller instance created:', controller);
    console.log('[SleepyTube] Calling init()...');
    
    // Initialize
    controller.init();
    
    console.log('[SleepyTube] ✅ SleepyTube initialized successfully! 🚀');
    console.log('[SleepyTube] Controller:', window.SleepyTubeController);
    
  } catch (error) {
    console.error('[SleepyTube] ❌ Initialization failed with error:', error);
    console.error('[SleepyTube] Error stack:', error.stack);
  }
})();
