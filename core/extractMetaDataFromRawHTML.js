function extractMetadataFromRawHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return {
    title: doc.title,
    description: doc.querySelector('meta[name="description"]')?.content,
    metaTitle: doc.querySelector("title")?.textContent,
    metaDescription: doc.querySelector('meta[name="description"]')?.content,
    metaRobots: doc.querySelector('meta[name="robots"]')?.content,
    metaStorebotGoogle: doc.querySelector('meta[name="Storebot-Google"]')
      ?.content,
    ogTitle: doc.querySelector('meta[property="og:title"]')?.content,
    ogImage: doc.querySelector('meta[property="og:image"]')?.content,
    ogUrl: doc.querySelector('meta[property="og:url"]')?.content,
    // token-based, case-insensitive rel matching
    canonicalUrl: doc.querySelector('link[rel~="canonical" i]')?.href,
  };
}

export default extractMetadataFromRawHTML;
