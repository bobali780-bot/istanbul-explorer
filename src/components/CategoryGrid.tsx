'use client'
import Link from 'next/link'
import { BedDouble, ShoppingBag, Ticket, UtensilsCrossed, Heart, Lightbulb, MapPin, Sparkles } from 'lucide-react'

type Cat = {
  key: 'activities' | 'fooddrink' | 'hotel' | 'shopping'
  title: string
  tagline: string
  href: string
  img: string
  accent: string
  icon: React.ComponentType<{ className?: string }>
}

const CATS: Cat[] = [
  {
    key: 'activities',
    title: 'Activities',
    tagline: 'Cruises, culture & hidden corners',
    href: '/activities',
    img: '/Activities.jpg',
    accent: '#0ea5e9', // sky
    icon: Ticket,
  },
  {
    key: 'fooddrink',
    title: 'Food & Drink',
    tagline: 'Meze, kebabs & sunset bars',
    href: '/food-drink',
    img: '/Food & Drink.jpg',
    accent: '#f59e0b', // saffron
    icon: UtensilsCrossed,
  },
  {
    key: 'hotel',
    title: 'Hotels',
    tagline: 'Boutique stays & Bosphorus views',
    href: '/hotels',
    img: '/Hotel.jpg',
    accent: '#6366f1', // indigo
    icon: BedDouble,
  },
  {
    key: 'shopping',
    title: 'Shopping',
    tagline: 'Bazaars, boutiques & design finds',
    href: '/shopping',
    img: '/Shopping.jpg',
    accent: '#ec4899', // rose
    icon: ShoppingBag,
  },
]

export function CategoryGrid() {
  return (
    <section aria-labelledby="browse-by-category" className="py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mb-6 text-center">
          <h2 id="browse-by-category" className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Browse by Category
          </h2>
          <p className="text-slate-600">Jump straight into what you love</p>
        </div>

        {/* Desktop/Tablet: 2×2 grid */}
        <div className="hidden gap-6 sm:grid sm:grid-cols-2">
          {CATS.map((c) => (
            <CategoryTile key={c.key} cat={c} />
          ))}
        </div>

        {/* Mobile: horizontal scroller */}
        <div className="sm:hidden -mx-5 overflow-x-auto px-5 no-scrollbar">
          <div className="flex snap-x snap-mandatory gap-5">
            {CATS.map((c) => (
              <div key={c.key} className="w-[86vw] max-w-[520px] flex-shrink-0 snap-start">
                <CategoryTile cat={c} />
              </div>
            ))}
          </div>
        </div>

        {/* NEW: Highlights row under the Browse by Category tiles */}
        <HighlightsRow />
      </div>
    </section>
  )
}

function CategoryTile({ cat }: { cat: Cat }) {
  const Icon = cat.icon
  return (
    <Link
      href={cat.href}
      aria-label={`Explore ${cat.title}`}
      className="group relative block overflow-hidden rounded-[28px] shadow-[0_30px_60px_rgba(2,6,23,0.25)] ring-1 ring-black/5 focus-visible:outline-none focus-visible:ring-4"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Aspect wrapper (4:3) */}
      <div className="relative aspect-[4/3]">
        {/* Background image */}
        <img src={cat.img} alt={`${cat.title} — Istanbul`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />

        {/* Readability gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Glass bar */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md transition duration-300 group-hover:bg-white/12">
          <div className="flex items-center gap-3">
            <span
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-slate-800 shadow-inner"
              style={{ boxShadow: 'inset 0 0 0 2px ' + cat.accent + ', inset 0 1px 0 rgba(255,255,255,0.6)' }}
            >
              <Icon className="h-5 w-5" />
            </span>

            <div className="mr-auto">
              <h3 className="text-white text-xl font-extrabold leading-tight">{cat.title}</h3>
              <p className="text-white/85 text-sm">{cat.tagline}</p>
            </div>

            <span className="hidden md:inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_12px_24px_rgba(2,6,23,0.18)] transition group-hover:translate-y-[-2px]">
              Explore
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

type Feature = {
  title: string
  subtitle: string
  icon: React.ComponentType<any>
  accent: string // hex
}

const FEATURES: Feature[] = [
  { title: 'Handpicked Only',   subtitle: 'We feature the good stuff, not everything.', icon: Sparkles,  accent: '#38bdf8' }, // sky-400
  { title: 'Neighborhood Maps', subtitle: 'Find gems near where you stay.',            icon: MapPin,    accent: '#34d399' }, // emerald-400
  { title: 'Save & Plan',       subtitle: 'Heart places and build your shortlist.',    icon: Heart,     accent: '#818cf8' }, // indigo-400
  { title: 'Insider Tips',      subtitle: 'Etiquette, timing, and what to skip.',      icon: Lightbulb, accent: '#fbbf24' }, // amber-400
]

function HighlightsRow() {
  return (
    <section aria-labelledby="browse-highlights" className="mt-10">
      <h3 id="browse-highlights" className="sr-only">Why browse here</h3>

      {/* FROSTED GLASS PILL CONTAINER (stronger blur + inner gradient) */}
      <div
        className="relative overflow-hidden rounded-[28px] border border-white/25
                   bg-white/12 backdrop-blur-2xl
                   shadow-[0_24px_48px_rgba(2,6,23,0.12)] px-6 py-5"
      >
        {/* soft sheen */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] mix-blend-overlay"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,.18), rgba(255,255,255,.06))' }}
        />
        {/* very soft inner top->bottom fade for depth (5–8%) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px]"
          style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,.08), rgba(255,255,255,0))' }}
        />

        <ul className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <FeatureItem key={f.title} feature={f} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function FeatureItem({ feature }: { feature: Feature }) {
  const Icon = feature.icon
  return (
    <li
      className="group relative flex items-center gap-4 rounded-2xl p-3 transition
                 hover:-translate-y-0.5 focus-within:-translate-y-0.5"
    >
      {/* FROSTED ICON BUBBLE (more blur) */}
      <span
        className="relative grid h-16 w-16 flex-none place-items-center rounded-full
                   border border-white/30 bg-white/20 backdrop-blur-2xl ring-1 ring-black/5
                   shadow-[inset_0_1px_0_rgba(255,255,255,.6),0_12px_24px_rgba(2,6,23,.14)]
                   transition-transform duration-300 group-hover:scale-[1.04]"
        aria-hidden="true"
      >
        {/* icon with soft accent tint */}
        <Icon className="h-7 w-7" style={{ color: feature.accent }} />

        {/* subtle static highlight */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(120px 60px at 30% 20%, rgba(255,255,255,.28), transparent 60%)' }}
        />

        {/* SHINE SWEEP (diagonal glint that travels on hover) */}
        <span
          className="pointer-events-none absolute -inset-3 rounded-full rotate-45
                     opacity-0 translate-x-[-32px] translate-y-[-24px]
                     transition duration-700 ease-out
                     group-hover:opacity-100 group-hover:translate-x-[32px] group-hover:translate-y-[24px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent)' }}
        />
      </span>

      {/* TEXT */}
      <div>
        <div className="text-[1.15rem] font-extrabold leading-[1.15] text-slate-900">
          {feature.title}
        </div>
        <div className="text-sm leading-snug text-slate-700">
          {feature.subtitle}
        </div>
      </div>

      {/* STRONGER ACCENT GLOW on hover/focus */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition
                   group-hover:opacity-100 group-focus-within:opacity-100"
        style={{ boxShadow: `0 0 0 3px ${feature.accent}55, 0 10px 24px ${feature.accent}33` }} /* wider + brighter */
      />
    </li>
  )
}
