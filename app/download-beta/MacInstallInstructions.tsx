'use client';

import React, { useState } from 'react';
import { FaApple, FaChevronDown } from 'react-icons/fa';

/**
 * Install instructions for macOS users.
 *
 * CortexIDE ships ad-hoc-signed (but not Apple-notarized) macOS builds because
 * the project does not maintain a paid Apple Developer Program membership. On
 * first launch macOS will show a Gatekeeper "cannot be opened because the
 * developer cannot be verified" prompt. This component documents the two ways
 * to get past it.
 *
 * Kept intentionally short — collapsible by default so the download buttons
 * stay the primary focus of the page.
 */
const MacInstallInstructions = () => {
    const [open, setOpen] = useState(false);

    return (
        <section
            aria-label='Installing CortexIDE on macOS'
            className='mt-10 rounded-2xl border border-white/10 bg-black/40 text-white shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl'
        >
            <button
                type='button'
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-controls='mac-install-details'
                className='flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left transition hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/40'
            >
                <span className='flex items-center gap-3'>
                    <span className='flex h-10 w-10 items-center justify-center rounded-xl bg-white/10'>
                        <FaApple className='h-5 w-5' aria-hidden='true' />
                    </span>
                    <span className='flex flex-col'>
                        <span className='text-base font-semibold'>
                            Installing on macOS
                        </span>
                        <span className='text-sm text-white/60'>
                            macOS will warn you the developer can&apos;t be verified. Here&apos;s how to open it anyway.
                        </span>
                    </span>
                </span>
                <FaChevronDown
                    className={`h-4 w-4 text-white/60 transition-transform ${open ? 'rotate-180' : ''}`}
                    aria-hidden='true'
                />
            </button>

            {open && (
                <div
                    id='mac-install-details'
                    className='space-y-5 border-t border-white/10 px-6 py-6 text-sm leading-relaxed text-white/80'
                >
                    <p>
                        CortexIDE is open-source and we don&apos;t pay Apple&apos;s yearly fee for notarization,
                        so macOS shows the &ldquo;cannot be opened because the developer cannot be verified&rdquo;
                        prompt the first time you launch it. The bundle is still ad-hoc code-signed so it
                        runs on Apple Silicon — you just need to confirm it once. This is the same approach
                        used by VSCodium, MacVim, and most open-source Mac apps.
                    </p>

                    <div className='rounded-xl border border-white/10 bg-white/[0.04] p-5'>
                        <h3 className='mb-2 text-sm font-semibold text-white'>
                            Option 1 &middot; Right-click to open (recommended)
                        </h3>
                        <ol className='list-decimal space-y-1 pl-5 text-white/75'>
                            <li>Drag <code className='rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]'>CortexIDE.app</code> from the mounted DMG into <code className='rounded bg-white/10 px-1.5 py-0.5 font-mono text-[12px]'>/Applications</code>.</li>
                            <li>In Finder, right-click (or Control-click) the app and choose <strong>Open</strong>.</li>
                            <li>Click <strong>Open</strong> again in the warning dialog. macOS remembers your choice and won&apos;t ask again.</li>
                        </ol>
                    </div>

                    <div className='rounded-xl border border-white/10 bg-white/[0.04] p-5'>
                        <h3 className='mb-2 text-sm font-semibold text-white'>
                            Option 2 &middot; Terminal
                        </h3>
                        <p className='mb-3 text-white/75'>
                            If you&apos;d rather skip the right-click dance, strip the quarantine attribute
                            once and the app will open with a double-click from then on:
                        </p>
                        <pre className='overflow-x-auto rounded-lg border border-white/10 bg-black/60 p-3 font-mono text-[13px] text-white/90'>
                            <code>xattr -cr /Applications/CortexIDE.app</code>
                        </pre>
                    </div>

                    <p className='text-xs text-white/55'>
                        Want to verify the build yourself? The <a className='underline hover:text-white' href='https://github.com/OpenCortexIDE/cortexide-builder' target='_blank' rel='noreferrer noopener'>build pipeline</a> is fully public and every release ships SHA-256 checksums alongside the artifact.
                    </p>
                </div>
            )}
        </section>
    );
};

export default MacInstallInstructions;
