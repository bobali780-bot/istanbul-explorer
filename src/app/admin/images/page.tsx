"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function ImageAdminPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [selectedImages, setSelectedImages] = useState<{ [key: string]: string[] }>({})

  const activities = [
    { id: 1, name: 'Hagia Sophia', slug: 'hagia-sophia-tour' },
    { id: 2, name: 'Blue Mosque', slug: 'blue-mosque-visit' },
    { id: 3, name: 'Topkapi Palace', slug: 'topkapi-palace-tour' },
    { id: 4, name: 'Grand Bazaar', slug: 'grand-bazaar-shopping-tour' },
    { id: 5, name: 'Bosphorus Cruise', slug: 'bosphorus-cruise' },
    { id: 6, name: 'Galata Tower', slug: 'galata-tower-visit' },
    { id: 7, name: 'Basilica Cistern', slug: 'basilica-cistern-visit' },
    { id: 8, name: 'Spice Bazaar', slug: 'spice-bazaar-food-tour' },
    { id: 9, name: 'Turkish Hammam', slug: 'turkish-hammam-experience' },
    { id: 10, name: 'Dolmabahce Palace', slug: 'dolmabahce-palace-tour' }
  ]

  const scrapeActivity = async (activityName: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/scrape-activity-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityName,
          searchSites: [
            'https://www.booking.com',
            'https://www.tripadvisor.com'
          ]
        })
      })

      const result = await response.json()
      if (result.success) {
        setResults(prev => [...prev, result])
      } else {
        alert(`Error scraping ${activityName}: ${result.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert(`Failed to scrape ${activityName}`)
    } finally {
      setLoading(false)
    }
  }

  const scrapeAllActivities = async () => {
    setLoading(true)
    setResults([])

    try {
      const response = await fetch('/api/scrape-activity-images')
      const result = await response.json()

      if (result.success) {
        setResults(result.results)
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to scrape activities')
    } finally {
      setLoading(false)
    }
  }

  const selectImage = (activityName: string, imageUrl: string) => {
    setSelectedImages(prev => ({
      ...prev,
      [activityName]: [...(prev[activityName] || []), imageUrl].slice(0, 5) // Max 5 images per activity
    }))
  }

  const updateDatabase = async () => {
    // This would update your Supabase database with selected images
    console.log('Selected images:', selectedImages)
    alert('Feature coming soon: Update database with selected images')
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Activity Image Manager</h1>
        <p className="text-gray-600 mb-6">
          Scrape real images from travel sites for your Istanbul activities
        </p>

        <div className="flex gap-4 mb-6">
          <Button onClick={scrapeAllActivities} disabled={loading} size="lg">
            {loading ? 'Scraping...' : 'Scrape All Activities'}
          </Button>

          {Object.keys(selectedImages).length > 0 && (
            <Button onClick={updateDatabase} variant="outline" size="lg">
              Update Database ({Object.values(selectedImages).flat().length} images)
            </Button>
          )}
        </div>
      </div>

      {/* Individual Activity Scraping */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {activities.map(activity => (
          <Card key={activity.id}>
            <CardHeader>
              <CardTitle className="text-lg">{activity.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => scrapeActivity(activity.name)}
                disabled={loading}
                className="w-full"
              >
                Scrape Images
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Scraped Images</h2>

          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{result.activityName}</CardTitle>
                <CardDescription>
                  Found {result.totalImages} images from {result.scrapedData.length} sites
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.scrapedData.map((siteData: any, siteIndex: number) => (
                  <div key={siteIndex} className="mb-6">
                    <h3 className="font-semibold mb-3">{siteData.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {siteData.images.map((imageUrl: string, imgIndex: number) => (
                        <div key={imgIndex} className="relative group">
                          <div className="relative h-32 overflow-hidden rounded-lg border">
                            <Image
                              src={imageUrl}
                              alt={`${result.activityName} ${imgIndex + 1}`}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                          <Button
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                            onClick={() => selectImage(result.activityName, imageUrl)}
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Images Preview */}
      {Object.keys(selectedImages).length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Selected Images Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.entries(selectedImages).map(([activityName, images]) => (
              <div key={activityName} className="mb-4">
                <h3 className="font-semibold mb-2">{activityName} ({images.length} images)</h3>
                <div className="grid grid-cols-5 gap-2">
                  {images.map((imageUrl, index) => (
                    <div key={index} className="relative h-20 overflow-hidden rounded border">
                      <Image
                        src={imageUrl}
                        alt={`Selected ${activityName} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}