import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Tag, tagAppearances, tagSizes } from "../../Tag";

const noop = (): void => undefined;

const tagStates: Array<{
  label: string;
  removable?: boolean;
  disabled?: boolean;
}> = [
  { label: "plain" },
  { label: "removable", removable: true },
  { label: "disabled", disabled: true },
  { label: "disabled + removable", removable: true, disabled: true },
];

export const TagGallery = () => {
  const cellWidth = "min-w-[11rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[11rem]";

  return (
    <StorybookGalleryWrapper>
      {tagSizes.map((size) => (
        <StorybookGalleryTable key={size} title={`size: ${size}`}>
          <thead>
            <tr>
              <StorybookGalleryTableHeader className={cellWidth}>
                {"state"}
              </StorybookGalleryTableHeader>
              {tagAppearances.map((appearance) => (
                <StorybookGalleryTableHeader
                  key={appearance}
                  className={cellWidth}
                >
                  {appearance}
                </StorybookGalleryTableHeader>
              ))}
            </tr>
          </thead>
          <tbody>
            {tagStates.map(({ label, removable, disabled }) => (
              <tr key={label}>
                <StorybookGalleryTableCell className={labelCell}>
                  {label}
                </StorybookGalleryTableCell>
                {tagAppearances.map((appearance) => (
                  <StorybookGalleryTableCell
                    key={appearance}
                    className={cellWidth}
                  >
                    {removable ? (
                      <Tag
                        appearance={appearance}
                        size={size}
                        disabled={disabled}
                        onRemove={noop}
                        removeLabel="Remove Chemicals filter"
                      >
                        {"Chemicals"}
                      </Tag>
                    ) : (
                      <Tag
                        appearance={appearance}
                        size={size}
                        disabled={disabled}
                      >
                        {"Chemicals"}
                      </Tag>
                    )}
                  </StorybookGalleryTableCell>
                ))}
              </tr>
            ))}
          </tbody>
        </StorybookGalleryTable>
      ))}
    </StorybookGalleryWrapper>
  );
};
