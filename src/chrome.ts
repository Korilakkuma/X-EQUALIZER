'use strict';

chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    files: ['dist/main.js']
  });
});
