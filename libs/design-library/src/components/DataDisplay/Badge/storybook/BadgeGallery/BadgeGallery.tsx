import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  Badge,
  badgeAppearances,
  badgeSeverities,
  badgeSizes,
} from "../../Badge";

/**
 * Every row is a real severity × appearance pair, and the two content shapes
 * a badge actually takes — a count and a dotted state label — are shown side
 * by side, because they size differently.
 */
export const BadgeGallery = () => {
  const cellWidth = "min-w-[9rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[9rem]";

  return (
    <StorybookGalleryWrapper>
      {badgeSizes.map((size) => (
        <StorybookGalleryTable key={size} title={`size: ${size}`}>
          <thead>
            <tr>
              <StorybookGalleryTableHeader className={cellWidth}>
                {"severity"}
              </StorybookGalleryTableHeader>
              {badgeAppearances.map((appearance) => (
                <StorybookGalleryTableHeader
                  key={appearance}
                  className={cellWidth}
                >
                  {appearance}
                </StorybookGalleryTableHeader>
              ))}
              <StorybookGalleryTableHeader className={cellWidth}>
                {"dot"}
              </StorybookGalleryTableHeader>
              <StorybookGalleryTableHeader className={cellWidth}>
                {"count"}
              </StorybookGalleryTableHeader>
              <StorybookGalleryTableHeader className={cellWidth}>
                {"max={99}"}
              </StorybookGalleryTableHeader>
            </tr>
          </thead>
          <tbody>
            {badgeSeverities.map((severity) => (
              <tr key={severity}>
                <StorybookGalleryTableCell className={labelCell}>
                  {severity}
                </StorybookGalleryTableCell>
                {badgeAppearances.map((appearance) => (
                  <StorybookGalleryTableCell
                    key={appearance}
                    className={cellWidth}
                  >
                    <Badge
                      severity={severity}
                      appearance={appearance}
                      size={size}
                    >
                      {"At port"}
                    </Badge>
                  </StorybookGalleryTableCell>
                ))}
                <StorybookGalleryTableCell className={cellWidth}>
                  <Badge severity={severity} size={size} dot>
                    {"At port"}
                  </Badge>
                </StorybookGalleryTableCell>
                <StorybookGalleryTableCell className={cellWidth}>
                  <Badge severity={severity} size={size}>
                    {3}
                  </Badge>
                </StorybookGalleryTableCell>
                <StorybookGalleryTableCell className={cellWidth}>
                  <Badge severity={severity} size={size} max={99}>
                    {147}
                  </Badge>
                </StorybookGalleryTableCell>
              </tr>
            ))}
          </tbody>
        </StorybookGalleryTable>
      ))}
    </StorybookGalleryWrapper>
  );
};
