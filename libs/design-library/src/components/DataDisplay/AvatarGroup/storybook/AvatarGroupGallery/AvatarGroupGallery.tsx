import type { ReactNode } from "react";

import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Avatar } from "../../../Avatar";
import { avatarShapes, avatarSizes } from "../../../Avatar/Avatar";
import { AvatarGroup } from "../../AvatarGroup";

const members: Array<ReactNode> = [
  <Avatar key="lin" name="K. Lin" />,
  <Avatar key="sato" name="M. Sato" />,
  <Avatar key="okafor" name="R. Okafor" />,
  <Avatar key="dubois" name="C. Dubois" />,
  <Avatar key="reyes" name="A. Reyes" />,
];

export const AvatarGroupGallery = () => {
  const cellWidth = "min-w-[14rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="size × shape">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"shape"}
            </StorybookGalleryTableHeader>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {avatarShapes.map((shape) => (
            <tr key={shape}>
              <StorybookGalleryTableCell className={labelCell}>
                {shape}
              </StorybookGalleryTableCell>
              {avatarSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <AvatarGroup size={size} shape={shape}>
                    {members.slice(0, 3)}
                  </AvatarGroup>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="max — the tail collapses into a count">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"max"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[18rem]">
              {"five members"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          {["none", "4", "3", "2", "1"].map((max) => (
            <tr key={max}>
              <StorybookGalleryTableCell className={labelCell}>
                {max}
              </StorybookGalleryTableCell>
              <StorybookGalleryTableCell align="left" className="min-w-[18rem]">
                <AvatarGroup max={max === "none" ? undefined : Number(max)}>
                  {members}
                </AvatarGroup>
              </StorybookGalleryTableCell>
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="with presence, and with images">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"case"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[18rem]">
              {"rendered"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"presence dots"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[18rem]">
              <AvatarGroup max={3}>
                {[
                  <Avatar
                    key="lin"
                    name="K. Lin"
                    status="online"
                    statusLabel="Online"
                  />,
                  <Avatar
                    key="sato"
                    name="M. Sato"
                    status="away"
                    statusLabel="Away"
                  />,
                  <Avatar
                    key="okafor"
                    name="R. Okafor"
                    status="offline"
                    statusLabel="Offline"
                  />,
                  <Avatar key="dubois" name="C. Dubois" />,
                ]}
              </AvatarGroup>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"one member"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[18rem]">
              <AvatarGroup>{members.slice(0, 1)}</AvatarGroup>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
