// The theme comes from the design library through its subpath export rather
// than a relative path into its internals — these are separate packages.
import "@org/design-library/tailwind.css";

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

/**
 * The theme class also goes on <html>, not only on the frame below.
 *
 * Composites are built from primitives that portal into document.body, which
 * sits outside the frame. Without this they inherit no token values at all and
 * come out unstyled. Production does the same thing.
 *
 * In "Side by side" only one theme can own <html>, so portalled content is
 * shown in light. Review an overlay in Light and Dark individually.
 */
const ThemeRoot = ({
  theme,
  children,
}: {
  theme: string;
  children?: React.ReactNode;
}): React.ReactNode => {
  React.useEffect(() => {
    const root = document.documentElement;
    const applied = theme === "both" ? "theme-light" : theme;
    root.classList.add(applied);
    return () => {
      root.classList.remove(applied);
    };
  }, [theme]);

  return children;
};

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

      const framed =
        theme === "both"
          ? React.createElement(
              "div",
              { className: "grid grid-cols-1 md:grid-cols-2" },
              frame("theme-light", story),
              frame("theme-dark", story),
            )
          : frame(theme, story);

      return React.createElement(ThemeRoot, { theme }, framed);
    },
  ],
};

export default preview;
