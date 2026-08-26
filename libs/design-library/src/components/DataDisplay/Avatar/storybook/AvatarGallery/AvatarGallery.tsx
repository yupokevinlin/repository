import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import {
  Avatar,
  avatarShapes,
  avatarSizes,
  avatarStatuses,
} from "../../Avatar";

/** A 1×1 transparent pixel, so the image path renders without a network call. */
const pixel =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export const AvatarGallery = () => {
  const cellWidth = "min-w-[8rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="shape × size">
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
                  <Avatar name="Kanto Polymer KK" shape={shape} size={size} />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="source — image, initials, and the names behind them">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"source"}
            </StorybookGalleryTableHeader>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"image"}
            </StorybookGalleryTableCell>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableCell key={size} className={cellWidth}>
                <Avatar name="K. Lin" src={pixel} size={size} />
              </StorybookGalleryTableCell>
            ))}
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"initials — two words"}
            </StorybookGalleryTableCell>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableCell key={size} className={cellWidth}>
                <Avatar name="K. Lin" size={size} />
              </StorybookGalleryTableCell>
            ))}
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"initials — one word"}
            </StorybookGalleryTableCell>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableCell key={size} className={cellWidth}>
                <Avatar name="Maersk" size={size} />
              </StorybookGalleryTableCell>
            ))}
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="presence — its own token family, never severity">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"status"}
            </StorybookGalleryTableHeader>
            {avatarSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {avatarStatuses.map((status) => (
            <tr key={status}>
              <StorybookGalleryTableCell className={labelCell}>
                {status}
              </StorybookGalleryTableCell>
              {avatarSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <Avatar
                    name="K. Lin"
                    size={size}
                    status={status}
                    statusLabel={status}
                  />
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
