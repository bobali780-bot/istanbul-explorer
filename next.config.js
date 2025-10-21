/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  
  // ⚡ Performance Optimization: Image Configuration
  // Use modern AVIF and WebP formats for better compression
  // Optimized device sizes for responsive images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [480, 768, 1080, 1366, 1920],
    imageSizes: [16, 32, 64, 128, 256, 384],
    remotePatterns: [
      // Supabase storage
      {
        protocol: "https",
        hostname: "koqqkpitepqwlfjymcje.supabase.co",
      },
      // Unsplash
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "*.unsplash.com",
      },
      // Pexels
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "*.pexels.com",
      },
      // Google Places and Maps
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh4.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh5.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "maps.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "streetviewpixels-pa.googleapis.com",
      },
      // Wikimedia Commons and Wikipedia
      {
        protocol: "https",
        hostname: "commons.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "*.wikimedia.org",
      },
      {
        protocol: "https",
        hostname: "en.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "tr.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "fr.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "de.wikipedia.org",
      },
      {
        protocol: "https",
        hostname: "*.wikipedia.org",
      },
      // Future-proof affiliate partner domains
      // Expedia Group
      {
        protocol: "https",
        hostname: "*.expedia.com",
      },
      {
        protocol: "https",
        hostname: "*.hotels.com",
      },
      {
        protocol: "https",
        hostname: "*.vrbo.com",
      },
      {
        protocol: "https",
        hostname: "images.trvl-media.com",
      },
      // Booking.com
      {
        protocol: "https",
        hostname: "*.booking.com",
      },
      {
        protocol: "https",
        hostname: "cf.bstatic.com",
      },
      {
        protocol: "https",
        hostname: "r-xx.bstatic.com",
      },
      // Airbnb
      {
        protocol: "https",
        hostname: "*.airbnb.com",
      },
      {
        protocol: "https",
        hostname: "a0.muscache.com",
      },
      // GetYourGuide
      {
        protocol: "https",
        hostname: "*.getyourguide.com",
      },
      {
        protocol: "https",
        hostname: "cdn.getyourguide.com",
      },
      // Viator/TripAdvisor
      {
        protocol: "https",
        hostname: "*.viator.com",
      },
      {
        protocol: "https",
        hostname: "*.tripadvisor.com",
      },
      {
        protocol: "https",
        hostname: "media-cdn.tripadvisor.com",
      }
    ],
  },
  
  // ⚡ Performance Optimization: Aggressive caching for static assets
  // Immutable cache headers for Next.js static files and optimized images
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ],
      },
    ]
  }
}

module.exports = nextConfig
