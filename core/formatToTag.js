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

export { toMetaTag, toTitleTag, toLinkTag, escapeHtml };
