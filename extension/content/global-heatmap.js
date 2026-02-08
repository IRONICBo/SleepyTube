/**
 * Global Waveform Heatmap for SleepyTube
 * Displays compression intensity as a heat map overlayed on the progress bar
 */

class GlobalHeatmap {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.progressBar = null;
    this.isVisible = false;
    this.compressionHistory = [];
    this.maxHistoryLength = 1000;
    this.animationFrameId = null;
    
    // Bind methods
    this.render = this.render.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
  }
  
  /**
   * Inject heatmap into progress bar
   */
  inject() {
    if (this.container && document.body.contains(this.container)) {
      return; // Already injected
    }
    
    // Find progress bar
    this.progressBar = document.querySelector('.ytp-progress-bar-container');
    
    if (!this.progressBar) {
      console.warn('[SleepyTube] Could not find progress bar for heatmap');
      return;
    }
    
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'sleepytube-heatmap';
    this.container.id = 'sleepytube-heatmap';
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'sleepytube-heatmap-canvas';
    
    this.container.appendChild(this.canvas);
    this.progressBar.appendChild(this.container);
    
    // Setup canvas
    this.setupCanvas();
    
    // Listen for resize
    window.addEventListener('resize', this.updatePosition);
    
    // Listen for theater mode / fullscreen changes
    const videoPlayer = document.querySelector('.html5-video-player');
    if (videoPlayer) {
      const observer = new MutationObserver(this.updatePosition);
      observer.observe(videoPlayer, { attributes: true, attributeFilter: ['class'] });
    }
    
    console.log('[SleepyTube] Global heatmap injected');
  }
  
  /**
   * Setup canvas dimensions
   */
  setupCanvas() {
    if (!this.canvas || !this.progressBar) return;
    
    const width = this.progressBar.offsetWidth || window.innerWidth;
    const height = 40; // Match YouTube's heat map height
    
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = width * dpr;
    this.canvas.height = height * dpr;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);
  }
  
  /**
   * Update position on resize
   */
  updatePosition() {
    this.setupCanvas();
  }
  
  /**
   * Show heatmap
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
   * Hide heatmap
   */
  hide() {
    if (this.container) {
      this.container.classList.remove('visible');
    }
    this.isVisible = false;
    this.stop();
  }
  
  /**
   * Toggle visibility
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
    if (this.animationFrameId) return;
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
    if (!nodes || !nodes.compressor) {
      this.drawEmpty();
      return;
    }
    
    try {
      // Get compression reduction (in dB)
      const reduction = nodes.compressor.reduction;
      
      // Store compression history
      this.compressionHistory.push(Math.abs(reduction));
      
      // Limit history length
      if (this.compressionHistory.length > this.maxHistoryLength) {
        this.compressionHistory.shift();
      }
      
      // Draw heatmap
      this.drawHeatmap();
    } catch (error) {
      console.error('[SleepyTube] Heatmap render error:', error);
    }
  }
  
  /**
   * Draw empty state
   */
  drawEmpty() {
    const width = this.canvas.offsetWidth || this.canvas.width;
    const height = 40;
    
    this.ctx.clearRect(0, 0, width, height);
  }
  
  /**
   * Draw heatmap based on compression history
   */
  drawHeatmap() {
    const width = this.canvas.offsetWidth || this.canvas.width;
    const height = 40;
    
    // Clear
    this.ctx.clearRect(0, 0, width, height);
    
    if (this.compressionHistory.length === 0) return;
    
    // Calculate path points
    const dataPoints = this.compressionHistory.length;
    const sliceWidth = width / dataPoints;
    
    // Create gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(76, 175, 80, 0.6)'); // Green at top
    gradient.addColorStop(1, 'rgba(76, 175, 80, 0)'); // Transparent at bottom
    
    // Draw waveform path
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    
    let x = 0;
    for (let i = 0; i < dataPoints; i++) {
      const compression = this.compressionHistory[i];
      // Map compression (0-20 dB) to height (0-100%)
      const normalizedValue = Math.min(compression / 20, 1);
      const y = height - (normalizedValue * height);
      
      if (i === 0) {
        this.ctx.lineTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.lineTo(width, height);
    this.ctx.closePath();
    
    // Fill with gradient
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
    
    // Draw stroke
    this.ctx.beginPath();
    this.ctx.moveTo(0, height);
    
    x = 0;
    for (let i = 0; i < dataPoints; i++) {
      const compression = this.compressionHistory[i];
      const normalizedValue = Math.min(compression / 20, 1);
      const y = height - (normalizedValue * height);
      this.ctx.lineTo(x, y);
      x += sliceWidth;
    }
    
    this.ctx.strokeStyle = 'rgba(76, 175, 80, 0.8)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
  
  /**
   * Update audio engine reference
   */
  updateAudioEngine(audioEngine) {
    this.audioEngine = audioEngine;
  }
  
  /**
   * Destroy heatmap
   */
  destroy() {
    this.stop();
    
    window.removeEventListener('resize', this.updatePosition);
    
    if (this.container && this.container.parentElement) {
      this.container.remove();
    }
    
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.compressionHistory = [];
  }
}

// Export
window.GlobalHeatmap = GlobalHeatmap;
