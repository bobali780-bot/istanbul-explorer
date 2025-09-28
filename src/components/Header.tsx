import Link from 'next/link'

export function Header() {
  return (
    <header className="relative">
      {/* Completely transparent header */}
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
                 <button className="rounded-full bg-white/90 px-4 py-2 font-bold text-slate-900 shadow-[0_20px_40px_rgba(2,6,23,0.2)] backdrop-blur-md hover:bg-white transition-all duration-300">
            Book now
          </button>
        </div>
      </div>
    </header>
  )
}