import {
  defaultPreviewScenario,
  getPreviewScenario,
} from "./scenarios.js";

const supportedLocales = new Set(["en", "ko", "ja", "es", "pt_BR"]);

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getMetaTag(name, content, property = false) {
  if (content == null) return "";
  const attribute = property ? "property" : "name";
  return `<meta ${attribute}="${escapeAttribute(
    name
  )}" content="${escapeAttribute(content)}">`;
}

function createRawHtml(scenario) {
  const metadata = scenario.originalMetadata || scenario.metadata || {};
  const jsonLd = scenario.jsonldData || [];
  const scripts = jsonLd
    .map(
      (item) =>
        `<script type="application/ld+json">${JSON.stringify(item)}</script>`
    )
    .join("");

  return `<!doctype html>
    <html lang="${escapeAttribute(metadata.language || "")}">
      <head>
        <meta charset="${escapeAttribute(metadata.charset || "UTF-8")}">
        <title>${escapeAttribute(metadata.title || "")}</title>
        ${getMetaTag("title", metadata.metaTitle)}
        ${getMetaTag("description", metadata.metaDescription)}
        ${getMetaTag("robots", metadata.metaRobots)}
        ${getMetaTag("og:title", metadata.ogTitle, true)}
        ${getMetaTag("og:description", metadata.ogDescription, true)}
        ${getMetaTag("og:type", metadata.ogType, true)}
        ${getMetaTag("og:site_name", metadata.ogSiteName, true)}
        ${getMetaTag("og:url", metadata.ogUrl, true)}
        ${getMetaTag("og:image", metadata.ogImage, true)}
        ${
          metadata.canonicalUrl
            ? `<link rel="canonical" href="${escapeAttribute(
                metadata.canonicalUrl
              )}">`
            : ""
        }
        ${scripts}
      </head>
      <body></body>
    </html>`;
}

export function installPreviewChrome(requestedScenario = defaultPreviewScenario) {
  const scenario = getPreviewScenario(requestedScenario);
  const params = new URLSearchParams(window.location.search);
  const requestedLocale = params.get("locale");
  if (supportedLocales.has(requestedLocale)) {
    localStorage.setItem("meta-checker-language", requestedLocale);
  }

  const metadataResponse = {
    metadata: scenario.metadata,
    jsonldData: scenario.jsonldData || [],
    jsonldErrors: scenario.jsonldErrors || [],
    jsonldTotal:
      scenario.jsonldTotal ??
      (scenario.jsonldData?.length || 0) +
        (scenario.jsonldErrors?.length || 0),
  };

  globalThis.__META_CHECKER_PREVIEW__ = {
    scenario: requestedScenario,
    lastHeadingIndex: null,
  };

  globalThis.chrome = {
    tabs: {
      query(_options, callback) {
        callback([{ id: 1, url: scenario.pageUrl }]);
      },
      sendMessage(_tabId, message, callback) {
        if (message.action === "getCurrentMetadata") {
          callback(metadataResponse);
          return;
        }
        if (message.action === "scrollToHeading") {
          globalThis.__META_CHECKER_PREVIEW__.lastHeadingIndex = message.index;
          callback?.({ success: true });
          return;
        }
        callback?.(null);
      },
    },
    runtime: {
      lastError: null,
      sendMessage(message, callback) {
        if (message.action === "getRawHTML") {
          callback({
            html: createRawHtml(scenario),
            httpInfo: scenario.httpInfo,
            error: scenario.fetchError,
          });
          return;
        }
        callback?.(null);
      },
    },
    scripting: {
      async executeScript() {},
    },
  };
}
