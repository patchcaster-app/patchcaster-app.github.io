import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'PatchCaster';
export const tagline = 'From forge to chat — one live thread per merge request.';
export const docsRoute = '/docs';
export const docsImageRoute = '/og/docs';
export const docsContentRoute = '/llms.mdx/docs';

// The docs pages are synced from this repository (scripts/sync-docs.mjs).
export const gitConfig = {
  user: 'patchcaster-app',
  repo: 'patchcaster',
  branch: 'main',
};

export const repositoryUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

// The URL prefix GitHub Pages serves the site under, '' when there is none.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}

// Where a synced page's Markdown lives in the patchcaster repository.
export function getPageSourceUrl(sourcePath: string) {
  return `${repositoryUrl}/blob/${gitConfig.branch}/${sourcePath}`;
}
