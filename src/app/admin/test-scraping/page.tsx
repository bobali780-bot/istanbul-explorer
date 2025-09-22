"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Loader2, Search, Database } from "lucide-react"

export default function TestScrapingPage() {
  const [searchTerm, setSearchTerm] = useState('Blue Mosque')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const testScraping = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/admin/scrape-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerm: searchTerm.trim(),
          category: 'activities'
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Test scraping failed')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Phase 2: Test Firecrawl Integration</h1>
        <p className="mt-2 text-gray-600">
          Test scraping real Istanbul data with Firecrawl using your free tier credits
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test Single Activity Scraping
          </CardTitle>
          <CardDescription>
            Search for an Istanbul activity to test the Firecrawl integration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Blue Mosque, Hagia Sophia, Galata Tower"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && testScraping()}
              disabled={loading}
            />
            <Button
              onClick={testScraping}
              disabled={loading || !searchTerm.trim()}
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Test Scrape
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            <p><strong>What this test does:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Creates a scraping job in the database</li>
              <li>Tests Firecrawl API connection with your key</li>
              <li>Scrapes TripAdvisor search results for your term</li>
              <li>Extracts title, description, images, and content</li>
              <li>Saves the result to staging_queue for review</li>
              <li>Uses ~1 Firecrawl credit (safe for free tier testing)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Success Result */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Test Scraping Successful!
            </CardTitle>
            <CardDescription>
              Real Istanbul data has been scraped and saved to staging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Scraped Item Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.staging_item?.confidence_score || 0}%
                </div>
                <div className="text-sm text-blue-600">Confidence Score</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.staging_item?.images_found || 0}
                </div>
                <div className="text-sm text-green-600">Images Found</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {result.firecrawl_credits_used || 0}
                </div>
                <div className="text-sm text-purple-600">Credits Used</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {result.staging_item?.id || 0}
                </div>
                <div className="text-sm text-orange-600">Staging ID</div>
              </div>
            </div>

            {/* Scraped Item Details */}
            {result.staging_item && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Scraped Data:</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Title:</span>
                    <span className="text-gray-600">{result.staging_item.title}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Category:</span>
                    <Badge variant="secondary">{result.staging_item.category}</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">Quality Indicators:</span>
                    <div className="flex gap-2">
                      {result.staging_item.has_description && (
                        <Badge variant="default" className="text-xs">Has Description</Badge>
                      )}
                      {result.staging_item.has_location && (
                        <Badge variant="default" className="text-xs">Has Location</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>✅ Phase 2 Test Complete!</strong> Real data scraped successfully.
              </p>
              <p className="text-sm text-gray-600 mb-3">
                <strong>Next:</strong> {result.next_step}
              </p>

              {/* Quick Actions */}
              <div className="flex gap-3">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://supabase.com/dashboard`} target="_blank">
                    <Database className="h-4 w-4 mr-2" />
                    View in Supabase
                  </a>
                </Button>
                <Button size="sm" onClick={() => window.location.reload()}>
                  Test Another Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="text-orange-800">Before Testing</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-orange-700">
          <p className="mb-2">
            <strong>Make sure you have your Firecrawl API key:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Sign up at <a href="https://firecrawl.dev" target="_blank" className="underline">firecrawl.dev</a></li>
            <li>Get your API key from the dashboard</li>
            <li>Add it to your <code>.env.local</code> file: <code>FIRECRAWL_API_KEY=your_key_here</code></li>
            <li>Restart your dev server</li>
          </ol>
          <p className="mt-2 text-xs">
            Free tier: 500 credits/month. This test uses ~1 credit.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}