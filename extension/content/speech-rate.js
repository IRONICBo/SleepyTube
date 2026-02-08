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
 * Enhanced Speech Rate Controller with UI Feedback
 * Respects user manual speed changes and provides clear visual feedback
 */
class SpeechRateController {
  constructor(videoElement, detector) {
    this.video = videoElement;
    this.detector = detector;
    this.isEnabled = false;
    this.targetRate = 'auto';
    this.currentAdjustment = 1.0;
    this.originalPlaybackRate = 1.0;
    
    // User control
    this.userManuallySet = false;
    this.lastUserSetTime = 0;
    this.isPaused = false;
    
    // UI elements
    this.indicator = null;
    
    // Update control
    this.updateInterval = null;
    this.updateFrequency = 2000;
    this.isUpdating = false;
    
    // Listen for user manual speed changes
    this.video.addEventListener('ratechange', () => {
      if (!this.isUpdating) {
        this.onUserManualChange();
      }
    });
  }
  
  /**
   * User manually changed playback speed
   */
  onUserManualChange() {
    this.userManuallySet = true;
    this.lastUserSetTime = Date.now();
    this.originalPlaybackRate = this.video.playbackRate;
    
    // Don't show notification - status shown in popup instead
    // this.showNotification(
    //   '⚠️ Manual Speed',
    //   'Auto-adjustment paused for 30s',
    //   'warning'
    // );
    
    window.SleepyTubeUtils.log('User manually set speed to', this.video.playbackRate);
  }
  
  /**
   * Enable speech rate adjustment
   */
  enable(targetRate = 'auto') {
    if (this.isEnabled) return;
    
    this.isEnabled = true;
    this.targetRate = targetRate;
    this.originalPlaybackRate = this.video.playbackRate;
    
    // Don't create UI indicator - status shown in popup instead
    // this.createIndicator();
    
    // Start updates
    this.updateInterval = setInterval(() => {
      this.updatePlaybackRate();
    }, this.updateFrequency);
    
    // Don't show notification - status shown in popup instead
    // this.showNotification(
    //   '✅ Speech Rate Active',
    //   `Target: ${targetRate}`,
    //   'success'
    // );
    
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
    
    // Restore original speed
    this.isUpdating = true;
    this.video.playbackRate = this.originalPlaybackRate;
    this.isUpdating = false;
    this.currentAdjustment = 1.0;
    
    // Remove UI (if exists)
    if (this.indicator) {
      this.indicator.remove();
      this.indicator = null;
    }
    
    // Don't show notification - status shown in popup instead
    // this.showNotification(
    //   'ℹ️ Speech Rate Disabled',
    //   'Speed restored',
    //   'info'
    // );
    
    window.SleepyTubeUtils.log('Speech rate adjustment disabled');
  }
  
  /**
   * Update playback rate based on detected speech rate
   */
  updatePlaybackRate() {
    if (!this.isEnabled || this.isPaused) return;
    
    // Respect user manual settings (30 second grace period)
    const timeSinceUserSet = Date.now() - this.lastUserSetTime;
    if (this.userManuallySet && timeSinceUserSet < 30000) {
      // this.updateIndicatorUI('paused');
      return;
    }
    
    // Reset user manual flag after grace period
    if (timeSinceUserSet >= 30000) {
      this.userManuallySet = false;
    }
    
    // Get recommended adjustment
    const newAdjustment = this.detector.calculateAdjustment(this.targetRate);
    
    // Check if significant change
    const diff = Math.abs(newAdjustment - this.currentAdjustment);
    
    // Don't show notification - just log
    if (diff > 0.1) {
      window.SleepyTubeUtils.log(`Speed adjusting: ${this.currentAdjustment.toFixed(2)}x → ${newAdjustment.toFixed(2)}x`);
    }
    
    // Smooth transition
    const maxChange = 0.05;
    const change = Math.max(-maxChange, Math.min(maxChange, newAdjustment - this.currentAdjustment));
    this.currentAdjustment += change;
    
    // Apply to video
    this.isUpdating = true;
    this.video.playbackRate = this.currentAdjustment * this.originalPlaybackRate;
    this.isUpdating = false;
    
    // Don't update UI indicator - status shown in popup instead
    // this.updateIndicatorUI('active');
    
    const rate = this.detector.getRate();
    window.SleepyTubeUtils.log('Speech rate update:', {
      detected: rate.syllablesPerSecond.toFixed(2) + ' syl/s',
      category: rate.category,
      confidence: (rate.confidence * 100).toFixed(0) + '%',
      playbackRate: this.video.playbackRate.toFixed(2) + 'x'
    });
  }
  
  /**
   * Create floating indicator
   */
  createIndicator() {
    // Check if already exists
    if (document.getElementById('st-rate-indicator')) {
      this.indicator = document.getElementById('st-rate-indicator');
      return;
    }
    
    const indicator = document.createElement('div');
    indicator.id = 'st-rate-indicator';
    indicator.innerHTML = `
      <div class="st-rate-panel">
        <div class="st-rate-header">
          <span>🎙️ Speech Rate</span>
          <button class="st-rate-minimize" title="Minimize">−</button>
          <button class="st-rate-close" title="Close">×</button>
        </div>
        <div class="st-rate-body">
          <div class="st-rate-row">
            <span class="st-rate-label">Detected:</span>
            <span class="st-rate-value" id="st-detected">—</span>
          </div>
          <div class="st-rate-row">
            <span class="st-rate-label">Speed:</span>
            <span class="st-rate-value st-speed-highlight" id="st-speed">1.0x</span>
          </div>
          <div class="st-rate-row">
            <span class="st-rate-label">Target:</span>
            <span class="st-rate-value" id="st-target">Normal</span>
          </div>
          <div class="st-rate-row">
            <span class="st-rate-label">Status:</span>
            <span class="st-rate-status" id="st-status">Active</span>
          </div>
        </div>
        <div class="st-rate-footer">
          <button class="st-rate-btn" id="st-rate-toggle">⏸ Pause</button>
        </div>
      </div>
    `;
    
    // Add CSS
    if (!document.getElementById('st-rate-styles')) {
      const style = document.createElement('style');
      style.id = 'st-rate-styles';
      style.textContent = `
        .st-rate-panel {
          position: fixed;
          top: 80px;
          right: 20px;
          background: rgba(0, 0, 0, 0.95);
          border: 2px solid #4CAF50;
          border-radius: 8px;
          padding: 12px;
          color: white;
          font-family: 'Roboto', 'YouTube Sans', sans-serif;
          font-size: 13px;
          z-index: 9999;
          min-width: 220px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }
        
        .st-rate-panel.minimized .st-rate-body,
        .st-rate-panel.minimized .st-rate-footer {
          display: none;
        }
        
        .st-rate-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
        
        .st-rate-close,
        .st-rate-minimize {
          background: none;
          border: none;
          color: #999;
          font-size: 18px;
          cursor: pointer;
          padding: 0 4px;
          width: 24px;
          height: 24px;
          line-height: 1;
        }
        
        .st-rate-close:hover {
          color: #f44336;
        }
        
        .st-rate-minimize:hover {
          color: #fff;
        }
        
        .st-rate-row {
          display: flex;
          justify-content: space-between;
          margin: 8px 0;
          align-items: center;
        }
        
        .st-rate-label {
          color: #999;
          font-size: 12px;
        }
        
        .st-rate-value {
          color: #4CAF50;
          font-weight: 600;
          font-size: 13px;
        }
        
        .st-speed-highlight {
          font-size: 16px;
          padding: 2px 8px;
          background: rgba(76, 175, 80, 0.2);
          border-radius: 4px;
        }
        
        .st-rate-status {
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .st-rate-status.active {
          background: rgba(76, 175, 80, 0.3);
          color: #4CAF50;
        }
        
        .st-rate-status.paused {
          background: rgba(255, 152, 0, 0.3);
          color: #FF9800;
        }
        
        .st-rate-footer {
          margin-top: 10px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .st-rate-btn {
          width: 100%;
          background: #333;
          border: 1px solid #555;
          color: white;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          transition: all 0.2s;
        }
        
        .st-rate-btn:hover {
          background: #444;
          border-color: #4CAF50;
        }
        
        /* Notification styles */
        .st-notif {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.9);
          border-left: 4px solid #4CAF50;
          border-radius: 4px;
          padding: 12px 16px;
          color: white;
          font-family: 'Roboto', sans-serif;
          font-size: 13px;
          z-index: 10000;
          min-width: 250px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
          animation: slideIn 0.3s ease;
        }
        
        .st-notif.warning {
          border-left-color: #FF9800;
        }
        
        .st-notif.success {
          border-left-color: #4CAF50;
        }
        
        .st-notif.info {
          border-left-color: #2196F3;
        }
        
        .st-notif-title {
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .st-notif-desc {
          font-size: 12px;
          color: #ccc;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .st-notif-fadeout {
          animation: fadeOut 0.3s ease;
          opacity: 0;
        }
        
        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    
    document.body.appendChild(indicator);
    this.indicator = indicator;
    
    // Event listeners
    indicator.querySelector('.st-rate-close').addEventListener('click', () => {
      this.disable();
    });
    
    indicator.querySelector('.st-rate-minimize').addEventListener('click', () => {
      indicator.querySelector('.st-rate-panel').classList.toggle('minimized');
    });
    
    indicator.querySelector('#st-rate-toggle').addEventListener('click', () => {
      this.isPaused = !this.isPaused;
      const btn = indicator.querySelector('#st-rate-toggle');
      btn.textContent = this.isPaused ? '▶ Resume' : '⏸ Pause';
      // this.updateIndicatorUI(this.isPaused ? 'paused' : 'active');
    });
  }
  
  /**
   * Update indicator UI
   */
  updateIndicatorUI(status) {
    if (!this.indicator) return;
    
    const rate = this.detector.getRate();
    
    // Update values
    const detectedEl = document.getElementById('st-detected');
    if (detectedEl) {
      detectedEl.textContent = 
        rate.syllablesPerSecond > 0 
          ? `${rate.syllablesPerSecond.toFixed(1)} syl/s (${rate.category})`
          : '—';
    }
    
    const speedEl = document.getElementById('st-speed');
    if (speedEl) {
      speedEl.textContent = `${this.video.playbackRate.toFixed(2)}x`;
      
      // Color code speed
      if (this.video.playbackRate < 0.9) {
        speedEl.style.background = 'rgba(255, 152, 0, 0.2)';
        speedEl.style.color = '#FF9800';
      } else if (this.video.playbackRate > 1.1) {
        speedEl.style.background = 'rgba(33, 150, 243, 0.2)';
        speedEl.style.color = '#2196F3';
      } else {
        speedEl.style.background = 'rgba(76, 175, 80, 0.2)';
        speedEl.style.color = '#4CAF50';
      }
    }
    
    const targetEl = document.getElementById('st-target');
    if (targetEl) {
      targetEl.textContent = this.targetRate.charAt(0).toUpperCase() + this.targetRate.slice(1);
    }
    
    // Update status
    const statusEl = document.getElementById('st-status');
    if (statusEl) {
      statusEl.textContent = status === 'paused' ? 'Paused' : 'Active';
      statusEl.className = 'st-rate-status ' + status;
    }
  }
  
  /**
   * Show notification
   */
  showNotification(title, description, type = 'info') {
    const notif = document.createElement('div');
    notif.className = `st-notif ${type}`;
    notif.innerHTML = `
      <div class="st-notif-title">${title}</div>
      <div class="st-notif-desc">${description}</div>
    `;
    
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.classList.add('st-notif-fadeout');
      setTimeout(() => notif.remove(), 300);
    }, 3000);
  }
  
  /**
   * Set target speech rate
   */
  setTargetRate(targetRate) {
    this.targetRate = targetRate;
    if (this.isEnabled) {
      this.updatePlaybackRate();
    }
    // if (this.indicator) {
    //   this.updateIndicatorUI(this.isPaused ? 'paused' : 'active');
    // }
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
      playbackRate: this.video.playbackRate,
      isPaused: this.isPaused,
      userManuallySet: this.userManuallySet
    };
  }
}

// Export
window.SpeechRateDetector = SpeechRateDetector;
window.SpeechRateController = SpeechRateController;
