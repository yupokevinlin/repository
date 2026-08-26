/**
 * What counts as tabbable, as a selector.
 *
 * `[tabindex]:not([tabindex="-1"])` is listed rather than plain `[tabindex]`
 * because a `-1` element is focusable by script but not by Tab, and a trap
 * that included it would stop at elements the user cannot reach.
 */
const focusableSelector: string = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "audio[controls]",
  "video[controls]",
  "[contenteditable]:not([contenteditable='false'])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

/**
 * Whether an element can actually be reached — `display: none` and
 * `visibility: hidden` subtrees are in the DOM but not in the tab order.
 *
 * `offsetParent` is null for `display: none`, but also for `position: fixed`,
 * so the rect is checked too. In jsdom every rect is empty, so an element with
 * neither a rect nor an `offsetParent` is only rejected when it is genuinely
 * hidden by a style.
 */
const isVisible = (element: HTMLElement): boolean => {
  if (element.hidden) {
    return false;
  }

  const style: CSSStyleDeclaration = getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
};

/**
 * Every element inside `container` that Tab can reach, in tab order.
 *
 * Document order is used rather than sorting by `tabindex`. Positive
 * `tabindex` values are an accessibility problem of their own and the library
 * never emits one, so honouring them here would only make a trap behave
 * differently from the page around it.
 */
export const getFocusableElements = (
  container: HTMLElement,
): Array<HTMLElement> =>
  Array.from(container.querySelectorAll<HTMLElement>(focusableSelector)).filter(
    isVisible,
  );
