import Script from 'next/script';

// Visit counts and Core Web Vitals from Umami Cloud. The website ID is public:
// it appears in every page that loads the tracker.
const umamiScriptUrl = 'https://cloud.umami.is/script.js';
const umamiWebsiteId = '57b62c9a-fb2b-44b5-b8da-7afdde2f79fc';

// Only the Pages workflow passes the deployed address. Local builds lack it
// and render no tracker; data-domains also keeps any copy of the site from
// reporting.
const siteUrl = process.env.PAGES_BASE_URL;
const siteHost = siteUrl ? new URL(siteUrl).hostname : undefined;

export const analyticsEnabled = siteHost !== undefined;

export function Analytics() {
  if (!analyticsEnabled) return null;

  return (
    <Script
      src={umamiScriptUrl}
      data-website-id={umamiWebsiteId}
      data-performance="true"
      data-domains={siteHost}
      strategy="afterInteractive"
    />
  );
}
