import "../src/css/tailwind/tailwind.css";

import type { Preview } from "@storybook/react";
import React from "react";

const style = document.createElement("style");
style.textContent = ".sbdocs-content { max-width: none !important; }";
document.head.appendChild(style);

const frame = (theme: string, children: React.ReactNode): React.ReactElement =>
  React.createElement(
    "div",
    { className: `${theme} bg-bg-default text-fg-default p-4` },
    children,
  );

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },

  /**
   * Every gallery must be provable in both themes — a component proven in one
   * is not proven. "Side by side" renders both at once, which is how gallery
   * stories should be reviewed.
   */
  globalTypes: {
    theme: {
      description: "Design library theme",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "theme-light", title: "Light", icon: "sun" },
          { value: "theme-dark", title: "Dark", icon: "moon" },
          { value: "both", title: "Side by side", icon: "mirror" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: "theme-light",
  },

  decorators: [
    (Story, context) => {
      const theme = String(context.globals.theme ?? "theme-light");
      const story = React.createElement(Story);

      if (theme === "both") {
        return React.createElement(
          "div",
          { className: "grid grid-cols-1 md:grid-cols-2" },
          frame("theme-light", story),
          frame("theme-dark", story),
        );
      }

      return frame(theme, story);
    },
  ],
};

export default preview;
