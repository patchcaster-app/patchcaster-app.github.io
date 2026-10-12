// Generates content/docs from the PatchCaster repository's operator docs.
//
// The patchcaster repository stays the single source of truth: this script
// copies its user-facing Markdown into Fumadocs pages, and the output is
// git-ignored. PATCHCASTER_DIR points at a checkout of that repository
// (default: a sibling ../patchcaster directory).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

const repositoryBlobUrl = 'https://github.com/patchcaster-app/patchcaster/blob/main';
const sourceRoot = path.resolve(process.env.PATCHCASTER_DIR ?? '../patchcaster');
const outputRoot = path.resolve('content/docs');

// Site pages in sidebar order. `source` is a path inside the patchcaster
// repository; `slug` is the page's path below /docs ('' is the docs index).
const pages = [
  { source: 'README.md', slug: '', title: 'Overview', bodyStartsAfter: '</div>' },
  { source: 'docs/install.md', slug: 'install' },
  { source: 'docs/configuration.md', slug: 'configuration' },
  { source: 'docs/integrations/gitlab.md', slug: 'integrations/gitlab' },
  { source: 'docs/integrations/mattermost.md', slug: 'integrations/mattermost' },
  { source: 'docs/operations.md', slug: 'operations' },
  { source: 'CHANGELOG.md', slug: 'changelog' },
];

const folderTitles = { integrations: 'Integrations' };

const slugBySource = new Map(pages.map((page) => [page.source, page.slug]));

function sitePath(slug) {
  return slug === '' ? '/docs' : `/docs/${slug}`;
}

function splitTitle(markdown) {
  const match = markdown.match(/^# (.+)\n+/);
  if (!match) return { title: undefined, body: markdown };
  return { title: match[1].trim(), body: markdown.slice(match[0].length) };
}

function plainText(markdown) {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstParagraph(body) {
  return body.trim().split(/\n\s*\n/)[0];
}

// Rewrites a relative link found in `source`. Links to pages on this site
// become site paths; links to any other file in the repository go to GitHub.
function rewriteLink(target, source) {
  const isExternal = /^[a-z][a-z0-9+.-]*:/i.test(target);
  if (isExternal || target.startsWith('#')) return target;

  const [pathPart, fragment] = target.split('#');
  const repositoryPath = path.posix.normalize(path.posix.join(path.posix.dirname(source), pathPart));
  if (repositoryPath.startsWith('..')) {
    throw new Error(`${source}: link ${target} leaves the repository`);
  }

  const suffix = fragment ? `#${fragment}` : '';
  if (slugBySource.has(repositoryPath)) {
    return sitePath(slugBySource.get(repositoryPath)) + suffix;
  }
  const kind = pathPart.endsWith('/') ? 'tree' : 'blob';
  return `${repositoryBlobUrl.replace('/blob/', `/${kind}/`)}/${repositoryPath}${suffix}`;
}

// Applies rewriteLink to every inline link outside fenced code blocks.
function rewriteLinks(body, source) {
  let inFence = false;
  return body
    .split('\n')
    .map((line) => {
      if (line.trimStart().startsWith('```')) inFence = !inFence;
      if (inFence) return line;
      return line.replace(/\]\(([^)\s]+)\)/g, (_, target) => `](${rewriteLink(target, source)})`);
    })
    .join('\n');
}

function frontmatter(fields) {
  const lines = Object.entries(fields).map(([key, value]) => `${key}: ${JSON.stringify(value)}`);
  return `---\n${lines.join('\n')}\n---\n\n`;
}

async function readSource(page) {
  try {
    return await readFile(path.join(sourceRoot, page.source), 'utf8');
  } catch (error) {
    throw new Error(
      `cannot read ${page.source} in ${sourceRoot}; point PATCHCASTER_DIR at a patchcaster checkout`,
      { cause: error },
    );
  }
}

async function convertPage(page) {
  let markdown = await readSource(page);
  if (page.bodyStartsAfter) {
    markdown = markdown.slice(markdown.indexOf(page.bodyStartsAfter) + page.bodyStartsAfter.length);
  }

  const { title, body } = splitTitle(markdown.trimStart());
  const pageTitle = page.title ?? title;
  if (!pageTitle) throw new Error(`${page.source}: no "# Title" line and no configured title`);

  const content = frontmatter({
    title: pageTitle,
    description: plainText(firstParagraph(body)),
    source: page.source,
  }) + rewriteLinks(body.trim(), page.source) + '\n';

  const file = path.join(outputRoot, `${page.slug || 'index'}.md`);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}

// Writes meta.json files so the sidebar follows the order of `pages`.
async function writeMeta() {
  const children = new Map([['', []]]);
  for (const { slug } of pages) {
    const segments = slug === '' ? ['index'] : slug.split('/');
    for (let depth = 0; depth < segments.length; depth++) {
      const folder = segments.slice(0, depth).join('/');
      const entries = children.get(folder) ?? [];
      if (!entries.includes(segments[depth])) entries.push(segments[depth]);
      children.set(folder, entries);
    }
  }

  for (const [folder, entries] of children) {
    const meta = folder === '' ? { pages: entries } : { title: folderTitles[folder], pages: entries };
    await writeFile(path.join(outputRoot, folder, 'meta.json'), JSON.stringify(meta, null, 2) + '\n');
  }
}

await rm(outputRoot, { recursive: true, force: true });
for (const page of pages) await convertPage(page);
await writeMeta();
console.log(`synced ${pages.length} pages from ${sourceRoot}`);
