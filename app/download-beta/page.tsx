/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { binariesLink, discordLink, githubLink, releaseLink } from '@/components/links';
import DownloadBetaClient from './DownloadBetaClient';
import { getLatestRelease } from './lib/releases';

export default async function DownloadBetaPage() {
    const { version, links } = await getLatestRelease();

    return <DownloadBetaClient releaseVersion={version} links={links} />;
}
