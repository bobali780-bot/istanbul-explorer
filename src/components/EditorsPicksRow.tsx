'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { CategoryTile } from './CategoryTile'
import { useState, useRef } from 'react'

interface EditorsPick {
  id: string
  title: string
  description?: string
  image?: string
  rating?: number
  reviewCount?: number
  location?: string
  neighborhood?: string
  price?: string
  duration?: string
  category: string
  slug: string
}

interface EditorsPicksRowProps {
  picks: EditorsPick[]
  title?: string
  subtitle?: string
  onFavoriteToggle?: (id: string) => void
  favorites?: Set<string>
}

export function EditorsPicksRow({
  picks,
  title = "Editor's Picks",
  subtitle = "Handpicked highlights in this category",
  onFavoriteToggle,
  favorites = new Set()
}: EditorsPicksRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return
    
    const scrollAmount = 360 // Width of tile + gap
    const currentScroll = scrollContainerRef.current.scrollLeft
    const newScroll = direction === 'left' 
      ? currentScroll - scrollAmount 
      : currentScroll + scrollAmount
    
    scrollContainerRef.current.scrollTo({
      left: newScroll,
      behavior: 'smooth'
    })
  }

  if (picks.length === 0) return null

  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-5">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>

        {/* Scrollable Tiles */}
        <div className="relative">
          {/* Left Arrow */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-6 w-6 text-slate-700" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all duration-200 hover:bg-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-6 w-6 text-slate-700" />
          </button>

          {/* Tiles Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {picks.map((pick, index) => (
              <CategoryTile
                key={pick.id}
                {...pick}
                isEditorPick={true}
                isFavorite={favorites.has(pick.id)}
                onFavoriteToggle={onFavoriteToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

