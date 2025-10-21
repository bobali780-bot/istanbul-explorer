'use client'

import { useState } from 'react'
import { Heart, MapPin, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface CategoryTileProps {
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
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
}

export function CategoryTile({
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
  isEditorPick = false,
  heroImage,
  whyVisit,
  isFavorite = false,
  onToggleFavorite
}: CategoryTileProps) {
  const [isHovered, setIsHovered] = useState(false)

  const formatReviewCount = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`
    }
    return count.toString()
  }

  const getPriceDisplay = (price?: string) => {
    if (!price) return 'Price varies'
    if (price.toLowerCase() === 'free') return 'Free'
    
    // Handle long price strings by truncating
    if (price.length > 25) {
      return price.substring(0, 22) + '...'
    }
    return price
  }

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] h-[500px] flex flex-col hover-lift"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {heroImage ? (
          // ⚡ Performance Optimization: Reduced quality for faster loading
          <Image
            src={heroImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={70}
            className={`object-cover transition-transform duration-700 ${
              isHovered ? 'scale-[1.05] brightness-110' : 'scale-100 brightness-100'
            }`}
            priority={false}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 text-sm">Image coming soon</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Editor's Pick Badge */}
        {isEditorPick && (
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    Editor&apos;s Pick
                  </div>
        )}
        
        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault()
              onToggleFavorite(id)
            }}
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorite
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-white/80 text-slate-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart 
              className={`w-4 h-4 transition-all duration-200 ${
                isFavorite ? 'fill-current' : ''
              }`} 
            />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        {/* Title - Fixed height */}
        <h3 className="text-xl font-extrabold leading-tight tracking-tight text-slate-900 mb-2 h-16 flex items-start">
          {title}
        </h3>
        
        {/* Description - Fixed height */}
        <p className="text-slate-600 text-sm mb-3 line-clamp-2 h-10 flex items-start">
          {description}
        </p>
        
        {/* Why Visit (appears on hover) - Fixed height */}
        {whyVisit && isHovered && (
          <p className="text-slate-700 text-sm mb-3 line-clamp-2 h-10 italic">
            {whyVisit}
          </p>
        )}
        
        {/* Rating - Fixed height */}
        <div className="flex items-center gap-1 mb-3 h-5">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold text-slate-900">{rating.toFixed(1)}</span>
          <span className="text-sm text-slate-500">
            ({formatReviewCount(reviewCount)} reviews)
          </span>
        </div>
        
        {/* Location - Fixed height */}
        <div className="flex items-center gap-1 mb-3 h-5">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 truncate">
            {neighborhood || location}
          </span>
        </div>
        
        {/* Meta Info - Fixed height */}
        <div className="flex flex-col gap-3 mb-4 h-16">
          <div className="flex items-center justify-between h-6">
            {/* Price */}
            <div className="text-sm font-semibold text-slate-900 truncate max-w-[60%]">
              {getPriceDisplay(price)}
            </div>
            
            {/* Category Badge */}
            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full capitalize flex-shrink-0">
              {category}
            </span>
          </div>
          
          {/* Duration - Fixed height */}
          {duration && (
            <div className="flex items-center gap-1 text-sm text-slate-600 h-5">
              <Clock className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{duration}</span>
            </div>
          )}
        </div>

        {/* CTA Button - Fixed height */}
        <Link 
          href={`/${category}/${slug}`}
          className="block w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg h-10 flex items-center justify-center mt-auto"
        >
          Find out more
        </Link>
      </div>

    </div>
  )
}