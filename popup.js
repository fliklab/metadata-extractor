import buildRow from "./ui/row.js";
import extractMetadataFromRawHTML from "./core/extractMetaDataFromRawHTML.js";
import {
  toMetaTag,
  toTitleTag,
  toLinkTag,
  escapeHtml,
} from "./core/formatToTag.js";

import { getSectionList } from "./ui/section.js";

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];

    // 원본 HTML 가져오기
    chrome.runtime.sendMessage(
      { action: "getRawHTML", url: activeTab.url },
      (response) => {
        const rawMetadata = extractMetadataFromRawHTML(response.html);

        // 현재 DOM에서 메타데이터 가져오기
        chrome.tabs.sendMessage(
          activeTab.id,
          { action: "getCurrentMetadata" },
          (data) => {
            const metadata = data?.metadata;
            const jsonldData = data?.jsonldData;
            const groups = document.getElementById("groups");
            const activeUrl = document.getElementById("activeUrl");

            if (activeUrl) activeUrl.textContent = activeTab.url || "";

            if (!metadata && !jsonldData) {
              groups.innerHTML = `${getSectionList("No Metadata", [])}`;
              return;
            }

            if (metadata) {
              const rawTitle = rawMetadata.metaTitle || rawMetadata.title;

              const basicList = [
                {
                  key: "title",
                  value: metadata.title,
                  original: rawTitle,
                  code: toTitleTag(rawTitle),
                  state: getState(metadata.title, rawTitle),
                },
                {
                  key: "meta title",
                  value: metadata.metaTitle,
                  original: rawTitle,
                  code: toMetaTag("title", rawTitle, false),
                  state: getState(metadata.metaTitle, rawTitle),
                },
                {
                  key: "description",
                  value: metadata.description,
                  original: rawMetadata.metaDescription,
                  code: toMetaTag(
                    "description",
                    rawMetadata.metaDescription,
                    false
                  ),
                  state: getState(
                    metadata.description,
                    rawMetadata.metaDescription
                  ),
                },
                {
                  key: "meta description",
                  value: metadata.metaDescription,
                  original: rawMetadata.metaDescription,
                  code: toMetaTag(
                    "description",
                    rawMetadata.metaDescription,
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
                  code: toLinkTag("canonical", rawMetadata.canonicalUrl),
                  state: getState(
                    metadata.canonicalUrl,
                    rawMetadata.canonicalUrl
                  ),
                },
              ];

              const ogList = [
                {
                  key: "og:title",
                  value: metadata.ogTitle,
                  original: rawMetadata.ogTitle,
                  code: toMetaTag("og:title", rawMetadata.ogTitle, true),
                  state: getState(metadata.ogTitle, rawMetadata.ogTitle),
                },
                {
                  key: "og:url",
                  value: metadata.ogUrl,
                  original: rawMetadata.ogUrl,
                  code: toMetaTag("og:url", rawMetadata.ogUrl, true),
                  state: getState(metadata.ogUrl, rawMetadata.ogUrl),
                },
                {
                  key: "og:image",
                  value: metadata.ogImage,
                  original: rawMetadata.ogImage,
                  code: toMetaTag("og:image", rawMetadata.ogImage, true),
                  state: getState(metadata.ogImage, rawMetadata.ogImage),
                },
              ];

              const etcList = [
                {
                  key: "robots",
                  value: metadata.metaRobots,
                  original: rawMetadata.metaRobots,
                  code: toMetaTag("robots", rawMetadata.metaRobots, false),
                  state: getState(metadata.metaRobots, rawMetadata.metaRobots),
                },
                {
                  key: "Storebot-Google",
                  value: metadata.metaStorebotGoogle,
                  original: rawMetadata.metaStorebotGoogle,
                  code: toMetaTag(
                    "Storebot-Google",
                    rawMetadata.metaStorebotGoogle,
                    false
                  ),
                  state: getState(
                    metadata.metaStorebotGoogle,
                    rawMetadata.metaStorebotGoogle
                  ),
                },
              ];

              const buildSection = (title, rows) => `
                <div class="section">
                  <div class="section-header">
                    <div class="section-title">${title}</div>
                  </div>
                  <div class="list">
                    ${rows.map((r) => buildRow(r)).join("")}
                  </div>
                </div>
              `;

              groups.innerHTML = [
                buildSection("Basic", basicList),
                buildSection("Open Graph", ogList),
                buildSection("Etc", etcList),
              ].join("");

              // 코드 토글 바인딩
              groups.querySelectorAll(".code-btn").forEach((btn) => {
                btn.addEventListener("click", () => {
                  const target = document.getElementById(
                    btn.getAttribute("data-target")
                  );
                  if (!target) return;
                  const isOpen = target.style.display === "block";
                  target.style.display = isOpen ? "none" : "block";
                });
              });
            }

            // JSON-LD 데이터 표시
            const divJSONLD = document.getElementById("jsonld");
            if (divJSONLD) {
              const pretty =
                jsonldData && jsonldData.length
                  ? escapeHtml(JSON.stringify(jsonldData, null, 2))
                  : "No JSON-LD";
              const jsonId = `jsonld-${Math.random().toString(36).slice(2, 7)}`;
              divJSONLD.innerHTML = `
                <div class="section-header">
                  <div class="section-title">JSON-LD</div>
                  <div class="tools">
                    <button class="code-btn" data-target="${jsonId}">Toggle</button>
                  </div>
                </div>
                <div class="list">
                  <div class="row">
                    <pre id="${jsonId}" class="code jsonld" style="display: ${
                jsonldData && jsonldData.length ? "block" : "none"
              }">${pretty}</pre>
                  </div>
                </div>
              `;
              const btn = divJSONLD.querySelector(".code-btn");
              btn?.addEventListener("click", () => {
                const pre = divJSONLD.querySelector(`#${jsonId}`);
                if (!pre) return;
                pre.style.display =
                  pre.style.display === "block" ? "none" : "block";
              });
            }
          }
        );
      }
    );
  });
});

const refreshButton = document.getElementById("refreshPage");
refreshButton.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome.tabs.reload(activeTab.id);
  });
});
