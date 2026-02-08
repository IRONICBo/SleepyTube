/**
 * Audio Visualization Component for SleepyTube
 * Real-time visualization of audio processing effects
 */

class AudioVisualizer {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.isVisible = false;
    
    // Visualization settings
    this.width = 800;
    this.height = 300;
    this.barWidth = 2;
    this.barGap = 1;
    
    // Data buffers
    this.beforeData = new Float32Array(2048);
    this.afterData = new Float32Array(2048);
    this.peakHistory = [];
    this.loudnessHistory = [];
    this.gainHistory = [];
    this.maxHistoryLength = 100;
    
    // Statistics
    this.stats = {
      peaksSuppressed: 0,
      currentLoudness: -60,
      currentGain: 0,
      peakReduction: 0,
      compressionRatio: 0
    };
    
    // Bind methods
    this.render = this.render.bind(this);
    this.toggle = this.toggle.bind(this);
  }
  
  /**
   * Create visualization panel
   */
  createPanel() {
    const panel = document.createElement('div');
    panel.id = 'sleepytube-visualizer';
    panel.className = 'sleepytube-visualizer';
    
    panel.innerHTML = `
      <div class="visualizer-header">
        <div class="visualizer-title">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M3 12h2v4H3v-4zm4-8h2v12H7V4zm4 5h2v11h-2V9zm4-3h2v14h-2V6zm4 7h2v7h-2v-7z" fill="currentColor"/>
          </svg>
          <span>SleepyTube Audio Monitor</span>
        </div>
        <button class="visualizer-close" aria-label="Close">×</button>
      </div>
      
      <div class="visualizer-content">
        <div class="visualizer-canvas-container">
          <canvas id="sleepytube-canvas" width="${this.width}" height="${this.height}"></canvas>
          <div class="canvas-labels">
            <div class="label-before">Before Processing</div>
            <div class="label-after">After Processing</div>
          </div>
        </div>
        
        <div class="visualizer-metrics">
          <div class="metric-group">
            <div class="metric-card">
              <div class="metric-label">Current Loudness</div>
              <div class="metric-value" id="metric-loudness">-60 dB</div>
              <div class="metric-bar">
                <div class="metric-bar-fill" id="bar-loudness" style="width: 0%"></div>
              </div>
            </div>
            
            <div class="metric-card">
              <div class="metric-label">AGC Gain</div>
              <div class="metric-value" id="metric-gain">0.0 dB</div>
              <div class="metric-bar">
                <div class="metric-bar-fill metric-bar-gain" id="bar-gain" style="width: 50%"></div>
              </div>
            </div>
          </div>
          
          <div class="metric-group">
            <div class="metric-card">
              <div class="metric-label">Peaks Suppressed</div>
              <div class="metric-value" id="metric-peaks">0</div>
              <div class="metric-subtitle">Sudden spikes blocked</div>
            </div>
            
            <div class="metric-card">
              <div class="metric-label">Peak Reduction</div>
              <div class="metric-value" id="metric-reduction">0 dB</div>
              <div class="metric-subtitle">Volume spike dampening</div>
            </div>
          </div>
          
          <div class="metric-group">
            <div class="metric-card metric-card-wide">
              <div class="metric-label">Compression Activity</div>
              <div class="compression-indicator">
                <div class="compression-bar" id="compression-bar">
                  <div class="compression-fill" id="compression-fill"></div>
                </div>
                <div class="compression-label" id="compression-label">Ratio: 1:1</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="visualizer-footer">
        <div class="footer-info">
          <span class="info-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
            </svg>
            Real-time @ 60 FPS
          </span>
          <span class="info-item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2"/>
            </svg>
            Zero latency
          </span>
        </div>
      </div>
    `;
    
    return panel;
  }
  
  /**
   * Inject panel into YouTube page
   */
  inject() {
    if (this.container && document.body.contains(this.container)) {
      return; // Already injected
    }
    
    // Find video container
    const videoContainer = document.querySelector('#primary') || 
                          document.querySelector('#player') ||
                          document.body;
    
    this.container = this.createPanel();
    
    // Insert after video player
    const player = document.querySelector('#movie_player');
    if (player && player.parentElement) {
      player.parentElement.insertAdjacentElement('afterend', this.container);
    } else {
      videoContainer.appendChild(this.container);
    }
    
    // Get canvas and context
    this.canvas = document.getElementById('sleepytube-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set up high DPI canvas
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = this.width + 'px';
    this.canvas.style.height = this.height + 'px';
    this.ctx.scale(dpr, dpr);
    
    // Attach event listeners
    this.container.querySelector('.visualizer-close').addEventListener('click', () => {
      this.hide();
    });
    
    window.SleepyTubeUtils.log('Visualizer injected');
  }
  
  /**
   * Show visualizer
   */
  show() {
    if (!this.container) {
      this.inject();
    }
    
    this.container.classList.add('visualizer-visible');
    this.isVisible = true;
    this.start();
  }
  
  /**
   * Hide visualizer
   */
  hide() {
    if (this.container) {
      this.container.classList.remove('visualizer-visible');
    }
    this.isVisible = false;
    this.stop();
  }
  
  /**
   * Toggle visualizer visibility
   */
  toggle() {
    if (this.isVisible) {
      this.hide();
    } else {
      this.show();
    }
  }
  
  /**
   * Start rendering
   */
  start() {
    if (this.animationFrameId) {
      return; // Already running
    }
    this.render();
  }
  
  /**
   * Stop rendering
   */
  stop() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }
  
  /**
   * Main render loop
   */
  render() {
    if (!this.isVisible || !this.audioEngine || !this.audioEngine.isInitialized) {
      this.animationFrameId = requestAnimationFrame(this.render);
      return;
    }
    
    const nodes = this.audioEngine.nodes;
    if (!nodes) {
      this.animationFrameId = requestAnimationFrame(this.render);
      return;
    }
    
    // Get audio data
    // Before processing: from source (approximated by merger output)
    const beforeAnalyser = nodes.analyserMid; // Use mid-band as representative
    beforeAnalyser.getFloatTimeDomainData(this.beforeData);
    
    // After processing: from makeup gain output
    // We need to create an analyser for the output if not exists
    if (!this.outputAnalyser) {
      this.outputAnalyser = this.audioEngine.audioContext.createAnalyser();
      this.outputAnalyser.fftSize = 2048;
      this.outputAnalyser.smoothingTimeConstant = 0.3;
      this.afterData = new Float32Array(this.outputAnalyser.fftSize);
      
      // Connect limiter to output analyser (before destination)
      nodes.limiter.connect(this.outputAnalyser);
      this.outputAnalyser.connect(this.audioEngine.audioContext.destination);
      
      // Disconnect limiter from destination and reconnect through analyser
      try {
        nodes.limiter.disconnect(this.audioEngine.audioContext.destination);
      } catch (e) {
        // May not be connected
      }
    }
    
    this.outputAnalyser.getFloatTimeDomainData(this.afterData);
    
    // Calculate statistics
    this.updateStatistics(nodes);
    
    // Draw visualizations
    this.drawWaveforms();
    this.updateMetrics();
    
    this.animationFrameId = requestAnimationFrame(this.render);
  }
  
  /**
   * Update statistics from audio data
   */
  updateStatistics(nodes) {
    // Calculate RMS levels
    const beforeRMS = window.SleepyTubeUtils.calculateRMS(this.beforeData);
    const afterRMS = window.SleepyTubeUtils.calculateRMS(this.afterData);
    
    const beforeDb = 20 * Math.log10(beforeRMS + 1e-9);
    const afterDb = 20 * Math.log10(afterRMS + 1e-9);
    
    // Detect peaks (sudden spikes)
    const peakThreshold = -10; // dBFS
    if (beforeDb > peakThreshold && afterDb < beforeDb - 3) {
      this.stats.peaksSuppressed++;
    }
    
    // Current loudness
    this.stats.currentLoudness = afterDb;
    
    // AGC gain
    if (this.audioEngine.agcController) {
      this.stats.currentGain = this.audioEngine.agcController.currentGainDb || 0;
    }
    
    // Peak reduction
    this.stats.peakReduction = Math.max(0, beforeDb - afterDb);
    
    // Store history
    this.loudnessHistory.push(afterDb);
    this.gainHistory.push(this.stats.currentGain);
    
    if (this.loudnessHistory.length > this.maxHistoryLength) {
      this.loudnessHistory.shift();
      this.gainHistory.shift();
    }
    
    // Compression ratio (approximated)
    const config = window.SleepyTubeConfig.get();
    const preset = window.SleepyTubeConstants.COMPRESSION_PRESETS[config.compressionStrength];
    this.stats.compressionRatio = preset ? preset.ratio : 1;
  }
  
  /**
   * Draw waveforms on canvas
   */
  drawWaveforms() {
    const ctx = this.ctx;
    const width = this.width;
    const height = this.height;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    
    // Horizontal lines
    for (let i = 0; i <= 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw before waveform (top half)
    this.drawWaveform(this.beforeData, 0, height / 2, '#ff4444', 0.7);
    
    // Draw after waveform (bottom half)
    this.drawWaveform(this.afterData, height / 2, height / 2, '#4caf50', 0.7);
    
    // Draw dB labels
    ctx.fillStyle = '#666';
    ctx.font = '10px monospace';
    ctx.textAlign = 'right';
    
    const dbLabels = ['0dB', '-20dB', '-40dB', '-60dB'];
    for (let i = 0; i < dbLabels.length; i++) {
      const y = (height / 4) * i + 3;
      ctx.fillText(dbLabels[i], width - 5, y + 10);
    }
  }
  
  /**
   * Draw a single waveform
   */
  drawWaveform(data, offsetY, availableHeight, color, alpha) {
    const ctx = this.ctx;
    const  this.width;
    const sliceWidth = width / data.length;
    const centerY = offsetY + availableHeight / 2;
    
    ctx.strokeStyle = color;
    ctx.globalAlpha = alpha;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = centerY + (v * availableHeight / 2);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    ctx.stroke();
    ctx.globalAlpha = 1.0;
    
    // Draw filledctx.globalAlpha = 0.2;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    
    x = 0;
    for (let i 0; i < data.length; i++) {
      const v = data[i];
      const y = centerY + (v * availableHeight / 2);
      ctx.lineTo(x, x += sliceWidth;
    }
    
    ctx.lineTo(width, centY);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
  
  /**
   * Update metric displays
   */
  updateMetrics() {
    // Loudness
    const lonessEl = document.getElementById('metric-loudness');
    const loudnessBar = document.getElementById('bar-loudness');
    if (loudnessEl && loudnessBar) {
      const db = this.stats.currentLoudness;
      loudnessEl.textContent = db.toFixed(1) + ' dB';
      
      // Map -60 to 0 dB → 0% to 100%
      const percent = Math.max(0, Math.min(100, ((db + 60) / 60) * 100));
      loudnessBar.style.width = percent + '%';
      
      // Color based on level
      if (db > -10) {
        loudnessBar.style.background = '#f44336'; // Red (too loud)
      } else if (db > -20) {
        loudnessBar.style.background = '#4caf50'; // Green (good)
      } else {
        loudnessBar.style.background = '#2196f3'; // Blue (quiet)
      }
    }
    
    // AGC Gain
    const gainEl = document.getElementById('metric-gain');
    const gainBar = document.getElementById('bar-gain');
    if (gainEl && gainBar) {
      const gain = this.stats.currentGain;
      gainEl.textContent = (gain >= 0 ? '+' : '') + gain.toFixed(1) + ' dB';
      
      // Map -18 to +18 dB → 0% to 100%
      const percent = ((gain + 18) / 36) * 100;
      gainBar.style.width = percent + '%';
    }
    
    // Peaks suppressed
    const peaksEl = document.getElementById('metric-peaks');
    if (peaksEl) {
      peaksEl.textContent = this.stats.peaksSuppressed.toString();
    }
    
    // Peak reduction
    const reductionEl = document.getElementById('metric-reduction');
    if (reductionEl) {
      reductionEl.textContent = this.stats.peakReduction.toFixed(1) + ' dB';
    }
    
    // Compression ratio
    const compressionFill = document.getElementById('compression-fill');
    const compressionLabel = document.getElementById('compression-label');
    if (compressionFill && compressionLabel) {
      const ratio = this.stats.compressionRatio;
      compressionLabel.textContent = `Ratio: ${ratio.toFixed(1)}:1`;
      
      // Visual indication of compression activity
      const activity = Math.min(100, (ratio - 1) * 20);
      compressionFill.style.width = activity + '%';
    }
  }
  
  /**
   * Destroy visualizer
   */
  destroy() {
    this.stop();
    
    if (this.outputAnalyser && this.audioEngine && this.audioEngine.nodes) {
      try {
        this.outputAnalyser.disconnect();
        this.audioEngine.nodes.limiter.connect(this.audioEngine.audioContext.destination);
      } catch (e) {
        // Ignore
      }
    }
    
    if (this.container && this.container.parentElement) {
      this.container.remove();
    }
    
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.outputAnalyser = null;
  }
}

// Export
window.AudioVisualizer = AudioVisualizer;
