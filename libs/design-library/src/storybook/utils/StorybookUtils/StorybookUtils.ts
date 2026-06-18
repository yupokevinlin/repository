const getTypesSummaryString = (types: readonly string[]): string => {
  return types.join("|");
};

export const StorybookUtils = {
  getTypesSummaryString,
};
