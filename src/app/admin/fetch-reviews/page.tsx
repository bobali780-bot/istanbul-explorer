'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function FetchReviewsPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchReviewsForCategory = async (category: string) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/admin/bulk-fetch-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch reviews')
      }

      setResults(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Fetch Google Reviews</CardTitle>
            <CardDescription>
              Automatically find Google Place IDs and fetch reviews for all venues in each category.
              This will:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Search for each venue on Google Places</li>
                <li>Save the Place ID to your database</li>
                <li>Fetch up to 5 reviews per venue</li>
                <li>Store reviews in universal_reviews table</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Buttons */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                onClick={() => fetchReviewsForCategory('shopping')}
                disabled={loading}
                className="h-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Shopping'}
              </Button>
              <Button
                onClick={() => fetchReviewsForCategory('restaurants')}
                disabled={loading}
                className="h-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Restaurants'}
              </Button>
              <Button
                onClick={() => fetchReviewsForCategory('hotels')}
                disabled={loading}
                className="h-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Hotels'}
              </Button>
              <Button
                onClick={() => fetchReviewsForCategory('activities')}
                disabled={loading}
                className="h-20"
              >
                {loading ? <Loader2 className="animate-spin" /> : 'Activities'}
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Processing venues... This may take a few minutes depending on the number of venues.
                </AlertDescription>
              </Alert>
            )}

            {/* Error State */}
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {results && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-semibold">Success! Results for {results.category}:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Total venues: {results.results.total}</li>
                      <li>Processed: {results.results.processed}</li>
                      <li>New Place IDs found: {results.results.placeIdsFound}</li>
                      <li>Total reviews fetched: {results.results.reviewsFetched}</li>
                      {results.results.errors.length > 0 && (
                        <li className="text-red-600">
                          Errors: {results.results.errors.length}
                          <ul className="ml-4 mt-1">
                            {results.results.errors.slice(0, 5).map((err: any, idx: number) => (
                              <li key={idx} className="text-sm">
                                {err.venueName}: {err.error}
                              </li>
                            ))}
                            {results.results.errors.length > 5 && (
                              <li className="text-sm">...and {results.results.errors.length - 5} more</li>
                            )}
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Instructions */}
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Note:</strong> Click a category button to start fetching reviews.</p>
              <p><strong>Rate Limits:</strong> The process includes delays to respect Google's API rate limits.</p>
              <p><strong>Cost:</strong> Text Search API calls may incur costs. Check your Google Cloud Console for pricing.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
