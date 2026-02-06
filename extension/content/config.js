/**
 * Configuration management for SleepyTube
 */

// Default configuration values
const DEFAULT_CONFIG = {
  // Sleep Mode state
  sleepModeEnabled: false,
  
  // Audio processing settings
  compressionStrength: 'medium',  // 'light' | 'medium' | 'strong'
  targetLoudness: -18,            // LUFS target
  outputGain: 0,                  // Manual gain adjustment (dB)
  
  // EQ settings
  eqPreset: 'gentle',             // 'natural' | 'gentle' | 'ultra-soft'
  voiceFocusEnabled: true,
  duckingAmount: 9,               // dB (0-12)
  
  // Advanced settings
  autoGainEnabled: true,
  limiterEnabled: true,
  
  // UI preferences
  showOnboarding: true
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
  AGC_CONFIG
};
