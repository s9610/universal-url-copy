(() => {
  if (globalThis.universalUrlCopyReady) return;
  globalThis.universalUrlCopyReady = true;

  const FONT = 'Century Gothic, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
  let activeOperation;

  function focusedElement() {
    let element = document.activeElement;
    while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
    return element;
  }

  function linkTitle(link) {
    return link.textContent.trim() || link.title || link.href;
  }

  function decodeUrlSafely(url) {
    try {
      let previous = url;
      let decoded = decodeURI(previous);
      let attempts = 0;
      while (decoded !== previous && attempts < 5) {
        previous = decoded;
        decoded = decodeURI(decoded);
        attempts++;
      }
      return decoded;
    } catch {
      return url;
    }
  }

  function resolveItem(target) {
    if (target.kind === 'link') {
      const link = Array.from(document.querySelectorAll('a[href]')).find(link => link.href === target.url);
      const title = link ? linkTitle(link) : target.url;
      return { title, url: decodeUrlSafely(target.url) };
    }
    if (target.kind === 'toolbar') {
      const selection = window.getSelection();
      if (selection?.rangeCount) {
        const node = selection.getRangeAt(0).commonAncestorContainer;
        const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
        const link = element?.closest('a[href]');
        if (link) return { title: linkTitle(link), url: decodeUrlSafely(link.href) };
      }
    }
    return { title: document.title, url: decodeUrlSafely(location.href) };
  }

  function button(text, size = '26px') {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = text;
    Object.assign(element.style, {
      margin: '5px',
      padding: '10px 20px',
      fontSize: size,
      fontFamily: FONT,
      color: '#333333',
      background: 'rgba(255,255,255,0.9)',
      border: '1px solid #333333',
      borderRadius: '4px',
      cursor: 'pointer'
    });
    return element;
  }

  function clearFeedback(operation) {
    clearTimeout(operation.timer);
    const hadFocus = operation.feedback?.contains(document.activeElement);
    operation.feedback?.remove();
    operation.feedback = null;
    if (hadFocus && operation.previousFocus?.isConnected) operation.previousFocus.focus();
  }

  function showFeedback(operation, message, retry) {
    if (activeOperation !== operation) return;
    clearFeedback(operation);
    const box = document.createElement('div');
    box.setAttribute('role', retry ? 'alert' : 'status');
    Object.assign(box.style, {
      position: 'fixed',
      bottom: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: 'calc(100% - 48px)',
      zIndex: '10000',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: retry ? '#333333' : '#16a34a',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      fontSize: retry ? '20px' : '32px',
      fontFamily: FONT,
      textAlign: 'center',
      pointerEvents: retry ? 'auto' : 'none'
    });
    const label = document.createElement('div');
    label.textContent = message;
    box.appendChild(label);
    if (retry) {
      const retryButton = button('Try again', '16px');
      retryButton.addEventListener('click', retry);
      const closeButton = button('Close', '16px');
      closeButton.addEventListener('click', () => clearFeedback(operation));
      box.append(retryButton, closeButton);
    }
    operation.feedback = box;
    document.body.appendChild(box);
    if (!retry) operation.timer = setTimeout(() => clearFeedback(operation), 1200);
  }

  async function copyText(text, operation) {
    if (activeOperation !== operation) return { state: 'cancelled' };
    clearFeedback(operation);
    try {
      await navigator.clipboard.writeText(text);
      showFeedback(operation, 'Copied!');
      return { state: 'copied' };
    } catch {
      showFeedback(operation, 'Could not copy. Try again.', () => copyText(text, operation));
      return { state: 'failed' };
    }
  }

  function showModeSelection(operation, onSelect) {
    const previousFocus = focusedElement();
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: '10000'
    });
    const box = document.createElement('div');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Copy');
    Object.assign(box.style, {
      backgroundColor: 'rgba(255, 255, 255, 0.75)',
      padding: '10px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      fontFamily: FONT,
      textAlign: 'center',
      maxWidth: 'calc(100% - 40px)'
    });
    const titleButton = button('Copy title and URL');
    const urlButton = button('Copy URL only');
    const buttons = [titleButton, urlButton];

    function cleanup() {
      overlay.remove();
      document.removeEventListener('keydown', onKeyDown, true);
      operation.closeDialog = null;
      if (previousFocus?.isConnected) previousFocus.focus();
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        cleanup();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        event.stopImmediatePropagation();
        const index = buttons.indexOf(document.activeElement);
        buttons[index === -1 ? (event.shiftKey ? 1 : 0) : (index + 1) % buttons.length].focus();
      }
    }
    titleButton.addEventListener('click', () => {
      cleanup();
      onSelect('title-url');
    });
    urlButton.addEventListener('click', () => {
      cleanup();
      onSelect('url-only');
    });
    overlay.addEventListener('click', event => {
      if (event.target === overlay) cleanup();
    });
    operation.closeDialog = cleanup;
    box.append(...buttons);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKeyDown, true);
    titleButton.focus();
  }

  async function startCopy(target, item = resolveItem(target)) {
    if (activeOperation) {
      activeOperation.closeDialog?.();
      clearFeedback(activeOperation);
    }
    const operation = { previousFocus: focusedElement() };
    activeOperation = operation;
    const performCopy = mode => copyText(mode === 'url-only' ? item.url : `${item.title}\n${item.url}`, operation);
    let data;
    try {
      data = await chrome.storage.sync.get(['defaultModeEnabled', 'defaultOutput']);
    } catch {
      showFeedback(operation, 'Could not copy. Try again.', () => startCopy(target, item));
      return { state: 'failed' };
    }
    if (activeOperation !== operation) return { state: 'cancelled' };
    if (data.defaultModeEnabled) return performCopy(data.defaultOutput || 'title-url');
    showModeSelection(operation, performCopy);
    return { state: 'choose' };
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type !== 'uuc-copy') return;
    startCopy(message.target).then(sendResponse, () => sendResponse({ state: 'unavailable' }));
    return true;
  });
})();
