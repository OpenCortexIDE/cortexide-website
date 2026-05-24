/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { binariesLink, discordLink, githubLink, releaseLink } from '@/components/links';
import DownloadBetaClient from './DownloadBetaClient';
import { getLatestRelease } from './lib/releases';
import { baseUrl } from '../sitemap';

const downloadOgImage = `${baseUrl}/og?title=${encodeURIComponent('Download CortexIDE')}&description=${encodeURIComponent('Open source AI code editor for Windows, macOS, and Linux.')}`

export const metadata = {
  title: 'Download',
  description: 'Download CortexIDE, the open source AI code editor for Windows, macOS, and Linux. Local-first, privacy-respecting, zero subscription.',
  alternates: {
    canonical: `${baseUrl}/download-beta`,
  },
  openGraph: {
    siteName: 'CortexIDE',
    title: 'Download CortexIDE',
    description: 'Open source AI code editor for Windows, macOS, and Linux. Local-first, privacy-respecting, zero subscription.',
    type: 'website',
    url: `${baseUrl}/download-beta`,
    images: [{ url: downloadOgImage, width: 1200, height: 630, alt: 'Download CortexIDE' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Download CortexIDE',
    description: 'Open source AI code editor for Windows, macOS, and Linux.',
    images: [downloadOgImage],
  },
};

// Disable Next.js caching for this page to always fetch fresh release data
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DownloadBetaPage() {
    const { version, links } = await getLatestRelease(true); // Force refresh

    return <DownloadBetaClient releaseVersion={version} links={links} />;
}
