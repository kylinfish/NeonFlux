// Extension icon 點擊事件 - 獨立開啟 NeonFlux 分頁
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
});
