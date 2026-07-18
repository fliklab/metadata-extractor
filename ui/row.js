import getGhip from "./chip.js";

function buildRow({ key, value, original, code, state, hint }) {
  const safeValue = value ?? "N/A";
  const safeOriginal = original ?? "N/A";
  const hasCode = Boolean(code);
  const codeId = `code-${key
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()}-${Math.random().toString(36).slice(2, 7)}`;

  const stateClass = state ? `state-${state}` : "";
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

export default buildRow;
