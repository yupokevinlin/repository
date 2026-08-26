import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Kbd, type KbdSize, kbdSizes } from "../../Kbd";

const cases: Array<{
  label: string;
  render: (size: KbdSize) => ReactNode;
}> = [
  {
    label: "single key",
    render: (size) => <Kbd size={size} keys={["Esc"]} />,
  },
  {
    label: "chord, spaced",
    render: (size) => <Kbd size={size} keys={["Ctrl", "K"]} />,
  },
  {
    label: 'chord, separator "+"',
    render: (size) => <Kbd size={size} keys={["Ctrl", "K"]} separator="+" />,
  },
  {
    label: "three keys",
    render: (size) => (
      <Kbd size={size} keys={["Ctrl", "Shift", "K"]} separator="+" />
    ),
  },
  {
    label: "glyph keys",
    render: (size) => <Kbd size={size} keys={["⌘", "K"]} />,
  },
  {
    label: "arrows and enter",
    render: (size) => <Kbd size={size} keys={["↑", "↓", "↵"]} />,
  },
  {
    label: "in a sentence",
    render: (size) => (
      <span className="text-fg-default text-body-sm">
        {"Press "}
        <Kbd size={size} keys={["Ctrl", "K"]} separator="+" />
        {" to search."}
      </span>
    ),
  },
];

export const KbdGallery = () => {
  const cellWidth = "min-w-[16rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[12rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="form × size">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[12rem]">
              {"form"}
            </StorybookGalleryTableHeader>
            {kbdSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {cases.map(({ label, render }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {kbdSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  {render(size)}
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
