import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// GitHub Pages serves a project site below /<repository>. The Pages workflow
// passes that prefix in; it stays empty for a custom domain and local builds.
const basePath = process.env.PAGES_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath,
  // Emit docs/index.html instead of docs.html: once a docs/ directory exists,
  // GitHub Pages redirects /docs to /docs/ and would never serve docs.html.
  trailingSlash: true,
  images: { unoptimized: true },
  // Client code needs the prefix too (static search fetches its index).
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  reactStrictMode: true,
};

export default withMDX(config);
