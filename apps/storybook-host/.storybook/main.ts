import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  // "One Storybook for all" — discover stories from every library in the workspace
  stories: [
    "../../**/*.@(mdx|stories.@(js|jsx|ts|tsx))",
    "!../../**/node_modules/**",
    "!../../**/dist/**",
  ],
  addons: [getAbsolutePath("@storybook/addon-a11y")],
  framework: {
    name: getAbsolutePath("@storybook/react-vite"),
    options: {},
  },
  viteFinal: async (config) => {
    const { mergeConfig } = await import("vite");
    const tailwindcss = (await import("@tailwindcss/vite")).default;

    return mergeConfig(config, {
      plugins: [tailwindcss()],
      resolve: {
        alias: {
          ...(config.resolve?.alias ?? {}),
        },
      },
    });
  },
};

function getAbsolutePath(value: string): string {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}

export default config;
