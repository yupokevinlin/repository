import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Typography } from "../../../../Typography/Typography";
import { buttonSizes, buttonVariants } from "../../../Button/Button";
import { Link } from "../../Link";

export const LinkGallery = () => {
  const cellWidth = "min-w-[14rem]";
  const labelCell =
    "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";

  return (
    <StorybookGalleryWrapper>
      <StorybookGalleryTable title="text appearances">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"appearance"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className={cellWidth}>
              {"on its own"}
            </StorybookGalleryTableHeader>
            <StorybookGalleryTableHeader className="min-w-[22rem]">
              {"in a sentence"}
            </StorybookGalleryTableHeader>
          </tr>
        </thead>
        <tbody>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"inline"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Link href="/app/deals">{"All deals"}</Link>
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Typography as="p" size="body-sm">
                {"See the "}
                <Link href="/app/deals/1042">{"deal record"}</Link>
                {" for shipping terms."}
              </Typography>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"standalone"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Link href="/app/deals" appearance="standalone">
                {"All deals"}
              </Link>
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Typography as="p" size="body-sm">
                {
                  "Not for sentences — the underline is what marks a link apart."
                }
              </Typography>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"external"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Link href="https://www.bankofcanada.ca/rates/" external>
                {"Bank of Canada rates"}
              </Link>
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Typography as="p" size="body-sm">
                {"Opens in a new tab, and says so to a screen reader."}
              </Typography>
            </StorybookGalleryTableCell>
          </tr>
          <tr>
            <StorybookGalleryTableCell className={labelCell}>
              {"disabled"}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className={cellWidth}>
              <Link href="/app/deals" disabled>
                {"All deals"}
              </Link>
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell align="left" className="min-w-[22rem]">
              <Typography as="p" size="body-sm">
                {"No href, so it leaves the tab order entirely."}
              </Typography>
            </StorybookGalleryTableCell>
          </tr>
        </tbody>
      </StorybookGalleryTable>

      <StorybookGalleryTable title="appearance='button' — Button's own styles, still an anchor">
        <thead>
          <tr>
            <StorybookGalleryTableHeader className="min-w-[10rem]">
              {"variant"}
            </StorybookGalleryTableHeader>
            {buttonSizes.map((size) => (
              <StorybookGalleryTableHeader key={size} className={cellWidth}>
                {`size: ${size}`}
              </StorybookGalleryTableHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {buttonVariants.map((variant) => (
            <tr key={variant}>
              <StorybookGalleryTableCell className={labelCell}>
                {variant}
              </StorybookGalleryTableCell>
              {buttonSizes.map((size) => (
                <StorybookGalleryTableCell key={size} className={cellWidth}>
                  <Link
                    href="/app/deals/new"
                    appearance="button"
                    variant={variant}
                    size={size}
                  >
                    {"New deal"}
                  </Link>
                </StorybookGalleryTableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </StorybookGalleryTable>
    </StorybookGalleryWrapper>
  );
};
