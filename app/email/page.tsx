

import { SignUp } from "../../components/landingpage/SignUp";
import { baseUrl } from "../sitemap";

export const metadata = {
    title: 'Get Access - CortexIDE',
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
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Get Access - CortexIDE',
        description: 'Join the CortexIDE waitlist and get early access.',
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

