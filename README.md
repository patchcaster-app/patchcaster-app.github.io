# patchcaster-website

The PatchCaster website: a landing page and the operator documentation, built
with [Fumadocs](https://fumadocs.dev) on Next.js and exported as static files
for GitHub Pages.

## Develop

Needs Node.js 24 and a checkout of the
[patchcaster](https://github.com/patchcaster-app/patchcaster) repository next
to this one (`../patchcaster`), or anywhere `PATCHCASTER_DIR` points.

```sh
npm ci
npm run dev       # http://localhost:3000
npm run build     # static site in out/
npm start         # serve out/ locally
```

`npm run types:check` runs the TypeScript check.

## Where the docs come from

The patchcaster repository owns the docs. `npm run sync`, which `dev` and
`build` run first, converts its README overview, `docs/*.md` operator guides
and `CHANGELOG.md` into Fumadocs pages under `content/docs/`:

* each `# Title` becomes the page title, and the first paragraph its
  description for search and link previews;
* links between synced pages become site links, and links to any other file
  point at that file on GitHub;
* the sidebar order is the page list in `scripts/sync-docs.mjs`.

`content/docs/` is generated and git-ignored: change the docs in the
patchcaster repository, not here. The developer guide and the specs stay out
of the site on purpose.

## Deploy

`.github/workflows/pages.yml` builds on every push to `main`, on pull requests
(build only), daily so docs changes in patchcaster appear without a manual
run, and on demand. Before the first run, set the source under
**Settings › Pages** to **GitHub Actions**.

A custom domain is set there too. The workflow reads the address from
`actions/configure-pages`, so a project site under `/<repository>/` and a
custom domain both work without code changes.

## Analytics

Deployed builds load the [Umami Cloud](https://cloud.umami.is) tracker. It
counts visits without cookies and reports the Core Web Vitals of real
visitors (`data-performance`). The website ID is in
`components/analytics.tsx`. Local builds lack the deployed address and render
no tracker, and `data-domains` stops copies of the site from reporting. The
landing page's calls to action carry `data-umami-event` attributes, so the
Events view shows which ones visitors use.

## Design

The mascot is the GitHub organisation avatar (`assets/patchcaster.webp`,
`app/icon.png` and `app/apple-icon.png` are resized from it). The palette in
`app/global.css` comes from the same artwork: royal and sky blue in light
mode, gold and brass on navy in dark mode.
