chrome.runtime.onInstalled.addListener(async () => {
  await chrome.contextMenus.removeAll();
  chrome.contextMenus.create({
    id: 'copy-page',
    title: 'Copy page',
    contexts: ['page', 'selection']
  });
  chrome.contextMenus.create({
    id: 'copy-link',
    title: 'Copy link',
    contexts: ['link']
  });
});

async function requestCopy(tabId, frameId, target) {
  const message = { type: 'uuc-copy', target };
  await chrome.scripting.executeScript({
    target: { tabId, frameIds: [frameId] },
    files: ['content.js']
  });
  return chrome.tabs.sendMessage(tabId, message, { frameId });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (tab?.id == null) return;
  if (info.menuItemId === 'copy-page') {
    requestCopy(tab.id, 0, { kind: 'page' }).catch(() => {});
  } else if (info.menuItemId === 'copy-link') {
    requestCopy(tab.id, info.frameId ?? 0, { kind: 'link', url: info.linkUrl }).catch(() => {});
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== 'uuc-toolbar-copy') return;
  requestCopy(message.tabId, 0, { kind: 'toolbar' }).then(
    sendResponse,
    () => sendResponse({ state: 'unavailable' })
  );
  return true;
});
