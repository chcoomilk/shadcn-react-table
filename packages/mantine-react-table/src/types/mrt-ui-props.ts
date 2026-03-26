/**
 * Loose prop types replacing Mantine component props for API compatibility.
 * Mantine-specific props may be ignored or partially supported — see individual components.
 */
import type {
  ComponentPropsWithoutRef,
  HTMLAttributes,
  ReactNode,
} from 'react';

/** Matches shadcn `Button` variants (Mantine ActionIcon `variant` strings should map to these). */
export type MRT_ButtonVariant =
  | 'default'
  | 'destructive'
  | 'ghost'
  | 'link'
  | 'outline'
  | 'secondary'
  | null
  | undefined;

/** @see packages/mantine-react-table/src/components/ui/button.tsx */
export type ActionIconProps = {
  /** Mantine: ignored; use className / Tailwind */
  color?: string;
  variant?: MRT_ButtonVariant;
} & ComponentPropsWithoutRef<'button'>;

export type AlertProps = HTMLAttributes<HTMLDivElement>;

export type AutocompleteProps = Record<string, unknown>;

export type BadgeProps = HTMLAttributes<HTMLDivElement>;

export type BoxProps = {
  /** Mantine-compat: CSS variables applied as inline style */
  __vars?: Record<string, number | string | undefined>;
} & HTMLAttributes<HTMLDivElement>;

export type CheckboxProps = Record<string, unknown>;

export type FlexProps = HTMLAttributes<HTMLDivElement>;

export type HighlightProps = {
  children?: ReactNode;
  highlight: string;
};

export type LoadingOverlayProps = {
  spinner?: boolean;
  visible?: boolean;
} & HTMLAttributes<HTMLDivElement>;

/** Radix Dialog — `opened` mapped in modal components */
export type ModalProps = {
  onClose?: () => void;
  opened?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export type MultiSelectProps = {
  clearable?: boolean;
  data?: unknown[];
} & Record<string, unknown>;

export type PaginationProps = Record<string, unknown>;

export type PaperProps = HTMLAttributes<HTMLDivElement>;

export type ProgressProps = {
  value?: number;
} & HTMLAttributes<HTMLDivElement>;

export type RadioProps = Record<string, unknown>;

export type RangeSliderProps = Record<string, unknown>;

export type SelectProps = {
  clearButtonProps?: Record<string, unknown>;
  data?: unknown[];
} & Record<string, unknown>;

export type SkeletonProps = HTMLAttributes<HTMLDivElement>;

export type SwitchProps = Record<string, unknown>;

export type TableProps = {
  __vars?: Record<string, number | string | undefined>;
  highlightOnHover?: boolean;
  horizontalSpacing?: string;
  /** Mantine table `striped` — odd/even row striping hint for body rows */
  striped?: boolean | string;
  stripedColor?: string;
  verticalSpacing?: string;
} & ComponentPropsWithoutRef<'table'>;

export type TableTbodyProps = ComponentPropsWithoutRef<'tbody'>;
export type TableTdProps = ComponentPropsWithoutRef<'td'>;
export type TableTfootProps = ComponentPropsWithoutRef<'tfoot'>;
export type TableThProps = ComponentPropsWithoutRef<'th'>;
export type TableTheadProps = ComponentPropsWithoutRef<'thead'>;
export type TableTrProps = ComponentPropsWithoutRef<'tr'>;

export type TextInputProps = ComponentPropsWithoutRef<'input'>;

export type UnstyledButtonProps = ComponentPropsWithoutRef<'button'>;

/** Date filter — react-day-picker + Popover; not all Mantine DateInput props apply */
export type DateInputProps = Record<string, unknown>;
