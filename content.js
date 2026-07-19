function extractMetadataFromDOM() {
  return {
    title: document.title,
    metaTitle: document.querySelector('meta[name="title" i]')?.content,
    metaDescription: document.querySelector('meta[name="description"]')
      ?.content,
    metaRobots: document.querySelector('meta[name="robots"]')?.content,
    metaStorebotGoogle: document.querySelector('meta[name="Storebot-Google" i]')
      ?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogDescription: document.querySelector('meta[property="og:description"]')
      ?.content,
    ogType: document.querySelector('meta[property="og:type"]')?.content,
    ogSiteName: document.querySelector('meta[property="og:site_name"]')
      ?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    ogUrl: document.querySelector('meta[property="og:url"]')?.content,
    canonicalUrl: document.querySelector('link[rel~="canonical" i]')?.href,
    language: document.documentElement.getAttribute("lang"),
    charset: document.characterSet || null,
    viewport: document.querySelector('meta[name="viewport" i]')?.content,
    favicon: document.querySelector('link[rel~="icon" i]')?.href,
    themeColor: document.querySelector('meta[name="theme-color" i]')?.content,
    hreflang: Array.from(
      document.querySelectorAll('link[rel~="alternate" i][hreflang]')
    ).map((link) => ({
      language: link.getAttribute("hreflang"),
      href: link.href,
    })),
  };
}

function extractJSONLD() {
  const scripts = document.querySelectorAll(
    'script[type="application/ld+json"]'
  );
  const data = [];
  const errors = [];

  Array.from(scripts).forEach((script, index) => {
    try {
      data.push(JSON.parse(script.textContent.trim()));
    } catch (error) {
      errors.push(`Block ${index + 1}: ${error.message}`);
    }
  });

  return { data, errors, total: scripts.length };
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
      const jsonld = extractJSONLD();
      sendResponse({
        metadata,
        jsonldData: jsonld.data,
        jsonldErrors: jsonld.errors,
        jsonldTotal: jsonld.total,
      });
    })();
    // Keep the message channel open for the async response
    return true;
  }
});
