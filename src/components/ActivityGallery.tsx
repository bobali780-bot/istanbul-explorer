"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import type { ActivityImage } from "@/lib/supabase"

interface ActivityGalleryProps {
  images: ActivityImage[]
  activityName: string
}

export default function ActivityGallery({ images, activityName }: ActivityGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
        <span className="text-gray-500">No images available</span>
      </div>
    )
  }

  const mainImage = images[0]
  const additionalImages = images.slice(1, 4)

  const openLightbox = (index: number) => {
    console.log('🎯 Opening lightbox with image index:', index);
    console.log('🖼️ Image URL:', images[index]?.image_url);
    console.log('📊 Total images:', images.length);
    setCurrentImageIndex(index)
    setImageLoading(true)
    setImageError(false)
    setShowLightbox(true)
  }

  const nextImage = () => {
    setImageLoading(true)
    setImageError(false)
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setImageLoading(true)
    setImageError(false)
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // Keyboard navigation
  useEffect(() => {
    if (!showLightbox) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          setShowLightbox(false)
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [showLightbox, prevImage, nextImage])

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (showLightbox) {
      document.body.style.overflow = 'hidden'
      console.log('🚀 Rendering lightbox with currentImageIndex:', currentImageIndex);
      console.log('🔍 Current image object:', images[currentImageIndex]);
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [showLightbox, currentImageIndex, images])

  return (
    <>
      <div className="space-y-4">
        {/* Main Hero Image - Clickable */}
        <div
          className="relative h-96 w-full overflow-hidden rounded-lg cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={mainImage.image_url}
            alt={mainImage.alt_text || `${activityName} main image`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-80 rounded-full p-2">
              <span className="text-sm font-medium">View Gallery</span>
            </div>
          </div>
        </div>

        {/* Additional Images Grid - All Clickable */}
        {additionalImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {additionalImages.map((image, index) => (
              <div
                key={image.id}
                className="relative h-32 overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(index + 1)}
              >
                <Image
                  src={image.image_url}
                  alt={image.alt_text || `${activityName} image ${index + 2}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  unoptimized
                />
                {/* Show "+X more" overlay on last visible image */}
                {index === 2 && images.length > 4 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      +{images.length - 4} more
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Gallery info */}
        <div className="text-center text-sm text-gray-600">
          Click any image to view full gallery ({images.length} images)
        </div>
      </div>

      {/* Lightbox/Slideshow Modal */}
      {showLightbox && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{ 
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.95)'
          }}
          onClick={(e) => {
            // Close lightbox when clicking on the backdrop
            if (e.target === e.currentTarget) {
              setShowLightbox(false)
            }
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4 max-w-7xl max-h-screen">
            {/* Close button */}
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>

            {/* Next button */}
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>

            {/* Main image */}
            <div className="relative flex items-center justify-center w-full h-full" style={{ minHeight: '400px' }}>
              {/* Debug text - always visible */}
              <div className="absolute top-4 left-4 text-white bg-red-500 px-2 py-1 text-sm z-50">
                DEBUG: Image {currentImageIndex + 1}/{images.length}
              </div>
              
              {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="text-white text-xl bg-black bg-opacity-50 px-4 py-2 rounded">Loading...</div>
                </div>
              )}
              {imageError ? (
                <div className="text-white text-center">
                  <div className="text-xl mb-4">Failed to load image</div>
                  <button 
                    onClick={() => {
                      setImageError(false)
                      setImageLoading(true)
                    }}
                    className="text-blue-400 hover:text-blue-300 underline text-lg"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <img
                  src={images[currentImageIndex].image_url}
                  alt={images[currentImageIndex].alt_text || `${activityName} image ${currentImageIndex + 1}`}
                  style={{
                    maxWidth: '90vw',
                    maxHeight: '80vh',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    margin: 'auto'
                  }}
                  onError={(e) => {
                    console.error('🚨 Lightbox image failed to load:', images[currentImageIndex].image_url);
                    setImageLoading(false)
                    setImageError(true)
                  }}
                  onLoad={() => {
                    console.log('🖼️ Lightbox image loaded successfully:', images[currentImageIndex].image_url);
                    setImageLoading(false)
                  }}
                />
              )}
            </div>

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-50 px-4 py-2 rounded-full">
              {currentImageIndex + 1} / {images.length}
            </div>

            {/* Thumbnail navigation */}
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    index === currentImageIndex ? 'border-white' : 'border-transparent opacity-70'
                  }`}
                >
                  <img
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}