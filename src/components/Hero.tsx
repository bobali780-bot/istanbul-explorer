'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Ticket, BedDouble, UtensilsCrossed, ShoppingBag, Landmark, Ship, Store, Search, X } from 'lucide-react'

export function Hero() {
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  return (
    // FULL-BLEED HERO — covers the full top viewport
    <section aria-label="Galata Tower and Istanbul skyline at golden hour" className="absolute top-0 left-0 right-0 min-h-[100svh] w-full text-white">
      {/* Full-bleed background image + overlay */}
      <Image
        src="/istanbul-hero.jpg"
        alt="Istanbul skyline"
        fill
        quality={90}
        priority
        className="object-cover z-0"
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

        {/* Frosted Glass Search Bar */}
        <div className="mt-7 flex w-full justify-center px-2 sm:px-0">
          <div
            role="group"
            aria-label={isSearchMode ? "Search" : "Browse categories"}
            className="relative flex w-full max-w-[70rem] items-center gap-3 rounded-full border border-white/20 bg-white/12 p-2 text-slate-900 shadow-[0_20px_40px_rgba(2,6,23,0.2)] backdrop-blur-lg transition-all duration-500 ease-out overflow-hidden"
          >
            {/* Frosted glass inner gradient */}
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-white/10 via-white/5 to-white/10" />
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/8 to-transparent" />
            
            {/* Categories Grid - slides out to the left when searching */}
            <div className={`grid flex-1 grid-cols-4 gap-2 transition-all duration-500 ease-out ${
              isSearchMode 
                ? 'transform -translate-x-full opacity-0 pointer-events-none' 
                : 'transform translate-x-0 opacity-100'
            }`}>
              <CategoryButton href="/activities" label="Activities" icon={<Ticket className="h-5 w-5" />} />
              <CategoryButton href="/hotels" label="Hotel" icon={<BedDouble className="h-5 w-5" />} />
              <CategoryButton href="/food-drink" label="Food &amp; Drink" icon={<UtensilsCrossed className="h-5 w-5" />} />
              <CategoryButton href="/shopping" label="Shopping" icon={<ShoppingBag className="h-5 w-5" />} />
            </div>

            {/* Search Input - slides in from the right when searching */}
            <div className={`absolute left-2 right-20 transition-all duration-500 ease-out ${
              isSearchMode 
                ? 'transform translate-x-0 opacity-100' 
                : 'transform translate-x-full opacity-0 pointer-events-none'
            }`}>
              <input
                type="text"
                placeholder="Search places, activities, hotels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-white/20 bg-white/10 px-6 py-3 text-white placeholder-white/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-white/30"
                autoFocus={isSearchMode}
              />
            </div>

            {/* Search/Close Button */}
            <button
              onClick={() => {
                setIsSearchMode(!isSearchMode)
                if (isSearchMode) {
                  setSearchQuery('')
                }
              }}
              aria-label={isSearchMode ? "Close search" : "Search"}
              className="relative ml-1 grid h-14 w-14 place-items-center rounded-full bg-white/90 px-4 py-2 font-bold text-slate-900 shadow-[0_20px_40px_rgba(2,6,23,0.2)] backdrop-blur-md transition-all duration-300 hover:bg-white hover:scale-105"
            >
              {isSearchMode ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
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
      className="relative flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      {/* Frosted glass inner highlight */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent" />
      <span className="relative text-white/90">{icon}</span>
      <span className="relative truncate">{label}</span>
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