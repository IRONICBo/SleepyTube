/**
 * SleepyTube - Internationalization (i18n) System
 * Full translation definitions for English and Chinese
 */

const translations = {
  en: {
    // Onboarding Progress Steps
    onboarding: {
      step1: "Welcome",
      step2: "Scene",
      step3: "AI Setup",
      step4: "Ready",
      
      // Slide 1: Welcome
      welcome: {
        title: "Welcome to SleepyTube! 😴",
        description: "Transform YouTube into a sleep-safe audio experience. No more sudden volume spikes or jarring sounds that wake you up.",
        feature1: "Smooth volume control",
        feature2: "Gentle sound processing",
        feature3: "AI quality prediction"
      },
      
      // Language Selection (Slide 1)
      language: {
        title: "Choose your language:",
        english: "English",
        chinese: "中文"
      },
      
      // Slide 2: Scene Selection
      scene: {
        title: "Choose Your Scene",
        description: "Select a preset optimized for your listening scenario. You can always change this later.",
        sleep: {
          title: "Sleep",
          description: "Ultra-gentle, no surprises"
        },
        podcast: {
          title: "Podcast",
          description: "Voice clarity focused"
        },
        movie: {
          title: "Movie",
          description: "Balanced experience"
        },
        skipNotice: "You can skip this and configure manually later in settings."
      },
      
      // Slide 3: API Configuration
      api: {
        title: "AI Video Predictor",
        description: "Optional: Enable AI to predict video audio quality before you watch. Get badges showing potential issues.",
        provider: "Choose Provider",
        apiKey: "API Key",
        apiKeyPlaceholder: "Enter your API key (optional)",
        helpText: "Get API key:",
        getKey: "Click here →",
        skipNotice: "No API key? No problem! Skip this step and add it later. The extension works great without AI predictions."
      },
      
      // Slide 4: Ready
      ready: {
        title: "You're All Set! 🎉",
        description: "SleepyTube is ready to make your YouTube experience sleep-safe. Here's what to do next:",
        step1: {
          title: "Open YouTube",
          description: "Visit any video page"
        },
        step2: {
          title: "Click SleepyTube Button",
          description: "Look for the button in player controls"
        },
        step3: {
          title: "Enjoy Safe Audio",
          description: "Relax and sleep peacefully"
        },
        language: "Language:"
      },
      
      // Navigation
      nav: {
        back: "Back",
        next: "Next",
        skip: "Skip",
        finish: "Get Started"
      }
    },
    
    // Popup Settings
    popup: {
      title: "SleepyTube Settings",
      
      // Main Toggle
      toggle: {
        sleepMode: "Sleep Mode",
        enabled: "Enabled",
        disabled: "Disabled"
      },
      
      // Scene Presets
      scenes: {
        title: "Quick Presets",
        sleep: "Sleep",
        sleepDesc: "Gentle, no surprises",
        podcast: "Podcast",
        podcastDesc: "Voice clarity",
        movie: "Movie",
        movieDesc: "Balanced experience",
        custom: "Custom",
        customDesc: "Manual control"
      },
      
      // Audio Controls
      audio: {
        compression: "Compression",
        compressionDesc: "How much to smooth volume",
        light: "Light",
        medium: "Medium",
        strong: "Strong",
        
        loudness: "Target Loudness",
        loudnessDesc: "Overall volume level",
        
        gain: "Output Gain",
        gainDesc: "Final volume boost",
        
        eq: "Equalizer",
        eqDesc: "Sound profile",
        flat: "Flat",
        gentle: "Gentle",
        warm: "Warm"
      },
      
      // Voice Focus
      voice: {
        title: "Voice Focus",
        enabled: "Enhance Speech",
        ducking: "Background Reduction",
        duckingDesc: "Lower music during speech"
      },
      
      // Advanced Features
      advanced: {
        title: "Advanced",
        autoGain: "Auto Gain Control",
        autoGainDesc: "Automatic volume adjustment",
        limiter: "Hard Limiter",
        limiterDesc: "Prevent audio clipping",
        speechRate: "Auto Speech Speed",
        speechRateDesc: "Slow down fast talking"
      },
      
      // AI Predictor
      ai: {
        title: "AI Video Predictor",
        enabled: "Enable AI Prediction",
        provider: "AI Provider",
        gemini: "Gemini",
        openai: "OpenAI",
        apiKey: "API Key",
        apiKeyPlaceholder: "Enter your API key",
        getKey: "Get Gemini Key",
        
        badges: "Prediction Badges",
        badgesDesc: "Show quality indicators on videos",
        
        cache: "Cache Duration",
        cacheDesc: "How long to remember predictions",
        
        status: {
          ready: "✓ Ready",
          noKey: "⚠ No API key",
          error: "✗ Error"
        }
      },
      
      // Language Settings
      language: {
        title: "Language",
        select: "Select Language",
        en: "English",
        zh: "中文"
      },
      
      // Footer
      footer: {
        version: "Version",
        docs: "Documentation",
        support: "Support",
        reset: "Reset to Defaults"
      }
    },
    
    // Video Badge
    badge: {
      analyzing: "Analyzing...",
      safe: "Sleep Safe",
      caution: "Check Issues",
      warning: "Not Recommended",
      
      issues: {
        background_music: "Background music",
        volume_inconsistent: "Volume changes",
        sudden_sounds: "Sudden sounds",
        fast_speech: "Fast speech",
        high_pitch: "High pitch",
        other: "Other issues"
      },
      
      confidence: "Confidence",
      cachedAt: "Cached",
      clickToRefresh: "Click to refresh"
    },
    
    // Error Messages
    errors: {
      apiKeyRequired: "Please enter an API key",
      apiKeyInvalid: "Invalid API key format",
      networkError: "Network error. Please check your connection.",
      quotaExceeded: "API quota exceeded. Try again later.",
      analysisFailedFallback: "Analysis failed. Video may be safe to watch.",
      storageError: "Failed to save settings",
      unknownError: "An unknown error occurred"
    },
    
    // Success Messages
    success: {
      settingsSaved: "Settings saved successfully",
      apiKeyValidated: "API key validated",
      cacheCleared: "Cache cleared",
      resetComplete: "Settings reset to defaults"
    }
  },
  
  zh: {
    // 引导进度步骤
    onboarding: {
      step1: "欢迎",
      step2: "场景",
      step3: "AI 设置",
      step4: "完成",
      
      // 幻灯片 1: 欢迎
      welcome: {
        title: "欢迎使用 SleepyTube! 😴",
        description: "将 YouTube 转变为睡眠安全的音频体验。不再有突然的音量尖峰或刺耳的声音把你吵醒。",
        feature1: "平滑音量控制",
        feature2: "温和声音处理",
        feature3: "AI 质量预测"
      },
      
      // 语言选择（幻灯片 1）
      language: {
        title: "选择你的语言:",
        english: "English",
        chinese: "中文"
      },
      
      // 幻灯片 2: 场景选择
      scene: {
        title: "选择你的场景",
        description: "选择一个针对你的收听场景优化的预设。你随时可以在设置中更改。",
        sleep: {
          title: "睡眠",
          description: "超温和，无惊喜"
        },
        podcast: {
          title: "播客",
          description: "专注语音清晰度"
        },
        movie: {
          title: "电影",
          description: "平衡体验"
        },
        skipNotice: "你可以跳过此步骤，稍后在设置中手动配置。"
      },
      
      // 幻灯片 3: API 配置
      api: {
        title: "AI 视频预测",
        description: "可选：启用 AI 在观看前预测视频音频质量。获取显示潜在问题的徽章。",
        provider: "选择提供商",
        apiKey: "API 密钥",
        apiKeyPlaceholder: "输入你的 API 密钥（可选）",
        helpText: "获取 API 密钥：",
        getKey: "点击这里 →",
        skipNotice: "没有 API 密钥？没问题！跳过此步骤，稍后添加。扩展在没有 AI 预测的情况下也能很好地工作。"
      },
      
      // 幻灯片 4: 准备就绪
      ready: {
        title: "一切就绪! 🎉",
        description: "SleepyTube 已准备好让你的 YouTube 体验更安全。接下来该做什么:",
        step1: {
          title: "打开 YouTube",
          description: "访问任何视频页面"
        },
        step2: {
          title: "点击 SleepyTube 按钮",
          description: "在播放器控件中寻找按钮"
        },
        step3: {
          title: "享受安全音频",
          description: "放松并安然入睡"
        },
        language: "语言:"
      },
      
      // 导航
      nav: {
        back: "返回",
        next: "下一步",
        skip: "跳过",
        finish: "开始使用"
      }
    },
    
    // 弹出设置
    popup: {
      title: "SleepyTube 设置",
      
      // 主开关
      toggle: {
        sleepMode: "睡眠模式",
        enabled: "已启用",
        disabled: "已禁用"
      },
      
      // 场景预设
      scenes: {
        title: "快速预设",
        sleep: "睡眠",
        sleepDesc: "温和，无惊喜",
        podcast: "播客",
        podcastDesc: "语音清晰",
        movie: "电影",
        movieDesc: "平衡体验",
        custom: "自定义",
        customDesc: "手动控制"
      },
      
      // 音频控制
      audio: {
        compression: "压缩",
        compressionDesc: "音量平滑程度",
        light: "轻度",
        medium: "中度",
        strong: "强力",
        
        loudness: "目标响度",
        loudnessDesc: "整体音量水平",
        
        gain: "输出增益",
        gainDesc: "最终音量提升",
        
        eq: "均衡器",
        eqDesc: "声音配置",
        flat: "平坦",
        gentle: "柔和",
        warm: "温暖"
      },
      
      // 语音聚焦
      voice: {
        title: "语音聚焦",
        enabled: "增强语音",
        ducking: "背景降低",
        duckingDesc: "语音时降低音乐"
      },
      
      // 高级功能
      advanced: {
        title: "高级",
        autoGain: "自动增益控制",
        autoGainDesc: "自动音量调整",
        limiter: "硬限制器",
        limiterDesc: "防止音频削波",
        speechRate: "自动语速",
        speechRateDesc: "减慢快速说话"
      },
      
      // AI 预测器
      ai: {
        title: "AI 视频预测",
        enabled: "启用 AI 预测",
        provider: "AI 提供商",
        gemini: "Gemini",
        openai: "OpenAI",
        apiKey: "API 密钥",
        apiKeyPlaceholder: "输入你的 API 密钥",
        getKey: "获取 Gemini 密钥",
        
        badges: "预测徽章",
        badgesDesc: "在视频上显示质量指示器",
        
        cache: "缓存时长",
        cacheDesc: "记住预测的时间",
        
        status: {
          ready: "✓ 就绪",
          noKey: "⚠ 无 API 密钥",
          error: "✗ 错误"
        }
      },
      
      // 语言设置
      language: {
        title: "语言",
        select: "选择语言",
        en: "English",
        zh: "中文"
      },
      
      // 页脚
      footer: {
        version: "版本",
        docs: "文档",
        support: "支持",
        reset: "重置为默认"
      }
    },
    
    // 视频徽章
    badge: {
      analyzing: "分析中...",
      safe: "睡眠安全",
      caution: "检查问题",
      warning: "不推荐",
      
      issues: {
        background_music: "背景音乐",
        volume_inconsistent: "音量变化",
        sudden_sounds: "突然声音",
        fast_speech: "快速语音",
        high_pitch: "高音调",
        other: "其他问题"
      },
      
      confidence: "置信度",
      cachedAt: "已缓存",
      clickToRefresh: "点击刷新"
    },
    
    // 错误消息
    errors: {
      apiKeyRequired: "请输入 API 密钥",
      apiKeyInvalid: "无效的 API 密钥格式",
      networkError: "网络错误。请检查你的连接。",
      quotaExceeded: "API 配额已超出。请稍后重试。",
      analysisFailedFallback: "分析失败。视频可能可以安全观看。",
      storageError: "保存设置失败",
      unknownError: "发生未知错误"
    },
    
    // 成功消息
    success: {
      settingsSaved: "设置保存成功",
      apiKeyValidated: "API 密钥已验证",
      cacheCleared: "缓存已清除",
      resetComplete: "设置已重置为默认"
    }
  }
};

/**
 * I18n Class - Handles internationalization
 */
class I18n {
  constructor() {
    this.currentLang = 'en';
    this.loadLanguage();
  }
  
  /**
   * Load language preference or detect browser language
   */
  async loadLanguage() {
    try {
      const result = await chrome.storage.local.get(['language']);
      this.currentLang = result.language || this.detectBrowserLanguage();
      this.applyTranslations();
    } catch (error) {
      console.error('[I18n] Failed to load language:', error);
      this.currentLang = this.detectBrowserLanguage();
      this.applyTranslations();
    }
  }
  
  /**
   * Detect browser language
   */
  detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('zh') ? 'zh' : 'en';
  }
  
  /**
   * Set language and save preference
   */
  async setLanguage(lang) {
    if (!translations[lang]) {
      console.warn(`[I18n] Language '${lang}' not supported, falling back to 'en'`);
      lang = 'en';
    }
    
    this.currentLang = lang;
    
    try {
      await chrome.storage.local.set({ language: lang });
    } catch (error) {
      console.error('[I18n] Failed to save language preference:', error);
    }
    
    this.applyTranslations();
    
    // Trigger event for other parts of the extension
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
  
  /**
   * Get translation by key path (e.g., "onboarding.welcome.title")
   */
  get(key, params = {}) {
    const keys = key.split('.');
    let value = translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        console.warn(`[I18n] Translation key not found: ${key}`);
        return key;
      }
    }
    
    // Replace parameters like {name}, {count}, etc.
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] !== undefined ? params[param] : match;
      });
    }
    
    return value || key;
  }
  
  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.get(key);
      
      if (typeof translation === 'string') {
        // Handle input placeholders
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password')) {
          element.placeholder = translation;
        } 
        // Handle select options
        else if (element.tagName === 'OPTION') {
          element.textContent = translation;
        }
        // Handle regular text content
        else {
          element.textContent = translation;
        }
      }
    });
    
    // Update document language attribute
    document.documentElement.lang = this.currentLang;
    
    console.log(`[I18n] Translations applied for language: ${this.currentLang}`);
  }
  
  /**
   * Get current language
   */
  getCurrentLanguage() {
    return this.currentLang;
  }
  
  /**
   * Check if language is supported
   */
  isSupported(lang) {
    return translations.hasOwnProperty(lang);
  }
  
  /**
   * Get all supported languages
   */
  getSupportedLanguages() {
    return Object.keys(translations);
  }
}

// Create global instance
window.i18n = new I18n();

// Export for modules (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { I18n, translations };
}
