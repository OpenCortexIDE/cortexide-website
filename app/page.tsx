import LandingPage from "@/components/landingpage/LandingPage";
import { baseUrl } from "./sitemap";

const fullTitle = 'CortexIDE – Open Source AI Code Editor'
const shortTitle = 'CortexIDE'
const description = 'CortexIDE is an open source AI code editor. Run agents fully offline with local models, keep your code on your machine, and switch providers without lock-in.'
const ogImage = `${baseUrl}/og?title=${encodeURIComponent(shortTitle)}&description=${encodeURIComponent('Open source AI code editor')}`


// `title.absolute` opts out of the root template so the homepage stays clean.
export const metadata = {
  title: { absolute: fullTitle },
  description,
  alternates: {
    canonical: `${baseUrl}`,
  },
  openGraph: {
    siteName: 'CortexIDE',
    title: fullTitle,
    description,
    type: 'website',
    url: `${baseUrl}`,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'CortexIDE - Open Source AI Code Editor',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: fullTitle,
    description,
    images: [ogImage],
  },
}





export default function Home() {
  return (
    <main className='min-h-screen'>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: shortTitle,
            description: description,
            applicationCategory: 'DeveloperApplication',
            operatingSystem: 'Windows, macOS, Linux',
            url: baseUrl,
            image: ogImage,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            softwareLicense: 'Apache-2.0',
            isAccessibleForFree: true,
            downloadUrl: `${baseUrl}/download-beta`,
            author: {
              '@type': 'Organization',
              name: 'CortexIDE',
              url: baseUrl
            }
          }),
        }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'CortexIDE',
            url: baseUrl,
            logo: `${baseUrl}/cortexide-main.png`,
            description: description,
            sameAs: [
              'https://github.com/OpenCortexIDE'
            ]
          }),
        }}
      />
      <LandingPage />
    </main>
  );
}
