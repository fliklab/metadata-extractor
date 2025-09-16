function extractMetadataFromDOM() {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    metaTitle: document.querySelector("title")?.textContent,
    metaDescription: document.querySelector('meta[name="description"]')
      ?.content,
    metaRobots: document.querySelector('meta[name="robots"]')?.content,
    metaStorebotGoogle: document.querySelector('meta[name="Storebot-Google"]')
      ?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content,
    canonicalUrl: document.querySelector('link[rel="canonical"]')?.href,
  };
}

function extractJSONLD() {
  const scripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  return Array.from(scripts)
    .map((script) => {
      try {
        return JSON.parse(script.innerText.trim());
      } catch (e) {
        console.error("Failed to parse JSON-LD: ", e);
        return null;
      }
    })
    .filter((data) => data !== null);
}

// Wait briefly for canonical to be injected by SPA head managers (e.g., Helmet)
function waitForCanonical(maxWaitMs = 1500, intervalMs = 100) {
  const getCanonical = () =>
    document.querySelector('link[rel="canonical"]')?.href || null;

  return new Promise((resolve) => {
    const start = Date.now();
    const check = () => {
      const href = getCanonical();
      if (href) return resolve(href);
      if (Date.now() - start >= maxWaitMs) return resolve(null);
      setTimeout(check, intervalMs);
    };
    check();
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentMetadata") {
    (async () => {
      const metadata = extractMetadataFromDOM();
      if (!metadata.canonicalUrl) {
        metadata.canonicalUrl = await waitForCanonical();
      }
      const jsonldData = extractJSONLD();
      sendResponse({ metadata, jsonldData });
    })();
    // Keep the message channel open for the async response
    return true;
  }
});
