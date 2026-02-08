/**
 * SleepyTube - Popup i18n Helper
 * Manually updates UI text based on language
 */

window.PopupI18n = {
  translations: {
    en: {
      scenes: {
        off: "OFF",
        sleep: "Sleep",
        podcast: "Podcast",
        movie: "Movie"
      },
      sceneDesc: {
        off: "All audio processing disabled",
        sleep: "Gentle, no surprises",
        podcast: "Voice clarity focused",
        movie: "Balanced experience"
      },
      settings: {
        stability: "Stability",
        sound: "Sound",
        voiceFocus: "Voice Focus",
        agc: "AGC",
        advanced: "Advanced Settings",
        audioProcessing: "Audio Processing",
        stabilityLevel: "Stability Level",
        light: "Light",
        medium: "Medium",
        strong: "Strong",
        soundCharacter: "Sound Character",
        natural: "Natural",
        gentle: "Gentle",
        soft: "Soft",
        voiceEnhancement: "Voice Enhancement",
        enhanceSpeech: "Enhance speech clarity",
        backgroundReduction: "Background Reduction",
        volumeControl: "Volume Control",
        autoGainControl: "Auto Gain Control",
        consistentLoudness: "Consistent loudness",
        targetLoudness: "Target Loudness",
        quiet: "Quiet",
        normal: "Normal",
        loud: "Loud",
        outputVolume: "Output Volume",
        speechRate: "Speech Rate",
        speechRateAdjustment: "Speech Rate Adjustment",
        autoAdjustSpeed: "Auto-adjust playback speed",
        targetSpeechRate: "Target Speech Rate",
        slow: "Slow",
        fast: "Fast",
        auto: "Auto",
        aiPredictor: "AI Video Predictor",
        enableAI: "Enable AI Video Prediction",
        predictQuality: "Predict audio quality before watching",
        provider: "AI Provider",
        gemini: "Gemini",
        openai: "OpenAI",
        apiKey: "API Key",
        enterApiKey: "Enter your API key",
        getKey: "Get free Gemini API key",
        badges: "Prediction Badges",
        showIndicators: "Show quality indicators on videos",
        cacheDuration: "Cache Duration",
        rememberPredictions: "How long to remember predictions"
      },
      waveform: {
        before: "Before",
        after: "After",
        speech: "Speech",
        speed: "Speed"
      }
    },
    zh: {
      scenes: {
        off: "关闭",
        sleep: "睡眠",
        podcast: "播客",
        movie: "电影"
      },
      sceneDesc: {
        off: "所有音频处理已禁用",
        sleep: "温和，无惊喜",
        podcast: "专注语音清晰度",
        movie: "平衡体验"
      },
      settings: {
        stability: "稳定性",
        sound: "音效",
        voiceFocus: "语音聚焦",
        agc: "自动增益",
        advanced: "高级设置",
        audioProcessing: "音频处理",
        stabilityLevel: "稳定程度",
        light: "轻度",
        medium: "中度",
        strong: "强力",
        soundCharacter: "声音特性",
        natural: "自然",
        gentle: "柔和",
        soft: "柔软",
        voiceEnhancement: "语音增强",
        enhanceSpeech: "增强语音清晰度",
        backgroundReduction: "背景降低",
        volumeControl: "音量控制",
        autoGainControl: "自动增益控制",
        consistentLoudness: "保持一致响度",
        targetLoudness: "目标响度",
        quiet: "安静",
        normal: "正常",
        loud: "响亮",
        outputVolume: "输出音量",
        speechRate: "语速",
        speechRateAdjustment: "语速调节",
        autoAdjustSpeed: "自动调整播放速度",
        targetSpeechRate: "目标语速",
        slow: "慢速",
        fast: "快速",
        auto: "自动",
        aiPredictor: "AI 视频预测",
        enableAI: "启用 AI 视频预测",
        predictQuality: "在观看前预测音频质量",
        provider: "AI 提供商",
        gemini: "Gemini",
        openai: "OpenAI",
        apiKey: "API 密钥",
        enterApiKey: "输入你的 API 密钥",
        getKey: "获取免费 Gemini API 密钥",
        badges: "预测徽章",
        showIndicators: "在视频上显示质量指示器",
        cacheDuration: "缓存时长",
        rememberPredictions: "记住预测的时间"
      },
      waveform: {
        before: "处理前",
        after: "处理后",
        speech: "语速",
        speed: "速度"
      }
    }
  },
  
  currentLang: 'en',
  
  /**
   * Initialize with current language
   */
  async init() {
    try {
      const result = await chrome.storage.local.get(['language']);
      this.currentLang = result.language || (navigator.language.startsWith('zh') ? 'zh' : 'en');
      this.applyTranslations();
    } catch (error) {
      console.error('[PopupI18n] Failed to load language:', error);
    }
  },
  
  /**
   * Set language and update UI
   */
  async setLanguage(lang) {
    this.currentLang = lang;
    await chrome.storage.local.set({ language: lang });
    this.applyTranslations();
  },
  
  /**
   * Get translation
   */
  t(key) {
    const keys = key.split('.');
    let value = this.translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value || key;
  },
  
  /**
   * Apply translations to popup
   */
  applyTranslations() {
    // Scene names
    const sceneNames = document.querySelectorAll('.scene-name');
    sceneNames.forEach(el => {
      const scene = el.closest('.scene-tab')?.dataset.scene;
      if (scene) {
        el.textContent = this.t(`scenes.${scene}`);
      }
    });
    
    // Scene description
    const sceneDesc = document.querySelector('.scene-desc-text');
    if (sceneDesc) {
      const activeScene = document.querySelector('.scene-tab.active')?.dataset.scene || 'off';
      sceneDesc.textContent = this.t(`sceneDesc.${activeScene}`);
    }
    
    // Setting labels in compact view
    const settingLabels = {
      'display-stability': 'settings.stability',
      'display-sound': 'settings.sound',
      'display-voice': 'settings.voiceFocus',
      'display-agc': 'settings.agc'
    };
    
    Object.entries(settingLabels).forEach(([id, key]) => {
      const label = document.querySelector(`#${id}`)?.previousElementSibling;
      if (label && label.classList.contains('setting-label-compact')) {
        label.textContent = this.t(key);
      }
    });
    
    // Advanced settings header
    const advancedHeader = document.querySelector('.advanced-header h2');
    if (advancedHeader) {
      advancedHeader.textContent = this.t('settings.advanced');
    }
    
    // Section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    const sectionKeys = [
      'settings.audioProcessing',
      'settings.voiceEnhancement',
      'settings.volumeControl',
      'settings.speechRate',
      'settings.aiPredictor'
    ];
    sectionTitles.forEach((el, index) => {
      if (sectionKeys[index]) {
        el.textContent = this.t(sectionKeys[index]);
      }
    });
    
    // Waveform labels
    const beforeLabel = document.querySelector('.waveform-label.before');
    const afterLabel = document.querySelector('.waveform-label.after');
    if (beforeLabel) beforeLabel.textContent = this.t('waveform.before');
    if (afterLabel) afterLabel.textContent = this.t('waveform.after');
    
    const speechLabel = document.querySelector('.rate-label');
    if (speechLabel && speechLabel.textContent.includes('Speech')) {
      speechLabel.textContent = this.t('waveform.speech') + ':';
    }
    
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) {
        const translation = this.t(key);
        if (translation !== key) { // Only replace if translation found
          el.textContent = translation;
        }
      }
    });
    
    // Translate setting labels (legacy support)
    const labelTranslations = {
      'Stability Level': 'settings.stabilityLevel',
      'Sound Character': 'settings.soundCharacter',
      'Voice Focus': 'settings.voiceFocus',
      'Background Reduction': 'settings.backgroundReduction',
      'Auto Gain Control': 'settings.autoGainControl',
      'Target Loudness': 'settings.targetLoudness',
      'Output Volume': 'settings.outputVolume',
      'Speech Rate Adjustment': 'settings.speechRateAdjustment',
      'Target Speech Rate': 'settings.targetSpeechRate',
      'Enable AI Video Prediction': 'settings.enableAI',
      'AI Provider': 'settings.provider',
      'API Key': 'settings.apiKey'
    };
    
    document.querySelectorAll('.setting-label, .row-label > span:first-child').forEach(el => {
      const text = el.textContent.trim();
      if (labelTranslations[text]) {
        el.textContent = this.t(labelTranslations[text]);
      }
    });
    
    // Translate hints
    document.querySelectorAll('.hint').forEach(el => {
      const text = el.textContent.trim();
      const hintTranslations = {
        'Enhance speech clarity': 'settings.enhanceSpeech',
        'Consistent loudness': 'settings.consistentLoudness',
        'Auto-adjust playback speed': 'settings.autoAdjustSpeed',
        'Predict audio quality before watching': 'settings.predictQuality'
      };
      
      if (hintTranslations[text]) {
        el.textContent = this.t(hintTranslations[text]);
      }
    });
    
    // Translate option buttons
    document.querySelectorAll('.option-label').forEach(el => {
      const text = el.textContent.trim().toLowerCase();
      const key = `settings.${text}`;
      const translation = this.t(key);
      if (translation !== key) {
        el.textContent = translation.charAt(0).toUpperCase() + translation.slice(1);
      }
    });
    
    console.log('[PopupI18n] Translations applied:', this.currentLang);
  },
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.PopupI18n.init();
  });
} else {
  window.PopupI18n.init();
}
