'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CheckCircle, XCircle, Sparkles, Zap } from 'lucide-react'

export default function AIEnhancePage() {
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('shopping')
  const [limit, setLimit] = useState(5)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async (forceReenhance = false) => {
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const response = await fetch('/api/admin/ai-enhance-venues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, limit, forceReenhance })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance venues')
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
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              AI Content Enhancement
            </CardTitle>
            <CardDescription>
              Use Claude AI to automatically generate rich content for venues that are missing:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li><strong>Why Visit</strong> - 5 compelling reasons to visit</li>
                <li><strong>Accessibility</strong> - Wheelchair, stroller, kid-friendly info</li>
                <li><strong>Facilities</strong> - Toilets, cafe, parking, WiFi, tours, etc</li>
                <li><strong>Practical Info</strong> - Dress code, photography rules, etiquette</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Cost:</strong> Uses GPT-4o Mini (~$0.0003 per venue). Processing 80 venues ≈ $0.02
                </p>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                  disabled={loading}
                >
                  <option value="activities">Activities</option>
                  <option value="hotels">Hotels</option>
                  <option value="shopping">Shopping</option>
                  <option value="restaurants">Restaurants</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="limit">Number of venues</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  max="100"
                  value={limit}
                  onChange={(e) => setLimit(parseInt(e.target.value) || 5)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handleEnhance(false)}
                disabled={loading}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2" />
                    Enhance Empty Only
                  </>
                )}
              </Button>

              <Button
                onClick={() => handleEnhance(true)}
                disabled={loading}
                size="lg"
                variant="outline"
                className="border-2 border-orange-500 text-orange-600 hover:bg-orange-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Re-enhancing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2" />
                    Re-enhance All
                  </>
                )}
              </Button>
            </div>

            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Enhance Empty Only:</strong> Only processes venues missing content (recommended)</p>
              <p><strong>Re-enhance All:</strong> Overwrites ALL venues in category with fresh AI content</p>
            </div>

            {/* Loading State */}
            {loading && (
              <Alert>
                <Loader2 className="h-4 w-4 animate-spin" />
                <AlertDescription>
                  Claude AI is analyzing venues and generating content... This takes ~1 second per venue.
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
                    <strong>Enhancement completed!</strong>
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg capitalize">Results for {results.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">✅ Enhanced</span>
                        <span className="text-2xl font-bold text-green-600">{results.results.enhanced.length}</span>
                      </div>

                      {results.results.enhanced.length > 0 && (
                        <div className="mt-2">
                          <strong className="text-sm">Enhanced venues:</strong>
                          <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                            {results.results.enhanced.map((name: string, idx: number) => (
                              <li key={idx} className="text-green-700">{name}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {results.results.failed.length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <strong className="text-sm text-red-600">❌ Failed ({results.results.failed.length}):</strong>
                          <ul className="list-disc list-inside ml-4 mt-2 text-sm space-y-1">
                            {results.results.failed.map((error: string, idx: number) => (
                              <li key={idx} className="text-red-600">{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <div className="text-sm text-gray-600 text-center">
                  <p>💡 Tip: Process in batches of 5-10 to monitor quality, then scale up to process all venues</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
