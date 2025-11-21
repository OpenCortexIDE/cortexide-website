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

// Default metadata if a page doesn't specify its own
export const metadata: Metadata = {
    title: "CortexIDE - Open Source AI Code Editor",
    description: "CortexIDE is an open source Cursor alternative. Full privacy. Fully-featured. Write code with the best AI tools, use any model, and retain full control over your data.",
    icons: {
        icon: '/icon.png',
        apple: '/icon.png',
    },
    openGraph: {
        siteName: 'CortexIDE',
        type: 'website',
        locale: 'en_US',
    },
    twitter: {
        card: 'summary_large_image',
    },
};



export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

    return (<>

        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
                />

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
