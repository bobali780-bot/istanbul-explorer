import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-white mb-4 block">
              Love Istanbul
            </Link>
            <p className="text-slate-300 mb-6 max-w-md">
              Your ultimate guide to Istanbul's best places to visit, eat, shop, and stay. 
              Discover hidden gems and local favorites.
            </p>
            <div className="flex gap-4">
              <button className="rounded-full bg-purple-600 px-6 py-3 font-bold text-white shadow-sm hover:bg-purple-700 transition-all duration-300">
                Book now
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Explore</h3>
            <nav className="space-y-3">
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
                  className="block text-slate-300 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
            <nav className="space-y-3">
              {[
                ['Activities', '/activities'],
                ['Hotels', '/hotels'],
                ['Food & Drink', '/food-drink'],
                ['Shopping', '/shopping'],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="block text-slate-300 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">
              © 2024 Love Istanbul. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}