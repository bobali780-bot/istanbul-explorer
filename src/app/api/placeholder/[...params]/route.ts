import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { params: string[] } }
) {
  try {
    // Parse dimensions from URL params (e.g., /api/placeholder/400/200)
    const dimensions = params.params
    if (!dimensions || dimensions.length < 2) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 })
    }

    const width = parseInt(dimensions[0])
    const height = parseInt(dimensions[1])

    if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
      return NextResponse.json({ error: 'Invalid dimensions' }, { status: 400 })
    }

    // Generate a simple SVG placeholder
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect x="0" y="0" width="100%" height="100%" fill="none" stroke="#d1d5db" stroke-width="2"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="#6b7280" text-anchor="middle" dy=".3em">
          ${width} × ${height}
        </text>
      </svg>
    `.trim()

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error('Error generating placeholder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
