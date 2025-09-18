/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  images: {
    domains: ['koqqkpitepqwlfjymcje.supabase.co']
  }
}

module.exports = nextConfig
