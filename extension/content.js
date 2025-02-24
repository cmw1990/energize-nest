// Content script for Well-Charged Blocker

// Import AdBlocker functionality
let adBlocker = null;

// Initialize AdBlocker
async function initializeAdBlocker() {
  const response = await fetch(chrome.runtime.getURL('adBlocker.js'));
  const code = await response.text();
  const AdBlockerClass = new Function(code + '; return AdBlocker;')();
  adBlocker = AdBlockerClass.getInstance();
}

// Initialize MutationObserver for dynamic content
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length) {
      processNewContent(mutation.addedNodes);
    }
  });
});

// Start observing DOM changes
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeFilter: ['src', 'style']
});

// Process new content for ads and distractions
async function processNewContent(nodes) {
  if (!adBlocker) return;

  nodes.forEach(node => {
    if (node instanceof HTMLElement) {
      adBlocker.hideAdsInElement(node);
    }
  });
}

// Network request interceptor
const originalFetch = window.fetch;
window.fetch = async function(...args) {
  const url = args[0] instanceof Request ? args[0].url : args[0];
  
  if (adBlocker && adBlocker.shouldBlockRequest(url)) {
    throw new Error('Request blocked by Well-Charged');
  }
  
  return originalFetch.apply(this, args);
};

// XMLHttpRequest interceptor
const originalOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...args) {
  if (adBlocker && adBlocker.shouldBlockRequest(url)) {
    throw new Error('Request blocked by Well-Charged');
  }
  
  return originalOpen.apply(this, [method, url, ...args]);
};

// Initialize components
initializeAdBlocker();

// Focus mode overlay
let focusOverlay = null;

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'focusModeStart':
      createFocusOverlay();
      break;
    case 'focusModeEnd':
      removeFocusOverlay();
      break;
    case 'checkDistraction':
      const isDistraction = checkIfDistraction();
      sendResponse({ isDistraction });
      break;
  }
});

// Create focus mode overlay
function createFocusOverlay() {
  if (focusOverlay) return;

  focusOverlay = document.createElement('div');
  focusOverlay.className = 'well-charged-focus-overlay';
  focusOverlay.innerHTML = `
    <div class="focus-content">
      <h2>Focus Mode Active</h2>
      <p>Stay focused on your task!</p>
      <button id="endFocus">End Focus Mode</button>
    </div>
  `;

  document.body.appendChild(focusOverlay);

  document.getElementById('endFocus').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'endFocusMode' });
  });
}

// Remove focus mode overlay
function removeFocusOverlay() {
  if (focusOverlay) {
    focusOverlay.remove();
    focusOverlay = null;
  }
}

// Check if current page is a distraction
function checkIfDistraction() {
  const url = window.location.href;
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ 
      type: 'checkUrl', 
      url 
    }, (response) => {
      resolve(response.isDistraction);
    });
  });
}

// Add styles
const style = document.createElement('style');
style.textContent = `
  .well-charged-focus-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: system-ui, -apple-system, sans-serif;
  }

  .well-charged-focus-overlay .focus-content {
    text-align: center;
    padding: 2rem;
  }

  .well-charged-focus-overlay h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  .well-charged-focus-overlay button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.375rem;
    color: white;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .well-charged-focus-overlay button:hover {
    background: #2563eb;
  }

  [data-ad-blocked="true"] {
    display: none !important;
  }
`;
