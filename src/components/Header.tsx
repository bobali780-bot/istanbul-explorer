import Link from 'next/link'

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Transparent header; no grey banner */}
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4">
        {/* Brand (top-left) */}
        <Link href="/" className="font-extrabold tracking-tight text-white">
          Love Istanbul
        </Link>

        {/* Centered nav */}
        <nav aria-label="Primary" className="hidden justify-self-center gap-7 md:flex">
          {[
            ['Home', '#'],
            ['About Us', '#'],
            ['Explore', '#'],
            ['Blog', '/blog'],
            ['Insider Weekly', '#'],
            ['Contact', '#'],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="font-semibold text-white hover:text-white/90"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* CTA (right) */}
        <div className="justify-self-end">
          <button className="rounded-pill bg-brand px-4 py-2 font-bold text-white shadow-soft hover:bg-brand-700">
            Book now
          </button>
        </div>
      </div>
    </header>
  )
}