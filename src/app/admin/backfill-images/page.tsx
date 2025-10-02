'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Images } from 'lucide-react'

export default function BackfillImagesPage() {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBackfill = async () => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/admin/backfill-images', {
        method: 'POST'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to backfill images')
      }

      setResults(data.results)
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
            <CardTitle className="flex items-center gap-2">
              <Images className="w-6 h-6" />
              Backfill Images from Staging
            </CardTitle>
            <CardDescription>
              This will find all venues with fewer than 10 images and copy the full image set from their staging queue entries.
              <br /><br />
              <strong>What it does:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Checks all published venues (activities, hotels, shopping, restaurants)</li>
                <li>For venues with &lt;10 images, finds matching staging entry</li>
                <li>Replaces images with full set from staging (15+ images)</li>
                <li>Preserves image order and sets primary image</li>
              </ul>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action Button */}
            <Button
              onClick={handleBackfill}
              disabled={loading}
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Images className="mr-2" />
                  Start Image Backfill
                </>
              )}
            </Button>

            {/* Loading State */}
            {loading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Processing all categories... This may take a few minutes.
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
              <div className="space-y-4">
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Backfill completed!</strong>
                  </AlertDescription>
                </Alert>

                {Object.entries(results).map(([category, result]: [string, any]) => (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="text-lg capitalize">{category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Total venues:</strong> {result.total}</p>
                        <p><strong>Updated:</strong> {result.updated}</p>

                        {result.items_updated.length > 0 && (
                          <div className="mt-4">
                            <strong>Updated venues:</strong>
                            <ul className="list-disc list-inside ml-4 mt-2 text-sm">
                              {result.items_updated.map((item: string, idx: number) => (
                                <li key={idx} className="text-green-700">{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {result.errors && result.errors.length > 0 && (
                          <div className="mt-4">
                            <strong className="text-red-600">Errors:</strong>
                            <ul className="list-disc list-inside ml-4 mt-2 text-sm">
                              {result.errors.map((error: string, idx: number) => (
                                <li key={idx} className="text-red-600">{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
