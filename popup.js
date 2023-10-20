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

document.addEventListener("DOMContentLoaded", function () {
  function loadData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      chrome.runtime.sendMessage(
        { action: "getRawHTML", url: activeTab.url },
        (response) => {
          const rawMetadata = extractMetadataFromRawHTML(response.html);

          chrome.tabs.sendMessage(
            activeTab.id,
            { action: "getCurrentMetadata" },
            (currentMetadata) => {
              const divResults = document.getElementById("results");

              if (!currentMetadata) {
                divResults.innerHTML = `<h3>Metadata not found</h3>`;
                return;
              }

              let comparisonHTML = "";
              comparisonHTML += generateComparisonHTML(
                "Title",
                rawMetadata.title,
                currentMetadata.title
              );
              comparisonHTML += generateComparisonHTML(
                "Description",
                rawMetadata.description,
                currentMetadata.description
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Title",
                rawMetadata.metaTitle,
                currentMetadata.metaTitle
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Description",
                rawMetadata.metaDescription,
                currentMetadata.metaDescription
              );
              comparisonHTML += generateComparisonHTML(
                "Meta Robots",
                rawMetadata.metaRobots,
                currentMetadata.metaRobots
              );
              comparisonHTML += generateComparisonHTML(
                "OG Title",
                rawMetadata.ogTitle,
                currentMetadata.ogTitle
              );
              comparisonHTML += generateComparisonHTML(
                "OG Image",
                rawMetadata.ogImage,
                currentMetadata.ogImage
              );

              divResults.innerHTML = comparisonHTML;
            }
          );
        }
      );
    });
  }

  // 초기 데이터 로드
  loadData();
});
