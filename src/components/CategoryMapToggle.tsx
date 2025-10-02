'use client'

import { useState } from 'react'
import { Map, X } from 'lucide-react'

interface CategoryMapToggleProps {
  activities: Array<{
    id: string
    title: string
    coordinates?: [number, number]
    neighborhood?: string
    rating?: number
  }>
}

export function CategoryMapToggle({ activities }: CategoryMapToggleProps) {
  const [isMapOpen, setIsMapOpen] = useState(false)

  // Filter activities that have valid coordinates
  const mappableActivities = activities.filter(activity => 
    activity.coordinates && 
    activity.coordinates.length === 2 &&
    !isNaN(activity.coordinates[0]) &&
    !isNaN(activity.coordinates[1])
  )

  if (mappableActivities.length === 0) {
    return null
  }

  return (
    <>
      {/* Map Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMapOpen(true)}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-3 text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Map className="h-5 w-5" />
          <span className="text-sm font-medium">View on Map</span>
        </button>
      </div>

      {/* Map Overlay */}
      {isMapOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
          <div className="flex h-full items-center justify-center p-4">
            <div className="relative h-[80vh] w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
              {/* Map Header */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Activities Map ({mappableActivities.length} locations)
                </h3>
                <button
                  onClick={() => setIsMapOpen(false)}
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Map Content */}
              <div className="h-[calc(80vh-80px)] p-4">
                <div className="flex h-full items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">🗺️</div>
                    <h4 className="mb-2 text-xl font-semibold text-gray-900">
                      Interactive Map Coming Soon
                    </h4>
                    <p className="text-gray-600">
                      This will show all {mappableActivities.length} activities on an interactive map
                    </p>
                    <div className="mt-4 space-y-2">
                      {mappableActivities.slice(0, 5).map((activity) => (
                        <div key={activity.id} className="flex items-center justify-center gap-2 text-sm text-gray-700">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span>{activity.title}</span>
                          {activity.rating && (
                            <span className="text-xs text-gray-500">
                              ⭐ {activity.rating.toFixed(1)}
                            </span>
                          )}
                        </div>
                      ))}
                      {mappableActivities.length > 5 && (
                        <p className="text-xs text-gray-500">
                          +{mappableActivities.length - 5} more locations
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

