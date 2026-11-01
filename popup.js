const status = document.getElementById('copyStatus');

document.getElementById('settings').addEventListener('click', event => {
  event.preventDefault();
  chrome.runtime.openOptionsPage();
});

(async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const result = await chrome.runtime.sendMessage({ type: 'uuc-toolbar-copy', tabId: tab.id });
    const messages = {
      choose: 'Close this box. Then choose what to copy.',
      copied: 'Copied!',
      failed: 'Could not copy. Try again on the page.',
      cancelled: 'Copy stopped.',
      unavailable: "This page can't be copied."
    };
    status.textContent = messages[result.state] || messages.unavailable;
  } catch {
    status.textContent = "This page can't be copied.";
  }
})();
