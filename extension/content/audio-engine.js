/**
 * WebAudio Processing Engine for SleepyTube
 * Handles all audio processing: compression, limiting, EQ, and AGC
 */

class AudioEngine {
  constructor(videoElement) {
    this.video = videoElement;
    this.audioContext = null;
    this.nodes = null;
    this.agcController = null;
    this.voiceFocusController = null;
    this.speechRateDetector = null;
    this.speechRateController = null;
    this.isInitialized = false;
    this.isConnected = false;
    this.isEnabled = false;
    
    // Bind methods
    this.init = this.init.bind(this);
    this.connect = this.connect.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
  }
  
  /**
   * Initialize WebAudio graph
   */
  async init() {
    if (this.isInitialized) {
      window.SleepyTubeUtils.log('Audio engine already initialized');
      return true;
    }
    
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Check if video already has a source node attached
      if (this.video.__sleepytubeSource && this.video.__sleepytubeSource.__sleepytubeNodes) {
        window.SleepyTubeUtils.log('Reusing existing audio graph');
        this.nodes = this.video.__sleepytubeSource.__sleepytubeNodes;
        
        // Re-initialize controllers for the reused graph
        this.agcController = new AGCController(
          this.audioContext,
          this.nodes.makeupGain,
          this.nodes.midAnalyser,
          this.nodes.midAnalyserBuffer
        );
        
        this.voiceFocusController = new VoiceFocusController(
          this.nodes.lowGain,
          this.nodes.highGain,
          this.nodes.midAnalyser,
          this.nodes.midAnalyserBuffer
        );
        
        this.isInitialized = true;
        return true;
      }
      
      // Create media element source
      const source = this.audioContext.createMediaElementSource(this.video);
      
      // Create multiband split for voice focus
      const lowPassFilter = this.audioContext.createBiquadFilter();
      lowPassFilter.type = 'lowpass';
      lowPassFilter.frequency.value = window.SleepyTubeConstants.VOICE_FOCUS_CONFIG.lowBandFreq;
      lowPassFilter.Q.value = 0.707; // Butterworth response
      
      const midBandpass1 = this.audioContext.createBiquadFilter();
      midBandpass1.type = 'highpass';
      midBandpass1.frequency.value = window.SleepyTubeConstants.VOICE_FOCUS_CONFIG.midBandLow;
      
      const midBandpass2 = this.audioContext.createBiquadFilter();
      midBandpass2.type = 'lowpass';
      midBandpass2.frequency.value = window.SleepyTubeConstants.VOICE_FOCUS_CONFIG.midBandHigh;
      
      const highPassFilter = this.audioContext.createBiquadFilter();
      highPassFilter.type = 'highpass';
      highPassFilter.frequency.value = window.SleepyTubeConstants.VOICE_FOCUS_CONFIG.highBandFreq;
      
      // Create gain nodes for each band
      const lowGain = this.audioContext.createGain();
      lowGain.gain.value = 1.0;
      
      const midGain = this.audioContext.createGain();
      midGain.gain.value = 1.0;
      
      const highGain = this.audioContext.createGain();
      highGain.gain.value = 1.0;
      
      // Create merger to combine bands
      const merger = this.audioContext.createGain();
      merger.gain.value = 1.0;
      
      // Create analyser for source (before processing)
      const sourceAnalyser = this.audioContext.createAnalyser();
      sourceAnalyser.fftSize = 2048;
      sourceAnalyser.smoothingTimeConstant = 0.3;
      
      // Create analyser for mid-band (speech detection)
      const midAnalyser = this.audioContext.createAnalyser();
      midAnalyser.fftSize = 2048;
      midAnalyser.smoothingTimeConstant = 0.8;
      
      // Create EQ filters
      const highShelfFilter = this.audioContext.createBiquadFilter();
      highShelfFilter.type = 'highshelf';
      highShelfFilter.frequency.value = 8000;
      highShelfFilter.gain.value = 0;
      
      const lowShelfFilter = this.audioContext.createBiquadFilter();
      lowShelfFilter.type = 'lowshelf';
      lowShelfFilter.frequency.value = 80;
      lowShelfFilter.gain.value = 0;
      
      // Create compressor
      const compressor = this.audioContext.createDynamicsCompressor();
      const preset = window.SleepyTubeConstants.COMPRESSION_PRESETS.medium;
      compressor.threshold.value = preset.threshold;
      compressor.knee.value = preset.knee;
      compressor.ratio.value = preset.ratio;
      compressor.attack.value = preset.attack;
      compressor.release.value = preset.release;
      
      // Create makeup gain node (for AGC and manual gain)
      const makeupGain = this.audioContext.createGain();
      makeupGain.gain.value = 1.0;
      
      // Create limiter (brickwall protection)
      const limiter = this.audioContext.createDynamicsCompressor();
      const limiterConfig = window.SleepyTubeConstants.LIMITER_CONFIG;
      limiter.threshold.value = limiterConfig.threshold;
      limiter.knee.value = limiterConfig.knee;
      limiter.ratio.value = limiterConfig.ratio;
      limiter.attack.value = limiterConfig.attack;
      limiter.release.value = limiterConfig.release;
      
      // Create output analyser for visualization (after processing)
      const outputAnalyser = this.audioContext.createAnalyser();
      outputAnalyser.fftSize = 2048;
      outputAnalyser.smoothingTimeConstant = 0.3;
      
      // Store all nodes
      this.nodes = {
        source,
        sourceAnalyser,
        lowPassFilter,
        midBandpass1,
        midBandpass2,
        highPassFilter,
        lowGain,
        midGain,
        highGain,
        merger,
        midAnalyser,
        midAnalyserBuffer: new Float32Array(midAnalyser.fftSize),
        highShelfFilter,
        lowShelfFilter,
        compressor,
        makeupGain,
        limiter,
        outputAnalyser
      };
      
      // Tag source node for reuse
      this.video.__sleepytubeSource = source;
      source.__sleepytubeNodes = this.nodes;
      
      // Connect source to sourceAnalyser for visualization
      source.connect(sourceAnalyser);
      
      // Connect multiband split
      source.connect(lowPassFilter);
      lowPassFilter.connect(lowGain);
      lowGain.connect(merger);
      
      source.connect(midBandpass1);
      midBandpass1.connect(midBandpass2);
      midBandpass2.connect(midGain);
      midGain.connect(merger);
      midGain.connect(midAnalyser); // For speech detection
      
      source.connect(highPassFilter);
      highPassFilter.connect(highGain);
      highGain.connect(merger);
      
      // Connect EQ -> Compressor -> Makeup Gain -> Limiter -> Output Analyser -> Destination
      merger.connect(lowShelfFilter);
      lowShelfFilter.connect(highShelfFilter);
      highShelfFilter.connect(compressor);
      compressor.connect(makeupGain);
      makeupGain.connect(limiter);
      limiter.connect(outputAnalyser);
      outputAnalyser.connect(this.audioContext.destination);
      
      // Initialize AGC controller
      this.agcController = new AGCController(
        this.audioContext,
        this.nodes.makeupGain,
        this.nodes.midAnalyser,
        this.nodes.midAnalyserBuffer
      );
      
      // Initialize voice focus controller
      this.voiceFocusController = new VoiceFocusController(
        this.nodes.lowGain,
        this.nodes.highGain,
        this.nodes.midAnalyser,
        this.nodes.midAnalyserBuffer
      );
      
      // Initialize speech rate detector and controller
      this.speechRateDetector = new window.SpeechRateDetector(
        this.audioContext,
        this.nodes.midAnalyser
      );
      this.speechRateController = new window.SpeechRateController(
        this.video,
        this.speechRateDetector
      );
      
      // Resume audio context on video play (required by some browsers)
      this.video.addEventListener('play', () => {
        if (this.audioContext.state === 'suspended') {
          this.audioContext.resume();
        }
      }, { once: true });
      
      this.isInitialized = true;
      window.SleepyTubeUtils.log('Audio engine initialized successfully');
      return true;
      
    } catch (error) {
      window.SleepyTubeUtils.logError('Failed to initialize audio engine:', error);
      return false;
    }
  }
  
  /**
   * Enable audio processing
   */
  async connect() {
    if (!this.isInitialized) {
      await this.init();
    }
    
    if (this.isConnected) {
      window.SleepyTubeUtils.log('Audio processing already connected');
      return;
    }
    
    // Fade in: Start from low volume and gradually increase
    const fadeInDuration = 1.0; // 1 second fade in
    const currentTime = this.audioContext.currentTime;
    
    // Set initial volume to 30% to avoid sudden loudness
    this.nodes.makeupGain.gain.setValueAtTime(0.3, currentTime);
    
    // Gradually increase to normal volume over 1 second
    this.nodes.makeupGain.gain.linearRampToValueAtTime(1.0, currentTime + fadeInDuration);
    
    window.SleepyTubeUtils.log('Audio fade-in started (1.0s)');
    
    // Audio graph is always connected (no bypass needed)
    // Instead, we just start AGC and voice focus controllers
    
    if (window.SleepyTubeConfig.getValue('autoGainEnabled')) {
      this.agcController.start();
    }
    
    if (window.SleepyTubeConfig.getValue('voiceFocusEnabled')) {
      this.voiceFocusController.start(this.audioContext);
    }
    
    // Start speech rate detection if enabled
    if (window.SleepyTubeConfig.getValue('speechRateEnabled')) {
      this.speechRateDetector.start();
      const targetRate = window.SleepyTubeConfig.getValue('targetSpeechRate') || 'auto';
      this.speechRateController.enable(targetRate);
    }
    
    this.isConnected = true;
    this.isEnabled = true;
    window.SleepyTubeUtils.log('Audio processing enabled');
  }
  
  /**
   * Disable audio processing
   */
  disconnect() {
    if (!this.isConnected) {
      return;
    }
    
    // Fade out: Gradually decrease volume before disabling
    const fadeOutDuration = 0.5; // 0.5 second fade out
    const currentTime = this.audioContext.currentTime;
    
    // Gradually decrease to 30% volume
    this.nodes.makeupGain.gain.setValueAtTime(this.nodes.makeupGain.gain.value, currentTime);
    this.nodes.makeupGain.gain.linearRampToValueAtTime(0.3, currentTime + fadeOutDuration);
    
    window.SleepyTubeUtils.log('Audio fade-out started (0.5s)');
    
    // Wait for fade out to complete before stopping controllers
    setTimeout(() => {
      // Stop AGC and voice focus
      if (this.agcController) {
        this.agcController.stop();
      }
      
      if (this.voiceFocusController) {
        this.voiceFocusController.stop();
      }
      
      // Stop speech rate detection
      if (this.speechRateDetector) {
        this.speechRateDetector.stop();
      }
      if (this.speechRateController) {
        this.speechRateController.disable();
      }
      
      // Reset gains to neutral after a short delay
      if (this.nodes) {
        const t = this.audioContext.currentTime + 0.1;
        this.nodes.makeupGain.gain.setTargetAtTime(1.0, t, 0.05);
        this.nodes.lowGain.gain.setTargetAtTime(1.0, t, 0.05);
        this.nodes.highGain.gain.setTargetAtTime(1.0, t, 0.05);
      }
      
      window.SleepyTubeUtils.log('Audio processing disabled');
    }, fadeOutDuration * 1000);
    
    this.isConnected = false;
    this.isEnabled = false;
  }
  
  /**
   * Update audio processing settings
   */
  updateSettings(config) {
    if (!this.nodes) return;
    
    const t = this.audioContext.currentTime + 0.01;
    
    // Update compression settings
    if (config.compressionStrength) {
      const preset = window.SleepyTubeConstants.COMPRESSION_PRESETS[config.compressionStrength];
      if (preset) {
        this.nodes.compressor.threshold.setValueAtTime(preset.threshold, t);
        this.nodes.compressor.knee.setValueAtTime(preset.knee, t);
        this.nodes.compressor.ratio.setValueAtTime(preset.ratio, t);
        this.nodes.compressor.attack.setValueAtTime(preset.attack, t);
        this.nodes.compressor.release.setValueAtTime(preset.release, t);
      }
    }
    
    // Update EQ settings
    if (config.eqPreset) {
      const eqPreset = window.SleepyTubeConstants.EQ_PRESETS[config.eqPreset];
      if (eqPreset) {
        this.nodes.highShelfFilter.frequency.setValueAtTime(eqPreset.highShelfFreq, t);
        this.nodes.highShelfFilter.gain.setValueAtTime(eqPreset.highShelfGain, t);
        this.nodes.lowShelfFilter.frequency.setValueAtTime(eqPreset.lowShelfFreq, t);
        this.nodes.lowShelfFilter.gain.setValueAtTime(eqPreset.lowShelfGain, t);
      }
    }
    
    // Update manual output gain
    if (config.outputGain !== undefined) {
      const currentAgcGain = this.agcController ? this.agcController.currentGainDb : 0;
      const totalGain = window.SleepyTubeUtils.dbToLinear(currentAgcGain + config.outputGain);
      this.nodes.makeupGain.gain.setTargetAtTime(totalGain, t, 0.05);
    }
    
    // Update AGC
    if (config.autoGainEnabled !== undefined) {
      if (config.autoGainEnabled && this.isConnected) {
        this.agcController.start();
      } else {
        this.agcController.stop();
      }
    }
    
    if (config.targetLoudness !== undefined && this.agcController) {
      this.agcController.targetLoudness = config.targetLoudness;
    }
    
    // Update voice focus
    if (config.voiceFocusEnabled !== undefined) {
      if (config.voiceFocusEnabled && this.isConnected) {
        this.voiceFocusController.start(this.audioContext);
      } else {
        this.voiceFocusController.stop();
      }
    }
    
    if (config.duckingAmount !== undefined && this.voiceFocusController) {
      this.voiceFocusController.duckingAmount = config.duckingAmount;
    }
    
    // Update speech rate control
    if (config.speechRateEnabled !== undefined) {
      if (config.speechRateEnabled && this.isConnected) {
        this.speechRateDetector.start();
        const targetRate = config.targetSpeechRate || 'auto';
        this.speechRateController.enable(targetRate);
      } else {
        if (this.speechRateDetector) {
          this.speechRateDetector.stop();
        }
        if (this.speechRateController) {
          this.speechRateController.disable();
        }
      }
    }
    
    if (config.targetSpeechRate !== undefined && this.speechRateController) {
      this.speechRateController.setTargetRate(config.targetSpeechRate);
    }
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    this.disconnect();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.nodes = null;
    this.isInitialized = false;
    window.SleepyTubeUtils.log('Audio engine destroyed');
  }
  
  /**
   * Get current state info for UI display
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      isConnected: this.isConnected,
      isEnabled: this.isEnabled,
      currentGainDb: this.agcController ? this.agcController.currentGainDb : 0,
      currentLoudnessDb: this.agcController ? this.agcController.lastMeasuredDb : -60
    };
  }
}

/**
 * Auto Gain Control (AGC) Controller
 */
class AGCController {
  constructor(audioContext, makeupGainNode, analyserNode, analyserBuffer) {
    this.ac = audioContext;
    this.gainNode = makeupGainNode;
    this.analyser = analyserNode;
    this.buffer = analyserBuffer;
    
    this.targetLoudness = window.SleepyTubeConstants.AGC_CONFIG.targetLoudness;
    this.currentGainDb = 0;
    this.lastMeasuredDb = -60;
    this.attackTimeMs = window.SleepyTubeConstants.AGC_CONFIG.attackTimeMs;
    this.releaseTimeMs = window.SleepyTubeConstants.AGC_CONFIG.releaseTimeMs;
    
    this.isRunning = false;
    this.animationFrameId = null;
    
    this.tick = this.tick.bind(this);
  }
  
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.tick();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  tick() {
    if (!this.isRunning) return;
    
    // Measure current loudness
    const currentDb = this.measureLoudness();
    this.lastMeasuredDb = currentDb;
    
    // Calculate needed gain adjustment
    const error = this.targetLoudness - currentDb;
    const limitedError = window.SleepyTubeUtils.clamp(
      error,
      window.SleepyTubeConstants.AGC_CONFIG.minGainDb,
      window.SleepyTubeConstants.AGC_CONFIG.maxGainDb
    );
    
    // Smoothing (attack/release)
    const alpha = this.calculateSmoothingFactor(limitedError);
    this.currentGainDb += (limitedError - this.currentGainDb) * alpha;
    
    // Get manual output gain from config
    const outputGain = window.SleepyTubeConfig.getValue('outputGain') || 0;
    
    // Update gain node
    const totalGainLinear = window.SleepyTubeUtils.dbToLinear(this.currentGainDb + outputGain);
    this.gainNode.gain.setTargetAtTime(totalGainLinear, this.ac.currentTime, 0.05);
    
    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.tick);
  }
  
  measureLoudness() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    return window.SleepyTubeUtils.estimateLoudnessDb(this.buffer);
  }
  
  calculateSmoothingFactor(error) {
    // Use attack time when increasing gain, release time when decreasing
    const timeConstant = (error > this.currentGainDb) ? this.attackTimeMs : this.releaseTimeMs;
    const samplesPerFrame = (this.ac.sampleRate / 60); // Assume 60 FPS
    const framesPerSecond = 60;
    const alpha = 1 - Math.exp(-framesPerSecond / (timeConstant / 1000 * framesPerSecond));
    return window.SleepyTubeUtils.clamp(alpha, 0.01, 0.25);
  }
}

/**
 * Voice Focus Controller (Multiband Sidechain Ducking)
 */
class VoiceFocusController {
  constructor(lowGainNode, highGainNode, analyserNode, analyserBuffer) {
    this.lowGain = lowGainNode;
    this.highGain = highGainNode;
    this.analyser = analyserNode;
    this.buffer = analyserBuffer;
    
    this.duckingAmount = window.SleepyTubeConfig.getValue('duckingAmount') || 9;
    this.isRunning = false;
    this.animationFrameId = null;
    
    this.tick = this.tick.bind(this);
  }
  
  start(audioContext) {
    if (this.isRunning) return;
    this.ac = audioContext;
    this.isRunning = true;
    this.tick();
  }
  
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Reset gains to normal
    if (this.ac) {
      this.lowGain.gain.setTargetAtTime(1.0, this.ac.currentTime, 0.1);
      this.highGain.gain.setTargetAtTime(1.0, this.ac.currentTime, 0.1);
    }
  }
  
  updateDuckingAmount(amount) {
    this.duckingAmount = amount;
  }
  
  tick() {
    if (!this.isRunning) return;
    
    // Measure mid-band energy (voice presence)
    const voiceLevel = this.measureVoiceLevel();
    
    // Duck low and high bands when voice is present
    const threshold = -40; // dB
    const ratio = 0.8; // How much to duck
    
    let duckGain = 1.0;
    if (voiceLevel > threshold) {
      // Voice detected, apply ducking
      const duckDb = -this.duckingAmount;
      duckGain = window.SleepyTubeUtils.dbToLinear(duckDb);
    }
    
    // Apply to low and high bands
    this.lowGain.gain.setTargetAtTime(duckGain, this.ac.currentTime, 0.05);
    this.highGain.gain.setTargetAtTime(duckGain, this.ac.currentTime, 0.05);
    
    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.tick);
  }
  
  measureVoiceLevel() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    return window.SleepyTubeUtils.estimateLoudnessDb(this.buffer);
  }
}

// Export
window.AudioEngine = AudioEngine;
