"use client"

import { useState } from "react"
import type { ActivityImage } from "@/lib/supabase"

interface WorkingLightboxProps {
  images: ActivityImage[]
  activityName: string
}

export default function WorkingLightbox({ images, activityName }: WorkingLightboxProps) {
  const [showLightbox, setShowLightbox] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!images || images.length === 0) {
    return <div>No images available</div>
  }

  return (
    <>
      {/* Simple Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
        {images.slice(0, 4).map((image, index) => (
          <div
            key={image.id}
            style={{
              height: '150px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => {
              console.log('🎯 Opening lightbox for image:', index)
              setCurrentIndex(index)
              setShowLightbox(true)
            }}
          >
            <img
              src={image.image_url}
              alt={`Thumbnail ${index + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>

      {/* WORKING LIGHTBOX */}
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
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowLightbox(false)}
        >
          {/* MASSIVE VISIBLE INDICATOR */}
          <div style={{
            position: 'absolute',
            top: '50px',
            left: '50px',
            backgroundColor: 'red',
            color: 'white',
            padding: '20px',
            fontSize: '24px',
            fontWeight: 'bold',
            border: '5px solid yellow',
            zIndex: 1000000
          }}>
            🎉 LIGHTBOX IS WORKING! 🎉
          </div>

          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowLightbox(false)
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              fontSize: '16px',
              cursor: 'pointer',
              zIndex: 1000000
            }}
          >
            CLOSE
          </button>

          {/* SIMPLE TEST CONTAINER */}
          <div style={{
            width: '800px',
            height: '600px',
            backgroundColor: 'yellow',
            border: '20px solid red',
            position: 'absolute',
            top: '100px',
            left: '100px',
            zIndex: 1000001
          }}>
            <div style={{
              fontSize: '48px',
              color: 'black',
              textAlign: 'center',
              marginTop: '50px',
              fontWeight: 'bold'
            }}>
              BIG YELLOW BOX
            </div>
            
            <div style={{
              fontSize: '24px',
              color: 'black',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              If you see this, containers work!
            </div>
            
            <div style={{
              width: '400px',
              height: '200px',
              backgroundColor: 'blue',
              margin: '20px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              BLUE BOX INSIDE YELLOW
            </div>
            
            {/* TEST IMAGE */}
            <div style={{
              width: '600px',
              height: '300px',
              backgroundColor: 'white',
              margin: '20px auto',
              border: '5px solid green',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'absolute',
                top: '5px',
                left: '5px',
                backgroundColor: 'red',
                color: 'white',
                padding: '3px',
                fontSize: '12px'
              }}>
                IMAGE CONTAINER
              </div>
              
              <img
                src={`/api/proxy-image?url=${encodeURIComponent(images[currentIndex].image_url)}`}
                alt={`Test image ${currentIndex + 1}`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onLoad={() => {
                  console.log('🎉 SUCCESS! Image loaded in lightbox!')
                  console.log('📸 Image URL:', images[currentIndex].image_url)
                }}
                onError={() => {
                  console.error('❌ Image failed to load')
                  console.error('📸 Image URL:', images[currentIndex].image_url)
                }}
              />
            </div>
          </div>

          {/* Navigation */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
              }}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              ← Previous
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setCurrentIndex((prev) => (prev + 1) % images.length)
              }}
              style={{
                backgroundColor: 'blue',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </>
  )
}
