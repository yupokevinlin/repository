import { cva } from "class-variance-authority";

/**
 * Sits the panel near the top rather than centred. A palette grows downwards
 * as results arrive, and a centred one would jump around the screen while the
 * user types.
 */
export const scrimStyle = cva([
  "fixed inset-0 z-50 flex items-start justify-center p-4 pt-[10vh]",
  "bg-black/40",
]);

export const panelStyle = cva([
  "flex w-full max-w-[36rem] max-h-[70vh] flex-col overflow-hidden rounded-lg",
  // Portalled into document.body, which inherits no colour of its own.
  "border border-border-default bg-bg-default text-fg-default shadow-xl",
  "focus:outline-none",
]);

export const inputRowStyle = cva([
  "flex shrink-0 items-center gap-2 border-b border-border-muted px-4",
]);

export const inputStyle = cva([
  "h-12 min-w-0 flex-1 bg-transparent text-body-md text-fg-default",
  "placeholder:text-fg-subtle focus:outline-none",
]);

export const listStyle = cva(["min-h-0 flex-1 overflow-y-auto py-2"]);

export const groupLabelStyle = cva([
  "px-4 pb-1 pt-2 text-micro-lg font-medium text-fg-muted",
]);

export const optionStyle = cva(
  ["flex cursor-pointer items-center gap-3 px-4 py-2 text-body-sm"],
  {
    variants: {
      active: {
        // A background, not a focus ring: DOM focus stays in the input, so a
        // ring here would point at the wrong element.
        true: "bg-bg-primary-soft",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed text-fg-disabled",
        false: "text-fg-default",
      },
    },
    defaultVariants: {
      active: false,
      disabled: false,
    },
  },
);

export const emptyStyle = cva([
  "px-4 py-8 text-center text-body-sm text-fg-muted",
]);

export const footerStyle = cva([
  "flex shrink-0 items-center gap-3 border-t border-border-muted px-4 py-2",
  "text-micro-lg text-fg-muted",
]);

export const CommandPaletteStyles = {
  scrimStyle,
  panelStyle,
  inputRowStyle,
  inputStyle,
  listStyle,
  groupLabelStyle,
  optionStyle,
  emptyStyle,
  footerStyle,
};
