const getTypesSummaryString = (types: ReadonlyArray<string>): string => {
  return types.join("|");
};

export const StorybookUtils = {
  getTypesSummaryString,
};
