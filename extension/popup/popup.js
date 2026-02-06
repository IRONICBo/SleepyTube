/**
 * Popup script for SleepyTube extension
 */

// Get current tab and check status
async function updateStatus() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || !tab.url.includes('youtube.com')) {
      setStatus('inactive', 'Open YouTube to use Sleep Mode');
      return;
    }
    
    // Get configuration
    const config = await chrome.storage.sync.get('sleepModeEnabled');
    const isEnabled = config.sleepModeEnabled || false;
    
    if (isEnabled) {
      setStatus('active', 'Sleep Mode Active');
      document.getElementById('toggle-text').textContent = 'Disable Sleep Mode';
    } else {
      setStatus('ready', 'Ready');
      document.getElementById('toggle-text').textContent = 'Enable Sleep Mode';
    }
    
  } catch (error) {
    console.error('Failed to update status:', error);
    setStatus('error', 'Error');
  }
}

// Set status indicator
function setStatus(state, text) {
  const indicator = document.getElementById('status');
  const statusText = document.getElementById('status-text');
  
  indicator.className = 'status-indicator ' + state;
  statusText.textContent = text;
}

// Toggle sleep mode
document.getElementById('toggle-sleep-mode').addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab || !tab.url || !tab.url.includes('youtube.com')) {
      alert('Please open a YouTube video first');
      return;
    }
    
    // Get current state
    const config = await chrome.storage.sync.get('sleepModeEnabled');
    const newState = !config.sleepModeEnabled;
    
    // Update configuration
    await chrome.storage.sync.set({ sleepModeEnabled: newState });
    
    // Send message to content script
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'TOGGLE_SLEEP_MODE',
        enabled: newState
      });
    } catch (e) {
      console.log('Content script not ready:', e);
    }
    
    // Update UI
    await updateStatus();
    
  } catch (error) {
    console.error('Failed to toggle sleep mode:', error);
  }
});

// Update status on load and focus
updateStatus();
window.addEventListener('focus', updateStatus);

// Listen for storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes.sleepModeEnabled) {
    updateStatus();
  }
});
