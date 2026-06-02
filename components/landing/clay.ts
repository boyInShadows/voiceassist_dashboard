import type { CSSProperties } from "react";

/**
 * Tint a clay element. Drop the resulting object into `style` and the
 * `.clay` / `.clay-sm` / `.clay-blob` utilities pick up the colour for their
 * outer drop-shadow. Values mirror the dashboard chart palette (SERIES_COLORS).
 */
export const clayTint = (rgb: string): CSSProperties =>
  ({ "--clay-tint": rgb } as CSSProperties);

/** Brand clay palette — same hues the dashboard charts use. */
export const TINT = {
  violet: "139 92 246",
  sky: "56 189 248",
  emerald: "16 185 129",
  amber: "251 191 36",
  rose: "244 63 94",
  teal: "20 184 166",
} as const;
