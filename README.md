# flaglet

Tree-shakeable React country flag components. Crisp SVG flags for all ISO 3166-1 countries, loaded only when you use them.

- Dynamic `<Flag code="US" />` that lazy-loads each flag's SVG on demand.
- Static, tree-shakeable per-flag components (`import { FlagUS } from "flaglet/flags"`).
- Full TypeScript autocomplete for every valid country code.
- Accepts alpha-2, alpha-3, and numeric ISO codes.
- Accessibility baked in (`role="img"` + country-name label).
- Dual ESM / CommonJS builds, `react` as the only peer dependency.

## Live example

**Live demo and API reference: https://ssunils.github.io/flaglet/**

The source lives in [`demo/`](./demo). It can be run locally with Vite, is
deployed to GitHub Pages on every push to `main`, and can also be shared as a
single-file example from a GitHub Gist (no build step) via
[`demo/standalone.html`](./demo/standalone.html). See
[demo/README.md](./demo/README.md) for all three.

## Install

```sh
npm install flaglet
```

`react >= 16.8` is a peer dependency.

## Entry points

| Import                | Provides                                                       |
| --------------------- | -------------------------------------------------------------- |
| `flaglet`             | `Flag`, `countryCodes`, `countryNames`, `resolveCode`, types   |
| `flaglet/flags`       | One component per country: `FlagAD`, `FlagAE`, ... `FlagZW`     |

## Usage

### Dynamic (lazy-loaded)

Best when the flag is chosen at runtime (e.g. from API data). Importing `Flag`
does **not** pull every flag into your bundle; each SVG is a separate chunk
loaded on demand.

```tsx
import { Flag } from "flaglet";

<Flag code="US" />
<Flag code="GB" size="l" rounded />
<Flag code="JP" width={48} title="Japan" />
<Flag code="DEU" />          {/* alpha-3 works too */}
<Flag code="250" />          {/* numeric works too */}
```

### Static (fully tree-shakeable)

Best when the set of flags is known at build time. Only the flags you import
ship in your bundle.

```tsx
import { FlagUS, FlagGB } from "flaglet/flags";

<FlagUS width={32} />
<FlagGB />
```

Each component is named `Flag` + the uppercase ISO alpha-2 code (`FlagUS`,
`FlagGB`, `FlagJP`) and accepts standard `SVGProps<SVGSVGElement>` (`width`,
`height`, `className`, `style`, ...). They default to `role="img"` with the
country name as the label.

## `<Flag>` props

| Prop        | Type                       | Default        | Notes                                                    |
| ----------- | -------------------------- | -------------- | -------------------------------------------------------- |
| `code`      | `string`                   | required       | ISO alpha-2 / alpha-3 / numeric                          |
| `size`      | `"s" \| "m" \| "l"`        | `"m"`          | 16 / 20 / 32 px wide (4:3)                               |
| `width`     | `number`                   | from `size`    | Overrides `size`; height derived from ratio             |
| `height`    | `number`                   | from width     | Override height explicitly                               |
| `rounded`   | `boolean \| number`        | `false`        | `true` for a default radius, or a px value               |
| `title`     | `string`                   | country name   | Accessible label; pass `""` to mark decorative          |
| `fallback`  | `ReactNode`                | `null`         | Rendered for unknown codes and while a flag chunk loads  |
| ...rest     | `SVGProps<SVGSVGElement>`  |                | `className`, `style`, event handlers, etc.               |

## Utilities

```ts
import { countryCodes, countryNames, resolveCode } from "flaglet";

countryCodes;            // ["AD", "AE", ...] all known alpha-2 codes
countryNames.US;         // "United States of America"
resolveCode("usa");      // "US"  (normalizes alpha-2/alpha-3/numeric)
resolveCode("nope");     // undefined
```

## TypeScript

flaglet ships its own types. The `code` prop accepts a `FlagInput`, which gives
autocomplete for every known code while still tolerating an arbitrary `string`
at runtime (handy for codes coming from an API).

```ts
import type { CountryCode, Alpha3Code, FlagInput, FlagComponent } from "flaglet";

const code: CountryCode = "US"; // autocompleted union of all alpha-2 codes
```

## Server-side rendering

The static components (`flaglet/flags`) render synchronously and work in any
SSR or React Server Components setup. The dynamic `<Flag>` uses `React.lazy` +
`Suspense`, so wrap it in a `<Suspense>` boundary (or rely on the built-in one)
and provide a `fallback` if you need a placeholder during hydration. When the
flag set is known ahead of time, prefer the static components for SSR.

## Accessibility

Each flag renders with `role="img"` and an `aria-label` set to the country
name. For decorative flags next to a visible country name, pass `title=""` to
hide it from assistive technology.

## Flag artwork and naming

Flag SVGs are generated from [flagpack](https://github.com/Yummygum/flagpack-core)
(MIT). Country codes and names mirror that dataset. Flags can be politically
sensitive; flaglet does not take a position on contested territories and simply
reflects the upstream dataset. Corrections to flag artwork or codes are best
filed upstream with flagpack.

See [THIRD_PARTY_LICENSES](./THIRD_PARTY_LICENSES) for attribution.

## License

[MIT](./LICENSE)
