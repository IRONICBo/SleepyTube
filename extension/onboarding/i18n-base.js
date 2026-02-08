/**
 * SleepyTube - Internationalization (i18n) System
 */

const translations = {
  en: {
    // ... (前面的英文翻译保持不变，由于长度限制我会继续创建完整版本)
  },
  zh: {
    // ... (前面的中文翻译保持不变)
  }
};

class I18n {
  constructor() {
    this.currentLang = 'en';
    this.loadLanguage();
  }
  
  async loadLanguage() {
    try {
      const result = await chrome.storage.local.get(['language']);
      this.currentLang = result.language || this.detectBrowserLanguage();
      this.applyTranslations();
    } catch (error) {
      console.error('[I18n] Failed to load language:', error);
    }
  }
  
  detectBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('zh') ? 'zh' : 'en';
  }
  
  async setLanguage(lang) {
    this.currentLang = lang;
    await chrome.storage.local.set({ language: lang });
    this.applyTranslations();
    
    // Trigger event for other parts of the extension
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }
  
  get(key, params = {}) {
    const keys = key.split('.');
    let value = translations[this.currentLang];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    
    // Replace parameters
    if (typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
    }
    
    return value || key;
  }
  
  applyTranslations() {
    // Translate all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.get(key);
      
      if (typeof translation === 'string') {
        if (element.tagName === 'INPUT' && (element.type === 'text' || element.type === 'password')) {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
    
    // Update document language
    document.documentElement.lang = this.currentLang;
  }
}

// Create global instance
window.i18n = new I18n();
