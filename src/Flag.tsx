import * as React from "react";
import { flagLoaders, countryNames, resolveCode } from "./registry";
import type { CountryCode, FlagInput } from "./types";

export type FlagSize = "s" | "m" | "l";

export interface FlagProps
  extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  /** ISO 3166-1 code: alpha-2 (`"US"`), alpha-3 (`"USA"`), or numeric (`"840"`). */
  code: FlagInput;
  /** Preset width: s = 16px, m = 20px, l = 32px. Ignored when `width` is set. */
  size?: FlagSize;
  /** Explicit width in px; height is derived from the 4:3 ratio. */
  width?: number;
  /** Explicit height in px. */
  height?: number;
  /** Round the corners. `true` uses a sensible radius, or pass a px value. */
  rounded?: boolean | number;
  /**
   * Accessible label. Defaults to the country name.
   * Pass `""` to mark the flag decorative (`aria-hidden`).
   */
  title?: string;
  /** Rendered for unknown codes and while the flag chunk loads. */
  fallback?: React.ReactNode;
}

const SIZE_WIDTHS: Record<FlagSize, number> = { s: 16, m: 20, l: 32 };
const HEIGHT_RATIO = 3 / 4;

const lazyCache = new Map<
  CountryCode,
  React.LazyExoticComponent<React.ComponentType<React.SVGProps<SVGSVGElement>>>
>();

function getLazyFlag(code: CountryCode) {
  let component = lazyCache.get(code);
  if (!component) {
    component = React.lazy(flagLoaders[code]);
    lazyCache.set(code, component);
  }
  return component;
}

/**
 * Renders a country flag by ISO code. The flag's SVG is loaded on demand, so
 * importing `Flag` does not pull every flag into your bundle.
 */
export function Flag({
  code,
  size = "m",
  width,
  height,
  rounded,
  title,
  fallback = null,
  style,
  ...rest
}: FlagProps): React.ReactElement {
  const resolved = resolveCode(code);
  if (!resolved) return <>{fallback}</>;

  const w = width ?? SIZE_WIDTHS[size];
  const h = height ?? Math.round(w * HEIGHT_RATIO);
  const label = title ?? countryNames[resolved];

  const borderRadius =
    rounded === true
      ? Math.max(2, Math.round(h * 0.12))
      : typeof rounded === "number"
        ? rounded
        : undefined;

  const a11y =
    label === ""
      ? { role: undefined, "aria-label": undefined, "aria-hidden": true }
      : { role: "img", "aria-label": label, "aria-hidden": undefined };

  const LazyFlag = getLazyFlag(resolved);

  return (
    <React.Suspense fallback={fallback}>
      <LazyFlag
        width={w}
        height={h}
        style={borderRadius != null ? { borderRadius, ...style } : style}
        {...a11y}
        {...rest}
      />
    </React.Suspense>
  );
}
