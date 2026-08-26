import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

import { Portal } from "./Portal";

describe("Portal", () => {
  afterEach(() => {
    for (const extra of Array.from(
      document.body.querySelectorAll("[data-container]"),
    )) {
      extra.remove();
    }
  });

  it("renders its children", () => {
    render(
      <Portal>
        <div>{"Overlay"}</div>
      </Portal>,
    );
    expect(screen.getByText("Overlay")).toBeInTheDocument();
  });

  it("puts them in document.body, not where it sits in the tree", () => {
    const { container } = render(
      <div data-testid="panel">
        <Portal>
          <div>{"Overlay"}</div>
        </Portal>
      </div>,
    );
    const overlay: HTMLElement = screen.getByText("Overlay");
    expect(container.contains(overlay)).toBe(false);
    expect(document.body.contains(overlay)).toBe(true);
  });

  it("escapes an ancestor that would clip it", () => {
    render(
      <div style={{ overflow: "hidden" }} data-testid="clipping">
        <Portal>
          <div>{"Overlay"}</div>
        </Portal>
      </div>,
    );
    const clipping: HTMLElement = screen.getByTestId("clipping");
    expect(clipping.contains(screen.getByText("Overlay"))).toBe(false);
  });

  it("renders into a container when given one", () => {
    const target: HTMLDivElement = document.createElement("div");
    target.setAttribute("data-container", "true");
    document.body.append(target);

    render(
      <Portal container={target}>
        <div>{"Overlay"}</div>
      </Portal>,
    );
    expect(target.contains(screen.getByText("Overlay"))).toBe(true);
  });

  it("renders in place when disabled", () => {
    const { container } = render(
      <div>
        <Portal disabled>
          <div>{"Overlay"}</div>
        </Portal>
      </div>,
    );
    expect(container.contains(screen.getByText("Overlay"))).toBe(true);
  });

  it("ignores container when disabled", () => {
    const target: HTMLDivElement = document.createElement("div");
    target.setAttribute("data-container", "true");
    document.body.append(target);

    const { container } = render(
      <Portal container={target} disabled>
        <div>{"Overlay"}</div>
      </Portal>,
    );
    expect(container.contains(screen.getByText("Overlay"))).toBe(true);
    expect(target.childElementCount).toBe(0);
  });

  it("renders several portals side by side without one displacing the other", () => {
    render(
      <>
        <Portal>
          <div>{"First"}</div>
        </Portal>
        <Portal>
          <div>{"Second"}</div>
        </Portal>
      </>,
    );
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
  });

  it("removes its children when it unmounts", () => {
    const { unmount } = render(
      <Portal>
        <div>{"Overlay"}</div>
      </Portal>,
    );
    expect(screen.getByText("Overlay")).toBeInTheDocument();
    unmount();
    expect(screen.queryByText("Overlay")).not.toBeInTheDocument();
  });

  it("renders nothing when it has no children", () => {
    const { container } = render(<Portal>{null}</Portal>);
    expect(container).toBeEmptyDOMElement();
  });

  it("emits nothing when rendered on a server, where document does not exist", () => {
    expect(
      renderToString(
        <Portal>
          <div>{"Overlay"}</div>
        </Portal>,
      ),
    ).toBe("");
  });

  it("still emits its children on a server when disabled", () => {
    expect(
      renderToString(
        <Portal disabled>
          <div>{"Overlay"}</div>
        </Portal>,
      ),
    ).toContain("Overlay");
  });

  it("leaves nothing of itself behind in the tree", () => {
    const { container } = render(
      <Portal>
        <div>{"Overlay"}</div>
      </Portal>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
