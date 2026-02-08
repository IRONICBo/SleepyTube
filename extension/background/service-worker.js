/**
 * Service Worker for SleepyTube Extension
 * Handles extension lifecycle and storage management
 */

// Initialize extension on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('[SleepyTube] Extension installed');

    // Set default configuration
    await chrome.storage.sync.set({
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

    // Set onboarding flag
    await chrome.storage.local.set({
      onboardingCompleted: false,
      firstInstall: true
    });

    // Open onboarding page
    chrome.tabs.create({ url: chrome.runtime.getURL('onboarding/onboarding.html') });

  } else if (details.reason === 'update') {
    console.log('[SleepyTube] Extension updated to version', chrome.runtime.getManifest().version);

    // Check if user has completed onboarding before
    const { onboardingCompleted } = await chrome.storage.local.get(['onboardingCompleted']);

    // If they haven't seen onboarding yet, show it
    if (onboardingCompleted === undefined || onboardingCompleted === false) {
      await chrome.storage.local.set({ onboardingCompleted: false });
      chrome.tabs.create({ url: chrome.runtime.getURL('onboarding/onboarding.html') });
    }
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

  // Handle AI Prediction Requests
  if (request.type === 'AI_PREDICT') {
    handleAIPrediction(request, sendResponse);
    return true; // Keep channel open for async response
  }
});

/**
 * Handle AI Prediction Requests from Content Script
 * This runs in the background context, bypassing CORS restrictions
 */
async function handleAIPrediction(request, sendResponse) {
  const { provider, apiKey, videoInfo } = request;

  console.log('[Background] Handling AI prediction for:', videoInfo.videoId);

  try {
    let prediction;

    if (provider === 'gemini') {
      prediction = await predictWithGemini(apiKey, videoInfo);
    } else if (provider === 'openai') {
      prediction = await predictWithOpenAI(apiKey, videoInfo);
    } else {
      throw new Error(`Unknown provider: ${provider}`);
    }

    console.log('[Background] ✅ Prediction success:', prediction);
    sendResponse({ success: true, prediction });

  } catch (error) {
    console.error('[Background] ❌ Prediction failed:', error);
    sendResponse({
      success: false,
      error: error.message || 'Prediction failed'
    });
  }
}

/**
 * Call Gemini API
 */
async function predictWithGemini(apiKey, videoInfo) {
  const prompt = `Analyze if this YouTube video might have audio quality issues for sleep listening.

Video info:
- Title: ${videoInfo.title}
- Channel: ${videoInfo.channel}
- Duration: ${videoInfo.duration}

Based ONLY on obvious indicators in the title/channel, identify potential issues:
1. "noisy" - Background music, noisy environment (e.g., music videos, concerts, vlogs with loud background)
2. "loud" - Consistently loud volume (e.g., gaming, reactions, shouting content)
3. "sudden" - Sudden sounds/jumps (e.g., horror, jump scare, comedy with loud effects)

IMPORTANT: Be conservative! Only flag videos with VERY OBVIOUS issues. Most educational/talk videos should be safe.

Return JSON format:
{
  "issues": ["noisy", "loud", "sudden"],
  "confidence": "high/medium/low",
  "safe": true/false
}

Examples:
- "Relaxing Piano Music" → {"issues": [], "safe": true, "confidence": "high"}
- "LOUD FUNNY MOMENTS COMPILATION" → {"issues": ["loud", "sudden"], "safe": false, "confidence": "high"}
- "How to Code in Python" → {"issues": [], "safe": true, "confidence": "high"}
- "EPIC METAL MUSIC MIX" → {"issues": ["noisy", "loud"], "safe": false, "confidence": "high"}

If no OBVIOUS issues, return: {"issues": [], "safe": true, "confidence": "high"}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 256,
        }
      })
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Background] Gemini API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    
    // Provide helpful error messages
    if (response.status === 400) {
      throw new Error('Gemini API request invalid - check API key format');
    } else if (response.status === 403) {
      throw new Error('Gemini API key is invalid or disabled');
    } else if (response.status === 429) {
      throw new Error('Gemini API rate limit exceeded - try again later');
    } else {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }
  }

  const data = await response.json();
  console.log('[Background] Gemini raw response:', data);

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  console.log('[Background] Gemini response text:', text);

  // Extract and parse JSON
  try {
    // Try to extract JSON from markdown code blocks or plain text
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }
    
    // Try to find JSON object in text
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON object found in response');
    }
    
    const prediction = JSON.parse(jsonMatch[0]);
    console.log('[Background] ✅ Parsed Gemini prediction:', prediction);
    
    // Validate response structure
    if (!prediction.hasOwnProperty('safe') || !Array.isArray(prediction.issues)) {
      throw new Error('Invalid prediction format');
    }
    
    return prediction;
  } catch (parseError) {
    console.error('[Background] Failed to parse Gemini response:', parseError);
    console.error('[Background] Raw text was:', text);
    
    // Fallback: return safe prediction
    return {
      issues: [],
      safe: true,
      confidence: 'low',
      error: 'Failed to parse AI response'
    };
  }
}

/**
 * Call OpenAI API
 */
async function predictWithOpenAI(apiKey, videoInfo) {
  const prompt = `Analyze if this YouTube video might have audio quality issues for sleep listening.

Video info:
- Title: ${videoInfo.title}
- Channel: ${videoInfo.channel}
- Duration: ${videoInfo.duration}

Based ONLY on obvious indicators in the title/channel, identify potential issues:
1. "noisy" - Background music, noisy environment (e.g., music videos, concerts, vlogs with loud background)
2. "loud" - Consistently loud volume (e.g., gaming, reactions, shouting content)
3. "sudden" - Sudden sounds/jumps (e.g., horror, jump scare, comedy with loud effects)

IMPORTANT: Be conservative! Only flag videos with VERY OBVIOUS issues. Most educational/talk videos should be safe.

Return JSON format:
{
  "issues": ["noisy", "loud", "sudden"],
  "confidence": "high/medium/low",
  "safe": true/false
}

Examples:
- "Relaxing Piano Music" → {"issues": [], "safe": true, "confidence": "high"}
- "LOUD FUNNY MOMENTS COMPILATION" → {"issues": ["loud", "sudden"], "safe": false, "confidence": "high"}
- "How to Code in Python" → {"issues": [], "safe": true, "confidence": "high"}
- "EPIC METAL MUSIC MIX" → {"issues": ["noisy", "loud"], "safe": false, "confidence": "high"}

If no OBVIOUS issues, return: {"issues": [], "safe": true, "confidence": "high"}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo', // Changed from invalid 'gpt-5-nano' to valid model
      messages: [{
        role: 'system',
        content: 'You are a helpful assistant that analyzes YouTube videos for potential audio quality issues. Always respond with valid JSON.'
      }, {
        role: 'user',
        content: prompt
      }],
      temperature: 0.3,
      max_tokens: 256
      // Removed response_format - only supported on gpt-4-1106-preview and newer
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[Background] OpenAI API error:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    
    // Provide helpful error messages
    if (response.status === 401) {
      throw new Error('OpenAI API key is invalid or expired');
    } else if (response.status === 403) {
      throw new Error('OpenAI API access forbidden - check your account status and billing');
    } else if (response.status === 429) {
      throw new Error('OpenAI API rate limit exceeded - try again later');
    } else {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }
  }

  const data = await response.json();
  console.log('[Background] OpenAI raw response:', data);

  const text = data.choices?.[0]?.message?.content || '';
  console.log('[Background] OpenAI response text:', text);

  // Parse JSON response (handle potential parsing errors)
  try {
    // Try to extract JSON from markdown code blocks if present
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }
    
    const prediction = JSON.parse(jsonText);
    console.log('[Background] ✅ Parsed OpenAI prediction:', prediction);
    
    // Validate response structure
    if (!prediction.hasOwnProperty('safe') || !Array.isArray(prediction.issues)) {
      throw new Error('Invalid prediction format');
    }
    
    return prediction;
  } catch (parseError) {
    console.error('[Background] Failed to parse OpenAI response:', parseError);
    console.error('[Background] Raw text was:', text);
    
    // Fallback: return safe prediction
    return {
      issues: [],
      safe: true,
      confidence: 'low',
      error: 'Failed to parse AI response'
    };
  }
}

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
