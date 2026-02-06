/**
 * Service Worker for SleepyTube Extension
 * Handles extension lifecycle and storage management
 */

// Initialize extension on install
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('[SleepyTube] Extension installed');
    
    // Set default configuration
    chrome.storage.sync.set({
      sleepModeEnabled: false,
      compressionStrength: 'medium',
      targetLoudness: -18,
      outputGain: 0,
      eqPreset: 'gentle',
      voiceFocusEnabled: true,
      duckingAmount: 9,
      autoGainEnabled: true,
      limiterEnabled: true,
      showOnboarding: true
    });
    
    // Open welcome page (optional)
    // chrome.tabs.create({ url: 'https://sleepytube.dev/welcome' });
  } else if (details.reason === 'update') {
    console.log('[SleepyTube] Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_CONFIG') {
    // Fetch current configuration
    chrome.storage.sync.get(null, (config) => {
      sendResponse({ config });
    });
    return true; // Keep channel open for async response
  }
  
  if (request.type === 'UPDATE_CONFIG') {
    // Update configuration
    chrome.storage.sync.set(request.config, () => {
      sendResponse({ success: true });
    });
    return true;
  }
  
  if (request.type === 'UPDATE_BADGE') {
    // Update extension icon badge (show sleep mode status)
    if (sender.tab && sender.tab.id) {
      chrome.action.setBadgeText({
        tabId: sender.tab.id,
        text: request.enabled ? 'ON' : ''
      });
      
      chrome.action.setBadgeBackgroundColor({
        tabId: sender.tab.id,
        color: request.enabled ? '#4CAF50' : '#666666'
      });
    }
    sendResponse({ success: true });
  }
});

// Monitor storage changes and broadcast to all tabs
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync') {
    // Broadcast configuration changes to all YouTube tabs
    chrome.tabs.query({ url: '*://*.youtube.com/*' }, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'CONFIG_CHANGED',
          changes: changes
        }).catch(() => {
          // Tab may not have content script loaded yet
        });
      });
    });
  }
});

console.log('[SleepyTube] Service worker initialized');
