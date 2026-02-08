/**
 * Speech Rate Detection and Adjustment Module
 * Uses energy-based syllable detection to estimate speech rate
 */

class SpeechRateDetector {
  constructor(audioContext, analyserNode) {
    this.ac = audioContext;
    this.analyser = analyserNode;
    this.config = window.SleepyTubeConstants.SPEECH_RATE_CONFIG;
    
    // Analysis buffers
    this.timeDataBuffer = new Float32Array(this.analyser.fftSize);
    this.energyHistory = [];
    this.maxHistoryLength = 300; // 5 seconds at 60fps
    
    // Detection state
    this.currentRate = 0;
    this.rateCategory = 'normal';
    this.isRunning = false;
    this.animationFrameId = null;
    
    // Syllable detection
    this.lastSyllableTime = 0;
    this.syllableIntervals = [];
    this.maxIntervals = 20;
    
    this.tick = this.tick.bind(this);
  }
  
  /**
   * Start speech rate detection
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.energyHistory = [];
    this.syllableIntervals = [];
    this.tick();
  }
  
  /**
   * Stop speech rate detection
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Main detection loop
   */
  tick() {
    if (!this.isRunning) return;
    
    // Get time domain data
    this.analyser.getFloatTimeDomainData(this.timeDataBuffer);
    
    // Calculate short-term energy
    const energy = this.calculateEnergy(this.timeDataBuffer);
    
    // Calculate zero-crossing rate
    const zcr = this.calculateZCR(this.timeDataBuffer);
    
    // Add to history
    this.energyHistory.push({ energy, zcr, time: Date.now() });
    if (this.energyHistory.length > this.maxHistoryLength) {
      this.energyHistory.shift();
    }
    
    // Detect syllables (high energy + low ZCR = vowel)
    this.detectSyllables();
    
    // Calculate speech rate
    this.calculateSpeechRate();
    
    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.tick);
  }
  
  /**
   * Calculate energy of audio frame
   */
  calculateEnergy(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }
  
  /**
   * Calculate zero-crossing rate
   */
  calculateZCR(buffer) {
    let crossings = 0;
    for (let i = 1; i < buffer.length; i++) {
      if ((buffer[i] >= 0 && buffer[i - 1] < 0) || 
          (buffer[i] < 0 && buffer[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / buffer.length;
  }
  
  /**
   * Detect syllables based on energy and ZCR
   */
  detectSyllables() {
    if (this.energyHistory.length < 10) return;
    
    // Get recent frames
    const recentFrames = this.energyHistory.slice(-10);
    
    // Calculate average energy
    const avgEnergy = recentFrames.reduce((sum, f) => sum + f.energy, 0) / recentFrames.length;
    
    // Get current frame
    const current = this.energyHistory[this.energyHistory.length - 1];
    
    // Detect syllable peak (high energy, low ZCR)
    const energyThreshold = Math.max(this.config.energyThreshold, avgEnergy * 1.2);
    const isSyllable = current.energy > energyThreshold && 
                      current.zcr < this.config.zcrThreshold;
    
    // Avoid detecting same syllable multiple times
    const timeSinceLastSyllable = current.time - this.lastSyllableTime;
    const minSyllableGap = 100; // ms
    
    if (isSyllable && timeSinceLastSyllable > minSyllableGap) {
      // Record syllable interval
      if (this.lastSyllableTime > 0) {
        this.syllableIntervals.push(timeSinceLastSyllable);
        if (this.syllableIntervals.length > this.maxIntervals) {
          this.syllableIntervals.shift();
        }
      }
      this.lastSyllableTime = current.time;
    }
  }
  
  /**
   * Calculate current speech rate
   */
  calculateSpeechRate() {
    if (this.syllableIntervals.length < 5) {
      this.currentRate = 0;
      this.rateCategory = 'unknown';
      return;
    }
    
    // Calculate average syllable interval
    const avgInterval = this.syllableIntervals.reduce((a, b) => a + b, 0) / 
                       this.syllableIntervals.length;
    
    // Convert to syllables per second
    const syllablesPerSecond = 1000 / avgInterval;
    this.currentRate = syllablesPerSecond;
    
    // Categorize rate
    const standards = this.config.standards;
    if (syllablesPerSecond < standards.very_slow) {
      this.rateCategory = 'very_slow';
    } else if (syllablesPerSecond < standards.slow) {
      this.rateCategory = 'slow';
    } else if (syllablesPerSecond < standards.normal) {
      this.rateCategory = 'normal';
    } else if (syllablesPerSecond < standards.fast) {
      this.rateCategory = 'fast';
    } else {
      this.rateCategory = 'very_fast';
    }
  }
  
  /**
   * Get current speech rate info
   */
  getRate() {
    return {
      syllablesPerSecond: this.currentRate,
      category: this.rateCategory,
      confidence: Math.min(this.syllableIntervals.length / this.maxIntervals, 1.0)
    };
  }
  
  /**
   * Calculate recommended playback rate adjustment
   */
  calculateAdjustment(targetRate = 'auto') {
    if (this.currentRate === 0) {
      return 1.0; // No adjustment if no speech detected
    }
    
    // Get target syllables per second
    const targets = this.config.targets;
    const targetSyllables = targets[targetRate] || targets.auto;
    
    // Calculate required adjustment
    let adjustment = this.currentRate / targetSyllables;
    
    // Clamp to safe limits
    adjustment = Math.max(this.config.minPlaybackRate, adjustment);
    adjustment = Math.min(this.config.maxPlaybackRate, adjustment);
    
    // Only adjust if difference is significant (> 10%)
    if (Math.abs(adjustment - 1.0) < 0.1) {
      return 1.0;
    }
    
    return adjustment;
  }
}

/**
 * Speech Rate Controller
 * Applies playback rate adjustments to video element
 */
class SpeechRateController {
  constructor(videoElement, detector) {
    this.video = videoElement;
    this.detector = detector;
    this.isEnabled = false;
    this.targetRate = 'auto';
    this.currentAdjustment = 1.0;
    this.originalPlaybackRate = 1.0;
    
    // Smoothing
    this.updateInterval = null;
    this.updateFrequency = 2000; // Update every 2 seconds
  }
  
  /**
   * Enable speech rate adjustment
   */
  enable(targetRate = 'auto') {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.targetRate = targetRate;
    this.originalPlaybackRate = this.video.playbackRate;
    
    // Start periodic updates
    this.updateInterval = setInterval(() => {
      this.updatePlaybackRate();
    }, this.updateFrequency);
    
    window.SleepyTubeUtils.log('Speech rate adjustment enabled:', targetRate);
  }
  
  /**
   * Disable speech rate adjustment
   */
  disable() {
    if (!this.isEnabled) return;
    
    this.isEnabled = false;
    
    // Stop updates
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Restore original playback rate
    this.video.playbackRate = this.originalPlaybackRate;
    this.currentAdjustment = 1.0;
    
    window.SleepyTubeUtils.log('Speech rate adjustment disabled');
  }
  
  /**
   * Update playback rate based on detected speech rate
   */
  updatePlaybackRate() {
    if (!this.isEnabled) return;
    
    // Get recommended adjustment
    const newAdjustment = this.detector.calculateAdjustment(this.targetRate);
    
    // Smooth transition (avoid sudden changes)
    const maxChange = 0.05; // Maximum 5% change per update
    const diff = newAdjustment - this.currentAdjustment;
    const change = Math.max(-maxChange, Math.min(maxChange, diff));
    
    this.currentAdjustment += change;
    
    // Apply to video
    this.video.playbackRate = this.currentAdjustment * this.originalPlaybackRate;
    
    const rate = this.detector.getRate();
    window.SleepyTubeUtils.log('Speech rate update:', {
      detected: rate.syllablesPerSecond.toFixed(2) + ' syl/s',
      category: rate.category,
      confidence: (rate.confidence * 100).toFixed(0) + '%',
      playbackRate: this.video.playbackRate.toFixed(2) + 'x'
    });
  }
  
  /**
   * Set target speech rate
   */
  setTargetRate(targetRate) {
    this.targetRate = targetRate;
    if (this.isEnabled) {
      this.updatePlaybackRate();
    }
  }
  
  /**
   * Get current status
   */
  getStatus() {
    const rate = this.detector.getRate();
    return {
      enabled: this.isEnabled,
      detected: rate,
      adjustment: this.currentAdjustment,
      playbackRate: this.video.playbackRate
    };
  }
}

// Export
window.SpeechRateDetector = SpeechRateDetector;
window.SpeechRateController = SpeechRateController;
