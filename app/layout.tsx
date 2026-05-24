import GlassProvider from "glass-js";
// import GlassPromptBar from "glass-js-test";
// import GlassPromptBar from "@/_src";

// import { Inter } from "next/font/google";

import "./globals.css";
import { Footer } from "@/components/landingpage/Footer";
import { Header } from "@/components/landingpage/Header";
import { CSPostHogProvider } from '../components/providers'


// const inter = Inter({ subsets: ["latin"] });

import { Metadata } from 'next';
import { baseUrl } from './sitemap';

// Default metadata if a page doesn't specify its own.
// `metadataBase` ensures relative URLs (e.g. canonical, og:url, og:image) resolve correctly.
// `title.template` gives every page a consistent "<Page> – CortexIDE" suffix while keeping
// the literal `title.default` on the root URL.
const defaultOgImage = `${baseUrl}/og?title=${encodeURIComponent('CortexIDE')}&description=${encodeURIComponent('Open source AI code editor. Full privacy. Local-first.')}`;

export const metadata: Metadata = {
    metadataBase: baseUrl ? new URL(baseUrl) : undefined,
    title: {
        default: "CortexIDE - Open Source AI Code Editor",
        template: "%s | CortexIDE",
    },
    description: "CortexIDE is an open source AI code editor. Run agents fully offline with local models, keep your code on your machine, and switch providers without lock-in.",
    applicationName: 'CortexIDE',
    keywords: ['AI code editor', 'open source IDE', 'local LLM', 'Ollama', 'coding agent', 'privacy-first IDE'],
    authors: [{ name: 'CortexIDE Team' }],
    creator: 'CortexIDE',
    publisher: 'CortexIDE',
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
    },
    openGraph: {
        siteName: 'CortexIDE',
        type: 'website',
        locale: 'en_US',
        url: baseUrl || undefined,
        images: [
            {
                url: defaultOgImage,
                width: 1200,
                height: 630,
                alt: 'CortexIDE - Open Source AI Code Editor',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        creator: '@cortexide',
        images: [defaultOgImage],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    formatDetection: {
        telephone: false,
    },
};



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (<>

        <html lang="en" dir="ltr">
            <head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />
                <meta name="theme-color" content="#000000" />
            </head>

            <CSPostHogProvider>
                <body className='text-white bg-black' style={{ background: '#000000' }}>
                    <div className='overflow-hidden rounded-sm'>
                        <GlassProvider>
                            <Header />
                            {children}
                            <Footer />
                        </GlassProvider>
                    </div>
                </body>
            </CSPostHogProvider>
        </html>
    </>
    );
}
