'use strict';

browser.action.onClicked.addListener((tab: browser.tabs.Tab) => {
  browser.scripting.executeScript({
    target: { tabId: tab.id ?? 0 },
    files: ['dist/main.js']
  });
});
