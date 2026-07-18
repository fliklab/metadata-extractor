import buildRow from "./ui/row.js";
import extractMetadataFromRawHTML from "./core/extractMetaDataFromRawHTML.js";
import {
  toMetaTag,
  toTitleTag,
  toLinkTag,
  escapeHtml,
} from "./core/formatToTag.js";
import getState from "./core/getState.js";
import { getSectionList } from "./ui/section.js";

const sourceValue = (current, original) => original ?? current;

function formatHreflang(items) {
  if (!items?.length) return null;
  return items.map(({ language, href }) => `${language}: ${href}`).join("\n");
}

function toHtmlLangTag(language) {
  return language == null
    ? null
    : escapeHtml(`<html lang="${language}">`);
}

function toCharsetTag(charset) {
  return charset == null
    ? null
    : escapeHtml(`<meta charset="${charset}">`);
}

function toHreflangTags(items) {
  if (!items?.length) return null;
  return items
    .map(({ language, href }) =>
      escapeHtml(
        `<link rel="alternate" hreflang="${language}" href="${href}">`
      )
    )
    .join("\n");
}

function collectJsonLdTypes(jsonldData) {
  const types = new Set();

  const visit = (value) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;

    const type = value["@type"];
    if (Array.isArray(type)) type.forEach((item) => types.add(String(item)));
    else if (type) types.add(String(type));

    Object.values(value).forEach(visit);
  };

  visit(jsonldData);
  return Array.from(types);
}

function bindCodeToggles(container) {
  container.querySelectorAll(".code-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target");
      const target = targetId ? document.getElementById(targetId) : null;
      if (!target) return;

      const shouldOpen = target.style.display !== "block";
      target.style.display = shouldOpen ? "block" : "none";
      button.setAttribute("aria-expanded", String(shouldOpen));
      button.closest(".row")?.classList.toggle("expanded", shouldOpen);
    });
  });
}

function renderJsonLd({ jsonldData, jsonldErrors, jsonldTotal }) {
  const container = document.getElementById("jsonld");
  if (!container) return;

  const data = jsonldData || [];
  const errors = jsonldErrors || [];
  const types = collectJsonLdTypes(data);
  const total = jsonldTotal ?? data.length + errors.length;
  const rawId = `jsonld-${Math.random().toString(36).slice(2, 7)}`;
  const summaryRows = [
    { key: "blocks", value: total },
    { key: "valid", value: data.length },
    { key: "invalid", value: errors.length },
    {
      key: "@type",
      value: types.length ? types.join(", ") : null,
      code: types.length ? escapeHtml(types.join("\n")) : null,
    },
    {
      key: "parse errors",
      value: errors.length ? errors.join("\n") : null,
      code: errors.length ? escapeHtml(errors.join("\n")) : null,
    },
  ];
  const pretty = data.length
    ? escapeHtml(JSON.stringify(data, null, 2))
    : "No valid JSON-LD";

  container.innerHTML = `
    <div class="section-header">
      <div class="section-title">JSON-LD Summary</div>
      <div class="tools">
        ${
          data.length
            ? `<button class="code-btn" data-target="${rawId}" aria-expanded="false">Raw</button>`
            : ""
        }
      </div>
    </div>
    <div class="list">
      ${summaryRows.map((row) => buildRow(row)).join("")}
      <div class="row">
        <pre id="${rawId}" class="code jsonld">${pretty}</pre>
      </div>
    </div>
  `;

  bindCodeToggles(container);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const groups = document.getElementById("groups");
    const activeUrl = document.getElementById("activeUrl");

    if (!activeTab) {
      groups.innerHTML = getSectionList("Unable to inspect tab", []);
      return;
    }

    if (activeUrl) activeUrl.textContent = activeTab.url || "";

    chrome.runtime.sendMessage(
      { action: "getRawHTML", url: activeTab.url },
      (response) => {
        const rawMetadata = response?.html
          ? extractMetadataFromRawHTML(response.html, activeTab.url)
          : {};
        const httpInfo = response?.httpInfo;
        const fetchError = response?.error;

        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "getCurrentMetadata" },
          (data) => {
            const tabError = chrome.runtime.lastError?.message;
            const metadata = data?.metadata;
            const sections = [];

            if (metadata) {
              const basicList = [
                {
                  key: "title",
                  value: metadata.title,
                  original: rawMetadata.title,
                  code: toTitleTag(sourceValue(metadata.title, rawMetadata.title)),
                  state: getState(metadata.title, rawMetadata.title),
                },
                {
                  key: "meta title",
                  value: metadata.metaTitle,
                  original: rawMetadata.metaTitle,
                  code: toMetaTag(
                    "title",
                    sourceValue(metadata.metaTitle, rawMetadata.metaTitle),
                    false
                  ),
                  state: getState(metadata.metaTitle, rawMetadata.metaTitle),
                },
                {
                  key: "meta description",
                  value: metadata.metaDescription,
                  original: rawMetadata.metaDescription,
                  code: toMetaTag(
                    "description",
                    sourceValue(
                      metadata.metaDescription,
                      rawMetadata.metaDescription
                    ),
                    false
                  ),
                  state: getState(
                    metadata.metaDescription,
                    rawMetadata.metaDescription
                  ),
                },
                {
                  key: "canonical url",
                  value: metadata.canonicalUrl,
                  original: rawMetadata.canonicalUrl,
                  code: toLinkTag(
                    "canonical",
                    sourceValue(metadata.canonicalUrl, rawMetadata.canonicalUrl)
                  ),
                  state: getState(
                    metadata.canonicalUrl,
                    rawMetadata.canonicalUrl
                  ),
                },
              ];

              const documentList = [
                {
                  key: "charset",
                  value: metadata.charset,
                  original: rawMetadata.charset,
                  code: toCharsetTag(
                    sourceValue(metadata.charset, rawMetadata.charset)
                  ),
                  state: getState(
                    metadata.charset?.toLowerCase(),
                    rawMetadata.charset?.toLowerCase()
                  ),
                },
                {
                  key: "viewport",
                  value: metadata.viewport,
                  original: rawMetadata.viewport,
                  code: toMetaTag(
                    "viewport",
                    sourceValue(metadata.viewport, rawMetadata.viewport),
                    false
                  ),
                  state: getState(metadata.viewport, rawMetadata.viewport),
                },
                {
                  key: "favicon",
                  value: metadata.favicon,
                  original: rawMetadata.favicon,
                  code: toLinkTag(
                    "icon",
                    sourceValue(metadata.favicon, rawMetadata.favicon)
                  ),
                  state: getState(metadata.favicon, rawMetadata.favicon),
                },
                {
                  key: "theme-color",
                  value: metadata.themeColor,
                  original: rawMetadata.themeColor,
                  code: toMetaTag(
                    "theme-color",
                    sourceValue(metadata.themeColor, rawMetadata.themeColor),
                    false
                  ),
                  state: getState(metadata.themeColor, rawMetadata.themeColor),
                },
              ];

              const currentHreflang = formatHreflang(metadata.hreflang);
              const originalHreflang = formatHreflang(rawMetadata.hreflang);
              const languageList = [
                {
                  key: "html lang",
                  value: metadata.language,
                  original: rawMetadata.language,
                  code: toHtmlLangTag(
                    sourceValue(metadata.language, rawMetadata.language)
                  ),
                  state: getState(metadata.language, rawMetadata.language),
                },
                {
                  key: "hreflang",
                  value: currentHreflang,
                  original: originalHreflang,
                  code: toHreflangTags(
                    rawMetadata.hreflang?.length
                      ? rawMetadata.hreflang
                      : metadata.hreflang
                  ),
                  state: getState(currentHreflang, originalHreflang),
                },
              ];

              const ogList = [
                ["og:title", "ogTitle"],
                ["og:description", "ogDescription"],
                ["og:type", "ogType"],
                ["og:site_name", "ogSiteName"],
                ["og:url", "ogUrl"],
                ["og:image", "ogImage"],
              ].map(([key, field]) => ({
                key,
                value: metadata[field],
                original: rawMetadata[field],
                code: toMetaTag(
                  key,
                  sourceValue(metadata[field], rawMetadata[field]),
                  true
                ),
                state: getState(metadata[field], rawMetadata[field]),
              }));

              const etcList = [
                {
                  key: "robots",
                  value: metadata.metaRobots,
                  original: rawMetadata.metaRobots,
                  code: toMetaTag(
                    "robots",
                    sourceValue(metadata.metaRobots, rawMetadata.metaRobots),
                    false
                  ),
                  state: getState(metadata.metaRobots, rawMetadata.metaRobots),
                },
                {
                  key: "Storebot-Google",
                  value: metadata.metaStorebotGoogle,
                  original: rawMetadata.metaStorebotGoogle,
                  code: toMetaTag(
                    "Storebot-Google",
                    sourceValue(
                      metadata.metaStorebotGoogle,
                      rawMetadata.metaStorebotGoogle
                    ),
                    false
                  ),
                  state: getState(
                    metadata.metaStorebotGoogle,
                    rawMetadata.metaStorebotGoogle
                  ),
                },
              ];

              sections.push(
                getSectionList("Basic", basicList),
                getSectionList("Document", documentList),
                getSectionList("Languages", languageList),
                getSectionList("Open Graph", ogList),
                getSectionList("Etc", etcList)
              );
            } else {
              sections.push(
                getSectionList(tabError || "No Metadata", [])
              );
            }

            if (httpInfo) {
              sections.push(
                getSectionList("HTTP Response", [
                  {
                    key: "status",
                    value: `${httpInfo.status} ${httpInfo.statusText}`.trim(),
                  },
                  {
                    key: "final url",
                    value: httpInfo.finalUrl,
                    code: httpInfo.finalUrl
                      ? escapeHtml(httpInfo.finalUrl)
                      : null,
                  },
                  { key: "redirected", value: String(httpInfo.redirected) },
                  {
                    key: "content-type",
                    value: httpInfo.contentType,
                    code: httpInfo.contentType
                      ? escapeHtml(httpInfo.contentType)
                      : null,
                  },
                  {
                    key: "x-robots-tag",
                    value: httpInfo.xRobotsTag,
                    code: httpInfo.xRobotsTag
                      ? escapeHtml(httpInfo.xRobotsTag)
                      : null,
                  },
                ])
              );
            } else if (fetchError) {
              sections.push(
                getSectionList("HTTP Response", [
                  {
                    key: "error",
                    value: fetchError,
                    code: escapeHtml(fetchError),
                  },
                ])
              );
            }

            groups.innerHTML = sections.join("");
            bindCodeToggles(groups);
            renderJsonLd({
              jsonldData: data?.jsonldData,
              jsonldErrors: data?.jsonldErrors,
              jsonldTotal: data?.jsonldTotal,
            });
          }
        );
      }
    );
  });
});

document.getElementById("refreshPage")?.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) chrome.tabs.reload(activeTab.id);
  });
});
