"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { MapErrorBoundary } from "@/components/MapErrorBoundary"

// Dynamic import with SSR disabled to prevent hydration issues
const Map = dynamic(() => import("react-map-gl/mapbox").then(mod => mod.default), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-500 mb-2">Loading Map...</div>
        <div className="text-sm text-gray-400">Mapbox is initializing</div>
      </div>
    </div>
  )
})

const Marker = dynamic(() => import("react-map-gl/mapbox").then(mod => mod.Marker), {
  ssr: false
})

const Popup = dynamic(() => import("react-map-gl/mapbox").then(mod => mod.Popup), {
  ssr: false
})

interface TestPin {
  id: string
  name: string
  latitude: number
  longitude: number
  description: string
}

export default function MapTestPage() {
  const [selectedPin, setSelectedPin] = useState<TestPin | null>(null)
  const [viewState, setViewState] = useState({
    longitude: 28.9784, // Istanbul center
    latitude: 41.0082,
    zoom: 12
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  // Exactly one test pin
  const testPin: TestPin = {
    id: "hs",
    name: "Hagia Sophia",
    latitude: 41.0082,
    longitude: 28.9784,
    description: "Test pin"
  }

  useEffect(() => {
    console.log("/map-test ready")
  }, [])

  // Show fallback if Mapbox token is missing
  if (!mapboxToken) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Map Test Page</h1>
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-96 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-gray-500 mb-4">
                  <div className="text-lg font-medium mb-2">Mapbox Token Missing</div>
                  <div className="text-sm text-gray-400">
                    Please add NEXT_PUBLIC_MAPBOX_TOKEN to your environment variables
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Get your free token at: <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">mapbox.com</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Map Test Page</h1>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>Click the Hagia Sophia 📍 pin below</li>
              <li>Check browser console for debug logs</li>
              <li>Map should remain interactive (no white screen)</li>
              <li>Popup should open with pin details</li>
            </ul>
          </div>
          
          <MapErrorBoundary>
            <div className="w-full h-96 rounded-lg overflow-hidden border">
              <Map
                {...viewState}
                onMove={evt => setViewState(evt.viewState)}
                onClick={() => {
                  console.log("Closing popup")
                  setSelectedPin(null)
                }}
                mapboxAccessToken={mapboxToken}
                style={{ width: "100%", height: "100%" }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
              >
                <Marker 
                  latitude={testPin.latitude} 
                  longitude={testPin.longitude}
                >
                  <span 
                    className="text-3xl cursor-pointer z-50 hover:scale-110 transition-transform"
                    onClick={(e) => {
                      e.stopPropagation()
                      console.log("Clicked pin:", testPin.name)
                      console.log("Opening popup for:", testPin.name)
                      setSelectedPin(testPin)
                    }}
                    style={{ zIndex: 1000 }}
                  >
                    📍
                  </span>
                </Marker>

                {selectedPin &&
                 typeof selectedPin.latitude === "number" &&
                 typeof selectedPin.longitude === "number" &&
                 !Number.isNaN(selectedPin.latitude) &&
                 !Number.isNaN(selectedPin.longitude) && (
                  <Popup
                    latitude={selectedPin.latitude}
                    longitude={selectedPin.longitude}
                    onClose={() => {
                      console.log("Closing popup")
                      setSelectedPin(null)
                    }}
                    closeButton={true}
                    closeOnClick={false}
                    anchor="bottom"
                    offset={[0, -10]}
                  >
                    <div className="bg-white p-4 rounded-lg shadow-lg max-w-xs">
                      <h4 className="font-bold text-sm mb-2">
                        {selectedPin.name}
                      </h4>
                      <p className="text-xs text-gray-600 mb-3">
                        {selectedPin.description}
                      </p>
                      <a 
                        href="https://example.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded text-sm font-medium transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('CTA clicked for:', selectedPin.name)
                        }}
                      >
                        Book Now
                      </a>
                    </div>
                  </Popup>
                )}
              </Map>
            </div>
          </MapErrorBoundary>
          
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-4">Console logs should show:</p>
            <div className="bg-gray-100 p-4 rounded-lg text-left text-sm font-mono">
              <div>/map-test ready</div>
              <div>Clicked pin: Hagia Sophia</div>
              <div>Opening popup for: Hagia Sophia</div>
              <div>Closing popup</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
