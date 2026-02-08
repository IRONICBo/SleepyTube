/**
 * Configuration management for SleepyTube
 */

// Default configuration values
const DEFAULT_CONFIG = {
  // Sleep Mode state
  sleepModeEnabled: false,
  currentScene: 'off',  // 'off' | 'sleep' | 'podcast' | 'movie' | 'custom'
  
  // Audio processing settings
  compressionStrength: 'medium',  // 'light' | 'medium' | 'strong'
  targetLoudness: -18,            // LUFS target
  outputGain: 0,                  // Manual gain adjustment (dB)
  
  // EQ settings
  eqPreset: 'gentle',             // 'natural' | 'gentle' | 'ultra-soft'
  voiceFocusEnabled: false,
  duckingAmount: 9,               // dB (0-12)
  
  // Advanced settings
  autoGainEnabled: true,
  limiterEnabled: true,
  
  // Speech rate settings
  speechRateEnabled: false,       // Enable speech rate detection
  targetSpeechRate: 'normal',     // 'slow' | 'normal' | 'fast' | 'auto'
  speechRateAdjustment: 1.0,      // Playback rate multiplier (0.5-2.0)
  
  // AI video predictor settings
  aiPredictorEnabled: false,      // Enable AI-based video quality prediction
  aiPredictorProvider: 'gemini',  // 'gemini' | 'openai'
  aiPredictorApiKey: '',          // API key for the selected provider
  aiPredictorShowBadges: true,    // Show warning badges on video thumbnails
  
  // UI preferences
  showOnboarding: true,
  miniWaveformEnabled: true
};

// Compression presets
const COMPRESSION_PRESETS = {
  light: {
    threshold: -30,   // dB
    knee: 6,          // dB
    ratio: 3,         // 3:1
    attack: 0.006,    // 6ms
    release: 0.25     // 250ms
  },
  medium: {
    threshold: -24,
    knee: 6,
    ratio: 4,
    attack: 0.005,    // 5ms
    release: 0.15     // 150ms
  },
  strong: {
    threshold: -18,
    knee: 4,
    ratio: 6,
    attack: 0.003,    // 3ms
    release: 0.20     // 200ms
  }
};

// EQ presets
const EQ_PRESETS = {
  natural: {
    highShelfGain: 0,      // dB (no attenuation)
    highShelfFreq: 8000,   // Hz
    lowShelfGain: 0,       // dB (no boost/cut)
    lowShelfFreq: 80       // Hz
  },
  gentle: {
    highShelfGain: -3,     // dB (reduce high frequencies)
    highShelfFreq: 8000,   // Hz
    lowShelfGain: -2,      // dB (reduce low rumble)
    lowShelfFreq: 80       // Hz
  },
  'ultra-soft': {
    highShelfGain: -6,     // dB (strong high freq reduction)
    highShelfFreq: 6000,   // Hz (lower cutoff)
    lowShelfGain: -4,      // dB (strong bass reduction)
    lowShelfFreq: 100      // Hz
  }
};

// Voice focus configuration
const VOICE_FOCUS_CONFIG = {
  lowBandFreq: 250,      // Hz (low band cutoff)
  midBandLow: 300,       // Hz (mid band lower bound)
  midBandHigh: 3400,     // Hz (mid band upper bound)
  highBandFreq: 3400,    // Hz (high band cutoff)
  maxDuckingDb: 12,      // Maximum ducking amount
  speechThreshold: 0.02, // Linear amplitude threshold for speech detection
  speechRange: 0.10      // Range for speech presence calculation
};

// Limiter configuration (brickwall protection)
const LIMITER_CONFIG = {
  threshold: -1.0,    // dBFS
  knee: 0.0,          // Hard knee
  ratio: 20.0,        // Near-infinite ratio
  attack: 0.002,      // 2ms
  release: 0.05       // 50ms
};

// AGC configuration
const AGC_CONFIG = {
  targetLoudness: -18,  // LUFS
  attackTimeMs: 80,     // Slow gain increase
  releaseTimeMs: 250,   // Moderate gain decrease
  maxGainDb: 18,        // Maximum boost
  minGainDb: -18,       // Maximum cut
  updateRate: 60        // Updates per second
};

// Speech rate configuration
const SPEECH_RATE_CONFIG = {
  // Detection parameters
  frameSize: 2048,           // Analysis frame size
  hopLength: 512,            // Hop length for analysis
  energyThreshold: 0.01,     // Energy threshold for syllable detection
  zcrThreshold: 0.1,         // Zero-crossing rate threshold
  smoothingWindow: 5,        // Frames for smoothing
  
  // Speech rate standards (syllables per second)
  standards: {
    very_slow: 2.0,      // < 2.0 syllables/sec
    slow: 2.5,           // 2.0-3.0 syllables/sec
    normal: 3.5,         // 3.0-4.0 syllables/sec
    fast: 4.5,           // 4.0-5.0 syllables/sec
    very_fast: 5.5       // > 5.0 syllables/sec
  },
  
  // Playback rate adjustment limits
  minPlaybackRate: 0.5,   // Minimum 0.5x speed
  maxPlaybackRate: 1.5,   // Maximum 1.5x speed (avoid chipmunk effect)
  
  // Target rates for adjustment
  targets: {
    slow: 2.5,      // syllables/sec
    normal: 3.5,    // syllables/sec
    fast: 4.5,      // syllables/sec
    auto: 3.5       // default to normal
  }
};

// AI Video Predictor configuration
const AI_PREDICTOR_CONFIG = {
  // Issue types - 简化为三种主要问题
  issueTypes: {
    noisy: {
      label_zh: '可能有噪音',
      label_en: 'May have noise',
      icon: '🔊',
      color: '#FF9800'
    },
    loud: {
      label_zh: '可能声音大',
      label_en: 'May be loud',
      icon: '📢',
      color: '#F44336'
    },
    sudden: {
      label_zh: '可能有突发声音',
      label_en: 'May have sudden sounds',
      icon: '⚡',
      color: '#FFC107'
    }
  },
  
  // Badge显示设置
  badgePosition: 'top-right',  // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
  badgeSize: 'small',          // 'small' | 'medium' | 'large'
  
  // API配置
  gemini: {
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
    freeQuota: 60,  // 每分钟请求数 (免费版)
    model: 'gemini-pro'
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-3.5-turbo',
    maxTokens: 256
  },
  
  // 缓存配置
  cacheExpiration: 24 * 60 * 60 * 1000,  // 24小时
  maxCacheSize: 1000  // 最多缓存1000个预测结果
};

/**
 * Configuration manager class
 */
class ConfigManager {
  constructor() {
    this.config = { ...DEFAULT_CONFIG };
    this.listeners = [];
  }
  
  /**
   * Load configuration from chrome.storage
   */
  async load() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(DEFAULT_CONFIG, (stored) => {
        this.config = { ...DEFAULT_CONFIG, ...stored };
        this.notifyListeners();
        resolve(this.config);
      });
    });
  }
  
  /**
   * Save configuration to chrome.storage
   */
  async save(updates) {
    return new Promise((resolve) => {
      const newConfig = { ...this.config, ...updates };
      chrome.storage.sync.set(newConfig, () => {
        this.config = newConfig;
        this.notifyListeners();
        resolve(this.config);
      });
    });
  }
  
  /**
   * Get current configuration
   */
  get() {
    return { ...this.config };
  }
  
  /**
   * Get specific configuration value
   */
  getValue(key) {
    return this.config[key];
  }
  
  /**
   * Update specific configuration value
   */
  async setValue(key, value) {
    return this.save({ [key]: value });
  }
  
  /**
   * Get compression preset parameters
   */
  getCompressionPreset() {
    const strength = this.config.compressionStrength;
    return COMPRESSION_PRESETS[strength] || COMPRESSION_PRESETS.medium;
  }
  
  /**
   * Get EQ preset parameters
   */
  getEqPreset() {
    const preset = this.config.eqPreset;
    return EQ_PRESETS[preset] || EQ_PRESETS.gentle;
  }
  
  /**
   * Listen for configuration changes
   */
  onChange(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }
  
  /**
   * Notify all listeners of configuration changes
   */
  notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback(this.config);
      } catch (error) {
        window.SleepyTubeUtils.logError('Config listener error:', error);
      }
    });
  }
}

// Create global config manager instance
window.SleepyTubeConfig = new ConfigManager();

// Listen for storage changes from other tabs or popup
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    const updates = {};
    for (const key in changes) {
      updates[key] = changes[key].newValue;
    }
    window.SleepyTubeConfig.config = { ...window.SleepyTubeConfig.config, ...updates };
    window.SleepyTubeConfig.notifyListeners();
  }
});

// Export constants
window.SleepyTubeConstants = {
  DEFAULT_CONFIG,
  COMPRESSION_PRESETS,
  EQ_PRESETS,
  VOICE_FOCUS_CONFIG,
  LIMITER_CONFIG,
  AGC_CONFIG,
  SPEECH_RATE_CONFIG,
  AI_PREDICTOR_CONFIG
};
