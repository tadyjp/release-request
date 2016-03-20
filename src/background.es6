{
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url.indexOf('https://github.com/') !== -1) {
      chrome.pageAction.show(tabId);
      chrome.tabs.executeScript(null, { file: 'dist/script.js' });
    }
  });

  chrome.pageAction.onClicked.addListener((tab) => {
    // chrome.tabs.insertCSS(tab.id, { file:"style.css" });
    chrome.tabs.executeScript(null, { file: 'dist/script.js' });
  });
}
