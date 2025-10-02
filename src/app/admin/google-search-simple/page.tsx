'use client'

export default function SimpleGoogleSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Google Search Test</h1>
        <p>This is a simplified version to test if the page loads correctly.</p>
        <div className="mt-6 p-4 bg-white rounded-lg shadow">
          <p>If you can see this, the page structure is working!</p>
        </div>
      </div>
    </div>
  )
}
