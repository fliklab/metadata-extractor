chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getRawHTML") {
    fetch(request.url)
      .then(async (response) => ({
        html: await response.text(),
        httpInfo: {
          status: response.status,
          statusText: response.statusText,
          finalUrl: response.url,
          redirected: response.redirected,
          contentType: response.headers.get("content-type"),
          xRobotsTag: response.headers.get("x-robots-tag"),
        },
      }))
      .then((result) => sendResponse(result))
      .catch((error) => sendResponse({ error: error.message }));
    return true; // Will respond asynchronously.
  }
});
