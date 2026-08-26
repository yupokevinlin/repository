import { describe, expect, it } from "vitest";

import {
  evenSizes,
  initialSizes,
  resize,
  toggleCollapse,
} from "./resizableSizes";

const sum = (sizes: Array<number>): number =>
  sizes.reduce((total: number, size: number) => total + size, 0);

describe("evenSizes", () => {
  it("splits the container", () => {
    expect(evenSizes(4)).toEqual([25, 25, 25, 25]);
  });

  it("handles nothing at all", () => {
    expect(evenSizes(0)).toEqual([]);
  });
});

describe("initialSizes", () => {
  it("shares what is left between the panels that said nothing", () => {
    expect(initialSizes([50, undefined, undefined])).toEqual([50, 25, 25]);
  });

  it("takes every panel at its word when they all asked", () => {
    expect(initialSizes([30, 70])).toEqual([30, 70]);
  });

  it("normalises sizes that do not add up, rather than leaving a gap", () => {
    expect(initialSizes([1, 1])).toEqual([50, 50]);
    expect(sum(initialSizes([60, 60]))).toBeCloseTo(100);
  });

  it("falls back to an even split when everything is zero", () => {
    expect(initialSizes([0, 0])).toEqual([50, 50]);
  });

  it("gives nothing away when the asked-for sizes already fill it", () => {
    expect(initialSizes([100, undefined])).toEqual([100, 0]);
  });
});

describe("resize", () => {
  it("moves the boundary", () => {
    expect(
      resize({ sizes: [50, 50], handle: 0, delta: 10, constraints: [] }),
    ).toEqual([60, 40]);
  });

  it("moves it back", () => {
    expect(
      resize({ sizes: [50, 50], handle: 0, delta: -10, constraints: [] }),
    ).toEqual([40, 60]);
  });

  it("is reversible — out and back is where you started", () => {
    const out = resize({
      sizes: [50, 50],
      handle: 0,
      delta: 17,
      constraints: [],
    });
    expect(
      resize({ sizes: out, handle: 0, delta: -17, constraints: [] }),
    ).toEqual([50, 50]);
  });

  it("leaves the panels further along alone", () => {
    const next = resize({
      sizes: [30, 30, 40],
      handle: 0,
      delta: 10,
      constraints: [],
    });
    expect(next).toEqual([40, 20, 40]);
  });

  it("keeps the total at 100", () => {
    for (const delta of [-90, -10, 0, 5, 90]) {
      expect(
        sum(resize({ sizes: [40, 60], handle: 0, delta, constraints: [] })),
      ).toBeCloseTo(100);
    }
  });

  it("stops at the first panel's minimum", () => {
    expect(
      resize({
        sizes: [50, 50],
        handle: 0,
        delta: -40,
        constraints: [{ minSize: 20 }],
      }),
    ).toEqual([20, 80]);
  });

  it("stops at the second panel's minimum too", () => {
    expect(
      resize({
        sizes: [50, 50],
        handle: 0,
        delta: 40,
        constraints: [undefined, { minSize: 25 }],
      }),
    ).toEqual([75, 25]);
  });

  it("respects a maximum", () => {
    expect(
      resize({
        sizes: [50, 50],
        handle: 0,
        delta: 40,
        constraints: [{ maxSize: 70 }],
      }),
    ).toEqual([70, 30]);
  });

  it("does nothing when the handle is not between two panels", () => {
    expect(
      resize({ sizes: [100], handle: 0, delta: 10, constraints: [] }),
    ).toEqual([100]);
  });

  describe("collapsing", () => {
    it("snaps shut past halfway to the minimum", () => {
      expect(
        resize({
          sizes: [30, 70],
          handle: 0,
          delta: -25,
          constraints: [{ minSize: 20, collapsible: true }],
        }),
      ).toEqual([0, 100]);
    });

    it("stops at the minimum when it is not collapsible", () => {
      expect(
        resize({
          sizes: [30, 70],
          handle: 0,
          delta: -25,
          constraints: [{ minSize: 20 }],
        }),
      ).toEqual([20, 80]);
    });

    it("does not snap shut on the way to the minimum", () => {
      expect(
        resize({
          sizes: [30, 70],
          handle: 0,
          delta: -15,
          constraints: [{ minSize: 20, collapsible: true }],
        }),
      ).toEqual([20, 80]);
    });

    it("shuts the second panel when it is the collapsible one", () => {
      expect(
        resize({
          sizes: [70, 30],
          handle: 0,
          delta: 25,
          constraints: [undefined, { minSize: 20, collapsible: true }],
        }),
      ).toEqual([100, 0]);
    });
  });
});

describe("toggleCollapse", () => {
  it("shuts an open panel", () => {
    expect(
      toggleCollapse({ sizes: [30, 70], handle: 0, constraints: [] }),
    ).toEqual([0, 100]);
  });

  it("reopens a shut one at the size it says it needs", () => {
    expect(
      toggleCollapse({
        sizes: [0, 100],
        handle: 0,
        constraints: [{ minSize: 25 }],
      }),
    ).toEqual([50, 50]);
  });

  it("reopens to half when it asked for no minimum", () => {
    expect(
      toggleCollapse({ sizes: [0, 100], handle: 0, constraints: [] }),
    ).toEqual([50, 50]);
  });

  it("does not reopen past a maximum", () => {
    expect(
      toggleCollapse({
        sizes: [0, 100],
        handle: 0,
        constraints: [{ maxSize: 30 }],
      }),
    ).toEqual([30, 70]);
  });

  it("keeps the total", () => {
    expect(
      sum(toggleCollapse({ sizes: [40, 60], handle: 0, constraints: [] })),
    ).toBeCloseTo(100);
  });

  it("does nothing when the handle is not between two panels", () => {
    expect(
      toggleCollapse({ sizes: [100], handle: 0, constraints: [] }),
    ).toEqual([100]);
  });
});
