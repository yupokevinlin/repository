import { StorybookGalleryTable } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTable";
import { StorybookGalleryTableCell } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableCell/StorybookGalleryTableCell";
import { StorybookGalleryTableHeader } from "../../../../../storybook/components/StorybookGalleryTable/StorybookGalleryTableHeader/StorybookGalleryTableHeader";
import { StorybookGalleryWrapper } from "../../../../../storybook/components/StorybookGalleryWrapper/StorybookGalleryWrapper";
import { Button } from "../../../../Buttons/Button";
import { Toast } from "../../Toast";
import { toastSeverities } from "../../toastStyles";

const labelCell =
  "bg-bg-hover text-fg-default text-[1rem] font-bold text-center whitespace-nowrap min-w-[10rem]";
const cellWidth = "min-w-[24rem]";

const titles: Record<string, string> = {
  neutral: "Draft saved",
  info: "Export queued",
  success: "Deal NPM-1042 saved",
  warning: "Credit limit nearly reached",
  error: "Could not save the deal",
};

export const ToastGallery = () => (
  <StorybookGalleryWrapper>
    <StorybookGalleryTable title="severity">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"severity"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"toast"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        {toastSeverities.map((severity) => (
          <tr key={severity}>
            <StorybookGalleryTableCell className={labelCell}>
              {severity}
            </StorybookGalleryTableCell>
            <StorybookGalleryTableCell className={cellWidth}>
              <div className="w-[22rem]">
                <Toast
                  title={titles[severity]}
                  severity={severity}
                  duration={null}
                />
              </div>
            </StorybookGalleryTableCell>
          </tr>
        ))}
      </tbody>
    </StorybookGalleryTable>

    <StorybookGalleryTable title="anatomy">
      <thead>
        <tr>
          <StorybookGalleryTableHeader className="min-w-[10rem]">
            {"parts"}
          </StorybookGalleryTableHeader>
          <StorybookGalleryTableHeader className={cellWidth}>
            {"toast"}
          </StorybookGalleryTableHeader>
        </tr>
      </thead>
      <tbody>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"title"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Toast title="Draft saved" duration={null} />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"+ description"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Toast
                title="Export queued"
                description="You will be emailed when it is ready."
                severity="info"
                duration={null}
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"+ dismiss"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Toast
                title="Deal NPM-1042 saved"
                severity="success"
                duration={null}
                onDismiss={() => undefined}
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
        <tr>
          <StorybookGalleryTableCell className={labelCell}>
            {"+ action"}
          </StorybookGalleryTableCell>
          <StorybookGalleryTableCell className={cellWidth}>
            <div className="w-[22rem]">
              <Toast
                title="Could not save the deal"
                description="The connection dropped."
                severity="error"
                duration={null}
                onDismiss={() => undefined}
                action={
                  <Button size="8" variant="destructive-outline">
                    {"Retry"}
                  </Button>
                }
              />
            </div>
          </StorybookGalleryTableCell>
        </tr>
      </tbody>
    </StorybookGalleryTable>
  </StorybookGalleryWrapper>
);
