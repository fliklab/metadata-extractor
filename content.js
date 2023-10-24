function extractMetadataFromDOM() {
  return {
    title: document.title,
    description: document.querySelector('meta[name="description"]')?.content,
    metaTitle: document.querySelector("title")?.textContent,
    metaDescription: document.querySelector('meta[name="description"]')
      ?.content,
    metaRobots: document.querySelector('meta[name="robots"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentMetadata") {
    const metadata = extractMetadataFromDOM();
    const jsonldData = extractJSONLD();
    sendResponse({ metadata, jsonldData });
  }
});
