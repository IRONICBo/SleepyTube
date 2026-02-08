/**
 * Utility functions for SleepyTube
 */

// Convert decibels to linear gain
function dbToLinear(db) {
  return Math.pow(10, db / 20);
}

// Convert linear gain to decibels
function linearToDb(linear) {
  return 20 * Math.log10(linear);
}

// Clamp value between min and max
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// Calculate RMS (Root Mean Square) of audio buffer
function calculateRMS(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

// Estimate loudness in dB from audio buffer
function estimateLoudnessDb(buffer) {
  const rms = calculateRMS(buffer) + 1e-9; // Add small value to avoid log(0)
  return 20 * Math.log10(rms);
}

// Debounce function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function calls
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Wait for element to appear in DOM
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }
    
    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        clearTimeout(timeoutId);
        resolve(element);
      }
    });
    
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
    
    const timeoutId = setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Check if current page is YouTube watch page
function isWatchPage() {
  return window.location.pathname.startsWith('/watch');
}

// Check if current page is YouTube shorts
function isShortsPage() {
  return window.location.pathname.startsWith('/shorts/');
}

// Check if current page can have sleep mode (watch or shorts)
function isSleepModeAllowed() {
  return isWatchPage() || isShortsPage();
}

// Extract video ID from URL
function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search);
  const watchId = urlParams.get('v');
  if (watchId) return watchId;
  
  // Try shorts URL
  const shortsMatch = window.location.pathname.match(/\/shorts\/([^/?]+)/);
  if (shortsMatch) return shortsMatch[1];
  
  return null;
}

// Log with timestamp
function log(...args) {
  console.log('[SleepyTube]', new Date().toISOString(), ...args);
}

// Log error with timestamp
function logError(...args) {
  console.error('[SleepyTube ERROR]', new Date().toISOString(), ...args);
}

// Export for use in other scripts
window.SleepyTubeUtils = {
  dbToLinear,
  linearToDb,
  clamp,
  calculateRMS,
  estimateLoudnessDb,
  debounce,
  throttle,
  waitForElement,
  isWatchPage,
  isShortsPage,
  isSleepModeAllowed,
  getVideoId,
  log,
  logError
};
