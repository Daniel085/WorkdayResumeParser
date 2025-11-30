// Background service worker for Workday Resume Auto-Fill extension

console.log('Workday Auto-Fill background service worker loaded');

// Listen for installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Extension installed');

    // Open welcome page or show notification
    chrome.tabs.create({
      url: 'https://github.com/Daniel085/WorkdayResumeParser'
    });
  } else if (details.reason === 'update') {
    console.log('Extension updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);

  // Handle different message types here if needed
  if (request.action === 'ping') {
    sendResponse({ status: 'alive' });
  }

  return true; // Keep message channel open for async responses
});

// Badge to show when on Workday page
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.includes('myworkdayjobs.com')) {
    chrome.action.setBadgeText({ text: '✓', tabId: tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#4CAF50', tabId: tabId });
  }
});
