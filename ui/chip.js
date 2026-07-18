const stateHelp = {
  en: {
    same: {
      label: "Same",
      description: "The current DOM matches the original HTML.",
    },
    changed: {
      label: "Changed",
      description: "The current DOM differs from the original HTML.",
    },
    new: {
      label: "New",
      description:
        "Present in the current DOM but absent from the original HTML.",
    },
    removed: {
      label: "Removed",
      description:
        "Present in the original HTML but missing from the current DOM.",
    },
  },
  ko: {
    same: {
      label: "동일",
      description: "현재 DOM과 원본 HTML의 값이 같습니다.",
    },
    changed: {
      label: "변경",
      description: "현재 DOM의 값이 원본 HTML과 다릅니다.",
    },
    new: {
      label: "추가",
      description: "원본 HTML에는 없지만 현재 DOM에 추가된 값입니다.",
    },
    removed: {
      label: "제거",
      description: "원본 HTML에는 있지만 현재 DOM에서 제거된 값입니다.",
    },
  },
};

function getStateHelp(language = "en") {
  return stateHelp[language === "ko" ? "ko" : "en"];
}

function getGhip(state, hint) {
  const language =
    typeof document !== "undefined" && document.documentElement.lang === "ko"
      ? "ko"
      : "en";
  const helpItem = getStateHelp(language)[state];
  const stateText =
    state === "same" || state === "changed" || state === "new" || state === "removed"
      ? helpItem.label
      : hint;

  const chip =
    state === "same"
      ? `<button type="button" class="chip" data-state-help="${state}">${stateText}<span class="chip-help" aria-hidden="true">?</span></button>`
      : state === "changed"
      ? `<button type="button" class="chip warn" data-state-help="${state}">${stateText}<span class="chip-help" aria-hidden="true">?</span></button>`
      : state === "new"
      ? `<button type="button" class="chip info" data-state-help="${state}">${stateText}<span class="chip-help" aria-hidden="true">?</span></button>`
      : state === "removed"
      ? `<button type="button" class="chip danger" data-state-help="${state}">${stateText}<span class="chip-help" aria-hidden="true">?</span></button>`
      : hint
      ? `<span class="chip info">${hint}</span>`
      : "";

  return chip;
}

export { getStateHelp };
export default getGhip;
