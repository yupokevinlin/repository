import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Divider, dividerEmphases } from "../../Divider";

const forms: Array<{
  label: string;
  render: (emphasis: "subtle" | "default" | "strong") => React.ReactNode;
}> = [
  {
    label: "horizontal",
    render: (emphasis) => (
      <div className="w-full py-[0.5rem]">
        <Divider emphasis={emphasis} />
      </div>
    ),
  },
  {
    label: "labelled",
    render: (emphasis) => (
      <div className="w-full py-[0.5rem]">
        <Divider emphasis={emphasis} label="Logistics" />
      </div>
    ),
  },
  {
    label: "vertical",
    render: (emphasis) => (
      <div className="text-fg-default flex h-[2.5rem] items-center gap-[0.75rem]">
        <span className="text-body-sm">{"Sell side"}</span>
        <Divider orientation="vertical" emphasis={emphasis} />
        <span className="text-body-sm">{"Buy side"}</span>
      </div>
    ),
  },
  {
    label: "decorative",
    render: (emphasis) => (
      <div className="w-full py-[0.5rem]">
        <Divider emphasis={emphasis} decorative />
      </div>
    ),
  },
];

export const DividerGallery = () => {
  const cellWidth = "min-w-[14rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="form × emphasis">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"form"}
            </StorybookGalleryTableHeader>
            {dividerEmphases.map((emphasis) => (
              <StorybookGalleryTableHeader key={emphasis} className={cellWidth}>
                {emphasis}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {forms.map(({ label, render }) => (
            <tr key={label}>
              <StorybookGalleryTableCell className={labelCell}>
                {label}
              </StorybookGalleryTableCell>
              {dividerEmphases.map((emphasis) => (
                <StorybookGalleryTableCell key={emphasis} className={cellWidth}>
                  {render(emphasis)}
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
