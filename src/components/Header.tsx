import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      {/* Blurred glass header */}
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4">
        {/* Brand (top-left) */}
        <Link href="/" className="font-extrabold tracking-tight text-gray-900">
          Love Istanbul
        </Link>

        {/* Centered nav */}
        <nav aria-label="Primary" className="hidden justify-self-center gap-7 md:flex">
          {[
            ['Home', '/'],
            ['About Us', '/about'],
            ['Explore', '/explore'],
            ['Insider Weekly', '/insider-weekly'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="font-semibold text-gray-900 hover:text-gray-700"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA (right) */}
        <div className="justify-self-end">
          <button className="rounded-full bg-purple-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-purple-700 transition-all duration-300">
            Book now
          </button>
        </div>
      </div>
    </header>
  )
}