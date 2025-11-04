/* eslint-disable @next/next/no-img-element */

import React from 'react';
import { binariesLink, discordLink, githubLink, releaseLink } from '@/components/links';
import DownloadBetaClient from './DownloadBetaClient';

// Add this top-level cache (outside the function)
let cachedVersion: string | null = null;
let lastChecked: number = 0; // epoch ms
const TTL = 15 * 60 * 1000; // 15 minutes

// All required asset filenames (can be regex or exact)
const REQUIRED_ASSETS = [
    (v: string) => `VoidSetup-x64-${v}.exe`,
    (v: string) => `VoidSetup-arm64-${v}.exe`,
    (v: string) => `Void.x64.${v}.dmg`,
    (v: string) => `Void.arm64.${v}.dmg`,
    // (v: string) => `Void-${v}.glibc2.29-x86_64.AppImage`,
];

// Server-side helper
async function getLatestReleaseVersion(): Promise<string> {
    const now = Date.now();
    if (cachedVersion && now - lastChecked < TTL) {
        return cachedVersion;
    }

    try {
        const response = await fetch('https://api.github.com/repos/OpenCortexIDE/binaries/releases/latest', {
            next: { revalidate: TTL / 1000 },
        });

        if (response.ok) {
            const data = await response.json();
            const version = data.tag_name;
            const assetNames: string[] = data.assets.map((a: any) => a.name);

            const allAssetsExist = REQUIRED_ASSETS.every((makeName) =>
                assetNames.includes(makeName(version))
            );

            if (allAssetsExist) {
                cachedVersion = version;
                lastChecked = now;
                return version;
            } else {
                console.warn('Some expected assets are missing in latest release');
            }
        }
    } catch (e) {
        console.error('Failed to fetch latest release:', e);
    }

    return cachedVersion ?? '1.99.30023';
}

export default async function DownloadBetaPage() {
    const releaseVersion = await getLatestReleaseVersion();

    return <DownloadBetaClient releaseVersion={releaseVersion} />;
}
