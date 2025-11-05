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

type DownloadLinks = {
    windows: { x64: string; arm: string };
    mac: { intel: string; appleSilicon: string };
    linux: { x64: string };
};

// Server-side helper
async function getLatestRelease(): Promise<{ version: string; links: DownloadLinks }> {
    const now = Date.now();
    if (cachedVersion && now - lastChecked < TTL) {
        // When cachedVersion is hot but we don't cache links, reconstruct default links (fallback)
        const version = cachedVersion;
        return {
            version,
            links: {
                windows: {
                    x64: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-x64-${version}.exe`,
                    arm: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-arm64-${version}.exe`,
                },
                mac: {
                    intel: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.x64.${version}.dmg`,
                    appleSilicon: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.arm64.${version}.dmg`,
                },
                linux: {
                    x64: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void-${version}.glibc2.29-x86_64.AppImage`,
                },
            },
        };
    }

    try {
        const response = await fetch('https://api.github.com/repos/OpenCortexIDE/binaries/releases/latest', {
            next: { revalidate: TTL / 1000 },
        });

        if (response.ok) {
            const data = await response.json();
            const version = data.tag_name as string;
            const assets: Array<{ name: string; browser_download_url: string }> = data.assets;
            const assetNames: string[] = assets.map((a: any) => a.name);

            const allAssetsExist = REQUIRED_ASSETS.every((makeName) =>
                assetNames.includes(makeName(version))
            );

            // Build links from assets first; this is resilient to name changes
            const pick = (regex: RegExp): string | undefined => {
                const found = assets.find(a => regex.test(a.name));
                return found?.browser_download_url;
            };

            const links: DownloadLinks = {
                windows: {
                    x64: pick(/^VoidSetup-x64-.*\.exe$/i) ?? `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-x64-${version}.exe`,
                    arm: pick(/^VoidSetup-arm64-.*\.exe$/i) ?? `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-arm64-${version}.exe`,
                },
                mac: {
                    intel: pick(/^Void\.x64\..*\.dmg$/i) ?? pick(/darwin-x64.*\.dmg$/i) ?? `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.x64.${version}.dmg`,
                    appleSilicon: pick(/^Void\.arm64\..*\.dmg$/i) ?? pick(/darwin-arm64.*\.dmg$/i) ?? `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.arm64.${version}.dmg`,
                },
                linux: {
                    x64: pick(/^Void-.*glibc2\.29-x86_64\.AppImage$/i) ?? `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void-${version}.glibc2.29-x86_64.AppImage`,
                },
            };

            cachedVersion = version;
            lastChecked = now;
            return { version, links };
        }
    } catch (e) {
        console.error('Failed to fetch latest release:', e);
    }

    const version = cachedVersion ?? '1.99.30023';
    return {
        version,
        links: {
            windows: {
                x64: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-x64-${version}.exe`,
                arm: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/VoidSetup-arm64-${version}.exe`,
            },
            mac: {
                intel: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.x64.${version}.dmg`,
                appleSilicon: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void.arm64.${version}.dmg`,
            },
            linux: {
                x64: `https://github.com/OpenCortexIDE/binaries/releases/download/${version}/Void-${version}.glibc2.29-x86_64.AppImage`,
            },
        },
    };
}

export default async function DownloadBetaPage() {
    const { version, links } = await getLatestRelease();

    return <DownloadBetaClient releaseVersion={version} links={links} />;
}
