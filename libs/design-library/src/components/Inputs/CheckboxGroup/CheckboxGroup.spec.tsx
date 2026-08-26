import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { CheckboxGroup, type CheckboxGroupOption } from "./CheckboxGroup";

const options: Array<CheckboxGroupOption> = [
  { value: "contract", label: "Contract" },
  { value: "invoice", label: "Invoice" },
  { value: "bol", label: "Bill of lading" },
];

const box = (name: string): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("checkbox", { name });

describe("CheckboxGroup", () => {
  it("groups the options under a legend", () => {
    render(<CheckboxGroup legend="Attach" options={options} />);
    expect(screen.getByRole("group", { name: "Attach" })).toBeInTheDocument();
  });

  it("renders a real fieldset, since a label cannot point at many inputs", () => {
    const { container } = render(
      <CheckboxGroup legend="Attach" options={options} />,
    );
    expect(container.querySelector("fieldset")).toBeInTheDocument();
    expect(container.querySelector("legend")?.textContent).toContain("Attach");
  });

  it("renders one checkbox per option", () => {
    render(<CheckboxGroup legend="Attach" options={options} />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("starts with nothing ticked", () => {
    render(<CheckboxGroup legend="Attach" options={options} />);
    expect(box("Contract")).not.toBeChecked();
  });

  it("starts from defaultValue", () => {
    render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        defaultValue={["invoice"]}
      />,
    );
    expect(box("Invoice")).toBeChecked();
    expect(box("Contract")).not.toBeChecked();
  });

  it("reports the whole array, not the one that changed", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        defaultValue={["contract"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(box("Invoice"));
    expect(onValueChange).toHaveBeenCalledWith(["contract", "invoice"]);
  });

  it("removes a value when unticked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        defaultValue={["contract", "invoice"]}
        onValueChange={onValueChange}
      />,
    );
    await user.click(box("Contract"));
    expect(onValueChange).toHaveBeenCalledWith(["invoice"]);
  });

  it("allows several at once, unlike a radio group", async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup legend="Attach" options={options} />);
    await user.click(box("Contract"));
    await user.click(box("Invoice"));
    expect(box("Contract")).toBeChecked();
    expect(box("Invoice")).toBeChecked();
  });

  it("follows its owner when controlled", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = useState<Array<string>>([]);
      return (
        <CheckboxGroup
          legend="Attach"
          options={options}
          value={value}
          onValueChange={setValue}
        />
      );
    };
    render(<Controlled />);
    await user.click(box("Contract"));
    expect(box("Contract")).toBeChecked();
  });

  it("stays put when controlled and the owner ignores the change", async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup legend="Attach" options={options} value={[]} />);
    await user.click(box("Contract"));
    expect(box("Contract")).not.toBeChecked();
  });

  it("leaves every option independently reachable by Tab", async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup legend="Attach" options={options} />);
    await user.tab();
    expect(box("Contract")).toHaveFocus();
    await user.tab();
    expect(box("Invoice")).toHaveFocus();
  });

  it("gives every option the shared name", () => {
    render(
      <CheckboxGroup legend="Attach" options={options} name="documents" />,
    );
    expect(box("Contract")).toHaveAttribute("name", "documents");
  });

  it("disables every option", () => {
    render(<CheckboxGroup legend="Attach" options={options} disabled />);
    expect(box("Contract")).toBeDisabled();
    expect(box("Invoice")).toBeDisabled();
  });

  it("disables one option on its own", () => {
    render(
      <CheckboxGroup
        legend="Attach"
        options={[...options, { value: "x", label: "Locked", disabled: true }]}
      />,
    );
    expect(box("Locked")).toBeDisabled();
    expect(box("Contract")).toBeEnabled();
  });

  it("shows a hint for the group", () => {
    render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        hint="Attached on booking."
      />,
    );
    expect(screen.getByText("Attached on booking.")).toBeInTheDocument();
  });

  it("shows a per-option hint", () => {
    render(
      <CheckboxGroup
        legend="Attach"
        options={[
          { value: "contract", label: "Contract", hint: "Signed copy only." },
        ]}
      />,
    );
    expect(screen.getByText("Signed copy only.")).toBeInTheDocument();
  });

  it("marks the group invalid rather than any one option's border", () => {
    render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        error="Choose at least one."
      />,
    );
    expect(box("Contract")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Choose at least one.")).toBeInTheDocument();
  });

  it("marks the legend required", () => {
    render(<CheckboxGroup legend="Attach" options={options} required />);
    expect(
      screen.getByRole("group", { name: "Attach (required)" }),
    ).toBeInTheDocument();
  });

  it("lays out in a row when asked", () => {
    const { container } = render(
      <CheckboxGroup
        legend="Attach"
        options={options}
        orientation="horizontal"
      />,
    );
    expect(
      container.querySelector("[data-slot='fieldset-content']")?.className,
    ).toContain("flex-row");
  });
});
