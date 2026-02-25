chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL('newtab.html');
  chrome.tabs.create({ url });
});
