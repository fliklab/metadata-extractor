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
  ja: {
    same: {
      label: "同一",
      description: "現在の DOM と元の HTML の値が一致しています。",
    },
    changed: {
      label: "変更",
      description: "現在の DOM の値が元の HTML と異なります。",
    },
    new: {
      label: "追加",
      description: "元の HTML にはなく、現在の DOM に追加された値です。",
    },
    removed: {
      label: "削除",
      description: "元の HTML にはありますが、現在の DOM から削除された値です。",
    },
  },
  es: {
    same: {
      label: "Igual",
      description: "El DOM actual coincide con el HTML original.",
    },
    changed: {
      label: "Modificado",
      description: "El DOM actual es diferente del HTML original.",
    },
    new: {
      label: "Nuevo",
      description: "Está en el DOM actual, pero no en el HTML original.",
    },
    removed: {
      label: "Eliminado",
      description: "Está en el HTML original, pero no en el DOM actual.",
    },
  },
  pt_BR: {
    same: {
      label: "Igual",
      description: "O DOM atual corresponde ao HTML original.",
    },
    changed: {
      label: "Alterado",
      description: "O DOM atual é diferente do HTML original.",
    },
    new: {
      label: "Novo",
      description: "Está no DOM atual, mas não no HTML original.",
    },
    removed: {
      label: "Removido",
      description: "Está no HTML original, mas não no DOM atual.",
    },
  },
};

function getStateHelp(language = "en") {
  return stateHelp[language] || stateHelp.en;
}

function getGhip(state, hint) {
  const documentLanguage =
    typeof document !== "undefined" ? document.documentElement.lang : "en";
  const language = documentLanguage.startsWith("pt")
    ? "pt_BR"
    : stateHelp[documentLanguage]
    ? documentLanguage
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
