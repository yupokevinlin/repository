import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { SearchInput } from "./SearchInput";

const control = (): HTMLInputElement =>
  screen.getByRole<HTMLInputElement>("searchbox");

const clearButton = (): HTMLElement =>
  screen.getByRole("button", { name: "Clear search" });

describe("SearchInput", () => {
  it("renders a search input", () => {
    render(<SearchInput label="Search deals" />);
    expect(control()).toHaveAttribute("type", "search");
  });

  it("takes its accessible name from its label", () => {
    render(<SearchInput label="Search deals" />);
    expect(
      screen.getByRole("searchbox", { name: "Search deals" }),
    ).toBeInTheDocument();
  });

  it("fires on every keystroke, with no debounce of its own", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<SearchInput label="Search deals" onValueChange={onValueChange} />);
    await user.type(control(), "abc");
    expect(onValueChange).toHaveBeenCalledTimes(3);
    expect(onValueChange).toHaveBeenLastCalledWith("abc");
  });

  it("renders a search icon", () => {
    const { container } = render(<SearchInput label="Search deals" />);
    expect(
      container.querySelector("[data-slot='search-input-icon']"),
    ).toBeInTheDocument();
  });

  describe("clearing", () => {
    it("shows no clear button while empty", () => {
      render(<SearchInput label="Search deals" />);
      expect(
        screen.queryByRole("button", { name: "Clear search" }),
      ).not.toBeInTheDocument();
    });

    it("shows one once there is something to clear", () => {
      render(<SearchInput label="Search deals" defaultValue="rubber" />);
      expect(clearButton()).toBeInTheDocument();
    });

    it("empties the field", async () => {
      const user = userEvent.setup();
      render(<SearchInput label="Search deals" defaultValue="rubber" />);
      await user.click(clearButton());
      expect(control().value).toBe("");
    });

    it("reports the empty value", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <SearchInput
          label="Search deals"
          defaultValue="rubber"
          onValueChange={onValueChange}
        />,
      );
      await user.click(clearButton());
      expect(onValueChange).toHaveBeenCalledWith("");
    });

    it("leaves focus in the field, ready for the next search", async () => {
      const user = userEvent.setup();
      render(<SearchInput label="Search deals" defaultValue="rubber" />);
      await user.click(clearButton());
      expect(control()).toHaveFocus();
    });

    it("takes a caller-supplied label, for other languages", () => {
      render(
        <SearchInput
          label="Rechercher"
          defaultValue="caoutchouc"
          clearLabel="Effacer la recherche"
        />,
      );
      expect(
        screen.getByRole("button", { name: "Effacer la recherche" }),
      ).toBeInTheDocument();
    });

    it("hides the clear button while disabled", () => {
      render(
        <SearchInput label="Search deals" defaultValue="rubber" disabled />,
      );
      expect(
        screen.queryByRole("button", { name: "Clear search" }),
      ).not.toBeInTheDocument();
    });

    it("suppresses the browser's own clear affordance", () => {
      render(<SearchInput label="Search deals" />);
      expect(control().className).toContain(
        "[&::-webkit-search-cancel-button]:appearance-none",
      );
    });
  });

  describe("controlled and uncontrolled", () => {
    it("manages its own value when uncontrolled", async () => {
      const user = userEvent.setup();
      render(<SearchInput label="Search deals" />);
      await user.type(control(), "rubber");
      expect(control().value).toBe("rubber");
    });

    it("follows its owner when controlled", async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [query, setQuery] = useState<string>("");
        return (
          <SearchInput
            label="Search deals"
            value={query}
            onValueChange={setQuery}
          />
        );
      };
      render(<Controlled />);
      await user.type(control(), "rubber");
      expect(control().value).toBe("rubber");
    });

    it("stays put when controlled and the owner ignores the change", async () => {
      const user = userEvent.setup();
      render(<SearchInput label="Search deals" value="rubber" />);
      await user.type(control(), "x");
      expect(control().value).toBe("rubber");
    });
  });

  it("describes the field with its hint", () => {
    render(<SearchInput label="Search deals" hint="Matches deal numbers." />);
    expect(control()).toHaveAccessibleDescription("Matches deal numbers.");
  });

  it("marks the field invalid from its error", () => {
    render(<SearchInput label="Search deals" error="Query too short." />);
    expect(control()).toHaveAttribute("aria-invalid", "true");
  });

  it("disables the control", () => {
    render(<SearchInput label="Search deals" disabled />);
    expect(control()).toBeDisabled();
  });

  it("works with an aria-label and no visible one", () => {
    const { container } = render(<SearchInput aria-label="Search deals" />);
    expect(
      screen.getByRole("searchbox", { name: "Search deals" }),
    ).toBeInTheDocument();
    expect(container.querySelector("label")).toBeNull();
  });
});
