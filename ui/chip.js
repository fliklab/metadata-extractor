function getGhip(state, hint) {
  const stateText =
    state === "same"
      ? "Same"
      : state === "changed"
      ? "Changed"
      : state === "new"
      ? "New"
      : state === "removed"
      ? "Removed"
      : hint;

  const chip =
    state === "same"
      ? `<span class="chip">${stateText}</span>`
      : state === "changed"
      ? `<span class="chip warn">${stateText}</span>`
      : state === "new"
      ? `<span class="chip info">${stateText}</span>`
      : state === "removed"
      ? `<span class="chip danger">${stateText}</span>`
      : hint
      ? `<span class="chip info">${hint}</span>`
      : "";

  return chip;
}

export default getGhip;
