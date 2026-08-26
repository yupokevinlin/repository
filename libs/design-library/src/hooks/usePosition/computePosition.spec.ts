import { describe, expect, it } from "vitest";

import {
  computePosition,
  type ComputePositionArgs,
  type PositionAlignment,
  positionAlignments,
  type PositionPlacement,
} from "./computePosition";

/** A 100×40 trigger in the middle of a 1000×800 viewport. */
const baseArgs: ComputePositionArgs = {
  anchor: { top: 400, left: 400, width: 100, height: 40 },
  floating: { width: 200, height: 120 },
  viewport: { width: 1000, height: 800 },
  placement: "bottom",
  alignment: "start",
  offset: 4,
};

const at = (overrides: Partial<ComputePositionArgs>) =>
  computePosition({ ...baseArgs, ...overrides });

describe("computePosition", () => {
  describe("main axis", () => {
    it("sits below the anchor, past the gap", () => {
      expect(at({ placement: "bottom" }).top).toBe(444);
    });

    it("sits above the anchor, past the gap", () => {
      expect(at({ placement: "top" }).top).toBe(276);
    });

    it("sits to the right of the anchor", () => {
      expect(at({ placement: "right" }).left).toBe(504);
    });

    it("sits to the left of the anchor", () => {
      expect(at({ placement: "left" }).left).toBe(196);
    });

    it("honours a zero gap", () => {
      expect(at({ placement: "bottom", offset: 0 }).top).toBe(440);
    });

    it("reports the side it used", () => {
      expect(at({ placement: "right" }).placement).toBe("right");
    });
  });

  describe("flip", () => {
    it("flips up when there is no room below", () => {
      const result = at({
        placement: "bottom",
        anchor: { top: 700, left: 400, width: 100, height: 40 },
      });
      expect(result.placement).toBe("top");
      expect(result.top).toBe(576);
    });

    it("flips down when there is no room above", () => {
      const result = at({
        placement: "top",
        anchor: { top: 40, left: 400, width: 100, height: 40 },
      });
      expect(result.placement).toBe("bottom");
      expect(result.top).toBe(84);
    });

    it("flips left when there is no room right", () => {
      const result = at({
        placement: "right",
        anchor: { top: 400, left: 850, width: 100, height: 40 },
      });
      expect(result.placement).toBe("left");
      expect(result.left).toBe(646);
    });

    it("flips right when there is no room left", () => {
      const result = at({
        placement: "left",
        anchor: { top: 400, left: 50, width: 100, height: 40 },
      });
      expect(result.placement).toBe("right");
      expect(result.left).toBe(154);
    });

    it("stays put when it fits exactly", () => {
      const result = at({
        placement: "bottom",
        // 800 - 636 - 40 - 4 = 120, exactly the floating height.
        anchor: { top: 636, left: 400, width: 100, height: 40 },
      });
      expect(result.placement).toBe("bottom");
    });

    it("flips when it misses fitting by a single pixel", () => {
      const result = at({
        placement: "bottom",
        anchor: { top: 637, left: 400, width: 100, height: 40 },
      });
      expect(result.placement).toBe("top");
    });

    it("keeps the preferred side when neither side fits", () => {
      const result = at({
        placement: "bottom",
        floating: { width: 200, height: 700 },
        anchor: { top: 380, left: 400, width: 100, height: 40 },
      });
      expect(result.placement).toBe("bottom");
    });

    it("does not flip across axes — a cramped bottom never becomes right", () => {
      const result = at({
        placement: "bottom",
        floating: { width: 200, height: 700 },
        anchor: { top: 380, left: 400, width: 100, height: 40 },
      });
      expect(["top", "bottom"]).toContain(result.placement);
    });

    it("counts the gap when deciding whether it fits", () => {
      // Room below is exactly the floating height, but only without a gap.
      const anchor = { top: 640, left: 400, width: 100, height: 40 };
      expect(at({ placement: "bottom", anchor, offset: 0 }).placement).toBe(
        "bottom",
      );
      expect(at({ placement: "bottom", anchor, offset: 4 }).placement).toBe(
        "top",
      );
    });
  });

  describe("alignment on a vertical placement", () => {
    it("aligns leading edges", () => {
      expect(at({ alignment: "start" }).left).toBe(400);
    });

    it("centres on the anchor", () => {
      expect(at({ alignment: "center" }).left).toBe(350);
    });

    it("aligns trailing edges", () => {
      expect(at({ alignment: "end" }).left).toBe(300);
    });

    it("leaves the main axis alone whatever the alignment", () => {
      const tops: Array<number> = positionAlignments.map(
        (alignment: PositionAlignment) => at({ alignment }).top,
      );
      expect(new Set(tops).size).toBe(1);
    });
  });

  describe("alignment on a horizontal placement", () => {
    it("aligns top edges", () => {
      expect(at({ placement: "right", alignment: "start" }).top).toBe(400);
    });

    it("centres on the anchor", () => {
      expect(at({ placement: "right", alignment: "center" }).top).toBe(360);
    });

    it("aligns bottom edges", () => {
      expect(at({ placement: "right", alignment: "end" }).top).toBe(320);
    });
  });

  it("handles a zero-sized anchor, which is how a cursor menu is positioned", () => {
    const result = at({
      anchor: { top: 200, left: 300, width: 0, height: 0 },
      placement: "bottom",
      alignment: "start",
    });
    expect(result.top).toBe(204);
    expect(result.left).toBe(300);
  });

  it("returns integers-in, numbers-out without rounding surprises", () => {
    const result = at({
      alignment: "center",
      anchor: { top: 400, left: 400, width: 101, height: 40 },
    });
    expect(result.left).toBeCloseTo(350.5);
  });

  it("positions consistently for every placement", () => {
    const placements: Array<PositionPlacement> = [
      "top",
      "bottom",
      "left",
      "right",
    ];
    for (const placement of placements) {
      const result = at({ placement });
      expect(Number.isFinite(result.top)).toBe(true);
      expect(Number.isFinite(result.left)).toBe(true);
    }
  });
});
