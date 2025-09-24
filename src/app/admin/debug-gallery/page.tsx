'use client'

import { useState } from 'react'

// Hardcoded example image URLs from real staging database entries
const testImages = [
  // Wikimedia Commons images
  'https://upload.wikimedia.org/wikipedia/commons/1/1d/Blue_Mosque_Ceiling_Blue_Tiles.JPG',
  'https://upload.wikimedia.org/wikipedia/commons/6/6d/Sultan_Ahmed_Mosque%2528Blue_Mosque%2529%252C_Istanbul%252C_Turkey_%2528Ank_Kumar%2529_03.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Hagia_Sophia_Mars_2013.jpg/1200px-Hagia_Sophia_Mars_2013.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Galata_Tower_2021.jpg/800px-Galata_Tower_2021.jpg',

  // Google Places photo API examples
  'https://lh3.googleusercontent.com/places/ANXAkqGKvpfsCOClJxgxNKSoZ4BnY7NjB8YPnY5VM5qI0VwJ5oKK7fzp8VqzG1H9bN5_example',
  'https://lh3.googleusercontent.com/places/ANXAkqF2QQvP7M5Z9X5Zn4FcjBb8N9QzYwK1example',

  // Unsplash images
  'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',

  // Pexels images
  'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
]

interface ImageState {
  [key: number]: 'loading' | 'loaded' | 'error'
}

export default function DebugGalleryPage() {
  const [imageStates, setImageStates] = useState<ImageState>({})

  const handleImageLoad = (index: number) => {
    setImageStates(prev => ({ ...prev, [index]: 'loaded' }))
    console.log(`✅ Image ${index + 1} loaded successfully:`, testImages[index])
  }

  const handleImageError = (index: number) => {
    setImageStates(prev => ({ ...prev, [index]: 'error' }))
    console.error(`❌ Image ${index + 1} failed to load:`, testImages[index])
  }

  const handleImageStart = (index: number) => {
    setImageStates(prev => ({ ...prev, [index]: 'loading' }))
    console.log(`🔄 Loading image ${index + 1}:`, testImages[index])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Debug Gallery – Raw Image Test
          </h1>
          <p className="text-gray-600 mb-4">
            Testing {testImages.length} hardcoded image URLs from staging database using plain HTML img tags (no Next.js optimization).
          </p>
          <div className="text-sm text-gray-500">
            <p>✅ = Image loaded successfully</p>
            <p>❌ = Image failed to load</p>
            <p>🔄 = Image loading</p>
          </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testImages.map((imageUrl, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Image Header */}
              <div className="px-4 py-2 bg-gray-100 border-b">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Image {index + 1}
                  </span>
                  <span className="text-xs">
                    {imageStates[index] === 'loaded' && '✅'}
                    {imageStates[index] === 'error' && '❌'}
                    {imageStates[index] === 'loading' && '🔄'}
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {new URL(imageUrl).hostname}
                </div>
              </div>

              {/* Image Container */}
              <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center">
                {imageStates[index] === 'error' ? (
                  // Error Fallback
                  <div className="text-center p-4">
                    <div className="text-gray-400 mb-2">❌</div>
                    <div className="text-sm text-gray-600">Image failed to load</div>
                    <div className="text-xs text-gray-400 mt-1">Check console for details</div>
                  </div>
                ) : (
                  // Image Element
                  <img
                    src={imageUrl}
                    alt={`Test image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoadStart={() => handleImageStart(index)}
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />
                )}
              </div>

              {/* Image Info */}
              <div className="px-4 py-2 bg-gray-50 border-t">
                <div className="text-xs text-gray-600 break-all">
                  {imageUrl}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Total Images:</strong> {testImages.length}
            </div>
            <div>
              <strong>Loaded:</strong> {Object.values(imageStates).filter(state => state === 'loaded').length}
            </div>
            <div>
              <strong>Failed:</strong> {Object.values(imageStates).filter(state => state === 'error').length}
            </div>
            <div>
              <strong>Loading:</strong> {Object.values(imageStates).filter(state => state === 'loading').length}
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p>Open browser console to see detailed loading logs for each image.</p>
            <p>This page uses plain HTML img tags to bypass Next.js image optimization.</p>
          </div>
        </div>
      </div>
    </div>
  )
}