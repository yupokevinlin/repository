import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";

import { TextInput, textInputSizes, textInputVariants } from "./TextInput";

/** The wrapper carries the variant and size classes; the input sits inside it. */
const wrapperOf = (container: HTMLElement): HTMLElement =>
  container.firstElementChild as HTMLElement;

describe("TextInput", () => {
  it("renders a native text input", () => {
    render(<TextInput aria-label="Named place" />);
    expect(screen.getByRole("textbox")).toBeInstanceOf(HTMLInputElement);
  });

  it("applies the default variant and size when none are given", () => {
    const { container } = render(<TextInput aria-label="Named place" />);
    const className: string = wrapperOf(container).className;
    expect(className).toContain("h-10");
  });

  it("gives every variant a distinct set of classes", () => {
    const classNames: Array<string> = textInputVariants.map((variant) => {
      const { container, unmount } = render(
        <TextInput aria-label="Named place" variant={variant} />,
      );
      const className: string = wrapperOf(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(textInputVariants.length);
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = textInputSizes.map((size) => {
      const { container, unmount } = render(
        <TextInput aria-label="Named place" size={size} />,
      );
      const className: string = wrapperOf(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(textInputSizes.length);
  });

  it("renders start and end icons", () => {
    render(
      <TextInput
        aria-label="Named place"
        startIcon={<span data-testid="start" />}
        endIcon={<span data-testid="end" />}
      />,
    );
    expect(screen.getByTestId("start")).toBeInTheDocument();
    expect(screen.getByTestId("end")).toBeInTheDocument();
  });

  it("accepts typed input and reports every keystroke", async () => {
    const onChange = vi.fn();
    render(<TextInput aria-label="Named place" onChange={onChange} />);
    await userEvent.type(screen.getByRole("textbox"), "Shanghai");
    expect(screen.getByRole("textbox")).toHaveValue("Shanghai");
    expect(onChange).toHaveBeenCalledTimes("Shanghai".length);
  });

  it("works as a controlled input", async () => {
    const onChange = vi.fn();
    render(
      <TextInput aria-label="Named place" value="CIF" onChange={onChange} />,
    );
    const input: HTMLElement = screen.getByRole("textbox");
    expect(input).toHaveValue("CIF");
    await userEvent.type(input, "X");
    expect(input).toHaveValue("CIF");
    expect(onChange).toHaveBeenCalled();
  });

  it("does not accept input when disabled", async () => {
    const onChange = vi.fn();
    render(<TextInput aria-label="Named place" disabled onChange={onChange} />);
    const input: HTMLElement = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    await userEvent.type(input, "Shanghai");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("associates a label supplied through htmlFor and id", () => {
    render(
      <>
        <label htmlFor="named-place">Named place</label>
        <TextInput id="named-place" />
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Named place" }),
    ).toBeInTheDocument();
  });

  it("merges className onto the wrapper rather than replacing it", () => {
    const { container } = render(
      <TextInput aria-label="Named place" className="w-full" />,
    );
    const className: string = wrapperOf(container).className;
    expect(className).toContain("w-full");
    expect(className).toContain("h-10");
  });

  it("forwards a ref to the underlying input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<TextInput aria-label="Named place" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("forwards arbitrary native props to the input", () => {
    render(<TextInput aria-label="Named place" placeholder="Shanghai" />);
    expect(screen.getByPlaceholderText("Shanghai")).toBeInTheDocument();
  });
});
