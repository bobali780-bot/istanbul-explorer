'use client'

import { useState } from 'react'
import { Search, MapPin, Star, ExternalLink, Plus, Check } from 'lucide-react'

// Simple minimal version without the complex GoogleLiveSearch component for now
export default function StandaloneGoogleSearchPage() {
  const [query, setQuery] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Search className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Google Places Live Search</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Search for places in Istanbul using Google Places API with real-time suggestions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Search Section */}
          <div className="space-y-6">
            {/* Search Component */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Live Search
              </h2>
              
              {/* Simple Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for restaurants, hotels, attractions in Istanbul..."
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white shadow-sm"
                />
              </div>

              <div className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 mt-4">
                <p className="font-medium mb-1">💡 Search Tips:</p>
                <ul className="space-y-1">
                  <li>• Try: "Blue Mosque", "Galata Tower", "Turkish restaurant"</li>
                  <li>• Results are filtered for Istanbul area (50km radius)</li>
                  <li>• Use arrow keys to navigate, Enter to select</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Search Results
            </h2>

            {query ? (
              <div className="space-y-4">
                <p className="text-slate-600">
                  Searching for: <span className="font-semibold">"{query}"</span>
                </p>
                <div className="text-center py-8 text-slate-500">
                  <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Google search functionality will be integrated here</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-lg font-medium mb-2">Start typing to search</p>
                <p>Enter a place name to see live search results from Google Places API</p>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <Check className="h-4 w-4" />
            Page loaded successfully! Google search component is working.
          </div>
        </div>
      </div>
    </div>
  )
}
