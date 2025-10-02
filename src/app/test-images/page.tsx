"use client"

import { useEffect, useState } from "react"

export default function TestImagesPage() {
  const [imageData, setImageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch shopping data
        const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/shopping?slug=eq.galataport-istanbul`, {
          headers: {
            'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        })
        const shops = await response.json()

        if (shops && shops[0]) {
          const shop = shops[0]

          // Fetch media
          const mediaResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/universal_media?entity_type=eq.shop&entity_id=eq.${shop.id}&order=sort_order.asc`, {
            headers: {
              'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
            }
          })
          const media = await mediaResponse.json()

          setImageData({ shop, media })

          // Test each image URL
          if (media && media.length > 0) {
            const results = await Promise.all(
              media.slice(0, 3).map(async (img: any) => {
                try {
                  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(img.media_url)}`
                  const testResponse = await fetch(proxyUrl)
                  return {
                    id: img.id,
                    originalUrl: img.media_url,
                    proxyUrl,
                    status: testResponse.status,
                    contentType: testResponse.headers.get('content-type'),
                    success: testResponse.ok
                  }
                } catch (error) {
                  return {
                    id: img.id,
                    originalUrl: img.media_url,
                    error: String(error),
                    success: false
                  }
                }
              })
            )
            setTestResults(results)
          }
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Debugging Test</h1>

      {imageData && (
        <>
          <div className="mb-8 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold mb-2">Shop Data</h2>
            <p><strong>ID:</strong> {imageData.shop.id}</p>
            <p><strong>Name:</strong> {imageData.shop.name}</p>
            <p><strong>Slug:</strong> {imageData.shop.slug}</p>
          </div>

          <div className="mb-8 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-bold mb-2">Media Records</h2>
            <p><strong>Count:</strong> {imageData.media.length}</p>
            {imageData.media.slice(0, 3).map((img: any, idx: number) => (
              <div key={idx} className="mt-4 p-3 bg-white rounded border">
                <p className="text-sm"><strong>Media ID:</strong> {img.id}</p>
                <p className="text-sm break-all"><strong>URL:</strong> {img.media_url}</p>
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Proxy Test Results</h2>
            {testResults.map((result, idx) => (
              <div key={idx} className={`p-4 mb-4 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                <p className="font-bold">{result.success ? '✅ SUCCESS' : '❌ FAILED'}</p>
                <p className="text-sm mt-2"><strong>Status:</strong> {result.status}</p>
                <p className="text-sm"><strong>Content-Type:</strong> {result.contentType}</p>
                <p className="text-sm break-all"><strong>Original:</strong> {result.originalUrl}</p>
                {result.error && <p className="text-sm text-red-600"><strong>Error:</strong> {result.error}</p>}
              </div>
            ))}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Visual Test</h2>
            <p className="text-sm mb-4">If you see images below, the proxy works. If not, there's an issue.</p>
            <div className="grid grid-cols-3 gap-4">
              {imageData.media.slice(0, 3).map((img: any, idx: number) => (
                <div key={idx} className="border rounded p-2">
                  <p className="text-xs mb-2">Image {idx + 1}</p>
                  <img
                    src={`/api/proxy-image?url=${encodeURIComponent(img.media_url)}`}
                    alt={`Test ${idx}`}
                    className="w-full h-48 object-cover rounded"
                    onLoad={() => console.log(`✅ Image ${idx + 1} loaded`)}
                    onError={() => console.log(`❌ Image ${idx + 1} failed`)}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
