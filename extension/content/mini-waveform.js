/**
 * Mini Waveform Display for SleepyTube
 * Embeds a compact waveform below the video player
 */

class MiniWaveform {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.animationFrameId = null;
    this.isVisible = false;
    
    // Compact size
    this.height = 60;
    this.beforeData = new Float32Array(512);
    this.afterData = new Float32Array(512);
    
    // Bind methods
    this.render = this.render.bind(this);
  }
  
  /**
   * Create and inject mini waveform
   */
  inject() {
    if (this.container && document.body.contains(this.container)) {
      return; // Already injected
    }
    
    // Find video player or primary column
    const videoPlayer = document.querySelector('#movie_player') || 
                       document.querySelector('#primary');
    
    if (!videoPlayer) {
      console.warn('Could not find video player for mini waveform');
      return;
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'sleepytube-mini-waveform';
    this.container.id = 'sleepytube-mini-waveform';
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'mini-waveform-canvas';
    
    // Labels
    const beforeLabel = document.createElement('div');
    beforeLabel.className = 'mini-waveform-label before';
    beforeLabel.textContent = 'Before';
    
    const afterLabel = document.createElement('div');
    afterLabel.className = 'mini-waveform-label after';
    afterLabel.textContent = 'After';
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mini-waveform-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.title = 'Hide waveform';
    closeBtn.addEventListener('click', () => this.hide());
    
    this.container.appendChild(beforeLabel);
    this.container.appendChild(this.canvas);
    this.container.appendChild(afterLabel);
    this.container.appendChild(closeBtn);
    
    // Insert after video player
    videoPlayer.insertAdjacentElement('afterend', this.container);
    
    // Setup canvas
    this.setupCanvas();
    
    window.SleepyTubeUtils.log('Mini waveform injected');
  }
  
  /**
   * Setup canvas dimensions
   */
  setupCanvas() {
    if (!this.canvas) return;
    
    // Get container width (matches video width)
    const width = this.container.offsetWidth || window.innerWidth;
    
    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = this.height + 'px';
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
  }
  
  /**
   * Show waveform
   */
  show() {
    if (!this.container) {
      this.inject();
    }
    
    if (this.container) {
      this.container.classList.add('visible');
      this.isVisible = true;
      this.start();
    }
  }
  
  /**
   * Hide waveform
   */
  hide() {
    if (this.container) {
      this.container.classList.remove('visible');
    }
    this.isVisible = false;
    this.stop();
    
    // Save preference
    chrome.storage.sync.set({ miniWaveformEnabled: false });
  }
  
  /**
   * Start rendering
   */
  start() {
    if (this.animationFrameId) return;
    
    // Resize canvas on start
    this.setupCanvas();
    
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
    this.animationFrameId = requestAnimationFrame(this.render);
    
    if (!this.isVisible || !this.ctx) return;
    
    const nodes = this.audioEngine?.nodes;
    if (!nodes || !nodes.sourceAnalyser || !nodes.outputAnalyser) {
      this.drawEmpty();
      return;
    }
    
    try {
      // Get audio data
      nodes.sourceAnalyser.getFloatTimeDomainData(this.beforeData);
      nodes.outputAnalyser.getFloatTimeDomainData(this.afterData);
      
      // Draw waveforms
      this.drawWaveforms();
    } catch (error) {
      console.error('Mini waveform render error:', error);
    }
  }
  
  /**
   * Draw empty state
   */
  drawEmpty() {
    const width = this.canvas.offsetWidth || this.canvas.width;
    const height = this.height;
    
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);
    
    // Draw center line
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
  }
  
  /**
   * Draw waveforms
   */
  drawWaveforms() {
    const width = this.canvas.offsetWidth || this.canvas.width;
    const height = this.height;
    
    // Clear
    this.ctx.fillStyle = '#0a0a0a';
    this.ctx.fillRect(0, 0, width, height);
    
    // Draw center line
    this.ctx.strokeStyle = '#222';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2);
    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
    
    // Draw before waveform (top half, red)
    this.drawSingleWaveform(this.beforeData, 0, height / 2, '#ff4444', 0.7);
    
    // Draw after waveform (bottom half, green)
    this.drawSingleWaveform(this.afterData, height / 2, height / 2, '#4caf50', 0.7);
  }
  
  /**
   * Draw single waveform
   */
  drawSingleWaveform(data, offsetY, availableHeight, color, alpha) {
    const width = this.canvas.offsetWidth || this.canvas.width;
    const sliceWidth = width / data.length;
    const centerY = offsetY + availableHeight / 2;
    
    this.ctx.strokeStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    
    let x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = centerY + (v * availableHeight / 2);
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.stroke();
    this.ctx.globalAlpha = 1.0;
    
    // Fill
    this.ctx.globalAlpha = 0.15;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, centerY);
    
    x = 0;
    for (let i = 0; i < data.length; i++) {
      const v = data[i];
      const y = centerY + (v * availableHeight / 2);
      this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    
    this.ctx.lineTo(width, centerY);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.globalAlpha = 1.0;
  }
  
  /**
   * Update audio engine reference
   */
  updateAudioEngine(audioEngine) {
    this.audioEngine = audioEngine;
  }
  
  /**
   * Destroy
   */
  destroy() {
    this.stop();
    
    if (this.container && this.container.parentElement) {
      this.container.remove();
    }
    
    this.container = null;
    this.canvas = null;
    this.ctx = null;
  }
}

// Export
window.MiniWaveform = MiniWaveform;
