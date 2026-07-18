function resolveUrl(value, baseUrl) {
  if (!value) return null;
  try {
    return new URL(value, baseUrl).href;
  } catch {
    return value;
  }
}

function getDeclaredCharset(doc) {
  const charset = doc.querySelector("meta[charset]")?.getAttribute("charset");
  if (charset) return charset;

  const contentType = doc.querySelector(
    'meta[http-equiv="content-type" i]'
  )?.content;
  return contentType?.match(/charset\s*=\s*([^;\s]+)/i)?.[1] || null;
}

function extractMetadataFromRawHTML(html, baseUrl) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const canonical = doc.querySelector('link[rel~="canonical" i]');
  const favicon = doc.querySelector('link[rel~="icon" i]');
  const hreflang = Array.from(
    doc.querySelectorAll('link[rel~="alternate" i][hreflang]')
  ).map((link) => ({
    language: link.getAttribute("hreflang"),
    href: resolveUrl(link.getAttribute("href"), baseUrl),
  }));

  return {
    title: doc.title,
    metaTitle: doc.querySelector('meta[name="title" i]')?.content,
    metaDescription: doc.querySelector('meta[name="description"]')?.content,
    metaRobots: doc.querySelector('meta[name="robots"]')?.content,
    metaStorebotGoogle: doc.querySelector('meta[name="Storebot-Google" i]')
      ?.content,
    ogTitle: doc.querySelector('meta[property="og:title"]')?.content,
    ogDescription: doc.querySelector('meta[property="og:description"]')
      ?.content,
    ogType: doc.querySelector('meta[property="og:type"]')?.content,
    ogSiteName: doc.querySelector('meta[property="og:site_name"]')?.content,
    ogImage: doc.querySelector('meta[property="og:image"]')?.content,
    ogUrl: doc.querySelector('meta[property="og:url"]')?.content,
    canonicalUrl: resolveUrl(canonical?.getAttribute("href"), baseUrl),
    language: doc.documentElement.getAttribute("lang"),
    charset: getDeclaredCharset(doc),
    viewport: doc.querySelector('meta[name="viewport" i]')?.content,
    favicon: resolveUrl(favicon?.getAttribute("href"), baseUrl),
    themeColor: doc.querySelector('meta[name="theme-color" i]')?.content,
    hreflang,
  };
}

export default extractMetadataFromRawHTML;
