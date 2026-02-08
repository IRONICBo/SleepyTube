/**
 * SleepyTube Onboarding Script
 * Handles scene selection, API configuration, and setup flow
 */

let currentSlide = 1;
const totalSlides = 4;

// User configuration
let userConfig = {
  scene: null,           // 'sleep' | 'podcast' | 'movie' | null
  aiProvider: 'gemini',  // 'gemini' | 'openai'
  apiKey: '',           // API key string
  language: 'en'        // 'en' | 'zh'
};

document.addEventListener('DOMContentLoaded', () => {
  initializeOnboarding();
  setupEventListeners();
  loadLanguagePreference();
});

function initializeOnboarding() {
  updateNavigationButtons();
  updateProgressBar();
}

function setupEventListeners() {
  // Navigation buttons
  document.getElementById('btn-back').addEventListener('click', () => navigateSlide(-1));
  document.getElementById('btn-next').addEventListener('click', () => navigateSlide(1));
  document.getElementById('btn-skip').addEventListener('click', handleSkip);
  document.getElementById('btn-finish').addEventListener('click', finishOnboarding);
  
  // Dot navigation
  document.querySelectorAll('.dot').forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetSlide = parseInt(e.target.dataset.slide);
      goToSlide(targetSlide);
    });
  });
  
  // Scene selection
  document.querySelectorAll('.scene-card').forEach(card => {
    card.addEventListener('click', () => {
      const scene = card.dataset.scene;
      selectScene(scene);
    });
  });
  
  // Provider tabs
  document.querySelectorAll('.provider-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const provider = tab.dataset.provider;
      selectProvider(provider);
    });
  });
  
  // API key input
  document.getElementById('api-key-input').addEventListener('input', (e) => {
    userConfig.apiKey = e.target.value.trim();
  });
  
  // Language selector (button-based on Slide 1)
  document.querySelectorAll('.language-option').forEach(button => {
    button.addEventListener('click', () => {
      const lang = button.dataset.lang;
      selectLanguage(lang);
    });
  });
  
  // Language selector (dropdown - for backward compatibility)
  const languageSelect = document.getElementById('language-select');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      changeLanguage(e.target.value);
    });
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboard);
}

function navigateSlide(direction) {
  const newSlide = currentSlide + direction;
  if (newSlide >= 1 && newSlide <= totalSlides) {
    goToSlide(newSlide);
  }
}

function goToSlide(slideNumber) {
  const slides = document.querySelectorAll('.slide');
  const currentSlideEl = slides[currentSlide - 1];
  const newSlideEl = slides[slideNumber - 1];
  
  // Remove active class from current slide
  currentSlideEl.classList.remove('active');
  if (slideNumber > currentSlide) {
    currentSlideEl.classList.add('prev');
  } else {
    currentSlideEl.classList.remove('prev');
  }
  
  // Add active class to new slide
  newSlideEl.classList.add('active');
  newSlideEl.classList.remove('prev');
  
  currentSlide = slideNumber;
  
  updateNavigationButtons();
  updateProgressBar();
  updateDots();
}

function updateNavigationButtons() {
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const btnSkip = document.getElementById('btn-skip');
  const btnFinish = document.getElementById('btn-finish');
  
  // Back button
  btnBack.disabled = currentSlide === 1;
  
  // Show/hide skip button on slides 2 and 3
  btnSkip.style.display = (currentSlide === 2 || currentSlide === 3) ? 'block' : 'none';
  
  // Next/Finish buttons
  if (currentSlide === totalSlides) {
    btnNext.style.display = 'none';
    btnFinish.style.display = 'block';
  } else {
    btnNext.style.display = 'block';
    btnFinish.style.display = 'none';
  }
}

function updateProgressBar() {
  const steps = document.querySelectorAll('.progress-step');
  const lines = document.querySelectorAll('.progress-line');
  
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    if (stepNumber < currentSlide) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNumber === currentSlide) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
  
  lines.forEach((line, index) => {
    if (index + 1 < currentSlide) {
      line.classList.add('completed');
    } else {
      line.classList.remove('completed');
    }
  });
}

function updateDots() {
  document.querySelectorAll('.dot').forEach((dot, index) => {
    if (index + 1 === currentSlide) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// ===== Scene Selection =====
function selectScene(scene) {
  userConfig.scene = scene;
  
  // Update UI
  document.querySelectorAll('.scene-card').forEach(card => {
    if (card.dataset.scene === scene) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });
  
  console.log('[Onboarding] Scene selected:', scene);
}

// ===== Provider Selection =====
function selectProvider(provider) {
  userConfig.aiProvider = provider;
  
  // Update UI
  document.querySelectorAll('.provider-tab').forEach(tab => {
    if (tab.dataset.provider === provider) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update help text link
  const apiLink = document.getElementById('api-link');
  if (provider === 'gemini') {
    apiLink.href = 'https://makersuite.google.com/app/apikey';
  } else {
    apiLink.href = 'https://platform.openai.com/api-keys';
  }
  
  console.log('[Onboarding] Provider selected:', provider);
}

// ===== Skip Handler =====
function handleSkip() {
  if (currentSlide === 2) {
    // Skip scene selection - leave as null
    userConfig.scene = null;
    goToSlide(3);
  } else if (currentSlide === 3) {
    // Skip API configuration - leave empty
    userConfig.apiKey = '';
    goToSlide(4);
  }
}

// ===== Finish Onboarding =====
async function finishOnboarding() {
  try {
    console.log('[Onboarding] Finishing with config:', userConfig);
    
    // Save user configuration to storage
    const configToSave = {};
    
    // Save scene preset if selected
    if (userConfig.scene) {
      const scenePresets = {
        sleep: {
          sleepModeEnabled: true,
          compressionStrength: 'strong',
          targetLoudness: -20,
          eqPreset: 'gentle',
          voiceFocusEnabled: true,
          autoGainEnabled: true,
          limiterEnabled: true,
          currentScene: 'sleep'
        },
        podcast: {
          sleepModeEnabled: true,
          compressionStrength: 'medium',
          targetLoudness: -18,
          eqPreset: 'natural',
          voiceFocusEnabled: true,
          duckingAmount: 12,
          autoGainEnabled: true,
          currentScene: 'podcast'
        },
        movie: {
          sleepModeEnabled: true,
          compressionStrength: 'light',
          targetLoudness: -16,
          eqPreset: 'natural',
          voiceFocusEnabled: false,
          autoGainEnabled: true,
          limiterEnabled: true,
          currentScene: 'movie'
        }
      };
      
      Object.assign(configToSave, scenePresets[userConfig.scene]);
    }
    
    // Save AI configuration if provided
    if (userConfig.apiKey) {
      configToSave.aiPredictorEnabled = true;
      configToSave.aiPredictorProvider = userConfig.aiProvider;
      configToSave.aiPredictorApiKey = userConfig.apiKey;
    } else {
      configToSave.aiPredictorEnabled = false;
    }
    
    // Save to sync storage
    await chrome.storage.sync.set(configToSave);
    
    // Mark onboarding as completed
    await chrome.storage.local.set({ 
      onboardingCompleted: true,
      onboardingVersion: '1.3.0'
    });
    
    console.log('[Onboarding] Configuration saved successfully');
    
    // Add success animation
    document.querySelector('.onboarding-container').classList.add('success-animation');
    
    // Wait for animation then close
    setTimeout(() => {
      // Close onboarding tab
      chrome.tabs.getCurrent((tab) => {
        if (tab) {
          chrome.tabs.remove(tab.id);
        }
      });
    }, 600);
    
  } catch (error) {
    console.error('[Onboarding] Failed to save configuration:', error);
    alert('Failed to save settings. Please try again.');
  }
}

// ===== Language Management =====
function selectLanguage(lang) {
  userConfig.language = lang;
  
  // Update UI - highlight selected language button
  document.querySelectorAll('.language-option').forEach(button => {
    if (button.dataset.lang === lang) {
      button.classList.add('selected');
    } else {
      button.classList.remove('selected');
    }
  });
  
  // Apply language change
  changeLanguage(lang);
  
  console.log('[Onboarding] Language selected:', lang);
}

async function loadLanguagePreference() {
  try {
    const result = await chrome.storage.local.get(['language']);
    const lang = result.language || (navigator.language.startsWith('zh') ? 'zh' : 'en');
    userConfig.language = lang;
    
    // Update button UI if language buttons exist
    document.querySelectorAll('.language-option').forEach(button => {
      if (button.dataset.lang === lang) {
        button.classList.add('selected');
      } else {
        button.classList.remove('selected');
      }
    });
    
    // Update dropdown if it exists (backward compatibility)
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
      languageSelect.value = lang;
    }
    
    // Apply translations if i18n is available
    if (window.i18n) {
      window.i18n.currentLang = lang;
      window.i18n.applyTranslations();
    }
  } catch (error) {
    console.error('[Onboarding] Failed to load language preference:', error);
  }
}

async function changeLanguage(lang) {
  userConfig.language = lang;
  
  try {
    await chrome.storage.local.set({ language: lang });
    
    if (window.i18n) {
      await window.i18n.setLanguage(lang);
    }
  } catch (error) {
    console.error('[Onboarding] Failed to change language:', error);
  }
}

// ===== Keyboard Navigation =====
function handleKeyboard(e) {
  if (e.target.tagName === 'INPUT') return; // Don't interfere with input fields
  
  if (e.key === 'ArrowLeft' && currentSlide > 1) {
    navigateSlide(-1);
  } else if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
    navigateSlide(1);
  } else if (e.key === 'Enter' && currentSlide === totalSlides) {
    finishOnboarding();
  } else if (e.key === 'Escape' && (currentSlide === 2 || currentSlide === 3)) {
    handleSkip();
  }
}

// ===== Utility Functions =====
function showNotification(message, type = 'info') {
  // Simple console notification for now
  console.log(`[Onboarding] ${type.toUpperCase()}: ${message}`);
}

// Export for debugging
window.onboardingDebug = {
  currentSlide: () => currentSlide,
  userConfig: () => ({ ...userConfig }),
  goToSlide: (n) => goToSlide(n)
};
