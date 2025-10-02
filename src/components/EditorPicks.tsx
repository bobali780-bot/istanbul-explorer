'use client'
import Link from 'next/link'
import { useState, useRef } from 'react'

export function EditorPicks() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: 'smooth' })
    }
  }
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: 'smooth' })
    }
  }

  const PICKS: PickItem[] = [
    { title: 'Suleymaniye Mosque', subtitle: 'Fatih',         img: '/Hagia Sophia.jpg',       href: '/activities/suleymaniye-mosque' },
    { title: 'Basilica Cistern',   subtitle: 'Sultanahmet',   img: '/basilica cistern.jpg',   href: '/activities/basilica-cistern' },
    { title: 'Zorlu Center',       subtitle: 'Beşiktaş',      img: '/Grand Bazaar.jpg',       href: '/shopping/zorlu-center' },
    { title: 'Pera Museum',        subtitle: 'Beyoğlu',       img: '/Galata Tower.jpg',       href: '/activities/pera-museum' },
    { title: 'Topkapi Palace Museum', subtitle: 'Sultanahmet', img: '/Topkapi Palace.jpg',    href: '/activities/topkapi-palace-museum' },
    { title: 'Istanbul Modern',    subtitle: 'Beyoğlu',       img: '/Blue Mosque.jpg',        href: '/activities/istanbul-modern' },
    { title: 'Galataport Istanbul', subtitle: 'Karaköy',      img: '/spice bazaar.jpg',       href: '/shopping/galataport-istanbul' },
    { title: 'Maiden\'s Tower',    subtitle: 'Üsküdar',       img: '/Maiden tower.jpg',       href: '/activities/maidens-tower' },
    { title: 'Dolmabahçe Palace',  subtitle: 'Beşiktaş',      img: '/Dolmabahce palace.avif', href: '/activities/dolmabahe-palace' },
    { title: 'İstinye Park',       subtitle: 'Sarıyer',       img: '/istiklal avenue.jpg',    href: '/shopping/stinye-park-alveri-merkezi' },
  ]

  return (
    <section aria-labelledby="editors-picks" className="relative mx-auto max-w-[100vw] py-16 overflow-visible" style={{ backgroundColor: 'white' }}>
      <div className="mx-auto max-w-6xl px-5" style={{ backgroundColor: 'white' }}>
        {/* Centered header */}
        <div className="mb-6 text-center">
          <h2 id="editors-picks" className="text-2xl font-extrabold tracking-tight sm:text-3xl">Editor&apos;s Picks</h2>
          <p className="text-slate-600">Handpicked highlights around Istanbul</p>
        </div>
      </div>

      {/* Horizontal scroller with hover arrows */}
      <div ref={scrollContainerRef} className="no-scrollbar group mx-auto max-w-[100vw] overflow-x-auto px-5 pt-2 pb-8" style={{ backgroundColor: 'white', overflowY: 'visible' }}>
        <div className="flex snap-x snap-mandatory py-2" style={{ backgroundColor: 'white' }}>
          {PICKS.map((p, i) => (
            <div key={p.title} className="flex-shrink-0 snap-start" style={{ paddingRight: i === PICKS.length - 1 ? '0' : '24px', backgroundColor: 'white' }}>
              <PickCard item={p} priority={i < 2} />
            </div>
          ))}
        </div>
        
        {/* Clickable arrows */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Scroll left"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white transition-colors">
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </button>
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 focus:outline-none"
          aria-label="Scroll right"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-sm hover:bg-white transition-colors">
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  )
}

interface PickItem {
  title: string
  subtitle: string
  img: string
  href: string
}

function PickCard({ item, priority }: { item: PickItem; priority?: boolean }) {
  const [liked, setLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div 
      className="relative h-[520px] w-[340px] group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Moving badges layer - follows transform but maintains size */}
      <div 
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)',
          transition: 'transform 500ms ease-out'
        }}
      >
        {/* Heart Button - positioned to match activities page */}
        <button
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={liked}
          onClick={() => setLiked(v => !v)}
          className="absolute left-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/80 text-slate-800 shadow-xl backdrop-blur-md transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 pointer-events-auto"
          style={{
            transform: isHovered ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 500ms ease-out'
          }}
        >
          <svg className={"h-5 w-5 transition " + (liked ? 'fill-red-500 text-red-500' : '')} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Transforming content layer */}
      <article 
        className="absolute inset-0 w-full h-full overflow-hidden rounded-[28px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]" 
        style={{ 
          backgroundColor: 'white',
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: 'transform 500ms ease-out, box-shadow 500ms ease-out',
          transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)'
        }}
      >
      {/* Image */}
      <img
        src={item.img}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Bottom gradient with gradual blur starting at 3/4 down */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/80 via-black/30 via-black/10 to-transparent"
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)'
        }}
      />


      {/* Text block */}
      <div className="absolute inset-x-0 bottom-24 px-6 text-white drop-shadow-sm">
        <h3 className="text-3xl font-extrabold tracking-tight">{item.title}</h3>
        <p className="text-white/80">{item.subtitle}</p>
      </div>

      {/* CTA */}
      <div className="absolute inset-x-0 bottom-5 px-6">
        <Link
          href={item.href}
          className="flex h-14 w-full items-center justify-center rounded-full bg-white text-slate-900 font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_14px_30px_rgba(2,6,23,0.25)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_18px_40px_rgba(2,6,23,0.3)] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          Find out more
        </Link>
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
      </article>
    </div>
  )
}
