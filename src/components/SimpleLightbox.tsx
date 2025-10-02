"use client"

import { useState } from "react"
import { X } from "lucide-react"
import type { ActivityImage } from "@/lib/supabase"

interface SimpleLightboxProps {
  images: ActivityImage[]
  activityName: string
}

export default function SimpleLightbox({ images, activityName }: SimpleLightboxProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return <div>No images available</div>
  }

  const openLightbox = (index: number) => {
    console.log('🎯 SimpleLightbox opening with index:', index)
    setCurrentIndex(index)
    setShowLightbox(true)
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={image.id}
            className="relative h-32 bg-gray-200 rounded cursor-pointer hover:opacity-80"
            onClick={() => openLightbox(index)}
          >
            <img
              src={image.image_url}
              alt={`Image ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>

      {/* Simple Lightbox */}
      {showLightbox && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: 'white',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              cursor: 'pointer',
              zIndex: 1000000
            }}
          >
            <X size={24} />
          </button>

          {/* Test Text - Always Visible */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'red',
              color: 'white',
              padding: '10px',
              fontSize: '16px',
              zIndex: 1000000
            }}
          >
            TEST: Image {currentIndex + 1} of {images.length}
          </div>

          {/* Image with Enhanced Debugging */}
          <div style={{ 
            width: '400px', 
            height: '300px', 
            backgroundColor: 'yellow', 
            border: '3px solid blue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <img
              src={`/api/proxy-image?url=${encodeURIComponent(images[currentIndex].image_url)}`}
              alt={`Image ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                border: '2px solid red'
              }}
              onLoad={(e) => {
                console.log('🎉 SUCCESS! Proxy image loaded!');
                console.log('📏 Dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                console.log('🔗 Proxy URL:', `/api/proxy-image?url=${encodeURIComponent(images[currentIndex].image_url)}`);
              }}
              onError={(e) => {
                console.error('💥 FAILED! Proxy image error');
                console.error('🔗 Proxy URL:', `/api/proxy-image?url=${encodeURIComponent(images[currentIndex].image_url)}`);
                console.error('📍 Original URL:', images[currentIndex].image_url);
              }}
            />
            <div style={{
              position: 'absolute',
              top: '5px',
              left: '5px',
              backgroundColor: 'red',
              color: 'white',
              padding: '2px 5px',
              fontSize: '10px'
            }}>
              YELLOW BOX = CONTAINER
            </div>
          </div>
          
          {/* Debug info */}
          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              backgroundColor: 'blue',
              color: 'white',
              padding: '10px',
              fontSize: '12px',
              maxWidth: '300px',
              wordBreak: 'break-all'
            }}
          >
            URL: {images[currentIndex].image_url.substring(0, 100)}...
          </div>
        </div>
      )}
    </>
  )
}
