import getGhip from "./chip.js";
import { escapeHtml } from "../core/formatToTag.js";

function buildRow({ key, value, original, code, state, hint }) {
  const safeValue = value ?? "N/A";
  const safeOriginal = original ?? "N/A";
  const hasCode = Boolean(code);
  const showSourceLabel =
    typeof document !== "undefined" && document.documentElement.lang === "ko"
      ? "전체 값과 원본 보기"
      : "Show full value and source";
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
      <div class="row ${stateClass} ${hasCode ? "has-code" : ""}">
        <div class="key">${key}</div>
        <div class="value">
          <div class="value-text">${displayValue}</div>
          ${chip}
        </div>
        <div class="tools">${
          hasCode
            ? `<button class="code-btn" data-target="${codeId}" aria-expanded="false" title="${showSourceLabel}">&lt;/&gt;</button>`
            : ""
        }</div>
        ${hasCode ? `<pre id="${codeId}" class="code">${code}</pre>` : ""}
      </div>
    `;
}

export default buildRow;
