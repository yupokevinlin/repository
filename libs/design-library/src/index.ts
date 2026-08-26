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
  Badge,
  type BadgeAppearance,
  badgeAppearances,
  type BadgeProps,
  badgeSeverities,
  type BadgeSeverity,
  type BadgeSize,
  badgeSizes,
} from "./components/DataDisplay/Badge";
