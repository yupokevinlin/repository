import "../src/css/tailwind/tailwind.css";

import type { Preview } from "@storybook/react";
import React from "react";

const preview: Preview = {
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/ } },
  },
  decorators: [
    (Story) =>
      React.createElement(
        "div",
        { className: "theme-light bg-bg-default min-h-screen p-4" },
        React.createElement(Story),
      ),
  ],
};

export default preview;
