import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { source } from '@/lib/source';
import { notFound } from 'next/navigation';
import { generateOGImage } from 'fumadocs-ui/og';
import { appName, getPageImageUrl } from '@/lib/shared';

export const revalidate = false;

// The mascot as a PNG data URL: the image renderer cannot read WebP.
async function mascotDataUrl() {
  const png = await readFile(path.join(process.cwd(), 'app/apple-icon.png'));
  return `data:image/png;base64,${png.toString('base64')}`;
}

// The card fits about three lines: the first sentence, cut at a word if it
// is still too long.
function shortDescription(description = '') {
  const sentence = description.split(/(?<=\.)\s/)[0];
  if (sentence.length <= 140) return sentence;
  return `${sentence.slice(0, 140).replace(/\s+\S*$/, '')}…`;
}

export async function GET(_req: Request, { params }: RouteContext<'/og/docs/[...slug]'>) {
  const { slug } = await params;
  const page = source.getPage(slug.slice(0, -1));
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: shortDescription(page.data.description),
    site: appName,
    icon: <img src={await mascotDataUrl()} width={60} height={60} style={{ borderRadius: 12 }} alt="" />,
    primaryColor: 'rgba(247, 185, 59, 0.35)',
    primaryTextColor: '#f7b93b',
  });
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    lang: page.locale,
    slug: getPageImageUrl(page).segments,
  }));
}
