import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaGithub, FaLinux } from 'react-icons/fa';
import { getLatestRelease, LinuxOption } from '../lib/releases';

const parseLinuxOption = (option: LinuxOption) => {
    const formatMatch = option.label.match(/Linux\s+(.*)\s+\(/i);
    const format = formatMatch ? formatMatch[1].trim() : 'Download';
    const archMatch = option.label.match(/\(([^)]+)\)/);
    const architecture = archMatch ? archMatch[1].trim() : 'Unknown';
    return { format, architecture };
};

export default async function LinuxDownloadsPage() {
    const { version, links } = await getLatestRelease();
    const linuxOptions = links.linux;

    return (
        <main className='min-h-screen bg-gradient-to-b from-[#020205] via-[#05050c] to-[#090b13] text-white'>
            <div className='mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-10'>
                <Link
                    href='/download-beta'
                    className='inline-flex items-center gap-2 text-sm font-medium text-white/70 transition hover:text-white'
                >
                    <FaArrowLeft className='h-4 w-4' />
                    Back to downloads
                </Link>

                <section className='mt-8 rounded-3xl border border-white/10 bg-black/50 p-8 shadow-[0_35px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl'>
                    <div className='flex flex-col gap-6'>
                        <div className='flex flex-col gap-4 text-center'>
                            <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white shadow-lg shadow-black/40'>
                                <FaLinux className='h-8 w-8' />
                            </div>
                            <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>
                                Linux downloads · CortexIDE {version}
                            </h1>
                            <p className='text-base text-white/70 sm:text-lg'>
                                Choose the build that matches your architecture and package manager. Every artifact comes directly from
                                the latest GitHub release with published checksums.
                            </p>
                        </div>

                        <div className='flex flex-wrap justify-center gap-3 text-xs font-semibold uppercase tracking-wider text-white/60 sm:text-sm'>
                            <span className='rounded-full border border-white/15 px-4 py-1 bg-white/5'>tar.gz archives</span>
                            <span className='rounded-full border border-white/15 px-4 py-1 bg-white/5'>.deb installers</span>
                            <span className='rounded-full border border-white/15 px-4 py-1 bg-white/5'>AppImage builds</span>
                        </div>
                    </div>

                    <div className='mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-2xl shadow-black/50'>
                        <table className='min-w-full divide-y divide-white/10'>
                            <thead className='bg-white/[0.06] text-left text-[13px] font-semibold uppercase tracking-wide text-white/70'>
                                <tr>
                                    <th scope='col' className='px-6 py-4'>Package</th>
                                    <th scope='col' className='px-6 py-4'>Format</th>
                                    <th scope='col' className='px-6 py-4'>Architecture</th>
                                    <th scope='col' className='px-6 py-4 text-right'>Action</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-white/5 text-sm text-white/90'>
                                {linuxOptions.map((option) => {
                                    const { format, architecture } = parseLinuxOption(option);
                                    return (
                                        <tr key={option.id} className='transition hover:bg-white/[0.06]'>
                                            <td className='px-6 py-4 font-semibold text-white'>{option.label}</td>
                                            <td className='px-6 py-4 text-white/80'>{format}</td>
                                            <td className='px-6 py-4 text-white/80'>{architecture}</td>
                                            <td className='px-6 py-4 text-right'>
                                                <a
                                                    href={option.url}
                                                    className='inline-flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:bg-white'
                                                >
                                                    Download
                                                    <FaLinux className='h-4 w-4' />
                                                </a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className='mt-6 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80 shadow-inner shadow-black/40 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                            <p className='font-semibold text-white'>Need checksums or older versions?</p>
                            <p className='text-white/60'>Visit the release page to inspect every artifact, checksum, and workflow badge.</p>
                        </div>
                        <a
                            href='https://github.com/OpenCortexIDE/cortexide-binaries/releases'
                            target='_blank'
                            rel='noreferrer noopener'
                            className='inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-2 font-semibold text-white transition hover:border-white hover:bg-white/20'
                        >
                            <FaGithub className='h-5 w-5' />
                            View on GitHub
                        </a>
                    </div>
                </section>
            </div>
        </main>
    );
}

