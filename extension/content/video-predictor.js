/**
 * SleepyTube - AI Video Audio Quality Predictor
 * Predicts potential audio issues in YouTube videos using AI
 */

class VideoPredictor {
  constructor() {
    this.cache = new Map(); // 缓存预测结果
    this.apiKey = '';
    this.apiProvider = 'gemini'; // 'gemini' or 'openai'
    this.isEnabled = false;
    this.configLoaded = false;
    
    // 监听配置变化
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName === 'sync' && (
        changes.aiPredictorEnabled ||
        changes.aiPredictorProvider ||
        changes.aiPredictorApiKey
      )) {
        console.log('[VideoPredictor] Config changed, reloading...');
        this.loadConfig();
      }
    });
  }

  /**
   * 加载配置
   */
  async loadConfig() {
    try {
      console.log('[VideoPredictor] Loading config...');
      
      // First try to load from sync storage (new format from onboarding)
      const syncResult = await chrome.storage.sync.get([
        'aiPredictorEnabled',
        'aiPredictorProvider', 
        'aiPredictorApiKey'
      ]);
      
      console.log('[VideoPredictor] Sync storage result:', syncResult);
      
      if (syncResult.aiPredictorEnabled !== undefined) {
        this.isEnabled = syncResult.aiPredictorEnabled || false;
        this.apiProvider = syncResult.aiPredictorProvider || 'gemini';
        this.apiKey = syncResult.aiPredictorApiKey || '';
        this.configLoaded = true;
        
        console.log('[VideoPredictor] ✅ Loaded config from sync:', {
          enabled: this.isEnabled,
          provider: this.apiProvider,
          hasKey: !!this.apiKey,
          keyLength: this.apiKey.length
        });
        return;
      }
      
      // Fallback to local storage (old format)
      const localResult = await chrome.storage.local.get(['aiPredictorConfig']);
      if (localResult.aiPredictorConfig) {
        this.apiKey = localResult.aiPredictorConfig.apiKey || '';
        this.apiProvider = localResult.aiPredictorConfig.provider || 'gemini';
        this.isEnabled = localResult.aiPredictorConfig.enabled || false;
        this.configLoaded = true;
        
        console.log('[VideoPredictor] ✅ Loaded config from local:', {
          enabled: this.isEnabled,
          provider: this.apiProvider,
          hasKey: !!this.apiKey
        });
      } else {
        console.log('[VideoPredictor] ⚠️ No config found in storage');
        this.configLoaded = true;
      }
    } catch (error) {
      console.error('[VideoPredictor] ❌ Failed to load config:', error);
      this.configLoaded = true;
    }
  }

  /**
   * 保存配置
   */
  async saveConfig(config) {
    try {
      await chrome.storage.local.set({
        aiPredictorConfig: {
          apiKey: config.apiKey || this.apiKey,
          provider: config.provider || this.apiProvider,
          enabled: config.enabled !== undefined ? config.enabled : this.isEnabled
        }
      });
      
      this.apiKey = config.apiKey || this.apiKey;
      this.apiProvider = config.provider || this.apiProvider;
      this.isEnabled = config.enabled !== undefined ? config.enabled : this.isEnabled;
      
      return true;
    } catch (error) {
      console.error('[VideoPredictor] Failed to save config:', error);
      return false;
    }
  }

  /**
   * 提取标题 - 支持新旧布局
   */
  extractTitle(element) {
    const selectors = [
      // 新布局 (yt-lockup-view-model)
      '.yt-lockup-metadata-view-model__title .yt-core-attributed-string',
      'a.yt-lockup-metadata-view-model__title span',
      
      // 标准布局
      '#video-title',
      'yt-formatted-string#video-title',
      '#video-title-link',
      
      // 旧布局
      'h3 a',
      '.yt-lockup-metadata-view-model__title',
      
      // Fallback
      'a[href*="/watch"]'
    ];
    
    for (const selector of selectors) {
      const el = element.querySelector(selector);
      if (el) {
        const title = el.textContent?.trim() || el.getAttribute('title') || el.getAttribute('aria-label') || '';
        if (title && title.length > 3) return title;
      }
    }
    
    return '';
  }
  
  /**
   * 提取频道名 - 支持新旧布局
   */
  extractChannel(element) {
    const selectors = [
      // 新布局 (yt-lockup-view-model)
      '.yt-content-metadata-view-model__metadata-text a.yt-core-attributed-string__link',
      'a[href*="/@"]',
      
      // 标准布局
      'ytd-channel-name a',
      '#channel-name a',
      'yt-formatted-string.ytd-channel-name',
      
      // 旧布局
      '.yt-content-metadata-view-model__metadata-text'
    ];
    
    for (const selector of selectors) {
      const el = element.querySelector(selector);
      if (el) {
        const channel = el.textContent?.trim() || '';
        if (channel && channel.length > 0) return channel;
      }
    }
    
    return '';
  }
  
  /**
   * 提取视频信息
   */
  extractVideoInfo(element) {
    const videoId = this.extractVideoId(element);
    if (!videoId) {
      console.log('[VideoPredictor] ⚠️ No videoId found for element:', element);
      return null;
    }

    // 提取缩略图
    const thumbnail = element.querySelector('img')?.src || '';
    
    // 提取标题
    const title = this.extractTitle(element);
    
    // 提取频道名
    const channel = this.extractChannel(element);
    
    // 提取时长
    const durationSelectors = [
      '.yt-badge-shape__text',                                    // 新布局
      '.ytd-thumbnail-overlay-time-status-renderer span',
      'span.style-scope.ytd-thumbnail-overlay-time-status-renderer'
    ];
    
    let duration = '';
    for (const selector of durationSelectors) {
      const el = element.querySelector(selector);
      if (el) {
        duration = el.textContent?.trim() || '';
        if (duration) break;
      }
    }

    console.log('[VideoPredictor] Extracted info:', {
      videoId,
      title: title.substring(0, 50),
      channel,
      duration,
      hasThumbnail: !!thumbnail
    });

    return {
      videoId,
      thumbnail,
      title,
      channel,
      duration
    };
  }

  /**
   * 提取视频ID
   */
  extractVideoId(element) {
    // 从链接中提取
    const link = element.querySelector('a[href*="/watch?v="]');
    if (link) {
      const match = link.href.match(/v=([^&]+)/);
      if (match) return match[1];
    }
    
    // 从 content-id 属性中提取
    const contentId = element.className.match(/content-id-([a-zA-Z0-9_-]+)/);
    if (contentId) return contentId[1];
    
    return null;
  }

  /**
   * 检查缓存
   */
  getCachedPrediction(videoId) {
    const cached = this.cache.get(videoId);
    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) { // 24小时有效
      return cached.prediction;
    }
    return null;
  }

  /**
   * 使用 Gemini API 预测（通过 Background Script）
   */
  async predictWithGemini(videoInfo) {
    console.log('[VideoPredictor] Sending prediction request to background (Gemini)');
    
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'AI_PREDICT',
        provider: 'gemini',
        apiKey: this.apiKey,
        videoInfo: videoInfo
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[VideoPredictor] Message error:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (response && response.success) {
          console.log('[VideoPredictor] ✅ Received prediction from background:', response.prediction);
          resolve(response.prediction);
        } else {
          console.error('[VideoPredictor] ❌ Prediction failed:', response?.error);
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    });
  }

  /**
   * 使用 OpenAI API 预测（通过 Background Script）
   */
  async predictWithOpenAI(videoInfo) {
    console.log('[VideoPredictor] Sending prediction request to background (OpenAI)');
    
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        type: 'AI_PREDICT',
        provider: 'openai',
        apiKey: this.apiKey,
        videoInfo: videoInfo
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('[VideoPredictor] Message error:', chrome.runtime.lastError);
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        
        if (response && response.success) {
          console.log('[VideoPredictor] ✅ Received prediction from background:', response.prediction);
          resolve(response.prediction);
        } else {
          console.error('[VideoPredictor] ❌ Prediction failed:', response?.error);
          reject(new Error(response?.error || 'Unknown error'));
        }
      });
    });
  }

  /**
   * 预测视频音频质量
   */
  async predict(videoInfo) {
    console.log('[VideoPredictor] predict() called with:', videoInfo);
    console.log('[VideoPredictor] Current state:', {
      isEnabled: this.isEnabled,
      hasApiKey: !!this.apiKey,
      provider: this.apiProvider
    });
    
    if (!this.isEnabled) {
      console.log('[VideoPredictor] AI prediction is disabled');
      return null;
    }
    
    if (!this.apiKey) {
      console.log('[VideoPredictor] No API key configured');
      return null;
    }

    const { videoId } = videoInfo;

    // 检查缓存
    const cached = this.getCachedPrediction(videoId);
    if (cached) {
      console.log('[VideoPredictor] Using cached prediction for:', videoId);
      return cached;
    }

    try {
      console.log('[VideoPredictor] Making API prediction for:', videoId);
      let prediction;
      
      if (this.apiProvider === 'gemini') {
        prediction = await this.predictWithGemini(videoInfo);
      } else {
        prediction = await this.predictWithOpenAI(videoInfo);
      }

      // 缓存结果
      this.cache.set(videoId, {
        prediction,
        timestamp: Date.now()
      });

      console.log('[VideoPredictor] ✅ Prediction for', videoId, ':', JSON.stringify(prediction, null, 2));
      return prediction;
    } catch (error) {
      console.error('[VideoPredictor] Prediction failed for', videoId, ':', error);
      return null;
    }
  }

  /**
   * 清除缓存
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([videoId, data]) => ({
        videoId,
        timestamp: data.timestamp,
        prediction: data.prediction
      }))
    };
  }
}

// 导出单例
if (typeof window !== 'undefined') {
  window.VideoPredictor = VideoPredictor;
}
