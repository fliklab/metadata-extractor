import buildRow from "./row.js";

const getSectionTitle = (title) => {
  return `<div class="section-header"><div class="section-title">${title}</div></div>`;
};

const getSectionList = (title, rows) => {
  return `<div class="section">${getSectionTitle(title)}<div class="list">${rows
    .map((r) => buildRow(r))
    .join("")}</div></div>`;
};

export { getSectionTitle, getSectionList };
export default { getSectionTitle, getSectionList };
