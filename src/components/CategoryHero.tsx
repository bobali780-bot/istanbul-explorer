'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CategoryHeroProps {
  title: string
  subheading: string
  heroImage?: string
  averageRating: number
  topNeighborhoods: string[]
  isTrending?: boolean
  activityCount: number
}

export function CategoryHero({
  title,
  subheading,
  heroImage = '/Hero - Activites.jpg',
  averageRating,
  topNeighborhoods,
  isTrending = false,
  activityCount
}: CategoryHeroProps) {
  const [scrollY, setScrollY] = useState(0)
  
  // Debug: Log the hero image path
  console.log('Hero image path:', heroImage)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative h-[75vh] w-full overflow-hidden">
      {/* Hero Background with Parallax */}
      <div 
        className="absolute inset-0 transition-transform duration-75 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.5}px) scale(1.05)`
        }}
      >
        {/* ⚡ Performance Optimization: Hero image with optimized quality and sizes */}
        <Image
          src={heroImage}
          alt="Hero background"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
          priority
        />
      </div>
      
      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="mx-auto max-w-6xl px-6 text-center text-white">
          {/* Title */}
          <h1 className="mx-auto mb-4 max-w-[22ch] text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>
          
          {/* Subheading */}
          <p className="mx-auto max-w-[62ch] text-base font-medium opacity-95 sm:text-lg mb-8">
            {subheading}
          </p>
          
          {/* Meta Chips */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {/* Average Rating */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-yellow-400">★</span>
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm opacity-80">avg rating</span>
            </div>
            
            {/* Top Neighborhoods */}
            {topNeighborhoods.length > 0 && (
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <span className="text-sm opacity-80">Top areas:</span>
                <span className="font-semibold">{topNeighborhoods.slice(0, 2).join(', ')}</span>
              </div>
            )}
            
            {/* Activity Count */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="font-semibold">{activityCount}</span>
              <span className="text-sm opacity-80">experiences</span>
            </div>
            
            {/* Trending Badge */}
            {isTrending && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-full px-4 py-2 border border-amber-400/30">
                <span className="text-amber-300">🔥</span>
                <span className="font-semibold text-amber-200">Trending</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  )
}