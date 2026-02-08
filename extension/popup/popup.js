/**
 * SleepyTube Popup with Scene Mode
 */

const DEFAULT_CONFIG = {
  sleepModeEnabled: false,
  currentScene: 'off',
  compressionStrength: 'medium',
  eqPreset: 'gentle',
  voiceFocusEnabled: false,
  duckingAmount: 9,
  autoGainEnabled: true,
  targetLoudness: -18,
  outputGain: 0,
  speechRateEnabled: false,
  targetSpeechRate: 'normal',
  aiPredictorEnabled: false,
  aiPredictorProvider: 'gemini',
  aiPredictorApiKey: '',
  aiPredictorBadgePosition: 'top-right',
  aiPredictorBadgeSize: 'small',
  miniWaveformEnabled: true
};

// Scene Presets
const SCENE_PRESETS = {
  off: {
    sleepModeEnabled: false,
    description: 'All audio processing disabled',
    settings: {
      compressionStrength: 'medium',
      eqPreset: 'gentle',
      voiceFocusEnabled: false,
      autoGainEnabled: false,
      targetLoudness: -18,
      outputGain: 0,
      speechRateEnabled: false
    }
  },
  sleep: {
    sleepModeEnabled: true,
    description: 'Maximum stability • Soft sound • Perfect for bedtime',
    settings: {
      compressionStrength: 'strong',
      eqPreset: 'ultra-soft',
      voiceFocusEnabled: false,
      autoGainEnabled: true,
      targetLoudness: -21,
      outputGain: -3,
      speechRateEnabled: false
    }
  },
  podcast: {
    sleepModeEnabled: true,
    description: 'Voice clarity • Background reduction • Great for interviews',
    settings: {
      compressionStrength: 'medium',
      eqPreset: 'gentle',
      voiceFocusEnabled: true,
      duckingAmount: 9,
      autoGainEnabled: true,
      targetLoudness: -18,
      outputGain: 0,
      speechRateEnabled: true,
      targetSpeechRate: 'normal'
    }
  },
  movie: {
    sleepModeEnabled: true,
    description: 'Strong compression • Prevents sudden loud sounds',
    settings: {
      compressionStrength: 'strong',
      eqPreset: 'gentle',
      voiceFocusEnabled: false,
      autoGainEnabled: true,
      targetLoudness: -18,
      outputGain: 0,
      speechRateEnabled: false
    }
  }
};

let currentConfig = { ...DEFAULT_CONFIG };
let currentTab = null;
let waveformCanvas = null;
let waveformCtx = null;
let renderInterval = null;

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', async () => {
  [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Setup waveform canvas
  setupWaveformCanvas();
  
  await loadConfig();
  setupEventListeners();
  updateUI();
  updateSceneUI();
  
  // Start waveform rendering if on YouTube
  if (currentTab && currentTab.url && currentTab.url.includes('youtube.com')) {
    startWaveformRendering();
    // Always start speech rate monitoring to update the display
    startSpeechRateMonitoring();
  }
});

// ===== Waveform Canvas Setup =====
function setupWaveformCanvas() {
  waveformCanvas = document.getElementById('popup-waveform-canvas');
  if (!waveformCanvas) return;
  
  waveformCtx = waveformCanvas.getContext('2d');
  
  const dpr = window.devicePixelRatio || 1;
  const width = 400;
  const height = 120;
  
  waveformCanvas.width = width * dpr;
  waveformCanvas.height = height * dpr;
  waveformCanvas.style.width = width + 'px';
  waveformCanvas.style.height = height + 'px';
  
  waveformCtx.scale(dpr, dpr);
}

// ===== Start Waveform Rendering =====
function startWaveformRendering() {
  if (renderInterval) return;
  
  renderInterval = setInterval(() => {
    if (!currentTab || !currentTab.url || !currentTab.url.includes('youtube.com')) {
      drawEmptyWaveform();
      return;
    }
    
    chrome.tabs.sendMessage(currentTab.id, { type: 'GET_WAVEFORM_DATA' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        drawEmptyWaveform();
      } else if (response.beforeData && response.afterData) {
        drawWaveforms(response.beforeData, response.afterData);
      } else {
        drawEmptyWaveform();
      }
    });
  }, 50);
}

// ===== Draw Empty Waveform =====
function drawEmptyWaveform() {
  if (!waveformCtx) return;
  
  const width = 400;
  const height = 120;
  
  waveformCtx.fillStyle = '#f5f5f5';
  waveformCtx.fillRect(0, 0, width, height);
  
  waveformCtx.strokeStyle = '#ddd';
  waveformCtx.lineWidth = 1;
  waveformCtx.beginPath();
  waveformCtx.moveTo(0, height / 2);
  waveformCtx.lineTo(width, height / 2);
  waveformCtx.stroke();
  
  waveformCtx.fillStyle = '#999';
  waveformCtx.font = '12px -apple-system, sans-serif';
  waveformCtx.textAlign = 'center';
  waveformCtx.fillText('Open a YouTube video to see live waveform', width / 2, height / 2 + 4);
}

// ===== Draw Waveforms =====
function drawWaveforms(beforeData, afterData) {
  if (!waveformCtx) return;
  
  const width = 400;
  const height = 120;
  
  waveformCtx.fillStyle = '#f5f5f5';
  waveformCtx.fillRect(0, 0, width, height);
  
  waveformCtx.strokeStyle = '#ddd';
  waveformCtx.lineWidth = 1;
  waveformCtx.beginPath();
  waveformCtx.moveTo(0, height / 2);
  waveformCtx.lineTo(width, height / 2);
  waveformCtx.stroke();
  
  drawSingleWaveform(beforeData, 0, height / 2, '#f44336', 0.8);
  drawSingleWaveform(afterData, height / 2, height / 2, '#4CAF50', 0.8);
}

// ===== Draw Single Waveform =====
function drawSingleWaveform(data, offsetY, availableHeight, color, alpha) {
  if (!data || data.length === 0) return;
  
  const width = 400;
  const sliceWidth = width / data.length;
  const centerY = offsetY + availableHeight / 2;
  
  waveformCtx.strokeStyle = color;
  waveformCtx.globalAlpha = alpha;
  waveformCtx.lineWidth = 1.5;
  waveformCtx.beginPath();
  
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    const y = centerY + (v * availableHeight * 0.8);
    
    if (i === 0) {
      waveformCtx.moveTo(x, y);
    } else {
      waveformCtx.lineTo(x, y);
    }
    
    x += sliceWidth;
  }
  
  waveformCtx.stroke();
  waveformCtx.globalAlpha = 1.0;
  
  waveformCtx.globalAlpha = 0.2;
  waveformCtx.fillStyle = color;
  waveformCtx.beginPath();
  waveformCtx.moveTo(0, centerY);
  
  x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i];
    const y = centerY + (v * availableHeight * 0.8);
    waveformCtx.lineTo(x, y);
    x += sliceWidth;
  }
  
  waveformCtx.lineTo(width, centerY);
  waveformCtx.closePath();
  waveformCtx.fill();
  waveformCtx.globalAlpha = 1.0;
}

// ===== Load Configuration =====
async function loadConfig() {
  try {
    const stored = await chrome.storage.sync.get(Object.keys(DEFAULT_CONFIG));
    currentConfig = { ...DEFAULT_CONFIG, ...stored };
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// ===== Save Configuration =====
async function saveConfig(updates) {
  try {
    currentConfig = { ...currentConfig, ...updates };
    await chrome.storage.sync.set(updates);
    
    if (currentTab && currentTab.url && currentTab.url.includes('youtube.com')) {
      try {
        await chrome.tabs.sendMessage(currentTab.id, {
          type: 'CONFIG_UPDATED',
          config: currentConfig
        });
      } catch (e) {
        // Content script not ready
      }
    }
  } catch (error) {
    console.error('Failed to save config:', error);
  }
}

// ===== Apply Scene Preset =====
async function applyScenePreset(sceneName) {
  const preset = SCENE_PRESETS[sceneName];
  if (!preset) return;
  
  // Preserve user's speech rate settings
  const preservedSpeechSettings = {
    speechRateEnabled: currentConfig.speechRateEnabled,
    targetSpeechRate: currentConfig.targetSpeechRate
  };
  
  const updates = {
    currentScene: sceneName,
    sleepModeEnabled: preset.sleepModeEnabled,
    ...preset.settings,
    // Restore speech rate settings
    ...preservedSpeechSettings
  };
  
  await saveConfig(updates);
  updateUI();
  updateSceneUI();
  updateCurrentSettingsDisplay();
  
  // Notify content script to update player button state
  if (currentTab && currentTab.url && currentTab.url.includes('youtube.com')) {
    try {
      await chrome.tabs.sendMessage(currentTab.id, {
        type: 'UPDATE_PLAYER_BUTTON',
        enabled: preset.sleepModeEnabled
      });
    } catch (e) {
      // Content script not ready
      console.log('Could not update player button:', e);
    }
  }
}

// ===== Update Scene UI =====
function updateSceneUI() {
  const currentScene = currentConfig.currentScene || 'off';
  
  // Update tab buttons
  document.querySelectorAll('.scene-tab').forEach(tab => {
    const scene = tab.dataset.scene;
    tab.classList.toggle('active', scene === currentScene);
  });
  
  // Update description
  const preset = SCENE_PRESETS[currentScene];
  if (preset) {
    document.getElementById('scene-description').querySelector('.scene-desc-text').textContent = preset.description;
  }
}

// ===== Update Current Settings Display =====
function updateCurrentSettingsDisplay() {
  const stability = currentConfig.compressionStrength;
  const sound = currentConfig.eqPreset;
  const voice = currentConfig.voiceFocusEnabled ? 'ON' : 'OFF';
  const agc = currentConfig.autoGainEnabled ? 'ON' : 'OFF';
  
  document.getElementById('display-stability').textContent = 
    currentConfig.sleepModeEnabled ? stability.charAt(0).toUpperCase() + stability.slice(1) : '—';
  document.getElementById('display-sound').textContent = 
    currentConfig.sleepModeEnabled ? sound.charAt(0).toUpperCase() + sound.slice(1) : '—';
  document.getElementById('display-voice').textContent = 
    currentConfig.sleepModeEnabled ? voice : '—';
  document.getElementById('display-agc').textContent = 
    currentConfig.sleepModeEnabled ? agc : '—';
}

// ===== Event Listeners =====
function setupEventListeners() {
  // Scene tabs
  document.querySelectorAll('.scene-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const scene = tab.dataset.scene;
      applyScenePreset(scene);
    });
  });
  
  // Settings button
  document.getElementById('settings-btn').addEventListener('click', () => {
    document.getElementById('advanced-settings-overlay').classList.add('show');
  });
  
  // Close settings
  document.getElementById('close-settings').addEventListener('click', () => {
    document.getElementById('advanced-settings-overlay').classList.remove('show');
  });
  
  // Close on overlay click
  document.getElementById('advanced-settings-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'advanced-settings-overlay') {
      document.getElementById('advanced-settings-overlay').classList.remove('show');
    }
  });
  
  // Option Buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const setting = btn.dataset.setting;
      const value = btn.dataset.value;
      
      // Switch to custom scene when manually adjusting
      await saveConfig({ 
        [setting]: value,
        currentScene: 'custom'
      });
      
      document.querySelectorAll(`[data-setting="${setting}"]`).forEach(b => {
        b.classList.toggle('active', b.dataset.value === value);
      });
      
      updateCurrentSettingsDisplay();
    });
  });
  
  // Voice Focus Toggle
  document.getElementById('voice-focus-toggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await saveConfig({ 
      voiceFocusEnabled: enabled,
      currentScene: 'custom'
    });
    document.getElementById('ducking-container').style.display = enabled ? 'block' : 'none';
    updateCurrentSettingsDisplay();
  });
  
  // Ducking Slider
  const duckingSlider = document.getElementById('ducking-slider');
  duckingSlider.addEventListener('input', (e) => {
    document.getElementById('ducking-value').textContent = `-${e.target.value} dB`;
  });
  duckingSlider.addEventListener('change', async (e) => {
    await saveConfig({ 
      duckingAmount: parseInt(e.target.value),
      currentScene: 'custom'
    });
  });
  
  // AGC Toggle
  document.getElementById('agc-toggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await saveConfig({ 
      autoGainEnabled: enabled,
      currentScene: 'custom'
    });
    document.getElementById('loudness-container').style.display = enabled ? 'block' : 'none';
    updateCurrentSettingsDisplay();
  });
  
  // Loudness Slider
  const loudnessSlider = document.getElementById('loudness-slider');
  loudnessSlider.addEventListener('input', (e) => {
    document.getElementById('loudness-value').textContent = `${e.target.value} LUFS`;
  });
  loudnessSlider.addEventListener('change', async (e) => {
    await saveConfig({ 
      targetLoudness: parseInt(e.target.value),
      currentScene: 'custom'
    });
  });
  
  // Output Slider
  const outputSlider = document.getElementById('output-slider');
  outputSlider.addEventListener('input', (e) => {
    const value = parseInt(e.target.value);
    document.getElementById('output-value').textContent = `${value >= 0 ? '+' : ''}${value} dB`;
  });
  outputSlider.addEventListener('change', async (e) => {
    await saveConfig({ 
      outputGain: parseInt(e.target.value),
      currentScene: 'custom'
    });
  });
  
  // Speech Rate Toggle
  document.getElementById('speech-rate-toggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await saveConfig({ 
      speechRateEnabled: enabled,
      currentScene: 'custom'
    });
    document.getElementById('speech-rate-container').style.display = enabled ? 'block' : 'none';
    updateCurrentSettingsDisplay();
  });
  
  // Start monitoring speech rate when enabled
  if (document.getElementById('speech-rate-toggle').checked) {
    startSpeechRateMonitoring();
  }
  
  // AI Predictor Toggle
  document.getElementById('ai-predictor-toggle').addEventListener('change', async (e) => {
    const enabled = e.target.checked;
    await saveConfig({ 
      aiPredictorEnabled: enabled,
      currentScene: 'custom'
    });
    document.getElementById('ai-predictor-container').style.display = enabled ? 'block' : 'none';
    updateAIStatus();
  });
  
  // AI API Key Input
  const apiKeyInput = document.getElementById('ai-api-key');
  apiKeyInput.addEventListener('change', async (e) => {
    await saveConfig({ 
      aiPredictorApiKey: e.target.value,
      currentScene: 'custom'
    });
    updateAIStatus();
  });
  
  // Update "Get API key" link based on provider
  function updateApiKeyLink() {
    const provider = currentConfig.aiPredictorProvider;
    const link = document.getElementById('get-api-key-link');
    if (provider === 'gemini') {
      link.href = 'https://makersuite.google.com/app/apikey';
      link.textContent = 'Get free Gemini API key';
    } else {
      link.href = 'https://platform.openai.com/api-keys';
      link.textContent = 'Get OpenAI API key';
    }
  }
  updateApiKeyLink();
  
  // Help Link
  document.getElementById('help-link').addEventListener('click', (e) => {
    e.preventDefault();
    chrome.tabs.create({ url: 'https://github.com/IRONICBo/sleepytube#readme' });
  });
  
  // Language Selector
  const languageSelect = document.getElementById('popup-language-select');
  if (languageSelect && window.PopupI18n) {
    // Set current language
    languageSelect.value = window.PopupI18n.currentLang;
    
    // Listen for language changes
    languageSelect.addEventListener('change', async (e) => {
      const newLang = e.target.value;
      await window.PopupI18n.setLanguage(newLang);
      
      // Also update scene description
      updateSceneUI();
    });
  }
  
  // ===== Collapsible Sections =====
  document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
      const section = header.closest('.setting-section');
      section.classList.toggle('collapsed');
    });
  });
  
  // Collapse all sections by default except first one
  document.querySelectorAll('.setting-section.collapsible').forEach((section, index) => {
    if (index > 0) {
      section.classList.add('collapsed');
    }
  });
}

// ===== Update UI =====
function updateUI() {
  // Option buttons
  document.querySelectorAll('.option-btn').forEach(btn => {
    const setting = btn.dataset.setting;
    const value = btn.dataset.value;
    btn.classList.toggle('active', currentConfig[setting] === value);
  });
  
  // Voice Focus
  document.getElementById('voice-focus-toggle').checked = currentConfig.voiceFocusEnabled;
  document.getElementById('ducking-container').style.display = currentConfig.voiceFocusEnabled ? 'block' : 'none';
  document.getElementById('ducking-slider').value = currentConfig.duckingAmount;
  document.getElementById('ducking-value').textContent = `-${currentConfig.duckingAmount} dB`;
  
  // AGC
  document.getElementById('agc-toggle').checked = currentConfig.autoGainEnabled;
  document.getElementById('loudness-container').style.display = currentConfig.autoGainEnabled ? 'block' : 'none';
  document.getElementById('loudness-slider').value = currentConfig.targetLoudness;
  document.getElementById('loudness-value').textContent = `${currentConfig.targetLoudness} LUFS`;
  
  // Output
  document.getElementById('output-slider').value = currentConfig.outputGain;
  const sign = currentConfig.outputGain >= 0 ? '+' : '';
  document.getElementById('output-value').textContent = `${sign}${currentConfig.outputGain} dB`;
  
  // Speech Rate
  document.getElementById('speech-rate-toggle').checked = currentConfig.speechRateEnabled;
  document.getElementById('speech-rate-container').style.display = currentConfig.speechRateEnabled ? 'block' : 'none';
  
  // AI Predictor
  document.getElementById('ai-predictor-toggle').checked = currentConfig.aiPredictorEnabled;
  document.getElementById('ai-predictor-container').style.display = currentConfig.aiPredictorEnabled ? 'block' : 'none';
  document.getElementById('ai-api-key').value = currentConfig.aiPredictorApiKey || '';
  
  // AI Status Indicator
  updateAIStatus();
  
  updateCurrentSettingsDisplay();
}

// ===== Update AI Status =====
function updateAIStatus() {
  const statusIndicator = document.getElementById('ai-status-indicator');
  const statusText = document.getElementById('ai-status-text');
  const providerText = document.getElementById('ai-provider-text');
  const apiKeyText = document.getElementById('ai-apikey-text');
  
  if (!currentConfig.aiPredictorEnabled) {
    statusIndicator.style.display = 'none';
    return;
  }
  
  statusIndicator.style.display = 'block';
  
  // Check configuration status
  const hasApiKey = currentConfig.aiPredictorApiKey && currentConfig.aiPredictorApiKey.length > 0;
  const provider = currentConfig.aiPredictorProvider || 'gemini';
  
  // Update provider
  providerText.textContent = provider === 'gemini' ? 'Gemini (Free)' : 'OpenAI (Paid)';
  
  // Update API key status
  if (hasApiKey) {
    const keyPreview = currentConfig.aiPredictorApiKey.substring(0, 8) + '...';
    apiKeyText.textContent = keyPreview;
    apiKeyText.classList.remove('status-error', 'status-warning');
    apiKeyText.classList.add('status-working');
  } else {
    apiKeyText.textContent = 'Not configured';
    apiKeyText.classList.remove('status-working');
    apiKeyText.classList.add('status-error');
  }
  
  // Update overall status
  if (hasApiKey) {
    statusText.textContent = '✅ Ready';
    statusText.classList.remove('status-error', 'status-warning');
    statusText.classList.add('status-working');
  } else {
    statusText.textContent = '⚠️ No API key';
    statusText.classList.remove('status-working');
    statusText.classList.add('status-warning');
  }
}

// ===== Storage Listener =====
chrome.storage.onChanged.addListener(async () => {
  await loadConfig();
  updateUI();
  updateSceneUI();
});

// ===== Speech Rate Monitoring =====
let speechRateMonitor = null;

function startSpeechRateMonitoring() {
  if (speechRateMonitor) return;
  
  speechRateMonitor = setInterval(async () => {
    // Request speech rate status from content script
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'getSpeechRateStatus' }, (response) => {
        // Ignore connection errors (content script not ready)
        if (chrome.runtime.lastError) {
          // Hide speech rate info if content script not available
          const rateInfo = document.getElementById('speech-rate-info');
          if (rateInfo) {
            rateInfo.style.display = 'none';
          }
          return;
        }
        
        if (response && response.status) {
          const { detected, playbackRate, enabled } = response.status;
          
          // Show/hide the rate info under waveform
          const rateInfo = document.getElementById('speech-rate-info');
          if (rateInfo) {
            rateInfo.style.display = enabled ? 'flex' : 'none';
            // Debug: log status
            console.log('Speech rate status:', { enabled, detected, playbackRate });
          }
          
          // Update waveform area display
          const popupDetectedRate = document.getElementById('popup-detected-rate');
          const popupPlaybackSpeed = document.getElementById('popup-playback-speed');
          
          if (detected && detected.syllablesPerSecond > 0) {
            const rate = detected.syllablesPerSecond.toFixed(1);
            const category = detected.category;
            
            // Update settings panel (if exists)
            const settingsPanelRate = document.getElementById('detected-rate');
            if (settingsPanelRate) {
              settingsPanelRate.textContent = `${rate} syl/s (${category})`;
            }
            
            // Update waveform area
            if (popupDetectedRate) {
              popupDetectedRate.textContent = `${rate} syl/s (${category})`;
            }
          } else {
            // Update settings panel (if exists)
            const settingsPanelRate = document.getElementById('detected-rate');
            if (settingsPanelRate) {
              settingsPanelRate.textContent = '—';
            }
            
            // Update waveform area
            if (popupDetectedRate) {
              popupDetectedRate.textContent = '—';
            }
          }
          
          if (playbackRate !== undefined && playbackRate !== null) {
            // Update settings panel (if exists)
            const settingsPanelSpeed = document.getElementById('playback-rate');
            if (settingsPanelSpeed) {
              settingsPanelSpeed.textContent = `${playbackRate.toFixed(2)}x`;
            }
            
            // Update waveform area
            if (popupPlaybackSpeed) {
              popupPlaybackSpeed.textContent = `${playbackRate.toFixed(2)}x`;
            }
          }
        }
      });
    }
  }, 1000); // Update every second
}

function stopSpeechRateMonitoring() {
  if (speechRateMonitor) {
    clearInterval(speechRateMonitor);
    speechRateMonitor = null;
  }
}

// ===== Cleanup on close =====
window.addEventListener('unload', () => {
  stopSpeechRateMonitoring();
  if (renderInterval) {
    clearInterval(renderInterval);
  }
});
