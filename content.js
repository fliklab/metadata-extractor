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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getCurrentMetadata") {
    sendResponse(extractMetadataFromDOM());
  }
});
