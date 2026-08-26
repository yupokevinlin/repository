/**
 * Renders a scale as the "a|b|c" summary Storybook shows in its props table.
 *
 * Takes numbers as well as strings: not every scale is a string union —
 * `Accordion`'s `headingLevel` is `2 | 3 | 4 | 5 | 6`.
 */
const getTypesSummaryString = (
  types: ReadonlyArray<string | number>,
): string => {
  return types.join("|");
};

export const StorybookUtils = {
  getTypesSummaryString,
};
