const getState = (current, original) => {
  const cur = current ?? null;
  const ori = original ?? null;
  if (cur === null && ori === null) return null;
  if (cur === null && ori !== null) return "removed";
  if (cur !== null && ori === null) return "new";
  return cur === ori ? "same" : "changed";
};

export default getState;
