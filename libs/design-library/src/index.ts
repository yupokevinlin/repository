// Tailwind utilities
export { cn } from "./tailwind/tailwindMerge/tailwindMerge";

// Design tokens (theme)
export * from "./tailwind/theme";

// Components — Buttons
export {
  Button,
  type ButtonProps,
  type ButtonSize,
  buttonSizes,
  type ButtonVariant,
  buttonVariants,
} from "./components/Buttons/Button";
export {
  ButtonGroup,
  type ButtonGroupOrientation,
  buttonGroupOrientations,
  type ButtonGroupProps,
} from "./components/Buttons/ButtonGroup";
export {
  IconButton,
  type IconButtonProps,
} from "./components/Buttons/IconButton";
export {
  Link,
  type LinkAppearance,
  linkAppearances,
  type LinkProps,
} from "./components/Buttons/Link";

// Components — Forms
export {
  HelperText,
  helperTextDensities,
  type HelperTextDensity,
  type HelperTextProps,
  helperTextSeverities,
  type HelperTextSeverity,
} from "./components/Forms/HelperText";
export {
  Label,
  labelDensities,
  type LabelDensity,
  type LabelProps,
} from "./components/Forms/Label";

// Components — Inputs
export {
  TextInput,
  type TextInputProps,
  type TextInputSize,
  textInputSizes,
  type TextInputVariant,
  textInputVariants,
} from "./components/Inputs/TextInput";

// Components — Feedback
export {
  Alert,
  type AlertProps,
  alertSeverities,
  type AlertSeverity,
} from "./components/Feedback/Alert";
export {
  ProgressBar,
  type ProgressBarProps,
  progressBarSeverities,
  type ProgressBarSeverity,
  type ProgressBarSize,
  progressBarSizes,
  type ProgressBarThresholds,
} from "./components/Feedback/ProgressBar";
export {
  Skeleton,
  type SkeletonProps,
  type SkeletonVariant,
  skeletonVariants,
} from "./components/Feedback/Skeleton";
export {
  LoadingSpinner,
  type LoadingSpinnerProps,
  type LoadingSpinnerSize,
  loadingSpinnerSizes,
  type LoadingSpinnerVariant,
  loadingSpinnerVariants,
} from "./components/LoadingSpinner";

// Components — Typography
export {
  Heading,
  type HeadingElement,
  headingElements,
  type HeadingFontFamily,
  type HeadingProps,
  type HeadingSize,
  type HeadingWeight,
  Typography,
  type TypographyElement,
  typographyElements,
  typographyFontFamilies,
  type TypographyFontFamily,
  type TypographyProps,
  type TypographySize,
  typographySizes,
  type TypographyWeight,
  typographyWeights,
} from "./components/Typography";

// Components — DataDisplay
export {
  Avatar,
  type AvatarProps,
  type AvatarShape,
  avatarShapes,
  type AvatarSize,
  avatarSizes,
  type AvatarStatus,
  avatarStatuses,
  initialsFromName,
} from "./components/DataDisplay/Avatar";
export {
  AvatarGroup,
  type AvatarGroupProps,
} from "./components/DataDisplay/AvatarGroup";
export {
  Badge,
  type BadgeAppearance,
  badgeAppearances,
  type BadgeProps,
  badgeSeverities,
  type BadgeSeverity,
  type BadgeSize,
  badgeSizes,
} from "./components/DataDisplay/Badge";
export {
  Kbd,
  type KbdProps,
  type KbdSize,
  kbdSizes,
} from "./components/DataDisplay/Kbd";
export {
  Tag,
  type TagAppearance,
  tagAppearances,
  type TagProps,
  type TagSize,
  tagSizes,
} from "./components/DataDisplay/Tag";

// Components — Overlays
export { Portal, type PortalProps } from "./components/Overlays/Portal";

// Components — Surfaces
export {
  Card,
  type CardElevation,
  cardElevations,
  type CardPadding,
  cardPaddings,
  type CardProps,
  cardSeverities,
  type CardSeverity,
} from "./components/Surfaces/Card";
export {
  Collapsible,
  type CollapsibleProps,
} from "./components/Surfaces/Collapsible";
export {
  Divider,
  dividerEmphases,
  type DividerEmphasis,
  type DividerOrientation,
  dividerOrientations,
  type DividerProps,
} from "./components/Surfaces/Divider";
