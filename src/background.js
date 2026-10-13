importScripts('version.js');

chrome.action.onClicked.addListener(() => {
  const url = chrome.runtime.getURL('newtab.html');
  chrome.tabs.create({ url });
});

// 功能版更新（major / minor 變動）後開啟更新說明；全新安裝與修補版不打擾
chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
  if (reason !== 'update') return;
  if (!isFeatureUpdate(previousVersion, chrome.runtime.getManifest().version)) return;
  const lang = (chrome.i18n.getUILanguage() || '').toLowerCase().startsWith('zh') ? 'zh' : 'en';
  chrome.tabs.create({ url: releaseNotesUrl(lang) });
});
