chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRawHTML") {
    fetch(request.url)
      .then((response) => response.text())
      .then((html) => sendResponse({ html }))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Will respond asynchronously.
  }
});
