import { cva } from "class-variance-authority";

export const tooltipStyle = cva([
  "z-50 max-w-[20rem] rounded-md px-2 py-1",
  "bg-bg-inverse text-fg-inverse text-body-xs",
  "shadow-md",
  // Nothing inside is interactive, so the tooltip must never eat a click
  // aimed at whatever is underneath it.
  "pointer-events-none",
]);

export const TooltipStyles = {
  tooltipStyle,
};
