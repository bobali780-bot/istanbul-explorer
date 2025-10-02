'use client'

import { useState } from 'react'
import { Heart, Star } from 'lucide-react'
import Link from 'next/link'

interface EditorPickTileProps {
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
  heroImage?: string
  whyVisit?: string
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  colorVariant?: 'blue' | 'green' | 'red' | 'yellow'
}

export function EditorPickTile({
  id,
  title,
  description,
  rating,
  reviewCount,
  location,
  neighborhood,
  price,
  duration,
  category,
  slug,
  heroImage,
  whyVisit,
  isFavorite = false,
  onToggleFavorite,
  colorVariant = 'blue'
}: EditorPickTileProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Define color variants for frosted glass buttons
  const getButtonColors = (variant: 'blue' | 'green' | 'red' | 'yellow') => {
    const variants = {
      blue: {
        bg: 'bg-blue-500/30',
        hover: 'hover:bg-blue-500/40',
        border: 'border-blue-400/40',
        shine: 'via-blue-200/20'
      },
      green: {
        bg: 'bg-emerald-500/30',
        hover: 'hover:bg-emerald-500/40',
        border: 'border-emerald-400/40',
        shine: 'via-emerald-200/20'
      },
      red: {
        bg: 'bg-red-500/30',
        hover: 'hover:bg-red-500/40',
        border: 'border-red-400/40',
        shine: 'via-red-200/20'
      },
      yellow: {
        bg: 'bg-yellow-500/30',
        hover: 'hover:bg-yellow-500/40',
        border: 'border-yellow-400/40',
        shine: 'via-yellow-200/20'
      }
    }
    return variants[variant]
  }

  const buttonColors = getButtonColors(colorVariant)


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
        {/* Editor's Pick Badge - Golden Premium */}
        <div 
          className="absolute top-4 left-4 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-sm border border-yellow-300/30 pointer-events-auto"
          style={{
            transform: isHovered ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 500ms ease-out'
          }}
        >
          ✨ Editor&apos;s Pick
        </div>

        {/* Top Right Controls - Heart and Rating */}
        <div 
          className="absolute top-4 right-4 flex items-center gap-3 pointer-events-auto"
          style={{
            transform: isHovered ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 500ms ease-out'
          }}
        >
          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
            <span className="text-sm font-bold text-slate-900">{rating.toFixed(1)}</span>
          </div>

          {/* Premium Heart Button */}
          {onToggleFavorite && (
            <button
              aria-label={isFavorite ? 'Remove from favourites' : 'Add to favourites'}
              aria-pressed={isFavorite}
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite(id)
              }}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/90 text-slate-800 shadow-lg backdrop-blur-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            >
              <Heart 
                className={`h-5 w-5 transition ${
                  isFavorite ? 'fill-red-500 text-red-500' : ''
                }`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Transforming content layer */}
      <div
        className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.18)]"
        style={{ 
          transformOrigin: 'center center',
          borderRadius: '28px',
          willChange: 'transform',
          transition: 'transform 500ms ease-out, box-shadow 500ms ease-out',
          transform: isHovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0)'
        }}
      >
      <article 
        className="relative h-full w-full rounded-[28px]"
        style={{ borderRadius: '28px' }}
      >
      {/* Premium Background Image */}
      <div className="absolute inset-0 h-full w-full overflow-hidden rounded-[28px]" style={{ borderRadius: '28px' }}>
        {heroImage ? (
          <img
            src={heroImage}
            alt={title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500"
            style={{ 
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              willChange: 'transform'
            }}
          />
        ) : (
          <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 text-sm">Image coming soon</span>
          </div>
        )}
      </div>

      {/* Clean Gradient Overlay - No Blur */}
      <div 
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black/80 via-black/30 via-black/10 to-transparent rounded-b-[28px]"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0) 100%)',
          borderRadius: '0 0 28px 28px'
        }}
      />


      {/* Clean Content Block - Just Name and Location */}
      <div className="absolute inset-x-0 bottom-24 px-6 text-white drop-shadow-lg">
        <h3 className="text-3xl font-extrabold tracking-tight mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-white/90 text-lg font-medium leading-relaxed">
          {neighborhood || location}
        </p>
      </div>

      {/* Premium CTA Button - Colored Frosted Glass Style */}
      <div className="absolute inset-x-0 bottom-5 px-6">
        <Link
          href={`/${category}/${slug}`}
          className={`flex h-14 w-full items-center justify-center rounded-full ${buttonColors.bg} ${buttonColors.hover} backdrop-blur-md border ${buttonColors.border} text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 relative overflow-hidden group/cta`}
        >
          {/* Button Shine Effect */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent ${buttonColors.shine} to-transparent opacity-0 group-hover/cta:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover/cta:translate-x-[-200%] transition-transform duration-700`}></div>
          <span className="relative z-10">Find out more</span>
        </Link>
      </div>

      {/* Hover Shine Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000 pointer-events-none"></div>
      </article>
      </div>
    </div>
  )
}
