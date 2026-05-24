import Link from "next/link";
// Replaced img with next/image and added alt for better performance and accessibility
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className='min-h-screen flex flex-col justify-center items-center bg-black text-white'>
        {/* Using next/image with explicit alt for optimized loading and accessibility */}
        <Image src="/cortexide-main.png" alt="CortexIDE logo" width={40} height={44} className="bg-transparent" />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter text-white">
        404 - Page Not Found
      </h1>
      <p className="mb-4 text-white">
        {`Apologies - we couldn't find that page. `}
        Go back to the {' '}<Link href='/' className='underline text-white'>
          homepage
        </Link>, the {' '}<Link href='/blog' className='underline text-white'>
          blog
        </Link>, or the {' '}<Link href='/download-beta' className='underline text-white'>
          download page
        </Link>.
      </p>
    </main>
  )
}