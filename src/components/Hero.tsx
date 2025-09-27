'use client'
import Link from 'next/link'
import { Ticket, BedDouble, UtensilsCrossed, ShoppingBag, Landmark, Ship, Store } from 'lucide-react'

export function Hero() {
  return (
    // FULL-BLEED HERO — covers the full top viewport
    <section aria-label="Galata Tower and Istanbul skyline at golden hour" className="relative min-h-[100svh] w-screen text-white">
      {/* Full-bleed background image + overlay */}
      <img 
        src="/istanbul-hero.jpg" 
        alt="Istanbul skyline" 
        className="absolute inset-0 h-full w-full object-cover z-0"
        onError={(e) => {
          console.error('Image failed to load:', e.target.src);
          e.target.style.display = 'none';
        }}
        onLoad={() => console.log('Background image loaded successfully')}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5),rgba(0,0,0,0.35))] z-20" />

      {/* Centered content */}
      <div className="relative z-30 mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center justify-center px-4 text-center">
        <h1 className="mx-auto mb-4 max-w-[22ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Istanbul Travel Guide: Best Things To Do, Eat, Shop & Stay
        </h1>
        <p className="mx-auto max-w-[62ch] text-base font-medium opacity-95 sm:text-lg">
          Plan your perfect Istanbul trip with handpicked activities, hotels, food & drink, and shopping—everything in one place.
        </p>

        {/* Category pill bar (even spacing) */}
        <div className="mt-7 flex w-full justify-center px-2 sm:px-0">
          <div
            role="group"
            aria-label="Browse categories"
            className="flex w-full max-w-[70rem] items-center gap-3 rounded-full bg-white/90 p-2 text-slate-900 shadow-[0_20px_40px_rgba(2,6,23,0.2)] backdrop-blur"
          >
            {/* 4 equal columns so items are evenly spaced */}
            <div className="grid flex-1 grid-cols-4 gap-2">
              <CategoryButton href="/category/activities" label="Activities" icon={<Ticket className="h-5 w-5" />} />
              <CategoryButton href="/category/hotel" label="Hotel" icon={<BedDouble className="h-5 w-5" />} />
              <CategoryButton href="/category/food-and-drink" label="Food &amp; Drink" icon={<UtensilsCrossed className="h-5 w-5" />} />
              <CategoryButton href="/category/shopping" label="Shopping" icon={<ShoppingBag className="h-5 w-5" />} />
            </div>

            <button
              aria-label="Search"
              className="ml-1 grid h-14 w-14 place-items-center rounded-full bg-brand px-4 py-2 font-bold text-white shadow-[0_20px_40px_rgba(2,6,23,0.2)] hover:bg-brand-700"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Why Istanbul strip at the bottom of the viewport */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid items-center gap-4 text-white sm:grid-cols-2 lg:grid-cols-4">
              <WhyItem icon={Landmark} title="Timeless Heritage" desc="Mosques, palaces & museums" />
              <WhyItem icon={Ship} title="Bosphorus Views" desc="Sunset ferries & skyline" />
              <WhyItem icon={UtensilsCrossed} title="World‑Class Cuisine" desc="From meze to street eats" />
              <WhyItem icon={Store} title="Vibrant Bazaars" desc="Grand Bazaar & local markets" />
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

function CategoryButton({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-900/10 bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e9b47]/60"
    >
      <span className="text-slate-500">{icon}</span>
      <span className="truncate">{label}</span>
    </Link>
  )
}

function WhyItem({ icon: Icon, title, desc }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string }) {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="rounded-full bg-white/90 p-2 text-slate-700 shadow-[0_20px_40px_rgba(2,6,23,0.2)] backdrop-blur">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-left drop-shadow-sm">
        <div className="text-base font-extrabold sm:text-lg">{title}</div>
        <div className="text-xs opacity-95 sm:text-sm">{desc}</div>
      </div>
    </div>
  )
}