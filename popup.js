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

const LANGUAGE_STORAGE_KEY = "meta-checker-language";
const locale = localStorage.getItem(LANGUAGE_STORAGE_KEY) === "ko" ? "ko" : "en";
document.documentElement.lang = locale;

const messages = {
  en: {
    reload: "Reload",
    switchLanguage: "한국어",
    unableToInspect: "Unable to inspect tab",
    noMetadata: "No Metadata",
    basic: "Basic",
    document: "Document",
    languages: "Languages",
    openGraph: "Open Graph",
    etc: "Etc",
    httpResponse: "HTTP Response",
    jsonLdSummary: "JSON-LD Summary",
    title: "title",
    metaTitle: "meta title",
    metaDescription: "meta description",
    canonicalUrl: "canonical url",
    charset: "charset",
    viewport: "viewport",
    favicon: "favicon",
    themeColor: "theme-color",
    htmlLang: "html lang",
    hreflang: "hreflang",
    blocks: "blocks",
    valid: "valid",
    invalid: "invalid",
    types: "@type",
    parseErrors: "parse errors",
    raw: "Raw",
    noValidJsonLd: "No valid JSON-LD",
    status: "status",
    finalUrl: "final url",
    redirected: "redirected",
    contentType: "content-type",
    xRobotsTag: "x-robots-tag",
    error: "error",
    yes: "Yes",
    no: "No",
  },
  ko: {
    reload: "새로고침",
    switchLanguage: "English",
    unableToInspect: "탭을 확인할 수 없음",
    noMetadata: "메타데이터 없음",
    basic: "기본 정보",
    document: "문서 정보",
    languages: "다국어 정보",
    openGraph: "오픈 그래프",
    etc: "기타",
    httpResponse: "HTTP 응답",
    jsonLdSummary: "JSON-LD 요약",
    title: "제목",
    metaTitle: "메타 제목",
    metaDescription: "메타 설명",
    canonicalUrl: "대표 URL",
    charset: "문자 인코딩",
    viewport: "뷰포트",
    favicon: "파비콘",
    themeColor: "테마 색상",
    htmlLang: "문서 언어",
    hreflang: "대체 언어",
    blocks: "전체 블록",
    valid: "정상",
    invalid: "오류",
    types: "@type",
    parseErrors: "파싱 오류",
    raw: "원문",
    noValidJsonLd: "정상 JSON-LD 없음",
    status: "상태",
    finalUrl: "최종 URL",
    redirected: "리디렉션",
    contentType: "콘텐츠 유형",
    xRobotsTag: "X-Robots-Tag",
    error: "오류",
    yes: "예",
    no: "아니요",
  },
};

const t = (key) => messages[locale][key] ?? key;
const sourceValue = (current, original) => original ?? current;

function getSectionOptions(id, defaultCollapsed = false) {
  const saved = localStorage.getItem(`meta-checker-section-${id}`);
  return {
    id,
    collapsed: saved == null ? defaultCollapsed : saved === "true",
  };
}

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

function bindSectionToggles(container) {
  container.querySelectorAll(".section-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const section = button.closest(".section");
      if (!section) return;

      const collapsed = section.classList.toggle("collapsed");
      button.setAttribute("aria-expanded", String(!collapsed));
      const sectionId = section.dataset.sectionId;
      if (sectionId) {
        localStorage.setItem(
          `meta-checker-section-${sectionId}`,
          String(collapsed)
        );
      }
    });
  });
}

function showChipTooltip(target) {
  const tooltip = document.getElementById("chipTooltip");
  const description = target.dataset.tooltip;
  if (!tooltip || !description) return;

  tooltip.textContent = description;
  tooltip.classList.add("visible");

  const targetRect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();
  const gap = 8;
  const viewportPadding = 8;
  const maxLeft = window.innerWidth - tooltipRect.width - viewportPadding;
  const left = Math.min(
    Math.max(viewportPadding, targetRect.right - tooltipRect.width),
    maxLeft
  );

  let top = targetRect.top - tooltipRect.height - gap;
  if (top < viewportPadding) top = targetRect.bottom + gap;
  top = Math.min(
    Math.max(viewportPadding, top),
    window.innerHeight - tooltipRect.height - viewportPadding
  );

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function hideChipTooltip() {
  document.getElementById("chipTooltip")?.classList.remove("visible");
}

document.addEventListener("mouseover", (event) => {
  const target = event.target.closest?.(".chip-help");
  if (target) showChipTooltip(target);
});

document.addEventListener("mouseout", (event) => {
  const target = event.target.closest?.(".chip-help");
  if (target && !target.contains(event.relatedTarget)) hideChipTooltip();
});

document.addEventListener("focusin", (event) => {
  const target = event.target.closest?.(".chip-help");
  if (target) showChipTooltip(target);
});

document.addEventListener("focusout", (event) => {
  if (event.target.closest?.(".chip-help")) hideChipTooltip();
});

function renderJsonLd({ jsonldData, jsonldErrors, jsonldTotal }) {
  const container = document.getElementById("jsonld");
  if (!container) return;

  const data = jsonldData || [];
  const errors = jsonldErrors || [];
  const types = collectJsonLdTypes(data);
  const total = jsonldTotal ?? data.length + errors.length;
  const rawId = `jsonld-${Math.random().toString(36).slice(2, 7)}`;
  const sectionOptions = getSectionOptions("jsonld");
  const summaryRows = [
    { key: t("blocks"), value: total },
    { key: t("valid"), value: data.length },
    { key: t("invalid"), value: errors.length },
    {
      key: t("types"),
      value: types.length ? types.join(", ") : null,
      code: types.length ? escapeHtml(types.join("\n")) : null,
    },
    {
      key: t("parseErrors"),
      value: errors.length ? errors.join("\n") : null,
      code: errors.length ? escapeHtml(errors.join("\n")) : null,
    },
  ];
  const pretty = data.length
    ? escapeHtml(JSON.stringify(data, null, 2))
    : t("noValidJsonLd");

  container.dataset.sectionId = sectionOptions.id;
  container.classList.toggle("collapsed", sectionOptions.collapsed);

  container.innerHTML = `
    <div class="section-header">
      <button class="section-toggle" type="button" aria-expanded="${String(
        !sectionOptions.collapsed
      )}">
        <span class="section-chevron" aria-hidden="true">›</span>
        <span class="section-title">${t("jsonLdSummary")}</span>
      </button>
      <div class="tools">
        ${
          data.length
            ? `<button class="code-btn" data-target="${rawId}" aria-expanded="false">${t(
                "raw"
              )}</button>`
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
  bindSectionToggles(container);
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    const groups = document.getElementById("groups");
    const activeUrl = document.getElementById("activeUrl");

    if (!activeTab) {
      groups.innerHTML = getSectionList(
        t("unableToInspect"),
        [],
        getSectionOptions("error")
      );
      bindSectionToggles(groups);
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
            const documentInfo = document.getElementById("documentInfo");

            if (metadata) {
              const basicList = [
                {
                  key: t("title"),
                  value: metadata.title,
                  original: rawMetadata.title,
                  code: toTitleTag(sourceValue(metadata.title, rawMetadata.title)),
                  state: getState(metadata.title, rawMetadata.title),
                },
                {
                  key: t("metaTitle"),
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
                  key: t("metaDescription"),
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
                  key: t("canonicalUrl"),
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
                  key: t("charset"),
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
                  key: t("viewport"),
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
                  key: t("favicon"),
                  value: metadata.favicon,
                  original: rawMetadata.favicon,
                  code: toLinkTag(
                    "icon",
                    sourceValue(metadata.favicon, rawMetadata.favicon)
                  ),
                  state: getState(metadata.favicon, rawMetadata.favicon),
                },
                {
                  key: t("themeColor"),
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
                  key: t("htmlLang"),
                  value: metadata.language,
                  original: rawMetadata.language,
                  code: toHtmlLangTag(
                    sourceValue(metadata.language, rawMetadata.language)
                  ),
                  state: getState(metadata.language, rawMetadata.language),
                },
                {
                  key: t("hreflang"),
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
                getSectionList(
                  t("basic"),
                  basicList,
                  getSectionOptions("basic")
                ),
                getSectionList(
                  t("languages"),
                  languageList,
                  getSectionOptions("languages", true)
                ),
                getSectionList(
                  t("openGraph"),
                  ogList,
                  getSectionOptions("open-graph")
                ),
                getSectionList(
                  t("etc"),
                  etcList,
                  getSectionOptions("etc", true)
                )
              );

              if (documentInfo) {
                documentInfo.innerHTML = getSectionList(
                  t("document"),
                  documentList,
                  getSectionOptions("document", true)
                );
                bindCodeToggles(documentInfo);
                bindSectionToggles(documentInfo);
              }
            } else {
              if (documentInfo) documentInfo.innerHTML = "";
              sections.push(
                getSectionList(
                  tabError || t("noMetadata"),
                  [],
                  getSectionOptions("no-metadata")
                )
              );
            }

            if (httpInfo) {
              sections.push(
                getSectionList(
                  t("httpResponse"),
                  [
                    {
                      key: t("status"),
                      value: `${httpInfo.status} ${httpInfo.statusText}`.trim(),
                    },
                    {
                      key: t("finalUrl"),
                      value: httpInfo.finalUrl,
                      code: httpInfo.finalUrl
                        ? escapeHtml(httpInfo.finalUrl)
                        : null,
                    },
                    {
                      key: t("redirected"),
                      value: httpInfo.redirected ? t("yes") : t("no"),
                    },
                    {
                      key: t("contentType"),
                      value: httpInfo.contentType,
                      code: httpInfo.contentType
                        ? escapeHtml(httpInfo.contentType)
                        : null,
                    },
                    {
                      key: t("xRobotsTag"),
                      value: httpInfo.xRobotsTag,
                      code: httpInfo.xRobotsTag
                        ? escapeHtml(httpInfo.xRobotsTag)
                        : null,
                    },
                  ],
                  getSectionOptions("http-response", true)
                )
              );
            } else if (fetchError) {
              sections.push(
                getSectionList(
                  t("httpResponse"),
                  [
                    {
                      key: t("error"),
                      value: fetchError,
                      code: escapeHtml(fetchError),
                    },
                  ],
                  getSectionOptions("http-response", true)
                )
              );
            }

            groups.innerHTML = sections.join("");
            bindCodeToggles(groups);
            bindSectionToggles(groups);
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

const languageToggle = document.getElementById("languageToggle");
if (languageToggle) {
  languageToggle.textContent = t("switchLanguage");
  languageToggle.addEventListener("click", () => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale === "en" ? "ko" : "en");
    window.location.reload();
  });
}

const refreshButton = document.getElementById("refreshPage");
if (refreshButton) refreshButton.textContent = t("reload");
refreshButton?.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) chrome.tabs.reload(activeTab.id);
  });
});
