"use client"

import { useState } from "react"
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
    setCurrentImageIndex(index)
    setShowLightbox(true)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center p-4">
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
            <div className="relative max-w-5xl max-h-full">
              <Image
                src={images[currentImageIndex].image_url}
                alt={images[currentImageIndex].alt_text || `${activityName} image ${currentImageIndex + 1}`}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] w-auto"
                unoptimized
              />
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
                  <Image
                    src={image.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
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