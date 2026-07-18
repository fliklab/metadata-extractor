function getGhip(state, hint) {
  const isKorean =
    typeof document !== "undefined" && document.documentElement.lang === "ko";
  const labels = isKorean
    ? { same: "동일", changed: "변경", new: "추가", removed: "제거" }
    : { same: "Same", changed: "Changed", new: "New", removed: "Removed" };
  const descriptions = isKorean
    ? {
        same: "현재 DOM과 원본 HTML의 값이 같습니다.",
        changed: "현재 DOM의 값이 원본 HTML과 다릅니다.",
        new: "원본 HTML에는 없지만 현재 DOM에 추가된 값입니다.",
        removed: "원본 HTML에는 있지만 현재 DOM에서 제거된 값입니다.",
      }
    : {
        same: "The current DOM matches the original HTML.",
        changed: "The current DOM differs from the original HTML.",
        new: "Present in the current DOM but absent from the original HTML.",
        removed: "Present in the original HTML but missing from the current DOM.",
      };
  const stateText =
    state === "same" ||
    state === "changed" ||
    state === "new" ||
    state === "removed"
      ? labels[state]
      : hint;

  const help = descriptions[state]
    ? `<span class="chip-help" tabindex="0" data-tooltip="${descriptions[state]}">?</span>`
    : "";

  const chip =
    state === "same"
      ? `<span class="chip">${stateText}${help}</span>`
      : state === "changed"
      ? `<span class="chip warn">${stateText}${help}</span>`
      : state === "new"
      ? `<span class="chip info">${stateText}${help}</span>`
      : state === "removed"
      ? `<span class="chip danger">${stateText}${help}</span>`
      : hint
      ? `<span class="chip info">${hint}</span>`
      : "";

  return chip;
}

export default getGhip;
