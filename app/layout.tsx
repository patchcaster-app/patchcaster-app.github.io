import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Analytics } from '@/components/analytics';
import { Provider } from '@/components/provider';
import { appName, tagline } from '@/lib/shared';
import './global.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  // The Pages workflow passes the deployed URL; local builds use localhost.
  metadataBase: new URL(process.env.PAGES_BASE_URL ?? 'http://localhost:3000'),
  title: {
    default: `${appName}: GitLab merge requests as live Mattermost threads`,
    template: `%s | ${appName}`,
  },
  description: tagline,
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <Provider>{children}</Provider>
        <Analytics />
      </body>
    </html>
  );
}
