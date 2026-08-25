/**
 * Design library color token names.
 *
 * These map to `--color-*` CSS custom properties registered in `tailwind.css`
 * via `@theme inline`, which are populated by `.theme-light` / `.theme-dark`.
 *
 * Also passed to `extendTailwindMerge` so tailwind-merge correctly
 * deduplicates custom color classes (e.g. `bg-bg-primary` vs `bg-bg-error`).
 */

export const globalColors = [
  "bg-default",
  "bg-hover",
  "bg-active",
  "fg-default",
  "fg-muted",
  "fg-subtle",
  "fg-inverse",
  "border-default",
  "border-muted",
  "border-strong",
] as const;

export const disabledColors = [
  "bg-disabled",
  "fg-disabled",
  "border-disabled",
  "overlay-disabled",
] as const;

export const primaryColors = [
  "bg-primary",
  "bg-primary-hover",
  "bg-primary-active",
  "bg-primary-soft",
  "bg-primary-soft-hover",
  "bg-primary-soft-active",
  "fg-primary",
  "fg-primary-default",
  "fg-primary-default-hover",
  "border-primary",
  "border-primary-hover",
  "border-primary-active",
] as const;

export const secondaryColors = [
  "bg-secondary",
  "bg-secondary-hover",
  "bg-secondary-active",
  "bg-secondary-soft",
  "bg-secondary-soft-hover",
  "bg-secondary-soft-active",
  "fg-secondary",
  "fg-secondary-default",
  "fg-secondary-default-hover",
  "border-secondary",
  "border-secondary-hover",
  "border-secondary-active",
] as const;

export const tertiaryColors = [
  "bg-tertiary",
  "bg-tertiary-hover",
  "bg-tertiary-active",
  "bg-tertiary-soft",
  "bg-tertiary-soft-hover",
  "bg-tertiary-soft-active",
  "fg-tertiary",
  "fg-tertiary-default",
  "fg-tertiary-default-hover",
  "border-tertiary",
  "border-tertiary-hover",
  "border-tertiary-active",
] as const;

export const successColors = [
  "bg-success",
  "bg-success-hover",
  "bg-success-active",
  "bg-success-soft",
  "bg-success-soft-hover",
  "bg-success-soft-active",
  "fg-success",
  "fg-success-default",
  "fg-success-default-hover",
  "border-success",
  "border-success-hover",
  "border-success-active",
] as const;

export const errorColors = [
  "bg-error",
  "bg-error-hover",
  "bg-error-active",
  "bg-error-soft",
  "bg-error-soft-hover",
  "bg-error-soft-active",
  "fg-error",
  "fg-error-default",
  "fg-error-default-hover",
  "border-error",
  "border-error-hover",
  "border-error-active",
] as const;

export const warningColors = [
  "bg-warning",
  "bg-warning-hover",
  "bg-warning-active",
  "bg-warning-soft",
  "bg-warning-soft-hover",
  "bg-warning-soft-active",
  "fg-warning",
  "fg-warning-default",
  "fg-warning-default-hover",
  "border-warning",
  "border-warning-hover",
  "border-warning-active",
] as const;

export const infoColors = [
  "bg-info",
  "bg-info-hover",
  "bg-info-active",
  "bg-info-soft",
  "bg-info-soft-hover",
  "bg-info-soft-active",
  "fg-info",
  "fg-info-default",
  "fg-info-default-hover",
  "border-info",
  "border-info-hover",
  "border-info-active",
] as const;

/**
 * Surfaces above the page. `bg-popover` is deliberately distinct from
 * `bg-surface` so an overlay reads as floating rather than inline, and
 * `bg-scrim` is the wash behind a modal.
 */
export const surfaceColors = [
  "bg-surface",
  "bg-surface-raised",
  "bg-popover",
  "bg-scrim",
] as const;

/**
 * Presence is a state, like severity, but a separate family so that a green
 * "online" dot and a green "success" badge never mean the same thing in one
 * view.
 */
export const presenceColors = [
  "presence-online",
  "presence-away",
  "presence-offline",
] as const;

export const allCustomColors = [
  ...globalColors,
  ...disabledColors,
  ...primaryColors,
  ...secondaryColors,
  ...tertiaryColors,
  ...successColors,
  ...errorColors,
  ...warningColors,
  ...infoColors,
  ...surfaceColors,
  ...presenceColors,
] as const;

export type GlobalColor = (typeof globalColors)[number];
export type DisabledColor = (typeof disabledColors)[number];
export type PrimaryColor = (typeof primaryColors)[number];
export type SecondaryColor = (typeof secondaryColors)[number];
export type TertiaryColor = (typeof tertiaryColors)[number];
export type SuccessColor = (typeof successColors)[number];
export type ErrorColor = (typeof errorColors)[number];
export type WarningColor = (typeof warningColors)[number];
export type InfoColor = (typeof infoColors)[number];
export type SurfaceColor = (typeof surfaceColors)[number];
export type PresenceColor = (typeof presenceColors)[number];
export type DesignColor = (typeof allCustomColors)[number];
