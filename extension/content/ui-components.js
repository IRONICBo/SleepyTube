/**
 * UI Components for SleepyTube
 * Handles injection of Sleep Mode controls into YouTube
 */

class UIManager {
  constructor(audioEngine) {
    this.audioEngine = audioEngine;
    this.sleepModeButton = null;
    this.controlPanel = null;
    this.initialized = false;
    
    // Bind methods
    this.injectSleepModeButton = this.injectSleepModeButton.bind(this);
    this.toggleSleepMode = this.toggleSleepMode.bind(this);
    this.toggleControlPanel = this.toggleControlPanel.bind(this);
  }
  
  /**
   * Inject Sleep Mode toggle button into YouTube player
   */
  async injectSleepModeButton() {
    if (this.sleepModeButton && document.body.contains(this.sleepModeButton)) {
      return; // Already injected
    }
    
    try {
      let controls;
      
      if (window.SleepyTubeUtils.isShortsPage()) {
        // Shorts page injection
        controls = await window.SleepyTubeUtils.waitForElement('#actions.ytd-reel-player-overlay-renderer');
        this.injectShortsButton(controls);
      } else {
        // Watch page injection
        controls = await window.SleepyTubeUtils.waitForElement('.ytp-right-controls');
        this.injectWatchButton(controls);
      }
      
      this.initialized = true;
      window.SleepyTubeUtils.log('Sleep mode button injected');
      
    } catch (error) {
      window.SleepyTubeUtils.logError('Failed to inject sleep mode button:', error);
    }
  }
  
  /**
   * Inject button for Shorts page
   */
  injectShortsButton(actionsContainer) {
    const container = document.createElement('div');
    container.className = 'button-container style-scope ytd-reel-player-overlay-renderer';
    container.id = 'sleepytube-shorts-container';
    
    const button = document.createElement('button');
    button.id = 'sleepytube-toggle';
    button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-l yt-spec-button-shape-next--icon-button';
    button.setAttribute('aria-label', 'SleepyTube Sleep Mode');
    button.setAttribute('aria-pressed', 'false');
    button.title = 'Sleep Mode - Stabilize audio for sleep';
    
    const iconWrap = document.createElement('div');
    iconWrap.className = 'yt-spec-button-shape-next__icon';
    
    const span1 = document.createElement('span');
    span1.className = 'ytIconWrapperHost';
    span1.style.width = '24px';
    span1.style.height = '24px';
    
    const span2 = document.createElement('span');
    span2.className = 'yt-icon-shape ytSpecIconShapeHost';
    
    const iconHolder = document.createElement('div');
    iconHolder.style.width = '100%';
    iconHolder.style.height = '100%';
    iconHolder.style.display = 'block';
    iconHolder.style.fill = 'currentcolor';
    
    iconHolder.appendChild(this.createSleepModeIcon());
    span2.appendChild(iconHolder);
    span1.appendChild(span2);
    iconWrap.appendChild(span1);
    button.appendChild(iconWrap);
    
    container.appendChild(button);
    actionsContainer.appendChild(container);
    
    this.sleepModeButton = button;
    this.attachButtonListeners();
  }
  
  /**
   * Inject button for Watch page
   */
  injectWatchButton(controls) {
    const button = document.createElement('button');
    button.id = 'sleepytube-toggle';
    button.className = 'ytp-button sleepytube-btn';
    button.title = 'Sleep Mode - Stabilize audio for sleep';
    button.setAttribute('aria-label', 'SleepyTube Sleep Mode');
    button.setAttribute('aria-pressed', 'false');
    
    const iconContainer = document.createElement('div');
    iconContainer.className = 'sleepytube-icon';
    iconContainer.appendChild(this.createSleepModeIcon());
    button.appendChild(iconContainer);
    
    // Insert before settings button
    const settingsButton = controls.querySelector('.ytp-settings-button');
    if (settingsButton && settingsButton.parentElement) {
      settingsButton.parentElement.insertBefore(button, settingsButton);
    } else {
      controls.prepend(button);
    }
    
    this.sleepModeButton = button;
    this.attachButtonListeners();
  }
  
  /**
   * Create SVG icon for Sleep Mode button
   */
  createSleepModeIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('focusable', 'false');
    svg.style.width = '100%';
    svg.style.height = '100%';
    
    // Equalizer bars icon
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M3 12h2v4H3v-4zm4-8h2v12H7V4zm4 5h2v11h-2V9zm4-3h2v14h-2V6zm4 7h2v7h-2v-7z');
    path.setAttribute('fill', 'currentColor');
    
    svg.appendChild(path);
    return svg;
  }
  
  /**
   * Attach event listeners to button
   */
  attachButtonListeners() {
    if (!this.sleepModeButton) return;
    
    // Click to toggle sleep mode
    this.sleepModeButton.addEventListener('click', this.toggleSleepMode);
    
    // Right-click to open control panel
    this.sleepModeButton.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.toggleControlPanel();
    });
    
    // Update button state from config
    this.updateButtonState();
  }
  
  /**
   * Toggle sleep mode on/off
   */
  async toggleSleepMode(e) {
    if (e) e.stopPropagation();
    
    const config = window.SleepyTubeConfig.get();
    const newState = !config.sleepModeEnabled;
    
    await window.SleepyTubeConfig.setValue('sleepModeEnabled', newState);
    
    if (newState) {
      await this.audioEngine.connect();
    } else {
      this.audioEngine.disconnect();
    }
    
    this.updateButtonState();
    
    // Update badge in extension icon
    chrome.runtime.sendMessage({
      type: 'UPDATE_BADGE',
      enabled: newState
    });
    
    window.SleepyTubeUtils.log('Sleep mode', newState ? 'enabled' : 'disabled');
  }
  
  /**
   * Update button visual state
   */
  updateButtonState() {
    if (!this.sleepModeButton) return;
    
    const isEnabled = window.SleepyTubeConfig.getValue('sleepModeEnabled');
    
    this.sleepModeButton.classList.toggle('sleepytube-active', isEnabled);
    this.sleepModeButton.setAttribute('aria-pressed', String(isEnabled));
    
    if (window.SleepyTubeUtils.isShortsPage()) {
      // Shorts button uses YouTube's built-in classes
      if (isEnabled) {
        this.sleepModeButton.classList.add('yt-spec-button-shape-next--overlay');
      } else {
        this.sleepModeButton.classList.remove('yt-spec-button-shape-next--overlay');
      }
    }
  }
  
  /**
   * Toggle control panel visibility
   */
  toggleControlPanel() {
    if (this.controlPanel && document.body.contains(this.controlPanel)) {
      this.closeControlPanel();
    } else {
      this.openControlPanel();
    }
  }
  
  /**
   * Open control panel
   */
  openControlPanel() {
    if (this.controlPanel && document.body.contains(this.controlPanel)) {
      return; // Already open
    }
    
    const panel = this.createControlPanel();
    const playerContainer = document.querySelector('.html5-video-player') || document.body;
    playerContainer.appendChild(panel);
    
    this.controlPanel = panel;
    
    // Fade in animation
    requestAnimationFrame(() => {
      panel.classList.add('sleepytube-panel-visible');
    });
  }
  
  /**
   * Close control panel
   */
  closeControlPanel() {
    if (!this.controlPanel) return;
    
    this.controlPanel.classList.remove('sleepytube-panel-visible');
    
    setTimeout(() => {
      if (this.controlPanel && this.controlPanel.parentElement) {
        this.controlPanel.remove();
      }
      this.controlPanel = null;
    }, 200); // Match CSS transition duration
  }
  
  /**
   * Create control panel UI
   */
  createControlPanel() {
    const panel = document.createElement('div');
    panel.id = 'sleepytube-panel';
    panel.className = 'sleepytube-panel';
    
    const config = window.SleepyTubeConfig.get();
    
    panel.innerHTML = `
      <div class="sleepytube-panel-header">
        <h3>SleepyTube</h3>
        <button class="sleepytube-close" aria-label="Close">&times;</button>
      </div>
      
      <div class="sleepytube-panel-content">
        <div class="sleepytube-section">
          <label class="sleepytube-label">
            <span>Sleep Mode</span>
            <div class="sleepytube-toggle">
              <input type="checkbox" id="sleepytube-mode-toggle" ${config.sleepModeEnabled ? 'checked' : ''}>
              <span class="sleepytube-toggle-slider"></span>
            </div>
          </label>
        </div>
        
        <div class="sleepytube-section">
          <label class="sleepytube-label">
            <span>Stability Level</span>
            <span class="sleepytube-value" id="sleepytube-strength-value">${config.compressionStrength}</span>
          </label>
          <div class="sleepytube-preset-group">
            <button class="sleepytube-preset ${config.compressionStrength === 'light' ? 'active' : ''}" data-preset="light">Light</button>
            <button class="sleepytube-preset ${config.compressionStrength === 'medium' ? 'active' : ''}" data-preset="medium">Medium</button>
            <button class="sleepytube-preset ${config.compressionStrength === 'strong' ? 'active' : ''}" data-preset="strong">Strong</button>
          </div>
        </div>
        
        <div class="sleepytube-section">
          <label class="sleepytube-label">
            <span>Sound Softening</span>
            <span class="sleepytube-value" id="sleepytube-eq-value">${config.eqPreset}</span>
          </label>
          <div class="sleepytube-preset-group">
            <button class="sleepytube-preset ${config.eqPreset === 'natural' ? 'active' : ''}" data-eq="natural">Natural</button>
            <button class="sleepytube-preset ${config.eqPreset === 'gentle' ? 'active' : ''}" data-eq="gentle">Gentle</button>
            <button class="sleepytube-preset ${config.eqPreset === 'ultra-soft' ? 'active' : ''}" data-eq="ultra-soft">Ultra Soft</button>
          </div>
        </div>
        
        <div class="sleepytube-section">
          <label class="sleepytube-label">
            <input type="checkbox" id="sleepytube-voice-focus" ${config.voiceFocusEnabled ? 'checked' : ''}>
            <span>Voice Focus Mode</span>
          </label>
          <div class="sleepytube-subsection ${config.voiceFocusEnabled ? '' : 'disabled'}" id="sleepytube-duck-section">
            <label class="sleepytube-label">
              <span>Background Ducking</span>
              <span class="sleepytube-value" id="sleepytube-duck-value">-${config.duckingAmount} dB</span>
            </label>
            <input type="range" class="sleepytube-slider" id="sleepytube-duck-slider" min="0" max="12" step="1" value="${config.duckingAmount}">
          </div>
        </div>
        
        <div class="sleepytube-section">
          <label class="sleepytube-label">
            <input type="checkbox" id="sleepytube-agc" ${config.autoGainEnabled ? 'checked' : ''}>
            <span>Auto Gain Control</span>
          </label>
        </div>
      </div>
    `;
    
    this.attachPanelListeners(panel);
    return panel;
  }
  
  /**
   * Attach event listeners to panel controls
   */
  attachPanelListeners(panel) {
    // Close button
    panel.querySelector('.sleepytube-close').addEventListener('click', () => {
      this.closeControlPanel();
    });
    
    // Click outside to close
    panel.addEventListener('click', (e) => {
      if (e.target === panel) {
        this.closeControlPanel();
      }
    });
    
    // Sleep mode toggle
    panel.querySelector('#sleepytube-mode-toggle').addEventListener('change', (e) => {
      this.toggleSleepMode();
    });
    
    // Compression strength presets
    panel.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const preset = e.target.dataset.preset;
        await window.SleepyTubeConfig.setValue('compressionStrength', preset);
        this.audioEngine.updateSettings({ compressionStrength: preset });
        
        // Update UI
        panel.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
     et.classList.add('active');
        panel.querySelector('#sleepytube-strength-value').textContent = preset;
      });
    });
    
    // EQ presets
    panel.querySelectorAll('[data-eq]').forEach(btn => {
      btn.addEventListener, async (e) => {
        const preset = e.target.dataset.eq;
        await window.SleepyTubeConfig.setValue('eqPreset', preset);
      this.audioEngine.updateSettings({ eqPreset: preset });
        
        // Update UI
        panel.querySelectorAll('[data-eq]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        panector('#sleepytube-eq-value').textContent = preset;
      });
    });
    
    // Voice focus toggle
    panel.querySelector('#sleepytube-voice-focus').addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      await dow.SleepyTubeConfig.setValue('voiceFocusEnabled', enabled);
      this.audioEngine.updateSettings({ voiceFocusEnabled: enabled });
      
      // Update ducking section
      const duckSection = panel.querySelector('#sleepytube-duck-section');
      if (enabled) {
        duckSection.classList.remove('disabled');
      } else {
        duckSection.classList.add('disabled');
      }
    });
    
    // Ducking slider
    panel.querySelector('#sleepytube-duck-slider').addEventListener('input', window.SleepyTubeUtils.debounce(async (e) => {
      const amount = parseInt(e.target.value);
      await window.SleepyTubeConfig.setValue('duckingAmount', amount);
      this.audioEngine.updateSettings({ duckingAmount: amount });
      panel.querySelector('#sleepytube-duck-value').textContent = `-${amount} dB`;
    }, 100));
    
    // AGC toggle
    panel.querySelector('#sleepytube-agc').addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      await window.SleepyTubeConfig.setValue('autoGainEnabled', enabled);
      this.audioEngine.updateSettings({ autoGainEnabled: enabled });
    });
  }
  
  /**
   * Update audio engine reference
   */
  updateAudioEngine(audioEngine) {
    this.audioEngine = audioEngine;
  }
}

// Export
window.UIManager = UIManager;
