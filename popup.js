function extractMetadataFromRawHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  return {
    title: doc.title,
    description: doc.querySelector('meta[name="description"]')?.content,
    metaTitle: doc.querySelector("title")?.textContent,
    metaDescription: doc.querySelector('meta[name="description"]')?.content,
    metaRobots: doc.querySelector('meta[name="robots"]')?.content,
    ogTitle: doc.querySelector('meta[property="og:title"]')?.content,
    ogImage: doc.querySelector('meta[property="og:image"]')?.content,
  };
}

function generateComparisonHTML(label, original, current) {
  let html = `<h3>${label}</h3><div class="metadata">`;

  if (!original) {
    html += `<div class="original">original: not loaded</div>`;
  } else if (original !== current) {
    html += `<div class="original">original: ${original}</div>`;
  }

  html += `${current || "N/A"}</div>`;
  return html;
}

function generateJsonldHTML(label, original, current) {
  let html = `<h3>${label}</h3><div class="metadata">`;

  if (!original) {
    html += `<div class="original">original: not loaded</div>`;
  } else if (original !== current) {
    html += `<div class="original">original: ${original}</div>`;
  }

  html += `${current || "N/A"}</div>`;
  return html;
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
            const divResults = document.getElementById("results");

            if (!metadata && !jsonldData) {
              divResults.innerHTML = `<h3>Metadata not found</h3>`;
              return;
            }

            if (metadata) {
              let comparisonHTML = "";

              comparisonHTML += generateComparisonHTML(
                "Title",
                rawMetadata.title,
                metadata.title
              );
              comparisonHTML += generateComparisonHTML(
                "Description",
                rawMetadata.description,
                metadata.description
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Title",
                rawMetadata.metaTitle,
                metadata.metaTitle
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Description",
                rawMetadata.metaDescription,
                metadata.metaDescription
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Robots",
                rawMetadata.metaRobots,
                metadata.metaRobots
              );
              comparisonHTML += generateComparisonHTML(
                "OG Title",
                rawMetadata.ogTitle,
                metadata.ogTitle
              );
              comparisonHTML += generateComparisonHTML(
                "OG Image",
                rawMetadata.ogImage,
                metadata.ogImage
              );

              // 두 메타데이터 비교하고 팝업에 표시
              divResults.innerHTML = comparisonHTML;
            }

            // JSON-LD 데이터 표시
            const divJSONLD = document.getElementById("jsonld");
            if (divJSONLD) {
              let html = `<div><h3>JSON-LD Data:</h3>`;
              html += `<div class="metadata" >${JSON.stringify(
                jsonldData,
                null,
                2
              )}</div></div>`;
              divJSONLD.innerHTML = html;
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
