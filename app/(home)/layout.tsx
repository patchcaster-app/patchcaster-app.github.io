import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '@/lib/layout.shared';

// The landing page's header links; inside the docs the sidebar covers them.
const links = [
  { text: 'Docs', url: '/docs', active: 'nested-url' as const },
  { text: 'Changelog', url: '/docs/changelog' },
];

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <HomeLayout {...baseOptions()} links={links}>
      {children}
    </HomeLayout>
  );
}
