import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import {
  Avatar,
  avatarShapes,
  avatarSizes,
  avatarStatuses,
  initialsFromName,
} from "./Avatar";

const slot = (container: HTMLElement, name = "avatar"): HTMLElement => {
  const element = container.querySelector<HTMLElement>(`[data-slot='${name}']`);
  if (!element) {
    throw new Error(`${name} slot not found`);
  }
  return element;
};

describe("initialsFromName", () => {
  it("takes the first letter of the first and last word", () => {
    expect(initialsFromName("Kanto Polymer KK")).toBe("KK");
  });

  it("handles a single word", () => {
    expect(initialsFromName("Maersk")).toBe("M");
  });

  it("uppercases", () => {
    expect(initialsFromName("k. lin")).toBe("KL");
  });

  it("tolerates extra whitespace", () => {
    expect(initialsFromName("  K.   Lin  ")).toBe("KL");
  });

  it("returns nothing for an empty name", () => {
    expect(initialsFromName("   ")).toBe("");
  });
});

describe("Avatar", () => {
  it("takes its accessible name from name", () => {
    render(<Avatar name="K. Lin" />);
    expect(screen.getByText("K. Lin")).toBeInTheDocument();
  });

  it("renders initials when there is no image", () => {
    const { container } = render(<Avatar name="Kanto Polymer KK" />);
    expect(slot(container, "avatar-initials").textContent).toBe("KK");
  });

  it("hides the initials from assistive technology, since the name is there", () => {
    const { container } = render(<Avatar name="K. Lin" />);
    expect(slot(container, "avatar-initials")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders an image when src is given", () => {
    const { container } = render(
      <Avatar name="K. Lin" src="https://example.test/k.png" />,
    );
    expect(slot(container, "avatar-image")).toHaveAttribute(
      "src",
      "https://example.test/k.png",
    );
  });

  it("gives the image an empty alt — the name carries it, not 'image'", () => {
    const { container } = render(
      <Avatar name="K. Lin" src="https://example.test/k.png" />,
    );
    expect(slot(container, "avatar-image")).toHaveAttribute("alt", "");
  });

  it("does not render initials alongside an image", () => {
    const { container } = render(
      <Avatar name="K. Lin" src="https://example.test/k.png" />,
    );
    expect(container.querySelector("[data-slot='avatar-initials']")).toBeNull();
  });

  it("applies the default size and shape", () => {
    const { container } = render(<Avatar name="K. Lin" />);
    const className: string = slot(container).className;
    expect(className).toContain("size-8");
    expect(className).toContain("rounded-full");
  });

  it("gives every size a distinct set of classes", () => {
    const classNames: Array<string> = avatarSizes.map((size) => {
      const { container, unmount } = render(
        <Avatar name="K. Lin" size={size} />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(avatarSizes.length);
  });

  it("gives every shape a distinct set of classes", () => {
    const classNames: Array<string> = avatarShapes.map((shape) => {
      const { container, unmount } = render(
        <Avatar name="K. Lin" shape={shape} />,
      );
      const className: string = slot(container).className;
      unmount();
      return className;
    });
    expect(new Set(classNames).size).toBe(avatarShapes.length);
  });

  describe("status", () => {
    it("renders no dot unless asked for", () => {
      const { container } = render(<Avatar name="K. Lin" />);
      expect(container.querySelector("[data-slot='avatar-status']")).toBeNull();
    });

    it("gives every status a distinct set of classes", () => {
      const classNames: Array<string> = avatarStatuses.map((status) => {
        const { container, unmount } = render(
          <Avatar name="K. Lin" status={status} statusLabel={status} />,
        );
        const className: string = slot(container, "avatar-status").className;
        unmount();
        return className;
      });
      expect(new Set(classNames).size).toBe(avatarStatuses.length);
    });

    it("uses presence tokens, never the severity family", () => {
      const { container } = render(
        <Avatar name="K. Lin" status="online" statusLabel="Online" />,
      );
      const className: string = slot(container, "avatar-status").className;
      expect(className).toContain("bg-presence-online");
      expect(className).not.toContain("bg-bg-success");
    });

    it("puts the status meaning in words, not colour alone", () => {
      render(<Avatar name="K. Lin" status="online" statusLabel="Online" />);
      expect(screen.getByText("Online")).toBeInTheDocument();
    });

    it("wraps avatar and dot so the dot escapes the clipping", () => {
      const { container } = render(
        <Avatar name="K. Lin" status="away" statusLabel="Away" />,
      );
      expect(slot(container, "avatar-wrapper")).toBeInTheDocument();
      expect(slot(container).className).toContain("overflow-hidden");
    });
  });

  it("merges className rather than replacing the variant classes", () => {
    const { container } = render(<Avatar name="K. Lin" className="ml-2" />);
    const className: string = slot(container).className;
    expect(className).toContain("ml-2");
    expect(className).toContain("size-8");
  });

  it("merges className onto the wrapper when there is a status", () => {
    const { container } = render(
      <Avatar
        name="K. Lin"
        status="online"
        statusLabel="Online"
        className="ml-2"
      />,
    );
    expect(slot(container, "avatar-wrapper").className).toContain("ml-2");
  });

  it("forwards a ref", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar name="K. Lin" ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("forwards arbitrary native props", () => {
    const { container } = render(<Avatar name="K. Lin" data-testid="who" />);
    expect(slot(container)).toHaveAttribute("data-testid", "who");
  });
});
