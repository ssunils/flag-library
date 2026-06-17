# react-flaglet demo

A live example and API reference for [react-flaglet](../README.md). It comes in two forms:

Live: **https://ssunils.github.io/flag-library/**

| File              | Build step | Use it for                                            |
| ----------------- | ---------- | ----------------------------------------------------- |
| Vite app (`src/`) | yes        | Local dev, and the site deployed to GitHub Pages.     |
| `standalone.html` | no         | A single file you can drop into a GitHub Gist.        |

## Run the Vite app locally

The app consumes react-flaglet through a `file:..` link, so build the library first.

```sh
# from the repo root
npm run build

# then start the demo
cd demo
npm install
npm run dev          # http://localhost:5180
```

If you change the library source, re-run `npm run build` at the root and the
demo picks it up.

## Deploy to GitHub Pages

The repo includes [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml),
which on every push to `main` builds the library, builds this demo, and
publishes it to GitHub Pages at `https://<user>.github.io/flag-library/`.

One-time setup: in the GitHub repo, go to **Settings > Pages** and set
**Source** to **GitHub Actions**. After the next push to `main`, the site is
live.

The Vite `base` is set to `/flag-library/` for production builds (see
[`vite.config.ts`](./vite.config.ts)) to match the repo name. If you rename the
repo, update that `base` and the `homepage` field in the root `package.json` to
match, or asset URLs will 404.

## Deploy the standalone example as a Gist

`standalone.html` has no build step. It loads React and react-flaglet from the
[esm.sh](https://esm.sh) CDN, so it runs anywhere a browser can fetch modules.

This requires react-flaglet to be published to npm. For a stable example, pin a
version in the import map (e.g. `react-flaglet@0.1.0` instead of `react-flaglet`).

1. Create a Gist at https://gist.github.com containing the contents of
   `standalone.html`. Name the file `index.html`.
2. Open the live preview through one of:
   - **gistpreview**: `https://gistpreview.github.io/?<your-gist-id>`
   - **raw.githack.com**: paste the Gist's raw file URL into
     https://raw.githack.com
3. Share that preview URL as your example.

You can also open the same file directly in
[StackBlitz](https://stackblitz.com) or [CodeSandbox](https://codesandbox.io)
by importing the Gist, which gives an editable playground.

## How the standalone file works

- An [import map](https://developer.mozilla.org/docs/Web/HTML/Element/script/type/importmap)
  maps the bare specifiers `react`, `react-dom/client`, `react-flaglet`, and
  `react-flaglet/flags` to esm.sh URLs.
- `?external=react` on the react-flaglet URLs tells esm.sh to import React from the
  import map rather than bundling its own copy, guaranteeing a single React
  instance (otherwise hooks throw).
- Babel Standalone compiles the inline JSX in the browser. This is convenient
  for a single-file demo; do not use Babel Standalone in production.
