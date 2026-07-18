import buildRow from "./row.js";

const getSectionTitle = (title, collapsed = false) => {
  return `<div class="section-header">
    <button class="section-toggle" type="button" aria-expanded="${String(
      !collapsed
    )}">
      <span class="section-title">${title}</span>
      <span class="section-chevron" aria-hidden="true">⌄</span>
    </button>
  </div>`;
};

const getSectionList = (title, rows, options = {}) => {
  const { id = "", collapsed = false } = options;
  return `<div class="section ${
    collapsed ? "collapsed" : ""
  }" data-section-id="${id}">${getSectionTitle(
    title,
    collapsed
  )}<div class="list">${rows.map((r) => buildRow(r)).join("")}</div></div>`;
};

export { getSectionTitle, getSectionList };
export default { getSectionTitle, getSectionList };
