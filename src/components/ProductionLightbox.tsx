"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X, ZoomIn, Download } from "lucide-react"
import type { ActivityImage } from "@/lib/supabase"

interface ProductionLightboxProps {
  images: ActivityImage[]
  activityName: string
}

export default function ProductionLightbox({ images, activityName }: ProductionLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showLightbox, setShowLightbox] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
        <span className="text-gray-500">No images available for {activityName}</span>
      </div>
    )
  }

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setShowLightbox(true)
    setImageLoading(true)
    setImageError(false)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setImageLoading(false)
    setImageError(false)
    document.body.style.overflow = 'unset'
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
    setImageLoading(true)
    setImageError(false)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
    setImageLoading(true)
    setImageError(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  useEffect(() => {
    if (!showLightbox) return

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeLightbox()
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
    return () => {
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [showLightbox])

  const mainImage = images[0]
  const displayImages = images.slice(0, 6) // Show up to 6 images in the grid

  return (
    <>
      {/* Main Gallery Display */}
      <div className="w-full">
        {/* Main Image */}
        <div className="relative mb-4">
          <div 
            className="relative w-full h-96 rounded-xl overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-shadow duration-300"
            onClick={() => openLightbox(0)}
          >
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(mainImage.image_url)}`}
              alt={mainImage.alt_text || `${activityName} main image`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-3">
                <ZoomIn className="w-6 h-6 text-gray-800" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                1 / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {displayImages.slice(1).map((image, index) => (
              <div
                key={image.id}
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-shadow duration-300"
                onClick={() => openLightbox(index + 1)}
              >
                <img
                  src={`/api/proxy-image?url=${encodeURIComponent(image.image_url)}`}
                  alt={image.alt_text || `${activityName} image ${index + 2}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2">
                    <ZoomIn className="w-4 h-4 text-gray-800" />
                  </div>
                </div>
              </div>
            ))}
            
            {images.length > 6 && (
              <div
                className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-shadow duration-300 bg-gray-900 flex items-center justify-center"
                onClick={() => openLightbox(6)}
              >
                <div className="text-white text-center">
                  <span className="text-2xl font-bold">+{images.length - 6}</span>
                  <div className="text-sm">more</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              closeLightbox()
            }
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-60 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all duration-200"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-60 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>

          {/* GUARANTEED WORKING IMAGE */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80vw',
            height: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}>
            {imageLoading && (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: '24px',
                zIndex: 1000000
              }}>
                Loading...
              </div>
            )}
            
            {imageError ? (
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                textAlign: 'center',
                fontSize: '20px',
                zIndex: 1000000
              }}>
                <div>Failed to load image</div>
                <div style={{ fontSize: '16px', marginTop: '10px' }}>Please try another image</div>
              </div>
            ) : (
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(images[currentIndex].image_url)}`}
                alt={`${activityName} image ${currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: '10px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                  display: imageLoading ? 'none' : 'block',
                  backgroundColor: 'white',
                  padding: '10px'
                }}
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
          </div>

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'fixed',
                  left: '16px',
                  top: '50vh',
                  transform: 'translateY(-50%)',
                  zIndex: 10000,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'fixed',
                  right: '16px',
                  top: '50vh',
                  transform: 'translateY(-50%)',
                  zIndex: 10000,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '9999px',
                  padding: '12px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image Info */}
          <div className="absolute bottom-4 left-4 right-4 z-60 bg-black bg-opacity-50 text-white p-4 rounded-lg">
            <div className="font-semibold text-lg">{activityName}</div>
            {images[currentIndex].alt_text && (
              <div className="text-gray-300 text-sm mt-1">{images[currentIndex].alt_text}</div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
