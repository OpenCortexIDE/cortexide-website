import Link from "next/link";

export default function NotFound() {
  return (
    <section className='min-h-screen flex flex-col justify-center items-center bg-black text-white'>
        <img src='/cortexide-main.png' className='w-10 h-11 bg-transparent' />
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter text-white">
        404 - Page Not Found
      </h1>
      <p className="mb-4 text-white">
        {`Apologies - we couldn't find that page. `}
        Go back to the {' '}<Link href='/' className='underline text-white'>
          homepage
        </Link> or get in touch!
      </p>
    </section>
  )
}