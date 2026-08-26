import { cva } from "class-variance-authority";

export type ModalSize = "sm" | "md" | "lg";

export const modalSizes = [
  "sm",
  "md",
  "lg",
] as const satisfies Array<ModalSize>;

/** Dims the page and catches clicks meant to dismiss. */
export const scrimStyle = cva([
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  "bg-black/40",
]);

export const panelStyle = cva(
  [
    "flex w-full max-h-full flex-col overflow-hidden rounded-lg",
    // The foreground colour is set here and not left to inherit: the panel is
    // portalled into document.body, outside whatever set a colour further up,
    // so anything that inherits its colour — Heading, Typography — comes out
    // black on a dark panel.
    "border border-border-default bg-bg-default text-fg-default shadow-xl",
    "focus:outline-none",
  ],
  {
    variants: {
      size: {
        sm: "max-w-[24rem]",
        md: "max-w-[32rem]",
        lg: "max-w-[48rem]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const headerStyle = cva([
  "flex shrink-0 items-start gap-3 border-b border-border-muted px-5 py-4",
]);

/**
 * The only part that scrolls. The header and footer stay put, so the title and
 * the confirm button are never scrolled out of reach on a long body.
 */
export const bodyStyle = cva(["min-h-0 flex-1 overflow-y-auto px-5 py-4"]);

export const footerStyle = cva([
  "flex shrink-0 items-center justify-end gap-2",
  "border-t border-border-muted px-5 py-3",
]);

export const ModalStyles = {
  scrimStyle,
  panelStyle,
  headerStyle,
  bodyStyle,
  footerStyle,
};
