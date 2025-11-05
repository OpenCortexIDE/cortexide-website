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
    // Prefer new CortexIDE names, keep legacy Void for compatibility
    (v: string) => `CortexIDE-Setup-x64-${v}.exe`,
    (v: string) => `CortexIDE-Setup-arm64-${v}.exe`,
    (v: string) => `CortexIDE.x64.${v}.dmg`,
    (v: string) => `CortexIDE.arm64.${v}.dmg`,
    // (v: string) => `CortexIDE-${v}.glibc2.29-x86_64.AppImage`,
    (v: string) => `VoidSetup-x64-${v}.exe`,
    (v: string) => `VoidSetup-arm64-${v}.exe`,
    (v: string) => `Void.x64.${v}.dmg`,
    (v: string) => `Void.arm64.${v}.dmg`,
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
        const normalized = version.startsWith('v') ? version.slice(1) : version;
        return {
            version,
            links: {
                windows: {
                    x64: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-x64-${normalized}.exe`,
                    arm: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-arm64-${normalized}.exe`,
                },
                mac: {
                    intel: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.x64.${normalized}.dmg`,
                    appleSilicon: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.arm64.${normalized}.dmg`,
                },
                linux: {
                    x64: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-${normalized}.glibc2.29-x86_64.AppImage`,
                },
            },
        };
    }

    try {
        const headers: Record<string, string> = {};
        if (process.env.GITHUB_TOKEN) {
            headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
        }
        const response = await fetch('https://api.github.com/repos/OpenCortexIDE/cortexide-binaries/releases/latest', {
            next: { revalidate: TTL / 1000 },
            headers,
        });

        if (response.ok) {
            const data = await response.json();
            const version = data.tag_name as string;
            const normalized = version.startsWith('v') ? version.slice(1) : version;
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
                    x64:
                        // Legacy Void
                        pick(/^VoidSetup-x64-.*\.exe$/i)
                        // CortexIDE Windows x64 installers
                        ?? pick(/^CortexIDE.*x64.*\.exe$/i)
                        // Construct direct link if not found
                        ?? `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-x64-${normalized}.exe`,
                    arm:
                        // Legacy Void
                        pick(/^VoidSetup-arm64-.*\.exe$/i)
                        // CortexIDE Windows arm64 installers
                        ?? pick(/^CortexIDE.*arm64.*\.exe$/i)
                        // Construct direct link if not found
                        ?? `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-arm64-${normalized}.exe`,
                },
                mac: {
                    intel:
                        // Legacy Void
                        pick(/^Void\.x64\..*\.dmg$/i)
                        // New CortexIDE naming
                        ?? pick(/^CortexIDE\.x64\..*\.dmg$/i)
                        // Alt darwin naming
                        ?? pick(/darwin-x64.*\.dmg$/i)
                        // Construct direct link if not found
                        ?? `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.x64.${normalized}.dmg`,
                    appleSilicon:
                        // Legacy Void
                        pick(/^Void\.arm64\..*\.dmg$/i)
                        // New CortexIDE naming
                        ?? pick(/^CortexIDE\.arm64\..*\.dmg$/i)
                        // Alt darwin naming
                        ?? pick(/darwin-arm64.*\.dmg$/i)
                        // Construct direct link if not found
                        ?? `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.arm64.${normalized}.dmg`,
                },
                linux: {
                    x64:
                        // Prefer linux x64 tar.gz if available
                        pick(/^Void-.*linux.*x64.*\.tar\.gz$/i)
                        ?? pick(/^CortexIDE-.*linux.*x64.*\.tar\.gz$/i)
                        // else AppImage
                        ?? pick(/^Void-.*glibc2\.29-x86_64\.AppImage$/i)
                        ?? pick(/^CortexIDE-.*glibc2\.29-x86_64\.AppImage$/i)
                        // Construct direct link if not found
                        ?? `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-${normalized}.glibc2.29-x86_64.AppImage`,
                },
            };

            cachedVersion = version;
            lastChecked = now;
            return { version, links };
        }
    } catch (e) {
        console.error('Failed to fetch latest release:', e);
    }

    // Fallback: read version from cortexide-versions and construct direct URLs
    const candidateVersionFiles = [
        'https://raw.githubusercontent.com/OpenCortexIDE/cortexide-versions/main/latest.txt',
        'https://raw.githubusercontent.com/OpenCortexIDE/cortexide-versions/main/version.txt',
        'https://raw.githubusercontent.com/OpenCortexIDE/cortexide-versions/main/stable.txt',
    ];
    let version = cachedVersion ?? '1.99.30023';
    for (const url of candidateVersionFiles) {
        try {
            const res = await fetch(url, { next: { revalidate: TTL / 1000 } });
            if (res.ok) {
                const text = (await res.text()).trim();
                if (text) {
                    version = text;
                    break;
                }
            }
        } catch {}
    }
    const normalized = version.startsWith('v') ? version.slice(1) : version;
    cachedVersion = version;
    lastChecked = now;
    return {
        version,
        links: {
            windows: {
                x64: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-x64-${normalized}.exe`,
                arm: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-Setup-arm64-${normalized}.exe`,
            },
            mac: {
                intel: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.x64.${normalized}.dmg`,
                appleSilicon: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE.arm64.${normalized}.dmg`,
            },
            linux: {
                x64: `https://github.com/OpenCortexIDE/cortexide-binaries/releases/download/${version}/CortexIDE-${normalized}.glibc2.29-x86_64.AppImage`,
            },
        },
    };
}

export default async function DownloadBetaPage() {
    const { version, links } = await getLatestRelease();

    return <DownloadBetaClient releaseVersion={version} links={links} />;
}
