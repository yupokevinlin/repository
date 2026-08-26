import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FileDropzone } from "./FileDropzone";

const slot = (container: HTMLElement, name = "file-dropzone"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

const makeFile = (name = "contract.pdf"): File =>
  new File(["contents"], name, { type: "application/pdf" });

const dropEvent = (files: Array<File>) => ({
  dataTransfer: { files, items: [], types: ["Files"] },
});

describe("FileDropzone", () => {
  it("renders a real file input, not a drop-only surface", () => {
    const { container } = render(<FileDropzone label="Documents" />);
    const input = slot(container, "file-dropzone-control");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "file");
  });

  it("takes its accessible name from its label", () => {
    render(<FileDropzone label="Documents" />);
    expect(screen.getByLabelText("Documents")).toBeInTheDocument();
  });

  it("keeps the input reachable by keyboard rather than display:none", () => {
    const { container } = render(<FileDropzone label="Documents" />);
    const className: string = slot(
      container,
      "file-dropzone-control",
    ).className;
    expect(className).toContain("opacity-0");
    expect(className).not.toContain("hidden");
  });

  it("stretches the input across the zone, so the whole area is the target", () => {
    const { container } = render(<FileDropzone label="Documents" />);
    const className: string = slot(
      container,
      "file-dropzone-control",
    ).className;
    expect(className).toContain("absolute");
    expect(className).toContain("inset-0");
  });

  it("reports files chosen through the dialog", async () => {
    const user = userEvent.setup();
    const onFilesSelected = vi.fn<(files: Array<File>) => void>();
    const { container } = render(
      <FileDropzone label="Documents" onFilesSelected={onFilesSelected} />,
    );
    await user.upload(slot(container, "file-dropzone-control"), makeFile());
    expect(onFilesSelected).toHaveBeenCalledTimes(1);
    expect(onFilesSelected.mock.calls[0]?.[0]?.[0]?.name).toBe("contract.pdf");
  });

  it("reports files that were dropped", () => {
    const onFilesSelected = vi.fn<(files: Array<File>) => void>();
    const { container } = render(
      <FileDropzone label="Documents" onFilesSelected={onFilesSelected} />,
    );
    fireEvent.drop(slot(container), dropEvent([makeFile()]));
    expect(onFilesSelected).toHaveBeenCalledTimes(1);
  });

  it("hands back an array rather than a FileList", () => {
    const onFilesSelected = vi.fn<(files: Array<File>) => void>();
    const { container } = render(
      <FileDropzone label="Documents" onFilesSelected={onFilesSelected} />,
    );
    fireEvent.drop(slot(container), dropEvent([makeFile()]));
    expect(Array.isArray(onFilesSelected.mock.calls[0]?.[0])).toBe(true);
  });

  describe("drag state", () => {
    it("marks itself while a file is over it", () => {
      const { container } = render(<FileDropzone label="Documents" />);
      fireEvent.dragEnter(slot(container), dropEvent([makeFile()]));
      expect(slot(container)).toHaveAttribute("data-dragging", "true");
    });

    it("clears once the file leaves", () => {
      const { container } = render(<FileDropzone label="Documents" />);
      fireEvent.dragEnter(slot(container), dropEvent([makeFile()]));
      fireEvent.dragLeave(slot(container));
      expect(slot(container)).not.toHaveAttribute("data-dragging");
    });

    it("does not flicker when the pointer crosses a child element", () => {
      const { container } = render(
        <FileDropzone label="Documents">{"Drop here"}</FileDropzone>,
      );
      const zone: HTMLElement = slot(container);

      // Entering a child fires dragenter on the parent again before the
      // dragleave for the element being left.
      fireEvent.dragEnter(zone, dropEvent([makeFile()]));
      fireEvent.dragEnter(zone, dropEvent([makeFile()]));
      fireEvent.dragLeave(zone);
      expect(zone).toHaveAttribute("data-dragging", "true");

      fireEvent.dragLeave(zone);
      expect(zone).not.toHaveAttribute("data-dragging");
    });

    it("clears after a drop", () => {
      const { container } = render(<FileDropzone label="Documents" />);
      fireEvent.dragEnter(slot(container), dropEvent([makeFile()]));
      fireEvent.drop(slot(container), dropEvent([makeFile()]));
      expect(slot(container)).not.toHaveAttribute("data-dragging");
    });
  });

  it("ignores a drop while disabled", () => {
    const onFilesSelected = vi.fn<(files: Array<File>) => void>();
    const { container } = render(
      <FileDropzone
        label="Documents"
        disabled
        onFilesSelected={onFilesSelected}
      />,
    );
    fireEvent.drop(slot(container), dropEvent([makeFile()]));
    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it("disables the input", () => {
    const { container } = render(<FileDropzone label="Documents" disabled />);
    expect(slot(container, "file-dropzone-control")).toBeDisabled();
  });

  it("renders its call to action", () => {
    render(
      <FileDropzone label="Documents">{"Drop files or browse"}</FileDropzone>,
    );
    expect(screen.getByText("Drop files or browse")).toBeInTheDocument();
  });

  it("keeps the content out of the way of clicks", () => {
    const { container } = render(
      <FileDropzone label="Documents">{"Drop files"}</FileDropzone>,
    );
    expect(slot(container, "file-dropzone-content").className).toContain(
      "pointer-events-none",
    );
  });

  it("describes the zone with its hint", () => {
    const { container } = render(
      <FileDropzone label="Documents" hint="PDF, up to 10 MB." />,
    );
    expect(
      slot(container, "file-dropzone-control"),
    ).toHaveAccessibleDescription("PDF, up to 10 MB.");
  });

  it("marks the zone invalid from its error", () => {
    const { container } = render(
      <FileDropzone label="Documents" error="That file is too large." />,
    );
    expect(slot(container, "file-dropzone-control")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("draws the invalid border from the same prop", () => {
    const { container } = render(
      <FileDropzone label="Documents" error="That file is too large." />,
    );
    expect(slot(container).className).toContain("border-border-error");
  });

  it("forwards arbitrary native props, including accept and multiple", () => {
    const { container } = render(
      <FileDropzone label="Documents" accept="application/pdf" multiple />,
    );
    const input = slot(container, "file-dropzone-control");
    expect(input).toHaveAttribute("accept", "application/pdf");
    expect(input).toHaveAttribute("multiple");
  });
});
