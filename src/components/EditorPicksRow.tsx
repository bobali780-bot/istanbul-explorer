'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryTile } from './CategoryTile'

interface EditorPicksRowProps {
  title: string
  subtitle: string
  items: Array<{
    id: string
    title: string
    description: string
    rating: number
    reviewCount: number
    location: string
    neighborhood?: string
    price?: string
    duration?: string
    category: string
    slug: string
    isEditorPick?: boolean
    heroImage?: string
    whyVisit?: string
  }>
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
}

export function EditorPicksRow({
  title,
  subtitle,
  items,
  favorites,
  onToggleFavorite
}: EditorPicksRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320 // Width of one tile + gap
      const currentScroll = scrollRef.current.scrollLeft
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      })
    }
  }

  if (items.length === 0) return null

  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight text-slate-900 mb-4">
            {title}
          </h2>
          <p className="text-base font-medium text-slate-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Scrollable Container */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-white/20 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Scrollable Row */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4 group"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className="flex-none w-80 snap-start"
                style={{
                  animationDelay: `${index * 120}ms`
                }}
              >
                <CategoryTile
                  {...item}
                  isFavorite={favorites.has(item.id)}
                  onToggleFavorite={onToggleFavorite}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: Math.ceil(items.length / 3) }).map((_, index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full bg-slate-300"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
