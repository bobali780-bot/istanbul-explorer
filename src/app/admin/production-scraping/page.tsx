"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  Loader2,
  Search,
  FileText,
  Zap,
  MapPin,
  Image,
  Clock,
  TrendingUp
} from "lucide-react"

export default function ProductionScrapingPage() {
  const [searchTerms, setSearchTerms] = useState('Blue Mosque\nHagia Sophia\nGalata Tower')
  const [category, setCategory] = useState('activities')
  const [imagesPerItem, setImagesPerItem] = useState(12)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  const startProductionScraping = async () => {
    const terms = searchTerms
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)

    if (terms.length === 0) {
      setError('Please enter at least one search term')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setProgress(0)

    try {
      const response = await fetch('/api/admin/scrape-production', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          searchTerms: terms,
          category: category,
          imagesPerItem: imagesPerItem
        }),
      })

      const data = await response.json()

      if (!data.success) {
        setError(data.error || 'Production scraping failed')
      } else {
        setResult(data)
        setProgress(100)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const estimatedCredits = searchTerms.split('\n').filter(line => line.trim()).length * 8

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Production Batch Scraping</h1>
        <p className="mt-2 text-gray-600">
          Scrape multiple activities from all major travel sites with full data extraction
        </p>
      </div>

      {/* Configuration */}
      <Tabs defaultValue="batch" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Batch Scraping
          </TabsTrigger>
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Quick Test (3 items)
          </TabsTrigger>
        </TabsList>

        {/* Batch Scraping */}
        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Batch Activity Scraping
              </CardTitle>
              <CardDescription>
                Enter multiple activities to scrape from TripAdvisor, GetYourGuide, Viator, and more
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Terms */}
              <div>
                <label className="text-sm font-medium mb-2 block">Activities to Scrape (one per line)</label>
                <Textarea
                  placeholder="Blue Mosque&#10;Hagia Sophia&#10;Galata Tower&#10;Topkapi Palace&#10;Grand Bazaar&#10;Bosphorus Cruise&#10;Dolmabahce Palace"
                  value={searchTerms}
                  onChange={(e) => setSearchTerms(e.target.value)}
                  rows={8}
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {searchTerms.split('\n').filter(line => line.trim()).length} activities •
                  ~{estimatedCredits} Firecrawl credits estimated
                </p>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    disabled={loading}
                  >
                    <option value="activities">Activities</option>
                    <option value="restaurants">Restaurants</option>
                    <option value="hotels">Hotels</option>
                    <option value="shopping">Shopping</option>
                    <option value="food_drink">Food & Drink</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Images per Item</label>
                  <Input
                    type="number"
                    min="5"
                    max="15"
                    value={imagesPerItem}
                    onChange={(e) => setImagesPerItem(parseInt(e.target.value))}
                    disabled={loading}
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={startProductionScraping}
                    disabled={loading || searchTerms.trim().length === 0}
                    className="w-full flex items-center gap-2"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    Start Batch Scraping
                  </Button>
                </div>
              </div>

              {/* What it scrapes */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Sources & Data Extracted:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
                  <div>
                    <strong>Sites Scraped:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>TripAdvisor (search + attractions)</li>
                      <li>GetYourGuide (search + categories)</li>
                      <li>Viator (search + destinations)</li>
                      <li>Booking.com (hotels)</li>
                      <li>OpenTable (restaurants)</li>
                      <li>Official tourism sites</li>
                    </ul>
                  </div>
                  <div>
                    <strong>Data Extracted:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Title, description, content</li>
                      <li>10-15 high-quality images</li>
                      <li>Price range, duration, ratings</li>
                      <li>Review counts, highlights</li>
                      <li>Source attribution</li>
                      <li>Confidence scoring</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quick Test */}
        <TabsContent value="quick" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Test (3 Popular Activities)
              </CardTitle>
              <CardDescription>
                Test the production scraper with 3 well-known Istanbul activities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium">Blue Mosque</div>
                  <div className="text-xs text-gray-500">Historic mosque</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium">Hagia Sophia</div>
                  <div className="text-xs text-gray-500">UNESCO site</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="font-medium">Galata Tower</div>
                  <div className="text-xs text-gray-500">360° views</div>
                </div>
              </div>

              <Button
                onClick={() => {
                  setSearchTerms('Blue Mosque\nHagia Sophia\nGalata Tower')
                  setCategory('activities')
                  setImagesPerItem(12)
                  startProductionScraping()
                }}
                disabled={loading}
                className="w-full flex items-center gap-2"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Start Quick Test (~24 credits)
              </Button>

              <p className="text-xs text-gray-500 text-center">
                This will test all major sources and extract full data for 3 activities
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Progress */}
      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Production scraping in progress...</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500">
                Scraping from multiple travel sites • This may take 2-5 minutes
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Production Scraping Complete!
                </CardTitle>
                <CardDescription>
                  Real data from major travel sites has been scraped and saved to staging
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {result.summary?.successful || 0}
                </div>
                <div className="text-sm text-blue-600">Successfully Scraped</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.summary?.credits_used || 0}
                </div>
                <div className="text-sm text-green-600">Credits Used</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {result.results?.reduce((total: number, r: any) => total + r.images_count, 0) || 0}
                </div>
                <div className="text-sm text-purple-600">Images Found</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {result.results?.reduce((total: number, r: any) => total + r.sources_used, 0) || 0}
                </div>
                <div className="text-sm text-orange-600">Sources Used</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {result.summary?.failed || 0}
                </div>
                <div className="text-sm text-red-600">Failed</div>
              </div>
            </div>

            {/* Results List */}
            {result.results && result.results.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Scraped Activities:</h3>
                {result.results.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{item.title}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Image className="h-3 w-3" />
                          {item.images_count} images
                        </div>
                        <div className="flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          {item.sources_used} sources
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={item.confidence_score >= 80 ? 'default' : 'secondary'}>
                        {item.confidence_score}% confidence
                      </Badge>
                      <Badge variant="outline">ID: {item.id}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Errors */}
            {result.summary?.errors && result.summary.errors.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-red-900">Errors:</h3>
                <div className="space-y-1">
                  {result.summary.errors.map((error: string, index: number) => (
                    <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {error}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600 mb-3">
                <strong>✅ Production scraping complete!</strong> Data saved to staging for review.
              </p>
              <div className="flex gap-3">
                <Button asChild>
                  <a href="/admin/staging" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Review in Staging
                  </a>
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Scrape More Items
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}