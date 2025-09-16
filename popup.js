import getGhip from "./ui/chip.js";

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

function buildRow({ key, value, original, code, state, hint }) {
  const safeValue = value ?? "N/A";
  const safeOriginal = original ?? "N/A";
  const hasCode = Boolean(code);
  const codeId = `code-${key
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;

  const stateClass =
    state === "changed"
      ? "state-changed"
      : state === "removed"
      ? "state-removed"
      : state === "new"
      ? "state-new"
      : "";
  const chip = getGhip(state, hint);
  const displayValue =
    state === "changed"
      ? `${escapeHtml(
          safeValue
        )}<div class="before" style="color: var(--muted); font-size: 12px;">Before: ${escapeHtml(
          safeOriginal
        )}</div>`
      : escapeHtml(safeValue);

  return `
    <div class="row ${stateClass}">
      <div class="key">${key}</div>
      <div class="value">${displayValue} ${chip}</div>
      <div class="tools">${
        hasCode
          ? `<button class="code-btn" data-target="${codeId}">&lt;/&gt;</button>`
          : ""
      }</div>
      ${hasCode ? `<pre id="${codeId}" class="code">${code}</pre>` : ""}
    </div>
  `;
}

function toMetaTag(propertyOrName, content, isProperty = true) {
  if (content == null) return null;
  return isProperty
    ? `&lt;meta property="${propertyOrName}" content="${escapeHtml(
        content
      )}"&gt;`
    : `&lt;meta name="${propertyOrName}" content="${escapeHtml(content)}"&gt;`;
}

function toTitleTag(content) {
  if (content == null) return null;
  return `&lt;title&gt;${escapeHtml(content)}&lt;/title&gt;`;
}

function toLinkTag(rel, href) {
  if (href == null) return null;
  return `&lt;link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}" /&gt;`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
              groups.innerHTML = `<div class="section"><div class="section-header"><div class="section-title">No Metadata</div></div><div class="list"></div></div>`;
              return;
            }

            if (metadata) {
              const getState = (current, original) => {
                const cur = current ?? null;
                const ori = original ?? null;
                if (cur === null && ori === null) return null;
                if (cur === null && ori !== null) return "removed";
                if (cur !== null && ori === null) return "new";
                return cur === ori ? "same" : "changed";
              };

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
