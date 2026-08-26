import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { ToggleGroup, type ToggleGroupOption } from "./ToggleGroup";

const options: Array<ToggleGroupOption> = [
  { value: "table", label: "Table" },
  { value: "board", label: "Board" },
  { value: "calendar", label: "Calendar" },
];

describe("ToggleGroup", () => {
  describe("type='single'", () => {
    it("is a radiogroup — one choice within a set", () => {
      render(<ToggleGroup type="single" aria-label="View" options={options} />);
      expect(
        screen.getByRole("radiogroup", { name: "View" }),
      ).toBeInTheDocument();
    });

    it("reports each option as checked, not pressed", () => {
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          defaultValue="board"
        />,
      );
      const option = screen.getByRole("radio", { name: "Board" });
      expect(option).toHaveAttribute("aria-checked", "true");
      expect(option).not.toHaveAttribute("aria-pressed");
    });

    it("selects on click and reports the value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByRole("radio", { name: "Board" }));
      expect(onValueChange).toHaveBeenCalledWith("board");
    });

    it("keeps only one selected", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          defaultValue="table"
        />,
      );
      await user.click(screen.getByRole("radio", { name: "Board" }));
      expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });

    it("moves and selects with the arrows, as radios do", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          defaultValue="table"
        />,
      );
      screen.getByRole("radio", { name: "Table" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("radio", { name: "Board" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("wraps from the last option to the first", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          defaultValue="calendar"
        />,
      );
      screen.getByRole("radio", { name: "Calendar" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    it("follows its owner when controlled", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [view, setView] = useState<string>("table");
        return (
          <ToggleGroup
            type="single"
            aria-label="View"
            options={options}
            value={view}
            onValueChange={setView}
          />
        );
      };
      render(<Controlled />);
      await user.click(screen.getByRole("radio", { name: "Calendar" }));
      expect(screen.getByRole("radio", { name: "Calendar" })).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });
  });

  describe("type='multiple'", () => {
    it("is a toolbar — independent buttons", () => {
      render(
        <ToggleGroup type="multiple" aria-label="Filters" options={options} />,
      );
      expect(
        screen.getByRole("toolbar", { name: "Filters" }),
      ).toBeInTheDocument();
    });

    it("reports each option as pressed, not checked", () => {
      render(
        <ToggleGroup
          type="multiple"
          aria-label="Filters"
          options={options}
          defaultValue={["board"]}
        />,
      );
      const option = screen.getByRole("button", { name: "Board" });
      expect(option).toHaveAttribute("aria-pressed", "true");
      expect(option).not.toHaveAttribute("aria-checked");
    });

    it("allows several at once", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="multiple" aria-label="Filters" options={options} />,
      );
      await user.click(screen.getByRole("button", { name: "Table" }));
      await user.click(screen.getByRole("button", { name: "Board" }));
      expect(screen.getByRole("button", { name: "Table" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
      expect(screen.getByRole("button", { name: "Board" })).toHaveAttribute(
        "aria-pressed",
        "true",
      );
    });

    it("reports the whole array", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup
          type="multiple"
          aria-label="Filters"
          options={options}
          defaultValue={["table"]}
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Board" }));
      expect(onValueChange).toHaveBeenCalledWith(["table", "board"]);
    });

    it("releases an option that was already pressed", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <ToggleGroup
          type="multiple"
          aria-label="Filters"
          options={options}
          defaultValue={["table"]}
          onValueChange={onValueChange}
        />,
      );
      await user.click(screen.getByRole("button", { name: "Table" }));
      expect(onValueChange).toHaveBeenCalledWith([]);
    });

    it("moves focus with the arrows without selecting", async () => {
      const user = userEvent.setup();
      render(
        <ToggleGroup type="multiple" aria-label="Filters" options={options} />,
      );
      screen.getByRole("button", { name: "Table" }).focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.getByRole("button", { name: "Board" })).toHaveFocus();
      expect(screen.getByRole("button", { name: "Board" })).toHaveAttribute(
        "aria-pressed",
        "false",
      );
    });
  });

  describe("roving tabindex", () => {
    it("makes the whole group one Tab stop", async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleGroup
            type="single"
            aria-label="View"
            options={options}
            defaultValue="board"
          />
          <button>{"After"}</button>
        </>,
      );
      await user.tab();
      expect(screen.getByRole("radio", { name: "Board" })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole("button", { name: "After" })).toHaveFocus();
    });

    it("makes the selected option the tabbable one", () => {
      render(
        <ToggleGroup
          type="single"
          aria-label="View"
          options={options}
          defaultValue="calendar"
        />,
      );
      expect(screen.getByRole("radio", { name: "Calendar" })).toHaveAttribute(
        "tabindex",
        "0",
      );
      expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute(
        "tabindex",
        "-1",
      );
    });
  });

  it("says which way it runs", () => {
    render(
      <ToggleGroup
        type="single"
        aria-label="Density"
        options={options}
        orientation="vertical"
      />,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "vertical",
    );
  });

  it("stacks when vertical", () => {
    const { container } = render(
      <ToggleGroup
        type="single"
        aria-label="Density"
        options={options}
        orientation="vertical"
      />,
    );
    expect(
      container.querySelector("[data-slot='toggle-group']")?.className,
    ).toContain("flex-col");
  });

  it("disables every option", () => {
    render(
      <ToggleGroup
        type="single"
        aria-label="View"
        options={options}
        disabled
      />,
    );
    expect(screen.getByRole("radio", { name: "Table" })).toBeDisabled();
  });

  it("disables one option on its own", () => {
    render(
      <ToggleGroup
        type="single"
        aria-label="View"
        options={[
          ...options,
          { value: "gantt", label: "Gantt", disabled: true },
        ]}
      />,
    );
    expect(screen.getByRole("radio", { name: "Gantt" })).toBeDisabled();
    expect(screen.getByRole("radio", { name: "Table" })).toBeEnabled();
  });
});
