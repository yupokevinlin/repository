import { cva } from "class-variance-authority";

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export const drawerSides = [
  "left",
  "right",
  "top",
  "bottom",
] as const satisfies Array<DrawerSide>;

export const drawerSizes = [
  "sm",
  "md",
  "lg",
] as const satisfies Array<DrawerSize>;

/** Only the modal variant has one. */
export const scrimStyle = cva(["fixed inset-0 z-50 bg-black/40"]);

export const panelStyle = cva(
  [
    "fixed z-50 flex flex-col overflow-hidden",
    // Portalled into document.body, which inherits no colour, so the panel
    // sets its own — otherwise everything inside comes out black on a dark
    // sheet. Same reason as the Modal panel.
    "border-border-default bg-bg-default text-fg-default shadow-xl",
    "focus:outline-none",
  ],
  {
    variants: {
      side: {
        left: "inset-y-0 left-0 h-full border-r",
        right: "inset-y-0 right-0 h-full border-l",
        top: "inset-x-0 top-0 w-full border-b",
        bottom: "inset-x-0 bottom-0 w-full border-t",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    compoundVariants: [
      // Width for the vertical edges, height for the horizontal ones. A single
      // size scale cannot do both, and `max-w-full` keeps a wide sheet off the
      // opposite edge on a narrow screen.
      { side: "left", size: "sm", className: "w-[20rem] max-w-full" },
      { side: "left", size: "md", className: "w-[28rem] max-w-full" },
      { side: "left", size: "lg", className: "w-[40rem] max-w-full" },
      { side: "right", size: "sm", className: "w-[20rem] max-w-full" },
      { side: "right", size: "md", className: "w-[28rem] max-w-full" },
      { side: "right", size: "lg", className: "w-[40rem] max-w-full" },
      { side: "top", size: "sm", className: "h-[16rem] max-h-full" },
      { side: "top", size: "md", className: "h-[24rem] max-h-full" },
      { side: "top", size: "lg", className: "h-[36rem] max-h-full" },
      { side: "bottom", size: "sm", className: "h-[16rem] max-h-full" },
      { side: "bottom", size: "md", className: "h-[24rem] max-h-full" },
      { side: "bottom", size: "lg", className: "h-[36rem] max-h-full" },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  },
);

export const headerStyle = cva([
  "flex shrink-0 items-start gap-3 border-b border-border-muted px-5 py-4",
]);

/** The only part that scrolls, so the title and the actions stay put. */
export const bodyStyle = cva(["min-h-0 flex-1 overflow-y-auto px-5 py-4"]);

export const footerStyle = cva([
  "flex shrink-0 items-center justify-end gap-2",
  "border-t border-border-muted px-5 py-3",
]);

export const DrawerStyles = {
  scrimStyle,
  panelStyle,
  headerStyle,
  bodyStyle,
  footerStyle,
};
