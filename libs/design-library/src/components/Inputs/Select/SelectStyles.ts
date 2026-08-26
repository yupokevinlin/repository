import { cva } from "class-variance-authority";

export const listboxStyle = cva([
  "z-50 max-h-[16rem] overflow-y-auto rounded-md py-1",
  "border border-border-default bg-bg-default shadow-lg",
  // Focus never enters the listbox, so it never shows a ring of its own.
  "focus:outline-none",
]);

export const optionStyle = cva(
  [
    "flex cursor-pointer items-center gap-2 px-3 py-1.5",
    "text-body-sm text-fg-default",
  ],
  {
    variants: {
      active: {
        // The highlight is a background, not a focus ring: DOM focus is on the
        // trigger, so a ring here would point at the wrong element.
        true: "bg-bg-primary-soft",
        false: "",
      },
      selected: {
        true: "font-medium",
        false: "",
      },
      disabled: {
        true: "cursor-not-allowed text-fg-disabled",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      selected: false,
      disabled: false,
    },
  },
);

export const triggerValueStyle = cva(["min-w-0 flex-1 truncate text-left"], {
  variants: {
    placeholder: {
      true: "text-fg-subtle",
      false: "text-fg-default",
    },
  },
  defaultVariants: {
    placeholder: false,
  },
});

export const SelectStyles = {
  listboxStyle,
  optionStyle,
  triggerValueStyle,
};
