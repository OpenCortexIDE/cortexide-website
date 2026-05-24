

import { SignUp } from "../../components/landingpage/SignUp";
import { baseUrl } from "../sitemap";

const emailOgImage = `${baseUrl}/og?title=${encodeURIComponent('Get Access')}&description=${encodeURIComponent('Join the CortexIDE waitlist for early access.')}`

export const metadata = {
    title: 'Get Access',
    description: 'Join the CortexIDE waitlist and get early access to the open source AI code editor.',
    alternates: {
        canonical: `${baseUrl}/email`,
    },
    openGraph: {
        siteName: 'CortexIDE',
        title: 'Get Access - CortexIDE',
        description: 'Join the CortexIDE waitlist and get early access.',
        type: 'website',
        url: `${baseUrl}/email`,
        images: [{ url: emailOgImage, width: 1200, height: 630, alt: 'CortexIDE early access' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Get Access - CortexIDE',
        description: 'Join the CortexIDE waitlist and get early access.',
        images: [emailOgImage],
    },
}



export default function Page() {
    return (<>
        <main className='flex items-center justify-center min-h-screen '>
            <SignUp />
        </main>
    </>
    );
};

