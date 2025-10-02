"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

interface UltraSimpleLightboxProps {
  images: any[]
  activityName: string
}

export default function UltraSimpleLightbox({ images, activityName }: UltraSimpleLightboxProps) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (!images || images.length === 0) {
    return null
  }

  const currentImage = images[index]

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.slice(0, 6).map((image, idx) => (
          <div
            key={idx}
            className="relative aspect-video cursor-pointer overflow-hidden rounded-lg border border-gray-200 hover:border-gray-400 transition-all hover:shadow-lg"
            onClick={() => {
              setIndex(idx)
              setOpen(true)
            }}
          >
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(image.image_url)}`}
              alt={`${activityName} - Image ${idx + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
              <div className="bg-white px-4 py-2 rounded-full opacity-0 hover:opacity-100 transition-opacity">
                <span className="text-sm font-semibold">View</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Simple Modal Lightbox */}
      {open && (
        <>
          <style jsx global>{`
            body {
              overflow: hidden !important;
            }
          `}</style>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: 0,
              padding: 0
            }}
            onClick={() => setOpen(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpen(false)}
              style={{
                position: 'fixed',
                top: '16px',
                right: '16px',
                zIndex: 10001,
                backgroundColor: 'white',
                color: 'black',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div
              style={{
                position: 'fixed',
                top: '16px',
                left: '16px',
                zIndex: 10001,
                backgroundColor: 'white',
                color: 'black',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 'bold'
              }}
            >
              {index + 1} / {images.length}
            </div>

            {/* Previous Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex((prev) => (prev - 1 + images.length) % images.length)
                }}
                style={{
                  position: 'fixed',
                  left: '16px',
                  top: '50vh',
                  transform: 'translateY(-50%)',
                  zIndex: 10001,
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '16px 20px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ←
              </button>
            )}

            {/* Next Button */}
            {images.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIndex((prev) => (prev + 1) % images.length)
                }}
                style={{
                  position: 'fixed',
                  right: '16px',
                  top: '50vh',
                  transform: 'translateY(-50%)',
                  zIndex: 10001,
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '16px 20px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                →
              </button>
            )}

            {/* Image */}
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(currentImage.image_url)}`}
              alt={`${activityName} - Image ${index + 1}`}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                objectFit: 'contain',
                display: 'block'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </>
      )}
    </>
  )
}
