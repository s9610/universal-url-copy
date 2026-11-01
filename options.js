const defaultMode = document.getElementById('defaultMode');
const outputType = document.getElementById('outputType');
const status = document.getElementById('saveStatus');

(async () => {
  try {
    const data = await chrome.storage.sync.get(['defaultModeEnabled', 'defaultOutput']);
    defaultMode.checked = Boolean(data.defaultModeEnabled);
    outputType.value = data.defaultOutput || 'title-url';
  } catch {
    status.textContent = 'Could not load settings. Try again.';
  }
})();

async function saveSetting(value) {
  status.textContent = '';
  try {
    await chrome.storage.sync.set(value);
    status.textContent = 'Saved';
  } catch {
    status.textContent = 'Could not save. Try again.';
  }
}

defaultMode.addEventListener('change', () => {
  saveSetting({ defaultModeEnabled: defaultMode.checked });
});

outputType.addEventListener('change', () => {
  saveSetting({ defaultOutput: outputType.value });
});
