// Background service worker for Well-Charged Distraction & Ad Blocker

let blockingRules = [];
let adBlockingRules = [];
let isActive = true;
let scheduleActive = false;

// Initialize WebSocket connection to our backend
let ws;
function initializeWebSocket() {
  ws = new WebSocket('wss://api.well-charged.com/blocking');
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
      case 'rules_update':
        blockingRules = data.blockingRules;
        adBlockingRules = data.adBlockingRules;
        break;
      case 'schedule_update':
        scheduleActive = isWithinSchedule(data.schedule);
        break;
    }
  };

  ws.onclose = () => {
    setTimeout(initializeWebSocket, 1000);
  };
}

// Enhanced ad blocking patterns
const adPatterns = [
  // Ad Networks and Services
  "*://*.doubleclick.net/*",
  "*://*.googlesyndication.com/*",
  "*://*.google-analytics.com/*",
  "*://*.googleadservices.com/*",
  "*://*.facebook.com/tr/*",
  "*://*.facebook.com/plugins/*",
  "*://creative.ak.fbcdn.net/*",
  "*://*.moatads.com/*",
  "*://*.amazon-adsystem.com/*",
  "*://*.adbrite.com/*",
  "*://*.exponential.com/*",
  "*://*.quantserve.com/*",
  "*://*.scorecardresearch.com/*",
  "*://*.zedo.com/*",
  "*://*.adnxs.com/*",
  "*://*.criteo.com/*",
  "*://*.outbrain.com/*",
  "*://*.taboola.com/*",
  
  // Analytics and Tracking
  "*://*.hotjar.com/*",
  "*://*.mixpanel.com/*",
  "*://*.clicktale.net/*",
  "*://*.inspectlet.com/*",
  "*://stats.wp.com/*",
  "*://*.chartbeat.com/*",
  "*://*.segment.io/*",
  "*://*.amplitude.com/*",
  
  // Video Ad Networks
  "*://*.spotxchange.com/*",
  "*://*.springserve.com/*",
  "*://*.innovid.com/*",
  "*://*.teads.tv/*",
  "*://*.brightcove.com/*",
  
  // Social Media Tracking
  "*://analytics.twitter.com/*",
  "*://platform.twitter.com/*",
  "*://platform.instagram.com/*",
  "*://platform.linkedin.com/*",
  "*://*.tiktok.com/api/ad/*",
  
  // Mobile Ad Networks
  "*://*.mopub.com/*",
  "*://*.applovin.com/*",
  "*://*.unity3d.com/ads/*",
  "*://*.vungle.com/*",
  "*://*.chartboost.com/*"
];

// Content types to block
const blockedResourceTypes = [
  'image',
  'media',
  'script',
  'xmlhttprequest',
  'sub_frame'
];

// Initialize blocking rules from storage
chrome.storage.local.get(['blockingRules', 'adBlockingRules', 'isActive'], (result) => {
  blockingRules = result.blockingRules || [];
  adBlockingRules = result.adBlockingRules || adPatterns;
  isActive = result.isActive !== undefined ? result.isActive : true;
  initializeWebSocket();
});

// Enhanced web request listener for blocking
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!isActive || !scheduleActive) return { cancel: false };

    // Skip blocking for main frame (avoid breaking pages)
    if (details.type === 'main_frame') return { cancel: false };

    // Check if resource type should be blocked
    if (!blockedResourceTypes.includes(details.type)) return { cancel: false };

    // Check for ad patterns
    const isAd = adBlockingRules.some(pattern => {
      const regex = new RegExp(pattern.replace(/\./g, '\\.').replace(/\*/g, '.*'));
      return regex.test(details.url);
    });

    if (isAd) {
      // Log ad blocking event
      logBlockingEvent(details.url, 'ad');
      return { cancel: true };
    }

    // Check for distraction patterns
    if (blockingRules.some(rule => details.url.includes(rule.target))) {
      logBlockingEvent(details.url, 'distraction');
      return { cancel: true };
    }

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

// Enhanced header modification for additional privacy
chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (!isActive || !scheduleActive) return { requestHeaders: details.requestHeaders };

    const requestHeaders = details.requestHeaders.filter(header => {
      const name = header.name.toLowerCase();
      // Remove tracking-related headers
      return ![
        'x-requested-with',
        'dnt',
        'x-forwarded-for',
        'via',
        'referer'
      ].includes(name);
    });

    return { requestHeaders };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

// Log blocking events
async function logBlockingEvent(url, type) {
  try {
    await fetch('https://api.well-charged.com/blocking/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        timestamp: new Date().toISOString(),
        type
      })
    });

    // Update local stats
    const stats = await getStats();
    stats[`${type}Blocked`]++;
    stats.totalBlocked++;
    
    const domain = new URL(url).hostname;
    if (!stats.byDomain[domain]) {
      stats.byDomain[domain] = { ads: 0, distractions: 0 };
    }
    stats.byDomain[domain][type]++;

    await chrome.storage.local.set({ blockingStats: stats });
  } catch (error) {
    console.error('Error logging blocking event:', error);
  }
}

// Get blocking statistics
async function getStats() {
  const { blockingStats } = await chrome.storage.local.get('blockingStats');
  return blockingStats || {
    adBlocked: 0,
    distractionBlocked: 0,
    totalBlocked: 0,
    byDomain: {}
  };
}

// Message handler for popup and content script communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.type) {
    case 'getStatus':
      sendResponse({
        isActive,
        scheduleActive,
        blockingRules,
        adBlockingRules
      });
      break;
    
    case 'toggleBlocking':
      isActive = request.value;
      chrome.storage.local.set({ isActive });
      sendResponse({ success: true });
      break;

    case 'getStats':
      getStats().then(stats => sendResponse(stats));
      return true;
  }
});

// Function to check if current time is within blocking schedule
function isWithinSchedule(schedule) {
  if (!schedule) return true;

  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  
  if (!schedule.days.includes(currentDay)) return false;

  const currentTime = now.toLocaleTimeString('en-US', { hour12: false });
  return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
}

// Set up periodic sync for rules
chrome.alarms.create('syncRules', { periodInMinutes: 5 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncRules') {
    initializeWebSocket();
  }
});
